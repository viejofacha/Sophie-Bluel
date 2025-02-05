document.addEventListener("DOMContentLoaded", () => {
  const authToken = localStorage.getItem("authToken");
  const loginMenu = document.getElementById("login-menu");
  const logoutMenu = document.getElementById("logout-menu");
  const logoutBtn = document.getElementById("logout-btn");

  if (authToken) {
      console.log("Usuario autenticado. Mostrando Logout.");
      if (loginMenu) loginMenu.style.display = "none";
      if (logoutMenu) logoutMenu.style.display = "block";
  } else {
      console.log("Usuario NO autenticado. Mostrando Login.");
      if (loginMenu) loginMenu.style.display = "block";
      if (logoutMenu) logoutMenu.style.display = "none";
  }

  if (logoutBtn) {
      logoutBtn.addEventListener("click", (event) => {
          event.preventDefault();
          localStorage.removeItem("authToken");
          console.log("Sesión cerrada.");
          window.location.reload();
      });
  }
});

// =========================== GESTIÓN DE GALERÍA ===========================
const galleryContainer = document.querySelector(".gallery");
const filterButtons = document.querySelectorAll(".filter-btn");
let galleryData = [];

function populateGallery(items) {
  galleryContainer.innerHTML = "";
  if (!Array.isArray(items) || items.length === 0) {
      console.warn("No hay imágenes disponibles.");
      galleryContainer.innerHTML = "<p>Aucune image disponible.</p>";
      return;
  }
  
  items.forEach((item) => {
      if (!item.imageUrl || !item.title) {
          console.warn("Elemento no válido detectado:", item);
          return;
      }
      const galleryItem = document.createElement("figure");
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

async function fetchWorks() {
  try {
      const response = await fetch("http://localhost:5678/api/works");
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const works = await response.json();
      console.log("Trabajos obtenidos con éxito:", works);
      if (!Array.isArray(works)) throw new Error("Respuesta de API no válida.");
      return works;
  } catch (error) {
      console.error("Error al obtener los trabajos:", error);
      return [];
  }
}

async function initializeGallery() {
  try {
      galleryData = await fetchWorks();
      if (!Array.isArray(galleryData) || galleryData.length === 0) {
          console.warn("No se recibieron entradas válidas.");
          return;
      }
      populateGallery(galleryData);
  } catch (error) {
      console.error("Error al inicializar la galería:", error);
  }
}

document.addEventListener("DOMContentLoaded", initializeGallery);

// =========================== FILTROS ===========================
function handleFilterClick(event) {
  filterButtons.forEach(button => button.classList.remove('active'));
  event.target.classList.add('active');
  const filter = event.target.getAttribute('data-filter');
  
  if (filter === 'all') {
      populateGallery(galleryData);
  } else {
      const filteredData = galleryData.filter(item => item.category.name === filter);
      populateGallery(filteredData);
  }
}

filterButtons.forEach(button => button.addEventListener('click', handleFilterClick));

