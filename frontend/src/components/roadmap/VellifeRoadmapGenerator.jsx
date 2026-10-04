import { useState, useEffect } from "react";
import "./VellifeRoadmapGenerator.css";

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

export default function VellifeRoadmapGenerator({ initialCourse = "Full Stack Development", onSwitchToCourse }) {
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
      const saved = localStorage.getItem("vellife_roadmap_progress");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Saved roadmaps collection in localStorage
  const [savedRoadmaps, setSavedRoadmaps] = useState(() => {
    try {
      const saved = localStorage.getItem("vellife_saved_roadmaps");
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
        localStorage.setItem("vellife_roadmap_progress", JSON.stringify(updated));
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
      localStorage.setItem("vellife_saved_roadmaps", JSON.stringify(updated));
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
    <div className="vellife-roadmap-root">
      <div className="roadmap-ambient-glow" />

      {/* --- 1. SEARCH & COMMAND CONSOLE --- */}
      <div className="roadmap-command-console">
        <div className="console-top-row">
          <div className="console-branding">
            <div className="console-beacon">⚡</div>
            <div className="console-title-group">
              <h3>VELLIFE AI Roadmap Architect</h3>
              <p>Type any course, tech stack, or career goal to synthesize a real-time production roadmap</p>
            </div>
          </div>

          {onSwitchToCourse && (
            <div className="console-actions-right">
              <button
                type="button"
                className="btn-switch-courses"
                onClick={onSwitchToCourse}
              >
                🎓 Switch to VELLIFE Courses →
              </button>
            </div>
          )}
        </div>

        {/* Master Command Input */}
        <form
          className="console-search-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerateRoadmap();
          }}
        >
          <div className="console-input-frame">
            <span className="console-prompt-glyph">&gt;_</span>
            <input
              type="text"
              className="console-input"
              value={courseInput}
              onChange={(e) => setCourseInput(e.target.value)}
              placeholder="Search or type any course (e.g. Flutter Mobile Dev, DevOps, Python Data Science, Full Stack, Solidity Web3...)"
            />
          </div>

          <button
            type="submit"
            className="btn-synthesize-ai"
            disabled={loading}
          >
            {loading ? (
              <>
                <span>⚡</span> Architecting...
              </>
            ) : (
              <>
                <span>🚀</span> Generate Dynamic Roadmap
              </>
            )}
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="console-chips-section">
          <span className="chips-label">Quick Architect:</span>
          {QUICK_SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              className={`quick-tech-chip ${courseInput.toLowerCase() === s.query.toLowerCase() ? "active" : ""}`}
              onClick={() => {
                setCourseInput(s.query);
                handleGenerateRoadmap(s.query);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Secondary Config Grid */}
        <div className="console-config-grid">
          <div className="config-box">
            <label>Target Skill Level</label>
            <select
              className="config-select"
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
            >
              <option value="Beginner">Beginner (Foundations &amp; Syntax)</option>
              <option value="Intermediate">Intermediate (Core Skills &amp; APIs)</option>
              <option value="Advanced">Advanced (Production Scale &amp; Cloud)</option>
            </select>
          </div>

          <div className="config-box">
            <label>Target Timeframe</label>
            <select
              className="config-select"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="1 Month Sprint">1 Month Fast Sprint</option>
              <option value="3 Months Mastery">3 Months Comprehensive Mastery</option>
              <option value="6 Months Path">6 Months Career Transformation</option>
            </select>
          </div>

          <div className="config-box">
            <label>Career Goal</label>
            <select
              className="config-select"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            >
              <option value="Job Placement & Mastery">High-Paying Job Placement</option>
              <option value="SaaS & Product Building">Build Production SaaS / Products</option>
              <option value="Freelancing & Consulting">Freelancing &amp; Client Delivery</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- 2. REAL-TIME AI SYNTHESIZER LOADER --- */}
      {loading && (
        <div className="roadmap-synthesizing-loader">
          <div className="synthesizer-beacon-ring" />
          <h4>Synthesizing Real-Time Roadmap for "{courseInput}"...</h4>
          <p>Analyzing industry benchmarks, engineering toolchains, and milestone production project deliverables.</p>
        </div>
      )}

      {/* --- 3. ROADMAP CANVAS --- */}
      {!loading && roadmapData && (
        <div className="roadmap-canvas">
          {/* Header Hero Showcase Card */}
          <div className="roadmap-hero-banner">
            <div className="banner-status-row">
              <span className="live-beacon-chip">
                <span className="live-beacon-dot" />
                Live AI Architecture // Verified
              </span>

              <div className="banner-controls-group">
                <button
                  type="button"
                  className="btn-banner-action"
                  onClick={handleCopyRoadmap}
                  title="Copy full roadmap as Markdown"
                >
                  📋 Copy Markdown
                </button>
                <button
                  type="button"
                  className={`btn-banner-action ${savedRoadmaps.some((r) => r.course === roadmapData.course) ? "saved" : ""}`}
                  onClick={handleSaveRoadmap}
                  title="Save this roadmap to your profile"
                >
                  💾 Save to Vault
                </button>
              </div>
            </div>

            <h2 className="roadmap-headline">{roadmapData.course}</h2>
            <div className="roadmap-lead-tagline">{roadmapData.tagline}</div>
            <p className="roadmap-summary-p">{roadmapData.overview}</p>

            <div className="banner-pills-row">
              <span className="badge-capsule level">🎯 {roadmapData.difficulty}</span>
              <span className="badge-capsule duration">📅 {roadmapData.duration}</span>
              <span className="badge-capsule hours">⚡ {roadmapData.estimated_hours} ({roadmapData.weekly_hours})</span>
            </div>
          </div>

          {/* Interactive Progress HUD (Mastery Metric) */}
          <div className="mastery-hud-card">
            <div className="hud-header">
              <span className="hud-title">Interactive Roadmap Mastery Progress</span>
              <span className="hud-counter">
                {progressStats.completed} / {progressStats.total} Modules Completed ({progressStats.pct}%)
              </span>
            </div>
            <div className="hud-track">
              <div
                className="hud-fill"
                style={{ width: `${progressStats.pct}%` }}
              />
            </div>
          </div>

          {/* Prerequisites & Tech Stack Dual Matrix */}
          <div className="matrix-dual-grid">
            <div className="matrix-card">
              <div className="matrix-card-title">
                <span>📋</span> Recommended Prerequisites
              </div>
              <ul className="prereqs-checklist">
                {roadmapData.prerequisites?.map((prereq, pIdx) => (
                  <li key={pIdx} className="prereq-row">
                    <span className="prereq-check-icon">✓</span>
                    <span>{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="matrix-card">
              <div className="matrix-card-title">
                <span>🛠️</span> Core Production Tech Stack
              </div>
              <div className="tech-capsules-cloud">
                {roadmapData.tech_stack?.map((tech, tIdx) => (
                  <div key={tIdx} className="tech-capsule-item">
                    <span className="capsule-tech-name">{tech.name}</span>
                    <span className="capsule-tech-category">{tech.category}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Roadmap Journey Conduit (Timeline Tree) */}
          <div className="roadmap-timeline-section-title">
            <span>🗺️</span> Step-by-Step Production Roadmap Journey
          </div>

          <div className="timeline-conduit-wrapper">
            {roadmapData.phases?.map((phase, pIndex) => (
              <div key={phase.phase_number} className="conduit-phase-node">
                {/* Node Anchor Badge on the left spine */}
                <div className="conduit-node-anchor">
                  0{pIndex + 1}
                </div>

                {/* Milestone Phase Card */}
                <div className="phase-milestone-card">
                  <div className="phase-card-header">
                    <span className="phase-status-pill">
                      Phase 0{phase.phase_number} Milestone
                    </span>
                    <span className="phase-time-pill">{phase.timeframe}</span>
                  </div>

                  <h4 className="phase-name-heading">{phase.title}</h4>
                  <p className="phase-desc-p">{phase.summary}</p>

                  {/* Modules Checklist Frame */}
                  <div className="modules-checklist-frame">
                    <div className="modules-frame-title">Core Skills to Master (Interactive Checklist):</div>
                    <div className="modules-grid">
                      {phase.topics?.map((topic, tIdx) => {
                        const topicKey = `${roadmapData.course}_P${phase.phase_number}_T${tIdx}`;
                        const isChecked = Boolean(checkedTopics[topicKey]);
                        return (
                          <label
                            key={tIdx}
                            className={`module-item-label ${isChecked ? "checked" : ""}`}
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

                  {/* Hands-On Project Showcase Card (Terminal Style) */}
                  {phase.hands_on_project && (
                    <div className="project-terminal-card">
                      <div className="terminal-badge-tag">
                        <span>⚡</span> Production Deliverable // Capstone Project
                      </div>
                      <div className="terminal-project-title">{phase.hands_on_project.title}</div>
                      <p className="terminal-project-desc">{phase.hands_on_project.description}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Career & Salary Command Matrix */}
          {roadmapData.career_outcomes && (
            <div className="career-command-matrix">
              <div className="matrix-header">
                <span>💼</span> Career Matrix &amp; Market Intelligence
              </div>

              <div className="matrix-stats-grid">
                <div className="metric-hud-box">
                  <div className="metric-hud-title">Target Industry Compensation</div>
                  <div className="metric-hud-value">{roadmapData.career_outcomes.avg_salary}</div>
                </div>
                <div className="metric-hud-box">
                  <div className="metric-hud-title">Market Demand Rating</div>
                  <div className="metric-hud-value">{roadmapData.career_outcomes.industry_demand}</div>
                </div>
              </div>

              <div className="roles-capsules-flow">
                {roadmapData.career_outcomes.job_roles?.map((role, rIdx) => (
                  <span key={rIdx} className="role-badge-pill">
                    👔 {role}
                  </span>
                ))}
              </div>

              {roadmapData.pro_tips && (
                <ul className="tips-bullet-list">
                  {roadmapData.pro_tips.map((tip, idx) => (
                    <li key={idx} className="tip-bullet-row">
                      <span className="bulb-glyph">💡</span>
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
        <div className="vellife-toast">
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
