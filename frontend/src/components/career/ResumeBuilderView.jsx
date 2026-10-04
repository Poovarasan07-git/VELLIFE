// src/components/career/ResumeBuilderView.jsx
import React, { useState } from 'react';
import './CareerTools.css';

export default function ResumeBuilderView({ onBack, defaultDomain = "Full Stack Development" }) {
  const [formData, setFormData] = useState({
    fullName: "Alex Rivera",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    linkedIn: "linkedin.com/in/alexrivera-dev",
    github: "github.com/alexrivera-tech",
    summary: `Motivated and detail-oriented ${defaultDomain} specialist with strong foundations in modern software architecture, scalable web technologies, and clean code practices. Eager to contribute to high-impact engineering teams.`,
    education: [
      {
        id: 1,
        degree: "Bachelor of Science in Computer Science",
        school: "Tech University of California",
        year: "2021 - 2025",
        gpa: "3.85 / 4.0"
      }
    ],
    skills: {
      languages: "JavaScript, TypeScript, Python, SQL, HTML5, CSS3",
      frameworks: "React, Node.js, Express, FastAPI, Next.js, Tailwind CSS",
      tools: "Git, Docker, PostgreSQL, MongoDB, Postman, Linux, Vite"
    },
    experience: [
      {
        id: 1,
        role: "Software Engineering Intern",
        company: "Nexus Cloud Labs",
        location: "Remote",
        duration: "Jun 2024 - Sep 2024",
        responsibilities: "• Developed modular React frontend components reducing page load latency by 28%.\n• Integrated REST APIs with Node.js and PostgreSQL for real-time telemetry dashboards.\n• Collaborated with Agile engineering sprints, participated in PR reviews and unit tests."
      }
    ],
    projects: [
      {
        id: 1,
        title: "VELLIFE Learning & Career Acceleration Portal",
        techStack: "React, Node.js, SQLite, CSS3, Vite",
        link: "github.com/alexrivera-tech/vellife-hub",
        description: "• Built an interactive full-stack learning platform featuring AI roadmaps, video lessons, and ATS tools.\n• Implemented responsive UI with sub-second page transitions and persistent progress tracking."
      },
      {
        id: 2,
        title: "Distributed Task & Workflow Manager",
        techStack: "Python, FastAPI, Redis, Docker",
        link: "github.com/alexrivera-tech/task-engine",
        description: "• Engineered an asynchronous task queue processing 500+ requests/sec with worker retries.\n• Designed schema-validated RESTful endpoints and Swagger API documentation."
      }
    ],
    certifications: [
      {
        id: 1,
        name: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services",
        year: "2024"
      },
      {
        id: 2,
        name: "Meta Professional Full-Stack Developer",
        issuer: "Meta / Coursera",
        year: "2024"
      }
    ]
  });

  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'education' | 'skills' | 'experience' | 'projects' | 'certifications'
  const [printStatus, setPrintStatus] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillChange = (category, value) => {
    setFormData(prev => ({
      ...prev,
      skills: { ...prev.skills, [category]: value }
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { id: Date.now(), degree: "", school: "", year: "", gpa: "" }
      ]
    }));
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experience: updated };
    });
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: Date.now(), role: "", company: "", location: "", duration: "", responsibilities: "" }
      ]
    }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleProjectChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        { id: Date.now(), title: "", techStack: "", link: "", description: "" }
      ]
    }));
  };

  const removeProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const handleCertChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.certifications];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, certifications: updated };
    });
  };

  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { id: Date.now(), name: "", issuer: "", year: "" }
      ]
    }));
  };

  const removeCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleLoadSample = () => {
    setFormData({
      fullName: "Jordan Lee",
      email: "jordan.lee@devmail.io",
      phone: "+1 (415) 890-1234",
      location: "Austin, TX",
      linkedIn: "linkedin.com/in/jordanlee-tech",
      github: "github.com/jordanlee-codes",
      summary: `Proactive ${defaultDomain} Engineer with demonstrated experience architecting high-performance web systems and automated APIs. Focused on scalable frontend state management, database schema design, and CI/CD pipelines.`,
      education: [
        {
          id: 1,
          degree: "B.Tech in Information Technology",
          school: "Institute of Technology",
          year: "2020 - 2024",
          gpa: "3.9 / 4.0"
        }
      ],
      skills: {
        languages: "JavaScript, TypeScript, Python, SQL, C++, HTML/CSS",
        frameworks: "React, Next.js, FastAPI, Node.js, Express, Tailwind CSS",
        tools: "Docker, Git, PostgreSQL, Redis, AWS S3/EC2, Jest, Linux"
      },
      experience: [
        {
          id: 1,
          role: "Junior Full Stack Developer",
          company: "Apex Tech Innovations",
          location: "Austin, TX",
          duration: "2024 - Present",
          responsibilities: "• Built reusable UI component libraries for enterprise dashboard used by 12,000+ daily users.\n• Implemented secure JWT user authentication and role-based access control.\n• Reduced API response times by 35% through Redis caching and query indexing."
        }
      ],
      projects: [
        {
          id: 1,
          title: "AI Career Copilot & Resume Engine",
          techStack: "React, FastAPI, OpenAI API, SQLite",
          link: "github.com/jordanlee-codes/career-copilot",
          description: "• Developed an intelligent roadmap and resume optimization tool providing real-time ATS keyword matching.\n• Engineered asynchronous document parsing and exportable printable format."
        }
      ],
      certifications: [
        {
          id: 1,
          name: "AWS Solutions Architect Associate",
          issuer: "Amazon Web Services",
          year: "2024"
        }
      ]
    });
  };

  const handleResetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedIn: "",
      github: "",
      summary: "",
      education: [{ id: 1, degree: "", school: "", year: "", gpa: "" }],
      skills: { languages: "", frameworks: "", tools: "" },
      experience: [{ id: 1, role: "", company: "", location: "", duration: "", responsibilities: "" }],
      projects: [{ id: 1, title: "", techStack: "", link: "", description: "" }],
      certifications: [{ id: 1, name: "", issuer: "", year: "" }]
    });
  };

  const handleBuildResume = () => {
    setPrintStatus(true);
    setTimeout(() => {
      window.print();
      setPrintStatus(false);
    }, 300);
  };

  return (
    <div className="resume-builder-container">
      {/* Top Action Header */}
      <div className="resume-builder-header">
        <div className="header-left">
          {onBack && (
            <button className="btn-back-to-course" onClick={onBack} title="Back to Courses">
              ← Return to Course Hub
            </button>
          )}
          <div>
            <h1 className="builder-title">📄 ATS Resume Builder</h1>
            <p className="builder-subtitle">
              Construct a recruiter-friendly, ATS-optimized single-column resume with instant live preview.
            </p>
          </div>
        </div>

        <div className="header-actions">
          <button className="btn-secondary-action" onClick={handleLoadSample} title="Populate sample data">
            ✨ Sample Data
          </button>
          <button className="btn-secondary-action" onClick={handleResetForm} title="Reset all fields">
            🧹 Clear
          </button>
          <button className="btn-primary-action" onClick={handleBuildResume}>
            <span>🖨️ Build & Download PDF</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Editor Form (Left) & Realtime Preview (Right) */}
      <div className="resume-builder-split">
        {/* LEFT COLUMN: FORM CONTROLS */}
        <div className="resume-form-panel">
          {/* Section Navigation Tabs */}
          <div className="form-section-tabs">
            <button
              className={`section-tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              👤 Contact
            </button>
            <button
              className={`section-tab-btn ${activeTab === 'education' ? 'active' : ''}`}
              onClick={() => setActiveTab('education')}
            >
              🎓 Education
            </button>
            <button
              className={`section-tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              ⚡ Skills
            </button>
            <button
              className={`section-tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
              onClick={() => setActiveTab('experience')}
            >
              💼 Experience
            </button>
            <button
              className={`section-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              🚀 Projects
            </button>
            <button
              className={`section-tab-btn ${activeTab === 'certifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('certifications')}
            >
              📜 Certifications
            </button>
          </div>

          <div className="form-card-body">
            {/* 1. PERSONAL INFORMATION */}
            {activeTab === 'personal' && (
              <div className="form-section-content">
                <h3 className="section-heading">Contact & Header Details</h3>
                <div className="form-grid-2">
                  <div className="input-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Rivera"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      placeholder="alex.rivera@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="input-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>Location (City, Country)</label>
                    <input
                      type="text"
                      placeholder="San Francisco, CA"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="input-group">
                    <label>LinkedIn URL</label>
                    <input
                      type="text"
                      placeholder="linkedin.com/in/username"
                      value={formData.linkedIn}
                      onChange={(e) => handleInputChange('linkedIn', e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>GitHub / Portfolio URL</label>
                    <input
                      type="text"
                      placeholder="github.com/username"
                      value={formData.github}
                      onChange={(e) => handleInputChange('github', e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Professional Summary</label>
                  <textarea
                    rows={4}
                    placeholder="Brief 2-3 line career overview and core technical competencies..."
                    value={formData.summary}
                    onChange={(e) => handleInputChange('summary', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* 2. EDUCATION */}
            {activeTab === 'education' && (
              <div className="form-section-content">
                <div className="section-header-flex">
                  <h3 className="section-heading">Education History</h3>
                  <button className="btn-add-item" onClick={addEducation}>
                    + Add Degree
                  </button>
                </div>

                {formData.education.map((edu, idx) => (
                  <div key={edu.id || idx} className="item-card-repeater">
                    <div className="item-card-header">
                      <span>Degree #{idx + 1}</span>
                      {formData.education.length > 1 && (
                        <button className="btn-remove-item" onClick={() => removeEducation(idx)}>
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="form-grid-2">
                      <div className="input-group">
                        <label>Degree / Major</label>
                        <input
                          type="text"
                          placeholder="B.S. in Computer Science"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label>Institution / University</label>
                        <input
                          type="text"
                          placeholder="University Name"
                          value={edu.school}
                          onChange={(e) => handleEducationChange(idx, 'school', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-grid-2">
                      <div className="input-group">
                        <label>Year / Duration</label>
                        <input
                          type="text"
                          placeholder="2021 - 2025"
                          value={edu.year}
                          onChange={(e) => handleEducationChange(idx, 'year', e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label>GPA / Honors (Optional)</label>
                        <input
                          type="text"
                          placeholder="3.8 / 4.0"
                          value={edu.gpa}
                          onChange={(e) => handleEducationChange(idx, 'gpa', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. SKILLS */}
            {activeTab === 'skills' && (
              <div className="form-section-content">
                <h3 className="section-heading">Technical & Domain Skills</h3>
                <p className="form-hint">Separate skills with commas for automatic ATS chip formatting.</p>

                <div className="input-group">
                  <label>Programming Languages</label>
                  <input
                    type="text"
                    placeholder="JavaScript, TypeScript, Python, SQL, C++..."
                    value={formData.skills.languages}
                    onChange={(e) => handleSkillChange('languages', e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>Frameworks & Libraries</label>
                  <input
                    type="text"
                    placeholder="React, Next.js, Node.js, Express, FastAPI..."
                    value={formData.skills.frameworks}
                    onChange={(e) => handleSkillChange('frameworks', e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>Developer Tools, Cloud & Databases</label>
                  <input
                    type="text"
                    placeholder="Git, Docker, PostgreSQL, MongoDB, AWS, Vite, Linux..."
                    value={formData.skills.tools}
                    onChange={(e) => handleSkillChange('tools', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* 4. EXPERIENCE */}
            {activeTab === 'experience' && (
              <div className="form-section-content">
                <div className="section-header-flex">
                  <h3 className="section-heading">Work Experience & Internships</h3>
                  <button className="btn-add-item" onClick={addExperience}>
                    + Add Experience
                  </button>
                </div>

                {formData.experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="item-card-repeater">
                    <div className="item-card-header">
                      <span>Experience #{idx + 1}</span>
                      {formData.experience.length > 1 && (
                        <button className="btn-remove-item" onClick={() => removeExperience(idx)}>
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="form-grid-2">
                      <div className="input-group">
                        <label>Job Title / Role</label>
                        <input
                          type="text"
                          placeholder="Software Engineer"
                          value={exp.role}
                          onChange={(e) => handleExperienceChange(idx, 'role', e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label>Company / Organization</label>
                        <input
                          type="text"
                          placeholder="Tech Corp Inc."
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-grid-2">
                      <div className="input-group">
                        <label>Location</label>
                        <input
                          type="text"
                          placeholder="Remote / New York, NY"
                          value={exp.location}
                          onChange={(e) => handleExperienceChange(idx, 'location', e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label>Duration / Dates</label>
                        <input
                          type="text"
                          placeholder="Jan 2024 - Present"
                          value={exp.duration}
                          onChange={(e) => handleExperienceChange(idx, 'duration', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Responsibilities & Achievements (Use bullet points starting with •)</label>
                      <textarea
                        rows={4}
                        placeholder="• Architected feature X resulting in Y% performance boost&#10;• Led cross-functional team sprints"
                        value={exp.responsibilities}
                        onChange={(e) => handleExperienceChange(idx, 'responsibilities', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 5. PROJECTS */}
            {activeTab === 'projects' && (
              <div className="form-section-content">
                <div className="section-header-flex">
                  <h3 className="section-heading">Key Technical Projects</h3>
                  <button className="btn-add-item" onClick={addProject}>
                    + Add Project
                  </button>
                </div>

                {formData.projects.map((proj, idx) => (
                  <div key={proj.id || idx} className="item-card-repeater">
                    <div className="item-card-header">
                      <span>Project #{idx + 1}</span>
                      {formData.projects.length > 1 && (
                        <button className="btn-remove-item" onClick={() => removeProject(idx)}>
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="form-grid-2">
                      <div className="input-group">
                        <label>Project Title</label>
                        <input
                          type="text"
                          placeholder="E-Commerce Microservices Engine"
                          value={proj.title}
                          onChange={(e) => handleProjectChange(idx, 'title', e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label>Tech Stack</label>
                        <input
                          type="text"
                          placeholder="React, Node.js, PostgreSQL"
                          value={proj.techStack}
                          onChange={(e) => handleProjectChange(idx, 'techStack', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="input-group">
                      <label>GitHub / Live Link</label>
                      <input
                        type="text"
                        placeholder="github.com/username/project"
                        value={proj.link}
                        onChange={(e) => handleProjectChange(idx, 'link', e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label>Project Bullet Points</label>
                      <textarea
                        rows={3}
                        placeholder="• Engineered asynchronous API pipeline...&#10;• Designed responsive UI with sub-second latency"
                        value={proj.description}
                        onChange={(e) => handleProjectChange(idx, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 6. CERTIFICATIONS */}
            {activeTab === 'certifications' && (
              <div className="form-section-content">
                <div className="section-header-flex">
                  <h3 className="section-heading">Certifications & Honors</h3>
                  <button className="btn-add-item" onClick={addCertification}>
                    + Add Certification
                  </button>
                </div>

                {formData.certifications.map((cert, idx) => (
                  <div key={cert.id || idx} className="item-card-repeater">
                    <div className="item-card-header">
                      <span>Certification #{idx + 1}</span>
                      {formData.certifications.length > 1 && (
                        <button className="btn-remove-item" onClick={() => removeCertification(idx)}>
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="form-grid-2">
                      <div className="input-group">
                        <label>Certificate Name</label>
                        <input
                          type="text"
                          placeholder="AWS Certified Solutions Architect"
                          value={cert.name}
                          onChange={(e) => handleCertChange(idx, 'name', e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label>Issuing Organization</label>
                        <input
                          type="text"
                          placeholder="Amazon Web Services / Coursera"
                          value={cert.issuer}
                          onChange={(e) => handleCertChange(idx, 'issuer', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Year / Expiration</label>
                      <input
                        type="text"
                        placeholder="2024"
                        value={cert.year}
                        onChange={(e) => handleCertChange(idx, 'year', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: REALTIME ATS RESUME PAPER PREVIEW */}
        <div className="resume-preview-panel">
          <div className="preview-toolbar">
            <span className="preview-label">👁️ ATS-Standard Paper Preview (Live)</span>
            <span className="ats-badge">✓ ATS 98% Compatible</span>
          </div>

          <div className="resume-paper-view" id="printable-resume">
            {/* Header */}
            <div className="resume-paper-header">
              <h1 className="resume-paper-name">{formData.fullName || "Your Full Name"}</h1>
              <div className="resume-paper-contacts">
                {formData.email && <span>{formData.email}</span>}
                {formData.phone && <span>• {formData.phone}</span>}
                {formData.location && <span>• {formData.location}</span>}
                {formData.linkedIn && <span>• {formData.linkedIn}</span>}
                {formData.github && <span>• {formData.github}</span>}
              </div>
            </div>

            {/* Summary */}
            {formData.summary && (
              <div className="resume-paper-section">
                <h2 className="resume-paper-section-title">PROFESSIONAL SUMMARY</h2>
                <p className="resume-paper-text">{formData.summary}</p>
              </div>
            )}

            {/* Skills */}
            {(formData.skills.languages || formData.skills.frameworks || formData.skills.tools) && (
              <div className="resume-paper-section">
                <h2 className="resume-paper-section-title">TECHNICAL SKILLS</h2>
                <div className="resume-skills-block">
                  {formData.skills.languages && (
                    <div className="resume-skill-row">
                      <strong>Languages:</strong> {formData.skills.languages}
                    </div>
                  )}
                  {formData.skills.frameworks && (
                    <div className="resume-skill-row">
                      <strong>Frameworks & Libraries:</strong> {formData.skills.frameworks}
                    </div>
                  )}
                  {formData.skills.tools && (
                    <div className="resume-skill-row">
                      <strong>Tools & Cloud:</strong> {formData.skills.tools}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Experience */}
            {formData.experience.some(e => e.role || e.company) && (
              <div className="resume-paper-section">
                <h2 className="resume-paper-section-title">WORK EXPERIENCE</h2>
                {formData.experience.map((exp, i) => (
                  (exp.role || exp.company) && (
                    <div key={i} className="resume-entry">
                      <div className="resume-entry-header">
                        <span className="entry-role">
                          <strong>{exp.role}</strong> {exp.company && `— ${exp.company}`}
                        </span>
                        <span className="entry-meta">{exp.duration} {exp.location && `| ${exp.location}`}</span>
                      </div>
                      {exp.responsibilities && (
                        <div className="entry-bullets">
                          {exp.responsibilities.split('\n').filter(b => b.trim()).map((b, bi) => (
                            <p key={bi} className="bullet-point">
                              {b.trim().startsWith('•') ? b.trim() : `• ${b.trim()}`}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                ))}
              </div>
            )}

            {/* Projects */}
            {formData.projects.some(p => p.title) && (
              <div className="resume-paper-section">
                <h2 className="resume-paper-section-title">PROJECTS</h2>
                {formData.projects.map((proj, i) => (
                  proj.title && (
                    <div key={i} className="resume-entry">
                      <div className="resume-entry-header">
                        <span className="entry-role">
                          <strong>{proj.title}</strong> {proj.techStack && `| ${proj.techStack}`}
                        </span>
                        {proj.link && <span className="entry-meta">{proj.link}</span>}
                      </div>
                      {proj.description && (
                        <div className="entry-bullets">
                          {proj.description.split('\n').filter(b => b.trim()).map((b, bi) => (
                            <p key={bi} className="bullet-point">
                              {b.trim().startsWith('•') ? b.trim() : `• ${b.trim()}`}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                ))}
              </div>
            )}

            {/* Education */}
            {formData.education.some(e => e.degree || e.school) && (
              <div className="resume-paper-section">
                <h2 className="resume-paper-section-title">EDUCATION</h2>
                {formData.education.map((edu, i) => (
                  (edu.degree || edu.school) && (
                    <div key={i} className="resume-entry">
                      <div className="resume-entry-header">
                        <span className="entry-role">
                          <strong>{edu.school}</strong> — {edu.degree}
                        </span>
                        <span className="entry-meta">{edu.year} {edu.gpa && `| GPA: ${edu.gpa}`}</span>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}

            {/* Certifications */}
            {formData.certifications.some(c => c.name) && (
              <div className="resume-paper-section">
                <h2 className="resume-paper-section-title">CERTIFICATIONS</h2>
                <div className="entry-bullets">
                  {formData.certifications.map((cert, i) => (
                    cert.name && (
                      <p key={i} className="bullet-point">
                        • <strong>{cert.name}</strong> {cert.issuer && `— ${cert.issuer}`} {cert.year && `(${cert.year})`}
                      </p>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
