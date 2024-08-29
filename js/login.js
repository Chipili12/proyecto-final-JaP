let login = document.getElementById("login"); // Tomo los datos del login

if (login) {
  login.addEventListener("submit", () => { // evento que se activa cuando envia el formulario
    sessionStorage.setItem("isAuthenticated", "true"); // cuando el usuario envia el formulario, lo marca como autenticado
    sessionStorage.setItem("email", document.getElementById("email").value);
    window.location.href = "index.html"; // Redirigir al index si se autentica
  });
}
