document.addEventListener("DOMContentLoaded", () => {
    const authToken = localStorage.getItem("authToken");
    const urlParams = new URLSearchParams(window.location.search);
    const isEditMode = urlParams.get("mode") === "edit";

    const editionBar = document.querySelector(".edition");
    const addWorkBtn = document.getElementById("add-work-btn");
    // const modifierBtn = document.getElementById("modifier-btn");

    if (authToken && isEditMode) {
        console.log("Modo edición activado...");
        if (editionBar) editionBar.style.display = "block";
        if (addWorkBtn) addWorkBtn.style.display = "block"; // Mostrar botón
    } else {
        console.log("Modo edición desactivado...");
        if (editionBar) editionBar.style.display = "none";
        if (addWorkBtn) addWorkBtn.style.display = "none"; // Ocultar botón si no es admin
    }

});


console.log("Modo edición detectado:", window.location.search.includes("mode=edit"));
console.log("Token de autenticación:", localStorage.getItem("authToken"));






