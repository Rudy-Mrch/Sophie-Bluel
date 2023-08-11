const root = "http://localhost:5678/api";
let works = [];
let categories = [];
let originalWorks = [];

// Fonction pour charger les données des travaux depuis l'API
function loadWork() {
  fetch(root + "/works")
    .then((response) => response.json()) // Convertir la réponse en JSON
    .then((worksData) => {
      works = worksData; // Stocker les données des travaux
      originalWorks = worksData; // Sauvegarder les données d'origine des travaux
      displayWork(); // Afficher les travaux à l'écran
      loadCategories(); // Charger les catégories après avoir récupéré les travaux
    });
}

// Fonction pour afficher les travaux à l'écran
function displayWork() {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // Réinitialiser le contenu pour éviter les doublons

  // Parcourir les données des travaux et créer des éléments HTML pour chaque travail
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

// Fonction pour charger les données des catégories depuis l'API
function loadCategories() {
  fetch(root + "/categories")
    .then((response) => response.json()) // Convertir la réponse en JSON
    .then((categoriesData) => {
      categories = categoriesData; // Stocker les données des catégories
      displayCategories(); // Afficher les catégories sous forme de boutons à l'écran
    });
}

// Fonction pour afficher les catégories sous forme de boutons à l'écran
function displayCategories() {
  const buttonFilter = document.querySelector(".buttonFilter");
  buttonFilter.innerHTML = ""; // Réinitialiser le contenu pour éviter les doublons

  // Ajouter le bouton "Tous" dans le HTML
  const allBtn = document.createElement("button");
  allBtn.innerHTML = "Tous";
  allBtn.classList.add("filterBtn");
  buttonFilter.appendChild(allBtn);

  // Ajouter un gestionnaire d'événements de clic au bouton "Tous"
  allBtn.addEventListener("click", () => {
    filterWorksByCategoryId(); // Filtrer les travaux en affichant tous les travaux (aucun filtre)

    // Supprimer la classe "active" de tous les boutons
    const allButtons = document.querySelectorAll(".filterBtn");
    for (let i = 0; i < allButtons.length; i++) {
      allButtons[i].classList.remove("active");
    }

    // Ajouter la classe "active" au bouton "Tous"
    allBtn.classList.add("active");
  });

  // Parcourir les données des catégories et créer des boutons pour chaque catégorie
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const btn = document.createElement("button");
    btn.innerHTML = category.name;
    btn.classList.add("filterBtn");
    buttonFilter.appendChild(btn);

    // Ajouter un gestionnaire d'événements de clic à chaque bouton de catégorie
    btn.addEventListener("click", () => {
      filterWorksByCategoryId(category.id); // Filtrer les travaux par catégorie en fonction de l'ID de la catégorie

      // Supprimer la classe "active" de tous les boutons
      const allButtons = document.querySelectorAll(".filterBtn");
      for (let j = 0; j < allButtons.length; j++) {
        allButtons[j].classList.remove("active");
      }

      // Ajouter la classe "active" au bouton cliqué
      btn.classList.add("active");
    });
  }
}

// Fonction pour filtrer les travaux par categoryId
function filterWorksByCategoryId(categoryId) {
  // Si categoryId est undefined, afficher tous les travaux (aucun filtre)
  if (categoryId === undefined) {
    works = originalWorks;
  } else {
    // Filtrer les travaux pour n'afficher que ceux qui correspondent à la categoryId donnée
    works = originalWorks.filter((work) => work.categoryId === categoryId);
  }
  displayWork(); // Afficher les travaux filtrés à l'écran
}

// Charger les données depuis l'API lors du chargement de la page
loadWork();

// Fonction pour vérifier l'état de connexion
function checkConnexion() {
  const token = sessionStorage.getItem("token");
  if (token !== null) {
    barEdition();
  } else {
    console.log("Mode éditeur désactivé");
  }
}

// function pour afficher le mode editeur
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
checkConnexion()

