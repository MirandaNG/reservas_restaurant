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
    const carruselDiv = document.createElement('div');
    carruselDiv.className = 'carrusel-basico';

    const btnLeft = document.createElement('button');
    btnLeft.className = 'carrusel-btn';
    btnLeft.innerHTML = '&#10094;';
    carruselDiv.appendChild(btnLeft);

    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'promo-cards';

    querySnapshot.forEach(doc => {
      const promo = doc.data();

      const card = document.createElement('div');
      card.className = 'promo-card';

      card.innerHTML = `
        <img src="${promo.url || 'img/placeholder.jpg'}" alt="Promo" onerror="this.src='img/placeholder.jpg'">
        <p>${promo.descripcion}</p>
      `;

      cardsContainer.appendChild(card);
    });

    carruselDiv.appendChild(cardsContainer);

    const btnRight = document.createElement('button');
    btnRight.className = 'carrusel-btn';
    btnRight.innerHTML = '&#10095;';
    carruselDiv.appendChild(btnRight);

    document.querySelector('.promociones-container').appendChild(carruselDiv);

    configurarCarrusel(carruselDiv);
  } else {
    console.warn("No hay promociones disponibles");
  }
}

function configurarCarrusel(container) {
  const cards = container.querySelector('.promo-cards');
  const btnLeft = container.querySelector('.carrusel-btn:first-child');
  const btnRight = container.querySelector('.carrusel-btn:last-child');

  let scrollAmount = 0;
  const cardWidth = 300; // ajusta si usas otro tamaño
  const visibleCards = 3;

  btnLeft.addEventListener('click', () => {
    scrollAmount = Math.max(scrollAmount - cardWidth, 0);
    cards.style.transform = `translateX(-${scrollAmount}px)`;
  });

  btnRight.addEventListener('click', () => {
    const maxScroll = (cards.children.length - visibleCards) * cardWidth;
    scrollAmount = Math.min(scrollAmount + cardWidth, maxScroll);
    cards.style.transform = `translateX(-${scrollAmount}px)`;
  });
}
