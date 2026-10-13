// Sample tiffin plans data
const plansData = [
  {
    id: 1,
    name: "Basic Veg",
    description: "2 rotis, 1 sabzi, dal, rice",
    pricePerDay: 60,
    mealsPerDay: 2,
    type: "Veg",
  },
  {
    id: 2,
    name: "Standard Veg",
    description: "3 rotis, 2 sabzi, dal, rice, salad",
    pricePerDay: 80,
    mealsPerDay: 2,
    type: "Veg",
  },
  {
    id: 3,
    name: "Premium Veg",
    description: "4 rotis, 2 sabzi, dal, rice, curd, dessert",
    pricePerDay: 100,
    mealsPerDay: 2,
    type: "Veg",
  },
  {
    id: 4,
    name: "Basic Non-Veg",
    description: "2 rotis, 1 sabzi, chicken/egg, rice",
    pricePerDay: 90,
    mealsPerDay: 2,
    type: "Non-Veg",
  },
  {
    id: 5,
    name: "Standard Non-Veg",
    description: "3 rotis, 2 sabzi, chicken/fish, rice, salad",
    pricePerDay: 120,
    mealsPerDay: 2,
    type: "Non-Veg",
  },
  {
    id: 6,
    name: "Premium Non-Veg",
    description: "4 rotis, 2 sabzi, chicken/fish, rice, curd, dessert",
    pricePerDay: 150,
    mealsPerDay: 2,
    type: "Non-Veg",
  },
];

// Cart state
let cart = [];

// Load orders from localStorage
function loadOrders() {
  const stored = localStorage.getItem("digitalDabbaOrders");
  return stored ? JSON.parse(stored) : [];
}

function saveOrders(orders) {
  localStorage.setItem("digitalDabbaOrders", JSON.stringify(orders));
}

// Render plans
function renderPlans() {
  const container = document.getElementById("plansContainer");
  container.innerHTML = "";

  plansData.forEach((plan) => {
    const card = document.createElement("div");
    card.className = "plan-card";

    card.innerHTML = `
      <h3>${plan.name} (${plan.type})</h3>
      <div class="plan-info">${plan.description}</div>
      <div class="plan-info">${plan.mealsPerDay} meals/day</div>
      <div class="plan-price">₹${plan.pricePerDay} / day</div>
      <button class="add-to-cart-btn" data-id="${plan.id}">Add to Cart</button>
    `;

    container.appendChild(card);
  });

  // Add click listeners
  container.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const plan = plansData.find((p) => p.id === id);
      if (!plan) return;
      addToCart(plan);
    });
  });
}

// Add to cart
function addToCart(plan) {
  // Check if already in cart
  const existing = cart.find((item) => item.id === plan.id);
  if (existing) {
    alert("This plan is already in your cart.");
    return;
  }
  cart.push(plan);
  renderCart();
}

// Render cart
function renderCart() {
  const container = document.getElementById("cartContainer");
  const checkoutBox = document.getElementById("checkoutBox");

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty. Add a plan to get started.</p>";
    checkoutBox.style.display = "none";
    return;
  }

  container.innerHTML = "";
  cart.forEach((plan, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <strong>${plan.name} (${plan.type})</strong><br/>
      ${plan.description}<br/>
      ₹${plan.pricePerDay} / day
      <button class="remove-from-cart-btn" data-index="${index}" style="margin-left:8px;background:#ef4444;color:#fff;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;">Remove</button>
    `;
    container.appendChild(itemDiv);
  });

  // Remove listeners
  container.querySelectorAll(".remove-from-cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.index);
      cart.splice(idx, 1);
      renderCart();
    });
  });

  checkoutBox.style.display = "block";
}

// Checkout form
document.getElementById("checkoutForm").addEventListener("submit", (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const email = document.getElementById("customerEmail").value.trim();
  const address = document.getElementById("deliveryAddress").value.trim();
  const planType = document.getElementById("planType").value;
  const startDate = document.getElementById("startDate").value;

  if (!name || !phone || !email || !address || !planType || !startDate) {
    alert("Please fill all fields.");
    return;
  }

  // Create order object
  const orders = loadOrders();
  const orderId = "DD" + Date.now();

  const newOrder = {
    orderId,
    customerName: name,
    phone,
    email,
    address,
    planType,
    startDate,
    items: [...cart],
    status: "Order Placed", // later: Preparing, On the way, Delivered
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);
  saveOrders(orders);

  // Clear cart and reset form
  cart = [];
  renderCart();
  document.getElementById("checkoutForm").reset();

  alert(`Order placed successfully!\nOrder ID: ${orderId}`);
  renderOrders();
});

// Render orders
function renderOrders() {
  const orders = loadOrders();
  const container = document.getElementById("ordersContainer");

  if (orders.length === 0) {
    container.innerHTML = "<p>No orders yet. Your placed orders will appear here.</p>";
    return;
  }

  container.innerHTML = "";
  orders.forEach((order) => {
    const card = document.createElement("div");
    card.className = "order-card";

    const planNames = order.items.map((i) => `${i.name} (${i.type})`).join(", ");

    card.innerHTML = `
      <div class="order-header">
        <div class="order-id">Order #${order.orderId}</div>
        <div class="order-status">${order.status}</div>
      </div>
      <div class="order-details">
        <strong>Customer:</strong> ${order.customerName} (${order.phone})<br/>
        <strong>Plan(s):</strong> ${planNames}<br/>
        <strong>Type:</strong> ${order.planType}<br/>
        <strong>Start Date:</strong> ${order.startDate}<br/>
        <strong>Address:</strong> ${order.address}<br/>
        <strong>Placed On:</strong> ${new Date(order.createdAt).toLocaleString()}
      </div>
    `;

    container.appendChild(card);
  });
}

// Initialize
renderPlans();
renderCart();
renderOrders();