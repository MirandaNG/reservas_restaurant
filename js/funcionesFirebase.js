import db from "./firebaseConfig.js";
import { addDoc, collection, where, query, getDocs} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

//nota es importante instalar firebase en la raiz del proyecto
//npm install firebase

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

    addDoc(reservasCollection, { //agrega documento para la reserva
        nombre: nombre,
        fecha: fecha,
        hora: hora,
        mesa: mesa,
        propietario: id
    })
    .then(() => {
        
        alert("Reserva registrada correctamente");
        //window.location.href = "login.html"; 
    }
    )
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

//esta funcion esta pendiente
export async function mostrarReservas()
{
    const reservasCollection = await collection(db, "reservas");
    const consultaReservas = await getDocs(reservasCollection);
    const reservas = consultaReservas.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    console.log(reservas);
}