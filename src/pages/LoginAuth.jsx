import { useState } from 'react';
import {
  BookOpen, Mail, Lock, UserPlus, LogIn, GraduationCap,
  Rocket, Target, Users, ArrowRight, Eye, EyeOff
} from 'lucide-react';
import { signIn, signUp, signInWithGoogle } from '../services/auth';

const LoginAuth = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({ email: '', password: '', name: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleGoogleSignIn = async () => {
    setError(''); setLoading(true);
    try {
      const result = await signInWithGoogle(role);
      if (result.success) onLogin(result.user, result.role);
      else setError(result.error);
    } catch { setError('An unexpected error occurred'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
        if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return; }
        const result = await signUp(formData.email, formData.password, { name: formData.name, role, onboarded: false });
        if (result.success) onLogin(result.user, role);
        else setError(result.error);
      } else {
        const result = await signIn(formData.email, formData.password);
        if (result.success) onLogin(result.user, result.role);
        else setError(result.error);
      }
    } catch { setError('An unexpected error occurred'); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const mockUsers = [
    {
      id: 'student_1', name: 'Priya Sharma', age: 9, class: '4th', level: 'foundation',
      iconType: 'foundation', role: 'student', subjects: ['Math', 'English'],
      mentorId: 2, progress: 45, xp: 280, level_number: 3, streak: 5, attendance: 70, onboarded: true,
      weakTopics: { Math: ['subtraction'], English: ['reading'] }, strongTopics: { Math: ['counting'] }, completedTopics: [1,2,3,8,10]
    },
    {
      id: 'student_2', name: 'Aarav Kumar', age: 12, class: '7th', level: 'growth',
      iconType: 'growth', role: 'student', subjects: ['Math', 'Science', 'English'],
      mentorId: 1, progress: 65, xp: 450, level_number: 5, streak: 12, attendance: 85, onboarded: true,
      weakTopics: { Math: ['fractions', 'decimals'], Science: ['photosynthesis'] },
      strongTopics: { Math: ['addition'], English: ['grammar'] }, completedTopics: [1,2,4,5,10,11,19,20,23,24,27]
    },
    {
      id: 'student_3', name: 'Rohan Patel', age: 16, class: '11th', level: 'mastery',
      iconType: 'mastery', role: 'student', subjects: ['Math', 'Science', 'English', 'Computer Science'],
      mentorId: 1, progress: 78, xp: 890, level_number: 9, streak: 20, attendance: 88, onboarded: true,
      weakTopics: { Math: ['calculus'], Science: ['organic chemistry'] },
      strongTopics: { Math: ['algebra'], English: ['essay writing'] },
      completedTopics: [1,2,3,4,5,6,7,10,11,19,20,21,33,34,35,37,38,45,46,47]
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
    setError(''); setLoading(true);
    try { onLogin(user, user.role, mockUsers); }
    catch { setError('Demo login failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const demoCards = [
    { user: mockUsers[0], tag: 'Foundation', tagColor: 'bg-sky-100 text-sky-700', desc: 'Class 4 · Age 9', icon: GraduationCap, iconBg: 'bg-sky-100', iconColor: 'text-sky-600', accent: 'border-l-sky-500' },
    { user: mockUsers[1], tag: 'Growth',     tagColor: 'bg-emerald-100 text-emerald-700', desc: 'Class 7 · Age 12', icon: Rocket,       iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', accent: 'border-l-emerald-500' },
    { user: mockUsers[2], tag: 'Mastery',    tagColor: 'bg-blue-100 text-blue-700', desc: 'Class 11 · Age 16', icon: Target,       iconBg: 'bg-blue-100',    iconColor: 'text-blue-600',    accent: 'border-l-blue-500' },
    { user: mockUsers[3], tag: 'Mentor',     tagColor: 'bg-amber-100 text-amber-700', desc: 'Math & Science',  icon: Users,        iconBg: 'bg-amber-100',   iconColor: 'text-amber-600',   accent: 'border-l-amber-500' },
  ];

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
          <span className="text-2xl font-bold text-white tracking-tight">LearnSync</span>
        </div>

        {/* Tagline */}
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Your AI-Powered<br />Learning Journey<br />Starts Here.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Personalized study plans, AI tutoring, mentor support, and progress tracking — all in one place.
          </p>
          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {['AI Tutor', 'Study Planner', 'Live Doubts', 'Progress Analytics'].map(f => (
              <span key={f} className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-xs font-medium border border-white/10">
                {f}
              </span>
            ))}
          </div>
        </div>

        <p className="text-slate-600 text-sm">© 2026 LearnSync. All rights reserved.</p>
      </div>

      {/* ── Right panel – forms ── */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-auto">

        {/* Demo Accounts */}
        <div className="lg:w-80 bg-white border-r border-slate-200 p-6 flex flex-col gap-5 flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Try a Demo Account</h3>
            <p className="text-sm text-slate-500 mt-1">Click any card to log in instantly</p>
          </div>

          <div className="space-y-3">
            {demoCards.map(({ user, tag, tagColor, desc, icon: Icon, iconBg, iconColor, accent }) => (
              <button key={user.id} onClick={() => handleMockLogin(user)} disabled={loading}
                className={`w-full p-4 bg-white border-2 border-slate-100 border-l-4 ${accent}
                  rounded-xl hover:shadow-md hover:border-slate-200 transition-all text-left
                  disabled:opacity-50 disabled:cursor-not-allowed group`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{user.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tagColor}`}>{tag}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-auto p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-800">
              <strong>Admin access:</strong> Sign in with gruthwik44@gmail.com
            </p>
          </div>
        </div>

        {/* Auth Form */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">LearnSync</span>
          </div>

          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </h2>
              <p className="text-slate-500 text-sm mt-1.5">
                {isSignUp ? 'Sign up to start your learning journey' : 'Sign in to continue where you left off'}
              </p>
            </div>

            {/* Role selector (sign up only) */}
            {isSignUp && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-slate-700 mb-2.5">I am a:</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'student', label: 'Student', sub: 'Learn & grow' },
                    { id: 'mentor',  label: 'Mentor',  sub: 'Teach & guide' },
                  ].map(r => (
                    <button key={r.id} type="button" onClick={() => setRole(r.id)}
                      className={`p-3.5 rounded-xl border-2 text-left transition-all
                        ${role === r.id
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'}`}>
                      <p className="font-semibold text-sm">{r.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{r.sub}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required
                    placeholder="Your full name"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 transition-colors" />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type={showPass ? 'text' : 'password'} name="password"
                    value={formData.password} onChange={handleChange} required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 transition-colors" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="password" name="confirmPassword" value={formData.confirmPassword}
                      onChange={handleChange} required placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 transition-colors" />
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700
                  disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Please wait…</>
                ) : isSignUp ? (
                  <><UserPlus className="w-4 h-4" /> Create Account</>
                ) : (
                  <><LogIn className="w-4 h-4" /> Sign In</>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
              <div className="relative flex justify-center"><span className="px-3 bg-slate-50 text-slate-400 text-xs font-medium">or continue with</span></div>
            </div>

            {/* Google */}
            <button onClick={handleGoogleSignIn} disabled={loading}
              className="w-full py-3 px-4 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700
                hover:bg-slate-100 hover:border-slate-300 transition-all flex items-center justify-center gap-3">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
            </button>

            {/* Toggle */}
            <p className="mt-6 text-center text-sm text-slate-500">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(''); setFormData({ email:'', password:'', name:'', confirmPassword:'' }); }}
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAuth;
