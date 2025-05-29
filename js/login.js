import { iniciarSesion, iniciarSesionAdmin, cerrarSesion } from "./funcionesFirebase.js";
window.iniciarSesion = iniciarSesion; // Exportar la función para que esté disponible globalmente
window.iniciarSesionAdmin = iniciarSesionAdmin;
window.cerrarSesion = cerrarSesion;