import { db } from "./firebaseConfig.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Obtener todas las categorías
    const categorias = ['bebidas', 'comidas', 'postres'];
    const emojis = {'bebidas': '🍹', 'comidas': '🍽️', 'postres': '🍰'};
    const nombres = {'bebidas': 'Bebidas', 'comidas': 'Comidas', 'postres': 'Postres'};

    for (const categoria of categorias) {
      await mostrarCategoria(categoria, nombres[categoria], emojis[categoria]);
    }
  } catch (error) {
    console.error("Error al cargar el menú:", error);
  }
});

async function mostrarCategoria(coleccion, titulo, emoji) {
  const querySnapshot = await getDocs(collection(db, coleccion));
  
  // Solo mostrar categorías que tengan items
  if (querySnapshot.size > 0) {
    const categoriaDiv = document.createElement('div');
    categoriaDiv.className = 'categoria-menu';
    
    // Crear título
    const tituloElement = document.createElement('h3');
    tituloElement.className = 'Secciones-menu';
    tituloElement.textContent = `${emoji} ${titulo}`;
    categoriaDiv.appendChild(tituloElement);
    
    // Crear carrusel
    const carruselDiv = document.createElement('div');
    carruselDiv.className = 'carrusel-basico';
    
    // Botón izquierdo
    const btnLeft = document.createElement('button');
    btnLeft.className = 'carrusel-btn';
    btnLeft.innerHTML = '&#10094;';
    carruselDiv.appendChild(btnLeft);
    
    // Contenedor de cards
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'menu-cards';
    
    // Agregar cada item
    querySnapshot.forEach(doc => {
      const item = doc.data();
      const card = document.createElement('div');
      card.className = 'menu-card';
      
      card.innerHTML = `
        <h4>${item.nombre} $${item.precio}</h4>
        <img src="${item.url || 'img/placeholder.jpg'}" alt="${item.nombre}" onerror="this.src='img/placeholder.jpg'">
        <p>${item.descripcion}</p>
      `;
      
      cardsContainer.appendChild(card);
    });
    
    carruselDiv.appendChild(cardsContainer);
    
    // Botón derecho
    const btnRight = document.createElement('button');
    btnRight.className = 'carrusel-btn';
    btnRight.innerHTML = '&#10095;';
    carruselDiv.appendChild(btnRight);
    
    categoriaDiv.appendChild(carruselDiv);
    document.querySelector('.menu-container').appendChild(categoriaDiv);
    
    // Configurar funcionalidad del carrusel
    configurarCarrusel(carruselDiv);
  }
}

function configurarCarrusel(container) {
  const cards = container.querySelector('.menu-cards');
  const btnLeft = container.querySelector('.carrusel-btn:first-child');
  const btnRight = container.querySelector('.carrusel-btn:last-child');
  
  let scrollAmount = 0;
  const cardWidth = 300; // Ajusta según tu CSS
  const visibleCards = 3; // Número de cards visibles
  
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