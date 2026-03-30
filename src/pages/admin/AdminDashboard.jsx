import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import { Users, BookOpen, TrendingUp, AlertTriangle, X, ChevronRight, Sparkles, Lightbulb, ArrowRight, Brain } from 'lucide-react';
import { mockStudents, mockMentors } from '../../utils/mockData';

// ── SVG Chart Components ───────────────────────────────────────────────────
const BarChart = ({ data, color = '#3b82f6', height = 120 }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${data.length * 44} ${height}`} preserveAspectRatio="xMidYMid meet">
      {data.map((d, i) => {
        const barH = Math.max((d.value / max) * (height - 24), 4);
        const x = i * 44 + 8;
        const y = height - 20 - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={28} height={barH} rx={4} fill={color} opacity={0.85} />
            <text x={x + 14} y={height - 4} textAnchor="middle" fontSize={9} fill="#9ca3af">
              {d.label ?? d.week?.split(' ')[1]}
            </text>
            <text x={x + 14} y={y - 4} textAnchor="middle" fontSize={9} fill="#6b7280">
              {d.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const LineAreaChart = ({ data, color = '#8b5cf6', height = 120 }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  const W = 200;
  const pad = { t: 16, b: 20, l: 8, r: 8 };
  const innerW = W - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const toX = i => pad.l + (i / (data.length - 1)) * innerW;
  const toY = v => pad.t + innerH - (v / (max * 1.1)) * innerH;
  const linePts = data.map((d, i) => `${toX(i)},${toY(d.value)}`).join(' ');
  const firstX = toX(0), lastX = toX(data.length - 1), baseY = pad.t + innerH;
  const areaPath = `M${firstX},${baseY} ${data.map((d, i) => `L${toX(i)},${toY(d.value)}`).join(' ')} L${lastX},${baseY} Z`;
  const gradId = `areaGrad-${color.replace('#', '')}`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((f, i) => (
        <line key={i} x1={pad.l} x2={W - pad.r}
          y1={pad.t + innerH * (1 - f)} y2={pad.t + innerH * (1 - f)}
          stroke="#f3f4f6" strokeWidth="1" />
      ))}
      <path d={areaPath} fill={`url(#${gradId})`} />
      <polyline points={linePts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => (
        <circle key={i} cx={toX(i)} cy={toY(d.value)} r="3.5" fill="white" stroke={color} strokeWidth="2" />
      ))}
      {data.map((d, i) => (
        <text key={i} x={toX(i)} y={height - 4} textAnchor="middle" fontSize={9} fill="#9ca3af">
          {d.label ?? d.week?.split(' ')[1]}
        </text>
      ))}
    </svg>
  );
};

// ── Modal Component ─────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4">{children}</div>
      </div>
    </div>
  );
};

// ── Status Badge helper ─────────────────────────────────────────────────────
const StatusBadge = ({ value, thresholds, labels }) => {
  const [low, mid] = thresholds;
  const [danger, warn, ok] = labels;
  const cls = value < low
    ? 'bg-red-100 text-red-700'
    : value < mid
    ? 'bg-yellow-100 text-yellow-700'
    : 'bg-green-100 text-green-700';
  const label = value < low ? danger : value < mid ? warn : ok;
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>{label}</span>;
};

// ─────────────────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { appData } = useApp();
  const [modal, setModal] = useState(null); // 'highRisk' | 'lowMentors' | 'declining'

  // Filter out demo users (those with IDs like 'student_1', 'mentor_1', etc.)
  const realStudents = appData.students.filter(s => !s.id.match(/^student_\d+$/))
  const realMentors = appData.mentors.filter(m => !m.id.match(/^mentor_\d+$/))

  // Calculate stats from real data
  const totalStudents = realStudents.length;
  const activeMentors = realMentors.filter(m => m.onboarded).length;
  const totalSessions = appData.sessions.length;
  
  // Calculate average progress
  const avgProgress = totalStudents > 0 
    ? Math.round(realStudents.reduce((sum, s) => sum + (s.progress || 0), 0) / totalStudents)
    : 0;
  const avgAttendance = totalStudents > 0
    ? Math.round(realStudents.reduce((sum, s) => sum + (s.attendance || 0), 0) / totalStudents)
    : 0;

  // High-risk students (progress < 50 or attendance < 70)
  const highRiskStudents = realStudents.filter(s => 
    (s.progress || 0) < 50 || (s.attendance || 0) < 70
  ).length;

  // Low-performing mentors (avgImprovement < 15)
  const lowPerformingMentors = realMentors.filter(m => 
    (m.avgImprovement || 0) < 15
  ).length;

  // ── Chart data ──────────────────────────────────────────────────────────
  const weeklyProgressData = [
    { week: 'Week 1', value: 55 },
    { week: 'Week 2', value: 58 },
    { week: 'Week 3', value: 61 },
    { week: 'Week 4', value: avgProgress },
  ];
  const mentorActivityData = [
    { week: 'Week 1', value: Math.max(activeMentors - 1, 1) },
    { week: 'Week 2', value: activeMentors },
    { week: 'Week 3', value: activeMentors },
    { week: 'Week 4', value: activeMentors },
  ];
  const growthVelocityData = [
    { week: 'Week 1', value: 18 },
    { week: 'Week 2', value: 20 },
    { week: 'Week 3', value: 22 },
    { week: 'Week 4', value: 24 },
  ];

  // ── Alert card style helper ─────────────────────────────────────────────
  const alertCard = (bg, border, icon, text, count, onClick) => (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border ${bg} ${border} hover:shadow-md active:scale-[0.98] transition-all duration-150 group`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold">{count} {text}</span>
        </div>
        <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
      </div>
      <p className="text-xs mt-1 opacity-60">Click to view details</p>
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      {/* Key Metrics — 4 cards (Total Sessions removed) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Students</p>
              <p className="text-3xl font-semibold text-gray-900 mt-1">{totalStudents}</p>
              <p className="text-xs text-gray-400 mt-1">enrolled</p>
            </div>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Mentors</p>
              <p className="text-3xl font-semibold text-gray-900 mt-1">{activeMentors}</p>
              <p className="text-xs text-gray-400 mt-1">this month</p>
            </div>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg Progress</p>
              <p className="text-3xl font-semibold text-blue-600 mt-1">{avgProgress}%</p>
              <p className="text-xs text-gray-400 mt-1">across all subjects</p>
            </div>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Attendance Rate</p>
              <p className="text-3xl font-semibold text-green-600 mt-1">{avgAttendance}%</p>
              <p className="text-xs text-gray-400 mt-1">this week</p>
            </div>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
        </Card>
      </div>

      {/* Clickable Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {alertCard(
          'bg-red-50', 'border-red-200',
          <AlertTriangle className="w-5 h-5 text-red-600" />,
          'High-Risk Students', highRiskStudents.length,
          () => setModal('highRisk')
        )}
        {alertCard(
          'bg-orange-50', 'border-orange-200',
          <AlertTriangle className="w-5 h-5 text-orange-600" />,
          'Low-performing Mentors', lowPerformingMentors.length,
          () => setModal('lowMentors')
        )}
        {alertCard(
          'bg-yellow-50', 'border-yellow-200',
          <TrendingUp className="w-5 h-5 text-yellow-600" />,
          'Subjects Declining', decliningSubjects.length,
          () => setModal('declining')
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Mentor Activeness</h3>
            <p className="text-xs text-gray-500">Active mentors per week</p>
          </div>
          <LineAreaChart data={mentorActivityData} color="#3b82f6" height={130} />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-gray-500">Last 4 weeks</p>
            <p className="text-xl font-semibold text-gray-900">{activeMentors} active</p>
          </div>
        </Card>

        <Card>
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Weekly Progress</h3>
            <p className="text-xs text-gray-500">Average progress rate (%)</p>
          </div>
          <BarChart data={weeklyProgressData} color="#22c55e" height={130} />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-gray-500">Last 4 weeks</p>
            <p className="text-xl font-semibold text-green-600">{avgProgress}%</p>
          </div>
        </Card>

        <Card>
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Growth Velocity</h3>
            <p className="text-xs text-gray-500">Avg improvement score over time</p>
          </div>
          <LineAreaChart data={growthVelocityData} color="#8b5cf6" height={130} />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-gray-500">Last 4 weeks</p>
            <p className="text-xl font-semibold text-purple-600">+24%</p>
          </div>
        </Card>
      </div>

      {/* ── AI Suggestions ────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-2xl border border-indigo-100 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              AI Suggestions
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">Powered by LearnSync AI</span>
            </h3>
            <p className="text-xs text-gray-500">Smart recommendations based on your organization's data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Suggestion 1 — high-risk students */}
          {highRiskStudents.length > 0 && (
            <div className="bg-white rounded-xl border border-red-100 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-50 rounded-lg mt-0.5">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">High Priority</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Intervene with at-risk students</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {highRiskStudents.length} student{highRiskStudents.length > 1 ? 's' : ''} ({highRiskStudents.map(s => s.name).join(', ')}) {highRiskStudents.length > 1 ? 'are' : 'is'} showing 
                    progress below 50% with declining attendance. Consider scheduling one-on-one support sessions and parental outreach.
                  </p>
                  <button onClick={() => setModal('highRisk')} className="mt-3 flex items-center gap-1 text-xs text-red-600 font-medium hover:text-red-800 transition-colors">
                    View students <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Suggestion 2 — mentor performance */}
          {lowPerformingMentors.length > 0 && (
            <div className="bg-white rounded-xl border border-orange-100 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 rounded-lg mt-0.5">
                  <Users className="w-4 h-4 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">Action Needed</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Reassess mentor-student pairings</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {lowPerformingMentors.map(m => m.name).join(' and ')} {lowPerformingMentors.length > 1 ? 'have' : 'has'} effectiveness 
                    scores below 50%. Students under their guidance show stagnant progress. 
                    Consider pairing them with a senior mentor for shadowing, or redistributing their students.
                  </p>
                  <button onClick={() => setModal('lowMentors')} className="mt-3 flex items-center gap-1 text-xs text-orange-600 font-medium hover:text-orange-800 transition-colors">
                    Review mentors <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Suggestion 3 — attendance & engagement */}
          <div className="bg-white rounded-xl border border-blue-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg mt-0.5">
                <Brain className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">Insight</span>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {avgAttendance >= 85 ? 'Attendance is strong — maintain momentum' : 'Boost attendance with incentive programs'}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {avgAttendance >= 85
                    ? `Current attendance rate is ${avgAttendance}%, which is above the 85% target. To sustain this, consider introducing weekly attendance awards or peer-group study sessions.`
                    : `Attendance is at ${avgAttendance}%, below the 85% recommended threshold. Data from similar NGOs shows that gamified check-ins and peer accountability groups can improve attendance by 15-20%.`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Suggestion 4 — subject-specific */}
          <div className="bg-white rounded-xl border border-purple-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg mt-0.5">
                <Lightbulb className="w-4 h-4 text-purple-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">Recommendation</span>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">Strengthen English & Science curriculum</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  English and Science are the two declining subjects. The common pattern across affected students is weak comprehension skills. 
                  Consider adding visual/interactive learning modules for these subjects — video content and hands-on experiments 
                  have shown 30% better retention in similar programs.
                </p>
                <button onClick={() => setModal('declining')} className="mt-3 flex items-center gap-1 text-xs text-purple-600 font-medium hover:text-purple-800 transition-colors">
                  View declining subjects <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Suggestion 5 — growth positive */}
          <div className="bg-white rounded-xl border border-green-100 p-4 hover:shadow-md transition-shadow md:col-span-2">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 rounded-lg mt-0.5">
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Positive Trend</span>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">Growth velocity is trending upward (+24%)</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Average improvement scores have risen steadily over the last 4 weeks. This is a strong positive signal. 
                  To capitalize on this momentum, consider identifying the top-performing students and featuring their progress in a monthly newsletter or celebration event — 
                  this boosts motivation across the cohort and improves donor confidence in your outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── High-Risk Students Modal ──────────────────────────────────────── */}
      <Modal open={modal === 'highRisk'} onClose={() => setModal(null)}
        title={`⚠️ High-Risk Students (${highRiskStudents.length})`}>
        <p className="text-sm text-gray-500 mb-4">Students flagged due to low progress or poor attendance.</p>
        <div className="space-y-3">
          {highRiskStudents.map(s => (
            <div key={s.id} className="p-4 rounded-xl border border-red-100 bg-red-50">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900">{s.name}</p>
                    <span className="text-xs text-gray-500">Class {s.class} • Age {s.age}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">Mentor: {s.assignedMentor} • {s.subjects.join(', ')}</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white rounded-lg p-2">
                      <p className="text-xs text-gray-500">Progress</p>
                      <p className={`text-sm font-semibold ${s.overallProgress < 50 ? 'text-red-600' : 'text-gray-900'}`}>{s.overallProgress}%</p>
                    </div>
                    <div className="bg-white rounded-lg p-2">
                      <p className="text-xs text-gray-500">Attendance</p>
                      <p className={`text-sm font-semibold ${s.attendance < 70 ? 'text-red-600' : 'text-gray-900'}`}>{s.attendance}%</p>
                    </div>
                    <div className="bg-white rounded-lg p-2">
                      <p className="text-xs text-gray-500">Avg Score</p>
                      <p className="text-sm font-semibold text-gray-900">{s.avgScore}</p>
                    </div>
                  </div>
                  {s.weakTopics.length > 0 && (
                    <p className="text-xs text-red-600 mt-2">Weak areas: {s.weakTopics.join(', ')}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* ── Low-Performing Mentors Modal ──────────────────────────────────── */}
      <Modal open={modal === 'lowMentors'} onClose={() => setModal(null)}
        title={`📉 Low-Performing Mentors (${lowPerformingMentors.length})`}>
        <p className="text-sm text-gray-500 mb-4">Mentors with effectiveness score below threshold requiring review.</p>
        <div className="space-y-3">
          {lowPerformingMentors.map(m => (
            <div key={m.id} className="p-4 rounded-xl border border-orange-100 bg-orange-50">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900">{m.name}</p>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-orange-200 text-orange-800 font-medium">Low Performing</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Subjects: {m.subjects.join(', ')} • {m.studentsAssigned} students</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white rounded-lg p-2">
                      <p className="text-xs text-gray-500">Effectiveness</p>
                      <p className="text-sm font-semibold text-orange-600">{m.effectivenessScore}%</p>
                    </div>
                    <div className="bg-white rounded-lg p-2">
                      <p className="text-xs text-gray-500">Attendance</p>
                      <p className={`text-sm font-semibold ${m.attendance < 70 ? 'text-red-600' : 'text-gray-900'}`}>{m.attendance}%</p>
                    </div>
                    <div className="bg-white rounded-lg p-2">
                      <p className="text-xs text-gray-500">Avg Improvement</p>
                      <p className="text-sm font-semibold text-gray-900">+{m.avgImprovement}%</p>
                    </div>
                  </div>
                  <div className="mt-2 bg-white rounded-lg p-2">
                    <p className="text-xs text-gray-500 mb-1">Effectiveness score</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-orange-400" style={{ width: `${m.effectivenessScore}%` }} />
                      </div>
                      <span className="text-xs text-gray-600">{m.effectivenessScore}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* ── Declining Subjects Modal ──────────────────────────────────────── */}
      <Modal open={modal === 'declining'} onClose={() => setModal(null)}
        title={`📊 Declining Subjects (${decliningSubjects.length})`}>
        <p className="text-sm text-gray-500 mb-4">Subjects showing a downward trend in student scores over the past 4 weeks.</p>
        <div className="space-y-3">
          {decliningSubjects.map((s, i) => (
            <div key={i} className="p-4 rounded-xl border border-yellow-100 bg-yellow-50">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-900 text-base">{s.subject}</p>
                <span className="text-red-600 font-semibold text-sm">{s.trend} this month</span>
              </div>
              <p className="text-xs text-gray-600 mb-3">{s.reason}</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-500">Avg Score</p>
                  <p className="text-sm font-semibold text-yellow-700">{s.avgScore}/100</p>
                </div>
                <div className="bg-white rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-500">Students Affected</p>
                  <p className="text-sm font-semibold text-gray-900">{s.studentsAffected}</p>
                </div>
              </div>
              <div className="mt-2 bg-white rounded-lg p-2">
                <p className="text-xs text-gray-500 mb-1">Score level</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-yellow-400" style={{ width: `${s.avgScore}%` }} />
                  </div>
                  <span className="text-xs text-gray-600">{s.avgScore}%</span>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-xs text-blue-700">
              <strong>Recommended Action:</strong> Schedule additional support sessions and review mentor assignments for affected students in these subjects.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
