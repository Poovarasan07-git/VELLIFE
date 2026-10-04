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
  const [selectedModel, setSelectedModel] = useState("Google Gemini Flash (Placement Mentor)");
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

  // Placement Mentor Dynamic Knowledge Generator (Guarantees zero duplicate answers)
  const generateCleverResponse = (query, existingMessages = [], isRegenerate = false) => {
    const userName = getCleanName(user);
    const lower = query.toLowerCase().trim();

    // Compute dynamic rotation variant to prevent duplicate answers
    const historyCount = existingMessages.length;
    const variant = (historyCount + (isRegenerate ? 1 : 0)) % 3;

    // A. Casual Greetings
    if (/^(hi|hello|hey|good morning|good evening|good afternoon|greetings|hola|sup|yo)(\s+vellife|\s+bot|\s+ai|\s+there|\s+mentor|!)?$/i.test(lower) || lower === "hi" || lower === "hello" || lower === "hey") {
      if (historyCount > 1) {
        return `Welcome back to your placement practice, **${userName}**! 🚀 Ready for your next mock interview drill, DSA challenge, or company round breakdown? What topic are we tackling?`;
      }
      return `Hello **${userName}**! 👋 Welcome to your **VELLIFE Placement Mentor** session.\n\nI am your dedicated technical interviewer and career coach. I specialize in:\n• 🧠 **Coding Rounds & DSA**: Arrays, Trees, Graphs, DP, Two Pointers with strict Big-O analysis.\n• 🏢 **Company Placement Patterns**: TCS (NQT/Digital), Infosys, Cognizant, Zoho, Amazon & Startups.\n• 📄 **ATS Resume & Career Tools**: Optimizing project bullet points & passing the VELLIFE Placement Gate.\n• 🎯 **Technical & HR Interview Questions**: DBMS, OS, Computer Networks, and STAR framework answers.\n\nWhat topic, coding doubt, or target company are we preparing for today?`;
    }

    // B. Casual Check-in
    if (["how are you", "how r u", "how r you", "how u doing", "how is it going", "hows it going", "whats up", "what's up"].some((phrase) => lower.includes(phrase))) {
      return `I'm fully energized and ready to guide your placement journey today, **${userName}**! 🌟\n\nAll systems in the VELLIFE Placement Engine are running at peak performance. How is your coding practice going? Stuck on any LeetCode problem, preparing for an upcoming drive, or reviewing CS core subjects?`;
    }

    // C. Acknowledgments
    if (["ok", "okay", "got it", "sure", "cool", "alright", "great", "nice", "awesome", "k", "fine", "kk", "ok brother", "ok bro", "thank you", "thanks"].includes(lower)) {
      const acks = [
        `Awesome momentum, **${userName}**! 👍 Consistent practice transforms tough technical rounds into second nature. Ask me whenever you want your next interview drill or code review!`,
        `Glad that helped, **${userName}**! 🚀 Keep that confidence high. Ready to explore the next coding pattern or mock interview question?`,
        `You're doing great, **${userName}**! 🌟 Remember, consistent daily practice is what separates selected candidates from the rest. What's next on our agenda?`
      ];
      return acks[variant];
    }

    // D. DSA & Problem Solving
    if (["dsa", "algorithm", "binary search", "array", "tree", "graph", "dynamic programming", "two pointer", "sliding window", "time complexity"].some(k => lower.includes(k))) {
      if (variant === 0) {
        return `### 💡 Placement Technical Breakdown: DSA for **${userName}**\n\nIn campus placement coding rounds (TCS Digital, Cognizant GenC Next, Amazon OA), interviewers evaluate your code on **optimal time complexity and zero TLE (Time Limit Exceeded)**.\n\n### 1. 🧠 Core Placement Patterns & Big-O Hierarchy\n- **O(1) & O(log N)**: Hash Map Lookups, Binary Search on Answer space. (Always expected if input array is sorted or \`N <= 10^9\`).\n- **O(N)**: Two Pointers, Sliding Window, Single-pass frequency array.\n- **O(N log N)**: Divide & Conquer (Merge Sort, Heap operations).\n- **O(N^2) Warning**: Brute-force nested loops will fail hidden test cases when \`N >= 10^4\`!\n\n### 2. 💻 Clean Implementation (Two-Pointer Technique)\n\`\`\`python\n# Classic O(N) Two-Pointer approach to find target pair in sorted array\ndef find_target_pair(arr: list[int], target: int) -> tuple[int, int] | None:\n    left, right = 0, len(arr) - 1\n    while left < right:\n        current = arr[left] + arr[right]\n        if current == target:\n            return (arr[left], arr[right])  # O(N) time, O(1) auxiliary space\n        elif current < target:\n            left += 1\n        else:\n            right -= 1\n    return None\n\`\`\`\n\n### 3. 🎯 Interviewer Follow-Up Drill:\n*'What if the array contains duplicate elements or is not sorted?'* How would you adapt this using a Hash Set in O(N) time and O(N) space, **${userName}**?`;
      } else if (variant === 1) {
        return `### 🚀 Alternative Placement Angle: Company-Specific DSA Patterns for **${userName}**\n\nLet's look at how top recruiters test this exact concept differently:\n\n1. **TCS (NQT / Digital / Prime)**: Focuses heavily on edge cases (e.g. empty arrays, single elements, negative numbers, and integer overflow with \`10^9\`).\n2. **Zoho (Round 2 & 3)**: Tests problem-solving **without built-in library functions** (e.g. sorting without \`.sort()\`, string parsing without \`split()\`).\n3. **Amazon & Product Startups**: Expects you to explain the **Brute Force (O(N^2))** solution first, state its bottleneck, and cleanly transition to the **Optimal (O(N))** solution.\n\n### 💡 Live Interviewer Tip:\nNever write code immediately! Spend the first 2 minutes dry-running with a small example on paper or whiteboard. State: *'The brute force takes O(N^2). We can optimize this to O(N) using a two-pointer approach because the input is sorted.'*\n\nWould you like to practice a live coding problem on this pattern right now, **${userName}**?`;
      } else {
        return `### 🔍 Deep-Dive: Interview Edge-Case Traps & Complexity Optimization for **${userName}**\n\nHere are the subtle traps that cause 60% of students to fail the technical round even when their logic is generally correct:\n\n1. **Off-by-One Index Errors**: Loop bounds like \`while left <= right\` vs \`while left < right\` in Binary Search.\n2. **Integer Overflow in Mid Calculation**: Using \`(left + right) // 2\` instead of \`left + (right - left) // 2\` in C++/Java when values exceed 2^31 - 1.\n3. **Auxiliary Space Hidden Cost**: Creating sub-arrays or slices \`arr[mid:]\` in Python creates O(N) copies, turning an O(log N) space algorithm into O(N)!\n\n### 🎯 Actionable VELLIFE Drill:\nSolve 3 medium LeetCode/GeeksforGeeks problems on this topic today, and log your progress in the VELLIFE Learning Portal to boost your Placement Preparation Score!`;
      }
    }

    // E. Python + SQL Domain Guidance
    if (lower.includes("python") && lower.includes("sql")) {
      if (variant === 0) {
        return `Awesome foundation, **${userName}**! 👍 Knowing **Python + SQL** gives you direct eligibility for 4 of the highest-paying tech domains in campus drives:\n\n### 📊 Main Domain Comparison (2026 Placements)\n| Domain | Python Fit | SQL Fit | Additional Skills Needed | Placement CTC Range |\n|---|---|---|---|---|\n| **Data Analyst** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Excel, Power BI/Tableau, statistics | ₹5.5 - 9.5 LPA |\n| **Data Engineering** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ETL, Spark, cloud, data warehouses | ₹7.0 - 14 LPA |\n| **Backend Development** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | FastAPI/Django, PostgreSQL, REST APIs | ₹6.5 - 13 LPA |\n| **AI / ML Engineering** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | PyTorch, Deep Learning, LLM APIs | ₹8.0 - 18 LPA |\n\n---\n\n### 🎯 VELLIFE Placement Recommendation:\n- If you love building web platforms → **Backend / Full Stack Development**\n- If you enjoy business dashboards & querying → **Data Analyst**\n\nWhich of these would you like to build your 3-month roadmap for on VELLIFE?`;
      } else {
        return `### 💡 Placement Interview Questions on Python + SQL for **${userName}**\n\nSince you know Python and SQL, here are 3 questions technical panels ask in Round 1:\n\n1. **SQL Window Functions**: *'How do you fetch the top 2 highest-paid employees in each department using DENSE_RANK()?'*\n2. **Python Memory & Generators**: *'What is the difference between a list comprehension and a generator expression when streaming large database query results?'*\n3. **Database Transactions**: *'How do you implement atomic transactions with rollback support in Python using SQLAlchemy or SQLite?'*\n\nWould you like me to show you the optimal solution for any of these?`;
      }
    }

    // F. Full Stack Web Development
    if (["full stack", "fullstack", "react", "fastapi"].some(kw => lower.includes(kw))) {
      if (variant === 0) {
        return `### 🌐 Full-Stack Placement Architecture Guide for **${userName}**\n\nIn tech interviews for Full-Stack Developer roles (e.g. React 19 + Python FastAPI), tech panels test your ability to bridge client and server seamlessly.\n\n### 1. 🏗️ High-Scale Placement Stack\n- **Client (Frontend)**: React 19 Single Page App (Component state, \`useEffect\` cleanups, responsive design).\n- **Server (Backend)**: Python FastAPI with asynchronous endpoints (\`async def\`) and Pydantic validation schemas.\n- **Database & Persistence**: SQLite for local testing, PostgreSQL with SQLAlchemy ORM for production.\n\n### 2. 💻 Production-Grade Endpoint Example\n\`\`\`python\nfrom fastapi import FastAPI, HTTPException, status\nfrom pydantic import BaseModel\n\napp = FastAPI(title='VELLIFE Campus Placement API')\n\nclass CandidateSchema(BaseModel):\n    name: str\n    domain: str = 'Full Stack Development'\n    mock_score: int\n\n@app.post('/api/placement/verify', status_code=status.HTTP_200_OK)\nasync def verify_candidate(data: CandidateSchema):\n    if data.mock_score < 80:\n        return {'status': 'Gate Locked', 'message': 'Requires 80%+ mock score to unlock Job Portal'}\n    return {'status': 'Gate Passed', 'eligible_jobs': 24}\n\`\`\`\n\n### 3. 🎯 ATS Resume Tip for Freshers:\nDo not write *'Created a website'*. Write: *'Architected a full-stack platform using React 19 and FastAPI, reducing API latency by 35% with asynchronous SQLite caching.'*`;
      } else {
        return `### ⚙️ Full-Stack Interview Deep-Dive: Common Tech Round Questions for **${userName}**\n\nHere are the top 5 questions interviewers consistently ask for entry-level Full-Stack roles:\n\n1. **State Management & Re-renders**: *'How does React 19 manage Virtual DOM diffing, and how do you prevent unnecessary re-renders in heavy components?'*\n2. **CORS**: *'Why does CORS error happen when React (port 5173) calls FastAPI (port 8000), and how do you resolve it properly?'*\n3. **Authentication**: *'Explain how JWT tokens and bcrypt password hashing secure user sessions compared to plain session cookies.'*\n4. **Database Indexing**: *'How does a B-Tree index speed up SELECT queries on foreign keys?'*\n\nWhich of these would you like to master first, **${userName}**?`;
      }
    }

    // G. Career, Freshers & Placement Strategy
    if (["fresher", "domain", "best field", "career", "placement", "interview", "resume", "roadmap"].some(t => lower.includes(t))) {
      if (variant === 0) {
        return `### 🎯 Master Campus Placement Strategy (2026) for **${userName}**\n\nTo secure a top offer (6–18 LPA) in campus drives, follow this proven 4-Pillar Roadmap:\n\n| Stage | Timeline | Primary Objective | Key Benchmarks |\n| :--- | :--- | :--- | :--- |\n| **1. DSA & Core** | Months 1–2 | Solve 150+ LeetCode Easy/Medium | Arrays, Strings, Two Pointers, Trees, SQL |\n| **2. Domain Projects**| Months 3–4 | Build 2 Production Full-Stack Apps | Auth, Database, Responsive UI, Live Deployment |\n| **3. Resume & ATS** | Month 5 | Quantified STAR bullet points | ATS score > 85/100 on VELLIFE Resume Analyzer |\n| **4. Mock Drills** | Month 6 | Pass Placement Gate (Score >= 80%) | Technical Round 1 & HR Round simulations |\n\n### 💼 Top 3 Hiring Domains in 2026:\n1. **Full-Stack Web Development**: Highest volume of job openings across startups and MNCs.\n2. **Data Analyst**: High demand for SQL, Python, and Power BI dashboarding.\n3. **AI / ML Engineering**: Premium salary packages for candidates who can deploy LLM endpoints.\n\nWhich of these domains do you want to target for your placement drive, **${userName}**?`;
      } else {
        return `### 📄 ATS Resume & Placement Gate Checklist for **${userName}**\n\nBefore your resume reaches a recruiter, it passes through an **Applicant Tracking System (ATS)**. Here is how to guarantee selection:\n\n1. **Single-Column Layout**: Multi-column tables confuse ATS parsers. Keep clean sections: Education, Skills, Projects, Experience.\n2. **Quantified STAR Formula**: *'Built X feature using Y tech stack which achieved Z measurable result.'*\n   - *Weak*: 'Made an e-commerce website with React.'\n   - *Winning*: 'Engineered a full-stack e-commerce portal with React 19 and Python FastAPI, handling 500+ mock transactions with sub-200ms latency.'\n3. **VELLIFE Placement Gate**: In the VELLIFE Dashboard, complete your profile, build your resume in the **Resume Builder**, and score 80%+ on the **Mock Interview** to unlock verified job applications!\n\nWould you like me to review one of your project bullet points right now, **${userName}**?`;
      }
    }

    // Default Dynamic Placement Guidance
    const cleanPrompt = query.replace(/^(can you|please|tell me|explain|what is|how to|i want to|i am)\s+/i, "").replace(/[?!.]+$/g, "").trim();
    const promptTitle = cleanPrompt ? cleanPrompt.charAt(0).toUpperCase() + cleanPrompt.slice(1) : query;

    if (variant === 0) {
      return `### 💡 Placement Technical Guidance: **${promptTitle}** for **${userName}**\n\nWhen tackling **${query.replace(/[?!.]+$/g, "")}** in campus technical interviews, recruiters evaluate your clarity, structured thinking, and depth of technical reasoning.\n\n### 1. 🎯 Foundational Principle & Architectural Concept\nTo approach this effectively, begin by identifying the core objective, defining input/output contracts, and considering scale.\n\n### 2. 🛠️ Best Practices & Placement Implementation\n- **Deconstruct the Problem**: Break down the challenge into smaller, independently testable units.\n- **Analyze Trade-Offs**: Always be prepared to explain Time vs Space complexity ($O(N)$) trade-offs to the interviewer.\n- **Handle Edge Cases**: Account for null inputs, boundary values, and unexpected error scenarios.\n\n### 3. 🚀 Placement Action Item\nImplement a working example of this concept today and integrate it into your VELLIFE preparation roadmap.\n\nWould you like me to write a clean code implementation or test you with a placement interview question on **${promptTitle}**, **${userName}**?`;
    } else {
      return `### 🏢 Interviewer Perspective: How Panels Test **${promptTitle}** for **${userName}**\n\nIn technical interview rounds (Round 1 & Round 2), here is exactly how interviewers explore **${query.replace(/[?!.]+$/g, "")}**:\n\n1. **Core Concept Check**: Can you define the fundamental mechanism in simple, precise technical terms without relying on jargon?\n2. **Live Scenario / Bug Hunting**: Interviewers often provide a slightly flawed implementation and ask: *'Where does this fail under concurrent load or extreme input values?'*\n3. **Scalability & Production Readiness**: How does this approach scale when dealing with thousands of concurrent users?\n\nWould you like to simulate a 3-minute mock interview answering this question right now, **${userName}**?`;
    }
  };

  // Send message handler with conversation history & anti-duplication
  const handleSendMessage = async (textToSend, options = {}) => {
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

    // Build history payload for multiturn context & anti-duplication
    const historyPayload = messages.slice(-10).map((m) => ({
      role: m.sender === "user" ? "user" : "model",
      text: m.text,
    }));

    // Try fetching response from backend /api/chat or fallback to placement clever generator
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
          history: historyPayload,
          is_regenerate: !!options?.isRegenerate,
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
      botText = generateCleverResponse(query, messages, !!options?.isRegenerate);
      usedModel = "VELLIFE Placement Mentor (Offline Engine)";
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

  // Regenerate handler: finds preceding user query and requests an alternative angle
  const handleRegenerate = (botMsgId) => {
    const botIdx = messages.findIndex((m) => m.id === botMsgId);
    let targetUserQuery = "";
    if (botIdx >= 0) {
      for (let i = botIdx - 1; i >= 0; i--) {
        if (messages[i].sender === "user") {
          targetUserQuery = messages[i].text;
          break;
        }
      }
    }
    if (!targetUserQuery) {
      targetUserQuery = "Can you provide an alternative placement explanation and interview follow-up?";
    }
    handleSendMessage(targetUserQuery, { isRegenerate: true });
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

        {/* Recent Chats List */}
        <div className="sidebar-history-container">
          <div className="history-group">
            <div className="history-group-title">Recent chats</div>
            {chatHistory.map((chat) => (
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
                    className={`model-option ${selectedModel === "Google Gemini Flash (Placement Mentor)" ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedModel("Google Gemini Flash (Placement Mentor)");
                      setIsModelDropdownOpen(false);
                    }}
                  >
                    <div className="model-opt-header">
                      <span className="opt-title">Google Gemini Flash</span>
                      <span className="opt-badge fast">Placement Speed</span>
                    </div>
                    <span className="opt-desc">Ultra-fast Placement Mentor for coding assessment problems, Big-O analysis, and company rounds.</span>
                  </div>

                  <div
                    className={`model-option ${selectedModel === "Google Gemini Pro (Deep Reasoning)" ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedModel("Google Gemini Pro (Deep Reasoning)");
                      setIsModelDropdownOpen(false);
                    }}
                  >
                    <div className="model-opt-header">
                      <span className="opt-title">Google Gemini Pro</span>
                      <span className="opt-badge pro">Deep Think</span>
                    </div>
                    <span className="opt-desc">Deep technical reasoning, Low-Level Design (LLD), system architecture & edge-case proofs.</span>
                  </div>

                  <div
                    className={`model-option ${selectedModel === "VELLIFE Placement Core (Auto-Cascade)" ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedModel("VELLIFE Placement Core (Auto-Cascade)");
                      setIsModelDropdownOpen(false);
                    }}
                  >
                    <div className="model-opt-header">
                      <span className="opt-title">VELLIFE Placement Core</span>
                      <span className="opt-badge">Auto-Cascade</span>
                    </div>
                    <span className="opt-desc">Automated multi-tier fallback across Gemini, live LLM, and Dynamic Offline Placement Engine.</span>
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

              <h1 className="gpt-landing-heading">What can your Placement Mentor help you achieve today?</h1>

              {/* 4 Interactive Placement Mentor Prompt Cards */}
              <div className="gpt-prompt-cards-grid">
                <div
                  className="prompt-card"
                  onClick={() =>
                    handleSendMessage("How should I prepare for campus placement coding tests (TCS NQT, Infosys, Zoho & Product Startups)?")
                  }
                >
                  <span className="card-icon">🎓</span>
                  <div className="card-text-group">
                    <h4>Campus Placement Strategy</h4>
                    <p>Roadmap for coding tests, Aptitude, and technical rounds</p>
                  </div>
                </div>

                <div
                  className="prompt-card"
                  onClick={() =>
                    handleSendMessage("Explain Two Pointers vs Sliding Window with interview problem patterns, time complexity and clean Python code")
                  }
                >
                  <span className="card-icon">🧠</span>
                  <div className="card-text-group">
                    <h4>DSA & Technical Rounds</h4>
                    <p>Intuitive pattern breakdowns with clean runnable code & Big-O</p>
                  </div>
                </div>

                <div
                  className="prompt-card"
                  onClick={() =>
                    handleSendMessage("Top DBMS, Operating Systems, and OOPs questions asked in Round 1 technical interviews")
                  }
                >
                  <span className="card-icon">💻</span>
                  <div className="card-text-group">
                    <h4>Core CS Interview Rounds</h4>
                    <p>DBMS Normalization, OS Deadlocks, TCP vs UDP & Polymorphism</p>
                  </div>
                </div>

                <div
                  className="prompt-card"
                  onClick={() =>
                    handleSendMessage("How do I optimize my resume for ATS and pass the VELLIFE Placement Gate (80%+ mock score)?")
                  }
                >
                  <span className="card-icon">📄</span>
                  <div className="card-text-group">
                    <h4>ATS Resume & Placement Gate</h4>
                    <p>STAR bullet points, ATS scoring, and unlocking verified jobs</p>
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
                          {msg.sender === "user" ? user?.name || "You" : "VELLIFE Placement Mentor"}
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
                            onClick={() => handleRegenerate(msg.id)}
                            title="Regenerate with Alternative Approach & Interview Follow-Up"
                          >
                            🔄 Alternative Approach
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
