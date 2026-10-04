// src/components/curriculum/CurriculumMainView.jsx
import React, { useState, useMemo } from 'react';
import CurriculumCard from './CurriculumCard';
import { 
  CURRICULUM_DATA, 
  CURRICULUM_CATEGORIES, 
  DIFFICULTY_LEVELS,
  PROFESSIONAL_SKILLS_LIST
} from '../../data/curriculumData';

function CurriculumMainView({ 
  userProgress = {}, 
  onExploreCourse,
  onStartCourse,
  onSwitchToRoadmap
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [showProfSkills, setShowProfSkills] = useState(true);

  // Identify the most active/recent course for 1-click Quick Resume
  const activeCourse = useMemo(() => {
    for (const course of CURRICULUM_DATA) {
      const prog = userProgress[course.id];
      if (prog && ((prog.completedLessons && prog.completedLessons.length > 0) || (prog.completedTopics && prog.completedTopics.length > 0))) {
        return course;
      }
    }
    return CURRICULUM_DATA[0];
  }, [userProgress]);

  const activeProgressPct = useMemo(() => {
    if (!activeCourse) return 0;
    const prog = userProgress[activeCourse.id];
    if (!prog || !prog.completedLessons) return 0;
    const totalTopics = activeCourse.modules.reduce((sum, m) => sum + (m.topics ? m.topics.length : 0), 0) || 10;
    return Math.round((prog.completedLessons.length / totalTopics) * 100);
  }, [activeCourse, userProgress]);

  // Filter courses based on search, category, and level
  const filteredCourses = useMemo(() => {
    return CURRICULUM_DATA.filter(course => {
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
        const matchesSkills = course.skillsCovered ? course.skillsCovered.some(s => s.toLowerCase().includes(query)) : false;
        if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesSkills) {
          return false;
        }
      }
      return true;
    });
  }, [searchTerm, selectedCategory, selectedLevel]);

  // Calculate course completion progress %
  const getCourseProgressPct = (course) => {
    const prog = userProgress[course.id];
    if (!prog) return 0;
    const completedCount = (prog.completedLessons ? prog.completedLessons.length : 0) || 
                          (prog.completedTopics ? prog.completedTopics.length : 0);
    const totalTopics = course.modules.reduce((sum, m) => sum + (m.topics ? m.topics.length : 0), 0) || 10;
    return Math.min(100, Math.round((completedCount / totalTopics) * 100));
  };

  return (
    <div className="curriculum-main-view">
      {/* Top Banner Header with Quick Resume Box */}
      <div className="curriculum-hero-banner">
        <div className="hero-text-block">
          <div className="hero-pill">⚡ VELLIFE Interactive Course Hub</div>
          <h1 className="hero-heading">VELLIFE Courses</h1>
          <p className="hero-subheading">
            Learn with high-speed interactive modules, step-by-step textbook lessons, and real-world placement projects.
          </p>

          {/* Quick Resume Strip */}
          {activeCourse && (
            <div className="quick-resume-card">
              <div className="quick-resume-left">
                <span className="quick-resume-tag">⚡ Current Course</span>
                <h4 className="quick-resume-title">{activeCourse.title}</h4>
                <div className="quick-resume-meta">
                  <span>{activeCourse.level}</span>
                  <span>•</span>
                  <span>{activeCourse.category}</span>
                  <span>•</span>
                  <span>{activeProgressPct}% Completed</span>
                </div>
              </div>

              <div className="quick-resume-actions">
                <button 
                  className="btn-quick-resume-action"
                  onClick={() => onStartCourse ? onStartCourse(activeCourse) : onExploreCourse(activeCourse)}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  <span>{activeProgressPct > 0 ? "Resume Course" : "Start Course"}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {onSwitchToRoadmap && (
          <button className="btn-hero-roadmap-link" onClick={onSwitchToRoadmap}>
            <span>🗺️ AI Career Roadmap</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        )}
      </div>

      {/* Quick Metrics Strip */}
      <div className="curriculum-metrics-strip">
        <div className="metric-pill-item">
          <span className="metric-pill-icon">📚</span>
          <div className="metric-pill-text">
            <strong>{CURRICULUM_DATA.length} Pathways</strong>
            <span>Curated Career Tracks</span>
          </div>
        </div>
        <div className="metric-pill-item">
          <span className="metric-pill-icon">⚡</span>
          <div className="metric-pill-text">
            <strong>Self-Paced & Live</strong>
            <span>Hands-on Code & Practice</span>
          </div>
        </div>
        <div className="metric-pill-item">
          <span className="metric-pill-icon">🏆</span>
          <div className="metric-pill-text">
            <strong>Certifications</strong>
            <span>Industry Accredited</span>
          </div>
        </div>
        <div className="metric-pill-item">
          <span className="metric-pill-icon">💼</span>
          <div className="metric-pill-text">
            <strong>Interview Ready</strong>
            <span>ATS Resumes & Mock Tests</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="curriculum-filter-bar">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="curriculum-search-input"
            placeholder="Search learning paths, modules, or skills (e.g. Full Stack, Python, React, AI, SQL, SAP)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="btn-clear-search" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>

        <div className="filters-row-group">
          {/* Level Filter Dropdown */}
          <div className="filter-select-group">
            <label>Level:</label>
            <select
              className="select-level-dropdown"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              {DIFFICULTY_LEVELS.map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          {/* Category Filter Pills */}
          <div className="category-pills-row">
            {CURRICULUM_CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`category-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 1: PROFESSIONAL CAREER PATHWAYS */}
      <div className="curriculum-section">
        <div className="section-title-row">
          <h2 className="section-main-title">
            🚀 Career Curriculum Pathways
            {selectedCategory !== 'All' ? ` — ${selectedCategory}` : ''}
          </h2>
          <span className="count-badge">{filteredCourses.length} Learning Path{filteredCourses.length !== 1 ? 's' : ''}</span>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="curriculum-grid">
            {filteredCourses.map(course => (
              <CurriculumCard
                key={course.id}
                course={course}
                progress={getCourseProgressPct(course)}
                onExplore={onExploreCourse}
                onStartCourse={onStartCourse}
              />
            ))}
          </div>
        ) : (
          <div className="curriculum-empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No curriculum pathways match your search</h3>
            <p>Try resetting your category or skill-level filters to view all available career paths.</p>
            <button
              className="btn-reset-curriculum-filters"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedLevel('All');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* SECTION 2: PROFESSIONAL CAREER SKILLS */}
      {(selectedCategory === 'All' || selectedCategory === 'Professional Skills') && (
        <div className="curriculum-section professional-skills-section">
          <div className="section-title-row">
            <div>
              <h2 className="section-main-title">🌟 Professional Career Skills</h2>
              <p className="section-subtext">
                Essential workplace, communication, placement, and soft skills required to crack technical hiring loops.
              </p>
            </div>
            <button 
              className="btn-toggle-skills"
              onClick={() => setShowProfSkills(!showProfSkills)}
            >
              {showProfSkills ? "Hide Skills" : "Show Skills"}
            </button>
          </div>

          {showProfSkills && (
            <div className="prof-skills-grid">
              {PROFESSIONAL_SKILLS_LIST.map(skill => (
                <div key={skill.id} className="prof-skill-card">
                  <span className="skill-card-icon">{skill.icon}</span>
                  <div className="skill-card-content">
                    <h4>{skill.name}</h4>
                    <p>{skill.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CurriculumMainView;
