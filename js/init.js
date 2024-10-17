const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

document.addEventListener("DOMContentLoaded", function (e) {
        const darkModeSwitch = document.getElementById('darkModeSwitch');
        const body = document.body;
        const isDarkMode = localStorage.getItem('darkMode')

        if (window.matchMedia('(prefers-color-scheme: dark)').matches && !isDarkMode) {
          console.log("No hay datos cargados en darkmode")
          localStorage.setItem('darkMode', 'true')
          body.classList.add('dark-mode');
          darkModeSwitch.checked = true;
        } else if (!isDarkMode) {
          body.classList.remove('dark-mode');
          localStorage.setItem('darkMode', 'false')
          darkModeSwitch.checked = false;
        }

        if (isDarkMode=='true') {
          body.classList.add('dark-mode');
          darkModeSwitch.checked = true;
        }
      
        darkModeSwitch.addEventListener('change', () => {
          if (darkModeSwitch.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
          } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
          }
        });
      if (sessionStorage.getItem("isAuthenticated") == "true") {
        var menuOffcanvas = document.getElementById("loginInicio");
        menuOffcanvas.setAttribute("data-bs-toggle", "offcanvas");
        menuOffcanvas.setAttribute("data-bs-target", "#offcanvasRight");
        menuOffcanvas.setAttribute("aria-controls", "offcanvasRight");
        menuOffcanvas.innerHTML = sessionStorage.getItem("email");
        document.getElementById("logoutButton").addEventListener("click", function () {
          sessionStorage.clear();
          localStorage.clear();
          window.location.href = "login.html";
        })
      }
})


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