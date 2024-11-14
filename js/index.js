document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("autos").addEventListener("click", function () {
    localStorage.setItem("catID", 101);
    window.location = "products.html";
  });
  document.getElementById("juguetes").addEventListener("click", function () {
    localStorage.setItem("catID", 102);
    window.location = "products.html";
  });
  document.getElementById("muebles").addEventListener("click", function () {
    localStorage.setItem("catID", 103);
    window.location = "products.html";
  });
  
  // Verifica si el usuario está logeado
  if (localStorage.getItem("isAuthenticated") !== "true") {
    window.location.href = "login.html"; // Redirigir al login si no está autenticado
    return;
  }
});
