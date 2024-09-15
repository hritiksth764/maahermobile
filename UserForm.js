// Fetch the cart from local storage and display it on the page
function displayCart() {
  const cartDetails = document.getElementById("cartDetails");
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  if (cartItems.length === 0) {
    cartDetails.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let cartHtml = "<ul>";
  let total = 0;

  cartItems.forEach((item) => {
    cartHtml += `
          <li>
              <p>${item.name} - RS. ${item.price} x ${item.quantity}</p>
              <p><a href="#" onclick="removeItemFromCart('${item.name}')">Remove</a></p>
          </li>
      `;
    total += item.price * item.quantity;
  });

  cartHtml += `
      </ul>
      <p><strong>Subtotal:</strong> RS. ${total}</p>
      <p><strong>Shipping:</strong> RS. 50</p>
      <p><strong>GST:</strong> RS. ${(total * 0.18).toFixed(2)}</p>
      <p><strong>Total:</strong> RS. ${(total + 50 + total * 0.18).toFixed(
        2
      )}</p>
  `;

  cartDetails.innerHTML = cartHtml;
}

// Remove item from cart
function removeItemFromCart(productName) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  cartItems = cartItems.filter((item) => item.name !== productName);
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  displayCart();
}

// Save user details to local storage when the form is submitted
document
  .getElementById("userForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const userInfo = {
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      country: document.getElementById("country").value,
      address1: document.getElementById("address1").value,
      address2: document.getElementById("address2").value,
      city: document.getElementById("city").value,
      state: document.getElementById("state").value,
      pin: document.getElementById("pin").value,
    };

    localStorage.setItem("userInfo", JSON.stringify(userInfo));

    alert("User information saved successfully!");
  });

// Fetch cart details from local storage on page load
window.onload = function () {
  displayCart();
};

// Buy Now button functionality
document.getElementById("buyNowBtn").addEventListener("click", function () {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const cartItems = JSON.parse(localStorage.getItem("cartItems"));

  if (!userInfo || cartItems.length === 0) {
    alert(
      "Please fill in your details and add items to the cart before proceeding."
    );
    return;
  }

  // Proceed to payment page (Razorpay integration would go here)
  alert("Proceeding to payment...");
});
