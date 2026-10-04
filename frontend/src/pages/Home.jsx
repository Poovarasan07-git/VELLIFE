import { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer";
import "./Home.css";

const API_BASE_URL = "http://127.0.0.1:8000";

function Home({ user, onLogout, onUpdateUser, onOpenDashboard, onOpenChatbot }) {
  const [activeTab, setActiveTab] = useState("home");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  // Help Center Interactive State
  const [helpCenterTab, setHelpCenterTab] = useState('chat'); // 'chat' | 'contact' | 'faq'
  const [helpChatMessages, setHelpChatMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! 👋 I am your **VELFIRE In-App Assistant**.\n\nWhat would you like to know or do? Ask me anything about our **AI Roadmaps**, **Courses (Text/Recorded/Live)**, **Job Portal**, **ATS Resume Tools**, or **Support Contact**, and I will answer you in real time!",
      time: "Just now",
      actionType: null,
      actionLabel: null
    }
  ]);
  const [helpChatInput, setHelpChatInput] = useState("");
  const [isHelpChatTyping, setIsHelpChatTyping] = useState(false);
  const helpChatEndRef = useRef(null);
  const [contactForm, setContactForm] = useState({ 
    name: "", 
    email: "", 
    topic: "General Platform Inquiry",
    message: "" 
  });
  const [contactSent, setContactSent] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [expandedFaqId, setExpandedFaqId] = useState(1);

  const handleCopyEmail = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText("velfire07@gmail.com");
    }
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  // Auto-scroll help chatbot stream
  useEffect(() => {
    if (helpCenterTab === 'chat' && showHelpModal) {
      helpChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [helpChatMessages, isHelpChatTyping, helpCenterTab, showHelpModal]);

  // Formatter for bold text and paragraphs in chatbot
  const renderFormattedHelpText = (text) => {
    if (!text) return null;
    return text.split('\n').map((paragraph, pIdx) => {
      if (!paragraph.trim()) return <br key={pIdx} />;
      const parts = paragraph.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={pIdx} className="help-msg-line">
          {parts.map((part, idx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={idx}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </span>
      );
    });
  };
  
  // Get Started / Continue state persistence
  const [hasStarted, setHasStarted] = useState(() => {
    return localStorage.getItem("velfire_has_started") === "true";
  });

  // Profile edit state inside Settings
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileStatus, setProfileStatus] = useState(user?.status_role || "Student");
  const [profilePhone, setProfilePhone] = useState(user?.phone_number || "");
  const [profileImage, setProfileImage] = useState(user?.profile_image || "");

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");
  const [saveError, setSaveError] = useState("");
  const fileInputRef = useRef(null);

  // Dynamic Animated Title Phrases for Gen-Z Hero Section
  const heroPhrases = [
    "Accelerate Your Tech Growth",
    "Master Full Stack & AI Skills",
    "Build Production SaaS Projects",
    "Launch Your Software Career"
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % heroPhrases.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Sync profile edit state if user prop changes
  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setProfileStatus(user.status_role || "Student");
      setProfilePhone(user.phone_number || "");
      setProfileImage(user.profile_image || "");
    }
  }, [user]);

  // Theme state with localStorage persistence
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("velfire_theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("velfire_theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleHomeClick = () => {
    setActiveTab("home");
    setShowSettingsModal(false);
    setShowAboutModal(false);
    setShowHelpModal(false);
    setShowNotificationsModal(false);
  };

  const handleAboutClick = () => {
    setActiveTab("about");
    setShowAboutModal(true);
    setShowSettingsModal(false);
    setShowHelpModal(false);
    setShowNotificationsModal(false);
  };

  const handleHelpClick = () => {
    setActiveTab("help");
    setShowHelpModal(true);
    setShowSettingsModal(false);
    setShowAboutModal(false);
    setShowNotificationsModal(false);
  };

  const handleSettingsClick = () => {
    setActiveTab("settings");
    setShowSettingsModal(true);
    setShowAboutModal(false);
    setShowHelpModal(false);
    setShowNotificationsModal(false);
  };

  const handleNotificationsClick = () => {
    setShowNotificationsModal(!showNotificationsModal);
    setShowSettingsModal(false);
    setShowAboutModal(false);
    setShowHelpModal(false);
  };

  // Help Center FAQs Data (Clean, Essential & English)
  const helpFaqs = [
    {
      id: 1,
      question: "How do I generate and customize an AI Career Roadmap?",
      icon: "🗺️",
      badge: "AI Roadmap",
      answer: "Click 'Launch Learning Workspace' or 'Open AI Roadmap', select any of our 10 technology domains (like Full Stack Development, Data Analyst, or Cloud), choose your timeframe (1 to 6 months), and click Generate. You'll receive a structured, week-by-week curriculum with actionable milestones.",
      actionLabel: "Open Learning Workspace",
      actionType: "workspace"
    },
    {
      id: 2,
      question: "How do I study domain courses (Text, Recorded & Live)?",
      icon: "📚",
      badge: "Domain Courses",
      answer: "In the Learning Platform under 'VELFIRE Courses', you will find 3 learning sections: 1. Text Lessons (structured reading modules with code snippets & practice), 2. Recorded Classes (HD video masterclasses with chapter notes), and 3. Live Sessions (interactive workshops with direct instructor Q&A).",
      actionLabel: "Explore Courses",
      actionType: "workspace"
    },
    {
      id: 3,
      question: "How do I use the Resume Builder and Resume Analyzer?",
      icon: "📄",
      badge: "Career Tools",
      answer: "Open the 'VELFIRE Courses' hub and scroll down to 'Career Tools'. The Resume Builder lets you build ATS-compliant resumes with real-time live preview and instant PDF export. The Resume Analyzer lets you upload your CV/resume to evaluate your ATS compatibility score and missing keywords.",
      actionLabel: "Open Career Tools",
      actionType: "workspace"
    },
    {
      id: 4,
      question: "How do I access and apply for jobs in VELFIRE Jobs?",
      icon: "💼",
      badge: "Job Portal",
      answer: "The VELFIRE Job Portal connects learners directly with hiring tech companies. Progress through your domain roadmap and complete the Mock Interview with an 80%+ score to unlock verified job postings, salary benchmarks, and 1-click applications.",
      actionLabel: "View VELFIRE Jobs",
      actionType: "workspace"
    }
  ];

  const handleSendHelpChat = async (presetText) => {
    const text = (presetText || helpChatInput).trim();
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text,
      time: "Just now"
    };

    setHelpChatMessages(prev => [...prev, userMsg]);
    setHelpChatInput("");
    setIsHelpChatTyping(true);

    const lower = text.toLowerCase();

    // 1. COMPREHENSIVE VELFIRE APP KNOWLEDGE BASE
    let reply = "";
    let actionType = null;
    let actionLabel = null;

    if (
      lower.includes("what is velfire") || 
      lower.includes("what is veli-cha") || 
      lower.includes("what is this app") || 
      lower.includes("about velfire") ||
      lower.includes("tell me about velfire") ||
      lower.includes("tell me about the app") ||
      lower.includes("overview") ||
      lower.includes("purpose")
    ) {
      reply = "🌟 **VELFIRE (VELI-CHA)** is an AI-powered Career Acceleration & Tech Learning Platform.\n\nIt is built for students, graduates, and professionals to master high-demand tech skills and land dream jobs through 5 integrated systems:\n• 🗺️ **Personalized AI Roadmaps**: Custom-generated curriculum tailored to your domain and target timeline.\n• 📚 **3-in-1 Courses**: Interactive Text modules, Recorded video masterclasses, and Live mentor sessions.\n• 💼 **VELFIRE Jobs**: Curated tech openings with fast 1-click applications.\n• 🤖 **24/7 AI Mentor**: Live code debugging, concept breakdowns, and simulated mock interviews.\n• 📄 **ATS Career Tools**: Professional Resume Builder with PDF export & Resume ATS Analyzer.";
      actionType = "workspace";
      actionLabel = "🚀 Open Learning Workspace";
    } else if (
      lower.includes("roadmap") || 
      lower.includes("curriculum") || 
      lower.includes("pathway") || 
      lower.includes("syllabus") ||
      lower.includes("milestone") ||
      lower.includes("how to start") ||
      lower.includes("start learning")
    ) {
      reply = "🗺️ **Open VELFIRE Roadmap** generates an interactive, week-by-week learning pathway tailored specifically to you:\n\n1. Select your target domain (Full Stack Web Dev, AI & Machine Learning, Data Analytics, Cloud DevOps, Cybersecurity, etc.).\n2. Set your duration (1 Month Sprint, 3 Months Mastery, or 6 Months Deep Dive) and your skill level.\n3. The platform generates actionable milestones, weekly checklists, conceptual deep-dives, and hands-on capstone projects!\n\nYou can track your progress visually right from the dashboard.";
      actionType = "workspace";
      actionLabel = "🗺️ Open Roadmap Generator";
    } else if (
      lower.includes("course") || 
      lower.includes("classes") || 
      lower.includes("recorded") || 
      lower.includes("live") || 
      lower.includes("text") || 
      lower.includes("learn") || 
      lower.includes("lesson") ||
      lower.includes("video") ||
      lower.includes("study")
    ) {
      reply = "📚 **Open VELFIRE Courses** delivers learning across 3 rich formats:\n\n• 📖 **TEXT**: In-depth theoretical modules, architecture diagrams, best practices, and code syntax snippets.\n• 🎥 **RECORDED**: High-definition video masterclasses organized by module with chapter breakdowns and playback controls.\n• 🔴 **LIVE**: Real-time interactive coaching sessions with industry experts, live Q&A, and live project build-alongs!";
      actionType = "workspace";
      actionLabel = "📚 Open VELFIRE Courses";
    } else if (
      lower.includes("job") || 
      lower.includes("portal") || 
      lower.includes("hire") || 
      lower.includes("hiring") || 
      lower.includes("apply") || 
      lower.includes("placement") || 
      lower.includes("salary") ||
      lower.includes("vacancy") ||
      lower.includes("career opportunity")
    ) {
      reply = "💼 **VELFIRE Jobs** is our verified tech job portal designed with a butter-and-green aesthetic:\n\n• Browse verified openings for Full-Stack Developers, AI Engineers, Frontend Specialists, and Data Analysts.\n• Filter by role, salary package, and work mode (Remote / Onsite / Hybrid).\n• Fast 1-Click Application directly using your saved profile and resume!\n• Pro tip: Complete roadmap milestones and achieve 80%+ on our AI Mock Interview to earn a verified candidate badge.";
      actionType = "workspace";
      actionLabel = "💼 View VELFIRE Jobs";
    } else if (
      lower.includes("ai mentor") || 
      lower.includes("mentor") || 
      lower.includes("doubt") || 
      lower.includes("coding help") || 
      lower.includes("debug") || 
      lower.includes("interview") ||
      lower.includes("mock")
    ) {
      reply = "🤖 **VELFIRE AI Mentor** is your 24/7 personal tech companion:\n\n• Ask any technical question, request architecture explanations, or get line-by-line code debugging.\n• Practice simulated Technical & HR Mock Interviews with real-time scoring and personalized improvement tips.\n• Receive targeted career roadmaps, salary negotiation insights, and industry advice.";
      actionType = "chatbot";
      actionLabel = "🤖 Launch AI Mentor";
    } else if (
      lower.includes("resume") || 
      lower.includes("ats") || 
      lower.includes("cv") || 
      lower.includes("analyzer") || 
      lower.includes("builder")
    ) {
      reply = "📄 **VELFIRE Career Tools** includes two essential tools for landing interviews:\n\n• 📝 **ATS Resume Builder**: Create modern, ATS-friendly resumes with live preview, customizable templates, and instant 1-click PDF download.\n• 🔍 **ATS Resume Analyzer**: Upload or paste your CV to get an instant ATS compatibility score (0–100%), keyword optimization suggestions, and formatting critiques.";
      actionType = "workspace";
      actionLabel = "📄 Open Resume Builder & Tools";
    } else if (
      lower.includes("free") || 
      lower.includes("cost") || 
      lower.includes("price") || 
      lower.includes("pricing") || 
      lower.includes("fee") || 
      lower.includes("subscription") || 
      lower.includes("pay")
    ) {
      reply = "🎉 **VELFIRE is 100% Free!**\n\nYou do not need to pay anything to access our AI Roadmaps, Text & Recorded Courses, the ATS Resume Builder, the Job Portal, or the AI Mentor. Our mission is to make elite tech education and career placement accessible to all.";
      actionType = "workspace";
      actionLabel = "🚀 Start Learning Free";
    } else if (
      lower.includes("certificate") || 
      lower.includes("certification") || 
      lower.includes("degree")
    ) {
      reply = "🏆 **VELFIRE Certificates**:\n\nWhen you complete your chosen course modules, submit hands-on milestone projects, and pass the domain assessment, you can download a verified VELFIRE Certificate of Completion to highlight on your LinkedIn profile and resume!";
      actionType = "workspace";
      actionLabel = "📚 View Course Modules";
    } else if (
      lower.includes("dark mode") || 
      lower.includes("light mode") || 
      lower.includes("theme") || 
      lower.includes("color")
    ) {
      reply = "🎨 **Theme Customization**:\n\nVELFIRE features a bespoke **Emerald & Butter design system**. You can toggle between Dark Mode and Light Mode anytime by clicking the Theme Switch button at the top header or in Settings.";
      actionType = "settings";
      actionLabel = "⚙️ Open Settings";
    } else if (
      lower.includes("contact") || 
      lower.includes("email") || 
      lower.includes("support") || 
      lower.includes("phone") || 
      lower.includes("reach") || 
      lower.includes("location") || 
      lower.includes("address") ||
      lower.includes("chennai")
    ) {
      reply = "📞 **Contact the VELFIRE Team**:\n\n• 📧 **Email**: velfire07@gmail.com\n• 📍 **Headquarters**: Chennai, Tamil Nadu, India\n• ⏰ **Support Hours**: Mon – Sat • 9:00 AM – 7:00 PM IST\n• 💬 You can also switch to the **Contact & Website Info** tab in this modal to send a direct message!";
      actionType = "contact_tab";
      actionLabel = "📞 Go to Contact Tab";
    } else if (
      lower.includes("who created") || 
      lower.includes("who made") || 
      lower.includes("developer") || 
      lower.includes("author") || 
      lower.includes("founder") ||
      lower.includes("poova")
    ) {
      reply = "💡 **About VELFIRE (VELI-CHA)**:\n\nVELFIRE was crafted by an ambitious engineering team based in Chennai, Tamil Nadu, dedicated to bridging the gap between collegiate education and high-impact software careers with state-of-the-art AI tooling.";
      actionType = "about";
      actionLabel = "ℹ️ View About Platform";
    } else if (
      lower === "hi" || 
      lower === "hello" || 
      lower === "hey" || 
      lower.startsWith("hi ") || 
      lower.startsWith("hello ") || 
      lower.startsWith("hey ")
    ) {
      reply = `Hello! 👋 What would you like to know about VELFIRE today?\n\nYou can ask me anything about our **AI Roadmaps**, **Courses (Text/Recorded/Live)**, **Job Portal**, **ATS Resume Tools**, or **Support Contact**!`;
    }

    // 2. Return Instant Knowledge Match if Found
    if (reply) {
      setTimeout(() => {
        setIsHelpChatTyping(false);
        setHelpChatMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "bot",
            text: reply,
            time: "Just now",
            actionType,
            actionLabel
          }
        ]);
      }, 400);
      return;
    }

    // 3. Real-time Backend AI Call for deeper, open-ended or technical questions
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `[Context: You are the friendly, intelligent in-app assistant for the VELFIRE (VELI-CHA) career acceleration and learning platform. Answer clearly, warmly, and concisely in English. If relevant to VELFIRE features like Roadmaps, Courses, Job Portal, AI Mentor, or Resume Tools, highlight them.] Question: ${text}`,
          user_name: user?.name || "Learner"
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiReply = data.reply || "I am here to help you succeed on VELFIRE! Please let me know what domain or feature you want to explore.";
        setIsHelpChatTyping(false);
        setHelpChatMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "bot",
            text: aiReply,
            time: "Just now",
            actionType: "workspace",
            actionLabel: "🚀 Go to Learning Workspace"
          }
        ]);
        return;
      }
    } catch (err) {
      console.warn("Backend chat fetch skipped or offline:", err);
    }

    // 4. Clean Intelligent Fallback
    setIsHelpChatTyping(false);
    setHelpChatMessages(prev => [
      ...prev,
      {
        id: Date.now() + 1,
        sender: "bot",
        text: `Here is how VELFIRE can help with "${text}":\n\nYou can explore our **AI Roadmaps** for structured learning milestones, view **VELFIRE Courses** for text & recorded video lessons, or test your skills on the **Job Portal**. If you have a specific question, email our engineering team directly at **velfire07@gmail.com**!`,
        time: "Just now",
        actionType: "workspace",
        actionLabel: "🚀 Explore Learning Workspace"
      }
    ]);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSent(true);
  };

  const handleFaqAction = (actionType) => {
    if (actionType === "contact_tab") {
      setHelpCenterTab("contact");
      return;
    }
    setShowHelpModal(false);
    if (actionType === "workspace") {
      handleContinueClick();
    } else if (actionType === "chatbot") {
      if (onOpenChatbot) onOpenChatbot();
      else handleContinueClick();
    } else if (actionType === "settings") {
      setShowSettingsModal(true);
    } else if (actionType === "about") {
      setShowAboutModal(true);
    } else if (actionType === "email") {
      window.location.href = "mailto:velfire07@gmail.com";
    }
  };

  const handleContinueClick = () => {
    setHasStarted(true);
    localStorage.setItem("velfire_has_started", "true");
    if (onOpenDashboard) {
      onOpenDashboard();
    }
  };

  // Image Upload handler (HD Quality Base64)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setSaveError("Image file size should be less than 8MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Profile Save handler
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveError("");
    setSaveSuccess("");

    if (!profileName.trim()) {
      setSaveError("Please enter your name.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        user_id: user.id,
        name: profileName.trim(),
        status_role: profileStatus,
        phone_number: profilePhone.trim(),
        profile_image: profileImage,
      };

      let response;
      try {
        response = await fetch(`${API_BASE_URL}/api/profile/update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        response = await fetch("/api/profile/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to save profile.");
      }

      setSaveSuccess("Profile details saved successfully!");

      if (onUpdateUser) {
        onUpdateUser(data.user);
      }

      setTimeout(() => {
        setShowSettingsModal(false);
        setSaveSuccess("");
      }, 1200);

    } catch (err) {
      setSaveError(err.message || "Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name, email) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <div className={`home-layout ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      {/* Navigation Header */}
      <header className="home-header">
        <div className="header-left">
          <h1 className="brand-logo" onClick={handleHomeClick}>
            VELFIRE
          </h1>

          {/* Nav links */}
          <nav className="header-nav">
            <button
              type="button"
              className={`nav-btn ${activeTab === "home" && !showSettingsModal && !showAboutModal && !showHelpModal ? "active" : ""}`}
              onClick={handleHomeClick}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Home
            </button>

            <button
              type="button"
              className={`nav-btn ${showAboutModal ? "active" : ""}`}
              onClick={handleAboutClick}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              About
            </button>

            <button
              type="button"
              className={`nav-btn ${showHelpModal ? "active" : ""}`}
              onClick={handleHelpClick}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Help
            </button>
          </nav>
        </div>

        <div className="header-actions">
          {/* Notification Button */}
          <button
            type="button"
            className="action-btn notification-btn"
            onClick={handleNotificationsClick}
            title="Notifications"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="notification-badge">2</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="action-btn theme-toggle-btn"
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
                <span>Light</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
                <span>Dark</span>
              </>
            )}
          </button>

          {/* Settings Button */}
          <button
            type="button"
            className={`action-btn settings-button ${showSettingsModal ? "active" : ""}`}
            onClick={handleSettingsClick}
            title="Account Settings"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <span>Settings</span>
          </button>

          {/* Logout Button */}
          <button className="action-btn logout-button" onClick={onLogout} title="Log Out">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Home Area: 2-COLUMN HERO (AI Career Operating System + HD Profile Card) */}
      <main className="home-content">
        {!showSettingsModal && !showAboutModal && !showHelpModal && (
          <>
            <div className="home-grid">
              
              {/* LEFT SIDE: AI CAREER OPERATING SYSTEM CARD */}
              <div className="hero-left-panel">
                <div className="hero-tag">
                  <span className="live-dot"></span> AI CAREER OPERATING SYSTEM
                </div>

                <h2 className="hero-heading-animated">
                  {heroPhrases[phraseIndex].split(" ").map((word, wIdx) => (
                    <span 
                      key={`${phraseIndex}-${wIdx}`} 
                      className="word-reveal-span" 
                      style={{ animationDelay: `${wIdx * 0.12}s` }}
                    >
                      {word}{" "}
                    </span>
                  ))}
                  <span className="text-highlight-animated">with VELFIRE OS</span>
                </h2>

                <p className="hero-subtext">
                  VELFIRE is an advanced <strong>AI Career Operating System</strong> designed to streamline your learning roadmap, track skill milestones, and empower your professional growth toward tech excellence.
                </p>

                {/* Quick Feature Pills */}
                <div className="hero-feature-pills">
                  <span className="feature-pill">⚡ 24/7 AI Assistant</span>
                  <span className="feature-pill">🎓 Skill Certifications</span>
                  <span className="feature-pill">💼 Direct Job Placement</span>
                </div>

                {/* Get Started / Continue Action Button */}
                <div className="hero-action-box">
                  <button
                    type="button"
                    className="btn-get-started"
                    onClick={handleContinueClick}
                  >
                    {hasStarted ? "Continue Workspace →" : "Get Started Now →"}
                  </button>
                </div>
              </div>

              {/* RIGHT SIDE: PREMIUM HD PROFILE DISPLAY CARD */}
              <div className="right-profile-container">
                
                {/* Card Decorative Top Banner Header */}
                <div className="profile-banner-bg">
                  <div className="verified-chip">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    <span>VERIFIED MEMBER</span>
                  </div>
                </div>

                {/* HD Quality Photo */}
                <div className="profile-photo-wrapper">
                  {user?.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt={user?.name || "HD Profile Photo"}
                      className="hd-profile-photo"
                    />
                  ) : (
                    <div className="hd-profile-avatar">
                      {getInitials(user?.name, user?.email)}
                    </div>
                  )}
                </div>

                {/* Profile Name */}
                <h2 className="profile-name">
                  {user?.name || "User Name"}
                </h2>

                {/* Status Badge */}
                <div className="profile-status-badge">
                  <span className="status-indicator"></span>
                  {user?.status_role || user?.role || "Student"}
                </div>

                {/* Phone & Email Info */}
                <div className="profile-info-cards">
                  {user?.phone_number && (
                    <div className="profile-info-pill">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <span>{user.phone_number}</span>
                    </div>
                  )}

                  <div className="profile-info-pill">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span>{user?.email}</span>
                  </div>
                </div>

                {/* Quick Edit Profile Button */}
                <button
                  type="button"
                  className="btn-quick-edit-profile"
                  onClick={handleSettingsClick}
                >
                  ⚙️ Edit Account Profile
                </button>

              </div>

            </div>

            {/* TARGET AUDIENCE USE CASE CARDS SECTION (FOR STUDENTS, GRADUATES, EMPLOYEES) */}
            <div className="home-use-cases-section">
              {/* Horizontal Section Separator Line */}
              <div className="section-divider"></div>

              <div className="section-header">
                <span className="section-tag">TAILORED FOR EVERY CAREER STAGE</span>
                <h2 className="section-title">How VELFIRE Empowers You</h2>
                <p className="section-subtitle">
                  Discover how VELFIRE accelerates growth for Students, Recent Graduates, and Working Employees.
                </p>
              </div>

              <div className="use-cases-grid">
                
                {/* CARD 1: FOR STUDENTS */}
                <div className="use-case-card student-card">
                  <div className="card-badge badge-student">🎓 FOR STUDENTS</div>
                  <div className="card-icon-header icon-blue">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                    </svg>
                  </div>
                  <h3 className="card-heading">For Students</h3>
                  <p className="card-desc">
                    Tailored for college & university students to master coding fundamentals, solve doubts, and build portfolio projects.
                  </p>

                  <div className="benefits-list">
                    <div className="benefit-item">
                      <span className="benefit-icon">📚</span>
                      <div>
                        <strong>Guided Learning Roadmaps</strong>
                        <p>Step-by-step tracks for Web Dev, Python, C++, and AI basics.</p>
                      </div>
                    </div>

                    <div className="benefit-item">
                      <span className="benefit-icon">🤖</span>
                      <div>
                        <strong>24/7 AI Doubt Solver</strong>
                        <p>Get instant coding solutions & clear complex academic doubts.</p>
                      </div>
                    </div>

                    <div className="benefit-item">
                      <span className="benefit-icon">🏆</span>
                      <div>
                        <strong>Portfolio & Project Support</strong>
                        <p>Build real-world projects before graduation to stand out.</p>
                      </div>
                    </div>
                  </div>

                  <button className="card-action-btn btn-student" onClick={handleContinueClick}>
                    Start Student Journey →
                  </button>
                </div>

                {/* CARD 2: FOR GRADUATES */}
                <div className="use-case-card graduate-card">
                  <div className="card-badge badge-graduate">💼 FOR GRADUATES</div>
                  <div className="card-icon-header icon-purple">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                  </div>
                  <h3 className="card-heading">For Recent Graduates</h3>
                  <p className="card-desc">
                    Empowering job-seekers to optimize resumes, crack technical interviews, and land entry-level tech roles.
                  </p>

                  <div className="benefits-list">
                    <div className="benefit-item">
                      <span className="benefit-icon">📄</span>
                      <div>
                        <strong>AI Resume & ATS Optimization</strong>
                        <p>Craft ATS-friendly resumes tailored for recruiter screening.</p>
                      </div>
                    </div>

                    <div className="benefit-item">
                      <span className="benefit-icon">🎯</span>
                      <div>
                        <strong>Direct Job Placement Matching</strong>
                        <p>Explore live entry-level tech jobs & apply with 1-click matching.</p>
                      </div>
                    </div>

                    <div className="benefit-item">
                      <span className="benefit-icon">🎙️</span>
                      <div>
                        <strong>Mock Technical Interviews</strong>
                        <p>Practice live coding & interview prep with instant AI feedback.</p>
                      </div>
                    </div>
                  </div>

                  <button className="card-action-btn btn-graduate" onClick={handleContinueClick}>
                    Explore Graduate Jobs →
                  </button>
                </div>

                {/* CARD 3: FOR EMPLOYEES */}
                <div className="use-case-card employee-card">
                  <div className="card-badge badge-employee">🏢 FOR EMPLOYEES</div>
                  <div className="card-icon-header icon-green">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                  </div>
                  <h3 className="card-heading">For Working Professionals</h3>
                  <p className="card-desc">
                    Accelerating career promotion, skill upskilling, and seamless transition into high-paying AI & Lead roles.
                  </p>

                  <div className="benefits-list">
                    <div className="benefit-item">
                      <span className="benefit-icon">📈</span>
                      <div>
                        <strong>Advanced Skill Upskilling</strong>
                        <p>Master Full Stack, Generative AI, LLM pipelines, & DevOps.</p>
                      </div>
                    </div>

                    <div className="benefit-item">
                      <span className="benefit-icon">⚡</span>
                      <div>
                        <strong>Daily Work Productivity Boost</strong>
                        <p>Use AI Chatbot to write unit tests, refactor code, & solve bugs.</p>
                      </div>
                    </div>

                    <div className="benefit-item">
                      <span className="benefit-icon">🚀</span>
                      <div>
                        <strong>Career Switch & Promotion</strong>
                        <p>Fast-track switch to Senior Developer or AI Specialist roles.</p>
                      </div>
                    </div>
                  </div>

                  <button className="card-action-btn btn-employee" onClick={handleContinueClick}>
                    Accelerate Employee Career →
                  </button>
                </div>

              </div>
            </div>
          </>
        )}
      </main>

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <div className="modal-overlay" onClick={() => setShowNotificationsModal(false)}>
          <div className="modal-card notification-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>System Notifications</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowNotificationsModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="notifications-list">
                <div className="notification-item">
                  <span className="notification-icon">🚀</span>
                  <div className="notification-content">
                    <h5>Welcome to VELFIRE AI Career OS</h5>
                    <p>Your session is active and connected to SQLite database.</p>
                    <span className="notification-time">Just now</span>
                  </div>
                </div>

                <div className="notification-item">
                  <span className="notification-icon">🔒</span>
                  <div className="notification-content">
                    <h5>Profile Security Active</h5>
                    <p>Password hashing (bcrypt) and CORS protection verified.</p>
                    <span className="notification-time">Today</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-primary"
                onClick={() => setShowNotificationsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="modal-card modal-card-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Account Settings & Profile Creation</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowSettingsModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body modal-body-scroll">
              
              {saveSuccess && (
                <div className="alert alert-success">
                  <span>{saveSuccess}</span>
                </div>
              )}

              {saveError && (
                <div className="alert alert-error">
                  <span>{saveError}</span>
                </div>
              )}

              {/* Account Creation Form */}
              <form onSubmit={handleSaveProfile} className="profile-creation-form">
                
                {/* 1. HD Photo Adding Section */}
                <div className="form-group center-photo-picker">
                  <label>1. Profile Photo (HD Quality)</label>
                  <div className="photo-picker-wrapper">
                    {profileImage ? (
                      <img src={profileImage} alt="HD Preview" className="hd-photo-preview" />
                    ) : (
                      <div className="hd-photo-preview-placeholder">
                        {getInitials(profileName, user?.email)}
                      </div>
                    )}
                    <button
                      type="button"
                      className="btn-upload-photo"
                      onClick={() => fileInputRef.current.click()}
                    >
                      📷 Choose HD Photo
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                  </div>
                </div>

                {/* 2. Name Creating Section */}
                <div className="form-group">
                  <label htmlFor="profile-name">2. Full Name</label>
                  <input
                    id="profile-name"
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* 3. Status Section */}
                <div className="form-group">
                  <label htmlFor="profile-status">3. Status / Profession</label>
                  <select
                    id="profile-status"
                    value={profileStatus}
                    onChange={(e) => setProfileStatus(e.target.value)}
                  >
                    <option value="Student">Student</option>
                    <option value="Graduated">Graduated</option>
                    <option value="Employee">Employee</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* 4. Phone Number Section */}
                <div className="form-group">
                  <label htmlFor="profile-phone">4. Phone Number</label>
                  <input
                    id="profile-phone"
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="form-group email-readonly">
                  <label>Email Address (Account ID)</label>
                  <input type="text" value={user?.email || ""} disabled />
                </div>

                <div className="modal-footer-inside">
                  <button
                    type="submit"
                    className="btn-primary btn-save-profile"
                    disabled={saving}
                  >
                    {saving ? "Saving Profile..." : "💾 Save Account Profile"}
                  </button>
                </div>

              </form>

            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAboutModal && (
        <div className="modal-overlay" onClick={() => setShowAboutModal(false)}>
          <div className="modal-card about-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header about-modal-header">
              <div className="about-header-branding">
                <div className="about-brand-icon">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <div>
                  <h3 className="about-title">About VELFIRE OS</h3>
                  <p className="about-header-subtitle">AI Career Operating System & Skill Mastery Platform</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAboutModal(false)}
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className="modal-body modal-body-scroll about-modal-body">
              {/* Hero Banner */}
              <div className="about-hero-banner">
                <div className="about-hero-badge">
                  <span className="live-dot"></span> NEXT-GEN TECH EDUCATION & CAREER ACCELERATION
                </div>
                <h4 className="about-hero-title">Empowering Builders. Accelerating Careers.</h4>
                <p className="about-hero-desc">
                  <strong>VELFIRE</strong> is an all-in-one AI Career Operating System engineered to bridge the gap between classroom theory and real-world software engineering. Whether you are a student building your foundation, a graduate aiming for high-impact tech roles, or a developer upskilling, VELFIRE delivers intelligent roadmaps, hands-on coding practice, and career acceleration tools.
                </p>
              </div>

              {/* Stats Highlights Grid */}
              <div className="about-stats-grid">
                <div className="about-stat-card">
                  <span className="about-stat-number">5+</span>
                  <span className="about-stat-label">Engineering Domains</span>
                </div>
                <div className="about-stat-card">
                  <span className="about-stat-number">50+</span>
                  <span className="about-stat-label">Curriculum Modules</span>
                </div>
                <div className="about-stat-card">
                  <span className="about-stat-number">24/7</span>
                  <span className="about-stat-label">AI Career Mentor</span>
                </div>
                <div className="about-stat-card">
                  <span className="about-stat-number">100%</span>
                  <span className="about-stat-label">ATS-Ready Resumes</span>
                </div>
              </div>

              {/* Core Pillars / Features Section */}
              <div className="about-section-heading">
                <h5>What Drives VELFIRE</h5>
                <p>Engineered with everything you need to break into tech and thrive.</p>
              </div>

              <div className="about-pillars-grid">
                <div className="about-pillar-card">
                  <div className="pillar-icon-box pillar-ai">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                      <circle cx="12" cy="5" r="2"></circle>
                      <path d="M12 7v4"></path>
                      <line x1="8" y1="16" x2="8" y2="16"></line>
                      <line x1="16" y1="16" x2="16" y2="16"></line>
                    </svg>
                  </div>
                  <div className="pillar-content">
                    <h6>AI Career Mentor & Copilot</h6>
                    <p>Instant answers to technical doubts, personalized study roadmaps, real-time code reviews, and mock interview practice.</p>
                  </div>
                </div>

                <div className="about-pillar-card">
                  <div className="pillar-icon-box pillar-curriculum">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                  </div>
                  <div className="pillar-content">
                    <h6>Production-Grade Curricula</h6>
                    <p>Full-Stack Web Dev, Artificial Intelligence & ML, Data Analytics, Cloud & DevOps, and Cybersecurity structured into actionable modules.</p>
                  </div>
                </div>

                <div className="about-pillar-card">
                  <div className="pillar-icon-box pillar-code">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="16 18 22 12 16 6"></polyline>
                      <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                  </div>
                  <div className="pillar-content">
                    <h6>Interactive Practice & Labs</h6>
                    <p>Active code examples, practical coding exercises, knowledge verification quizzes, and architectural case studies.</p>
                  </div>
                </div>

                <div className="about-pillar-card">
                  <div className="pillar-icon-box pillar-resume">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <div className="pillar-content">
                    <h6>Dynamic ATS Resume Engine</h6>
                    <p>Generate clean, recruiter-compliant ATS resumes tuned specifically to your chosen engineering domain and demonstrated skills.</p>
                  </div>
                </div>

                <div className="about-pillar-card">
                  <div className="pillar-icon-box pillar-jobs">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                  </div>
                  <div className="pillar-content">
                    <h6>Placement & Internship Board</h6>
                    <p>Direct match opportunities with leading tech firms and startups, skill match scoring, and interview preparedness checklists.</p>
                  </div>
                </div>

                <div className="about-pillar-card">
                  <div className="pillar-icon-box pillar-badges">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="7"></circle>
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                    </svg>
                  </div>
                  <div className="pillar-content">
                    <h6>Milestones & Certifications</h6>
                    <p>Earn verified skill badges, showcase portfolio milestones, and validate your capabilities to employers and clients.</p>
                  </div>
                </div>
              </div>

              {/* Technology Stack Badges */}
              <div className="about-tech-stack-box">
                <div className="about-tech-header">
                  <h6>Architecture & Technology Stack</h6>
                  <span className="about-version-tag">Release v2.4.0</span>
                </div>
                <div className="about-tech-tags">
                  <span className="tech-tag">React 18</span>
                  <span className="tech-tag">FastAPI (Python)</span>
                  <span className="tech-tag">SQLAlchemy ORM</span>
                  <span className="tech-tag">SQLite / PostgreSQL</span>
                  <span className="tech-tag">AI Prompt Engine</span>
                  <span className="tech-tag">Bcrypt Security</span>
                  <span className="tech-tag">Glassmorphic CSS3</span>
                  <span className="tech-tag">Responsive Desktop & Mobile</span>
                </div>
              </div>

              {/* Origin & Location Card */}
              <div className="about-origin-box">
                <div className="about-origin-left">
                  <div className="origin-icon">📍</div>
                  <div>
                    <h6>Built with Passion in Chennai, Tamil Nadu</h6>
                    <p>Designed to nurture high-caliber software engineering talent across Tamil Nadu and globally.</p>
                  </div>
                </div>
                <div className="about-origin-contact">
                  <a href="mailto:velfire07@gmail.com" className="about-contact-chip">
                    ✉️ velfire07@gmail.com
                  </a>
                  <span className="about-status-chip">🟢 Status: Operational</span>
                </div>
              </div>
            </div>

            <div className="modal-footer about-modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowAboutModal(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn-primary btn-launch-workspace"
                onClick={() => {
                  setShowAboutModal(false);
                  handleContinueClick();
                }}
              >
                Launch Learning Workspace →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help & Support Center Modal */}
      {showHelpModal && (
        <div className="modal-overlay" onClick={() => setShowHelpModal(false)}>
          <div className="modal-card help-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="modal-header help-modal-header">
              <div className="help-header-branding">
                <div className="help-header-icon-box">
                  <span>🤝</span>
                </div>
                <div>
                  <div className="help-header-title-row">
                    <h3>VELFIRE Help & Support</h3>
                    <span className="help-status-badge">🟢 Helper Online 24/7</span>
                  </div>
                  <p className="help-header-subtitle">
                    What help do you need? I am here to help you every step of the way!
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn help-modal-close"
                onClick={() => setShowHelpModal(false)}
                aria-label="Close Help Modal"
              >
                ✕
              </button>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="help-mode-tabs-bar">
              <button
                type="button"
                className={`help-mode-tab ${helpCenterTab === 'chat' ? 'active' : ''}`}
                onClick={() => setHelpCenterTab('chat')}
              >
                💬 Helping Chatbot
              </button>
              <button
                type="button"
                className={`help-mode-tab ${helpCenterTab === 'contact' ? 'active' : ''}`}
                onClick={() => setHelpCenterTab('contact')}
              >
                📞 Contact & Website Info
              </button>
              <button
                type="button"
                className={`help-mode-tab ${helpCenterTab === 'faq' ? 'active' : ''}`}
                onClick={() => setHelpCenterTab('faq')}
              >
                ❓ Quick Help Topics
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body help-modal-body">
              {/* TAB 1: HELPING CHATBOT ("KUTTY HELPER") */}
              {helpCenterTab === 'chat' && (
                <div className="help-chat-view-container">
                  <div className="help-chat-header-hint">
                    <span>💡 What help do you need? Ask anything or click a quick topic:</span>
                  </div>

                  {/* Suggestion Chips for Real-Time App Answers */}
                  <div className="help-quick-chips">
                    <button type="button" className="help-chip-btn" onClick={() => handleSendHelpChat("What is VELFIRE?")}>
                      ✨ What is VELFIRE?
                    </button>
                    <button type="button" className="help-chip-btn" onClick={() => handleSendHelpChat("How do I generate an AI roadmap?")}>
                      🗺️ AI Roadmaps
                    </button>
                    <button type="button" className="help-chip-btn" onClick={() => handleSendHelpChat("Tell me about VELFIRE Courses (Text, Recorded, Live)")}>
                      📚 Courses & Formats
                    </button>
                    <button type="button" className="help-chip-btn" onClick={() => handleSendHelpChat("How do I apply for jobs in VELFIRE Jobs?")}>
                      💼 VELFIRE Jobs
                    </button>
                    <button type="button" className="help-chip-btn" onClick={() => handleSendHelpChat("How can the AI Mentor help me?")}>
                      🤖 AI Mentor
                    </button>
                    <button type="button" className="help-chip-btn" onClick={() => handleSendHelpChat("How do I use the ATS Resume Builder and Analyzer?")}>
                      📄 Resume Tools
                    </button>
                    <button type="button" className="help-chip-btn" onClick={() => handleSendHelpChat("Is VELFIRE free to use?")}>
                      💰 Is it Free?
                    </button>
                    <button type="button" className="help-chip-btn" onClick={() => handleSendHelpChat("How can I contact the VELFIRE team?")}>
                      ✉️ Contact Team
                    </button>
                  </div>

                  {/* Chat Messages Stream */}
                  <div className="help-chat-messages-stream">
                    {helpChatMessages.map((msg) => (
                      <div key={msg.id} className={`help-msg-row ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                        {msg.sender === 'bot' ? (
                          <div className="help-bot-avatar" title="VELFIRE AI Helper">🤖</div>
                        ) : (
                          <div className="help-user-avatar" title="You">🧑‍💻</div>
                        )}
                        <div className={`help-msg-bubble ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                          <div className="help-msg-bubble-header">
                            <span className="help-msg-sender-name">
                              {msg.sender === 'bot' ? 'VELFIRE Assistant' : (user?.name || 'You')}
                            </span>
                            <span className="help-msg-time">{msg.time}</span>
                          </div>
                          <div className="help-msg-content">
                            {renderFormattedHelpText(msg.text)}
                          </div>
                          {msg.actionLabel && (
                            <button
                              type="button"
                              className="btn-help-chat-action"
                              onClick={() => handleFaqAction(msg.actionType)}
                            >
                              <span>{msg.actionLabel}</span>
                              <span className="action-arrow">→</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Live Real-Time Typing Indicator */}
                    {isHelpChatTyping && (
                      <div className="help-msg-row bot typing-row">
                        <div className="help-bot-avatar">🤖</div>
                        <div className="help-msg-bubble bot typing-bubble">
                          <div className="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                          <span className="typing-label">VELFIRE Assistant is thinking...</span>
                        </div>
                      </div>
                    )}
                    <div ref={helpChatEndRef} />
                  </div>

                  {/* Chat Input Bar */}
                  <form 
                    className="help-chat-input-bar"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendHelpChat();
                    }}
                  >
                    <div className="help-input-wrapper">
                      <span className="help-input-icon">💬</span>
                      <input
                        type="text"
                        className="help-chat-text-input"
                        placeholder="Ask anything about VELFIRE (e.g. roadmaps, jobs, courses, resume, free?)..."
                        value={helpChatInput}
                        onChange={(e) => setHelpChatInput(e.target.value)}
                        disabled={isHelpChatTyping}
                      />
                      <button 
                        type="submit" 
                        className="btn-send-help-chat"
                        disabled={isHelpChatTyping || !helpChatInput.trim()}
                        title="Send message"
                      >
                        {isHelpChatTyping ? (
                          <span className="btn-thinking-spin">⏳</span>
                        ) : (
                          <>
                            <span>Send</span>
                            <span className="btn-send-icon">➤</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                  <div className="help-chat-footer-note">
                    ⚡ Instant answers powered by VELFIRE Knowledge & Real-Time Intelligence
                  </div>
                </div>
              )}

              {/* TAB 2: WEBSITE CONTACT & PLATFORM INFO */}
              {helpCenterTab === 'contact' && (
                <div className="help-contact-view-container">
                  {/* Website & Organization Hero Card */}
                  <div className="website-info-hero-banner">
                    <div className="website-info-brand">
                      <div className="brand-logo-gem">🔥</div>
                      <div className="brand-meta-info">
                        <div className="brand-title-badge-row">
                          <h4>VELFIRE • VELI-CHA</h4>
                          <span className="platform-verified-badge">✓ Official Platform</span>
                          <span className="platform-release-badge">v2.4 Active</span>
                        </div>
                        <p className="brand-description">
                          Next-Generation AI Career Acceleration, Interactive Roadmaps & Engineering Placement Ecosystem.
                        </p>
                      </div>
                    </div>

                    <div className="website-meta-badges-grid">
                      <div className="meta-badge-item">
                        <span className="meta-badge-icon">🌐</span>
                        <div className="meta-badge-text">
                          <span className="meta-badge-title">Official Portal</span>
                          <span className="meta-badge-val">velfire.app</span>
                        </div>
                      </div>
                      <div className="meta-badge-item">
                        <span className="meta-badge-icon">⚡</span>
                        <div className="meta-badge-text">
                          <span className="meta-badge-title">System Status</span>
                          <span className="meta-badge-val status-green">● 99.9% Operational</span>
                        </div>
                      </div>
                      <div className="meta-badge-item">
                        <span className="meta-badge-icon">🛡️</span>
                        <div className="meta-badge-text">
                          <span className="meta-badge-title">Security</span>
                          <span className="meta-badge-val">TLS 1.3 / SSL Verified</span>
                        </div>
                      </div>
                      <div className="meta-badge-item">
                        <span className="meta-badge-icon">📍</span>
                        <div className="meta-badge-text">
                          <span className="meta-badge-title">Engineering Base</span>
                          <span className="meta-badge-val">Chennai, India</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3 Interactive Contact Cards */}
                  <div className="contact-info-cards-grid">
                    <div className="contact-card">
                      <div className="contact-card-icon">📧</div>
                      <div className="contact-card-content">
                        <h5>Official Email Support</h5>
                        <p>Direct learner queries, tech escalations & placement support</p>
                        <div className="contact-action-group">
                          <a href="mailto:velfire07@gmail.com" className="contact-highlight-link">
                            velfire07@gmail.com ↗
                          </a>
                          <button 
                            type="button" 
                            className="btn-copy-email"
                            onClick={handleCopyEmail}
                            title="Copy email to clipboard"
                          >
                            {copiedEmail ? "✓ Copied!" : "📋 Copy"}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="contact-card">
                      <div className="contact-card-icon">📍</div>
                      <div className="contact-card-content">
                        <h5>Engineering Headquarters</h5>
                        <p>Technology & Innovation Campus</p>
                        <span className="contact-highlight-text">Chennai, Tamil Nadu, India</span>
                        <span className="contact-meta-pill">🌏 Global Timezone: IST (UTC +5:30)</span>
                      </div>
                    </div>

                    <div className="contact-card">
                      <div className="contact-card-icon">⏰</div>
                      <div className="contact-card-content">
                        <h5>Live Mentorship & Help Desk</h5>
                        <p>Dedicated developer & mentor availability</p>
                        <span className="contact-highlight-text">Mon – Sat • 9:00 AM – 7:00 PM IST</span>
                        <span className="contact-live-pill">🟢 Live Support Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Direct Support Message Form */}
                  <div className="help-direct-form-card">
                    <div className="form-header-group">
                      <div className="form-header-title-row">
                        <h5>✉️ Send a Direct Message to the VELFIRE Team</h5>
                        <span className="form-sla-badge">⏱️ Avg reply: under 24 hours</span>
                      </div>
                      <p>Have questions, feedback, or need mentorship advice? Write to our team and we'll reply directly to your inbox.</p>
                    </div>

                    {contactSent ? (
                      <div className="contact-success-banner">
                        <div className="success-banner-content">
                          <span className="success-icon">🎉</span>
                          <div>
                            <strong>Message Received Successfully!</strong>
                            <p>Thank you <strong>{contactForm.name || "Learner"}</strong>. Our engineering and mentor team will follow up at <strong>{contactForm.email || "your email"}</strong> regarding your inquiry.</p>
                          </div>
                        </div>
                        <button type="button" className="btn-send-another" onClick={() => setContactSent(false)}>
                          Send Another Message
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="contact-fields-grid">
                        <div className="contact-input-group">
                          <label>Your Name *</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. Poovarasan"
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          />
                        </div>

                        <div className="contact-input-group">
                          <label>Your Email Address *</label>
                          <input 
                            type="email" 
                            required 
                            placeholder="e.g. user@example.com"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          />
                        </div>

                        <div className="contact-input-group full-width">
                          <label>Inquiry Topic / Category *</label>
                          <select
                            className="contact-topic-select"
                            value={contactForm.topic}
                            onChange={(e) => setContactForm({ ...contactForm, topic: e.target.value })}
                          >
                            <option value="General Platform Inquiry">🌐 General Platform Inquiry</option>
                            <option value="Open VELFIRE Roadmaps Support">🗺️ Open VELFIRE Roadmaps Support</option>
                            <option value="Course Content (Text, Recorded, Live)">📚 Course Content (Text, Recorded, Live)</option>
                            <option value="VELFIRE Jobs & Placement Assistance">💼 VELFIRE Jobs & Placement Assistance</option>
                            <option value="ATS Resume Tools & Feedback">📄 ATS Resume Tools & Feedback</option>
                            <option value="Technical Bug or Account Issue">🐞 Technical Bug or Account Issue</option>
                          </select>
                        </div>

                        <div className="contact-input-group full-width">
                          <label>How can we help you? *</label>
                          <textarea 
                            rows={3} 
                            required 
                            placeholder="Describe your questions, feedback, or the specific career guidance you need..."
                            value={contactForm.message}
                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          />
                        </div>

                        <div className="contact-form-actions full-width">
                          <button type="submit" className="btn-submit-contact">
                            <span>Send Priority Message</span>
                            <span className="btn-send-icon">🚀</span>
                          </button>
                          <span className="form-guarantee-note">🔒 Your data is protected by VELFIRE Privacy Policy</span>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: QUICK ESSENTIAL TOPICS */}
              {helpCenterTab === 'faq' && (
                <div className="help-faqs-accordion">
                  {helpFaqs.map((faq) => {
                    const isExpanded = expandedFaqId === faq.id;
                    return (
                      <div key={faq.id} className={`help-faq-card ${isExpanded ? "expanded" : ""}`}>
                        <div 
                          className="help-faq-header"
                          onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                        >
                          <div className="help-faq-title-area">
                            <span className="help-faq-icon">{faq.icon}</span>
                            <div className="help-faq-title-group">
                              <span className="help-faq-badge">{faq.badge}</span>
                              <h4 className="help-faq-question">{faq.question}</h4>
                            </div>
                          </div>
                          <span className={`help-faq-chevron ${isExpanded ? "rotated" : ""}`}>
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </span>
                        </div>

                        {isExpanded && (
                          <div className="help-faq-content">
                            <p className="help-faq-answer">{faq.answer}</p>
                            {faq.actionLabel && (
                              <div className="help-faq-action-row">
                                <button
                                  type="button"
                                  className="btn-faq-action"
                                  onClick={() => handleFaqAction(faq.actionType)}
                                >
                                  <span>{faq.actionLabel}</span>
                                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                  </svg>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer help-modal-footer">
              <div className="help-footer-contact-info">
                <span className="contact-bullet">📍</span>
                <span>Chennai, India • Direct Email: <strong>velfire07@gmail.com</strong></span>
              </div>
              <div className="help-footer-actions">
                <button
                  type="button"
                  className="btn-secondary help-btn-close"
                  onClick={() => setShowHelpModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn-primary help-btn-ai-mentor"
                  onClick={() => handleFaqAction("chatbot")}
                >
                  <span>🤖 Full AI Mentor</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Component */}
      <Footer onAboutClick={handleAboutClick} />
    </div>
  );
}

export default Home;
