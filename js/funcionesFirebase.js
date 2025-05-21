import db from "./firebaseConfig.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

//nota es importante instalar firebase en la raiz del proyecto
//npm install firebase

export async function registrarse()
{
    //validamos los campos
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const usuario = document.getElementById("usuario").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();

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
    //la coleccion se llama usuarios
    //la coleccion se crea automaticamente si no existe

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
        window.location.href = "login.html"; //cambia a la pagina de las reservas
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

    window.location.href = "reservar.html";

}

export async function reservar()
{
    //implementar funcion reservar
    alert("Funcion Reservar");
}