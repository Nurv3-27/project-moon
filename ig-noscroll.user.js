// ==UserScript==
// @name         Moon Focus - Instagram DM & Friend Reels Only (No Doomscrolling)
// @namespace    https://moon-fitness.local/
// @version      1.0
// @description  Stops doomscrolling on Instagram while allowing Chat Inboxes (/direct/inbox/) and watching single Reels sent by friends in Messenger!
// @match        *://*.instagram.com/*
// @run-at       document-start
// ==/UserScript==
(function() {
  'use strict';
  const INBOX_PATH = '/direct/inbox/';
  let lastFriendReelPath = null;

  function isAllowedPath(path) {
    if (path.startsWith('/direct/')) return true;
    // Allow watching a single Reel or Post opened from a friend's DM chat
    if (path.startsWith('/reel/') || path.startsWith('/reels/') || path.startsWith('/p/')) {
      const parts = path.split('/').filter(Boolean);
      // /reels/ alone is the infinite Reels feed -> block! /reel/<shortcode> is a specific Reel -> allow!
      if (parts[0] === 'reels' && parts.length < 2) return false;
      return parts.length >= 2;
    }
    return false;
  }

  function enforceNoScroll() {
    const path = window.location.pathname;
    if (!isAllowedPath(path)) {
      window.location.replace(INBOX_PATH);
      return;
    }
    // If watching a friend's Reel, lock vertical scrolling so user cannot swipe to a 2nd random Reel!
    const isSingleReel = (path.startsWith('/reel/') || path.startsWith('/reels/') || path.startsWith('/p/')) && path.split('/').filter(Boolean).length >= 2;
    if (isSingleReel) {
      if (!lastFriendReelPath) {
        lastFriendReelPath = path;
      } else if (lastFriendReelPath !== path) {
        // User tried to scroll to next Reel -> bounce back to DM inbox!
        window.location.replace(INBOX_PATH);
        return;
      }
      document.documentElement.style.setProperty('overflow-y', 'hidden', 'important');
      document.body && document.body.style.setProperty('overflow-y', 'hidden', 'important');
    } else {
      lastFriendReelPath = null;
      document.documentElement.style.removeProperty('overflow-y');
      document.body && document.body.style.removeProperty('overflow-y');
    }
  }

  // Hide Home, Explore, and Reels navigation tabs via CSS so only Messenger / Direct is visible
  const style = document.createElement('style');
  style.textContent = `
    a[href="/"], a[href="/explore/"], a[href="/reels/"] {
      pointer-events: none !important;
      opacity: 0.2 !important;
      filter: grayscale(1) !important;
    }
  `;
  document.documentElement.appendChild(style);

  // Block wheel / touchmove / ArrowDown when viewing a single friend-sent Reel
  window.addEventListener('wheel', (e) => {
    if (lastFriendReelPath && Math.abs(e.deltaY) > 10) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, { passive: false, capture: true });

  window.addEventListener('keydown', (e) => {
    if (lastFriendReelPath && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'PageDown')) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, { capture: true });

  setInterval(enforceNoScroll, 250);
  enforceNoScroll();
})();
