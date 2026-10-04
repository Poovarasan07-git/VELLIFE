import os
import sqlite3
import re
import bcrypt
import json
import urllib.request
import urllib.parse
from datetime import datetime
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Database file path
DB_PATH = os.path.join(os.path.dirname(__file__), "vellife.db")

app = FastAPI(title="VELLIFE API", version="1.0.0")

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
    return {"status": "ok", "app": "VELLIFE API"}

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

def load_env_file():
    """Load environment variables from .env if not already set or updated."""
    candidates = [
        os.path.join(os.path.dirname(__file__), ".env"),
        os.path.join(os.path.dirname(__file__), "..", ".env"),
    ]
    for p in candidates:
        if os.path.exists(p):
            try:
                with open(p, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            k, v = line.split("=", 1)
                            k = k.strip()
                            v = v.strip().strip('"').strip("'")
                            if k:
                                if v or not os.environ.get(k):
                                    os.environ[k] = v
            except Exception:
                pass

load_env_file()

def get_gemini_api_key() -> str:
    load_env_file()
    key = os.environ.get("GEMINI_API_KEY", "").strip()
    if key and key != "your_gemini_api_key_here":
        return key
    return ""

def clean_user_name(raw_name: str) -> str:
    if not raw_name:
        return "Student"
    s = re.sub(r'\d+', '', raw_name).strip()
    if s.lower().endswith("poo") and len(s) > 5:
        s = s[:-3]
    return s.capitalize() if s else "Student"

STUDENT_MENTOR_SYSTEM_PROMPT = (
    "You are the VELLIFE AI Student Mentor — a warm, inspiring, and deeply knowledgeable academic and career mentor "
    "dedicated to helping engineering students, college learners, and early-career developers succeed.\n\n"
    "Your Mission:\n"
    "- Demystify challenging subjects (Data Structures & Algorithms, Full-Stack Web Development, Python, JavaScript, "
    "React 19, Databases & SQL, Operating Systems, Computer Networks, AI/ML, System Architecture).\n"
    "- Guide students through university semester exams (like B.Tech R20, Anna University, VTU, JNTU), coding contests, "
    "and campus placement drives (TCS, Infosys, Zoho, Wipro, Amazon, Google, Startups).\n"
    "- Offer practical, step-by-step guidance so students build real confidence.\n\n"
    "Mentoring Principles:\n"
    "1. Warmth & Encouragement: Address the student warmly by name. Celebrate their curiosity, reassure them when "
    "they feel stuck, and maintain a friendly, empowering mentor-mentee relationship.\n"
    "2. Intuitive Deconstruction: Break concepts into 3 clear components: 'The Why' (Intuition & Real-World Analogy), "
    "'The How' (Step-by-step technical mechanism), and 'Common Mistakes to Avoid'.\n"
    "3. Runnable Code & Best Practices: Provide clean, idiomatic code examples with concise inline comments explaining "
    "why we do it this way. Always mention Time and Space Complexity (Big-O) for algorithms.\n"
    "4. Campus Placement & Interview Relevance: Connect theory to real placement interview questions, coding rounds, and production engineering.\n"
    "5. Actionable Next Steps: Wrap up with 1 concrete practice problem or a thoughtful check-in question for the student to try today.\n"
    "6. Markdown Formatting: Structure your responses with clean GitHub-flavored markdown: headers, bullet points, concise tables, and syntax-highlighted code blocks."
)

# Gemini fallback cascade sequence
GEMINI_FALLBACK_MODELS = [
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-pro",
]

def normalize_model_name(raw_model: str) -> str:
    m = (raw_model or "").lower().strip()
    if "lite" in m:
        return "gemini-flash-lite-latest"
    if "pro" in m:
        return "gemini-pro-latest"
    if "flash" in m or "gemini" in m or "2.0" in m or "2.5" in m or "1.5" in m:
        return "gemini-flash-latest"
    return "gemini-flash-latest"

def fetch_gemini_response(user_name: str, message: str, requested_model: str = "gemini-2.0-flash", override_key: str = "") -> tuple[str, str, bool]:
    """
    Attempts to generate a student mentor reply via Google Gemini API.
    Supports automatic fallback across multiple Gemini models if the primary model fails or encounters quota limits.
    Returns: (reply_text, model_name_used, was_fallback_used)
    """
    api_key = override_key.strip() if override_key.strip() else get_gemini_api_key()
    if not api_key:
        return "", "", False

    norm_primary = normalize_model_name(requested_model)
    models_to_try = [norm_primary]
    for fb in GEMINI_FALLBACK_MODELS:
        if fb not in models_to_try:
            models_to_try.append(fb)

    for idx, model_name in enumerate(models_to_try):
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
            payload = {
                "contents": [
                    {
                        "role": "user",
                        "parts": [
                            {"text": f"Student Name: {user_name}\n\nStudent's Doubt / Question:\n{message}"}
                        ]
                    }
                ],
                "systemInstruction": {
                    "parts": [{"text": STUDENT_MENTOR_SYSTEM_PROMPT}]
                },
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": 2048
                }
            }
            req_data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(
                url,
                data=req_data,
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=18) as res:
                if res.status == 200:
                    res_body = json.loads(res.read().decode("utf-8"))
                    candidates = res_body.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts and "text" in parts[0]:
                            text = parts[0]["text"].strip()
                            if text:
                                is_fallback = (idx > 0)
                                label = f"Google {model_name}" + (" (Fallback Model)" if is_fallback else "")
                                return text, label, is_fallback
        except Exception as e:
            print(f"Gemini API attempt failed on model '{model_name}': {e}. Cascading to next fallback model...")
            continue

    return "", "", False

def fetch_pollinations_fallback(user_name: str, message: str) -> tuple[str, str]:
    """
    Secondary Free Live LLM Fallback (Pollinations AI) with student mentor persona.
    Uses a fast 4s timeout so students never experience lag when cascading to offline engine.
    """
    try:
        combined_prompt = f"You are VELLIFE Student Mentor. Address {user_name} warmly. Question: {message}"
        url = f"https://text.pollinations.ai/{urllib.parse.quote(combined_prompt)}"
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0", "Accept": "text/plain"}
        )
        with urllib.request.urlopen(req, timeout=4) as res:
            if res.status == 200:
                answer = res.read().decode("utf-8").strip()
                if answer and len(answer) > 15 and not answer.startswith("Error"):
                    return answer, "Pollinations AI (Live Mentor Fallback)"
    except Exception as e:
        print(f"Pollinations live fallback skipped or timed out: {e}")
    return "", ""

def build_mentor_offline_fallback(user_name: str, message: str) -> str:
    """
    Tertiary Fallback: Rich domain mentor knowledge base for offline situations or when all external APIs are unreachable.
    """
    lower = message.lower()
    
    # 1. DSA & Algorithms
    if any(k in lower for k in ["dsa", "data structure", "algorithm", "time complexity", "big o", "array", "linked list", "tree", "graph", "recursion", "binary search", "stack", "queue", "dynamic programming"]):
        return (
            f"Great technical question, **{user_name}**! 💡 Here is your mentor breakdown for **Data Structures & Algorithms**:\n\n"
            "### 1. 🧠 Core Concept & Intuition\n"
            "DSA is fundamentally about choosing the most time-efficient and memory-conscious way to organize and manipulate data.\n"
            "- **Time Complexity (Big-O)**: Measures how execution time scales as input size `N` grows.\n"
            "- **Rule of Thumb for Interviews**:\n"
            "  - `O(1)`: Hash Maps, Direct Array Indexing.\n"
            "  - `O(log N)`: Binary Search, Balanced BST operations.\n"
            "  - `O(N)`: Single-pass algorithms, Two-Pointer technique.\n"
            "  - `O(N log N)`: Merge Sort, Quick Sort.\n\n"
            "### 2. 💻 Clean Practice Example (Two-Pointer Technique)\n"
            "```python\n"
            "# Classic O(N) Two-Pointer approach to find target sum in a sorted array\n"
            "def has_pair_with_sum(arr: list[int], target: int):\n"
            "    left, right = 0, len(arr) - 1\n"
            "    while left < right:\n"
            "        current_sum = arr[left] + arr[right]\n"
            "        if current_sum == target:\n"
            "            return True, (left, right)  # Found indices in O(N) time, O(1) space\n"
            "        elif current_sum < target:\n"
            "            left += 1  # Need larger sum, advance left\n"
            "        else:\n"
            "            right -= 1  # Need smaller sum, decrease right\n"
            "    return False, None\n"
            "```\n\n"
            "### 3. 🎯 Placement & Exam Strategy\n"
            "- Practice 2 problems daily on LeetCode/GeeksforGeeks (Start with Array & String, then Hashing & Two Pointers).\n"
            "- In campus interviews, always explain your brute-force `O(N^2)` idea first, then optimize to `O(N)` before coding.\n\n"
            f"Would you like me to walk through a specific DSA problem or give you today's practice challenge, **{user_name}**?"
        )

    # 2. Web Development (Full-Stack / React / FastAPI)
    if any(k in lower for k in ["fullstack", "full stack", "react", "fastapi", "frontend", "backend", "web dev", "rest api", "html", "css", "javascript"]):
        return (
            f"Awesome focus on Web Development, **{user_name}**! 🌐 Here is your mentor roadmap for modern Full-Stack mastery:\n\n"
            "### 1. 🏗️ The 3 Modern Web Layers\n"
            "1. **Frontend (Client-Side)**: React 19 + Vanilla CSS / Tailwind. Handles state, UI interactions, and calling REST APIs.\n"
            "2. **Backend (Server-Side)**: Python FastAPI or Node Express. Handles route schemas, JWT authentication, and business logic.\n"
            "3. **Database (Persistence)**: SQLite for rapid local prototyping, PostgreSQL for scalable production deployments.\n\n"
            "### 2. 💻 Standard REST API Architecture\n"
            "```python\n"
            "from fastapi import FastAPI, HTTPException\n"
            "from pydantic import BaseModel\n\n"
            "app = FastAPI(title='Student Learning API')\n\n"
            "class DoubtPayload(BaseModel):\n"
            "    topic: str\n"
            "    difficulty: str = 'Medium'\n\n"
            "@app.post('/api/doubts/solve')\n"
            "def solve_doubt(data: DoubtPayload):\n"
            "    return {'status': 'success', 'guidance': f'Detailed explanation for {data.topic}'}\n"
            "```\n\n"
            "### 3. 🚀 Placement Checklist:\n"
            "- Build **2 full-stack projects** featuring user authentication (JWT/bcrypt) and a database.\n"
            "- Deploy them live on GitHub and Vercel/Render so recruiters can test them directly.\n\n"
            f"What specific part of full-stack would you like to build right now, **{user_name}**?"
        )

    # 3. Database & SQL
    if any(k in lower for k in ["sql", "database", "query", "join", "group by", "index", "normalization", "sqlite", "postgres"]):
        return (
            f"SQL is one of the highest-ROI skills for tech careers, **{user_name}**! 💾 Here is your mentor guide:\n\n"
            "### 1. 🔑 Core Commands Every Fresher Must Master\n"
            "- **`JOIN` Types**: `INNER JOIN` (matching rows only), `LEFT JOIN` (all left rows + matching right rows).\n"
            "- **`GROUP BY` with `HAVING`**: Aggregate metrics per category, filtering after aggregation.\n"
            "- **Window Functions**: `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `LEAD()`, `LAG()`.\n\n"
            "### 2. 💻 Interview SQL Template (Second Highest Salary)\n"
            "```sql\n"
            "-- Common campus interview question: Find 2nd highest salary\n"
            "SELECT DISTINCT salary \n"
            "FROM employees \n"
            "ORDER BY salary DESC \n"
            "LIMIT 1 OFFSET 1;\n"
            "```\n\n"
            "### 3. 🎯 Practice Recommendation:\n"
            "Complete the SQL 50 study plan on LeetCode. It will cover 95% of questions asked in campus coding rounds.\n\n"
            f"Do you want me to explain any specific SQL topic like Joins, Indexing, or Window Functions, **{user_name}**?"
        )

    # 4. Domain & Career Guidance
    if ("python" in lower and "sql" in lower) or any(k in lower for k in ["career", "domain", "which is better", "roadmap", "future", "jobs"]):
        return (
            f"You're in a great position, **{user_name}**! 🚀 As your mentor, here is how you can leverage your skills for top career paths:\n\n"
            "### 📊 High-Demand Domains for Freshers (2026)\n"
            "| Domain | Primary Stack | Best For | Hiring Trend |\n"
            "| :--- | :--- | :--- | :--- |\n"
            "| **Full-Stack Development** | React 19 + Python FastAPI + SQLite/Postgres | Those who love building complete web apps | Very High Hiring Volume |\n"
            "| **Data Analyst** | Python (Pandas) + SQL + Power BI / Tableau | Those who love finding business insights | High Corporate Demand |\n"
            "| **AI / ML Engineer** | Python + PyTorch + LLM APIs + Vector DBs | Those excited by GenAI and smart automation | High Premium Salaries |\n\n"
            "### 🎯 Mentor Action Plan:\n"
            "1. **Build 2 Capstone Projects**: Host them on GitHub with live demo URLs in your resume.\n"
            "2. **Sharpen Core Fundamentals**: 1 hour of DSA + 1 hour of project coding daily.\n\n"
            f"Which of these domains excites you the most, **{user_name}**? Let's build a dedicated roadmap for it!"
        )

    # 5. Exam & Semester Study Preparation
    if any(k in lower for k in ["exam", "semester", "r20", "study", "syllabus", "marks", "grade", "gpa"]):
        return (
            f"Let's tackle your exams systematically, **{user_name}**! 📚 Here is the proven university exam strategy:\n\n"
            "### 🎯 3-Step Exam Mastery Blueprint:\n"
            "1. **80/20 Rule on Previous Year Questions (PYQs)**: 70-80% of university exam questions repeat core themes from the last 3-5 years. Solve them first!\n"
            "2. **Neat Architectural Diagrams**: In university exams (like R20/Anna Univ), diagrams, flowcharts, and block diagrams earn 40-50% of the marks in 10-mark questions.\n"
            "3. **Modular Code Snippets**: Write short, clean 5-10 line code blocks with comments rather than unbroken text paragraphs.\n\n"
            f"Which subject or unit are you preparing for right now, **{user_name}**? Let's break down the important questions!"
        )

    clean_topic = re.sub(r'^(can you|please|tell me|explain|what is|how to|i want to|i am)\s+', '', message, flags=re.IGNORECASE).strip(' ?!')
    title = clean_topic.capitalize() if clean_topic else "Your Topic"
    return (
        f"I'm glad you brought this up, **{user_name}**! 🌟 Here is my step-by-step mentor guidance on **{title}**:\n\n"
        "### 1. 🎯 Foundational Understanding\n"
        f"When approaching *{message.rstrip('?!.')}*, always clarify the core objective and break down the problem into smaller milestones.\n\n"
        "### 2. 🛠️ Practical Best Practices\n"
        "- **Deconstruct the Concept**: Master the fundamental building blocks before diving into complex edge cases.\n"
        "- **Hands-On Experimentation**: Write small test scripts or prototypes to observe outputs directly.\n"
        "- **Clean Code & Documentation**: Use descriptive variable names and document design decisions.\n\n"
        "### 3. 🚀 Next Action Item\n"
        "Spend 15 minutes today building a minimal runnable example of this concept to solidify your understanding.\n\n"
        f"Would you like me to generate a tailored code template or quiz you on this concept, **{user_name}**?"
    )

# Request schemas
class ChatRequest(BaseModel):
    user_name: str = "Student"
    message: str = ""
    model: str = "gemini-2.0-flash"
    api_key: str = ""

@app.get("/api/ai/status")
def ai_status():
    key = get_gemini_api_key()
    has_key = bool(key)
    masked = f"{key[:6]}...{key[-4:]}" if (has_key and len(key) > 10) else ("Configured" if has_key else "Not Set")
    return {
        "status": "online",
        "mentor_name": "VELLIFE AI Student Mentor",
        "has_gemini_key": has_key,
        "masked_gemini_key": masked,
        "primary_model": "gemini-2.0-flash",
        "gemini_fallback_models": GEMINI_FALLBACK_MODELS,
        "secondary_fallback": "Pollinations AI (Multi-LLM)",
        "tertiary_fallback": "VELLIFE Offline Student Mentor Knowledge Engine",
        "fast_greetings_supported": True
    }

@app.post("/api/chat")
def chat_ai(data: ChatRequest):
    message = data.message.strip()
    user_name = clean_user_name(data.user_name)
    requested_model = data.model.strip() if data.model else "gemini-2.0-flash"

    if not message:
        raise HTTPException(status_code=400, detail="Message content cannot be empty.")

    lower = message.lower().strip()

    # -------------------------------------------------------------
    # 1. Basic Greetings (Ultra-fast, warm student mentor answers)
    # -------------------------------------------------------------
    greeting_words = [
        "hi", "hello", "hey", "vanakkam", "namaste", "good morning", 
        "good evening", "good afternoon", "greetings", "sup", "yo", "hola", "wassup"
    ]
    is_greeting = any(
        lower == g or lower.startswith(g + " ") or lower.endswith(" " + g) or lower.startswith(g + "!") or lower.startswith(g + ",") 
        for g in greeting_words
    )
    # Only treat as basic greeting if not asking a technical question in the same sentence
    technical_triggers = ["explain", "what is", "how to", "code", "problem", "solve", "why", "difference", "error", "bug", "write"]
    has_tech_query = any(t in lower for t in technical_triggers)

    if is_greeting and not has_tech_query and len(lower.split()) <= 5:
        return {
            "status": "success",
            "reply": (
                f"Hello **{user_name}**! 👋 Welcome to your **VELLIFE Student Mentor** session.\n\n"
                "I'm here to guide you through coding challenges, academic doubts, project architecture, and campus placement prep. "
                "What topic or goal are we focusing on today?"
            ),
            "source": "VELLIFE Student Mentor (Instant)",
            "model_used": "Student Mentor (Fast Greetings)",
            "is_fallback": False
        }

    # -------------------------------------------------------------
    # 2. Conversational Check-in ("How are you")
    # -------------------------------------------------------------
    if any(phrase in lower for phrase in ["how are you", "how r u", "how r you", "how u doing", "how is it going", "hows it going", "whats up", "what's up"]):
        return {
            "status": "success",
            "reply": (
                f"I'm doing wonderful and fully charged to guide you today, **{user_name}**! 🌟\n\n"
                "How are your studies and coding practice going? Whether you're stuck on a bug, preparing for semester exams, or exploring a new tech stack, I'm right here with you!"
            ),
            "source": "VELLIFE Student Mentor (Instant)",
            "model_used": "Student Mentor (Fast Greetings)",
            "is_fallback": False
        }

    # -------------------------------------------------------------
    # 3. Identity & Capabilities ("Who are you" / "What can you do")
    # -------------------------------------------------------------
    if any(phrase in lower for phrase in ["who are you", "what are you", "what can you do", "introduce yourself", "tell me about yourself", "who r u", "who is your mentor"]):
        return {
            "status": "success",
            "reply": (
                f"I am your **VELLIFE AI Student Mentor**! 🎓\n\n"
                "Think of me as your dedicated 24/7 senior mentor and career guide. Here's what we can achieve together:\n\n"
                "1. **📚 Academic & Subject Doubts**: Demystify algorithms, operating systems, DBMS, data structures, and computer science theory.\n"
                "2. **💻 Hands-On Coding & Debugging**: Write clean Python, JavaScript, React, SQL, and backend code with step-by-step guidance.\n"
                "3. **🗺️ Career & Placement Roadmaps**: Craft tailored 30/60/90-day learning schedules for Web Dev, AI/ML, Data Analytics, or Cloud.\n"
                "4. **📄 Resume & Interview Prep**: Polish resume bullet points, review project architectures, and practice technical interview questions.\n\n"
                f"What's your current goal or biggest doubt right now, **{user_name}**?"
            ),
            "source": "VELLIFE Student Mentor (Instant)",
            "model_used": "Student Mentor (Fast Greetings)",
            "is_fallback": False
        }

    # -------------------------------------------------------------
    # 4. Student Mental Well-Being & Stress Support
    # -------------------------------------------------------------
    stress_phrases = [
        "stressed", "overwhelmed", "confused", "lost", "give up", 
        "cannot understand coding", "coding is hard", "placement tension", 
        "exam fear", "scared of interview", "im scared", "i am scared"
    ]
    if any(sp in lower for sp in stress_phrases):
        return {
            "status": "success",
            "reply": (
                f"Take a deep breath, **{user_name}**! 💙 It is completely normal to feel this way. "
                "Every great engineer has felt overwhelmed or stuck on confusing concepts at some point.\n\n"
                "### 🌿 3-Step Reset for You:\n"
                "1. **Stop Compounding Stress**: Step away from the screen for 10 minutes. Hydrate and clear your mind.\n"
                "2. **One Small Step**: We don't need to conquer the whole syllabus or build an entire app in one afternoon. Master just *one concept* or fix *one line of code* at a time.\n"
                "3. **I'm With You**: Tell me the exact topic or bug that's bothering you right now. I will break it down into simple, painless steps!\n\n"
                f"What is the single thing feeling the hardest right now, **{user_name}**?"
            ),
            "source": "VELLIFE Student Mentor (Empathetic Care)",
            "model_used": "Student Mentor (Well-Being)",
            "is_fallback": False
        }

    # -------------------------------------------------------------
    # 5. Quick Starters ("How to start coding" / "Placement tips")
    # -------------------------------------------------------------
    if any(q in lower for q in ["how to start coding", "how to prepare for placement", "placement tips", "fresher tips", "how to study"]):
        return {
            "status": "success",
            "reply": (
                f"Great question, **{user_name}**! 🚀 Here is the ultimate **Mentor Blueprint for Tech Freshers**:\n\n"
                "### 📌 4 Golden Pillars:\n"
                "1. **Pick One Core Language First**: Master Python, Java, or C++ deeply (Loops, Functions, OOPs, Collections).\n"
                "2. **DSA Consistency**: Solve 1-2 easy/medium problems daily on LeetCode or GeeksforGeeks.\n"
                "3. **Build 2 Real Capstone Projects**: Instead of basic clones, build an app that solves a real problem with authentication and a database.\n"
                "4. **Git & Portfolio**: Push your code to GitHub with clean README documentation.\n\n"
                f"Which programming language or tech stack are you most comfortable with, **{user_name}**?"
            ),
            "source": "VELLIFE Student Mentor (Guidance)",
            "model_used": "Student Mentor (Fast Guidance)",
            "is_fallback": False
        }

    # -------------------------------------------------------------
    # 6. Acknowledgments & Thanks
    # -------------------------------------------------------------
    if lower in ["ok", "okay", "got it", "sure", "cool", "alright", "great", "nice", "awesome", "k", "fine", "kk", "ok brother", "ok bro", "thank you", "thanks", "thanks mentor", "ty", "thx", "understood"]:
        return {
            "status": "success",
            "reply": f"Awesome, **{user_name}**! 👍 Keep up that great momentum. Remember, steady practice turns tough concepts into second nature. Ask me anytime you hit your next question!",
            "source": "VELLIFE Student Mentor (Instant)",
            "model_used": "Student Mentor (Fast Greetings)",
            "is_fallback": False
        }

    # -------------------------------------------------------------
    # 7. Apologies
    # -------------------------------------------------------------
    if any(lower == w or lower.startswith(w + " ") or lower.endswith(" " + w) for w in ["sry", "sorry", "my bad", "oops", "apologies", "sory"]):
        return {
            "status": "success",
            "reply": f"No need to apologize at all, **{user_name}**! 😊 Mistakes are the absolute best learning opportunities in engineering. What would you like to explore next?",
            "source": "VELLIFE Student Mentor (Instant)",
            "model_used": "Student Mentor (Fast Greetings)",
            "is_fallback": False
        }

    # -------------------------------------------------------------
    # 8. Primary Engine: Google Gemini API (With Fallback Models)
    # -------------------------------------------------------------
    gemini_reply, used_gemini_model, is_gemini_fallback = fetch_gemini_response(
        user_name=user_name,
        message=message,
        requested_model=requested_model,
        override_key=data.api_key
    )
    if gemini_reply:
        return {
            "status": "success",
            "reply": gemini_reply,
            "source": used_gemini_model,
            "model_used": used_gemini_model,
            "is_fallback": is_gemini_fallback
        }

    # -------------------------------------------------------------
    # 9. Fallback Tier 1: Pollinations Multi-LLM (Live Mentor)
    # -------------------------------------------------------------
    fallback_llm_reply, fallback_source = fetch_pollinations_fallback(user_name, message)
    if fallback_llm_reply:
        return {
            "status": "success",
            "reply": fallback_llm_reply,
            "source": fallback_source,
            "model_used": fallback_source,
            "is_fallback": True
        }

    # -------------------------------------------------------------
    # 10. Fallback Tier 2: Offline Domain Knowledge Mentor Engine
    # -------------------------------------------------------------
    offline_reply = build_mentor_offline_fallback(user_name, message)
    return {
        "status": "success",
        "reply": offline_reply,
        "source": "VELLIFE Student Mentor (Offline Engine)",
        "model_used": "Offline Knowledge Engine",
        "is_fallback": True
    }

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
            "You are VELLIFE AI, an expert software career roadmap architect. "
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
        "source": "vellife_ai_engine",
        "roadmap": fallback_roadmap
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
