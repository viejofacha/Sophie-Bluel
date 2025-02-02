// Selecciona el contenedor de la galería
const galleryContainer = document.querySelector(".gallery");

// Selecciona los botones de filtro
const filterButtons = document.querySelectorAll(".filter-btn");

// Variable global para almacenar los datos de la galería
let galleryData = [];

// Función para crear y añadir los elementos de la galería
function populateGallery(items) {
  const galleryContainer = document.querySelector(".gallery");
  galleryContainer.innerHTML = "";

  if (!Array.isArray(items) || items.length === 0) {
      console.warn("No hay trabajos disponibles para mostrar.");
      galleryContainer.innerHTML = "<p>Aucune image disponible.</p>";
      return;
  }

  items.forEach((item) => {
      if (!item.imageUrl || !item.title) {
          console.warn("Trabajo inválido detectado:", item);
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

// Función para manejar el clic en los botones
function handleFilterClick(event) {
  // Elimina la clase 'active' de todos los botones
  filterButtons.forEach(button => button.classList.remove('active'));

  // Añade la clase 'active' al botón clicado
  event.target.classList.add('active');

  // Obtener el filtro seleccionado
  const filter = event.target.getAttribute('data-filter');

  if (filter === 'all') {
    // Mostrar todos los elementos
    populateGallery(galleryData);
  } else {
    // Filtrar los elementos por la categoría seleccionada
    const filteredData = galleryData.filter(item => 
      item.category.name === filter
    );
    populateGallery(filteredData);
  }
}

// Obtén los datos de la API
fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(data => {
    galleryData = data; // Asigna los datos a la variable global
    console.log('Datos cargados:', galleryData);
    populateGallery(galleryData); // Muestra la galería inicial

    // Marca el botón "All" como activo al cargar la página
    const allButton = document.querySelector('.filter-btn[data-filter="all"]');
    if (allButton) {
      allButton.classList.add('active');
    }
  })
  .catch(error => console.error('Error fetching data:', error));

// Asignar el evento 'click' a todos los botones de filtro
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
      console.log("Trabajos obtenidos correctamente:", works);

      if (!Array.isArray(works)) {
          throw new Error("La API no devolvió un array válido.");
      }

      return works;
  } catch (error) {
      console.error("Error al obtener los trabajos:", error);
      return []; // Devuelve un array vacío para evitar errores
  }
}

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




// ""// ----------------- SCRIPTS.JS -----------------
// document.addEventListener('DOMContentLoaded', async () => {
//     const galleryContainer = document.querySelector('.gallery');
//     const modalGallery = document.getElementById('modal-gallery');
//     const editionSection = document.querySelector('.edition');
//     const addWorkBtn = document.getElementById('add-work-btn');
//     const loginMenu = document.getElementById('login-menu');
//     const filterButtons = document.querySelectorAll('.filter-btn');

//     let galleryData = [];

//     // Verificar si el usuario está autenticado
//     // function checkAdminMode() {
//     //     const authToken = localStorage.getItem('authToken');
//     //     if (authToken) {
//     //         editionSection.classList.remove('hidden');
//     //         addWorkBtn.classList.remove('hidden');
//     //         loginMenu.innerHTML = '<a href="#" id="logout-btn">Logout</a>';
//     //     }
//     // }

//     // Obtener trabajos desde la API
//     async function fetchWorks() {
//         try {
//             const response = await fetch('http://localhost:5678/api/works');
//             if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
//             const works = await response.json();
//             console.log('Trabajos obtenidos:', works);
//             return works;
//         } catch (error) {
//             console.error('Error al obtener los trabajos:', error);
//             return [];
//         }
//     }

//     // Renderizar la galería
//     function populateGallery(items) {
//         galleryContainer.innerHTML = '';

//         if (!items || items.length === 0) {
//             galleryContainer.innerHTML = '<p>Aucune image disponible.</p>';
//             return;
//         }

//         items.forEach((item) => {
//             const galleryItem = document.createElement('figure');
//             galleryItem.classList.add('gallery-item');

//             const img = document.createElement('img');
//             img.src = item.imageUrl;
//             img.alt = item.title;

//             const figcaption = document.createElement('figcaption');
//             figcaption.textContent = item.title;

//             galleryItem.appendChild(img);
//             galleryItem.appendChild(figcaption);
//             galleryContainer.appendChild(galleryItem);
//         });
//     }

//     // Inicializar galería
//     async function initializeGallery() {
//         galleryData = await fetchWorks();
//         populateGallery(galleryData);
//     }

//     // Filtrado de imágenes
//     function filterGallery(filter) {
//         if (filter === 'all') {
//             populateGallery(galleryData);
//         } else {
//             const filteredWorks = galleryData.filter(item => item.category.name === filter);
//             populateGallery(filteredWorks);
//         }
//     }

//     filterButtons.forEach(button => {
//         button.addEventListener('click', (event) => {
//             filterButtons.forEach(btn => btn.classList.remove('active'));
//             event.target.classList.add('active');
//             filterGallery(event.target.getAttribute('data-filter'));
//         });
//     });
//     });

//     // Modal de galería
//     function populateModalGallery(items) {
//         modalGallery.innerHTML = '';

//         if (!items || items.length === 0) {
//             modalGallery.innerHTML = '<p>Aucune image disponible.</p>';
//             return;
//         }

//         items.forEach(item => {
//             const modalItem = document.createElement('div');
//             modalItem.classList.add('modal-item');

//             const img = document.createElement('img');
//             img.src = item.imageUrl;
//             img.alt = item.title;

//             const deleteBtn = document.createElement('button');
//             deleteBtn.classList.add('delete-btn');
//             deleteBtn.style.backgroundImage = "url('assets/icons/poubelle.png')";
//             deleteBtn.addEventListener('click', () => deleteWork(item.id, modalItem));

//             modalItem.appendChild(img);
//             modalItem.appendChild(deleteBtn);
//             modalGallery.appendChild(modalItem);
//         });
//     }

//     // Eliminar imagen
//     async function deleteWork(id, modalItem) {
//         const confirmDelete = confirm('¿Seguro que deseas eliminar este trabajo?');
//         if (!confirmDelete) return;

//         try {
//             const response = await fetch(`http://localhost:5678/api/works/${id}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
//                 }
//             });

//             if (response.ok) {
//                 modalItem.remove();
//                 alert('Trabajo eliminado correctamente');
//                 galleryData = await fetchWorks();
//                 populateGallery(galleryData);
//                 populateModalGallery(galleryData);
//             } else {
//                 alert('Error al eliminar el trabajo.');
//             }
//         } catch (error) {
//             console.error('Error al eliminar el trabajo:', error);
//         }
//     }

//     // Cargar modal de subida de imágenes
//     document.getElementById('photo-upload').addEventListener('change', function(event) {
//         const fileInput = event.target;
//         const photoPreview = document.querySelector('.photo-preview');

//         if (fileInput.files && fileInput.files[0]) {
//             const reader = new FileReader();

//             reader.onload = function(e) {
//                 photoPreview.innerHTML = '';
//                 const img = document.createElement('img');
//                 img.src = e.target.result;
//                 img.alt = 'Vista previa de la imagen';
//                 img.style.maxWidth = '100%';
//                 img.style.maxHeight = '200px';
//                 photoPreview.appendChild(img);
//             };

//             reader.readAsDataURL(fileInput.files[0]);
//         } else {
//             photoPreview.innerHTML = '<p>Aucune image sélectionnée.</p>';
//         }
//     });

//     // Subir imagen a la API
//     document.getElementById('upload-form').addEventListener('submit', async function(event) {
//         event.preventDefault();
//         const formData = new FormData(this);
//         const authToken = localStorage.getItem('authToken');

//         if (!authToken) {
//             alert('El usuario no está autenticado. Por favor, inicie sesión.');
//             return;
//         }

//         try {
//             const response = await fetch('http://localhost:5678/api/works', {
//                 method: 'POST',
//                 headers: { 'Authorization': `Bearer ${authToken}` },
//                 body: formData
//             });

//             if (response.ok) {
//                 alert('Photo ajoutée avec succès !');
//                 this.reset();
//                 document.querySelector('.photo-preview').innerHTML = '<p>Aucune image sélectionnée.</p>';
//                 galleryData = await fetchWorks();
//                 populateGallery(galleryData);
//                 populateModalGallery(galleryData);
//             } else {
//               alert('Erreur lors de l\'ajout de la photo.');
//                     }
//                   } catch (error) {
//                     console.error('Erreur lors de l\'envoi du formulaire:', error);
//                     alert('Erreur lors de l\'envoi du formulaire.');
//                   }
//                 });

//     checkAdminMode();
//     await initializeGallery();
// });

// ""// ----------------- SCRIPTS.JS -----------------
// document.addEventListener("DOMContentLoaded", async () => {
//   const galleryContainer = document.querySelector(".gallery");
//   const modalGallery = document.getElementById("modal-gallery");
//   const editionSection = document.querySelector(".edition");
//   const addWorkBtn = document.getElementById("add-work-btn");
//   const loginMenu = document.getElementById("login-menu");
//   const filterButtons = document.querySelectorAll(".filter-btn");
//   const authToken = localStorage.getItem("authToken");
//   const modal = document.getElementById("modal");
//   let galleryData = [];

//   // Obtener trabajos desde la API
//   async function fetchWorks() {
//     try {
//       const response = await fetch("http://localhost:5678/api/works");
//       if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
//       const works = await response.json();
//       console.log("Datos obtenidos:", works); // Verifica los datos
//       return works;
//     } catch (error) {
//       console.error("Erreur lors de la récupération des travaux:", error);
//       alert(
//         "Erreur lors de la récupération des travaux. Veuillez réessayer plus tard."
//       );
//       return [];
//     }
//   }

//   // Función para mostrar los trabajos en la galería

//   function populateGallery(items) {
//     galleryContainer.innerHTML = "";
//     items.forEach((item) => {
//       const galleryItem = document.createElement("figure");
//       galleryItem.classList.add("gallery-item");

//       const img = document.createElement("img");
//       img.src = item.imageUrl;
//       img.alt = item.title;

//       const figcaption = document.createElement("figcaption");
//       figcaption.textContent = item.title;

//       galleryItem.appendChild(img);
//       galleryItem.appendChild(figcaption);
//       galleryContainer.appendChild(galleryItem);
//     });
//   }

//   // Llenar la galería inicialmente con todos los trabajos
//   populateGallery(data);

//   // Inicializar galería
//   async function initializeGallery() {
//     galleryData = await fetchWorks();
//     populateGallery(galleryData);
//   }

//   // Filtrado de imágenes
//   function filterGallery(filter) {
//     if (filter === "all") {
//       populateGallery(galleryData);
//     } else {
//       const filteredWorks = galleryData.filter(
//         (item) => item.category.name === filter
//       );
//       populateGallery(filteredWorks);
//     }
//   }

//   filterButtons.forEach((button) => {
//     button.addEventListener("click", (event) => {
//       filterButtons.forEach((btn) => btn.classList.remove("active"));
//       event.target.classList.add("active");
//       filterGallery(event.target.getAttribute("data-filter"));
//     });
//   });
//   //////////////////////////////////////////////////LOGIN

//   // 🔒 Si NO hay token, oculta el modo edición y botones de admin
//   if (!authToken) {
//     if (editionBar) editionBar.style.display = "none";
//     if (addWorkBtn) addWorkBtn.style.display = "none";
//     if (modifierBtn) modifierBtn.style.display = "none";
//   } else {
//     // 🔓 Si hay token, activa el modo edición
//     console.log("🔓 Modo edición activado");
//     if (editionBar) editionBar.style.display = "block";
//     if (addWorkBtn) addWorkBtn.style.display = "block";

//     // Botón Modifier: Abrir modal
//     if (modifierBtn) {
//       modifierBtn.style.display = "inline-block";
//       modifierBtn.addEventListener("click", (event) => {
//         event.preventDefault();
//         console.log("🖊️ Botón Modifier presionado");
//         if (modal) {
//           modal.style.display = "block";
//         }
//       });
//     }
//   }

//   // Verificar si el usuario está autenticado
//   function checkAdminMode() {
//     const authToken = localStorage.getItem("authToken");
//     if (authToken) {
//       editionSection.classList.remove("hidden");
//       addWorkBtn.classList.remove("hidden");
//       loginMenu.innerHTML = '<a href="#" id="logout-btn">Logout</a>';
//     }
//   }

//   // Modal de galería///////////////////////////////////////////////
//   // Botón para abrir el modal
//   document.addEventListener("DOMContentLoaded", () => {
//     const openModalBtn = document.getElementById("add-work-btn");

//     openModalBtn.addEventListener("click", async () => {
//       const modal = document.getElementById("modal");
//       modal.classList.remove("hidden"); // Muestra el modal
//       const works = await fetchWorks(); // Obtén los datos desde la API
//       populateModalGallery(works); // Llena el modal con las imágenes
//     });
//   });

//   // Función para llenar la galería del modal
//   document.addEventListener("DOMContentLoaded", () => {
//     const openModalBtn = document.getElementById("add-work-btn");
//     const modal = document.getElementById("modal");
//     const modalGallery = document.getElementById("modal-gallery");

//     async function fetchWorks() {
//       try {
//         const response = await fetch("http://localhost:5678/api/works");
//         if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
//         const works = await response.json();
//         return works;
//       } catch (error) {
//         console.error("Erreur lors de la récupération des travaux:", error);
//         alert(
//           "Erreur lors de la récupération des travaux. Veuillez réessayer plus tard."
//         );
//         return [];
//       }
//     }

//     function populateModalGallery(items) {
//       modalGallery.innerHTML = ""; // Limpia el contenido existente
//       if (!Array.isArray(items) || items.length === 0) {
//         modalGallery.innerHTML = "<p>Aucun projet à afficher.</p>"; // Muestra un mensaje si no hay datos
//         return;
//       }

//       items.forEach((item) => {
//         const modalItem = document.createElement("div");
//         modalItem.classList.add("modal-item");

//         const img = document.createElement("img");
//         img.src = item.imageUrl;
//         img.alt = item.title;

//         const deleteBtn = document.createElement("button");
//         deleteBtn.classList.add("delete-btn");
//         deleteBtn.style.backgroundImage = "url('assets/icons/poubelle.png')";
//         deleteBtn.addEventListener("click", () =>
//           console.log("Eliminar:", item.id)
//         );

//         modalItem.appendChild(img);
//         modalItem.appendChild(deleteBtn);
//         modalGallery.appendChild(modalItem);
//       });
//     }
//     document.addEventListener('DOMContentLoaded', async () => {
//       const works = await fetchWorks(); // Obtiene los datos desde la API
//       populateGallery(works); // Llena la galería del fondo
//       populateModalGallery(works); // Llena la galería del modal
//     });
    

//     openModalBtn.addEventListener("click", async () => {
//       modal.classList.remove("hidden");
//       const works = await fetchWorks();
//       populateModalGallery(works);
//     });
//   });

//   // Función para eliminar un trabajo
//   async function deleteWorkFromModal(id, modalItem) {
//     const confirmDelete = confirm("Voulez-vous supprimer ce projet ?");
//     if (!confirmDelete) return;

//     try {
//       const response = await fetch(`http://localhost:5678/api/works/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//       });

//       if (response.ok) {
//         modalItem.remove(); // Elimina el trabajo del DOM
//         alert("Projet supprimé avec succès !");
//       } else {
//         alert("Erreur lors de la suppression !");
//       }
//     } catch (error) {
//       console.error("Erreur:", error);
//     }
//   }

//   // Cargar modal de subida de imágenes
//   document
//     .getElementById("photo-upload")
//     .addEventListener("change", function (event) {
//       const fileInput = event.target;
//       const photoPreview = document.querySelector(".photo-preview");

//       if (fileInput.files && fileInput.files[0]) {
//         const reader = new FileReader();

//         reader.onload = function (e) {
//           photoPreview.innerHTML = "";
//           const img = document.createElement("img");
//           img.src = e.target.result;
//           img.alt = "Vista previa de la imagen";
//           img.style.maxWidth = "100%";
//           img.style.maxHeight = "200px";
//           photoPreview.appendChild(img);
//         };

//         reader.readAsDataURL(fileInput.files[0]);
//       } else {
//         photoPreview.innerHTML = "<p>Aucune image sélectionnée.</p>";
//       }
//     });

//   // Subir imagen a la API
//   document
//     .getElementById("upload-form")
//     .addEventListener("submit", async function (event) {
//       event.preventDefault();
//       const formData = new FormData(this);
//       const authToken = localStorage.getItem("authToken");

//       if (!authToken) {
//         alert("El usuario no está autenticado. Por favor, inicie sesión.");
//         return;
//       }

//       try {
//         const response = await fetch("http://localhost:5678/api/works", {
//           method: "POST",
//           headers: { Authorization: `Bearer ${authToken}` },
//           body: formData,
//         });

//         if (response.ok) {
//           alert("Photo ajoutée avec succès !");
//           this.reset();
//           document.querySelector(".photo-preview").innerHTML =
//             "<p>Aucune image sélectionnée.</p>";
//           galleryData = await fetchWorks();
//           populateGallery(galleryData);
//           populateModalGallery(galleryData);
//         } else {
//           alert("Erreur lors de l'ajout de la photo.");
//         }
//       } catch (error) {
//         console.error("Erreur lors de l'envoi du formulaire:", error);
//         alert("Erreur lors de l'envoi du formulaire.");
//       }
//     });

//   checkAdminMode();
//   await initializeGallery();
// });
// ("");
