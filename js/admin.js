const links = document.querySelectorAll('nav a');
const content = document.getElementById('content');

links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    // Quitar clase activa de todos
    links.forEach(l => l.classList.remove('active'));

    link.classList.add('active');

    const section = link.getAttribute('data-section');

    content.innerHTML = `<h1>${section}</h1>`;
  });
});

const modal = document.getElementById('modal');
const titulo = document.getElementById('modal-titulo');
const form = document.getElementById('form-admin');
const nombre = document.getElementById('nombre');
const correo = document.getElementById('correo');
const telefono = document.getElementById('telefono');
const tabla = document.getElementById('tabla-admins');

let editIndex = null;

function abrirModal(n = '', c = '', t = '', index = null) {
    titulo.textContent = n ? 'Editar Administrador' : 'Agregar Administrador';
    nombre.value = n;
    correo.value = c;
    telefono.value = t;
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
                <button onclick="abrirModal('${admin.nombre}', '${admin.correo}', '${admin.telefono}', ${index})">Editar</button>
                <button onclick="eliminarAdmin(${index})">Eliminar</button>
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
        telefono: telefono.value
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