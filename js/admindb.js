import { agregarAdmin, obtenerAdmins, actualizarAdmin, eliminarAdmin } from "./funcionesFirebase.js";

// Opcional: expón las funciones en window si las necesitas globalmente
window.agregarAdmin = agregarAdmin;
window.obtenerAdmins = obtenerAdmins;
window.actualizarAdmin = actualizarAdmin;
window.eliminarAdmin = eliminarAdmin;