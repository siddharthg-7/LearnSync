import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Home, BookOpen, Users, Calendar, HelpCircle, Bell, GraduationCap, Menu, X, LogOut, User, Sparkles } from 'lucide-react';
import ChatbotPanel from './ChatbotPanel';

const Layout = ({ children, onLogout }) => {
  const { currentRole, currentUser, updateStudent } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatbotContext, setChatbotContext] = useState(null);

  // Listen for 'open-ai-drawer' events from Courses to open chatbot with context
  useEffect(() => {
    const handler = (e) => {
      setChatbotContext(e.detail);
      setShowChatbot(true);
    };
    window.addEventListener('open-ai-drawer', handler);
    return () => window.removeEventListener('open-ai-drawer', handler);
  }, []);
  const location = useLocation();

  // Reset chatbot when navigating to a different page
  useEffect(() => {
    setShowChatbot(false);
  }, [location.pathname]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleQuizCompletion = (quizResult) => {
    if (currentRole === 'student' && currentUser) {
      const updatedStudent = {
        ...currentUser,
        xp: currentUser.xp + Math.floor(quizResult.score / 10),
      };
      updateStudent(currentUser.id, updatedStudent);
    }
  };

  const navigation = {
    student: [
      { name: 'Dashboard', icon: Home, path: '/' },
      { name: 'Courses', icon: BookOpen, path: '/courses' },
      // Only show Study Planner for older students (Growth and Mastery modes)
      ...(currentUser && parseInt(currentUser.class) > 5 ? [
        { name: 'Study Planner', icon: Calendar, path: '/study-plan' }
      ] : []),
      { name: 'Doubts', icon: HelpCircle, path: '/doubts' },
      { name: 'Profile', icon: User, path: '/profile' },
      { name: 'AI Tutor', icon: Sparkles, path: '#', action: () => setShowChatbot(true), special: true }
    ],
    mentor: [
      { name: 'Dashboard', icon: Home, path: '/mentor' },
      { name: 'Students', icon: Users, path: '/mentor/students' },
      { name: 'Content', icon: BookOpen, path: '/mentor/content' },
      { name: 'Sessions', icon: Calendar, path: '/mentor/sessions' },
      { name: 'Doubts', icon: HelpCircle, path: '/mentor/doubts' },
      { name: 'Courses', icon: GraduationCap, path: '/mentor/courses' }
    ],
    admin: [
      { name: 'Dashboard', icon: Home, path: '/admin' },
      { name: 'Courses', icon: BookOpen, path: '/admin/modules' },
      { name: 'Sessions', icon: Calendar, path: '/admin/sessions' },
      { name: 'Students', icon: Users, path: '/admin/students' },
      { name: 'Mentors', icon: GraduationCap, path: '/admin/mentors' },
      { name: 'Notifications', icon: Bell, path: '/admin/notifications' }
    ]
  };

  const currentNav = navigation[currentRole] || navigation.student;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Fixed on mobile, relative on desktop */}
      <div className={`fixed md:relative inset-y-0 left-0 z-50 ${sidebarOpen ? 'w-64' : 'w-0 md:w-64'} bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden`}>
        <div className="p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">LearnSync</h1>
        </div>
        
        <nav className="px-2 md:px-4 space-y-2">
          {currentNav.map((item) => {
            const isActive = location.pathname === item.path;
            
            if (item.action) {
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    item.action();
                    setSidebarOpen(false); // Close sidebar on mobile after click
                  }}
                  className={`w-full flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all ${
                    item.special
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm md:text-base">{item.name}</span>
                </button>
              );
            }
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => {
                  setSidebarOpen(false);
                  setShowChatbot(false); // Close AI Tutor when navigating
                }}
                className={`flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm md:text-base">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-50 rounded-lg"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2 md:gap-4">
            <Link to={currentRole === 'student' ? '/profile' : '#'} className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                {currentUser?.name?.[0] || 'U'}
              </div>
              <div className="hidden sm:block">
                <span className="text-gray-900 font-medium block text-sm md:text-base">
                  {currentUser?.name || 'User'}
                </span>
                <span className="text-gray-500 text-xs capitalize">
                  {currentRole}
                </span>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {currentRole === 'student' && showChatbot ? (
            <ChatbotPanel
              isOpen={showChatbot}
              context={chatbotContext}
              onQuizGenerated={handleQuizCompletion}
              studentId={currentUser?.id}
            />
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
