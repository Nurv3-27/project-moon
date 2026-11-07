import os
import sys

# Add parent directory to sys.path so it can find api.auth and api._auth
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from auth import handler

