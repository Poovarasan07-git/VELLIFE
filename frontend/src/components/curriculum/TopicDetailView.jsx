// src/components/curriculum/TopicDetailView.jsx
import React, { useState, useEffect } from 'react';

function TopicDetailView({ 
  course, 
  module, 
  topic, 
  userProgress = {}, 
  onBackToCourseDetail, 
  onNavigateTopic,
  onMarkTopicCompleted,
  onSwitchToRoadmap
}) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [exerciseInput, setExerciseInput] = useState('');
  const [exercisePassed, setExercisePassed] = useState(false);

  // Mini quiz state
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const prog = userProgress[course.id] || { completedTopics: [] };
  const completedTopics = prog.completedTopics || [];
  const isCompleted = completedTopics.includes(topic.id);

  // Flatten all topics across all modules for Previous/Next navigation
  const allTopicsFlat = [];
  course.modules.forEach(mod => {
    if (mod.topics) {
      mod.topics.forEach(top => {
        allTopicsFlat.push({ module: mod, topic: top });
      });
    }
  });

  const currentIndex = allTopicsFlat.findIndex(item => item.topic.id === topic.id);

  useEffect(() => {
    // Reset state on topic change
    setCopiedCode(false);
    setShowHint(false);
    setExerciseInput('');
    setExercisePassed(false);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
  }, [topic.id]);

  const handleCopyCode = () => {
    if (topic.example && topic.example.codeSnippet) {
      navigator.clipboard.writeText(topic.example.codeSnippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prev = allTopicsFlat[currentIndex - 1];
      onNavigateTopic(course, prev.module, prev.topic);
    }
  };

  const handleNext = () => {
    if (currentIndex < allTopicsFlat.length - 1) {
      const next = allTopicsFlat[currentIndex + 1];
      onNavigateTopic(course, next.module, next.topic);
    }
  };

  const handleVerifyExercise = () => {
    if (exerciseInput.trim().length > 0) {
      setExercisePassed(true);
      if (!isCompleted) {
        onMarkTopicCompleted(course.id, topic.id);
      }
    }
  };

  const handleQuizSubmit = () => {
    if (selectedQuizOption !== null) {
      setQuizSubmitted(true);
      if (selectedQuizOption === topic.miniQuiz.correctAnswer && !isCompleted) {
        onMarkTopicCompleted(course.id, topic.id);
      }
    }
  };

  return (
    <div className="topic-detail-view-container">
      {/* Top Header Bar */}
      <div className="topic-top-header">
        <button className="btn-return-course" onClick={onBackToCourseDetail}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Curriculum Modules</span>
        </button>

        <div className="header-hierarchy">
          <span className="course-title-tag">{course.title}</span>
          <span className="sep">/</span>
          <span className="mod-title-tag">{module.title}</span>
        </div>

        {onSwitchToRoadmap && (
          <button className="btn-switch-roadmap-header" onClick={onSwitchToRoadmap}>
            🗺️ AI Roadmap
          </button>
        )}
      </div>

      {/* Main Topic Body */}
      <div className="topic-body-content">
        <div className="topic-content-scroll">

          {/* Title Header */}
          <div className="topic-hero-header">
            <span className="topic-module-badge">{module.title}</span>
            <h1 className="topic-title-text">{topic.title}</h1>
            <div className="topic-tags-bar">
              <span className="tag-time">⏱️ {topic.duration || "30 min"}</span>
              {isCompleted && (
                <span className="tag-completed">✓ Topic Completed</span>
              )}
            </div>
          </div>

          {/* Simple Explanation */}
          <div className="topic-section-box">
            <h3 className="section-box-title">📘 Simple Explanation</h3>
            <p className="explanation-paragraph">{topic.explanation}</p>
          </div>

          {/* Learning Objectives */}
          {topic.objectives && topic.objectives.length > 0 && (
            <div className="topic-section-box">
              <h3 className="section-box-title">🎯 Learning Objectives</h3>
              <ul className="objectives-bullet-list">
                {topic.objectives.map((obj, idx) => (
                  <li key={idx}>
                    <span className="check-icon">✓</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Subtopics Checklist */}
          {topic.subtopics && topic.subtopics.length > 0 && (
            <div className="topic-section-box">
              <h3 className="section-box-title">📑 Concept Checklist & Subtopics</h3>
              <div className="subtopics-chips-grid">
                {topic.subtopics.map((st, idx) => (
                  <div key={idx} className="subtopic-chip">
                    <span className="chip-bullet">•</span>
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code & Practical Example */}
          {topic.example && (
            <div className="topic-section-box code-section">
              <div className="code-header-row">
                <span className="code-label">Code & Practical Example</span>
                {topic.example.codeSnippet && (
                  <button className="btn-copy-code" onClick={handleCopyCode}>
                    {copiedCode ? "✓ Copied!" : "📋 Copy Code"}
                  </button>
                )}
              </div>
              {topic.example.description && (
                <p className="example-desc">{topic.example.description}</p>
              )}
              {topic.example.codeSnippet && (
                <pre className="code-block">
                  <code>{topic.example.codeSnippet}</code>
                </pre>
              )}
            </div>
          )}

          {/* Practical Exercise */}
          {topic.practicalExercise && (
            <div className="topic-section-box exercise-section">
              <div className="exercise-header">
                <h3 className="section-box-title">✍️ Practical Exercise Task</h3>
                <button 
                  className="btn-toggle-hint"
                  onClick={() => setShowHint(!showHint)}
                >
                  {showHint ? "Hide Hint" : "💡 Show Hint"}
                </button>
              </div>

              <h4 className="exercise-task-title">{topic.practicalExercise.title}</h4>
              <p className="exercise-instruction">{topic.practicalExercise.task}</p>

              {showHint && (
                <div className="exercise-hint-box">
                  💡 <strong>Hint:</strong> {topic.practicalExercise.hint}
                </div>
              )}

              <div className="exercise-input-wrapper">
                <textarea
                  rows="3"
                  className="exercise-textarea"
                  placeholder="Write your code or answer here..."
                  value={exerciseInput}
                  onChange={(e) => setExerciseInput(e.target.value)}
                />
                <button 
                  className="btn-verify-exercise"
                  onClick={handleVerifyExercise}
                >
                  Verify Task Output
                </button>
              </div>

              {exercisePassed && (
                <div className="exercise-success-notice">
                  🎉 Practical task verified! Progress saved.
                </div>
              )}
            </div>
          )}

          {/* Mini Quiz */}
          {topic.miniQuiz && (
            <div className="topic-section-box quiz-section">
              <h3 className="section-box-title">🧪 Mini Quiz</h3>
              <h4 className="quiz-question">{topic.miniQuiz.question}</h4>

              <div className="quiz-options-group">
                {topic.miniQuiz.options.map((opt, oIdx) => {
                  const isSelected = selectedQuizOption === oIdx;
                  const isCorrect = oIdx === topic.miniQuiz.correctAnswer;
                  
                  let optionClass = "quiz-option-label";
                  if (quizSubmitted) {
                    if (isCorrect) optionClass += " correct";
                    else if (isSelected && !isCorrect) optionClass += " incorrect";
                  } else if (isSelected) {
                    optionClass += " selected";
                  }

                  return (
                    <label key={oIdx} className={optionClass}>
                      <input
                        type="radio"
                        name="mini_quiz"
                        checked={isSelected}
                        onChange={() => !quizSubmitted && setSelectedQuizOption(oIdx)}
                        disabled={quizSubmitted}
                      />
                      <span className="opt-letter">{String.fromCharCode(65 + oIdx)}.</span>
                      <span className="opt-text">{opt}</span>
                    </label>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <button 
                  className="btn-submit-quiz"
                  disabled={selectedQuizOption === null}
                  onClick={handleQuizSubmit}
                >
                  Submit Answer
                </button>
              ) : (
                <div className={`quiz-feedback-box ${selectedQuizOption === topic.miniQuiz.correctAnswer ? 'passed' : 'failed'}`}>
                  <h4>
                    {selectedQuizOption === topic.miniQuiz.correctAnswer ? "✓ Correct!" : "✗ Incorrect"}
                  </h4>
                  <p>{topic.miniQuiz.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* Additional Resources */}
          {topic.resources && topic.resources.length > 0 && (
            <div className="topic-section-box resources-section">
              <h3 className="section-box-title">🔗 Learning Resources</h3>
              <ul className="resources-list">
                {topic.resources.map((res, rIdx) => (
                  <li key={rIdx}>
                    <a href={res.url} target="_blank" rel="noreferrer" className="resource-link">
                      🌐 {res.title} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Bottom Control Bar */}
        <div className="topic-bottom-bar">
          <button 
            className="btn-nav-prev"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            ← Previous Topic
          </button>

          <button 
            className={`btn-toggle-complete ${isCompleted ? 'completed' : ''}`}
            onClick={() => onMarkTopicCompleted(course.id, topic.id)}
          >
            {isCompleted ? "✓ Topic Completed (Click to Toggle)" : "✓ Mark Topic Completed"}
          </button>

          <button 
            className="btn-nav-next"
            onClick={handleNext}
            disabled={currentIndex === allTopicsFlat.length - 1}
          >
            Next Topic →
          </button>
        </div>
      </div>
    </div>
  );
}

export default TopicDetailView;
