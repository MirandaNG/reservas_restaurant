import { db, storage } from "../js/firebaseConfig.js";
import { addDoc, collection, where, query, getDocs, doc, updateDoc, getDoc} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";
//nota es importante instalar firebase en la raiz del proyecto
//npm install firebase


export function cerrarModal() 
{
     document.getElementById("modal-editar").classList.remove("activo");
    mostrarReservas();
} 

//esta funcion es para usuarios, hace falta la de administradores
export async function registrarse()
{
    //validamos los campos
    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const telefono = document.getElementById("telefono").value;
    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("contrasena").value;

    //la funcion trim elimina los espacios en blanco al principio y al final de la cadena
    //validamos que los campos no esten vacios
    //si alguno de los campos esta vacio se muestra un mensaje de alerta
    if (!nombre || !correo || !telefono || !usuario || !contrasena) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    //aqui ira codigo para guardar los datos en firebase

    // Guardar los datos en Firebase
    const usuariosCollection = await collection(db, "usuarios");

    //consultamos si ya hay un usuario con ese nombre de usuario
    const consultaUsuario = await query(usuariosCollection,
        where("usuario", "==", usuario),
    );

    const usuarioOcupado = await getDocs(consultaUsuario);

    if(!usuarioOcupado.empty) //si ya existe pedimos que ingrese otro
    {
        alert("El usuario ingresado ya esta en uso, intenta de nuevo");
        return;
    }


    addDoc(usuariosCollection, { //agrega documento para el usuario
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        usuario: usuario,
        contrasena: contrasena
    })
    .then(() => {
        console.log("Usuario registrado correctamente");
        alert("Usuario registrado correctamente");
        window.location.href = "login.html"; 
    }
    )
    .catch((error) => {
        console.error("Error al registrar el usuario: ", error);
    });
}

export async function iniciarSesion()
{
    const usuario = document.getElementById("usuario").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();

    //la funcion trim elimina los espacios en blanco al principio y al final de la cadena
    //validamos que los campos no esten vacios
    //si alguno de los campos esta vacio se muestra un mensaje de alerta
    if ( !usuario || !contrasena) {
        alert("Por favor, completa todos los campos.");
        return;
    }
    
    //buscamos coincidencias con el correo y contraseña
    const usuariosCollection = collection(db, "usuarios");
    const consulta = await query(usuariosCollection,
        where("usuario", "==", usuario),
        where("contrasena", "==", contrasena)
    );

    const consultaUsuario = await getDocs(consulta);

    if(consultaUsuario.empty)
    {
        alert("Usuario o contraseña incorrecta");  //si no encuentra coincidencias
        return;
    }
    else
    {
        const usuarioDoc = consultaUsuario.docs[0];
        alert("Bienvenido " + usuario);
        localStorage.setItem("usuarioId", usuarioDoc.id);
        alert("ID del usuario guardado en localStorage: " + usuarioDoc.id);
        window.location.href = "reservar.html";
        return;
    }
}

export async function reservar()
{
    const nombre = document.getElementById("nombre").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const mesa = document.getElementById("mesa").value;
    const id = localStorage.getItem("usuarioId");

    if (!nombre || !fecha || !hora || !mesa) 
    {
        alert("Por favor completa todos los campos.");
        return;
    }

    const fechaHoraSeleccionada = new Date(`${fecha}T${hora}`);
    const fechaHoraActual = new Date();

    if(fechaHoraSeleccionada <= fechaHoraActual)
    {
        alert("La fecha y hora deben ser posteriores a la actual.");
        return;
    }

    //guardar en firestore
    const reservasCollection = collection(db, "reservas");

    //verificamos que la fecha y hora este libre, tambien la mesa

    const consultaHorario = await query(reservasCollection,
        where("fecha", "==", fecha),
        where("hora", "==", hora)
    );

    const consultaMesa = await query(reservasCollection, 
        where("mesa", "==", mesa)
    );

    const fechaDisponible = await getDocs(consultaHorario);
    const mesaDisponible = await getDocs(consultaMesa);

    if(!fechaDisponible.empty && !mesaDisponible.empty)
    {
        alert("La fecha/hora o mesa seleccionada esta ocupada");  //si no encuentra coincidencias
        return;
    }

    addDoc(reservasCollection, { 
    nombre: nombre,
    fecha: fecha,
    hora: hora,
    mesa: mesa,
    propietario: id
})
.then((docRef) => {
    alert("Reserva registrada correctamente");
    window.location.href = `boleto.html?id=${docRef.id}`;
})
.catch((error) => {
    console.error("Error al registrar el usuario: ", error);
});

    const consulta = await query(reservasCollection,
        where("propietario", "==", id)
    );

    //consultamos la reservación en la base de datos
    const consultaReservacion = await getDocs(consulta);
    const reservacionDoc = consultaReservacion.docs[0];
    const reservacionData = reservacionDoc.data();
    console.log("Reserva registrada correctamente", reservacionData);


}

export async function filtrarReservas()
{
    const input = document.getElementById("buscador").value;
    const tabla = document.getElementById("tabla-reservas");
    tabla.innerHTML = "";

    try {

        const reservasCollection = await collection(db, "reservas");
        const consultaReservas = await getDocs(reservasCollection);
        const reservas = consultaReservas.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const reservasFiltradas = reservas.filter(reserva =>
            reserva.nombre.toLowerCase().includes(input)
          );

        reservasFiltradas.forEach(reserva => {
            const fila = document.createElement("tr");
          
            fila.innerHTML = `
              <td>${reserva.nombre}</td>
              <td>${reserva.mesa}</td>
              <td>${reserva.fecha}</td>
              <td>${reserva.hora}</td>
              <td><button class="btn-editar"onclick="abrirModal('${reserva.id}')">Editar</button></td>
            `;
          
            tabla.appendChild(fila);
          });

        
    } catch (error) {
        alert('Error al mostrar la tabla');
    }

}

export async function mostrarReservas()
{
    const tabla = document.getElementById("tabla-reservas");
    tabla.innerHTML = "";

    try {

        const reservasCollection = await collection(db, "reservas");
        const consultaReservas = await getDocs(reservasCollection);
        const reservas = consultaReservas.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        reservas.forEach(reserva => {
            const fila = document.createElement("tr");
          
            fila.innerHTML = `
              <td>${reserva.nombre}</td>
              <td>${reserva.mesa}</td>
              <td>${reserva.fecha}</td>
              <td>${reserva.hora}</td>
              <td><button class="btn-editar"onclick="abrirModal('${reserva.id}')">Editar</button></td>
            `;
          
            tabla.appendChild(fila);
        });

        
    } catch (error) {
        alert('Error al mostrar la tabla');
    }
}

export async function editarReserva(id)
{
    try {
        localStorage.setItem("reservaId", id);
        const reservasCollection = await collection(db, "reservas");
        const consultaReservas = await getDocs(reservasCollection);
        const reservas = consultaReservas.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const reservasFiltradas = reservas.filter(reserva =>
            reserva.id.toLowerCase() === id.toLowerCase()
        );

        reservasFiltradas.forEach(reserva => {
            document.getElementById("nombre").value = reserva.nombre;
            document.getElementById("mesa").value = reserva.mesa;
            document.getElementById("fecha").value = reserva.fecha;
            document.getElementById("hora").value = reserva.hora;
        });

    } catch (error) {
        alert("no se pudieron obtener los datos de la reservacion");
    }
}

export async function actualizarReserva() 
{
    const nombre = document.getElementById("nombre").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const mesa = document.getElementById("mesa").value;
    const idReserva = localStorage.getItem("reservaId");
  
    if (!nombre || !fecha || !hora || !mesa) {
      alert("Por favor completa todos los campos.");
      return;
    }
  
    const fechaHoraSeleccionada = new Date(`${fecha}T${hora}`);
    const fechaHoraActual = new Date();
  
    if (fechaHoraSeleccionada <= fechaHoraActual) {
      alert("La fecha y hora deben ser posteriores a la actual.");
      return;
    }
  
    try {
      const reservaRef = doc(db, "reservas", idReserva);
      const reservaSnap = await getDoc(reservaRef);
  
      if (!reservaSnap.exists()) {
        alert("No se encontró ninguna reserva con ese ID.");
        return;
      }
  
      // Verificar si otra reserva ya ocupa esa mesa en la misma fecha y hora
      const reservasCollection = collection(db, "reservas");
  
      const consultaConflicto = query(
        reservasCollection,
        where("fecha", "==", fecha),
        where("hora", "==", hora),
        where("mesa", "==", mesa)
      );
  
      const reservasConflicto = await getDocs(consultaConflicto);
  
      // Verificamos que el conflicto no sea la misma reserva que se está editando
      const conflicto = reservasConflicto.docs.find(doc => doc.id !== idReserva);
  
      if (conflicto) {
        alert("Ya hay una reserva con esa mesa, fecha y hora.");
        return;
      }
  
      // Actualizar la reserva
      await updateDoc(reservaRef, {
        nombre,
        fecha,
        hora,
        mesa
      });
  
      alert("Reserva actualizada con éxito.");
      cerrarModal();
  
    } catch (error) {
      console.error("Error al actualizar la reserva:", error);
      alert("Hubo un error al actualizar la reserva.");
    }
  }

export async function obtenerBebidas() {
    const bebidasCollection = collection(db, "bebidas");
    const consulta = await getDocs(bebidasCollection);
    const bebidas = consulta.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    return bebidas;
}

export async function subirImagen(file) {
    const storage = getStorage();
    const storageRef = ref(storage, `bebidas/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
}

export async function actualizarBebida(id, nuevosDatos) {
    const bebidaRef = doc(db, "bebidas", id);
    await updateDoc(bebidaRef, nuevosDatos);
}
export async function agregarBebida(datos) {
    const bebidasCollection = collection(db, "bebidas");
    await addDoc(bebidasCollection, datos);
}

export async function agregarAdmin(admin) {
    const adminsCollection = collection(db, "admins");
    await addDoc(adminsCollection, admin);
}

export async function obtenerAdmins() {
    const adminsCollection = collection(db, "admins");
    const consulta = await getDocs(adminsCollection);
    return consulta.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function actualizarAdmin(id, admin) {
    const adminRef = doc(db, "admins", id);
    await updateDoc(adminRef, admin);
}

export async function eliminarAdmin(id) {
    const adminRef = doc(db, "admins", id);
    await deleteDoc(adminRef);
}