/**
 * Moon Fitness OS - Locked-Down Instagram Direct Message Client Injection
 * -----------------------------------------------------------------------
 * Specifically designed for WebViews (iOS WKWebView, Android WebView, 
 * Capacitor, React Native WebView, Electron, or Tampermonkey).
 *
 * Capabilities:
 * 1. Strictly restricts navigation to:
 *    - Instagram Direct Inbox & Chat Threads (/direct/*)
 *    - Accounts / Login flow (/accounts/*)
 *    - Specific shared single Reel / Post sent by friends (/reel/<shortcode>, /p/<shortcode>)
 * 2. Physically hides Instagram navigation UI:
 *    - Mobile bottom tab bar (Home, Explore, Reels, Activity, Profile)
 *    - Desktop left sidebar navigation items (Home, Search, Explore, Reels, Notifications, Create)
 *    - Reels buttons, Suggested Posts, Stories tray
 * 3. Locks vertical scrolling when viewing friend-sent Reels:
 *    - Disables touch swipe and mouse wheel auto-advancing into infinite reels.
 *    - If a 2nd reel attempts to load, immediately pauses and returns to /direct/inbox/.
 */

(function () {
  'use strict';

  const INBOX_URL = 'https://www.instagram.com/direct/inbox/';
  const INBOX_PATH = '/direct/inbox/';
  let lastFriendReelKey = null;

  // -------------------------------------------------------------------------
  // 1. Strict URL Whitelist Validator
  // -------------------------------------------------------------------------
  function isAllowedUrl(urlOrPath) {
    if (!urlOrPath) return false;
    let path = urlOrPath;
    try {
      if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
        const parsed = new URL(urlOrPath);
        if (!parsed.hostname.endsWith('instagram.com')) {
          // Disallow navigation to outside websites
          return false;
        }
        path = parsed.pathname;
      }
    } catch (e) {
      return false;
    }

    // Always allow Direct Messenger (inbox, threads, calls, settings)
    if (path.startsWith('/direct/')) return true;

    // Allow Accounts / Login flow so user can authenticate
    if (path.startsWith('/accounts/')) return true;

    // Allow static asset requests, API endpoints and logins
    if (path.startsWith('/api/') || path.startsWith('/graphql/') || path.startsWith('/static/')) return true;

    // Allow watching a single specific friend-sent Reel or Post
    // Example: /reel/C5ABC123/ or /p/C5ABC123/ or /share/reel/C5ABC123/
    if (path.startsWith('/reel/') || path.startsWith('/reels/') || path.startsWith('/p/') || path.startsWith('/share/')) {
      const parts = path.split('/').filter(Boolean);
      // '/reels' or '/reels/' alone without a shortcode is the infinite feed -> Block!
      if (parts[0] === 'reels' && parts.length < 2) return false;
      // Must have a specific shortcode ID
      return parts.length >= 2;
    }

    // Everything else (Home feed '/', Explore '/explore/', Stories, Reels feed) is blocked!
    return false;
  }

  // -------------------------------------------------------------------------
  // 2. Strict Navigation Guard (Clicks, History, Heartbeat)
  // -------------------------------------------------------------------------
  function enforceUrlGuard() {
    const curPath = window.location.pathname;
    if (!isAllowedUrl(curPath)) {
      console.warn('[Moon DM Client] Blocked navigation to:', curPath);
      window.location.replace(INBOX_URL);
      return false;
    }
    return true;
  }

  // Intercept every link click at capture phase
  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a[href]');
    if (!anchor) return;
    const href = anchor.getAttribute('href') || '';
    if (!isAllowedUrl(href)) {
      e.preventDefault();
      e.stopPropagation();
      console.warn('[Moon DM Client] Prevented click on forbidden link:', href);
      window.location.replace(INBOX_URL);
    }
  }, true);

  // Hook SPA History transitions (pushState, replaceState)
  const originalPushState = history.pushState;
  history.pushState = function (state, title, url) {
    if (url && !isAllowedUrl(url)) {
      console.warn('[Moon DM Client] Blocked pushState to forbidden URL:', url);
      return originalPushState.call(this, state, title, INBOX_PATH);
    }
    return originalPushState.apply(this, arguments);
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function (state, title, url) {
    if (url && !isAllowedUrl(url)) {
      console.warn('[Moon DM Client] Blocked replaceState to forbidden URL:', url);
      return originalReplaceState.call(this, state, title, INBOX_PATH);
    }
    return originalReplaceState.apply(this, arguments);
  };

  window.addEventListener('popstate', enforceUrlGuard);
  window.addEventListener('hashchange', enforceUrlGuard);

  // Periodic heartbeat safeguard
  setInterval(enforceUrlGuard, 800);

  // -------------------------------------------------------------------------
  // 3. Physical UI Elimination: Hide Navigation Bars, Home & Reels Tabs
  // -------------------------------------------------------------------------
  function injectLockdownStyles() {
    if (document.getElementById('moon-dm-lockdown-styles')) return;

    const style = document.createElement('style');
    style.id = 'moon-dm-lockdown-styles';
    style.textContent = `
      /* 1. Eliminate Mobile Bottom Navigation Bar */
      nav[role="navigation"]:not([aria-label="Direct"]),
      div[role="tablist"],
      div:has(> a[href="/"]),
      div:has(> a[href="/reels/"]),
      div:has(> a[href="/explore/"]) {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        overflow: hidden !important;
        pointer-events: none !important;
      }

      /* 2. Hide Mobile & Desktop Home, Reels, Explore & Notification icons */
      a[href="/"],
      a[href="/explore/"],
      a[href="/reels/"],
      a[href^="/reels"],
      a[href="/notifications/"],
      a[href="/activity/"],
      svg[aria-label="Home"],
      svg[aria-label="Feed"],
      svg[aria-label="Back to home"],
      svg[aria-label="Search and explore"],
      svg[aria-label="Explore"],
      svg[aria-label="Reels"],
      svg[aria-label="Notifications"],
      svg[aria-label="New post"],
      svg[aria-label="Create"],
      div[role="menuitem"]:has(svg[aria-label="New post"]) {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }

      /* 3. Hide Stories Tray & Explore Grids */
      [aria-label="Stories"],
      [aria-label="Story"],
      div:has(> div > ul[role="menu"]) {
        display: none !important;
      }

      /* 4. Desktop Sidebar: Keep ONLY Messages / Direct active */
      div[role="navigation"] a:not([href^="/direct"]),
      div[role="navigation"] button:not([aria-label*="Direct"]):not([aria-label*="Message"]) {
        display: none !important;
      }

      /* 5. Fill viewport with chat thread & inbox */
      body, html {
        overscroll-behavior: none !important;
        padding-bottom: 0 !important;
        margin-bottom: 0 !important;
      }

      /* 6. Locked Single-Reel Viewer state */
      html.moon-single-reel-lock,
      html.moon-single-reel-lock body {
        overflow: hidden !important;
        overscroll-behavior: none !important;
        touch-action: manipulation !important;
      }

      /* In-Client Security Badge */
      #moon-dm-client-badge {
        position: fixed;
        top: 8px;
        right: 12px;
        z-index: 2147483647;
        background: rgba(14, 22, 18, 0.94);
        border: 1px solid #34c759;
        color: #7ef7a6;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 11px;
        font-weight: 800;
        padding: 5px 12px;
        border-radius: 999px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.6);
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        user-select: none;
      }
      #moon-dm-client-badge:hover {
        background: #34c759;
        color: #041d0b;
      }
    `;

    (document.head || document.documentElement).appendChild(style);
  }

  // -------------------------------------------------------------------------
  // 4. Friend-Sent Reel Scroll-Lock (Allows 1 Reel, Blocks 2nd Swipe)
  // -------------------------------------------------------------------------
  function setupReelScrollLock() {
    const curPath = window.location.pathname;
    const parts = curPath.split('/').filter(Boolean);
    const isReelUrl = (curPath.startsWith('/reel/') || curPath.startsWith('/reels/') || curPath.startsWith('/p/')) && parts.length >= 2;
    const dialogVideo = document.querySelector('[role="dialog"] video, [role="presentation"] video');
    const isWatchingReel = isReelUrl || Boolean(dialogVideo);

    if (isWatchingReel) {
      document.documentElement.classList.add('moon-single-reel-lock');
      const currentKey = isReelUrl ? curPath : (dialogVideo ? (dialogVideo.currentSrc || dialogVideo.src || 'dialog_video_1') : 'reel_1');

      if (!lastFriendReelKey) {
        lastFriendReelKey = currentKey;
      } else if (lastFriendReelKey !== currentKey) {
        // User attempted to swipe or advance to a second Reel -> return to inbox!
        console.warn('[Moon DM Client] Attempted to advance to 2nd Reel. Bouncing to Inbox.');
        lastFriendReelKey = null;
        if (dialogVideo) {
          try { dialogVideo.pause(); } catch (e) {}
          const closeBtn = document.querySelector('[role="dialog"] svg[aria-label="Close"], [aria-label="Close"]');
          if (closeBtn && closeBtn.closest('button, [role="button"]')) {
            closeBtn.closest('button, [role="button"]').click();
            return;
          }
        }
        window.location.replace(INBOX_PATH);
      }
    } else {
      document.documentElement.classList.remove('moon-single-reel-lock');
      lastFriendReelKey = null;
    }
  }

  // Physical scroll gesture blocker when viewing a Reel
  window.addEventListener('wheel', function (e) {
    if (document.documentElement.classList.contains('moon-single-reel-lock') && Math.abs(e.deltaY) > 8) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, { passive: false, capture: true });

  window.addEventListener('touchmove', function (e) {
    if (document.documentElement.classList.contains('moon-single-reel-lock')) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, { passive: false, capture: true });

  window.addEventListener('keydown', function (e) {
    if (document.documentElement.classList.contains('moon-single-reel-lock')) {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space'].includes(e.code)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }, { passive: false, capture: true });

  // -------------------------------------------------------------------------
  // 5. In-Client Security Badge
  // -------------------------------------------------------------------------
  function renderBadge() {
    if (!document.body || document.getElementById('moon-dm-client-badge')) return;
    const badge = document.createElement('div');
    badge.id = 'moon-dm-client-badge';
    badge.title = 'Moon Locked-Down DM Client: Feeds & Reels Blocked. Tap to return to Inbox.';
    badge.innerHTML = `<span>\uD83D\uDEE1\uFE0F DMs Only</span>`;
    badge.onclick = function () {
      window.location.replace(INBOX_URL);
    };
    document.body.appendChild(badge);
  }

  // -------------------------------------------------------------------------
  // 6. Initialization
  // -------------------------------------------------------------------------
  function init() {
    injectLockdownStyles();
    enforceUrlGuard();
    renderBadge();

    // Observe DOM mutations to keep styles injected and elements hidden
    const observer = new MutationObserver(function () {
      injectLockdownStyles();
      setupReelScrollLock();
      renderBadge();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
