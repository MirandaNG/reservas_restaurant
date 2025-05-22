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

const modal = document.getElementById('modal');
const titulo = document.getElementById('modal-titulo');
const form = document.getElementById('form-admin');
const nombre = document.getElementById('nombre');
const correo = document.getElementById('correo');
const telefono = document.getElementById('telefono');
const contrasena = document.getElementById('contrasena');
const tabla = document.getElementById('tabla-admins');

let editIndex = null;

function abrirModal(n = '', c = '', t = '', pass='', index = null) {
    titulo.textContent = n ? 'Editar Administrador' : 'Agregar Administrador';
    nombre.value = n;
    correo.value = c;
    telefono.value = t;
    contrasena.value = pass;
    editIndex = index;
    modal.style.display = 'flex';
}

function cerrarModal() {
    modal.style.display = 'none';
    form.reset();
    editIndex = null;
}

function guardarEnLocalStorage(admins) {
    localStorage.setItem('admins', JSON.stringify(admins));
}

function cargarDesdeLocalStorage() {
    const data = localStorage.getItem('admins');
    return data ? JSON.parse(data) : [];
}

function renderizarTabla() {
    const admins = cargarDesdeLocalStorage();
    tabla.innerHTML = '';
    admins.forEach((admin, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${admin.nombre}</td>
            <td>${admin.correo}</td>
            <td>${admin.telefono}</td>
            <td>
                <button class="btn-editar"onclick="abrirModal('${admin.nombre}', '${admin.correo}', '${admin.telefono}', '${admin.contrasena}', ${index})">Editar</button>
                <button class="btn-eliminar"onclick="eliminarAdmin(${index})">Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

function eliminarAdmin(index) {
    const admins = cargarDesdeLocalStorage();
    if (confirm("¿Estás seguro de que deseas eliminar este administrador?")) {
        admins.splice(index, 1);
        guardarEnLocalStorage(admins);
        renderizarTabla();
    }
}


form.addEventListener('submit', function(e) {
    e.preventDefault();
    const admins = cargarDesdeLocalStorage();

    const nuevoAdmin = {
        nombre: nombre.value,
        correo: correo.value,
        telefono: telefono.value,
        contrasena: contrasena.value
    };

    if (editIndex !== null) {
        admins[editIndex] = nuevoAdmin;
    } else {
        admins.push(nuevoAdmin);
    }

    guardarEnLocalStorage(admins);
    renderizarTabla();
    cerrarModal();
});

renderizarTabla();