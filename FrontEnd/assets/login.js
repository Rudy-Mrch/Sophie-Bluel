// Sélection de l'élément formulaire de connexion
let formLog = document.getElementById('formLog');
formLog.addEventListener('submit', async (event) => {
  event.preventDefault(); // Empêche le rechargement de la page

  // Récupération des champs email et mot de passe du formulaire
  const email = document.getElementById('mail').value;
  const password = document.getElementById('password').value;

  // Envoi des informations de connexion à l'API pour authentification
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password }) // Convertit les données en format JSON
  });

  // Vérification de la réponse de l'API
  if (response.status === 200) { 
    const token = await response.json();

    // Enregistrement du jeton d'authentification et de l'ID utilisateur dans le stockage de session
    sessionStorage.setItem("token", token.token);
    sessionStorage.setItem("userId", token.userId);

    // Redirection de l'utilisateur vers la page d'accueil
    window.location.href = "../index.html";
  } else {
    alert("Nom d'utilisateur ou mot de passe incorrect");
  }
});
