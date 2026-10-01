import os
import sqlite3
import re
import bcrypt
import json
import urllib.request
from datetime import datetime
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Database file path
DB_PATH = os.path.join(os.path.dirname(__file__), "vellife.db")

# Load environment variables from .env if present
ENV_PATH = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(ENV_PATH):
    try:
        with open(ENV_PATH, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ[k.strip()] = v.strip().strip("'\"")
    except Exception as e:
        print(f"Error loading .env file: {e}")

app = FastAPI(title="VELFIRE API", version="1.0.0")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'Student',
            status_role TEXT DEFAULT 'Student',
            phone_number TEXT DEFAULT '',
            profile_image TEXT DEFAULT '',
            otp_code TEXT,
            otp_expires_at INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()

    # Ensure missing columns are dynamically added if table existed previously
    existing_cols = [col[1] for col in cursor.execute("PRAGMA table_info(users);").fetchall()]
    if "status_role" not in existing_cols:
        cursor.execute("ALTER TABLE users ADD COLUMN status_role TEXT DEFAULT 'Student'")
    if "phone_number" not in existing_cols:
        cursor.execute("ALTER TABLE users ADD COLUMN phone_number TEXT DEFAULT ''")
    if "profile_image" not in existing_cols:
        cursor.execute("ALTER TABLE users ADD COLUMN profile_image TEXT DEFAULT ''")
    conn.commit()
    conn.close()

# Initialize DB table on startup
init_db()

# Request schemas
class SignupRequest(BaseModel):
    name: str = ""
    email: str
    password: str
    confirm_password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UpdateProfileRequest(BaseModel):
    user_id: int
    name: str = ""
    status_role: str = "Student"
    phone_number: str = ""
    profile_image: str = ""

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        if hashed_password.startswith("$2b$") or hashed_password.startswith("$2a$"):
            return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
        return plain_password == hashed_password
    except Exception:
        return plain_password == hashed_password

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "VELFIRE API"}

@app.post("/api/signup")
def signup(data: SignupRequest):
    email = data.email.strip().lower()
    password = data.password.strip()
    confirm_password = data.confirm_password.strip()
    name = data.name.strip()

    if not email:
        raise HTTPException(status_code=400, detail="Email is required.")
    
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        raise HTTPException(status_code=400, detail="Please enter a valid email address.")

    if not password:
        raise HTTPException(status_code=400, detail="Password is required.")

    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long.")

    if password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    if not name:
        name = email.split("@")[0].capitalize()

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM users WHERE LOWER(email) = ?", (email,))
    existing_user = cursor.fetchone()

    if existing_user:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists. Please login."
        )

    hashed_pw = hash_password(password)

    try:
        cursor.execute(
            """
            INSERT INTO users (name, email, password_hash, role, status_role, phone_number, profile_image, created_at)
            VALUES (?, ?, ?, 'Student', 'Student', '', '', CURRENT_TIMESTAMP)
            """,
            (name, email, hashed_pw)
        )
        conn.commit()
        new_user_id = cursor.lastrowid
        conn.close()

        return {
            "status": "success",
            "message": "Account created successfully! You can now log in.",
            "user": {
                "id": new_user_id,
                "name": name,
                "email": email,
                "role": "Student",
                "status_role": "Student",
                "phone_number": "",
                "profile_image": ""
            }
        }
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/api/login")
def login(data: LoginRequest):
    email = data.email.strip().lower()
    password = data.password.strip()

    if not email or not password:
        raise HTTPException(status_code=400, detail="Please enter both email and password.")

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT id, name, email, password_hash, role, status_role, phone_number, profile_image FROM users WHERE LOWER(email) = ?", (email,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials."
        )

    if not verify_password(password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials."
        )

    return {
        "status": "success",
        "message": "Login successful!",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"] if user["role"] else "Student",
            "status_role": user["status_role"] if user["status_role"] else "Student",
            "phone_number": user["phone_number"] if user["phone_number"] else "",
            "profile_image": user["profile_image"] if user["profile_image"] else ""
        }
    }

@app.post("/api/profile/update")
def update_profile(data: UpdateProfileRequest):
    if not data.user_id:
        raise HTTPException(status_code=400, detail="User ID is required.")

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM users WHERE id = ?", (data.user_id,))
    user = cursor.fetchone()
    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found.")

    try:
        cursor.execute(
            """
            UPDATE users
            SET name = ?, status_role = ?, phone_number = ?, profile_image = ?
            WHERE id = ?
            """,
            (data.name.strip(), data.status_role.strip(), data.phone_number.strip(), data.profile_image, data.user_id)
        )
        conn.commit()

        cursor.execute("SELECT id, name, email, role, status_role, phone_number, profile_image FROM users WHERE id = ?", (data.user_id,))
        updated_user = cursor.fetchone()
        conn.close()

        return {
            "status": "success",
            "message": "Profile updated successfully!",
            "user": {
                "id": updated_user["id"],
                "name": updated_user["name"],
                "email": updated_user["email"],
                "role": updated_user["role"] if updated_user["role"] else "Student",
                "status_role": updated_user["status_role"] if updated_user["status_role"] else "Student",
                "phone_number": updated_user["phone_number"] if updated_user["phone_number"] else "",
                "profile_image": updated_user["profile_image"] if updated_user["profile_image"] else ""
            }
        }
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")

def clean_user_name(raw_name: str) -> str:
    if not raw_name:
        return "Poovarasan"
    # Remove digits
    s = re.sub(r'\d+', '', raw_name).strip()
    # If ends with 'poo' from handle like Poovarasanpoo, trim extra 'poo'
    if s.lower().endswith("poo") and len(s) > 5:
        s = s[:-3]
    return s.capitalize() if s else "Poovarasan"

def fetch_live_llm_response(user_name: str, message: str, model_choice: str = "VELFIRE GPT-4o") -> str:
    # Customize system prompt based on the selected Model
    if "Code" in model_choice or "Pro" in model_choice:
        system_prompt = (
            f"You are WILDFIRE Code & System Pro, an elite senior software architect and AI engineer. "
            f"Address the user naturally as '{user_name}'. "
            f"Provide production-grade, highly optimized code snippets, clean directory structures, "
            f"and robust error-handling logic with clear markdown code blocks."
        )
    elif "Mini" in model_choice:
        system_prompt = (
            f"You are WILDFIRE GPT-4o Mini, a ultra-fast, concise, and direct AI assistant. "
            f"Address the user as '{user_name}'. "
            f"Provide clear, quick, high-speed bullet points and direct answers without unnecessary fluff."
        )
    else: # Default VELFIRE GPT-4o
        system_prompt = (
            f"You are WILDFIRE GPT-4o, a state-of-the-art intelligent AI mentor modeled after ChatGPT. "
            f"Address the user naturally as '{user_name}'. "
            f"Provide rich, comprehensive, beautifully formatted answers with headings, bullet points, tables, and code where relevant."
        )

    # API Keys from environment / .env
    gemini_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    groq_key = os.environ.get("GROQ_API_KEY")
    openai_key = os.environ.get("OPENAI_API_KEY")

    # Map selected model to provider-specific model IDs
    gemini_model_id = "gemini-1.5-pro" if "Pro" in model_choice or "GPT-4o" in model_choice else "gemini-1.5-flash"
    groq_model_id = "llama-3.3-70b-versatile" if "Pro" in model_choice or "GPT-4o" in model_choice else "llama-3.1-8b-instant"
    openai_model_id = "gpt-4o" if "4o" in model_choice and "Mini" not in model_choice else "gpt-4o-mini"

    # =========================================================================
    # TIER 1: GOOGLE GEMINI API (Primary Choice if Key Available)
    # =========================================================================
    if gemini_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{gemini_model_id}:generateContent?key={gemini_key}"
            payload = {
                "contents": [
                    {
                        "role": "user",
                        "parts": [{"text": f"{system_prompt}\n\nUser Question: {message}"}]
                    }
                ]
            }
            data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=10) as res:
                if res.status == 200:
                    resp_json = json.loads(res.read().decode("utf-8"))
                    candidates = resp_json.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts and parts[0].get("text"):
                            print(f"✅ Served via Gemini API ({gemini_model_id})")
                            return parts[0]["text"].strip()
        except Exception as e:
            print(f"⚠️ Gemini API fallback triggered: {e}")

    # =========================================================================
    # TIER 2: GROQ API (Ultra-Fast Llama-3.3 / Llama-3.1 Fallback)
    # =========================================================================
    if groq_key:
        try:
            url = "https://api.groq.com/openai/v1/chat/completions"
            payload = {
                "model": groq_model_id,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ]
            }
            data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(url, data=data, headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {groq_key}"
            })
            with urllib.request.urlopen(req, timeout=10) as res:
                if res.status == 200:
                    resp_json = json.loads(res.read().decode("utf-8"))
                    choices = resp_json.get("choices", [])
                    if choices:
                        print(f"✅ Served via Groq API ({groq_model_id})")
                        return choices[0]["message"]["content"].strip()
        except Exception as e:
            print(f"⚠️ Groq API fallback triggered: {e}")

    # =========================================================================
    # TIER 3: OPENAI API (GPT-4o / GPT-4o-Mini Fallback)
    # =========================================================================
    if openai_key:
        try:
            url = "https://api.openai.com/v1/chat/completions"
            payload = {
                "model": openai_model_id,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ]
            }
            data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(url, data=data, headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {openai_key}"
            })
            with urllib.request.urlopen(req, timeout=10) as res:
                if res.status == 200:
                    resp_json = json.loads(res.read().decode("utf-8"))
                    choices = resp_json.get("choices", [])
                    if choices:
                        print(f"✅ Served via OpenAI API ({openai_model_id})")
                        return choices[0]["message"]["content"].strip()
        except Exception as e:
            print(f"⚠️ OpenAI API fallback triggered: {e}")

    # =========================================================================
    # TIER 4: FREE PUBLIC LLM API (Pollinations GET stream)
    # =========================================================================
    try:
        import urllib.parse
        encoded_prompt = urllib.parse.quote(f"System: {system_prompt}\nUser: {message}")
        url = f"https://text.pollinations.ai/{encoded_prompt}"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=6) as res:
            if res.status == 200:
                answer = res.read().decode("utf-8").strip()
                if answer and len(answer) > 15:
                    print("✅ Served via Free LLM API Stream")
                    return answer
    except Exception as e:
        print(f"⚠️ Free LLM Stream fallback triggered: {e}")

    return ""

# Request schemas
class ChatRequest(BaseModel):
    user_name: str = "User"
    message: str = ""
    model: str = "VELFIRE GPT-4o"

@app.post("/api/chat")
def chat_ai(data: ChatRequest):
    message = data.message.strip()
    user_name = clean_user_name(data.user_name)

    if not message:
        raise HTTPException(status_code=400, detail="Message content cannot be empty.")

    lower = message.lower()

    # A. Casual "How are you" / "How r u" / "How's it going" / "Sup"
    if any(phrase in lower for phrase in ["how are you", "how r u", "how r you", "how u doing", "how is it going", "hows it going", "whats up", "what's up"]):
        return {
            "status": "success",
            "reply": f"I'm doing fantastic, **{user_name}**! Thank you for asking. 😊\n\nAll AI systems are running smoothly and ready. How can I assist your coding, full-stack learning, or career path today?"
        }

    # B. Apologies / Casual Fillers ("sry", "sorry", "my bad", "oops")
    if any(lower == w or lower.startswith(w + " ") or lower.endswith(" " + w) for w in ["sry", "sorry", "my bad", "oops", "apologies", "sory"]):
        return {
            "status": "success",
            "reply": f"No need to apologize at all, **{user_name}**! 😊 I am right here to help you.\n\nWhat would you like to explore next? We can talk more about **Full-Stack Web Development**, look at code examples, prepare for interviews, or discuss project ideas!"
        }

    # C. Acknowledgments ("ok", "okay", "got it", "sure", "cool", "alright")
    if lower in ["ok", "okay", "got it", "sure", "cool", "alright", "great", "nice", "awesome", "k", "fine", "kk", "ok brother", "ok bro"]:
        return {
            "status": "success",
            "reply": f"Awesome, **{user_name}**! 👍 Let me know whenever you're ready to ask your next question, explore Full-Stack development, or get code snippets!"
        }

    # D. Greetings ("hi", "hello", "hey")
    if any(g == lower or lower.startswith(g + " ") or lower.endswith(" " + g) for g in ["hi", "hello", "hey", "good morning", "good evening", "greetings", "sup", "hola", "yo"]):
        if len(lower.split()) <= 4:
            return {
                "status": "success",
                "reply": f"Hi **{user_name}**! 👋 Great to connect with you today.\n\nI am your **VELFIRE AI Assistant**, powered by real-time intelligence. What project, code, career question, or doubt can I help you solve right now?"
            }

    # E. Query Live LLM for 100% real AI responses on all questions
    live_reply = fetch_live_llm_response(user_name, message, data.model)
    if live_reply:
        return {"status": "success", "reply": live_reply}

    # F. Offline Dynamic Conversational Fallback
    clean_prompt = re.sub(r'^(can you|please|tell me|explain|what is|how to|i want to|i am)\s+', '', message, flags=re.IGNORECASE).strip(' ?!')
    prompt_title = clean_prompt.capitalize() if clean_prompt else message

    fallback_reply = (
        f"Sure thing, **{user_name}**! Here is clear guidance on **{prompt_title}**:\n\n"
        "1. **Core Concept & Approach**:\n"
        f"   To work with {message.rstrip('?!.')}, the most effective method is to break down your objective into actionable steps.\n\n"
        "2. **Best Practices & Next Steps**:\n"
        "   - **Master Core Principles**: Understand the foundation before diving into advanced implementation.\n"
        "   - **Build & Test Hands-On**: Practice with realistic projects or test cases to solidify your learning.\n"
        "   - **Iterate Continuously**: Refine edge cases, optimize performance, and keep your code organized.\n\n"
        f"Would you like me to write code examples or step-by-step guidance specifically for this, **{user_name}**?"
    )
    return {"status": "success", "reply": fallback_reply}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
