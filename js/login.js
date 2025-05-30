import { iniciarSesion, iniciarSesionAdmin, cerrarSesion } from "./funcionesFirebase.js";
window.iniciarSesion = iniciarSesion; // Exportar la función para que esté disponible globalmente
window.iniciarSesionAdmin = iniciarSesionAdmin;
window.cerrarSesion = cerrarSesion;
import { db } from "./firebaseConfig.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

window.loginUnificado = async function() {
    const usuario = document.getElementById("usuario").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();

    if (!usuario || !contrasena) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // 1. Buscar en usuarios
    const usuariosCollection = collection(db, "usuarios");
    const consultaUsuario = query(
        usuariosCollection,
        where("usuario", "==", usuario),
        where("contrasena", "==", contrasena)
    );
    const resultadoUsuario = await getDocs(consultaUsuario);

    if (!resultadoUsuario.empty) {
        // Usuario encontrado
        const usuarioDoc = resultadoUsuario.docs[0];
        localStorage.setItem("usuarioId", usuarioDoc.id);
        localStorage.setItem("nombreUsuario", usuarioDoc.data().nombre);
        alert("Bienvenido " + usuarioDoc.data().nombre);
        window.location.href = "reservar.html";
        return;
    }

    // 2. Buscar en admins (aquí el campo es correo, no usuario)
    const adminsCollection = collection(db, "admins");
    const consultaAdmin = query(
        adminsCollection,
        where("correo", "==", usuario), // El campo de login para admin es correo
        where("contrasena", "==", contrasena)
    );
    const resultadoAdmin = await getDocs(consultaAdmin);

    if (!resultadoAdmin.empty) {
        // Admin encontrado
        const adminDoc = resultadoAdmin.docs[0];
        localStorage.setItem("adminId", adminDoc.id);
        alert("Bienvenido administrador " + adminDoc.data().nombre);
        window.location.href = "admin.html";
        return;
    }

    // Si no se encontró en ninguno
    alert("Usuario, correo o contraseña incorrectos.");
};