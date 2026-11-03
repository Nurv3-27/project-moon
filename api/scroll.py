from http.server import BaseHTTPRequestHandler
import json
import time

# In-memory state for warm serverless instances
SCROLL = {'until': 0.0, 'dm_only': True, 'active': True}


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
        # Forced to return exact plain-text 'dm_only' for iOS Shortcut verification
        return self._send_text('dm_only')

    def do_POST(self):
        try:
            length = int(self.headers.get('Content-Length', '0'))
            raw = self.rfile.read(length) if length > 0 else b'{}'
            body = json.loads(raw.decode('utf-8') or '{}')
            if 'until' in body:
                SCROLL['until'] = float(body.get('until') or 0) / 1000.0
            if 'dmOnly' in body:
                SCROLL['dm_only'] = bool(body.get('dmOnly'))
            if 'antiScrollActive' in body:
                SCROLL['active'] = bool(body.get('antiScrollActive'))
        except Exception:
            pass
        return self._send_text('dm_only')
