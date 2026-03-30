import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Home, BookOpen, Users, Calendar, HelpCircle, BarChart3, Menu, X, LogOut, User, Sparkles, GraduationCap, Bell } from 'lucide-react';

const Layout = ({ children }) => {
  const { currentRole, currentUser, updateCurrentUser, updateStudent } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const handleLogout = () => {
    updateCurrentUser(null);
  };

  const navigation = {
    student: [
      { name: 'Dashboard', icon: Home, path: '/' },
      { name: 'Courses', icon: BookOpen, path: '/courses' },
      { name: 'Study Planner', icon: Calendar, path: '/study-plan' },
      { name: 'Doubts', icon: HelpCircle, path: '/doubts' },
      { name: 'Profile', icon: User, path: '/profile' },
      { name: 'AI Tutor', icon: Sparkles, path: '/ai-tutor', special: true }
    ],
    mentor: [
      { name: 'Dashboard', icon: Home, path: '/mentor' },
      { name: 'Students', icon: Users, path: '/mentor/students' },
      { name: 'Content', icon: BookOpen, path: '/mentor/content' },
      { name: 'Sessions', icon: Calendar, path: '/mentor/sessions' },
      { name: 'Doubts', icon: HelpCircle, path: '/mentor/doubts' }
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
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden`}>
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-900">LearnSync</h1>
        </div>
        
        <nav className="px-4 space-y-2">
          {currentNav.map((item) => {
            const isActive = location.pathname === item.path;
            
            if (item.action) {
              return (
                <button
                  key={item.name}
                  onClick={item.action}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    item.special
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            }
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  item.special
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-50 rounded-lg"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                {currentUser?.name?.[0] || 'U'}
              </div>
              <div>
                <span className="text-gray-900 font-medium block">
                  {currentUser?.name || 'User'}
                </span>
                <span className="text-gray-500 text-xs capitalize">
                  {currentRole}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
