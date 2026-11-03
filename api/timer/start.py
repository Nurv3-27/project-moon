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

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        self._handle_start()

    def do_POST(self):
        self._handle_start()

    def _handle_start(self):
        state = load_state()
        now = time.time()
        state['start_time'] = now

        # Optional query param to set or credit bank for testing (e.g. ?bank=10)
        try:
            qs = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            if 'bank' in qs:
                state['scroll_bank'] = float(qs['bank'][0])
            elif 'set' in qs:
                state['scroll_bank'] = float(qs['set'][0])
        except Exception:
            pass

        # Optional POST JSON payload
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if length > 0:
                raw = self.rfile.read(length)
                body = json.loads(raw.decode('utf-8') or '{}')
                if 'bank' in body:
                    state['scroll_bank'] = float(body['bank'])
                elif 'scroll_bank' in body:
                    state['scroll_bank'] = float(body['scroll_bank'])
        except Exception:
            pass

        save_state(state)
        return self._send_text('started')
