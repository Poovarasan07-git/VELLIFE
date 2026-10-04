// src/components/courses/CourseCard.jsx
import React from 'react';

function CourseCard({ course, progress = 0, onSelectCourse, onStartLearning }) {
  const isStarted = progress > 0;
  const isCompleted = progress >= 100;

  const totalLessonsCount = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="vellife-course-card">
      <div 
        className="course-card-header" 
        style={{ background: course.bannerGradient || "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}
      >
        <div className="card-header-top">
          <span className="category-badge">{course.category}</span>
          <span className={`level-badge ${course.level.toLowerCase()}`}>{course.level}</span>
        </div>

        <div className="course-icon-display">
          <span className="course-emoji">{course.icon || "📚"}</span>
        </div>
      </div>

      <div className="course-card-body">
        <h3 className="course-card-title">{course.title}</h3>
        <p className="course-card-desc">{course.shortDescription}</p>

        <div className="course-card-meta">
          <div className="meta-item">
            <span className="meta-icon">📦</span>
            <span>{course.modules.length} Modules ({totalLessonsCount} Lessons)</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">⏱️</span>
            <span>{course.estimatedDuration}</span>
          </div>
        </div>

        {course.instructor && (
          <div className="instructor-row">
            <span className="instructor-avatar">{course.instructor.avatar || "👨‍🏫"}</span>
            <div className="instructor-info">
              <span className="instructor-name">{course.instructor.name}</span>
              <span className="instructor-title">{course.instructor.title}</span>
            </div>
          </div>
        )}

        <div className="course-progress-block">
          <div className="progress-info">
            <span className="progress-label">
              {isCompleted ? "✓ Completed" : isStarted ? "In Progress" : "Not Started"}
            </span>
            <span className="progress-percentage">{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar-track">
            <div 
              className={`progress-bar-fill ${isCompleted ? "completed" : ""}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>

        <div className="course-card-actions">
          <button 
            className="btn-card-details"
            onClick={() => onSelectCourse(course)}
          >
            Details
          </button>
          <button 
            className={`btn-card-action ${isStarted ? "btn-continue" : "btn-start"}`}
            onClick={() => onStartLearning(course)}
          >
            <span>{isCompleted ? "Review Course" : isStarted ? "Continue Learning" : "Start Learning"}</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
