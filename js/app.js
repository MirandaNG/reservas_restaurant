function seleccionarMesa(tipoMesa)
{
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

