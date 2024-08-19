let login = document.getElementById("login");

if (login) {
  login.addEventListener("submit", () => {
    sessionStorage.setItem("isAuthenticated", "true");
    window.location.href = "index.html"; // Redirigir al index si se autentica
  });
}
