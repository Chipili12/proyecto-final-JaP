const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

function loadNavbar() {
  fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('afterbegin', data);
      if (sessionStorage.getItem("isAuthenticated") == "true") {
        var loginInicio = document.getElementById("loginInicio");
        loginInicio.setAttribute("data-bs-toggle", "offcanvas");
        loginInicio.setAttribute("data-bs-target", "#offcanvasRight");
        loginInicio.setAttribute("aria-controls", "offcanvasRight");
        loginInicio.innerHTML = sessionStorage.getItem("email");
        document.getElementById("logoutButton").addEventListener("click", function () {
          sessionStorage.setItem("isAuthenticated", "false");
          sessionStorage.setItem("email", "");
          window.location.href = "login.html";
        })
      }
    })
    .catch(error => console.error('Error loading navbar:', error));
}

window.onload = loadNavbar;


let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}