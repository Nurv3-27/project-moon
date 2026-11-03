from http.server import BaseHTTPRequestHandler
import json
import time
import os
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
        self._handle_stop()

    def do_POST(self):
        self._handle_stop()

    def _handle_stop(self):
        state = load_state()
        now = time.time()
        start = state.get('start_time')

        if start:
            elapsed_seconds = max(0.0, now - float(start))
            elapsed_minutes = elapsed_seconds / 60.0
            current_bank = float(state.get('scroll_bank', 0.0))
            new_bank = max(0.0, current_bank - elapsed_minutes)

            state['scroll_bank'] = round(new_bank, 2)
            state['start_time'] = None
            state['last_elapsed_minutes'] = round(elapsed_minutes, 2)
            save_state(state)
            return self._send_text(f"stopped: deducted {elapsed_minutes:.2f} min, balance: {new_bank:.2f} min")
        else:
            current_bank = float(state.get('scroll_bank', 0.0))
            return self._send_text(f"stopped: no active session, balance: {current_bank:.2f} min")

