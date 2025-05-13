// js/comentarios.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("comentario-form");
  const comentariosLista = document.getElementById("comentarios-lista");

  function cargarComentarios() {
    const comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
    comentariosLista.innerHTML = "";
    comentarios.forEach(({ nombre, texto }) => {
      const div = document.createElement("div");
      div.classList.add("comentario");
      div.innerHTML = `<strong>${nombre}</strong>: ${texto}`;
      comentariosLista.appendChild(div);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const comentario = document.getElementById("comentario").value.trim();
    if (nombre && comentario) {
      const nuevoComentario = { nombre, texto: comentario };
      const comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
      comentarios.push(nuevoComentario);
      localStorage.setItem("comentarios", JSON.stringify(comentarios));
      form.reset();
      cargarComentarios();
    }
  });

  cargarComentarios();
});
