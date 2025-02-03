document.addEventListener("DOMContentLoaded", async () => {
    const authToken = localStorage.getItem("authToken");
    const urlParams = new URLSearchParams(window.location.search);
    const isEditMode = urlParams.get("mode") === "edit";
    const body = document.body;
    const editionBar = document.querySelector(".edition");
    const addWorkBtn = document.getElementById("add-work-btn");
    const modal = document.getElementById("modal");
    const modalGallery = document.getElementById("modal-gallery");
    const uploadModal = document.getElementById("upload-modal");
    const closeModalBtn = document.querySelector("#modal span a");
    const closeUploadModalBtn = document.querySelector("#upload-modal .xmark a");
    const addPhotoBtn = document.getElementById("ajouter-photo-btn");
    const uploadForm = document.getElementById("upload-form");
    let galleryData = [];

    // Assurez-vous que photoPreview existe avant de l'utiliser
    let photoPreview = document.querySelector(".photo-preview");
    if (!photoPreview) {
        console.warn(".photo-preview n'a pas été trouvé dans le DOM.");
    }

  // ==============================
  // MODE ÉDITION : Afficher les éléments si l'utilisateur est authentifié
  // ==============================
  if (authToken && isEditMode) {
    console.log(" Mode édition activé...");
    if (editionBar) editionBar.classList.remove("hidden"); // Afficher la barre noire
    if (addWorkBtn) addWorkBtn.style.display = "block"; // Afficher le bouton Ajouter une image

    // Evénement pour ouvrir la modale en cliquantadd-work-btn
    if (addWorkBtn && modal) {
      addWorkBtn.addEventListener("click", (event) => {
        event.preventDefault();
        modal.classList.remove("hidden");
        populateModalGallery(galleryData); // Charger des images dans la fenêtre modale
        console.log(" Ouvrir la fenêtre modale de suppression.");
      });
    } else {
      console.error("Modal ou bouton non trouvé add-work-btn.");
    }
  } else {
    console.log(" Mode édition désactivé...");
    if (editionBar) editionBar.classList.add("hidden"); // Masquer la barre noire
    if (addWorkBtn) addWorkBtn.style.display = "none"; // Masquer le bouton si vous n'êtes pas administrateur
  }

  // ==============================
  //  FONCTION POUR CHARGER LA GALERIE DANS LA MODALE
  // ==============================
  async function fetchWorks() {
    try {
      const response = await fetch("http://localhost:5678/api/works");
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      const works = await response.json();
      console.log(" Travais obtenus avec succès :", works);

      if (!Array.isArray(works))
        throw new Error("L'API n'a pas renvoyé de array válide.");
      return works;
    } catch (error) {
      console.error("Erreur lors de l'obtention des travais:", error);
      return [];
    }
  }

  function populateModalGallery(items) {
    modalGallery.innerHTML = ""; // Effacer le contenu existant

    if (!Array.isArray(items) || items.length === 0) {
      modalGallery.innerHTML = "<p>Aucun projet à afficher.</p>";
      return;
    }

    items.forEach((item) => {
      // Conteneur pour chaque image dans la modale
      const modalItem = document.createElement("div");
      modalItem.classList.add("modal-item");

      // Créer l'image
      const img = document.createElement("img");
      img.src = item.imageUrl;
      img.alt = item.title;

      // Créer le bouton de suppression
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.style.backgroundImage = "url('assets/icons/poubelle.png')";
      deleteBtn.addEventListener("click", () => deleteWork(item.id, modalItem));

      // Ajoutez l'image et le bouton au conteneur
      modalItem.appendChild(img);
      modalItem.appendChild(deleteBtn);

      // Ajoutez le conteneur à la galerie modale
      modalGallery.appendChild(modalItem);
    });

    console.log("Galerie chargée dans la modale avec poubelle.");
  }

  async function deleteWork(id, modalItem) {
    const confirmDelete = confirm(
      "Etes-vous sûr de vouloir supprimer ce projet ?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        modalItem.remove();
        galleryData = galleryData.filter((work) => work.id !== id);
        populateModalGallery(galleryData);
        console.log("Projet supprimé avec succès.");
      } else {
        console.error("Erreur lors de la suppression du projet.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  }

  

  if (addWorkBtn) {
    addWorkBtn.addEventListener("click", (event) => {
        event.preventDefault();
        modal.classList.remove("hidden");
        body.classList.add("modal-open"); // Ajouter une classe au body
        console.log("Modale de suppression est ouverte.");
    });
}

if (addPhotoBtn) {
    addPhotoBtn.addEventListener("click", (event) => {
        event.preventDefault();
        uploadModal.classList.remove("hidden");
        body.classList.add("modal-open"); // Ajouter une classe au body
        console.log("Modal de chargement est ouverte.");
    });
}

// **Fermer les modales**
if (closeModalBtn) {
    closeModalBtn.addEventListener("click", (event) => {
        event.preventDefault();
        modal.classList.add("hidden");
        body.classList.remove("modal-open"); // Supprimer la classe debody
        console.log("Modal de suppression est fermée.");
    });
}

if (closeUploadModalBtn) {
    closeUploadModalBtn.addEventListener("click", (event) => {
        event.preventDefault();
        uploadModal.classList.add("hidden");
        body.classList.remove("modal-open"); // Supprimer la classe de body
        console.log("Modal de chargement fermé.");
    });
}

// **Fermer les modales en un clic**
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.classList.add("hidden");
        body.classList.remove("modal-open");
        console.log("Modalité d'élimination fermé en cliquant à l'extérieur");
    }
    if (event.target === uploadModal) {
        uploadModal.classList.add("hidden");
        body.classList.remove("modal-open");
        console.log("Modal pour le chargement fermé en cliquant à l'extérieur");
    }
});


  // ==============================
  // CHARGEMENT INITIAL DES DONNÉES
  // ==============================
  galleryData = await fetchWorks();
  console.log(
    "Mode d'édition détecté :",
    window.location.search.includes("mode=edit")
  );
  console.log("🔑 Token d'authentification :", authToken);


// Aperçu de l'image
document.getElementById('photo-upload').addEventListener('change', function(event) {
  const fileInput = event.target;
  const uploadButton = document.querySelector(".photo-preview label");
  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();

    reader.onload = function(e) {
      // photoPreview.innerHTML = '';
      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = 'Vista previa, de la imagen';
      img.style.maxWidth = '100%';
      img.style.maxHeight = '200px';
      photoPreview.appendChild(img);
    };

    reader.readAsDataURL(fileInput.files[0]);
    if (uploadButton) uploadButton.style.display = "none";
  } else {
    photoPreview.innerHTML = '';
    if (uploadButton) uploadButton.style.display = "block";
  }
  console.log(document.querySelector("#photo-upload")); 

});




  // Envoyer le formulaire
  uploadForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    // uploadForm.elements[3].remove()
    const formData = new FormData();
    formData.append('title',uploadForm.elements[1].value );
    formData.append('image',uploadForm.elements[0].files[0] );
    formData.append('category',uploadForm.elements[2].value );
    console.log (formData)
    console.log (uploadForm.elements)
    const imageField = document.querySelector("#photo-upload");
    const titleField = document.querySelector("#title");
    const categoryField = document.querySelector("#category");
    console.log (imageField.files[0],titleField,categoryField);
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      alert('El usuario no está autenticado. Por favor, inicie sesión.');
      return;
    }
    if (!uploadForm) {
      console.error("Error: No se encontró #upload-form en el DOM");
      return;
  } else {
      console.log("Formulario de carga encontrado correctamente.");
  }

  uploadForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      console.log("Formulario de subida enviado.");
      // Voici la suite du code pour envoyer l'image...
  });
    try {
      const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: { Authorization : `Bearer ${authToken}` },
        body: formData
      });

      if (response.ok) {
        alert('Photo ajoutée avec succès !');
        uploadForm.reset();
        photoPreview.innerHTML = '';
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


  async function initializeGallery() {
    try {
        const works = await fetchWorks();

        if (!Array.isArray(works) || works.length === 0) {
            console.warn("Aucune entrée valide n'a été reçue.");
            return;
        }

        populateGallery(works);
    } catch (error) {
        console.error("Erreur lors de l'initialisation de la galerie:", error);
    }
}

// Exécuter au chargement de la page
document.addEventListener("DOMContentLoaded", initializeGallery);

  
  // Appeler la fonction lorsque la page se charge
  document.addEventListener("DOMContentLoaded", async () => {
    await initializeGallery(); // Il est maintenant à l'intérieur d'une fonction async
    await loadCategories();
});

// });

document.addEventListener("DOMContentLoaded", initializeGallery); //First Call

  // Appeler la fonction lorsque la page se charge
  document.addEventListener("DOMContentLoaded", () => {
    initializeGallery();
  }); //Second Call
 async function fetchDataAndProcess() {
    // WRONG: await is not allowed here
    const response = await fetch('/api/data'); 
    const data = await response.json(); 
    console.log(data);
  }

document.addEventListener("DOMContentLoaded", async () => {
  await initializeGallery(); // Télécharger des images
  setTimeout(() => {
      loadCategories(); // Attendez que la modale soit chargée avant de l'exécuter
  }, 500); // Second call to loadCategories()
}); // This closes the listener

// ==============================
//  CHARGER LES CATÉGORIES DANS LE FORMULAIRE
// ==============================
async function loadCategories() {
  try {
      const response = await fetch('http://localhost:5678/api/categories');
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const categories = await response.json();

      const categorySelect = document.getElementById('category');
      if (!categorySelect) {
          console.error("L'élément #category n'existe pas dans le DOM.");
          return;
      }

      categorySelect.innerHTML = ''; // Effacer toutes les options précédentes

      // Ajouter une option par défaut vide
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = '';
      defaultOption.selected = true;
      defaultOption.disabled = true;
      categorySelect.appendChild(defaultOption);

      // Ajout de catégories à partir de l'API
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


// Appeler la fonction une fois la modale ouverte
document.getElementById("ajouter-photo-btn").addEventListener("click", () => {
  loadCategories();
  console.log("Modal de chargement ouvert. Chargement des catégories...");
});
});
const backButton = document.querySelector(".arrow-left a"); // Encuentra el botón

if (backButton) {
    backButton.addEventListener("click", (event) => {
        event.preventDefault(); // Evita que recargue la página
        console.log("🔙 Botón de regreso presionado"); // Verifica en consola si funciona

        // Ocultar el modal actual y volver al anterior si es necesario
        const uploadModal = document.getElementById("upload-modal");
        if (uploadModal) {
            uploadModal.classList.add("hidden");
        }
    });
} else {
    console.error("⚠️ No se encontró .arrow-left en el DOM.");
}
