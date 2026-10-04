import { useState, useEffect } from "react";
import "./Dashboard.css";
import VelfireRoadmapGenerator from "../components/roadmap/VelfireRoadmapGenerator";
import VelfireCoursePlatform from "../components/courses/VelfireCoursePlatform";

function Dashboard({ user, onLogout, onBackToHome, onOpenChatbot }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("velfire_theme") === "dark";
  });

  // Active portal modal: 'chatbot' | 'learning' | 'jobs' | null
  const [activeModal, setActiveModal] = useState(null);

  // Learning Portal Sub-Tabs:
  // 'roadmap' | 'full_curriculum' | 'recorded' | 'live' | 'assessment' | 'resume_builder' | 'resume_analyzer' | 'mock_test' | 'mock_interview'
  const [learningTab, setLearningTab] = useState("full_curriculum");

  // Selected Career Domain
  const [selectedDomain, setSelectedDomain] = useState("Data Analyst");

  // Learning Portal Mode: 'choice' (2 buttons choice) | 'roadmap' (VELFIRE Roadmap Generator) | 'course' (VELFIRE Course Hub)
  const [learningMode, setLearningMode] = useState("choice");

  // Roadmap Generator State
  const [roadmapTargetLevel, setRoadmapTargetLevel] = useState("Intermediate");
  const [roadmapDuration, setRoadmapDuration] = useState("3 Months Mastery");
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

  const handleGenerateRoadmapAction = () => {
    setIsGeneratingRoadmap(true);
    setTimeout(() => {
      setIsGeneratingRoadmap(false);
    }, 600);
  };

  // 10 Career Domains Data
  const domainsList = [
    { id: "fullstack", name: "Full Stack Development", icon: "🌐", requiredSkills: ["HTML/CSS", "JavaScript", "React", "Python/FastAPI", "SQL", "Git"] },
    { id: "data_analyst", name: "Data Analyst", icon: "📊", requiredSkills: ["Python", "SQL", "Excel", "Power BI", "Statistics"] },
    { id: "data_science", name: "Data Science", icon: "🧪", requiredSkills: ["Python", "Pandas", "Scikit-Learn", "SQL", "Statistics", "Machine Learning"] },
    { id: "aiml", name: "AI/ML Engineering", icon: "🤖", requiredSkills: ["Python", "PyTorch", "LLMs", "FastAPI", "Neural Networks", "LangChain"] },
    { id: "backend", name: "Backend Development", icon: "⚙️", requiredSkills: ["Python", "FastAPI/Django", "PostgreSQL", "REST APIs", "Docker", "Redis"] },
    { id: "cloud", name: "Cloud Engineering", icon: "☁️", requiredSkills: ["AWS/Azure", "Docker", "Kubernetes", "Linux", "Terraform", "CI/CD"] },
    { id: "cyber", name: "Cybersecurity", icon: "🛡️", requiredSkills: ["Networking", "Linux", "Ethical Hacking", "Python", "Cryptography", "SIEM"] },
    { id: "uiux", name: "UI/UX Design", icon: "🎨", requiredSkills: ["Figma", "User Research", "Wireframing", "Prototyping", "Design Systems"] },
    { id: "sap", name: "SAP Consultant", icon: "💼", requiredSkills: ["SAP S/4HANA", "ABAP", "Business Processes", "FI/CO", "MM/SD Modules"] },
    { id: "business_analyst", name: "Business Analyst", icon: "📈", requiredSkills: ["Requirements Gathering", "SQL", "Excel", "Agile/Scrum", "Process Mapping"] },
  ];

  // User Preparation Gate Progress State
  const [learningProgress, setLearningProgress] = useState(85);
  const [isResumeCompleted, setIsResumeCompleted] = useState(true);
  const [isMockTestCompleted, setIsMockTestCompleted] = useState(true);
  const [mockInterviewScore, setMockInterviewScore] = useState(82); // default 82 >= 80 (Passed)
  const [mockInterviewStatus, setMockInterviewStatus] = useState("PASSED"); // PASSED or NOT PASSED

  // 1. Chatbot Quick State (for fallback modal)
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "bot",
      text: `Hello ${user?.name || "Learner"}! 👋 I am your WILDFIRE AI Mentor. I can help analyze your skills, recommend career paths, and guide your prep!`,
      time: "Just now",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // 2. Text Learning Chapter State
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  // Chapters Data
  const textChapters = [
    {
      title: "Chapter 1: Introduction & Domain Fundamentals",
      duration: "15 mins",
      content: `Welcome to the ${selectedDomain} core curriculum! In this chapter, we explore the industry landscape, key responsibilities, and essential workflows required for real-world production environments.`,
      keyPoints: [
        "Understand foundational concepts and terminology",
        "Learn industry standard toolstacks and environments",
        "Identify key business problems solved by this domain",
      ],
      codeSnippet: `// Example Initial Setup\nfunction initializeDomainEnvironment() {\n  console.log("Setting up ${selectedDomain} Workspace...");\n  return { status: "Ready", engine: "WILDFIRE OS v2.0" };\n}`,
    },
    {
      title: "Chapter 2: Core Technical Tools & Syntax",
      duration: "25 mins",
      content: `Mastering key syntax and methods. We dive deep into writing clean, maintainable, and efficient logic. Learn how to debug common errors and structure your projects cleanly.`,
      keyPoints: [
        "Data structures and type management",
        "Asynchronous execution and API data flow",
        "Error handling best practices",
      ],
      codeSnippet: `// Data Pipeline Execution\nasync function fetchAndProcessData(endpoint) {\n  try {\n    const response = await fetch(endpoint);\n    const data = await response.json();\n    return data.filter(item => item.active);\n  } catch (err) {\n    console.error("Data Pipeline Error:", err);\n  }\n}`,
    },
    {
      title: "Chapter 3: Advanced Architecture & Production Projects",
      duration: "40 mins",
      content: `Scaling your project for enterprise deployment. Focus on performance optimization, database queries, and deployment pipelines.`,
      keyPoints: [
        "Architectural patterns and state management",
        "Database query optimization and indexing",
        "CI/CD deployment and monitoring",
      ],
      codeSnippet: `// Production Endpoint Schema\n@app.post("/api/v1/analyze")\ndef analyze_payload(payload: DataSchema):\n    processed = transform_dataset(payload.records)\n    return {"status": "success", "metrics": processed.summary()}`,
    },
  ];

  // 3. Recorded Classes Video State
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const recordedVideos = [
    { id: 1, title: `${selectedDomain} - Module 1: Master Fundamentals`, duration: "45 mins", status: "Completed", thumbnail: "📹" },
    { id: 2, title: `${selectedDomain} - Module 2: Core Hands-on Project`, duration: "60 mins", status: "In Progress", thumbnail: "▶️" },
    { id: 3, title: `${selectedDomain} - Module 3: Advanced Optimization`, duration: "50 mins", status: "Upcoming", thumbnail: "🔒" },
    { id: 4, title: `${selectedDomain} - Module 4: Industry Interview Prep`, duration: "40 mins", status: "Upcoming", thumbnail: "🔒" },
  ];

  // 4. Live Classes Schedule State
  const liveClassesList = [
    { id: 1, title: `Live Workshop: ${selectedDomain} System Architecture`, instructor: "Dr. Aris Thorne", date: "Today", time: "7:00 PM IST", status: "UPCOMING", meetUrl: "https://meet.google.com/demo-velfire-live" },
    { id: 2, title: `Live Code Review & Portfolio Audit`, instructor: "Sarah Jenkins (Lead Engineer)", date: "Tomorrow", time: "6:30 PM IST", status: "SCHEDULED", meetUrl: "https://meet.google.com/demo-velfire-live" },
  ];

  // 5. Assessment Test State
  const [assessmentSelectedAnswers, setAssessmentSelectedAnswers] = useState({});
  const [assessmentResult, setAssessmentResult] = useState(null);

  const assessmentQuestions = [
    {
      id: 1,
      question: `In ${selectedDomain}, what is the primary benefit of modular architectural design?`,
      options: [
        "Increases code length without benefits",
        "Improves maintainability, reusability, and testing",
        "Slows down execution speed",
        "Disables database persistence",
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: "Which data manipulation approach yields optimal query execution performance?",
      options: [
        "Fetching entire database tables into client memory",
        "Using proper indexing, filtering at source, and CTEs",
        "Avoiding SQL JOIN operations completely",
        "Running queries inside nested synchronous loops",
      ],
      correctAnswer: 1,
    },
    {
      id: 3,
      question: "What is the critical criteria for deploying technical applications into production?",
      options: [
        "Zero error handling and no logging",
        "Hardcoding database passwords in frontend code",
        "Automated CI/CD pipelines, secure environment variables, and unit tests",
        "Manually copying files via FTP during peak traffic",
      ],
      correctAnswer: 2,
    },
  ];

  const handleScoreAssessment = () => {
    let score = 0;
    assessmentQuestions.forEach((q) => {
      if (assessmentSelectedAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });
    const percentage = Math.round((score / assessmentQuestions.length) * 100);
    setAssessmentResult({
      score,
      total: assessmentQuestions.length,
      percentage,
      passed: percentage >= 66,
    });
  };

  // 6. Resume Builder Form State
  const [resumeData, setResumeData] = useState({
    name: user?.name || "Poovarasan",
    email: user?.email || "velfire07@gmail.com",
    phone: "+91 98765 43210",
    location: "Chennai, Tamil Nadu",
    summary: `Motivated technical candidate specializing in ${selectedDomain}. Passionate about building scalable, high-performance systems and data solutions.`,
    skills: "Python, SQL, React, FastAPI, Git, Data Analysis, System Design",
    experience: "Technical Intern at Velfire Labs (6 months) - Built automated data pipelines and responsive dashboards.",
    education: "B.E. Computer Science & Engineering (Graduating 2026)",
    projects: "WILDFIRE AI Platform - Built end-to-end career guidance dashboard with React and Python.",
  });

  // 7. Resume Analyzer State
  const [targetDomain, setTargetDomain] = useState("Data Analyst");
  const [resumeAnalysisResult, setResumeAnalysisResult] = useState(null);

  const handleAnalyzeResume = () => {
    const isMatched = selectedDomain === targetDomain;
    setResumeAnalysisResult({
      matchScore: isMatched ? 88 : 72,
      matchedSkills: ["Python", "SQL", "Git", "Project Execution"],
      missingSkills: isMatched ? ["Power BI", "Statistics"] : ["AWS", "Docker", "Advanced System Design"],
      suggestions: [
        "Include quantifiable metric achievements (e.g. 'Improved speed by 40%')",
        "Add key technical tools matching " + targetDomain,
        "Refine professional summary to highlight domain alignment",
      ],
    });
  };

  // 8. Mock Test State
  const [mockTestAnswers, setMockTestAnswers] = useState({});
  const [mockTestScore, setMockTestScore] = useState(null);

  const mockTestQuestions = [
    { id: 1, q: "Which SQL clause filters records after aggregation with GROUP BY?", opts: ["WHERE", "HAVING", "ORDER BY", "SELECT"], correct: 1 },
    { id: 2, q: "In Python, which data structure stores unique elements with zero duplicates?", opts: ["List", "Tuple", "Set", "Dictionary"], correct: 2 },
    { id: 3, q: "What is the primary function of Docker in modern software engineering?", opts: ["Video Editing", "Containerizing applications and dependencies", "Compiling C++ code", "Styling HTML elements"], correct: 1 },
  ];

  const handleCalculateMockTest = () => {
    let count = 0;
    mockTestQuestions.forEach((q) => {
      if (mockTestAnswers[q.id] === q.correct) count += 1;
    });
    const perc = Math.round((count / mockTestQuestions.length) * 100);
    setMockTestScore({ score: count, total: mockTestQuestions.length, percentage: perc });
    setIsMockTestCompleted(true);
  };

  // 9. Mock Interview State (THE GATEKEEPER TO JOB PORTAL)
  const [currentInterviewStep, setCurrentInterviewStep] = useState(0);
  const [userInterviewAnswers, setUserInterviewAnswers] = useState(["", "", ""]);
  const [interviewReport, setInterviewReport] = useState(null);

  const interviewQuestions = [
    {
      q: `Can you introduce yourself and explain why you chose the ${selectedDomain} domain?`,
      hint: "Structure your answer: Background -> Core Skills -> Why this domain excites you.",
    },
    {
      q: `Walk me through a complex technical challenge you solved using Python or SQL.`,
      hint: "Use STAR method: Situation -> Task -> Action -> Result.",
    },
    {
      q: `How do you ensure data accuracy, scalability, and code quality in production systems?`,
      hint: "Mention testing, code reviews, indexing, and automated pipelines.",
    },
  ];

  const handleSubmitInterview = () => {
    // Calculate simulated interview evaluation
    let score = 84; // Passing default
    const totalWords = userInterviewAnswers.join(" ").split(/\s+/).filter(Boolean).length;
    if (totalWords > 30) {
      score = 88;
    } else if (totalWords < 10) {
      score = 65;
    }

    const passed = score >= 80;
    const report = {
      score,
      status: passed ? "PASSED" : "NOT PASSED",
      techScore: Math.round(score * 0.95),
      communicationScore: Math.round(score * 0.9),
      strengths: ["Strong understanding of core domain tools", "Clear communication of project execution"],
      areasToImprove: passed ? ["Elaborate more on cloud scale deployment"] : ["Provide longer, more detailed technical explanations"],
    };

    setInterviewReport(report);
    setMockInterviewScore(score);
    setMockInterviewStatus(report.status);
  };

  // 10. Job Portal Filtering State
  const [jobSearch, setJobSearch] = useState("");
  const [filterDomain, setFilterDomain] = useState("All");
  const [filterWorkMode, setFilterWorkMode] = useState("All");
  const [jobPortalTab, setJobPortalTab] = useState("listings"); // 'listings' | 'applied'
  const [appliedJobsMap, setAppliedJobsMap] = useState({});

  const sampleJobs = [
    {
      id: "j1",
      title: "Junior Data Analyst",
      company: "ABC Technologies",
      location: "Bangalore, KA",
      workMode: "Hybrid",
      experience: "0–2 yrs",
      skills: ["SQL", "Excel", "Power BI", "Python"],
      salary: "₹6,00,000 - ₹8,50,000 / yr",
      postedDate: "2 days ago",
      domain: "Data Analyst",
    },
    {
      id: "j2",
      title: "Full Stack Software Engineer",
      company: "Velfire Systems Inc.",
      location: "Chennai, TN",
      workMode: "Remote",
      experience: "0–1 yrs",
      skills: ["React", "FastAPI", "Python", "PostgreSQL"],
      salary: "₹8,00,000 - ₹12,00,000 / yr",
      postedDate: "Just now",
      domain: "Full Stack Development",
    },
    {
      id: "j3",
      title: "AI & ML Associate Developer",
      company: "Nexus AI Labs",
      location: "Hyderabad, TS",
      workMode: "On-site",
      experience: "0–2 yrs",
      skills: ["Python", "PyTorch", "LLMs", "FastAPI"],
      salary: "₹9,00,000 - ₹14,00,000 / yr",
      postedDate: "1 day ago",
      domain: "AI/ML Engineering",
    },
    {
      id: "j4",
      title: "Backend FastAPI Engineer",
      company: "Quantum Software Solutions",
      location: "Bangalore, KA",
      workMode: "Remote",
      experience: "0–2 yrs",
      skills: ["Python", "FastAPI", "SQL", "Docker"],
      salary: "₹7,50,000 - ₹10,50,000 / yr",
      postedDate: "3 days ago",
      domain: "Backend Development",
    },
  ];

  const handleApplyJob = (jobId) => {
    setAppliedJobsMap((prev) => ({
      ...prev,
      [jobId]: { appliedAt: new Date().toLocaleDateString(), status: "Application Submitted" },
    }));
  };

  useEffect(() => {
    localStorage.setItem("velfire_theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getInitials = (name, email) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return "V";
  };

  const handleSendMessage = (textToSend) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const userMsg = {
      sender: "user",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput("");

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `WILDFIRE AI: Great query regarding ${text}! Visit our Learning Portal for structured roadmaps & domain tests.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 600);
  };

  const filteredJobs = sampleJobs.filter((job) => {
    const matchesQuery =
      job.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.company.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(jobSearch.toLowerCase()));

    const matchesDomain = filterDomain === "All" || job.domain === filterDomain;
    const matchesWorkMode = filterWorkMode === "All" || job.workMode === filterWorkMode;

    return matchesQuery && matchesDomain && matchesWorkMode;
  });

  return (
    <div className={`dashboard-page ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      {/* Header Bar */}
      <header className="dashboard-header">
        <div className="header-left">
          <button className="btn-back-home" onClick={onBackToHome} title="Back to Home">
            ← Home
          </button>
          <h1 className="dash-logo" onClick={onBackToHome}>
            VELFIRE <span className="dash-badge">CAREER PLATFORM</span>
          </h1>
        </div>

        <div className="header-right">
          <button className="dash-action-btn" onClick={toggleTheme} title="Toggle Theme">
            {isDarkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          <div className="dash-user-chip">
            {user?.profile_image ? (
              <img src={user.profile_image} alt={user.name} className="chip-photo" />
            ) : (
              <div className="chip-avatar">{getInitials(user?.name, user?.email)}</div>
            )}
            <span className="chip-name">{user?.name || "User"}</span>
          </div>

          <button className="dash-logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Body - 3 Major Module Cards */}
      <main className="dashboard-body">
        
        {/* 3 Major Portals Grid */}
        <div className="os-portal-grid">
          
          {/* CARD 1: WILDFIRE AI CHATBOT */}
          <div className="portal-card card-chatbot">
            <div className="portal-card-badge badge-chatbot">⚡ AI Assistant</div>
            <div className="portal-icon-wrapper icon-chatbot">
              <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path>
                <rect x="4" y="8" width="16" height="12" rx="4"></rect>
                <circle cx="9" cy="13" r="1.5" fill="currentColor"></circle>
                <circle cx="15" cy="13" r="1.5" fill="currentColor"></circle>
                <path d="M10 17h4"></path>
              </svg>
            </div>
            
            <h2 className="portal-title">1. WILDFIRE AI Mentor</h2>
            <p className="portal-description">
              Intelligent career guidance chatbot. Enter your current skills (e.g. Python), analyze skill gaps, explore technical domains, and receive custom roadmaps.
            </p>
            
            <div className="portal-highlights">
              <span>🤖 Skill & Domain Career Analysis</span>
              <span>⚡ Skill Gap Identification</span>
              <span>💬 Personalized 90-Day Roadmaps</span>
            </div>

            <button 
              className="portal-btn btn-chatbot"
              onClick={() => {
                if (onOpenChatbot) {
                  onOpenChatbot();
                } else {
                  setActiveModal("chatbot");
                }
              }}
            >
              <span>Open AI Mentor</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

          {/* CARD 2: COURSE & LEARNING PLATFORM */}
          <div className="portal-card card-learning">
            <div className="portal-card-badge badge-learning">🎓 Skill Mastery</div>
            <div className="portal-icon-wrapper icon-learning">
              <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
            </div>

            <h2 className="portal-title">2. Learning Platform</h2>
            <p className="portal-description">
              Complete career learning hub: 10 Domains, Text/Recorded/Live classes, Assessments, Resume Builder, Resume Analyzer, Mock Tests, and Mock Interview.
            </p>

            <div className="portal-highlights">
              <span>📖 Text, Recorded & Live Learning Modes</span>
              <span>📄 Built-in Resume Builder & ATS Analyzer</span>
              <span>🎤 Mock Interview with Real Scoring</span>
            </div>

            <button 
              className="portal-btn btn-learning"
              onClick={() => setActiveModal("learning")}
            >
              <span>Open Learning Platform</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

          {/* CARD 3: JOB PORTAL */}
          <div className="portal-card card-jobs">
            <div className="portal-card-badge badge-jobs">💼 Active Hiring</div>
            <div className="portal-icon-wrapper icon-jobs">
              <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>

            <h2 className="portal-title">3. VELFIRE Jobs</h2>
            <p className="portal-description">
              Targeted tech job postings unlocked after passing your domain Mock Interview (80%+ required). Search, filter by domain/location, and apply in one click.
            </p>

            <div className="portal-highlights">
              <span>🔒 Preparation Gate Access Control</span>
              <span>🎯 Precision AI Skill Matching</span>
              <span>⚡ One-Click Direct Application</span>
            </div>

            <button 
              className="portal-btn btn-jobs"
              onClick={() => setActiveModal("jobs")}
            >
              <span>Open Job Portal</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* --- MODAL 1: FALLBACK AI CHATBOT MODAL --- */}
      {/* ========================================================================= */}
      {activeModal === "chatbot" && (
        <div className="portal-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="portal-modal-card chatbot-modal" onClick={(e) => e.stopPropagation()}>
            <div className="portal-modal-header">
              <div className="modal-header-info">
                <span className="modal-header-icon">🤖</span>
                <div>
                  <h3>WILDFIRE AI Mentor</h3>
                  <span className="status-online">● Career Assistant Ready</span>
                </div>
              </div>
              <button className="portal-modal-close" onClick={() => setActiveModal(null)}>✕</button>
            </div>

            <div className="chatbot-messages-container">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`chat-bubble-wrapper ${msg.sender}`}>
                  <div className="chat-bubble">
                    <p>{msg.text}</p>
                    <span className="chat-time">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-quick-prompts">
              <button onClick={() => handleSendMessage("I know Python, what domain can I choose?")}>🐍 I know Python</button>
              <button onClick={() => handleSendMessage("What is the difference between Data Analyst & Data Scientist?")}>📊 Data Analyst vs Scientist</button>
              <button onClick={() => handleSendMessage("What projects should I build for Full Stack?")}>🌐 Full Stack Projects</button>
            </div>

            <div className="chat-input-row">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask WILDFIRE AI Mentor anything..."
              />
              <button className="btn-send-chat" onClick={() => handleSendMessage()}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* --- MODAL 2: COURSE & LEARNING PLATFORM --- */}
      {/* ========================================================================= */}
      {activeModal === "learning" && (
        <div className="portal-modal-overlay full-screen-overlay">
          <div className={`portal-modal-card learning-full-modal learning-hub-${learningMode}-mode`}>
            
            {/* Modal Top Header */}
            <div className="portal-modal-header">
              <button 
                className="btn-return-dashboard" 
                onClick={() => {
                  setActiveModal(null);
                  setLearningMode("choice");
                }} 
                title="Return to Main Dashboard"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <span>Return to Dashboard</span>
              </button>

              {/* Mode Switcher Header Pills */}
              <div className="learning-platform-mode-switcher">
                <button 
                  className={`mode-switch-btn ${learningMode === "roadmap" ? "active" : ""}`}
                  onClick={() => {
                    setLearningMode("roadmap");
                    setLearningTab("roadmap");
                  }}
                >
                  🗺️ VELFIRE Roadmap
                </button>
                <button 
                  className={`mode-switch-btn ${learningMode === "course" ? "active" : ""}`}
                  onClick={() => {
                    setLearningMode("course");
                    setLearningTab("full_curriculum");
                  }}
                >
                  🎓 VELFIRE Courses
                </button>
              </div>

              {/* Domain Dropdown Selector */}
              <div className="domain-select-wrapper">
                <select
                  className="domain-dropdown"
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                >
                  {domainsList.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.icon} {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <button className="full-page-close-btn" onClick={() => { setActiveModal(null); setLearningMode("choice"); }} title="Return to Dashboard">
                ✕ Return
              </button>
            </div>

            {/* CHOICE VIEW: 2 BIG BUTTON CARDS */}
            {learningMode === "choice" && (
              <div className="learning-choice-container">
                <div className="choice-hero-heading">
                  <h2>🎓 VELFIRE Learning Hub</h2>
                  <p>Choose your pathway: Generate a custom AI Career Roadmap or enter the Course Learning Portal.</p>
                </div>

                <div className="choice-cards-grid">
                  {/* CARD 1: VELFIRE ROADMAP */}
                  <div className="choice-card card-roadmap-choice" onClick={() => { setLearningMode("roadmap"); setLearningTab("roadmap"); }}>
                    <div className="choice-badge badge-roadmap">🗺️ AI Pathway</div>
                    <div className="choice-icon-hero">🗺️</div>
                    <h3>1. VELFIRE Roadmap</h3>
                    <p>
                      Generate custom AI-powered step-by-step roadmaps for <strong>{selectedDomain}</strong>, analyze skill gaps, select milestone durations, and track structured career goals.
                    </p>

                    <div className="choice-bullet-list">
                      <span>⚡ AI Custom Milestone Generation</span>
                      <span>📊 Interactive Skill Gap Analysis</span>
                      <span>📅 Customizable Timeline (1 - 6 Months)</span>
                    </div>

                    <button className="btn-choice-action btn-roadmap-choice">
                      <span>Open VELFIRE Roadmap</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  </div>

                  {/* CARD 2: VELFIRE COURSE */}
                  <div className="choice-card card-course-choice" onClick={() => { setLearningMode("course"); }}>
                    <div className="choice-badge badge-course">🎓 Interactive Courses</div>
                    <div className="choice-icon-hero">📚</div>
                    <h3>2. VELFIRE Course</h3>
                    <p>
                      Master <strong>{selectedDomain}</strong> with structured Text Lessons, Recorded Masterclasses, Live Sessions, and Career Tools.
                    </p>

                    <div className="choice-bullet-list">
                      <span>📖 Structured Text & Code Modules</span>
                      <span>🎬 Recorded Video Masterclasses</span>
                      <span>🔴 Live Interactive Sessions</span>
                      <span>💼 Resume Builder & ATS Analyzer</span>
                    </div>

                    <button className="btn-choice-action btn-course-choice">
                      <span>Open VELFIRE Course</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ROADMAP GENERATOR VIEW */}
            {learningMode === "roadmap" && (
              <div className="learning-tab-content">
                <VelfireRoadmapGenerator
                  initialCourse={selectedDomain}
                  onSwitchToCourse={() => {
                    setLearningMode("course");
                    setLearningTab("full_curriculum");
                  }}
                />
              </div>
            )}

            {/* VELFIRE COURSES - FULL INTERACTIVE LEARNING PLATFORM */}
            {learningMode === "course" && (
              <div className="learning-tab-content">
                <VelfireCoursePlatform
                  selectedDomain={selectedDomain}
                  onSwitchToRoadmap={() => {
                    setLearningMode("roadmap");
                    setLearningTab("roadmap");
                  }}
                  onBackToChoice={() => setLearningMode("choice")}
                />
              </div>
            )}
      </div>
    </div>
  )}

      {/* ========================================================================= */}
      {/* --- MODAL 3: JOB PORTAL & PREPARATION GATE --- */}
      {/* ========================================================================= */}
      {activeModal === "jobs" && (
        <div className="portal-modal-overlay full-screen-overlay">
          <div className="portal-modal-card jobs-full-modal">
            
            {/* Modal Header */}
            <div className="portal-modal-header">
              <button 
                className="btn-return-dashboard" 
                onClick={() => setActiveModal(null)} 
                title="Return to Main Dashboard"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <span>Return to Dashboard</span>
              </button>

              <div className="modal-header-info">
                <span className="modal-header-icon">💼</span>
                <div>
                  <h3>VELFIRE JOBS</h3>
                  <span className="modal-subtitle">Direct Tech Hiring & Application Management</span>
                </div>
              </div>
              <button className="full-page-close-btn" onClick={() => setActiveModal(null)} title="Return to Dashboard">
                ✕ Return
              </button>
            </div>

            {/* Preparation Gate Access Check */}
            {mockInterviewScore < 80 ? (
              <div className="jobs-gate-locked-view">
                <div className="lock-icon-hero">🔒</div>
                <h2>Job Portal Locked</h2>
                <p>Complete your learning journey and pass the Mock Interview with an 80%+ score to unlock job opportunities.</p>

                <div className="gate-checklist">
                  <div className="check-item done">✓ Course Learning: {learningProgress}%</div>
                  <div className="check-item done">✓ Resume Builder: Completed</div>
                  <div className="check-item done">✓ Mock Tests: Completed</div>
                  <div className="check-item pending">✗ Mock Interview Score: {mockInterviewScore}/100 (80 Required)</div>
                </div>

                <div className="locked-gate-actions">
                  <button
                    className="btn-unlock-gate-action"
                    onClick={() => {
                      setActiveModal("learning");
                      setLearningTab("mock_interview");
                    }}
                  >
                    🎤 Take Mock Interview Now to Unlock Jobs →
                  </button>
                  <button
                    className="btn-return-secondary"
                    onClick={() => setActiveModal(null)}
                  >
                    ← Return to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              /* UNLOCKED JOB PORTAL */
              <div className="jobs-unlocked-container">
                
                {/* Search & Filter Controls */}
                <div className="jobs-filter-bar">
                  <input
                    type="text"
                    placeholder="Search by title, company, or skills..."
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    className="job-search-input"
                  />

                  <select value={filterDomain} onChange={(e) => setFilterDomain(e.target.value)}>
                    <option value="All">All Domains</option>
                    {domainsList.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>

                  <select value={filterWorkMode} onChange={(e) => setFilterWorkMode(e.target.value)}>
                    <option value="All">All Work Modes</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>

                  <div className="job-view-tabs">
                    <button className={jobPortalTab === "listings" ? "active" : ""} onClick={() => setJobPortalTab("listings")}>
                      Listings ({filteredJobs.length})
                    </button>
                    <button className={jobPortalTab === "applied" ? "active" : ""} onClick={() => setJobPortalTab("applied")}>
                      Applied ({Object.keys(appliedJobsMap).length})
                    </button>
                  </div>
                </div>

                {/* Job Cards View */}
                {jobPortalTab === "listings" && (
                  <div className="jobs-listings-grid">
                    {filteredJobs.map((job) => {
                      const isApplied = Boolean(appliedJobsMap[job.id]);
                      return (
                        <div key={job.id} className="job-card-expanded">
                          <div className="job-top-row">
                            <div>
                              <h4>{job.title}</h4>
                              <p className="company-info">{job.company} • 📍 {job.location}</p>
                            </div>
                            <span className="work-mode-pill">{job.workMode}</span>
                          </div>

                          <div className="job-tags-row">
                            {job.skills.map((s, idx) => (
                              <span key={idx} className="skill-tag">{s}</span>
                            ))}
                          </div>

                          <div className="job-footer-row">
                            <span className="salary-text">{job.salary}</span>
                            <button
                              className={`btn-apply-job ${isApplied ? "applied" : ""}`}
                              onClick={() => handleApplyJob(job.id)}
                            >
                              {isApplied ? "✓ Applied" : "APPLY NOW"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Applied Jobs Tab View */}
                {jobPortalTab === "applied" && (
                  <div className="applied-jobs-view">
                    <h3>Your Active Job Applications</h3>
                    {Object.keys(appliedJobsMap).length === 0 ? (
                      <p className="no-apps-msg">You have not applied for any jobs yet.</p>
                    ) : (
                      <div className="applied-list">
                        {Object.keys(appliedJobsMap).map((jId) => {
                          const job = sampleJobs.find((j) => j.id === jId);
                          const appInfo = appliedJobsMap[jId];
                          if (!job) return null;
                          return (
                            <div key={jId} className="applied-job-item">
                              <div>
                                <h4>{job.title}</h4>
                                <p>{job.company} • Applied on: {appInfo.appliedAt}</p>
                              </div>
                              <span className="app-status-badge">● {appInfo.status}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;
