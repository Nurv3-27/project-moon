import os
import json
import time
import tempfile

STATE_FILE = os.path.join(tempfile.gettempdir(), 'moon_scroll_bank.json')

def load_state():
    defaults = {
        'scroll_bank': 0.0,          # scroll bank balance in minutes
        'start_time': None,           # session start timestamp (seconds epoch)
        'last_elapsed_minutes': 0.0,  # minutes deducted in last stop
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

