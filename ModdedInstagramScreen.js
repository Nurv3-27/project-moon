/**
 * Moon Fitness OS - Modded Instagram React Native WebView Screen
 * -------------------------------------------------------------
 * Ultra-strict Instagram Direct Message Client with:
 * 1. Forced Routing to https://www.instagram.com/direct/inbox/
 *    (Forbids main feeds, explore page, and reels with instant redirection).
 * 2. Injected JavaScript physically deleting bottom nav bar, side menus, & feed containers.
 * 3. Backend scroll_bank timer integration: unmounts WebView immediately at 00:00
 *    and displays pitch-black screen with maroon moon logo and 'Time Up - Get Back to Work'.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  StatusBar,
  SafeAreaView,
  Platform,
  Vibration,
  Animated,
  PanResponder,
} from 'react-native';
import { WebView } from 'react-native-webview';

// Initial Target URL strictly set to Instagram Direct Inbox
const INITIAL_URL = 'https://www.instagram.com/direct/inbox/';

// Whitelist validator for allowed Instagram URLs
const isAllowedUrl = (rawUrl) => {
  if (!rawUrl) return false;
  try {
    let path = rawUrl;
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      const parsed = new URL(rawUrl);
      if (!parsed.hostname.endsWith('instagram.com')) {
        return false; // Block third-party websites
      }
      path = parsed.pathname;
    }

    // Strictly Allow Direct Messenger (inbox, threads, direct settings)
    if (path.startsWith('/direct/')) return true;

    // Allow Accounts / Login / 2FA flow so athlete can sign in
    if (path.startsWith('/accounts/')) return true;

    // Allow API endpoints & static assets
    if (path.startsWith('/api/') || path.startsWith('/graphql/') || path.startsWith('/static/')) return true;

    // Allow single friend-sent reel/post (e.g. /reel/C5x123/ or /p/C5x123/)
    if (path.startsWith('/reel/') || path.startsWith('/p/') || path.startsWith('/share/')) {
      const parts = path.split('/').filter(Boolean);
      // '/reels' alone without shortcode is the infinite explore feed -> Block!
      if (parts[0] === 'reels' && parts.length < 2) return false;
      return parts.length >= 2;
    }

    // Everything else (Home Feed '/', Explore '/explore/', Infinite Reels '/reels/') is FORBIDDEN!
    return false;
  } catch (e) {
    return false;
  }
};

/**
 * JavaScript Injection:
 * Runs immediately upon page load.
 * Locates and applies 'display: none !important;' to:
 * 1. Bottom navigation bar
 * 2. Side menus
 * 3. Feed containers, explore grids, stories trays, & reels feeds.
 * Continuous MutationObserver ensures dynamically loaded SPA elements are permanently deleted.
 */
const INJECTED_JAVASCRIPT = `
(function() {
  // 0. Spoof navigator properties to iOS Safari to bypass Instagram embedded-browser & bot blocking
  try {
    var SAFARI_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
    Object.defineProperty(navigator, 'userAgent', { get: function() { return SAFARI_UA; }, configurable: true });
    Object.defineProperty(navigator, 'appVersion', { get: function() { return "5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"; }, configurable: true });
    Object.defineProperty(navigator, 'vendor', { get: function() { return "Apple Computer, Inc."; }, configurable: true });
    Object.defineProperty(navigator, 'platform', { get: function() { return "iPhone"; }, configurable: true });
    Object.defineProperty(navigator, 'maxTouchPoints', { get: function() { return 5; }, configurable: true });
  } catch(e) {}

  var CSS_RULES = \`
    /* 1. Physically delete Instagram Bottom Navigation Bar */
    nav[role="navigation"],
    div[role="navigation"]:not([aria-label*="Direct"]):not([aria-label*="Messages"]):not([aria-label*="Chats"]),
    div[role="tablist"],
    footer[role="contentinfo"],
    div[data-testid="bottom-nav"],
    div[style*="bottom: 0px"][style*="position: fixed"],

    /* 2. Physically delete Side Menus & Left Sidebar Navigation */
    div[style*="left: 0"][style*="position: fixed"]:not([aria-label*="Direct"]),
    div[style*="width: 244px"],
    div[style*="width: 220px"],
    div[style*="width: 72px"],
    header[role="banner"],

    /* 3. Physically delete Feed Containers, Explore Grids, Stories & Reels */
    article,
    main > section > div > div > div > div:not([role="grid"]),
    div[aria-label*="Stories"],
    div[aria-label*="Stories tray"],
    div[aria-label*="Suggested for you"],
    div[aria-label*="Explore"],
    div[aria-label*="Reels"],
    section[aria-label*="Reels"],
    a[href="/"],
    a[href="/explore/"],
    a[href="/reels/"],
    a[href^="/stories/"]:not([href*="direct"]) {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      max-height: 0 !important;
      overflow: hidden !important;
      pointer-events: none !important;
      opacity: 0 !important;
    }

    /* Force Direct Messages to fill 100% of Viewport */
    html, body, #root, section, main {
      height: 100% !important;
      width: 100% !important;
      background-color: #000000 !important;
    }
  \`;

  function applyHidingRules() {
    var styleId = 'moon-ig-physically-hidden-style';
    var existing = document.getElementById(styleId);
    if (!existing) {
      var s = document.createElement('style');
      s.id = styleId;
      s.innerHTML = CSS_RULES;
      document.head.appendChild(s);
    }

    // Programmatically locate and hide forbidden elements by aria labels
    var forbiddenLabels = ['Home', 'Explore', 'Reels', 'Search', 'Notifications', 'Create'];
    forbiddenLabels.forEach(function(label) {
      var elements = document.querySelectorAll('svg[aria-label="' + label + '"], a[aria-label="' + label + '"], a[href="/' + label.toLowerCase() + '/"]');
      elements.forEach(function(el) {
        var anchor = el.closest('a') || el.closest('div[role="button"]') || el.closest('li') || el.parentElement;
        if (anchor) {
          anchor.style.setProperty('display', 'none', 'important');
        }
      });
    });

    // Enforce URL whitelist inside page execution context
    var cur = window.location.pathname;
    if (cur !== '/direct/inbox/' && !cur.startsWith('/direct/') && !cur.startsWith('/accounts/')) {
      if (!cur.startsWith('/reel/') && !cur.startsWith('/p/')) {
        window.location.replace('https://www.instagram.com/direct/inbox/');
      }
    }
  }

  // Execute immediately
  applyHidingRules();

  // Continuously observe DOM mutations
  if (window.MutationObserver) {
    var observer = new MutationObserver(function() {
      applyHidingRules();
    });
    observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
  }

  // Fallback Interval
  setInterval(applyHidingRules, 500);

  true;
})();
`;

/**
 * ModdedInstagramScreen Component
 * --------------------------------
 * @param {Object} props
 * @param {string} [props.backendUrl='http://127.0.0.1:8080/api/scroll'] - Moon Backend Scroll Bank endpoint
 * @param {number} [props.initialSeconds=180] - Initial fallback scroll bank seconds
 * @param {Function} [props.onTimeExpired] - Callback when scroll bank reaches 00:00
 * @param {Function} [props.onExit] - Callback to return to workout/routines
 */
export default function ModdedInstagramScreen({
  backendUrl = 'http://127.0.0.1:8080/api/scroll',
  initialSeconds = 180,
  onTimeExpired,
  onExit,
  onSwipeLeft,
  onSwipeRight,
}) {
  const webViewRef = useRef(null);

  // Scroll Bank Timer State
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Pulse Animation for the pitch-black Time Up screen
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Horizontal Swipe Gestures to transition smoothly between screens
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 30 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.5;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -50 && onSwipeLeft) {
          Vibration.vibrate(20);
          onSwipeLeft(); // Slide finger left -> Focus Tab
        } else if (gestureState.dx > 50 && onSwipeRight) {
          Vibration.vibrate(20);
          onSwipeRight(); // Slide finger right -> Previous Tab
        }
      },
    })
  ).current;

  // ---------------------------------------------------------------------------
  // 1. Backend Timer Integration & Scroll Bank Polling
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    // Fetch initial balance from backend scroll_bank logic
    const fetchScrollBank = async () => {
      try {
        const res = await fetch(`${backendUrl}?format=json`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            const sec = typeof data.remainingSeconds === 'number'
              ? data.remainingSeconds
              : Math.round((data.scrollBankMinutes || 0) * 60);

            if (sec <= 0 || !data.allowed) {
              handleTimeExpired();
            } else {
              setRemainingSeconds(sec);
            }
          }
        }
      } catch (err) {
        console.warn('[ScrollBank] Backend fetch fallback to local timer:', err.message);
      }
    };

    fetchScrollBank();

    return () => {
      isMounted = false;
    };
  }, [backendUrl]);

  // ---------------------------------------------------------------------------
  // 2. Active Countdown Interval (Ticks every second down to 00:00)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (isTimeUp || isUnmounted || isPaused) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimeUp, isUnmounted, isPaused]);

  // ---------------------------------------------------------------------------
  // 3. Unmount Trigger when Scroll Bank Reaches Zero (00:00)
  // ---------------------------------------------------------------------------
  const handleTimeExpired = useCallback(() => {
    // 1. Immediately physically unmount the WebView component
    setIsUnmounted(true);
    setIsTimeUp(true);

    // 2. Trigger heavy tactile feedback
    Vibration.vibrate([0, 500, 200, 500]);

    // 3. Notify backend scroll_bank logic
    try {
      fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remainingSeconds: 0, scroll_bank: 0.0 }),
      }).catch(() => {});
    } catch (e) {}

    // 4. Start glowing pulse animation on the pitch-black lock screen
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    if (onTimeExpired) {
      onTimeExpired();
    }
  }, [backendUrl, onTimeExpired, pulseAnim]);

  // ---------------------------------------------------------------------------
  // 4. Forced Routing & Interception (onNavigationStateChange & onShouldStartLoad)
  // ---------------------------------------------------------------------------
  const handleNavigationStateChange = (navState) => {
    const { url } = navState;

    if (!isAllowedUrl(url)) {
      console.warn('[ModdedInstagram] FORCED ROUTING: Blocked navigation to', url);

      // Instantly block the request
      if (webViewRef.current) {
        webViewRef.current.stopLoading();
        // Force redirect back to Direct Messages
        webViewRef.current.injectJavaScript(
          `window.location.replace('${INITIAL_URL}'); true;`
        );
      }

      Vibration.vibrate(50);
    }
  };

  const handleShouldStartLoadWithRequest = (request) => {
    const { url } = request;

    if (!isAllowedUrl(url)) {
      console.warn('[ModdedInstagram] SHOULD_START_LOAD: Blocked forbidden URL', url);
      // Instantly block request from loading
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(
          `window.location.replace('${INITIAL_URL}'); true;`
        );
      }
      return false;
    }
    return true;
  };

  // Hardware Android back button handling
  useEffect(() => {
    const backAction = () => {
      if (webViewRef.current && !isUnmounted) {
        webViewRef.current.injectJavaScript(
          `window.location.replace('${INITIAL_URL}'); true;`
        );
        return true;
      }
      if (onExit) {
        onExit();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, [isUnmounted, onExit]);

  // Format seconds into MM:SS
  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Pause & Bank time back to backend
  const handleSaveAndBankTime = async () => {
    setIsPaused(true);
    try {
      await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remainingSeconds }),
      });
    } catch (e) {}

    setIsUnmounted(true);
    if (onExit) onExit();
  };

  // ---------------------------------------------------------------------------
  // 5. RENDER: Pitch-Black "Time Up - Get Back to Work" Screen
  //    (Displayed when scroll bank reaches zero - WebView is UNMOUNTED)
  // ---------------------------------------------------------------------------
  if (isUnmounted || isTimeUp) {
    return (
      <SafeAreaView style={styles.pitchBlackLockScreen}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />

        <View style={styles.lockContainer}>
          {/* Glowing Maroon Moon Logo */}
          <Animated.View
            style={[
              styles.moonLogoGlowWrapper,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <View style={styles.moonRadialGlow} />
            <Image
              source={require('./moon_logo.png')}
              style={styles.moonLogoImage}
              resizeMode="contain"
              defaultSource={require('./moon_logo.png')}
            />
          </Animated.View>

          {/* Time Up Message */}
          <View style={styles.lockTextWrap}>
            <Text style={styles.timeUpBadge}>00:00 • SCROLL BANK EXPIRED</Text>
            <Text style={styles.timeUpTitle}>Time Up - Get Back to Work</Text>
            <Text style={styles.timeUpSubtitle}>
              Your earned scroll bank balance has reached zero. Instagram has been{' '}
              <Text style={styles.highlightText}>physically unmounted</Text>.
            </Text>
            <Text style={styles.timeUpAdvice}>
              Earn more scroll time by completing push-ups, pull-ups, or barbell squats in your gym tracker.
            </Text>
          </View>

          {/* Action Button: Return to Workout */}
          <TouchableOpacity
            style={styles.backToWorkBtn}
            onPress={onExit || (() => {})}
            activeOpacity={0.8}
          >
            <Text style={styles.backToWorkBtnText}>🏋️ Return to Gym Hub</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ---------------------------------------------------------------------------
  // 6. RENDER: Active Modded Instagram WebView Screen
  // ---------------------------------------------------------------------------
  return (
    <SafeAreaView style={styles.container} {...panResponder.panHandlers}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0B10" />

      {/* Top Header: Live Scroll Bank Countdown & Anti-Scroll Shield Pill */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <View style={styles.livePulseDot} />
          <View>
            <Text style={styles.headerTitle}>Instagram Direct</Text>
            <Text style={styles.headerStatusText}>🛡️ Feeds & Reels Blocked</Text>
          </View>
        </View>

        {/* Live Bank Countdown Timer */}
        <View style={styles.timerPillWrap}>
          <Text
            style={[
              styles.timerDigits,
              remainingSeconds <= 30 && styles.timerDigitsCritical,
            ]}
          >
            ⏱️ {formatTimer(remainingSeconds)}
          </Text>
        </View>

        {/* Pause & Save Bank Button */}
        <TouchableOpacity
          style={styles.saveBankBtn}
          onPress={handleSaveAndBankTime}
          activeOpacity={0.7}
        >
          <Text style={styles.saveBankBtnText}>💾 Bank Time</Text>
        </TouchableOpacity>
      </View>

      {/* WebView Container */}
      <View style={styles.webViewWrap}>
        <WebView
          ref={webViewRef}
          source={{ uri: INITIAL_URL }}
          style={styles.webView}
          // Requirement 1: Forced Routing Interception
          onNavigationStateChange={handleNavigationStateChange}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          // Requirement 2: Immediate JavaScript Injection (physically deletes bottom nav, side menu, feeds)
          injectedJavaScript={INJECTED_JAVASCRIPT}
          injectedJavaScriptBeforeContentLoaded={INJECTED_JAVASCRIPT}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
          originWhitelist={['*']}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          allowsBackForwardNavigationGestures={false}
          setSupportMultipleWindows={false}
          onOpenWindow={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            const targetUrl = nativeEvent ? nativeEvent.targetUrl : '';
            if (isAllowedUrl(targetUrl)) {
              webViewRef.current?.injectJavaScript(`window.location.href = '${targetUrl}'; true;`);
            }
          }}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#E0506A" />
              <Text style={styles.loadingText}>Securing Direct Messenger...</Text>
            </View>
          )}
          userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
          applicationNameForUserAgent="Version/17.0 Mobile/15E148 Safari/604.1"
        />
      </View>
    </SafeAreaView>
  );
}

// -----------------------------------------------------------------------------
// Pitch-Black & Dark Maroon Stylesheet
// -----------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerBar: {
    height: 54,
    backgroundColor: 'rgba(10, 11, 16, 0.95)',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(224, 80, 106, 0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  livePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  headerStatusText: {
    color: '#E0506A',
    fontSize: 10,
    fontWeight: '700',
  },
  timerPillWrap: {
    backgroundColor: 'rgba(224, 80, 106, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(224, 80, 106, 0.45)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  timerDigits: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#FF859C',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  timerDigitsCritical: {
    color: '#FF2A55',
  },
  saveBankBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  saveBankBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  webViewWrap: {
    flex: 1,
    backgroundColor: '#000000',
  },
  webView: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#C48292',
    fontSize: 13,
    fontWeight: '700',
  },

  /* Requirement 3: Pitch-Black Lock Screen */
  pitchBlackLockScreen: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockContainer: {
    width: '88%',
    maxWidth: 380,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  moonLogoGlowWrapper: {
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  moonRadialGlow: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(158, 27, 52, 0.35)',
    shadowColor: '#E0506A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 35,
  },
  moonLogoImage: {
    width: 150,
    height: 150,
    borderRadius: 30,
  },
  lockTextWrap: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timeUpBadge: {
    color: '#FF2A55',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  timeUpTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 12,
    textShadowColor: 'rgba(224, 80, 106, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  timeUpSubtitle: {
    color: '#C48292',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 14,
  },
  highlightText: {
    color: '#FF4D73',
    fontWeight: '800',
  },
  timeUpAdvice: {
    color: '#888888',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  backToWorkBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: '#8A0022',
    borderWidth: 1.5,
    borderColor: '#E0506A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E0506A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 8,
  },
  backToWorkBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
