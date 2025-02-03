document.addEventListener("DOMContentLoaded", () => {
  const authToken = localStorage.getItem("authToken");
  const loginMenu = document.getElementById("login-menu");
  const logoutMenu = document.getElementById("logout-menu");
  const logoutBtn = document.getElementById("logout-btn");

  if (authToken) {
      console.log("Utilisateur authentifié, affichant <<logout>>.");
      if (loginMenu) loginMenu.style.display = "none"; // Oculta "Login"
      if (logoutMenu) logoutMenu.classList.remove("hidden"); // Muestra "Logout"
  } else {
      console.log("Utilisateur non authentifié, affichant Login.");
      if (loginMenu) loginMenu.style.display = "block"; // Masquer « Login »
      if (logoutMenu) logoutMenu.classList.add("hidden"); // Masquer « Logout »
  }

  // Événement pour se déconnecter
  if (logoutBtn) {
      logoutBtn.addEventListener("click", (event) => {
          event.preventDefault();
          localStorage.removeItem("authToken");
          console.log("Séance close.");
          window.location.reload(); // Recharger la page pour appliquer les modifications
      });
  }
  console.log(document.getElementById("login-menu"));
console.log(document.getElementById("logout-menu"));
});


// Sélection du conteneur de la galerie
const galleryContainer = document.querySelector(".gallery");

// Sélection des boutons de filtre
const filterButtons = document.querySelectorAll(".filter-btn");

// Variable globale pour stocker les données de la galerie
let galleryData = [];

// Fonction pour créer et ajouter des éléments de galerie
function populateGallery(items) {
  const galleryContainer = document.querySelector(".gallery");
  galleryContainer.innerHTML = "";

  if (!Array.isArray(items) || items.length === 0) {
      console.warn("Il n'y a aucun travail disponible à afficher.");
      galleryContainer.innerHTML = "<p>Aucune image disponible.</p>";
      return;
  }

  items.forEach((item) => {
      if (!item.imageUrl || !item.title) {
          console.warn("Travail non valide détectée :", item);
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

// Fonction pour gérer les clics sur les boutons
function handleFilterClick(event) {
  // Supprimer la classe « active » de tous les boutons
  filterButtons.forEach(button => button.classList.remove('active'));

  // Ajoutez la classe « active » au bouton cliqué
  event.target.classList.add('active');

  // Obtenir le filtre sélectionné
  const filter = event.target.getAttribute('data-filter');

  if (filter === 'all') {
    // Afficher tous les articles
    populateGallery(galleryData);
  } else {
    // Filtrer les éléments par la catégorie sélectionnée
    const filteredData = galleryData.filter(item => 
      item.category.name === filter
    );
    populateGallery(filteredData);
  }
}

// Obtenir des données à partir de l'API
fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(data => {
    galleryData = data; // Affecte les données à la variable globale
    console.log('Données téléchargées :', galleryData);
    populateGallery(galleryData); //Afficher la galerie initiale

    // Marquer le bouton « Tous » comme actif au chargement de la page
    const allButton = document.querySelector('.filter-btn[data-filter="all"]');
    if (allButton) {
      allButton.classList.add('active');
    }
  })
  .catch(error => console.error('Error fetching data:', error));

// Affecter l'événement « clic » à tous les boutons de filtre
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
      console.log("Travais obtenus avec succès :", works);

      if (!Array.isArray(works)) {
          throw new Error("L'API n'a pas renvoyé de arrays valide.");
      }

      return works;
  } catch (error) {
      console.error("Erreur lors de l'obtention des travais :", error);
      return []; // Renvoie un array vide pour éviter les erreurs
  }
}

async function initializeGallery() {
  try {
      const works = await fetchWorks();

      if (!Array.isArray(works) || works.length === 0) {
          console.warn("Aucune entrée valide n'a été reçue.");
          return;
      }

      populateGallery(works);
  } catch (error) {
      console.error("Erreur lors de l'initialisation de la galerie :", error);
  }
}

// Exécuter au chargement de la page
document.addEventListener("DOMContentLoaded", initializeGallery);




