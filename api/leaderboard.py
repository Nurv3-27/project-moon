from http.server import BaseHTTPRequestHandler
import json
import urllib.parse
import os
import sys

current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from _auth import load_users, sanitize_user, send_response_json, handle_cors_options

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        handle_cors_options(self)

    def do_GET(self):
        qs = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        gender_filter = (qs.get('gender') or ['both'])[0].strip().lower()
        users = load_users()
        athletes = []
        for u in users:
            g = u.get('gender', 'male')
            if gender_filter in ('both', '', 'all') or g == gender_filter:
                athletes.append(sanitize_user(u))
        athletes.sort(key=lambda x: (x.get('totalVolumeKg', 0), x.get('totalWorkouts', 0)), reverse=True)
        return send_response_json(self, {
            'ok': True,
            'athletes': athletes,
            'count': len(athletes)
        })

