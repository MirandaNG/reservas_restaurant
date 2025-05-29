import { db } from "./firebaseConfig.js";
import {
  subirImagenPromocion,
  agregarPromocion,
  actualizarPromocion
} from './funcionesFirebase.js';

import {
  collection,
  getDocs,
  doc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Navegación
document.querySelector('nav').addEventListener('click', function (e) {
  if (e.target.tagName === 'A') {
    e.preventDefault();
    const section = e.target.getAttribute('data-section');

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

// Elementos DOM adaptados a tu HTML original
const tabla = document.getElementById("tabla-promociones");
const btnAgregar = document.querySelector("button.btn.btn-primary"); // Botón "Agregar"
const modal = document.getElementById("promoModal");
const previewImage = document.getElementById("previewImage");
const promoUrlInput = document.getElementById("promoUrl");
const promoDescInput = document.getElementById("promoDesc");

let promoActualId = null;

// Abrir modal
function openModal(img = '', desc = '', id = null) {
  document.getElementById('modalTitle').textContent = id ? 'Editar Promoción' : 'Agregar Promoción';
  previewImage.src = img || '';
  promoUrlInput.value = img || '';
  promoDescInput.value = desc || '';
  promoActualId = id;
  modal.style.display = 'flex';
}

// Cerrar modal
function closeModal() {
  modal.style.display = 'none';
  promoUrlInput.value = '';
  promoDescInput.value = '';
  previewImage.src = '';
  promoActualId = null;
}

// Previsualizar imagen
function previewFromUrl() {
  const url = promoUrlInput.value;
  previewImage.src = url;
}

// Guardar o editar promoción
async function savePromo() {
  const descripcion = promoDescInput.value;
  const url = promoUrlInput.value;

  if (!descripcion || !url) {
    alert("Faltan campos");
    return;
  }

  try {
    const datos = { descripcion, url };

    if (promoActualId) {
      await actualizarPromocion(promoActualId, datos);
    } else {
      await agregarPromocion(datos);
    }

    closeModal();
    await renderPromos();
  } catch (error) {
    console.error("Error al guardar promoción:", error);
    alert("Ocurrió un error al guardar la promoción.");
  }
}

// Eliminar promoción
async function deletePromo(id) {
  if (!confirm("¿Estás seguro de eliminar esta promoción?")) return;

  try {
    await deleteDoc(doc(db, "promociones", id));
    await renderPromos();
  } catch (error) {
    console.error("Error al eliminar promoción:", error);
  }
}

// Mostrar promociones
async function renderPromos() {
  const tbody = tabla.querySelector("tbody");
  tbody.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "promociones"));

    snapshot.forEach(docSnap => {
      const promo = docSnap.data();
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td><img src="${promo.url}" alt="Promo" class="promo-img" style="width: 100px;"></td>
        <td>${promo.descripcion}</td>
        <td>
          <button onclick="openModal('${promo.url}', \`${promo.descripcion.replace(/`/g, '\\`')}\`, '${docSnap.id}')">Editar</button>
          <button onclick="deletePromo('${docSnap.id}')">Eliminar</button>
        </td>
      `;
      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error("Error al cargar promociones:", error);
  }
}

// Exponer funciones globalmente
window.openModal = openModal;
window.closeModal = closeModal;
window.savePromo = savePromo;
window.previewFromUrl = previewFromUrl;
window.deletePromo = deletePromo;

// Cargar promociones al inicio
renderPromos();
