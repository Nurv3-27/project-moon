#!/usr/bin/env python3
"""
Moon Local Server & iPhone Host
Serves the PWA locally so your iPhone on the same Wi-Fi can open and install it!
"""

import http.server
import socketserver
import socket
import webbrowser
import os
import sys
import json
import time
import re
import urllib.parse
import urllib.request
import tempfile

# Doomscroll state pushed by the app.
STATE_FILE = os.path.join(tempfile.gettempdir(), 'moon_scroll_bank.json')

def load_state():
    defaults = {
        'scroll_bank': 0.0,
        'start_time': None,
        'last_elapsed_minutes': 0.0,
        'last_updated': time.time()
    }
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                defaults.update(data)
        except Exception:
            pass
    return defaults

def save_state(state):
    try:
        state['last_updated'] = time.time()
        with open(STATE_FILE, 'w', encoding='utf-8') as f:
            json.dump(state, f)
    except Exception:
        pass

SCROLL = {'until': 0.0, 'dm_only': True, 'active': True}

IG_NOSCROLL_USERSCRIPT = """// ==UserScript==
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
    a[href="/"], a[href="/explore/"], a[href="/reels/"], a[href^="/ reels"] {
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
"""

PORT = 8080

# Avoid UnicodeEncodeError on Windows consoles that can't print emoji
try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

def get_all_lan_ips():
    """Return every usable IPv4 address (VPN adapters can hide the real Wi-Fi IP)."""
    ips = []
    try:
        for info in socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET):
            ip = info[4][0]
            if not ip.startswith(('127.', '169.254.')) and ip not in ips:
                ips.append(ip)
    except Exception:
        pass
    return ips

def get_lan_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(1.5)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        try:
            return socket.gethostbyname(socket.gethostname())
        except Exception:
            return "127.0.0.1"

class MoonHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        clean_path = getattr(self, 'path', '').split('?')[0].lower()
        if any(clean_path.endswith(ext) for ext in ('.png', '.jpg', '.jpeg', '.ico', '.svg', '.webp')):
            self.send_header('Cache-Control', 'public, max-age=604800')
        else:
            self.send_header('Cache-Control', 'no-cache')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def guess_type(self, path):
        clean = path.split('?')[0].lower()
        if clean.endswith('.json') or clean.endswith('manifest.json'):
            return 'application/manifest+json'
        t = super().guess_type(path)
        if t.startswith('text/') or 'javascript' in t:
            t += '; charset=utf-8'
        return t

    def _send(self, body, ctype='text/plain; charset=utf-8', code=200):
        data = body.encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        clean = self.path.split('?')[0]
        if clean == '/api/scroll':
            state = load_state()
            try:
                qs = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
                if 'set' in qs:
                    state['scroll_bank'] = float(qs['set'][0])
                    save_state(state)
                elif 'bank' in qs:
                    state['scroll_bank'] = float(qs['bank'][0])
                    save_state(state)
                elif 'reset' in qs:
                    state['scroll_bank'] = 0.0
                    state['start_time'] = None
                    save_state(state)
            except Exception:
                pass

            bank = float(state.get('scroll_bank', 0.0))
            if state.get('start_time'):
                elapsed = max(0.0, time.time() - float(state['start_time'])) / 60.0
                effective_balance = bank - elapsed
            else:
                effective_balance = bank

            resp = 'allowed' if effective_balance > 0 else 'dm_only'
            return self._send(resp, ctype='text/plain; charset=utf-8')

        if clean in ('/api/timer/start', '/api/timer-start'):
            state = load_state()
            state['start_time'] = time.time()
            try:
                qs = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
                if 'bank' in qs:
                    state['scroll_bank'] = float(qs['bank'][0])
                elif 'set' in qs:
                    state['scroll_bank'] = float(qs['set'][0])
            except Exception:
                pass
            save_state(state)
            return self._send('started', ctype='text/plain; charset=utf-8')

        if clean in ('/api/timer/stop', '/api/timer-stop'):
            state = load_state()
            now = time.time()
            start = state.get('start_time')
            if start:
                elapsed_min = max(0.0, now - float(start)) / 60.0
                curr_bank = float(state.get('scroll_bank', 0.0))
                new_bank = max(0.0, curr_bank - elapsed_min)
                state['scroll_bank'] = round(new_bank, 2)
                state['start_time'] = None
                state['last_elapsed_minutes'] = round(elapsed_min, 2)
                save_state(state)
                msg = f"stopped: deducted {elapsed_min:.2f} min, balance: {new_bank:.2f} min"
            else:
                curr_bank = float(state.get('scroll_bank', 0.0))
                msg = f"stopped: no active session, balance: {curr_bank:.2f} min"
            return self._send(msg, ctype='text/plain; charset=utf-8')
        if clean == '/api/lan-info':
            ip = get_lan_ip()
            return self._send(json.dumps({
                'lanIp': ip,
                'port': PORT,
                'appUrl': f'http://{ip}:{PORT}',
                'scrollUrl': f'http://{ip}:{PORT}/api/scroll'
            }), ctype='application/json; charset=utf-8')
        if clean == '/api/launch-noscroll-ig':
            ext_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'moon_antiscroll_extension')
            launched = False
            try:
                import subprocess
                candidates = [
                    r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
                    r'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
                    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
                    r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
                ]
                for exe in candidates:
                    if os.path.exists(exe):
                        subprocess.Popen([
                            exe,
                            '--app=https://www.instagram.com/direct/inbox/',
                            f'--load-extension={ext_dir}',
                            '--window-size=430,780'
                        ])
                        launched = True
                        break
            except Exception:
                pass
            return self._send(json.dumps({'ok': launched, 'path': ext_dir}), ctype='application/json; charset=utf-8')
        if clean == '/api/open-extension-folder':
            ext_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'moon_antiscroll_extension')
            try:
                if hasattr(os, 'startfile') and os.path.isdir(ext_dir):
                    os.startfile(ext_dir)
            except Exception:
                pass
            return self._send(json.dumps({'ok': True, 'path': ext_dir}), ctype='application/json; charset=utf-8')
        if clean == '/api/resolve-reel':
            qs = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            raw_url = (qs.get('url') or [''])[0].strip()
            shortcode = None
            if raw_url:
                try:
                    req = urllib.request.Request(raw_url, headers={'User-Agent': 'Mozilla/5.0'})
                    with urllib.request.urlopen(req, timeout=4) as resp:
                        final_url = resp.geturl()
                        m = re.search(r'instagram\.com/(?:[^/]+/)?(?:reel|reels|p|tv)/([A-Za-z0-9_-]+)', final_url, re.I)
                        if m:
                            shortcode = m.group(1)
                except Exception:
                    pass
            return self._send(json.dumps({'shortcode': shortcode}), ctype='application/json; charset=utf-8')
        if clean == '/ig-noscroll.user.js':
            try:
                with open('ig-noscroll.user.js', 'r', encoding='utf-8') as f:
                    return self._send(f.read(), ctype='application/javascript; charset=utf-8')
            except Exception:
                return self._send(IG_NOSCROLL_USERSCRIPT, ctype='application/javascript; charset=utf-8')
        if clean in ('/ig_webview_injection.js', '/api/ig_webview_injection.js'):
            try:
                with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ig_webview_injection.js'), 'r', encoding='utf-8') as f:
                    return self._send(f.read(), ctype='application/javascript; charset=utf-8')
            except Exception:
                pass
        if clean in ('/apple-touch-icon.png', '/apple-touch-icon-precomposed.png'):
            self.path = '/apple-touch-icon.png'
        elif clean == '/favicon.ico':
            self.path = '/apple-touch-icon.png'
        return super().do_GET()

    def do_POST(self):
        clean = self.path.split('?')[0]
        if clean in ('/api/timer/start', '/api/timer-start'):
            state = load_state()
            state['start_time'] = time.time()
            try:
                n = int(self.headers.get('Content-Length', 0))
                if n > 0:
                    body = json.loads(self.rfile.read(n) or b'{}')
                    if 'bank' in body:
                        state['scroll_bank'] = float(body['bank'])
                    elif 'scroll_bank' in body:
                        state['scroll_bank'] = float(body['scroll_bank'])
            except Exception:
                pass
            save_state(state)
            return self._send('started', ctype='text/plain; charset=utf-8')

        if clean in ('/api/timer/stop', '/api/timer-stop'):
            state = load_state()
            now = time.time()
            start = state.get('start_time')
            if start:
                elapsed_min = max(0.0, now - float(start)) / 60.0
                curr_bank = float(state.get('scroll_bank', 0.0))
                new_bank = max(0.0, curr_bank - elapsed_min)
                state['scroll_bank'] = round(new_bank, 2)
                state['start_time'] = None
                state['last_elapsed_minutes'] = round(elapsed_min, 2)
                save_state(state)
                msg = f"stopped: deducted {elapsed_min:.2f} min, balance: {new_bank:.2f} min"
            else:
                curr_bank = float(state.get('scroll_bank', 0.0))
                msg = f"stopped: no active session, balance: {curr_bank:.2f} min"
            return self._send(msg, ctype='text/plain; charset=utf-8')

        if clean == '/api/scroll':
            state = load_state()
            try:
                n = int(self.headers.get('Content-Length', 0))
                body = json.loads(self.rfile.read(n) or b'{}')
                if 'remainingSeconds' in body:
                    state['scroll_bank'] = round(float(body['remainingSeconds']) / 60.0, 2)
                elif 'scroll_bank' in body:
                    state['scroll_bank'] = float(body['scroll_bank'])
                elif 'bank' in body:
                    state['scroll_bank'] = float(body['bank'])

                if 'start_time' in body:
                    state['start_time'] = body['start_time']
                save_state(state)
            except Exception:
                pass

            bank = float(state.get('scroll_bank', 0.0))
            resp = 'allowed' if bank > 0 else 'dm_only'
            return self._send(resp, ctype='text/plain; charset=utf-8')
        self._send('not found', code=404)

HTTPS_PORT = 8443

def ensure_cert(ips):
    """Create a self-signed cert (needed: browsers only allow camera on HTTPS)."""
    cert, key = 'moon_cert.pem', 'moon_key.pem'
    if os.path.exists(cert) and os.path.exists(key):
        return cert, key
    try:
        import datetime, ipaddress
        from cryptography import x509
        from cryptography.x509.oid import NameOID
        from cryptography.hazmat.primitives import hashes, serialization
        from cryptography.hazmat.primitives.asymmetric import rsa
        k = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, u'Moon')])
        san = [x509.DNSName(u'localhost')] + [x509.IPAddress(ipaddress.ip_address(i)) for i in ips]
        now = datetime.datetime.utcnow()
        c = (x509.CertificateBuilder().subject_name(name).issuer_name(name)
             .public_key(k.public_key()).serial_number(x509.random_serial_number())
             .not_valid_before(now - datetime.timedelta(days=1))
             .not_valid_after(now + datetime.timedelta(days=825))
             .add_extension(x509.SubjectAlternativeName(san), critical=False)
             .sign(k, hashes.SHA256()))
        open(cert, 'wb').write(c.public_bytes(serialization.Encoding.PEM))
        open(key, 'wb').write(k.private_bytes(serialization.Encoding.PEM,
            serialization.PrivateFormat.TraditionalOpenSSL, serialization.NoEncryption()))
        return cert, key
    except Exception:
        pass
    try:
        import subprocess
        subprocess.run(['openssl', 'req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', key,
                        '-out', cert, '-days', '825', '-subj', '/CN=Moon'],
                       check=True, capture_output=True)
        return cert, key
    except Exception:
        return None

def start_https(handler, ips):
    """Returns the https port if started, else None."""
    pair = ensure_cert(ips)
    if not pair:
        return None
    import ssl, threading
    ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ctx.load_cert_chain(*pair)
    for p in range(HTTPS_PORT, HTTPS_PORT + 20):
        try:
            srv = socketserver.ThreadingTCPServer(("0.0.0.0", p), handler)
        except OSError:
            continue
        srv.socket = ctx.wrap_socket(srv.socket, server_side=True)
        threading.Thread(target=srv.serve_forever, daemon=True).start()
        return p
    return None

def run():
    global PORT
    # Ensure working directory is the script folder
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    lan_ip = get_lan_ip()
    all_ips = get_all_lan_ips()
    if lan_ip not in all_ips:
        all_ips.insert(0, lan_ip)
    local_url = f"http://localhost:{PORT}"
    iphone_url = f"http://{lan_ip}:{PORT}"

    handler = MoonHandler
    
    # Try preferred port, or fall back if occupied
    server = None
    for p in range(PORT, PORT + 20):
        try:
            socketserver.ThreadingTCPServer.allow_reuse_address = True
            socketserver.ThreadingTCPServer.daemon_threads = True
            server = socketserver.ThreadingTCPServer(("0.0.0.0", p), handler)
            PORT = p
            local_url = f"http://localhost:{PORT}"
            iphone_url = f"http://{lan_ip}:{PORT}"
            break
        except OSError:
            continue

    if not server:
        print("Could not bind to an open port.")
        sys.exit(1)

    https_port = start_https(handler, all_ips)

    print("=" * 64)
    print("   ⚡ MOON FITNESS TRACKER - LOCAL SERVER RUNNING ⚡")
    print("=" * 64)
    print(f"\n🖥️  On this Computer:   {local_url}")
    print("📱  On your iPhone - try each address until one loads:")
    for ip in all_ips:
        print(f"      http://{ip}:{PORT}")
    print()
    if https_port:
        print("📷  CAMERA TRACKING needs HTTPS. On the iPhone open (accept the")
        print("    certificate warning once: Show Details > visit this website):")
        for ip in all_ips:
            print(f"      https://{ip}:{https_port}")
    else:
        print("⚠️  HTTPS unavailable (run: pip install cryptography). Camera works on this PC only.")
    print()
    print("=" * 64)
    print("  HOW TO DOWNLOAD & INSTALL ON YOUR iPHONE:")
    print("  1. Make sure your iPhone is connected to the SAME Wi-Fi.")
    print(f"  2. Open Safari on iPhone and type:  {iphone_url}")
    print("  3. Tap the Share button (square with arrow up ⎋).")
    print("  4. Scroll down and tap 'Add to Home Screen' (+).")
    print("  5. Tap 'Add' in the top right corner.")
    print("  --> Moon is now installed on your iPhone like a native app!")
    print("=" * 64)
    print("Press Ctrl+C to stop the server anytime.\n")

    try:
        webbrowser.open(local_url)
    except Exception:
        pass

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        server.server_close()

if __name__ == "__main__":
    run()
