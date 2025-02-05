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
  const addPhotoBtn = document.getElementById("ajouter-photo-btn");
  const uploadForm = document.getElementById("upload-form");
  const returnToGalleryBtn = document.querySelector(".arrow-left a"); // Botón de retroceso

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
      console.error("Error obteniendo trabajos:", error);
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
    if (!confirm("¿Quieres eliminar este proyecto?")) return;
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
        console.error("Error al eliminar el proyecto.");
      }
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error);
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
      console.error("Error al cargar categorías:", error);
    }
  }

  async function handleImageUpload(event) {
    event.preventDefault();
    const formData = new FormData(uploadForm);
    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
        body: formData,
      });
      if (response.ok) {
        alert("Foto agregada correctamente.");
        uploadForm.reset();
        galleryData = await fetchWorks();
        populateGallery(galleryData);
       } 
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  }

  function openModal() {
    modal.classList.remove("hidden");
    body.classList.add("modal-open");
  }

  function closeModal() {
    modal.classList.add("hidden");
    body.classList.remove("modal-open");
  }

  if (authToken && isEditMode) {
    console.log("Modo edición activado...");
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
    console.log("Modo edición desactivado...");
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

  if (closeUploadModalBtn) {
    closeUploadModalBtn.addEventListener("click", (event) => {
      event.preventDefault();
      uploadSection.classList.add("hidden");
    });
  }

  // **Flecha para volver al modal anterior**
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

  uploadForm.addEventListener("submit", handleImageUpload);

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
    console.log(
      "Modo edición detectado:",
      window.location.search.includes("mode=edit")
    );
    console.log("🔑 Token de autenticación:", authToken);
  }

  // Aperçu de l'image
  document
    .getElementById("photo-upload")
    .addEventListener("change", function (event) {
      const fileInput = event.target;
      const uploadButton = document.querySelector(".photo-preview label");
      if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
          // photoPreview.innerHTML = '';
          const img = document.createElement("img");
          img.src = e.target.result;
          img.alt = "Vista previa, de la imagen";
          img.style.maxWidth = "100%";
          img.style.maxHeight = "200px";
          photoPreview.appendChild(img);
        };
        const fileInput = document.getElementById("photo-upload");
        if (!fileInput.files[0]) {
          alert("Por favor, selecciona una imagen antes de subir.");
          return;
        }
        reader.readAsDataURL(fileInput.files[0]);
        if (uploadButton) uploadButton.style.display = "none";
      } else {
        photoPreview.innerHTML = "";
        if (uploadButton) uploadButton.style.display = "block";
      }
      console.log(document.querySelector("#photo-upload"));
    });

  // Envoyer le formulaire
  uploadForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    // uploadForm.elements[3].remove()
    const formData = new FormData();
    formData.append("title", uploadForm.elements[1].value);
    formData.append("image", uploadForm.elements[0].files[0]);
    formData.append("category", uploadForm.elements[2].value);
    console.log(formData);
    console.log(uploadForm.elements);
    const imageField = document.querySelector("#photo-upload");
    const titleField = document.querySelector("#title");
    const categoryField = document.querySelector("#category");
    console.log(imageField.files[0], titleField, categoryField);
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      alert("El usuario no está autenticado. Por favor, inicie sesión.");
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
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
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
        photoPreview.innerHTML = "";
        galleryData = await fetchWorks();
        populateGallery(galleryData);
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

  // });

  document.addEventListener("DOMContentLoaded", initializeGallery); //First Call

  // Appeler la fonction lorsque la page se charge
  document.addEventListener("DOMContentLoaded", () => {
    initializeGallery();
  }); //Second Call
  async function fetchDataAndProcess() {
    // WRONG: await is not allowed here
    const response = await fetch("/api/data");
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

  // Appeler la fonction une fois la modale ouverte
  document.getElementById("ajouter-photo-btn").addEventListener("click", () => {
    loadCategories();
    console.log("Modal de chargement ouvert. Chargement des catégories...");
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
});
// else {
//   alert("Error al agregar la foto.");
// }