
const productContainer = document.getElementById("productContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

const cartButton = document.getElementById("cartButton");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");

const menuButton = document.getElementById("menuButton");
const navLinks = document.querySelector(".nav-links");

let products = [];
let cart = [];

// FETCH PRODUCTS FROM JSON

async function loadProducts() {
    try {
        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products");
        }

        products = await response.json();

        displayProducts(products);

    } catch (error) {
        productContainer.innerHTML =
            "<p>Products could not be loaded. Please use Live Server.</p>";

        console.error(error);
    }
}

// DISPLAY PRODUCTS

function displayProducts(productList) {

    productContainer.innerHTML = "";

    if (productList.length === 0) {
        productContainer.innerHTML =
            "<p>No products found.</p>";
        return;
    }

    productList.forEach(product => {

        const card = document.createElement("div");
        card.className = "product-card";

        const imageBox = document.createElement("div");
        imageBox.className = "product-image";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";

        image.onerror = function () {
            this.src = "https://placehold.co/500x400?text=ShopZone";
        };

        imageBox.appendChild(image);

        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("span");
        category.className = "product-category";
        category.textContent = product.category;

        const name = document.createElement("h3");
        name.textContent = product.name;

        const rating = document.createElement("div");
        rating.className = "rating";
        rating.textContent = "★ " + product.rating + " / 5";

        const bottom = document.createElement("div");
        bottom.className = "product-bottom";

        const price = document.createElement("span");
        price.className = "price";
        price.textContent = "₹" + product.price.toLocaleString("en-IN");

        const button = document.createElement("button");
        button.className = "add-cart";
        button.textContent = "Add to Cart";

        button.addEventListener("click", () => {
            addToCart(product.id);
        });

        bottom.appendChild(price);
        bottom.appendChild(button);

        info.appendChild(category);
        info.appendChild(name);
        info.appendChild(rating);
        info.appendChild(bottom);

        card.appendChild(imageBox);
        card.appendChild(info);

        productContainer.appendChild(card);
    });
}

// SEARCH PRODUCTS

function filterProducts() {

    const searchValue = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredProducts = products.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(searchValue) ||
            product.category.toLowerCase().includes(searchValue);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    displayProducts(filteredProducts);
}

searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);

// ADD TO CART

function addToCart(productId) {

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }

    updateCart();

    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");
}

// UPDATE CART

function updateCart() {

    cartItems.innerHTML = "";

    let totalQuantity = 0;
    let totalPrice = 0;

    if (cart.length === 0) {

        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty!</p>';

    }

    cart.forEach(item => {

        const product = products.find(p => p.id === item.id);

        if (!product) return;

        totalQuantity += item.quantity;
        totalPrice += product.price * item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;

        const info = document.createElement("div");
        info.className = "cart-item-info";

        const name = document.createElement("h4");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.textContent =
            "₹" + (product.price * item.quantity).toLocaleString("en-IN");

        const controls = document.createElement("div");
        controls.className = "quantity-controls";

        const decrease = document.createElement("button");
        decrease.textContent = "-";

        decrease.addEventListener("click", () => {
            changeQuantity(item.id, -1);
        });

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const increase = document.createElement("button");
        increase.textContent = "+";

        increase.addEventListener("click", () => {
            changeQuantity(item.id, 1);
        });

        controls.appendChild(decrease);
        controls.appendChild(quantity);
        controls.appendChild(increase);

        info.appendChild(name);
        info.appendChild(price);
        info.appendChild(controls);

        const remove = document.createElement("button");
        remove.className = "remove-item";
        remove.textContent = "✕";
        remove.setAttribute("aria-label", "Remove " + product.name);

        remove.addEventListener("click", () => {
            removeFromCart(item.id);
        });

        cartItem.appendChild(image);
        cartItem.appendChild(info);
        cartItem.appendChild(remove);

        cartItems.appendChild(cartItem);
    });

    cartCount.textContent = totalQuantity;

    cartTotal.textContent =
        "₹" + totalPrice.toLocaleString("en-IN");

    checkoutButton.disabled = cart.length === 0;
}

// CHANGE QUANTITY

function changeQuantity(productId, amount) {

    const item = cart.find(item => item.id === productId);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    updateCart();
}

// REMOVE ITEM

function removeFromCart(productId) {

    cart = cart.filter(item => item.id !== productId);

    updateCart();
}

// OPEN CART

cartButton.addEventListener("click", () => {
    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");
});

// CLOSE CART

function hideCart() {
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
}

closeCart.addEventListener("click", hideCart);
cartOverlay.addEventListener("click", hideCart);

// CHECKOUT

checkoutButton.addEventListener("click", () => {

    if (cart.length === 0) return;

    alert("Thank you for shopping with ShopZone! Your demo order is ready.");

    cart = [];
    updateCart();
    hideCart();
});

// MOBILE MENU

menuButton.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });
});

// START WEBSITE

loadProducts();
updateCart();
