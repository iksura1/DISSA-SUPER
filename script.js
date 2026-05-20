/* DISSA SUPER - COMPLETE WORKING VERSION */
/* Admin Panel Changes Live Update + Mobile Image Fix */

'use strict';

// ==================== APP STATE ====================
let deliveryEnabled = true;
let cart = [];
let wishlist = [];
let editingId = null;
let chatOpen = false;
let currentCat = 'All';
let searchQ = '';
let sortMode = 'default';
let promoDiscount = 0;
let activePromoCode = '';
let loyaltyPoints = 0;
let darkMode = false;
let PAGE_SIZE = 12;
let displayedCount = PAGE_SIZE;
let currentLang = 'en';

// Shop Information
let shopInfo = JSON.parse(localStorage.getItem('dissaShopInfo') || 'null') || {
  shopName: 'DISSA SUPER',
  address: '210/C Dalupitiya Kadawatha',
  phone: '+94 74 188 7910',
  whatsapp: '+94 74 188 7910',
  email: 'dissasuper.lk',
  aboutText: 'We are a trusted Sri Lankan neighbourhood supermarket committed to bringing the freshest groceries right to your doorstep.',
  aboutText2: 'From farm-fresh vegetables to daily dairy, we stock everything your family needs — delivered fast or ready for pickup.',
  mapLink: 'https://maps.google.com/?q=Colombo+Sri+Lanka',
  openingHours: {
    weekdays: '7:00 AM – 9:00 PM',
    saturday: '7:00 AM – 8:00 PM',
    sunday: '8:00 AM – 6:00 PM'
  }
};

// Data
let orders = JSON.parse(localStorage.getItem('dissaOrders') || '[]');
let products = JSON.parse(localStorage.getItem('dissaProducts') || 'null') || getDefaultProducts();

const PROMO_CODES = { 'DISSA10': 0.10, 'FRESH20': 0.20, 'WELCOME': 0.15 };

// Notifications - MAX 3 ITEMS ONLY
let NOTIFICATIONS = JSON.parse(localStorage.getItem('dissaNotifications') || 'null') || [
  { id: 1, text: '🎁 Use code DISSA10 for 10% off!', time: '2 min ago', read: false },
  { id: 2, text: '🥭 Mangoes just restocked!', time: '15 min ago', read: false },
  { id: 3, text: '🚚 Free delivery over LKR 3000', time: '1 hr ago', read: false },
];

// ==================== DEFAULT DATA ====================
function getDefaultProducts() {
  return [
    { id: 1, name: 'Fresh Tomatoes', category: 'Vegetables', price: 120, originalPrice: 150, unit: '500g', imageUrl: 'https://i.imgur.com/MaANaQV.jpeg', emoji: '🍅', badge: 'Fresh', stock: 85 },
    { id: 2, name: 'Carrots', category: 'Vegetables', price: 90, originalPrice: 120, unit: '500g', imageUrl: '', emoji: '🥕', badge: '', stock: 70 },
    { id: 3, name: 'Broccoli', category: 'Vegetables', price: 280, originalPrice: 320, unit: '1 head', imageUrl: '', emoji: '🥦', badge: 'Fresh', stock: 40 },
    { id: 4, name: 'Cabbage', category: 'Vegetables', price: 150, originalPrice: 180, unit: '1 head', imageUrl: '', emoji: '🥬', badge: '', stock: 60 },
    { id: 5, name: 'Cucumber', category: 'Vegetables', price: 80, originalPrice: 100, unit: '2 pcs', imageUrl: '', emoji: '🥒', badge: 'Fresh', stock: 90 },
    { id: 6, name: 'Bananas', category: 'Fruits', price: 150, originalPrice: 180, unit: '1 bunch', imageUrl: '', emoji: '🍌', badge: '', stock: 95 },
    { id: 7, name: 'Mango', category: 'Fruits', price: 350, originalPrice: 450, unit: '2 pcs', imageUrl: '', emoji: '🥭', badge: 'Season', stock: 55 },
    { id: 8, name: 'Apples', category: 'Fruits', price: 420, originalPrice: 500, unit: '4 pcs', imageUrl: '', emoji: '🍎', badge: '', stock: 30 },
    { id: 9, name: 'Watermelon', category: 'Fruits', price: 380, originalPrice: 450, unit: '1 whole', imageUrl: '', emoji: '🍉', badge: '', stock: 20 },
    { id: 10, name: 'Papaya', category: 'Fruits', price: 200, originalPrice: 250, unit: '1 pc', imageUrl: '', emoji: '🍑', badge: 'Season', stock: 45 },
    { id: 11, name: 'Full Cream Milk', category: 'Dairy', price: 320, originalPrice: 380, unit: '1 litre', imageUrl: '', emoji: '🥛', badge: '', stock: 80 },
    { id: 12, name: 'Cheddar Cheese', category: 'Dairy', price: 680, originalPrice: 850, unit: '200g', imageUrl: '', emoji: '🧀', badge: '', stock: 35 },
    { id: 13, name: 'Eggs', category: 'Dairy', price: 480, originalPrice: 550, unit: '12 pcs', imageUrl: '', emoji: '🥚', badge: '', stock: 75 },
    { id: 14, name: 'Yoghurt', category: 'Dairy', price: 180, originalPrice: 220, unit: '250g', imageUrl: '', emoji: '🫙', badge: 'New', stock: 60 },
    { id: 15, name: 'Basmati Rice', category: 'Dry Goods', price: 560, originalPrice: 650, unit: '1kg', imageUrl: '', emoji: '🍚', badge: '', stock: 100 },
    { id: 16, name: 'Coconut Oil', category: 'Dry Goods', price: 420, originalPrice: 520, unit: '500ml', imageUrl: '', emoji: '🫙', badge: '', stock: 65 },
    { id: 17, name: 'Red Lentils', category: 'Dry Goods', price: 280, originalPrice: 350, unit: '500g', imageUrl: '', emoji: '🫘', badge: '', stock: 90 },
    { id: 18, name: 'Bread', category: 'Bakery', price: 180, originalPrice: 220, unit: '1 loaf', imageUrl: '', emoji: '🍞', badge: 'Fresh', stock: 50 },
    { id: 19, name: 'Croissant', category: 'Bakery', price: 120, originalPrice: 160, unit: '2 pcs', imageUrl: '', emoji: '🥐', badge: 'Fresh', stock: 25 },
    { id: 20, name: 'Chicken Breast', category: 'Meat & Fish', price: 920, originalPrice: 1100, unit: '500g', imageUrl: '', emoji: '🍗', badge: '', stock: 40 },
    { id: 21, name: 'Fresh Fish', category: 'Meat & Fish', price: 750, originalPrice: 900, unit: '500g', imageUrl: '', emoji: '🐟', badge: 'Fresh', stock: 30 },
    { id: 22, name: 'Orange Juice', category: 'Beverages', price: 280, originalPrice: 350, unit: '1 litre', imageUrl: '', emoji: '🍊', badge: 'New', stock: 55 },
    { id: 23, name: 'Coconut Water', category: 'Beverages', price: 150, originalPrice: 200, unit: '330ml', imageUrl: '', emoji: '🥥', badge: '', stock: 70 },
    { id: 24, name: 'Potato Chips', category: 'Snacks', price: 200, originalPrice: 250, unit: '100g', imageUrl: '', emoji: '🥔', badge: '', stock: 80 },
    { id: 25, name: 'Dark Chocolate', category: 'Snacks', price: 350, originalPrice: 450, unit: '100g', imageUrl: '', emoji: '🍫', badge: 'New', stock: 45 },
  ];
}

// ==================== UTILITIES ====================
function showToast(msg, duration = 2800) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

function lkr(n) { return 'LKR ' + Number(n).toLocaleString(); }
function timeNow() { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }

function saveProducts() { localStorage.setItem('dissaProducts', JSON.stringify(products)); }
function saveOrders() { localStorage.setItem('dissaOrders', JSON.stringify(orders)); }
function saveShopInfo() { localStorage.setItem('dissaShopInfo', JSON.stringify(shopInfo)); updateShopInfoDisplay(); }
function saveNotifications() { 
  NOTIFICATIONS = NOTIFICATIONS.slice(0, 3);
  localStorage.setItem('dissaNotifications', JSON.stringify(NOTIFICATIONS)); 
}

// Force reload products from localStorage
function loadProductsFromStorage() {
  const stored = localStorage.getItem('dissaProducts');
  if (stored) {
    products = JSON.parse(stored);
  }
  return products;
}

function updateShopInfoDisplay() {
  const elements = {
    addressDisplay: document.getElementById('addressDisplay'),
    addressDisplay2: document.getElementById('addressDisplay2'),
    phoneDisplay: document.getElementById('phoneDisplay'),
    whatsappDisplay: document.getElementById('whatsappDisplay'),
    emailDisplay: document.getElementById('emailDisplay'),
    aboutText: document.getElementById('aboutText'),
    aboutText2: document.getElementById('aboutText2'),
    hoursWeekday: document.getElementById('hoursWeekday'),
    hoursSat: document.getElementById('hoursSat'),
    hoursSun: document.getElementById('hoursSun')
  };
  if (elements.addressDisplay) elements.addressDisplay.textContent = shopInfo.address;
  if (elements.addressDisplay2) elements.addressDisplay2.textContent = shopInfo.address;
  if (elements.phoneDisplay) elements.phoneDisplay.textContent = shopInfo.phone;
  if (elements.whatsappDisplay) elements.whatsappDisplay.textContent = shopInfo.whatsapp;
  if (elements.emailDisplay) elements.emailDisplay.textContent = shopInfo.email;
  if (elements.aboutText) elements.aboutText.textContent = shopInfo.aboutText;
  if (elements.aboutText2) elements.aboutText2.textContent = shopInfo.aboutText2;
  if (elements.hoursWeekday) elements.hoursWeekday.textContent = shopInfo.openingHours.weekdays;
  if (elements.hoursSat) elements.hoursSat.textContent = shopInfo.openingHours.saturday;
  if (elements.hoursSun) elements.hoursSun.textContent = shopInfo.openingHours.sunday;
}

function addNotification(text) {
  NOTIFICATIONS.unshift({ id: Date.now(), text: text, time: 'Just now', read: false });
  if (NOTIFICATIONS.length > 3) NOTIFICATIONS.pop();
  saveNotifications();
  renderNotifications();
  const dot = document.getElementById('notifDot');
  if (dot) dot.style.display = 'block';
}

// ==================== DARK MODE & NAV ====================
function toggleDarkMode() {
  darkMode = !darkMode;
  document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  const btn = document.getElementById('darkBtn');
  if (btn) btn.textContent = darkMode ? '☀️' : '🌙';
  showToast(darkMode ? '🌙 Dark mode on' : '☀️ Light mode on');
}

function toggleLang() {
  currentLang = currentLang === 'en' ? 'si' : 'en';
  const btn = document.getElementById('langBtn');
  if (btn) btn.textContent = '🌐 ' + currentLang.toUpperCase();
  showToast(currentLang === 'si' ? '🌐 Sinhala coming soon!' : '🌐 English selected');
}

function toggleMobileNav() { 
  const nav = document.getElementById('mobileNav');
  if (nav) nav.classList.toggle('open'); 
}
function closeMobileNav() { 
  const nav = document.getElementById('mobileNav');
  if (nav) nav.classList.remove('open'); 
}

function toggleNotif() { 
  const panel = document.getElementById('notifPanel');
  if (panel) panel.classList.toggle('open'); 
  const dot = document.getElementById('notifDot');
  if (dot) dot.style.display = 'none';
  NOTIFICATIONS.forEach(n => n.read = true);
  saveNotifications();
}

function renderNotifications() {
  const list = document.getElementById('notifList');
  if (!list) return;
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;
  const dot = document.getElementById('notifDot');
  if (dot) dot.style.display = unreadCount > 0 ? 'block' : 'none';
  list.innerHTML = NOTIFICATIONS.map(n => 
    `<div class="notif-item" style="${n.read ? 'opacity:0.7' : ''}">
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

// ==================== PROMO CODES ====================
function closeBanner() { 
  const banner = document.getElementById('promoBanner');
  if (banner) banner.style.display = 'none'; 
}
function applyPromo(code) { _applyPromoCode(code); }
function applyPromoFromCart() { 
  const input = document.getElementById('promoInput');
  if (input) _applyPromoCode(input.value.trim().toUpperCase()); 
}

function _applyPromoCode(code) {
  if (PROMO_CODES[code]) {
    promoDiscount = PROMO_CODES[code];
    activePromoCode = code;
    showToast(`🎁 Promo "${code}" applied — ${Math.round(promoDiscount * 100)}% off!`);
    renderCartBody();
  } else showToast('❌ Invalid promo code');
}

// ==================== CATEGORIES & PRODUCTS ====================
function getCats() { 
  return ['All', ...new Set(products.map(p => p.category))]; 
}

const CAT_EMOJI = { 
  All: '🛒', Vegetables: '🥦', Fruits: '🍎', Dairy: '🥛', 
  'Dry Goods': '🌾', Bakery: '🍞', 'Meat & Fish': '🍗', 
  Beverages: '🥤', Snacks: '🍿' 
};

function catEmoji(c) { return CAT_EMOJI[c] || '📦'; }

function renderCats() {
  const bar = document.getElementById('categoriesBar');
  if (!bar) return;
  bar.innerHTML = getCats().map(c => 
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
  const input = document.getElementById('searchInput');
  searchQ = input ? input.value.toLowerCase() : '';
  displayedCount = PAGE_SIZE; 
  renderProducts(); 
}

function sortProducts() { 
  const select = document.getElementById('sortSelect');
  sortMode = select ? select.value : 'default';
  displayedCount = PAGE_SIZE; 
  renderProducts(); 
}

function loadMore() { 
  displayedCount += PAGE_SIZE; 
  renderProducts(); 
}

function getFilteredProducts() {
  const stockFilter = document.getElementById('stockFilter');
  const stockOnly = stockFilter ? stockFilter.value === 'instock' : false;
  
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

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

function renderProducts() {
  // Force reload products from localStorage to ensure latest data
  loadProductsFromStorage();
  
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const list = getFilteredProducts();
  
  const countLabel = document.getElementById('productCountLabel');
  if (countLabel) countLabel.textContent = `${list.length} item${list.length !== 1 ? 's' : ''}`;
  const heroCount = document.getElementById('heroProductCount');
  if (heroCount) heroCount.textContent = products.length;

  if (!list.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:64px 20px;"><div style="font-size:56px;">🔍</div><p>No products found</p></div>`;
    const loadBtn = document.getElementById('loadMoreBtn');
    if (loadBtn) loadBtn.style.display = 'none';
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
    
    // Image URL support with better mobile handling
    let imageHtml = '';
    if (p.imageUrl && p.imageUrl.trim() !== '' && p.imageUrl.startsWith('http')) {
      // Add timestamp to prevent caching issues on mobile
      const cacheBuster = '?t=' + Date.now();
      imageHtml = `<img src="${p.imageUrl}${cacheBuster}" 
                      alt="${escapeHtml(p.name)}" 
                      loading="lazy"
                      crossorigin="anonymous"
                      onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';"
                      style="width:100%; height:100%; object-fit:cover;" />
                   <span class="emoji-fallback" style="display:none">${p.emoji}</span>`;
    } else {
      // No image URL - show emoji (this works 100% on mobile!)
      imageHtml = `<span class="emoji-fallback" style="display:flex; align-items:center; justify-content:center; width:100%; height:100%; font-size:56px;">${p.emoji}</span>`;
    }

    return `<div class="product-card">
      <div class="product-img" onclick="showProductDetail(${p.id})">
        ${imageHtml}
        ${hasDiscount ? `<span class="discount-badge">-${discountPercent}%</span>` : ''}
        ${p.badge ? `<span class="product-badge ${badgeCls}">${p.badge}</span>` : ''}
        ${oos ? '<div class="oos-overlay">OUT OF STOCK</div>' : ''}
      </div>
      <button class="card-wish-btn" onclick="toggleWishlist(${p.id})">${inWishlist ? '❤️' : '🤍'}</button>
      <div class="product-info">
        <div class="product-name">${escapeHtml(p.name)}</div>
        <div class="product-unit">📦 ${p.unit}</div>
        <div class="stock-bar"><div class="stock-bar-fill" style="width:${stockPct}%;background:${stockColor}"></div></div>
        <div class="product-footer">
          <div class="product-price">
            <span class="current-price">${lkr(p.price)}</span>
            ${hasDiscount ? `<span class="original-price">${lkr(p.originalPrice)}</span>` : ''}
          </div>
          ${oos ? `<button class="add-btn" disabled>✕</button>` : 
            (qty === 0 ? `<button class="add-btn" onclick="addToCart(${p.id})">+</button>` : 
            `<div class="qty-ctrl">
               <button class="qty-btn" onclick="decQty(${p.id})">−</button>
               <span class="qty-num">${qty}</span>
               <button class="qty-btn" onclick="incQty(${p.id})">+</button>
             </div>`)}
        </div>
      </div>
    </div>`;
  }).join('');
  
  const loadBtn = document.getElementById('loadMoreBtn');
  if (loadBtn) loadBtn.style.display = list.length > displayedCount ? 'inline-block' : 'none';
}

function renderFreshStrip() {
  const strip = document.getElementById('freshStrip');
  if (!strip) return;
  const freshItems = products.filter(p => p.badge === 'Fresh' || p.badge === 'Season').slice(0, 10);
  strip.innerHTML = freshItems.map(p => 
    `<div class="fresh-card" onclick="selectCat('${p.category}')">
       <div class="fresh-card-emoji">${p.imageUrl ? '🛒' : p.emoji}</div>
       <div class="fresh-card-name">${escapeHtml(p.name)}</div>
       <div class="fresh-card-price">${lkr(p.price)}</div>
       <span class="fresh-badge">${p.badge}</span>
     </div>`
  ).join('');
}

// ==================== WISHLIST ====================
function toggleWishlist(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
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
  if (el) {
    el.textContent = wishlist.length;
    el.style.display = wishlist.length ? 'inline' : 'none';
  }
}

function openWishlist() { 
  const sidebar = document.getElementById('wishlistSidebar');
  const overlay = document.getElementById('wishlistOverlay');
  if (sidebar) sidebar.classList.add('open');
  if (overlay) overlay.classList.add('open');
  renderWishlistBody(); 
}
function closeWishlist() { 
  const sidebar = document.getElementById('wishlistSidebar');
  const overlay = document.getElementById('wishlistOverlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

function renderWishlistBody() {
  const body = document.getElementById('wishlistBody');
  if (!body) return;
  if (!wishlist.length) { 
    body.innerHTML = `<div class="cart-empty-state"><div>🤍</div><p>Wishlist is empty</p></div>`; 
    return; 
  }
  body.innerHTML = wishlist.map(item => 
    `<div class="cart-item">
       <div class="cart-item-icon">${item.emoji}</div>
       <div class="cart-item-info">
         <div class="cart-item-name">${escapeHtml(item.name)}</div>
         <div class="cart-item-sub">${lkr(item.price)} · ${item.unit}</div>
       </div>
       <button class="add-btn" onclick="moveToCart(${item.id})" style="width:auto;padding:0 12px;">🛒</button>
       <button class="rm-btn" onclick="toggleWishlist(${item.id})">🗑</button>
     </div>`
  ).join('');
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

// ==================== CART ====================
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
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = cart.reduce((s, c) => s + c.qty, 0); 
}

function cartSubtotal() { return cart.reduce((s, c) => s + c.price * c.qty, 0); }
function cartDiscountAmt() { return Math.round(cartSubtotal() * promoDiscount); }
function cartDeliveryFee(type) { if (cartSubtotal() >= 3000) return 0; return (type === 'delivery' && deliveryEnabled) ? 200 : 0; }

function openCart() { 
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (sidebar) sidebar.classList.add('open');
  if (overlay) overlay.classList.add('open');
  renderCartBody(); 
}
function closeCart() { 
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

function renderCartBody() {
  const body = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');
  if (!body || !footer) return;
  
  if (!cart.length) { 
    body.innerHTML = `<div class="cart-empty-state"><div>🛒</div><p>Your cart is empty</p></div>`; 
    footer.style.display = 'none'; 
    return; 
  }
  
  body.innerHTML = cart.map(item => 
    `<div class="cart-item">
       <div class="cart-item-icon">${item.emoji}</div>
       <div class="cart-item-info">
         <div class="cart-item-name">${escapeHtml(item.name)}</div>
         <div class="cart-item-sub">${lkr(item.price)} × ${item.qty}</div>
       </div>
       <div class="cart-item-total">${lkr(item.price * item.qty)}</div>
       <button class="rm-btn" onclick="removeFromCart(${item.id})">🗑</button>
     </div>`
  ).join('');
  
  footer.style.display = 'block';
  const sub = cartSubtotal(), disc = cartDiscountAmt(), fee = cartDeliveryFee('delivery');
  
  const subEl = document.getElementById('cartSubtotal');
  const feeEl = document.getElementById('cartDeliveryFee');
  const totalEl = document.getElementById('cartTotal');
  const discRow = document.getElementById('discountRow');
  const discAmt = document.getElementById('discountAmt');
  const delNote = document.getElementById('delNote');
  
  if (subEl) subEl.textContent = lkr(sub);
  if (feeEl) feeEl.textContent = fee === 0 ? (sub >= 3000 ? 'FREE' : 'Free (Pickup)') : 'LKR 200';
  if (totalEl) totalEl.textContent = lkr(sub - disc + fee);
  
  if (disc > 0 && discRow && discAmt) { 
    discRow.style.display = 'flex'; 
    discAmt.textContent = '-' + lkr(disc); 
  } else if (discRow) { 
    discRow.style.display = 'none'; 
  }
  
  if (delNote) delNote.innerHTML = deliveryEnabled ? (sub >= 3000 ? '🎉 Free delivery!' : '🚚 Home delivery · LKR 200') : '⚠️ Pickup only';
}

// ==================== CHECKOUT ====================
let orderType = 'delivery';

function openCheckout() { 
  closeCart(); 
  const modal = document.getElementById('checkoutModal');
  if (modal) modal.classList.add('open'); 
  orderType = deliveryEnabled ? 'delivery' : 'pickup'; 
  renderCheckout(); 
}
function closeCheckout() { 
  const modal = document.getElementById('checkoutModal');
  if (modal) modal.classList.remove('open'); 
}

function renderCheckout() {
  const body = document.getElementById('checkoutBody');
  if (!body) return;
  const sub = cartSubtotal(), disc = cartDiscountAmt(), fee = cartDeliveryFee(orderType);
  
  body.innerHTML = `
    <div class="form-group"><label>Order Type</label>
      <div class="order-type-row">
        <button class="otype-btn ${orderType === 'delivery' && deliveryEnabled ? 'active' : ''}" onclick="setOType('delivery')" ${!deliveryEnabled ? 'disabled' : ''}>🚚 Home Delivery</button>
        <button class="otype-btn ${orderType === 'pickup' ? 'active' : ''}" onclick="setOType('pickup')">🏪 Store Pickup</button>
      </div>
    </div>
    <div class="form-row2">
      <div class="form-group"><label>Full Name *</label><input id="co_name" placeholder="Your full name" /></div>
      <div class="form-group"><label>Phone *</label><input id="co_phone" type="tel" placeholder="07X XXX XXXX" /></div>
    </div>
    <div class="form-group" id="addr_section" style="${orderType === 'pickup' ? 'display:none' : ''}">
      <label>Delivery Address *</label>
      <textarea id="co_addr" placeholder="House no, street, city…" rows="3"></textarea>
    </div>
    <div class="form-group"><label>Special Notes</label><input id="co_notes" placeholder="Allergies, instructions…" /></div>
    ${promoDiscount === 0 ? 
      `<div class="form-group"><label>Promo Code</label>
        <div style="display:flex;gap:8px">
          <input id="checkout_promo" placeholder="DISSA10" style="flex:1;padding:10px;" />
          <button onclick="applyPromo(document.getElementById('checkout_promo').value)" class="btn-save">Apply</button>
        </div>
      </div>` : 
      `<div style="background:var(--green-pale);padding:10px;border-radius:10px;margin-bottom:16px">🎁 Promo "${activePromoCode}" active — ${Math.round(promoDiscount*100)}% off!</div>`
    }
    <div class="order-summary">
      <div style="font-weight:700;margin-bottom:10px">🧾 Order Summary</div>
      ${cart.map(i => `<div class="osum-row"><span>${i.emoji} ${escapeHtml(i.name)} ×${i.qty}</span><span>${lkr(i.price * i.qty)}</span></div>`).join('')}
      <div class="osum-row"><span>Subtotal</span><span>${lkr(sub)}</span></div>
      ${disc > 0 ? `<div class="osum-row"><span>🎁 Discount</span><span>-${lkr(disc)}</span></div>` : ''}
      <div class="osum-row"><span>Delivery</span><span id="co_fee">${fee === 0 ? 'FREE' : lkr(fee)}</span></div>
      <div class="osum-row osum-total"><span>TOTAL</span><span id="co_total">${lkr(sub - disc + fee)}</span></div>
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
  const fee = cartDeliveryFee(t), disc = cartDiscountAmt(), sub = cartSubtotal();
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
  const sub = cartSubtotal(), disc = cartDiscountAmt(), fee = cartDeliveryFee(orderType), total = sub - disc + fee;
  const points = Math.floor((sub - disc) / 100);
  
  orders.unshift({ 
    id: oid, name, phone, address: addr || 'Store Pickup', notes, 
    type: orderType, items: [...cart], subtotal: sub, discount: disc, 
    deliveryFee: fee, total, date: new Date().toLocaleString(), status: 'Pending' 
  });
  saveOrders();
  loyaltyPoints += points;
  cart = []; promoDiscount = 0; activePromoCode = '';
  updateCartBadge(); renderProducts();
  
  const heroOrder = document.getElementById('heroOrderCount');
  if (heroOrder) heroOrder.textContent = orders.length + ' Orders';
  
  const modal = document.querySelector('#checkoutModal .modal');
  if (modal) {
    modal.innerHTML = `<div class="success-wrap">
      <span class="s-icon">🎉</span>
      <h2>Order Placed!</h2>
      <p>Thank you ${escapeHtml(name)}!</p>
      <div class="order-ref">#${oid}</div>
      <p>${orderType === 'delivery' ? '🚚 We will deliver soon.' : '🏪 Please come to our store for pickup.'}</p>
      <div class="points-badge">⭐ +${points} Points!</div>
      <button class="place-btn" onclick="closeCheckout()">Continue Shopping</button>
    </div>`;
  }
  
  addNotification(`🛒 New order #${oid} placed by ${name}`);
}

// ==================== CONTACT & NEWSLETTER ====================
function submitContact(e) {
  e.preventDefault();
  const name = document.getElementById('cf_name')?.value.trim();
  const email = document.getElementById('cf_email')?.value.trim();
  const msg = document.getElementById('cf_msg')?.value.trim();
  if (!name || !email || !msg) { showToast('⚠️ Please fill all fields'); return; }
  showToast(`📨 Message sent! We'll reply to ${email} soon.`);
  addNotification(`📧 New contact message from ${name}`);
  if (document.getElementById('cf_name')) document.getElementById('cf_name').value = '';
  if (document.getElementById('cf_email')) document.getElementById('cf_email').value = '';
  if (document.getElementById('cf_msg')) document.getElementById('cf_msg').value = '';
}

function subscribeNewsletter() {
  const email = document.getElementById('nlEmail')?.value.trim();
  if (!email) { showToast('⚠️ Please enter your email'); return; }
  showToast(`📰 Subscribed! Watch your inbox at ${email}`);
  if (document.getElementById('nlEmail')) document.getElementById('nlEmail').value = '';
}

function openMap() { window.open(shopInfo.mapLink, '_blank'); }
function openWhatsApp() { window.open(`https://wa.me/${shopInfo.whatsapp.replace(/[^0-9]/g, '')}?text=Hello+DISSA+SUPER!`, '_blank'); }

// ==================== ADMIN PANEL ====================
function openAdmin() { 
  const overlay = document.getElementById('adminOverlay');
  if (overlay) overlay.classList.add('open'); 
  adminTab('dashboard', document.querySelector('.admin-nav-btn')); 
}
function closeAdmin() { 
  const overlay = document.getElementById('adminOverlay');
  if (overlay) overlay.classList.remove('open'); 
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

function renderDashboard() {
  const totalRev = orders.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter(o => o.status === 'Pending').length;
  const delivered = orders.filter(o => o.status === 'Delivered').length;
  const body = document.getElementById('adminBody');
  if (!body) return;
  body.innerHTML = `<div class="stat-cards">
    <div class="stat-card"><div class="stat-card-val">${products.length}</div><div class="stat-card-label">Products</div></div>
    <div class="stat-card"><div class="stat-card-val">${orders.length}</div><div class="stat-card-label">Orders</div></div>
    <div class="stat-card"><div class="stat-card-val">${pending}</div><div class="stat-card-label">Pending</div></div>
    <div class="stat-card"><div class="stat-card-val">${delivered}</div><div class="stat-card-label">Delivered</div></div>
    <div class="stat-card"><div class="stat-card-val">${lkr(totalRev)}</div><div class="stat-card-label">Revenue</div></div>
  </div>
  <div style="background:var(--green-pale);padding:18px;border-radius:14px;margin-bottom:18px">
    <h3>🚚 Delivery ${deliveryEnabled ? 'ON' : 'OFF'}</h3>
  </div>`;
}

function renderAdminDelivery() {
  const body = document.getElementById('adminBody');
  if (!body) return;
  body.innerHTML = `<div class="del-toggle-card">
    <div>
      <h3>🚚 Delivery Service</h3>
      <p>Toggle delivery on/off for customers</p>
      <p style="font-weight:700;color:${deliveryEnabled ? 'var(--green)' : 'var(--orange)'}">
        ${deliveryEnabled ? '✅ AVAILABLE' : '⏸ UNAVAILABLE'}
      </p>
    </div>
    <button class="toggle-sw ${deliveryEnabled ? 'on' : 'off'}" onclick="toggleDelivery()"></button>
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
  addNotification(deliveryEnabled ? '🚚 Delivery service has been ENABLED' : '⏸ Delivery service has been DISABLED');
}

function renderAdminProducts() {
  // Force reload products from localStorage
  loadProductsFromStorage();
  
  const body = document.getElementById('adminBody');
  if (!body) return;
  body.innerHTML = `<div style="display:flex;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px">
    <span>${products.length} products</span>
    <button class="btn-save" onclick="showProdForm(null)">+ Add Product</button>
  </div>
  <div class="a-prod-list">
    ${products.map(p => `
      <div class="a-prod-item">
        <div class="a-prod-emoji">${p.imageUrl ? '🖼️' : p.emoji}</div>
        <div class="a-prod-info">
          <div class="a-prod-name">${escapeHtml(p.name)}</div>
          <div class="a-prod-meta">${p.category} · ${p.unit} · Stock: ${p.stock}%${p.badge ? ` · ${p.badge}` : ''}</div>
        </div>
        <span class="a-prod-price">${lkr(p.price)}</span>
        <button class="btn-edit" onclick="showProdForm(${p.id})">✏️ Edit</button>
        <button class="btn-del" onclick="delProduct(${p.id})">🗑</button>
      </div>
    `).join('')}
  </div>
  <div id="prodFormWrap"></div>`;
}

function showProdForm(id) {
  editingId = id;
  const p = id ? products.find(x => x.id === id) : null;
  const cats = ['Vegetables', 'Fruits', 'Dairy', 'Dry Goods', 'Bakery', 'Meat & Fish', 'Beverages', 'Snacks'];
  const wrap = document.getElementById('prodFormWrap');
  if (!wrap) return;
  
  wrap.innerHTML = `<div class="prod-form">
    <h3>${p ? '✏️ Edit Product' : '➕ Add New Product'}</h3>
    <div class="form-row2">
      <div class="form-group"><label>Product Name *</label><input id="fp_name" value="${p ? escapeHtml(p.name) : ''}" /></div>
      <div class="form-group"><label>Category *</label>
        <select id="fp_cat">${cats.map(c => `<option ${p && p.category === c ? 'selected' : ''}>${c}</option>`).join('')}</select>
      </div>
    </div>
    <div class="form-row2">
      <div class="form-group"><label>Selling Price (LKR) *</label><input id="fp_price" type="number" value="${p ? p.price : ''}" /></div>
      <div class="form-group"><label>Original Price (LKR)</label><input id="fp_original" type="number" value="${p ? p.originalPrice || '' : ''}" /></div>
    </div>
    <div class="form-row2">
      <div class="form-group"><label>Unit</label><input id="fp_unit" value="${p ? p.unit : ''}" /></div>
      <div class="form-group"><label>Emoji (fallback)</label><input id="fp_emoji" value="${p ? p.emoji : '🛒'}" /></div>
    </div>
    <div class="form-row2">
      <div class="form-group"><label>Badge</label><input id="fp_badge" value="${p ? p.badge : ''}" placeholder="Fresh/Sale/New/Season" /></div>
      <div class="form-group"><label>Stock %</label><input id="fp_stock" type="number" min="0" max="100" value="${p ? p.stock : 100}" /></div>
    </div>
    <div class="form-group">
      <label>Product Image URL</label>
      <input id="fp_imageUrl" type="url" value="${p ? p.imageUrl || '' : ''}" placeholder="https://i.imgur.com/your-image.jpg" />
      <div id="imagePreview" style="margin-top:10px;">
        ${p && p.imageUrl ? `<img src="${p.imageUrl}" style="max-width:100px;border-radius:8px;" onerror="this.style.display='none'" />` : ''}
      </div>
      <small style="color:var(--text-light);display:block;margin-top:5px">
        💡 How to get image URL: Upload to Imgur → Right-click image → Copy Image Address
      </small>
    </div>
    <div class="form-actions">
      <button class="btn-save" onclick="saveProd()">💾 Save Product</button>
      <button class="btn-cancel" onclick="cancelProdForm()">Cancel</button>
    </div>
  </div>`;
  
  const urlInput = document.getElementById('fp_imageUrl');
  if (urlInput) {
    urlInput.addEventListener('input', function() {
      const preview = document.getElementById('imagePreview');
      if (preview && this.value) {
        preview.innerHTML = `<img src="${this.value}" style="max-width:100px;border-radius:8px;" onerror="this.style.display='none';this.after('❌ Invalid image URL')" />`;
      } else if (preview) {
        preview.innerHTML = '';
      }
    });
  }
  
  wrap.scrollIntoView({ behavior: 'smooth' });
}

function saveProd() {
  const name = document.getElementById('fp_name')?.value.trim();
  const category = document.getElementById('fp_cat')?.value;
  const price = parseFloat(document.getElementById('fp_price')?.value);
  const originalPrice = parseFloat(document.getElementById('fp_original')?.value) || price;
  const unit = document.getElementById('fp_unit')?.value.trim() || 'pcs';
  const emoji = document.getElementById('fp_emoji')?.value.trim() || '🛒';
  const badge = document.getElementById('fp_badge')?.value.trim();
  const stock = Math.min(100, Math.max(0, parseInt(document.getElementById('fp_stock')?.value) || 100));
  const imageUrl = document.getElementById('fp_imageUrl')?.value.trim() || '';
  
  if (!name) { showToast('⚠️ Enter product name'); return; }
  if (!price || price <= 0) { showToast('⚠️ Enter valid price'); return; }
  
  if (editingId) {
    const idx = products.findIndex(p => p.id === editingId);
    if (idx !== -1) {
      products[idx] = { ...products[idx], name, category, price, originalPrice, unit, emoji, badge, stock, imageUrl };
      showToast('✅ Product updated!');
      addNotification(`✏️ Product "${name}" was updated`);
    }
  } else {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    products.push({ id: newId, name, category, price, originalPrice, unit, emoji, badge, stock, imageUrl });
    showToast('✅ Product added!');
    addNotification(`➕ New product "${name}" was added`);
  }
  
  // Save to localStorage
  saveProducts();
  
  // Clear form and editing state
  editingId = null;
  cancelProdForm();
  
  // FORCE RE-RENDER everything to show changes immediately
  renderCats();
  renderProducts();
  renderFreshStrip();
  renderAdminProducts();
  
  showToast('🔄 Product list updated!');
}

function delProduct(id) {
  const p = products.find(x => x.id === id);
  if (!confirm(`Delete "${p?.name}"?`)) return;
  products = products.filter(x => x.id !== id);
  cart = cart.filter(c => c.id !== id);
  saveProducts();
  updateCartBadge();
  renderCats();
  renderProducts();
  renderFreshStrip();
  renderAdminProducts();
  showToast('🗑 Product deleted');
  addNotification(`🗑 Product "${p?.name}" was deleted`);
}

function cancelProdForm() { 
  const wrap = document.getElementById('prodFormWrap');
  if (wrap) wrap.innerHTML = ''; 
  editingId = null; 
}

function renderAdminOrders() {
  const body = document.getElementById('adminBody');
  if (!body) return;
  if (!orders.length) { 
    body.innerHTML = `<div style="text-align:center;padding:60px"><div style="font-size:56px;">📋</div><p>No orders yet</p></div>`; 
    return; 
  }
  body.innerHTML = `<div style="margin-bottom:16px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px">
    <span>${orders.length} total orders</span>
    <button onclick="clearOrders()" style="background:none;border:1px solid var(--border);padding:5px 10px;border-radius:8px;cursor:pointer">🗑 Clear All</button>
  </div>
  ${orders.map(o => `
    <div class="order-card" style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px">
        <strong>#${o.id}</strong>
        <span class="order-type-tag ${o.type === 'delivery' ? 'tag-delivery' : 'tag-pickup'}">${o.type === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}</span>
      </div>
      <div style="margin-top:8px"><strong>${escapeHtml(o.name)}</strong> · 📞 ${o.phone}</div>
      <div style="font-size:12px;color:var(--text-light)">${o.date}</div>
      <div style="margin-top:8px;font-weight:800;color:var(--green)">${lkr(o.total)}</div>
      <select onchange="updateOrderStatus('${o.id}', this.value)" style="margin-top:8px;padding:4px 8px;border-radius:8px;width:100%">
        <option ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
        <option ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
        <option ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
        <option ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
      </select>
    </div>
  `).join('')}`;
}

function updateOrderStatus(oid, status) { 
  const o = orders.find(x => x.id === oid); 
  if (o) { 
    o.status = status; 
    saveOrders(); 
    showToast(`Order #${oid} → ${status}`);
    addNotification(`📦 Order #${oid} status changed to ${status}`);
  } 
}

function clearOrders() { 
  if (confirm('Clear all orders?')) { 
    orders = []; 
    saveOrders(); 
    renderAdminOrders(); 
    const heroOrder = document.getElementById('heroOrderCount');
    if (heroOrder) heroOrder.textContent = '0 Orders'; 
    showToast('Orders cleared'); 
    addNotification('🗑 All orders have been cleared');
  } 
}

function renderAdminUsers() { 
  const body = document.getElementById('adminBody');
  if (!body) return;
  body.innerHTML = `<div style="text-align:center;padding:40px">
    <div style="font-size:56px;">👤</div>
    <p>Guest checkout active.</p>
    <p style="margin-top:10px">${orders.length} customers served.</p>
  </div>`; 
}

function renderAnalytics() { 
  const body = document.getElementById('adminBody');
  if (!body) return;
  body.innerHTML = `<div class="stat-cards">
    <div class="stat-card"><div class="stat-card-val">${loyaltyPoints}</div><div class="stat-card-label">Points Given</div></div>
    <div class="stat-card"><div class="stat-card-val">${wishlist.length}</div><div class="stat-card-label">Wishlist Items</div></div>
    <div class="stat-card"><div class="stat-card-val">${cart.length}</div><div class="stat-card-label">Cart Items</div></div>
  </div>`; 
}

function renderShopInfo() {
  const body = document.getElementById('adminBody');
  if (!body) return;
  body.innerHTML = `<div class="shop-info-form">
    <h3>🏪 Shop Information</h3>
    <div class="form-group"><label>Shop Name</label><input id="si_name" value="${escapeHtml(shopInfo.shopName)}" /></div>
    <div class="form-group"><label>Address</label><input id="si_address" value="${escapeHtml(shopInfo.address)}" /></div>
    <div class="form-row2">
      <div class="form-group"><label>Phone</label><input id="si_phone" value="${shopInfo.phone}" /></div>
      <div class="form-group"><label>WhatsApp</label><input id="si_whatsapp" value="${shopInfo.whatsapp}" /></div>
    </div>
    <div class="form-group"><label>Email</label><input id="si_email" value="${shopInfo.email}" /></div>
    <div class="form-group"><label>Google Maps Link</label><input id="si_map" value="${shopInfo.mapLink}" /></div>
    <div class="form-group"><label>About Text</label><textarea id="si_about" rows="3">${escapeHtml(shopInfo.aboutText)}</textarea></div>
    <div class="form-group"><label>About Text 2</label><textarea id="si_about2" rows="2">${escapeHtml(shopInfo.aboutText2)}</textarea></div>
    <div class="form-row2">
      <div class="form-group"><label>Weekday Hours</label><input id="si_hours_week" value="${shopInfo.openingHours.weekdays}" /></div>
      <div class="form-group"><label>Saturday Hours</label><input id="si_hours_sat" value="${shopInfo.openingHours.saturday}" /></div>
    </div>
    <div class="form-group"><label>Sunday Hours</label><input id="si_hours_sun" value="${shopInfo.openingHours.sunday}" /></div>
    <button class="btn-save" onclick="saveShopInfoData()">💾 Save Shop Info</button>
  </div>`;
}

function saveShopInfoData() {
  shopInfo = {
    shopName: document.getElementById('si_name')?.value || 'DISSA SUPER',
    address: document.getElementById('si_address')?.value || '',
    phone: document.getElementById('si_phone')?.value || '',
    whatsapp: document.getElementById('si_whatsapp')?.value || '',
    email: document.getElementById('si_email')?.value || '',
    mapLink: document.getElementById('si_map')?.value || 'https://maps.google.com/',
    aboutText: document.getElementById('si_about')?.value || '',
    aboutText2: document.getElementById('si_about2')?.value || '',
    openingHours: { 
      weekdays: document.getElementById('si_hours_week')?.value || '', 
      saturday: document.getElementById('si_hours_sat')?.value || '', 
      sunday: document.getElementById('si_hours_sun')?.value || '' 
    }
  };
  saveShopInfo(); 
  showToast('✅ Shop info updated!');
  addNotification('🏪 Shop information has been updated');
}

// ==================== CHATBOT ====================
const QUICK_QUESTIONS = ['What vegetables do you have?', 'Is delivery available?', 'How much is delivery?', 'Today\'s fresh items?', 'How do I place an order?', 'Do you have promo codes?'];

function toggleChat() { 
  chatOpen = !chatOpen; 
  const w = document.getElementById('chatWindow');
  const f = document.getElementById('chatFab');
  if (w) w.classList.toggle('open', chatOpen); 
  if (f) f.innerHTML = chatOpen ? '✕' : '🤖'; 
  if (chatOpen && document.getElementById('chatMsgs')?.children.length === 0) { 
    botMsg('👋 Welcome to DISSA SUPER! I can help with products, delivery, orders, and promo codes!'); 
    renderQuickChips(); 
  } 
}

function renderQuickChips() { 
  const chips = document.getElementById('quickChips');
  if (chips) {
    chips.innerHTML = QUICK_QUESTIONS.map(q => `<button class="qchip" onclick="sendQuick('${q.replace(/'/g, "\\'")}')">${q}</button>`).join('');
  }
}

function sendQuick(q) { 
  const chips = document.getElementById('quickChips');
  if (chips) chips.innerHTML = ''; 
  const inp = document.getElementById('chatInp');
  if (inp) inp.value = q; 
  sendChat(); 
}

function botMsg(text) { 
  const msgs = document.getElementById('chatMsgs'); 
  if (!msgs) return; 
  const d = document.createElement('div'); 
  d.className = 'cmsg bot'; 
  d.innerHTML = `<div class="cbubble">${text}</div><div class="chat-time">${timeNow()}</div>`; 
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

function sendChat() {
  const inp = document.getElementById('chatInp');
  if (!inp) return;
  const text = inp.value.trim();
  if (!text) return;
  inp.value = '';
  const chips = document.getElementById('quickChips');
  if (chips) chips.innerHTML = '';
  userMsg(text);
  showTyping();
  setTimeout(() => {
    hideTyping();
    let reply = '';
    const lowerText = text.toLowerCase();
    if (lowerText.includes('vegetable')) reply = '🥦 We have fresh Tomatoes, Carrots, Broccoli, Cabbage, and Cucumber! Would you like prices?';
    else if (lowerText.includes('delivery')) reply = deliveryEnabled ? '🚚 Delivery is available! LKR 200 flat fee, FREE over LKR 3000.' : '⏸ Delivery is currently unavailable. Please choose Store Pickup.';
    else if (lowerText.includes('promo')) reply = '🎁 Use codes: DISSA10 (10% off), FRESH20 (20% off), or WELCOME (15% off)!';
    else if (lowerText.includes('fresh')) reply = '🥬 Fresh Today: Mangoes, Broccoli, Tomatoes, Cucumber, and Bread!';
    else if (lowerText.includes('order')) reply = '🛒 To order: Browse products → Add to cart → Click cart icon → Checkout → Enter details → Place order!';
    else reply = '👋 I can help with products, delivery, orders, and promo codes! What would you like to know?';
    botMsg(reply);
  }, 800);
}

// ==================== PRODUCT DETAIL ====================
function showProductDetail(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const inWishlist = wishlist.some(w => w.id === id);
  const hasDiscount = p.originalPrice && p.originalPrice > p.price;
  
  let imageHtml = '';
  if (p.imageUrl && p.imageUrl.trim() !== '' && p.imageUrl.startsWith('http')) {
    imageHtml = `<img src="${p.imageUrl}" style="max-width:150px;margin:0 auto;border-radius:12px;display:block;" onerror="this.style.display='none';this.after('❌ Image not available')" />`;
  } else {
    imageHtml = `<div style="font-size:64px;text-align:center">${p.emoji}</div>`;
  }
  
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.style.display = 'flex';
  modal.style.opacity = '1';
  modal.style.pointerEvents = 'all';
  modal.innerHTML = `<div class="modal" style="max-width:500px">
    <div class="modal-head"><h2>${escapeHtml(p.name)}</h2><button class="close-x" onclick="this.closest('.modal-overlay').remove()">✕</button></div>
    <div class="modal-body">
      ${imageHtml}
      <p><strong>Price:</strong> <span style="color:var(--green);font-weight:800">${lkr(p.price)}</span>${hasDiscount ? ` <span style="text-decoration:line-through">${lkr(p.originalPrice)}</span>` : ''}</p>
      <p><strong>Unit:</strong> ${p.unit}</p>
      <p><strong>Stock:</strong> ${p.stock === 0 ? 'Out of stock' : p.stock + '% available'}</p>
      <p><strong>Category:</strong> ${p.category}</p>
      ${p.badge ? `<p><strong>Badge:</strong> ${p.badge}</p>` : ''}
      <div style="margin-top:24px;display:flex;gap:12px">
        ${p.stock > 0 ? `<button class="btn-hero-primary" style="flex:1" onclick="addToCart(${p.id}); this.closest('.modal-overlay').remove()">🛒 Add to Cart</button>` : ''}
        <button class="btn-hero-secondary" style="flex:1" onclick="toggleWishlist(${p.id}); this.closest('.modal-overlay').remove()">${inWishlist ? '❤️ Remove' : '🤍 Add to Wishlist'}</button>
      </div>
    </div>
  </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

// ==================== SCROLL ====================
function scrollToSection(sectionId) { 
  const section = document.getElementById(sectionId); 
  if (section) section.scrollIntoView({ behavior: 'smooth' }); 
}

window.addEventListener('scroll', () => { 
  const btn = document.getElementById('backTop'); 
  if (btn) { 
    if (window.scrollY > 400) btn.classList.add('visible'); 
    else btn.classList.remove('visible'); 
  } 
});

// ==================== INITIALIZE ====================
function init() {
  const savedNotif = localStorage.getItem('dissaNotifications');
  if (savedNotif) NOTIFICATIONS = JSON.parse(savedNotif);
  
  // Load fresh products from storage
  loadProductsFromStorage();
  
  renderCats(); 
  renderProducts(); 
  renderFreshStrip(); 
  renderNotifications(); 
  updateShopInfoDisplay();
  
  const heroOrder = document.getElementById('heroOrderCount');
  if (heroOrder) heroOrder.textContent = orders.length + ' Orders';
  const heroProduct = document.getElementById('heroProductCount');
  if (heroProduct) heroProduct.textContent = products.length;
  
  setTimeout(() => { 
    const dot = document.getElementById('notifDot'); 
    if (dot && NOTIFICATIONS.some(n => !n.read)) dot.style.display = 'block'; 
  }, 2000);
}

// Global exports
window.scrollToSection = scrollToSection;
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
window.saveShopInfoData = saveShopInfoData;

document.addEventListener('DOMContentLoaded', init);
