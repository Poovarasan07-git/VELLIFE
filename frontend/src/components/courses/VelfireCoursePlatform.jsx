// src/components/courses/VelfireCoursePlatform.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { COURSES_DATA, CAREER_COURSE_RECOMMENDATIONS } from '../../data/coursesData';
import ResumeBuilderView from '../career/ResumeBuilderView';
import ResumeAnalyzerView from '../career/ResumeAnalyzerView';
import CourseLessonView from './CourseLessonView';
import './VelfireCoursePlatform.css';

export default function VelfireCoursePlatform({
  selectedDomain = "Full Stack Development",
  onSwitchToRoadmap,
  onBackToChoice
}) {
  // Navigation Section: 'text' | 'recorded' | 'live'
  const [activeCourseSection, setActiveCourseSection] = useState('text');

  // Sub-view overlays / modes: 'hub' | 'text_lesson' | 'video_player' | 'live_staging' | 'resume_builder' | 'resume_analyzer'
  const [activeSubView, setActiveSubView] = useState('hub');

  // Active items for detail/player views
  const [activeTextCourse, setActiveTextCourse] = useState(null);
  const [activeTextModuleId, setActiveTextModuleId] = useState(null);
  const [activeTextLessonId, setActiveTextLessonId] = useState(null);

  const [activeRecordedVideo, setActiveRecordedVideo] = useState(null);
  const [activeLiveClass, setActiveLiveClass] = useState(null);

  // Live filter state (to demonstrate both upcoming classes and the required empty state)
  const [liveFilter, setLiveFilter] = useState('all'); // 'all' | 'live_now' | 'upcoming' | 'none_demo'

  // User progress persisted in localStorage
  const [userProgress, setUserProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('velfire_course_progress');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Recorded video completion state
  const [watchedVideos, setWatchedVideos] = useState(() => {
    try {
      const saved = localStorage.getItem('velfire_watched_videos');
      return saved ? JSON.parse(saved) : { 1: 40, 2: 70 };
    } catch (e) {
      return { 1: 40, 2: 70 };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('velfire_course_progress', JSON.stringify(userProgress));
    } catch (e) {
      console.error(e);
    }
  }, [userProgress]);

  useEffect(() => {
    try {
      localStorage.setItem('velfire_watched_videos', JSON.stringify(watchedVideos));
    } catch (e) {
      console.error(e);
    }
  }, [watchedVideos]);

  // Recommended Text Courses for Domain
  const domainTextCourses = useMemo(() => {
    const recommendedIds = CAREER_COURSE_RECOMMENDATIONS[selectedDomain] || 
                           CAREER_COURSE_RECOMMENDATIONS["Full Stack Development"] || 
                           [];
    const matched = COURSES_DATA.filter(c => recommendedIds.includes(c.id));
    return matched.length > 0 ? matched : COURSES_DATA.slice(0, 4);
  }, [selectedDomain]);

  // Domain-specific Recorded Classes
  const domainRecordedVideos = useMemo(() => {
    return [
      {
        id: `rec-${selectedDomain}-1`,
        numericId: 1,
        courseName: `${selectedDomain} Masterclass`,
        lessonTitle: `▶ Introduction to ${selectedDomain}`,
        shortDescription: `Explore core domain architecture, industrial landscape, toolchain setup, and real-world deployment standards.`,
        duration: "25 min",
        progressDefault: watchedVideos[1] !== undefined ? watchedVideos[1] : 40,
        thumbnailGradient: "linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)",
        instructor: "Dr. Aris Thorne",
        chapters: ["00:00 - Introduction", "05:12 - Core Ecosystem", "14:40 - Production Demo", "22:15 - Takeaways"],
        videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4"
      },
      {
        id: `rec-${selectedDomain}-2`,
        numericId: 2,
        courseName: `${selectedDomain} Fundamentals`,
        lessonTitle: `Deep Dive: Advanced Technical Patterns & State`,
        shortDescription: `Master scalable design patterns, async data flows, clean abstraction layers, and modular error handling.`,
        duration: "45 min",
        progressDefault: watchedVideos[2] !== undefined ? watchedVideos[2] : 65,
        thumbnailGradient: "linear-gradient(135deg, #065f46 0%, #10b981 100%)",
        instructor: "Sarah Jenkins (Lead Architect)",
        chapters: ["00:00 - Architecture Overview", "11:20 - Code Walkthrough", "28:50 - Live Debugging", "40:00 - Summary"],
        videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4"
      },
      {
        id: `rec-${selectedDomain}-3`,
        numericId: 3,
        courseName: `${selectedDomain} Enterprise Project`,
        lessonTitle: `Building & Deploying Scalable Backend Endpoints`,
        shortDescription: `Practical end-to-end implementation with database connection pooling, schema validations, and unit tests.`,
        duration: "38 min",
        progressDefault: watchedVideos[3] || 15,
        thumbnailGradient: "linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)",
        instructor: "Michael Chang (Staff Engineer)",
        chapters: ["00:00 - Project Blueprint", "08:15 - Database Setup", "22:30 - Endpoint Testing", "34:00 - Cloud Deploy"],
        videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4"
      },
      {
        id: `rec-${selectedDomain}-4`,
        numericId: 4,
        courseName: `${selectedDomain} Career Accelerator`,
        lessonTitle: `Industry Interview Strategies & Live System Design`,
        shortDescription: `How top tech companies interview for ${selectedDomain}: algorithmic problem solving, trade-offs, and behavioral rounds.`,
        duration: "50 min",
        progressDefault: watchedVideos[4] || 0,
        thumbnailGradient: "linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)",
        instructor: "Elena Rostova (Tech Recruiter & Ex-FAANG)",
        chapters: ["00:00 - Resume Screening", "15:00 - Whiteboard Exercise", "32:00 - Architecture Q&A", "45:00 - Wrap-up"],
        videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4"
      }
    ];
  }, [selectedDomain, watchedVideos]);

  // Domain-specific Live Classes
  const domainLiveClasses = useMemo(() => {
    return [
      {
        id: `live-1`,
        title: `${selectedDomain} — React Basics & Architectural Patterns`,
        instructor: "Dr. Aris Thorne (Senior Technical Lead)",
        instructorAvatar: "👨‍🏫",
        date: "Tomorrow, Oct 05",
        time: "7:00 PM IST",
        duration: "60 minutes",
        status: "LIVE NOW",
        statusType: "live_now",
        description: "Interactive live workshop covering reactive state, hooks, and clean component architecture with real-time student Q&A.",
        attendees: 142
      },
      {
        id: `live-2`,
        title: `Full Stack Development — Production API Design & Database Tuning`,
        instructor: "Sarah Jenkins (Lead Systems Architect)",
        instructorAvatar: "👩‍💻",
        date: "Thursday, Oct 08",
        time: "6:30 PM IST",
        duration: "90 minutes",
        status: "UPCOMING",
        statusType: "upcoming",
        description: "Hands-on live coding session scaling SQL/NoSQL databases and securing REST endpoints with token authentication.",
        attendees: 89
      },
      {
        id: `live-3`,
        title: `${selectedDomain} Portfolio Audit & Resume Clinic`,
        instructor: "Marcus Vance (Staff Hiring Manager)",
        instructorAvatar: "👨‍💼",
        date: "Saturday, Oct 10",
        time: "5:00 PM IST",
        duration: "60 minutes",
        status: "SCHEDULED",
        statusType: "upcoming",
        description: "Live review of student GitHub repositories and ATS resume improvements to maximize callback rates.",
        attendees: 210
      }
    ];
  }, [selectedDomain]);

  // Filtered live classes
  const filteredLiveClasses = useMemo(() => {
    if (liveFilter === 'none_demo') return [];
    if (liveFilter === 'live_now') return domainLiveClasses.filter(c => c.statusType === 'live_now');
    if (liveFilter === 'upcoming') return domainLiveClasses.filter(c => c.statusType === 'upcoming');
    return domainLiveClasses;
  }, [domainLiveClasses, liveFilter]);

  // Calculate course progress
  const getCourseProgress = (course) => {
    const prog = userProgress[course.id];
    if (!prog || !prog.completedLessons) return 0;
    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    if (totalLessons === 0) return 0;
    return Math.round((prog.completedLessons.length / totalLessons) * 100);
  };

  // Handlers for Text Lesson
  const handleOpenTextLesson = (course, module = null, lesson = null) => {
    setActiveTextCourse(course);
    const targetModule = module || course.modules[0];
    const targetLesson = lesson || targetModule.lessons[0];
    setActiveTextModuleId(targetModule.id);
    setActiveTextLessonId(targetLesson.id);
    setActiveSubView('text_lesson');
  };

  const handleMarkLessonCompleted = (courseId, lessonId) => {
    setUserProgress(prev => {
      const courseProg = prev[courseId] || { completedLessons: [] };
      const currentCompleted = courseProg.completedLessons || [];
      const updated = currentCompleted.includes(lessonId)
        ? currentCompleted.filter(id => id !== lessonId)
        : [...currentCompleted, lessonId];

      return {
        ...prev,
        [courseId]: {
          ...courseProg,
          completedLessons: updated,
          lastActiveLessonId: lessonId
        }
      };
    });
  };

  // Handlers for Recorded Video
  const handleWatchVideo = (video) => {
    setActiveRecordedVideo(video);
    setActiveSubView('video_player');
  };

  const handleUpdateVideoProgress = (numericId, newPct) => {
    setWatchedVideos(prev => ({
      ...prev,
      [numericId]: newPct
    }));
  };

  // Handlers for Live Class
  const handleJoinLiveClass = (liveClass) => {
    setActiveLiveClass(liveClass);
    setActiveSubView('live_staging');
  };

  // Render Sub-Views (Overlays)
  if (activeSubView === 'resume_builder') {
    return (
      <ResumeBuilderView
        defaultDomain={selectedDomain}
        onBack={() => setActiveSubView('hub')}
      />
    );
  }

  if (activeSubView === 'resume_analyzer') {
    return (
      <ResumeAnalyzerView
        defaultDomain={selectedDomain}
        onBack={() => setActiveSubView('hub')}
      />
    );
  }

  if (activeSubView === 'text_lesson' && activeTextCourse) {
    return (
      <div className="text-lesson-overlay-container">
        <div className="lesson-overlay-topbar">
          <button className="btn-back-to-course" onClick={() => setActiveSubView('hub')}>
            ← Back to Course Hub
          </button>
          <span className="lesson-course-title">📖 {activeTextCourse.title}</span>
          <span className="lesson-domain-badge">{selectedDomain}</span>
        </div>
        <CourseLessonView
          course={activeTextCourse}
          currentModuleId={activeTextModuleId}
          currentLessonId={activeTextLessonId}
          userProgress={userProgress}
          onBackToCourseDetails={() => setActiveSubView('hub')}
          onSelectLesson={(course, mod, les) => {
            setActiveTextCourse(course);
            setActiveTextModuleId(mod.id);
            setActiveTextLessonId(les.id);
          }}
          onMarkLessonCompleted={handleMarkLessonCompleted}
          onSwitchToRoadmap={onSwitchToRoadmap}
        />
      </div>
    );
  }

  return (
    <div className="velfire-course-platform-root">
      {/* 1. TOP PLATFORM HEADER */}
      <div className="platform-hero-header">
        <div className="hero-text-block">
          <div className="hero-badge-pill">🎓 VELFIRE LEARNING PORTAL</div>
          <h1 className="hero-heading">VELFIRE COURSES</h1>
          <p className="hero-subheading">
            Master <strong>{selectedDomain}</strong> through interactive Text Lessons, on-demand Recorded Masterclasses, and interactive Live Sessions.
          </p>
        </div>

        <div className="hero-nav-actions">
          {onBackToChoice && (
            <button className="btn-platform-outline" onClick={onBackToChoice}>
              <span>← Pathways</span>
            </button>
          )}
          {onSwitchToRoadmap && (
            <button className="btn-platform-roadmap" onClick={onSwitchToRoadmap}>
              <span>🗺️ Open AI Roadmap</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN COURSE SECTIONS NAVIGATION (TEXT, RECORDED, LIVE) */}
      <div className="course-main-sections-nav">
        <button
          className={`section-tab-item ${activeCourseSection === 'text' ? 'active' : ''}`}
          onClick={() => setActiveCourseSection('text')}
        >
          <div className="tab-icon-wrap">📖</div>
          <div className="tab-meta-wrap">
            <span className="tab-label">1. TEXT</span>
            <span className="tab-desc">Structured Lessons & Syllabus</span>
          </div>
          <span className="tab-count-pill">{domainTextCourses.length} Courses</span>
        </button>

        <button
          className={`section-tab-item ${activeCourseSection === 'recorded' ? 'active' : ''}`}
          onClick={() => setActiveCourseSection('recorded')}
        >
          <div className="tab-icon-wrap">🎬</div>
          <div className="tab-meta-wrap">
            <span className="tab-label">2. RECORDED</span>
            <span className="tab-desc">Video Masterclasses & Replays</span>
          </div>
          <span className="tab-count-pill">{domainRecordedVideos.length} Videos</span>
        </button>

        <button
          className={`section-tab-item ${activeCourseSection === 'live' ? 'active' : ''}`}
          onClick={() => setActiveCourseSection('live')}
        >
          <div className="tab-icon-wrap live-pulse">🔴</div>
          <div className="tab-meta-wrap">
            <span className="tab-label">3. LIVE</span>
            <span className="tab-desc">Interactive Workshops & Q&A</span>
          </div>
          <span className="tab-count-pill live-pill">
            {domainLiveClasses.filter(c => c.statusType === 'live_now').length > 0 ? "1 Live Now" : "Upcoming"}
          </span>
        </button>
      </div>

      {/* 3. DYNAMIC CONTENT AREA BASED ON SELECTED COURSE SECTION */}
      <div className="course-section-content-container">
        {/* ============================================================== */}
        {/* --- SECTION 1: TEXT LESSONS --- */}
        {/* ============================================================== */}
        {activeCourseSection === 'text' && (
          <div className="text-section-view">
            <div className="section-intro-bar">
              <div>
                <h2 className="section-title">📖 Text Lessons & Structured Curriculum</h2>
                <p className="section-subtitle">
                  In-depth reading modules, verified syntax examples, and hands-on practice challenges tailored for {selectedDomain}.
                </p>
              </div>
              <div className="section-stats-badge">
                <span>📚 {domainTextCourses.length} Learning Pathways Available</span>
              </div>
            </div>

            <div className="text-courses-cards-grid">
              {domainTextCourses.map((course) => {
                const progressPct = getCourseProgress(course);
                const isStarted = progressPct > 0;
                const isCompleted = progressPct >= 100;
                const firstModule = course.modules[0];
                const firstLesson = firstModule ? firstModule.lessons[0] : null;
                const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

                return (
                  <div key={course.id} className="text-course-card">
                    {/* Header */}
                    <div className="text-card-top" style={{ background: course.bannerGradient || 'linear-gradient(135deg, #064e3b 0%, #047857 100%)' }}>
                      <div className="top-category-row">
                        <span className="badge-category">{course.category}</span>
                        <span className="badge-level">{course.level}</span>
                      </div>
                      <div className="top-icon-row">
                        <span className="card-big-emoji">{course.icon || "📚"}</span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="text-card-content">
                      <div className="course-module-meta">
                        <span className="module-tag">Course / Module</span>
                        <span className="module-name">{firstModule ? firstModule.title : "Core Foundation"}</span>
                      </div>

                      <h3 className="course-title">{course.title}</h3>
                      <p className="lesson-highlight">
                        <strong>Current Lesson:</strong> {firstLesson ? firstLesson.title : "Lesson 1"}
                      </p>
                      <p className="course-short-desc">{course.shortDescription}</p>

                      {/* Module info */}
                      <div className="text-course-bullets">
                        <span>📦 {course.modules.length} Modules • {totalLessons} Lessons</span>
                        <span>⏱️ {course.estimatedDuration}</span>
                      </div>

                      {/* Progress bar */}
                      <div className="text-course-progress">
                        <div className="progress-labels">
                          <span className="lbl-status">
                            {isCompleted ? "✓ Completed" : isStarted ? "In Progress" : "Not Started"}
                          </span>
                          <span className="lbl-pct">{progressPct}%</span>
                        </div>
                        <div className="progress-bar-bg">
                          <div 
                            className={`progress-bar-fill ${isCompleted ? 'completed' : ''}`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Action */}
                      <div className="text-card-actions">
                        <button
                          className="btn-continue-learning"
                          onClick={() => handleOpenTextLesson(course, firstModule, firstLesson)}
                        >
                          <span>{isCompleted ? "Review Lessons" : isStarted ? "Continue Learning" : "Start Learning"}</span>
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* --- SECTION 2: RECORDED CLASSES --- */}
        {/* ============================================================== */}
        {activeCourseSection === 'recorded' && (
          <div className="recorded-section-view">
            <div className="section-intro-bar">
              <div>
                <h2 className="section-title">🎬 Recorded Masterclasses & Video Replays</h2>
                <p className="section-subtitle">
                  High-definition video walk-throughs, architecture teardowns, and live coding recordings.
                </p>
              </div>
              <div className="section-stats-badge">
                <span>📹 {domainRecordedVideos.length} High-Definition Classes</span>
              </div>
            </div>

            <div className="recorded-videos-grid">
              {domainRecordedVideos.map((video) => {
                const currentProgress = video.progressDefault;
                const isFinished = currentProgress >= 100;

                return (
                  <div key={video.id} className="recorded-video-card">
                    {/* Video Thumbnail Area */}
                    <div 
                      className="video-thumbnail-box" 
                      style={{ background: video.thumbnailGradient }}
                      onClick={() => handleWatchVideo(video)}
                    >
                      <div className="thumb-overlay-backdrop"></div>
                      <div className="play-button-circle">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                      <span className="video-duration-badge">⏱️ {video.duration}</span>
                      <span className="video-hd-badge">1080p HD</span>
                    </div>

                    {/* Card Content */}
                    <div className="video-card-body">
                      <div className="video-course-name">{video.courseName}</div>
                      <h3 className="video-lesson-title" onClick={() => handleWatchVideo(video)}>
                        {video.lessonTitle}
                      </h3>
                      <p className="video-short-desc">{video.shortDescription}</p>

                      <div className="video-instructor-row">
                        <span className="inst-icon">👨‍🏫</span>
                        <span className="inst-name">{video.instructor}</span>
                      </div>

                      {/* Progress */}
                      <div className="video-progress-wrapper">
                        <div className="video-progress-info">
                          <span>Progress</span>
                          <strong>{currentProgress}%</strong>
                        </div>
                        <div className="video-progress-bar">
                          <div 
                            className={`video-progress-fill ${isFinished ? 'done' : ''}`}
                            style={{ width: `${currentProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* Watch Button */}
                      <div className="video-card-actions">
                        <button 
                          className="btn-watch-video"
                          onClick={() => handleWatchVideo(video)}
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                          <span>{currentProgress > 0 ? "Resume Watching" : "Watch Now"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* --- SECTION 3: LIVE CLASSES --- */}
        {/* ============================================================== */}
        {activeCourseSection === 'live' && (
          <div className="live-section-view">
            <div className="section-intro-bar">
              <div>
                <h2 className="section-title">🔴 Live Masterclasses & Mentorship Sessions</h2>
                <p className="section-subtitle">
                  Join real-time interactive lectures, participate in live coding, and get your questions answered directly.
                </p>
              </div>

              {/* Filter Pills with Empty State Demo Option */}
              <div className="live-filter-pills">
                <button
                  className={`pill-btn ${liveFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setLiveFilter('all')}
                >
                  All ({domainLiveClasses.length})
                </button>
                <button
                  className={`pill-btn ${liveFilter === 'live_now' ? 'active' : ''}`}
                  onClick={() => setLiveFilter('live_now')}
                >
                  🔴 Live Now
                </button>
                <button
                  className={`pill-btn ${liveFilter === 'upcoming' ? 'active' : ''}`}
                  onClick={() => setLiveFilter('upcoming')}
                >
                  ⏱️ Upcoming
                </button>
                <button
                  className={`pill-btn empty-test-btn ${liveFilter === 'none_demo' ? 'active' : ''}`}
                  onClick={() => setLiveFilter('none_demo')}
                  title="Simulate state with no scheduled classes"
                >
                  Empty State View
                </button>
              </div>
            </div>

            {/* Live Cards List or Required Professional Empty State */}
            {filteredLiveClasses.length > 0 ? (
              <div className="live-classes-grid">
                {filteredLiveClasses.map((liveClass) => {
                  const isLiveNow = liveClass.statusType === 'live_now';

                  return (
                    <div key={liveClass.id} className={`live-class-card ${isLiveNow ? 'is-live-now' : ''}`}>
                      <div className="live-card-top-bar">
                        <span className={`live-status-pill ${isLiveNow ? 'status-live' : 'status-upcoming'}`}>
                          {isLiveNow ? "🔴 LIVE NOW" : "⏱️ UPCOMING"}
                        </span>
                        <span className="live-attendees-tag">👥 {liveClass.attendees} registered</span>
                      </div>

                      <h3 className="live-class-title">{liveClass.title}</h3>
                      <p className="live-class-desc">{liveClass.description}</p>

                      <div className="live-meta-grid">
                        <div className="meta-cell">
                          <span className="meta-cell-lbl">Instructor</span>
                          <span className="meta-cell-val">{liveClass.instructorAvatar} {liveClass.instructor}</span>
                        </div>
                        <div className="meta-cell">
                          <span className="meta-cell-lbl">Date & Time</span>
                          <span className="meta-cell-val">📅 {liveClass.date} • {liveClass.time}</span>
                        </div>
                        <div className="meta-cell">
                          <span className="meta-cell-lbl">Duration</span>
                          <span className="meta-cell-val">⏱️ {liveClass.duration}</span>
                        </div>
                      </div>

                      <div className="live-card-bottom-action">
                        <button
                          className={`btn-join-class ${isLiveNow ? 'btn-live-pulse' : ''}`}
                          onClick={() => handleJoinLiveClass(liveClass)}
                        >
                          <span>{isLiveNow ? "🚀 Join Live Class Now" : "📅 Join Class"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* REQUIRED EMPTY STATE */
              <div className="live-empty-state-card">
                <div className="empty-calendar-icon">📅</div>
                <h3 className="empty-title">No live classes scheduled yet.</h3>
                <p className="empty-desc">
                  Our instructors are finalizing the next live schedule for {selectedDomain}. Check back soon or set up a notification.
                </p>
                <div className="empty-actions">
                  <button 
                    className="btn-empty-reset"
                    onClick={() => setLiveFilter('all')}
                  >
                    View All Schedules
                  </button>
                  <button 
                    className="btn-empty-notify"
                    onClick={() => alert("Notification enabled: You'll be alerted when the next live session is scheduled!")}
                  >
                    🔔 Notify Me
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* --- SEPARATE MODULE: CAREER TOOLS (RESUME BUILDER & ANALYZER) --- */}
      {/* ============================================================== */}
      <div className="career-tools-section">
        <div className="career-tools-header">
          <div className="tools-badge">💼 VELFIRE CAREER TOOLS</div>
          <h2 className="career-tools-title">Resume Builder & Resume Analyzer</h2>
          <p className="career-tools-subtitle">
            Industry-grade tools designed to elevate your software engineering portfolio and maximize ATS resume performance.
          </p>
        </div>

        <div className="career-tools-cards-grid">
          {/* Card 1: Resume Builder */}
          <div 
            className="career-tool-card builder-card"
            onClick={() => setActiveSubView('resume_builder')}
          >
            <div className="tool-card-icon-circle">📄</div>
            <div className="tool-card-badge">ATS Engine</div>
            <h3 className="tool-card-heading">Resume Builder</h3>
            <p className="tool-card-text">
              Design a clean, recruiter-approved, single-column technical resume. Features real-time ATS preview and one-click PDF printing.
            </p>
            <div className="tool-highlights">
              <span>✓ ATS 98% Compatibility</span>
              <span>✓ Live Formatter</span>
              <span>✓ Instant PDF Export</span>
            </div>
            <button className="btn-open-tool builder-btn">
              <span>Open Resume Builder</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

          {/* Card 2: Resume Analyzer */}
          <div 
            className="career-tool-card analyzer-card"
            onClick={() => setActiveSubView('resume_analyzer')}
          >
            <div className="tool-card-icon-circle analyzer-icon">🔍</div>
            <div className="tool-card-badge analyzer-badge">ATS Auditor</div>
            <h3 className="tool-card-heading">Resume Analyzer</h3>
            <p className="tool-card-text">
              Upload your CV or technical resume to evaluate your ATS score, uncover missing domain keywords, and receive actionable fixes.
            </p>
            <div className="tool-highlights">
              <span>✓ Drag & Drop Upload</span>
              <span>✓ Keyword Matcher</span>
              <span>✓ Structured Suggestions</span>
            </div>
            <button className="btn-open-tool analyzer-btn">
              <span>Open Resume Analyzer</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* --- MODAL 1: RECORDED VIDEO PLAYER LEARNING AREA --- */}
      {/* ============================================================== */}
      {activeSubView === 'video_player' && activeRecordedVideo && (
        <div className="video-player-modal-backdrop" onClick={() => setActiveSubView('hub')}>
          <div className="video-player-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="video-modal-header">
              <div className="modal-title-wrap">
                <span className="badge-video-modal">🎬 Video Masterclass</span>
                <h3>{activeRecordedVideo.lessonTitle}</h3>
                <span className="modal-sub-course">{activeRecordedVideo.courseName} • Instructor: {activeRecordedVideo.instructor}</span>
              </div>
              <button className="btn-close-modal" onClick={() => setActiveSubView('hub')} title="Close Player">✕</button>
            </div>

            <div className="video-player-body">
              {/* Video Frame */}
              <div className="video-viewport">
                <div className="video-mock-screen">
                  <div className="mock-playback-overlay">
                    <span className="playback-pulse">▶</span>
                    <h4>{activeRecordedVideo.lessonTitle}</h4>
                    <p>Playing in 1080p Full High Definition</p>
                  </div>
                  {/* Real video tag fallback preview */}
                  <video 
                    controls 
                    className="embedded-video-element"
                    poster=""
                  >
                    <source src={activeRecordedVideo.videoSrc} type="video/mp4" />
                    Your browser does not support HTML video.
                  </video>
                </div>
              </div>

              {/* Sidebar: Chapters & Notes */}
              <div className="video-sidebar">
                <h4 className="sidebar-section-title">📑 Chapters & Timestamps</h4>
                <div className="chapters-list">
                  {activeRecordedVideo.chapters.map((ch, idx) => (
                    <div key={idx} className="chapter-item">
                      <span className="ch-bullet">▶</span>
                      <span className="ch-text">{ch}</span>
                    </div>
                  ))}
                </div>

                <div className="video-meta-box">
                  <h4>💡 Key Takeaways</h4>
                  <p>{activeRecordedVideo.shortDescription}</p>
                </div>

                <div className="video-completion-action">
                  <button 
                    className="btn-mark-watched"
                    onClick={() => {
                      handleUpdateVideoProgress(activeRecordedVideo.numericId, 100);
                      alert("✓ Lesson marked as complete! 100% saved.");
                    }}
                  >
                    ✓ Mark as 100% Watched
                  </button>
                  <button 
                    className="btn-return-course"
                    onClick={() => setActiveSubView('hub')}
                  >
                    Return to Course List
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* --- MODAL 2: LIVE CLASS JOINING STAGING ROOM --- */}
      {/* ============================================================== */}
      {activeSubView === 'live_staging' && activeLiveClass && (
        <div className="video-player-modal-backdrop" onClick={() => setActiveSubView('hub')}>
          <div className="live-staging-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="staging-header">
              <span className="staging-badge">🔴 VELFIRE Live Classroom Gateway</span>
              <h2>{activeLiveClass.title}</h2>
              <p className="staging-sub">Hosted by {activeLiveClass.instructor}</p>
              <button className="btn-close-modal staging-close" onClick={() => setActiveSubView('hub')}>✕</button>
            </div>

            <div className="staging-grid">
              <div className="staging-left">
                <div className="webcam-preview-placeholder">
                  <div className="cam-avatar">👤</div>
                  <span className="cam-status">Ready to Join Session</span>
                  <div className="mic-cam-controls">
                    <button className="btn-control-toggle active">🎤 Mic On</button>
                    <button className="btn-control-toggle active">📹 Video On</button>
                  </div>
                </div>
              </div>

              <div className="staging-right">
                <div className="session-info-card">
                  <h4>Class Details</h4>
                  <div className="staging-meta-row">
                    <span>📅 Scheduled Date:</span>
                    <strong>{activeLiveClass.date}</strong>
                  </div>
                  <div className="staging-meta-row">
                    <span>⏱️ Time:</span>
                    <strong>{activeLiveClass.time} ({activeLiveClass.duration})</strong>
                  </div>
                  <div className="staging-meta-row">
                    <span>👥 Enrolled Learners:</span>
                    <strong>{activeLiveClass.attendees} Peers Active</strong>
                  </div>
                  <div className="staging-meta-row">
                    <span>📋 Topics Covered:</span>
                    <strong>Architecture, Hands-on Code, Direct Q&A</strong>
                  </div>
                </div>

                <div className="staging-actions">
                  <button 
                    className="btn-launch-live"
                    onClick={() => {
                      alert(`Joining live session for "${activeLiveClass.title}". Redirecting to live room...`);
                      setActiveSubView('hub');
                    }}
                  >
                    🚀 Enter Live Room Now
                  </button>
                  <button 
                    className="btn-cancel-live"
                    onClick={() => setActiveSubView('hub')}
                  >
                    Return to Course Hub
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
