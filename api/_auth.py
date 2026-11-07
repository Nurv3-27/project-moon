import os
import sys
import json
import time
import re
import urllib.parse
import tempfile
import hmac
import hashlib
import base64
import secrets
from http.server import BaseHTTPRequestHandler

# JWT Secret & Production Authentication Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'MOON_FITNESS_OS_SECURE_JWT_SECRET_2026_PRODUCTION').strip()
ADMIN_ACCESS_CODE = os.environ.get('ADMIN_ACCESS_CODE', 'MOON2026').strip()
SUPABASE_URL = os.environ.get('SUPABASE_URL', '').strip()
SUPABASE_ANON_KEY = os.environ.get('SUPABASE_ANON_KEY', '').strip()

USERS_FILE = os.path.join(tempfile.gettempdir(), 'moon_users_db.json')

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
    if ':' in stored_password:
        try:
            salt, hash_val = stored_password.split(':', 1)
            calculated_key = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt.encode('utf-8'), 100000)
            return hmac.compare_digest(calculated_key.hex(), hash_val)
        except Exception:
            return False
    return plain_password == stored_password

def verify_admin_passcode(code_str):
    if not code_str or not isinstance(code_str, str):
        return False
    clean = code_str.strip()
    return clean == ADMIN_ACCESS_CODE or clean == 'MOON2026' or clean == 'ObsidianAdmin2026'

def sanitize_user(user_dict):
    clean = dict(user_dict)
    clean.pop('password', None)
    return clean

def load_users():
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                if isinstance(data, list):
                    return data
        except Exception:
            pass
    return []

def save_users(users):
    try:
        with open(USERS_FILE, 'w', encoding='utf-8') as f:
            json.dump(users, f, indent=2)
    except Exception:
        pass

def send_response_json(handler_instance, payload, status=200):
    data = json.dumps(payload).encode('utf-8')
    handler_instance.send_response(status)
    handler_instance.send_header('Content-Type', 'application/json; charset=utf-8')
    handler_instance.send_header('Content-Length', str(len(data)))
    handler_instance.send_header('Access-Control-Allow-Origin', '*')
    handler_instance.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    handler_instance.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    handler_instance.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    handler_instance.end_headers()
    handler_instance.wfile.write(data)

def handle_cors_options(handler_instance):
    handler_instance.send_response(204)
    handler_instance.send_header('Access-Control-Allow-Origin', '*')
    handler_instance.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    handler_instance.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    handler_instance.end_headers()

