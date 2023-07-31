// L'URL de base de l'API
const root = "http://localhost:5678/api";

// Tableaux pour stocker les données
let works = []; // Données des travaux
let categories = []; // Données des catégories
let originalWorks = []; // Données d'origine des travaux

// Fonction pour charger les données des travaux depuis l'API
function  loadWork() {
  // Appel à l'API pour récupérer les données des travaux
  fetch(root + "/works")
    .then((response) => {
      return response.json(); // Convertir la réponse en JSON
    })
    .then((worksData) => {
      works = worksData; // Stocker les données des travaux
      originalWorks = worksData; // Sauvegarder les données d'origine des travaux
      console.log(works);
      displayWork(); // Afficher les travaux à l'écran
      loadCategories(); // Charger les catégories après avoir récupéré les travaux
    });
}

// Fonction pour afficher les travaux à l'écran
function displayWork() {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // Réinitialiser le contenu pour éviter les doublons

// works.forEach(work => {
// });

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
  // Appel à l'API pour récupérer les données des catégories
  fetch(root + "/categories")
    .then((response) => {
      return response.json(); // Convertir la réponse en JSON
    })
    .then((categoriesData) => {
      categories = categoriesData; // Stocker les données des catégories
      console.log(categories);
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
    console.log("Tous!");
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

    btn.addEventListener("click", () => {
      console.log(`${category.name} !`);
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
  // works = categoryId === undefined ? originalWorks : originalWorks.filter((work) => work.categoryId === categoryId);
  if (categoryId === undefined) {
    works = originalWorks; // Afficher tous les travaux (aucun filtre)
  } else {
    works = originalWorks.filter((work) => work.categoryId === categoryId);
  }
  displayWork(); // Afficher les travaux filtrés à l'écran
}

// Charger les données depuis l'API lors du chargement de la page
loadWork();

