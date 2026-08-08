const addButtons = document.querySelectorAll(".add-to-cart");
const cartSidebar = document.querySelector(".aside-sec");

const cartItemsContainer = document.querySelector(".body-section");
const cartCountSpan = document.getElementById("cartCount");
const cartTotalPriceSpan = document.getElementById("cartTotalPrice");

const cartsSection = document.querySelector("#carts");

let cartItem = [];


addButtons.forEach(function(button) {

    button.addEventListener("click", function() {

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


        const existingProduct = cartItem.find(function(item) {
            return item.name === product.name;
        });


        if (existingProduct) {

            if (existingProduct.quantity < existingProduct.stock) {
                existingProduct.quantity++;
            }

        } else {

            cartItem.push(product);

        }


        // Update In Stock number
        const currentProduct = existingProduct || product;

        const remainingStock =
            currentProduct.stock - currentProduct.quantity;

        card.querySelector("span").textContent =
            `In Stock: ${remainingStock}`;


        // Show sidebar and move products
        if (cartItem.length === 1) {

            cartSidebar.classList.add("active");
            cartsSection.classList.add("cart-open");

        }

        renderCart();

        console.log(cartItem);

    });

});


function renderCart() {

    if (cartItem.length === 0) {

        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
            </div>
        `;

        if (cartCountSpan) {
            cartCountSpan.textContent = "0";
        }

        if (cartTotalPriceSpan) {
            cartTotalPriceSpan.textContent = "0.00 EGP";
        }

        return;
    }


    let cartHTML = "";
    let totalPrice = 0;
    let totalItemsCount = 0;


    cartItem.forEach(function(item) {

        const itemTotal = item.price * item.quantity;

        totalPrice += itemTotal;
        totalItemsCount += item.quantity;


        cartHTML += `
            <div class="cart-item">

                <img 
                    src="${item.image}" 
                    alt="${item.name}" 
                    class="product-img"
                >

                <div class="item-details">

                    <h4 class="item-name">
                        ${item.name}
                    </h4>

                    <span class="item-price">
                        ${item.price.toLocaleString()} EGP
                    </span>

                    <div class="quantity-controls">

                        <button 
                            class="qty-btn"
                            onclick="changeQuantity('${item.id}', -1)"
                        >
                            -
                        </button>

                        <span class="qty-number">
                            ${item.quantity}
                        </span>

                        <button 
                            class="qty-btn"
                            onclick="changeQuantity('${item.id}', 1)"
                        >
                            +
                        </button>

                        <button 
                            class="delete-btn"
                            onclick="removeItem('${item.id}')"
                            title="Remove"
                        >
                            <i class="fa-solid fa-trash-can"></i>
                        </button>

                    </div>

                </div>

                <div class="item-total-price">
                    ${itemTotal.toLocaleString()} EGP
                </div>

            </div>
        `;
    });


    cartItemsContainer.innerHTML = cartHTML;


    if (cartCountSpan) {
        cartCountSpan.textContent = totalItemsCount;
    }


    if (cartTotalPriceSpan) {
        cartTotalPriceSpan.textContent =
            `${totalPrice.toLocaleString()} EGP`;
    }

}


function changeQuantity(id, change) {

    const item = cartItem.find(function(product) {
        return product.id === id;
    });


    if (!item) {
        return;
    }


    if (change === 1) {

        if (item.quantity < item.stock) {
            item.quantity++;
        }

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
    cards.forEach(function(card) {
        const name = card.querySelector("h2").textContent;
        if (name === item.name) {
            const stockSpan = card.querySelector("span");
            const remainingStock =
                item.stock - item.quantity;
            stockSpan.textContent =
                `In Stock: ${remainingStock}`;
        }
    });

}

function removeItem(id) {
    const item = cartItem.find(function(product) {
        return product.id === id;
    });

    if (item) {

        // Return the quantity back to stock
        const cards = document.querySelectorAll(".cart");
        cards.forEach(function(card) {
            const name = card.querySelector("h2").textContent;
            if (name === item.name) {
                const stockSpan = card.querySelector("span");
                stockSpan.textContent =
                    `In Stock: ${item.stock}`;
            }
        });

    }

    cartItem = cartItem.filter(function(product) {
        return product.id !== id;
    });

    renderCart();

    if (cartItem.length === 0) {
        cartSidebar.classList.remove("active");
        cartsSection.classList.remove("cart-open");
    }

}
