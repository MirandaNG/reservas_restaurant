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
  try {
    const querySnapshot = await getDocs(collection(db, coleccion));
    
    // Solo mostrar categorías que tengan items
    if (querySnapshot.size > 0) {
      const categoriaDiv = document.createElement('div');
      categoriaDiv.className = 'categoria-menu';
      
      // Crear título
      const tituloElement = document.createElement('h3');
      tituloElement.className = 'Subtitulo'; // Cambiado para usar la clase correcta
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
        
        // Estructura correcta: imagen primero, luego contenido de texto
        card.innerHTML = `
          <img src="${item.url || 'img/placeholder.jpg'}" alt="${item.nombre}" onerror="this.src='img/placeholder.jpg'">
          <div class="menu-card-text-content">
            <h4>${item.nombre} $${item.precio}</h4>
            <p>${item.descripcion || ''}</p>
          </div>
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
      
      // Agregar la sección al contenedor del menú
      const menuContainer = document.querySelector('.menu-container');
      if (menuContainer) {
        menuContainer.appendChild(categoriaDiv);
      } else {
        console.error('No se encontró el contenedor .menu-container');
      }
      
      // Configurar funcionalidad del carrusel
      configurarCarrusel(carruselDiv);
      
      console.log(`Categoría ${titulo} cargada con ${querySnapshot.size} elementos`);
    } else {
      console.log(`No se encontraron elementos en la categoría: ${titulo}`);
    }
  } catch (error) {
    console.error(`Error al cargar la categoría ${titulo}:`, error);
  }
}

function configurarCarrusel(container) {
  const cards = container.querySelector('.menu-cards');
  const btnLeft = container.querySelector('.carrusel-btn:first-child');
  const btnRight = container.querySelector('.carrusel-btn:last-child');
  
  if (!cards || !btnLeft || !btnRight) {
    console.error('No se pudieron encontrar los elementos del carrusel');
    return;
  }

  function getCardWidth() {
  const card = cards.querySelector('.menu-card');
  if (!card) return 200;
  const style = window.getComputedStyle(card);
  const marginLeft = parseInt(style.marginLeft) || 0;
  const marginRight = parseInt(style.marginRight) || 0;
  return card.offsetWidth + marginLeft + marginRight;
}

function scrollToCard(direction = 1) {
  const cardWidth = getCardWidth();
  // Encuentra el índice de la tarjeta actualmente centrada
  let currentIndex = Math.round(cards.scrollLeft / cardWidth);
  // Calcula el nuevo índice
  let newIndex = currentIndex + direction;
  // Limita el índice para no salirte del rango
  newIndex = Math.max(0, Math.min(newIndex, cards.children.length - 1));
  // Calcula el scroll para centrar la tarjeta (considerando margen)
  const containerWidth = cards.offsetWidth;
  const scrollLeft = (newIndex * cardWidth) + (cardWidth / 2) - (containerWidth / 2);
  cards.scrollTo({
    left: scrollLeft,
    behavior: 'smooth'
  });
}

  btnLeft.addEventListener('click', () => {
    scrollToCard(-1);
  });

  btnRight.addEventListener('click', () => {
    scrollToCard(1);
  });

  // Opcional: Ocultar botones cuando no se puede hacer scroll
  function updateButtons() {
    const maxScrollLeft = cards.scrollWidth - cards.clientWidth;
    btnLeft.style.opacity = cards.scrollLeft <= 0 ? '0.5' : '1';
    btnRight.style.opacity = cards.scrollLeft >= maxScrollLeft - 1 ? '0.5' : '1';
  }

  cards.addEventListener('scroll', updateButtons);
  window.addEventListener('resize', updateButtons);

  // Inicializar estado de botones
  setTimeout(updateButtons, 300);
}