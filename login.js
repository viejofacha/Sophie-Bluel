// Sélectionnez le formulaire et le message d'erreur
const loginForm = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");

// URL de l'API d'authentification
const apiUrl = "http://localhost:5678/api/users/login";

// Fonction pour gérer la soumission de formulaire
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Empêcher l'envoi du formulaire par défaut

  // Capturer les valeurs des entrées
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("form-error");
    //rajouter condition pour vérifier si les champs sont vides
    if (email === "" || password === "") {
      errorMessage.textContent = "Veuillez remplir tous les champs";
      errorMessage.style.display = 'block';
      return;
    }
  try {
    // Faire la demande à l'API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    // (response.ok)

    //Traiter la réponse
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("authToken", data.token); // Stockez le jeton dans localStorage
      window.location.href = "index.html"; // Redirection vers la page principale
    } else {
      const errorData = await response.json();
      errorMessage.textContent = errorData.message || "Erreur de connexion";
    }
  } catch (error) {
    errorMessage.textContent = "Une erreur s'est produite, veuillez réessayer.";
    console.error("Error:", error);
  }
  
});