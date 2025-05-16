function mostrarOpcionesSelect(tipoDeMesa)
{
    // Selecciona el elemento <select>
    const selectElement = document.querySelector('select');
    selectElement.innerHTML = ''; // Limpia las opciones existentes

    let opciones = [];

    switch (tipoDeMesa) // Obtenemos el tipo de mesa del localStorage
    {
        case 0: 
            // Mesa para 2 personas
            opciones = [1,2,6,7,11,12,17];
            break;
        case 1:
            // Mesa para 4 personas
            opciones = [4,9,10,14,18,19];
            break;
        case 2:
            // Mesa para 6 personas
            opciones = [13,15,16,20];
            break;
        case 3:
            // Mesa para 8 personas
            opciones = [3,5,8];
            break;
    }

    const optionElement = document.createElement('option');
    optionElement.value = 'Default'; // Valor de la opción
    optionElement.textContent = 'Selecciona una mesa'; // muestra que es la opcion por defecto
    optionElement.disabled = true; // Desactiva la opción por defecto
    optionElement.selected = true; // Marca la opción por defecto como seleccionada
    selectElement.appendChild(optionElement); // Agrega la opción al <select>

    opciones.forEach((mesa) => {
        const optionElement = document.createElement('option');
        optionElement.value = mesa; // Valor de la opción
        optionElement.textContent = `${mesa}`; // Texto visible para el usuario
        selectElement.appendChild(optionElement); // Agrega la opción al <select>
    });
}

function mostrarImagenMesa() 
{

    // Selecciona el elemento <select> y la imagen
    const selectElement = document.querySelector('select');
    const imgElement = document.querySelector('#mesaImg');

    // Escucha el evento en select
    // Cuando el usuario selecciona una opción, se actualiza la imagen
    selectElement.addEventListener('change', (event) => {
        // Obtén el valor seleccionado
        const mesaSeleccionada = event.target.value;

        // Actualiza el atributo 'src' de la imagen
        imgElement.src = `img/m${mesaSeleccionada}.png`; // Cambia la ruta según tu estructura de archivos
    });

}

function mostrarImagenTipoMesa()
{
    const imgElement = document.querySelector('#imgTipoMesa');
    const numeroPersonas = document.querySelector('#numeroTipoMesa');
    const numeroDeMesa = parseInt(localStorage.getItem("tipoDeMesa"), 10); // Obtener el tipo de mesa del localStorage
    switch (numeroDeMesa) {
        case 0:
            tipoDeMesa = 2;
            break;
        case 1:
            tipoDeMesa = 4;
            break;
        case 2:
            tipoDeMesa = 6;
            break;
        case 3:
            tipoDeMesa = 8;
            break;
    }

    imgElement.src = `img/Mesa${tipoDeMesa}.png`; // Cambia la ruta según tu estructura de archivos
    numeroPersonas.textContent = tipoDeMesa + ' personas'; // Cambia el texto según el tipo de mesa
}

document.addEventListener('DOMContentLoaded', () => {
    const tipoDeMesa = parseInt(localStorage.getItem("tipoDeMesa"), 10); // Obtener el tipo de mesa del localStorage
    mostrarOpcionesSelect(tipoDeMesa);
    mostrarImagenMesa();
    mostrarImagenTipoMesa();
});