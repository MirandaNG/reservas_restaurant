// adminMenu.js
import db, { storage } from "./firebaseConfig.js";
import {collection, getDocs, doc, updateDoc, addDoc} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import {ref, uploadBytes, getDownloadURL} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

const tabla = document.getElementById("tabla-bebidas");
const btnAgregar = document.getElementById("btn-agregar");
const modal = document.getElementById("modal-editar");
const form = document.getElementById("form-editar");
const inputImagen = document.getElementById("imagen");

let bebidaActualId = null;

// Mostrar bebidas
async function cargarBebidas() {
  tabla.innerHTML = "";
  const bebidasSnap = await getDocs(collection(db, "bebidas"));
  bebidasSnap.forEach(docSnap => {
    const bebida = docSnap.data();
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td><img src="${bebida.url}" width="50" height="50" /></td>
      <td>${bebida.nombre}</td>
      <td>$${bebida.precio}</td>
      <td>${bebida.descripcion}</td>
      <td><button data-id="${docSnap.id}" class="btn-editar">Editar</button></td>
    `;
    tabla.appendChild(fila);
  });
  // Botones editar
  document.querySelectorAll(".btn-editar").forEach(btn => {
    btn.addEventListener("click", async e => {
      bebidaActualId = e.target.dataset.id;
      const bebidaDoc = bebidasSnap.docs.find(d => d.id === bebidaActualId);
      const bebida = bebidaDoc.data();
      form.nombre.value = bebida.nombre;
      form.precio.value = bebida.precio;
      form.descripcion.value = bebida.descripcion;
      modal.showModal();
    });
  });
}

// Guardar cambios
form.addEventListener("submit", async e => {
  e.preventDefault();

  const nombre = form.nombre.value;
  const precio = parseFloat(form.precio.value);
  const descripcion = form.descripcion.value;
  const archivo = inputImagen.files[0];

  if (bebidaActualId) {
    // === EDITAR ===
    const bebidaRef = doc(db, "bebidas", bebidaActualId);

    let url = null;
    if (archivo) {
      const imgRef = ref(storage, `bebidas/${bebidaActualId}`);
      await uploadBytes(imgRef, archivo);
      url = await getDownloadURL(imgRef);
    }

    const data = { nombre, precio, descripcion };
    if (url) data.url = url;

    await updateDoc(bebidaRef, data);
  } else {
    // === AGREGAR NUEVA ===
    const nuevaBebida = { nombre, precio, descripcion };
    const bebidaDocRef = await addDoc(collection(db, "bebidas"), nuevaBebida);

    if (archivo) {
      const imgRef = ref(storage, `bebidas/${bebidaDocRef.id}`);
      await uploadBytes(imgRef, archivo);
      const url = await getDownloadURL(imgRef);
      await updateDoc(bebidaDocRef, { url });
    }
  }

  modal.close();
  cargarBebidas();
});

// Agregar nueva bebida
btnAgregar.addEventListener("click", async () => {
  bebidaActualId = null;
  form.reset();
  modal.showModal();
});
