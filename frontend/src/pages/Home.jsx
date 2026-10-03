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
  const [helpSearchQuery, setHelpSearchQuery] = useState("");
  const [helpActiveCategory, setHelpActiveCategory] = useState("all");
  const [expandedFaqId, setExpandedFaqId] = useState(1);
  
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

  // Help Center FAQs Data
  const helpFaqs = [
    {
      id: 1,
      category: "roadmap",
      question: "How do I generate and customize an AI Career Roadmap?",
      icon: "🗺️",
      badge: "AI Pathway",
      answer: "Click 'Launch Learning Workspace' or 'Start Learning' on the Home Page, select any of our 10 technology domains (e.g., Full Stack Development, Data Analyst, Cloud Engineering), select your mastery timeframe (3 Months, 6 Months), and click Generate. You will receive a structured, week-by-week curriculum with actionable projects and milestones.",
      actionLabel: "Open Learning Workspace",
      actionType: "workspace",
      tips: [
        "Personalized to your target skill level",
        "Structured week-by-week roadmap milestones",
        "Direct export & study scheduling"
      ]
    },
    {
      id: 2,
      category: "mentor",
      question: "How does the WILDFIRE AI Mentor assist my learning?",
      icon: "🤖",
      badge: "24/7 AI Assistance",
      answer: "The AI Mentor is connected directly to our FastAPI LLM engine. You can ask for code reviews, explain complex algorithmic concepts, debug errors, conduct mock interviews, or get career advice anytime.",
      actionLabel: "Launch AI Chatbot",
      actionType: "chatbot",
      tips: [
        "Available 24/7 with instant contextual responses",
        "Provides syntax debugging & architectural guidance",
        "Explains complex technical concepts step-by-step"
      ]
    },
    {
      id: 3,
      category: "profile",
      question: "How do I update my profile photo, name, and contact details?",
      icon: "👤",
      badge: "Account & Profile",
      answer: "Click the 'Settings' icon in the top header. You can upload any JPEG/PNG avatar, edit your display name, title (Student, Developer, Engineer), and contact number. Once saved, your profile card renders on the right dashboard widget in HD quality.",
      actionLabel: "Open Profile Settings",
      actionType: "settings",
      tips: [
        "High-definition avatar photo upload",
        "Instant synchronization across workspace",
        "Encrypted securely in SQLite/PostgreSQL"
      ]
    },
    {
      id: 4,
      category: "careers",
      question: "How do I unlock and apply through the WILDFIRE Job Portal?",
      icon: "💼",
      badge: "Job Placements",
      answer: "The Job Portal connects verified learners with tech companies. To access the portal, progress through your domain roadmap and achieve an 80%+ score on the automated Mock Interview Gatekeeper.",
      actionLabel: "View Roadmap",
      actionType: "workspace",
      tips: [
        "Direct application links & hiring pipelines",
        "Salary benchmarks and role requirements",
        "Verified badges to highlight your profile"
      ]
    },
    {
      id: 5,
      category: "system",
      question: "How do Dark Mode and Theme preferences work?",
      icon: "🌓",
      badge: "UI & Preferences",
      answer: "Click the Light/Dark toggle button in the top navigation header. Your preference is automatically stored in your browser's local cache and restored seamlessly every time you visit VELFIRE.",
      actionLabel: null,
      tips: [
        "Smooth glassmorphic visual transition",
        "Preserved in browser local cache",
        "Optimized for OLED & low eye-strain"
      ]
    },
    {
      id: 6,
      category: "support",
      question: "How can I contact the engineering & support team?",
      icon: "✉️",
      badge: "Developer Support",
      answer: "Our core development team is based in Chennai, Tamil Nadu. Reach us anytime at velfire07@gmail.com for technical inquiries, bug reports, partnership requests, or feedback.",
      actionLabel: "Email Support",
      actionType: "email",
      tips: [
        "Chennai engineering headquarters",
        "Response within 24 business hours",
        "Direct developer escalation channel"
      ]
    }
  ];

  const filteredFaqs = helpFaqs.filter((faq) => {
    const matchesCategory = helpActiveCategory === "all" || faq.category === helpActiveCategory;
    const query = helpSearchQuery.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.badge.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleFaqAction = (actionType) => {
    setShowHelpModal(false);
    if (actionType === "workspace") {
      handleContinueClick();
    } else if (actionType === "chatbot") {
      if (onOpenChatbot) onOpenChatbot();
      else handleContinueClick();
    } else if (actionType === "settings") {
      setShowSettingsModal(true);
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
                  <span>❓</span>
                </div>
                <div>
                  <div className="help-header-title-row">
                    <h3>Help & Support Center</h3>
                    <span className="help-status-badge">🟢 Systems Online</span>
                  </div>
                  <p className="help-header-subtitle">
                    Fast answers, platform guides & direct engineering assistance for VELFIRE
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

            {/* Quick Action Top Ribbon */}
            <div className="help-quick-actions-bar">
              <div 
                className="help-quick-action-card" 
                onClick={() => handleFaqAction("chatbot")}
              >
                <div className="quick-action-icon">🤖</div>
                <div className="quick-action-info">
                  <h5>AI Mentor Chatbot</h5>
                  <p>Ask coding & career questions 24/7</p>
                </div>
                <span className="quick-action-arrow">→</span>
              </div>

              <div 
                className="help-quick-action-card" 
                onClick={() => handleFaqAction("workspace")}
              >
                <div className="quick-action-icon">🗺️</div>
                <div className="quick-action-info">
                  <h5>AI Career Roadmap</h5>
                  <p>Generate week-by-week curriculum</p>
                </div>
                <span className="quick-action-arrow">→</span>
              </div>

              <div 
                className="help-quick-action-card" 
                onClick={() => handleFaqAction("email")}
              >
                <div className="quick-action-icon">✉️</div>
                <div className="quick-action-info">
                  <h5>Chennai Engineering Team</h5>
                  <p>velfire07@gmail.com</p>
                </div>
                <span className="quick-action-arrow">→</span>
              </div>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="help-search-filter-section">
              <div className="help-search-wrapper">
                <svg className="help-search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  className="help-search-input"
                  placeholder="Search help topics (e.g. roadmap, profile, mentor, jobs, themes)..."
                  value={helpSearchQuery}
                  onChange={(e) => setHelpSearchQuery(e.target.value)}
                />
                {helpSearchQuery && (
                  <button 
                    type="button"
                    className="help-search-clear-btn" 
                    onClick={() => setHelpSearchQuery("")}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="help-category-pills">
                <button
                  type="button"
                  className={`help-cat-pill ${helpActiveCategory === "all" ? "active" : ""}`}
                  onClick={() => setHelpActiveCategory("all")}
                >
                  🌟 All Topics ({helpFaqs.length})
                </button>
                <button
                  type="button"
                  className={`help-cat-pill ${helpActiveCategory === "roadmap" ? "active" : ""}`}
                  onClick={() => setHelpActiveCategory("roadmap")}
                >
                  🗺️ AI Roadmap
                </button>
                <button
                  type="button"
                  className={`help-cat-pill ${helpActiveCategory === "mentor" ? "active" : ""}`}
                  onClick={() => setHelpActiveCategory("mentor")}
                >
                  🤖 AI Mentor
                </button>
                <button
                  type="button"
                  className={`help-cat-pill ${helpActiveCategory === "profile" ? "active" : ""}`}
                  onClick={() => setHelpActiveCategory("profile")}
                >
                  👤 Profile & Setup
                </button>
                <button
                  type="button"
                  className={`help-cat-pill ${helpActiveCategory === "careers" ? "active" : ""}`}
                  onClick={() => setHelpActiveCategory("careers")}
                >
                  💼 Job Portal
                </button>
                <button
                  type="button"
                  className={`help-cat-pill ${helpActiveCategory === "system" ? "active" : ""}`}
                  onClick={() => setHelpActiveCategory("system")}
                >
                  🌓 Themes
                </button>
                <button
                  type="button"
                  className={`help-cat-pill ${helpActiveCategory === "support" ? "active" : ""}`}
                  onClick={() => setHelpActiveCategory("support")}
                >
                  ✉️ Support
                </button>
              </div>
            </div>

            {/* Scrollable FAQ Accordion Body */}
            <div className="modal-body help-modal-body">
              {filteredFaqs.length > 0 ? (
                <div className="help-faqs-accordion">
                  {filteredFaqs.map((faq) => {
                    const isExpanded = expandedFaqId === faq.id;
                    return (
                      <div 
                        key={faq.id} 
                        className={`help-faq-card ${isExpanded ? "expanded" : ""}`}
                      >
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
                            
                            {faq.tips && (
                              <div className="help-faq-tips">
                                <span className="help-tips-title">Key Highlights:</span>
                                <ul>
                                  {faq.tips.map((tip, idx) => (
                                    <li key={idx}>{tip}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

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
              ) : (
                <div className="help-empty-results">
                  <div className="empty-search-icon">🔍</div>
                  <h4>No matching help topics found</h4>
                  <p>We couldn't find anything matching "<strong>{helpSearchQuery}</strong>". Try another keyword or connect with our AI Mentor.</p>
                  <div className="empty-actions">
                    <button 
                      type="button"
                      className="btn-clear-search" 
                      onClick={() => { setHelpSearchQuery(""); setHelpActiveCategory("all"); }}
                    >
                      Clear Search & View All
                    </button>
                    <button 
                      type="button"
                      className="btn-ask-mentor-empty" 
                      onClick={() => handleFaqAction("chatbot")}
                    >
                      🤖 Ask AI Mentor Directly
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer help-modal-footer">
              <div className="help-footer-contact-info">
                <span className="contact-bullet">📍</span>
                <span>Chennai, Tamil Nadu • Direct Support: <strong>velfire07@gmail.com</strong></span>
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
                  <span>🤖 Ask AI Mentor</span>
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
