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
  onSwitchToRoadmap
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [showProfSkills, setShowProfSkills] = useState(true);

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
    if (!prog || !prog.completedTopics) return 0;
    
    // Total topics count across all modules
    const totalTopics = course.modules.reduce((sum, m) => sum + (m.topics ? m.topics.length : 0), 0);
    if (totalTopics === 0) return 0;
    return Math.round((prog.completedTopics.length / totalTopics) * 100);
  };

  return (
    <div className="curriculum-main-view">
      {/* Top Banner Header */}
      <div className="curriculum-hero-banner">
        <div className="hero-text-block">
          <div className="hero-pill">🎓 Professional Career Pathways</div>
          <h1 className="hero-heading">Full Curriculum</h1>
          <p className="hero-subheading">
            Explore complete learning paths designed for your career.
          </p>
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
            placeholder="Search learning paths, modules, or skills (e.g. Full Stack, React, SQL, AI, SAP)..."
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
