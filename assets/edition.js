document.addEventListener('DOMContentLoaded', async () => {
  const galleryContainer = document.querySelector('.gallery');
  const modalGallery = document.getElementById('modal-gallery');
  const photoPreview = document.querySelector('.photo-preview');
  const uploadForm = document.getElementById('upload-form');
  let galleryData = [];

  // Función para obtener trabajos
  async function fetchWorks() {
    try {
      const response = await fetch('http://localhost:5678/api/works');
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des travaux:', error);
      alert('Erreur lors de la récupération des travaux.');
      return [];
    }
  }

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
  modalGallery.innerHTML = ''; // Limpia el contenido existente del modal
  items.forEach(item => {
    const modalItem = document.createElement('div');
    modalItem.classList.add('modal-item');

    const img = document.createElement('img');
    img.src = item.imageUrl;
    img.alt = item.title;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.style.backgroundImage = "url('assets/icons/poubelle.png')";
    deleteBtn.addEventListener('click', () => deleteWorkFromModal(item.id, modalItem));

    modalItem.appendChild(img);
    modalItem.appendChild(deleteBtn);
    modalGallery.appendChild(modalItem);
  });
}

async function deleteWorkFromModal(id, modalItem) {
  const confirmDelete = confirm("Voulez-vous supprimer ce projet ?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (response.ok) {
      modalItem.remove(); // Elimina el trabajo del DOM
      alert("Projet supprimé avec succès !");
      
      // Actualizar la galería principal después de eliminar
      galleryData = await fetchWorks();
      populateGallery(galleryData);
    } else {
      alert("Erreur lors de la suppression !");
    }
  } catch (error) {
    console.error("Erreur:", error);
  }
}


