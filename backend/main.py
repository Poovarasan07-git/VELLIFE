import os
import sqlite3
import re
import bcrypt
import json
import urllib.request
import random
import time
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Load environment variables from .env
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_EMAIL = os.getenv("SMTP_EMAIL", "").strip()
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "").strip()
SMTP_FROM_NAME = os.getenv("SMTP_FROM_NAME", "VELFIRE Security")

# Database file path
DB_PATH = os.path.join(os.path.dirname(__file__), "vellife.db")

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
    if "otp_code" not in existing_cols:
        cursor.execute("ALTER TABLE users ADD COLUMN otp_code TEXT")
    if "otp_expires_at" not in existing_cols:
        cursor.execute("ALTER TABLE users ADD COLUMN otp_expires_at INTEGER")
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

class SendOtpRequest(BaseModel):
    email: str

class VerifyOtpRequest(BaseModel):
    email: str
    otp: str

class ResetPasswordRequest(BaseModel):
    email: str
    otp: str
    new_password: str
    confirm_password: str

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

def send_email_otp(to_email: str, otp: str) -> tuple[bool, str]:
    """Dispatches a real verification OTP email using configured SMTP credentials."""
    # Re-read environment variables in case .env was edited while running
    smtp_email = os.getenv("SMTP_EMAIL", "").strip()
    smtp_password = os.getenv("SMTP_PASSWORD", "").strip()
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com").strip()
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_from_name = os.getenv("SMTP_FROM_NAME", "VELFIRE Security").strip()

    if not smtp_email or not smtp_password:
        return False, "SMTP credentials (SMTP_EMAIL & SMTP_PASSWORD) not configured in backend/.env"

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"{otp} is your VELFIRE Verification Code"
        msg["From"] = f"{smtp_from_name} <{smtp_email}>"
        msg["To"] = to_email

        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {{
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              background-color: #070a12;
              color: #f8fafc;
              margin: 0;
              padding: 24px;
            }}
            .card {{
              max-width: 500px;
              margin: 0 auto;
              background: #111827;
              border: 1px solid #1e293b;
              border-radius: 20px;
              padding: 36px 30px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            }}
            .brand {{
              text-align: center;
              font-size: 28px;
              font-weight: 900;
              letter-spacing: 5px;
              color: #34d399;
              margin-bottom: 20px;
            }}
            h2 {{
              color: #ffffff;
              font-size: 20px;
              text-align: center;
              margin-top: 0;
              margin-bottom: 12px;
            }}
            p {{
              color: #94a3b8;
              font-size: 14.5px;
              line-height: 1.6;
              margin: 10px 0;
            }}
            .otp-container {{
              background: #0b0f19;
              border: 2px dashed #10b981;
              border-radius: 14px;
              text-align: center;
              padding: 20px 16px;
              margin: 26px 0;
            }}
            .otp-code {{
              font-family: 'Courier New', Courier, monospace;
              font-size: 38px;
              font-weight: 800;
              letter-spacing: 10px;
              color: #38bdf8;
            }}
            .expiry-note {{
              font-size: 12.5px;
              color: #64748b;
              margin-top: 8px;
            }}
            .warning {{
              background: rgba(239, 68, 68, 0.1);
              border-left: 3px solid #ef4444;
              padding: 10px 14px;
              border-radius: 6px;
              font-size: 13px;
              color: #fca5a5;
              margin-top: 20px;
            }}
            .footer {{
              text-align: center;
              font-size: 12px;
              color: #475569;
              border-top: 1px solid #1e293b;
              margin-top: 28px;
              padding-top: 16px;
            }}
          </style>
        </head>
        <body>
          <div class="card">
            <div class="brand">VELFIRE</div>
            <h2>Password Reset Verification</h2>
            <p>Hello,</p>
            <p>You requested to reset your password. Use the verification code below to verify your account and set a new password:</p>
            
            <div class="otp-container">
              <div class="otp-code">{otp}</div>
              <div class="expiry-note">⏱ This code will expire in <strong>10 minutes</strong>.</div>
            </div>

            <div class="warning">
              Security notice: If you did not make this request, please disregard this email. Never share this OTP with anyone.
            </div>

            <div class="footer">
              &copy; {datetime.now().year} VELFIRE. All rights reserved.
            </div>
          </div>
        </body>
        </html>
        """

        plain_text = f"Your VELFIRE password reset OTP is: {otp}\nThis code is valid for 10 minutes.\nDo not share this code with anyone."

        msg.attach(MIMEText(plain_text, "plain"))
        msg.attach(MIMEText(html_body, "html"))

        if smtp_port == 465:
            with smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=12) as server:
                server.login(smtp_email, smtp_password)
                server.sendmail(smtp_email, [to_email], msg.as_string())
        else:
            with smtplib.SMTP(smtp_host, smtp_port, timeout=12) as server:
                server.starttls()
                server.login(smtp_email, smtp_password)
                server.sendmail(smtp_email, [to_email], msg.as_string())

        return True, "Email delivered successfully"
    except Exception as e:
        return False, str(e)

@app.post("/api/forgot-password/send-otp")
def send_forgot_password_otp(data: SendOtpRequest):
    email = data.email.strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="Please enter your email address.")

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        raise HTTPException(status_code=400, detail="Please enter a valid email address.")

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name FROM users WHERE LOWER(email) = ?", (email,))
    user = cursor.fetchone()

    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="No registered account found with this email. Please check the spelling or sign up.")

    # Generate 6-digit numeric OTP
    otp = f"{random.randint(100000, 999999):06d}"
    expires_at = int(time.time()) + 600  # valid for 10 minutes

    cursor.execute(
        "UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE id = ?",
        (otp, expires_at, user["id"])
    )
    conn.commit()
    conn.close()

    # Attempt real email dispatch via SMTP
    sent_real, email_msg = send_email_otp(email, otp)

    if sent_real:
        return {
            "status": "success",
            "message": f"Verification OTP has been sent to your email inbox ({email}). Please check your inbox and spam folder.",
            "real_email_sent": True,
            "expires_in": 600
        }
    else:
        # Fallback with informative message and demo OTP if SMTP is not configured yet
        return {
            "status": "success",
            "message": f"OTP generated! (Notice: {email_msg})",
            "real_email_sent": False,
            "otp": otp,  # returned for testing/fallback
            "expires_in": 600
        }

@app.post("/api/forgot-password/verify-otp")
def verify_forgot_password_otp(data: VerifyOtpRequest):
    email = data.email.strip().lower()
    otp = data.otp.strip()

    if not email:
        raise HTTPException(status_code=400, detail="Email is required.")
    if not otp:
        raise HTTPException(status_code=400, detail="Please enter the 6-digit OTP.")

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, otp_code, otp_expires_at FROM users WHERE LOWER(email) = ?", (email,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=404, detail="No account found with this email.")

    if not user["otp_code"]:
        raise HTTPException(status_code=400, detail="No OTP requested for this email. Please click 'Send OTP' first.")

    if int(time.time()) > (user["otp_expires_at"] or 0):
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new OTP.")

    if str(user["otp_code"]).strip() != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP code. Please enter the correct 6-digit code.")

    return {
        "status": "success",
        "message": "OTP verified successfully. You may now create your new password."
    }

@app.post("/api/forgot-password/reset")
def reset_forgot_password(data: ResetPasswordRequest):
    email = data.email.strip().lower()
    otp = data.otp.strip()
    new_password = data.new_password.strip()
    confirm_password = data.confirm_password.strip()

    if not email:
        raise HTTPException(status_code=400, detail="Email is required.")
    if not otp:
        raise HTTPException(status_code=400, detail="OTP is required.")
    if not new_password:
        raise HTTPException(status_code=400, detail="New password is required.")
    if len(new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long.")
    if new_password != confirm_password:
        raise HTTPException(status_code=400, detail="New password and confirm password do not match.")

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, otp_code, otp_expires_at FROM users WHERE LOWER(email) = ?", (email,))
    user = cursor.fetchone()

    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="No account found with this email.")

    if not user["otp_code"]:
        conn.close()
        raise HTTPException(status_code=400, detail="No active OTP found. Please request a new OTP.")

    if int(time.time()) > (user["otp_expires_at"] or 0):
        conn.close()
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new OTP.")

    if str(user["otp_code"]).strip() != otp:
        conn.close()
        raise HTTPException(status_code=400, detail="Invalid OTP code.")

    hashed_pw = hash_password(new_password)
    cursor.execute(
        "UPDATE users SET password_hash = ?, otp_code = NULL, otp_expires_at = NULL WHERE id = ?",
        (hashed_pw, user["id"])
    )
    conn.commit()
    conn.close()

    return {
        "status": "success",
        "message": "Password reset successfully! You can now log in with your new password."
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

def fetch_live_llm_response(user_name: str, message: str) -> str:
    try:
        url = "https://text.pollinations.ai/"
        system_prompt = (
            f"You are VELFIRE AI, a real-time intelligent AI assistant modeled after ChatGPT. "
            f"Address the user naturally as '{user_name}'. "
            f"Provide rich, thorough, beautifully structured Markdown answers with clear headings, bullet points, tables, and code snippets where relevant. "
            f"Never output robotic template phrases."
        )
        payload = {
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            "model": "openai"
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"}
        )
        with urllib.request.urlopen(req, timeout=12) as res:
            if res.status == 200:
                answer = res.read().decode("utf-8").strip()
                if answer and len(answer) > 10:
                    return answer
    except Exception as e:
        print(f"Live AI fetch exception: {e}")
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
    live_reply = fetch_live_llm_response(user_name, message)
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
class RoadmapRequest(BaseModel):
    course: str
    level: str = "Intermediate"
    duration: str = "3 Months Mastery"
    goal: str = "Job Placement & Mastery"

def build_fallback_roadmap(course: str, level: str, duration: str, goal: str) -> dict:
    course_clean = course.strip().title() if course.strip() else "Full Stack Software Engineering"
    c_lower = course_clean.lower()

    # Determine timeline intervals based on duration
    if "1 Month" in duration or "Sprint" in duration:
        timeframes = ["Week 1", "Week 2", "Week 3", "Week 4"]
        total_hours = "60-80 Hours"
        weekly = "15-20 hrs/week"
    elif "6 Month" in duration or "Transformation" in duration:
        timeframes = ["Months 1–2", "Month 3", "Months 4–5", "Month 6"]
        total_hours = "200-260 Hours"
        weekly = "8-12 hrs/week"
    else:
        timeframes = ["Weeks 1–3", "Weeks 4–7", "Weeks 8–10", "Weeks 11–12"]
        total_hours = "120-150 Hours"
        weekly = "10-14 hrs/week"

    # Domain Knowledge Patterns
    if any(k in c_lower for k in ["data analy", "power bi", "tableau", "bi developer", "business analy", "sql"]):
        prereqs = ["Basic Math & Statistics", "Spreadsheets (Excel basics)", "Analytical Thinking"]
        tech_stack = [
            {"name": "Python", "category": "Core Language"},
            {"name": "SQL (PostgreSQL)", "category": "Database Querying"},
            {"name": "Pandas & NumPy", "category": "Data Wrangling"},
            {"name": "Power BI & Tableau", "category": "BI Dashboards"},
            {"name": "Excel Advanced", "category": "Spreadsheet Modeling"}
        ]
        phases = [
            {
                "phase_number": 1,
                "timeframe": timeframes[0],
                "title": "Excel Mastery & Relational SQL Foundations",
                "summary": "Master data manipulation in spreadsheets and writing advanced multi-table SQL queries, window functions, and joins.",
                "topics": ["Advanced Excel (VLOOKUP, INDEX-MATCH, Pivot Tables)", "Relational DB Design & ERDs", "SQL Joins, Group By & Subqueries", "Window Functions (RANK, DENSE_RANK, LEAD, LAG)"],
                "hands_on_project": {
                    "title": "Global E-Commerce Sales Performance SQL Audit",
                    "description": "Clean, structure, and query 100,000+ sales records to uncover revenue drivers and customer churn trends."
                },
                "milestone_goal": "Write fluent complex analytical SQL queries with sub-second execution."
            },
            {
                "phase_number": 2,
                "timeframe": timeframes[1],
                "title": "Python for Data Analysis & Statistical Modeling",
                "summary": "Automate data processing, handle missing values, and extract statistical distributions using Pandas and NumPy.",
                "topics": ["Pandas Series & DataFrames", "Data Cleaning, Imputation & Reshaping", "Descriptive & Inferential Statistics", "Exploratory Data Analysis (EDA) with Seaborn"],
                "hands_on_project": {
                    "title": "Customer Lifetime Value (LTV) & Retention Engine",
                    "description": "Develop an automated Python pipeline that calculates cohort retention curves and segmentation metrics."
                },
                "milestone_goal": "Perform automated end-to-end data cleaning and hypothesis testing in Python."
            },
            {
                "phase_number": 3,
                "timeframe": timeframes[2],
                "title": "Interactive BI Dashboards & Data Storytelling",
                "summary": "Transform raw numbers into executive dashboards using Power BI and Tableau with real-time DAX measures.",
                "topics": ["Data Modeling & Star Schema in Power BI", "DAX Formulas (CALCULATE, RELATED, Time Intelligence)", "Interactive Filters, Drill-Downs & Bookmarks", "Executive Storytelling & KPI Reporting"],
                "hands_on_project": {
                    "title": "Executive C-Suite Financial & Operations Cockpit",
                    "description": "Design an interactive multi-page Power BI dashboard with automated alerts and cross-filtering."
                },
                "milestone_goal": "Deliver publication-ready dashboards tailored for VP and Director level stakeholders."
            },
            {
                "phase_number": 4,
                "timeframe": timeframes[3],
                "title": "Production Portfolio, Case Studies & Interview Gate",
                "summary": "Synthesize your portfolio on GitHub, write business case memos, and ace technical SQL/Python live case interviews.",
                "topics": ["End-to-End Analytics Case Studies", "GitHub Project Documentation & Readmes", "Live SQL & Python Whiteboarding Practice", "ATS Resume Optimization & Portfolio Presentation"],
                "hands_on_project": {
                    "title": "Capstone: End-to-End Business Intelligence Pipeline",
                    "description": "Connect live APIs, pipe data into SQL, analyze with Python, and publish an interactive Power BI dashboard."
                },
                "milestone_goal": "Pass live technical SQL screens and showcase a top-tier GitHub analytics portfolio."
            }
        ]
        job_roles = ["Data Analyst", "Business Intelligence (BI) Analyst", "SQL Developer", "Operations Analyst"]
        salary = "$70,000 - $115,000 / ₹7 - ₹18 LPA"
        demand = "Extremely High (Across Tech, Finance & E-Commerce)"
    elif any(k in c_lower for k in ["ai", "machine learning", "ml", "deep learning", "llm", "genai", "nlp"]):
        prereqs = ["Python Programming", "Linear Algebra & Calculus", "Probability & Statistics"]
        tech_stack = [
            {"name": "Python 3.12", "category": "Core Language"},
            {"name": "PyTorch", "category": "Deep Learning"},
            {"name": "Scikit-Learn", "category": "Machine Learning"},
            {"name": "Hugging Face & LangChain", "category": "LLMs & GenAI"},
            {"name": "FastAPI & Docker", "category": "Model Serving"}
        ]
        phases = [
            {
                "phase_number": 1,
                "timeframe": timeframes[0],
                "title": "Mathematical Foundations & Classical ML",
                "summary": "Deep dive into matrix operations, gradient descent, feature engineering, and standard classification/regression algorithms.",
                "topics": ["Vector & Matrix Math in NumPy", "Linear/Logistic Regression & SVMs", "Tree-based Models (Random Forest, XGBoost)", "Evaluation Metrics (ROC-AUC, F1-Score, Cross-Validation)"],
                "hands_on_project": {
                    "title": "Predictive Customer Churn & Risk Engine",
                    "description": "Train and evaluate tuned XGBoost classifiers on imbalanced financial datasets with feature importance analysis."
                },
                "milestone_goal": "Build, tune, and evaluate classical ML pipelines with proper validation."
            },
            {
                "phase_number": 2,
                "timeframe": timeframes[1],
                "title": "Deep Learning & Neural Network Architectures with PyTorch",
                "summary": "Construct neural networks from scratch, implement backpropagation, and specialize in CNNs and Transformers.",
                "topics": ["PyTorch Tensors, Autograd & Custom Datasets", "Feedforward & Deep Networks (ReLU, Dropout, BatchNorm)", "Convolutional Neural Networks (CNNs) for Vision", "Recurrent Networks, Attention Mechanisms & Transformers"],
                "hands_on_project": {
                    "title": "Multi-Modal Neural Classifier in PyTorch",
                    "description": "Implement a custom convolutional and attention model for automated image and text sentiment classification."
                },
                "milestone_goal": "Train and optimize multi-layer deep learning models with GPU acceleration."
            },
            {
                "phase_number": 3,
                "timeframe": timeframes[2],
                "title": "LLMs, LangChain, RAG Pipelines & Fine-Tuning",
                "summary": "Harness Large Language Models, build Retrieval-Augmented Generation (RAG) systems, and fine-tune models with LoRA.",
                "topics": ["Transformer Self-Attention & Positional Encodings", "Vector Databases (ChromaDB, Pinecone)", "Retrieval-Augmented Generation (RAG) Pipelines", "Quantization, LoRA & Parameter-Efficient Fine-Tuning"],
                "hands_on_project": {
                    "title": "Enterprise Knowledge-Base RAG Agent with LangChain",
                    "description": "Construct an AI system that ingests PDFs, indexes embeddings in a vector DB, and answers complex technical queries."
                },
                "milestone_goal": "Deploy production-grade RAG agents and fine-tune open-source models."
            },
            {
                "phase_number": 4,
                "timeframe": timeframes[3],
                "title": "MLOps, Model Deployment & Production Serving",
                "summary": "Wrap models into high-throughput FastAPI endpoints, containerize with Docker, and monitor model drift in production.",
                "topics": ["FastAPI Asynchronous Inference Endpoints", "Dockerization & GPU Runtime Containerization", "Model Monitoring, Latency Optimization & ONNX", "MLOps CI/CD Pipelines & Cloud Deployment"],
                "hands_on_project": {
                    "title": "Production AI Microservice with Real-Time Inference",
                    "description": "Package an optimized PyTorch/Hugging Face model into a load-tested Docker container deployed on cloud servers."
                },
                "milestone_goal": "Deploy production AI endpoints meeting strict latency and scalability SLA requirements."
            }
        ]
        job_roles = ["AI/ML Engineer", "Machine Learning Scientist", "LLM Application Developer", "MLOps Engineer"]
        salary = "$110,000 - $190,000 / ₹14 - ₹40 LPA"
        demand = "Surging Exponentially (Top Industry Priority)"
    elif any(k in c_lower for k in ["devops", "cloud", "aws", "docker", "kubernetes", "sre", "terraform"]):
        prereqs = ["Linux CLI Navigation", "Networking Fundamentals (TCP/IP, DNS)", "Basic Scripting (Bash/Python)"]
        tech_stack = [
            {"name": "Linux (Ubuntu)", "category": "Operating System"},
            {"name": "Docker", "category": "Containers"},
            {"name": "Kubernetes", "category": "Orchestration"},
            {"name": "Terraform", "category": "Infrastructure as Code"},
            {"name": "AWS / GCP", "category": "Cloud Provider"},
            {"name": "GitHub Actions", "category": "CI/CD"}
        ]
        phases = [
            {
                "phase_number": 1,
                "timeframe": timeframes[0],
                "title": "Linux Mastery, Networking & Bash Automation",
                "summary": "Master system administration, process management, SSH keys, DNS, subnetting, and robust Bash shell scripting.",
                "topics": ["Linux Filesystem, Permissions & Systemd Services", "Networking (IP Addressing, Subnets, Firewalls, Reverse Proxies)", "Bash Scripting & Cron Job Automation", "Git Workflows & Version Control for Operations"],
                "hands_on_project": {
                    "title": "Automated Linux Server Provisioning & Hardening Script",
                    "description": "Write zero-interaction Bash automation that sets up firewalls, users, Nginx reverse proxy, and SSL certificates."
                },
                "milestone_goal": "Confidently manage, secure, and debug headless Linux production servers."
            },
            {
                "phase_number": 2,
                "timeframe": timeframes[1],
                "title": "Containerization with Docker & Multi-Stage Builds",
                "summary": "Containerize microservices, optimize image sizes using multi-stage builds, and orchestrate with Docker Compose.",
                "topics": ["Docker Architecture & Container Lifecycles", "Dockerfile Optimization & Multi-stage Builds", "Docker Compose for Multi-Container Apps", "Networking, Volumes & Secret Management in Containers"],
                "hands_on_project": {
                    "title": "Multi-Tier Microservice Container Suite",
                    "description": "Containerize a React frontend, Python API, and PostgreSQL database with persistent volumes and healthchecks."
                },
                "milestone_goal": "Build minimal, vulnerability-free container images under 100MB."
            },
            {
                "phase_number": 3,
                "timeframe": timeframes[2],
                "title": "Kubernetes (K8s) Cluster Management & Helm",
                "summary": "Deploy and scale resilient applications on Kubernetes using Pods, Deployments, Services, Ingress, and Helm charts.",
                "topics": ["Kubernetes Architecture (Control Plane vs Worker Nodes)", "Deployments, ReplicaSets & Rolling Updates", "Services (ClusterIP, NodePort, LoadBalancer) & Ingress", "Helm Packaging, ConfigMaps & PersistentVolumes"],
                "hands_on_project": {
                    "title": "High-Availability Auto-Scaling Web Application on K8s",
                    "description": "Deploy a multi-replica application with Horizontal Pod Autoscaler (HPA), rolling zero-downtime updates, and ingress."
                },
                "milestone_goal": "Orchestrate zero-downtime rolling deployments across distributed clusters."
            },
            {
                "phase_number": 4,
                "timeframe": timeframes[3],
                "title": "Infrastructure as Code (Terraform) & Production CI/CD",
                "summary": "Provision cloud resources declaratively using Terraform and automate continuous delivery with GitHub Actions.",
                "topics": ["Terraform Providers, State Management & Modules", "AWS VPC, EC2, S3, IAM & RDS Automation", "GitHub Actions CI/CD Pipelines (Lint, Test, Build, Deploy)", "Prometheus & Grafana Observability"],
                "hands_on_project": {
                    "title": "Complete GitOps CI/CD & Terraform Cloud Architecture",
                    "description": "A push to GitHub automatically triggers tests, builds Docker images, runs Terraform, and deploys to Kubernetes."
                },
                "milestone_goal": "Deliver fully automated GitOps pipelines from code commit to cloud deployment."
            }
        ]
        job_roles = ["DevOps Engineer", "Cloud Solutions Architect", "Site Reliability Engineer (SRE)", "Platform Engineer"]
        salary = "$95,000 - $160,000 / ₹12 - ₹32 LPA"
        demand = "Critical Industry Shortage (Massive Demand)"
    elif any(k in c_lower for k in ["cyber", "security", "ethical hack", "penetration", "soc", "network security"]):
        prereqs = ["Computer Networking (OSI Model, TCP/IP)", "Linux Fundamentals", "Basic Python/Bash Scripting"]
        tech_stack = [
            {"name": "Kali Linux", "category": "SecOps OS"},
            {"name": "Wireshark & Nmap", "category": "Recon & Packet Analysis"},
            {"name": "Metasploit & Burp Suite", "category": "Penetration Testing"},
            {"name": "Splunk / ELK", "category": "SIEM & SOC Monitoring"},
            {"name": "Python Security Scripts", "category": "Scripting & Automation"}
        ]
        phases = [
            {
                "phase_number": 1,
                "timeframe": timeframes[0],
                "title": "Network Defense, Protocol Analysis & Linux Security",
                "summary": "Master deep packet inspection, TCP/IP handshake mechanisms, firewall rules, and Linux permission auditing.",
                "topics": ["OSI & TCP/IP Model In-Depth", "Wireshark Packet Analysis & Traffic Auditing", "Port Scanning & Network Reconnaissance with Nmap", "Linux Hardening & User Privilege Management"],
                "hands_on_project": {
                    "title": "Intrusion Detection & Traffic Analyzer in Python",
                    "description": "Build a network sniffer that detects SYN flood attacks and suspicious port scanning in real-time."
                },
                "milestone_goal": "Identify unauthorized network anomalies and capture malicious packets."
            },
            {
                "phase_number": 2,
                "timeframe": timeframes[1],
                "title": "Web Application Security & OWASP Top 10",
                "summary": "Intercept and analyze HTTP traffic using Burp Suite to identify and mitigate SQLi, XSS, CSRF, and SSRF flaws.",
                "topics": ["OWASP Top 10 Vulnerabilities", "Burp Suite Proxy, Repeater & Intruder", "SQL Injection (Manual & Automated with sqlmap)", "Cross-Site Scripting (Reflected, Stored, DOM XSS)"],
                "hands_on_project": {
                    "title": "Vulnerability Assessment of Target Web Applications",
                    "description": "Conduct simulated penetration tests on OWASP Juice Shop and produce a standardized remediation report."
                },
                "milestone_goal": "Perform comprehensive vulnerability assessments on web application endpoints."
            },
            {
                "phase_number": 3,
                "timeframe": timeframes[2],
                "title": "System Exploitation, Privilege Escalation & Cryptography",
                "summary": "Execute controlled exploits with Metasploit, exploit misconfigurations to escalate privileges, and implement AES/RSA ciphers.",
                "topics": ["Metasploit Framework & Payload Creation", "Linux & Windows Privilege Escalation Techniques", "Symmetric vs Asymmetric Cryptography (AES, RSA, ECC)", "Public Key Infrastructure (PKI) & TLS Handshake"],
                "hands_on_project": {
                    "title": "Capture The Flag (CTF) Machine Penetration Walkthrough",
                    "description": "Gain initial access and escalate to root privilege on vulnerable lab environments (Hack The Box / TryHackMe)."
                },
                "milestone_goal": "Demonstrate privilege escalation and document root access findings."
            },
            {
                "phase_number": 4,
                "timeframe": timeframes[3],
                "title": "SOC Operations, SIEM Monitoring & Incident Response",
                "summary": "Monitor logs with Splunk, write detection rules, triage security alerts, and execute incident response runbooks.",
                "topics": ["SIEM Architecture with Splunk / Elastic", "Analyzing Syslog, Windows Event Logs & Auth Logs", "Incident Response Lifecycle (NIST Framework)", "Security Certifications Prep (CompTIA Security+, CEH)"],
                "hands_on_project": {
                    "title": "Enterprise SOC Incident Investigation & Forensics Report",
                    "description": "Investigate a simulated multi-stage ransomware breach using SIEM logs and author an incident response timeline."
                },
                "milestone_goal": "Triage live SOC alerts and deliver structured incident remediation documentation."
            }
        ]
        job_roles = ["Cybersecurity Analyst", "SOC Analyst (L1/L2)", "Penetration Tester", "Information Security Specialist"]
        salary = "$80,000 - $140,000 / ₹9 - ₹25 LPA"
        demand = "High & Expanding (Crucial for all Enterprises)"
    elif any(k in c_lower for k in ["mobile", "flutter", "react native", "android", "ios", "swift", "kotlin"]):
        prereqs = ["Object-Oriented Programming", "Basic UI/UX Understanding", "Version Control (Git)"]
        tech_stack = [
            {"name": "Flutter & Dart", "category": "Framework"},
            {"name": "React Native", "category": "Cross-Platform"},
            {"name": "Firebase / Supabase", "category": "Backend as a Service"},
            {"name": "REST & GraphQL APIs", "category": "Networking"},
            {"name": "State Management (Bloc / Redux)", "category": "State Management"}
        ]
        phases = [
            {
                "phase_number": 1,
                "timeframe": timeframes[0],
                "title": "Core Language & Responsive Mobile UI Layouts",
                "summary": "Master core syntax, declarative UI layout composition, navigation stacks, and custom animations.",
                "topics": ["Language Fundamentals (Dart / Modern JS / TypeScript)", "Widget & Component Hierarchies", "Responsive Flexbox Layouts for Multi-Screen Support", "Screen Transitions, Navigation Stacks & Modals"],
                "hands_on_project": {
                    "title": "Modern Interactive Mobile E-Commerce Showcase App",
                    "description": "Build a responsive mobile app featuring animated product cards, cart interactions, and smooth tab navigation."
                },
                "milestone_goal": "Design pixel-perfect responsive layouts that render smoothly on iOS and Android."
            },
            {
                "phase_number": 2,
                "timeframe": timeframes[1],
                "title": "State Management & Asynchronous API Integration",
                "summary": "Manage complex app states cleanly, handle offline caching, and connect to live cloud REST/GraphQL APIs.",
                "topics": ["Predictable State Management (Bloc / Provider / Zustand)", "HTTP Requests, JSON Serialization & Error Handling", "Local Storage & Offline Caching (SQLite / Hive)", "Forms, Input Validation & User Feedback"],
                "hands_on_project": {
                    "title": "Real-Time Weather & Live Location Tracking App",
                    "description": "Fetch real-time GPS coordinates, consume global weather APIs, and cache recent searches offline."
                },
                "milestone_goal": "Implement robust state management with flawless offline caching."
            },
            {
                "phase_number": 3,
                "timeframe": timeframes[2],
                "title": "Authentication, Push Notifications & Cloud Backends",
                "summary": "Integrate Firebase/Supabase for Google & Apple login, real-time database sync, and remote push notifications.",
                "topics": ["OAuth Authentication (Google, Apple, Email/Password)", "Cloud Firestore / Supabase Real-Time Subscriptions", "Push Notifications (Firebase Cloud Messaging)", "Device Hardware APIs (Camera, Biometrics, Geolocation)"],
                "hands_on_project": {
                    "title": "Real-Time Social Messenger with Media Sharing",
                    "description": "Develop an instant chat app with biometric lock, media uploads, and real-time read receipts."
                },
                "milestone_goal": "Integrate cloud auth, hardware camera access, and real-time push messaging."
            },
            {
                "phase_number": 4,
                "timeframe": timeframes[3],
                "title": "Performance Optimization, App Store & Play Store Deployment",
                "summary": "Profile frame rates, resolve memory leaks, configure release keystores, and submit to App Store and Google Play.",
                "topics": ["60 FPS Performance Profiling & Memory Leak Detection", "Writing Unit & Widget Tests", "CI/CD Mobile Pipelines (Fastlane / GitHub Actions)", "App Store (TestFlight) & Google Play Console Submission"],
                "hands_on_project": {
                    "title": "Production Release Build & App Store Ready Bundle",
                    "description": "Package, sign, and build production APK/AAB and iOS IPA bundles with automated Fastlane scripts."
                },
                "milestone_goal": "Publish a production-certified mobile app ready for App Store and Google Play."
            }
        ]
        job_roles = ["Mobile App Developer", "Flutter Developer", "React Native Engineer", "Cross-Platform Specialist"]
        salary = "$75,000 - $135,000 / ₹8 - ₹24 LPA"
        demand = "High & Steady (Consumer & SaaS Apps)"
    else:
        # Dynamic Custom Course Architecture for any course name typed
        prereqs = ["Basic Computing Fundamentals", "Problem Solving & Logic", "Commitment to Hands-on Practice"]
        tech_stack = [
            {"name": f"{course_clean} Core", "category": "Core Foundation"},
            {"name": "Modern Toolchain & IDE", "category": "Environment"},
            {"name": "Git & GitHub", "category": "Version Control"},
            {"name": "API & Data Integrations", "category": "Architecture"},
            {"name": "Production Testing Frameworks", "category": "Quality Assurance"}
        ]
        phases = [
            {
                "phase_number": 1,
                "timeframe": timeframes[0],
                "title": f"Phase 1: {course_clean} Foundations & Environment Setup",
                "summary": f"Establish a rock-solid grasp of foundational concepts, setup standard development tooling, and write your first programs.",
                "topics": [
                    f"Core syntax, data structures, and principles of {course_clean}",
                    "Development environment setup, package managers & linters",
                    "Version control with Git, branching strategies, and repository management",
                    "Basic algorithmic problem solving and writing clean, readable code"
                ],
                "hands_on_project": {
                    "title": f"{course_clean} Starter Application",
                    "description": f"Build a modular starter application implementing core principles, input handling, and automated error logging."
                },
                "milestone_goal": f"Master foundational workflows and syntax of {course_clean}."
            },
            {
                "phase_number": 2,
                "timeframe": timeframes[1],
                "title": f"Phase 2: Core Implementation & System Architecture",
                "summary": f"Dive deep into production design patterns, asynchronous workflows, data persistence, and service communication.",
                "topics": [
                    f"Advanced design patterns and architecture in {course_clean}",
                    "Connecting with databases, caching layers, and external REST APIs",
                    "Handling asynchronous tasks, background workers, and performance tuning",
                    "Structuring modular codebases for maintainability and team scalability"
                ],
                "hands_on_project": {
                    "title": f"Data-Driven {course_clean} Micro-Platform",
                    "description": f"Engineer an end-to-end operational platform with persistent storage, validation, and real-time updates."
                },
                "milestone_goal": "Architect scalable components and establish robust data flows."
            },
            {
                "phase_number": 3,
                "timeframe": timeframes[2],
                "title": f"Phase 3: Production Hardening, Testing & Optimization",
                "summary": f"Scale your solutions to production standards with comprehensive unit tests, security audits, and latency optimization.",
                "topics": [
                    "Writing automated unit, integration, and end-to-end test suites",
                    "Security hardening, authentication, role-based access control (RBAC)",
                    "Profiling bottlenecks, memory consumption, and query optimization",
                    "Containerization with Docker for consistent development and deployment"
                ],
                "hands_on_project": {
                    "title": f"Production-Ready {course_clean} Enterprise System",
                    "description": f"Build a fully tested, containerized application with automated error tracking and performance metrics."
                },
                "milestone_goal": "Deliver zero-defect, production-ready systems meeting enterprise benchmarks."
            },
            {
                "phase_number": 4,
                "timeframe": timeframes[3],
                "title": "Phase 4: Capstone Deployment, Portfolio & Job Placement",
                "summary": "Deploy your capstone project to cloud infrastructure, prepare an ATS-optimized resume, and conquer technical interviews.",
                "topics": [
                    "Cloud deployment (AWS/Vercel/DigitalOcean) with CI/CD automation",
                    "Crafting an impactful GitHub portfolio with live production demos",
                    f"Interview preparation: System design and domain technical questions for {course_clean}",
                    "ATS resume optimization and high-impact LinkedIn positioning"
                ],
                "hands_on_project": {
                    "title": f"Live Capstone Showcase Project: {course_clean} Production Suite",
                    "description": f"Launch a live, public-facing project with custom domain, automated deployment, and documentation."
                },
                "milestone_goal": "Pass technical job screens and showcase an industry-recognized portfolio."
            }
        ]
        job_roles = [f"{course_clean} Specialist", f"{course_clean} Engineer", "Software Developer", "Technical Consultant"]
        salary = "$80,000 - $145,000 / ₹9 - ₹26 LPA"
        demand = "Strong & Growing Across Tech Sectors"

    return {
        "course": course_clean,
        "tagline": f"Master {course_clean} from Foundations to Production Architecture in {duration}",
        "overview": f"A comprehensive, career-focused learning pathway designed to build production-grade competence in {course_clean}. Follow structured milestones with real-world projects and technical validation.",
        "difficulty": level,
        "duration": duration,
        "estimated_hours": total_hours,
        "weekly_hours": weekly,
        "goal": goal,
        "prerequisites": prereqs,
        "tech_stack": tech_stack,
        "phases": phases,
        "career_outcomes": {
            "job_roles": job_roles,
            "avg_salary": salary,
            "industry_demand": demand
        },
        "pro_tips": [
            f"Build at least 2 public GitHub projects implementing {course_clean} rather than just watching tutorials.",
            "Write clean unit tests and include architectural diagrams in your project Readme files.",
            "Focus on real-world constraints like latency, cost, and maintainability to stand out in technical interviews."
        ]
    }

def fetch_live_ai_roadmap(course: str, level: str, duration: str, goal: str) -> dict:
    try:
        url = "https://text.pollinations.ai/"
        system_prompt = (
            "You are VELFIRE AI, an expert software career roadmap architect. "
            "Generate an in-depth, realistic, career-aligned learning roadmap for the specified course. "
            "Output strictly valid JSON and nothing else. No markdown commentary outside JSON.\n"
            "JSON structure must match:\n"
            "{\n"
            '  "course": "...",\n'
            '  "tagline": "...",\n'
            '  "overview": "...",\n'
            '  "difficulty": "...",\n'
            '  "duration": "...",\n'
            '  "estimated_hours": "...",\n'
            '  "weekly_hours": "...",\n'
            '  "prerequisites": ["...", "..."],\n'
            '  "tech_stack": [{"name": "...", "category": "..."}],\n'
            '  "phases": [\n'
            '    {\n'
            '      "phase_number": 1,\n'
            '      "timeframe": "Weeks 1-2",\n'
            '      "title": "...",\n'
            '      "summary": "...",\n'
            '      "topics": ["...", "...", "...", "..."],\n'
            '      "hands_on_project": {"title": "...", "description": "..."},\n'
            '      "milestone_goal": "..."\n'
            '    }\n'
            '  ],\n'
            '  "career_outcomes": {\n'
            '    "job_roles": ["...", "..."],\n'
            '    "avg_salary": "...",\n'
            '    "industry_demand": "..."\n'
            '  },\n'
            '  "pro_tips": ["...", "...", "..."]\n'
            "}"
        )

        user_prompt = f"Course: {course}\nTarget Skill Level: {level}\nDuration: {duration}\nCareer Goal: {goal}\nGenerate the complete roadmap JSON now."
        payload = {
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "model": "openai",
            "jsonMode": True
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"}
        )
        with urllib.request.urlopen(req, timeout=9) as res:
            if res.status == 200:
                raw_text = res.read().decode("utf-8").strip()
                # Clean code blocks if present
                clean_json = re.sub(r'^```json\s*', '', raw_text, flags=re.IGNORECASE)
                clean_json = re.sub(r'```$', '', clean_json).strip()
                parsed = json.loads(clean_json)
                if isinstance(parsed, dict) and "phases" in parsed and len(parsed["phases"]) >= 2:
                    return parsed
    except Exception as e:
        print(f"Live AI roadmap generation error: {e}")
    return {}

@app.post("/api/roadmap/generate")
def generate_roadmap_endpoint(data: RoadmapRequest):
    course = data.course.strip()
    if not course:
        raise HTTPException(status_code=400, detail="Course or domain title is required.")

    level = data.level.strip() if data.level else "Intermediate"
    duration = data.duration.strip() if data.duration else "3 Months Mastery"
    goal = data.goal.strip() if data.goal else "Job Placement & Mastery"

    # Attempt live AI synthesis
    live_roadmap = fetch_live_ai_roadmap(course, level, duration, goal)
    if live_roadmap:
        return {
            "status": "success",
            "source": "live_llm",
            "roadmap": live_roadmap
        }

    # Deterministic high-quality fallback
    fallback_roadmap = build_fallback_roadmap(course, level, duration, goal)
    return {
        "status": "success",
        "source": "velfire_ai_engine",
        "roadmap": fallback_roadmap
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
