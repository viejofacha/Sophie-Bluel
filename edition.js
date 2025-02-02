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

    // Asegurar que photoPreview exista antes de usarlo
    let photoPreview = document.querySelector(".photo-preview");
    if (!photoPreview) {
        console.warn("⚠️ No se encontró .photo-preview en el DOM.");
    }

  // ==============================
  // 1️⃣ MODO EDICIÓN: Mostrar elementos si el usuario está autenticado
  // ==============================
  if (authToken && isEditMode) {
    console.log("✅ Modo edición activado...");
    if (editionBar) editionBar.classList.remove("hidden"); // Mostrar barra negra
    if (addWorkBtn) addWorkBtn.style.display = "block"; // Mostrar botón de agregar imagen

    // Evento para abrir el modal al hacer clic en add-work-btn
    if (addWorkBtn && modal) {
      addWorkBtn.addEventListener("click", (event) => {
        event.preventDefault();
        modal.classList.remove("hidden");
        populateModalGallery(galleryData); // Cargar las imágenes en el modal
        console.log("📂 Modal de eliminación abierto.");
      });
    } else {
      console.error("⚠️ No se encontró el modal o el botón add-work-btn.");
    }
  } else {
    console.log("❌ Modo edición desactivado...");
    if (editionBar) editionBar.classList.add("hidden"); // Ocultar barra negra
    if (addWorkBtn) addWorkBtn.style.display = "none"; // Ocultar botón si no es admin
  }

  // ==============================
  // 1️⃣ FUNCIÓN PARA CARGAR LA GALERÍA EN EL MODAL
  // ==============================
  async function fetchWorks() {
    try {
      const response = await fetch("http://localhost:5678/api/works");
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      const works = await response.json();
      console.log("✅ Trabajos obtenidos correctamente:", works);

      if (!Array.isArray(works))
        throw new Error("La API no devolvió un array válido.");
      return works;
    } catch (error) {
      console.error("❌ Error al obtener los trabajos:", error);
      return [];
    }
  }

  function populateModalGallery(items) {
    modalGallery.innerHTML = ""; // Limpia el contenido existente

    if (!Array.isArray(items) || items.length === 0) {
      modalGallery.innerHTML = "<p>Aucun projet à afficher.</p>";
      return;
    }

    items.forEach((item) => {
      // Contenedor de cada imagen en el modal
      const modalItem = document.createElement("div");
      modalItem.classList.add("modal-item");

      // Crear la imagen
      const img = document.createElement("img");
      img.src = item.imageUrl;
      img.alt = item.title;

      // Crear el botón de eliminación
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.style.backgroundImage = "url('assets/icons/poubelle.png')";
      deleteBtn.addEventListener("click", () => deleteWork(item.id, modalItem));

      // Añadir la imagen y el botón al contenedor
      modalItem.appendChild(img);
      modalItem.appendChild(deleteBtn);

      // Añadir el contenedor al modal-gallery
      modalGallery.appendChild(modalItem);
    });

    console.log("📸 Galería cargada en el modal con papelera.");
  }

  async function deleteWork(id, modalItem) {
    const confirmDelete = confirm(
      "¿Seguro que quieres eliminar este proyecto?"
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
        console.log("✅ Proyecto eliminado correctamente.");
      } else {
        console.error("❌ Error al eliminar el proyecto.");
      }
    } catch (error) {
      console.error("❌ Error en la eliminación:", error);
    }
  }

  

  if (addWorkBtn) {
    addWorkBtn.addEventListener("click", (event) => {
        event.preventDefault();
        modal.classList.remove("hidden");
        body.classList.add("modal-open"); // Agregar clase al body
        console.log("📂 Modal de eliminación abierto.");
    });
}

if (addPhotoBtn) {
    addPhotoBtn.addEventListener("click", (event) => {
        event.preventDefault();
        uploadModal.classList.remove("hidden");
        body.classList.add("modal-open"); // Agregar clase al body
        console.log("📂 Modal de carga abierto.");
    });
}

// **Cerrar modales**
if (closeModalBtn) {
    closeModalBtn.addEventListener("click", (event) => {
        event.preventDefault();
        modal.classList.add("hidden");
        body.classList.remove("modal-open"); // Quitar clase del body
        console.log("❌ Modal de eliminación cerrado.");
    });
}

if (closeUploadModalBtn) {
    closeUploadModalBtn.addEventListener("click", (event) => {
        event.preventDefault();
        uploadModal.classList.add("hidden");
        body.classList.remove("modal-open"); // Quitar clase del body
        console.log("❌ Modal de carga cerrado.");
    });
}

// **Cerrar modales al hacer clic fuera**
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.classList.add("hidden");
        body.classList.remove("modal-open");
        console.log("❌ Modal de eliminación cerrado al hacer clic fuera.");
    }
    if (event.target === uploadModal) {
        uploadModal.classList.add("hidden");
        body.classList.remove("modal-open");
        console.log("❌ Modal de carga cerrado al hacer clic fuera.");
    }
});


  // ==============================
  // 3️⃣ CARGA INICIAL DE DATOS
  // ==============================
  galleryData = await fetchWorks();
  console.log(
    "🔍 Modo edición detectado:",
    window.location.search.includes("mode=edit")
  );
  console.log("🔑 Token de autenticación:", authToken);


// Vista previa de imagen
document.getElementById('photo-upload').addEventListener('change', function(event) {
  const fileInput = event.target;
  const uploadButton = document.querySelector(".photo-preview label");
  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();

    reader.onload = function(e) {
      // photoPreview.innerHTML = '';
      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = 'Vista previa de la imagen';
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




  // Enviar formulario
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
      console.error("❌ Error: No se encontró #upload-form en el DOM");
      return;
  } else {
      console.log("✅ Formulario de carga encontrado correctamente.");
  }

  uploadForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      console.log("📤 Formulario de subida enviado.");
      // Aquí continúa el código para enviar la imagen...
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
            console.warn("No se han recibido trabajos válidos.");
            return;
        }

        populateGallery(works);
    } catch (error) {
        console.error("Error al inicializar la galería:", error);
    }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", initializeGallery);

  
  // Llamada a la función cuando se cargue la página
  document.addEventListener("DOMContentLoaded", async () => {
    await initializeGallery(); // Ahora está dentro de una función async
    await loadCategories();
});

// });

document.addEventListener("DOMContentLoaded", initializeGallery); //First Call

  // Llamada a la función cuando se cargue la página
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
  await initializeGallery(); // Cargar imágenes
  setTimeout(() => {
      loadCategories(); // Esperar que el modal esté cargado antes de ejecutar
  }, 500); // Second call to loadCategories()
}); // This closes the listener

// ==============================
// 🔹 CARGAR CATEGORÍAS EN EL FORMULARIO 🔹
// ==============================
async function loadCategories() {
  try {
      const response = await fetch('http://localhost:5678/api/categories');
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const categories = await response.json();

      const categorySelect = document.getElementById('category');
      if (!categorySelect) {
          console.error("❌ El elemento #category no existe en el DOM.");
          return;
      }

      categorySelect.innerHTML = ''; // Limpiar cualquier opción previa

      // Agregar la opción por defecto vacía
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = '';
      defaultOption.selected = true;
      defaultOption.disabled = true;
      categorySelect.appendChild(defaultOption);

      // Agregar las categorías desde la API
      categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category.id;
          option.textContent = category.name;
          categorySelect.appendChild(option);
      });

  } catch (error) {
      console.error('❌ Erreur lors du chargement des catégories:', error);
  }
}


// Llamar a la función después de que el modal esté abierto
document.getElementById("ajouter-photo-btn").addEventListener("click", () => {
  loadCategories();
  console.log("📂 Modal de carga abierto. Cargando categorías...");
});
});