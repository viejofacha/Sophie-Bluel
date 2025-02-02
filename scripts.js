// Selecciona el contenedor de la galería
const galleryContainer = document.querySelector(".gallery");

// Selecciona los botones de filtro
const filterButtons = document.querySelectorAll(".filter-btn");

// Variable global para almacenar los datos de la galería
let galleryData = [];

// Función para crear y añadir los elementos de la galería
function populateGallery(items) {
  const galleryContainer = document.querySelector(".gallery");
  galleryContainer.innerHTML = "";

  if (!Array.isArray(items) || items.length === 0) {
      console.warn("No hay trabajos disponibles para mostrar.");
      galleryContainer.innerHTML = "<p>Aucune image disponible.</p>";
      return;
  }

  items.forEach((item) => {
      if (!item.imageUrl || !item.title) {
          console.warn("Trabajo inválido detectado:", item);
          return;
      }

      const galleryItem = document.createElement("figure");
      galleryItem.classList.add("gallery-item");

      const img = document.createElement("img");
      img.src = item.imageUrl;
      img.alt = item.title;

      const figcaption = document.createElement("figcaption");
      figcaption.textContent = item.title;

      galleryItem.appendChild(img);
      galleryItem.appendChild(figcaption);
      galleryContainer.appendChild(galleryItem);
  });
}

let works = [];

function fetchWorks() {
  fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(data => {
      works = data;
      renderWorks(works);
    });
}

fetchWorks()

function renderWorks(works) {
  const galleryContainer = document.querySelector(".gallery");
  galleryContainer.innerHTML = "";

  works.forEach(work => {
    //rendu de chaque élément
    const galleryItem = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;
    
    galleryItem.appendChild(img);
    galleryItem.appendChild(figcaption);
    
  })
}

// Función para manejar el clic en los botones
function handleFilterClick(event) {
  // Elimina la clase 'active' de todos los botones
  filterButtons.forEach(button => button.classList.remove('active'));

  // Añade la clase 'active' al botón clicado
  event.target.classList.add('active');

  // Obtener el filtro seleccionado
  const filter = event.target.getAttribute('data-filter');

  if (filter === 'all') {
    // Mostrar todos los elementos
    populateGallery(galleryData);
  } else {
    // Filtrar los elementos por la categoría seleccionada
    const filteredData = galleryData.filter(item => 
      item.category.name === filter
    );
    populateGallery(filteredData);
  }
}

// Obtén los datos de la API
fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(data => {
    galleryData = data; // Asigna los datos a la variable global
    console.log('Datos cargados:', galleryData);
    populateGallery(galleryData); // Muestra la galería inicial

    // Marca el botón "All" como activo al cargar la página
    const allButton = document.querySelector('.filter-btn[data-filter="all"]');
    if (allButton) {
      allButton.classList.add('active');
    }
  })
  .catch(error => console.error('Error fetching data:', error));

// Asignar el evento 'click' a todos los botones de filtro
filterButtons.forEach(button => {
  button.addEventListener('click', handleFilterClick);
});

async function fetchWorks() {
  try {
      const response = await fetch("http://localhost:5678/api/works");

      if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
      }

      const works = await response.json();
      console.log("Trabajos obtenidos correctamente:", works);

      if (!Array.isArray(works)) {
          throw new Error("La API no devolvió un array válido.");
      }

      return works;
  } catch (error) {
      console.error("Error al obtener los trabajos:", error);
      return []; // Devuelve un array vacío para evitar errores
  }
}

async function initializeGallery() {
  try {
      const works = await fetchWorks();

      if (!Array.isArray(works) || works.length === 0) {
          console.warn("No se han recibido trabajos válidos.");
          return;
      }

      populateGallery(works);
  } catch (error) {
      console.error("Error al inicializar la galería:", error);
  }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", initializeGallery);




