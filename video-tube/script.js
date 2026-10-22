/**
 * Clean Video & Image Portal Engine
 * Features:
 * 1. Centered Video Play Button Overlay on every image
 * 2. Small Video Label Name below title (Dynamic sync across site)
 * 3. Dynamic Label / Category Management (Changing label name updates it everywhere!)
 * 4. Strict 1 Unique View Per User
 */

// --- 1. Five Initial Images Provided by User ---
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

// --- 2. Centralized 5 Labels Configuration ---
const DEFAULT_LABELS = {
  'cat-1': { id: 'cat-1', name: '১. সব পোস্ট (All)', icon: 'fa-border-all', isAll: true },
  'cat-2': { id: 'cat-2', name: '২. গ্রাফিক্স ডিজাইন', icon: 'fa-palette', isAll: false },
  'cat-3': { id: 'cat-3', name: '৩. ফটোগ্রাফি ও রিয়েল পিক', icon: 'fa-camera', isAll: false },
  'cat-4': { id: 'cat-4', name: '৪. সোশ্যাল মিডিয়া পোস্টার', icon: 'fa-share-nodes', isAll: false },
  'cat-5': { id: 'cat-5', name: '৫. ব্যানার ও থাম্বনেইল', icon: 'fa-layer-group', isAll: false }
};

// Storage Keys
const STORAGE_LABELS_KEY = 'site_labels_config_v4';
const STORAGE_POSTS_KEY = 'site_custom_posts_v4';
const STORAGE_VIEWS_KEY = 'site_pure_views_v4';
const STORAGE_VIEWED_TRACKER = 'user_viewed_posts_v4';
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

// Safe Link Opener for Telegram Mini App, WebApp, Blogger iframes, and standard Browsers
function safeOpenLink(url) {
  if (!url) return;
  let trimmed = url.trim();

  // Ensure protocol exists
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('tg://')) {
    trimmed = 'https://' + trimmed;
  }

  // 1. If inside Telegram WebApp
  if (window.Telegram && window.Telegram.WebApp) {
    try {
      if (trimmed.includes('t.me/') && window.Telegram.WebApp.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(trimmed);
        return;
      }
      if (window.Telegram.WebApp.openLink) {
        window.Telegram.WebApp.openLink(trimmed);
        return;
      }
    } catch(err) {
      console.warn('TMA openLink notice:', err);
    }
  }

  // 1.5 If inside an iframe (such as Blogger embed), signal parent window to open it from top window
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ action: 'OPEN_LINK', url: trimmed }, '*');
    }
  } catch (errPost) {}

  // 2. Open via dynamic <a> tag (100% works across all desktop/mobile browsers & inside Blogger iframes)
  try {
    const linkEl = document.createElement('a');
    linkEl.href = trimmed;
    linkEl.target = '_blank';
    linkEl.rel = 'noopener noreferrer';
    linkEl.style.display = 'none';
    document.body.appendChild(linkEl);

    // Trigger synthetic click
    linkEl.click();

    setTimeout(() => {
      try {
        if (linkEl && linkEl.parentNode) {
          linkEl.parentNode.removeChild(linkEl);
        }
      } catch (e) {}
    }, 1000);
  } catch (err) {
    console.warn('Anchor click fallback:', err);
  }

  // 3. Secondary fallback for popups
  try {
    window.open(trimmed, '_blank');
  } catch (errOpen) {
    // If running in top-level window (not an iframe), allow direct navigation
    if (window.self === window.top) {
      window.location.href = trimmed;
    }
  }
}

// Telegram Mini App Initialization
function initTelegramMiniApp() {
  if (window.Telegram && window.Telegram.WebApp) {
    try {
      document.body.classList.add('in-telegram-webapp');
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      if (window.Telegram.WebApp.setHeaderColor) {
        window.Telegram.WebApp.setHeaderColor('#0f0f0f');
      }
      if (window.Telegram.WebApp.setBackgroundColor) {
        window.Telegram.WebApp.setBackgroundColor('#0f0f0f');
      }
    } catch(err) {
      console.warn('TMA ready notice:', err);
    }
  }
}

// 5-Second Telegram Join Popup Modal (Strictly only once per website visit)
const STORAGE_TG_POPUP_SESSION = 'tg_popup_displayed_session_v1';

function initTelegramPopupModal() {
  const modal = document.getElementById('tg-popup-modal');
  const closeBtn = document.getElementById('tg-popup-close-btn');
  const joinBtn = document.getElementById('tg-popup-join-btn');
  if (!modal) return;

  // If already shown once during this session/visit, do not show again
  if (sessionStorage.getItem(STORAGE_TG_POPUP_SESSION)) {
    modal.style.display = 'none';
    return;
  }

  function refreshJoinLink() {
    const tgUrl = (localStorage.getItem(STORAGE_TELEGRAM_LINK) || 'https://t.me/').trim();
    if (joinBtn) joinBtn.href = tgUrl;
  }

  refreshJoinLink();

  function dismissPopup() {
    sessionStorage.setItem(STORAGE_TG_POPUP_SESSION, 'true');
    modal.classList.remove('active');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
  }

  if (joinBtn) {
    joinBtn.onclick = function(e) {
      const currentUrl = (localStorage.getItem(STORAGE_TELEGRAM_LINK) || 'https://t.me/').trim();
      joinBtn.href = currentUrl;
      joinBtn.target = '_blank';
      joinBtn.rel = 'noopener noreferrer';
      safeOpenLink(currentUrl);
      dismissPopup();
    };
  }

  if (closeBtn) {
    closeBtn.onclick = function() {
      dismissPopup();
    };
  }

  modal.onclick = function(e) {
    if (e.target === modal) {
      dismissPopup();
    }
  };

  // Strictly pop up 5 seconds after page loads (only once)
  setTimeout(() => {
    if (sessionStorage.getItem(STORAGE_TG_POPUP_SESSION)) return;
    sessionStorage.setItem(STORAGE_TG_POPUP_SESSION, 'true');
    refreshJoinLink();
    modal.style.display = 'flex';
    requestAnimationFrame(() => {
      modal.classList.add('active');
    });
  }, 5000);
}

// Real-Time Supabase Cloud Sync
async function syncFromSupabaseCloud() {
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
        if (s.siteTheme) localStorage.setItem(STORAGE_SITE_THEME_KEY, s.siteTheme);
        if (s.siteLanguage) {
          localStorage.setItem(STORAGE_SITE_LANG_KEY, s.siteLanguage);
          applySiteLanguage(s.siteLanguage);
        }
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
      applySavedTheme();
      applySavedSiteName();
      renderApp();
    }
  } catch (err) {
    console.warn('Supabase cloud fetch notice (using cached data):', err);
  }
}

// Sync views to Supabase
async function syncViewsToSupabase(viewsMap) {
  try {
    await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${SUPABASE_CONFIG.table}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_CONFIG.key,
        'Authorization': 'Bearer ' + SUPABASE_CONFIG.key,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        key: 'site_views_v4',
        value: viewsMap,
        updated_at: new Date().toISOString()
      })
    });
  } catch (err) {
    // Fail-safe silent error
  }
}

// YouTube / Facebook style Global Real-Time View Increment with In-Flight Queue & Deduplication
let activeSyncPromise = null;
let pendingIncrementQueue = [];

async function syncIncrementViewToSupabase(postId, targetCount) {
  pendingIncrementQueue.push({ postId, targetCount });

  if (activeSyncPromise) {
    return activeSyncPromise;
  }

  activeSyncPromise = (async () => {
    // Slight debounce to coalesce multiple immediate bursts into 1 request
    await new Promise(r => setTimeout(r, 60));

    try {
      // 1. Fetch latest views directly from Supabase
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${SUPABASE_CONFIG.table}?key=eq.site_views_v4&select=value`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_CONFIG.key,
          'Authorization': 'Bearer ' + SUPABASE_CONFIG.key,
          'Content-Type': 'application/json'
        }
      });

      let cloudViews = {};
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data[0] && data[0].value) {
          cloudViews = data[0].value;
        }
      }

      const localViews = getViewsMap();
      const mergedViews = { ...cloudViews, ...localViews };

      // Process queued increments accurately
      const queueToProcess = [...pendingIncrementQueue];
      pendingIncrementQueue = [];

      queueToProcess.forEach(item => {
        const pid = item.postId;
        const currentInCloud = Number(cloudViews[pid]) || 0;
        const currentInLocal = Number(localViews[pid]) || 0;
        // YouTube model: ensure at least the locally displayed count, or cloud + 1
        const resolvedCount = Math.max(item.targetCount, currentInCloud + 1, currentInLocal);
        mergedViews[pid] = resolvedCount;
      });

      localStorage.setItem(STORAGE_VIEWS_KEY, JSON.stringify(mergedViews));

      // Push accurate merged views back to Supabase
      await syncViewsToSupabase(mergedViews);

      // Also sync Daily Views to Supabase site_settings_v1
      try {
        const settingsRes = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${SUPABASE_CONFIG.table}?key=eq.site_settings_v1&select=value`, {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_CONFIG.key,
            'Authorization': 'Bearer ' + SUPABASE_CONFIG.key,
            'Content-Type': 'application/json'
          }
        });
        if (settingsRes.ok) {
          const sData = await settingsRes.json();
          if (Array.isArray(sData) && sData[0] && sData[0].value) {
            const settings = sData[0].value;
            settings.dailyViews = settings.dailyViews || {};
            const todayKey = getTodayDateKey();
            const currentDaily = Number(settings.dailyViews[todayKey]) || 0;
            settings.dailyViews[todayKey] = currentDaily + queueToProcess.length;

            await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${SUPABASE_CONFIG.table}`, {
              method: 'POST',
              headers: {
                'apikey': SUPABASE_CONFIG.key,
                'Authorization': 'Bearer ' + SUPABASE_CONFIG.key,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
              },
              body: JSON.stringify({
                key: 'site_settings_v1',
                value: settings,
                updated_at: new Date().toISOString()
              })
            });
          }
        }
      } catch (errDaily) {
        // Silent failover
      }
    } catch (err) {
      console.warn('Supabase view sync notice:', err);
    } finally {
      activeSyncPromise = null;
    }
  })();

  return activeSyncPromise;
}


// Dynamic Theme Application (100% preserves layout and responsiveness)
function applySavedTheme() {
  const theme = localStorage.getItem(STORAGE_SITE_THEME_KEY) || 'theme-red';
  document.documentElement.setAttribute('data-theme', theme);
  if (document.body) {
    document.body.setAttribute('data-theme', theme);
  }
}

// Dynamic Site Name Application (Updates navbar brand title & page document title)
function applySavedSiteName() {
  const siteName = localStorage.getItem(STORAGE_SITE_NAME_KEY);
  if (siteName && siteName.trim()) {
    const brandTitle = document.getElementById('site-brand-title');
    if (brandTitle) {
      brandTitle.textContent = siteName.trim();
    }
    document.title = `${siteName.trim()} - ভিডিও ও পিক পোর্টাল`;
  }
}

// Helper functions for Ad Links & Timer (Guaranteed Defaults: Always active)
function getAdLink1() {
  const val = localStorage.getItem(STORAGE_AD_LINK_1);
  return (val && val.trim()) ? val.trim() : 'https://www.google.com';
}

function getAdLink2() {
  const val = localStorage.getItem(STORAGE_AD_LINK_2);
  return (val && val.trim()) ? val.trim() : 'https://www.bing.com';
}

function getAdTimerSeconds() {
  return Math.max(3, parseInt(localStorage.getItem(STORAGE_AD_TIMER)) || 5);
}

// 2-Step Ad State
let currentAdStep = 0;
let adCountdownInterval = null;

// Get Current Labels
function getLabelsConfig() {
  const saved = localStorage.getItem(STORAGE_LABELS_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_LABELS_KEY, JSON.stringify(DEFAULT_LABELS));
    return DEFAULT_LABELS;
  }
  return JSON.parse(saved);
}

function saveLabelsConfig(config) {
  localStorage.setItem(STORAGE_LABELS_KEY, JSON.stringify(config));
}

// Get Label Name by Category ID
function getLabelName(categoryId) {
  const labels = getLabelsConfig();
  return labels[categoryId] ? labels[categoryId].name : 'সাধারণ';
}

// Load posts
function getAllPosts() {
  const custom = localStorage.getItem(STORAGE_POSTS_KEY);
  if (!custom) {
    localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(DEFAULT_POSTS));
    return DEFAULT_POSTS;
  }
  return JSON.parse(custom);
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(posts));
}

// Get views map
function getViewsMap() {
  const saved = localStorage.getItem(STORAGE_VIEWS_KEY);
  if (!saved) {
    const initialMap = {};
    DEFAULT_POSTS.forEach(p => {
      initialMap[p.id] = 0; // Pure 0 start
    });
    localStorage.setItem(STORAGE_VIEWS_KEY, JSON.stringify(initialMap));
    return initialMap;
  }
  return JSON.parse(saved);
}

function hasUserViewed(postId) {
  const viewedList = JSON.parse(localStorage.getItem(STORAGE_VIEWED_TRACKER) || '[]');
  return viewedList.includes(postId);
}

function markUserViewed(postId) {
  const viewedList = JSON.parse(localStorage.getItem(STORAGE_VIEWED_TRACKER) || '[]');
  if (!viewedList.includes(postId)) {
    viewedList.push(postId);
    localStorage.setItem(STORAGE_VIEWED_TRACKER, JSON.stringify(viewedList));
  }
}

function formatViews(count) {
  const num = Number(count) || 0;
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

// Update card elements on the page instantly
function updateViewElementsOnPage(postId, count) {
  const elements = document.querySelectorAll(`.view-counter-${postId}`);
  elements.forEach(el => {
    el.textContent = `${formatViews(count)} views`;
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 1200);
  });
}

// Free Global Online Cloud Database Sync Engine (Firebase or CounterAPI)
async function syncViewWithOnlineCloud(postId) {
  try {
    // 1. If Admin configured custom Firebase URL
    const firebaseBase = localStorage.getItem('site_firebase_url_v1');
    if (firebaseBase) {
      const sanitizedUrl = firebaseBase.replace(/\/$/, '') + `/views/${postId}.json`;
      const res = await fetch(sanitizedUrl);
      const val = await res.json();
      const current = typeof val === 'number' ? val : 0;
      await fetch(sanitizedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(current + 1)
      });
      return current + 1;
    }

    // 2. Otherwise Free Cloud CounterAPI (Works across all devices online worldwide)
    const namespace = 'videotube_portal_global_v4';
    const counterUrl = `https://api.counterapi.dev/v1/${namespace}/${postId}/up`;
    const res = await fetch(counterUrl);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.count === 'number') {
        return data.count;
      }
    }
  } catch (err) {
    // Graceful offline fallback
    console.log('Online cloud sync fallback:', err);
  }
  return null;
}

// --- Daily Views Tracking (Resets every night at 12:00 AM) ---
function getTodayDateKey(dateObj = new Date()) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function recordDailyView(delta = 1) {
  try {
    const saved = localStorage.getItem(STORAGE_DAILY_VIEWS_KEY);
    const history = saved ? JSON.parse(saved) : {};
    const todayKey = getTodayDateKey();
    history[todayKey] = (Number(history[todayKey]) || 0) + delta;
    localStorage.setItem(STORAGE_DAILY_VIEWS_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving daily view:', e);
  }
}

// Increment Real View Count (+1) - Facebook & YouTube Real-Time Model (Exactly +1 per click)
function incrementView(postId) {
  const views = getViewsMap();
  const currentCount = Number(views[postId]) || 0;
  const localNewCount = currentCount + 1; // Strict +1
  views[postId] = localNewCount;
  localStorage.setItem(STORAGE_VIEWS_KEY, JSON.stringify(views));

  // Record daily view count
  recordDailyView(1);

  // Update card elements on the page instantly
  updateViewElementsOnPage(postId, localNewCount);

  // Globally sync view increment to Supabase
  syncIncrementViewToSupabase(postId, localNewCount);

  return localNewCount;
}

// Reset views & viewed tracker
function resetAllViews() {
  const views = {};
  const posts = getAllPosts();
  posts.forEach(p => {
    views[p.id] = 0;
  });
  localStorage.setItem(STORAGE_VIEWS_KEY, JSON.stringify(views));
  localStorage.removeItem(STORAGE_VIEWED_TRACKER);
  localStorage.removeItem(STORAGE_DAILY_VIEWS_KEY);

  renderApp();
  showToast('সকল ভিডিওর ভিউ কাউন্ট ০ করা হয়েছে!');
}

// --- 3. Rendering Logic ---
let activeCategory = 'cat-1'; // 'cat-1' is All
let searchKeyword = '';
let currentModalPost = null;


// --- Multi-Language Dictionary (Bangla, English, Hindi) ---
const I18N = {
  bn: {
    recentTitle: 'রিসেন্ট ভিডিও / আপলোড (Recent Uploads)',
    recentMeta: 'সর্বশেষ আপলোডকৃত ৫টি ভিডিও',
    allVideosTitle: 'সকল ভিডিও কালেকশন',
    searchPlaceholder: 'টাইটেল বা লেবেল দিয়ে খুঁজুন...',
    allCategory: '১. সব পোস্ট (All)',
    watchBtn: 'Watch',
    continueBtn: 'Continue',
    shareBtn: 'Share',
    viewsText: 'views',
    adLockNotice: 'ভিডিও লিংক পেতে হলে আগে ২টি অ্যাড দেখতে হবে',
    adStep1: '১ম অ্যাড',
    adStep2: '২য় অ্যাড',
    adStepTimer: 'অপেক্ষা করুন',
    adStep1Done: '১ম সম্পন্ন',
    adStep2Done: '২য় সম্পন্ন',
    adUnlockSuccess: 'অভিনন্দন! লিংক আনলক হয়েছে, Continue চাপুন',
    downloadOpening: 'ডাউনলোড লিংক ওপেন হচ্ছে...',
    shareCopied: '🔗 পোস্টের শেয়ার লিংক কপি করা হয়েছে!',
    tgPopupTitle: 'টেলিগ্রাম চ্যানেলে জয়েন হন!',
    tgPopupSubtitle: 'লেটেস্ট সব প্রিমিয়াম ফটো কালেকশন সবার আগে পেতে এখনই আমাদের অফিসিয়াল টেলিগ্রাম চ্যানেলে জয়েন করুন।',
    tgPopupBtn: 'Join Telegram Channel'
  },
  en: {
    recentTitle: 'Recent Videos / Uploads',
    recentMeta: 'Latest 5 Uploaded Videos',
    allVideosTitle: 'All Video Collection',
    searchPlaceholder: 'Search by title or category...',
    allCategory: '1. All Posts',
    watchBtn: 'Watch',
    continueBtn: 'Continue',
    shareBtn: 'Share',
    viewsText: 'views',
    adLockNotice: 'Watch 2 ads to unlock the download link',
    adStep1: '1st Ad',
    adStep2: '2nd Ad',
    adStepTimer: 'Please wait',
    adStep1Done: '1st Done',
    adStep2Done: '2nd Done',
    adUnlockSuccess: 'Unlocked! Click Continue to download',
    downloadOpening: 'Opening download link...',
    shareCopied: '🔗 Post share link copied to clipboard!',
    tgPopupTitle: 'Join Our Telegram Channel!',
    tgPopupSubtitle: 'Get all the latest exclusive premium video and photo collections first directly on Telegram.',
    tgPopupBtn: 'Join Telegram Channel'
  },
  hi: {
    recentTitle: 'हाल के वीडियो / अपलोड (Recent Uploads)',
    recentMeta: 'नवीनतम ५ अपलोड किए गए वीडियो',
    allVideosTitle: 'सभी वीडियो संग्रह (All Videos)',
    searchPlaceholder: 'शीर्षक या श्रेणी से खोजें...',
    allCategory: '१. सभी पोस्ट (All)',
    watchBtn: 'Watch',
    continueBtn: 'Continue',
    shareBtn: 'Share',
    viewsText: 'views',
    adLockNotice: 'डाउनलोड लिंक अनलॉक करने के लिए २ विज्ञापन देखें',
    adStep1: 'पहला विज्ञापन',
    adStep2: 'दूसरा विज्ञापन',
    adStepTimer: 'प्रतीक्षा करें',
    adStep1Done: 'पहला पूर्ण',
    adStep2Done: 'दूसरा पूर्ण',
    adUnlockSuccess: 'अनलॉक हो गया! डाउनलोड करने के लिए Continue दबाएं',
    downloadOpening: 'डाउनलोड लिंक खुल रहा है...',
    shareCopied: '🔗 पोस्ट शेयर लिंक कॉपी कर लिया गया है!',
    tgPopupTitle: 'टेलीग्राम चैनल से जुड़ें!',
    tgPopupSubtitle: 'नवीनतम प्रीमियम वीडियो और फोटो संग्रह सबसे पहले पाने के लिए हमारे आधिकारिक टेलीग्राम चैनल से जुड़ें।',
    tgPopupBtn: 'Join Telegram Channel'
  }
};

function getCurrentLanguage() {
  return localStorage.getItem(STORAGE_SITE_LANG_KEY) || 'en';
}

function t(key) {
  const lang = getCurrentLanguage();
  return (I18N[lang] && I18N[lang][key]) ? I18N[lang][key] : (I18N['bn'][key] || key);
}

function applySiteLanguage(lang) {
  if (!lang) lang = getCurrentLanguage();
  localStorage.setItem(STORAGE_SITE_LANG_KEY, lang);

  // Update header dropdown
  const select = document.getElementById('site-lang-select');
  if (select) select.value = lang;

  // Update static texts
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.placeholder = t('searchPlaceholder');

  const recentMeta = document.querySelector('#recent-section .meta-note');
  if (recentMeta) recentMeta.textContent = t('recentMeta');

  const adNoticeText = document.getElementById('ad-status-msg');
  if (adNoticeText && currentAdStep === 0) adNoticeText.textContent = t('adLockNotice');

  const step1Pill = document.getElementById('step-1-pill');
  if (step1Pill && currentAdStep === 0) step1Pill.textContent = t('adStep1');

  const step2Pill = document.getElementById('step-2-pill');
  if (step2Pill && currentAdStep <= 1) step2Pill.textContent = t('adStep2');

  const tgTitle = document.querySelector('.tg-popup-title');
  if (tgTitle) tgTitle.textContent = t('tgPopupTitle');

  const tgSubtitle = document.querySelector('.tg-popup-subtitle');
  if (tgSubtitle) tgSubtitle.textContent = t('tgPopupSubtitle');

  const tgBtn = document.querySelector('#tg-popup-join-btn span');
  if (tgBtn) tgBtn.textContent = t('tgPopupBtn');

  // Re-render categories & titles
  renderApp();
}

function setupLanguageSwitcherEvents() {
  const select = document.getElementById('site-lang-select');
  if (select) {
    select.value = getCurrentLanguage();
    select.addEventListener('change', (e) => {
      applySiteLanguage(e.target.value);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Render immediately from local cache with ZERO lag
  applySavedTheme();
  applySavedSiteName();
  applySiteLanguage();
  setupLanguageSwitcherEvents();
  renderApp();
  setupEventListeners();
  initTelegramPopupModal();

  // Auto-open video if user arrived via shared link (?post=xxx)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedPostId = urlParams.get('post');
    if (sharedPostId) {
      setTimeout(() => {
        openImageModal(sharedPostId);
      }, 400);
    }
  } catch(e) {}

  // 2. Fetch latest cloud updates in background asynchronously (without blocking page load or freezing tab)
  syncFromSupabaseCloud();

  // Smart Background Polling: Pause when tab is hidden to save memory & battery (handles 10k-20k users)
  let lastSyncTime = Date.now();
  setInterval(() => {
    if (document.hidden) return; // Do not consume resources when tab is in background!
    if (Date.now() - lastSyncTime < 20000) return;
    lastSyncTime = Date.now();
    syncFromSupabaseCloud();
  }, 25000);

  // Instant refresh when user switches back to this active tab
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && (Date.now() - lastSyncTime > 15000)) {
      lastSyncTime = Date.now();
      syncFromSupabaseCloud();
    }
  });
});

function renderApp() {
  applySavedTheme();
  applySavedSiteName();
  const posts = getAllPosts();
  const views = getViewsMap();

  // 1. Render Top 5 Categories bar with dynamic labels
  renderCategoriesBar();

  // 2. Render Recent Posts (All 5 images)
  const recentGrid = document.getElementById('recent-posts-grid');
  const recentPosts = posts.filter(p => p.isRecent);
  recentGrid.innerHTML = recentPosts.map(p => createCardHtml(p, views[p.id] || 0)).join('');

  // 3. Render Main Filtered Posts
  renderFilteredPosts(posts, views);

  // 4. Populate upload modal dropdown
  populateUploadCategoryOptions();

  // 5. Update Telegram & WhatsApp links from settings
  updateSocialLinks();

  // 6. Initialize & Render Adsterra & Monetag Ads (Top Banner, Native, Popunder, Social Bar, Bottom Banner)
  initializeAllAds();
}

// Safely inject and execute ad scripts/HTML into a target container
function renderAdSlot(containerId, adCode) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const trimmed = (adCode || '').trim();
  if (!trimmed) {
    container.innerHTML = '';
    container.classList.remove('has-ad');
    container.style.display = 'none';
    return;
  }

  container.innerHTML = '';
  container.classList.add('has-ad');
  container.style.display = 'flex';

  // Parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = trimmed;

  const scripts = tempDiv.querySelectorAll('script');

  // Append non-script elements
  Array.from(tempDiv.childNodes).forEach(node => {
    if (node.tagName !== 'SCRIPT') {
      container.appendChild(node.cloneNode(true));
    }
  });

  // Re-create and execute script elements so browser runs them properly
  scripts.forEach(oldScript => {
    const newScript = document.createElement('script');
    Array.from(oldScript.attributes).forEach(attr => {
      newScript.setAttribute(attr.name, attr.value);
    });
    if (oldScript.src) {
      newScript.src = oldScript.src;
    } else {
      newScript.text = oldScript.innerHTML;
    }
    container.appendChild(newScript);
  });
}

// Global script injector (for Popunder & Social Bar)
function injectGlobalAdScript(storageKey, scriptElementId) {
  const code = (localStorage.getItem(storageKey) || '').trim();
  const existing = document.getElementById(scriptElementId);
  if (existing) existing.remove();

  if (!code) return;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = code;
  const scripts = tempDiv.querySelectorAll('script');

  const wrapper = document.createElement('div');
  wrapper.id = scriptElementId;
  wrapper.style.display = 'none';

  Array.from(tempDiv.childNodes).forEach(node => {
    if (node.tagName !== 'SCRIPT') {
      wrapper.appendChild(node.cloneNode(true));
    }
  });

  scripts.forEach(oldScript => {
    const newScript = document.createElement('script');
    Array.from(oldScript.attributes).forEach(attr => {
      newScript.setAttribute(attr.name, attr.value);
    });
    if (oldScript.src) {
      newScript.src = oldScript.src;
    } else {
      newScript.text = oldScript.innerHTML;
    }
    wrapper.appendChild(newScript);
  });

  document.body.appendChild(wrapper);
}

// Load and render all configured Adsterra / Monetag ads
function initializeAllAds() {
  // 1. Top Header Banner Ad (First)
  const topBannerCode = localStorage.getItem(STORAGE_AD_TOP_BANNER) || '';
  renderAdSlot('ad-slot-top-banner', topBannerCode);

  // 2. Native Banner Ad (Between Recent & All Videos)
  const nativeCode = localStorage.getItem(STORAGE_AD_NATIVE) || '';
  renderAdSlot('ad-slot-native-banner', nativeCode);

  // 3. Bottom Banner Ad (End of feed)
  const bottomBannerCode = localStorage.getItem(STORAGE_AD_BOTTOM_BANNER) || '';
  renderAdSlot('ad-slot-bottom-banner', bottomBannerCode);

  // 4. Popunder Ad (Onclick / Popunder background script)
  injectGlobalAdScript(STORAGE_AD_POPUNDER, 'adsterra-popunder-container');

  // 5. Social Bar Ad (In-page push notification script)
  injectGlobalAdScript(STORAGE_AD_SOCIALBAR, 'adsterra-socialbar-container');
}

// Update Telegram & WhatsApp links from Dashboard settings
function updateSocialLinks() {
  const tgLink = localStorage.getItem(STORAGE_TELEGRAM_LINK) || 'https://t.me/';
  const waLink = localStorage.getItem(STORAGE_WHATSAPP_LINK) || 'https://whatsapp.com/';

  const tgBtn = document.getElementById('header-telegram-btn');
  const waBtn = document.getElementById('header-whatsapp-btn');

  if (tgBtn) tgBtn.href = tgLink;
  if (waBtn) waBtn.href = waLink;
}

// Render Top 5 Category Buttons
function renderCategoriesBar() {
  const container = document.getElementById('categories-container');
  const labels = getLabelsConfig();

  container.innerHTML = Object.keys(labels).map(catId => {
    const item = labels[catId];
    const isActive = activeCategory === catId ? 'active' : '';
    return `
      <button class="cat-pill ${isActive}" data-category="${catId}">
        <i class="fa-solid ${item.icon}"></i>
        <span>${item.name}</span>
      </button>
    `;
  }).join('');

  // Re-attach category click events
  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeCategory = btn.getAttribute('data-category');
      renderFilteredPosts();
      window.scrollTo({ top: 60, behavior: 'smooth' });
    });
  });
}

function renderFilteredPosts(posts, views) {
  posts = posts || getAllPosts();
  views = views || getViewsMap();

  const allGrid = document.getElementById('all-posts-grid');
  const catTitle = document.getElementById('category-title');
  const countTag = document.getElementById('posts-count-tag');
  const labels = getLabelsConfig();

  let filtered = posts;

  const recentSection = document.getElementById('recent-section');

  // If a specific category or search is active, show that category directly from the first position!
  if (activeCategory !== 'cat-1' || searchKeyword) {
    if (recentSection) recentSection.style.display = 'none';
  } else {
    if (recentSection) recentSection.style.display = 'block';
  }

  // Filter by category
  if (activeCategory !== 'cat-1') {
    filtered = filtered.filter(p => p.categoryId === activeCategory);
  }

  // Filter by search
  if (searchKeyword) {
    const q = searchKeyword.toLowerCase();
    filtered = filtered.filter(p => {
      const titleMatch = p.title.toLowerCase().includes(q);
      const labelMatch = getLabelName(p.categoryId).toLowerCase().includes(q);
      return titleMatch || labelMatch;
    });
  }

  // Sort so newest / recent uploads appear FIRST!
  filtered = [...filtered].reverse();

  const currentLabelObj = labels[activeCategory];
  if (activeCategory !== 'cat-1') {
    catTitle.innerHTML = `<span class="hot-badge" style="background:#3ea6ff; color:#000;">SELECTED</span> ${currentLabelObj ? currentLabelObj.name : 'ক্যাটাগরি'} (প্রথম থেকে প্রদর্শিত)`;
  } else {
    catTitle.textContent = searchKeyword ? `Search Results (${searchKeyword})` : 'All Videos Collection';
  }

  countTag.textContent = `${filtered.length} Videos`;

  if (filtered.length === 0) {
    allGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #777;">
        <i class="fa-regular fa-image" style="font-size: 2.2rem; margin-bottom: 10px; display: block;"></i>
        No videos found in this category.
      </div>
    `;
    return;
  }

  allGrid.innerHTML = filtered.map(p => createCardHtml(p, views[p.id] || 0)).join('');
}

// Generate Card HTML with Play Button & Small Label Name
function createCardHtml(post, viewCount) {
  const viewsText = formatViews(viewCount);
  const labelName = getLabelName(post.categoryId);

  return `
    <article class="clean-card" data-id="${post.id}">
      <div class="card-media">
        <img src="${post.imageUrl}" alt="${post.title}" loading="lazy" decoding="async" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=720&q=80'">
        
        <!-- CENTERED VIDEO PLAY BUTTON OVERLAY -->
        <div class="play-button-overlay" title="Play Video">
          <i class="fa-solid fa-play"></i>
        </div>
      </div>

      <div class="card-body">
        <h3 class="post-title" title="${post.title}">${post.title}</h3>
        
        <!-- SMALL VIDEO LABEL NAME (টাইটেলের নিচে ছোট করে লেবেল নেম) -->
        <div class="card-label-row">
          <span class="card-label-badge" data-category-id="${post.categoryId}">
            <i class="fa-solid fa-tag"></i> ${labelName}
          </span>
        </div>

        <div class="views-row">
          <span class="blue-view-counter view-counter-${post.id}">
            ${viewsText} views
          </span>
        </div>
      </div>
    </article>
  `;
}

// Populate Category options in the Upload Form
function populateUploadCategoryOptions() {
  const select = document.getElementById('post-cat-input');
  if (!select) return;
  const labels = getLabelsConfig();

  select.innerHTML = Object.keys(labels)
    .filter(catId => !labels[catId].isAll)
    .map(catId => `
      <option value="${catId}">${labels[catId].name}</option>
    `).join('');
}

// --- 4. Open Modal Preview (Play Video / Image Preview) & Strict 2-Step Ad Flow ---
function resetAdStateInModal() {
  if (adCountdownInterval) {
    clearInterval(adCountdownInterval);
    adCountdownInterval = null;
  }
  currentAdStep = 0;

  const lockBadge = document.getElementById('ad-lock-badge');
  const statusMsg = document.getElementById('ad-status-msg');
  const pill1 = document.getElementById('step-1-pill');
  const pill2 = document.getElementById('step-2-pill');
  const pillTimer = document.getElementById('step-timer-pill');
  const watchBtn = document.getElementById('modal-watch-btn');
  const continueBtn = document.getElementById('modal-continue-btn');
  const timerSeconds = getAdTimerSeconds();

  // Always enforce 2 Watch Ads before Download Video is unlocked
  if (watchBtn) {
    watchBtn.style.display = 'inline-flex';
    watchBtn.disabled = false;
    watchBtn.className = 'btn-action-watch';
    watchBtn.innerHTML = '<i class="fa-solid fa-play"></i> <span id="watch-btn-text">Watch (Ad 1)</span>';
  }

  if (continueBtn) {
    continueBtn.style.display = 'inline-flex';
    continueBtn.removeAttribute('href');
    continueBtn.style.pointerEvents = 'none';
    continueBtn.style.opacity = '0.6';
    continueBtn.className = 'btn-action-continue';
    continueBtn.innerHTML = '<i class="fa-solid fa-arrow-right"></i> <span id="continue-btn-text">Continue</span>';
  }

  if (pillTimer) {
    pillTimer.style.display = 'inline-block';
    pillTimer.className = 'step-pill';
    pillTimer.textContent = `${timerSeconds}s Wait`;
  }

  if (lockBadge) {
    lockBadge.className = 'ad-lock-badge';
    lockBadge.innerHTML = '<i class="fa-solid fa-lock"></i> Locked';
  }

  if (statusMsg) {
    statusMsg.textContent = 'Watch 2 ads to unlock the download button';
  }

  if (pill1) {
    pill1.style.display = 'inline-block';
    pill1.className = 'step-pill active';
    pill1.textContent = '1st Ad';
  }

  if (pill2) {
    pill2.style.display = 'inline-block';
    pill2.className = 'step-pill';
    pill2.textContent = '2nd Ad';
  }
}

function startCountdownAndUnlock() {
  const pillTimer = document.getElementById('step-timer-pill');
  const continueBtn = document.getElementById('modal-continue-btn');
  const lockBadge = document.getElementById('ad-lock-badge');
  const statusMsg = document.getElementById('ad-status-msg');

  if (pillTimer) pillTimer.className = 'step-pill active';
  if (statusMsg) statusMsg.textContent = '2 Ads completed! Preparing download button...';

  let remaining = getAdTimerSeconds();
  if (pillTimer) pillTimer.innerHTML = `<i class="fa-solid fa-hourglass-half fa-spin"></i> ${remaining}s Wait`;
  if (continueBtn) {
    continueBtn.innerHTML = `<i class="fa-solid fa-clock"></i> <span id="continue-btn-text">Please wait ${remaining}s...</span>`;
  }

  showToast(`Ad completed! Download button unlocks in ${remaining}s.`);

  adCountdownInterval = setInterval(() => {
    remaining--;
    if (remaining > 0) {
      if (pillTimer) pillTimer.innerHTML = `<i class="fa-solid fa-hourglass-half fa-spin"></i> ${remaining} সে. অপেক্ষা`;
      const continueText = document.getElementById('continue-btn-text');
      if (continueText) continueText.textContent = `${remaining} সেকেন্ড অপেক্ষা করুন...`;
    } else {
      clearInterval(adCountdownInterval);
      adCountdownInterval = null;

      if (pillTimer) {
        pillTimer.className = 'step-pill done';
        pillTimer.innerHTML = '<i class="fa-solid fa-circle-check"></i> Done';
      }
      if (lockBadge) {
        lockBadge.className = 'ad-lock-badge unlocked';
        lockBadge.innerHTML = '<i class="fa-solid fa-lock-open"></i> Unlocked!';
      }
      if (statusMsg) {
        statusMsg.textContent = 'Congrats! Your video download button is unlocked!';
      }

      if (continueBtn) {
        const dlLink = (currentModalPost && (currentModalPost.downloadUrl || currentModalPost.imageUrl)) || '#';
        continueBtn.href = dlLink;
        continueBtn.target = '_blank';
        continueBtn.rel = 'noopener noreferrer';
        continueBtn.style.pointerEvents = 'auto';
        continueBtn.style.opacity = '1';
        continueBtn.className = 'btn-action-continue unlocked';
        continueBtn.innerHTML = '<i class="fa-solid fa-download"></i> <span id="continue-btn-text">Download Video</span>';
      }

      showToast('🎉 Download button unlocked! Click Download Video.');
    }
  }, 1000);
}

function handleWatchClick() {
  const ad1 = getAdLink1();
  const ad2 = getAdLink2();

  if (currentAdStep === 0) {
    safeOpenLink(ad1 || 'https://www.google.com');
    currentAdStep = 1;

    const pill1 = document.getElementById('step-1-pill');
    const pill2 = document.getElementById('step-2-pill');
    const statusMsg = document.getElementById('ad-status-msg');
    const watchBtn = document.getElementById('modal-watch-btn');
    const watchBtnText = document.getElementById('watch-btn-text');

    if (pill1) {
      pill1.className = 'step-pill done';
      pill1.innerHTML = '<i class="fa-solid fa-check"></i> 1st Ad Done';
    }

    if (pill2) pill2.className = 'step-pill active';
    if (statusMsg) statusMsg.textContent = '1st Ad completed! Click Watch for 2nd Ad';
    if (watchBtnText) watchBtnText.textContent = 'Watch (Ad 2)';
    showToast('1st Ad completed! Now watch 2nd Ad.');

  } else if (currentAdStep === 1) {
    safeOpenLink(ad2 || 'https://www.bing.com');
    currentAdStep = 2;

    const pill2 = document.getElementById('step-2-pill');
    const watchBtn = document.getElementById('modal-watch-btn');

    if (pill2) {
      pill2.className = 'step-pill done';
      pill2.innerHTML = '<i class="fa-solid fa-check"></i> 2nd Ad Done';
    }

    if (watchBtn) {
      watchBtn.disabled = true;
      watchBtn.className = 'btn-action-watch counting';
      watchBtn.innerHTML = '<i class="fa-solid fa-check-double"></i> <span>Ads Completed ✓</span>';
    }

    startCountdownAndUnlock();
  }
}

function handleContinueClick(e) {
  const continueBtn = document.getElementById('modal-continue-btn');
  if (!continueBtn || continueBtn.style.pointerEvents === 'none') {
    if (e) e.preventDefault();
    return;
  }

  showToast('Opening download link...');

  if (currentModalPost) {
    const dlLink = currentModalPost.downloadUrl || currentModalPost.imageUrl;
    // Tell parent Blogger window to open it cleanly from the top window
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ action: 'OPEN_LINK', url: dlLink }, '*');
      }
    } catch(err) {}
  }
}

function openImageModal(postId) {
  const posts = getAllPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  currentModalPost = post;

  const views = getViewsMap();
  let currentCount = Number(views[postId]) || 0;
  let isFirstTimeView = false;

  // YouTube / Facebook view model: every open counts as a real view
  currentCount = incrementView(postId);
  markUserViewed(postId);
  isFirstTimeView = true;

  // Set modal content
  const modal = document.getElementById('image-modal');
  const fullImg = document.getElementById('modal-full-image');
  const modalTitle = document.getElementById('modal-post-title');
  const modalViewCount = document.getElementById('modal-view-count');
  const modalLabelName = document.getElementById('modal-label-name');

  fullImg.src = post.imageUrl;
  modalTitle.textContent = post.title;
  modalLabelName.textContent = getLabelName(post.categoryId);
  modalViewCount.textContent = currentCount;

  // Reset ad verification steps & timer on modal open
  resetAdStateInModal();

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeImageModal() {
  const modal = document.getElementById('image-modal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';

  if (adCountdownInterval) {
    clearInterval(adCountdownInterval);
    adCountdownInterval = null;
  }
  currentModalPost = null;
}

// --- 5. Add New Video Feature ---
function addNewPost(title, imageUrl, downloadUrl, categoryId) {
  const posts = getAllPosts();
  const newPost = {
    id: 'post-user-' + Date.now(),
    title: title.trim(),
    imageUrl: imageUrl.trim(),
    downloadUrl: (downloadUrl || '').trim() || imageUrl.trim(),
    categoryId: categoryId,
    isRecent: true
  };

  posts.unshift(newPost);
  savePosts(posts);

  const views = getViewsMap();
  views[newPost.id] = 0;
  localStorage.setItem(STORAGE_VIEWS_KEY, JSON.stringify(views));

  renderApp();
  showToast('New video and download link added successfully!');
}

// --- 6. Manage / Rename Labels Feature ---
// (যাতে লেবেল নেম পরিবর্তন করলে সাথে সাথে সব ভিডিওর লেবেল নাম ও ক্যাটাগরি পরিবর্তিত হয়ে যায়)
function openLabelsModal() {
  const modal = document.getElementById('labels-modal');
  if (!modal) return;
  const labels = getLabelsConfig();

  const el2 = document.getElementById('label-name-2');
  const el3 = document.getElementById('label-name-3');
  const el4 = document.getElementById('label-name-4');
  const el5 = document.getElementById('label-name-5');

  if (el2) el2.value = (labels['cat-2'] && labels['cat-2'].name) || '';
  if (el3) el3.value = (labels['cat-3'] && labels['cat-3'].name) || '';
  if (el4) el4.value = (labels['cat-4'] && labels['cat-4'].name) || '';
  if (el5) el5.value = (labels['cat-5'] && labels['cat-5'].name) || '';

  modal.classList.add('active');
}

function closeLabelsModal() {
  const modal = document.getElementById('labels-modal');
  if (modal) modal.classList.remove('active');
}

function handleSaveLabels(e) {
  e.preventDefault();
  const labels = getLabelsConfig();

  const el2 = document.getElementById('label-name-2');
  const el3 = document.getElementById('label-name-3');
  const el4 = document.getElementById('label-name-4');
  const el5 = document.getElementById('label-name-5');

  if (el2 && labels['cat-2']) labels['cat-2'].name = el2.value.trim();
  if (el3 && labels['cat-3']) labels['cat-3'].name = el3.value.trim();
  if (el4 && labels['cat-4']) labels['cat-4'].name = el4.value.trim();
  if (el5 && labels['cat-5']) labels['cat-5'].name = el5.value.trim();

  // Save to localStorage
  saveLabelsConfig(labels);

  // Re-render whole app
  renderApp();
  closeLabelsModal();
  showToast('Category labels updated successfully!');
}

// --- 7. Event Listeners Setup ---
function setupEventListeners() {
  // Global Event Delegation for Card Clicks (with strict debounce to prevent accidental double-tap/clicks)
  let lastModalOpenTime = 0;
  let lastOpenedPostId = null;

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.clean-card');
    if (!card) return;

    const postId = card.getAttribute('data-id');
    if (postId) {
      const now = Date.now();
      // Block multi-clicks within 600ms on the same post
      if (lastOpenedPostId === postId && (now - lastModalOpenTime) < 600) {
        return;
      }
      lastModalOpenTime = now;
      lastOpenedPostId = postId;
      openImageModal(postId);
    }
  });

  // Search Input
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchKeyword = e.target.value.trim();
      clearSearchBtn.style.display = searchKeyword ? 'block' : 'none';
      renderFilteredPosts();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchKeyword = '';
      clearSearchBtn.style.display = 'none';
      renderFilteredPosts();
    });
  }

  // Close Image Modal Button
  const closeImgModalBtn = document.getElementById('close-image-modal');
  const imgModal = document.getElementById('image-modal');

  if (closeImgModalBtn) closeImgModalBtn.addEventListener('click', closeImageModal);

  if (imgModal) {
    imgModal.addEventListener('click', (e) => {
      if (e.target === imgModal) closeImageModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeImageModal();
      closeAddModal();
      closeLabelsModal();
    }
  });

  // 2-Step Ads Monetization Actions: Watch & Continue
  const watchBtn = document.getElementById('modal-watch-btn');
  const continueBtn = document.getElementById('modal-continue-btn');

  if (watchBtn) {
    watchBtn.addEventListener('click', handleWatchClick);
  }

  if (continueBtn) {
    continueBtn.addEventListener('click', handleContinueClick);
  }

  // Share Post Link (Auto-detects Blogger or Current Host)
  const shareBtn = document.getElementById('modal-share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (!currentModalPost) return;

      // Smart URL Detection: prioritize Blogger if inside iframe or embedded, else origin
      let shareBase = window.location.origin;
      try {
        if (window.top && window.top !== window && window.top.location.origin) {
          shareBase = window.top.location.origin;
        }
      } catch (e) {
        shareBase = 'https://bdnewstrend55.blogspot.com';
      }

      if (window.location.hostname.includes('blogspot.com')) {
        shareBase = window.location.origin;
      }

      const postUrl = shareBase + '/?post=' + encodeURIComponent(currentModalPost.id);

      // Web Share API support (native popup on Mobile / Telegram / Chrome)
      if (navigator.share) {
        navigator.share({
          title: currentModalPost.title,
          text: currentModalPost.title + ' - এখনই দেখুন!',
          url: postUrl
        }).catch(() => {
          copyToClipboardAndToast(postUrl);
        });
      } else {
        copyToClipboardAndToast(postUrl);
      }
    });
  }

  function copyToClipboardAndToast(url) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('🔗 Post share link copied to clipboard!');
      }).catch(() => {
        prompt('Copy post share link:', url);
      });
    } else {
      prompt('Copy post share link:', url);
    }
  }

  // Copy Image Link (if exists)
  const copyBtn = document.getElementById('modal-copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (currentModalPost) {
        navigator.clipboard.writeText(currentModalPost.imageUrl).then(() => {
          showToast('Direct image link copied!');
        }).catch(() => {
          showToast('লিংক: ' + currentModalPost.imageUrl);
        });
      }
    });
  }

  // Reset Views Button
  const resetBtn = document.getElementById('reset-all-views-btn');
  if (resetBtn) resetBtn.addEventListener('click', resetAllViews);

  // Add Post Modal controls
  const openAddModalBtn = document.getElementById('open-add-modal-btn');
  const closeAddModalBtn = document.getElementById('close-add-modal');
  const cancelAddBtn = document.getElementById('cancel-add-btn');
  const addModal = document.getElementById('add-modal');
  const addForm = document.getElementById('add-post-form');

  if (openAddModalBtn) openAddModalBtn.addEventListener('click', () => addModal.classList.add('active'));

  function closeAddModal() {
    addModal.classList.remove('active');
    addForm.reset();
  }

  if (closeAddModalBtn) closeAddModalBtn.addEventListener('click', closeAddModal);
  if (cancelAddBtn) cancelAddBtn.addEventListener('click', closeAddModal);

  if (addModal) {
    addModal.addEventListener('click', (e) => {
      if (e.target === addModal) closeAddModal();
    });
  }

  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('post-title-input').value;
      const url = document.getElementById('post-img-input').value;
      const dlInput = document.getElementById('post-download-input');
      const downloadUrl = dlInput ? dlInput.value : '';
      const catId = document.getElementById('post-cat-input').value;
      addNewPost(title, url, downloadUrl, catId);
      closeAddModal();
    });
  }

  // Manage Labels Modal controls
  const openLabelsBtn = document.getElementById('open-labels-modal-btn');
  const closeLabelsBtn = document.getElementById('close-labels-modal');
  const cancelLabelsBtn = document.getElementById('cancel-labels-btn');
  const labelsModal = document.getElementById('labels-modal');
  const editLabelsForm = document.getElementById('edit-labels-form');

  if (openLabelsBtn) openLabelsBtn.addEventListener('click', openLabelsModal);
  if (closeLabelsBtn) closeLabelsBtn.addEventListener('click', closeLabelsModal);
  if (cancelLabelsBtn) cancelLabelsBtn.addEventListener('click', closeLabelsModal);

  if (labelsModal) {
    labelsModal.addEventListener('click', (e) => {
      if (e.target === labelsModal) closeLabelsModal();
    });
  }

  if (editLabelsForm) {
    editLabelsForm.addEventListener('submit', handleSaveLabels);
  }
}

// Toast notification helper
function showToast(message) {
  const toast = document.getElementById('toast-message');
  const text = document.getElementById('toast-text');
  text.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
