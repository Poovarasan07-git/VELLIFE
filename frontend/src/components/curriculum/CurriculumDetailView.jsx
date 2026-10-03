// src/components/curriculum/CurriculumDetailView.jsx
import React, { useState } from 'react';

function CurriculumDetailView({ 
  course, 
  userProgress = {}, 
  onBack, 
  onSelectLesson,
  onSelectTopic
}) {
  const [activeTab, setActiveTab] = useState('modules'); // 'modules' | 'projects' | 'career'
  const [expandedModules, setExpandedModules] = useState(() => {
    const initial = {};
    if (course) {
      if (course.sections) {
        course.sections.forEach(sec => {
          sec.modules.forEach((mod, idx) => {
            initial[mod.id] = idx < 2;
          });
        });
      } else if (course.modules) {
        course.modules.forEach((mod, idx) => {
          initial[mod.id] = idx < 2;
        });
      }
    }
    return initial;
  });

  if (!course) return null;

  const prog = userProgress[course.id] || { completedLessons: [], completedTopics: [] };
  const completedLessons = prog.completedLessons || prog.completedTopics || [];

  // Calculate total lessons
  let totalLessonsCount = 0;
  if (course.sections) {
    course.sections.forEach(sec => {
      sec.modules.forEach(mod => {
        totalLessonsCount += (mod.lessons ? mod.lessons.length : 0);
      });
    });
  } else if (course.modules) {
    course.modules.forEach(mod => {
      totalLessonsCount += (mod.topics ? mod.topics.length : mod.lessons ? mod.lessons.length : 0);
    });
  }

  const progressPct = totalLessonsCount > 0 
    ? Math.round((completedLessons.length / totalLessonsCount) * 100) 
    : 0;

  const toggleModuleExpand = (modId) => {
    setExpandedModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  const isLessonDone = (lesId) => completedLessons.includes(lesId);

  // Helper to open first available lesson
  const handleStartLearningFirst = () => {
    if (course.sections && course.sections.length > 0) {
      const sec = course.sections[0];
      if (sec.modules && sec.modules.length > 0) {
        const mod = sec.modules[0];
        if (mod.lessons && mod.lessons.length > 0) {
          onSelectLesson(course, sec, mod, mod.lessons[0]);
          return;
        }
      }
    }
    if (course.modules && course.modules.length > 0) {
      const mod = course.modules[0];
      if (mod.topics && mod.topics.length > 0 && onSelectTopic) {
        onSelectTopic(course, mod, mod.topics[0]);
      }
    }
  };

  return (
    <div className="curriculum-detail-view">
      {/* Back Button */}
      <button className="btn-back-curriculum" onClick={onBack}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Back to Full Curriculum</span>
      </button>

      {/* Hero Overview Banner */}
      <div 
        className="curriculum-hero-card"
        style={{ background: course.bannerGradient || "linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)" }}
      >
        <div className="hero-left-info">
          <div className="hero-badge-row">
            <span className="hero-cat-tag">{course.category}</span>
            <span className={`hero-level-tag ${course.level.toLowerCase()}`}>{course.level}</span>
          </div>

          <h1 className="hero-course-title">{course.icon} {course.title}</h1>
          <p className="hero-course-desc">{course.fullDescription || course.shortDescription}</p>

          <div className="hero-meta-grid">
            <div className="meta-block">
              <span className="lbl">Total Lessons</span>
              <span className="val">{totalLessonsCount} Lessons</span>
            </div>
            <div className="meta-block">
              <span className="lbl">Estimated Time</span>
              <span className="val">{course.estimatedDuration}</span>
            </div>
            {course.instructor && (
              <div className="meta-block">
                <span className="lbl">Instructor</span>
                <span className="val">{course.instructor.avatar} {course.instructor.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Card */}
        <div className="hero-right-card">
          <div className="card-progress-box">
            <div className="progress-header-flex">
              <span>Overall Progress</span>
              <span className="pct-val">{progressPct}%</span>
            </div>
            <div className="progress-bar-track">
              <div 
                className={`progress-bar-fill ${progressPct >= 100 ? 'done' : ''}`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="topics-counter">
              {completedLessons.length} of {totalLessonsCount} lessons finished
            </span>
          </div>

          <button 
            className="btn-start-curriculum-now"
            onClick={handleStartLearningFirst}
          >
            <span>{progressPct > 0 ? "Continue Reading Textbook" : "Start Digital Textbook"}</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="curriculum-subtabs-bar">
        <button 
          className={`subtab-btn ${activeTab === 'modules' ? 'active' : ''}`}
          onClick={() => setActiveTab('modules')}
        >
          📖 Complete Syllabus ({totalLessonsCount} Lessons)
        </button>
        
        {course.projects && course.projects.length > 0 && (
          <button 
            className={`subtab-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            🛠️ Practical Projects ({course.projects.length})
          </button>
        )}

        <button 
          className={`subtab-btn ${activeTab === 'career' ? 'active' : ''}`}
          onClick={() => setActiveTab('career')}
        >
          🌟 Skills & Career Pathways
        </button>
      </div>

      {/* TAB 1: CURRICULUM MODULES & SECTIONS */}
      {activeTab === 'modules' && (
        <div className="curriculum-modules-tab">
          
          {/* If Sections exist (Digital Textbook Structure) */}
          {course.sections ? (
            course.sections.map((sec) => (
              <div key={sec.id} className="section-block-group" style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#34d399", marginBottom: "16px" }}>
                  {sec.title}
                </h2>

                <div className="modules-accordion-stack">
                  {sec.modules.map((module) => {
                    const isExpanded = !!expandedModules[module.id];
                    const lessonsList = module.lessons || [];
                    const completedInMod = lessonsList.filter(l => isLessonDone(l.id)).length;
                    const isModuleComplete = lessonsList.length > 0 && completedInMod === lessonsList.length;

                    return (
                      <div key={module.id} className={`module-accordion-box ${isExpanded ? 'expanded' : ''}`}>
                        <div 
                          className="module-box-header"
                          onClick={() => toggleModuleExpand(module.id)}
                        >
                          <div className="header-left-title">
                            <span className="chevron-icon">{isExpanded ? '▼' : '▶'}</span>
                            <div>
                              <h3 className="mod-title">{module.title}</h3>
                              {module.description && (
                                <p className="mod-desc">{module.description}</p>
                              )}
                            </div>
                          </div>

                          <div className="header-right-meta">
                            <span className="mod-topics-count">
                              {completedInMod}/{lessonsList.length} Lessons Finished
                            </span>
                            {isModuleComplete && (
                              <span className="badge-mod-complete">✓ Complete</span>
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="topics-list-container">
                            {lessonsList.map((les) => {
                              const done = isLessonDone(les.id);
                              return (
                                <div 
                                  key={les.id}
                                  className={`topic-row-item ${done ? 'completed' : ''}`}
                                  onClick={() => onSelectLesson(course, sec, module, les)}
                                >
                                  <div className="topic-left-info">
                                    <span className={`status-icon ${done ? 'done' : ''}`}>
                                      {done ? '✓' : '📖'}
                                    </span>
                                    <div>
                                      <span className="topic-name">{les.title}</span>
                                      {les.overview && (
                                        <p style={{ fontSize: "12.5px", color: "#94a3b8", margin: "2px 0 0 0" }}>
                                          {les.overview}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="topic-right-action">
                                    <span className="topic-time">⏱️ {les.duration || "25 min"}</span>
                                    <button className="btn-open-topic">
                                      <span>{done ? "Review Lesson" : "Read Lesson"}</span>
                                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            /* Standard Module Structure Fallback */
            <div className="modules-accordion-stack">
              {course.modules.map((module) => {
                const isExpanded = !!expandedModules[module.id];
                const topicsList = module.topics || module.lessons || [];
                const completedInMod = topicsList.filter(t => isLessonDone(t.id)).length;
                const isModuleComplete = topicsList.length > 0 && completedInMod === topicsList.length;

                return (
                  <div key={module.id} className={`module-accordion-box ${isExpanded ? 'expanded' : ''}`}>
                    <div 
                      className="module-box-header"
                      onClick={() => toggleModuleExpand(module.id)}
                    >
                      <div className="header-left-title">
                        <span className="chevron-icon">{isExpanded ? '▼' : '▶'}</span>
                        <div>
                          <h3 className="mod-title">{module.title}</h3>
                          {module.description && (
                            <p className="mod-desc">{module.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="header-right-meta">
                        <span className="mod-topics-count">
                          {completedInMod}/{topicsList.length} Finished
                        </span>
                        {isModuleComplete && (
                          <span className="badge-mod-complete">✓ Complete</span>
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="topics-list-container">
                        {topicsList.map((topic) => {
                          const done = isLessonDone(topic.id);
                          return (
                            <div 
                              key={topic.id}
                              className={`topic-row-item ${done ? 'completed' : ''}`}
                              onClick={() => onSelectTopic && onSelectTopic(course, module, topic)}
                            >
                              <div className="topic-left-info">
                                <span className={`status-icon ${done ? 'done' : ''}`}>
                                  {done ? '✓' : '📖'}
                                </span>
                                <div>
                                  <span className="topic-name">{topic.title}</span>
                                </div>
                              </div>

                              <div className="topic-right-action">
                                <span className="topic-time">{topic.duration || "30 min"}</span>
                                <button className="btn-open-topic">
                                  <span>{done ? "Review" : "Explore"}</span>
                                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: PRACTICAL PROJECTS */}
      {activeTab === 'projects' && course.projects && (
        <div className="curriculum-projects-tab">
          <div className="projects-grid">
            {course.projects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-card-header">
                  <span className={`difficulty-badge ${project.difficulty.toLowerCase()}`}>
                    {project.difficulty} Project
                  </span>
                  <h3 className="project-title">{project.title}</h3>
                </div>

                <div className="project-skills-row">
                  {project.skillsUsed.map((sk, idx) => (
                    <span key={idx} className="proj-skill-tag">{sk}</span>
                  ))}
                </div>

                <div className="project-body-section">
                  <h4>📋 Problem Statement</h4>
                  <p className="expected-output-text">{project.problemStatement || project.requirements.join(' ')}</p>

                  <h4>🎯 Requirements</h4>
                  <ul className="requirements-list">
                    {project.requirements.map((req, rIdx) => (
                      <li key={rIdx}>✓ {req}</li>
                    ))}
                  </ul>

                  <h4>✅ Expected Output</h4>
                  <p className="expected-output-text">{project.expectedOutput}</p>

                  <h4>🚀 Step-by-Step Tasks</h4>
                  <div className="step-tasks-checklist">
                    {project.stepByStepTasks.map((task, tIdx) => (
                      <div key={tIdx} className="step-task-item">
                        <span className="step-num">{tIdx + 1}</span>
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CAREER PATHWAYS & SKILLS */}
      {activeTab === 'career' && (
        <div className="curriculum-career-tab">
          <div className="career-details-card">
            <h3>💼 Career Opportunities Unlocked</h3>
            <p>Completing this digital textbook curriculum qualifies you for high-demand engineering and analyst roles:</p>
            <div className="roles-grid">
              {course.careerOpportunities.map((role, idx) => (
                <div key={idx} className="role-card">
                  <span className="role-icon">🎯</span>
                  <span className="role-name">{role}</span>
                </div>
              ))}
            </div>

            <h3 className="section-margin-top">✨ Key Skills Covered</h3>
            <div className="skills-tags-cloud">
              {course.skillsCovered.map((skill, idx) => (
                <span key={idx} className="skill-cloud-tag">✓ {skill}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CurriculumDetailView;
