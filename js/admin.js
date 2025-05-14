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
