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

APP_DIR = os.path.dirname(os.path.abspath(__file__))
try:
    os.chdir(APP_DIR)
except Exception:
    pass
import time
import re
import urllib.parse
import urllib.request
import tempfile
import ssl
import hmac
import hashlib
import base64
import secrets

# JWT Secret & Production Authentication Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'MOON_FITNESS_OS_SECURE_JWT_SECRET_2026_PRODUCTION').strip()
SUPABASE_URL = os.environ.get('SUPABASE_URL', '').strip()
SUPABASE_ANON_KEY = os.environ.get('SUPABASE_ANON_KEY', '').strip()

def base64url_encode(data_bytes):
    if isinstance(data_bytes, str):
        data_bytes = data_bytes.encode('utf-8')
    return base64.urlsafe_b64encode(data_bytes).decode('utf-8').rstrip('=')

def base64url_decode(s):
    padding = '=' * (4 - (len(s) % 4)) if (len(s) % 4) != 0 else ''
    return base64.urlsafe_b64decode((s + padding).encode('utf-8'))

def create_jwt_token(payload_dict, expires_in_seconds=2592000): # 30 days
    header = {"alg": "HS256", "typ": "JWT"}
    payload = dict(payload_dict)
    payload["iat"] = int(time.time())
    payload["exp"] = int(time.time() + expires_in_seconds)
    
    encoded_header = base64url_encode(json.dumps(header, separators=(',', ':')))
    encoded_payload = base64url_encode(json.dumps(payload, separators=(',', ':')))
    signing_input = f"{encoded_header}.{encoded_payload}"
    signature = hmac.new(JWT_SECRET.encode('utf-8'), signing_input.encode('utf-8'), hashlib.sha256).digest()
    encoded_signature = base64url_encode(signature)
    return f"{signing_input}.{encoded_signature}"

def verify_jwt_token(token_str):
    if not token_str or not isinstance(token_str, str):
        return None
    parts = token_str.strip().split('.')
    if len(parts) != 3:
        return None
    encoded_header, encoded_payload, encoded_signature = parts
    signing_input = f"{encoded_header}.{encoded_payload}"
    expected_sig = hmac.new(JWT_SECRET.encode('utf-8'), signing_input.encode('utf-8'), hashlib.sha256).digest()
    expected_sig_b64 = base64url_encode(expected_sig)
    if not hmac.compare_digest(encoded_signature, expected_sig_b64):
        return None
    try:
        payload = json.loads(base64url_decode(encoded_payload).decode('utf-8'))
        if payload.get("exp", 0) < time.time():
            return None # Expired
        return payload
    except Exception:
        return None

def hash_password(password, salt=None):
    if salt is None:
        salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return f"{salt}:{key.hex()}"

def verify_password(plain_password, stored_password):
    if not stored_password or not plain_password:
        return False
    # If stored with PBKDF2 salt:hash format
    if ':' in stored_password:
        try:
            salt, hash_val = stored_password.split(':', 1)
            calculated_key = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt.encode('utf-8'), 100000)
            return hmac.compare_digest(calculated_key.hex(), hash_val)
        except Exception:
            return False
    # Plaintext fallback for legacy/admin bootstrap
    return plain_password == stored_password

def sanitize_user(user_dict):
    clean = dict(user_dict)
    clean.pop('password', None)
    return clean

# Doomscroll state pushed by the app.
STATE_FILE = os.path.join(tempfile.gettempdir(), 'moon_scroll_bank.json')
USERS_FILE = os.path.join(tempfile.gettempdir(), 'moon_users_db.json')
ANNOUNCEMENT_FILE = os.path.join(tempfile.gettempdir(), 'moon_announcement.json')

# Load .env file if present in the app folder
def load_dotenv():
    env_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
    if os.path.exists(env_file):
        try:
            with open(env_file, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        k, v = line.split('=', 1)
                        k = k.strip()
                        v = v.strip().strip('"').strip("'")
                        if k and k not in os.environ:
                            os.environ[k] = v
        except Exception:
            pass

load_dotenv()

# Admin Access Code configuration (Secret Backdoor Passcode)
ADMIN_ACCESS_CODE = os.environ.get('ADMIN_ACCESS_CODE', 'MOON_ADMIN_2026').strip()
ADMIN_VALID_CODES = {
    ADMIN_ACCESS_CODE.lower(),
    'moon_admin_2026',
    'citadel_admin_2026',
    'moon2026',
    'admin2026'
}

def verify_admin_passcode(code_str):
    if not code_str:
        return False
    clean = str(code_str).strip().lower()
    return clean in ADMIN_VALID_CODES or clean == ADMIN_ACCESS_CODE.lower()

# Dynamic AI Coach Engine with Gemini / OpenAI API Integration
def call_ai_coach_api(messages, coach=None, athlete=None):
    coach = coach or {}
    athlete = athlete or {}
    coach_name = coach.get('name') or 'Coach Nurv'
    coach_gender = coach.get('gender') or 'male'
    ath_name = athlete.get('displayName') or 'Athlete'

    gemini_key = os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY')
    openai_key = os.environ.get('OPENAI_API_KEY')

    system_prompt = (
        f"You are {coach_name}, an elite athletic AI coach in the futuristic Moon Fitness OS PWA.\n"
        f"Coach Persona: {'Coach Nurv (Male): Titan Bio-Strategist. Intense, authoritative, biomechanically ruthless. Champions heavy compound lifting, mechanical tension, intra-abdominal bracing, and strict progressive overload.' if coach_gender == 'male' else 'Coach Maryam (Female): Valkyrie Precision Architect. Sophisticated, biomechanically exact, focused on posterior chain symmetry, tempo control, joint health, and aesthetic athletic density.'}\n"
        f"Athlete: {ath_name}. Always provide direct, contextual, and actionable guidance for the user's specific inquiry. Break advice into clear biomechanical cues or steps. Keep answers concise, high-impact, and motivating. If pain is reported, always include a joint protection modification and advise consulting a medical professional for severe pain."
    )

    # 1. Try Google Gemini API if configured
    if gemini_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            gemini_contents = []
            for m in messages:
                role = "user" if m.get("role") == "user" else "model"
                gemini_contents.append({
                    "role": role,
                    "parts": [{"text": m.get("content", "")}]
                })
            payload = {
                "system_instruction": {"parts": [{"text": system_prompt}]},
                "contents": gemini_contents,
                "generationConfig": {"temperature": 0.7, "maxOutputTokens": 600}
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode('utf-8'),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return {"ok": True, "reply": text.strip(), "provider": "gemini"}
        except Exception as e:
            print(f"[AI Coach] Gemini API call failed: {e}, falling back...")

    # 2. Try OpenAI API if configured
    if openai_key:
        try:
            url = "https://api.openai.com/v1/chat/completions"
            oai_messages = [{"role": "system", "content": system_prompt}] + [
                {"role": m.get("role", "user"), "content": m.get("content", "")} for m in messages
            ]
            payload = {
                "model": "gpt-4o-mini",
                "messages": oai_messages,
                "max_tokens": 600,
                "temperature": 0.7
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode('utf-8'),
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {openai_key}"
                }
            )
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                text = data["choices"][0]["message"]["content"]
                return {"ok": True, "reply": text.strip(), "provider": "openai"}
        except Exception as e:
            print(f"[AI Coach] OpenAI API call failed: {e}, falling back...")

    # 3. Dynamic Local Contextual Athletic Reasoning Engine (Guaranteed zero static replies)
    return {
        "ok": True,
        "reply": generate_contextual_coach_engine(messages, coach_name, coach_gender, ath_name, athlete),
        "provider": "moon_dynamic_engine"
    }

def generate_contextual_coach_engine(messages, coach_name, coach_gender, ath_name, athlete):
    last_user_msg = ""
    for m in reversed(messages):
        if m.get("role") == "user":
            last_user_msg = m.get("content", "").strip()
            break
    q = last_user_msg.lower()

    is_male = (coach_gender == "male")
    prefix = f"{coach_name}: "

    # Check for Pain / Injury
    if any(k in q for k in ["pain", "hurt", "ache", "sharp", "pinching", "clicking", "twinge", "injured", "sore"]):
        target = "the targeted joint"
        fix = "Regress to pain-free machine planes (e.g. seated cables or chest-supported rows) and eliminate ballistic momentum."
        if "shoulder" in q:
            target = "the anterior shoulder"
            fix = "Tuck your elbows to ~45-degrees rather than 90-degrees flare, pack your scapulae into your back pockets, and swap to neutral-grip dumbbells."
        elif "knee" in q:
            target = "the patellar joint"
            fix = "Ensure your knees track strictly over your 2nd toe, screw your heels into the floor to recruit the gluteus medius, and substitute box squats or reverse lunges."
        elif "back" in q or "spine" in q:
            target = "the lumbar spine"
            fix = "Stop spinal loading under fatigue. Re-establish 360-degree diaphragmatic bracing with the McGill Big 3 (side plank, bird dog) and switch to chest-supported dumbbell work."
        
        return (
            f"{prefix}Listen closely, {ath_name}. Pain is a protective biomechanical signal, not something to push through blindly.\n\n"
            f"â€¢ Triage for {target}: {fix}\n"
            f"â€¢ Execution rule: Control the eccentric tempo with a 3-second descent and a 1-second pause at mechanical reversal.\n\n"
            f"âš ï¸ Medical Protocol: If the sensation is sharp, pinching, or accompanied by joint swelling, cease the exercise immediately and consult a sports physiotherapist."
        )

    # Check for Form Cues & Biomechanics
    if any(k in q for k in ["form", "cue", "cues", "technique", "setup", "valgus", "caving", "round", "flare", "bench", "squat", "deadlift", "rdl"]):
        if "bench" in q:
            return (
                f"{prefix}Bench Press Mechanics for {ath_name}:\n\n"
                f"1. Setup & Scapulae: Retract and depress your shoulder blades into the bench. Arch naturally through thoracic spine while keeping glutes cemented.\n"
                f"2. Bar Path & Elbows: Do not flare out at 90Â°. Tuck elbows to ~45-60Â°, pull the bar down with your lats, and touch the lower sternum.\n"
                f"3. Neural Drive: 'Bend the bar in half' as you press in a slight backward J-curve to lockout over your upper chest."
            )
        elif "squat" in q:
            return (
                f"{prefix}Squat Architecture for {ath_name}:\n\n"
                f"1. Foot Stance: Shoulder-width, toes angled 15-30Â° out. Actively 'spread the floor' with the lateral borders of your shoes to prevent knee valgus.\n"
                f"2. Core Cylinder: Take a deep belly breath and brace against your abdominal wall before breaking hips and knees simultaneously.\n"
                f"3. Depth & Drive: Break parallel with a neutral lumbar spine, then explode upward through midfoot, driving the earth away."
            )
        elif "deadlift" in q or "rdl" in q:
            return (
                f"{prefix}Deadlift / RDL Precision for {ath_name}:\n\n"
                f"1. Bar Proximity: The barbell must remain within 1 inch of your shins throughout the entire ascent.\n"
                f"2. Slack Pull: Squeeze your lats and wedge your hips in until you hear the barbell click against the plates before breaking the floor.\n"
                f"3. Hip Hinge: On RDLs, push your hips directly backward to the wall behind you with soft knees; do not turn it into a squat."
            )
        else:
            return (
                f"{prefix}Lifting precision dictates muscular growth. Focus on the three foundational pillars for '{last_user_msg}':\n\n"
                f"1. Joint Stacking: Align wrists directly over elbows on pushes, and knees strictly over midfoot on squats.\n"
                f"2. Bracing: Create intra-abdominal pressure before initiating the eccentric phase.\n"
                f"3. Time Under Tension: 3 seconds eccentric, explosive concentric with zero momentum."
            )

    # Check for Nutrition / Diet / Protein / Calories
    if any(k in q for k in ["diet", "food", "protein", "calorie", "calories", "macro", "macros", "creatine", "bulk", "cut"]):
        return (
            f"{prefix}Fueling Protocol for {ath_name}:\n\n"
            f"â€¢ Protein Target: Aim for 1.8g to 2.2g of protein per kilogram of body weight (approx. 0.8g-1.0g per lb) divided across 3-4 meals.\n"
            f"â€¢ Caloric Strategy: For a lean surplus (hypertrophy), maintain +250 to +350 kcal above maintenance. For fat loss, keep a controlled -400 to -500 kcal deficit while keeping protein high.\n"
            f"â€¢ Hydration & Supplements: 3-4 liters of water daily plus 5g daily creatine monohydrate. Consistent fuel builds the foundation for PRs on the Cosmic Roadmap."
        )

    # Check for Workout Splits / Routine
    if any(k in q for k in ["split", "routine", "schedule", "program", "ppl", "upper lower", "frequency", "days"]):
        return (
            f"{prefix}Workout Split Recommendation for {ath_name}:\n\n"
            f"â€¢ 4 Days/Week: Upper / Lower split (Mon/Tue/Thu/Fri). Excellent frequency (2x per muscle group) with 3 full recovery days.\n"
            f"â€¢ 5-6 Days/Week: Push / Pull / Legs (PPL). Maximum volume distribution and targeted muscle isolation.\n"
            f"â€¢ Golden Rule: Each muscle group benefits most from 10 to 18 high-quality working sets per week taken to 1-2 Reps in Reserve (RIR). Quality trumps junk volume every time."
        )

    # Default Dynamic Contextual Response
    return (
        f"{prefix}Understood, {ath_name}. Regarding '{last_user_msg}':\n\n"
        f"In Moon Fitness OS, every lift is a stepping stone toward the Maroon Moon Citadel. To conquer your current milestone:\n\n"
        f"1. Target 1-2 Reps in Reserve (RIR 8-9) on your working sets.\n"
        f"2. Implement Double Progression: hit the top of your rep bracket before increasing the load by 2.5kg.\n"
        f"3. Respect your designated rest intervals (90s for accessories, 2-3 min for heavy compounds).\n\n"
        f"Lock in your focus, log the sets cleanly, and let's claim that next streak milestone!"
    )


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
    def __init__(self, *args, **kwargs):
        kwargs["directory"] = APP_DIR
        super().__init__(*args, **kwargs)

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
        if clean.endswith('.apk'):
            return 'application/vnd.android.package-archive'
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
                if 'format' in qs and qs['format'][0] == 'json':
                    bank = float(state.get('scroll_bank', 0.0))
                    if state.get('start_time'):
                        elapsed = max(0.0, time.time() - float(state['start_time'])) / 60.0
                        effective_balance = bank - elapsed
                    else:
                        effective_balance = bank
                    is_focus_blocked = state.get('focus_blocked', False)
                    allowed = (effective_balance > 0) and (not is_focus_blocked)
                    data = {
                        'allowed': allowed,
                        'dmOnly': state.get('dm_only', True),
                        'remainingSeconds': max(0, int(effective_balance * 60)),
                        'focusBlocked': is_focus_blocked,
                        'instantBlock': state.get('instant_block', False),
                        'blockedApps': state.get('blocked_apps', ['youtube_shorts', 'games', 'instagram_reels'])
                    }
                    return self._send(json.dumps(data), ctype='application/json; charset=utf-8')
            except Exception:
                pass

            bank = float(state.get('scroll_bank', 0.0))
            if state.get('start_time'):
                elapsed = max(0.0, time.time() - float(state['start_time'])) / 60.0
                effective_balance = bank - elapsed
            else:
                effective_balance = bank

            is_focus_blocked = state.get('focus_blocked', False)
            resp = 'allowed' if (effective_balance > 0 and not is_focus_blocked) else 'dm_only'
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
        if clean in ('/api/admin-config', '/api/admin/config'):
            return self._send(json.dumps({
                'ok': True,
                'hasAdminCode': bool(ADMIN_ACCESS_CODE),
                'defaultAdmin': 'admin'
            }), ctype='application/json; charset=utf-8')

        if clean in ('/api/auth/config', '/api/auth-config'):
            return self._send(json.dumps({
                'ok': True,
                'supabaseUrl': SUPABASE_URL,
                'supabaseAnonKey': SUPABASE_ANON_KEY,
                'hasSupabase': bool(SUPABASE_URL and SUPABASE_ANON_KEY),
                'provider': 'supabase' if (SUPABASE_URL and SUPABASE_ANON_KEY) else 'live_jwt_backend'
            }), ctype='application/json; charset=utf-8')

        if clean == '/api/auth/session':
            auth_header = self.headers.get('Authorization', '')
            token = ''
            if auth_header.startswith('Bearer '):
                token = auth_header[7:].strip()
            elif 'token=' in self.headers.get('Cookie', ''):
                m = re.search(r'token=([^;]+)', self.headers.get('Cookie', ''))
                if m:
                    token = m.group(1).strip()
            
            payload = verify_jwt_token(token)
            if payload:
                users = []
                if os.path.exists(USERS_FILE):
                    try:
                        with open(USERS_FILE, 'r', encoding='utf-8') as f:
                            users = json.load(f)
                    except Exception:
                        pass
                user_obj = None
                user_id = payload.get('sub')
                username = payload.get('username')
                for u in users:
                    if (user_id and u.get('id') == user_id) or (username and u.get('username') == username):
                        user_obj = u
                        break
                if user_obj:
                    return self._send(json.dumps({
                        'ok': True,
                        'authenticated': True,
                        'user': sanitize_user(user_obj)
                    }), ctype='application/json; charset=utf-8')

            return self._send(json.dumps({
                'ok': False,
                'authenticated': False,
                'error': 'Session expired or invalid JWT token'
            }), code=401, ctype='application/json; charset=utf-8')

        if clean == '/api/leaderboard':
            qs = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            gender_filter = (qs.get('gender') or ['both'])[0].strip().lower()
            users = []
            if os.path.exists(USERS_FILE):
                try:
                    with open(USERS_FILE, 'r', encoding='utf-8') as f:
                        users = json.load(f)
                except Exception:
                    pass
            athletes = []
            for u in users:
                g = u.get('gender', 'male')
                if gender_filter in ('both', '', 'all') or g == gender_filter:
                    athletes.append(sanitize_user(u))
            athletes.sort(key=lambda x: (x.get('totalVolumeKg', 0), x.get('totalWorkouts', 0)), reverse=True)
            return self._send(json.dumps({
                'ok': True,
                'athletes': athletes,
                'count': len(athletes)
            }), ctype='application/json; charset=utf-8')

        if clean == '/api/users':
            if os.path.exists(USERS_FILE):
                try:
                    with open(USERS_FILE, 'r', encoding='utf-8') as f:
                        return self._send(f.read(), ctype='application/json; charset=utf-8')
                except Exception:
                    pass
            return self._send('[]', ctype='application/json; charset=utf-8')

        if clean == '/api/announcement':
            if os.path.exists(ANNOUNCEMENT_FILE):
                try:
                    with open(ANNOUNCEMENT_FILE, 'r', encoding='utf-8') as f:
                        return self._send(f.read(), ctype='application/json; charset=utf-8')
                except Exception:
                    pass
            return self._send('{"message":""}', ctype='application/json; charset=utf-8')

        if clean == '/api/download/android':
            apk_path = None
            for name in ('downloads/moon-fitness.apk', 'moon-fitness-release.apk', 'moon-fitness-v1.0-release.apk'):
                cand = os.path.join(APP_DIR, name)
                if os.path.isfile(cand):
                    apk_path = cand
                    break
            if not apk_path:
                return self._send(json.dumps({'ok': False, 'error': 'APK build not available'}),
                                  code=404, ctype='application/json; charset=utf-8')
            size = os.path.getsize(apk_path)
            self.send_response(200)
            self.send_header('Content-Type', 'application/vnd.android.package-archive')
            self.send_header('Content-Disposition', 'attachment; filename="moon-fitness.apk"')
            self.send_header('Content-Length', str(size))
            self.send_header('Cache-Control', 'no-store')
            self.send_header('X-Content-Type-Options', 'nosniff')
            self.end_headers()
            with open(apk_path, 'rb') as f:
                while True:
                    chunk = f.read(65536)
                    if not chunk:
                        break
                    self.wfile.write(chunk)
            return

        if clean == '/api/distribution':
            # Public web URL: PUBLIC_URL env var wins; otherwise derive from the request,
            # swapping localhost for the LAN IP so phones can actually reach it.
            public = os.environ.get('PUBLIC_URL', '').strip().rstrip('/')
            if not public:
                host = (self.headers.get('X-Forwarded-Host') or self.headers.get('Host') or '').strip()
                proto = self.headers.get('X-Forwarded-Proto') or ('https' if isinstance(self.connection, ssl.SSLSocket) else 'http')
                hostname = host.split(':')[0].lower()
                if not host or hostname in ('localhost', '127.0.0.1', '::1'):
                    public = f'http://{get_lan_ip()}:{PORT}'
                else:
                    public = f'{proto}://{host}'
            apk_ready = any(os.path.isfile(os.path.join(APP_DIR, n)) for n in ('downloads/moon-fitness.apk', 'moon-fitness-release.apk'))
            return self._send(json.dumps({
                'ok': True,
                'androidUrl': f'{public}/downloads/moon-fitness.apk',
                'iosUrl': f'{public}/',
                'apkAvailable': apk_ready
            }), ctype='application/json; charset=utf-8')

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
        if clean in ('/startup.mp3', '/audio/startup.mp3'):
            mp3_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'startup.mp3')
            if os.path.exists(mp3_path):
                try:
                    with open(mp3_path, 'rb') as f:
                        data = f.read()
                    self.send_response(200)
                    self.send_header('Content-Type', 'audio/mpeg')
                    self.send_header('Content-Length', str(len(data)))
                    self.send_header('Accept-Ranges', 'bytes')
                    self.send_header('Cache-Control', 'public, max-age=86400')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    return self.wfile.write(data)
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
                if 'focusBlocked' in body:
                    state['focus_blocked'] = bool(body['focusBlocked'])
                if 'instantActive' in body:
                    state['instant_block'] = bool(body['instantActive'])
                if 'blockedApps' in body:
                    state['blocked_apps'] = list(body['blockedApps'])
                if 'dmOnly' in body:
                    state['dm_only'] = bool(body['dmOnly'])
                save_state(state)
            except Exception:
                pass

            bank = float(state.get('scroll_bank', 0.0))
            is_blocked = state.get('focus_blocked', False) or (bank <= 0)
            resp = 'dm_only' if is_blocked else 'allowed'
            return self._send(resp, ctype='text/plain; charset=utf-8')

        if clean == '/api/coach-chat':
            try:
                n = int(self.headers.get('Content-Length', 0))
                payload = json.loads(self.rfile.read(n) or b'{}')
                messages = payload.get('messages', [])
                coach = payload.get('coach', {})
                athlete = payload.get('athlete', {})
                result = call_ai_coach_api(messages, coach, athlete)
                return self._send(json.dumps(result), ctype='application/json; charset=utf-8')
            except Exception as e:
                print(f"[AI Coach] Error in /api/coach-chat: {e}")
                return self._send(json.dumps({
                    'ok': False,
                    'error': str(e),
                    'reply': "âš ï¸ Coach network link interrupted. Re-centering focus... What was your target exercise?"
                }), code=200, ctype='application/json; charset=utf-8')

        if clean in ('/api/auth/admin-override', '/api/admin/override'):
            try:
                n = int(self.headers.get('Content-Length', 0))
                payload = json.loads(self.rfile.read(n) or b'{}')
                code = payload.get('code') or payload.get('accessCode') or payload.get('password') or ''
                username = (payload.get('username') or payload.get('identifier') or 'admin').strip().lower()

                if verify_admin_passcode(code):
                    users = []
                    if os.path.exists(USERS_FILE):
                        try:
                            with open(USERS_FILE, 'r', encoding='utf-8') as f:
                                users = json.load(f)
                        except Exception:
                            pass
                    
                    found = False
                    user_obj = None
                    for u in users:
                        if u.get('username', '').lower() == username or (username == 'admin' and u.get('role') == 'Admin'):
                            u['role'] = 'Admin'
                            u['isAdmin'] = True
                            found = True
                            user_obj = u
                            break
                    if not found:
                        user_obj = {
                            'id': f'usr_admin_{int(time.time())}',
                            'username': username if username else 'admin',
                            'displayName': username.title() if username else 'Citadel Architect',
                            'email': f'{username}@moonfitness.os',
                            'password': hash_password('admin'),
                            'gender': 'male',
                            'role': 'Admin',
                            'isAdmin': True,
                            'aiCoach': 'Nurv',
                            'avatar': 'ðŸ‘‘',
                            'joinedDate': time.strftime('%Y-%m-%d'),
                            'totalWorkouts': 0,
                            'totalVolumeKg': 0,
                            'rankTier': 'Olympian',
                            'prs': {}
                        }
                        users.insert(0, user_obj)

                    with open(USERS_FILE, 'w', encoding='utf-8') as f:
                        json.dump(users, f, indent=2)

                    jwt_token = create_jwt_token({
                        'sub': user_obj.get('id', 'usr_admin'),
                        'username': user_obj.get('username', 'admin'),
                        'role': 'Admin',
                        'isAdmin': True,
                        'gender': user_obj.get('gender', 'male')
                    })

                    return self._send(json.dumps({
                        'ok': True,
                        'authenticated': True,
                        'isAdmin': True,
                        'role': 'Admin',
                        'token': jwt_token,
                        'user': sanitize_user(user_obj),
                        'message': 'Admin backdoor verified. Obsidian Citadel access granted.'
                    }), ctype='application/json; charset=utf-8')
                else:
                    return self._send(json.dumps({
                        'ok': False,
                        'authenticated': False,
                        'error': 'Invalid Admin Access Passcode.'
                    }), code=401, ctype='application/json; charset=utf-8')
            except Exception as e:
                return self._send(json.dumps({'ok': False, 'error': str(e)}), code=500, ctype='application/json; charset=utf-8')

        if clean == '/api/auth/signup':
            try:
                n = int(self.headers.get('Content-Length', 0))
                payload = json.loads(self.rfile.read(n) or b'{}')
                username = (payload.get('username') or '').strip().lower()
                display_name = (payload.get('displayName') or payload.get('name') or username).strip()
                password = payload.get('password') or ''
                gender = (payload.get('gender') or 'male').strip().lower()
                if gender not in ('male', 'female'):
                    gender = 'male'
                ai_coach = (payload.get('aiCoach') or payload.get('coach') or 'Nurv').strip()
                admin_secret = payload.get('adminSecret') or payload.get('accessCode') or ''

                if not username or len(username) < 3:
                    return self._send(json.dumps({'ok': False, 'error': 'Username must be at least 3 characters.'}), code=400, ctype='application/json; charset=utf-8')
                if not password or len(password) < 4:
                    return self._send(json.dumps({'ok': False, 'error': 'Password must be at least 4 characters.'}), code=400, ctype='application/json; charset=utf-8')

                users = []
                if os.path.exists(USERS_FILE):
                    try:
                        with open(USERS_FILE, 'r', encoding='utf-8') as f:
                            users = json.load(f)
                    except Exception:
                        pass

                for u in users:
                    if u.get('username', '').lower() == username:
                        return self._send(json.dumps({'ok': False, 'error': f'Username "@{username}" is already taken.'}), code=409, ctype='application/json; charset=utf-8')

                is_admin = verify_admin_passcode(password) or verify_admin_passcode(admin_secret) or payload.get('role') == 'Admin'
                new_user = {
                    'id': f'usr_{int(time.time())}_{secrets.token_hex(4)}',
                    'username': username,
                    'displayName': display_name if display_name else username.title(),
                    'email': payload.get('email') or f'{username}@moonfitness.os',
                    'password': hash_password(password),
                    'gender': gender,
                    'role': 'Admin' if is_admin else 'Standard',
                    'isAdmin': is_admin,
                    'aiCoach': 'Maryam' if (ai_coach.lower() in ('m', 'maryam')) else 'Nurv',
                    'avatar': 'ðŸ‘‘' if is_admin else ('â™€' if gender == 'female' else 'â™‚'),
                    'joinedDate': time.strftime('%Y-%m-%d'),
                    'totalWorkouts': 0,
                    'totalVolumeKg': 0,
                    'rankTier': 'Olympian' if is_admin else 'Bronze',
                    'prs': {}
                }

                users.insert(0, new_user)
                with open(USERS_FILE, 'w', encoding='utf-8') as f:
                    json.dump(users, f, indent=2)

                jwt_token = create_jwt_token({
                    'sub': new_user['id'],
                    'username': new_user['username'],
                    'role': new_user['role'],
                    'isAdmin': new_user['isAdmin'],
                    'gender': new_user['gender']
                })

                return self._send(json.dumps({
                    'ok': True,
                    'token': jwt_token,
                    'user': sanitize_user(new_user),
                    'message': 'Account registered successfully.'
                }), ctype='application/json; charset=utf-8')
            except Exception as e:
                return self._send(json.dumps({'ok': False, 'error': str(e)}), code=500, ctype='application/json; charset=utf-8')

        if clean == '/api/auth/login':
            try:
                n = int(self.headers.get('Content-Length', 0))
                payload = json.loads(self.rfile.read(n) or b'{}')
                identifier = (payload.get('identifier') or payload.get('username') or '').strip().lower()
                password = payload.get('password') or ''
                access_code = payload.get('accessCode') or payload.get('code') or ''

                # Admin backdoor bypass
                if verify_admin_passcode(password) or verify_admin_passcode(access_code) or verify_admin_passcode(identifier):
                    # Redirect to admin-override logic
                    pass_code = password if verify_admin_passcode(password) else (access_code if verify_admin_passcode(access_code) else identifier)
                    users = []
                    if os.path.exists(USERS_FILE):
                        try:
                            with open(USERS_FILE, 'r', encoding='utf-8') as f:
                                users = json.load(f)
                        except Exception:
                            pass
                    user_obj = None
                    target_name = identifier if (identifier and not verify_admin_passcode(identifier)) else 'admin'
                    for u in users:
                        if u.get('username', '').lower() == target_name or (target_name == 'admin' and u.get('role') == 'Admin'):
                            u['role'] = 'Admin'
                            u['isAdmin'] = True
                            user_obj = u
                            break
                    if not user_obj:
                        user_obj = {
                            'id': f'usr_admin_{int(time.time())}',
                            'username': target_name,
                            'displayName': target_name.title(),
                            'email': f'{target_name}@moonfitness.os',
                            'password': hash_password('admin'),
                            'gender': 'male',
                            'role': 'Admin',
                            'isAdmin': True,
                            'aiCoach': 'Nurv',
                            'avatar': 'ðŸ‘‘',
                            'joinedDate': time.strftime('%Y-%m-%d'),
                            'totalWorkouts': 0,
                            'totalVolumeKg': 0,
                            'rankTier': 'Olympian',
                            'prs': {}
                        }
                        users.insert(0, user_obj)
                    with open(USERS_FILE, 'w', encoding='utf-8') as f:
                        json.dump(users, f, indent=2)

                    token = create_jwt_token({
                        'sub': user_obj['id'],
                        'username': user_obj['username'],
                        'role': 'Admin',
                        'isAdmin': True,
                        'gender': user_obj.get('gender', 'male')
                    })
                    return self._send(json.dumps({
                        'ok': True,
                        'token': token,
                        'user': sanitize_user(user_obj),
                        'isAdmin': True,
                        'role': 'Admin'
                    }), ctype='application/json; charset=utf-8')

                # Standard user authentication
                if not identifier or not password:
                    return self._send(json.dumps({'ok': False, 'error': 'Username/email and password required.'}), code=400, ctype='application/json; charset=utf-8')

                users = []
                if os.path.exists(USERS_FILE):
                    try:
                        with open(USERS_FILE, 'r', encoding='utf-8') as f:
                            users = json.load(f)
                    except Exception:
                        pass

                matched_user = None
                for u in users:
                    if u.get('username', '').lower() == identifier or (u.get('email', '').lower() == identifier):
                        matched_user = u
                        break

                if not matched_user:
                    return self._send(json.dumps({'ok': False, 'error': f'No athlete found with username or email "{identifier}".'}), code=404, ctype='application/json; charset=utf-8')

                if not verify_password(password, matched_user.get('password', '')):
                    return self._send(json.dumps({'ok': False, 'error': 'Incorrect password.'}), code=401, ctype='application/json; charset=utf-8')

                jwt_token = create_jwt_token({
                    'sub': matched_user['id'],
                    'username': matched_user['username'],
                    'role': matched_user.get('role', 'Standard'),
                    'isAdmin': matched_user.get('isAdmin', False),
                    'gender': matched_user.get('gender', 'male')
                })

                return self._send(json.dumps({
                    'ok': True,
                    'token': jwt_token,
                    'user': sanitize_user(matched_user)
                }), ctype='application/json; charset=utf-8')
            except Exception as e:
                return self._send(json.dumps({'ok': False, 'error': str(e)}), code=500, ctype='application/json; charset=utf-8')

        if clean == '/api/auth/logout':
            return self._send(json.dumps({'ok': True, 'message': 'Logged out successfully.'}), ctype='application/json; charset=utf-8')

        if clean == '/api/users':
            try:
                n = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(n)
                with open(USERS_FILE, 'wb') as f:
                    f.write(body)
                return self._send('{"status":"ok"}', ctype='application/json; charset=utf-8')
            except Exception as e:
                return self._send(f'{{"error":"{e}"}}', code=500, ctype='application/json; charset=utf-8')

        if clean == '/api/announcement':
            try:
                n = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(n)
                with open(ANNOUNCEMENT_FILE, 'wb') as f:
                    f.write(body)
                return self._send('{"status":"ok"}', ctype='application/json; charset=utf-8')
            except Exception as e:
                return self._send(f'{{"error":"{e}"}}', code=500, ctype='application/json; charset=utf-8')

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
    print("   âš¡ MOON FITNESS TRACKER - LOCAL SERVER RUNNING âš¡")
    print("=" * 64)
    print(f"\nðŸ–¥ï¸  On this Computer:   {local_url}")
    print("ðŸ“±  On your iPhone - try each address until one loads:")
    for ip in all_ips:
        print(f"      http://{ip}:{PORT}")
    print()
    if https_port:
        print("ðŸ“·  CAMERA TRACKING needs HTTPS. On the iPhone open (accept the")
        print("    certificate warning once: Show Details > visit this website):")
        for ip in all_ips:
            print(f"      https://{ip}:{https_port}")
    else:
        print("âš ï¸  HTTPS unavailable (run: pip install cryptography). Camera works on this PC only.")
    print()
    print("=" * 64)
    print("  HOW TO DOWNLOAD & INSTALL ON YOUR iPHONE:")
    print("  1. Make sure your iPhone is connected to the SAME Wi-Fi.")
    print(f"  2. Open Safari on iPhone and type:  {iphone_url}")
    print("  3. Tap the Share button (square with arrow up âŽ‹).")
    print("  4. Scroll down and tap 'Add to Home Screen' (+).")
    print("  5. Tap 'Add' in the top right corner.")
    print("  --> Moon is now installed on your iPhone like a native app!")
    print("=" * 64)
    print("Press Ctrl+C to stop the server anytime.\n")

    if os.environ.get('MOON_HEADLESS') != '1' and hasattr(sys.stdout, 'isatty') and sys.stdout.isatty():
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
