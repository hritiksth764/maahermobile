// Fetch the cart from local storage and display it on the page
function displayCart() {
  const cartDetails = document.getElementById("cartDetails");
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  if (cartItems.length === 0) {
    cartDetails.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let cartHtml = "<ul class='cart-items-list'>";
  let total = 0;

  cartItems.forEach((item) => {
    cartHtml += `
      <li class="cart-item">
        <p class="product-name">${item.name}</p>
        <p class="product-price">RS. ${item.price} x ${item.quantity}</p>
        <p><a href="#" onclick="removeItemFromCart('${item.name}')" class="remove-link">Remove</a></p>
      </li>
    `;
    total += item.price * item.quantity;
  });

  cartHtml += `
    </ul>
    <div class="cart-summary">
      <p><strong>Subtotal:</strong> RS. ${total}</p>
      <p><strong>Shipping:</strong> RS. 50</p>
      <p><strong>Total:</strong> RS. ${(total + 50).toFixed(2)}</p>
    </div>
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

    console.log("Saving user info:", userInfo);

    localStorage.setItem("userInfo", JSON.stringify(userInfo));

    alert("User information saved successfully!");
  });

// Fetch cart details from local storage on page load
window.onload = function () {
  displayCart();
};

// Buy Now button functionality with Razorpay integration
document.getElementById("buyNowBtn").addEventListener("click", function () {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const cartItems = JSON.parse(localStorage.getItem("cartItems"));

  console.log("User Info:", userInfo); // Debugging
  console.log("Cart Items:", cartItems); // Debugging

  if (!userInfo || cartItems.length === 0) {
    alert(
      "Please fill in your details and add items to the cart before proceeding."
    );
    return;
  }

  // Razorpay options
  const options = {
    key: "rzp_test_nqtmUnMF9r43qM", // Replace with your Razorpay API key
    amount:
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0) *
      100, // Amount in paisa
    currency: "INR",
    name: "Your Store",
    description: "Test Transaction",
    handler: function (response) {
      // On successful payment, send order details to serverless function
      fetch("/api/sendOrderEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_id: response.razorpay_payment_id,
          userInfo, //this needs to have firstName
          cartItems,
        }),
      })
        .then((res) => res.json())
        .then(() => {
          alert("Payment successful! Redirecting...");
          // Clear the cart and user info from local storage
          localStorage.removeItem("cartItems");
          localStorage.removeItem("userInfo");
          window.location.href = "index.html"; // Redirect to home page
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          alert(
            "Payment was successful, but we could not process the order. Please contact support."
          );
        });
    },
    prefill: {
      name: `${userInfo.firstName} ${userInfo.lastName}`,
      email: userInfo.email,
      contact: userInfo.phone,
    },
    theme: {
      color: "#F37254",
    },
  };

  const rzp = new Razorpay(options);
  rzp.open();
});
