import { mostrarReservas, filtrarReservas, editarReserva, actualizarReserva, cerrarModal, cerrarSesion} from "./funcionesFirebase.js";

window.cerrarSesion = cerrarSesion;
window.mostrarReservas = mostrarReservas;
window.abrirModal = abrirModal;
window.cerrarModal = cerrarModal;
window.editarReserva = editarReserva;
window.actualizarReserva = actualizarReserva;
window.cerrarModal = cerrarModal;

document.getElementById("buscador").addEventListener("input", function () {
    const texto = this.value.trim();

    if (texto === "") 
    {
        // Si el buscador está vacío, muestra todas las reservas
        mostrarReservas();
    } else {
        // Si hay texto, filtra
        filtrarReservas(texto);
    }
});

export function abrirModal(id) 
{
    document.getElementById("modal-editar").classList.add("activo"); // <-- Cambia esto
    editarReserva(id);
}

mostrarReservas();

document.querySelector('nav').addEventListener('click', function (e) {
  if (e.target.tagName === 'A') {
    e.preventDefault();
    const section = e.target.getAttribute('data-section');

    // Redirección según el nombre de sección
    switch (section) {
      case 'Administrador':
        window.location.href = 'admin.html';
        break;
      case 'Reservas':
        window.location.href = 'adminReservas.html';
        break;
      case 'Promociones':
        window.location.href = 'adminPromociones.html';
        break;
      case 'Menú':
        window.location.href = 'adminMenu.html';
        break;
    }
  }
});