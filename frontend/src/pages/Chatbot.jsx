import { useState, useEffect, useRef } from "react";
import "./Chatbot.css";

function Chatbot({ user, onBackToDashboard, onLogout }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("vellife_theme") === "dark";
  });

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    localStorage.setItem("vellife_theme", nextMode ? "dark" : "light");
  };

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState("Google Gemini 2.0 Flash");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/ai/status")
      .then((res) => res.json())
      .then((data) => setAiStatus(data))
      .catch(() => {});
  }, []);
  
  // Chat History Threads
  const [chatHistory, setChatHistory] = useState([
    { id: "chat-1", title: "React 19 & State Architecture", time: "Today", date: "Just now" },
    { id: "chat-2", title: "FastAPI & SQLite Integration", time: "Today", date: "2 hrs ago" },
    { id: "chat-3", title: "ATS Resume Optimization", time: "Yesterday", date: "Yesterday" },
    { id: "chat-4", title: "Full Stack 6-Month Roadmap", time: "Previous 7 Days", date: "3 days ago" },
    { id: "chat-5", title: "Docker & Cloud Deployment", time: "Previous 7 Days", date: "5 days ago" },
  ]);

  const [activeChatId, setActiveChatId] = useState(null); // null means fresh chat
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Feature toggles in bottom bar
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [deepThinkEnabled, setDeepThinkEnabled] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);

  // Copied state indicator
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [copiedMsgId, setCopiedMsgId] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle starting a new chat
  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setInputQuery("");
    setAttachedFiles([]);
  };

  // Switch chat thread
  const handleSelectHistory = (id) => {
    setActiveChatId(id);
    const item = chatHistory.find((c) => c.id === id);
    setMessages([
      {
        id: "msg-1",
        sender: "user",
        text: `Tell me more about ${item?.title || "this topic"}.`,
        time: "10:30 AM",
      },
      {
        id: "msg-2",
        sender: "bot",
        text: `Here is the complete analysis for **${item?.title}**:\n\n1. **Core Concept**: Efficient architecture tailored for high-scale applications.\n2. **Best Practices**: Use modular component breakdown, typed schemas, and structured state persistence.\n\n\`\`\`javascript\n// Example implementation snippet\nimport { useState, useEffect } from 'react';\n\nexport function ${item?.title.replace(/[^a-zA-Z]/g, "") || "Module"}() {\n  const [data, setData] = useState(null);\n  useEffect(() => {\n    console.log("VELLIFE AI Engine Active");\n  }, []);\n  return <div>{data || "Ready"}</div>;\n}\n\`\`\`\n\nIs there a specific detail you would like to explore further?`,
        time: "10:31 AM",
      },
    ]);
  };

  const getCleanName = (userObj) => {
    if (userObj?.name) {
      const cleaned = userObj.name.replace(/[0-9]+$/g, "").replace(/poo$/i, "").trim();
      return cleaned.length > 2 ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : userObj.name;
    }
    if (userObj?.email) {
      const handle = userObj.email.split("@")[0].replace(/[0-9]+$/g, "").replace(/poo$/i, "").trim();
      return handle.charAt(0).toUpperCase() + handle.slice(1);
    }
    return "Poovarasan";
  };

  const generateCleverResponse = (query) => {
    const userName = getCleanName(user);
    const lower = query.toLowerCase().trim();

    // A. Casual "How are you" / "How r u" / "How's it going" / "Sup"
    if (["how are you", "how r u", "how r you", "how u doing", "how is it going", "hows it going", "whats up", "what's up"].some((phrase) => lower.includes(phrase))) {
      return `I'm doing fantastic, **${userName}**! Thank you for asking. 😊\n\nAll AI systems are running smoothly and ready. How can I assist your coding, full-stack learning, or career path today?`;
    }

    // B. Apologies / Casual Fillers ("sry", "sorry", "my bad", "oops")
    if (["sry", "sorry", "my bad", "oops", "apologies", "sory"].some((w) => lower === w || lower.startsWith(w + " ") || lower.endsWith(" " + w))) {
      return `No need to apologize at all, **${userName}**! 😊 I am right here to help you.\n\nWhat would you like to explore next? We can talk more about **Full-Stack Web Development**, look at code examples, prepare for interviews, or discuss project ideas!`;
    }

    // C. Acknowledgments ("ok", "okay", "got it", "sure", "cool", "alright")
    if (["ok", "okay", "got it", "sure", "cool", "alright", "great", "nice", "awesome", "k", "fine", "kk", "ok brother", "ok bro"].includes(lower)) {
      return `Awesome, **${userName}**! 👍 Let me know whenever you're ready to ask your next question, explore Full-Stack development, or get code snippets!`;
    }

    // D. Greetings ("hi", "hello", "hey")
    if (/^(hi|hello|hey|good morning|good evening|good afternoon|greetings|hola|sup|yo)(\s+vellife|\s+bot|\s+ai|\s+there|\s+gpt|!)?$/i.test(lower) || lower === "hi" || lower === "hello" || lower === "hey") {
      const greetings = [
        `Hi **${userName}**! 👋 How can I help you today? Whether you have coding questions, need resume feedback, system design advice, or anything else, feel free to ask!`,
        `Hello **${userName}**! 🚀 Great to see you. What project, code snippet, or question are we tackling today?`,
        `Hey **${userName}**! 👋 I'm ready. What would you like to build, solve, or learn today?`
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // E1. Python + SQL Domain Guidance ("know python and sql", "python next sql", "ennaku python teriyum")
    if (lower.includes("python") && lower.includes("sql")) {
      return `Awesome, **${userName}**! 👍 If you already know **Python + SQL**, you actually have a strong base. The next step should be choosing a domain where those two skills are used heavily and where you can build toward better career opportunities.\n\nSince you're asking what is better in this generation, here is how the main paths compare based on skills, learning curve, job types, and how well Python + SQL fit:\n\n### 📊 Main Domain Comparison (2026)\n| Domain | Python Fit | SQL Fit | Additional Skills Needed | Typical Work |\n|---|---|---|---|---|\n| **Data Analyst** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Excel, Power BI/Tableau, statistics | Dashboards, business analysis |\n| **Data Engineering** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ETL, Spark, cloud, data warehouses | Build data pipelines |\n| **Data Science** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Statistics, ML, pandas, scikit-learn | Predictive models & stats |\n| **AI / ML Engineering** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ML, deep learning, LLMs, APIs | Build/deploy AI systems |\n| **Backend Development** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | FastAPI/Django, REST APIs, Git | Build web apps & APIs |\n\n---\n\n### 🎯 How to Choose Based on Your Interests:\nA. **If you enjoy coding & building systems** → **Data Engineering** or **Backend Development**\nB. **If you love AI & ChatGPT applications** → **AI/ML Engineering**\nC. **If you enjoy mathematics & statistical patterns** → **Data Science**\nD. **If you like dashboards & answering business questions** → **Data Analyst**\n\nWhich of these sound most exciting to you, **${userName}**?`;
    }

    // E2. Data Analyst Deep Dive ("explain about data analyst", "data analyst", "what is data analyst")
    if ((lower.includes("data analyst") || lower.includes("data analytics")) && ["explain", "about", "what", "roadmap", "detail", "tell", "choice", "learn"].some((w) => lower.includes(w))) {
      if (!["job", "role", "position", "career", "type"].some((j) => lower.includes(j))) {
        return `Absolutely, **${userName}**! Since you already know Python + SQL, **Data Analyst** is a very natural path to explore.\n\n### 📊 What does a Data Analyst actually do?\nA Data Analyst takes raw data → finds useful information → explains what is happening → helps a company make decisions.\n\nFor example, if an e-commerce company asks: *'Why did sales decrease this month?'*, a Data Analyst will:\n1. Fetch raw data using **SQL**.\n2. Clean and process data using **Python / Pandas**.\n3. Visualize patterns using **Power BI** dashboards.\n4. Present business findings to management.\n\n---\n\n### 🧠 What skills does a Data Analyst need?\n\n1. **SQL ⭐⭐⭐⭐⭐** (Window Functions: \`INNER JOIN\`, \`LEFT JOIN\`, \`ROW_NUMBER()\`, \`LAG()\`, \`LEAD()\`, \`GROUP BY\`)\n2. **Excel ⭐⭐⭐⭐** (\`VLOOKUP\`, \`XLOOKUP\`, \`Pivot Tables\`, \`SUMIFS\`)\n3. **Python & Pandas ⭐⭐⭐⭐** (Data cleaning & aggregation):\n\`\`\`python\nimport pandas as pd\ndf = pd.read_csv('sales.csv')\nsales_by_city = df.groupby('city')['sales'].sum().sort_values(ascending=False)\nprint(sales_by_city)\n\`\`\`\n4. **Power BI / Tableau ⭐⭐⭐⭐** (Interactive Business Dashboards)\n5. **Statistics ⭐⭐⭐** (Mean, Median, Standard Deviation, A/B Testing)\n\n---\n\n### 🗓️ Realistic 4–6 Month Roadmap:\n- **Month 1 (Advanced SQL)**: Complex Joins, Subqueries, CTEs, Window functions.\n- **Month 2 (Excel + Statistics)**: Data manipulation, Pivots, Statistical hypothesis testing.\n- **Month 3 (Pandas & Data Cleaning)**: Missing values, Outliers, Grouping, Merging.\n- **Month 4 (Power BI)**: DAX calculations, Interactive dashboards.\n- **Months 5–6 (Projects & Resume)**: E-Commerce Sales Analytics, Customer Churn Analysis.\n\nWould you like me to explain the exact job roles and career titles available for a Data Analyst?`;
      }
    }

    // E3. Data Analyst Job Roles ("jobs are there for data analyst", "data analyst jobs", "career roles in data analytics")
    if ((lower.includes("data analyst") || lower.includes("data analytics")) && ["job", "role", "position", "career", "type", "market"].some((w) => lower.includes(w))) {
      return `Great choice, **${userName}**! 🚀 'Data Analyst' is not just one fixed job title—there are several specialized job roles you can target with these skills:\n\n### 👨‍💻 Top Job Roles in Data Analytics:\n\n1. **Data Analyst (Core)**\n- **Focus**: Write SQL queries, clean data with Python, build dashboards, and answer core business questions.\n- **Primary Tools**: SQL + Python (Pandas) + Power BI / Tableau + Excel.\n\n2. **Business Analyst (BA)**\n- **Focus**: Focuses heavily on business problems, workflow requirements, and strategy rather than deep coding.\n- **Primary Tools**: Excel + SQL + Power BI + Business Communication.\n\n3. **Business Intelligence (BI) Analyst**\n- **Focus**: Specialized in creating executive dashboards, enterprise reporting, and data modeling.\n- **Primary Tools**: Power BI / Tableau + DAX + SQL + Data Warehouses.\n\n4. **Product Analyst**\n- **Focus**: Analyzes user behavior inside apps/websites (Funnels, User Retention, A/B Testing, Feature Usage).\n- **Primary Tools**: SQL + Statistics + Python + Amplitude/Mixpanel.\n\n5. **Marketing Analyst**\n- **Focus**: Evaluates ad campaign performance, Customer Acquisition Cost (CAC), Return on Ad Spend (ROAS), and conversions.\n- **Primary Tools**: SQL + Google Analytics + Power BI + Excel.\n\n6. **Financial Data Analyst**\n- **Focus**: Analyzes revenue trends, budget variance, financial forecasting, and transaction anomalies.\n- **Primary Tools**: Excel + SQL + Power BI + Financial Modeling.\n\n7. **Operations Analyst**\n- **Focus**: Optimizes supply chain, delivery timelines, inventory management, and operational efficiency.\n- **Primary Tools**: SQL + Python + Excel + Logistics Metrics.\n\n---\n\n### 📈 Career Progression Pathway:\n\`\`\`\nData Analyst (Entry Level)\n       ↓\nSenior Data Analyst / BI Specialist\n       ↓\nAnalytics Engineer / Product Analyst / Data Scientist\n       ↓\nLead Data Analyst / Head of Analytics\n\`\`\`\n\nWould you like me to help you design your **portfolio project plan** or **ATS-optimized resume structure** for these roles?`;
    }

    // E4. Full-Stack Deep Dive / Explanation ("expalin more about full stack", "tell me about full stack", "what is full stack")
    if (["full stack", "fullstack"].some((kw) => lower.includes(kw)) && ["explain", "expalin", "more", "tell", "what is", "details", "about"].some((action) => lower.includes(action))) {
      return `Here is a comprehensive breakdown of **Full-Stack Web Development** for you, **${userName}**! 🌐\n\n### 💡 What is Full-Stack Web Development?\nFull-Stack Development means building **both sides** of a web application:\n1. **Frontend**: Everything the user sees and clicks on in their browser.\n2. **Backend**: The server logic, API endpoints, authentication, and database connections running behind the scenes.\n\n---\n\n### 🎨 Layer 1: Frontend (Client-Side)\n- **HTML5 & CSS3**: Defines page structure, modern grid/flex layouts, colors, and responsive designs.\n- **JavaScript (ES6+)**: Handles interactivity, user events, dynamic updates, and fetching data from backend servers.\n- **React.js (React 19)**: The world's most popular UI library for building fast, single-page applications (like this VELLIFE AI OS app!).\n\n### ⚙️ Layer 2: Backend (Server-Side)\n- **Python (FastAPI / Django REST Framework)** or **Node.js (Express)**: Processes incoming HTTP requests, enforces security/passwords, and executes business logic.\n- **REST APIs**: The URL data endpoints (e.g., \`/api/login\`, \`/api/chat\`) that bridge Frontend and Backend.\n\n### 💾 Layer 3: Database (Data Persistence)\n- **Relational DBs (SQLite, PostgreSQL, MySQL)**: Store user records, messages, and project data safely in tables.\n- **ORMs (SQLAlchemy / Prisma)**: Allow backend developers to query databases using clean Python/JavaScript objects.\n\n---\n\n### 🚀 Why Full-Stack is ideal for Final-Year Students:\n1. **Maximum Job Volume**: Startups and tech companies love hiring freshers who understand how full end-to-end apps work.\n2. **Live Portfolio Projects**: You can build working web apps and showcase them live on GitHub and Vercel/Render for recruiters.\n3. **Multiple Job Roles**: You can apply for Frontend Developer, Backend Developer, or Full-Stack Engineer positions!\n\nWould you like me to create a **custom step-by-step 30-day learning roadmap** to master Full-Stack development from scratch?`;
    }

    // F. Transition / Learning Full Stack from Python ("i know python so want learn full stack", etc.)
    if (lower.includes("python") && ["fullstack", "full stack", "learn", "roadmap", "want", "become"].some((t) => lower.includes(t))) {
      return `That's an awesome starting point, **${userName}**! 🚀 Since you already know **Python**, you have a massive advantage for becoming a **Full-Stack Developer**!\n\nHere is your step-by-step Full-Stack learning roadmap leveraging Python:\n\n---\n\n### 1. 🐍 Backend API Development (Python)\n- Since you know Python, learn **FastAPI** or **Django REST Framework**.\n- FastAPI is ultra-fast, modern, and widely used for building APIs with automatic Swagger documentation.\n\n### 2. 📊 Database & SQL Data Persistence\n- Learn **SQLite** or **PostgreSQL** to create tables, handle CRUD operations, and write SQL queries.\n- Use **SQLAlchemy** or **SQLModel** as your Python ORM.\n\n### 3. 🎨 Frontend Web Development\n- Master **HTML5 & CSS3** for page structure & sleek UI design.\n- Learn modern **JavaScript (ES6+)** (Async/Await, Fetch API, Arrow Functions).\n- Master **React.js (React 19)** for building interactive, component-based UIs.\n\n### 4. 🔗 Connecting Backend & Frontend\n- Use React's \`fetch()\` or \`axios\` to connect your React UI to your Python FastAPI endpoints at \`http://127.0.0.1:8000\`!\n\n---\n\n### 💡 Suggested First Project:\nBuild a **Full-Stack Task Manager** or **User Portal** using **React 19 Frontend + Python FastAPI Backend + SQLite DB**!\n\nWould you like me to write a sample full-stack template showing how React connects to Python FastAPI?`;
    }

    // G. Doubts & Help Requests ("i have a doubt", "can i ask", "help me")
    if (lower.includes("doubt") || lower.includes("can i ask") || lower.includes("need help") || lower === "help" || lower === "question") {
      return `Of course, **${userName}**! Please feel free to ask your doubt or question.\n\nWhether it's about programming, choosing the best career domain for freshers, resume building, or tech concepts, ask away and I will explain it clearly for you step-by-step!`;
    }

    // H. Fresher Career Domain Guidance ("fresher", "which domain is best", "career path", "final year")
    if (["fresher", "domain", "best field", "career", "where to start", "which path", "which role", "final year", "suitable"].some((t) => lower.includes(t))) {
      return `Welcome, **${userName}**! Choosing the right tech domain as a final-year student & fresher is one of the most important decisions for your career. Here is a breakdown of the **Top Tech Domains in 2026** to help you choose the best fit for your goals:\n\n---\n\n### 1. 🌐 Full-Stack Web Development (React + Python/FastAPI/Node)\n- **Why it's great for freshers**: Highest number of hiring openings across startups and enterprise companies. You get to build real-world web apps.\n- **Core Stack**: HTML, CSS, JavaScript, React.js, Python (FastAPI/Django) or Node.js, SQL (SQLite/PostgreSQL).\n- **Job Roles**: Frontend Developer, Backend Developer, Full Stack Engineer.\n- **Entry Barrier**: ⭐⭐ (Moderate - Highly achievable with 3-6 months of consistent practice).\n\n### 2. 🤖 Artificial Intelligence & Data Science\n- **Why it's great for freshers**: Rapid industry growth and high salary potential.\n- **Core Stack**: Python, NumPy, Pandas, Scikit-Learn, PyTorch, SQL, Prompt Engineering & LLM APIs.\n- **Job Roles**: AI Developer, Data Analyst, Machine Learning Engineer.\n- **Entry Barrier**: ⭐⭐⭐ (Requires strong math, statistics, and python coding skills).\n\n### 3. ☁️ Cloud Computing & DevOps\n- **Why it's great for freshers**: Every software company needs cloud infrastructure to host apps online.\n- **Core Stack**: Linux, Docker, AWS / Azure, CI/CD pipelines, Shell Scripting.\n- **Job Roles**: DevOps Engineer, Cloud Practitioner, System Administrator.\n- **Entry Barrier**: ⭐⭐⭐ (Requires good knowledge of networks, Linux, and servers).\n\n### 4. 📱 Mobile App Development (Flutter / React Native)\n- **Why it's great for freshers**: Excellent demand for mobile-first tech companies.\n- **Core Stack**: React Native or Flutter (Dart), Firebase, REST APIs.\n- **Job Roles**: iOS/Android App Developer.\n\n---\n\n### 💡 Final Recommendation for You:\nIf you want the **fastest job entry with maximum interview opportunities**, **Full-Stack Web Development** is the absolute best domain to start with. It allows you to build visible portfolio projects that recruiters can test live!\n\nWould you like me to create a **custom 90-day learning roadmap** for any of these domains?`;
    }

    // I. Pure Code Requests for React / Frontend
    if ((lower.includes("code") || lower.includes("write") || lower.includes("example") || lower.includes("build") || lower.includes("create")) && ["react", "component", "jsx", "frontend", "usestate", "useeffect"].some((k) => lower.includes(k))) {
      return `### Modern React 19 Solution for **${userName}** 💻\n\nHere is a clean, modern React component tailored for your requirement:\n\n\`\`\`jsx\nimport React, { useState, useEffect } from 'react';\n\nexport default function VellifeComponent() {\n  const [data, setData] = useState([]);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    const loadData = async () => {\n      try {\n        setLoading(true);\n        const res = await fetch('/api/data');\n        const json = await res.json();\n        setData(json);\n      } catch (err) {\n        console.error("Fetch error:", err);\n      } finally {\n        setLoading(false);\n      }\n    };\n    loadData();\n  }, []);\n\n  return (\n    <div className="vellife-container">\n      <h3>VELLIFE Interactive Component</h3>\n      {loading ? (\n        <p>Loading data...</p>\n      ) : (\n        <ul>\n          {data.map((item, index) => (\n            <li key={index}>{item.name || item}</li>\n          ))}\n        </ul>\n      )}\n    </div>\n  );\n}\n\`\`\`\n\n### Key Highlights:\n- Modern React 19 Functional Hooks pattern.\n- Full async try/catch handling with loading indicators.\n- Zero external dependencies required.`;
    }

    // J. Pure Code Requests for Python
    if ((lower.includes("code") || lower.includes("write") || lower.includes("example") || lower.includes("build") || lower.includes("create")) && ["fastapi", "backend", "api", "django", "flask"].some((k) => lower.includes(k))) {
      return `### Asynchronous FastAPI Backend for **${userName}** 🐍\n\nHere is a clean, scalable FastAPI service architecture:\n\n\`\`\`python\nfrom fastapi import FastAPI, HTTPException, status\nfrom pydantic import BaseModel, EmailStr\nfrom typing import Optional\nimport uvicorn\n\napp = FastAPI(title="VELLIFE High-Performance Core", version="2.0.0")\n\nclass UserPayload(BaseModel):\n    name: str\n    email: str\n    role: Optional[str] = "Student"\n\n@app.get("/api/v1/health")\ndef health_check():\n    return {"status": "ok", "system": "VELLIFE Core API"}\n\n@app.post("/api/v1/user/process")\ndef process_user(data: UserPayload):\n    if not data.email:\n        raise HTTPException(status_code=400, detail="Email is required")\n    return {\n        "status": "success",\n        "message": f"Processed payload for {data.name}",\n        "data": data.dict()\n    }\n\nif __name__ == "__main__":\n    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)\n\`\`\`\n\n### Included Advantages:\n- Automatic Pydantic Schema Validation.\n- Interactive OpenAPI Swagger documentation served automatically at \`/docs\`.`;
    }

    // K. Identity / Who are you
    if (lower.includes("who are you") || lower.includes("what is your name") || lower.includes("tell me about yourself") || lower.includes("who created you")) {
      return `Hello **${userName}**! I am **VELLIFE AI**, an intelligent conversational assistant modeled after ChatGPT.\n\n### What I can help you with:\n- 💻 **Software Engineering & Coding**: Writing, debugging, and refactoring React 19, Python, C++, Java, JavaScript, FastAPI, and SQL.\n- 📄 **ATS Resume & Career Guidance**: Tailoring resumes, writing cover letters, and technical interview preparation.\n- 🚀 **System Architecture & Cloud**: Microservices, REST APIs, Docker, and database schemas.\n- 🧮 **Math & Science Solutions**: Solving math equations, physics problems, and logic puzzles.\n- 📝 **Writing & Summaries**: Drafting emails, essays, articles, and code documentation.\n\nFeel free to ask me any question!`;
    }

    // L. Thank you
    if (lower.includes("thank you") || lower.includes("thanks") || lower === "thx" || lower === "ty") {
      return `You're very welcome, **${userName}**! 😊 If you need anything else or have more questions, feel free to ask anytime!`;
    }

    // M. Dynamic Natural Conversational Response for ANY other question
    const cleanPrompt = query.replace(/^(can you|please|tell me|explain|what is|how to|i want to|i am)\s+/i, "").replace(/[?!.]+$/g, "").trim();
    const promptTitle = cleanPrompt ? cleanPrompt.charAt(0).toUpperCase() + cleanPrompt.slice(1) : query;

    return `Sure thing, **${userName}**! Here is clear guidance on **${promptTitle}**:\n\n1. **Core Concept & Approach**:\n   To work with ${query.replace(/[?!.]+$/g, "")}, the most effective method is to break down your objective into actionable steps.\n\n2. **Best Practices & Next Steps**:\n   - **Master Core Principles**: Understand the foundation before diving into advanced implementation.\n   - **Build & Test Hands-On**: Practice with realistic projects or test cases to solidify your learning.\n   - **Iterate Continuously**: Refine edge cases, optimize performance, and keep your code organized.\n\nWould you like me to write code examples or step-by-step guidance specifically for this, **${userName}**?`;
  };

  // Send message handler
  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim() && attachedFiles.length === 0) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: query,
      attachments: [...attachedFiles],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery("");
    setAttachedFiles([]);
    setIsTyping(true);

    // If starting fresh chat, add title to history
    if (!activeChatId && messages.length === 0) {
      const newTitle = query.slice(0, 30) + (query.length > 30 ? "..." : "");
      const newChatObj = {
        id: `chat-${Date.now()}`,
        title: newTitle || "New Conversation",
        time: "Today",
        date: "Just now",
      };
      setChatHistory((prev) => [newChatObj, ...prev]);
      setActiveChatId(newChatObj.id);
    }

    // Try fetching response from backend /api/chat or fallback to clever generator
    let botText = "";
    let usedModel = selectedModel;
    let isFallback = false;
    try {
      const displayName = user?.name || (user?.email ? user.email.split("@")[0] : "Student");
      const res = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: displayName,
          message: query,
          model: selectedModel,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.reply) {
          botText = data.reply;
          usedModel = data.model_used || data.source || selectedModel;
          isFallback = !!data.is_fallback;
        }
      }
    } catch (e) {
      // Offline / Network Fallback
    }

    if (!botText) {
      botText = generateCleverResponse(query);
      usedModel = "VELLIFE Student Mentor (Offline)";
      isFallback = true;
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-bot-${Date.now()}`,
          sender: "bot",
          text: botText,
          model: usedModel,
          isFallback: isFallback,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, 450);
  };

  // Copy helper
  const handleCopy = (text, id, isCode = false) => {
    navigator.clipboard.writeText(text);
    if (isCode) {
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 2000);
    } else {
      setCopiedMsgId(id);
      setTimeout(() => setCopiedMsgId(null), 2000);
    }
  };

  // Handle File Upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFiles = files.map((f) => ({
        name: f.name,
        size: (f.size / 1024).toFixed(1) + " KB",
      }));
      setAttachedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Render text with Markdown formatting support (Code blocks, bold, lists)
  const renderMessageContent = (text, msgId) => {
    // Check if message contains code block
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: "text", content: text.substring(lastIndex, match.index) });
      }
      parts.push({
        type: "code",
        language: match[1] || "code",
        code: match[2].trim(),
        codeId: `${msgId}-code-${match.index}`,
      });
      lastIndex = codeBlockRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push({ type: "text", content: text.substring(lastIndex) });
    }

    return (
      <div className="markdown-body">
        {parts.map((part, idx) => {
          if (part.type === "code") {
            const isCopied = copiedCodeId === part.codeId;
            return (
              <div key={idx} className="gpt-code-block">
                <div className="code-header">
                  <span className="code-lang">{part.language}</span>
                  <button
                    className="btn-copy-code"
                    onClick={() => handleCopy(part.code, part.codeId, true)}
                  >
                    {isCopied ? "✓ Copied!" : "📋 Copy code"}
                  </button>
                </div>
                <pre className="code-content">
                  <code>{part.code}</code>
                </pre>
              </div>
            );
          }

          // Simple formatting for prose (bold, bullet points, headers)
          const lines = part.content.split("\n");
          return (
            <div key={idx} className="text-paragraph-wrapper">
              {lines.map((line, lIdx) => {
                if (!line.trim()) return <br key={lIdx} />;
                if (line.startsWith("### ")) {
                  return <h4 key={lIdx} className="gpt-h3">{line.replace("### ", "")}</h4>;
                }
                if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ")) {
                  return <div key={lIdx} className="gpt-list-item-num">{line}</div>;
                }
                if (line.startsWith("- ")) {
                  return <div key={lIdx} className="gpt-list-item-bullet">• {line.replace("- ", "")}</div>;
                }
                return (
                  <p key={lIdx} className="gpt-p">
                    {line}
                  </p>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`gpt-layout ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      
      {/* LEFT SIDEBAR (ChatGPT Style) */}
      <aside className={`gpt-sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        
        {/* Top Header of Sidebar */}
        <div className="sidebar-top">
          <button className="btn-new-chat" onClick={handleNewChat}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>New chat</span>
            <span className="kbd-shortcut">Ctrl+K</span>
          </button>

          <button
            className="btn-toggle-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle Sidebar"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
              <path d="M9 3v18"></path>
            </svg>
          </button>
        </div>

        {/* History List */}
        <div className="sidebar-history-container">
          {["Today", "Yesterday", "Previous 7 Days"].map((group) => {
            const items = chatHistory.filter((c) => c.time === group);
            if (items.length === 0) return null;

            return (
              <div key={group} className="history-group">
                <div className="history-group-title">{group}</div>
                {items.map((chat) => (
                  <button
                    key={chat.id}
                    className={`history-item ${activeChatId === chat.id ? "active" : ""}`}
                    onClick={() => handleSelectHistory(chat.id)}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span className="history-title">{chat.title}</span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>

        {/* User Footer Profile in Sidebar */}
        <div className="sidebar-user-footer">
          <div className="user-profile-box">
            {user?.profile_image ? (
              <img src={user.profile_image} alt={user.name} className="user-sidebar-photo" />
            ) : (
              <div className="user-sidebar-avatar">
                {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="user-sidebar-meta">
              <span className="user-name">{user?.name || "User Account"}</span>
              <span className="user-plan">VELLIFE GPT-4o Pro</span>
            </div>
          </div>
        </div>

      </aside>

      {/* MAIN CHAT AREA */}
      <main className="gpt-main-canvas">
        
        {/* Top Navbar */}
        <header className="gpt-top-navbar">
          <div className="nav-left">
            {!sidebarOpen && (
              <button
                className="btn-toggle-sidebar-nav"
                onClick={() => setSidebarOpen(true)}
                title="Open Sidebar"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                  <path d="M9 3v18"></path>
                </svg>
              </button>
            )}

            {/* Model Selector Dropdown */}
            <div className="model-selector-wrapper">
              <button
                className="model-selector-btn"
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              >
                <span className="model-sparkle">✦</span>
                <span className="model-name">{selectedModel}</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {isModelDropdownOpen && (
                <div className="model-dropdown-menu">
                  <div
                    className={`model-option ${selectedModel === "Google Gemini 2.0 Flash" ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedModel("Google Gemini 2.0 Flash");
                      setIsModelDropdownOpen(false);
                    }}
                  >
                    <div className="model-opt-header">
                      <span className="opt-title">Google Gemini 2.0 Flash</span>
                      <span className="opt-badge">Mentor Pro</span>
                    </div>
                    <span className="opt-desc">Primary Student Mentor with high-speed coding, academic doubt solving & placements.</span>
                  </div>

                  <div
                    className={`model-option ${selectedModel === "Google Gemini 2.5 Flash" ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedModel("Google Gemini 2.5 Flash");
                      setIsModelDropdownOpen(false);
                    }}
                  >
                    <div className="model-opt-header">
                      <span className="opt-title">Google Gemini 2.5 Flash</span>
                      <span className="opt-badge fast">Next-Gen</span>
                    </div>
                    <span className="opt-desc">Next-generation Gemini model with enhanced technical problem solving.</span>
                  </div>

                  <div
                    className={`model-option ${selectedModel === "Google Gemini 1.5 Flash" ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedModel("Google Gemini 1.5 Flash");
                      setIsModelDropdownOpen(false);
                    }}
                  >
                    <div className="model-opt-header">
                      <span className="opt-title">Google Gemini 1.5 Flash</span>
                      <span className="opt-badge fast">1M Context</span>
                    </div>
                    <span className="opt-desc">High-throughput fallback model for long textbook units, roadmaps & syllabi.</span>
                  </div>

                  <div
                    className={`model-option ${selectedModel === "Google Gemini 1.5 Pro" ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedModel("Google Gemini 1.5 Pro");
                      setIsModelDropdownOpen(false);
                    }}
                  >
                    <div className="model-opt-header">
                      <span className="opt-title">Google Gemini 1.5 Pro</span>
                      <span className="opt-badge pro">Deep Think</span>
                    </div>
                    <span className="opt-desc">Deep algorithmic analysis, complex architectural design & mathematics.</span>
                  </div>

                  <div
                    className={`model-option ${selectedModel === "VELLIFE Mentor Core" ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedModel("VELLIFE Mentor Core");
                      setIsModelDropdownOpen(false);
                    }}
                  >
                    <div className="model-opt-header">
                      <span className="opt-title">VELLIFE Mentor Core</span>
                      <span className="opt-badge">Auto-Cascade</span>
                    </div>
                    <span className="opt-desc">Automatic multi-tier fallbacks across Gemini, Live LLM, and Offline Mentor Engine.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Gemini Key Status Pill */}
            <div 
              className={`gemini-status-pill ${aiStatus?.has_gemini_key ? "connected" : "fallback"}`}
              onClick={() => setShowStatusModal(true)}
              title="Click to view AI Mentor & Fallback Models Architecture"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                background: aiStatus?.has_gemini_key ? "rgba(16, 185, 129, 0.12)" : "rgba(234, 179, 8, 0.15)",
                color: aiStatus?.has_gemini_key ? "#059669" : "#b45309",
                border: aiStatus?.has_gemini_key ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(234, 179, 8, 0.35)",
                marginLeft: "8px"
              }}
            >
              <span style={{ fontSize: "8px" }}>●</span>
              <span>{aiStatus?.has_gemini_key ? "Gemini Key: Active" : "Mentor Fallbacks Active"}</span>
            </div>
          </div>

          <div className="nav-right" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              className="btn-theme-toggle-chat"
              onClick={toggleTheme}
              title={`Switch to ${isDarkMode ? "Butter Cream (Light)" : "Dark Emerald"} Theme`}
            >
              {isDarkMode ? "🧈 Butter Mode" : "🌙 Dark Mode"}
            </button>
            <button className="btn-back-os" onClick={onBackToDashboard}>
              ← OS Dashboard
            </button>
          </div>
        </header>

        {/* CHAT MESSAGES OR LANDING STATE */}
        <div className="gpt-messages-scroll-area">
          {messages.length === 0 ? (
            /* ChatGPT Landing Welcome Experience */
            <div className="gpt-landing-container">
              <div className="gpt-landing-logo-ring">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path>
                  <rect x="4" y="8" width="16" height="12" rx="4"></rect>
                  <circle cx="9" cy="13" r="1.5" fill="currentColor"></circle>
                  <circle cx="15" cy="13" r="1.5" fill="currentColor"></circle>
                  <path d="M10 17h4"></path>
                </svg>
              </div>

              <h1 className="gpt-landing-heading">What can your Student Mentor help you achieve today?</h1>

              {/* 4 Interactive Student Mentor Prompt Cards */}
              <div className="gpt-prompt-cards-grid">
                <div
                  className="prompt-card"
                  onClick={() =>
                    handleSendMessage("Hi mentor, how should I start preparing for campus placement coding rounds?")
                  }
                >
                  <span className="card-icon">🎓</span>
                  <div className="card-text-group">
                    <h4>Campus Placement Prep</h4>
                    <p>Roadmap for coding tests, Aptitude, and technical rounds</p>
                  </div>
                </div>

                <div
                  className="prompt-card"
                  onClick={() =>
                    handleSendMessage("Explain Binary Search algorithm with intuitive real-world analogy, time complexity and clean Python code")
                  }
                >
                  <span className="card-icon">🧠</span>
                  <div className="card-text-group">
                    <h4>DSA & Problem Solving</h4>
                    <p>Intuitive concept breakdowns with clean runnable code</p>
                  </div>
                </div>

                <div
                  className="prompt-card"
                  onClick={() =>
                    handleSendMessage("Which domain is better for freshers in 2026: Full Stack Development vs Data Analytics vs AI/ML?")
                  }
                >
                  <span className="card-icon">🚀</span>
                  <div className="card-text-group">
                    <h4>Career & Domain Guidance</h4>
                    <p>Compare tech stacks, hiring volume, and salaries</p>
                  </div>
                </div>

                <div
                  className="prompt-card"
                  onClick={() =>
                    handleSendMessage("How to study university semester syllabus (like B.Tech R20) to score 9+ CGPA?")
                  }
                >
                  <span className="card-icon">📚</span>
                  <div className="card-text-group">
                    <h4>Semester Exam Strategy</h4>
                    <p>PYQs, architectural diagrams, and scoring techniques</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Active Message History Thread */
            <div className="gpt-messages-list">
              {messages.map((msg) => (
                <div key={msg.id} className={`gpt-msg-row ${msg.sender}`}>
                  <div className="gpt-msg-content-wrapper">
                    
                    {/* Avatar */}
                    <div className={`msg-avatar ${msg.sender}`}>
                      {msg.sender === "user" ? (
                        user?.profile_image ? (
                          <img src={user.profile_image} alt="User" className="msg-avatar-img" />
                        ) : (
                          (user?.name || "U").charAt(0).toUpperCase()
                        )
                      ) : (
                        "✨"
                      )}
                    </div>

                    {/* Body */}
                    <div className="msg-body">
                      <div className="msg-author-row">
                        <span className="author-name">
                          {msg.sender === "user" ? user?.name || "You" : "VELLIFE Student Mentor"}
                        </span>
                        {msg.model && (
                          <span 
                            className={`msg-model-tag ${msg.isFallback ? "is-fallback" : ""}`}
                            style={{
                              fontSize: "11px",
                              padding: "2px 8px",
                              borderRadius: "10px",
                              background: msg.isFallback ? "rgba(234, 179, 8, 0.15)" : "rgba(16, 185, 129, 0.12)",
                              color: msg.isFallback ? "#b45309" : "#047857",
                              border: msg.isFallback ? "1px solid rgba(234, 179, 8, 0.3)" : "1px solid rgba(16, 185, 129, 0.25)",
                              fontWeight: "600",
                              marginLeft: "8px"
                            }}
                          >
                            {msg.model}
                          </span>
                        )}
                        <span className="msg-time">{msg.time}</span>
                      </div>

                      {/* Attachments preview if user sent files */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="msg-attachments-list">
                          {msg.attachments.map((file, fIdx) => (
                            <div key={fIdx} className="attachment-chip">
                              📄 {file.name} ({file.size})
                            </div>
                          ))}
                        </div>
                      )}

                      {renderMessageContent(msg.text, msg.id)}

                      {/* Action Toolbar for Bot Messages */}
                      {msg.sender === "bot" && (
                        <div className="bot-msg-actions">
                          <button
                            className="action-icon-btn"
                            onClick={() => handleCopy(msg.text, msg.id)}
                            title="Copy Response"
                          >
                            {copiedMsgId === msg.id ? "✓ Copied" : "📋 Copy"}
                          </button>
                          <button
                            className="action-icon-btn"
                            onClick={() => handleSendMessage("Can you elaborate further?")}
                            title="Regenerate / Elaborate"
                          >
                            🔄 Regenerate
                          </button>
                          <button className="action-icon-btn" title="Good Response">
                            👍
                          </button>
                          <button className="action-icon-btn" title="Bad Response">
                            👎
                          </button>
                        </div>
                      )}

                    </div>

                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="gpt-msg-row bot">
                  <div className="gpt-msg-content-wrapper">
                    <div className="msg-avatar bot">✨</div>
                    <div className="msg-body">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* CHATGPT FLOATING INPUT CONTAINER */}
        <div className="gpt-input-footer-area">
          <div className="gpt-input-container">
            
            {/* Attached file previews */}
            {attachedFiles.length > 0 && (
              <div className="attached-files-row">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="attached-file-pill">
                    <span>📄 {file.name}</span>
                    <button
                      onClick={() =>
                        setAttachedFiles(attachedFiles.filter((_, i) => i !== index))
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="gpt-input-field-row">
              {/* Attach File Button */}
              <button
                className="input-tool-btn"
                onClick={() => fileInputRef.current.click()}
                title="Attach Files / Code"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                style={{ display: "none" }}
              />

              {/* Web Search Toggle */}
              <button
                className={`input-tool-btn ${webSearchEnabled ? "active" : ""}`}
                onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                title="Search Web Mode"
              >
                🌐
              </button>

              {/* Deep Think Toggle */}
              <button
                className={`input-tool-btn ${deepThinkEnabled ? "active" : ""}`}
                onClick={() => setDeepThinkEnabled(!deepThinkEnabled)}
                title="Reasoning / Deep Thinking"
              >
                🧠
              </button>

              {/* Text Input */}
              <textarea
                className="gpt-textarea"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Message VELLIFE AI..."
                rows={1}
              />

              {/* Send Arrow Button */}
              <button
                className={`btn-send-gpt ${inputQuery.trim() || attachedFiles.length > 0 ? "active" : ""}`}
                onClick={() => handleSendMessage()}
                disabled={!inputQuery.trim() && attachedFiles.length === 0}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
              </button>
            </div>

          </div>

          <div className="gpt-footer-disclaimer">
            VELLIFE AI can make mistakes. Verify important code & career information.
          </div>
        </div>

      </main>

      {/* AI Mentor & Fallbacks Architecture Modal */}
      {showStatusModal && (
        <div 
          className="mentor-modal-overlay"
          onClick={() => setShowStatusModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px"
          }}
        >
          <div 
            className="mentor-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: isDarkMode ? "#064e3b" : "#fffdf5",
              color: isDarkMode ? "#e2e8f0" : "#043325",
              border: isDarkMode ? "1.5px solid #10b981" : "1.5px solid #fde047",
              borderRadius: "16px",
              padding: "24px 28px",
              maxWidth: "520px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "24px" }}>🎓</span>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>VELLIFE Student Mentor Engine</h3>
              </div>
              <button 
                onClick={() => setShowStatusModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "inherit"
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: "18px", padding: "12px 14px", borderRadius: "10px", background: aiStatus?.has_gemini_key ? "rgba(16,185,129,0.15)" : "rgba(234,179,8,0.15)", border: aiStatus?.has_gemini_key ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(234,179,8,0.3)" }}>
              <div style={{ fontWeight: "600", fontSize: "13px", marginBottom: "4px" }}>
                {aiStatus?.has_gemini_key ? "✓ Google Gemini API Active" : "⚡ Multi-Tier Fallback Active"}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.9 }}>
                {aiStatus?.has_gemini_key 
                  ? `Key: ${aiStatus.masked_gemini_key} (Ready to mentor with high-speed 2.0 Flash)` 
                  : "To connect your free Gemini API key, add `GEMINI_API_KEY=AIzaSy...` in `backend/.env`!"}
              </div>
            </div>

            <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.8 }}>
              Multi-Tier Fallback Hierarchy
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px", marginBottom: "20px" }}>
              <div style={{ padding: "8px 12px", borderRadius: "8px", background: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
                <strong>Tier 1 (Google Gemini Cascade):</strong> gemini-2.0-flash → gemini-2.5-flash → gemini-1.5-flash → gemini-2.0-flash-lite → gemini-1.5-pro
              </div>
              <div style={{ padding: "8px 12px", borderRadius: "8px", background: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
                <strong>Tier 2 (Secondary Live LLM):</strong> Pollinations Multi-LLM with Student Mentor persona
              </div>
              <div style={{ padding: "8px 12px", borderRadius: "8px", background: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
                <strong>Tier 3 (Offline Engine):</strong> Built-in DSA, Web Dev, SQL, and University Exam Knowledge Core
              </div>
            </div>

            <button
              onClick={() => setShowStatusModal(false)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                background: "#047857",
                color: "#ffffff",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "13px"
              }}
            >
              Close & Start Mentoring
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Chatbot;
