import { db } from "./firebaseConfig.js";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
//bebidas
const tabla = document.getElementById("tabla-bebidas");
const btnAgregar = document.getElementById("btn-agregar");
const modal = document.getElementById("modal-editar");
const form = document.getElementById("form-editar");
const inputUrl = document.getElementById("url");

//postres
const tablaPostres = document.getElementById("tabla-postres");
const btnAgregarPostre = document.getElementById("btn-agregar-postre");
const modalPostre = document.getElementById("modal-editar-postre");
const formPostre = document.getElementById("form-editar-postre");
const inputUrlPostre = document.getElementById("url-postre");

let postreActualId = null;
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
        <td><button data-id="${docSnap.id}" class="btn-editar">Editar</button></td>
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

  } catch (error) {
    console.error("Error al cargar bebidas:", error);
  }
}

// Mostrar postres
async function cargarPostres() {
  tabla.innerHTML = "";

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
        <td><button data-id="${docSnap.id}" class="btn-editar-postre">Editar</button></td>
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
  } catch (error) {
    console.error("Error al cargar postres:", error);
  }
}

// Guardar cambios
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

// Agregar nueva bebida
btnAgregar.addEventListener("click", () => {
  bebidaActualId = null;
  form.reset();
  modal.showModal();
});

// Agregar nuevo postre
btnAgregarPostre.addEventListener("click", () => {
  postreActualId = null;
  formPostre.reset();
  modalPostre.showModal();
});

// Cargar al inicio
cargarBebidas();
cargarPostres();