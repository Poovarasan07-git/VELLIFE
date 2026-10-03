// src/components/courses/CoursesMainView.jsx
import React, { useState, useMemo } from 'react';
import CourseCard from './CourseCard';
import { 
  COURSES_DATA, 
  COURSE_CATEGORIES, 
  DIFFICULTY_LEVELS, 
  CAREER_COURSE_RECOMMENDATIONS 
} from '../../data/coursesData';

function CoursesMainView({ 
  selectedDomain, 
  userProgress = {}, 
  onSelectCourse, 
  onStartLearning,
  onSwitchToRoadmap
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  // Calculate user progress metrics
  const progressStats = useMemo(() => {
    const courseIds = Object.keys(userProgress);
    let totalCompletedCourses = 0;
    let totalStartedCourses = 0;
    let totalCompletedLessonsCount = 0;

    COURSES_DATA.forEach(course => {
      const prog = userProgress[course.id];
      if (prog && prog.completedLessons && prog.completedLessons.length > 0) {
        totalStartedCourses++;
        totalCompletedLessonsCount += prog.completedLessons.length;

        const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
        if (prog.completedLessons.length >= totalLessons && totalLessons > 0) {
          totalCompletedCourses++;
        }
      }
    });

    return {
      totalStarted: totalStartedCourses,
      totalCompleted: totalCompletedCourses,
      totalLessons: totalCompletedLessonsCount
    };
  }, [userProgress]);

  // Recommended courses for user's career domain
  const recommendedCourses = useMemo(() => {
    const recommendedIds = CAREER_COURSE_RECOMMENDATIONS[selectedDomain] || CAREER_COURSE_RECOMMENDATIONS["Full Stack Development"];
    return COURSES_DATA.filter(course => recommendedIds.includes(course.id));
  }, [selectedDomain]);

  // Filtered courses based on search term, category, level
  const filteredCourses = useMemo(() => {
    return COURSES_DATA.filter(course => {
      // Category match
      if (selectedCategory !== 'All' && course.category !== selectedCategory) {
        return false;
      }
      // Level match
      if (selectedLevel !== 'All' && course.level !== selectedLevel) {
        return false;
      }
      // Search term match
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(query);
        const matchesDesc = course.shortDescription.toLowerCase().includes(query);
        const matchesCategory = course.category.toLowerCase().includes(query);
        const matchesSkills = course.skills.some(s => s.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesSkills) {
          return false;
        }
      }
      return true;
    });
  }, [searchTerm, selectedCategory, selectedLevel]);

  const calculateCourseProgress = (course) => {
    const prog = userProgress[course.id];
    if (!prog || !prog.completedLessons) return 0;
    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    if (totalLessons === 0) return 0;
    return Math.round((prog.completedLessons.length / totalLessons) * 100);
  };

  return (
    <div className="velfire-courses-main-container">
      {/* Top Banner Header */}
      <div className="courses-hero-banner">
        <div className="hero-content">
          <div className="hero-badge">🎓 VELFIRE Full Curriculum</div>
          <h1 className="hero-title">velfire Courses</h1>
          <p className="hero-subtitle">
            "Build the skills you need for your career, one step at a time."
          </p>
        </div>

        {onSwitchToRoadmap && (
          <button className="btn-roadmap-banner-link" onClick={onSwitchToRoadmap}>
            <span>🗺️ AI Career Roadmap</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        )}
      </div>

      {/* Progress Stats Summary Bar */}
      <div className="courses-stats-strip">
        <div className="stat-card">
          <span className="stat-icon">📚</span>
          <div className="stat-details">
            <span className="stat-val">{COURSES_DATA.length}</span>
            <span className="stat-lbl">Available Courses</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🔥</span>
          <div className="stat-details">
            <span className="stat-val">{progressStats.totalStarted}</span>
            <span className="stat-lbl">In Progress</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🏆</span>
          <div className="stat-details">
            <span className="stat-val">{progressStats.totalCompleted}</span>
            <span className="stat-lbl">Completed</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">⚡</span>
          <div className="stat-details">
            <span className="stat-val">{progressStats.totalLessons}</span>
            <span className="stat-lbl">Lessons Finished</span>
          </div>
        </div>
      </div>

      {/* Recommended for Your Career Domain Section */}
      <div className="career-recommendation-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">
              🎯 Recommended for your career ({selectedDomain})
            </h2>
            <p className="section-sub">
              Curated course pathway matching your targeted domain skills.
            </p>
          </div>
        </div>

        <div className="recommendations-scroll-grid">
          {recommendedCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              progress={calculateCourseProgress(course)}
              onSelectCourse={onSelectCourse}
              onStartLearning={onStartLearning}
            />
          ))}
        </div>
      </div>

      {/* Search and Filters Controls */}
      <div className="courses-filter-toolbar">
        {/* Search Input */}
        <div className="search-box-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search courses by name, topic, or skills (e.g. Python, SQL, React)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>

        <div className="filters-row">
          {/* Level Filter Dropdown */}
          <div className="level-select-wrapper">
            <label className="filter-label">Level:</label>
            <select
              className="level-dropdown"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              {DIFFICULTY_LEVELS.map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          {/* Category Filter Pills */}
          <div className="categories-pills-scroll">
            {COURSE_CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Grid Section */}
      <div className="all-courses-section">
        <div className="section-header-row">
          <h2 className="section-title">
            📚 All Courses {selectedCategory !== 'All' ? `(${selectedCategory})` : ''}
          </h2>
          <span className="results-count">Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}</span>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="courses-grid">
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                progress={calculateCourseProgress(course)}
                onSelectCourse={onSelectCourse}
                onStartLearning={onStartLearning}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="courses-empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No courses found</h3>
            <p>Try changing your search keywords or adjusting your category/level filters.</p>
            <button 
              className="btn-reset-filters"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedLevel('All');
              }}
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CoursesMainView;
