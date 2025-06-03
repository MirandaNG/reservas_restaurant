import { db } from "./firebaseConfig.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await mostrarPromociones();
  } catch (error) {
    console.error("Error al cargar las promociones:", error);
  }
});

async function mostrarPromociones() {
  const querySnapshot = await getDocs(collection(db, "promociones"));

  if (querySnapshot.size > 0) {
    const promociones = [];

    querySnapshot.forEach(doc => {
      promociones.push(doc.data());
    });

    const carruselDiv = document.createElement('div');
    carruselDiv.className = 'carrusel-basico';

    const btnLeft = document.createElement('button');
    btnLeft.className = 'carrusel-btn';
    btnLeft.innerHTML = '&#10094;';
    carruselDiv.appendChild(btnLeft);

    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'promo-cards';

    carruselDiv.appendChild(cardsContainer);

    const btnRight = document.createElement('button');
    btnRight.className = 'carrusel-btn';
    btnRight.innerHTML = '&#10095;';
    carruselDiv.appendChild(btnRight);

    document.querySelector('.promociones-container').appendChild(carruselDiv);

    configurarCarruselDinamico(carruselDiv, promociones);
  } else {
    console.warn("No hay promociones disponibles");
  }
}

function configurarCarruselDinamico(container, promociones) {
  const cardsContainer = container.querySelector('.promo-cards');
  const btnLeft = container.querySelector('.carrusel-btn:first-child');
  const btnRight = container.querySelector('.carrusel-btn:last-child');
  
  let index = 0;
   let autoSlideInterval;

function getVisibleCount() {
    if (window.innerWidth < 600) return 1;      // Móvil
    if (window.innerWidth < 900) return 2;      // Tablet pequeño
    if (window.innerWidth < 1200) return 3;     // Tablet grande
    if (window.innerWidth < 1500) return 4;     // Laptop
    return 5;                                   // Escritorio grande
  }
  function renderCards(startIndex) {
      const visibleCount = getVisibleCount();
    cardsContainer.innerHTML = ''; // Limpiar anteriores

    for (let i = 0; i < visibleCount; i++) {
      const currentIndex = (startIndex + i) % promociones.length;
      const promo = promociones[currentIndex];

      const card = document.createElement('div');
      card.className = 'promo-card';
      card.innerHTML = `
        <img src="${promo.url || 'img/placeholder.jpg'}" alt="Promo" onerror="this.src='img/placeholder.jpg'">
        <p>${promo.descripcion}</p>
      `;

      cardsContainer.appendChild(card);
    }
  }
   function nextSlide() {
    index = (index + 1) % promociones.length;
    renderCards(index);
  }

  function prevSlide() {
    index = (index - 1 + promociones.length) % promociones.length;
    renderCards(index);
  }

  btnRight.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
  });

  btnLeft.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
  });

  window.addEventListener('resize', () => renderCards(index));

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 3500); // Cambia cada 3.5 segundos
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  renderCards(index);
  startAutoSlide();
}