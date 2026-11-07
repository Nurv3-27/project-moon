from http.server import BaseHTTPRequestHandler
import json
import os
import sys

current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from _auth import USERS_FILE, load_users, save_users, send_response_json, handle_cors_options

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        handle_cors_options(self)

    def do_GET(self):
        users = load_users()
        return send_response_json(self, users)

    def do_POST(self):
        try:
            n = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(n)
            with open(USERS_FILE, 'wb') as f:
                f.write(body)
            return send_response_json(self, {'status': 'ok'})
        except Exception as e:
            return send_response_json(self, {'error': str(e)}, status=500)

