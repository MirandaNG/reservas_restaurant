// Script para menú hamburguesa responsivo

document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('hamburger-menu');
  // Buscar nav o .navbar
  let nav = document.querySelector('nav');
  if (!nav) nav = document.querySelector('.navbar');
  if (!btn || !nav) return;

  btn.addEventListener('click', function() {
    nav.classList.toggle('activo');
  });

  // Cerrar menú al hacer click fuera en móvil
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 900 && nav.classList.contains('activo')) {
      if (!nav.contains(e.target) && !btn.contains(e.target)) {
        nav.classList.remove('activo');
      }
    }
  });

  // Opcional: cerrar menú al hacer click en un enlace
  nav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 900) {
        nav.classList.remove('activo');
      }
    });
  });
});
