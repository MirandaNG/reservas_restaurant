
function seleccionarTipoMesa(tipoMesa)
{
    localStorage.setItem("tipoDeMesa", tipoMesa); // Guardar el tipo de mesa en localStorage
    window.location.href = "login.html"; //cambia a la pagina de las reservas
    switch (tipoMesa) { //dependiendo el tipo de mesa se guarda un valor diferente
        
        case 0:
            //Mesa para 2 personas
            alert("Mesa para 2 personas seleccionada");
            break;
        case 1:
            //Mesa para 4 personas
            alert("Mesa para 4 personas seleccionada");
            break;
        case 2:
            //Mesa para 6 personas
            alert("Mesa para 6 personas seleccionada");
            break;
        case 3:
            //Mesa para 8 personas
            alert("Mesa para 8 personas seleccionada");
            break;
        default:
            alert("Mesa no válida seleccionada");
            break;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Selecciona todos los carruseles dentro de las categorías del menú
    const menuCarousels = document.querySelectorAll('.categoria-menu .carrusel-basico');

    menuCarousels.forEach(carousel => {
        const menuCardsContainer = carousel.querySelector('.menu-cards');
        // El primer botón con la clase .carrusel-btn se asume que es "anterior"
        const prevButton = carousel.querySelector('.carrusel-btn:first-of-type');
        // El último botón con la clase .carrusel-btn se asume que es "siguiente"
        const nextButton = carousel.querySelector('.carrusel-btn:last-of-type');

        // Si alguno de los elementos esenciales no se encuentra, se omite este carrusel.
        if (!menuCardsContainer || !prevButton || !nextButton) {
            console.warn('Advertencia: La estructura del carrusel está incompleta para un elemento:', carousel);
            return;
        }

        // Intenta obtener la primera tarjeta para calcular el ancho del desplazamiento
        const firstCard = menuCardsContainer.querySelector('.menu-card');
        if (!firstCard) {
            // No hay tarjetas en este carrusel, no hay nada que desplazar.
            return;
        }

        // Calcula cuánto se debe desplazar.
        // Esto incluye el ancho de la tarjeta y su margen derecho.
        const cardStyle = window.getComputedStyle(firstCard);
        const cardMarginRight = parseFloat(cardStyle.marginRight);
        const scrollAmount = firstCard.offsetWidth + cardMarginRight;

        // Evento para el botón "anterior"
        prevButton.addEventListener('click', () => {
            menuCardsContainer.scrollBy({
                left: -scrollAmount, // Desplaza hacia la izquierda
                behavior: 'smooth'  // Desplazamiento suave
            });
        });

        // Evento para el botón "siguiente"
        nextButton.addEventListener('click', () => {
            menuCardsContainer.scrollBy({
                left: scrollAmount,  // Desplaza hacia la derecha
                behavior: 'smooth'   // Desplazamiento suave
            });
        });
    });
});