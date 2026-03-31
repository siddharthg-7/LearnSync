import { useState } from 'react';
import { BookOpen, Mail, Lock, UserPlus, LogIn, GraduationCap, Rocket, Target, Users, ArrowRight, Shield } from 'lucide-react';
import { signIn, signUp, signInWithGoogle } from '../services/auth';
import Button from '../components/Button';

const LoginAuth = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithGoogle(role);

      if (result.success) {
        onLogin(result.user, result.role);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        const result = await signUp(formData.email, formData.password, {
          name: formData.name,
          role: role,
          onboarded: false
        });

        if (result.success) {
          onLogin(result.user, role);
        } else {
          setError(result.error);
        }
      } else {
        // Sign in
        const result = await signIn(formData.email, formData.password);

        if (result.success) {
          onLogin(result.user, result.role);
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const mockUsers = [
    {
      id: 'student_1',
      name: 'Priya Sharma',
      age: 9,
      class: '4th',
      level: 'foundation',
      iconType: 'foundation',
      borderColor: 'border-l-blue-500',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      role: 'student',
      subjects: ['Math', 'English'],
      mentorId: 2,
      progress: 45,
      xp: 280,
      level_number: 3,
      streak: 5,
      attendance: 70,
      onboarded: true,
      weakTopics: { Math: ['subtraction'], English: ['reading'] },
      strongTopics: { Math: ['counting'] },
      completedTopics: [1, 2, 3, 8, 10]
    },
    {
      id: 'student_2',
      name: 'Aarav Kumar',
      age: 12,
      class: '7th',
      level: 'growth',
      iconType: 'growth',
      borderColor: 'border-l-emerald-500',
      bgColor: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      role: 'student',
      subjects: ['Math', 'Science', 'English'],
      mentorId: 1,
      progress: 65,
      xp: 450,
      level_number: 5,
      streak: 12,
      attendance: 85,
      onboarded: true,
      weakTopics: { Math: ['fractions', 'decimals'], Science: ['photosynthesis'] },
      strongTopics: { Math: ['addition'], English: ['grammar'] },
      completedTopics: [1, 2, 4, 5, 10, 11, 19, 20, 23, 24, 27]
    },
    {
      id: 'student_3',
      name: 'Rohan Patel',
      age: 16,
      class: '11th',
      level: 'mastery',
      iconType: 'mastery',
      borderColor: 'border-l-gray-800',
      bgColor: 'bg-gray-50',
      iconBg: 'bg-gray-200',
      iconColor: 'text-gray-700',
      role: 'student',
      subjects: ['Math', 'Science', 'English', 'Computer Science'],
      mentorId: 1,
      progress: 78,
      xp: 890,
      level_number: 9,
      streak: 12,
      attendance: 92,
      onboarded: true,
      weakTopics: { Math: ['calculus'], Science: ['organic chemistry'] },
      strongTopics: { Math: ['algebra'], English: ['essay writing'] },
      completedTopics: [1, 2, 3, 4, 5, 6, 7, 10, 11, 19, 20, 21, 33, 34, 35, 37, 38, 45, 46, 47]
    },
    {
      id: 'mentor_1',
      name: 'Dr. Anjali Verma',
      role: 'mentor',
      iconType: 'mentor',
      borderColor: 'border-l-amber-500',
      bgColor: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      subjects: ['Math', 'Science'],
      education: 'M.Sc Mathematics',
      skillLevel: 'advanced',
      experience: 5,
      teachingExperience: true,
      ratings: { Math: 5, Science: 4 },
      assignedStudents: ['student_2', 'student_3'],
      sessionsCompleted: 45,
      avgImprovement: 25,
      onboarded: true
    },
    {
      id: 'admin',
      name: 'Demo Admin',
      role: 'admin',
      iconType: 'admin',
      borderColor: 'border-l-purple-500',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      organization: 'LearnSync NGO',
      email: 'admin@demo.com',
      onboarded: true
    }
  ];

  const handleMockLogin = (user) => {
    setError('');
    setLoading(true);
    
    try {
      // Direct login without authentication - use mock data
      // Pass all mock users so they can be added to appData
      onLogin(user, user.role, mockUsers);
    } catch {
      setError('Demo login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex gap-6">
        {/* Mock Users Section */}
        <div className="flex-1 max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Try Demo Accounts</h2>
            <p className="text-sm text-gray-600">Click any card to login instantly</p>
          </div>
          
          <div className="space-y-3">
            {mockUsers.map((user, index) => {
              const IconMap = {
                foundation: GraduationCap,
                growth: Rocket,
                mastery: Target,
                mentor: Users,
                admin: Shield
              };
              const UserIcon = IconMap[user.iconType] || GraduationCap;

              return (
                <button
                  key={index}
                  onClick={() => handleMockLogin(user)}
                  disabled={loading}
                  className={`w-full p-4 rounded-xl bg-white border-2 border-gray-100 border-l-4 ${user.borderColor} hover:shadow-md hover:border-gray-200 transition-all duration-200 text-left ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${user.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <UserIcon className={`w-5 h-5 ${user.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 text-sm sm:text-base">{user.name}</div>
                      {user.role === 'student' ? (
                        <>
                          <div className="text-xs text-gray-500">
                            {user.age} years • Class {user.class}
                          </div>
                          <div className="text-xs text-gray-400 capitalize mt-0.5">
                            {user.level} Mode
                          </div>
                        </>
                      ) : user.role === 'admin' ? (
                        <>
                          <div className="text-xs text-gray-500">NGO Administrator</div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {user.organization} • Full Access
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-xs text-gray-500">Mentor</div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {user.subjects.join(', ')}
                          </div>
                        </>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> Demo accounts must be created first. If login fails, sign up with these credentials.
            </p>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="flex-1 max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-12 h-12 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">LearnSync</h1>
            </div>
            <p className="text-lg text-gray-600">AI-Powered Learning Platform</p>
          </div>

          {/* Login/Signup Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600 text-sm">
              {isSignUp ? 'Sign up to get started' : 'Sign in to continue learning'}
            </p>
          </div>

          {/* Role Selection (only for signup) */}
          {isSignUp && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    role === 'student'
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold">Student</div>
                  <div className="text-xs text-gray-600">Learn & grow</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('mentor')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    role === 'mentor'
                      ? 'border-green-600 bg-green-50 text-green-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold">Mentor</div>
                  <div className="text-xs text-gray-600">Teach & guide</div>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                'Please wait...'
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-3 text-gray-700 font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
          </button>

          {/* Toggle Sign In/Sign Up */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setFormData({
                  email: '',
                  password: '',
                  name: '',
                  confirmPassword: ''
                });
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {isSignUp
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"}
            </button>
          </div>

            {/* Admin Note */}
            {!isSignUp && (
              <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-xs text-purple-700 text-center">
                  <strong>Admin Access:</strong> Use gruthwik44@gmail.com
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAuth;
