import { mostrarReservas, filtrarReservas, editarReserva, actualizarReserva} from "./funcionesFirebase.js";
window.mostrarReservas = mostrarReservas;
window.abrirModal = abrirModal;
window.cerrarModal = cerrarModal;
window.editarReserva = editarReserva;
window.actualizarReserva = actualizarReserva;

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
    document.getElementById("modal-editar").style.display = "block";
    editarReserva(id);
}
  
export function cerrarModal() 
{
    document.getElementById("modal-editar").style.display = "none";
    mostrarReservas();
} 

mostrarReservas();