import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { initializeMockData } from '../utils/mockData';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [appData, setAppData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState('student');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Current version of our data schema/mock data
    const DATA_VERSION = '1.3'; // increment to force reset
    
    // Initialize data from localStorage or create mock data
    let stored = storage.get('learnSyncData');
    
    // If no data OR version mismatch, use fresh mock data
    if (!stored || stored.version !== DATA_VERSION) {
      const data = initializeMockData();
      const freshData = { ...data, version: DATA_VERSION };
      storage.set('learnSyncData', freshData);
      setAppData(freshData);
      setCurrentUser(freshData.currentUser);
      setCurrentRole(freshData.currentRole || 'student');
    } else {
      setAppData(stored);
      setCurrentUser(stored.currentUser);
      setCurrentRole(stored.currentRole || 'student');
    }
    
    setLoading(false);
  }, []);

  const updateData = (key, value) => {
    const newData = { ...appData, [key]: value };
    setAppData(newData);
    storage.set('learnSyncData', newData);
  };

  const updateCurrentUser = (user) => {
    setCurrentUser(user);
    updateData('currentUser', user);
  };

  const switchRole = (role) => {
    setCurrentRole(role);
    updateData('currentRole', role);
  };

  const addStudent = (student) => {
    const students = [...appData.students, { ...student, id: Date.now() }];
    updateData('students', students);
  };

  const updateStudent = (id, updates) => {
    const students = appData.students.map(s => 
      s.id === id ? { ...s, ...updates } : s
    );
    updateData('students', students);
  };

  const addMentor = (mentor) => {
    const mentors = [...appData.mentors, { ...mentor, id: Date.now() }];
    updateData('mentors', mentors);
  };

  const updateMentor = (id, updates) => {
    const mentors = appData.mentors.map(m => 
      m.id === id ? { ...m, ...updates } : m
    );
    updateData('mentors', mentors);
  };

  const addCourse = (course) => {
    const courses = [...appData.courses, { ...course, id: Date.now() }];
    updateData('courses', courses);
  };

  const addChapter = (chapter) => {
    const chapters = [...appData.chapters, { ...chapter, id: Date.now() }];
    updateData('chapters', chapters);
  };

  const addTopic = (topic) => {
    const topics = [...appData.topics, { ...topic, id: Date.now() }];
    updateData('topics', topics);
  };

  const addSession = (session) => {
    const sessions = [...appData.sessions, { ...session, id: Date.now() }];
    updateData('sessions', sessions);
  };

  const addDoubt = (doubt) => {
    const doubts = [...appData.doubts, { ...doubt, id: Date.now(), status: 'open', replies: [] }];
    updateData('doubts', doubts);
  };

  const updateDoubt = (id, updates) => {
    const doubts = appData.doubts.map(d => 
      d.id === id ? { ...d, ...updates } : d
    );
    updateData('doubts', doubts);
  };

  const addStudyPlan = (plan) => {
    const studyPlans = [...appData.studyPlans, { ...plan, id: Date.now() }];
    updateData('studyPlans', studyPlans);
  };

  const updateStudyPlan = (id, updates) => {
    const studyPlans = appData.studyPlans.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    updateData('studyPlans', studyPlans);
  };

  const value = {
    appData,
    currentUser,
    currentRole,
    loading,
    updateData,
    updateCurrentUser,
    switchRole,
    addStudent,
    updateStudent,
    addMentor,
    updateMentor,
    addCourse,
    addChapter,
    addTopic,
    addSession,
    addDoubt,
    updateDoubt,
    addStudyPlan,
    updateStudyPlan
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
