// Utilizamos el localStorage para obtener el ID de la categoría, seleccionada en la página de categorías
let categoryID = localStorage.getItem("catID");

// Utilizo la categoría dada por el localStorage, para completar la URL de la API
const API_URL = `https://japceibal.github.io/emercado-api/cats_products/${categoryID}.json`;
let categoryData = undefined;

// Declaro la función que obtiene los datos de una categoría de productos realizando un fetch a la API
const fetchProduct = async () => {
  try {
    const respuesta = await fetch(API_URL);
    return await respuesta.json();
  } catch (error) {
    console.log(error);
  }
};

// Declaro la función para mostrar la lista de productos en el DOM, utilizando el JSON dado por la API
const showProductsList = (array) => {
  let htmlContentToAppend = "";
  for (let i = 0; i < array.length; i++) {
    let product = array[i];
    {
      htmlContentToAppend += `
            <div class="list-group-item list-group-item-action cursor-active py-3">
                <div class="row">
                    <div class="col-3">
                        <img src="${product.image}" alt="Product ${i + 1}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center">
                            <h4 class="mb-0">${product.name} </h4> 
                            </div>
                            <small class="text-muted">${product.soldCount} artículos vendidos</small>
                        </div>
                    <p class="mt-2 d-flex">$${product.cost} ${product.currency}</h5>
                    <p class="d-flex mt-4">${product.description}</p>
                    </div>
                </div>
            </div>
            `;
    }
    document.getElementById("products").innerHTML = htmlContentToAppend;
  }
};

// Llamo la función para realizar el fetch, posteriormente asigno el resultado en formato JSON a la variable categoryData, y llamo a la función showProductsList.
fetchProduct().then((data) => {
  categoryData = data.products;
  showProductsList(categoryData);
});

// Filtrar y ordenar productos
document.addEventListener("DOMContentLoaded", function (e) {});

document.getElementById("sortByPrice").addEventListener("click", function () {
  const filteredCategoryData = datosFiltrado();

  let resultPrice = []; // arreglo vacio
  let orden = document.getElementById("UpDown").className;

  if (orden == "fas fa-sort-amount-up mr-1") {
    // De menor a mayor
    resultPrice = filteredCategoryData.sort(function (a, b) {
      if (a.cost < b.cost) {
        return -1;
      }
      if (a.cost > b.cost) {
        return 1;
      }
      return 0;
    });
    document.getElementById("UpDown").className = "fas fa-sort-amount-down mr-1";
  } else {
    // De mayor a menor
    resultPrice = filteredCategoryData.sort(function (a, b) {
      if (a.cost > b.cost) {
        return -1;
      }
      if (a.cost < b.cost) {
        return 1;
      }
      return 0;
    });
    document.getElementById("UpDown").className = "fas fa-sort-amount-down mr-1";
  }
  showProductsList(resultPrice);
});

document.getElementById("rangeFilterCount").addEventListener("click", () => {
  showProductsList(datosFiltrado());
});

function datosFiltrado() {
  let minimo = parseInt(document.getElementById("rangeFilterCountMin").value);
  let maximo = parseInt(document.getElementById("rangeFilterCountMax").value);
  minimo = isNaN(minimo) ? 0 : minimo; // Si es NaN, se asigna 0
  maximo = isNaN(maximo) ? Number.MAX_VALUE : maximo; // Si es NaN, se asigna un valor muy alto
  const filteredCategoryData = categoryData.filter((item) => item.cost > minimo && item.cost < maximo);
  return filteredCategoryData;
}
