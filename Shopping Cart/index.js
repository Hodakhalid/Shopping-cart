                          // aside

const aside = document.getElementById("aside-sec");
const btn = document.getElementById("openCartBtn");
const btnClose = document.getElementById("closeCartBtn");

const cartItemsContainer = document.querySelector(".body-section");
const cartCountSpan = document.getElementById("cartCount");
const cartTotalPriceSpan = document.getElementById("cartTotalPrice");

function toggleFunction() {
    aside.classList.toggle("active");
}

btn.addEventListener("click", toggleFunction);
btnClose.addEventListener("click", toggleFunction);


let cartItem = [
    {
        id: 1,
        name: "Smart watch",
        price: 1250,
        quantity: 1,
        image: "../Shopping Cart/assets/Smart Watch.jpg"
    }
];

function renderCart() {
    if (cartItem.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty </p>
            </div>
        `;
        cartCountSpan.textContent = "0";
        if (cartTotalPriceSpan) cartTotalPriceSpan.textContent = "0.00 EGP";
        return;
    }

    let cartHTML = "";
    let totalPrice = 0;
    let totalItemsCount = 0;

    cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        totalItemsCount += item.quantity;

        cartHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="product-img">
                
                <div class="item-details">
                    <h4 class="item-name">${item.name}</h4>
                    <span class="item-price">${item.price.toLocaleString()} EGP</span>

                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                        <span class="qty-number">${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                        <button class="delete-btn" onclick="removeItem(${item.id})" title="Remove">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>

                <div class="item-total-price">${itemTotal.toLocaleString()} EGP</div>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = cartHTML;
    cartCountSpan.textContent = totalItemsCount;
    if (cartTotalPriceSpan) {
        cartTotalPriceSpan.textContent = `${totalPrice.toLocaleString()} EGP`;
    }
}


function changeQuantity(id, change) {
    const numericId = Number(id);
    const item = cartItem.find(prod => prod.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeItem(id);
            return;
        }
    }
    renderCart();
}

function removeItem(id) {
    cartItem = cartItem.filter(prod => prod.id !== id);
    renderCart();
}

renderCart();


const clearCartBtn = document.getElementById("clearCartBtn");

if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
        cartItem = [];
        renderCart();
    });
}