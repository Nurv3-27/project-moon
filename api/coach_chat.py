from http.server import BaseHTTPRequestHandler
import json
import os
import sys
import urllib.request
import urllib.parse

current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from _auth import send_response_json, handle_cors_options

def call_ai_coach_api(messages, coach=None, athlete=None):
    coach = coach or {}
    athlete = athlete or {}
    coach_name = coach.get('name') or 'Coach Nurv'
    coach_gender = coach.get('gender') or 'male'
    ath_name = athlete.get('displayName') or 'Athlete'

    gemini_key = os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY')
    openai_key = os.environ.get('OPENAI_API_KEY')

    system_prompt = (
        f"You are {coach_name}, an elite athletic AI coach in the futuristic Moon Fitness OS PWA.\n"
        f"Coach Persona: {'Coach Nurv (Male): Titan Bio-Strategist. Intense, authoritative, biomechanically ruthless. Champions heavy compound lifting, mechanical tension, intra-abdominal bracing, and strict progressive overload.' if coach_gender == 'male' else 'Coach Maryam (Female): Valkyrie Precision Architect. Sophisticated, biomechanically exact, focused on posterior chain symmetry, tempo control, joint health, and aesthetic athletic density.'}\n"
        f"Athlete: {ath_name}. Always provide direct, contextual, and actionable guidance for the user's specific inquiry. Break advice into clear biomechanical cues or steps. Keep answers concise, high-impact, and motivating. If pain is reported, always include a joint protection modification and advise consulting a medical professional for severe pain."
    )

    # 1. Try Google Gemini API
    if gemini_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            gemini_contents = []
            for m in messages:
                role = 'user' if m.get('role') == 'user' else 'model'
                gemini_contents.append({
                    "role": role,
                    "parts": [{"text": m.get('text', '')}]
                })
            req_body = json.dumps({
                "system_instruction": {"parts": [{"text": system_prompt}]},
                "contents": gemini_contents,
                "generationConfig": {"temperature": 0.7, "maxOutputTokens": 450}
            }).encode('utf-8')
            req = urllib.request.Request(url, data=req_body, headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=12) as response:
                res_data = json.loads(response.read().decode('utf-8'))
                reply = res_data['candidates'][0]['content']['parts'][0]['text']
                return {'ok': True, 'reply': reply, 'model': 'gemini-1.5-flash'}
        except Exception:
            pass

    # 2. Try OpenAI API
    if openai_key:
        try:
            url = "https://api.openai.com/v1/chat/completions"
            oai_messages = [{"role": "system", "content": system_prompt}]
            for m in messages:
                role = 'user' if m.get('role') == 'user' else 'assistant'
                oai_messages.append({"role": role, "content": m.get('text', '')})
            req_body = json.dumps({
                "model": "gpt-4o-mini",
                "messages": oai_messages,
                "temperature": 0.7,
                "max_tokens": 450
            }).encode('utf-8')
            req = urllib.request.Request(url, data=req_body, headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {openai_key}'
            })
            with urllib.request.urlopen(req, timeout=12) as response:
                res_data = json.loads(response.read().decode('utf-8'))
                reply = res_data['choices'][0]['message']['content']
                return {'ok': True, 'reply': reply, 'model': 'gpt-4o-mini'}
        except Exception:
            pass

    # Contextual algorithmic fallback
    last_user_msg = ''
    for m in reversed(messages):
        if m.get('role') == 'user':
            last_user_msg = m.get('text', '').lower()
            break

    if any(k in last_user_msg for k in ['squat', 'leg', 'quad', 'knee']):
        reply = (
            f"⚡ **{coach_name} Form Directive: Lower Body Mechanics**\n\n"
            "1. **Intra-Abdominal Pressure**: Take a deep 360° diaphragmatic breath and brace into your belt before descending.\n"
            "2. **Hip & Knee Hinge**: Break at hips and knees simultaneously; drive your knees outward in line with your 2nd toe.\n"
            "3. **Drive**: Explode through midfoot—maintain thoracic extension without letting your chest cave."
        )
    elif any(k in last_user_msg for k in ['bench', 'chest', 'press', 'shoulder', 'incline']):
        reply = (
            f"⚡ **{coach_name} Press Protocol**\n\n"
            "1. **Scapular Retraction**: Pin shoulder blades down and back into the bench like you're pinching a pencil.\n"
            "2. **Elbow Tuck**: Keep elbows flared at ~45-60°, never flared at 90° to protect anterior shoulder capsules.\n"
            "3. **Leg Drive**: Plant heels firmly, pressing the floor forward to lock mechanical tension across the kinetic chain."
        )
    else:
        reply = (
            f"⚡ **{coach_name} Dynamic Athlete Assessment**\n\n"
            f"Target noted, {ath_name}. Maintain mechanical tension across every working set. Track velocity on your final 2 reps: if bar speed stays rapid, step up loading by 2.5kg next cycle. Stay locked in!"
        )

    return {'ok': True, 'reply': reply, 'model': 'moon-tactical-engine'}

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        handle_cors_options(self)

    def do_POST(self):
        try:
            n = int(self.headers.get('Content-Length', 0))
            payload = json.loads(self.rfile.read(n) or b'{}')
            messages = payload.get('messages', [])
            coach = payload.get('coach', {})
            athlete = payload.get('athlete', {})
            result = call_ai_coach_api(messages, coach, athlete)
            return send_response_json(self, result)
        except Exception as e:
            return send_response_json(self, {
                'ok': False,
                'error': str(e),
                'reply': "Coach link interrupted. Re-centering focus... What was your target exercise?"
            })

