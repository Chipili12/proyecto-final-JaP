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
            <div class="d-inline-block align-items-center">
                <div class="row">
                    <div class="col-12 col-md-6">
                        <img src="${item.images[0]}" alt="Item ${item.id}" class=" img-thumbnail ">
                    </div>
                    <div class="col">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center">
                            <h4 class="mb-0">${item.name} </h4> 
                            </div>
                        </div>
                        <small class="mt-2 d-flex text-muted">${item.soldCount} artículos vendidos</small>
                    <p class="d-flex mt-4">${item.description}</p>
                    <div class="">
                            <h4 class="">${item.currency} ${item.cost}</h4> 
                    </div>
                    </div>
                    
            </div>
            `;
    document.getElementById("item").innerHTML = htmlContentToAppend;

};