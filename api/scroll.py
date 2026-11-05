from http.server import BaseHTTPRequestHandler
import json
import time
import os
import urllib.parse
import tempfile

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


class handler(BaseHTTPRequestHandler):
    def _send_text(self, body, status=200):
        data = body.encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'text/plain; charset=utf-8')
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(data)

    def _send_json(self, payload, status=200):
        data = json.dumps(payload).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(data)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        state = load_state()
        qs = {}

        # Allow query parameters for quick testing/setting (e.g. /api/scroll?set=10 or /api/scroll?reset=0)
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

        # Calculate effective balance if an active session is currently running
        current_bank = float(state.get('scroll_bank', 0.0))
        start_time = state.get('start_time')
        if start_time:
            elapsed_minutes = max(0.0, time.time() - float(start_time)) / 60.0
            effective_balance = current_bank - elapsed_minutes
        else:
            effective_balance = current_bank

        is_focus_blocked = state.get('focus_blocked', False)
        is_allowed = (effective_balance > 0) and (not is_focus_blocked)

        if 'format' in qs and qs['format'][0] == 'json':
            return self._send_json({
                'allowed': is_allowed,
                'dmOnly': state.get('dm_only', True),
                'remainingSeconds': max(0, int(effective_balance * 60)),
                'scrollBankMinutes': max(0.0, round(effective_balance, 2)),
                'focusBlocked': is_focus_blocked,
                'instantBlock': state.get('instant_block', False),
                'blockedApps': state.get('blocked_apps', ['youtube_shorts', 'games', 'instagram_reels'])
            })

        # Requirement 3: if scroll_bank balance > 0 -> 'allowed', if <= 0 -> 'dm_only'
        if is_allowed:
            return self._send_text('allowed')
        else:
            return self._send_text('dm_only')

    def do_POST(self):
        state = load_state()
        try:
            length = int(self.headers.get('Content-Length', '0'))
            raw = self.rfile.read(length) if length > 0 else b'{}'
            body = json.loads(raw.decode('utf-8') or '{}')

            # Sync from frontend app or API client
            if 'remainingSeconds' in body:
                # App sends remainingSeconds from its workout tracker
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

        # Return status based on updated scroll bank
        if float(state.get('scroll_bank', 0.0)) > 0:
            return self._send_text('allowed')
        else:
            return self._send_text('dm_only')
