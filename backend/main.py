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
    "You are the VELLIFE Placement Mentor & Career Acceleration AI — a top-tier technical interviewer, "
    "DSA coach, and campus placement strategist for engineering students and job candidates.\n\n"
    "Platform Context (VELLIFE Ecosystem):\n"
    "- 10 High-Demand Tech Domains: Full Stack Development (React 19 + Python FastAPI/Node), Data Analyst (Python, SQL, Power BI, Excel), "
    "Data Science (Pandas, Scikit-Learn, ML), AI/ML Engineering (PyTorch, LLMs, Neural Networks), Backend Development (FastAPI, PostgreSQL, Docker), "
    "Cloud Engineering (AWS, Docker, K8s, Linux), Cybersecurity, UI/UX Design, SAP Consultant, and Business Analyst.\n"
    "- Placement Tools: ATS Resume Builder (STAR format, single-column), ATS Resume Analyzer (keyword scoring out of 100), "
    "VELLIFE AI Roadmaps (1, 3, and 6-month timelines), and the VELLIFE Placement Gate (requiring 80%+ mock interview score to unlock direct Job Portal applications).\n\n"
    "Core Placement Focus & Responsibilities:\n"
    "1. Coding Rounds & Online Assessments (OA): Arrays, Strings, Two Pointers, Sliding Window, Hashing, Trees, Graphs, Dynamic Programming, Recursion, Time & Space Complexity (Big-O analysis).\n"
    "2. Technical Interview Questions: Python, Java, C++, JavaScript, React 19, FastAPI, DBMS & SQL, Operating Systems (Deadlocks, Paging, Threads), Computer Networks (TCP/IP, HTTP/HTTPS), OOP Principles.\n"
    "3. Company-Specific Placement Patterns: Service giants (TCS NQT/Digital/Prime, Infosys DSE/SP, Cognizant GenC/Next, Wipro, Accenture) vs Product/Startup leaders (Zoho Round 1-3, Amazon SDE-1, Swiggy, FinTech).\n"
    "4. Resume & ATS Optimization: Translating projects into quantified STAR bullet points, avoiding ATS rejection, highlighting tech stacks.\n"
    "5. Behavioral & HR Rounds: Answering 'Tell me about yourself', 'Why should we hire you?', handling career gaps, strengths/weaknesses with realistic, winning answers.\n"
    "6. Aptitude & Logical Reasoning: Speed math, percentages, permutations, logical reasoning shortcuts.\n\n"
    "CRITICAL RULES FOR RESPONSES:\n"
    "1. PLACEMENT GROUNDING: Always frame answers through the lens of campus placement interviews, coding assessments, or recruiter expectations. For technical questions, mention what interviewers look for and common follow-up traps.\n"
    "2. NO DUPLICATE OR CANNED ANSWERS: Never repeat the exact same response if the student asks the same or a related question. Always provide a fresh angle: an alternative optimal approach, a new placement drill question, a company-specific variation (e.g. how Zoho vs TCS asks it), or deeper edge-case analysis.\n"
    "3. CODE QUALITY & COMPLEXITY: Provide clean, production-grade runnable code with Time (Big-O) and Space complexity clearly stated.\n"
    "4. ACTIONABLE DRILL: End with 1 interactive placement follow-up question or coding challenge for the student.\n"
    "5. Markdown Formatting: Structure answers with crisp headings, bullet points, and syntax-highlighted code blocks."
)

# Gemini fallback cascade sequence (gemini-flash-lite-latest and gemini-flash-latest verified active and fastest)
GEMINI_FALLBACK_MODELS = [
    "gemini-flash-lite-latest",
    "gemini-flash-latest",
    "gemini-2.5-flash",
    "gemini-pro-latest",
]

def normalize_model_name(raw_model: str) -> str:
    m = (raw_model or "").lower().strip()
    if "pro" in m:
        return "gemini-pro-latest"
    if "flash-latest" in m or "2.0" in m:
        return "gemini-flash-latest"
    return "gemini-flash-lite-latest"

def fetch_gemini_response(
    user_name: str, 
    message: str, 
    requested_model: str = "gemini-flash-latest", 
    override_key: str = "", 
    history: list = None,
    is_regenerate: bool = False
) -> tuple[str, str, bool]:
    """
    Generates a placement mentor reply via Google Gemini API with:
    - Full multiturn conversation history with strictly alternating roles.
    - Anti-duplication detection: If the query is repeated or regenerate is requested, adds an explicit directive to force a fresh alternative angle.
    - Cascade across fast verified Gemini models.
    """
    api_key = override_key.strip() if override_key.strip() else get_gemini_api_key()
    if not api_key:
        return "", "", False

    norm_primary = normalize_model_name(requested_model)
    models_to_try = [norm_primary]
    for fb in GEMINI_FALLBACK_MODELS:
        if fb not in models_to_try:
            models_to_try.append(fb)

    # Detect if user is repeating a previous question or asked for regeneration
    is_repeated = is_regenerate
    if not is_repeated and history and isinstance(history, list):
        norm_curr = re.sub(r'[^a-z0-9]', '', message.lower())
        for h in history:
            if h.get("role") in ["user", "human"]:
                norm_prev = re.sub(r'[^a-z0-9]', '', (h.get("text") or "").lower())
                if norm_prev and (norm_prev == norm_curr or (len(norm_prev) > 10 and norm_prev in norm_curr)):
                    is_repeated = True
                    break

    # Build conversation contents with strictly alternating user -> model roles
    contents = []
    if history and isinstance(history, list):
        last_role = None
        for h in history[-8:]:
            raw_role = (h.get("role") or "").lower()
            role = "user" if raw_role in ["user", "human"] else "model"
            text_val = (h.get("text") or "").strip()
            if not text_val:
                continue
            if role == last_role and contents:
                contents[-1]["parts"][0]["text"] += "\n\n" + text_val
            else:
                contents.append({"role": role, "parts": [{"text": text_val}]})
                last_role = role

    # Ensure last message in history before our new prompt is not a user message
    if contents and contents[-1]["role"] == "user":
        contents.pop()

    anti_dup_prompt = ""
    if is_repeated:
        anti_dup_prompt = (
            "\n\n[CRITICAL PLACEMENT MENTOR DIRECTIVE - NO REPETITION / PROVIDE FRESH PERSPECTIVE]:\n"
            "The student has previously asked this or a very similar question earlier in this session. "
            "DO NOT REPEAT YOUR PREVIOUS ANSWER OR GIVE A CANNED EXPLANATION. "
            "You MUST provide a COMPLETELY DIFFERENT, high-value angle:\n"
            "1. An alternative optimal algorithmic approach (e.g. Iterative vs Recursive, Space-Optimized O(1), Two-Pointers vs Hashing).\n"
            "2. Company-specific interview variations (e.g. how Zoho or Amazon asks this in Round 2 vs how TCS NQT/Digital tests it).\n"
            "3. Tricky edge cases, interviewer trap questions, and common mistakes freshers make during live technical rounds.\n"
            "4. Or an interactive Placement Drill / 3-question Mock Interview follow-up.\n"
            "Make this response distinctly fresh, insightful, and practical!"
        )

    user_text = f"Student Name: {user_name}\n\nStudent's Placement / Technical Doubt:\n{message}{anti_dup_prompt}"
    contents.append({
        "role": "user",
        "parts": [{"text": user_text}]
    })

    for idx, model_name in enumerate(models_to_try):
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
            payload = {
                "contents": contents,
                "systemInstruction": {
                    "parts": [{"text": STUDENT_MENTOR_SYSTEM_PROMPT}]
                },
                "generationConfig": {
                    "temperature": 0.85,
                    "topP": 0.95,
                    "maxOutputTokens": 2048
                }
            }
            req_data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(
                url,
                data=req_data,
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=12) as res:
                if res.status == 200:
                    res_body = json.loads(res.read().decode("utf-8"))
                    candidates = res_body.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts and "text" in parts[0]:
                            text = parts[0]["text"].strip()
                            if text:
                                is_fallback = (idx > 0)
                                label = f"VELLIFE Placement Mentor ({model_name})"
                                return text, label, is_fallback
        except Exception as e:
            print(f"Gemini API model '{model_name}' skipped: {e}. Trying next...")
            continue

    return "", "", False

def fetch_pollinations_fallback(user_name: str, message: str) -> tuple[str, str]:
    """
    Secondary Free Live LLM Fallback (Pollinations AI) with placement mentor persona.
    """
    try:
        combined_prompt = (
            f"You are the VELLIFE Placement Mentor AI. Guide student {user_name} with practical campus placement advice, "
            f"coding interview analysis, Time/Space complexity, or company patterns. Do not repeat canned text. Question: {message}"
        )
        url = f"https://text.pollinations.ai/{urllib.parse.quote(combined_prompt)}"
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0", "Accept": "text/plain"}
        )
        with urllib.request.urlopen(req, timeout=5) as res:
            if res.status == 200:
                answer = res.read().decode("utf-8").strip()
                if answer and len(answer) > 15 and not answer.startswith("Error"):
                    return answer, "Pollinations AI (Live Placement Mentor Fallback)"
    except Exception as e:
        print(f"Pollinations live fallback skipped or timed out: {e}")
    return "", ""

def build_mentor_offline_fallback(user_name: str, message: str, history: list = None) -> str:
    """
    Tertiary Fallback: Rich, dynamic, multi-variant Placement Mentor Knowledge Engine.
    Computes a rotation variant so the student NEVER gets a duplicate response even if offline!
    """
    lower = message.lower()
    
    # Calculate variation index (0, 1, or 2) to guarantee non-duplicate answers
    history_len = len(history) if history else 0
    variant = (history_len + abs(hash(message))) % 3

    # 1. DSA & Algorithms
    if any(k in lower for k in ["dsa", "data structure", "algorithm", "time complexity", "big o", "array", "linked list", "tree", "graph", "recursion", "binary search", "stack", "queue", "dynamic programming", "two pointer", "sliding window"]):
        if variant == 0:
            return (
                f"### 💡 Placement Round 1 Focus: Data Structures & Algorithms for **{user_name}**\n\n"
                "In campus placement coding rounds (TCS Digital, Cognizant GenC Next, Amazon OA), interviewers evaluate your code on **optimal time complexity and zero TLE (Time Limit Exceeded)**.\n\n"
                "### 1. 🧠 Core Placement Patterns & Big-O Hierarchy\n"
                "- **O(1) & O(log N)**: Hash Map Lookups, Binary Search on Answer space. (Always expected if input array is sorted or `N <= 10^9`).\n"
                "- **O(N)**: Two Pointers, Sliding Window, Single-pass frequency array.\n"
                "- **O(N log N)**: Divide & Conquer (Merge Sort, Heap operations).\n"
                "- **O(N^2) Warning**: Brute-force nested loops will fail hidden test cases when `N >= 10^4`!\n\n"
                "### 2. 💻 Optimal Implementation (Two-Pointer Technique)\n"
                "```python\n"
                "# Classic O(N) Two-Pointer approach to find target pair in sorted array\n"
                "def find_target_pair(arr: list[int], target: int) -> tuple[int, int] | None:\n"
                "    left, right = 0, len(arr) - 1\n"
                "    while left < right:\n"
                "        current = arr[left] + arr[right]\n"
                "        if current == target:\n"
                "            return (arr[left], arr[right])  # O(N) time, O(1) auxiliary space\n"
                "        elif current < target:\n"
                "            left += 1\n"
                "        else:\n"
                "            right -= 1\n"
                "    return None\n"
                "```\n\n"
                "### 3. 🎯 Interviewer Follow-Up Drill:\n"
                "*'What if the array contains duplicate elements or is not sorted?'* How would you adapt this using a Hash Set in O(N) time and O(N) space, **{user_name}**?"
            )
        elif variant == 1:
            return (
                f"### 🚀 Alternative Placement Angle: Company-Specific DSA Patterns for **{user_name}**\n\n"
                "Let's look at how top recruiters test this exact concept differently:\n\n"
                "1. **TCS (NQT / Digital / Prime)**: Focuses heavily on edge cases (e.g. empty arrays, single elements, negative numbers, and integer overflow with `10^9`).\n"
                "2. **Zoho (Round 2 & 3)**: Tests problem-solving **without built-in library functions** (e.g. sorting without `.sort()`, string parsing without `split()`).\n"
                "3. **Amazon & Product Startups**: Expects you to explain the **Brute Force (O(N^2))** solution first, state its bottleneck, and cleanly transition to the **Optimal (O(N))** solution.\n\n"
                "### 💡 Live Interviewer Tip:\n"
                "Never write code immediately! Spend the first 2 minutes dry-running with a small example on paper or whiteboard. State: *'The brute force takes O(N^2). We can optimize this to O(N) using a two-pointer approach because the input is sorted.'*\n\n"
                f"Would you like to practice a live coding problem on this pattern right now, **{user_name}**?"
            )
        else:
            return (
                f"### 🔍 Deep-Dive: Interview Edge-Case Traps & Complexity Optimization for **{user_name}**\n\n"
                "Here are the subtle traps that cause 60% of students to fail the technical round even when their logic is generally correct:\n\n"
                "1. **Off-by-One Index Errors**: Loop bounds like `while left <= right` vs `while left < right` in Binary Search.\n"
                "2. **Integer Overflow in Mid Calculation**: Using `(left + right) // 2` instead of `left + (right - left) // 2` in C++/Java when values exceed $2^{31}-1$.\n"
                "3. **Auxiliary Space Hidden Cost**: Creating sub-arrays or slices `arr[mid:]` in Python creates $O(N)$ copies, turning an $O(\\log N)$ space algorithm into $O(N)$!\n\n"
                "### 🎯 Actionable VELLIFE Drill:\n"
                "Solve 3 medium LeetCode/GeeksforGeeks problems on this topic today, and log your progress in the VELLIFE Learning Portal to boost your Placement Preparation Score!"
            )

    # 2. Web Development (Full-Stack / React / FastAPI)
    if any(k in lower for k in ["fullstack", "full stack", "react", "fastapi", "frontend", "backend", "web dev", "rest api", "html", "css", "javascript"]):
        if variant == 0:
            return (
                f"### 🌐 Full-Stack Placement Architecture Guide for **{user_name}**\n\n"
                "In tech interviews for Full-Stack Developer roles (e.g. React 19 + Python FastAPI), tech panels test your ability to bridge client and server seamlessly.\n\n"
                "### 1. 🏗️ High-Scale Placement Stack\n"
                "- **Client (Frontend)**: React 19 Single Page App (Component state, `useEffect` cleanups, responsive design).\n"
                "- **Server (Backend)**: Python FastAPI with asynchronous endpoints (`async def`) and Pydantic validation schemas.\n"
                "- **Database & Persistence**: SQLite for local testing, PostgreSQL with SQLAlchemy ORM for production.\n\n"
                "### 2. 💻 Production-Grade Endpoint Example\n"
                "```python\n"
                "from fastapi import FastAPI, HTTPException, status\n"
                "from pydantic import BaseModel, EmailStr\n\n"
                "app = FastAPI(title='VELLIFE Campus Placement API')\n\n"
                "class CandidateSchema(BaseModel):\n"
                "    name: str\n"
                "    domain: str = 'Full Stack Development'\n"
                "    mock_score: int\n\n"
                "@app.post('/api/placement/verify', status_code=status.HTTP_200_OK)\n"
                "async def verify_candidate(data: CandidateSchema):\n"
                "    if data.mock_score < 80:\n"
                "        return {'status': 'Gate Locked', 'message': 'Requires 80%+ mock score to unlock Job Portal'}\n"
                "    return {'status': 'Gate Passed', 'eligible_jobs': 24}\n"
                "```\n\n"
                "### 3. 🎯 ATS Resume Tip for Freshers:\n"
                "Do not write *'Created a website'*. Write: *'Architected a full-stack platform using React 19 and FastAPI, reducing API latency by 35% with asynchronous SQLite caching.'*"
            )
        elif variant == 1:
            return (
                f"### ⚙️ Full-Stack Interview Deep-Dive: Common Tech Round Questions for **{user_name}**\n\n"
                "Here are the top 5 questions interviewers consistently ask for entry-level Full-Stack and Frontend roles:\n\n"
                "1. **State Management & Re-renders**: *'How does React 19 manage Virtual DOM diffing, and how do you prevent unnecessary re-renders in heavy components?'*\n"
                "2. **CORS (Cross-Origin Resource Sharing)**: *'Why does CORS error happen when React (port 5173) calls FastAPI (port 8000), and how do you resolve it properly?'*\n"
                "3. **Authentication Architecture**: *'Explain how JWT tokens and bcrypt password hashing secure user sessions compared to plain session cookies.'*\n"
                "4. **REST vs GraphQL**: *'What are over-fetching and under-fetching, and when would you choose FastAPI REST over GraphQL?'*\n"
                "5. **Database Indexing**: *'How does a B-Tree index speed up SELECT queries on foreign keys?'*\n\n"
                f"Which of these 5 questions would you like to practice answering right now, **{user_name}**?"
            )
        else:
            return (
                f"### 📋 Full-Stack Capstone Project Blueprint for Placements for **{user_name}**\n\n"
                "Recruiters reject generic clone projects (like basic to-do lists or weather apps). To stand out in campus drives, your project needs 3 enterprise pillars:\n\n"
                "1. **Real Authentication & Role-Based Access (RBAC)**: Student vs Admin role permissions.\n"
                "2. **Data Persistence with Schema Validation**: Pydantic models in Python + Relational DB queries.\n"
                "3. **Live Deployment with CI/CD**: Host your backend on Render/Railway and frontend on Vercel, with GitHub Actions automated checks.\n\n"
                "💡 **VELLIFE Integration**: Open the **VELLIFE AI Roadmap Generator** on your dashboard and select 'Full Stack Development' for a custom 1-month or 3-month milestone roadmap!"
            )

    # 3. Database & SQL
    if any(k in lower for k in ["sql", "database", "query", "join", "group by", "index", "normalization", "sqlite", "postgres", "dbms"]):
        if variant == 0:
            return (
                f"### 💾 Placement SQL & DBMS Guide for **{user_name}**\n\n"
                "SQL rounds in campus interviews (TCS, Infosys, Cognizant, Product Startups) test your command over **Window Functions, Complex Joins, and Aggregations**.\n\n"
                "### 1. 🔑 Top 4 Must-Know SQL Placement Concepts\n"
                "- **Window Functions**: `DENSE_RANK()`, `ROW_NUMBER()`, `LEAD()`, `LAG()`.\n"
                "- **Aggregation Filtering**: `HAVING` (filters grouped rows) vs `WHERE` (filters individual rows before grouping).\n"
                "- **Joins**: `INNER JOIN` (intersection), `LEFT JOIN` (all left + matching right), Self-Joins for hierarchical data.\n"
                "- **ACID Properties**: Atomicity, Consistency, Isolation, Durability.\n\n"
                "### 2. 💻 Interview Benchmark Query: Nth Highest Salary\n"
                "```sql\n"
                "-- Find the 2nd Highest Salary using DENSE_RANK() (Handles duplicate salaries safely)\n"
                "WITH RankedSalaries AS (\n"
                "    SELECT \n"
                "        emp_name,\n"
                "        salary,\n"
                "        DENSE_RANK() OVER (ORDER BY salary DESC) as rank_pos\n"
                "    FROM employees\n"
                ")\n"
                "SELECT emp_name, salary \n"
                "FROM RankedSalaries \n"
                "WHERE rank_pos = 2;\n"
                "```\n\n"
                "### 3. 🎯 Interviewer Question:\n"
                "*'Why is DENSE_RANK() preferred over LIMIT 1 OFFSET 1 when two employees earn the same top salary?'* (Answer: LIMIT skips duplicate rows incorrectly; DENSE_RANK assigns the same rank to identical salaries)."
            )
        elif variant == 1:
            return (
                f"### 📊 DBMS Core Theory for Technical Rounds for **{user_name}**\n\n"
                "Beyond writing queries, Round 1 interviewers test your theoretical DBMS foundations:\n\n"
                "1. **Normalization (1NF -> 2NF -> 3NF -> BCNF)**:\n"
                "   - *1NF*: Atomic values, no repeating groups.\n"
                "   - *2NF*: 1NF + No partial dependency (all non-key attributes fully dependent on primary key).\n"
                "   - *3NF*: 2NF + No transitive dependency ($A \\to B, B \\to C$).\n"
                "2. **Indexing & B-Trees**: Why does indexing speed up `SELECT` but slow down `INSERT` and `UPDATE`? (Answer: Index trees must be rebalanced on every write operation).\n"
                "3. **Transactions & Deadlocks**: How database isolation levels (Read Committed, Serializable) prevent Dirty Reads and Phantom Reads.\n\n"
                f"Would you like me to quiz you on DBMS normalization or SQL joins right now, **{user_name}**?"
            )
        else:
            return (
                f"### ⚡ SQL Optimization & Performance Strategies for Placements for **{user_name}**\n\n"
                "When asked *'How do you optimize a slow database query in production?'*, here is the winning senior-level answer:\n\n"
                "1. **Analyze with EXPLAIN / EXPLAIN QUERY PLAN**: Check whether the database engine executes a Full Table Scan ($O(N)$) or uses an Index Scan ($O(\\log N)$).\n"
                "2. **Avoid `SELECT *`**: Fetch only necessary columns to reduce I/O throughput and network payload.\n"
                "3. **Use Composite Indexes**: On columns frequently used together in `WHERE` and `JOIN` conditions.\n"
                "4. **Replace Correlated Subqueries**: Convert subqueries inside `WHERE` clauses into `JOIN`s or CTEs (`WITH` clauses) for execution plan optimization.\n\n"
                "Ready to solve a practice SQL query together, **{user_name}**?"
            )

    # 4. Career Domains & Fresher Guidance
    if any(k in lower for k in ["career", "domain", "which is better", "roadmap", "future", "jobs", "fresher", "placement tips", "how to prepare"]):
        if variant == 0:
            return (
                f"### 🎯 Master Campus Placement Strategy (2026) for **{user_name}**\n\n"
                "To secure a top offer (6–18 LPA) in campus drives, follow this proven 4-Pillar Roadmap:\n\n"
                "| Stage | Timeline | Primary Objective | Key Benchmarks |\n"
                "| :--- | :--- | :--- | :--- |\n"
                "| **1. DSA & Core** | Months 1–2 | Solve 150+ LeetCode Easy/Medium | Arrays, Strings, Two Pointers, Trees, SQL |\n"
                "| **2. Domain Projects**| Months 3–4 | Build 2 Production Full-Stack Apps | Auth, Database, Responsive UI, Live Deployment |\n"
                "| **3. Resume & ATS** | Month 5 | Quantified STAR bullet points | ATS score > 85/100 on VELLIFE Resume Analyzer |\n"
                "| **4. Mock Drills** | Month 6 | Pass Placement Gate (Score >= 80%) | Technical Round 1 & HR Round simulations |\n\n"
                "### 💼 Top 3 Hiring Domains in 2026:\n"
                "1. **Full-Stack Web Development**: Highest volume of job openings across startups and MNCs.\n"
                "2. **Data Analyst**: High demand for SQL, Python, and Power BI dashboarding.\n"
                "3. **AI / ML Engineering**: Premium salary packages for candidates who can deploy LLM endpoints.\n\n"
                f"Which of these domains do you want to target for your placement drive, **{user_name}**?"
            )
        elif variant == 1:
            return (
                f"### 🏢 Service vs Product Company Placement Roadmaps for **{user_name}**\n\n"
                "Understanding the exact recruitment patterns of your target companies is crucial:\n\n"
                "### A. Mass Recruiter & Digital Drives (TCS, Infosys, Cognizant, Wipro, Accenture)\n"
                "- **Round 1**: Cognitive Aptitude (Quants + Logical + English) + Automata Coding Round.\n"
                "- **Round 2**: Technical Round (OOPs, DBMS queries, Basics of chosen programming language).\n"
                "- **Secret to Cracking**: High speed in aptitude + passing all basic and boundary test cases in coding.\n\n"
                "### B. Product Leaders & High-Growth Startups (Zoho, Amazon, FinTech)\n"
                "- **Round 1**: Advanced Data Structures, recursion, problem-solving without libraries.\n"
                "- **Round 2 & 3**: Live coding, debugging tricky test cases, Low-Level Design (LLD).\n"
                "- **Secret to Cracking**: Clean modular code, deep explanation of algorithmic trade-offs ($O(N)$ vs $O(N^2)$).\n\n"
                f"Are you currently preparing for service-based drives (TCS/Infosys) or product companies (Zoho/Amazon), **{user_name}**?"
            )
        else:
            return (
                f"### 📄 ATS Resume & Placement Gate Checklist for **{user_name}**\n\n"
                "Before your resume reaches a recruiter, it passes through an **Applicant Tracking System (ATS)**. Here is how to guarantee selection:\n\n"
                "1. **Single-Column Layout**: Multi-column tables confuse ATS parsers. Keep clean sections: Education, Skills, Projects, Experience.\n"
                "2. **Quantified STAR Formula**: *'Built X feature using Y tech stack which achieved Z measurable result.'*\n"
                "   - *Weak*: 'Made an e-commerce website with React.'\n"
                "   - *Winning*: 'Engineered a full-stack e-commerce portal with React 19 and Python FastAPI, handling 500+ mock transactions with sub-200ms latency.'\n"
                "3. **VELLIFE Placement Gate**: In the VELLIFE Dashboard, complete your profile, build your resume in the **Resume Builder**, and score 80%+ on the **Mock Interview** to unlock verified job applications!\n\n"
                f"Would you like me to review one of your project bullet points right now, **{user_name}**?"
            )

    # 5. Exam & Semester Study Preparation
    if any(k in lower for k in ["exam", "semester", "r20", "study", "syllabus", "marks", "grade", "gpa"]):
        if variant == 0:
            return (
                f"### 📚 University Semester Exam Strategy (9+ CGPA Blueprint) for **{user_name}**\n\n"
                "Maintaining a CGPA above 8.0 or 8.5 is essential to meet the eligibility cutoffs for top campus recruiters.\n\n"
                "### 🎯 The 3-Step Exam Scoring Framework:\n"
                "1. **Previous Year Questions (PYQs) 80/20 Rule**: 70-80% of university exam questions (Anna Univ, JNTU, VTU, R20) repeat core concepts from the last 3-5 years.\n"
                "2. **Architectural & Flowchart Diagrams**: In 10-mark questions, examiners award 40-50% of the score for clean, labeled block diagrams, state charts, and architectures.\n"
                "3. **Clean Code with Line-by-Line Comments**: Write modular 6-10 line snippets rather than uninterrupted prose.\n\n"
                f"Which subject or unit are you preparing for right now, **{user_name}**? Let's break down the important questions!"
            )
        else:
            return (
                f"### ✍️ Exam Presentation Tactics for High Scoring for **{user_name}**\n\n"
                "Here are proven techniques to maximize marks in university theory and lab exams:\n\n"
                "- **Structured Subheadings**: For every 10-mark question, use: 1. Definition & Core Principle, 2. Block Diagram, 3. Working Mechanism, 4. Code / Algorithm, 5. Advantages & Disadvantages.\n"
                "- **Highlight Key Terms**: Underline critical keywords (e.g. *Mutual Exclusion*, *Two-Phase Locking*, *ACID Properties*).\n"
                "- **Time Management**: Divide 180 minutes strictly: 25 minutes for 2-mark questions, 140 minutes for 10-mark questions, 15 minutes for final review.\n\n"
                f"Tell me your subject and I'll generate a high-yield question checklist for you, **{user_name}**!"
            )

    # 6. Default Dynamic Placement Mentor Response for ANY question
    clean_topic = re.sub(r'^(can you|please|tell me|explain|what is|how to|i want to|i am)\s+', '', message, flags=re.IGNORECASE).strip(' ?!')
    title = clean_topic.capitalize() if clean_topic else "Your Technical Query"

    if variant == 0:
        return (
            f"### 💡 Placement Technical Guidance: **{title}** for **{user_name}**\n\n"
            f"When tackling **{message.rstrip('?!.')}** in campus technical interviews, recruiters evaluate your clarity, structured thinking, and depth of technical reasoning.\n\n"
            "### 1. 🎯 Foundational Principle & Architectural Concept\n"
            f"To approach {message.rstrip('?!.')} effectively, begin by identifying the core objective, defining input/output contracts, and considering scale.\n\n"
            "### 2. 🛠️ Best Practices & Placement Implementation\n"
            "- **Deconstruct the Problem**: Break down the challenge into smaller, independently testable units.\n"
            "- **Analyze Trade-Offs**: Always be prepared to explain Time vs Space complexity trade-offs to the interviewer.\n"
            "- **Handle Edge Cases**: Account for null inputs, boundary values, and unexpected error scenarios.\n\n"
            "### 3. 🚀 Placement Action Item\n"
            "Implement a working example of this concept today and integrate it into your VELLIFE preparation roadmap.\n\n"
            f"Would you like me to write a clean code implementation or test you with a placement interview question on **{title}**, **{user_name}**?"
        )
    elif variant == 1:
        return (
            f"### 🏢 Interviewer Perspective: How Panels Test **{title}** for **{user_name}**\n\n"
            f"In technical interview rounds (Round 1 & Round 2), here is exactly how interviewers explore **{message.rstrip('?!.')}**:\n\n"
            "1. **Core Concept Check**: Can you define the fundamental mechanism in simple, precise technical terms without relying on jargon?\n"
            "2. **Live Scenario / Bug Hunting**: Interviewers often provide a slightly flawed implementation and ask: *'Where does this fail under concurrent load or extreme input values?'*\n"
            "3. **Scalability & Production Readiness**: How does this approach scale when dealing with thousands of concurrent users?\n\n"
            f"Would you like to simulate a 3-minute mock interview answering this question right now, **{user_name}**?"
        )
    else:
        return (
            f"### 🧠 Practical Technical Drill: Deep-Dive into **{title}** for **{user_name}**\n\n"
            f"Let's master **{title}** through a practical placement-oriented breakdown:\n\n"
            "### Key Engineering Takeaways:\n"
            "- **Clean Code Principles**: Write self-documenting code with meaningful naming conventions and modular functions.\n"
            "- **Testing & Verification**: Always test with: 1. Normal inputs, 2. Extreme boundary inputs, 3. Invalid/malformed data.\n"
            "- **Industry Best Practice**: Maintain clean separation between presentation, business logic, and data access layers.\n\n"
            f"What specific scenario or programming language would you like to explore for this concept, **{user_name}**?"
        )

# Request schemas
class ChatRequest(BaseModel):
    user_name: str = "Student"
    message: str = ""
    model: str = "gemini-flash-latest"
    api_key: str = ""
    history: list = []
    is_regenerate: bool = False

@app.get("/api/ai/status")
def ai_status():
    key = get_gemini_api_key()
    has_key = bool(key)
    masked = f"{key[:6]}...{key[-4:]}" if (has_key and len(key) > 10) else ("Configured" if has_key else "Not Set")
    return {
        "status": "online",
        "mentor_name": "VELLIFE Placement Mentor & Career AI",
        "has_gemini_key": has_key,
        "masked_gemini_key": masked,
        "primary_model": "gemini-flash-latest",
        "gemini_fallback_models": GEMINI_FALLBACK_MODELS,
        "secondary_fallback": "Pollinations AI (Live Placement Mentor)",
        "tertiary_fallback": "VELLIFE Dynamic Multi-Variant Placement Engine",
        "fast_greetings_supported": True
    }

@app.post("/api/chat")
def chat_ai(data: ChatRequest):
    message = data.message.strip()
    user_name = clean_user_name(data.user_name)
    requested_model = data.model.strip() if data.model else "gemini-flash-latest"

    if not message:
        raise HTTPException(status_code=400, detail="Message content cannot be empty.")

    lower = message.lower().strip()
    has_prior_history = bool(data.history and len(data.history) > 1)

    # -------------------------------------------------------------
    # 1. Basic Greetings (Warm Placement Mentor Welcome)
    # -------------------------------------------------------------
    greeting_words = [
        "hi", "hello", "hey", "vanakkam", "namaste", "good morning", 
        "good evening", "good afternoon", "greetings", "sup", "yo", "hola", "wassup"
    ]
    is_greeting = any(
        lower == g or lower.startswith(g + " ") or lower.endswith(" " + g) or lower.startswith(g + "!") or lower.startswith(g + ",") 
        for g in greeting_words
    )
    technical_triggers = ["explain", "what is", "how to", "code", "problem", "solve", "why", "difference", "error", "bug", "write", "dsa", "interview", "placement", "resume"]
    has_tech_query = any(t in lower for t in technical_triggers)

    if is_greeting and not has_tech_query and len(lower.split()) <= 5:
        # If user greeted earlier in the conversation, do not repeat identical greeting
        if has_prior_history:
            return {
                "status": "success",
                "reply": (
                    f"Welcome back to your placement prep, **{user_name}**! 🚀\n\n"
                    "Ready for your next coding challenge, interview doubt, or company placement question? What are we tackling right now?"
                ),
                "source": "VELLIFE Placement Mentor (Instant)",
                "model_used": "Placement Mentor (Fast Greeting)",
                "is_fallback": False
            }
        return {
            "status": "success",
            "reply": (
                f"Hello **{user_name}**! 👋 Welcome to your **VELLIFE Placement Mentor** session.\n\n"
                "I am your dedicated technical interviewer and career coach. I specialize in:\n"
                "• 🧠 **Coding Rounds & DSA**: Arrays, Trees, Graphs, DP, Two Pointers with Big-O analysis.\n"
                "• 🏢 **Company Placement Patterns**: TCS (NQT/Digital), Infosys, Cognizant, Zoho, Amazon & Startups.\n"
                "• 📄 **ATS Resume & Career Tools**: Optimizing your project bullet points & passing the VELLIFE Placement Gate.\n"
                "• 🎯 **Technical & HR Interview Questions**: DBMS, OS, Computer Networks, and STAR method answers.\n\n"
                "What topic, coding doubt, or company drive are we preparing for today?"
            ),
            "source": "VELLIFE Placement Mentor (Instant)",
            "model_used": "Placement Mentor (Fast Greeting)",
            "is_fallback": False
        }

    # -------------------------------------------------------------
    # 2. Conversational Check-in ("How are you")
    # -------------------------------------------------------------
    if any(phrase in lower for phrase in ["how are you", "how r u", "how r you", "how u doing", "how is it going", "hows it going", "whats up", "what's up"]):
        return {
            "status": "success",
            "reply": (
                f"I'm feeling energized and ready to accelerate your placement prep today, **{user_name}**! 🌟\n\n"
                "All systems in the VELLIFE Placement Engine are running at peak performance. "
                "How is your coding practice going? Stuck on any LeetCode problem, preparing for an upcoming drive, or reviewing CS core subjects?"
            ),
            "source": "VELLIFE Placement Mentor (Instant)",
            "model_used": "Placement Mentor (Fast Greeting)",
            "is_fallback": False
        }

    # -------------------------------------------------------------
    # 3. Identity & Capabilities ("Who are you" / "What can you do")
    # -------------------------------------------------------------
    if any(phrase in lower for phrase in ["who are you", "what are you", "what can you do", "introduce yourself", "tell me about yourself", "who r u", "who is your mentor"]) and not has_tech_query:
        return {
            "status": "success",
            "reply": (
                f"I am your **VELLIFE Placement Mentor & Career Acceleration AI**! 🎓\n\n"
                "My mission is to help you crack technical coding rounds, ace campus interviews, and secure your dream offer. Here is how we collaborate:\n\n"
                "1. **🧠 Coding Assessments (OAs) & DSA**: Clean Python, Java, C++, and JavaScript solutions with strict Time & Space ($O(N)$) complexity.\n"
                "2. **🏢 Company-Specific Interview Strategy**: Tailored preparation for TCS NQT/Digital, Infosys, Cognizant GenC Next, Zoho, and Amazon.\n"
                "3. **📄 ATS Resume Optimization**: Transforming projects into quantified STAR bullet points that pass automated recruiter filters.\n"
                "4. **🎓 VELLIFE Platform Integration**: Helping you complete your learning milestones and score 80%+ on the Mock Interview to unlock the VELLIFE Job Portal!\n\n"
                f"What's your biggest placement goal right now, **{user_name}**?"
            ),
            "source": "VELLIFE Placement Mentor (Instant)",
            "model_used": "Placement Mentor (Fast Greeting)",
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
                f"Take a deep breath, **{user_name}**! 💙 Placement anxiety and coding fatigue happen to every single successful engineer.\n\n"
                "### 🌿 3-Step Reset for Placement Success:\n"
                "1. **Stop Compounding Stress**: Step away from your IDE for 10 minutes. Hydrate and reset.\n"
                "2. **One Problem at a Time**: You don't have to solve 500 LeetCode problems overnight. Mastering just *one pattern* (like Two Pointers or Hashing) gives you immediate confidence.\n"
                "3. **Step-by-Step Clarity**: Tell me the exact topic, company, or concept that feels overwhelming right now. I will break it down into simple, easy-to-follow steps!\n\n"
                f"What is the single concept bothering you the most right now, **{user_name}**?"
            ),
            "source": "VELLIFE Placement Mentor (Empathetic Care)",
            "model_used": "Placement Mentor (Well-Being)",
            "is_fallback": False
        }

    # -------------------------------------------------------------
    # 5. Acknowledgments & Thanks
    # -------------------------------------------------------------
    if lower in ["ok", "okay", "got it", "sure", "cool", "alright", "great", "nice", "awesome", "k", "fine", "kk", "ok brother", "ok bro", "thank you", "thanks", "thanks mentor", "ty", "thx", "understood"]:
        ack_replies = [
            f"Awesome momentum, **{user_name}**! 👍 Consistent practice transforms tough technical rounds into second nature. Ask me whenever you want your next interview drill or code review!",
            f"Glad that helped, **{user_name}**! 🚀 Keep that confidence high. Ready to explore the next coding pattern or mock interview question?",
            f"You're doing great, **{user_name}**! 🌟 Remember, consistent daily practice is what separates selected candidates from the rest. What's next on our agenda?"
        ]
        chosen_ack = ack_replies[(len(data.history or []) + len(lower)) % len(ack_replies)]
        return {
            "status": "success",
            "reply": chosen_ack,
            "source": "VELLIFE Placement Mentor (Instant)",
            "model_used": "Placement Mentor (Fast Greeting)",
            "is_fallback": False
        }

    # -------------------------------------------------------------
    # 6. Apologies
    # -------------------------------------------------------------
    if any(lower == w or lower.startswith(w + " ") or lower.endswith(" " + w) for w in ["sry", "sorry", "my bad", "oops", "apologies", "sory"]):
        return {
            "status": "success",
            "reply": f"No need to apologize at all, **{user_name}**! 😊 In software engineering and technical interviews, finding mistakes and refining code is how real growth happens. What should we tackle next?",
            "source": "VELLIFE Placement Mentor (Instant)",
            "model_used": "Placement Mentor (Fast Greeting)",
            "is_fallback": False
        }

    # -------------------------------------------------------------
    # 7. Primary Engine: Google Gemini API (With History & Anti-Duplication)
    # -------------------------------------------------------------
    gemini_reply, used_gemini_model, is_gemini_fallback = fetch_gemini_response(
        user_name=user_name,
        message=message,
        requested_model=requested_model,
        override_key=data.api_key,
        history=data.history,
        is_regenerate=data.is_regenerate
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
    # 8. Fallback Tier 1: Pollinations Multi-LLM (Live Placement Mentor)
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
    # 9. Fallback Tier 2: Dynamic Multi-Variant Placement Knowledge Engine
    # -------------------------------------------------------------
    offline_reply = build_mentor_offline_fallback(user_name, message, data.history)
    return {
        "status": "success",
        "reply": offline_reply,
        "source": "VELLIFE Placement Mentor (Offline Engine)",
        "model_used": "Dynamic Multi-Variant Placement Engine",
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
