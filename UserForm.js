// Function to display the cart items
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
        <p class="product-price">₹${item.price} x ${item.quantity}</p>
        <p><a href="#" onclick="removeItemFromCart('${item.name}')" class="remove-link">Remove</a></p>
      </li>
    `;
    total += item.price * item.quantity;
  });

  cartHtml += `
    </ul>
    <div class="cart-summary">
      <p><strong>Subtotal:</strong> ₹${total}</p>
      <p><strong>Shipping:</strong> ₹50</p>
      <p><strong>Total:</strong> ₹${(total + 50).toFixed(2)}</p>
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

// Function to show alert for missing fields
function validateForm() {
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const address1 = document.getElementById("address1").value;
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  const pin = document.getElementById("pin").value;

  // Check for missing fields and show alert message
  if (!email) {
    alert("Email is required.");
    return false;
  }
  if (!phone) {
    alert("Phone number is required.");
    return false;
  }
  if (!firstName) {
    alert("First name is required.");
    return false;
  }
  if (!lastName) {
    alert("Last name is required.");
    return false;
  }
  if (!address1) {
    alert("Address Line 1 is required.");
    return false;
  }
  if (!city) {
    alert("City is required.");
    return false;
  }
  if (!state) {
    alert("State is required.");
    return false;
  }
  if (!pin) {
    alert("PIN Code is required.");
    return false;
  }

  return true; // All fields are filled
}

// Fetch cart details from local storage on page load
window.onload = function () {
  displayCart();
};

// Buy Now button functionality with Razorpay integration
document.getElementById("buyNowBtn").addEventListener("click", function () {
  // Validate form fields before proceeding
  if (!validateForm()) {
    return;
  }

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

  const cartItems = JSON.parse(localStorage.getItem("cartItems"));

  if (cartItems.length === 0) {
    alert(
      "Your cart is empty. Please add items to your cart before proceeding to buy."
    );
    return;
  }

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingFee = 50; // Assuming a flat shipping fee of ₹50
  const totalAmount = subtotal + shippingFee;

  // Save user info to local storage
  localStorage.setItem("userInfo", JSON.stringify(userInfo));

  // Razorpay options
  const options = {
    key: "rzp_live_mg4IkuDxgDAvvz", // Live key
    amount: totalAmount * 100, // Amount in paisa (multiply by 100)
    currency: "INR",
    name: "Maaher",
    description: "Transaction",
    handler: function (response) {
      // On successful payment, send order details to the serverless function
      fetch("/api/sendOrderEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_id: response.razorpay_payment_id,
          userInfo, // Include user info
          cartItems,
        }),
      })
        .then((res) => res.json())
        .then(() => {
          alert("Payment successful! Redirecting...");

          // Mark all products in the cart as out of stock
          markProductsOutOfStock(cartItems);

          // Update stock status in local storage
          cartItems.forEach((item) => {
            let stockStatus =
              JSON.parse(localStorage.getItem("stockStatus")) || {};
            stockStatus[item.name] = { inStock: false }; // Mark the item as out of stock
            localStorage.setItem("stockStatus", JSON.stringify(stockStatus));
          });

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

// Function to mark products out of stock
async function markProductsOutOfStock(cartItems) {
  try {
    console.log("Sending request to update stock...");
    const response = await fetch("/api/update-stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartItems }), // Send the entire cartItems array
    });

    // Check if the response is OK (status code in the range 200-299)
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(result.message); // Log the success message
  } catch (error) {
    console.error("Error updating stock:", error);
  }
}
