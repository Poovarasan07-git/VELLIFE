// src/components/courses/CourseLessonView.jsx
import React, { useState, useEffect } from 'react';

function CourseLessonView({ 
  course, 
  currentModuleId, 
  currentLessonId, 
  userProgress = {}, 
  onBackToCourseDetails, 
  onSelectLesson, 
  onMarkLessonCompleted,
  onSwitchToRoadmap
}) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [showPracticeHint, setShowPracticeHint] = useState(false);
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [practiceStatus, setPracticeStatus] = useState(null); // null | 'success'

  // Flatten all lessons into a flat list for Previous / Next navigation
  const allLessonsFlat = [];
  course.modules.forEach(mod => {
    mod.lessons.forEach(les => {
      allLessonsFlat.push({
        module: mod,
        lesson: les
      });
    });
  });

  const currentIndex = allLessonsFlat.findIndex(
    item => item.lesson.id === currentLessonId
  );

  const currentItem = currentIndex >= 0 ? allLessonsFlat[currentIndex] : allLessonsFlat[0];
  const activeModule = currentItem ? currentItem.module : course.modules[0];
  const activeLesson = currentItem ? currentItem.lesson : course.modules[0].lessons[0];

  const prog = userProgress[course.id] || { completedLessons: [] };
  const completedLessons = prog.completedLessons || [];
  const isCurrentLessonDone = completedLessons.includes(activeLesson.id);

  const totalLessonsCount = allLessonsFlat.length;
  const progressPct = totalLessonsCount > 0 
    ? Math.round((completedLessons.length / totalLessonsCount) * 100) 
    : 0;

  useEffect(() => {
    // Reset copy state and practice input on lesson change
    setCopiedCode(false);
    setShowPracticeHint(false);
    setPracticeAnswer('');
    setPracticeStatus(null);
  }, [currentLessonId]);

  const handleCopyCode = () => {
    if (activeLesson && activeLesson.codeSnippet) {
      navigator.clipboard.writeText(activeLesson.codeSnippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prev = allLessonsFlat[currentIndex - 1];
      onSelectLesson(course, prev.module, prev.lesson);
    }
  };

  const handleNext = () => {
    if (currentIndex < allLessonsFlat.length - 1) {
      const next = allLessonsFlat[currentIndex + 1];
      onSelectLesson(course, next.module, next.lesson);
    }
  };

  const handleToggleComplete = () => {
    onMarkLessonCompleted(course.id, activeLesson.id);
  };

  const handlePracticeSubmit = () => {
    if (practiceAnswer.trim().length > 0) {
      setPracticeStatus('success');
      if (!isCurrentLessonDone) {
        onMarkLessonCompleted(course.id, activeLesson.id);
      }
    }
  };

  return (
    <div className="velfire-lesson-interface-container">
      {/* Top Header Bar */}
      <div className="lesson-top-header">
        <button className="btn-return-details" onClick={onBackToCourseDetails}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Course Details</span>
        </button>

        <div className="header-course-info">
          <span className="course-icon">{course.icon}</span>
          <span className="course-name">{course.title}</span>
        </div>

        <div className="header-right-tools">
          <div className="header-progress-box">
            <div className="progress-mini-bar">
              <div className="fill" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="progress-text">{progressPct}% ({completedLessons.length}/{totalLessonsCount})</span>
          </div>

          {onSwitchToRoadmap && (
            <button className="btn-switch-roadmap-header" onClick={onSwitchToRoadmap}>
              🗺️ Roadmap
            </button>
          )}
        </div>
      </div>

      {/* Main 3-Pane Body */}
      <div className="lesson-body-layout">
        
        {/* LEFT SIDEBAR: Modules & Lessons Tree */}
        <div className="lesson-sidebar">
          <div className="sidebar-header-box">
            <h4>Course Modules</h4>
            <span className="progress-badge">{progressPct}% Done</span>
          </div>

          <div className="sidebar-modules-tree">
            {course.modules.map((mod, mIdx) => {
              const isModActive = mod.id === activeModule.id;
              const completedInMod = mod.lessons.filter(l => completedLessons.includes(l.id)).length;

              return (
                <div key={mod.id} className={`sidebar-module-group ${isModActive ? 'active-group' : ''}`}>
                  <div className="module-group-title">
                    <span>{mod.title}</span>
                    <span className="mod-count">{completedInMod}/{mod.lessons.length}</span>
                  </div>

                  <div className="module-lessons-sublist">
                    {mod.lessons.map((les) => {
                      const isLesActive = les.id === activeLesson.id;
                      const isDone = completedLessons.includes(les.id);

                      return (
                        <button
                          key={les.id}
                          className={`sidebar-lesson-btn ${isLesActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                          onClick={() => onSelectLesson(course, mod, les)}
                        >
                          <span className={`status-bullet ${isDone ? 'done' : isLesActive ? 'current' : ''}`}>
                            {isDone ? '✓' : isLesActive ? '▶' : '•'}
                          </span>
                          <span className="lesson-title-text">{les.title}</span>
                          <span className="lesson-time">{les.duration}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER MAIN CONTENT AREA */}
        <div className="lesson-center-content">
          <div className="lesson-content-scroll">
            
            {/* Breadcrumb & Title */}
            <div className="lesson-meta-header">
              <span className="module-breadcrumb">{activeModule.title}</span>
              <h1 className="active-lesson-title">{activeLesson.title}</h1>
              <div className="lesson-tags-row">
                <span className="tag-duration">⏱️ {activeLesson.duration}</span>
                {isCurrentLessonDone && (
                  <span className="tag-status-done">✓ Completed</span>
                )}
              </div>
            </div>

            {/* Explanation Content */}
            <div className="lesson-section-box">
              <h3 className="box-title">📘 Lesson Explanation</h3>
              <p className="lesson-explanation-text">{activeLesson.content}</p>
            </div>

            {/* Real World Example */}
            {activeLesson.realWorldExample && (
              <div className="lesson-section-box real-world-box">
                <h3 className="box-title">💡 Real-World Example</h3>
                <p className="real-world-text">{activeLesson.realWorldExample}</p>
              </div>
            )}

            {/* Formatted Code Snippet Block */}
            {activeLesson.codeSnippet && (
              <div className="lesson-section-box code-box">
                <div className="code-box-header">
                  <span className="code-lang-label">Code & Practical Example</span>
                  <button className="btn-copy-code" onClick={handleCopyCode}>
                    {copiedCode ? "✓ Copied!" : "📋 Copy Code"}
                  </button>
                </div>
                <pre className="code-display-block">
                  <code>{activeLesson.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Key Takeaways */}
            {activeLesson.keyPoints && activeLesson.keyPoints.length > 0 && (
              <div className="lesson-section-box keypoints-box">
                <h3 className="box-title">🔑 Key Takeaways</h3>
                <ul className="keypoints-list">
                  {activeLesson.keyPoints.map((pt, pIdx) => (
                    <li key={pIdx}>
                      <span className="bullet">✓</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Practice Task Box */}
            {activeLesson.practiceTask && (
              <div className="lesson-section-box practice-box">
                <div className="practice-header">
                  <h3 className="box-title">✍️ Practice Task</h3>
                  <button 
                    className="btn-toggle-hint"
                    onClick={() => setShowPracticeHint(!showPracticeHint)}
                  >
                    {showPracticeHint ? "Hide Hint" : "💡 Show Hint"}
                  </button>
                </div>

                <p className="practice-instruction">{activeLesson.practiceTask}</p>

                {showPracticeHint && (
                  <div className="practice-hint-banner">
                    💡 <strong>Hint:</strong> Review the key takeaways and code example above. Try writing out your logic clearly before verifying.
                  </div>
                )}

                <div className="practice-input-group">
                  <textarea
                    rows="3"
                    className="practice-textarea"
                    placeholder="Write your answer or code logic here to verify your learning..."
                    value={practiceAnswer}
                    onChange={(e) => setPracticeAnswer(e.target.value)}
                  />
                  <button 
                    className="btn-submit-practice"
                    onClick={handlePracticeSubmit}
                  >
                    Verify Answer
                  </button>
                </div>

                {practiceStatus === 'success' && (
                  <div className="practice-success-notice">
                    🎉 Excellent effort! Practice task response registered and lesson progress saved.
                  </div>
                )}
              </div>
            )}

          </div>

          {/* BOTTOM NAVIGATION CONTROL BAR */}
          <div className="lesson-bottom-nav-bar">
            <button 
              className="btn-nav-prev"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              ← Previous Lesson
            </button>

            <button 
              className={`btn-mark-completed ${isCurrentLessonDone ? 'is-completed' : ''}`}
              onClick={handleToggleComplete}
            >
              {isCurrentLessonDone ? "✓ Lesson Completed (Click to Toggle)" : "✓ Mark as Completed"}
            </button>

            <button 
              className="btn-nav-next"
              onClick={handleNext}
              disabled={currentIndex === allLessonsFlat.length - 1}
            >
              Next Lesson →
            </button>
          </div>

        </div>

        {/* RIGHT PANEL STATS */}
        <div className="lesson-right-stats-panel">
          <div className="stats-card">
            <h4>Lesson Overview</h4>
            
            <div className="progress-ring-container">
              <div className="big-progress-val">{progressPct}%</div>
              <span className="ring-label">Overall Course Completion</span>
            </div>

            <div className="stats-list">
              <div className="stat-row">
                <span>Active Module:</span>
                <strong>{activeModule.title.split('–')[0] || activeModule.title}</strong>
              </div>
              <div className="stat-row">
                <span>Completed:</span>
                <strong>{completedLessons.length} / {totalLessonsCount}</strong>
              </div>
              <div className="stat-row">
                <span>Current Status:</span>
                <strong className={isCurrentLessonDone ? "text-emerald" : "text-amber"}>
                  {isCurrentLessonDone ? "✓ Completed" : "In Progress"}
                </strong>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CourseLessonView;
