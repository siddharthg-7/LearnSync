import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  BookOpen, TrendingUp, Zap, Star, Flame, Trophy, Award, Target,
  ChevronRight, Clock, CheckCircle, BarChart2, Calendar, Sparkles,
  ArrowUpRight, Circle
} from 'lucide-react';

// ─── Reusable Stat Card ───────────────────────────────────────
const StatCard = ({ label, value, sub, icon: Icon, color }) => {
  const colorMap = {
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   icon: 'bg-blue-100',    ring: 'ring-blue-200' },
    emerald:{ bg: 'bg-emerald-50',text: 'text-emerald-600',icon: 'bg-emerald-100', ring: 'ring-emerald-200' },
    amber:  { bg: 'bg-amber-50',  text: 'text-amber-600',  icon: 'bg-amber-100',   ring: 'ring-amber-200' },
    rose:   { bg: 'bg-rose-50',   text: 'text-rose-600',   icon: 'bg-rose-100',    ring: 'ring-rose-200' },
  };
  const c = colorMap[color] || colorMap.blue;
  return (
    <div className={`${c.bg} rounded-2xl p-4 md:p-5 flex flex-col gap-3 ring-1 ${c.ring} stat-card cursor-default`}>
      <div className={`w-10 h-10 ${c.icon} rounded-xl flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${c.text}`} />
      </div>
      <div>
        <p className="text-2xl md:text-3xl font-bold text-slate-900">{value}</p>
        <p className="text-sm font-semibold text-slate-500 mt-0.5">{label}</p>
        {sub && <p className={`text-xs font-medium ${c.text} mt-1`}>{sub}</p>}
      </div>
    </div>
  );
};

// ─── Progress Ring ────────────────────────────────────────────
const ProgressRing = ({ value, size = 80, stroke = 7, color = '#3b82f6' }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        className="transition-all duration-700" />
    </svg>
  );
};

// ─── FOUNDATION DASHBOARD (age ≤ 10) ─────────────────────────
const FoundationDashboard = ({ student, studyPlan, courses }) => {
  const navigate = useNavigate();
  const nextLevelXP = 1000;
  const progressPercent = Math.min((student.xp / nextLevelXP) * 100, 100);

  const subjects = [
    { name: 'Mathematics', bg: 'from-sky-500 to-blue-600', img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80' },
    { name: 'English',     bg: 'from-amber-500 to-orange-600', img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80' },
    { name: 'Science',     bg: 'from-emerald-500 to-teal-600', img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=80' },
  ];

  const badges = [
    { icon: Star,     name: 'First Star',    color: 'text-amber-500',   bg: 'bg-amber-50',   unlocked: true  },
    { icon: Flame,    name: 'Streak Pro',    color: 'text-orange-500',  bg: 'bg-orange-50',  unlocked: student.streak >= 5 },
    { icon: BookOpen, name: 'Bookworm',      color: 'text-blue-500',    bg: 'bg-blue-50',    unlocked: true  },
    { icon: Target,   name: 'Sharpshooter', color: 'text-red-500',     bg: 'bg-red-50',     unlocked: false },
    { icon: Zap,      name: 'Speed Star',   color: 'text-sky-500',     bg: 'bg-sky-50',     unlocked: false },
    { icon: Award,    name: 'Champion',     color: 'text-emerald-500', bg: 'bg-emerald-50', unlocked: false },
  ];

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="flex items-center">
          <div className="flex-1 p-5 md:p-8">
            <p className="text-slate-500 text-sm font-medium">Hello there,</p>
            <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mt-0.5">{student.name}!</h1>
            <p className="text-slate-400 text-sm mt-1 mb-4">Ready to learn something amazing today?</p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-semibold border border-amber-200">
              <Trophy className="w-3.5 h-3.5" /> Level {student.level_number}
            </span>
          </div>
          <img src="https://images.unsplash.com/photo-1503676382389-4809596d5290?w=300&q=80"
            alt="Learning" className="w-28 h-28 md:w-44 md:h-44 object-cover flex-shrink-0 opacity-80" />
        </div>
      </div>

      {/* XP Progress */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-slate-800 flex items-center gap-2"><Star className="w-4 h-4 text-amber-500" /> Level Progress</span>
          <span className="text-sm font-bold text-slate-700">{student.xp} / {nextLevelXP} XP</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700"
            style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="flex justify-between mt-1.5 text-xs text-slate-400 font-medium">
          <span>Lv {student.level_number}</span><span>Lv {student.level_number + 1}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Stars Earned" value={student.xp} icon={Star} color="amber" sub="Keep going!" />
        <StatCard label="Day Streak" value={`${student.streak}d`} icon={Flame} color="rose" sub="On fire!" />
      </div>

      {/* Subject Cards */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">My Subjects</h2>
        <div className="grid grid-cols-3 gap-3">
          {subjects.map((s, i) => (
            <div key={i} onClick={() => navigate('/courses')}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform group shadow-sm">
              <img src={s.img} alt={s.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <p className="absolute bottom-2 inset-x-0 text-center text-white text-xs font-bold px-1">{s.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Missions */}
      {studyPlan?.tasks?.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-500" /> Today's Missions
          </h2>
          <div className="space-y-2">
            {studyPlan.tasks.slice(0, 3).map((task, i) => {
              const cols = ['bg-blue-50 border-blue-200 text-blue-700','bg-emerald-50 border-emerald-200 text-emerald-700','bg-amber-50 border-amber-200 text-amber-700'];
              return (
                <div key={task.id} className={`flex items-center gap-3 p-3 rounded-xl border ${cols[i % 3]}`}>
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm font-medium flex-1 truncate">{task.task}</p>
                  <span className="text-xs font-bold">+{task.xp} XP</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Badges */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
        <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" /> My Badges
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {badges.map((b, i) => {
            const B = b.icon;
            return (
              <div key={i} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center
                ${b.unlocked ? `${b.bg} border-slate-200` : 'bg-slate-50 border-slate-100 opacity-40'}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${b.unlocked ? b.bg : 'bg-slate-100'}`}>
                  <B className={`w-4 h-4 ${b.unlocked ? b.color : 'text-slate-400'}`} />
                </div>
                <p className="text-xs font-semibold text-slate-700 leading-tight">{b.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── GROWTH DASHBOARD (age 11–14) ─────────────────────────────
const GrowthDashboard = ({ student, studyPlan, courses }) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500 font-medium">Welcome back,</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{student.name}!</h1>
          <p className="text-sm text-blue-600 font-medium mt-1">Growth Mode · Level {student.level_number}</p>
        </div>
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-200">
          <Zap className="w-4 h-4" /> {student.xp} XP Total
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total XP"   value={student.xp}           icon={Zap}       color="blue"    sub="Points earned" />
        <StatCard label="Day Streak" value={`${student.streak}d`} icon={Flame}     color="rose"    sub="Keep going!" />
        <StatCard label="Progress"   value={`${student.progress}%`} icon={TrendingUp} color="emerald" sub="Overall" />
        <StatCard label="Level"      value={student.level_number} icon={Award}     color="amber"   sub="Current rank" />
      </div>

      {studyPlan?.tasks?.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Daily Quests</h2>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
              {studyPlan.tasks.filter(t => t.completed).length}/{studyPlan.tasks.length} done
            </span>
          </div>
          <div className="space-y-2.5">
            {studyPlan.tasks.map((task) => (
              <div key={task.id} className={`flex items-center gap-3 p-3.5 rounded-xl border-2
                ${task.completed ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                  ${task.completed ? 'bg-emerald-500' : 'bg-blue-600'}`}>
                  {task.completed
                    ? <CheckCircle className="w-4 h-4 text-white" />
                    : <Zap className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{task.task}</p>
                  <p className="text-xs text-slate-500">{task.topic}</p>
                </div>
                <span className="text-sm font-bold text-blue-600 flex-shrink-0">+{task.xp} XP</span>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/courses')}
            className="w-full mt-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
            Continue Learning
          </button>
        </div>
      )}

      {courses?.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">My Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {courses.slice(0, 4).map((course, i) => {
              const imgs = [
                'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80',
                'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80',
                'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&q=80',
                'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80',
              ];
              const prog = Math.floor(Math.random() * 40) + 30;
              return (
                <div key={course.id} onClick={() => navigate('/courses')}
                  className="cursor-pointer rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all group">
                  <div className="relative h-28" style={{
                    backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2)), url(${imgs[i % imgs.length]})`,
                    backgroundSize: 'cover', backgroundPosition: 'center'
                  }}>
                    <div className="absolute bottom-3 left-3">
                      <p className="text-white font-bold text-sm">{course.name}</p>
                      <p className="text-white/70 text-xs">{course.subject || 'General'}</p>
                    </div>
                    <ChevronRight className="absolute right-3 top-3 w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                      <span>Progress</span><span className="font-bold text-slate-800">{prog}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${prog}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {student.weakTopics && Object.keys(student.weakTopics).length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-500" /> Focus Areas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.entries(student.weakTopics).map(([subj, topics]) =>
              topics.map(topic => (
                <div key={topic} className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 capitalize truncate">{topic}</p>
                    <p className="text-xs text-slate-500">{subj}</p>
                  </div>
                  <button onClick={() => navigate('/courses')}
                    className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold hover:bg-amber-200 transition-colors flex-shrink-0">
                    Practice
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── MASTERY DASHBOARD (age ≥ 15) — 12th Grade ────────────────
const MasteryDashboard = ({ student, studyPlan, courses }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const xpToNext = 1000;
  const xpProgress = Math.min((student.xp / xpToNext) * 100, 100);

  const todayDate = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  const subjectImages = {
    Math: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80',
    Science: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80',
    English: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80',
    Physics: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&q=80',
    Chemistry: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=600&q=80',
    'Computer Science': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
  };

  const tabs = ['overview', 'courses', 'schedule'];

  // Quick tips for 12th grade students
  const tips = [
    { icon: Target,    text: 'Solve 3 previous year questions daily', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { icon: Clock,     text: 'Use Pomodoro: 25 min study, 5 min break', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { icon: BarChart2, text: 'Review weak topics before the exam week', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  ];

  return (
    <div className="space-y-5 md:space-y-6">

      {/* ── Header Banner ── */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-5 md:p-7 overflow-hidden">
        {/* bg decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-sky-500/10 rounded-full translate-y-1/2" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
              <span className="text-slate-400 text-sm font-medium">{todayDate}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {student.name.split(' ')[0]}!
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Class 12 · Mastery Mode · Level {student.level_number}
            </p>
          </div>

          {/* XP ring */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <ProgressRing value={xpProgress} size={80} stroke={6} color="#3b82f6" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-white font-bold text-sm leading-none">{Math.round(xpProgress)}%</span>
                <span className="text-slate-400 text-xs">XP</span>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-white font-bold text-2xl">{student.xp}</p>
              <p className="text-slate-400 text-xs">of {xpToNext} XP</p>
              <p className="text-blue-400 text-xs font-semibold mt-1">Level {student.level_number + 1} soon!</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Key Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total XP"     value={student.xp}             icon={Zap}        color="blue"    sub={`Lv ${student.level_number}`} />
        <StatCard label="Study Streak" value={`${student.streak}d`}   icon={Flame}      color="rose"    sub="Keep it up!" />
        <StatCard label="Progress"     value={`${student.progress}%`} icon={TrendingUp} color="emerald" sub="Overall" />
        <StatCard label="Attendance"   value={`${student.attendance}%`} icon={Calendar} color="amber"   sub={student.attendance >= 80 ? 'Excellent' : 'Improve this'} />
      </div>

      {/* ── Tab Selector ── */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all
              ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="space-y-5">

          {/* Today's Study Tips */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" /> Study Tips for Today
            </h2>
            <div className="space-y-2.5">
              {tips.map((tip, i) => {
                const TipIcon = tip.icon;
                return (
                  <div key={i} className={`flex items-center gap-3 p-3 ${tip.bg} border ${tip.border} rounded-xl`}>
                    <div className={`w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <TipIcon className={`w-4 h-4 ${tip.color}`} />
                    </div>
                    <p className="text-sm font-medium text-slate-700">{tip.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Study Plan Quick View */}
          {studyPlan?.tasks?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900">Today's Schedule</h2>
                <button onClick={() => navigate('/study-plan')}
                  className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-700">
                  View all <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2.5">
                {studyPlan.tasks.slice(0, 4).map((task) => (
                  <div key={task.id} className={`flex items-center gap-3 p-3.5 rounded-xl border-2
                    ${task.completed ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      ${task.completed ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'}`}>
                      {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                        {task.task}
                      </p>
                      <p className="text-xs text-slate-400">{task.topic}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-blue-600">+{task.xp} XP</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/study-plan')}
                className="w-full mt-4 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors">
                Open Study Planner
              </button>
            </div>
          )}

          {/* Weak Topics */}
          {student.weakTopics && Object.keys(student.weakTopics).length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-rose-500" /> Areas to Strengthen
                </h2>
                <span className="text-xs text-slate-400 font-medium">Focus this week</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {Object.entries(student.weakTopics).map(([subj, topics]) =>
                  topics.map(topic => (
                    <button key={topic} onClick={() => navigate('/courses')}
                      className="flex items-center gap-2 px-3.5 py-2 bg-rose-50 border border-rose-200 rounded-xl text-sm font-medium text-rose-700 hover:bg-rose-100 transition-colors">
                      <Circle className="w-2 h-2 fill-rose-400 text-rose-400" />
                      <span className="capitalize">{topic}</span>
                      <span className="text-rose-400 text-xs">· {subj}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── COURSES TAB ── */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          {courses?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.map((course, i) => {
                const img = subjectImages[course.subject] || subjectImages.Science;
                const prog = Math.floor(Math.random() * 40) + 35;
                const totalChapters = course.chapters?.length || course.lessons?.length || 0;
                return (
                  <div key={course.id} onClick={() => navigate('/courses')}
                    className="cursor-pointer rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all group">
                    <div className="relative h-36" style={{
                      backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.2)), url(${img})`,
                      backgroundSize: 'cover', backgroundPosition: 'center'
                    }}>
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <h3 className="text-white font-bold text-base">{course.name}</h3>
                        <p className="text-white/70 text-xs mt-0.5">{course.subject || 'General'} · {totalChapters} chapters</p>
                      </div>
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                        <BookOpen className="w-3 h-3 text-white" />
                        <span className="text-white text-xs font-semibold">{prog}%</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between text-xs text-slate-500 mb-2">
                        <span>Progress</span><span className="font-bold text-slate-800">{prog}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
                        <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${prog}%` }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Star className="w-3 h-3 text-amber-500" /> +{(i + 1) * 50} XP
                        </div>
                        <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
                          Continue <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No courses assigned yet</p>
              <p className="text-slate-400 text-sm mt-1">Your mentor will assign courses soon</p>
            </div>
          )}
        </div>
      )}

      {/* ── SCHEDULE TAB ── */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          {studyPlan?.tasks?.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-slate-900">Full Schedule</h2>
                <span className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-600 font-medium">
                  {studyPlan.tasks.filter(t => t.completed).length}/{studyPlan.tasks.length} done
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-5">
                <div className="flex justify-between text-sm text-slate-500 mb-2">
                  <span>Daily Progress</span>
                  <span className="font-bold text-slate-800">
                    {Math.round((studyPlan.tasks.filter(t => t.completed).length / studyPlan.tasks.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${(studyPlan.tasks.filter(t => t.completed).length / studyPlan.tasks.length) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-2.5">
                {studyPlan.tasks.map((task, idx) => (
                  <div key={task.id} className={`flex items-start gap-3.5 p-4 rounded-xl border-2
                    ${task.completed ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 hover:border-slate-200'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold
                      ${task.completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {task.completed ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                        {task.task}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{task.topic}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold text-blue-600">+{task.xp} XP</span>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => navigate('/study-plan')}
                className="w-full mt-4 py-2.5 border-2 border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all">
                Manage Schedule in Study Planner
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No schedule yet</p>
              <button onClick={() => navigate('/study-plan')}
                className="mt-3 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                Create Study Plan
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────
const StudentDashboard = () => {
  const { appData, currentUser } = useApp();

  const student = appData.students.find(s => s.id === currentUser?.id);

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const studyPlan = appData.studyPlans.find(p => p.studentId === student.id);
  const courses   = appData.courses.filter(c => student.subjects?.includes(c.subject));

  if (student.age <= 10) return <FoundationDashboard student={student} studyPlan={studyPlan} courses={courses} />;
  if (student.age <= 14) return <GrowthDashboard     student={student} studyPlan={studyPlan} courses={courses} />;
  return                        <MasteryDashboard    student={student} studyPlan={studyPlan} courses={courses} />;
};

export default StudentDashboard;
