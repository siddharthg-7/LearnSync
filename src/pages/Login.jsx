import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import { BookOpen, GraduationCap, Users, UserCheck } from 'lucide-react';

const Login = ({ onLogin }) => {
  const { appData } = useApp();

  const handleUserSelect = (user, role) => {
    onLogin(user, role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-900">LearnSync</h1>
          </div>
          <p className="text-xl text-gray-600">AI-Powered Learning Coordination Platform</p>
          <p className="text-gray-500 mt-2">Empowering NGOs to transform education</p>
        </div>

        {/* Login Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Students Section */}
          <Card>
            <div className="text-center mb-6">
              <div className="inline-flex p-6 bg-blue-50 rounded-2xl mb-4">
                <GraduationCap className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Students</h2>
              <p className="text-gray-600 text-sm">Learn, grow, and track your progress</p>
            </div>


            <div className="space-y-2 max-h-96 overflow-y-auto">
              {appData.students.map((student) => (
                <button
                  key={student.id}
                  onClick={() => handleUserSelect(student, 'student')}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {student.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{student.name}</p>
                      <p className="text-xs text-gray-500">
                        {student.age} years • Level {student.level_number}
                      </p>
                    </div>
                  </div>
                </button>
              ))}

              <button
                onClick={() => handleUserSelect({ id: 'new', onboarded: false }, 'student')}
                className="w-full p-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-900">New Student</p>
                    <p className="text-xs text-gray-500">Create account</p>
                  </div>
                </div>
              </button>
            </div>
          </Card>

          {/* Mentors Section */}
          <Card>
            <div className="text-center mb-6">
              <div className="inline-flex p-6 bg-green-50 rounded-2xl mb-4">
                <Users className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Mentors</h2>
              <p className="text-gray-600 text-sm">Teach, create content, and guide students</p>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {appData.mentors.map((mentor) => (
                <button
                  key={mentor.id}
                  onClick={() => handleUserSelect(mentor, 'mentor')}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 hover:border-green-600 hover:bg-green-50 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {mentor.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{mentor.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {mentor.subjects.join(', ')}
                      </p>
                    </div>
                  </div>
                </button>
              ))}

              <button
                onClick={() => handleUserSelect({ id: 'new', onboarded: false }, 'mentor')}
                className="w-full p-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-green-600 hover:bg-green-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-900">New Mentor</p>
                    <p className="text-xs text-gray-500">Join as mentor</p>
                  </div>
                </div>
              </button>
            </div>
          </Card>

          {/* Admin Section */}
          <Card>
            <div className="text-center mb-6">
              <div className="inline-flex p-6 bg-purple-50 rounded-2xl mb-4">
                <UserCheck className="w-12 h-12 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">NGO Admin</h2>
              <p className="text-gray-600 text-sm">Monitor, analyze, and manage programs</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleUserSelect({ id: 'admin', name: 'Admin User' }, 'admin')}
                className="w-full p-3 rounded-xl border-2 border-gray-200 hover:border-purple-600 hover:bg-purple-50 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                    A
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Administrator</p>
                    <p className="text-xs text-gray-500">Full access</p>
                  </div>
                </div>
              </button>
            </div>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="inline-flex p-4 bg-blue-50 rounded-xl mb-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Personalized Learning</h3>
            <p className="text-gray-600 text-sm">AI-powered adaptive learning paths for every student</p>
          </div>
          <div>
            <div className="inline-flex p-4 bg-green-50 rounded-xl mb-3">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Collaborative Teaching</h3>
            <p className="text-gray-600 text-sm">Connect students with expert mentors seamlessly</p>
          </div>
          <div>
            <div className="inline-flex p-4 bg-purple-50 rounded-xl mb-3">
              <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Data-Driven Insights</h3>
            <p className="text-gray-600 text-sm">Track progress and measure impact effectively</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
