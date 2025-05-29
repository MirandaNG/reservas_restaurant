import { db } from "./firebaseConfig.js";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

import { cerrarSesion } from "./funcionesFirebase.js";
window.cerrarSesion = cerrarSesion;

// FUNCIONES BEBIDAS

const tabla = document.getElementById("tabla-bebidas");
const btnAgregar = document.getElementById("btn-agregar");
const modal = document.getElementById("modal-editar");
const form = document.getElementById("form-editar");
const inputUrl = document.getElementById("url");

let bebidaActualId = null;

// Mostrar bebidas
async function cargarBebidas() {
  tabla.innerHTML = "";

  try {
    const bebidasSnap = await getDocs(collection(db, "bebidas"));

    bebidasSnap.forEach(docSnap => {
      const bebida = docSnap.data();
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td><img src="${bebida.url || ''}" width="50" height="50" /></td>
        <td>${bebida.nombre}</td>
        <td>${bebida.descripcion}</td>
        <td>$${bebida.precio}</td>
        <td><button data-id="${docSnap.id}" class="btn-editar">Editar</button>
           <button data-id="${docSnap.id}" class="btn-eliminar">Eliminar</button></td>
      `;
      tabla.appendChild(fila);
    });

    // Reasignar eventos después de cargar
    document.querySelectorAll(".btn-editar").forEach(btn => {
      btn.addEventListener("click", async e => {
        bebidaActualId = e.target.dataset.id;
        const bebidaDocSnap = await getDocs(collection(db, "bebidas"));
        const bebidaDoc = bebidaDocSnap.docs.find(d => d.id === bebidaActualId);

        if (!bebidaDoc) {
          alert("No se encontró la bebida.");
          return;
        }

        const bebida = bebidaDoc.data();
        form.nombre.value = bebida.nombre;
        form.precio.value = bebida.precio;
        form.descripcion.value = bebida.descripcion;
        inputUrl.value = bebida.url || "";
        modal.showModal();
      });
    });
     // Evento eliminar
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
      btn.addEventListener("click", async e => {
        const id = e.target.dataset.id;
        if (confirm("¿Estás seguro de eliminar esta bebida?")) {
          await deleteDoc(doc(db, "bebidas", id));
          await cargarBebidas();
        }
      });
    });

  } catch (error) {
    console.error("Error al cargar bebidas:", error);
  }
}

// Guardar cambios en bebidas
form.addEventListener("submit", async e => {
  e.preventDefault();

  const nombre = form.nombre.value;
  const precio = parseFloat(form.precio.value);
  const descripcion = form.descripcion.value;
  const url = inputUrl.value;

  try {
    if (bebidaActualId) {
      // === EDITAR ===
      const bebidaRef = doc(db, "bebidas", bebidaActualId);
      await updateDoc(bebidaRef, { nombre, precio, descripcion, url });
    } else {
      // === AGREGAR NUEVA ===
      await addDoc(collection(db, "bebidas"), { nombre, precio, descripcion, url });
    }

    modal.close();
    await cargarBebidas();
  } catch (error) {
    console.error("Error al guardar bebida:", error);
  }
});

// Agregar nueva bebida
btnAgregar.addEventListener("click", () => {
  bebidaActualId = null;
  form.reset();
  modal.showModal();
});

// Funciones globales para cerrar modales
window.cerrarModalBebida = function() {
  document.getElementById("modal-editar").close();
  document.getElementById("form-editar").reset();
  bebidaActualId = null;
};

// Cargar al inicio
cargarBebidas();

// -----------------



// FUNCIONES POSTRES

const tablaPostres = document.getElementById("tabla-postres");
const btnAgregarPostre = document.getElementById("btn-agregar-postre");
const modalPostre = document.getElementById("modal-editar-postre");
const formPostre = document.getElementById("form-editar-postre");
const inputUrlPostre = document.getElementById("url-postre");

let postreActualId = null;

// Mostrar postres
async function cargarPostres() {
  tablaPostres.innerHTML = "";

  try {
    const postresSnap = await getDocs(collection(db, "postres"));

    postresSnap.forEach(docSnap => {
      const postre = docSnap.data();
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td><img src="${postre.url || ''}" width="50" height="50" /></td>
        <td>${postre.nombre}</td>
        <td>${postre.descripcion}</td>
        <td>$${postre.precio}</td>
        <td><button data-id="${docSnap.id}" class="btn-editar-postre">Editar</button>
        <button data-id="${docSnap.id}" class="btn-eliminar-postre">Eliminar</button></td>
      `;
      tablaPostres.appendChild(fila);
    });

    // Reasignar eventos después de cargar
    document.querySelectorAll(".btn-editar-postre").forEach(btn => {
      btn.addEventListener("click", async e => {
        postreActualId = e.target.dataset.id;
        const postreDocSnap = await getDocs(collection(db, "postres"));
        const postreDoc = postreDocSnap.docs.find(d => d.id === postreActualId);

        if (!postreDoc) {
          alert("No se encontró el postre.");
          return;
        }

        const postre = postreDoc.data();
        formPostre.nombre.value = postre.nombre;
        formPostre.precio.value = postre.precio;
        formPostre.descripcion.value = postre.descripcion;
        inputUrlPostre.value = postre.url || "";
        modalPostre.showModal();
      });
    });
     // Evento eliminar postre
     document.querySelectorAll(".btn-eliminar-postre").forEach(btn => {
      btn.addEventListener("click", async e => {
        const id = e.target.dataset.id;
        if (confirm("¿Estás seguro de eliminar este postre?")) {
          await deleteDoc(doc(db, "postres", id));
          await cargarPostres();
        }
      });
    });
  } catch (error) {
    console.error("Error al cargar postres:", error);
  }
}

// Guardar cambios en postres
formPostre.addEventListener("submit", async e => {
  e.preventDefault();

  const nombre = formPostre.nombre.value;
  const precio = parseFloat(formPostre.precio.value);
  const descripcion = formPostre.descripcion.value;
  const url = inputUrlPostre.value;

  try {
    if (postreActualId) {
      // === EDITAR ===
      const postreRef = doc(db, "postres", postreActualId);
      await updateDoc(postreRef, { nombre, precio, descripcion, url });
    } else {
      // === AGREGAR NUEVO ===
      await addDoc(collection(db, "postres"), { nombre, precio, descripcion, url });
    }

    modalPostre.close();
    await cargarPostres();
  } catch (error) {
    console.error("Error al guardar postre:", error);
  }
});

// Agregar nuevo postre
btnAgregarPostre.addEventListener("click", () => {
  postreActualId = null;
  formPostre.reset();
  modalPostre.showModal();
});

// Funciones globales para cerrar modales
window.cerrarModalPostre = function() {
  document.getElementById("modal-editar-postre").close();
  document.getElementById("form-editar-postre").reset();
  postreActualId = null;
};

// Cargar al inicio
cargarPostres();

// -----------------



// FUNCIONES COMIDAS

const tablaComidas = document.getElementById("tabla-comidas");
const btnAgregarComida = document.getElementById("btn-agregar-comida");
const modalComida = document.getElementById("modal-editar-comida");
const formComida = document.getElementById("form-editar-comida");
const inputUrlComida = document.getElementById("url-comida");

let comidaActualId = null;

// Mostrar comidas
async function cargarComidas() {
  tablaComidas.innerHTML = "";

  try {
    const comidasSnap = await getDocs(collection(db, "comidas"));

    comidasSnap.forEach(docSnap => {
      const comida = docSnap.data();
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td><img src="${comida.url || ''}" width="50" height="50" /></td>
        <td>${comida.nombre}</td>
        <td>${comida.descripcion}</td>
        <td>$${comida.precio}</td>
        <td><button data-id="${docSnap.id}" class="btn-editar-comida">Editar</button>
        <button data-id="${docSnap.id}" class="btn-eliminar-comida">Eliminar</button></td>
      `;
      tablaComidas.appendChild(fila);
    });

    // Reasignar eventos después de cargar
    document.querySelectorAll(".btn-editar-comida").forEach(btn => {
      btn.addEventListener("click", async e => {
        comidaActualId = e.target.dataset.id;
        const comidaDocSnap = await getDocs(collection(db, "comidas"));
        const comidaDoc = comidaDocSnap.docs.find(d => d.id === comidaActualId);

        if (!comidaDoc) {
          alert("No se encontró la comida.");
          return;
        }

        const comida = comidaDoc.data();
        formComida.nombre.value = comida.nombre;
        formComida.precio.value = comida.precio;
        formComida.descripcion.value = comida.descripcion;
        inputUrlComida.value = comida.url || "";
        modalComida.showModal();
      });
    });
    // Evento eliminar comida
    document.querySelectorAll(".btn-eliminar-comida").forEach(btn => {
      btn.addEventListener("click", async e => {
        const id = e.target.dataset.id;
        if (confirm("¿Estás seguro de eliminar esta comida?")) {
          await deleteDoc(doc(db, "comidas", id));
          await cargarComidas();
        }
      });
    });

  } catch (error) {
    console.error("Error al cargar comidas:", error);
  }
}

// Guardar cambios en comidas
formComida.addEventListener("submit", async e => {
  e.preventDefault();

  const nombre = formComida.nombre.value;
  const precio = parseFloat(formComida.precio.value);
  const descripcion = formComida.descripcion.value;
  const url = inputUrlComida.value;

  try {
    if (comidaActualId) {
      const comidaRef = doc(db, "comidas", comidaActualId);
      await updateDoc(comidaRef, { nombre, precio, descripcion, url });
    } else {
      await addDoc(collection(db, "comidas"), { nombre, precio, descripcion, url });
    }

    modalComida.close();
    await cargarComidas();
  } catch (error) {
    console.error("Error al guardar comida:", error);
  }
});

// Agregar nueva comida
btnAgregarComida.addEventListener("click", () => {
  comidaActualId = null;
  formComida.reset();
  modalComida.showModal();
});

// Función global para cerrar modal de comida
window.cerrarModalComida = function () {
  modalComida.close();
  formComida.reset();
  comidaActualId = null;
};

// Cargar al inicio
cargarComidas();

// -----------------