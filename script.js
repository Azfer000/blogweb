// Product Data
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        price: 79.99,
        category: "electronics",
        rating: 4.5,
        image: "https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Headphones",
        description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
        featured: true
    },
    {
        id: 2,
        name: "Smart Watch Series 5",
        price: 299.99,
        category: "electronics",
        rating: 4.8,
        image: "https://via.placeholder.com/300x200/50E3C2/FFFFFF?text=Smart+Watch",
        description: "Advanced smartwatch with health monitoring, GPS, and long battery life.",
        featured: true
    },
    {
        id: 3,
        name: "Cotton T-Shirt",
        price: 19.99,
        category: "clothing",
        rating: 4.2,
        image: "https://via.placeholder.com/300x200/E94B3C/FFFFFF?text=T-Shirt",
        description: "Comfortable 100% cotton t-shirt available in multiple colors and sizes.",
        featured: true
    },
    {
        id: 4,
        name: "Garden Hose 50ft",
        price: 34.99,
        category: "home",
        rating: 4.0,
        image: "https://via.placeholder.com/300x200/228B22/FFFFFF?text=Garden+Hose",
        description: "Durable garden hose with brass connectors and kink-resistant design.",
        featured: false
    },
    {
        id: 5,
        name: "Yoga Mat Premium",
        price: 49.99,
        category: "sports",
        rating: 4.6,
        image: "https://via.placeholder.com/300x200/F5A623/FFFFFF?text=Yoga+Mat",
        description: "Non-slip yoga mat with extra cushioning and eco-friendly materials.",
        featured: false
    },
    {
        id: 6,
        name: "Wireless Mouse",
        price: 24.99,
        category: "electronics",
        rating: 4.3,
        image: "https://via.placeholder.com/300x200/9B59B6/FFFFFF?text=Mouse",
        description: "Ergonomic wireless mouse with precision tracking and long battery life.",
        featured: false
    },
    {
        id: 7,
        name: "Coffee Maker",
        price: 89.99,
        category: "home",
        rating: 4.4,
        image: "https://via.placeholder.com/300x200/8B4513/FFFFFF?text=Coffee+Maker",
        description: "12-cup programmable coffee maker with thermal carafe and auto shut-off.",
        featured: false
    },
    {
        id: 8,
        name: "Running Shoes",
        price: 129.99,
        category: "sports",
        rating: 4.7,
        image: "https://via.placeholder.com/300x200/DC143C/FFFFFF?text=Running+Shoes",
        description: "Lightweight running shoes with advanced cushioning and breathable mesh.",
        featured: false
    },
    {
        id: 9,
        name: "Denim Jeans",
        price: 59.99,
        category: "clothing",
        rating: 4.1,
        image: "https://via.placeholder.com/300x200/2C3E50/FFFFFF?text=Jeans",
        description: "Classic fit denim jeans made from premium cotton with perfect stretch.",
        featured: false
    },
    {
        id: 10,
        name: "LED Desk Lamp",
        price: 39.99,
        category: "home",
        rating: 4.5,
        image: "https://via.placeholder.com/300x200/27AE60/FFFFFF?text=Desk+Lamp",
        description: "Adjustable LED desk lamp with multiple brightness levels and USB charging port.",
        featured: false
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const cartCount = document.getElementById('cart-count');
const cartLink = document.getElementById('cart-link');
const sortSelect = document.getElementById('sort-select');
const featuredProducts = document.getElementById('featured-products');
const allProducts = document.getElementById('all-products');

// Modal elements
const cartModal = document.getElementById('cart-modal');
const productModal = document.getElementById('product-modal');
const checkoutModal = document.getElementById('checkout-modal');
const closeButtons = document.querySelectorAll('.close');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    displayFeaturedProducts();
    displayAllProducts();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Sort functionality
    sortSelect.addEventListener('change', handleSort);

    // Cart modal
    cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        openCartModal();
    });

    // Close modals
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal || e.target === productModal || e.target === checkoutModal) {
            closeModals();
        }
    });

    // Category filtering
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const category = e.currentTarget.dataset.category;
            filterByCategory(category);
        });
    });

    // Checkout form
    document.getElementById('checkout-form').addEventListener('submit', handleCheckout);
}

// Display featured products
function displayFeaturedProducts() {
    const featured = products.filter(product => product.featured);
    featuredProducts.innerHTML = featured.map(product => createProductCard(product)).join('');
}

// Display all products
function displayAllProducts(productsToShow = products) {
    allProducts.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
}

// Create product card HTML
function createProductCard(product) {
    const ratingStars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));

    return `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-content">
                <h3>${product.name}</h3>
                <p>${product.description.substring(0, 60)}...</p>
                <div class="product-meta">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <span class="rating">${ratingStars} (${product.rating})</span>
                </div>
                <button class="btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;
}

// Handle search
function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    if (query === '') {
        displayAllProducts();
        return;
    }

    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );

    displayAllProducts(filtered);
}

// Handle sorting
function handleSort() {
    const sortBy = sortSelect.value;
    let sorted = [...products];

    switch (sortBy) {
        case 'name':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
    }

    displayAllProducts(sorted);
}

// Filter by category
function filterByCategory(category) {
    const filtered = products.filter(product => product.category === category);
    displayAllProducts(filtered);

    // Scroll to products section
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Add to cart functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
        const productId = parseInt(e.target.dataset.id);
        addToCart(productId);
    }

    if (e.target.classList.contains('product-card')) {
        const productId = parseInt(e.target.dataset.id);
        openProductModal(productId);
    }
});

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Open cart modal
function openCartModal() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0.00';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} each</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <span class="remove-item" onclick="removeFromCart(${item.id})">×</span>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    }

    cartModal.style.display = 'block';
}

// Update item quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartCount();
        openCartModal(); // Refresh modal
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    openCartModal(); // Refresh modal
}

// Clear cart
document.getElementById('clear-cart').addEventListener('click', () => {
    cart = [];
    saveCart();
    updateCartCount();
    openCartModal();
});

// Open product modal
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const ratingStars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));

    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-details').innerHTML = `
        <div class="product-detail">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-detail-info">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <p class="rating">${ratingStars} (${product.rating})</p>
                <p>${product.description}</p>
                <p><strong>Category:</strong> ${product.category}</p>
                <button class="btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;

    productModal.style.display = 'block';
}

// Open checkout modal
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('checkout-total').textContent = total.toFixed(2);

    cartModal.style.display = 'none';
    checkoutModal.style.display = 'block';
});

// Handle checkout
function handleCheckout(e) {
    e.preventDefault();

    // In a real application, you would send this data to a payment processor
    alert('Thank you for your order! This is a demo - no real payment was processed.');

    // Clear cart and close modals
    cart = [];
    saveCart();
    updateCartCount();
    closeModals();
}

// Close all modals
function closeModals() {
    cartModal.style.display = 'none';
    productModal.style.display = 'none';
    checkoutModal.style.display = 'none';
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: var(--accent-color);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact form handling
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    if (name && email && subject && message) {
        alert(`Thank you ${name}! Your message has been sent. We'll get back to you at ${email} soon.`);
        e.target.reset();
    } else {
        alert('Please fill in all fields.');
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Add loading animation to page
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';
