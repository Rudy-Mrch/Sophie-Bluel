// Récupération des éléments du DOM
const openModal1Button = document.getElementById("modify2");
const modal1 = document.getElementById("modal1");
const closeModal1Button = document.getElementById("closeModal1");
const addPhotosButton = document.getElementById("addPhotos");
const deleteGalleryButton = document.getElementById("deleteGallery");

const modal2 = document.getElementById("modal2");
const closeModal2Button = document.getElementById("closeModal2");
const validatePhotoButton = document.getElementById("validatePhoto");
const formData = new FormData();
const validateButton = document.querySelector("#validatePhoto");
const containerPix = document.querySelector(".containerPix");

// Fonction asynchrone pour créer une nouvelle œuvre
async function createWorks() {
  const token = sessionStorage.getItem("token");
  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Accept: "application/json;charset=utf-8",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
}

// Événement d'écoute pour ouvrir la première modal
openModal1Button.addEventListener("click", () => {
  modal1.style.display = "block";
});

// Événement d'écoute pour ouvrir la deuxième modal et gérer l'ajout de photos
addPhotosButton.addEventListener("click", () => {
  modal2.style.display = "block";
  
  // Validation lors du clic sur le bouton "Valider"
  validateButton.addEventListener("click", (event) => {
    event.preventDefault();
    const inputTittle = document.querySelector("#inputTittle").value;
    formData.append("title", inputTittle);

    const selectorCategory = document.querySelector("#selectorCategory").value;
    formData.append("category", selectorCategory);
    createWorks();
  });

  // Sélection et affichage de l'image à ajouter
  document.querySelector("#buttonAddPix").addEventListener("click", () => {
    const inputGhost = document.querySelector("#inputGhostButton");
    inputGhost.click();
    inputGhost.addEventListener("change", (event) => {
      const file = event.target.files[0];
      formData.append("image", file);

      containerPix.innerHTML = "";
      const uploadedImage = document.createElement("img");
      uploadedImage.src = URL.createObjectURL(file);
      uploadedImage.alt = "Uploaded Image";
      uploadedImage.style.width= "129px";
      uploadedImage.style.height= "193px";
      containerPix.appendChild(uploadedImage);
    });
  });
});

// Événement d'écoute pour supprimer la galerie
deleteGalleryButton.addEventListener("click", () => {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  modal1.style.display = "none";
});

// Fermeture de la première modal
closeModal1Button.addEventListener("click", () => {
  modal1.style.display = "none";
});

// Fermeture de la deuxième modal
closeModal2Button.addEventListener("click", () => {
  modal2.style.display = "none";
});

// Fermeture de la première modal lors d'un clic à l'extérieur
modal1.addEventListener("click", (event) => {
  if (event.target === modal1) {
    modal1.style.display = "none";
  }
});

// Fermeture de la deuxième modal lors d'un clic à l'extérieur
modal2.addEventListener("click", (event) => {
  if (event.target === modal2) {
    modal2.style.display = "none";
  }
});

// Retour à la première modal depuis la deuxième
const arrowBackButton = document.getElementById("arrowBack");
arrowBackButton.addEventListener("click", () => {
  modal2.style.display = "none";
  modal1.style.display = "block";
});

// URL de base pour les requêtes API
const root = "http://localhost:5678/api";

// Tableaux pour stocker les œuvres, catégories et œuvres originales
let works = [];
let categories = [];
let originalWorks = [];

// Chargement des œuvres
function loadWork() {
  fetch(root + "/works")
    .then((response) => response.json())
    .then((worksData) => {
      works = worksData;
      originalWorks = worksData;
      displayWork();
      loadCategories();
    });
}

// Affichage des œuvres dans la galerie
function displayWork() {
  const gallery = document.querySelector(".gallery");
  const galleryModal = document.querySelector(".gallery-modal");

  gallery.innerHTML = "";
  galleryModal.innerHTML = "";

  for (let i = 0; i < works.length; i++) {
    const work = works[i];

    const fig = document.createElement("figure");
    const imageS = document.createElement("img");
    imageS.src = work.imageUrl;
    imageS.alt = work.title;
    fig.appendChild(imageS);

    gallery.appendChild(fig);

    const modalImageContainer = document.createElement("div");
    modalImageContainer.classList.add("modal-image-container");

    const imageModal = document.createElement("img");
    imageModal.src = work.imageUrl;
    imageModal.alt = work.title;
    imageModal.style.width = "78.123px";
    imageModal.style.height = "104.08px";
    modalImageContainer.appendChild(imageModal);

    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash-can");
    modalImageContainer.appendChild(trashIcon);
    galleryModal.appendChild(modalImageContainer);

    // Suppression d'une œuvre
    trashIcon.addEventListener("click", () => {
      delework(i);
    });
  }
}

// Suppression d'une œuvre
function delework(i) {
  works.splice(i, 1);
  displayWork();
}

// Chargement des catégories
function loadCategories() {
  fetch(root + "/categories")
    .then((response) => response.json())
    .then((categoriesData) => {
      categories = categoriesData;
      displayCategories();
      populateCategories();
    });
}

// Affichage des catégories pour filtrer les œuvres
function displayCategories() {
  const buttonFilter = document.querySelector(".buttonFilter");
  buttonFilter.innerHTML = "";

  // Bouton "Tous" pour afficher toutes les œuvres
  const allBtn = document.createElement("button");
  allBtn.innerHTML = "Tous";
  allBtn.classList.add("filterBtn");
  buttonFilter.appendChild(allBtn);

  // Écouteur pour le bouton "Tous"
  allBtn.addEventListener("click", () => {
    filterWorksByCategoryId();

    const allButtons = document.querySelectorAll(".filterBtn");
    for (let i = 0; i < allButtons.length; i++) {
      allButtons[i].classList.remove("active");
    }

    allBtn.classList.add("active");
  });

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const btn = document.createElement("button");
    btn.innerHTML = category.name;
    btn.classList.add("filterBtn");
    buttonFilter.appendChild(btn);

    // Écouteur pour chaque bouton de catégorie
    btn.addEventListener("click", () => {
      filterWorksByCategoryId(category.id);

      const allButtons = document.querySelectorAll(".filterBtn");
      for (let j = 0; j < allButtons.length; j++) {
        allButtons[j].classList.remove("active");
      }

      btn.classList.add("active");
    });
  }
}

// Filtrer les œuvres par ID de catégorie
function filterWorksByCategoryId(categoryId) {
  if (categoryId === undefined) {
    works = originalWorks;
  } else {
    works = originalWorks.filter((work) => work.categoryId === categoryId);
  }
  displayWork();
}

// Chargement initial
loadWork();

// Vérifier la connexion et afficher la barre d'édition si nécessaire
function checkConnexion() {
  const token = sessionStorage.getItem("token");
  if (token !== null) {
    barEdition();
  } else {
    console.log("Mode éditeur désactivé");
  }
}

// Afficher la barre d'édition
function barEdition() {
  const editionGlobal = document.querySelector("#editionBar");
  editionGlobal.classList.add("edition_global");

  const logoEdit = document.querySelector("#logoEdit");
  logoEdit.style.marginRight = "0.3em";
  logoEdit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';

  const edition1 = document.querySelector("#barEdit1");
  edition1.innerText = "Mode édition";
  edition1.classList.add("edition1");

  const edition2 = document.querySelector("#barEdit2");
  edition2.innerText = "publier les changements";
  edition2.classList.add("edition2");

  const modify1 = document.querySelector("#modify1");
  modify1.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier';
  modify1.classList.add("modify1");

  const modify2 = document.querySelector("#modify2");
  modify2.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier';
  modify2.classList.add("modify2");
}

// Remplir la liste déroulante des catégories
function populateCategories() {
  const selectorCategory = document.getElementById("selectorCategory");

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    selectorCategory.appendChild(option);
  }
}

// Vérifier la connexion à l'initialisation
checkConnexion();
