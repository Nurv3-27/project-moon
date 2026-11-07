from http.server import BaseHTTPRequestHandler
import json
import time
import re
import secrets
import urllib.parse
import os
import sys

# Ensure local imports work whether run from project root or api/ directory
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from _auth import (
    load_users, save_users, sanitize_user,
    create_jwt_token, verify_jwt_token,
    hash_password, verify_password, verify_admin_passcode,
    send_response_json, handle_cors_options,
    SUPABASE_URL, SUPABASE_ANON_KEY
)

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        handle_cors_options(self)

    def do_GET(self):
        path = self.path.split('?')[0].rstrip('/')
        
        # 1. /api/auth/config
        if path.endswith('/config') or path.endswith('/auth-config'):
            return send_response_json(self, {
                'ok': True,
                'supabaseUrl': SUPABASE_URL,
                'supabaseAnonKey': SUPABASE_ANON_KEY,
                'hasSupabase': bool(SUPABASE_URL and SUPABASE_ANON_KEY),
                'provider': 'supabase' if (SUPABASE_URL and SUPABASE_ANON_KEY) else 'live_jwt_backend'
            })

        # 2. /api/auth/session
        if path.endswith('/session'):
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
                users = load_users()
                user_obj = None
                user_id = payload.get('sub')
                username = payload.get('username')
                for u in users:
                    if (user_id and u.get('id') == user_id) or (username and u.get('username') == username):
                        user_obj = u
                        break
                if user_obj:
                    return send_response_json(self, {
                        'ok': True,
                        'authenticated': True,
                        'user': sanitize_user(user_obj)
                    })

            return send_response_json(self, {
                'ok': False,
                'authenticated': False,
                'error': 'Session expired or invalid JWT token'
            }, status=401)

        # Default fallback
        return send_response_json(self, {'ok': False, 'error': f'Route not found: {self.path}'}, status=404)

    def do_POST(self):
        path = self.path.split('?')[0].rstrip('/')

        try:
            n = int(self.headers.get('Content-Length', 0))
            payload = json.loads(self.rfile.read(n) or b'{}')
        except Exception:
            payload = {}

        # 1. /api/auth/signup
        if path.endswith('/signup'):
            username = (payload.get('username') or '').strip().lower()
            display_name = (payload.get('displayName') or payload.get('name') or username).strip()
            password = payload.get('password') or ''
            gender = (payload.get('gender') or 'male').strip().lower()
            if gender not in ('male', 'female'):
                gender = 'male'
            ai_coach = (payload.get('aiCoach') or payload.get('coach') or 'Nurv').strip()
            admin_secret = payload.get('adminSecret') or payload.get('accessCode') or ''

            if not username or len(username) < 3:
                return send_response_json(self, {'ok': False, 'error': 'Username must be at least 3 characters.'}, status=400)
            if not password or len(password) < 4:
                return send_response_json(self, {'ok': False, 'error': 'Password must be at least 4 characters.'}, status=400)

            users = load_users()
            for u in users:
                if u.get('username', '').lower() == username:
                    return send_response_json(self, {'ok': False, 'error': f'Username "@{username}" is already taken.'}, status=409)

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
                'avatar': '👑' if is_admin else ('♀' if gender == 'female' else '♂'),
                'joinedDate': time.strftime('%Y-%m-%d'),
                'totalWorkouts': 0,
                'totalVolumeKg': 0,
                'rankTier': 'Olympian' if is_admin else 'Bronze',
                'prs': {}
            }

            users.insert(0, new_user)
            save_users(users)

            jwt_token = create_jwt_token({
                'sub': new_user['id'],
                'username': new_user['username'],
                'role': new_user['role'],
                'isAdmin': new_user['isAdmin'],
                'gender': new_user['gender']
            })

            return send_response_json(self, {
                'ok': True,
                'token': jwt_token,
                'user': sanitize_user(new_user),
                'message': 'Account registered successfully.'
            })

        # 2. /api/auth/login
        if path.endswith('/login'):
            identifier = (payload.get('identifier') or payload.get('username') or '').strip().lower()
            password = payload.get('password') or ''
            access_code = payload.get('accessCode') or payload.get('code') or ''

            # Admin backdoor bypass
            if verify_admin_passcode(password) or verify_admin_passcode(access_code) or verify_admin_passcode(identifier):
                users = load_users()
                target_name = identifier if (identifier and not verify_admin_passcode(identifier)) else 'admin'
                user_obj = None
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
                        'avatar': '👑',
                        'joinedDate': time.strftime('%Y-%m-%d'),
                        'totalWorkouts': 0,
                        'totalVolumeKg': 0,
                        'rankTier': 'Olympian',
                        'prs': {}
                    }
                    users.insert(0, user_obj)
                save_users(users)

                token = create_jwt_token({
                    'sub': user_obj['id'],
                    'username': user_obj['username'],
                    'role': 'Admin',
                    'isAdmin': True,
                    'gender': user_obj.get('gender', 'male')
                })
                return send_response_json(self, {
                    'ok': True,
                    'token': token,
                    'user': sanitize_user(user_obj),
                    'isAdmin': True,
                    'role': 'Admin'
                })

            if not identifier or not password:
                return send_response_json(self, {'ok': False, 'error': 'Username/email and password required.'}, status=400)

            users = load_users()
            matched_user = None
            for u in users:
                if u.get('username', '').lower() == identifier or (u.get('email', '').lower() == identifier):
                    matched_user = u
                    break

            if not matched_user:
                return send_response_json(self, {'ok': False, 'error': f'No athlete found with username or email "{identifier}".'}, status=404)

            if not verify_password(password, matched_user.get('password', '')):
                return send_response_json(self, {'ok': False, 'error': 'Incorrect password.'}, status=401)

            jwt_token = create_jwt_token({
                'sub': matched_user['id'],
                'username': matched_user['username'],
                'role': matched_user.get('role', 'Standard'),
                'isAdmin': matched_user.get('isAdmin', False),
                'gender': matched_user.get('gender', 'male')
            })

            return send_response_json(self, {
                'ok': True,
                'token': jwt_token,
                'user': sanitize_user(matched_user)
            })

        # 3. /api/auth/logout
        if path.endswith('/logout'):
            return send_response_json(self, {'ok': True, 'message': 'Logged out successfully.'})

        # 4. /api/auth/admin-override
        if path.endswith('/admin-override'):
            pass_code = (payload.get('passcode') or payload.get('code') or payload.get('password') or '').strip()
            if not verify_admin_passcode(pass_code):
                return send_response_json(self, {'ok': False, 'error': 'Invalid administrator access key.'}, status=403)
            
            users = load_users()
            target_user = None
            for u in users:
                if u.get('role') == 'Admin' or u.get('username') == 'admin':
                    target_user = u
                    break
            if not target_user:
                target_user = {
                    'id': f'usr_admin_{int(time.time())}',
                    'username': 'admin',
                    'displayName': 'Obsidian Commander',
                    'email': 'admin@moonfitness.os',
                    'gender': 'male',
                    'role': 'Admin',
                    'isAdmin': True,
                    'aiCoach': 'Nurv',
                    'avatar': '👑',
                    'joinedDate': time.strftime('%Y-%m-%d'),
                    'totalWorkouts': 0,
                    'totalVolumeKg': 0,
                    'rankTier': 'Olympian',
                    'prs': {}
                }
                users.insert(0, target_user)
                save_users(users)

            jwt_token = create_jwt_token({
                'sub': target_user['id'],
                'username': target_user['username'],
                'role': 'Admin',
                'isAdmin': True
            })

            return send_response_json(self, {
                'ok': True,
                'token': jwt_token,
                'user': sanitize_user(target_user),
                'role': 'Admin',
                'isAdmin': True
            })

        return send_response_json(self, {'ok': False, 'error': f'Route not found: {self.path}'}, status=404)

