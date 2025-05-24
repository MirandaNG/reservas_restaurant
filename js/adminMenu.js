import { db } from "./firebaseConfig.js";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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

// Agregar nueva bebida
btnAgregar.addEventListener("click", () => {
  bebidaActualId = null;
  form.reset();
  modal.showModal();
});

// Cargar al inicio
cargarBebidas();