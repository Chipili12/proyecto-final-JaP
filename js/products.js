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
          <div class="col-md-3 col-12">
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
  categoryData = original; // Array para almacenar los datos de la categoría
  showProductsList(datosRelevancia()); //Se muestra la lista inicial de productos
});

// Declaro la función para filtrar los productos por precio mínimo y máximo
function datosFiltrado() {
  let minimo = parseInt(document.getElementById("rangeFilterCountMin").value);
  let maximo = parseInt(document.getElementById("rangeFilterCountMax").value);
  minimo = isNaN(minimo) ? 0 : minimo; // Si es NaN, se le asigna 0
  maximo = isNaN(maximo) ? Number.MAX_VALUE : maximo; // Si es NaN, le asigna un valor muy alto
  const filteredCategoryData = categoryData.filter((item) => item.cost >= minimo && item.cost <= maximo); // Filtra los productos por el rango de precios
  return filteredCategoryData;
}

// Declaro la función para ordenar los productos por relevancia (catidad de vendidos)
function datosRelevancia() {
  let filteredCategoryData = datosFiltrado(); // Obtiene los datos filtrados
  if (!isAscending) {
    filteredCategoryData = filteredCategoryData.sort((a, b) => a.soldCount - b.soldCount); // Ordena de menor a mayor
    document.getElementById("countButton").className = "fas fa-sort-amount-down mr-1"; // Cambia el ícono
  } else {
    filteredCategoryData = filteredCategoryData.sort((a, b) => b.soldCount - a.soldCount); // Ordena de mayor a menor
    document.getElementById("countButton").className = "fas fa-sort-amount-up mr-1"; // Cambia el ícono
  }
  isAscending = !isAscending; // Cambia el órden del filtrado
  return filteredCategoryData;
}

// Event listeners para filtrar y ordenar
document.getElementById("sortByPrice").addEventListener("click", function () {
  const filteredCategoryData = datosFiltrado();
  let resultPrice = []; // array para almacenar los resultados del ordenado por precio
  let orden = document.getElementById("UpDown").className; // obtiene la clase del icono

  if (orden == "fas fa-sort-amount-up mr-1") {
    resultPrice = filteredCategoryData.sort((a, b) => a.cost - b.cost); // ordena de menor a mayor
    document.getElementById("UpDown").className = "fas fa-sort-amount-down mr-1"; // cambia el icono
  } else {
    resultPrice = filteredCategoryData.sort((a, b) => b.cost - a.cost); // ordena de mayor a menor
    document.getElementById("UpDown").className = "fas fa-sort-amount-up mr-1"; // cambia el icono
  }
  categoryData = resultPrice; // asigna el array ordenado a la variable categoryData
  showProductsList(resultPrice); // muestra los productos ordenados
});

// Event listener para filtrar por precio
document.getElementById("rangeFilterCount").addEventListener("click", () => {
  showProductsList(datosFiltrado());
});

// Event listener para ordenar por relevancia
document.getElementById("sortByCount").addEventListener("click", () => {
  showProductsList(datosRelevancia());
});

// Event listener para limpiar los filtros
document.getElementById("clearRangeFilter").addEventListener("click", () => {
  document.getElementById("rangeFilterCountMin").value = ""; // Limpia el valor mínimo
  document.getElementById("rangeFilterCountMax").value = ""; // Limpia el valor máximo
  document.getElementById("buscador").value = ""; // Limpia el valor de la búsqueda
  categoryData = original;
  let filteredCategoryData = original.sort((a, b) => b.soldCount - a.soldCount); // Filtra los productos por la relevancia para volver al órden predefinido
  showProductsList(filteredCategoryData);
});

// Declaro la función para buscar productos por nombre o descripción
function searchBar() {
  let inputP = document.getElementById("buscador").value.toLowerCase(); // Obtiene el valor de la barra de búsqueda y lo convierte a minúsculas
  let searchComparison = original.filter((item) => item.name.toLowerCase().includes(inputP) || item.description.toLowerCase().includes(inputP)); // Revisa si algún nombre o descripción de producto coincide con el valor de la barra de búsqueda
  categoryData = searchComparison; // Asigna el valor de la lista filtrada al array categoryData, para utilizarla en el resto de las funciones
  showProductsList(categoryData); // Muestra los productos filtrados
}

// Event listener para la barra de búsqueda, llama a la función searchBar a medida que se escribe
document.getElementById("buscador").addEventListener("input", () => {
  searchBar(); // Imprime la lista de productos, filtrados por el valor de la barra de búsqueda
});
