import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Home, BookOpen, Users, Calendar, HelpCircle, Bell, GraduationCap,
  Menu, X, LogOut, User, Sparkles, ChevronRight
} from 'lucide-react';
import ChatbotPanel from './ChatbotPanel';

const Layout = ({ children, onLogout }) => {
  const { currentRole, currentUser, updateStudent } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatbotContext, setChatbotContext] = useState(null);
  const location = useLocation();

  // Close chatbot when route changes
  useEffect(() => {
    setShowChatbot(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      setChatbotContext(e.detail);
      setShowChatbot(true);
    };
    window.addEventListener('open-ai-drawer', handler);
    return () => window.removeEventListener('open-ai-drawer', handler);
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleQuizCompletion = (quizResult) => {
    if (currentRole === 'student' && currentUser) {
      updateStudent(currentUser.id, {
        ...currentUser,
        xp: currentUser.xp + Math.floor(quizResult.score / 10),
      });
    }
  };

  const navigation = {
    student: [
      { name: 'Dashboard', icon: Home, path: '/' },
      { name: 'Courses', icon: BookOpen, path: '/courses' },
      ...(currentUser && parseInt(currentUser.class) > 5 ? [
        { name: 'Study Planner', icon: Calendar, path: '/study-plan' }
      ] : []),
      { name: 'Doubts', icon: HelpCircle, path: '/doubts' },
      { name: 'Profile', icon: User, path: '/profile' },
    ],
    mentor: [
      { name: 'Dashboard', icon: Home, path: '/mentor' },
      { name: 'Students', icon: Users, path: '/mentor/students' },
      { name: 'Content', icon: BookOpen, path: '/mentor/content' },
      { name: 'Sessions', icon: Calendar, path: '/mentor/sessions' },
      { name: 'Doubts', icon: HelpCircle, path: '/mentor/doubts' },
      { name: 'Courses', icon: GraduationCap, path: '/mentor/courses' },
    ],
    admin: [
      { name: 'Dashboard', icon: Home, path: '/admin' },
      { name: 'Courses', icon: BookOpen, path: '/admin/modules' },
      { name: 'Sessions', icon: Calendar, path: '/admin/sessions' },
      { name: 'Students', icon: Users, path: '/admin/students' },
      { name: 'Mentors', icon: GraduationCap, path: '/admin/mentors' },
      { name: 'Notifications', icon: Bell, path: '/admin/notifications' },
    ],
  };

  const currentNav = navigation[currentRole] || navigation.student;

  const roleColors = {
    student: { dot: 'bg-emerald-400', label: 'text-emerald-600', bg: 'bg-emerald-50' },
    mentor:  { dot: 'bg-amber-400',   label: 'text-amber-600',   bg: 'bg-amber-50'   },
    admin:   { dot: 'bg-blue-400',    label: 'text-blue-600',    bg: 'bg-blue-50'    },
  };
  const rc = roleColors[currentRole] || roleColors.student;

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ── Sidebar ── */}
      <div
        className={`fixed md:relative inset-y-0 left-0 z-50 flex flex-col
          ${sidebarOpen ? 'w-64' : 'w-0 md:w-64'}
          bg-white border-r border-slate-200 transition-all duration-300 overflow-hidden`}
      >
        {/* Brand */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">LearnSync</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {currentNav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => {
                  setSidebarOpen(false);
                  setShowChatbot(false); // Close AI Tutor when navigating
                }}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
              >
                <item.icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} style={{ width: 18, height: 18 }} />
                <span className="flex-1">{item.name}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
              </Link>
            );
          })}

          {/* AI Tutor – student only */}
          {currentRole === 'student' && (
            <button
              onClick={() => { setShowChatbot(true); setSidebarOpen(false); }}
              className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                bg-gradient-to-r from-blue-50 to-sky-50 text-blue-700 border border-blue-200
                hover:from-blue-100 hover:to-sky-100 transition-all mt-2"
            >
              <Sparkles className="w-4 h-4 text-blue-500" style={{ width: 18, height: 18 }} />
              <span className="flex-1 text-left">AI Tutor</span>
              <span className="w-2 h-2 rounded-full bg-blue-400 pulse-dot" />
            </button>
          )}
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-slate-100">
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${rc.bg}`}>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {currentUser?.name?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{currentUser?.name || 'User'}</p>
              <p className={`text-xs capitalize font-medium ${rc.label}`}>{currentRole}</p>
            </div>
            <button onClick={handleLogout} title="Logout" className="p-1.5 rounded-lg hover:bg-white transition-all">
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
          </button>

          <div className="flex items-center gap-3">
            {/* Page title derived from currentNav */}
            <span className="hidden sm:block text-sm text-slate-500 font-medium">
              {currentNav.find(n => n.path === location.pathname)?.name || 'LearnSync'}
            </span>
            <div className="w-px h-5 bg-slate-200 hidden sm:block" />
            <Link
              to={currentRole === 'student' ? '/profile' : '#'}
              className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {currentUser?.name?.[0] || 'U'}
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-slate-900 leading-none">{currentUser?.name || 'User'}</p>
                <p className="text-xs text-slate-500 capitalize mt-0.5">{currentRole}</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 relative">
          <div className="fade-in">{children}</div>
        </main>

        {/* AI Chatbot Overlay — rendered on top, never blocks navigation */}
        {currentRole === 'student' && showChatbot && (
          <div className="fixed inset-0 z-50 flex items-stretch">
            {/* Backdrop — hidden on mobile so panel is fully full-screen */}
            <div
              className="hidden sm:flex flex-1 bg-black/40 backdrop-blur-sm cursor-pointer"
              onClick={() => setShowChatbot(false)}
            />
            {/* Panel — full screen on mobile, right sidebar on desktop */}
            <div className="w-full sm:w-[480px] md:w-[560px] flex-shrink-0 bg-white shadow-2xl flex flex-col">
              {/* Header bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 flex-shrink-0 bg-white sticky top-0 z-10">
                <span className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" /> AI Tutor
                </span>
                <button
                  onClick={() => setShowChatbot(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              {/* Chat content fills remaining height */}
              <div className="flex-1 min-h-0 overflow-hidden">
                <ChatbotPanel
                  isOpen={showChatbot}
                  context={chatbotContext}
                  onQuizGenerated={handleQuizCompletion}
                  studentId={currentUser?.id}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
