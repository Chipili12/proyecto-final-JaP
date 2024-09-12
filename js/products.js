// Utilizamos el localStorage para obtener el ID de la categoría, seleccionada en la página de categorías
let categoryID = localStorage.getItem("catID");

// Utilizo la categoría dada por el localStorage, para completar la URL de la API
const API_URL = `https://japceibal.github.io/emercado-api/cats_products/${categoryID}.json`;
let original = [];
let categoryData = [];
let isAscending = true;

// Declaro la función que obtiene los datos de una categoría de productos realizando un fetch a la API
const fetchProduct = async () => {
  try {
    const respuesta = await fetch(API_URL);
    const data = await respuesta.json();
    return data.products;
  } catch (error) {
    console.log(error);
  }
};

// Declaro la función para guardar el ID del producto seleccionado en localStorage y redirige a la página del producto
function setItemID(id) {
  localStorage.setItem("itemID", id);
  window.location = "product-info.html";
}

// Declaro la función para mostrar la lista de productos en el DOM, utilizando el JSON dado por la API
const showProductsList = (array) => {
  let htmlContentToAppend = "";
  for (let i = 0; i < array.length; i++) {
    let product = array[i];
    htmlContentToAppend += `
      <div onclick="setItemID(${product.id})" class="list-group-item list-group-item-action cursor-active py-3">
        <div class="row">
          <div class="col-3">
            <img src="${product.image}" alt="Product ${i + 1}" class="img-thumbnail">
          </div>
          <div class="col">
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <h4 class="mb-0">${product.name}</h4>
              </div>
              <small class="text-muted">${product.soldCount} artículos vendidos</small>
            </div>
            <p class="mt-2 d-flex">$${product.cost} ${product.currency}</p>
            <p class="d-flex mt-4">${product.description}</p>
          </div>
        </div>
      </div>
    `;
  }
  document.getElementById("products").innerHTML = htmlContentToAppend;
};

// Llamo la función para realizar el fetch y luego inicializo categoryData y otras funciones
fetchProduct().then((products) => {
  original = products;
  categoryData = original; // Initialize categoryData with the fetched products
  showProductsList(datosRelevancia()); //Se muestra la lista inicial de productos
});

// Function to filter products by price
function datosFiltrado() {
  let minimo = parseInt(document.getElementById("rangeFilterCountMin").value);
  let maximo = parseInt(document.getElementById("rangeFilterCountMax").value);
  minimo = isNaN(minimo) ? 0 : minimo; // If NaN, set to 0
  maximo = isNaN(maximo) ? Number.MAX_VALUE : maximo; // If NaN, set to a very high value
  const filteredCategoryData = categoryData.filter((item) => item.cost >= minimo && item.cost <= maximo); // Filter products by price
  return filteredCategoryData;  
}

// Function to sort products by relevance (sold count)
function datosRelevancia() {
  let filteredCategoryData = datosFiltrado(); //Obtiene los datos filtrados
  if (!isAscending) {
    filteredCategoryData = filteredCategoryData.sort((a, b) => a.soldCount - b.soldCount);  //Ordena de menor a mayor
    document.getElementById("countButton").className = "fas fa-sort-amount-down mr-1";
  } else {
    filteredCategoryData = filteredCategoryData.sort((a, b) => b.soldCount - a.soldCount); //Ordena de mayor a menor
    document.getElementById("countButton").className = "fas fa-sort-amount-up mr-1";
  }
  isAscending = !isAscending; //Cambia el órden del filtrado
  return filteredCategoryData;
}

// Event listeners for sorting and filtering
document.getElementById("sortByPrice").addEventListener("click", function () {
  const filteredCategoryData = datosFiltrado();
  let resultPrice = []; //array para almacenar los resultados del ordenado por precio
  let orden = document.getElementById("UpDown").className;

  if (orden == "fas fa-sort-amount-up mr-1") {
    resultPrice = filteredCategoryData.sort((a, b) => a.cost - b.cost); //ordena de menor a mayor
    document.getElementById("UpDown").className = "fas fa-sort-amount-down mr-1"; //cambia el icono
  } else {
    resultPrice = filteredCategoryData.sort((a, b) => b.cost - a.cost); //ordena de mayor a menor
    document.getElementById("UpDown").className = "fas fa-sort-amount-up mr-1"; 
  }
  categoryData=resultPrice
  showProductsList(resultPrice);
});

document.getElementById("rangeFilterCount").addEventListener("click", () => {
  showProductsList(datosFiltrado());
});

document.getElementById("sortByCount").addEventListener("click", () => {
  showProductsList(datosRelevancia()); 
});

document.getElementById("clearRangeFilter").addEventListener("click", () => {
  document.getElementById("rangeFilterCountMin").value = ""; //Limpia el valor mínimo
  document.getElementById("rangeFilterCountMax").value = ""; //Limpia el valor máximo
  document.getElementById("buscador").value = "";
  categoryData=original
  let filteredCategoryData = original.sort((a, b) => b.soldCount - a.soldCount); // Filtra los productos por la relevancia para volver al órden predefinido
  showProductsList(filteredCategoryData);
});

function searchBar() {
  let inputP = document.getElementById("buscador").value.toLowerCase(); //
  let searchComparison = original.filter((item) => item.name.toLowerCase().includes(inputP) || item.description.toLowerCase().includes(inputP)); //Revisa si algún nombre o descripción de producto coincide con el valor de la barra de búsqueda
  categoryData = searchComparison;   // Asigna el valor de la lista filtrada al array categoryData, para utilizarla en el resto de las funciones
  showProductsList(categoryData); // Muestra los productos filtrados
}

document.getElementById("buscador").addEventListener("input", () => {
    searchBar() // Imprime la lista de productos, filtrados por el valor de la barra de búsqueda
});
