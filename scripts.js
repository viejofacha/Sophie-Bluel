document.addEventListener("DOMContentLoaded", () => {
  const authToken = localStorage.getItem("authToken");
  const loginMenu = document.getElementById("login-menu");
  const logoutMenu = document.getElementById("logout-menu");
  const logoutBtn = document.getElementById("logout-btn");

  if (authToken) {
    console.log("Utilisateur authentifié. Affichage Logout.");
    if (loginMenu) loginMenu.style.display = "none";
    if (logoutMenu) logoutMenu.style.display = "block";
  } else {
    console.log("Utilisateur NON authentifié. Affichage Login.");
    if (loginMenu) loginMenu.style.display = "block";
    if (logoutMenu) logoutMenu.style.display = "none";
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("authToken");
      console.log("Séance close.");
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
    console.log("Travais obtenus avec succès :", works);
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
function handleFilterClick(event) {
  filterButtons.forEach((button) => button.classList.remove("active"));
  event.target.classList.add("active");
  const filter = event.target.getAttribute("data-filter");

  if (filter === "all") {
    populateGallery(galleryData);
  } else {
    const filteredData = galleryData.filter(
      (item) => item.category.name === filter
    );
    populateGallery(filteredData);
  }
}
filterButtons.forEach((button) =>
  button.addEventListener("click", handleFilterClick)
);
document.querySelector('.filter-btn[data-filter="all"]').classList.add("active");

document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const allButton = document.querySelector('.filter-btn [data-filter="all"]');
    console.log(allButton);
    if (allButton) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove("active"))
        allButton.classList.add("active"); // Marcar "Tous" como activo al cargar la página
    }

    // Evento para manejar los clics en los botones de filtro
    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            filterButtons.forEach(btn => btn.classList.remove("active")); // Remueve "active" de todos
            this.classList.add("active"); // Agrega "active" al botón clickeado
        });
    });
});
