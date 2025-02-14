document.addEventListener("DOMContentLoaded", () => {
  const authToken = localStorage.getItem("authToken");
  const loginMenu = document.getElementById("login-menu");
  const logoutMenu = document.getElementById("logout-menu");
  const logoutBtn = document.getElementById("logout-btn");

  if (authToken) {
    
    if (loginMenu) loginMenu.style.display = "none";
    if (logoutMenu) logoutMenu.style.display = "block";
  } else {
    
    if (loginMenu) loginMenu.style.display = "block";
    if (logoutMenu) logoutMenu.style.display = "none";
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("authToken");
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
    console.warn("Aucune image disponible.");
    galleryContainer.innerHTML = "<p>Aucune image disponible.</p>";
    return;
  }

  items.forEach((item) => {
    if (!item.imageUrl || !item.title) {
      console.warn("Élément non valide détecté", item);
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
    
    if (!Array.isArray(works)) throw new Error("Réponse API non valide.");
    return works;
  } catch (error) {
    console.error("Erreur lors de l'obtention des emplois :", error);
    return [];
  }
}

async function initializeGallery() {
  try {
    galleryData = await fetchWorks();
    if (!Array.isArray(galleryData) || galleryData.length === 0) {
      console.warn("Aucune entrée valide n'a été reçue");
      return;
    }
    populateGallery(galleryData);
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la galerie :", error);
  }
}

document.addEventListener("DOMContentLoaded", initializeGallery);

// =========================== FILTROS ===========================


document.addEventListener("DOMContentLoaded", async () => {
  const filterContainer = document.getElementById("filters-section");

  async function fetchCategories() {
    try {
      const response = await fetch("http://localhost:5678/api/categories");
      if (!response.ok) throw new Error("Erreur lors de la récupération des catégories");
      const categories = await response.json();
      return categories;
    } catch (error) {
      console.error("Erreur :", error);
      return [];
    }
  }
  document.addEventListener("DOMContentLoaded", loadFilters);
  async function loadFilters() {
    const categories = await fetchCategories();

    filterContainer.innerHTML = '';

    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.classList.add("filter-btn", "active");
    allButton.dataset.filter = "all";
    filterContainer.appendChild(allButton);

    categories.forEach(category => {
      const button = document.createElement("button");
      button.textContent = category.name;
      button.classList.add("filter-btn");
      button.dataset.filter = category.id;
      filterContainer.appendChild(button);
    });

    setFilterEventListeners();
  }

  function setFilterEventListeners() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const filter = button.dataset.filter;
        if (filter === "all") {
          populateGallery(galleryData);
        } else {
          const filteredWorks = galleryData.filter(work => work.categoryId == filter);
          populateGallery(filteredWorks);
        }
      });
    });
  }

  await loadFilters();
});





