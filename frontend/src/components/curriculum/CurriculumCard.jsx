// src/components/curriculum/CurriculumCard.jsx
import React from 'react';

function CurriculumCard({ course, progress = 0, onExplore, onStartCourse }) {
  const isStarted = progress > 0;
  const isCompleted = progress >= 100;

  // Calculate total topics across all modules
  const totalTopicsCount = course.modules.reduce(
    (acc, m) => acc + (m.topics ? m.topics.length : 0),
    0
  );

  return (
    <div className="curriculum-card">
      <div 
        className="curriculum-card-banner"
        style={{ background: course.bannerGradient || "linear-gradient(135deg, rgba(2, 44, 34, 0.95) 0%, rgba(6, 78, 59, 0.97) 100%)" }}
      >
        <div className="banner-top-tags">
          <span className="cat-badge">{course.category}</span>
          <span className={`level-badge ${course.level.toLowerCase()}`}>{course.level}</span>
        </div>

        <div className="card-icon-area">
          <span className="card-emoji">{course.icon || "🎓"}</span>
        </div>
      </div>

      <div className="curriculum-card-body">
        <h3 className="card-title">{course.title}</h3>
        <p className="card-desc">{course.shortDescription}</p>

        <div className="card-stats-grid">
          <div className="stat-pill">
            <span className="pill-icon">📦</span>
            <span>{course.modules.length} Modules</span>
          </div>
          <div className="stat-pill">
            <span className="pill-icon">📖</span>
            <span>{totalTopicsCount} Topics</span>
          </div>
          <div className="stat-pill">
            <span className="pill-icon">⏱️</span>
            <span>{course.estimatedDuration}</span>
          </div>
        </div>

        {course.skillsCovered && course.skillsCovered.length > 0 && (
          <div className="card-skills-row">
            {course.skillsCovered.slice(0, 4).map((skill, sIdx) => (
              <span key={sIdx} className="skill-chip">{skill}</span>
            ))}
            {course.skillsCovered.length > 4 && (
              <span className="skill-chip more">+{course.skillsCovered.length - 4} more</span>
            )}
          </div>
        )}

        <div className="card-progress-bar-area">
          <div className="progress-info-row">
            <span className="status-text">
              {isCompleted ? "✓ Completed" : isStarted ? "In Progress" : "Ready to Start"}
            </span>
            <span className="percentage-text">{Math.round(progress)}%</span>
          </div>
          <div className="progress-track">
            <div 
              className={`progress-fill ${isCompleted ? 'completed' : ''}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>

        {/* Dual Quick Action Buttons for Easy 1-Click Learning */}
        <div className="card-actions-row">
          <button 
            className="btn-card-learn-primary"
            onClick={() => onStartCourse ? onStartCourse(course) : onExplore(course)}
            title="Start or Continue Learning this course"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span>{isCompleted ? "Review Lessons" : isStarted ? "Continue" : "Start Learning"}</span>
          </button>

          <button 
            className="btn-card-syllabus-secondary"
            onClick={() => onExplore(course)}
            title="View Full Curriculum Syllabus"
          >
            <span>Syllabus</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CurriculumCard;
