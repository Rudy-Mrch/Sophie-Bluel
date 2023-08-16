// LES VARIABLES
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
// Click sur pour ouvrir la première modale
openModal1Button.addEventListener("click", () => {
  modal1.style.display = "block";
});

// Click sur le bouton pour ajouter des photos (modal2)
addPhotosButton.addEventListener("click", () => {
  modal2.style.display = "block";
  validateButton.addEventListener("click", (event) => {
    event.preventDefault();
    const inputTittle = document.querySelector("#inputTittle").value;
    formData.append("title", inputTittle);

    const selectorCategory = document.querySelector("#selectorCategory").value;
    formData.append("category", selectorCategory);
    createWorks();
  });

  document.querySelector("#buttonAddPix").addEventListener("click", () => {
    const inputGhost = document.querySelector("#inputGhostButton");
    inputGhost.click();
    inputGhost.addEventListener("change", (event) => {
      const file = event.target.files[0];
      formData.append("image", file);
    });
  });
});

// click sur le bouton pour supprimer la galerie
deleteGalleryButton.addEventListener("click", () => {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  modal1.style.display = "none";
});

// Fermeture de la modal1
closeModal1Button.addEventListener("click", () => {
  modal1.style.display = "none";
});

//  Fermture de la modal2
closeModal2Button.addEventListener("click", () => {
  modal2.style.display = "none";
});

// Clique en dehors = modal1 fermé
modal1.addEventListener("click", (event) => {
  if (event.target === modal1) {
    modal1.style.display = "none";
  }
});

// Clique en dehors = modal2 fermé
modal2.addEventListener("click", (event) => {
  if (event.target === modal2) {
    modal2.style.display = "none";
  }
});

// Button back pour la modal2
const arrowBackButton = document.getElementById("arrowBack");
arrowBackButton.addEventListener("click", () => {
  modal2.style.display = "none";
  modal1.style.display = "block";
});

// Variable pour les appels à l'API
const root = "http://localhost:5678/api";

// Tableaux pour stocker les données des œuvres et des catégories
let works = [];
let categories = [];
let originalWorks = [];

// Charger les données des œuvres depuis l'API
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

function displayWork() {
  const gallery = document.querySelector(".gallery");
  const galleryModal = document.querySelector(".gallery-modal");

  gallery.innerHTML = "";
  galleryModal.innerHTML = "";

  for (let i = 0; i < works.length; i++) {
    const work = works[i];

    // Crée l'élément d'image pour la galerie
    const fig = document.createElement("figure");
    const imageS = document.createElement("img");
    imageS.src = work.imageUrl;
    imageS.alt = work.title;
    fig.appendChild(imageS);

    // Ajoute l'image à la galerie
    gallery.appendChild(fig);

    // Crée l'élément de conteneur pour l'image dans la modal1
    const modalImageContainer = document.createElement("div");
    modalImageContainer.classList.add("modal-image-container");

    const imageModal = document.createElement("img");
    imageModal.src = work.imageUrl;
    imageModal.alt = work.title;
    imageModal.style.width = "78.123px";
    imageModal.style.height = "104.08px";
    modalImageContainer.appendChild(imageModal);

    // Crée l'élément <i> pour le symbole de la corbeille (trash) dans la modal1
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash-can");
    modalImageContainer.appendChild(trashIcon);
    galleryModal.appendChild(modalImageContainer);
    trashIcon.addEventListener("click", () => {
      delework(i);
    });
  }
}

function delework(i) {
  works.splice(i, 1);
  displayWork();
}

// Charger les catégories depuis l'API
function loadCategories() {
  fetch(root + "/categories")
    .then((response) => response.json())
    .then((categoriesData) => {
      categories = categoriesData;
      displayCategories();
      populateCategories();
    });
}

// Afficher les boutons de filtre par catégorie
function displayCategories() {
  const buttonFilter = document.querySelector(".buttonFilter");
  buttonFilter.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.innerHTML = "Tous";
  allBtn.classList.add("filterBtn");
  buttonFilter.appendChild(allBtn);

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

// Filtrer les travaux par catégorie
function filterWorksByCategoryId(categoryId) {
  if (categoryId === undefined) {
    works = originalWorks;
  } else {
    works = originalWorks.filter((work) => work.categoryId === categoryId);
  }
  displayWork();
}

// Chargement des données des travaux et vérif de la connexion
loadWork();

// Vérifier la connexion et activer --> mode édition actived
function checkConnexion() {
  const token = sessionStorage.getItem("token");
  if (token !== null) {
    barEdition();
  } else {
    console.log("Mode éditeur désactivé");
  }
}

// Activer le mode édition
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

// Fonction pour afficher les catégories dans le sélecteur de la modal2
function populateCategories() {
  const selectorCategory = document.getElementById("selectorCategory");

  // Parcours du tableau de catégories
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];

    // Création de l'élément d'option
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;

    // Ajout de l'option au sélecteur
    selectorCategory.appendChild(option);
  }
}

// Vérification de la connexion au chargement de la page
checkConnexion();
