
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

function registrarse()
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

    //....................................................


    //esto es temporal
    //alerta que muestra los datos ingresados
    alert(`Nombre: ${nombre}, Email: ${correo}, Teléfono: ${telefono}, Contraseña: ${contrasena}`);
    window.location.href = "login.html"; //cambia a la pagina de las reservas

}

function iniciarSesion()
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

function reservar()
{
    alert("Funcion Reservar");
}