// Datos del archivo JSON (carga este JSON desde tu backend en un entorno real)
const data = [
    {
      id: 1,
      title: "Abajour Tahina",
      imageUrl: "assets/images/abajour-tahina.png",
      categoryId: 1,
      userId: 1,
      category: {
        id: 1,
        name: "Objets"
      }
    },
    {
        id: 2,
        title: "Appartement Paris V",
        imageUrl: "assets/images/appartement-paris-v.png",
        categoryId: 2,
        userId: 1,
        category: {
          id: 2,
          name: "Appartements"
        }
      },
      {
        id: 3,
        title: "Restaurant Sushisen - Londres",
        imageUrl: "assets/images/restaurant-sushisen-londres.png",
        categoryId: 3,
        userId: 1,
        category: {
          id: 3,
          name: "Hotels & restaurants"
        }
      },
      {
        id: 4,
        title: "Villa “La Balisiere” - Port Louis",
        imageUrl: "assets/images/la-balisiere.png",
        categoryId: 2,
        userId: 1,
        category: {
          id: 2,
          name: "Appartements"
        }
      },
      {
        id: 5,
        title: "Structures Thermopolis",
        imageUrl: "assets/images/structures-thermopolis.png",
        categoryId: 1,
        userId: 1,
        category: {
          id: 1,
          name: "Objets"
        }
      },
      {
        id: 6,
        title: "Appartement Paris X",
        imageUrl: "assets/images/appartement-paris-x.png",
        categoryId: 2,
        userId: 1,
        category: {
          id: 2,
          name: "Appartements"
        }
      },
      {
        id: 7,
        title: "Pavillon “Le coteau” - Cassis",
        imageUrl: "assets/images/le-coteau-cassis.png",
        categoryId: 2,
        userId: 1,
        category: {
          id: 2,
          name: "Appartements"
        }
      },
      {
        id: 8,
        title: "Villa Ferneze - Isola d’Elba",
        imageUrl: "assets/images/villa-ferneze.png",
        categoryId: 2,
        userId: 1,
        category: {
          id: 2,
          name: "Appartements"
        }
      },
      {
        id: 9,
        title: "Appartement Paris XVIII",
        imageUrl: "assets/images/appartement-paris-xviii.png",
        categoryId: 2,
        userId: 1,
        category: {
          id: 2,
          name: "Appartements"
        }
      },
      {
        id: 10,
        title: "Bar “Lullaby” - Paris",
        imageUrl: "assets/images/bar-lullaby-paris.png",
        categoryId: 3,
        userId: 1,
        category: {
          id: 3,
          name: "Hotels & restaurants"
        }
      },
      {
        id: 11,
        title: "Hotel First Arte - New Delhi",
        imageUrl: "assets/images/hotel-first-arte-new-delhi.png",
        categoryId: 3,
        userId: 1,
        category: {
          id: 3,
          name: "Hotels & restaurants"
        }
      }
    
  ];
  
  // Selecciona el contenedor de la galería
  const galleryContainer = document.querySelector(".gallery");
  
  // Función para crear y añadir los elementos de la galería
  function populateGallery(items) {
    items.forEach(item => {
      // Crea un contenedor para cada elemento
      const galleryItem = document.createElement("div");
      galleryItem.classList.add("gallery-item");
  
      // Crea una imagen
      const img = document.createElement("img");
      img.src = item.imageUrl;
      img.alt = item.title;
  
      // Crea un título
      const title = document.createElement("h3");
      title.textContent = item.title;
  
      // Añade la imagen y el título al contenedor del elemento
      galleryItem.appendChild(img);
      galleryItem.appendChild(title);
  
      // Añade el elemento al contenedor de la galería
      galleryContainer.appendChild(galleryItem);
    });
  }
  
  // Llama a la función para rellenar la galería
  populateGallery(data);

  // Datos de ejemplo (puedes obtenerlos desde la API en un entorno real)
const categoryId = [
  {id: 1, title: "Abajour Tahina", imageUrl: "assets/images/abajour-tahina.png", category: "Objets" },
  { id: 2, title: "Appartement Paris V", imageUrl: "assets/images/appartement-paris-v.png",  category: "Appartements" },
  { id: 3, title: "Restaurant Sushisen - Londres",  imageUrl: "assets/images/restaurant-sushisen-londres.png",  category: "Hotels & restaurants" },
  { id: 4, title: "Villa “La Balisiere” - Port Louis", imageUrl: "assets/images/la-balisiere.png",  category: "Appartements" },
  { id: 5, title: "Structures Thermopolis", imageUrl: "assets/images/structures-thermopolis.png", category: "Objets"},
  { id: 6, title: "Appartement Paris X", imageUrl: "assets/images/appartement-paris-x.png", category: "Appartements" },
  { id: 7, title: "Pavillon “Le coteau” - Cassis", imageUrl: "assets/images/le-coteau-cassis.png", category: "Appartements" },
  { id: 8, title: "Villa Ferneze - Isola d’Elba", imageUrl: "assets/images/villa-ferneze.png", category: "Appartements" },
  { id: 9, title: "Appartement Paris XVIII", imageUrl: "assets/images/appartement-paris-xviii.png", category: "Appartements" },
  { id: 10, title: "Bar “Lullaby” - Paris", imageUrl: "assets/images/bar-lullaby-paris.png", category: "Hotels & restaurants" },
  { id: 11, title: "Hotel First Arte - New Delhi", imageUrl: "assets/images/hotel-first-arte-new-delhi.png", category: "Hotels & restaurants" }
  
];

// Selecciona contenedores
const filterButtons = document.querySelectorAll(".filter-btn");
// const galleryContainer = document.querySelector(".gallery");

// Función para crear la galería
function populateGallery(items) {
  galleryContainer.innerHTML = ""; // Limpia la galería
  items.forEach(item => {
    const galleryItem = document.createElement("div");
    galleryItem.classList.add("gallery-item");

    const img = document.createElement("img");
    img.src = item.imageUrl;
    img.alt = item.title;

    const title = document.createElement("h3");
    title.textContent = item.title;

    galleryItem.appendChild(img);
    galleryItem.appendChild(title);
    galleryContainer.appendChild(galleryItem);
  });
}

// Función para manejar los filtros
function handleFilter(event) {
  const filter = event.target.getAttribute("data-filter");

  if (filter === "all") {
    populateGallery(data); // Muestra todo
  } else {
    const filteredCategoryId = categoryId.filter(item => item.category === filter);
    populateGallery(filteredCategoryId);//ojo
  }
}

// Asignar eventos a los botones
filterButtons.forEach(button => {
  button.addEventListener("click", handleFilter);
});

// Mostrar todos los elementos al cargar la página
populateGallery(data);

  

  