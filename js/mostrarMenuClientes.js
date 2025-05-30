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
  
  const cardWidth = 215; // Ancho de tarjeta + gap (200px + 15px)
  const scrollStep = cardWidth * 2; // Desplazar 2 tarjetas a la vez
  
  btnLeft.addEventListener('click', () => {
    cards.scrollBy({
      left: -scrollStep,
      behavior: 'smooth'
    });
  });
  
  btnRight.addEventListener('click', () => {
    cards.scrollBy({
      left: scrollStep,
      behavior: 'smooth'
    });
  });
  
  // Opcional: Ocultar botones cuando no se puede hacer scroll
  cards.addEventListener('scroll', () => {
    const maxScrollLeft = cards.scrollWidth - cards.clientWidth;
    
    btnLeft.style.opacity = cards.scrollLeft <= 0 ? '0.5' : '1';
    btnRight.style.opacity = cards.scrollLeft >= maxScrollLeft ? '0.5' : '1';
  });
  
  // Inicializar estado de botones
  const maxScrollLeft = cards.scrollWidth - cards.clientWidth;
  btnLeft.style.opacity = '0.5';
  btnRight.style.opacity = maxScrollLeft > 0 ? '1' : '0.5';
}