// src/components/courses/CourseDetailsView.jsx
import React, { useState } from 'react';

function CourseDetailsView({ 
  course, 
  userProgress = {}, 
  onBack, 
  onStartLearning, 
  onOpenLesson 
}) {
  const [expandedModules, setExpandedModules] = useState(() => {
    // Expand first 2 modules by default
    const initial = {};
    if (course && course.modules) {
      course.modules.forEach((m, idx) => {
        initial[m.id] = idx < 2;
      });
    }
    return initial;
  });

  if (!course) return null;

  const prog = userProgress[course.id] || { completedLessons: [] };
  const completedLessons = prog.completedLessons || [];
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const progressPct = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;
  const isStarted = progressPct > 0;
  const isCompleted = progressPct >= 100;

  const toggleModuleExpand = (modId) => {
    setExpandedModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  const isLessonCompleted = (lessonId) => completedLessons.includes(lessonId);

  return (
    <div className="velfire-course-details-container">
      {/* Back Button */}
      <button className="btn-back-courses" onClick={onBack}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Back to Courses</span>
      </button>

      {/* Course Detail Hero Header */}
      <div 
        className="details-hero-banner"
        style={{ background: course.bannerGradient || "linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)" }}
      >
        <div className="hero-left">
          <div className="hero-tags">
            <span className="category-tag">{course.category}</span>
            <span className={`level-tag ${course.level.toLowerCase()}`}>{course.level}</span>
          </div>

          <h1 className="details-course-title">{course.icon || "📚"} {course.title}</h1>
          <p className="details-course-desc">{course.fullDescription || course.shortDescription}</p>

          <div className="details-meta-row">
            <div className="meta-cell">
              <span className="label">Modules</span>
              <span className="value">{course.modules.length} Modules</span>
            </div>
            <div className="meta-cell">
              <span className="label">Total Lessons</span>
              <span className="value">{totalLessons} Lessons</span>
            </div>
            <div className="meta-cell">
              <span className="label">Estimated Duration</span>
              <span className="value">{course.estimatedDuration}</span>
            </div>
            {course.instructor && (
              <div className="meta-cell instructor-cell">
                <span className="label">Instructor</span>
                <span className="value">{course.instructor.avatar} {course.instructor.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Hero Quick Action Box */}
        <div className="hero-right-action-card">
          <div className="progress-display">
            <div className="progress-header">
              <span>Your Progress</span>
              <span className="percentage">{progressPct}%</span>
            </div>
            <div className="progress-track">
              <div 
                className={`progress-fill ${isCompleted ? 'completed' : ''}`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="lessons-count">
              {completedLessons.length} of {totalLessons} lessons completed
            </span>
          </div>

          <button 
            className="btn-details-primary-action"
            onClick={() => onStartLearning(course)}
          >
            <span>{isCompleted ? "Review Course" : isStarted ? "Continue Learning" : "Start Learning"}</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>

      {/* Main Grid Content Area */}
      <div className="details-content-grid">
        <div className="details-main-column">
          
          {/* Learning Objectives */}
          {course.learningObjectives && course.learningObjectives.length > 0 && (
            <div className="details-section-card">
              <h2 className="section-card-title">🎯 What you will learn</h2>
              <div className="objectives-grid">
                {course.learningObjectives.map((obj, idx) => (
                  <div key={idx} className="objective-item">
                    <span className="check-icon">✓</span>
                    <span className="obj-text">{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills You Will Gain */}
          {course.skills && course.skills.length > 0 && (
            <div className="details-section-card">
              <h2 className="section-card-title">💡 Skills you will gain</h2>
              <div className="skills-chips-list">
                {course.skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag-chip">
                    ✨ {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Course Curriculum Accordion */}
          <div className="details-section-card">
            <div className="curriculum-header">
              <h2 className="section-card-title">📖 Course Curriculum</h2>
              <span className="curriculum-stats">
                {course.modules.length} Modules • {totalLessons} Lessons • {course.estimatedDuration}
              </span>
            </div>

            <div className="modules-accordion-list">
              {course.modules.map((module, mIdx) => {
                const isExpanded = !!expandedModules[module.id];
                const moduleLessons = module.lessons || [];
                const completedInModule = moduleLessons.filter(l => completedLessons.includes(l.id)).length;
                const isModuleFinished = moduleLessons.length > 0 && completedInModule === moduleLessons.length;

                return (
                  <div key={module.id} className={`module-accordion-card ${isExpanded ? 'expanded' : ''}`}>
                    <div 
                      className="module-header-bar"
                      onClick={() => toggleModuleExpand(module.id)}
                    >
                      <div className="module-title-group">
                        <span className="accordion-chevron">{isExpanded ? '▼' : '▶'}</span>
                        <div>
                          <h3 className="module-title">{module.title}</h3>
                          {module.description && (
                            <p className="module-subdesc">{module.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="module-meta-group">
                        <span className="module-lesson-count">
                          {completedInModule}/{moduleLessons.length} Completed
                        </span>
                        {isModuleFinished && (
                          <span className="badge-module-done">✓ Finished</span>
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="module-lessons-list">
                        {moduleLessons.map((lesson, lIdx) => {
                          const done = isLessonCompleted(lesson.id);
                          return (
                            <div 
                              key={lesson.id}
                              className={`lesson-item-row ${done ? 'completed' : ''}`}
                              onClick={() => onOpenLesson(course, module, lesson)}
                            >
                              <div className="lesson-left">
                                <span className={`lesson-status-icon ${done ? 'done' : ''}`}>
                                  {done ? '✓' : '📖'}
                                </span>
                                <div className="lesson-info">
                                  <span className="lesson-name">{lesson.title}</span>
                                  <span className="lesson-duration">⏱️ {lesson.duration}</span>
                                </div>
                              </div>

                              <button className="btn-open-lesson">
                                <span>{done ? "Review" : "Start Lesson"}</span>
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <line x1="5" y1="12" x2="19" y2="12"></line>
                                  <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                              </button>
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

        </div>

        {/* Sidebar Column */}
        <div className="details-sidebar-column">
          <div className="sidebar-sticky-card">
            <h3 className="sidebar-card-title">Course Information</h3>
            
            <ul className="info-list">
              <li>
                <span>Category:</span>
                <strong>{course.category}</strong>
              </li>
              <li>
                <span>Skill Level:</span>
                <strong>{course.level}</strong>
              </li>
              <li>
                <span>Modules:</span>
                <strong>{course.modules.length} Modules</strong>
              </li>
              <li>
                <span>Duration:</span>
                <strong>{course.estimatedDuration}</strong>
              </li>
              <li>
                <span>Certificate:</span>
                <strong className="text-emerald">Included on 100% completion</strong>
              </li>
            </ul>

            <button 
              className="btn-sidebar-start"
              onClick={() => onStartLearning(course)}
            >
              {isCompleted ? "Review Course" : isStarted ? "Continue Learning" : "Start Course Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailsView;
