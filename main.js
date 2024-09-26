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

  // Get elements for the cart slider
  const cartSlider = document.getElementById("cartSlider");
  const cartIcon = document.querySelector(".cart");
  const closeCart = document.getElementById("closeCart");
  const cartItemsList = document.getElementById("cartItemsList");
  const cartTotal = document.getElementById("cartTotal");
  const cartMessage = document.getElementById("cartMessage");

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

      // Loop through cart items and create the cart structure
      cartItems.forEach((item, index) => {
        const li = document.createElement("li");

        // Create the HTML structure for each cart item
        li.innerHTML = `
        <div class="cart-item">
          <div class="product-name">${item.name}</div>
          <div class="product-price">₹${item.price}</div>
        </div>
        `;

        // Append the item to the cart items list
        cartItemsList.appendChild(li);

        // Calculate the total price
        total += item.price * item.quantity;
      });

      // Update the total price in the cart
      cartTotal.textContent = `Total: ₹${total}`;
      cartTotal.style.display = "block";
    }
  }

  // Update the checkout button visibility
  function updateCheckoutButton() {
    const checkoutButton = document.getElementById("checkout-button");
    checkoutButton.style.display = "block"; // Always show the checkout button
  }

  // Function to handle checkout button click
  function handleCheckout() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    // Check if the cart is not empty
    if (cartItems.length > 0) {
      window.location.href = "UserForm.html"; // Redirect to UserForm.html
    } else {
      alert(
        "Your cart is empty. Please add items to the cart before proceeding to checkout."
      );
    }
  }

  // Adding event listener to the checkout button
  const checkoutButton = document.getElementById("checkout-button");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", handleCheckout);
  }

  // Call loadCartItems on page load
  loadCartItems(); // Ensure cart is loaded properly on page load
  updateCheckoutButton(); // Update the button visibility on load
});
