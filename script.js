/* DISSA SUPER - COMPLETE FIXED VERSION */
/* Image URL Support + Fixed Admin + Limited Notifications */

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
  address: '123 Main Street, Colombo 7, Sri Lanka',
  phone: '+94 11 234 5678',
  whatsapp: '+94 77 123 4567',
  email: 'hello@dissasuper.lk',
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

// Notifications - LIMITED TO LAST 5
let NOTIFICATIONS = JSON.parse(localStorage.getItem('dissaNotifications') || 'null') || [
  { id: 1, text: '🎁 Use code DISSA10 for 10% off!', time: '2 min ago', read: false },
  { id: 2, text: '🥭 Mangoes just restocked — limited qty!', time: '15 min ago', read: false },
  { id: 3, text: '🚚 Orders before 2 PM get same-day delivery', time: '1 hr ago', read: false },
];

// ==================== DEFAULT DATA ====================
function getDefaultProducts() {
  return [
    { id: 1, name: 'Fresh Tomatoes', category: 'Vegetables', price: 120, originalPrice: 150, unit: '500g', imageUrl: '', emoji: '🍅', badge: 'Fresh', stock: 85 },
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
  // Keep only last 5 notifications
  NOTIFICATIONS = NOTIFICATIONS.slice(0, 5);
  localStorage.setItem('dissaNotifications', JSON.stringify(NOTIFICATIONS)); 
}

function updateShopInfoDisplay() {
  const els = ['addressDisplay', 'addressDisplay2', 'phoneDisplay', 'whatsappDisplay', 'emailDisplay', 'aboutText', 'aboutText2', 'hoursWeekday', 'hoursSat', 'hoursSun'];
  const values = [shopInfo.address, shopInfo.address, shopInfo.phone, shopInfo.whatsapp, shopInfo.email, shopInfo.aboutText, shopInfo.aboutText2, shopInfo.openingHours.weekdays, shopInfo.openingHours.saturday, shopInfo.openingHours.sunday];
  els.forEach((id, i) => { const el = document.getElementById(id); if (el) el.textContent = values[i]; });
}

// Add notification with limit
function addNotification(text) {
  NOTIFICATIONS.unshift({ id: Date.now(), text: text, time: 'Just now', read: false });
  // Keep only last 5
  if (NOTIFICATIONS.length > 5) NOTIFICATIONS.pop();
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
 
