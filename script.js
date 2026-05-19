/* ════════════════════════════════════════════════════════
   DISSA SUPER — script.js
   Complete with IMAGE UPLOAD support, DUAL PRICING, SHOP INFO
   ════════════════════════════════════════════════════════ */

'use strict';

// ══════════════════════════════════════════════════════
// 1. APP STATE
// ══════════════════════════════════════════════════════

let deliveryEnabled = true;
let cart = [];
let wishlist = [];
let editingId = null;
let chatOpen = false;
let chatHistory = [];
let currentCat = 'All';
let searchQ = '';
let sortMode = 'default';
let currentRating = 5;
let promoDiscount = 0;
let activePromoCode = '';
let loyaltyPoints = 0;
let darkMode = false;
let currentLang = 'en';

// Shop Information (editable in Admin)
let shopInfo = JSON.parse(localStorage.getItem('dissaShopInfo') || 'null') || {
  shopName: 'DISSA SUPER',
  address: '123 Main Street, Colombo 7, Sri Lanka',
  phone: '+94 11 234 5678',
  whatsapp: '+94 77 123 4567',
  email: 'hello@dissasuper.lk',
  aboutText: 'We are a trusted Sri Lankan neighbourhood supermarket committed to bringing the freshest groceries right to your doorstep. Founded with a passion for quality and affordability, DISSA SUPER sources directly from local farmers and trusted suppliers.',
  aboutText2: 'From farm-fresh vegetables to daily dairy, we stock everything your family needs — delivered fast or ready for pickup.',
  mapLink: 'https://maps.google.com/?q=Colombo+Sri+Lanka',
  openingHours: {
    weekdays: '7:00 AM – 9:00 PM',
    saturday: '7:00 AM – 8:00 PM',
    sunday: '8:00 AM – 6:00 PM'
  }
};

let PAGE_SIZE = 12;
let displayedCount = PAGE_SIZE;

// Data persisted in localStorage
let orders = JSON.parse(localStorage.getItem('dissaOrders') || '[]');
let reviews = JSON.parse(localStorage.getItem('dissaReviews') || 'null') || getDefaultReviews();
let products = JSON.parse(localStorage.getItem('dissaProducts') || 'null') || getDefaultProducts();

// Notifications
const NOTIFICATIONS = [
  { id: 1, text: '🎁 Use code DISSA10 for 10% off!', time: '2 min ago' },
  { id: 2, text: '🥭 Mangoes just restocked — limited qty!', time: '15 min ago' },
  { id: 3, text: '🚚 Orders before 2 PM get same-day delivery', time: '1 hr ago' },
];

// Promo codes
const PROMO_CODES = {
  'DISSA10': 0.10,
  'FRESH20': 0.20,
  'WELCOME': 0.15,
};

// Recipe data
const RECIPES = [
  {
    emoji: '🍛', title: 'Sri Lankan Dhal Curry',
    time: '30 min', serves: '4',
    desc: 'Creamy red lentil curry with coconut milk, turmeric, and tempered mustard seeds.',
    tags: ['Vegan', 'Easy', 'Lunch'],
    ingredients: ['Red Lentils', 'Coconut Oil', 'Tomatoes'],
  },
  {
    emoji: '🥗', title: 'Fresh Garden Salad',
    time: '10 min', serves: '2',
    desc: 'Crisp carrots, tomatoes and broccoli tossed in a light lime dressing.',
    tags: ['Healthy', 'Quick', 'Vegan'],
    ingredients: ['Carrots', 'Tomatoes', 'Broccoli'],
  },
  {
    emoji: '🍳', title: 'Egg & Vegetable Fry',
    time: '15 min', serves: '2',
    desc: 'A quick and protein-rich stir-fry with fresh eggs, cabbage, and coconut oil.',
    tags: ['Breakfast', 'Quick', 'High Protein'],
    ingredients: ['Eggs', 'Cabbage', 'Coconut Oil'],
  },
  {
    emoji: '🍚', title: 'Basmati Rice & Chicken',
    time: '45 min', serves: '4',
    desc: 'Fragrant basmati rice cooked with tender chicken breast in aromatic spices.',
    tags: ['Dinner', 'High Protein'],
    ingredients: ['Basmati Rice', 'Chicken Breast'],
  },
  {
    emoji: '🥘', title: 'Vegetable Coconut Stew',
    time: '35 min', serves: '4',
    desc: 'Hearty stew with seasonal vegetables in a mild coconut broth.',
    tags: ['Vegan', 'Comfort Food'],
    ingredients: ['Carrots', 'Full Cream Milk', 'Bread'],
  },
  {
    emoji: '🐟', title: 'Grilled Fresh Fish',
    time: '25 min', serves: '2',
    desc: 'Simply seasoned fresh fish grilled to perfection.',
    tags: ['Dinner', 'Healthy', 'Seafood'],
    ingredients: ['Fresh Fish'],
  },
];

// ══════════════════════════════════════════════════════
// 2. DEFAULT DATA WITH IMAGES
// ══════════════════════════════════════════════════════

function getDefaultProducts() {
  return [
    { id: 1, name: 'Fresh Tomatoes', category: 'Vegetables', price: 120, originalPrice: 150, unit: '500g', image: null, emoji: '🍅', badge: 'Fresh', stock: 85 },
    { id: 2, name: 'Carrots', category: 'Vegetables', price: 90, originalPrice: 120, unit: '500g', image: null, emoji: '🥕', badge: '', stock: 70 },
    { id: 3, name: 'Broccoli', category: 'Vegetables', price: 280, originalPrice: 320, unit: '1 head', image: null, emoji: '🥦', badge: 'Fresh', stock: 40 },
    { id: 4, name: 'Cabbage', category: 'Vegetables', price: 150, originalPrice: 180, unit: '1 head', image: null, emoji: '🥬', badge: '', stock: 60 },
    { id: 5, name: 'Cucumber', category: 'Vegetables', price: 80, originalPrice: 100, unit: '2 pcs', image: null, emoji: '🥒', badge: 'Fresh', stock: 90 },
    { id: 6, name: 'Bananas', category: 'Fruits', price: 150, originalPrice: 180, unit: '1 bunch', image: null, emoji: '🍌', badge: '', stock: 95 },
    { id: 7, name: 'Mango', category: 'Fruits', price: 350, originalPrice: 450, unit: '2 pcs', image: null, emoji: '🥭', badge: 'Season', stock: 55 },
    { id: 8, name: 'Apples', category: 'Fruits', price: 420, originalPrice: 500, unit: '4 pcs', image: null, emoji: '🍎', badge: '', stock: 30 },
    { id: 9, name: 'Watermelon', category: 'Fruits', price: 380, originalPrice: 450, unit: '1 whole', image: null, emoji: '🍉', badge: '', stock: 20 },
    { id: 10, name: 'Papaya', category: 'Fruits', price: 200, originalPrice: 250, unit: '1 pc', image: null, emoji: '🍑', badge: 'Season', stock: 45 },
    { id: 11, name: 'Full Cream Milk', category: 'Dairy', price: 320, originalPrice: 380, unit: '1 litre', image: null, emoji: '🥛', badge: '', stock: 80 },
    { id: 12, name: 'Cheddar Cheese', category: 'Dairy', price: 680, originalPrice: 850, unit: '200g', image: null, emoji: '🧀', badge: '', stock: 35 },
    { id: 13, name: 'Eggs', category: 'Dairy', price: 480, originalPrice: 550, unit: '12 pcs', image: null, emoji: '🥚', badge: '', stock: 75 },
    { id: 14, name: 'Yoghurt', category: 'Dairy', price: 180, originalPrice: 220, unit: '250g', image: null, emoji: '🫙', badge: 'New', stock: 60 },
    { id: 15, name: 'Basmati Rice', category: 'Dry Goods', price: 560, originalPrice: 650, unit: '1kg', image: null, emoji: '🍚', badge: '', stock: 100 },
    { id: 16, name: 'Coconut Oil', category: 'Dry Goods', price: 420, originalPrice: 520, unit: '500ml', image: null, emoji: '🫙', badge: '', stock: 65 },
    { id: 17, name: 'Red Lentils', category: 'Dry Goods', price: 280, originalPrice: 350, unit: '500g', image: null, emoji: '🫘', badge: '', stock: 90 },
    { id: 18, name: 'Bread', category: 'Bakery', price: 180, originalPrice: 220, unit: '1 loaf', image: null, emoji: '🍞', badge: 'Fresh', stock: 50 },
    { id: 19, name: 'Croissant', category: 'Bakery', price: 120, originalPrice: 160, unit: '2 pcs', image: null, emoji: '🥐', badge: 'Fresh', stock: 25 },
    { id: 20, name: 'Chicken Breast', category: 'Meat & Fish', price: 920, originalPrice: 1100, unit: '500g', image: null, emoji: '🍗', badge: '', stock: 40 },
    { id: 21, name: 'Fresh Fish', category: 'Meat & Fish', price: 750, originalPrice: 900, unit: '500g', image: null, emoji: '🐟', badge: 'Fresh', stock: 30 },
    { id: 22, name: 'Orange Juice', category: 'Beverages', price: 280, originalPrice: 350, unit: '1 litre', image: null, emoji: '🍊', badge: 'New', stock: 55 },
    { id: 23, name: 'Coconut Water', category: 'Beverages', price: 150, originalPrice: 200, unit: '330ml', image: null, emoji: '🥥', badge: '', stock: 70 },
    { id: 24, name: 'Potato Chips', category: 'Snacks', price: 200, originalPrice: 250, unit: '100g', image: null, emoji: '🥔', badge: '', stock: 80 },
    { id: 25, name: 'Dark Chocolate', category: 'Snacks', price: 350, originalPrice: 450, unit: '100g', image: null, emoji: '🍫', badge: 'New', stock: 45 },
  ];
}

function getDefaultReviews() {
  return [
    { name: 'Amara S.', rating: 5, text: 'Amazing quality! Vegetables are always super fresh. Delivery is incredibly fast too!', date: '2 days ago' },
    { name: 'Kasun P.', rating: 5, text: 'Best grocery store in the area. Prices are unbeatable and the app makes ordering so easy.', date: '1 week ago' },
    { name: 'Dilani F.', rating: 4, text: 'Very reliable service. The milk and dairy products are always fresh. Highly recommend!', date: '2 weeks ago' },
    { name: 'Rajesh M.', rating: 5, text: 'DISSA SUPER has become our go-to for weekly groceries. Love the fresh fruits section!', date: '3 weeks ago' },
    { name: 'Nisha K.', rating: 4, text: 'Great selection and the WhatsApp support is very helpful.', date: '1 month ago' },
    { name: 'Saman W.', rating: 5, text: 'Excellent service! The fish is always super fresh!', date: '1 month ago' },
  ];
}

// ══════════════════════════════════════════════════════
// 3. UTILITY HELPERS
// ══════════════════════════════════════════════════════

function showToast(msg, duration = 2800) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

function lkr(n) {
  return 'LKR ' + Number(n).toLocaleString();
}

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function saveProducts() {
  localStorage.setItem('dissaProducts', JSON.stringify(products));
}

function saveOrders() {
  localStorage.setItem('dissaOrders', JSON.stringify(orders));
}

function saveReviews() {
  localStorage.setItem('dissaReviews', JSON.stringify(reviews));
}

function saveShopInfo() {
  localStorage.setItem('dissaShopInfo', JSON.stringify(shopInfo));
  updateShopInfoDisplay();
}

function updateShopInfoDisplay() {
  const addressEl = document.getElementById('addressDisplay');
  const addressEl2 = document.getElementById('addressDisplay2');
  const phoneEl = document.getElementById('phoneDisplay');
  const whatsappEl = document.getElementById('whatsappDisplay');
  const emailEl = document.getElementById('emailDisplay');
  const aboutTextEl = document.getElementById('aboutText');
  const aboutText2El = document.getElementById('aboutText2');

  if (addressEl) addressEl.textContent = shopInfo.address;
  if (addressEl2) addressEl2.textContent = shopInfo.address;
  if (phoneEl) phoneEl.textContent = shopInfo.phone;
  if (whatsappEl) whatsappEl.textContent = shopInfo.whatsapp;
  if (emailEl) emailEl.textContent = shopInfo.email;
  if (aboutTextEl) aboutTextEl.textContent = shopInfo.aboutText;
  if (aboutText2El) aboutText2El.textContent = shopInfo.aboutText2;
}

// ══════════════════════════════════════════════════════
// 4. DARK MODE & LANGUAGE
// ══════════════════════════════════════════════════════

function toggleDarkMode() {
  darkMode = !darkMode;
  document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  document.getElementById('darkBtn').textContent = darkMode ? '☀️' : '🌙';
  showToast(darkMode ? '🌙 Dark mode on' : '☀️ Light mode on');
}

function toggleLang() {
  currentLang = currentLang === 'en' ? 'si' : 'en';
  document.getElementById('langBtn').textContent = '🌐 ' + currentLang.toUpperCase();
  showToast(currentLang === 'si' ? '🌐 සිංහල (Sinhala) — coming soon!' : '🌐 English selected');
}

// ══════════════════════════════════════════════════════
// 5. MOBILE NAV
// ══════════════════════════════════════════════════════

function toggleMobileNav() {
  document.getElementById('mobileNav').classList.toggle('open');
}
function closeMobileNav() {
  document.getElementById('mobileNav').classList.remove('open');
}

// ══════════════════════════════════════════════════════
// 6. NOTIFICATIONS
// ══════════════════════════════════════════════════════

function toggleNotif() {
  document.getElementById('notifPanel').classList.toggle('open');
  document.getElementById('notifDot').style.display = 'none';
}

function renderNotifications() {
  const list = document.getElementById('notifList');
  list.innerHTML = NOTIFICATIONS.map(n =>
    `<div class="notif-item">
       ${n.text}
       <div style="font-size:11px;opacity:.5;margin-top:4px">${n.time}</div>
     </div>`
  ).join('');
}

document.addEventListener('click', (e) => {
  const panel = document.getElementById('notifPanel');
  const btn = document.getElementById('notifBtn');
  if (panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) {
    panel.classList.remove('open');
  }
});

// ══════════════════════════════════════════════════════
// 7. PROMO BANNER
// ══════════════════════════════════════════════════════

function closeBanner() {
  document.getElementById('promoBanner').style.display = 'none';
}

function applyPromo(code) {
  _applyPromoCode(code);
}

function applyPromoFromCart() {
  const code = document.getElementById('promoInput').value.trim().toUpperCase();
  _applyPromoCode(code);
}

function _applyPromoCode(code) {
  code = code.toUpperCase();
  if (PROMO_CODES[code]) {
    promoDiscount = PROMO_CODES[code];
    activePromoCode = code;
    showToast(`🎁 Promo "${code}" applied — ${Math.round(promoDiscount * 100)}% off!`);
    renderCartBody();
  } else {
    showToast('❌ Invalid promo code');
  }
}

// ══════════════════════════════════════════════════════
// 8. CATEGORIES & PRODUCT RENDERING (WITH IMAGES)
// ══════════════════════════════════════════════════════

function getCats() {
  return ['All', ...new Set(products.map(p => p.category))];
}

const CAT_EMOJI = {
  All: '🛒', Vegetables: '🥦', Fruits: '🍎', Dairy: '🥛',
  'Dry Goods': '🌾', Bakery: '🍞', 'Meat & Fish': '🍗',
  Beverages: '🥤', Snacks: '🍿', Household: '🏠', Other: '📦',
};
function catEmoji(c) { return CAT_EMOJI[c] || '📦'; }

function renderCats() {
  document.getElementById('categoriesBar').innerHTML = getCats().map(c =>
    `<button class="cat-btn ${c === currentCat ? 'active' : ''}" onclick="selectCat('${c}')">
       ${catEmoji(c)} ${c}
     </button>`
  ).join('');
}

function selectCat(c) {
  currentCat = c;
  displayedCount = PAGE_SIZE;
  renderCats();
  renderProducts();
}

function filterProducts() {
  searchQ = document.getElementById('searchInput').value.toLowerCase();
  displayedCount = PAGE_SIZE;
  renderProducts();
}

function sortProducts() {
  sortMode = document.getElementById('sortSelect').value;
  displayedCount = PAGE_SIZE;
  renderProducts();
}

function loadMore() {
  displayedCount += PAGE_SIZE;
  renderProducts();
}

function getFilteredProducts() {
  const stockOnly = document.getElementById('stockFilter')?.value === 'instock';

  let list = products.filter(p => {
    const matchCat = currentCat === 'All' || p.category === currentCat;
    const matchSearch = p.name.toLowerCase().includes(searchQ) || p.category.toLowerCase().includes(searchQ);
    const matchStock = !stockOnly || p.stock > 0;
    return matchCat && matchSearch && matchStock;
  });

  if (sortMode === 'price-asc') list.sort((a, b) => a.price - b.price);
  if (sortMode === 'price-desc') list.sort((a, b) => b.price - a.price);
  if (sortMode === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

  return list;
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const list = getFilteredProducts();

  document.getElementById('productCountLabel').textContent =
    `${list.length} item${list.length !== 1 ? 's' : ''}`;
  document.getElementById('heroProductCount').textContent = products.length;

  if (!list.length) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:64px 20px;color:var(--text-light);">
        <div style="font-size:56px;margin-bottom:14px">🔍</div>
        <p style="font-size:18px;font-weight:700;margin-bottom:6px">No products found</p>
        <p>Try a different search or category</p>
      </div>`;
    document.getElementById('loadMoreBtn').style.display = 'none';
    return;
  }

  const shown = list.slice(0, displayedCount);

  grid.innerHTML = shown.map(p => {
    const ci = cart.find(c => c.id === p.id);
    const qty = ci ? ci.qty : 0;
    const inWishlist = wishlist.some(w => w.id === p.id);
    const badgeCls = { Fresh: 'badge-fresh', Sale: 'badge-sale', New: 'badge-new', Season: 'badge-season' }[p.badge] || '';
    const oos = p.stock === 0;
    const stockPct = Math.min(100, p.stock);
    const stockColor = stockPct > 60 ? '#22a050' : stockPct > 25 ? '#e67e22' : '#d93025';
    const hasDiscount = p.originalPrice && p.originalPrice > p.price;
    const discountPercent = hasDiscount ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;

    // Image display logic
    const imageHtml = p.image && p.image.startsWith('data:')
      ? `<img src="${p.image}" alt="${p.name}" loading="lazy" />`
      : `<span class="emoji-fallback">${p.emoji}</span>`;

    return `
      <div class="product-card" id="pc${p.id}">
        <div class="product-img" onclick="showProductDetail(${p.id})">
          ${imageHtml}
          ${hasDiscount ? `<span class="discount-badge">-${discountPercent}%</span>` : ''}
          ${p.badge ? `<span class="product-badge ${badgeCls}">${p.badge}</span>` : ''}
          ${oos ? '<div class="oos-overlay">OUT OF STOCK</div>' : ''}
        </div>
        <button class="card-wish-btn" onclick="toggleWishlist(${p.id})" title="Wishlist">
          ${inWishlist ? '❤️' : '🤍'}
        </button>
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div class="product-unit">📦 ${p.unit}</div>
          <div class="stock-bar-wrap">
            <div class="stock-bar-label">${oos ? '⚠️ Out of stock' : `Stock: ${p.stock}%`}</div>
            <div class="stock-bar">
              <div class="stock-bar-fill" style="width:${stockPct}%;background:${stockColor}"></div>
            </div>
          </div>
          <div class="product-footer">
            <div class="product-price">
              <span class="current-price">${lkr(p.price)}</span>
              ${hasDiscount ? `<span class="original-price">${lkr(p.originalPrice)}</span>` : ''}
              <small>per ${p.unit}</small>
            </div>
            ${oos
              ? `<button class="add-btn" disabled title="Out of stock">✕</button>`
              : qty === 0
                ? `<button class="add-btn" onclick="addToCart(${p.id})">+</button>`
                : `<div class="qty-ctrl">
                     <button class="qty-btn" onclick="decQty(${p.id})">−</button>
                     <span class="qty-num">${qty}</span>
                     <button class="qty-btn" onclick="incQty(${p.id})">+</button>
                   </div>`
            }
          </div>
        </div>
      </div>`;
  }).join('');

  const btn = document.getElementById('loadMoreBtn');
  btn.style.display = list.length > displayedCount ? 'inline-block' : 'none';
}

// ══════════════════════════════════════════════════════
// 9. FRESH TODAY STRIP
// ══════════════════════════════════════════════════════

function renderFreshStrip() {
  const freshItems = products.filter(p => p.badge === 'Fresh' || p.badge === 'Season').slice(0, 10);
  document.getElementById('freshStrip').innerHTML = freshItems.map(p => `
    <div class="fresh-card" onclick="selectCat('${p.category}')">
      <div class="fresh-card-emoji">${p.image ? '🛒' : p.emoji}</div>
      <div class="fresh-card-name">${p.name}</div>
      <div class="fresh-card-price">${lkr(p.price)}</div>
      <span class="fresh-badge">${p.badge}</span>
    </div>`).join('');
}

// ══════════════════════════════════════════════════════
// 10. WISHLIST
// ══════════════════════════════════════════════════════

function toggleWishlist(id) {
  const p = products.find(x => x.id === id);
  const idx = wishlist.findIndex(w => w.id === id);
  if (idx === -1) {
    wishlist.push({ ...p });
    showToast(`❤️ ${p.name} added to wishlist`);
  } else {
    wishlist.splice(idx, 1);
    showToast(`🤍 ${p.name} removed from wishlist`);
  }
  updateWishCount();
  renderProducts();
  renderWishlistBody();
}

function updateWishCount() {
  const el = document.getElementById('wishCount');
  el.textContent = wishlist.length;
  el.style.display = wishlist.length ? 'inline' : 'none';
}

function openWishlist() {
  document.getElementById('wishlistSidebar').classList.add('open');
  document.getElementById('wishlistOverlay').classList.add('open');
  renderWishlistBody();
}
function closeWishlist() {
  document.getElementById('wishlistSidebar').classList.remove('open');
  document.getElementById('wishlistOverlay').classList.remove('open');
}

function renderWishlistBody() {
  const body = document.getElementById('wishlistBody');
  if (!wishlist.length) {
    body.innerHTML = `
      <div class="cart-empty-state">
        <div>🤍</div>
        <p style="font-weight:700;font-size:16px;margin-bottom:6px">Wishlist is empty</p>
        <p style="font-size:14px">Tap ❤️ on any product to save it</p>
      </div>`;
    return;
  }
  body.innerHTML = wishlist.map(item => `
    <div class="cart-item">
      <div class="cart-item-icon">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-sub">${lkr(item.price)} · ${item.unit}</div>
      </div>
      <button class="add-btn" onclick="moveToCart(${item.id})" title="Add to cart" style="width:auto;padding:0 12px;border-radius:8px;font-size:13px">🛒</button>
      <button class="rm-btn" onclick="toggleWishlist(${item.id})">🗑</button>
    </div>`).join('');
}

function moveToCart(id) {
  const idx = wishlist.findIndex(w => w.id === id);
  if (idx !== -1) {
    addToCart(id);
    wishlist.splice(idx, 1);
    updateWishCount();
    renderWishlistBody();
    renderProducts();
  }
}

// ══════════════════════════════════════════════════════
// 11. CART
// ══════════════════════════════════════════════════════

function addToCart(id) {
  if (cart.find(c => c.id === id)) { incQty(id); return; }
  const p = products.find(x => x.id === id);
  if (!p || p.stock === 0) return;
  cart.push({ ...p, qty: 1 });
  updateCartBadge();
  renderProducts();
  showToast(`✅ ${p.name} added to cart`);
}

function incQty(id) {
  const item = cart.find(c => c.id === id);
  if (item) item.qty++;
  updateCartBadge();
  renderProducts();
  renderCartBody();
}

function decQty(id) {
  const idx = cart.findIndex(c => c.id === id);
  if (idx !== -1) {
    cart[idx].qty--;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
  }
  updateCartBadge();
  renderProducts();
  renderCartBody();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartBadge();
  renderProducts();
  renderCartBody();
}

function updateCartBadge() {
  document.getElementById('cartCount').textContent = cart.reduce((s, c) => s + c.qty, 0);
}

function cartSubtotal() {
  return cart.reduce((s, c) => s + c.price * c.qty, 0);
}

function cartDiscountAmt() {
  return Math.round(cartSubtotal() * promoDiscount);
}

function cartDeliveryFee(type) {
  if (cartSubtotal() >= 3000) return 0;
  return (type === 'delivery' && deliveryEnabled) ? 200 : 0;
}

function cartTotal(type) {
  return cartSubtotal() - cartDiscountAmt() + cartDeliveryFee(type);
}

function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  renderCartBody();
}
function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

function renderCartBody() {
  const body = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');

  if (!cart.length) {
    body.innerHTML = `
      <div class="cart-empty-state">
        <div>🛒</div>
        <p style="font-weight:700;font-size:16px;margin-bottom:6px">Your cart is empty</p>
        <p style="font-size:14px">Browse and add fresh items!</p>
      </div>`;
    footer.style.display = 'none';
    return;
  }

  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-icon">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-sub">${lkr(item.price)} × ${item.qty}</div>
      </div>
      <div class="cart-item-total">${lkr(item.price * item.qty)}</div>
      <button class="rm-btn" onclick="removeFromCart(${item.id})">🗑</button>
    </div>`).join('');

  footer.style.display = 'block';

  const sub = cartSubtotal();
  const disc = cartDiscountAmt();
  const fee = cartDeliveryFee('delivery');

  document.getElementById('cartSubtotal').textContent = lkr(sub);
  document.getElementById('cartDeliveryFee').textContent = fee === 0 ? (sub >= 3000 ? 'FREE (over LKR 3000)' : 'Free (Pickup)') : 'LKR 200';
  document.getElementById('cartTotal').textContent = lkr(sub - disc + fee);

  const discRow = document.getElementById('discountRow');
  if (disc > 0) {
    discRow.style.display = 'flex';
    document.getElementById('discountAmt').textContent = '-' + lkr(disc);
  } else {
    discRow.style.display = 'none';
  }

  document.getElementById('delNote').innerHTML = deliveryEnabled
    ? (sub >= 3000 ? '🎉 Free delivery on this order!' : '🚚 Home delivery · LKR 200 flat fee')
    : '⚠️ Delivery paused · Pickup orders only';
}

// ══════════════════════════════════════════════════════
// 12. CHECKOUT
// ══════════════════════════════════════════════════════

let orderType = 'delivery';

function openCheckout() {
  closeCart();
  document.getElementById('checkoutModal').classList.add('open');
  orderType = deliveryEnabled ? 'delivery' : 'pickup';
  renderCheckout();
}
function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('open');
}

function renderCheckout() {
  const sub = cartSubtotal();
  const disc = cartDiscountAmt();
  const fee = cartDeliveryFee(orderType);

  document.getElementById('checkoutBody').innerHTML = `
    <div class="form-group">
      <label>Order Type</label>
      <div class="order-type-row">
        <button class="otype-btn ${orderType === 'delivery' && deliveryEnabled ? 'active' : ''}"
          onclick="setOType('delivery')" id="ot_delivery"
          ${!deliveryEnabled ? 'disabled' : ''}>
          🚚 Home Delivery ${!deliveryEnabled ? '<br><small style="opacity:.5">(Unavailable)</small>' : ''}
        </button>
        <button class="otype-btn ${orderType === 'pickup' ? 'active' : ''}"
          onclick="setOType('pickup')" id="ot_pickup">
          🏪 Store Pickup
        </button>
      </div>
    </div>

    <div class="form-row2">
      <div class="form-group"><label>Full Name *</label><input id="co_name" placeholder="Your full name" /></div>
      <div class="form-group"><label>Phone Number *</label><input id="co_phone" type="tel" placeholder="07X XXX XXXX" /></div>
    </div>

    <div class="form-group" id="addr_section" style="${orderType === 'pickup' ? 'display:none' : ''}">
      <label>Delivery Address *</label>
      <textarea id="co_addr" placeholder="House no, street, city…" rows="3"></textarea>
    </div>

    <div class="form-group">
      <label>Special Notes</label>
      <input id="co_notes" placeholder="Allergies, instructions…" />
    </div>

    ${promoDiscount === 0 ? `
    <div class="form-group">
      <label>Promo Code</label>
      <div style="display:flex;gap:8px">
        <input id="checkout_promo" placeholder="e.g. DISSA10" style="flex:1;padding:12px 15px;border:1.5px solid var(--border);border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;background:var(--surface);color:var(--text);outline:none;" />
        <button onclick="applyPromo(document.getElementById('checkout_promo').value)" class="btn-save" style="padding:12px 20px">Apply</button>
      </div>
    </div>` : `<div style="background:var(--green-pale);border:1.5px solid var(--green-mid);border-radius:10px;padding:10px 16px;font-size:13px;color:var(--green);font-weight:700;margin-bottom:16px">🎁 Promo "${activePromoCode}" active — ${Math.round(promoDiscount * 100)}% off!</div>`}

    <div class="order-summary">
      <div style="font-weight:700;font-size:15px;margin-bottom:10px">🧾 Order Summary</div>
      ${cart.map(i => `<div class="osum-row"><span>${i.emoji} ${i.name} ×${i.qty}</span><span>${lkr(i.price * i.qty)}</span></div>`).join('')}
      <div class="osum-row" style="margin-top:8px"><span>Subtotal</span><span>${lkr(sub)}</span></div>
      ${disc > 0 ? `<div class="osum-row"><span>🎁 Discount</span><span style="color:var(--green)">-${lkr(disc)}</span></div>` : ''}
      <div class="osum-row"><span>Delivery</span><span id="co_fee">${fee === 0 ? 'FREE' : lkr(fee)}</span></div>
      <div class="osum-row osum-total"><span>TOTAL</span><span id="co_total">${lkr(sub - disc + fee)}</span></div>
    </div>

    <div style="background:var(--green-pale);border-radius:10px;padding:10px 14px;font-size:13px;color:var(--text-mid);margin-bottom:16px">
      ⭐ You'll earn <strong>${Math.floor((sub - disc) / 100)} loyalty points</strong> on this order!
    </div>

    <button class="place-btn" onclick="placeOrder()">✅ Place Order Now</button>`;
}

function setOType(t) {
  orderType = t;
  document.querySelectorAll('.otype-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(`ot_${t}`);
  if (btn) btn.classList.add('active');
  const addrSec = document.getElementById('addr_section');
  if (addrSec) addrSec.style.display = t === 'pickup' ? 'none' : 'block';
  const fee = cartDeliveryFee(t);
  const disc = cartDiscountAmt();
  const sub = cartSubtotal();
  const feeEl = document.getElementById('co_fee');
  const totEl = document.getElementById('co_total');
  if (feeEl) feeEl.textContent = fee === 0 ? 'FREE' : lkr(fee);
  if (totEl) totEl.textContent = lkr(sub - disc + fee);
}

function placeOrder() {
  const name = document.getElementById('co_name')?.value.trim();
  const phone = document.getElementById('co_phone')?.value.trim();
  const addr = orderType === 'delivery' ? document.getElementById('co_addr')?.value.trim() : 'Store Pickup';
  const notes = document.getElementById('co_notes')?.value.trim();

  if (!name) { showToast('⚠️ Please enter your name'); return; }
  if (!phone) { showToast('⚠️ Please enter your phone'); return; }
  if (orderType === 'delivery' && !addr) { showToast('⚠️ Please enter delivery address'); return; }

  const oid = 'DS' + Date.now().toString().slice(-6);
  const sub = cartSubtotal();
  const disc = cartDiscountAmt();
  const fee = cartDeliveryFee(orderType);
  const total = sub - disc + fee;
  const points = Math.floor((sub - disc) / 100);

  const order = {
    id: oid, name, phone,
    address: addr || 'Store Pickup',
    notes, type: orderType,
    items: [...cart],
    subtotal: sub,
    discount: disc,
    deliveryFee: fee,
    total,
    date: new Date().toLocaleString(),
    status: 'Pending',
  };

  orders.unshift(order);
  saveOrders();

  loyaltyPoints += points;

  cart = [];
  promoDiscount = 0;
  activePromoCode = '';
  updateCartBadge();
  renderProducts();

  document.getElementById('heroOrderCount').textContent = orders.length + ' Orders';

  document.querySelector('#checkoutModal .modal').innerHTML = `
    <div class="success-wrap">
      <span class="s-icon">🎉</span>
      <h2>Order Placed!</h2>
      <p>Thank you <strong>${name}</strong>!<br>Your order has been received successfully.</p>
      <div class="order-ref">#${oid}</div>
      <p>${orderType === 'delivery' ? '🚚 We will deliver to your address soon.' : '🏪 Please come to our store for pickup.'}</p>
      ${notes ? `<p style="margin-top:10px;font-size:13px;color:var(--text-light)">📝 Notes: ${notes}</p>` : ''}
      <div class="points-badge">⭐ +${points} Loyalty Points Earned! (Total: ${loyaltyPoints})</div>
      <button class="place-btn" onclick="closeCheckout()" style="max-width:220px;margin:22px auto 0;display:block">
        Continue Shopping
      </button>
    </div>`;
}

// ══════════════════════════════════════════════════════
// 13. REVIEWS
// ══════════════════════════════════════════════════════

function renderReviews() {
  const grid = document.getElementById('reviewsGrid');
  grid.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-stars">${'⭐'.repeat(r.rating)}</div>
      <div class="review-text">"${r.text}"</div>
      <div class="review-author">
        <div class="review-avatar">${r.name[0]}</div>
        <div>
          <div class="review-name">${r.name}</div>
          <div class="review-date">${r.date}</div>
        </div>
      </div>
    </div>`).join('');
}

function openReviewForm() {
  currentRating = 5;
  document.getElementById('reviewModal').classList.add('open');
  updateStars();
}
function closeReviewForm() {
  document.getElementById('reviewModal').classList.remove('open');
}

function setRating(n) {
  currentRating = n;
  updateStars();
}
function updateStars() {
  const spans = document.querySelectorAll('#starRating span');
  spans.forEach((s, i) => { s.style.opacity = i < currentRating ? '1' : '0.3'; });
}

function submitReview() {
  const name = document.getElementById('rv_name').value.trim();
  const text = document.getElementById('rv_text').value.trim();
  if (!name || !text) { showToast('⚠️ Please fill in all fields'); return; }

  reviews.unshift({ name, rating: currentRating, text, date: 'Just now' });
  saveReviews();
  renderReviews();
  closeReviewForm();
  showToast('⭐ Thank you for your review!');
}

// ══════════════════════════════════════════════════════
// 14. RECIPES
// ══════════════════════════════════════════════════════

function renderRecipes() {
  document.getElementById('recipesGrid').innerHTML = RECIPES.map(r => `
    <div class="recipe-card">
      <div class="recipe-img">${r.emoji}</div>
      <div class="recipe-body">
        <div class="recipe-title">${r.title}</div>
        <div class="recipe-meta">⏱ ${r.time} &nbsp;·&nbsp; 👥 Serves ${r.serves}</div>
        <div class="recipe-desc">${r.desc}</div>
        <div class="recipe-tags">
          ${r.tags.map(t => `<span class="recipe-tag">${t}</span>`).join('')}
        </div>
        <button onclick='addRecipeIngredients(${JSON.stringify(r.ingredients)})'
          style="margin-top:12px;width:100%;background:var(--green-pale);color:var(--green);border:1.5px solid var(--green-mid);border-radius:10px;padding:9px;font-size:13px;font-weight:700;cursor:pointer;">
          🛒 Add Ingredients to Cart
        </button>
      </div>
    </div>`).join('');
}

function addRecipeIngredients(names) {
  let added = 0;
  names.forEach(name => {
    const p = products.find(x => x.name.includes(name) || name.includes(x.name.split(' ')[0]));
    if (p && p.stock > 0) {
      addToCart(p.id);
      added++;
    }
  });
  showToast(added ? `🛒 ${added} ingredient(s) added to cart!` : '❌ Ingredients not found in stock');
}

// ══════════════════════════════════════════════════════
// 15. CONTACT FORM
// ══════════════════════════════════════════════════════

function submitContact(e) {
  e.preventDefault();
  const name = document.getElementById('cf_name').value.trim();
  const email = document.getElementById('cf_email').value.trim();
  const msg = document.getElementById('cf_msg').value.trim();
  if (!name || !email || !msg) { showToast('⚠️ Please fill in all fields'); return; }
  showToast(`📨 Message sent! We'll reply to ${email} soon.`);
  document.getElementById('cf_name').value = '';
  document.getElementById('cf_email').value = '';
  document.getElementById('cf_msg').value = '';
}

// ══════════════════════════════════════════════════════
// 16. NEWSLETTER
// ══════════════════════════════════════════════════════

function subscribeNewsletter() {
  const email = document.getElementById('nlEmail').value.trim();
  if (!email) { showToast('⚠️ Please enter your email'); return; }
  showToast(`📰 Subscribed! Watch your inbox at ${email}`);
  document.getElementById('nlEmail').value = '';
}

// ══════════════════════════════════════════════════════
// 17. MAP / WHATSAPP
// ══════════════════════════════════════════════════════

function openMap() {
  window.open(shopInfo.mapLink, '_blank');
}

function openWhatsApp() {
  window.open(`https://wa.me/${shopInfo.whatsapp.replace(/[^0-9]/g, '')}?text=Hello+DISSA+SUPER!+I+have+a+query+about+your+products.`, '_blank');
}

// ══════════════════════════════════════════════════════
// 18. ADMIN PANEL
// ══════════════════════════════════════════════════════

function openAdmin() {
  document.getElementById('adminOverlay').classList.add('open');
  adminTab('dashboard', document.querySelector('.admin-nav-btn'));
}
function closeAdmin() {
  document.getElementById('adminOverlay').classList.remove('open');
  editingId = null;
}

function adminTab(tab, btn) {
  document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  if (tab === 'dashboard') renderDashboard();
  if (tab === 'products') renderAdminProducts();
  if (tab === 'delivery') renderAdminDelivery();
  if (tab === 'orders') renderAdminOrders();
  if (tab === 'users') renderAdminUsers();
  if (tab === 'analytics') renderAnalytics();
  if (tab === 'shopinfo') renderShopInfo();
}

/* ─── Dashboard ─── */
function renderDashboard() {
  const totalRev = orders.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter(o => o.status === 'Pending').length;
  const delivered = orders.filter(o => o.status === 'Delivered').length;
  const avgOrder = orders.length ? Math.round(totalRev / orders.length) : 0;

  document.getElementById('adminBody').innerHTML = `
    <div class="stat-cards">
      <div class="stat-card"><div class="stat-card-icon">📦</div><div class="stat-card-val">${products.length}</div><div class="stat-card-label">Total Products</div></div>
      <div class="stat-card"><div class="stat-card-icon">📋</div><div class="stat-card-val">${orders.length}</div><div class="stat-card-label">Total Orders</div></div>
      <div class="stat-card"><div class="stat-card-icon">⏳</div><div class="stat-card-val">${pending}</div><div class="stat-card-label">Pending</div></div>
      <div class="stat-card"><div class="stat-card-icon">✅</div><div class="stat-card-val">${delivered}</div><div class="stat-card-label">Delivered</div></div>
      <div class="stat-card"><div class="stat-card-icon">💰</div><div class="stat-card-val">${lkr(totalRev)}</div><div class="stat-card-label">Revenue</div></div>
      <div class="stat-card"><div class="stat-card-icon">📈</div><div class="stat-card-val">${lkr(avgOrder)}</div><div class="stat-card-label">Avg Order</div></div>
    </div>
    <div style="background:var(--green-pale);border-radius:14px;padding:18px;border:1.5px solid var(--green-mid);margin-bottom:18px">
      <h3 style="font-size:15px;font-weight:700;color:var(--green);margin-bottom:8px">🚚 Delivery Status</h3>
      <p style="font-size:14px;font-weight:700">${deliveryEnabled ? '✅ Delivery is currently AVAILABLE' : '⏸ Delivery is currently UNAVAILABLE'}</p>
    </div>
    <div style="background:var(--surface);border-radius:14px;padding:18px;border:1.5px solid var(--border)">
      <h3 style="font-size:15px;font-weight:700;margin-bottom:14px">📋 Recent Orders</h3>
      ${orders.slice(0, 5).map(o => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--border)">
          <div><span style="font-weight:800">#${o.id}</span><span style="font-size:13px;color:var(--text-light);margin-left:8px">${o.name}</span></div>
          <div style="display:flex;align-items:center;gap:8px"><span style="font-weight:800;color:var(--green)">${lkr(o.total)}</span><span class="order-status status-${o.status.toLowerCase()}">${o.status}</span></div>
        </div>`).join('')}
      ${!orders.length ? '<p style="color:var(--text-light);text-align:center;padding:20px">No orders yet</p>' : ''}
    </div>`;
}

/* ─── Delivery tab ─── */
function renderAdminDelivery() {
  document.getElementById('adminBody').innerHTML = `
    <div class="del-toggle-card">
      <div class="del-toggle-info">
        <h3>🚚 Delivery Service</h3>
        <p>Toggle delivery on or off for customers</p>
        <p style="margin-top:8px;font-weight:700;color:${deliveryEnabled ? 'var(--green)' : 'var(--orange)'}">
          ${deliveryEnabled ? '✅ Currently AVAILABLE' : '⏸ Currently UNAVAILABLE'}
        </p>
      </div>
      <button class="toggle-sw ${deliveryEnabled ? 'on' : 'off'}" onclick="toggleDelivery()"></button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div style="background:var(--green-pale);border-radius:14px;padding:18px;border:1.5px solid var(--green-mid)">
        <div style="font-size:24px;margin-bottom:8px">✅</div>
        <h4 style="font-weight:700;margin-bottom:6px">When ON</h4>
        <p style="font-size:13px;color:var(--text-light);line-height:1.6">• Header shows green badge<br>• Customers can choose Home Delivery<br>• LKR 200 delivery fee applied<br>• Free delivery over LKR 3000</p>
      </div>
      <div style="background:#fff3e0;border-radius:14px;padding:18px;border:1.5px solid #ffd49e">
        <div style="font-size:24px;margin-bottom:8px">⏸</div>
        <h4 style="font-weight:700;margin-bottom:6px">When OFF</h4>
        <p style="font-size:13px;color:var(--text-light);line-height:1.6">• Header shows orange badge<br>• Only Store Pickup available<br>• No delivery fee charged</p>
      </div>
    </div>`;
}

function toggleDelivery() {
  deliveryEnabled = !deliveryEnabled;
  const badge = document.getElementById('hDelBadge');
  const text = document.getElementById('hDelText');
  const hero = document.getElementById('heroDelStatus');
  if (badge) badge.className = 'delivery-pill ' + (deliveryEnabled ? 'on' : 'off');
  if (text) text.textContent = deliveryEnabled ? 'Delivery On' : 'Delivery Off';
  if (hero) hero.textContent = deliveryEnabled ? '✅ Available' : '⏸ Unavailable';
  renderAdminDelivery();
  showToast(deliveryEnabled ? '✅ Delivery ENABLED' : '⏸ Delivery DISABLED');
}

/* ─── Products tab with IMAGE UPLOAD ─── */
function renderAdminProducts() {
  document.getElementById('adminBody').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px">
      <span style="font-size:14px;color:var(--text-light);font-weight:600">${products.length} products in store</span>
      <button class="btn-save" onclick="showProdForm(null)">+ Add New Product</button>
    </div>
    <div class="a-prod-list">
      ${products.map(p => `
        <div class="a-prod-item">
          <div class="a-prod-emoji">${p.image ? '🖼️' : p.emoji}</div>
          <div class="a-prod-info">
            <div class="a-prod-name">${p.name}</div>
            <div class="a-prod-meta">${p.category} · ${p.unit} · Stock: ${p.stock}%${p.badge ? ` · <span style="color:var(--green)">${p.badge}</span>` : ''}${p.originalPrice ? ` · Was: ${lkr(p.originalPrice)}` : ''}</div>
          </div>
          <span class="a-prod-price">${lkr(p.price)}</span>
          <button class="btn-edit" onclick="showProdForm(${p.id})">✏️ Edit</button>
          <button class="btn-del" onclick="delProduct(${p.id})">🗑</button>
        </div>`).join('')}
    </div>
    <div id="prodFormWrap"></div>`;
}

function showProdForm(id) {
  editingId = id;
  const p = id ? products.find(x => x.id === id) : null;
  const cats = ['Vegetables', 'Fruits', 'Dairy', 'Dry Goods', 'Bakery', 'Meat & Fish', 'Beverages', 'Snacks', 'Household', 'Other'];

  document.getElementById('prodFormWrap').innerHTML = `
    <div class="prod-form">
      <h3>${p ? '✏️ Edit Product' : '➕ Add New Product'}</h3>
      <div class="form-row2">
        <div class="form-group"><label>Product Name *</label><input id="fp_name" value="${p ? escapeHtml(p.name) : ''}" placeholder="e.g. Fresh Tomatoes" /></div>
        <div class="form-group"><label>Category *</label>
          <select id="fp_cat">${cats.map(c => `<option ${p && p.category === c ? 'selected' : ''}>${c}</option>`).join('')}</select>
        </div>
      </div>
      <div class="form-row2">
        <div class="form-group"><label>Price (LKR) *</label><input id="fp_price" type="number" value="${p ? p.price : ''}" placeholder="120" /></div>
        <div class="form-group"><label>Original Price (LKR)</label><input id="fp_original" type="number" value="${p ? p.originalPrice || '' : ''}" placeholder="150 (optional)" /></div>
      </div>
      <div class="form-row2">
        <div class="form-group"><label>Unit / Qty</label><input id="fp_unit" value="${p ? p.unit : ''}" placeholder="500g, 1 litre…" /></div>
        <div class="form-group"><label>Emoji Icon (fallback)</label><input id="fp_emoji" value="${p ? p.emoji : '🛒'}" placeholder="🍎" /></div>
      </div>
      <div class="form-row2">
        <div class="form-group"><label>Badge</label><input id="fp_badge" value="${p ? p.badge : ''}" placeholder="Fresh / Sale / New / Season" /></div>
        <div class="form-group"><label>Stock Level (0–100%)</label><input id="fp_stock" type="number" min="0" max="100" value="${p ? p.stock : 100}" /></div>
      </div>
      <div class="form-group">
        <label>Product Image</label>
        <input type="file" id="fp_image" accept="image/*" onchange="previewImage(this)" />
        <div id="imagePreview" style="margin-top:10px;">
          ${p && p.image ? `<img src="${p.image}" style="max-width:100px;border-radius:8px;" />` : ''}
        </div>
        <small style="color:var(--text-light);display:block;margin-top:5px">Upload JPG, PNG, or WebP (max 2MB)</small>
      </div>
      <div class="form-actions">
        <button class="btn-save" onclick="saveProd()">💾 Save Product</button>
        <button class="btn-cancel" onclick="cancelProdForm()">Cancel</button>
      </div>
    </div>`;
  document.getElementById('prodFormWrap').scrollIntoView({ behavior: 'smooth' });
}

let currentImageData = null;

function previewImage(input) {
  const preview = document.getElementById('imagePreview');
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      currentImageData = e.target.result;
      preview.innerHTML = `<img src="${currentImageData}" style="max-width:100px;border-radius:8px;" />`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function saveProd() {
  const name = document.getElementById('fp_name').value.trim();
  const category = document.getElementById('fp_cat').value;
  const price = parseFloat(document.getElementById('fp_price').value);
  const originalPrice = parseFloat(document.getElementById('fp_original').value) || price;
  const unit = document.getElementById('fp_unit').value.trim() || 'pcs';
  const emoji = document.getElementById('fp_emoji').value.trim() || '🛒';
  const badge = document.getElementById('fp_badge').value.trim();
  const stock = Math.min(100, Math.max(0, parseInt(document.getElementById('fp_stock').value) || 100));
  const image = currentImageData || (editingId ? products.find(p => p.id === editingId)?.image : null);

  if (!name) { showToast('⚠️ Please enter a product name'); return; }
  if (!price || price <= 0) { showToast('⚠️ Please enter a valid price'); return; }

  if (editingId) {
    const idx = products.findIndex(p => p.id === editingId);
    products[idx] = { ...products[idx], name, category, price, originalPrice, unit, emoji, badge, stock, image };
    showToast('✅ Product updated!');
  } else {
    products.push({
      id: Math.max(...products.map(p => p.id), 0) + 1,
      name, category, price, originalPrice, unit, emoji, badge, stock, image: image || null
    });
    showToast('✅ Product added!');
  }

  saveProducts();
  editingId = null;
  currentImageData = null;
  renderCats();
  renderProducts();
  renderFreshStrip();
  renderAdminProducts();
}

function delProduct(id) {
  const p = products.find(x => x.id === id);
  if (!confirm(`Delete "${p.name}"?`)) return;
  products = products.filter(x => x.id !== id);
  cart = cart.filter(c => c.id !== id);
  saveProducts();
  updateCartBadge();
  renderCats();
  renderProducts();
  renderFreshStrip();
  renderAdminProducts();
  showToast('🗑 Product deleted');
}

function cancelProdForm() {
  document.getElementById('prodFormWrap').innerHTML = '';
  editingId = null;
  currentImageData = null;
}

/* ─── Orders tab ─── */
function renderAdminOrders() {
  const body = document.getElementById('adminBody');
  if (!orders.length) {
    body.innerHTML = `<div style="text-align:center;padding:60px;color:var(--text-light)"><div style="font-size:56px;margin-bottom:14px">📋</div><p style="font-size:18px;font-weight:700;margin-bottom:6px">No orders yet</p><p>Orders appear here when customers buy</p></div>`;
    return;
  }
  const statuses = ['Pending', 'Processing', 'Delivered', 'Cancelled'];
  body.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px">
      <span style="font-size:14px;color:var(--text-light);font-weight:600">${orders.length} total orders</span>
      <button onclick="clearOrders()" style="background:none;border:1.5px solid var(--border);border-radius:8px;padding:7px 14px;cursor:pointer;font-size:12px;color:var(--red);font-weight:700">🗑 Clear All</button>
    </div>
    ${orders.map(o => `
      <div class="order-card">
        <div class="order-card-header">
          <span class="order-id-badge">#${o.id}</span>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span class="order-type-tag ${o.type === 'delivery' ? 'tag-delivery' : 'tag-pickup'}">${o.type === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}</span>
            <select class="order-status status-${o.status.toLowerCase()}" onchange="updateOrderStatus('${o.id}', this.value)" style="border:none;cursor:pointer;font-weight:700;padding:4px 10px;border-radius:20px">
              ${statuses.map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="order-card-body">
          <strong>${o.name}</strong> · 📞 ${o.phone}<br>
          ${o.type === 'delivery' ? `📍 ${o.address}<br>` : ''}
          ${o.notes ? `📝 ${o.notes}<br>` : ''}
          <span style="font-size:12px;color:var(--text-light)">${o.items.map(i => `${i.emoji}${i.name}×${i.qty}`).join(', ')}</span>
        </div>
        <div class="order-card-footer">
          <span class="order-total">${lkr(o.total)}</span>
          <span class="order-date">🕐 ${o.date}</span>
        </div>
      </div>`).join('')}`;
}

function updateOrderStatus(oid, status) {
  const o = orders.find(x => x.id === oid);
  if (o) {
    o.status = status;
    saveOrders();
    showToast(`Order #${oid} → ${status}`);
  }
}

function clearOrders() {
  if (!confirm('Clear all order history? This cannot be undone.')) return;
  orders = [];
  saveOrders();
  renderAdminOrders();
  document.getElementById('heroOrderCount').textContent = '0 Orders';
  showToast('🗑 Order history cleared');
}

/* ─── Users tab ─── */
function renderAdminUsers() {
  document.getElementById('adminBody').innerHTML = `
    <div style="text-align:center;padding:40px;color:var(--text-light)">
      <div style="font-size:56px;margin-bottom:14px">👤</div>
      <p style="font-size:17px;font-weight:700;margin-bottom:8px">User Management</p>
      <p style="font-size:14px">Guest checkout is active. Full user accounts with login/signup can be added with a backend database.</p>
      <div style="margin-top:24px;background:var(--green-pale);border-radius:14px;padding:20px;border:1.5px solid var(--green-mid);text-align:left">
        <h4 style="font-weight:700;margin-bottom:12px">📊 Order Customers (${orders.length})</h4>
        ${orders.slice(0, 8).map(o => `<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border);font-size:13px"><span>👤 ${o.name} — 📞 ${o.phone}</span><span style="color:var(--green);font-weight:700">${lkr(o.total)}</span></div>`).join('')}
        ${!orders.length ? '<p style="color:var(--text-light)">No customers yet</p>' : ''}
      </div>
    </div>`;
}

/* ─── Analytics tab ─── */
function renderAnalytics() {
  const catSales = {};
  orders.forEach(o => {
    o.items.forEach(i => {
      catSales[i.category] = (catSales[i.category] || 0) + i.price * i.qty;
    });
  });
  const maxSale = Math.max(...Object.values(catSales), 1);
  const catEntries = Object.entries(catSales).sort((a, b) => b[1] - a[1]);

  document.getElementById('adminBody').innerHTML = `
    <div style="margin-bottom:24px">
      <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">📊 Sales by Category</h3>
      ${catEntries.length ? `<div class="analytics-bar-wrap">${catEntries.map(([cat, val]) => `<div class="analytics-bar-item"><div class="abar-label">${catEmoji(cat)} ${cat}</div><div class="abar"><div class="abar-fill" style="width:${Math.round(val / maxSale * 100)}%"></div></div><div class="abar-val">${lkr(val)}</div></div>`).join('')}</div>` : '<p style="color:var(--text-light)">Place some orders to see analytics</p>'}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:24px">
      <div class="stat-card"><div class="stat-card-icon">⭐</div><div class="stat-card-val">${loyaltyPoints}</div><div class="stat-card-label">Loyalty Points Given</div></div>
      <div class="stat-card"><div class="stat-card-icon">❤️</div><div class="stat-card-val">${wishlist.length}</div><div class="stat-card-label">Current Wishlist Items</div></div>
      <div class="stat-card"><div class="stat-card-icon">⭐</div><div class="stat-card-val">${reviews.length}</div><div class="stat-card-label">Customer Reviews</div></div>
      <div class="stat-card"><div class="stat-card-icon">🛒</div><div class="stat-card-val">${cart.length}</div><div class="stat-card-label">Items in Active Cart</div></div>
    </div>`;
}

/* ─── Shop Info tab ─── */
function renderShopInfo() {
  document.getElementById('adminBody').innerHTML = `
    <div class="shop-info-form">
      <h3 style="margin-bottom:16px;color:var(--green)">🏪 Shop Information</h3>
      <div class="form-group"><label>Shop Name</label><input id="si_name" value="${shopInfo.shopName}" placeholder="DISSA SUPER" /></div>
      <div class="form-group"><label>Address</label><input id="si_address" value="${shopInfo.address}" placeholder="123 Main Street, Colombo" /></div>
      <div class="form-row2">
        <div class="form-group"><label>Phone Number</label><input id="si_phone" value="${shopInfo.phone}" placeholder="+94 11 234 5678" /></div>
        <div class="form-group"><label>WhatsApp Number</label><input id="si_whatsapp" value="${shopInfo.whatsapp}" placeholder="+94 77 123 4567" /></div>
      </div>
      <div class="form-group"><label>Email Address</label><input id="si_email" value="${shopInfo.email}" placeholder="hello@dissasuper.lk" /></div>
      <div class="form-group"><label>Google Maps Link</label><input id="si_map" value="${shopInfo.mapLink}" placeholder="https://maps.google.com/..." /></div>
      <div class="form-group"><label>About Text (First Paragraph)</label><textarea id="si_about" rows="3" placeholder="About your shop...">${shopInfo.aboutText}</textarea></div>
      <div class="form-group"><label>About Text (Second Paragraph)</label><textarea id="si_about2" rows="2" placeholder="Additional info...">${shopInfo.aboutText2}</textarea></div>
      <div class="form-row2">
        <div class="form-group"><label>Weekday Hours</label><input id="si_hours_week" value="${shopInfo.openingHours.weekdays}" placeholder="7:00 AM – 9:00 PM" /></div>
        <div class="form-group"><label>Saturday Hours</label><input id="si_hours_sat" value="${shopInfo.openingHours.saturday}" placeholder="7:00 AM – 8:00 PM" /></div>
      </div>
      <div class="form-group"><label>Sunday Hours</label><input id="si_hours_sun" value="${shopInfo.openingHours.sunday}" placeholder="8:00 AM – 6:00 PM" /></div>
      <div class="form-actions">
        <button class="btn-save" onclick="saveShopInfoData()">💾 Save Shop Info</button>
      </div>
    </div>`;
}

function saveShopInfoData() {
  shopInfo = {
    shopName: document.getElementById('si_name')?.value || 'DISSA SUPER',
    address: document.getElementById('si_address')?.value || '123 Main Street, Colombo',
    phone: document.getElementById('si_phone')?.value || '+94 11 234 5678',
    whatsapp: document.getElementById('si_whatsapp')?.value || '+94 77 123 4567',
    email: document.getElementById('si_email')?.value || 'hello@dissasuper.lk',
    mapLink: document.getElementById('si_map')?.value || 'https://maps.google.com/?q=Colombo+Sri+Lanka',
    aboutText: document.getElementById('si_about')?.value || '',
    aboutText2: document.getElementById('si_about2')?.value || '',
    openingHours: {
      weekdays: document.getElementById('si_hours_week')?.value || '7:00 AM – 9:00 PM',
      saturday: document.getElementById('si_hours_sat')?.value || '7:00 AM – 8:00 PM',
      sunday: document.getElementById('si_hours_sun')?.value || '8:00 AM – 6:00 PM'
    }
  };
  saveShopInfo();
  updateShopInfoDisplay();
  showToast('✅ Shop information updated!');
}

// ══════════════════════════════════════════════════════
// 19. AI CHATBOT
// ══════════════════════════════════════════════════════

const QUICK_QUESTIONS = [
  'What vegetables do you have?',
  'Is delivery available?',
  'How much is delivery?',
  'Today\'s fresh items?',
  'How do I place an order?',
  'Do you have promo codes?',
];

function toggleChat() {
  chatOpen = !chatOpen;
  const chatWindow = document.getElementById('chatWindow');
  const chatFab = document.getElementById('chatFab');
  if (chatWindow) chatWindow.classList.toggle('open', chatOpen);
  if (chatFab) chatFab.innerHTML = chatOpen ? '✕' : '🤖';

  if (chatOpen && document.getElementById('chatMsgs').children.length === 0) {
    botMsg(`👋 **Ayubowan! Welcome to DISSA SUPER!**\n\nI'm your grocery assistant. I can help with:\n\n🥦 **Products & prices**\n🚚 **Delivery info**\n🛒 **Ordering help**\n🎁 **Promo codes**\n\nWhat can I help you with today?`);
    renderQuickChips();
  }
}

function renderQuickChips() {
  const chipsDiv = document.getElementById('quickChips');
  if (chipsDiv) {
    chipsDiv.innerHTML = QUICK_QUESTIONS.map(q => `<button class="qchip" onclick="sendQuick('${q.replace(/'/g, "\\'")}')">${q}</button>`).join('');
  }
}

function sendQuick(q) {
  const chipsDiv = document.getElementById('quickChips');
  if (chipsDiv) chipsDiv.innerHTML = '';
  const chatInp = document.getElementById('chatInp');
  if (chatInp) chatInp.value = q;
  sendChat();
}

function botMsg(text) {
  const msgs = document.getElementById('chatMsgs');
  if (!msgs) return;
  const d = document.createElement('div');
  d.className = 'cmsg bot';
  d.innerHTML = `<div class="cbubble">${text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</div><div class="chat-time">${timeNow()}</div>`;
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
}

function userMsg(text) {
  const msgs = document.getElementById('chatMsgs');
  if (!msgs) return;
  const d = document.createElement('div');
  d.className = 'cmsg user';
  d.innerHTML = `<div class="cbubble">${escapeHtml(text)}</div><div class="chat-time" style="text-align:right">${timeNow()}</div>`;
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showTyping() {
  const msgs = document.getElementById('chatMsgs');
  if (!msgs) return;
  const d = document.createElement('div');
  d.className = 'cmsg bot';
  d.id = 'typingIndicator';
  d.innerHTML = '<div class="chat-typing"><span></span><span></span><span></span></div>';
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
}

function hideTyping() {
  const t = document.getElementById('typingIndicator');
  if (t) t.remove();
}

function getVegetablesText() {
  const vegs = products.filter(p => p.category === 'Vegetables').slice(0, 8);
  if (vegs.length === 0) return "No vegetables found.";
  return vegs.map(p => `${p.emoji} ${p.name} - ${lkr(p.price)} per ${p.unit}`).join(', ');
}

function getFreshItemsText() {
  const freshItems = products.filter(p => p.badge === 'Fresh' || p.badge === 'Season').slice(0, 5);
  if (freshItems.length === 0) return "No fresh items at the moment.";
  return freshItems.map(p => `${p.emoji} ${p.name} (${lkr(p.price)})`).join(', ');
}

async function sendChat() {
  const inp = document.getElementById('chatInp');
  if (!inp) return;
  const text = inp.value.trim();
  if (!text) return;
  inp.value = '';

  const chipsDiv = document.getElementById('quickChips');
  if (chipsDiv) chipsDiv.innerHTML = '';

  userMsg(text);
  showTyping();

  setTimeout(() => {
    hideTyping();
    let reply = "";
    const lowerText = text.toLowerCase();

    if (lowerText.includes('vegetable') || (lowerText.includes('veg') && !lowerText.includes('vegan'))) {
      reply = `🥦 **Our Fresh Vegetables:**\n\n${getVegetablesText()}\n\nWould you like prices or delivery info for any of these?`;
    } else if (lowerText.includes('delivery') || lowerText.includes('deliver')) {
      if (deliveryEnabled) {
        reply = `🚚 **Delivery Information:**\n\n✅ Delivery is currently AVAILABLE\n💰 Delivery Fee: LKR 200 flat rate\n🎉 FREE delivery on orders over LKR 3000\n⏰ Same-day delivery for orders before 2 PM\n\nWould you like to place an order?`;
      } else {
        reply = `⏸ **Delivery Status:**\n\nDelivery is currently UNAVAILABLE.\n🏪 Please choose **Store Pickup** at checkout.\n\nOur store is located at ${shopInfo.address}. We're open ${shopInfo.openingHours.weekdays} on weekdays!`;
      }
    } else if (lowerText.includes('promo') || lowerText.includes('discount') || lowerText.includes('code')) {
      reply = `🎁 **Active Promo Codes:**\n\n• **DISSA10** → 10% off your first order\n• **FRESH20** → 20% off fresh items\n• **WELCOME** → 15% off welcome offer\n\nJust enter the code at checkout!`;
    } else if (lowerText.includes('fresh') || lowerText.includes('today')) {
      reply = `🥬 **Fresh Today:**\n\n${getFreshItemsText()}\n\nThese items are handpicked this morning! 🎉`;
    } else if (lowerText.includes('order') || lowerText.includes('buy') || lowerText.includes('purchase')) {
      reply = `🛒 **How to Place an Order:**\n\n1. Browse our products in the Shop section\n2. Click the + button to add items to cart\n3. Click the cart icon (🛒) to review\n4. Proceed to checkout\n5. Enter your details and confirm!\n\n📞 Need help? WhatsApp us at ${shopInfo.whatsapp}`;
    } else if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('how much')) {
      reply = `💰 **Pricing Info:**\n\nAll prices are in LKR (Sri Lankan Rupees).\n• Delivery: LKR 200 flat fee (FREE over LKR 3000)\n• Many products have discounted prices!\n• Promo codes available for extra savings!\n\nWhich product's price would you like to know?`;
    } else if (lowerText.includes('hour') || lowerText.includes('open') || lowerText.includes('timing')) {
      reply = `🕐 **Store Hours:**\n\n• Monday - Friday: ${shopInfo.openingHours.weekdays}\n• Saturday: ${shopInfo.openingHours.saturday}\n• Sunday: ${shopInfo.openingHours.sunday}\n\nWe're located at ${shopInfo.address}!`;
    } else if (lowerText.includes('contact') || lowerText.includes('phone') || lowerText.includes('email')) {
      reply = `📞 **Contact Us:**\n\n• WhatsApp: ${shopInfo.whatsapp}\n• Phone: ${shopInfo.phone}\n• Email: ${shopInfo.email}\n• Address: ${shopInfo.address}\n\nWe usually reply within minutes on WhatsApp!`;
    } else if (lowerText.includes('hi') || lowerText.includes('hello') || lowerText.includes('hey')) {
      reply = `👋 Hello! Welcome to DISSA SUPER! 😊\n\nI can help you with:\n• 🥦 Product information and prices\n• 🚚 Delivery status and fees\n• 🎁 Promo codes and discounts\n• 🛒 How to place an order\n• 📞 Store contact info\n\nWhat would you like to know?`;
    } else {
      reply = `💚 **Thanks for reaching out!**\n\nI can help with:\n• 🥦 Vegetables & products\n• 🚚 Delivery info\n• 🎁 Promo codes (DISSA10, FRESH20, WELCOME)\n• 🛒 How to order\n• 📞 Contact details\n\nWhat specific information are you looking for?`;
    }

    botMsg(reply);
    chatHistory.push({ role: 'user', content: text });
    chatHistory.push({ role: 'assistant', content: reply });
  }, 800);
}

// ══════════════════════════════════════════════════════
// 20. PRODUCT DETAIL MODAL
// ══════════════════════════════════════════════════════

function showProductDetail(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const inWishlist = wishlist.some(w => w.id === id);
  const stockStatus = p.stock === 0 ? 'OUT OF STOCK' : `${p.stock}% available`;
  const hasDiscount = p.originalPrice && p.originalPrice > p.price;
  const discountPercent = hasDiscount ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;

  const imageHtml = p.image && p.image.startsWith('data:')
    ? `<img src="${p.image}" alt="${p.name}" style="max-width:150px;margin:0 auto;border-radius:12px;" />`
    : `<div style="font-size:64px;text-align:center">${p.emoji}</div>`;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.style.display = 'flex';
  modal.style.opacity = '1';
  modal.style.pointerEvents = 'all';
  modal.innerHTML = `
    <div class="modal" style="max-width:500px">
      <div class="modal-head">
        <h2>${p.emoji} ${p.name}</h2>
        <button class="close-x" onclick="this.closest('.modal-overlay').remove()">✕</button>
      </div>
      <div class="modal-body">
        ${imageHtml}
        <p><strong>📦 Unit:</strong> ${p.unit}</p>
        <p><strong>💰 Price:</strong> <span style="color:var(--green);font-weight:800">${lkr(p.price)}</span>${hasDiscount ? ` <span style="text-decoration:line-through;color:var(--text-light)">${lkr(p.originalPrice)}</span> <span style="color:#e65100">(-${discountPercent}%)</span>` : ''}</p>
        <p><strong>📊 Stock:</strong> ${stockStatus}</p>
        <p><strong>🏷️ Category:</strong> ${p.category}</p>
        ${p.badge ? `<p><strong>✨ Badge:</strong> ${p.badge}</p>` : ''}
        <div style="margin-top:24px;display:flex;gap:12px">
          ${p.stock > 0 ? `<button class="btn-hero-primary" style="flex:1" onclick="addToCart(${p.id}); this.closest('.modal-overlay').remove()">🛒 Add to Cart</button>` : ''}
          <button class="btn-hero-secondary" style="flex:1" onclick="toggleWishlist(${p.id}); this.closest('.modal-overlay').remove()">
            ${inWishlist ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

// ══════════════════════════════════════════════════════
// 21. SCROLL NAVIGATION
// ══════════════════════════════════════════════════════

function scrollTo(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

// ══════════════════════════════════════════════════════
// 22. BACK TO TOP
// ══════════════════════════════════════════════════════

window.addEventListener('scroll', () => {
  const btn = document.getElementById('backTop');
  if (btn) {
    if (window.scrollY > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }
  const header = document.getElementById('mainHeader');
  if (header) {
    header.style.boxShadow = window.scrollY > 10 ? 'var(--shadow)' : 'var(--shadow-sm)';
  }
});

// ══════════════════════════════════════════════════════
// 23. INITIALISE ON PAGE LOAD
// ══════════════════════════════════════════════════════

function init() {
  renderCats();
  renderProducts();
  renderFreshStrip();
  renderRecipes();
  renderReviews();
  renderNotifications();
  updateShopInfoDisplay();

  const heroOrder = document.getElementById('heroOrderCount');
  if (heroOrder) heroOrder.textContent = orders.length + ' Orders';
  const heroProduct = document.getElementById('heroProductCount');
  if (heroProduct) heroProduct.textContent = products.length;

  setTimeout(() => {
    const notifDot = document.getElementById('notifDot');
    if (notifDot) notifDot.style.display = 'block';
  }, 2000);
}

// Make all functions globally available
window.scrollTo = scrollTo;
window.toggleDarkMode = toggleDarkMode;
window.toggleLang = toggleLang;
window.toggleMobileNav = toggleMobileNav;
window.closeMobileNav = closeMobileNav;
window.toggleNotif = toggleNotif;
window.closeBanner = closeBanner;
window.applyPromo = applyPromo;
window.applyPromoFromCart = applyPromoFromCart;
window.selectCat = selectCat;
window.filterProducts = filterProducts;
window.sortProducts = sortProducts;
window.loadMore = loadMore;
window.toggleWishlist = toggleWishlist;
window.openWishlist = openWishlist;
window.closeWishlist = closeWishlist;
window.moveToCart = moveToCart;
window.addToCart = addToCart;
window.incQty = incQty;
window.decQty = decQty;
window.removeFromCart = removeFromCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;
window.setOType = setOType;
window.placeOrder = placeOrder;
window.openReviewForm = openReviewForm;
window.closeReviewForm = closeReviewForm;
window.setRating = setRating;
window.submitReview = submitReview;
window.addRecipeIngredients = addRecipeIngredients;
window.submitContact = submitContact;
window.subscribeNewsletter = subscribeNewsletter;
window.openMap = openMap;
window.openWhatsApp = openWhatsApp;
window.openAdmin = openAdmin;
window.closeAdmin = closeAdmin;
window.adminTab = adminTab;
window.toggleDelivery = toggleDelivery;
window.showProdForm = showProdForm;
window.saveProd = saveProd;
window.cancelProdForm = cancelProdForm;
window.delProduct = delProduct;
window.updateOrderStatus = updateOrderStatus;
window.clearOrders = clearOrders;
window.toggleChat = toggleChat;
window.sendChat = sendChat;
window.sendQuick = sendQuick;
window.showProductDetail = showProductDetail;
window.previewImage = previewImage;
window.saveShopInfoData = saveShopInfoData;

document.addEventListener('DOMContentLoaded', init);
