let cart = JSON.parse(localStorage.getItem('cart')) || []; //Obtengo el carrito del localStorage

function renderCart() { //Muestro los productos del localStorage en el carrito
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';

    cart.forEach(cartItem => {
        const item = cartItem.item; // Accede al item del carrito

        const itemElement = document.createElement('div');
        itemElement.className = 'card mb-4 ';
        itemElement.id = `item-cart`;
        itemElement.className += `item-${item.id}`;
        itemElement.innerHTML = `
        <div class="row align-items-center g-3 m-3">
            <!-- IMA -->
            <div class="col-12 col-md-2 mt-0">
                <img src="${item.images[0]}" class="product-image img-fluid rounded" alt="${item.name}">
            </div>
            
            <!-- NOMBRE PRECIO CANTIDAD -->

            <div class="col-12 col-md-10">
                <div class="card-body p-0 ">
                    <div class="row g-3">
                        <!-- Product Info - Full width on mobile, 6 columns on md+ -->
                        <div class="col-12 col-md-6 mt-0">
                            <h5 class="card-title mb-3 mt-md-0 mt-2">${item.name}</h5>
                            <p class="card-text text-muted mb-3">Precio: ${item.currency} ${item.cost.toFixed(2)}</p>
                            <div class="row g-3">
                                <div  class="input-group" style="max-width: 200px;">
                                    <span class="input-group-text">Cantidad</span>
                                    <input type="number" 
                                    class="form-control quantity-input" 
                                    value="${cartItem.quantity}" 
                                    min="1" 
                                    data-item-id="${item.id}"/>
                                </div>
                            </div>
                        </div>
                        
                        <!-- SUBTOTAL PRECIO -->
                        <div class="col-12 col-md-6 text-start text-md-end">
                            <p class="card-text mb-2">Subtotal:</p>
                            <p class="card-text subtotal mb-2 fw-bold"></p>
                            <i class="bi bi-trash text-danger" onclick="deleteItem(${item.id})"></i>     
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        cartContainer.appendChild(itemElement);
    });

    updateTotal(); // Llamo a la función para obtener los subtotales y el total por primera vez
}

function updateTotal() {
    const quantities = document.querySelectorAll('.quantity-input');
    let total = 0;
    quantities.forEach(input => {
        const itemId = parseInt(input.getAttribute('data-item-id'));
        const cartItem = cart.find(cartItem => cartItem.item.id === itemId); // accede al item id
        const existingItemIndex = cart.findIndex(cartItem => cartItem.item.id === itemId);
        const quantity = parseInt(input.value) || 0;
        cart[existingItemIndex].quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));

        const subtotal = cartItem.item.currency === 'USD' ? cartItem.item.cost * quantity : cartItem.item.cost / 42 * quantity; // usa costo de item * cantidad para el subtotal individual
        total += subtotal;
        const subtotalElement = input.closest('.card-body').querySelector('.subtotal');
        subtotalElement.textContent = `${cartItem.item.currency} ${cartItem.item.cost * quantity.toFixed(2)}`; // actualiza el subtotal individual
    });
    document.getElementById('cart-total').textContent = `USD ${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    document.getElementById('cart-items').addEventListener('input', updateTotal);
});


function deleteItem(itemId) {
    const existingItemIndex = cart.findIndex(cartItem => cartItem.item.id === itemId);
    cart.splice(existingItemIndex, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    document.getElementById(`item-cart`).remove();
    updateTotal() 
    renderCart();
    document.getElementById("cartBadge").textContent = JSON.parse(localStorage.getItem('cart')).length || 0
}