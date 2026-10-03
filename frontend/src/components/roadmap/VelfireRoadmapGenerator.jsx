import { useState, useEffect } from "react";
import "./VelfireRoadmapGenerator.css";

const API_BASE_URL = "http://127.0.0.1:8000";

const QUICK_SUGGESTIONS = [
  { label: "🌐 Full Stack Web", query: "Full Stack Web Development" },
  { label: "📊 Data Analyst", query: "Data Analyst" },
  { label: "🤖 AI/ML & LLM", query: "AI/ML Engineering" },
  { label: "☁️ DevOps & Cloud", query: "DevOps & Cloud Engineering" },
  { label: "🛡️ Cybersecurity", query: "Cybersecurity & Ethical Hacking" },
  { label: "📱 Flutter Mobile", query: "Flutter Mobile App Development" },
  { label: "⚙️ Python Backend", query: "Python Backend & FastAPI" },
  { label: "🎨 UI/UX Design", query: "UI/UX Product Design" },
  { label: "⚡ Web3 & Solidity", query: "Blockchain & Web3 Engineering" },
  { label: "📈 Business Analyst", query: "Business Analyst" },
];

export default function VelfireRoadmapGenerator({ initialCourse = "Full Stack Development", onSwitchToCourse }) {
  const [courseInput, setCourseInput] = useState(initialCourse);
  const [skillLevel, setSkillLevel] = useState("Intermediate");
  const [duration, setDuration] = useState("3 Months Mastery");
  const [goal, setGoal] = useState("Job Placement & Mastery");

  const [loading, setLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  // Persistent topic completion state (e.g. "Phase1_Topic0": true)
  const [checkedTopics, setCheckedTopics] = useState(() => {
    try {
      const saved = localStorage.getItem("velfire_roadmap_progress");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Saved roadmaps collection in localStorage
  const [savedRoadmaps, setSavedRoadmaps] = useState(() => {
    try {
      const saved = localStorage.getItem("velfire_saved_roadmaps");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Show a momentary toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 2800);
  };

  // Generate Roadmap function
  const handleGenerateRoadmap = async (courseToGenerate = courseInput) => {
    const cleanCourse = courseToGenerate.trim();
    if (!cleanCourse) {
      showToast("Please enter a course or skill to generate a roadmap.");
      return;
    }

    setLoading(true);

    try {
      let response;
      const payload = {
        course: cleanCourse,
        level: skillLevel,
        duration: duration,
        goal: goal,
      };

      try {
        response = await fetch(`${API_BASE_URL}/api/roadmap/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        // Fallback relative url if hosted on same port
        response = await fetch("/api/roadmap/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        throw new Error("Server responded with error");
      }

      const data = await response.json();
      if (data?.roadmap) {
        setRoadmapData(data.roadmap);
        showToast(`⚡ Real-Time Roadmap generated for "${data.roadmap.course}"!`);
      }
    } catch (e) {
      console.warn("Backend API unavailable, utilizing intelligent client-side generation fallback:", e);
      // Fallback local synthesis
      const fallback = generateLocalRoadmap(cleanCourse, skillLevel, duration, goal);
      setRoadmapData(fallback);
      showToast(`Roadmap generated for "${cleanCourse}"!`);
    } finally {
      setLoading(false);
    }
  };

  // Load initial roadmap on mount or when initialCourse prop changes
  useEffect(() => {
    if (initialCourse) {
      setCourseInput(initialCourse);
      handleGenerateRoadmap(initialCourse);
    }
  }, [initialCourse]);

  // Toggle topic checkmark
  const handleToggleTopic = (topicKey) => {
    setCheckedTopics((prev) => {
      const updated = { ...prev, [topicKey]: !prev[topicKey] };
      try {
        localStorage.setItem("velfire_roadmap_progress", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Calculate completion percentage
  const calculateProgress = () => {
    if (!roadmapData?.phases) return { completed: 0, total: 0, pct: 0 };
    let total = 0;
    let completed = 0;

    roadmapData.phases.forEach((phase) => {
      phase.topics?.forEach((_, idx) => {
        total++;
        const key = `${roadmapData.course}_P${phase.phase_number}_T${idx}`;
        if (checkedTopics[key]) completed++;
      });
    });

    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, pct };
  };

  // Save current roadmap to profile
  const handleSaveRoadmap = () => {
    if (!roadmapData) return;
    const exists = savedRoadmaps.some((r) => r.course === roadmapData.course);
    let updated;
    if (exists) {
      updated = savedRoadmaps.map((r) => (r.course === roadmapData.course ? roadmapData : r));
      showToast(`Updated "${roadmapData.course}" in your saved roadmaps.`);
    } else {
      updated = [roadmapData, ...savedRoadmaps];
      showToast(`Saved "${roadmapData.course}" to your profile!`);
    }
    setSavedRoadmaps(updated);
    try {
      localStorage.setItem("velfire_saved_roadmaps", JSON.stringify(updated));
    } catch (e) {}
  };

  // Copy roadmap markdown to clipboard
  const handleCopyRoadmap = () => {
    if (!roadmapData) return;
    let text = `# ${roadmapData.course} - AI Career Roadmap\n`;
    text += `**${roadmapData.tagline}**\n\n`;
    text += `${roadmapData.overview}\n\n`;
    text += `- **Level**: ${roadmapData.difficulty} | **Duration**: ${roadmapData.duration} | **Hours**: ${roadmapData.estimated_hours}\n\n`;
    text += `## Prerequisites\n${roadmapData.prerequisites?.map((p) => `- ${p}`).join("\n")}\n\n`;
    text += `## Milestones & Phases\n`;
    roadmapData.phases?.forEach((ph) => {
      text += `### Phase ${ph.phase_number}: ${ph.title} (${ph.timeframe})\n`;
      text += `${ph.summary}\n`;
      text += `**Topics to master:**\n${ph.topics?.map((t) => `  - [ ] ${t}`).join("\n")}\n`;
      if (ph.hands_on_project) {
        text += `**Hands-On Project**: ${ph.hands_on_project.title} - ${ph.hands_on_project.description}\n`;
      }
      text += `\n`;
    });
    text += `## Career Outlook\n`;
    text += `- Target Roles: ${roadmapData.career_outcomes?.job_roles?.join(", ")}\n`;
    text += `- Salary Benchmark: ${roadmapData.career_outcomes?.avg_salary}\n`;
    text += `- Market Demand: ${roadmapData.career_outcomes?.industry_demand}\n`;

    navigator.clipboard.writeText(text);
    showToast("📋 Roadmap copied to clipboard in Markdown format!");
  };

  const progressStats = calculateProgress();

  return (
    <div className="velfire-roadmap-container">
      {/* --- TOP INPUT & CONFIGURATION PANEL --- */}
      <div className="roadmap-input-panel">
        <div className="roadmap-panel-header">
          <div className="panel-title-area">
            <h3>
              <span>⚡</span> VELFIRE Real-Time AI Roadmap Generator
            </h3>
            <p>
              Type <strong>ANY course, tech stack, or career goal</strong> to generate an instant, production-aligned roadmap.
            </p>
          </div>

          {onSwitchToCourse && (
            <button
              type="button"
              className="btn-switch-course-link"
              onClick={onSwitchToCourse}
            >
              🎓 Switch to VELFIRE Courses →
            </button>
          )}
        </div>

        {/* Real-time search bar */}
        <form
          className="roadmap-search-bar"
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerateRoadmap();
          }}
        >
          <div className="search-input-wrapper">
            <span className="search-icon-left">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              className="course-search-input"
              value={courseInput}
              onChange={(e) => setCourseInput(e.target.value)}
              placeholder="Type any course (e.g. Flutter Mobile Dev, DevOps, Python Data Science, Full Stack, Solidity Web3...)"
            />
          </div>

          <button
            type="submit"
            className="btn-generate-main"
            disabled={loading}
          >
            {loading ? (
              <>
                <span>⚡</span> Architecting...
              </>
            ) : (
              <>
                <span>🚀</span> Generate Real-Time Roadmap
              </>
            )}
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="suggestion-pills-row">
          <span className="suggestion-label">Quick Suggestions:</span>
          {QUICK_SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              className={`suggestion-chip ${courseInput.toLowerCase() === s.query.toLowerCase() ? "active" : ""}`}
              onClick={() => {
                setCourseInput(s.query);
                handleGenerateRoadmap(s.query);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Secondary Config Options */}
        <div className="config-options-row">
          <div className="config-select-group">
            <label>Target Skill Level</label>
            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
            >
              <option value="Beginner">Beginner (Foundations & Syntax)</option>
              <option value="Intermediate">Intermediate (Core Skills & APIs)</option>
              <option value="Advanced">Advanced (Production Systems & Scale)</option>
            </select>
          </div>

          <div className="config-select-group">
            <label>Target Timeframe</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="1 Month Sprint">1 Month Fast Sprint</option>
              <option value="3 Months Mastery">3 Months Comprehensive Mastery</option>
              <option value="6 Months Path">6 Months Career Transformation</option>
            </select>
          </div>

          <div className="config-select-group">
            <label>Career Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            >
              <option value="Job Placement & Mastery">High-Paying Job Placement</option>
              <option value="SaaS & Product Building">Build Production SaaS / Products</option>
              <option value="Freelancing & Consulting">Freelancing & Client Delivery</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- REAL-TIME GENERATION ANIMATED LOADING STATE --- */}
      {loading && (
        <div className="roadmap-loading-state">
          <div className="loading-spinner-ring" />
          <h4>Synthesizing Real-Time Roadmap for "{courseInput}"...</h4>
          <p>Analyzing industry benchmarks, required toolstacks, and milestone project deliverables.</p>
        </div>
      )}

      {/* --- ROADMAP RESULT DISPLAY --- */}
      {!loading && roadmapData && (
        <div className="roadmap-result-panel">
          {/* Header Banner Card */}
          <div className="roadmap-hero-card">
            <div className="hero-top-meta">
              <span className="ai-verified-tag">
                <span>●</span> Real-Time AI Verified Architecture
              </span>

              <div className="hero-actions-row">
                <button
                  type="button"
                  className="btn-action-icon"
                  onClick={handleCopyRoadmap}
                  title="Copy full roadmap as Markdown"
                >
                  📋 Copy Markdown
                </button>
                <button
                  type="button"
                  className={`btn-action-icon ${savedRoadmaps.some((r) => r.course === roadmapData.course) ? "saved" : ""}`}
                  onClick={handleSaveRoadmap}
                  title="Save this roadmap to your profile"
                >
                  💾 Save to Profile
                </button>
              </div>
            </div>

            <h2 className="roadmap-main-title">{roadmapData.course}</h2>
            <p className="roadmap-tagline">{roadmapData.tagline}</p>
            <p className="roadmap-overview-p">{roadmapData.overview}</p>

            <div className="roadmap-badge-pills">
              <span className="meta-pill difficulty">🎯 {roadmapData.difficulty}</span>
              <span className="meta-pill duration">📅 {roadmapData.duration}</span>
              <span className="meta-pill hours">⚡ {roadmapData.estimated_hours} ({roadmapData.weekly_hours})</span>
            </div>
          </div>

          {/* Interactive Progress Tracking Card */}
          <div className="roadmap-progress-card">
            <div className="progress-header">
              <span className="progress-label">Milestone Progress Tracker</span>
              <span className="progress-value">
                {progressStats.completed} / {progressStats.total} Topics Completed ({progressStats.pct}%)
              </span>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressStats.pct}%` }}
              />
            </div>
          </div>

          {/* Stack & Prerequisites Grid */}
          <div className="roadmap-intel-grid">
            <div className="intel-card">
              <h4>
                <span>📋</span> Recommended Prerequisites
              </h4>
              <ul className="prereq-list">
                {roadmapData.prerequisites?.map((prereq, pIdx) => (
                  <li key={pIdx} className="prereq-item">
                    <span className="check">✓</span>
                    <span>{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="intel-card">
              <h4>
                <span>🛠️</span> Core Production Tech Stack
              </h4>
              <div className="tech-chips-flow">
                {roadmapData.tech_stack?.map((tech, tIdx) => (
                  <div key={tIdx} className="tech-chip">
                    <span className="tech-name">{tech.name}</span>
                    <span className="tech-cat">{tech.category}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step-by-Step Phases Timeline */}
          <h3 className="timeline-section-title">
            <span>🗺️</span> Step-by-Step Milestone Phases
          </h3>

          <div className="phases-timeline-list">
            {roadmapData.phases?.map((phase) => (
              <div key={phase.phase_number} className="phase-card">
                <div className="phase-header-row">
                  <span className="phase-tag">
                    Phase {phase.phase_number}
                  </span>
                  <span className="phase-timeframe">{phase.timeframe}</span>
                </div>

                <h4 className="phase-title">{phase.title}</h4>
                <p className="phase-summary">{phase.summary}</p>

                {/* Checkable topics list */}
                <div className="phase-topics-box">
                  <div className="phase-topics-title">Topics to Master (Click to track progress):</div>
                  <div className="topics-checklist">
                    {phase.topics?.map((topic, tIdx) => {
                      const topicKey = `${roadmapData.course}_P${phase.phase_number}_T${tIdx}`;
                      const isChecked = Boolean(checkedTopics[topicKey]);
                      return (
                        <label
                          key={tIdx}
                          className={`topic-checkbox-item ${isChecked ? "checked" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleTopic(topicKey)}
                          />
                          <span>{topic}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Hands-On Production Project */}
                {phase.hands_on_project && (
                  <div className="phase-project-box">
                    <div className="project-badge">⚡ Real-World Production Deliverable</div>
                    <div className="project-title">{phase.hands_on_project.title}</div>
                    <p className="project-desc">{phase.hands_on_project.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Career & Salary Insights Panel */}
          {roadmapData.career_outcomes && (
            <div className="career-intel-panel">
              <div className="career-intel-header">
                <span>💼</span> Career Outcomes & Industry Positioning
              </div>

              <div className="career-stats-row">
                <div className="stat-box">
                  <div className="stat-title">Target Industry Compensation</div>
                  <div className="stat-value">{roadmapData.career_outcomes.avg_salary}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-title">Market Demand Rating</div>
                  <div className="stat-value">{roadmapData.career_outcomes.industry_demand}</div>
                </div>
              </div>

              <div className="roles-chips-flex">
                {roadmapData.career_outcomes.job_roles?.map((role, rIdx) => (
                  <span key={rIdx} className="role-chip">
                    👔 {role}
                  </span>
                ))}
              </div>

              {roadmapData.pro_tips && (
                <ul className="pro-tips-list">
                  {roadmapData.pro_tips.map((tip, idx) => (
                    <li key={idx} className="pro-tip-item">
                      <span className="bulb">💡</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="roadmap-toast">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

// Client-side local synthesis helper if backend is temporarily disconnected
function generateLocalRoadmap(course, level, duration, goal) {
  const clean = course.trim();
  return {
    course: clean,
    tagline: `Master ${clean} from Foundational Concepts to Enterprise Architecture`,
    overview: `A complete, step-by-step career pathway specifically architected for ${clean}. Gain hands-on competence with real production projects, data structures, and deployment pipelines.`,
    difficulty: level,
    duration: duration,
    estimated_hours: "120-140 Hours",
    weekly_hours: "10-12 hrs/week",
    prerequisites: [
      "Basic programming and algorithmic logic",
      "Git version control and command line navigation",
      "Curiosity and commitment to hands-on building"
    ],
    tech_stack: [
      { name: `${clean} Core Toolchain`, category: "Core Foundation" },
      { name: "Git & GitHub", category: "Version Control" },
      { name: "REST APIs & Databases", category: "Data Layer" },
      { name: "Docker Containerization", category: "DevOps" }
    ],
    phases: [
      {
        phase_number: 1,
        timeframe: "Weeks 1–3",
        title: "Phase 1: Environment Setup & Core Foundations",
        summary: `Establish a solid grasp of core syntax, setup package management, and build foundational programs in ${clean}.`,
        topics: [
          `Syntax, data structures, and type management in ${clean}`,
          "Configuring modern IDEs, formatters, and debugging tools",
          "Git repository initialization, branch management, and PR workflows",
          "Writing clean, modular code with automated linting"
        ],
        hands_on_project: {
          title: `${clean} Modular Starter Platform`,
          description: "Build a structured starter application with environment variables, error logging, and unit tests."
        }
      },
      {
        phase_number: 2,
        timeframe: "Weeks 4–7",
        title: "Phase 2: Data Persistence, APIs & Core Architecture",
        summary: "Connect with external data sources, manage state, and build scalable asynchronous workflows.",
        topics: [
          `Architectural design patterns and state flow for ${clean}`,
          "Relational and NoSQL database queries and caching",
          "Asynchronous I/O, event loops, and robust error handling",
          "Building and consuming RESTful and WebSocket endpoints"
        ],
        hands_on_project: {
          title: `Data-Driven ${clean} Real-Time Microservice`,
          description: "Engineer a high-throughput data processing service with persistent database storage and live updates."
        }
      },
      {
        phase_number: 3,
        timeframe: "Weeks 8–10",
        title: "Phase 3: Production Hardening, Security & Scalability",
        summary: "Profile performance, implement authentication, containerize services, and eliminate latency bottlenecks.",
        topics: [
          "Authentication, JWT tokens, and role-based access control (RBAC)",
          "Automated unit, integration, and end-to-end testing suites",
          "Containerization with Docker and multi-stage builds",
          "Profiling CPU/Memory hotspots and database indexing"
        ],
        hands_on_project: {
          title: `Production-Grade ${clean} Enterprise Application`,
          description: "A fully tested and Dockerized application meeting enterprise security and latency requirements."
        }
      },
      {
        phase_number: 4,
        timeframe: "Weeks 11–12",
        title: "Phase 4: Cloud Deployment, Portfolio & Job Placement",
        summary: "Deploy your capstone project to cloud servers, configure CI/CD pipelines, and prepare for technical interviews.",
        topics: [
          "Continuous Integration & Continuous Deployment (CI/CD) pipelines",
          "Cloud deployment with custom domains and SSL encryption",
          `Technical interview preparation and system design questions for ${clean}`,
          "ATS resume optimization and GitHub portfolio presentation"
        ],
        hands_on_project: {
          title: `Live Capstone Deployment: ${clean} Production Suite`,
          description: "Launch a live, public-facing project with custom domain, automated deployment, and documentation."
        }
      }
    ],
    career_outcomes: {
      job_roles: [`${clean} Engineer`, `${clean} Specialist`, "Software Developer"],
      avg_salary: "$85,000 - $145,000 / ₹9 - ₹25 LPA",
      industry_demand: "High & Rapidly Expanding"
    },
    pro_tips: [
      `Deploy at least 2 public GitHub projects implementing ${clean} with live working URLs.`,
      "Write thorough architectural readmes with system diagrams to stand out to hiring managers.",
      "Understand the trade-offs of different design choices to excel in technical interview rounds."
    ]
  };
}
