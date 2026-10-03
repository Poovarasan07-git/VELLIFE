import { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer";
import "./Home.css";

const API_BASE_URL = "http://127.0.0.1:8000";

function Home({ user, onLogout, onUpdateUser, onOpenDashboard }) {
  const [activeTab, setActiveTab] = useState("home");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  
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
                  <span className="feature-pill">🚀 100+ Real-World Labs</span>
                </div>

                {/* Live Metrics Ribbon */}
                <div className="hero-metrics-ribbon">
                  <div className="metric-item">
                    <span className="metric-val">98.4%</span>
                    <span className="metric-lbl">Placement Rate</span>
                  </div>
                  <div className="metric-sep"></div>
                  <div className="metric-item">
                    <span className="metric-val">120+</span>
                    <span className="metric-lbl">Interactive Labs</span>
                  </div>
                  <div className="metric-sep"></div>
                  <div className="metric-item">
                    <span className="metric-val">24/7</span>
                    <span className="metric-lbl">AI Mentor Support</span>
                  </div>
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
                  <button
                    type="button"
                    className="btn-hero-secondary"
                    onClick={handleContinueClick}
                  >
                    Launch AI Dashboard ⚡
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
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>About VELFIRE</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowAboutModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p className="about-text">
                <strong>VELFIRE</strong> is a modern web application featuring secure user authentication, persistent SQL database storage, and a responsive frontend experience.
              </p>
              <div className="about-meta">
                <span>Version: 1.0.0</span>
                <span>Framework: React + FastAPI</span>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-primary"
                onClick={() => setShowAboutModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="modal-overlay" onClick={() => setShowHelpModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Help & Support</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowHelpModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="help-item">
                <h4>🔑 How to edit account details?</h4>
                <p>Click <strong>Settings</strong> in top header to upload your photo, change your name, status, and phone number.</p>
              </div>

              <div className="help-item">
                <h4>🖼️ Where does my profile appear?</h4>
                <p>Saved details automatically appear on the <strong>Right Side of the Home Page</strong> in crystal clear HD quality!</p>
              </div>

              <div className="help-item">
                <h4>🌙 Theme Switcher</h4>
                <p>Click the <strong>Light / Dark</strong> button in top header to toggle theme.</p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-primary"
                onClick={() => setShowHelpModal(false)}
              >
                Got It
              </button>
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
