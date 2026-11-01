// ==UserScript==
// @name         Moon Anti-Scroll Shield (Instagram DM & Friend Reels Only + YouTube Shorts Blocker)
// @namespace    https://moon-fitness.local/
// @version      2.1
// @description  Blocks YouTube Shorts (/shorts/*) and Instagram infinite feeds (Reels/Home/Explore) while allowing Instagram Chat Inboxes (/direct/inbox/) and watching 1 single Reel sent by a friend!
// @match        *://*.instagram.com/*
// @match        *://*.youtube.com/*
// @run-at       document-start
// ==/UserScript==
(function () {
  'use strict';

  const API_URL = 'http://localhost:8080/api/scroll?format=json';
  const MOON_APP_URL = 'http://localhost:8080/';
  const IG_INBOX_PATH = '/direct/inbox/';

  let state = {
    allowed: false,
    dmOnly: true,
    remainingSeconds: 0
  };

  let lastFriendReelKey = null;
  let lastTouchY = null;

  async function syncWithMoonServer() {
    try {
      const res = await fetch(API_URL, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        state.allowed = Boolean(data.allowed);
        state.dmOnly = data.dmOnly !== false;
        state.remainingSeconds = Number(data.remainingSeconds) || 0;
      }
    } catch (e) {}
  }

  function injectShieldStyles() {
    if (document.getElementById('moon-antiscroll-styles')) return;
    const style = document.createElement('style');
    style.id = 'moon-antiscroll-styles';
    style.textContent = `
      html.moon-noscroll-lock,
      html.moon-noscroll-lock body {
        overflow: hidden !important;
        overscroll-behavior: none !important;
        touch-action: manipulation !important;
      }
      html.moon-ig-shield a[href="/"],
      html.moon-ig-shield a[href="/explore/"],
      html.moon-ig-shield a[href="/reels/"],
      html.moon-ig-shield a[href^="/reels/"] {
        pointer-events: none !important;
        opacity: 0.12 !important;
        filter: grayscale(1) !important;
      }
      html.moon-yt-shield ytd-rich-shelf-renderer[is-shorts],
      html.moon-yt-shield ytd-reel-shelf-renderer,
      html.moon-yt-shield a[title="Shorts"],
      html.moon-yt-shield ytd-mini-guide-entry-renderer[aria-label="Shorts"],
      html.moon-yt-shield ytm-reel-shelf-renderer,
      html.moon-yt-shield ytm-pivot-bar-item-renderer:has(.pivot-shorts) {
        display: none !important;
      }
      #moon-shield-banner {
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2147483646;
        background: rgba(12, 24, 18, 0.96);
        border: 1.5px solid #34c759;
        color: #7ef7a6;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 13px;
        font-weight: 800;
        padding: 8px 16px;
        border-radius: 999px;
        box-shadow: 0 6px 24px rgba(0,0,0,0.75);
        display: flex;
        align-items: center;
        gap: 10px;
      }
      #moon-shield-banner a {
        background: #34c759;
        color: #041d0b;
        text-decoration: none;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 900;
      }
      #moon-yt-shorts-blocker {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        background: radial-gradient(circle at 50% 25%, #261019 0%, #08080c 75%);
        color: #ffffff;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 24px;
      }
      #moon-yt-shorts-blocker .moon-card {
        max-width: 420px;
        background: rgba(255,255,255,0.05);
        border: 1.5px solid rgba(255,59,48,0.55);
        border-radius: 24px;
        padding: 28px 24px;
        box-shadow: 0 16px 50px rgba(0,0,0,0.8);
      }
      #moon-yt-shorts-blocker h1 {
        font-size: 24px;
        font-weight: 900;
        margin: 12px 0 8px;
      }
      #moon-yt-shorts-blocker p {
        font-size: 14px;
        color: #b4b4c0;
        line-height: 1.5;
        margin-bottom: 20px;
      }
      #moon-yt-shorts-blocker .moon-btn {
        display: block;
        width: 100%;
        padding: 13px 16px;
        border-radius: 14px;
        font-weight: 800;
        font-size: 14px;
        text-decoration: none;
        margin-top: 10px;
        cursor: pointer;
        border: none;
      }
      #moon-yt-shorts-blocker .moon-btn.primary {
        background: #34c759;
        color: #041d0b;
      }
      #moon-yt-shorts-blocker .moon-btn.secondary {
        background: rgba(255,255,255,0.1);
        color: #ffffff;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function showInstagramBanner(text, locked) {
    if (!document.body) return;
    let b = document.getElementById('moon-shield-banner');
    if (!b) {
      b = document.createElement('div');
      b.id = 'moon-shield-banner';
      document.body.appendChild(b);
    }
    b.style.borderColor = locked ? '#ff453a' : '#34c759';
    b.innerHTML = `<span>\uD83D\uDEE1\uFE0F ${text}</span><a href="${IG_INBOX_PATH}">\uD83D\uDCAC DM Inbox</a>`;
  }

  function removeInstagramBanner() {
    const b = document.getElementById('moon-shield-banner');
    if (b) b.remove();
  }

  function isInstagramAllowedPath(path) {
    if (path.startsWith('/direct/')) return true;
    if (path.startsWith('/accounts/')) return true;
    if (path.startsWith('/reel/') || path.startsWith('/reels/') || path.startsWith('/p/')) {
      const parts = path.split('/').filter(Boolean);
      if (parts[0] === 'reels' && parts.length < 2) return false;
      return parts.length >= 2;
    }
    return false;
  }

  function enforceInstagram() {
    injectShieldStyles();
    if (state.allowed) {
      document.documentElement.classList.remove('moon-ig-shield', 'moon-noscroll-lock');
      removeInstagramBanner();
      return;
    }

    document.documentElement.classList.add('moon-ig-shield');
    const path = window.location.pathname;

    if (!state.dmOnly) {
      window.location.replace(MOON_APP_URL);
      return;
    }

    if (!isInstagramAllowedPath(path)) {
      window.location.replace(IG_INBOX_PATH);
      return;
    }

    const parts = path.split('/').filter(Boolean);
    const isReelUrl = (path.startsWith('/reel/') || path.startsWith('/reels/') || path.startsWith('/p/')) && parts.length >= 2;
    const dialogVideo = document.querySelector('[role="dialog"] video, [role="presentation"] video');
    const isWatchingReel = isReelUrl || Boolean(dialogVideo);

    if (isWatchingReel) {
      const currentKey = isReelUrl ? path : (dialogVideo ? (dialogVideo.currentSrc || dialogVideo.src || 'dm_video_1') : 'reel_1');
      if (!lastFriendReelKey) {
        lastFriendReelKey = currentKey;
      } else if (lastFriendReelKey !== currentKey) {
        lastFriendReelKey = null;
        if (dialogVideo) {
          try { dialogVideo.pause(); } catch (e) {}
          const closeBtn = document.querySelector('[role="dialog"] svg[aria-label="Close"], [aria-label="Close"]');
          if (closeBtn && closeBtn.closest('button, [role="button"]')) {
            closeBtn.closest('button, [role="button"]').click();
          } else {
            window.location.replace(IG_INBOX_PATH);
          }
        } else {
          window.location.replace(IG_INBOX_PATH);
        }
        return;
      }
      document.documentElement.classList.add('moon-noscroll-lock');
      showInstagramBanner('Watching 1 Friend Reel \u2022 Next-Reel Scroll LOCKED', true);
    } else {
      lastFriendReelKey = null;
      document.documentElement.classList.remove('moon-noscroll-lock');
      showInstagramBanner('Anti-Scroll ON: Chat Inbox & 1 Friend Reel Only', false);
    }
  }

  function enforceYouTube() {
    injectShieldStyles();
    const existingBlocker = document.getElementById('moon-yt-shorts-blocker');

    if (state.allowed) {
      document.documentElement.classList.remove('moon-yt-shield', 'moon-noscroll-lock');
      if (existingBlocker) existingBlocker.remove();
      return;
    }

    document.documentElement.classList.add('moon-yt-shield');
    const path = window.location.pathname;

    if (path.startsWith('/shorts')) {
      document.documentElement.classList.add('moon-noscroll-lock');
      document.querySelectorAll('video').forEach((v) => {
        try { v.pause(); v.muted = true; } catch (e) {}
      });

      if (!existingBlocker && document.body) {
        const overlay = document.createElement('div');
        overlay.id = 'moon-yt-shorts-blocker';
        overlay.innerHTML = `
          <div class="moon-card">
            <div style="font-size:48px;">\uD83D\uDED1</div>
            <h1>YouTube Shorts Blocked!</h1>
            <p>Moon Anti-Scroll Shield is active. Infinite vertical Shorts feeds are locked until you earn scroll time with Push-Ups, Pull-Ups, or Plank!</p>
            <a class="moon-btn primary" href="${MOON_APP_URL}">\uD83D\uDCAA Earn Scroll Time in Moon App</a>
            <a class="moon-btn secondary" href="https://www.youtube.com/">\u2B05\uFE0F Back to Regular YouTube (No Shorts)</a>
          </div>
        `;
        document.body.appendChild(overlay);
      }
    } else {
      document.documentElement.classList.remove('moon-noscroll-lock');
      if (existingBlocker) existingBlocker.remove();
    }
  }

  function enforce() {
    const host = window.location.hostname;
    if (host.includes('instagram.com')) {
      enforceInstagram();
    } else if (host.includes('youtube.com')) {
      enforceYouTube();
    }
  }

  window.addEventListener('wheel', (e) => {
    if (!state.allowed && document.documentElement.classList.contains('moon-noscroll-lock')) {
      if (Math.abs(e.deltaY) > 4) {
        e.preventDefault();
        e.stopPropagation();
        showInstagramBanner('\uD83D\uDED1 Scroll Blocked! Only 1 Friend-Sent Reel Allowed', true);
      }
    }
  }, { passive: false, capture: true });

  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length === 1) {
      lastTouchY = e.touches[0].clientY;
    }
  }, { passive: true, capture: true });

  window.addEventListener('touchmove', (e) => {
    if (!state.allowed && document.documentElement.classList.contains('moon-noscroll-lock')) {
      if (lastTouchY !== null && e.touches && e.touches.length === 1) {
        if (Math.abs(e.touches[0].clientY - lastTouchY) > 10) {
          e.preventDefault();
          e.stopPropagation();
          showInstagramBanner('\uD83D\uDED1 Swipe Blocked! Only 1 Friend-Sent Reel Allowed', true);
        }
      }
    }
  }, { passive: false, capture: true });

  window.addEventListener('keydown', (e) => {
    if (!state.allowed && document.documentElement.classList.contains('moon-noscroll-lock')) {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }, { capture: true });

  syncWithMoonServer().then(enforce);
  setInterval(syncWithMoonServer, 1500);
  setInterval(enforce, 200);
})();
