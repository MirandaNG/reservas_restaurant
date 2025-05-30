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
  const visibleCount = 3;

  function renderCards(startIndex) {
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

  // Eventos
  btnRight.addEventListener('click', () => {
    index = (index + 1) % promociones.length;
    renderCards(index);
  });

  btnLeft.addEventListener('click', () => {
    index = (index - 1 + promociones.length) % promociones.length;
    renderCards(index);
  });

  // Render inicial
  renderCards(index);
}