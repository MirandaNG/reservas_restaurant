const modal = document.getElementById('modal')

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