import { db } from "../js/firebaseConfig.js"; // Corrected: Import db from firebaseConfig.js
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const links = document.querySelectorAll('nav a');
const content = document.getElementById('content');

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

const modal = document.getElementById('modal');
const titulo = document.getElementById('modal-titulo');
const form = document.getElementById('form-admin');
const nombre = document.getElementById('nombre');
const correo = document.getElementById('correo');
const telefono = document.getElementById('telefono');
const contrasena = document.getElementById('contrasena');
const tabla = document.getElementById('tabla-admins');

let editId = null;

window.abrirModal = function(n = '', c = '', t = '', pass = '', id = null) {
  titulo.textContent = n ? 'Editar Administrador' : 'Agregar Administrador';
  nombre.value = n;
  correo.value = c;
  telefono.value = t;
  contrasena.value = pass;
  editId = id;
  modal.style.display = 'flex';
};

window.cerrarModal = function() {
  modal.style.display = 'none';
  form.reset();
  editId = null;
};

async function guardarEnFirebase(admin) {
  await addDoc(collection(db, "admins"), admin);
}

async function cargarDesdeFirebase() {
  const querySnapshot = await getDocs(collection(db, "admins"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function actualizarAdminEnFirebase(id, admin) {
  await updateDoc(doc(db, "admins", id), admin);
}

async function eliminarAdminDeFirebase(id) {
  await deleteDoc(doc(db, "admins", id));
}

async function renderizarTabla() {
  const admins = await cargarDesdeFirebase();
  tabla.innerHTML = '';
  admins.forEach((admin) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${admin.nombre}</td>
      <td>${admin.correo}</td>
      <td>${admin.telefono}</td>
      <td>
        <button class="btn-editar" onclick="abrirModal('${admin.nombre}', '${admin.correo}', '${admin.telefono}', '${admin.contrasena}', '${admin.id}')">Editar</button>
        <button class="btn-eliminar" onclick="eliminarAdmin('${admin.id}')">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

window.eliminarAdmin = async function(id) {
  if (confirm("¿Estás seguro de que deseas eliminar este administrador?")) {
    await eliminarAdminDeFirebase(id);
    renderizarTabla();
  }
};

form.addEventListener('submit', async function(e) {
  e.preventDefault();
  const nuevoAdmin = {
    nombre: nombre.value,
    correo: correo.value,
    telefono: telefono.value,
    contrasena: contrasena.value
  };

  if (editId) {
    await actualizarAdminEnFirebase(editId, nuevoAdmin);
  } else {
    await guardarEnFirebase(nuevoAdmin);
  }

  renderizarTabla();
  cerrarModal();
});

renderizarTabla();