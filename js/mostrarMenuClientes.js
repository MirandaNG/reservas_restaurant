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
      cardsContainer.setAttribute('data-current-index', '0');
      
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
  
  // Esperar a que las imágenes se carguen para calcular correctamente los anchos
  setTimeout(() => {
    // Calcular el ancho de una tarjeta incluyendo el gap
    const cardWidth = getCardWidth();
    const visibleCards = Math.floor(cards.offsetWidth / cardWidth);
    const totalCards = cards.children.length;
    
    // Inicializar el índice actual
    let currentIndex = 0;
    cards.setAttribute('data-current-index', currentIndex);
    
    // Actualizar estado de los botones
    updateButtonState();
    
    // Función para obtener el ancho real de una tarjeta incluyendo márgenes y gap
    function getCardWidth() {
      if (cards.children.length === 0) return 200;
      
      const card = cards.children[0];
      const style = window.getComputedStyle(card);
      const width = card.offsetWidth;
      const marginLeft = parseInt(style.marginLeft) || 0;
      const marginRight = parseInt(style.marginRight) || 0;
      
      // Obtener el gap del contenedor
      const containerStyle = window.getComputedStyle(cards);
      const gap = parseInt(containerStyle.gap) || 15; // Default gap de 15px
      
      return width + marginLeft + marginRight + gap;
    }
    
    // Función para desplazar el carrusel
    function scrollCarousel(direction) {
      // Obtener el índice actual
      currentIndex = parseInt(cards.getAttribute('data-current-index')) || 0;
      
      // Calcular el nuevo índice
      let newIndex = currentIndex + direction;
      
      // Limitar el índice para no salirse del rango
      newIndex = Math.max(0, Math.min(newIndex, totalCards - visibleCards));
      
      // Si no hay cambio, no hacer nada
      if (newIndex === currentIndex) return;
      
      // Guardar el nuevo índice
      currentIndex = newIndex;
      cards.setAttribute('data-current-index', currentIndex);
      
      // Calcular la posición de scroll
      const scrollPosition = currentIndex * cardWidth;
      
      // Aplicar el scroll con animación suave
      cards.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
      
      // Actualizar estado de los botones
      updateButtonState();
    }
    
    // Función para actualizar el estado de los botones
    function updateButtonState() {
      btnLeft.disabled = currentIndex <= 0;
      btnLeft.style.opacity = currentIndex <= 0 ? '0.5' : '1';
      
      btnRight.disabled = currentIndex >= totalCards - visibleCards;
      btnRight.style.opacity = currentIndex >= totalCards - visibleCards ? '0.5' : '1';
    }
    
    // Asignar eventos a los botones
    btnLeft.addEventListener('click', () => scrollCarousel(-1));
    btnRight.addEventListener('click', () => scrollCarousel(1));
    
    // Manejar eventos de scroll manual
    cards.addEventListener('scroll', () => {
      // Calcular el índice actual basado en la posición de scroll
      const scrollPosition = cards.scrollLeft;
      const newIndex = Math.round(scrollPosition / cardWidth);
      
      // Actualizar el índice si ha cambiado
      if (newIndex !== currentIndex) {
        currentIndex = newIndex;
        cards.setAttribute('data-current-index', currentIndex);
        updateButtonState();
      }
    });
    
    // Manejar cambios de tamaño de ventana
    window.addEventListener('resize', () => {
      // Recalcular el ancho de tarjeta y número de tarjetas visibles
      const newCardWidth = getCardWidth();
      const newVisibleCards = Math.floor(cards.offsetWidth / newCardWidth);
      
      // Si hay cambios, actualizar variables y estado
      if (newCardWidth !== cardWidth || newVisibleCards !== visibleCards) {
        cardWidth = newCardWidth;
        visibleCards = newVisibleCards;
        
        // Ajustar la posición de scroll para mantener la tarjeta actual visible
        const scrollPosition = currentIndex * cardWidth;
        cards.scrollLeft = scrollPosition;
        
        updateButtonState();
      }
    });
    
    // Inicializar estado
    updateButtonState();
    
    console.log(`Carrusel configurado: ${totalCards} tarjetas, ${visibleCards} visibles, ancho: ${cardWidth}px`);
  }, 500); // Esperar 500ms para que las imágenes se carguen
}