///////////// Sélectionnez le conteneur de la galerie////////////////////////

document.addEventListener('DOMContentLoaded', async () => {
  const galleryContainer = document.querySelector('.gallery');
  const modalGallery = document.getElementById('modal-gallery');
  const photoPreview = document.querySelector('.photo-preview');
  const uploadForm = document.getElementById('upload-form');
  const filterButtons = document.querySelectorAll(".filter-btn");
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
//FIN ////////////////////////////////////////////////////////////////////

// Récupérer les données de l'API/////////////////////////////////////////

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

// Sélectionnez les boutons de filtre/////////////////////////////



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


// Función para renderizar galería
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

// Inicialización de la galería
async function initializeGallery() {
  galleryData = await fetchWorks();
  populateGallery(galleryData);
}

// Vista previa de imagen
document.getElementById('photo-upload').addEventListener('change', function(event) {
  const fileInput = event.target;

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();

    reader.onload = function(e) {
      photoPreview.innerHTML = '';
      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = 'Vista previa de la imagen';
      img.style.maxWidth = '100%';
      img.style.maxHeight = '200px';
      photoPreview.appendChild(img);
    };

    reader.readAsDataURL(fileInput.files[0]);
  } else {
    photoPreview.innerHTML = '<p>Pas d\'image sélectionnée.</p>';
  }
});

// Enviar formulario
uploadForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  const formData = new FormData(uploadForm);
  const authToken = localStorage.getItem('authToken');

  if (!authToken) {
    alert('El usuario no está autenticado. Por favor, inicie sesión.');
    return;
  }

  try {
    const response = await fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: formData
    });

    if (response.ok) {
      alert('Photo ajoutée avec succès !');
      uploadForm.reset();
      photoPreview.innerHTML = '<p>Pas d\'image sélectionnée.</p>';
      galleryData = await fetchWorks();
      populateGallery(galleryData);
    } else {
      alert('Erreur lors de l\'ajout de la photo.');
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi du formulaire:', error);
    alert('Erreur lors de l\'envoi du formulaire.');
  }
});

// Cargar categorías
async function loadCategories() {
  try {
    const response = await fetch('http://localhost:5678/api/categories');
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    const categories = await response.json();
    const categorySelect = document.getElementById('category');
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error);
  }
}

await initializeGallery();
loadCategories();
});

function populateModalGallery(items) {
  modalGallery.innerHTML = ''; // Limpia el contenido existente

  if (!Array.isArray(items) || items.length === 0) {
    modalGallery.innerHTML = '<p>Aucun projet à afficher.</p>';
    return;
  }

  items.forEach(item => {
    // Contenedor de cada imagen en el modal
    const modalItem = document.createElement('div');
    modalItem.classList.add('modal-item');

    // Crear la imagen
    const img = document.createElement('img');
    img.src = item.imageUrl;
    img.alt = item.title;

    // Crear el botón de eliminación
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.style.backgroundImage = "url('assets/icons/poubelle.png')";
    deleteBtn.addEventListener('click', () => deleteWork(item.id, modalItem));

    // Añadir la imagen y el botón al contenedor
    modalItem.appendChild(img);
    modalItem.appendChild(deleteBtn);

    // Añadir el contenedor al modal-gallery
    modalGallery.appendChild(modalItem);
  });
}



async function deleteWork(id, modalItem) {
  const confirmDelete = confirm("¿Seguro que deseas eliminar este elemento?");
  if (!confirmDelete) return;

  // const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4"; // Token proporcionado

  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (response.ok) {
      modalItem.remove(); // Elimina el elemento del DOM
      alert("Elemento eliminado con éxito");

      // Actualizar galería
      galleryData = galleryData.filter(work => work.id !== id);
      populateGallery(galleryData); // Actualiza la galería principal
      populateModalGallery(galleryData); // Actualiza el modal
    } else {
      const error = await response.json();
      console.error('Error al eliminar:', error);
      alert('No se pudo eliminar el elemento');
    }
  } catch (error) {
    console.error('Error en la eliminación:', error);
    alert('Error al comunicarse con el servidor');
  }
}
