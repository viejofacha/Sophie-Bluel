document.addEventListener("DOMContentLoaded", () => {
  const authToken = localStorage.getItem("authToken");
  const urlParams = new URLSearchParams(window.location.search);
  const isEditMode = urlParams.get("mode") === "edit";
  const body = document.body;
  const editionBar = document.querySelector(".edition");
  const addWorkBtn = document.getElementById("add-work-btn");
  const filtersSection = document.getElementById("filters-section");

  const modal = document.getElementById("modal");
  const modalGallerySection = document.getElementById("modal-gallery-section");
  const uploadSection = document.getElementById("upload-section");
  const modalGallery = document.getElementById("modal-gallery");
  const closeModalBtn = document.querySelector("#modal-gallery-section span a");
  const closeUploadModalBtn = document.querySelector(
    "#upload-section .xmark a"
  );
  const closeAddModalBtn = document.querySelector("#upload-return-to-gallery");
  const addPhotoBtn = document.getElementById("ajouter-photo-btn");
  const uploadForm = document.getElementById("upload-form");

  const returnToGalleryBtn = document.querySelector(".arrow-left a"); //Bouton retour
  let galleryData = [];
  // Assurez-vous que photoPreview existe avant de l'utiliser
  let photoPreview = document.querySelector(".photo-preview");
  if (!photoPreview) {
    console.warn(".photo-preview n'a pas été trouvé dans le DOM.");
  }

  async function fetchWorks() {
    try {
      const response = await fetch("http://localhost:5678/api/works");
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const works = await response.json();
      return works;
    } catch (error) {
      console.error("Erreur lors de l'obtention des images :", error);
      return [];
    }
  }

  function populateModalGallery(items) {
    modalGallery.innerHTML = "";
    if (!Array.isArray(items) || items.length === 0) {
      modalGallery.innerHTML = "<p>Aucun projet à afficher.</p>";
      return;
    }
    items.forEach((item) => {
      const modalItem = document.createElement("div");
      modalItem.classList.add("modal-item");

      const img = document.createElement("img");
      img.src = item.imageUrl;
      img.alt = item.title;

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.style.backgroundImage = "url('assets/icons/poubelle.png')";
      deleteBtn.addEventListener("click", () => deleteWork(item.id, modalItem));

      modalItem.appendChild(img);
      modalItem.appendChild(deleteBtn);
      modalGallery.appendChild(modalItem);
    });
  }

  async function deleteWork(id, modalItem) {
    if (!confirm("Voulez-vous supprimer ce projet ?")) return;
    try {
      const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        modalItem.remove();
        galleryData = galleryData.filter((work) => work.id !== id);
        populateGallery(galleryData);
      } else {
        console.error("Erreur lors de la suppression du projet.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du projet.", error);
    }
  }

  async function loadCategories() {
    try {
      const response = await fetch("http://localhost:5678/api/categories");
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const categories = await response.json();
      const categorySelect = document.getElementById("category");
      categorySelect.innerHTML = "<option value='' disabled selected></option>";
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    } catch (error) {
      console.error("Erreur lors du chargement des catégories ::", error);
    }
  }

  // ////////////////////
  function openModal() {
    modal.classList.remove("hidden");
    body.classList.add("modal-open");
  }

  function closeModal() {
    modal.classList.add("hidden");
    body.classList.remove("modal-open");
  }

  if (authToken && isEditMode) {
    if (editionBar) editionBar.classList.remove("hidden");
    if (addWorkBtn) addWorkBtn.style.display = "block";
    if (filtersSection) filtersSection.style.display = "none";

    if (addWorkBtn) {
      addWorkBtn.addEventListener("click", (event) => {
        event.preventDefault();
        openModal();
        populateModalGallery(galleryData);
      });
    }
  } else {
    if (editionBar) editionBar.classList.add("hidden");
    if (addWorkBtn) addWorkBtn.style.display = "none";
    if (filtersSection) filtersSection.style.display = "flex";
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", (event) => {
      event.preventDefault();
      closeModal();
    });
  }
  if (closeAddModalBtn) {
    closeAddModalBtn.addEventListener("click", (event) => {
      event.preventDefault();
      closeModal();
    });
  }
  if (closeUploadModalBtn) {
    closeUploadModalBtn.addEventListener("click", (event) => {
      event.preventDefault();
      uploadSection.classList.add("hidden");
    });
  }

  // **Flèche pour revenir à la modale précédente**
  if (returnToGalleryBtn) {
    returnToGalleryBtn.addEventListener("click", (event) => {
      event.preventDefault();
      uploadSection.classList.add("hidden");
      modalGallerySection.classList.remove("hidden");
    });
  }

  window.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  // uploadForm.addEventListener("submit", handleImageUpload);

  galleryData = fetchWorks().then((data) => {
    galleryData = data;
    populateGallery(galleryData);
  });

  addWorkBtn?.addEventListener("click", openModal);
  addPhotoBtn?.addEventListener("click", () => {
    modalGallerySection.classList.add("hidden");
    uploadSection.classList.remove("hidden");
  });

  // ==============================
  // CHARGEMENT INITIAL DES DONNÉES
  // ==============================
  async function initializeGallery() {
    galleryData = await fetchWorks();
  }

  // Aperçu de l'image
  document
    .getElementById("photo-upload")
    .addEventListener("change", function (event) {
      const fileInput = event.target;
      const uploadButton = document.querySelector(".photo-form label"); // Bouton de téléchargement d'image
      const photoPreview = document.querySelector(".photo-preview"); // Conteneur d'aperçu
      const texto = document.querySelector(".texto"); // Texto "jpg, png : 4mo max"

      if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
          photoPreview.innerHTML = "";
          const img = document.createElement("img");
          img.src = e.target.result;
          img.alt = "Aperçu de l'image";
          img.style.maxWidth = "100%";
          img.style.maxHeight = "200px";
          photoPreview.appendChild(img);
        };

        reader.readAsDataURL(fileInput.files[0]);

        if (uploadButton) uploadButton.style.display = "none";
        if (texto) texto.style.display = "none";
      } else {
        photoPreview.innerHTML = "";
        if (uploadButton) uploadButton.style.display = "block";
        if (texto) texto.style.display = "block";
      }
    });

  function updateValidationButton() {
    const fileInput = document.getElementById("photo-upload");
    const titleInput = document.getElementById("title");
    const categorySelect = document.getElementById("category");
    const submitBtn = document.querySelector(".valider-btn");

    if (
      fileInput.files.length > 0 &&
      titleInput.value.trim() !== "" &&
      categorySelect.value !== ""
    ) {
      submitBtn.classList.add("activando");
      submitBtn.style.backgroundColor = "#1d6154";
      submitBtn.disabled = false; // Activer le bouton
    } else {
      submitBtn.classList.remove("activando");
      submitBtn.style.backgroundColor = ""; // Revenir à la couleur d'origine s'il manque quelque chose
      submitBtn.disabled = true; // Bloquer le bouton s'il manque quelque chose
    }
  }

  // Assurez-vous que `submitBtn` n'est déclenché que lorsque tous les champs sont remplis
  document
    .getElementById("photo-upload")
    .addEventListener("change", updateValidationButton);
  document
    .getElementById("title")
    .addEventListener("input", updateValidationButton);
  document
    .getElementById("category")
    .addEventListener("change", updateValidationButton);

  document.addEventListener("DOMContentLoaded", function () {
    // Récupérez les éléments une fois le DOM chargé.
    const photoPreview = document.querySelector(".photo-preview");
    const uploadButton = document.querySelector(".photo-preview label");
    const title = document.getElementById("title");
    const categorySelect = document.getElementById("category");
    const submitBtn = document.querySelector(".valider-btn");

    // Vérifiez si des éléments ont été trouvés avant d'ajouter des écouteurs d'événements
    if (
      !photoPreview ||
      !uploadButton ||
      !title ||
      !categorySelect ||
      !submitBtn
    ) {
      console.error("One or more elements not found in the DOM.");
      return; // Quitter la fonction si des éléments manquent
    }

    photoPreview.addEventListener("change", function (event) {
      if (
        uploadButton.style.display === "none" && // Maintenant, uploadButton est défini
        title.value !== "" &&
        categorySelect.value !== ""
      ) {
        submitBtn.classList.add("valider-btn", "activando");
      } else {
        submitBtn.classList.remove("activando");
      }
    });

  title.addEventListener("change", function (event) {
    if (
      title.value !== "" &&
      uploadButton.style.display === "none" &&
      categorySelect.value !== ""
    ) {
      submitBtn.classList.add("activando");
    } else {
      submitBtn.classList.remove("activando");
    }
  });

    categorySelect.addEventListener("change", function (event) {
      if (
        title.value !== "" &&
        uploadButton.style.display === "none" && // Maintenant, uploadButton est défini
        categorySelect.value !== ""
      ) {
        submitBtn.classList.add("valider-btn", "activando");
      } else {
        submitBtn.classList.remove("activando");
      }
    });
    // Envoyer le formulaire
  });
  uploadForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", uploadForm.elements[1].value);
    formData.append("image", uploadForm.elements[0].files[0]);
    formData.append("category", uploadForm.elements[2].value);

    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      alert("L'utilisateur n'est pas authentifié. Veuillez vous connecter.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
        body: formData,
      });

      if (response.ok) {
        alert("Photo ajoutée avec succès !");
        uploadForm.reset();
        resetUploadModal();
        // Restaurer `submitBtn` après le téléchargement
        const submitBtn = document.querySelector(".valider-btn");
        if (submitBtn) {
          submitBtn.style.backgroundColor = ""; // Revenir à sa couleur d'origine
          submitBtn.classList.remove("activando");
          submitBtn.disabled = true;// Désactiver jusqu'à ce que l'utilisateur remplisse à nouveau les champs
        }

        // Restaurer le champ d'aperçu de l'image
        const photoPreview = document.querySelector(".photo-preview");
        if (photoPreview) {
          photoPreview.innerHTML = ""; // Nettoyer l'image après validation
        }

        // Recharger la galerie sans actualiser la page
        galleryData = await fetchWorks();
        populateGallery(galleryData);
        populateModalGallery(galleryData);
      } else {
        alert("Erreur lors de l'ajout de la photo.");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      alert("Erreur lors de l'envoi du formulaire.");
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
});

document.addEventListener("DOMContentLoaded", initializeGallery); //First Call

// Appeler la fonction lorsque la page se charge
document.addEventListener("DOMContentLoaded", () => {
  initializeGallery();
}); //Second Call
async function fetchDataAndProcess() {
  // WRONG: await is not allowed here
  const response = await fetch("/api/data");
  const data = await response.json();
}
document.addEventListener("DOMContentLoaded", async () => {
  await loadCategories(); // Charger les catégories une fois le DOM entièrement chargé
  console.log("Categorías cargadas correctamente");
});

// ==============================
//  CHARGER LES CATÉGORIES DANS LE FORMULAIRE
// ==============================
async function loadCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    const categories = await response.json();

    const categorySelect = document.getElementById("category");
    if (!categorySelect) {
      console.error("L'élément #category n'existe pas dans le DOM.");
      return;
    }

    categorySelect.innerHTML = ""; // Effacer toutes les options précédentes

    // Ajouter une option par défaut vide
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "";
    defaultOption.selected = true;
    defaultOption.disabled = true;
    categorySelect.appendChild(defaultOption);

    // Ajout de catégories à partir de l'API
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des catégories:", error);
  }
}

document.getElementById("ajouter-photo-btn")?.addEventListener("click", () => {
  const modalGallerySection = document.getElementById("modal-gallery-section");
  const uploadSection = document.getElementById("upload-section");

  if (modalGallerySection) modalGallerySection.classList.add("hidden");
  if (uploadSection) uploadSection.classList.remove("hidden");

  resetUploadModal(); // Appelez la fonction pour réinitialiser le formulaire
  loadCategories();
});

const backButton = document.querySelector(".arrow-left a"); // Trouver le bouton

if (backButton) {
  backButton.addEventListener("click", (event) => {
    event.preventDefault(); // Empêcher le rechargement de la page

    // Masquer la modale actuelle et revenir à la précédente si nécessaire
    const uploadModal = document.getElementById("upload-modal");
    if (uploadModal) {
      uploadModal.classList.add("hidden");
    }
  });
} else {
  console.error("⚠️ .arrow-left n'a pas été trouvé dans le DOM.");
}
// });
// //////////////////////
function closeUploadModal() {
  const uploadSection = document.getElementById("upload-section");
  const modalGallerySection = document.getElementById("modal-gallery-section");

  if (uploadSection) uploadSection.classList.add("hidden"); // Masquer la fenêtre de téléchargement
  if (modalGallerySection) modalGallerySection.classList.remove("hidden"); // Afficher la galerie principale
}
document
  .querySelector("#upload-section .xmark a")
  ?.addEventListener("click", (event) => {
    event.preventDefault();
    closeUploadModal();
  });
document.getElementById("add-work-btn")?.addEventListener("click", (event) => {
  event.preventDefault();
  const modal = document.getElementById("modal");
  const body = document.body;
  const modalGallerySection = document.getElementById("modal-gallery-section");
  const uploadSection = document.getElementById("upload-section");

  if (modal) {
    modal.classList.remove("hidden"); // Assurez-vous que la fenêtre modale est affichée
    body.classList.add("modal-open"); // Appliquer un arrière-plan sombre

    // Assurez-vous que la section modal-gallery est visible et que la section upload-section est masquée
    if (modalGallerySection) modalGallerySection.classList.remove("hidden");
    if (uploadSection) uploadSection.classList.add("hidden");
  }
});
// //////////////////////
function resetUploadModal() {
  const photoPreview = document.querySelector(".photo-preview img"); 
  const addPhotoLabel = document.querySelector(".photo-form label"); 
  const fileInput = document.getElementById("photo-upload"); 
  const fileInfoText = document.querySelector(".texto"); 
  const categorySelect = document.getElementById("category"); 
  const titleInput = document.getElementById("title"); 
  const submitBtn = document.querySelector(".valider-btn");
  if (photoPreview) {
    // Vérifiez si photoPreview n'est pas nul
    photoPreview.innerHTML = "";
  }
  fileInput.value = "";
  title.value = "";
  categorySelect.selectedIndex = 0;
  submitBtn.style.backgroundColor = "";
  submitBtn.disabled = true;
  document.querySelector(".photo-form label").style.display = "block";
  document.querySelector(".texto").style.display = "block";
  // Supprimer l'image précédente si elle existe
  if (photoPreview && photoPreview.parentNode) {
    // Vérifiez si photoPreview n'est pas nul et s'il a un parent
    photoPreview.remove();
  }
  if (addPhotoLabel) {
    addPhotoLabel.style.display = "block";
  }
  if (fileInfoText) {
    fileInfoText.style.display = "block";
  }
  if (fileInput) {
    fileInput.value = "";
  }
  if (categorySelect) {
    categorySelect.selectedIndex = 0;
  }
  if (titleInput) {
    titleInput.value = "";
  }

  restoreUploadButton();

function restoreUploadButton() {
  const uploadContainer = document.querySelector(".photo-form"); 
  const addPhotoLabel = document.querySelector(".photo-form label");
  const fileInput = document.getElementById("photo-upload");
  const fileInfoText = document.querySelector(".texto");

  if (!uploadContainer) {
    console.warn("⚠️ Vous ne trouverez pas le contenu de l'image");
    return;
  }

  if (!addPhotoLabel) {
    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", "photo-upload");
    newLabel.classList.add("upload-label");
    newLabel.innerHTML = "<text>+ Ajouter photo</text>";
    uploadContainer.appendChild(newLabel);
  } else {
    addPhotoLabel.style.display = "block"; // Afficher le bouton
  }

  if (fileInput) fileInput.value = "";// Réinitialiser l'entrée du fichier
  if (fileInfoText) fileInfoText.style.display = "block"; // Afficher le texte
}
}
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const modalOverlay = document.querySelector(".modal-overlay");
  const closeModalBtn = document.querySelector(".close-modal");

  function closeModal() {
    modal.classList.add("hidden");
  }

  // Fermer modal al faire cliquer sur le fond gris
  modalOverlay?.addEventListener("click", closeModal);

  // Aussi fermer le modal avec le bouton (X)
  closeModalBtn?.addEventListener("click", closeModal);
});
