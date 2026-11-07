from http.server import BaseHTTPRequestHandler
import json
import os
import sys

current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from _auth import send_response_json, handle_cors_options

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        handle_cors_options(self)

    def do_GET(self):
        # Determine public host URL
        public = os.environ.get('PUBLIC_URL', '').strip().rstrip('/')
        if not public:
            host = (self.headers.get('X-Forwarded-Host') or self.headers.get('Host') or '').strip()
            proto = self.headers.get('X-Forwarded-Proto') or 'https'
            if host:
                public = f'{proto}://{host}'
            else:
                public = ''

        base = public if public else ''
        return send_response_json(self, {
            'ok': True,
            'androidUrl': f'{base}/downloads/moon-fitness.apk',
            'iosUrl': f'{base}/' if base else '/',
            'apkAvailable': True
        })
