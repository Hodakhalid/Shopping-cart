
const addButtons = document.querySelectorAll(".add-to-cart");
const cartSidebar = document.querySelector(".aside-sec");

const cartItemsContainer = document.querySelector(".body-section");
const cartCountSpan = document.getElementById("cartCount");

const cartsSection = document.querySelector("#carts");
const closeCartBtn = document.getElementById("closeCartBtn");

let cartItems = [];


addButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const card = button.parentElement;

        const productName = card.querySelector("h2").textContent;

        const productPrice = Number(
            card.querySelector("h3").textContent.replace(/\D/g, "")
        );

        const productStock = Number(
            card.querySelector("span").textContent.replace(/\D/g, "")
        );

        const productImage = card.querySelector("img").src;


        const product = {
            id: productName,
            name: productName,
            price: productPrice,
            stock: productStock,
            image: productImage,
            quantity: 1
        };


        const existingProduct = cartItems.find(function (item) {
            return item.name === product.name;
        });


        if (existingProduct) {

            if (existingProduct.quantity < existingProduct.stock) {
                existingProduct.quantity++;
            }

        } else {

            cartItems.push(product);

        }


        const currentProduct = existingProduct || product;
        updateProductStock(currentProduct);


        if (cartItems.length === 1) {

            cartSidebar.classList.add("active");
            cartsSection.classList.add("cart-open");

        }

        renderCart();

    });

});



if (closeCartBtn) {
    closeCartBtn.addEventListener("click", function () {
        cartSidebar.classList.remove("active");
        cartsSection.classList.remove("cart-open");
    });
}


function renderCart() {

    if (cartItems.length === 0) {

        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
            </div>
        `;

        if (cartCountSpan) {
            cartCountSpan.textContent = "0";
        }

        updateCartTotals(0);

        return;
    }


    let cartHTML = "";
    let totalPrice = 0;
    let totalItemsCount = 0;


    cartItems.forEach(function (item) {

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
                        <button class="qty-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
                        <span class="qty-number">${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
                        <button class="delete-btn" onclick="removeItem('${item.id}')" title="Remove">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
                <div class="item-total-price">${itemTotal.toLocaleString()} EGP</div>
            </div>
        `;
    });


    cartItemsContainer.innerHTML = cartHTML;

    if (cartCountSpan) {
        cartCountSpan.textContent = totalItemsCount;
    }

    updateCartTotals(totalPrice);
}


function changeQuantity(id, change) {

    const item = cartItems.find(function (product) {
        return product.id === id;
    });

    if (!item) return;

    if (change === 1 && item.quantity < item.stock) {
        item.quantity++;
    }

    if (change === -1) {
        item.quantity--;
    }

    if (item.quantity <= 0) {
        removeItem(id);
        return;
    }

    updateProductStock(item);
    renderCart();
}


function updateProductStock(item) {
    const cards = document.querySelectorAll(".cart");
    cards.forEach(function (card) {
        const name = card.querySelector("h2").textContent;
        if (name === item.name) {
            const stockSpan = card.querySelector("span");
            const button = card.querySelector(".add-to-cart");
            const remainingStock = item.stock - item.quantity;

            stockSpan.textContent = `In Stock: ${remainingStock}`;

            if (remainingStock <= 0) {
                button.disabled = true;
                button.textContent = "Out of Stock";
                button.classList.add("out-of-stock");
            } else {
                button.disabled = false;
                button.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Add to Cart`;
                button.classList.remove("out-of-stock");
            }
        }
    });
}

function removeItem(id) {
    const item = cartItems.find(function (product) {
        return product.id === id;
    });

    if (item) {
        const cards = document.querySelectorAll(".cart");
        cards.forEach(function (card) {
            const name = card.querySelector("h2").textContent;
            if (name === item.name) {
                const stockSpan = card.querySelector("span");
                const button = card.querySelector(".add-to-cart");

                stockSpan.textContent = `In Stock: ${item.stock}`;
                button.disabled = false;
                button.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Add to Cart`;
                button.classList.remove("out-of-stock");
            }
        });
    }

    cartItems = cartItems.filter(function (product) {
        return product.id !== id;
    });

    renderCart();

    if (cartItems.length === 0) {
        cartSidebar.classList.remove("active");
        cartsSection.classList.remove("cart-open");
    }
}


// Delivery / totals logic
const DELIVERY_FEE = 50;
const FREE_DELIVERY_THRESHOLD = 2500;

const subtotalElement = document.getElementById("cartSubtotal");
const deliveryFeeElement = document.getElementById("cartDeliveryFee");
const freeDeliveryMessageElement = document.getElementById("freeDeliveryMsg");
const totalElement = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");


function updateCartTotals(subtotal) {

    if (subtotalElement) {
        subtotalElement.textContent = `${subtotal.toLocaleString()} EGP`;
    }

    let delivery = 0;

    if (subtotal === 0) {
        if (deliveryFeeElement) deliveryFeeElement.textContent = "0 EGP";
        if (totalElement) totalElement.textContent = "0.00 EGP";
        if (freeDeliveryMessageElement) {
            freeDeliveryMessageElement.innerHTML =
                `🚚 Add <strong>${FREE_DELIVERY_THRESHOLD} EGP</strong> more to get <strong>FREE delivery</strong>`;
            freeDeliveryMessageElement.style.color = "#d9534f";
        }
        return;
    }

    if (subtotal >= FREE_DELIVERY_THRESHOLD) {
        delivery = 0;
        if (deliveryFeeElement) {
            deliveryFeeElement.textContent = "FREE";
            deliveryFeeElement.style.color = "#2e7d32";
        }
        if (freeDeliveryMessageElement) {
            freeDeliveryMessageElement.innerHTML = `🎉 <strong>Congratulations! You got FREE delivery</strong>`;
            freeDeliveryMessageElement.style.color = "#2e7d32";
        }
    } else {
        delivery = DELIVERY_FEE;
        if (deliveryFeeElement) {
            deliveryFeeElement.textContent = `${DELIVERY_FEE} EGP`;
            deliveryFeeElement.style.color = "inherit";
        }
        const remainingAmount = FREE_DELIVERY_THRESHOLD - subtotal;
        if (freeDeliveryMessageElement) {
            freeDeliveryMessageElement.innerHTML = `🚚 Add <strong>${remainingAmount} EGP</strong> more to get <strong>FREE delivery</strong>`;
            freeDeliveryMessageElement.style.color = "#d9534f";
        }
    }

    const finalTotal = subtotal + delivery;
    if (totalElement) {
        totalElement.textContent = `${finalTotal.toLocaleString()} EGP`;
    }
}


// Checkout
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        if (!cartItems || cartItems.length === 0) {
            alert("Your cart is empty! Please add some products first.");
            return;
        }

        alert("🎉 Order placed successfully! Thank you for your purchase.");

        cartItems = [];
        renderCart();

        cartSidebar.classList.remove("active");
        cartsSection.classList.remove("cart-open");
    });
}
