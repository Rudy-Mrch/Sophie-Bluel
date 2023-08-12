// LES VARIABLES
const openModal1Button = document.getElementById("modify2");
const modal1 = document.getElementById("modal1");
const closeModal1Button = document.getElementById("closeModal1");
const addPhotosButton = document.getElementById("addPhotos");
const deleteGalleryButton = document.getElementById("deleteGallery");

const modal2 = document.getElementById("modal2");
const closeModal2Button = document.getElementById("closeModal2");
const validatePhotoButton = document.getElementById("validatePhoto");

// Click sur pour ouvrir la première modale
openModal1Button.addEventListener("click", () => {
  modal1.style.display = "block";
});

// Click sur le bouton pour ajouter des photos (modal2)
addPhotosButton.addEventListener("click", () => {
  modal2.style.display = "block";
});

// click sur le bouton pour supprimer la galerie
deleteGalleryButton.addEventListener("click", () => {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  modal1.style.display = "none";
});

// Valider l'ajout de la photo
validatePhotoButton.addEventListener("click", () => {
  // A COMPLETERRRRRRRRRRRRR  POUR VALIDER LA PHOTO !!!!!!!!!!!!!!!!!!!!!!!
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

// Afficher les travaux dans la galerie
function displayWork() {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  for (let i = 0; i < works.length; i++) {
    const work = works[i];
    const fig = document.createElement("figure");
    const imageS = document.createElement("img");
    imageS.src = work.imageUrl;
    imageS.alt = work.title;
    const figcap = document.createElement("figcaption");
    figcap.innerHTML = work.title;
    fig.appendChild(imageS);
    fig.appendChild(figcap);
    gallery.appendChild(fig);
  }
}

// Charger les catégories depuis l'API
function loadCategories() {
  fetch(root + "/categories")
    .then((response) => response.json())
    .then((categoriesData) => {
      categories = categoriesData;
      displayCategories();
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

// Vérification de la connexion au chargement de la page
checkConnexion();
