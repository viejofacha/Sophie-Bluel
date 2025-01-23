




document.addEventListener('DOMContentLoaded', async () => {
    const galleryContainer = document.querySelector('.gallery');
    const modalGallery = document.getElementById('modal-gallery');
    let galleryData = []; // Variable global para almacenar los datos de la galería
  
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
        const confirmDelete = confirm("Voulez-vous supprimer ce projet ?");
        if (!confirmDelete) return;
      
        const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4"; // Token proporcionado
      
        try {
          const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${authToken}`, // Incluye el token aquí
              'Content-Type': 'application/json'
            }
          });
      
          if (response.ok) {
            modalItem.remove(); // Elimina el elemento del modal
            const updatedGallery = galleryData.filter(work => work.id !== id);
            galleryData = updatedGallery; // Actualiza la galería
            populateGallery(updatedGallery); // Actualiza la galería principal
            alert("Projet supprimé avec succès !");
          } else {
            const errorData = await response.json();
            console.error("Erreur lors de la suppression:", errorData);
            alert("Erreur lors de la suppression !");
          }
        } catch (error) {
          console.error("Erreur lors de la suppression:", error);
          alert("Erreur lors de la suppression. Veuillez réessayer plus tard.");
        }
      }
      
      
      
  
    // Cargar datos y renderizar ambas galerías al cargar la página
    galleryData = await fetchWorks();
    populateGallery(galleryData);
    populateModalGallery(galleryData);
  });
  