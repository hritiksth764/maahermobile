// Document ready function
// function redirectToMobile() {
//   const isMobile = window.innerWidth <= 768; // Define mobile width threshold
//   const currentUrl = window.location.href;

//   // Check if the current URL is the desktop site on custom domain and user is on a mobile device
//   if (isMobile && currentUrl.includes("maaher.life")) {
//     window.location.href = "https://maahermobile.vercel.app";
//   }

//   // Optional: Redirect back to desktop if user resizes window to desktop size
//   if (!isMobile && currentUrl.includes("maaher.life")) {
//     window.location.href = "https://maaher.vercel.app";
//   }
// }

// Call the function on page load
document.addEventListener("DOMContentLoaded", function () {
  // Function to update cart counter from local storage
  function updateCartCounter() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const cartCounter = document.getElementById("cart-counter");

    // Calculate the total quantity of items in the cart
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    if (totalItems > 0) {
      cartCounter.textContent = totalItems; // Update the cart counter with the total number of items
      cartCounter.classList.remove("hidden"); // Show the counter if it's hidden
    } else {
      cartCounter.classList.add("hidden"); // Hide the counter if there are no items
    }
  }

  // Function to add a product to the cart
  function addToCart(productName, productPrice) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    // Check if the item is already in the cart
    const existingItem = cartItems.find((item) => item.name === productName);
    if (existingItem) {
      existingItem.quantity += 1; // Increment quantity if the product is already in the cart
    } else {
      // Add new item to the cart
      cartItems.push({
        name: productName,
        price: productPrice,
        quantity: 1,
      });
    }

    // Save updated cart to local storage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartCounter(); // Update the cart counter
  }

  // Example: Update the cart counter when the page loads
  updateCartCounter();

  // Example: Add to cart functionality (replace with your actual product details)
  const addToBagButton = document.getElementById("addToBag");
  addToBagButton?.addEventListener("click", function () {
    const productName = document.getElementById("productName").textContent;
    const productPrice = parseInt(
      document.getElementById("productPrice").textContent.replace(/[^0-9]/g, "")
    );
    addToCart(productName, productPrice);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Get elements
  const cartSlider = document.getElementById("cartSlider");
  const cartIcon = document.querySelector(".cart");
  const closeCart = document.getElementById("closeCart");
  const cartItemsList = document.getElementById("cartItemsList");
  const cartTotal = document.getElementById("cartTotal");
  const cartMessage = document.getElementById("cartMessage");
  const checkoutButton = document.getElementById("checkout-button");

  // Open cart slider when cart icon is clicked
  cartIcon.addEventListener("click", function () {
    cartSlider.classList.add("active");
    loadCartItems(); // Load the cart items whenever cart is opened
  });

  // Close cart slider when close button is clicked
  closeCart.addEventListener("click", function () {
    cartSlider.classList.remove("active");
  });

  // Load cart items from local storage
  function loadCartItems() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    // Clear previous cart content
    cartItemsList.innerHTML = "";

    if (cartItems.length === 0) {
      cartMessage.style.display = "block";
      cartTotal.style.display = "none";
    } else {
      cartMessage.style.display = "none";
      let total = 0;

      cartItems.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - RS. ${item.price} x ${item.quantity}`;
        cartItemsList.appendChild(li);
        total += item.price * item.quantity;
      });

      cartTotal.textContent = `Total: RS. ${total}`;
      cartTotal.style.display = "block";
    }
  }

  // Update the checkout button visibility
  function updateCheckoutButton() {
    const checkoutButton = document.getElementById("checkout-button");
    checkoutButton.style.display = "block"; // Always show the checkout button
  }

  // Call loadCartItems on page load
  loadCartItems(); // Ensure cart is loaded properly on page load
  updateCheckoutButton(); // Update the button visibility on load

  // Clear localStorage when the user closes the tab
  window.addEventListener("beforeunload", function () {
    localStorage.removeItem("cartItems");
  });
});

// Example: Function to add items to cart
function addToCart(product) {
  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  cartItems.push(product);
  localStorage.setItem("cart", JSON.stringify(cartItems));
  updateCheckoutButton(); // Update the button visibility after adding items
}

// Example: Function to remove items from cart
function removeFromCart(productId) {
  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  cartItems = cartItems.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cartItems));
  updateCheckoutButton(); // Update the button visibility after removing items
}
