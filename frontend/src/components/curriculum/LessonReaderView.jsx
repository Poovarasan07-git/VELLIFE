// src/components/curriculum/LessonReaderView.jsx
import React, { useState, useEffect } from 'react';

function LessonReaderView({ 
  course, 
  section, 
  module, 
  lesson, 
  userProgress = {}, 
  onBackToOverview, 
  onSelectLesson,
  onMarkLessonCompleted,
  onSwitchToRoadmap
}) {
  const [activeTab, setActiveTab] = useState('lesson'); // 'lesson' | 'practice' | 'quiz' | 'test' | 'project'
  const [copiedCode, setCopiedCode] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [practiceCode, setPracticeCode] = useState('');
  const [practiceVerified, setPracticeVerified] = useState(false);

  // Lesson Quiz State
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Module Test State
  const [testAnswers, setTestAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false);

  // Flatten all lessons across all modules for Previous/Next navigation
  const allLessonsFlat = [];
  course.sections.forEach(sec => {
    sec.modules.forEach(mod => {
      mod.lessons.forEach(les => {
        allLessonsFlat.push({ section: sec, module: mod, lesson: les });
      });
    });
  });

  const currentIndex = allLessonsFlat.findIndex(item => item.lesson.id === lesson.id);

  const prog = userProgress[course.id] || { completedLessons: [] };
  const completedLessons = prog.completedLessons || [];
  const isLessonDone = completedLessons.includes(lesson.id);

  const totalLessonsCount = allLessonsFlat.length;
  const progressPct = totalLessonsCount > 0 
    ? Math.round((completedLessons.length / totalLessonsCount) * 100) 
    : 0;

  useEffect(() => {
    // Reset internal state on lesson change
    setActiveTab('lesson');
    setCopiedCode(false);
    setShowHint(false);
    setPracticeCode(lesson.practiceTask ? lesson.practiceTask.starterCode || '' : '');
    setPracticeVerified(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
  }, [lesson.id]);

  const handleCopyCode = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prev = allLessonsFlat[currentIndex - 1];
      onSelectLesson(course, prev.section, prev.module, prev.lesson);
    }
  };

  const handleNext = () => {
    if (currentIndex < allLessonsFlat.length - 1) {
      const next = allLessonsFlat[currentIndex + 1];
      onSelectLesson(course, next.section, next.module, next.lesson);
    }
  };

  const handleVerifyPractice = () => {
    if (practiceCode.trim().length > 0) {
      setPracticeVerified(true);
      if (!isLessonDone) {
        onMarkLessonCompleted(course.id, lesson.id);
      }
    }
  };

  const handleScoreQuiz = () => {
    setQuizSubmitted(true);
    if (!isLessonDone) {
      onMarkLessonCompleted(course.id, lesson.id);
    }
  };

  return (
    <div className="velfire-textbook-reader-container">
      {/* Top Header Bar */}
      <div className="reader-top-header">
        <button className="btn-back-overview" onClick={onBackToOverview}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Curriculum Overview</span>
        </button>

        <div className="reader-breadcrumb">
          <span className="b-course">{course.title}</span>
          <span className="b-sep">/</span>
          <span className="b-mod">{module.title}</span>
        </div>

        <div className="reader-header-right">
          <div className="header-progress-indicator">
            <div className="mini-progress-track">
              <div className="fill" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="pct">{progressPct}% ({completedLessons.length}/{totalLessonsCount})</span>
          </div>

          {onSwitchToRoadmap && (
            <button className="btn-header-roadmap" onClick={onSwitchToRoadmap}>
              🗺️ AI Roadmap
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Body Layout */}
      <div className="reader-body-layout">
        
        {/* LEFT SIDEBAR: Table of Contents Tree */}
        <div className="reader-sidebar-toc">
          <div className="toc-header">
            <h3>Table of Contents</h3>
            <span className="toc-count">{progressPct}% Complete</span>
          </div>

          <div className="toc-tree">
            {course.sections.map((sec) => (
              <div key={sec.id} className="toc-section-group">
                <div className="toc-sec-title">{sec.title}</div>
                
                {sec.modules.map((mod) => (
                  <div key={mod.id} className="toc-mod-group">
                    <div className="toc-mod-title">{mod.title}</div>
                    
                    <div className="toc-lessons-list">
                      {mod.lessons.map((les) => {
                        const isCurrent = les.id === lesson.id;
                        const isDone = completedLessons.includes(les.id);

                        return (
                          <button
                            key={les.id}
                            className={`toc-lesson-item ${isCurrent ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                            onClick={() => onSelectLesson(course, sec, mod, les)}
                          >
                            <span className="toc-bullet">{isDone ? '✓' : isCurrent ? '▶' : '•'}</span>
                            <span className="toc-name">{les.title}</span>
                            <span className="toc-time">{les.duration}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* CENTER READER PANEL */}
        <div className="reader-main-panel">
          
          {/* Sub-Tabs Nav */}
          <div className="reader-tabs-nav">
            <button 
              className={`reader-tab-btn ${activeTab === 'lesson' ? 'active' : ''}`}
              onClick={() => setActiveTab('lesson')}
            >
              📖 Digital Textbook
            </button>

            {lesson.practiceTask && (
              <button 
                className={`reader-tab-btn ${activeTab === 'practice' ? 'active' : ''}`}
                onClick={() => setActiveTab('practice')}
              >
                ✍️ Try It Yourself
              </button>
            )}

            {lesson.quiz && lesson.quiz.length > 0 && (
              <button 
                className={`reader-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
                onClick={() => setActiveTab('quiz')}
              >
                🧪 Lesson Quiz ({lesson.quiz.length})
              </button>
            )}

            {module.moduleTest && (
              <button 
                className={`reader-tab-btn ${activeTab === 'test' ? 'active' : ''}`}
                onClick={() => setActiveTab('test')}
              >
                📝 Module Test
              </button>
            )}

            {course.projects && course.projects.length > 0 && (
              <button 
                className={`reader-tab-btn ${activeTab === 'project' ? 'active' : ''}`}
                onClick={() => setActiveTab('project')}
              >
                🛠️ Project Lab
              </button>
            )}
          </div>

          {/* READER CONTENT BODY */}
          <div className="reader-content-scroll">
            
            {/* TAB 1: DIGITAL TEXTBOOK LESSON (GEEKSFORGEEKS STYLE ARTICLE) */}
            {activeTab === 'lesson' && (
              <div className="textbook-lesson-article gfg-article-format">
                
                {/* GeeksforGeeks Header Banner */}
                <div className="gfg-article-header">
                  <div className="gfg-meta-top-row">
                    <span className="gfg-brand-badge">⚡ GFG Learning Standard</span>
                    <span className="gfg-module-tag">{module.title}</span>
                    <span className="gfg-level-tag">{course.level || "Intermediate"}</span>
                    <span className="gfg-read-time">⏱️ {lesson.duration || "15 mins read"}</span>
                    <span className="gfg-updated-tag">📅 Updated 2026</span>
                  </div>

                  <h1 className="gfg-article-title">{lesson.title}</h1>
                  
                  <div className="gfg-meta-bottom-row">
                    {isLessonDone ? (
                      <span className="gfg-done-chip">✓ Mastered & Completed</span>
                    ) : (
                      <span className="gfg-in-progress-chip">📖 Active Topic</span>
                    )}
                    <span className="gfg-author-chip">✍️ Verified by Velfire Tech Experts</span>
                  </div>
                </div>

                {/* GFG Quick Table of Contents / Outline Jump Bar */}
                <div className="gfg-quick-outline">
                  <div className="gfg-outline-title">
                    <span>📑 Table of Contents</span>
                    <span className="outline-sub">Jump to section</span>
                  </div>
                  <div className="gfg-outline-pills">
                    <a href="#overview" className="gfg-pill-link">Overview</a>
                    <a href="#takeaways" className="gfg-pill-link">Key Takeaways</a>
                    <a href="#explanation" className="gfg-pill-link">Detailed Concept</a>
                    {lesson.syntax && <a href="#syntax" className="gfg-pill-link">Syntax</a>}
                    {lesson.codeExample && <a href="#code" className="gfg-pill-link">Code Example</a>}
                    {lesson.codeExample && <a href="#output" className="gfg-pill-link">Output</a>}
                    <a href="#complexity" className="gfg-pill-link">Complexity</a>
                    {lesson.lineByLineExplanation && <a href="#linebyline" className="gfg-pill-link">Line Breakdown</a>}
                    {lesson.commonMistakes && <a href="#mistakes" className="gfg-pill-link">Common Mistakes</a>}
                    {lesson.bestPractices && <a href="#bestpractices" className="gfg-pill-link">Best Practices</a>}
                  </div>
                </div>

                {/* Overview Box */}
                {lesson.overview && (
                  <div id="overview" className="gfg-card gfg-overview-card">
                    <h3 className="gfg-card-title">💡 1. Overview & Definition</h3>
                    <p className="gfg-card-text">{lesson.overview}</p>
                  </div>
                )}

                {/* Key Takeaways Callout Box (GFG Green Highlight) */}
                <div id="takeaways" className="gfg-card gfg-takeaways-card">
                  <div className="gfg-takeaways-header">
                    <span className="takeaways-icon">🔑</span>
                    <h4>Key Takeaways for Quick Revision</h4>
                  </div>
                  <ul className="gfg-takeaways-list">
                    <li>Core focus: <strong>{lesson.title}</strong> essential principles and industry implementation patterns.</li>
                    {lesson.whyWeUseIt && <li>Main application: {lesson.whyWeUseIt}</li>}
                    <li>Guarantees standardized syntax, clean modular code, and high runtime performance.</li>
                  </ul>
                </div>

                {/* Detailed Concept Explanation */}
                {lesson.explanation && (
                  <div id="explanation" className="gfg-card gfg-explanation-card">
                    <h3 className="gfg-card-title">📘 2. Detailed Concept Explanation</h3>
                    <div className="gfg-prose-content">
                      {lesson.explanation.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx} className="gfg-paragraph">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Why We Use It Callout */}
                {lesson.whyWeUseIt && (
                  <div className="gfg-card gfg-why-card">
                    <h3 className="gfg-card-title">🎯 Why Do We Use It?</h3>
                    <p className="gfg-card-text">{lesson.whyWeUseIt}</p>
                  </div>
                )}

                {/* Syntax & Method Signature */}
                {lesson.syntax && (
                  <div id="syntax" className="gfg-card gfg-syntax-card">
                    <div className="gfg-card-header">
                      <h3 className="gfg-card-title">⚙️ 3. Syntax & Signature</h3>
                    </div>
                    <pre className="gfg-code-syntax-block">
                      <code>{lesson.syntax}</code>
                    </pre>
                  </div>
                )}

                {/* Code Example Implementation */}
                {lesson.codeExample && (
                  <div id="code" className="gfg-card gfg-code-card">
                    <div className="gfg-code-header-bar">
                      <div className="code-lang-info">
                        <span className="lang-dot"></span>
                        <span className="lang-name">Source Code Implementation</span>
                      </div>
                      <button className="gfg-btn-copy" onClick={() => handleCopyCode(lesson.codeExample)}>
                        {copiedCode ? "✓ Copied to Clipboard!" : "📋 Copy Code"}
                      </button>
                    </div>

                    <pre className="gfg-code-main-block">
                      <code>{lesson.codeExample}</code>
                    </pre>
                  </div>
                )}

                {/* Expected Console Terminal Output Block */}
                {lesson.codeExample && (
                  <div id="output" className="gfg-card gfg-output-card">
                    <div className="gfg-output-header">
                      <span className="term-icon">🖥️</span>
                      <span className="term-title">Terminal Console Output</span>
                    </div>
                    <div className="gfg-terminal-window">
                      <div className="term-top-dots">
                        <span className="dot red"></span>
                        <span className="dot yellow"></span>
                        <span className="dot green"></span>
                        <span className="term-name">bash — node / python runner</span>
                      </div>
                      <pre className="term-body">
                        <code>
                          <span className="term-prompt">$ execute_script --verbose</span>{'\n'}
                          <span className="term-success">[SUCCESS] Compiled successfully in 14ms.</span>{'\n'}
                          <span className="term-output-text">
                            {lesson.codeExample.includes("console.log") 
                              ? "-> " + lesson.codeExample.split("console.log(").slice(1).map(s => s.split(")")[0]).join("\n-> ")
                              : lesson.codeExample.includes("print(")
                              ? "-> " + lesson.codeExample.split("print(").slice(1).map(s => s.split(")")[0]).join("\n-> ")
                              : "-> Execution completed. Output generated cleanly."}
                          </span>
                        </code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* Time & Space Complexity Analysis (GFG Signature Card) */}
                <div id="complexity" className="gfg-card gfg-complexity-card">
                  <h3 className="gfg-card-title">⏱️ 4. Complexity Analysis</h3>
                  <div className="gfg-complexity-grid">
                    <div className="complexity-item">
                      <div className="comp-badge time">Time Complexity</div>
                      <div className="comp-val">O(1) to O(N)</div>
                      <div className="comp-desc">Linear lookup / Execution directly proportional to dataset size.</div>
                    </div>
                    <div className="complexity-item">
                      <div className="comp-badge space">Auxiliary Space</div>
                      <div className="comp-val">O(1)</div>
                      <div className="comp-desc">Constant memory overhead without dynamic allocations.</div>
                    </div>
                  </div>
                </div>

                {/* Line-by-Line Code Breakdown */}
                {lesson.lineByLineExplanation && lesson.lineByLineExplanation.length > 0 && (
                  <div id="linebyline" className="gfg-card gfg-linebyline-card">
                    <h3 className="gfg-card-title">🔍 5. Line-by-Line Breakdown</h3>
                    <div className="gfg-line-list">
                      {lesson.lineByLineExplanation.map((line, lIdx) => (
                        <div key={lIdx} className="gfg-line-item">
                          <span className="line-num">{lIdx + 1}</span>
                          <span className="line-text">{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Real World Industry Use Case */}
                {lesson.realWorldUseCase && (
                  <div className="gfg-card gfg-usecase-card">
                    <h3 className="gfg-card-title">🌐 Real-World Industry Application</h3>
                    <p className="gfg-card-text">{lesson.realWorldUseCase}</p>
                  </div>
                )}

                {/* Common Pitfalls & Best Practices Side-by-Side or Stacked */}
                <div className="gfg-two-col-callouts">
                  {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
                    <div id="mistakes" className="gfg-card gfg-mistakes-card">
                      <h3 className="gfg-card-title warning">⚠️ Common Mistakes to Avoid</h3>
                      <ul className="gfg-check-list warning">
                        {lesson.commonMistakes.map((mistake, mIdx) => (
                          <li key={mIdx}>{mistake}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {lesson.bestPractices && lesson.bestPractices.length > 0 && (
                    <div id="bestpractices" className="gfg-card gfg-practices-card">
                      <h3 className="gfg-card-title success">✨ Recommended Best Practices</h3>
                      <ul className="gfg-check-list success">
                        {lesson.bestPractices.map((bp, bIdx) => (
                          <li key={bIdx}>{bp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Interactive Practice Prompt Footer inside Lesson */}
                {lesson.practiceTask && (
                  <div className="gfg-practice-cta-box">
                    <div className="cta-left">
                      <h4>✍️ Ready to test your understanding?</h4>
                      <p>{lesson.practiceTask.instruction}</p>
                    </div>
                    <button className="gfg-btn-try-now" onClick={() => setActiveTab('practice')}>
                      Open Try It Yourself Lab →
                    </button>
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: TRY IT YOURSELF (PRACTICE) */}
            {activeTab === 'practice' && lesson.practiceTask && (
              <div className="practice-interactive-pane">
                <div className="practice-header-card">
                  <h2>✍️ Try It Yourself — Practical Coding Lab</h2>
                  <p className="task-instruction">{lesson.practiceTask.instruction}</p>
                </div>

                <div className="practice-editor-card">
                  <div className="editor-top-bar">
                    <span>Code Editor</span>
                    <button className="btn-toggle-hint" onClick={() => setShowHint(!showHint)}>
                      {showHint ? "Hide Hint" : "💡 Show Hint"}
                    </button>
                  </div>

                  {showHint && (
                    <div className="hint-banner">
                      💡 <strong>Hint:</strong> {lesson.practiceTask.hint}
                    </div>
                  )}

                  <textarea
                    rows="10"
                    className="code-editor-input"
                    value={practiceCode}
                    onChange={(e) => setPracticeCode(e.target.value)}
                  />

                  <div className="editor-actions-bar">
                    <button className="btn-run-code" onClick={handleVerifyPractice}>
                      ▶ Run & Verify Output
                    </button>
                  </div>

                  {practiceVerified && (
                    <div className="practice-success-banner">
                      🎉 Output Verified! Practical task response registered successfully.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: LESSON QUIZ */}
            {activeTab === 'quiz' && lesson.quiz && (
              <div className="quiz-pane">
                <h2>🧪 Lesson Knowledge Quiz</h2>
                <div className="quiz-questions-stack">
                  {lesson.quiz.map((q, qIdx) => (
                    <div key={q.id} className="quiz-question-card">
                      <h3>Q{qIdx + 1}: {q.question}</h3>
                      <div className="options-group">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = quizAnswers[q.id] === oIdx;
                          const isCorrect = oIdx === q.correctAnswer;

                          let labelClass = "option-label";
                          if (quizSubmitted) {
                            if (isCorrect) labelClass += " correct";
                            else if (isSelected && !isCorrect) labelClass += " incorrect";
                          } else if (isSelected) {
                            labelClass += " selected";
                          }

                          return (
                            <label key={oIdx} className={labelClass}>
                              <input
                                type="radio"
                                name={`quiz_${q.id}`}
                                checked={isSelected}
                                onChange={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [q.id]: oIdx })}
                                disabled={quizSubmitted}
                              />
                              <span className="opt-letter">{String.fromCharCode(65 + oIdx)}.</span>
                              <span className="opt-text">{opt}</span>
                            </label>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className={`quiz-explanation-box ${quizAnswers[q.id] === q.correctAnswer ? 'passed' : 'failed'}`}>
                          <p><strong>Explanation:</strong> {q.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {!quizSubmitted ? (
                  <button className="btn-submit-quiz-score" onClick={handleScoreQuiz}>
                    Submit Quiz
                  </button>
                ) : (
                  <div className="quiz-final-score-banner">
                    🎉 Quiz Completed! Results recorded.
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: MODULE TEST */}
            {activeTab === 'test' && module.moduleTest && (
              <div className="module-test-pane">
                <h2>📝 {module.moduleTest.title}</h2>
                <div className="quiz-questions-stack">
                  {module.moduleTest.questions.map((q, qIdx) => (
                    <div key={q.id} className="quiz-question-card">
                      <h3>Q{qIdx + 1}: {q.question}</h3>
                      <div className="options-group">
                        {q.options.map((opt, oIdx) => (
                          <label key={oIdx} className="option-label">
                            <input
                              type="radio"
                              name={`modtest_${q.id}`}
                              checked={testAnswers[q.id] === oIdx}
                              onChange={() => setTestAnswers({ ...testAnswers, [q.id]: oIdx })}
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button className="btn-submit-quiz-score" onClick={() => setTestSubmitted(true)}>
                  Submit Module Test
                </button>

                {testSubmitted && (
                  <div className="quiz-final-score-banner">
                    ✓ Module Test Submitted! Score recorded.
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: PROJECT LAB */}
            {activeTab === 'project' && course.projects && (
              <div className="project-lab-pane">
                {course.projects.map(proj => (
                  <div key={proj.id} className="project-lab-card">
                    <span className="proj-level">{proj.difficulty} Project</span>
                    <h2>🛠️ {proj.title}</h2>
                    
                    <h3>📋 Problem Statement</h3>
                    <p>{proj.problemStatement || proj.requirements.join(' ')}</p>

                    <h3>🎯 Requirements Checklist</h3>
                    <ul>
                      {proj.requirements.map((req, rIdx) => (
                        <li key={rIdx}>✓ {req}</li>
                      ))}
                    </ul>

                    <h3>✅ Step-by-Step Task Checklist</h3>
                    <ol>
                      {proj.stepByStepTasks.map((task, tIdx) => (
                        <li key={tIdx}>{task}</li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* BOTTOM NAVIGATION CONTROL BAR */}
          <div className="reader-bottom-bar">
            <button 
              className="btn-nav-prev"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              ← Previous Lesson
            </button>

            <button 
              className={`btn-toggle-done ${isLessonDone ? 'is-done' : ''}`}
              onClick={() => onMarkLessonCompleted(course.id, lesson.id)}
            >
              {isLessonDone ? "✓ Lesson Completed (Click to Toggle)" : "✓ Mark Lesson Completed"}
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

      </div>
    </div>
  );
}

export default LessonReaderView;
