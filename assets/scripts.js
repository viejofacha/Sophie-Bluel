// Sélectionnez le conteneur de la galerie
const galleryContainer = document.querySelector(".gallery");

// Variable globale pour stocker les données de la galerie
let galleryData = [];

// Fonction pour créer et ajouter des éléments de galerie
function populateGallery(items) {
  galleryContainer.innerHTML = "";
  items.forEach(item => {
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

// Récupérer les données de l'API
fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(data => {
    galleryData = data; // Affecter les données à la variable globale
    console.log('Datos cargados:', galleryData);
    populateGallery(galleryData); // Afficher la galerie initiale
  
// Marquer le bouton « Tous » comme actif au chargement de la page
  const allButton = document.querySelector('.filter-btn[data-filter="all"]');
    if (allButton) {
      allButton.classList.add('active');
    }
  })

  .catch(error => console.error('Error fetching data:', error));

// Sélectionnez les boutons de filtre
const filterButtons = document.querySelectorAll(".filter-btn");

// Fonction pour gérer les clics sur les boutons
function handleFilterClick(event) {
  // Supprimer la classe « active » de tous les boutons
  filterButtons.forEach(button => button.classList.remove('active'));

  // Ajoutez la classe « active » au bouton cliqué
  event.target.classList.add('active');

  // Obtenir le filtre sélectionné
  const filter = event.target.getAttribute('data-filter');

  if (filter === 'all') {
    // Afficher tous les éléments
    populateGallery(galleryData);
  } else {
    // Filtrer les éléments par la catégorie sélectionnée
    const filteredData = galleryData.filter(item => 
      item.category.name === filter
    );
    populateGallery(filteredData);
  }
}


// Affecter l'événement « clic » à tous les boutons de filtre
filterButtons.forEach(button => {
  button.addEventListener('click', handleFilterClick);
});
////////////////////modal///////////////////
document.addEventListener('DOMContentLoaded', async () => {
  const galleryContainer = document.querySelector('.gallery');
  const modalGallery = document.getElementById('modal-gallery');

  async function fetchWorks() {
    try {
      const response = await fetch('http://localhost:5678/api/works');
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const works = await response.json();
      console.log('Datos obtenidos:', works);
      return works;
    } catch (error) {
      console.error('Erreur lors de la récupération des travaux:', error);
      alert('Erreur lors de la récupération des travaux. Veuillez réessayer plus tard.');
      return [];
    }
  }

  function populateGallery(items) {
    galleryContainer.innerHTML = '';
    items.forEach(item => {
      const galleryItem = document.createElement('figure');
      galleryItem.classList.add('gallery-item');

      const img = document.createElement('img');
      img.src = item.imageUrl;
      img.alt = item.title;

      const figcaption = document.createElement('figcaption');
      figcaption.textContent = item.title;

      galleryItem.appendChild(img);
      galleryItem.appendChild(figcaption);
      galleryContainer.appendChild(galleryItem);
    });
  }

  function populateModalGallery(items) {
    modalGallery.innerHTML = '';
    if (!Array.isArray(items) || items.length === 0) {
      modalGallery.innerHTML = '<p>Aucun projet à afficher.</p>';
      return;
    }

    items.forEach(item => {
      const modalItem = document.createElement('div');
      modalItem.classList.add('modal-item');

      const img = document.createElement('img');
      img.src = item.imageUrl;
      img.alt = item.title;

      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('delete-btn');
      deleteBtn.style.backgroundImage = "url('assets/icons/poubelle.png')";
      deleteBtn.addEventListener('click', () => console.log('Eliminar:', item.id));

      modalItem.appendChild(img);
      modalItem.appendChild(deleteBtn);
      modalGallery.appendChild(modalItem);
    });
  }

  const works = await fetchWorks(); // Obtén los datos desde la API
  populateGallery(works); // Llena la galería del fondo
  populateModalGallery(works); // Llena la galería del modal
});



