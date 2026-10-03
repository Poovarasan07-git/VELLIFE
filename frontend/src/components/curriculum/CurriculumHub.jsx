// src/components/curriculum/CurriculumHub.jsx
import React, { useState, useEffect } from 'react';
import CurriculumMainView from './CurriculumMainView';
import CurriculumDetailView from './CurriculumDetailView';
import LessonReaderView from './LessonReaderView';
import { TEXTBOOK_COURSES } from '../../data/fullTextbookData';
import { CURRICULUM_DATA } from '../../data/curriculumData';
import './Curriculum.css';

function CurriculumHub({ 
  selectedDomain, 
  onSwitchToRoadmap,
  onBackToChoice 
}) {
  // Navigation View State: 'main' | 'detail' | 'reader'
  const [viewMode, setViewMode] = useState('main');

  // Active selections
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Load progress state from localStorage
  const [userProgress, setUserProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('velfire_textbook_progress');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Save progress to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('velfire_textbook_progress', JSON.stringify(userProgress));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }, [userProgress]);

  // Handle clicking a course card
  const handleExploreCourse = (course) => {
    // Check if rich textbook data exists for this course id
    const richCourse = TEXTBOOK_COURSES[course.id] || course;
    setSelectedCourse(richCourse);
    setViewMode('detail');
  };

  // Handle selecting a lesson from syllabus or topic detail
  const handleSelectLesson = (course, section, module, lesson) => {
    const richCourse = TEXTBOOK_COURSES[course.id] || course;
    setSelectedCourse(richCourse);
    setSelectedSection(section);
    setSelectedModule(module);
    setSelectedLesson(lesson);
    setViewMode('reader');
  };

  // Mark lesson as completed
  const handleMarkLessonCompleted = (courseId, lessonId) => {
    setUserProgress(prev => {
      const courseProg = prev[courseId] || { completedLessons: [] };
      const currentCompleted = courseProg.completedLessons || [];

      let updatedCompleted;
      if (currentCompleted.includes(lessonId)) {
        updatedCompleted = currentCompleted.filter(id => id !== lessonId);
      } else {
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

  const handleBackToMain = () => {
    setViewMode('main');
  };

  const handleBackToDetail = () => {
    setViewMode('detail');
  };

  return (
    <div className="curriculum-hub-wrapper">
      {viewMode === 'main' && (
        <CurriculumMainView
          userProgress={userProgress}
          onExploreCourse={handleExploreCourse}
          onSwitchToRoadmap={onSwitchToRoadmap}
        />
      )}

      {viewMode === 'detail' && selectedCourse && (
        <CurriculumDetailView
          course={selectedCourse}
          userProgress={userProgress}
          onBack={handleBackToMain}
          onSelectLesson={handleSelectLesson}
        />
      )}

      {viewMode === 'reader' && selectedCourse && selectedLesson && (
        <LessonReaderView
          course={selectedCourse}
          section={selectedSection || (selectedCourse.sections ? selectedCourse.sections[0] : null)}
          module={selectedModule || (selectedCourse.sections ? selectedCourse.sections[0].modules[0] : null)}
          lesson={selectedLesson}
          userProgress={userProgress}
          onBackToOverview={handleBackToDetail}
          onSelectLesson={handleSelectLesson}
          onMarkLessonCompleted={handleMarkLessonCompleted}
          onSwitchToRoadmap={onSwitchToRoadmap}
        />
      )}
    </div>
  );
}

export default CurriculumHub;
