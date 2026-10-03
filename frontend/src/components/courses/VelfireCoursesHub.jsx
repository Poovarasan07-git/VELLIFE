// src/components/courses/VelfireCoursesHub.jsx
import React, { useState, useEffect } from 'react';
import CoursesMainView from './CoursesMainView';
import CourseDetailsView from './CourseDetailsView';
import CourseLessonView from './CourseLessonView';
import { COURSES_DATA } from '../../data/coursesData';
import './Courses.css';

function VelfireCoursesHub({ 
  selectedDomain, 
  onSwitchToRoadmap,
  onBackToChoice 
}) {
  // Navigation View State: 'main' | 'details' | 'lesson'
  const [viewMode, setViewMode] = useState('main');
  
  // Selected course & active lesson state
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);

  // Load progress state from localStorage
  const [userProgress, setUserProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('velfire_course_progress');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Save progress state to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('velfire_course_progress', JSON.stringify(userProgress));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }, [userProgress]);

  // Handle selecting a course to open its Details Page
  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setViewMode('details');
  };

  // Handle "Start Learning" / "Continue Learning" button click
  const handleStartLearning = (course) => {
    setSelectedCourse(course);

    const prog = userProgress[course.id] || { completedLessons: [] };
    const completedLessons = prog.completedLessons || [];

    // Find the first uncompleted lesson, or default to first lesson
    let targetModule = course.modules[0];
    let targetLesson = course.modules[0].lessons[0];

    let foundUncompleted = false;
    for (const mod of course.modules) {
      for (const les of mod.lessons) {
        if (!completedLessons.includes(les.id)) {
          targetModule = mod;
          targetLesson = les;
          foundUncompleted = true;
          break;
        }
      }
      if (foundUncompleted) break;
    }

    setActiveModuleId(targetModule.id);
    setActiveLessonId(targetLesson.id);
    setViewMode('lesson');
  };

  // Handle clicking a specific lesson inside Course Details or Lesson View
  const handleOpenSpecificLesson = (course, module, lesson) => {
    setSelectedCourse(course);
    setActiveModuleId(module.id);
    setActiveLessonId(lesson.id);
    setViewMode('lesson');
  };

  // Toggle or mark lesson completion
  const handleMarkLessonCompleted = (courseId, lessonId) => {
    setUserProgress(prev => {
      const courseProg = prev[courseId] || { completedLessons: [] };
      const currentCompleted = courseProg.completedLessons || [];

      let updatedCompleted;
      if (currentCompleted.includes(lessonId)) {
        // Toggle off
        updatedCompleted = currentCompleted.filter(id => id !== lessonId);
      } else {
        // Toggle on
        updatedCompleted = [...currentCompleted, lessonId];
      }

      return {
        ...prev,
        [courseId]: {
          ...courseProg,
          completedLessons: updatedCompleted,
          lastActiveLessonId: lessonId
        }
      };
    });
  };

  // Navigation handlers
  const handleBackToMain = () => {
    setViewMode('main');
  };

  const handleBackToDetails = () => {
    setViewMode('details');
  };

  return (
    <div className="velfire-courses-hub-wrapper">
      {viewMode === 'main' && (
        <CoursesMainView
          selectedDomain={selectedDomain}
          userProgress={userProgress}
          onSelectCourse={handleSelectCourse}
          onStartLearning={handleStartLearning}
          onSwitchToRoadmap={onSwitchToRoadmap}
          onBackToChoice={onBackToChoice}
        />
      )}

      {viewMode === 'details' && selectedCourse && (
        <CourseDetailsView
          course={selectedCourse}
          userProgress={userProgress}
          onBack={handleBackToMain}
          onStartLearning={handleStartLearning}
          onOpenLesson={handleOpenSpecificLesson}
        />
      )}

      {viewMode === 'lesson' && selectedCourse && (
        <CourseLessonView
          course={selectedCourse}
          currentModuleId={activeModuleId}
          currentLessonId={activeLessonId}
          userProgress={userProgress}
          onBackToCourseDetails={handleBackToDetails}
          onSelectLesson={handleOpenSpecificLesson}
          onMarkLessonCompleted={handleMarkLessonCompleted}
          onSwitchToRoadmap={onSwitchToRoadmap}
        />
      )}
    </div>
  );
}

export default VelfireCoursesHub;
