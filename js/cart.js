let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
console.log(cartItems);

function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';

    cartItems.forEach(cartItem => {
        const item = cartItem.item; // Accede al item del carrito

        const itemElement = document.createElement('div');
        itemElement.className = 'card mb-4';
        itemElement.id = `item-cart`;
        itemElement.innerHTML = `
            <div class="row g-0 align-items-center">
                <div class="col-md-2 text-center">
                    <img src="${item.images[0]}" class="product-image m-3" alt="${item.name}"> <!-- Use first image -->
                </div>
                <div class="col-md-10">
                    <div class="card-body">
                        <div class="row ">
                            <div class="col-md-5">
                                <h5 class="card-title">${item.name}</h5>
                                <p class="card-text text-muted mt-4">Precio: ${item.currency} ${item.cost.toFixed(2)}</p> <!-- Use cost instead of price -->
                                <div class="input-group">
                                    <span class="input-group-text">Cantidad</span>
                                    <input type="number" class="form-control quantity-input" value="${cartItem.quantity}" min="1" data-item-id="${item.id}">
                                </div>
                            </div>
                            <div class="col-md-4"></div>
                            <div class="col-md-3 subtotal-grid text-end">
                                <p class="card-text mb-0 top-0">Subtotal:</p>
                                <p class="card-text subtotal"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        cartContainer.appendChild(itemElement);
    });

    updateTotal();
}

function updateTotal() {
    const quantities = document.querySelectorAll('.quantity-input');
    let total = 0;

    quantities.forEach(input => {
        const itemId = parseInt(input.getAttribute('data-item-id'));
        const cartItem = cartItems.find(cartItem => cartItem.item.id === itemId); // accede al item id
        const quantity = parseInt(input.value) || 0;
        const subtotal = cartItem.item.cost * quantity; // usa costo de item * cantidad para el subtotal individual
        total += subtotal;

        const subtotalElement = input.closest('.card-body').querySelector('.subtotal');
        subtotalElement.textContent = `${cartItem.item.currency} ${subtotal.toFixed(2)}`; // actualiza el subtotal individual
    });

    document.getElementById('cart-total').textContent = `${cartItems[0].item.currency} ${total.toFixed(2)}`; 
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    document.getElementById('cart-items').addEventListener('input', updateTotal);
});
