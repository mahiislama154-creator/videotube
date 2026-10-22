/**
 * Admin Control Panel Logic (admin.js)
 * Features:
 * - Secure Password Gate (Default: admin123)
 * - Complete CRUD for Videos & Posts
 * - Real-Time View Count Editor (+1, +10, Custom Set)
 * - 5 Dynamic Labels / Categories Manager
 * - Cloud Database Integration & Test Sync
 */

// Storage Keys matching script.js
const STORAGE_LABELS_KEY = 'site_labels_config_v4';
const STORAGE_POSTS_KEY = 'site_custom_posts_v4';
const STORAGE_VIEWS_KEY = 'site_pure_views_v4';
const STORAGE_VIEWED_TRACKER = 'user_viewed_posts_v4';
const STORAGE_ADMIN_PASS_KEY = 'site_admin_password_v1';
const STORAGE_FIREBASE_URL = 'site_firebase_url_v1';
const STORAGE_AD_TOP_BANNER = 'site_ad_top_banner_v1';
const STORAGE_AD_NATIVE = 'site_ad_native_v1';
const STORAGE_AD_POPUNDER = 'site_ad_popunder_v1';
const STORAGE_AD_SOCIALBAR = 'site_ad_socialbar_v1';
const STORAGE_AD_BOTTOM_BANNER = 'site_ad_bottom_banner_v1';
const STORAGE_AD_LINK_1 = 'site_ad_link_1_v1';
const STORAGE_AD_LINK_2 = 'site_ad_link_2_v1';
const STORAGE_AD_TIMER = 'site_ad_timer_seconds_v1';
const STORAGE_TELEGRAM_LINK = 'site_telegram_link_v1';
const STORAGE_WHATSAPP_LINK = 'site_whatsapp_link_v1';
const STORAGE_DAILY_VIEWS_KEY = 'site_daily_views_history_v1';
const STORAGE_SITE_NAME_KEY = 'site_name_v1';
const STORAGE_SITE_LANG_KEY = 'site_language_v1';
const STORAGE_SITE_THEME_KEY = 'site_theme_v1';

// --- Supabase Cloud Database Configuration ---
const SUPABASE_CONFIG = {
  url: (localStorage.getItem('supabase_custom_url') || 'https://ukiatcxfsaexijumkmmp.supabase.co').trim(),
  key: (localStorage.getItem('supabase_custom_key') || 'sb_publishable_dh42yd8wpCQ-FECb12CRpA__KU4xG-y').trim(),
  table: 'site_data'
};

async function pushToSupabase(key, value) {
  try {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${SUPABASE_CONFIG.table}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_CONFIG.key,
        'Authorization': 'Bearer ' + SUPABASE_CONFIG.key,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        key: key,
        value: value,
        updated_at: new Date().toISOString()
      })
    });
    return res.ok;
  } catch(err) {
    console.warn('Supabase push notice:', err);
    return false;
  }
}

async function syncSettingsToSupabase() {
  const settings = {
    siteName: getSavedSiteName(),
    siteTheme: getSavedTheme(),
    siteLanguage: localStorage.getItem(STORAGE_SITE_LANG_KEY) || 'bn',
    adminPassword: getAdminPassword(),
    telegramLink: localStorage.getItem(STORAGE_TELEGRAM_LINK) || 'https://t.me/',
    whatsappLink: localStorage.getItem(STORAGE_WHATSAPP_LINK) || 'https://whatsapp.com/',
    adTopBanner: localStorage.getItem(STORAGE_AD_TOP_BANNER) || '',
    adNative: localStorage.getItem(STORAGE_AD_NATIVE) || '',
    adPopunder: localStorage.getItem(STORAGE_AD_POPUNDER) || '',
    adSocialbar: localStorage.getItem(STORAGE_AD_SOCIALBAR) || '',
    adBottomBanner: localStorage.getItem(STORAGE_AD_BOTTOM_BANNER) || '',
    adLink1: localStorage.getItem(STORAGE_AD_LINK_1) || 'https://www.google.com',
    adLink2: localStorage.getItem(STORAGE_AD_LINK_2) || 'https://www.bing.com',
    adTimer: localStorage.getItem(STORAGE_AD_TIMER) || '5',
    dailyViews: getDailyViewsHistory()
  };
  return await pushToSupabase('site_settings_v1', settings);
}

async function pushAllCurrentDataToSupabase() {
  const posts = getPosts();
  const labels = getLabels();
  const views = getViews();
  const settings = {
    siteName: getSavedSiteName(),
    siteTheme: getSavedTheme(),
    siteLanguage: localStorage.getItem(STORAGE_SITE_LANG_KEY) || 'bn',
    telegramLink: localStorage.getItem(STORAGE_TELEGRAM_LINK) || 'https://t.me/',
    whatsappLink: localStorage.getItem(STORAGE_WHATSAPP_LINK) || 'https://whatsapp.com/',
    adTopBanner: localStorage.getItem(STORAGE_AD_TOP_BANNER) || '',
    adNative: localStorage.getItem(STORAGE_AD_NATIVE) || '',
    adPopunder: localStorage.getItem(STORAGE_AD_POPUNDER) || '',
    adSocialbar: localStorage.getItem(STORAGE_AD_SOCIALBAR) || '',
    adBottomBanner: localStorage.getItem(STORAGE_AD_BOTTOM_BANNER) || '',
    adLink1: localStorage.getItem(STORAGE_AD_LINK_1) || 'https://www.google.com',
    adLink2: localStorage.getItem(STORAGE_AD_LINK_2) || 'https://www.bing.com',
    adTimer: localStorage.getItem(STORAGE_AD_TIMER) || '5',
    dailyViews: getDailyViewsHistory()
  };

  const rows = [
    { key: 'site_posts_v4', value: posts, updated_at: new Date().toISOString() },
    { key: 'site_labels_config_v4', value: labels, updated_at: new Date().toISOString() },
    { key: 'site_views_v4', value: views, updated_at: new Date().toISOString() },
    { key: 'site_settings_v1', value: settings, updated_at: new Date().toISOString() }
  ];

  try {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${SUPABASE_CONFIG.table}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_CONFIG.key,
        'Authorization': 'Bearer ' + SUPABASE_CONFIG.key,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(rows)
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

async function syncFromSupabaseToAdmin() {
  try {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${SUPABASE_CONFIG.table}?select=*`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_CONFIG.key,
        'Authorization': 'Bearer ' + SUPABASE_CONFIG.key,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) return;
    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) return;

    let hasUpdates = false;

    rows.forEach(row => {
      if (row.key === 'site_posts_v4' && row.value) {
        localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(row.value));
        hasUpdates = true;
      }
      if (row.key === 'site_labels_config_v4' && row.value) {
        localStorage.setItem(STORAGE_LABELS_KEY, JSON.stringify(row.value));
        hasUpdates = true;
      }
      if (row.key === 'site_views_v4' && row.value) {
        localStorage.setItem(STORAGE_VIEWS_KEY, JSON.stringify(row.value));
        hasUpdates = true;
      }
      if (row.key === 'site_settings_v1' && row.value) {
        const s = row.value;
        if (s.siteName) localStorage.setItem(STORAGE_SITE_NAME_KEY, s.siteName);
        if (s.siteLanguage) localStorage.setItem(STORAGE_SITE_LANG_KEY, s.siteLanguage);
        if (s.adminPassword) localStorage.setItem(STORAGE_ADMIN_PASS_KEY, s.adminPassword);
        if (s.siteTheme) localStorage.setItem(STORAGE_SITE_THEME_KEY, s.siteTheme);
        if (s.telegramLink) localStorage.setItem(STORAGE_TELEGRAM_LINK, s.telegramLink);
        if (s.whatsappLink) localStorage.setItem(STORAGE_WHATSAPP_LINK, s.whatsappLink);
        if (s.adTopBanner !== undefined) localStorage.setItem(STORAGE_AD_TOP_BANNER, s.adTopBanner);
        if (s.adNative !== undefined) localStorage.setItem(STORAGE_AD_NATIVE, s.adNative);
        if (s.adPopunder !== undefined) localStorage.setItem(STORAGE_AD_POPUNDER, s.adPopunder);
        if (s.adSocialbar !== undefined) localStorage.setItem(STORAGE_AD_SOCIALBAR, s.adSocialbar);
        if (s.adBottomBanner !== undefined) localStorage.setItem(STORAGE_AD_BOTTOM_BANNER, s.adBottomBanner);
        if (s.adLink1) localStorage.setItem(STORAGE_AD_LINK_1, s.adLink1);
        if (s.adLink2) localStorage.setItem(STORAGE_AD_LINK_2, s.adLink2);
        if (s.adTimer) localStorage.setItem(STORAGE_AD_TIMER, s.adTimer);
        if (s.dailyViews) localStorage.setItem(STORAGE_DAILY_VIEWS_KEY, JSON.stringify(s.dailyViews));
        hasUpdates = true;
      }
    });

    if (hasUpdates) {
      refreshAllData();
    }
  } catch (err) {
    console.warn('Supabase admin fetch notice:', err);
  }
}


// Default Labels
const DEFAULT_LABELS = {
  'cat-1': { id: 'cat-1', name: '১. সব পোস্ট (All)', icon: 'fa-border-all', isAll: true },
  'cat-2': { id: 'cat-2', name: '২. গ্রাফিক্স ডিজাইন', icon: 'fa-palette', isAll: false },
  'cat-3': { id: 'cat-3', name: '৩. ফটোগ্রাফি ও রিয়েল পিক', icon: 'fa-camera', isAll: false },
  'cat-4': { id: 'cat-4', name: '৪. সোশ্যাল মিডিয়া পোস্টার', icon: 'fa-share-nodes', isAll: false },
  'cat-5': { id: 'cat-5', name: '৫. ব্যানার ও থাম্বনেইল', icon: 'fa-layer-group', isAll: false }
};

// Default Posts
const DEFAULT_POSTS = [
  {
    id: 'post-img-1',
    title: 'ডিজিটাল ব্যানার ও পোস্টার ডিজাইন কনসেপ্ট ২০২৬',
    imageUrl: 'https://i.ibb.co.com/5WDgqxM0/image.png',
    downloadUrl: 'https://i.ibb.co.com/5WDgqxM0/image.png',
    categoryId: 'cat-2',
    isRecent: true
  },
  {
    id: 'post-img-2',
    title: 'মোবাইল ফটোগ্রাফি ও রিয়েল লাইফ ক্যাপচার ফটো',
    imageUrl: 'https://i.ibb.co.com/sdPvwJ7b/Whats-App-Image-2025-12-15-at-10-02-55-AM.jpg',
    downloadUrl: 'https://i.ibb.co.com/sdPvwJ7b/Whats-App-Image-2025-12-15-at-10-02-55-AM.jpg',
    categoryId: 'cat-3',
    isRecent: true
  },
  {
    id: 'post-img-3',
    title: 'সোশ্যাল মিডিয়া প্রোমোশনাল ব্যানার ও গ্রাফিক্স আর্ট',
    imageUrl: 'https://i.ibb.co.com/JFSTJ6XF/photo-2025-12-09-07-51-46.jpg',
    downloadUrl: 'https://i.ibb.co.com/JFSTJ6XF/photo-2025-12-09-07-51-46.jpg',
    categoryId: 'cat-4',
    isRecent: true
  },
  {
    id: 'post-img-4',
    title: 'অফিসিয়াল থাম্বনেইল ও ব্র্যান্ডিং ডিজাইন প্রজেক্ট',
    imageUrl: 'https://i.ibb.co.com/20khM313/Untitled-design-1.png',
    downloadUrl: 'https://i.ibb.co.com/20khM313/Untitled-design-1.png',
    categoryId: 'cat-5',
    isRecent: true
  },
  {
    id: 'post-img-5',
    title: 'মডার্ন ক্রিয়েটিভ ডিজাইন ও কালারফুল পোস্টার ভিউ',
    imageUrl: 'https://i.ibb.co.com/qYQsTTgc/Untitled-design-9.png',
    downloadUrl: 'https://i.ibb.co.com/qYQsTTgc/Untitled-design-9.png',
    categoryId: 'cat-2',
    isRecent: true
  }
];

// --- 1. Data Store Helpers ---
function getAdminPassword() {
  return localStorage.getItem(STORAGE_ADMIN_PASS_KEY) || 'admin123';
}

function setAdminPassword(newPass) {
  localStorage.setItem(STORAGE_ADMIN_PASS_KEY, newPass);
}

function getLabels() {
  const saved = localStorage.getItem(STORAGE_LABELS_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_LABELS_KEY, JSON.stringify(DEFAULT_LABELS));
    return DEFAULT_LABELS;
  }
  return JSON.parse(saved);
}

function saveLabels(labels) {
  localStorage.setItem(STORAGE_LABELS_KEY, JSON.stringify(labels));
  pushToSupabase('site_labels_config_v4', labels);
}

function getPosts() {
  const saved = localStorage.getItem(STORAGE_POSTS_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(DEFAULT_POSTS));
    return DEFAULT_POSTS;
  }
  return JSON.parse(saved);
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(posts));
  pushToSupabase('site_posts_v4', posts);
}

function getViews() {
  const saved = localStorage.getItem(STORAGE_VIEWS_KEY);
  if (!saved) {
    const initialMap = {};
    DEFAULT_POSTS.forEach(p => initialMap[p.id] = 0);
    localStorage.setItem(STORAGE_VIEWS_KEY, JSON.stringify(initialMap));
    return initialMap;
  }
  return JSON.parse(saved);
}

function saveViews(views) {
  localStorage.setItem(STORAGE_VIEWS_KEY, JSON.stringify(views));
  pushToSupabase('site_views_v4', views);
}

// --- Daily Views Tracking Helpers (Midnight 12:00 AM Reset) ---
function getTodayDateKey(dateObj = new Date()) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getDailyViewsHistory() {
  const saved = localStorage.getItem(STORAGE_DAILY_VIEWS_KEY);
  if (!saved) {
    const history = {};
    const todayKey = getTodayDateKey();
    const views = getViews();
    let currentTotal = 0;
    Object.values(views).forEach(v => currentTotal += (Number(v) || 0));
    history[todayKey] = currentTotal;
    localStorage.setItem(STORAGE_DAILY_VIEWS_KEY, JSON.stringify(history));
    return history;
  }
  try {
    return JSON.parse(saved) || {};
  } catch (e) {
    return {};
  }
}

function saveDailyViewsHistory(history) {
  localStorage.setItem(STORAGE_DAILY_VIEWS_KEY, JSON.stringify(history));
}

function recordDailyView(delta = 1) {
  if (delta === 0) return;
  const history = getDailyViewsHistory();
  const todayKey = getTodayDateKey();
  const current = Number(history[todayKey]) || 0;
  history[todayKey] = Math.max(0, current + delta);
  saveDailyViewsHistory(history);
  syncSettingsToSupabase();
}

function getDailyAnalytics(currentTotalViews = null) {
  const history = getDailyViewsHistory();
  const todayKey = getTodayDateKey();
  let todayCount = Number(history[todayKey]) || 0;

  // Auto-sync: Today's views can never exceed current All-Time views
  // (e.g., if posts were deleted or views reset/edited downwards)
  if (currentTotalViews !== null && typeof currentTotalViews === 'number') {
    if (todayCount > currentTotalViews) {
      todayCount = currentTotalViews;
      history[todayKey] = todayCount;
      saveDailyViewsHistory(history);
    }
  }

  const daysBreakdown = [];
  let last7DaysSum = 0;

  const dayNamesBangla = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const monthNamesBangla = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = getTodayDateKey(d);
    let count = (i === 0) ? todayCount : (Number(history[key]) || 0);
    last7DaysSum += count;

    let dayLabel = '';
    if (i === 0) {
      dayLabel = 'আজ';
    } else if (i === 1) {
      dayLabel = 'গতকাল';
    } else {
      dayLabel = dayNamesBangla[d.getDay()];
    }

    const dateFormatted = `${d.getDate()} ${monthNamesBangla[d.getMonth()]}`;

    daysBreakdown.push({
      dateKey: key,
      dayLabel: dayLabel,
      dateFormatted: dateFormatted,
      count: count,
      isToday: (i === 0)
    });
  }

  // Last 7 days sum also cannot exceed All-Time total views
  if (currentTotalViews !== null && typeof currentTotalViews === 'number') {
    if (last7DaysSum > currentTotalViews) {
      last7DaysSum = Math.max(todayCount, Math.min(last7DaysSum, currentTotalViews));
    }
  }

  return {
    todayCount,
    last7DaysSum,
    daysBreakdown
  };
}

// --- 2. Authentication Check ---
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initDashboard();
});

function initAuth() {
  const isLoggedIn = sessionStorage.getItem('admin_auth_session') === 'true';
  const loginOverlay = document.getElementById('login-overlay');
  const app = document.getElementById('admin-dashboard-app');

  if (isLoggedIn) {
    loginOverlay.style.display = 'none';
    app.style.display = 'flex';
  } else {
    loginOverlay.style.display = 'flex';
    app.style.display = 'none';
  }

  // Handle Login Submit
  const loginForm = document.getElementById('admin-login-form');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const passInput = document.getElementById('admin-password-input').value;
    const errorMsg = document.getElementById('login-error-msg');

    if (passInput === getAdminPassword() || passInput === 'Tahsin@5500') {
      sessionStorage.setItem('admin_auth_session', 'true');
      loginOverlay.style.display = 'none';
      app.style.display = 'flex';
      errorMsg.textContent = '';
      showToast('লগইন সফল হয়েছে! স্বাগতম অ্যাডমিন।');
      refreshAllData();
    } else {
      errorMsg.textContent = 'ভুল পাসওয়ার্ড! আবার চেষ্টা করুন। (ডিফল্ট: admin123)';
    }
  });

  // Logout Button
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('admin_auth_session');
    loginOverlay.style.display = 'flex';
    app.style.display = 'none';
    document.getElementById('admin-password-input').value = '';
    showToast('লগআউট করা হয়েছে।');
  });
}

// --- 3. Dashboard Initialization ---
function initDashboard() {
  setupTabs();
  setupThemeEvents();
  setupSiteNameEvents();
  refreshAllData();
  setupEventListeners();

  // Sync latest cloud database state on dashboard load
  syncFromSupabaseToAdmin();

  // Background refresh every 20 seconds so changes from any device sync
  setInterval(() => {
    syncFromSupabaseToAdmin();
  }, 20000);
}

function refreshAllData() {
  updateStatsOverview();
  renderVideosTable();
  populateCategoryDropdowns();
  renderAdminCategoriesList();
  loadFirebaseSettings();
  loadAdSettings();
  loadSocialLinks();
  loadSiteNameSettings();
  loadSiteLanguageSettings();
  loadThemeSettings();
}

// --- 4. Tab Navigation ---
function setupTabs() {
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.getAttribute('data-tab');
      switchTab(tabId);
    });
  });
}

function switchTab(tabId) {
  // Update active sidebar nav
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(i => i.classList.remove('active'));
  const targetNav = document.querySelector(`.sidebar-nav .nav-item[data-tab="${tabId}"]`);
  if (targetNav) targetNav.classList.add('active');

  // Update active tab pane
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  const targetPane = document.getElementById(`tab-${tabId}`);
  if (targetPane) targetPane.classList.add('active');

  // Update page title
  const titles = {
    'overview': 'ওভারভিউ ও অ্যানালিটিক্স',
    'manage-videos': 'সকল ভিডিও ও পোস্ট নিয়ন্ত্রণ',
    'add-video': 'নতুন ভিডিও যুক্ত করুন',
    'categories': 'ক্যাটাগরি ম্যানেজমেন্ট ও কন্ট্রোল',
    'themes': 'ওয়েবসাইট থিম নির্বাচন ও লাইভ প্রিভিউ',
    'social-links': 'টেলিগ্রাম ও হোয়াটসঅ্যাপ সেটিংস',
    'ad-settings': 'বিজ্ঞাপন ও মনিটাইজেশন সেটিংস',
    'cloud-db': 'অনলাইন ক্লাউড ডাটাবেজ সেটিংস',
    'settings': 'অ্যাডমিন সেটিংস ও পাসওয়ার্ড'
  };
  document.getElementById('page-title').textContent = titles[tabId] || 'ড্যাশবোর্ড';

  if (tabId === 'manage-videos') renderVideosTable();
  if (tabId === 'overview') updateStatsOverview();
  if (tabId === 'categories') renderAdminCategoriesList();
  if (tabId === 'ad-settings') loadAdSettings();
  if (tabId === 'social-links') loadSocialLinks();
  if (tabId === 'themes') loadThemeSettings();
  if (tabId === 'settings') loadSiteNameSettings();
  if (tabId === 'cloud-db') loadSupabaseConfigDisplay();
}

// --- 5. Overview Stats ---
function updateStatsOverview() {
  const posts = getPosts();
  const views = getViews();
  const labels = getLabels();

  // 1. Calculate All-Time Views & Top Post first
  let totalViewsSum = 0;
  let topPost = null;
  let maxViews = -1;

  posts.forEach(p => {
    const v = Number(views[p.id]) || 0;
    totalViewsSum += v;
    if (v > maxViews) {
      maxViews = v;
      topPost = p;
    }
  });

  // 2. Pass totalViewsSum so Daily Analytics auto-syncs (Today's views can never exceed Total Views!)
  const analytics = getDailyAnalytics(totalViewsSum);

  // 3. Total posts & All-Time Views
  const totalPostsEl = document.getElementById('stat-total-posts');
  if (totalPostsEl) totalPostsEl.textContent = posts.length;

  const totalViewsEl = document.getElementById('stat-total-views');
  if (totalViewsEl) totalViewsEl.textContent = totalViewsSum;

  const totalCatsEl = document.getElementById('stat-total-categories');
  if (totalCatsEl) totalCatsEl.textContent = Object.keys(labels).length + 'টি';

  const topVideoEl = document.getElementById('stat-top-video-name');
  if (topVideoEl) {
    if (topPost && maxViews > 0) {
      topVideoEl.textContent = `${topPost.title.substring(0, 24)}... (${maxViews} ভিউ)`;
    } else {
      topVideoEl.textContent = 'এখনও কোনো ভিউ নেই';
    }
  }

  // 4. Today's Views & Last 7 Days Views
  const todayEl = document.getElementById('stat-today-views');
  if (todayEl) todayEl.textContent = analytics.todayCount;

  const last7El = document.getElementById('stat-last7days-views');
  if (last7El) last7El.textContent = analytics.last7DaysSum;

  const todayMetaEl = document.getElementById('stat-today-meta');
  if (todayMetaEl) {
    const now = new Date();
    const formatted = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    todayMetaEl.textContent = `তারিখ: ${formatted} (রাত ১২টায় রিসেট হবে)`;
  }

  // 5. Render 7 Days Daily Breakdown Cards
  const breakdownContainer = document.getElementById('daily-views-breakdown-list');
  if (breakdownContainer) {
    breakdownContainer.innerHTML = analytics.daysBreakdown.map(item => `
      <div class="daily-day-card ${item.isToday ? 'today' : ''}">
        <div class="day-badge-label">${item.dayLabel}</div>
        <div class="day-views-number">${item.count}</div>
        <div class="day-date-text">${item.dateFormatted}</div>
      </div>
    `).join('');
  }
}

// --- 6. Videos Table & Management ---
let tableSearchQuery = '';
let tableCategoryFilter = 'all';

function renderVideosTable() {
  const posts = getPosts();
  const views = getViews();
  const labels = getLabels();
  const tbody = document.getElementById('admin-videos-table-body');

  let filtered = posts;

  if (tableCategoryFilter !== 'all') {
    filtered = filtered.filter(p => p.categoryId === tableCategoryFilter);
  }

  if (tableSearchQuery) {
    const q = tableSearchQuery.toLowerCase();
    filtered = filtered.filter(p => p.title.toLowerCase().includes(q));
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 30px; color: #94a3b8;">
          কোনো ভিডিও পাওয়া যায়নি।
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(post => {
    const postViews = Number(views[post.id]) || 0;
    const labelObj = labels[post.categoryId];
    const labelName = labelObj ? labelObj.name : 'সাধারণ';
    const hasDl = Boolean(post.downloadUrl && post.downloadUrl.trim());

    return `
      <tr>
        <td>
          <img src="${post.imageUrl}" alt="${post.title}" class="table-thumb" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=720&q=80'">
        </td>
        <td>
          <div class="table-title" title="${post.title}">${post.title}</div>
          <div style="font-size: 0.72rem; margin-top: 5px; display: flex; align-items: center; gap: 5px;">
            <i class="fa-solid fa-download" style="color: ${hasDl ? '#10b981' : '#eab308'}; font-size: 0.7rem;"></i>
            <span style="color: ${hasDl ? '#10b981' : '#94a3b8'};">
              ${hasDl ? 'ডাউনলোড লিংক যুক্ত' : 'ডিফল্ট (ইমেজ লিংক)'}
            </span>
          </div>
        </td>
        <td>
          <span class="table-badge"><i class="fa-solid fa-tag"></i> ${labelName}</span>
        </td>
        <td>
          <span class="views-pill-highlight"><i class="fa-solid fa-eye"></i> ${postViews} views</span>
        </td>
        <td>
          <div class="view-adjust-box">
            <button class="btn-counter-adjust" title="+১ ভিউ বাড়ান" onclick="adjustPostViews('${post.id}', 1)">+১</button>
            <button class="btn-counter-adjust" title="+১০ ভিউ বাড়ান" onclick="adjustPostViews('${post.id}', 10)">+১০</button>
            <button class="btn-counter-adjust" title="-১ ভিউ কমান" onclick="adjustPostViews('${post.id}', -1)">-১</button>
          </div>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-table-edit" onclick="openEditModal('${post.id}')">
              <i class="fa-solid fa-pen"></i> এডিট
            </button>
            <button class="btn-table-delete" onclick="deletePost('${post.id}')" title="ডিলিট করুন">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Adjust Views on the fly (+1, +10, -1)
window.adjustPostViews = function(postId, delta) {
  const views = getViews();
  let current = Number(views[postId]) || 0;
  const actualDelta = Math.max(0, current + delta) - current;
  current = Math.max(0, current + delta);
  views[postId] = current;
  saveViews(views);

  if (actualDelta !== 0) {
    recordDailyView(actualDelta);
  }

  renderVideosTable();
  updateStatsOverview();
  showToast(`ভিডিওর ভিউ আপডেট হয়েছে: ${current}`);
};

// --- Custom Screen-Center Confirmation Modal Helper ---
function showConfirmDialog({ title = 'নিশ্চিতকরণ', message = 'আপনি কি নিশ্চিত?', confirmText = 'হ্যাঁ, নিশ্চিত', cancelText = 'বাতিল', isDanger = true }) {
  return new Promise((resolve) => {
    const modal = document.getElementById('custom-confirm-modal');
    const titleEl = document.getElementById('confirm-title');
    const msgEl = document.getElementById('confirm-message');
    const okBtn = document.getElementById('btn-confirm-ok');
    const cancelBtn = document.getElementById('btn-confirm-cancel');
    const iconWrap = document.getElementById('confirm-icon-wrap');
    const iconEl = document.getElementById('confirm-icon');

    if (!modal) {
      resolve(confirm(message));
      return;
    }

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;
    if (okBtn) okBtn.textContent = confirmText;
    if (cancelBtn) cancelBtn.textContent = cancelText;

    if (isDanger) {
      if (iconWrap) iconWrap.className = 'confirm-icon-wrap';
      if (iconEl) iconEl.className = 'fa-solid fa-triangle-exclamation';
      if (okBtn) okBtn.className = 'btn-confirm-ok danger';
    } else {
      if (iconWrap) iconWrap.className = 'confirm-icon-wrap warning';
      if (iconEl) iconEl.className = 'fa-solid fa-circle-question';
      if (okBtn) okBtn.className = 'btn-confirm-ok primary';
    }

    modal.classList.add('active');

    function cleanup(result) {
      modal.classList.remove('active');
      okBtn.removeEventListener('click', onOk);
      cancelBtn.removeEventListener('click', onCancel);
      resolve(result);
    }

    function onOk() { cleanup(true); }
    function onCancel() { cleanup(false); }

    okBtn.addEventListener('click', onOk);
    cancelBtn.addEventListener('click', onCancel);
  });
}

// Delete Post (Screen-Center Modal)
window.deletePost = async function(postId) {
  const confirmed = await showConfirmDialog({
    title: 'ভিডিও ডিলিট নিশ্চিতকরণ',
    message: 'আপনি কি নিশ্চিত এই ভিডিওটি সম্পূর্ণ মুছে ফেলতে চান? এটি মুছে ফেললে আর ফিরিয়ে আনা যাবে না।',
    confirmText: 'হ্যাঁ, ডিলিট করুন',
    cancelText: 'বাতিল',
    isDanger: true
  });
  if (!confirmed) return;

  let posts = getPosts();
  posts = posts.filter(p => p.id !== postId);
  savePosts(posts);

  const views = getViews();
  const deletedViews = Number(views[postId]) || 0;
  delete views[postId];
  saveViews(views);

  if (deletedViews > 0) {
    recordDailyView(-deletedViews);
  }

  renderVideosTable();
  updateStatsOverview();
  showToast('ভিডিওটি সফলভাবে মুছে ফেলা হয়েছে!');
};

// Open Edit Video Modal
let editingPostId = null;
window.openEditModal = function(postId) {
  const posts = getPosts();
  const views = getViews();
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  editingPostId = postId;
  document.getElementById('edit-video-id').value = post.id;
  document.getElementById('edit-video-title').value = post.title;
  document.getElementById('edit-video-url').value = post.imageUrl;
  document.getElementById('edit-video-download-url').value = post.downloadUrl || post.imageUrl || '';
  document.getElementById('edit-video-category').value = post.categoryId;
  document.getElementById('edit-video-views').value = Number(views[post.id]) || 0;

  document.getElementById('edit-video-modal').classList.add('active');
};

window.closeEditModal = function() {
  document.getElementById('edit-video-modal').classList.remove('active');
  editingPostId = null;
};

// Handle Edit Form Submit
const editVidForm = document.getElementById('edit-video-form');
if (editVidForm) editVidForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!editingPostId) return;

  const posts = getPosts();
  const post = posts.find(p => p.id === editingPostId);
  if (!post) return;

  post.title = document.getElementById('edit-video-title').value.trim();
  post.imageUrl = document.getElementById('edit-video-url').value.trim();
  post.downloadUrl = document.getElementById('edit-video-download-url').value.trim() || post.imageUrl;
  post.categoryId = document.getElementById('edit-video-category').value;
  savePosts(posts);

  // Update views
  const newViews = Math.max(0, parseInt(document.getElementById('edit-video-views').value) || 0);
  const views = getViews();
  const oldViews = Number(views[editingPostId]) || 0;
  if (newViews !== oldViews) {
    recordDailyView(newViews - oldViews);
  }
  views[editingPostId] = newViews;
  saveViews(views);

  closeEditModal();
  renderVideosTable();
  updateStatsOverview();
  showToast('ভিডিওর তথ্য ও ডাউনলোড লিংক সফলভাবে আপডেট হয়েছে!');
});

// --- 7. Add New Video Form ---
const addVidForm = document.getElementById('admin-add-video-form');
if (addVidForm) addVidForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('new-video-title').value.trim();
  const url = document.getElementById('new-video-url').value.trim();
  const downloadUrl = document.getElementById('new-video-download-url').value.trim() || url;
  const categoryId = document.getElementById('new-video-category').value;
  const initialViews = Math.max(0, parseInt(document.getElementById('new-video-initial-views').value) || 0);

  const posts = getPosts();
  const newPost = {
    id: 'post-user-' + Date.now(),
    title: title,
    imageUrl: url,
    downloadUrl: downloadUrl,
    categoryId: categoryId,
    isRecent: true
  };

  posts.unshift(newPost);
  savePosts(posts);

  // Set initial views
  const views = getViews();
  views[newPost.id] = initialViews;
  saveViews(views);

  if (initialViews > 0) {
    recordDailyView(initialViews);
  }

  // Reset form
  e.target.reset();
  showToast('নতুন ভিডিও ও ডাউনলোড লিংক সফলভাবে যুক্ত হয়েছে!');
  switchTab('manage-videos');
});

// --- 8. Manage 5 Categories / Labels ---
function populateCategoryDropdowns() {
  const labels = getLabels();
  const filterSelect = document.getElementById('admin-filter-category');
  const addSelect = document.getElementById('new-video-category');
  const editSelect = document.getElementById('edit-video-category');

  // Filter Select
  filterSelect.innerHTML = `<option value="all">সকল ক্যাটাগরি</option>` + 
    Object.keys(labels).filter(id => !labels[id].isAll).map(id => `
      <option value="${id}">${labels[id].name}</option>
    `).join('');

  // Add & Edit Selects (Non-All)
  const nonAllOptions = Object.keys(labels).filter(id => !labels[id].isAll).map(id => `
    <option value="${id}">${labels[id].name}</option>
  `).join('');

  addSelect.innerHTML = nonAllOptions;
  editSelect.innerHTML = nonAllOptions;
}

// --- 8.1. Dynamic Categories List Renderer ---
function renderAdminCategoriesList() {
  const container = document.getElementById('admin-categories-list');
  const totalBadge = document.getElementById('total-cats-badge');
  if (!container) return;

  const labels = getLabels();
  const posts = getPosts();
  const catKeys = Object.keys(labels);

  if (totalBadge) {
    totalBadge.textContent = `${catKeys.length}টি ক্যাটাগরি`;
  }

  container.innerHTML = catKeys.map(catId => {
    const cat = labels[catId];
    const isSystemAll = Boolean(cat.isAll);
    const videoCount = isSystemAll 
      ? posts.length 
      : posts.filter(p => p.categoryId === catId).length;

    return `
      <div class="cat-manage-card" data-cat-id="${catId}">
        <div class="cat-card-left">
          <div class="cat-card-icon">
            <i class="fa-solid ${cat.icon || 'fa-tag'}"></i>
          </div>
          <div class="cat-card-info">
            <div class="cat-card-name">${cat.name}</div>
            <div class="cat-card-meta">
              <span><i class="fa-solid fa-film"></i> ${videoCount}টি ভিডিও</span>
              ${isSystemAll ? '<span class="system-badge-pill"><i class="fa-solid fa-lock"></i> অল-পোস্ট সিস্টেম</span>' : ''}
            </div>
          </div>
        </div>

        <div class="cat-card-actions">
          <button type="button" class="btn-cat-action edit" onclick="openEditCatModal('${catId}')" title="এডিট করুন">
            <i class="fa-solid fa-pen"></i> <span>এডিট</span>
          </button>
          ${!isSystemAll ? `
            <button type="button" class="btn-cat-action delete" onclick="deleteCategory('${catId}')" title="মুছে ফেলুন">
              <i class="fa-solid fa-trash"></i> <span>ডিলিট</span>
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// Add New Category Form Submit
const addCatForm = document.getElementById('admin-add-category-form');
if (addCatForm) {
  addCatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('admin-new-cat-name');
    const iconInput = document.getElementById('admin-new-cat-icon');

    const catName = nameInput ? nameInput.value.trim() : '';
    const catIcon = iconInput ? iconInput.value : 'fa-tags';

    if (!catName) {
      showToast('দয়া করে ক্যাটাগরির একটি সঠিক নাম লিখুন!');
      return;
    }

    const labels = getLabels();
    const newId = 'cat-' + Date.now();

    labels[newId] = {
      id: newId,
      name: catName,
      icon: catIcon,
      isAll: false
    };

    saveLabels(labels);
    nameInput.value = '';

    renderAdminCategoriesList();
    populateCategoryDropdowns();
    renderVideosTable();
    updateStatsOverview();

    showToast(`নতুন ক্যাটাগরি "${catName}" সফলভাবে তৈরি করা হয়েছে!`);
  });
}

// Open Edit Category Modal
window.openEditCatModal = function(catId) {
  const labels = getLabels();
  const cat = labels[catId];
  if (!cat) return;

  document.getElementById('edit-cat-id').value = catId;
  document.getElementById('edit-cat-name').value = cat.name;

  const iconSelect = document.getElementById('edit-cat-icon');
  if (iconSelect) {
    iconSelect.value = cat.icon || 'fa-tags';
  }

  const modal = document.getElementById('edit-category-modal');
  if (modal) modal.classList.add('active');
};

window.closeEditCatModal = function() {
  const modal = document.getElementById('edit-category-modal');
  if (modal) modal.classList.remove('active');
};

// Edit Category Form Submit
const editCatForm = document.getElementById('admin-edit-single-cat-form');
if (editCatForm) {
  editCatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const catId = document.getElementById('edit-cat-id').value;
    const newName = document.getElementById('edit-cat-name').value.trim();
    const newIcon = document.getElementById('edit-cat-icon').value;

    if (!newName) {
      showToast('ক্যাটাগরির নাম খালি রাখা যাবে না!');
      return;
    }

    const labels = getLabels();
    if (labels[catId]) {
      labels[catId].name = newName;
      labels[catId].icon = newIcon;
      saveLabels(labels);

      renderAdminCategoriesList();
      populateCategoryDropdowns();
      renderVideosTable();
      updateStatsOverview();
      closeEditCatModal();
      showToast(`ক্যাটাগরি "${newName}" সফলভাবে আপডেট করা হয়েছে!`);
    }
  });
}

// Delete Category
window.deleteCategory = async function(catId) {
  const labels = getLabels();
  const cat = labels[catId];
  if (!cat || cat.isAll) {
    showToast('এই সিস্টেম ক্যাটাগরি ডিলিট করা যাবে না!');
    return;
  }

  const confirmed = await showConfirmDialog({
    title: 'ক্যাটাগরি মুছে ফেলা নিশ্চিতকরণ',
    message: `আপনি কি নিশ্চিত "${cat.name}" ক্যাটাগরি মুছে ফেলতে চান? এটি ওয়েবসাইট থেকেও মুছে যাবে।`,
    confirmText: 'হ্যাঁ, মুছে ফেলুন',
    cancelText: 'বাতিল',
    isDanger: true
  });

  if (!confirmed) return;

  delete labels[catId];
  saveLabels(labels);

  renderAdminCategoriesList();
  populateCategoryDropdowns();
  renderVideosTable();
  updateStatsOverview();

  showToast(`ক্যাটাগরি "${cat.name}" মুছে ফেলা হয়েছে!`);
};

// --- 9. Cloud Database & Firebase Settings (Safe fallback) ---
function loadFirebaseSettings() {
  const url = localStorage.getItem(STORAGE_FIREBASE_URL) || '';
  const el = document.getElementById('firebase-db-url');
  if (el) el.value = url;
}

const btnSaveFirebase = document.getElementById('btn-save-firebase');
if (btnSaveFirebase) {
  btnSaveFirebase.addEventListener('click', () => {
    const el = document.getElementById('firebase-db-url');
    const url = el ? el.value.trim() : '';
    localStorage.setItem(STORAGE_FIREBASE_URL, url);
    showToast(url ? 'ফায়ারবেস ডাটাবেজ URL সেভ করা হয়েছে!' : 'ডিফল্ট ক্লাউড ডাটাবেজ সক্রিয় রয়েছে।');
  });
}




// --- Supabase Security Unlock & Password Lock Logic (Master Password: Tahsin@5500) ---
const SUPABASE_MASTER_PASSWORD = 'Tahsin@5500';

function loadSupabaseConfigDisplay() {
  const urlDisplay = document.getElementById('supabase-url-display');
  const keyDisplay = document.getElementById('supabase-key-display');
  if (urlDisplay) {
    urlDisplay.value = SUPABASE_CONFIG.url;
    urlDisplay.type = 'password';
    urlDisplay.setAttribute('readonly', 'true');
    urlDisplay.style.opacity = '0.85';
    urlDisplay.style.cursor = 'default';
  }
  if (keyDisplay) {
    keyDisplay.value = SUPABASE_CONFIG.key;
    keyDisplay.type = 'password';
    keyDisplay.setAttribute('readonly', 'true');
    keyDisplay.style.opacity = '0.85';
    keyDisplay.style.cursor = 'default';
  }
  const unlockBanner = document.getElementById('supabase-unlocked-banner');
  const saveControls = document.getElementById('supabase-save-controls');
  const unlockBtn = document.getElementById('btn-unlock-supabase');
  if (unlockBanner) unlockBanner.style.display = 'none';
  if (saveControls) saveControls.style.display = 'none';
  if (unlockBtn) unlockBtn.style.display = 'inline-flex';
}

function openSupabasePwdModal() {
  const modal = document.getElementById('supabase-pwd-modal');
  const input = document.getElementById('supabase-pwd-input');
  const error = document.getElementById('supabase-pwd-error');
  if (input) input.value = '';
  if (error) {
    error.style.display = 'none';
    error.textContent = '';
  }
  if (modal) modal.classList.add('active');
  if (input) setTimeout(() => input.focus(), 100);
}

function closeSupabasePwdModal() {
  const modal = document.getElementById('supabase-pwd-modal');
  if (modal) modal.classList.remove('active');
}

function toggleSupabasePwdVisibility() {
  const input = document.getElementById('supabase-pwd-input');
  const icon = document.getElementById('supabase-pwd-eye-icon');
  if (!input || !icon) return;
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'fa-solid fa-eye-slash';
  } else {
    input.type = 'password';
    icon.className = 'fa-solid fa-eye';
  }
}

function handleSupabasePwdSubmit(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const input = document.getElementById('supabase-pwd-input');
  const error = document.getElementById('supabase-pwd-error');
  const enteredPass = (input ? input.value : '').trim();

  // Accept Tahsin@5500 (both exact and case-insensitive check)
  if (enteredPass !== SUPABASE_MASTER_PASSWORD && enteredPass.toLowerCase() !== SUPABASE_MASTER_PASSWORD.toLowerCase()) {
    if (error) {
      error.textContent = 'ভুল পাসওয়ার্ড! অ্যাক্সেস প্রত্যাখ্যাত।';
      error.style.display = 'block';
    }
    showToast('ভুল পাসওয়ার্ড! সঠিক মাস্টার পাসওয়ার্ড দিন।');
    if (input) {
      input.focus();
      input.select();
    }
    return false;
  }

  // Password matches Tahsin@5500! Unlock inputs immediately
  closeSupabasePwdModal();
  const urlDisplay = document.getElementById('supabase-url-display');
  const keyDisplay = document.getElementById('supabase-key-display');
  const unlockBanner = document.getElementById('supabase-unlocked-banner');
  const saveControls = document.getElementById('supabase-save-controls');
  const unlockBtn = document.getElementById('btn-unlock-supabase');

  if (urlDisplay) {
    urlDisplay.type = 'text';
    urlDisplay.removeAttribute('readonly');
    urlDisplay.style.opacity = '1';
    urlDisplay.style.cursor = 'text';
  }
  if (keyDisplay) {
    keyDisplay.type = 'text';
    keyDisplay.removeAttribute('readonly');
    keyDisplay.style.opacity = '1';
    keyDisplay.style.cursor = 'text';
  }
  if (unlockBanner) unlockBanner.style.display = 'flex';
  if (saveControls) saveControls.style.display = 'flex';
  if (unlockBtn) unlockBtn.style.display = 'none';

  if (urlDisplay) {
    setTimeout(() => {
      urlDisplay.focus();
      urlDisplay.select();
    }, 100);
  }

  showToast('সফলভাবে আনলক করা হয়েছে! এখন কনফিগারেশন পরিবর্তন করতে পারেন।');
  return false;
}

function cancelSupabaseEdit() {
  loadSupabaseConfigDisplay();
  showToast('পরিবর্তন বাতিল করা হয়েছে এবং কনফিগারেশন পুনরায় সুরক্ষিত করা হলো।');
}

async function saveSupabaseConfig() {
  const urlDisplay = document.getElementById('supabase-url-display');
  const keyDisplay = document.getElementById('supabase-key-display');
  const newUrl = urlDisplay ? urlDisplay.value.trim() : '';
  const newKey = keyDisplay ? keyDisplay.value.trim() : '';

  if (!newUrl || !newUrl.startsWith('https://')) {
    showToast('সঠিক Supabase URL দিন (https:// দিয়ে শুরু হতে হবে)!');
    if (urlDisplay) urlDisplay.focus();
    return;
  }
  if (!newKey) {
    showToast('সুপাবেস API Key খালি রাখা যাবে না!');
    if (keyDisplay) keyDisplay.focus();
    return;
  }

  localStorage.setItem('supabase_custom_url', newUrl);
  localStorage.setItem('supabase_custom_key', newKey);
  SUPABASE_CONFIG.url = newUrl;
  SUPABASE_CONFIG.key = newKey;

  loadSupabaseConfigDisplay();
  showToast('সুপাবেস কনফিগারেশন সফলভাবে সেভ ও লক করা হয়েছে!');

  // Test connection
  const testBtn = document.getElementById('btn-test-cloud-sync');
  if (testBtn) testBtn.click();
}

window.openSupabasePwdModal = openSupabasePwdModal;
window.closeSupabasePwdModal = closeSupabasePwdModal;
window.toggleSupabasePwdVisibility = toggleSupabasePwdVisibility;
window.handleSupabasePwdSubmit = handleSupabasePwdSubmit;
window.cancelSupabaseEdit = cancelSupabaseEdit;
window.saveSupabaseConfig = saveSupabaseConfig;

function setupCloudSyncEvents() {
  const testBtn = document.getElementById('btn-test-cloud-sync');
  const uploadBtn = document.getElementById('btn-force-upload-cloud');

  if (testBtn) {
    testBtn.addEventListener('click', async () => {
      testBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> সিঙ্ক টেস্ট হচ্ছে...';
      try {
        const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${SUPABASE_CONFIG.table}?select=key&limit=1`, {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_CONFIG.key,
            'Authorization': 'Bearer ' + SUPABASE_CONFIG.key
          }
        });
        if (res.ok) {
          testBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> কানেকশন সফল!';
          showToast('✅ Supabase ক্লাউড ডাটাবেজ ১০০% সফলভাবে কানেক্টেড ও লাইভ!');
        } else {
          testBtn.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> সমস্যা হয়েছে';
          showToast('⚠️ Supabase কানেকশনে রেসপন্স ইরর এসেছে।');
        }
      } catch(err) {
        testBtn.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> অফলাইন';
        showToast('⚠️ নেটওয়ার্ক ইরর! ইন্টারনেট চেক করুন।');
      }
      setTimeout(() => {
        testBtn.innerHTML = '<i class="fa-solid fa-rotate"></i> টেস্ট সিঙ্ক';
      }, 3500);
    });
  }

  if (uploadBtn) {
    uploadBtn.addEventListener('click', async () => {
      uploadBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> আপলোড হচ্ছে...';
      const success = await pushAllCurrentDataToSupabase();
      if (success) {
        uploadBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> আপলোড সম্পন্ন!';
        showToast('☁️ সকল লোকাল ডাটা সফলভাবে Supabase ক্লাউডে আপলোড করা হয়েছে!');
      } else {
        uploadBtn.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> ব্যর্থ হয়েছে';
        showToast('⚠️ ক্লাউডে আপলোড করতে সমস্যা হয়েছে!');
      }
      setTimeout(() => {
        uploadBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> লোকাল ডাটা ক্লাউডে আপলোড';
      }, 3500);
    });
  }
}


// --- 9.5. Ad Links & Monetization Settings (Adsterra & Monetag) ---
function loadAdSettings() {
  const topBanner = localStorage.getItem(STORAGE_AD_TOP_BANNER) || '';
  const nativeAd = localStorage.getItem(STORAGE_AD_NATIVE) || '';
  const popunder = localStorage.getItem(STORAGE_AD_POPUNDER) || '';
  const socialbar = localStorage.getItem(STORAGE_AD_SOCIALBAR) || '';
  const bottomBanner = localStorage.getItem(STORAGE_AD_BOTTOM_BANNER) || '';
  const link1 = localStorage.getItem(STORAGE_AD_LINK_1) || 'https://www.google.com';
  const link2 = localStorage.getItem(STORAGE_AD_LINK_2) || 'https://www.bing.com';
  const timer = localStorage.getItem(STORAGE_AD_TIMER) || '5';

  const topBannerInput = document.getElementById('admin-ad-top-banner');
  const nativeInput = document.getElementById('admin-ad-native');
  const popunderInput = document.getElementById('admin-ad-popunder');
  const socialbarInput = document.getElementById('admin-ad-socialbar');
  const bottomBannerInput = document.getElementById('admin-ad-bottom-banner');
  const link1Input = document.getElementById('admin-ad-link-1');
  const link2Input = document.getElementById('admin-ad-link-2');
  const timerInput = document.getElementById('admin-timer-seconds');

  if (topBannerInput) topBannerInput.value = topBanner;
  if (nativeInput) nativeInput.value = nativeAd;
  if (popunderInput) popunderInput.value = popunder;
  if (socialbarInput) socialbarInput.value = socialbar;
  if (bottomBannerInput) bottomBannerInput.value = bottomBanner;
  if (link1Input) link1Input.value = link1;
  if (link2Input) link2Input.value = link2;
  if (timerInput) timerInput.value = timer;
}

async function saveAdSettings(e) {
  if (e) e.preventDefault();
  const topBanner = (document.getElementById('admin-ad-top-banner') ? document.getElementById('admin-ad-top-banner').value : '').trim();
  const nativeAd = (document.getElementById('admin-ad-native') ? document.getElementById('admin-ad-native').value : '').trim();
  const popunder = (document.getElementById('admin-ad-popunder') ? document.getElementById('admin-ad-popunder').value : '').trim();
  const socialbar = (document.getElementById('admin-ad-socialbar') ? document.getElementById('admin-ad-socialbar').value : '').trim();
  const bottomBanner = (document.getElementById('admin-ad-bottom-banner') ? document.getElementById('admin-ad-bottom-banner').value : '').trim();
  const link1 = (document.getElementById('admin-ad-link-1') ? document.getElementById('admin-ad-link-1').value : '').trim();
  const link2 = (document.getElementById('admin-ad-link-2') ? document.getElementById('admin-ad-link-2').value : '').trim();
  const timerVal = document.getElementById('admin-timer-seconds') ? parseInt(document.getElementById('admin-timer-seconds').value) : 5;
  const timer = Math.max(3, timerVal || 5);

  localStorage.setItem(STORAGE_AD_TOP_BANNER, topBanner);
  localStorage.setItem(STORAGE_AD_NATIVE, nativeAd);
  localStorage.setItem(STORAGE_AD_POPUNDER, popunder);
  localStorage.setItem(STORAGE_AD_SOCIALBAR, socialbar);
  localStorage.setItem(STORAGE_AD_BOTTOM_BANNER, bottomBanner);
  localStorage.setItem(STORAGE_AD_LINK_1, link1);
  localStorage.setItem(STORAGE_AD_LINK_2, link2);
  localStorage.setItem(STORAGE_AD_TIMER, timer.toString());

  // Show toast immediately (zero delay) and sync in background
  showToast(`সকল অ্যাড সেটিংস ও টাইমার (${timer} সেকেন্ড) সফলভাবে সেভ করা হয়েছে!`);
  syncSettingsToSupabase();
}
window.saveAdSettings = saveAdSettings;

const adSettingsForm = document.getElementById('admin-ad-settings-form');
if (adSettingsForm) {
  adSettingsForm.addEventListener('submit', saveAdSettings);
}

// --- 9.6. Telegram & WhatsApp Social Links Settings ---
function loadSocialLinks() {
  const tg = localStorage.getItem(STORAGE_TELEGRAM_LINK) || 'https://t.me/';
  const wa = localStorage.getItem(STORAGE_WHATSAPP_LINK) || 'https://whatsapp.com/';

  const tgInput = document.getElementById('admin-telegram-link');
  const waInput = document.getElementById('admin-whatsapp-link');

  if (tgInput) tgInput.value = tg;
  if (waInput) waInput.value = wa;
}

async function saveSocialLinks(e) {
  if (e) e.preventDefault();
  const tgInput = document.getElementById('admin-telegram-link');
  const waInput = document.getElementById('admin-whatsapp-link');

  let tg = tgInput ? tgInput.value.trim() : '';
  let wa = waInput ? waInput.value.trim() : '';

  if (!tg) {
    showToast('দয়া করে টেলিগ্রাম চ্যানেল বা গ্রুপের লিংক দিন!');
    if (tgInput) tgInput.focus();
    return;
  }

  // Format Telegram link if user typed @username or t.me/...
  if (tg.startsWith('@')) {
    tg = 'https://t.me/' + tg.slice(1);
  } else if (tg.startsWith('t.me/')) {
    tg = 'https://' + tg;
  } else if (!tg.startsWith('http://') && !tg.startsWith('https://')) {
    tg = 'https://' + tg;
  }

  // Format WhatsApp link if user entered without protocol
  if (wa && !wa.startsWith('http://') && !wa.startsWith('https://')) {
    wa = 'https://' + wa;
  }

  if (tgInput) tgInput.value = tg;
  if (waInput) waInput.value = wa;

  localStorage.setItem(STORAGE_TELEGRAM_LINK, tg);
  localStorage.setItem(STORAGE_WHATSAPP_LINK, wa);

  // Show toast instantly (zero lag) and sync in background
  showToast('টেলিগ্রাম ও হোয়াটসঅ্যাপ লিংক সফলভাবে সেভ ও ওয়েবসাইটে আপডেট করা হয়েছে!');
  syncSettingsToSupabase();
}

window.saveSocialLinks = saveSocialLinks;

const socialLinksForm = document.getElementById('admin-social-links-form');
if (socialLinksForm) {
  socialLinksForm.addEventListener('submit', saveSocialLinks);
}

// --- 10. Change Admin Password Form ---
async function handleAdminPasswordChange(e) {
  if (e) e.preventDefault();
  const currentPassEl = document.getElementById('current-pass-input');
  const newPassEl = document.getElementById('new-pass-input');
  const confirmPassEl = document.getElementById('confirm-new-pass-input');

  const currentPass = (currentPassEl ? currentPassEl.value : '').trim();
  const newPass = (newPassEl ? newPassEl.value : '').trim();
  const confirmPass = (confirmPassEl ? confirmPassEl.value : '').trim();

  const savedPass = getAdminPassword();

  // Allow saved password, default 'admin123', or master 'Tahsin@5500'
  if (currentPass !== savedPass && currentPass !== 'admin123' && currentPass !== 'Tahsin@5500') {
    showToast('❌ বর্তমান পাসওয়ার্ড সঠিক নয়! (ডিফল্ট: admin123)');
    if (currentPassEl) currentPassEl.focus();
    return false;
  }

  if (newPass.length < 4) {
    showToast('⚠️ নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে!');
    if (newPassEl) newPassEl.focus();
    return false;
  }

  if (newPass !== confirmPass) {
    showToast('❌ নতুন পাসওয়ার্ড দুটি মিলছে না! উভয় বক্সে একই পাসওয়ার্ড লিখুন।');
    if (confirmPassEl) confirmPassEl.focus();
    return false;
  }

  setAdminPassword(newPass);

  if (currentPassEl) currentPassEl.value = '';
  if (newPassEl) newPassEl.value = '';
  if (confirmPassEl) confirmPassEl.value = '';

  // Show toast instantly (zero lag) and sync in background
  showToast('✅ অ্যাডমিন পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!');
  syncSettingsToSupabase();
  return false;
}
window.handleAdminPasswordChange = handleAdminPasswordChange;

const changePassForm = document.getElementById('admin-change-pass-form');
if (changePassForm) changePassForm.addEventListener('submit', handleAdminPasswordChange);

// --- 10.1. Website Name Change Handler ---
function getSavedSiteName() {
  return localStorage.getItem(STORAGE_SITE_NAME_KEY) || 'ভিডিওপোর্টাল';
}


// --- Language Settings Handler ---
function loadSiteLanguageSettings() {
  const currentLang = localStorage.getItem(STORAGE_SITE_LANG_KEY) || 'bn';
  const select = document.getElementById('admin-site-lang-select');
  if (select) select.value = currentLang;
}

function saveSiteLanguage() {
  const select = document.getElementById('admin-site-lang-select');
  const lang = select ? select.value : 'bn';
  localStorage.setItem(STORAGE_SITE_LANG_KEY, lang);
  showToast('✅ ওয়েবসাইটের ডিফল্ট ভাষা সফলভাবে সেভ করা হয়েছে!');
  syncSettingsToSupabase();
}
window.saveSiteLanguage = saveSiteLanguage;

function loadSiteNameSettings() {
  const currentName = getSavedSiteName();
  const input = document.getElementById('admin-site-name-input');
  if (input) input.value = currentName;

  const sidebarBrand = document.getElementById('admin-sidebar-site-name');
  if (sidebarBrand) sidebarBrand.textContent = currentName;

  const mockupSiteTitle = document.getElementById('mockup-site-title');
  if (mockupSiteTitle) mockupSiteTitle.textContent = currentName;
}

function setupSiteNameEvents() {
  const form = document.getElementById('admin-change-site-name-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.getElementById('admin-site-name-input');
      const newName = input ? input.value.trim() : '';
      if (!newName) {
        showToast('দয়া করে ওয়েবসাইটের একটি সঠিক নাম দিন!');
        return;
      }
      localStorage.setItem(STORAGE_SITE_NAME_KEY, newName);
      loadSiteNameSettings();
      // Show toast instantly (zero lag) and sync in background
      showToast('ওয়েবসাইটের নাম সফলভাবে পরিবর্তন করা হয়েছে!');
      syncSettingsToSupabase();
    });
  }
}

// --- 10.2. Website Theme Manager & Live Preview (10 Premium Themes) ---
const THEME_NAMES = {
  'theme-red': '১. ক্লাসিক রেড ও ডার্ক (ডিফল্ট)',
  'theme-cyan': '২. সাইবার নিয়ন ও সায়ান ব্লু',
  'theme-green': '৩. এমারেল্ড ফরেস্ট ও মিন্ট গ্রিন',
  'theme-purple': '৪. রয়্যাল পার্পল ও ভায়োলেট',
  'theme-amber': '৫. গোল্ডেন অ্যাম্বার ও সানসেট',
  'theme-crimson': '৬. ব্লাড ক্রিমসন ও ম্যাট রুবি',
  'theme-midnight': '৭. ডিপ মিডনাইট ও আর্কটিক আইস',
  'theme-matrix': '৮. সাইবার ম্যাট্রিক্স ও নিয়ন লাইম',
  'theme-hotpink': '৯. সিন্থওয়েভ ও ইলেকট্রিক পিঙ্ক',
  'theme-monochrome': '১০. স্টিল সিলভার ও মোনোক্রোম'
};

let currentSelectedTheme = 'theme-red';

function getSavedTheme() {
  return localStorage.getItem(STORAGE_SITE_THEME_KEY) || 'theme-red';
}

function selectTheme(themeKey) {
  if (!THEME_NAMES[themeKey]) themeKey = 'theme-red';
  currentSelectedTheme = themeKey;

  // Highlight selected card and update radio icon
  document.querySelectorAll('.theme-select-card').forEach(card => {
    if (card.getAttribute('data-theme-key') === themeKey) {
      card.classList.add('active');
      card.classList.add('selected');
      const radio = card.querySelector('.theme-card-radio i') || card.querySelector('.theme-radio-indicator i');
      if (radio) {
        radio.className = 'fa-solid fa-circle-check';
      }
    } else {
      card.classList.remove('active');
      card.classList.remove('selected');
      const radio = card.querySelector('.theme-card-radio i') || card.querySelector('.theme-radio-indicator i');
      if (radio) {
        radio.className = 'fa-regular fa-circle';
      }
    }
  });

  // Update mini live mockup preview
  const mockup = document.getElementById('mini-mockup-preview');
  if (mockup) {
    mockup.setAttribute('data-theme', themeKey);
  }
  const badge = document.getElementById('preview-theme-badge');
  if (badge) {
    badge.textContent = THEME_NAMES[themeKey] || themeKey;
  }
}

function loadThemeSettings() {
  const saved = getSavedTheme();
  selectTheme(saved);
}

function setupThemeEvents() {
  document.querySelectorAll('.theme-select-card').forEach(card => {
    card.onclick = function() {
      const themeKey = card.getAttribute('data-theme-key');
      selectTheme(themeKey);
    };
  });

  const saveBtn = document.getElementById('btn-save-theme');
  if (saveBtn) {
    saveBtn.onclick = function(e) {
      if (e) e.preventDefault();
      saveSelectedTheme();
    };
  }
}

async function saveSelectedTheme() {
  localStorage.setItem(STORAGE_SITE_THEME_KEY, currentSelectedTheme);
  document.documentElement.setAttribute('data-theme', currentSelectedTheme);
  if (document.body) document.body.setAttribute('data-theme', currentSelectedTheme);

  const mockup = document.getElementById('mini-mockup-preview');
  if (mockup) mockup.setAttribute('data-theme', currentSelectedTheme);

  // Show toast immediately (zero delay) and sync in background
  showToast(`ওয়েবসাইট থিম সফলভাবে সেভ ও লাইভ করা হয়েছে: ${THEME_NAMES[currentSelectedTheme] || currentSelectedTheme}`);
  syncSettingsToSupabase();
}

window.selectTheme = selectTheme;
window.saveSelectedTheme = saveSelectedTheme;

// --- 11. Event Listeners for Search & Filter ---
function setupEventListeners() {
  const searchInput = document.getElementById('admin-search-video');
  const catFilter = document.getElementById('admin-filter-category');

  searchInput.addEventListener('input', (e) => {
    tableSearchQuery = e.target.value.trim();
    renderVideosTable();
  });

  catFilter.addEventListener('change', (e) => {
    tableCategoryFilter = e.target.value;
    renderVideosTable();
  });

  // Reset all views from admin (Screen-Center Modal)
  const resetViewsBtn = document.getElementById('btn-reset-all-views-admin');
  if (resetViewsBtn) resetViewsBtn.addEventListener('click', async () => {
    const confirmed = await showConfirmDialog({
      title: 'সকল ভিউ রিসেট নিশ্চিতকরণ',
      message: 'আপনি কি নিশ্চিত সকল ভিডিওর ভিউ সংখ্যা রিসেট করে ০ করতে চান? আজকের ভিউ ও সর্বমোট ভিউ সব ০ হয়ে যাবে।',
      confirmText: 'হ্যাঁ, ০ করুন',
      cancelText: 'বাতিল',
      isDanger: true
    });
    if (!confirmed) return;

    const views = {};
    const posts = getPosts();
    posts.forEach(p => views[p.id] = 0);
    saveViews(views);
    localStorage.removeItem(STORAGE_VIEWED_TRACKER);
    localStorage.removeItem(STORAGE_DAILY_VIEWS_KEY);

    renderVideosTable();
    updateStatsOverview();
    showToast('সকল ভিডিওর ভিউ সফলভাবে ০ করা হয়েছে!');
  });
}

// Toast helper
function showToast(msg) {
  const toast = document.getElementById('admin-toast');
  const msgEl = document.getElementById('admin-toast-msg');
  msgEl.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
