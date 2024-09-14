// Utilizamos el localStorage para obtener el ID del producto seleccionado
const API_URL = `https://japceibal.github.io/emercado-api/products/${localStorage.getItem("itemID")}.json`;

// Declaro la función que obtiene los datos del producto realizando un fetch a la API
const fetchItem = async () => {
    try {
        const respuesta = await fetch(API_URL);
        return await respuesta.json()
    } catch (error) {
        console.log(error);
    }
};

// Llamo a la función fetchItem y asigno los datos del producto a la variable itemData
fetchItem().then((data) => {
    itemData = data;
    console.log(itemData)
    showItem(itemData); // Llamo a la función para mostrar los datos del producto
});

// Declaro la función showItem que muestra los datos del producto en la página, utilizando el JSON obtenido de la API
const showItem = (item) => {
    let htmlContentToAppend = "";
    htmlContentToAppend += `
    <div class="row ">
        <p class="text-start text-muted">${item.category}</p>
        
        <!-- Imágenes chiquitas -->
        <div class="col-12 col-lg-1 d-lg-block d-flex">
            ${item.images.map((image, index) => `
                <img src="${image}" alt="Item ${item.id} Image ${index + 1}" class="img-thumbnail mb-2 img2" data-large-image="${item.images[0]}" small-image="${image}">
            `).join('')}
        </div>

        <!-- Imagen grande -->
        <div class="col-10 col-lg-5 d-flex justify-content-center">
            <img id="largeImage" src="${item.images[0]}" alt="Item ${item.id}" class="img-thumbnail">
        </div>

        <!-- Descripción -->
        <div class="col-12 d-flex flex-column justify-content-start col-lg-5 mt-lg-0 mt-4">
            <h4 class="mb-0">${item.name}</h4> 
            <small class="mt-2 text-muted text-start">${item.soldCount} artículos vendidos</small>
            <p class="mt-2 mt-lg-4">${item.description}</p>
            <div class="d-flex justify-content-between mt-4 mt-lg-auto mb-4">
                <h4>${item.currency} ${item.cost}</h4> 
                <button class="btn btn-comprar me-5">Comprar</button>
            </div>
        </div>
    </div>
    `;

    document.getElementById("item").innerHTML = htmlContentToAppend;

    // Cambia la imágen al hacer click
    document.querySelectorAll('.img2').forEach(img => {
        img.addEventListener('click', (e) => {
            const largeImage = document.getElementById('largeImage');
            largeImage.src = e.target.getAttribute('small-image');
        });
    });
};
