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
const showProductsList = () => {
    let htmlContentToAppend = "";
    for (let i = 0; i < categoryData.products.length; i++) {
        let product = categoryData.products[i];
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
    categoryData = data;
    showProductsList();
});