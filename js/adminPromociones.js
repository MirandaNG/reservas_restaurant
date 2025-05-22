const links = document.querySelectorAll('nav a');
const content = document.getElementById('content');

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

// Elementos del DOM
const modal = document.getElementById('promoModal');
const previewImage = document.getElementById('previewImage');
const promoImageInput = document.getElementById('promoImage');
const promoDescInput = document.getElementById('promoDesc');
const tabla = document.querySelector('#tabla-promociones tbody');

let editIndex = null;

// Funciones
function openModal(img = '', desc = '', index = null) {
  document.getElementById('modalTitle').textContent = index !== null ? 'Editar Promoción' : 'Agregar Promoción';
  previewImage.src = img || '';
  promoImageInput.value = '';
  promoDescInput.value = desc || '';
  editIndex = index;
  modal.style.display = 'flex';
}

function closeModal() {
  modal.style.display = 'none';
  promoImageInput.value = '';
  promoDescInput.value = '';
  previewImage.src = '';
  editIndex = null;
}

function preview(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function savePromo() {
  const promos = JSON.parse(localStorage.getItem('promociones')) || [];
  const img = previewImage.src;
  const desc = promoDescInput.value;

  const nuevaPromo = { imagen: img, descripcion: desc };

  if (editIndex !== null) {
    promos[editIndex] = nuevaPromo;
  } else {
    promos.push(nuevaPromo);
  }

  localStorage.setItem('promociones', JSON.stringify(promos));
  renderPromos();
  closeModal();
}

function deletePromo(index) {
  const promos = JSON.parse(localStorage.getItem('promociones')) || [];
  if (confirm('¿Estás seguro de eliminar esta promoción?')) {
    promos.splice(index, 1);
    localStorage.setItem('promociones', JSON.stringify(promos));
    renderPromos();
  }
}

function renderPromos() {
  const promos = JSON.parse(localStorage.getItem('promociones')) || [];
  tabla.innerHTML = '';

  promos.forEach((promo, index) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td><img src="${promo.imagen}" alt="Promo" class="promo-img" style="width: 100px;"></td>
      <td>${promo.descripcion}</td>
      <td>
        <button onclick="openModal('${promo.imagen}', '${promo.descripcion}', ${index})">Editar</button>
        <button onclick="deletePromo(${index})">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

// Exponer funciones al HTML globalmente
window.openModal = openModal;
window.closeModal = closeModal;
window.savePromo = savePromo;
window.preview = preview;
window.deletePromo = deletePromo;

// Inicialización
document.addEventListener('DOMContentLoaded', renderPromos);
