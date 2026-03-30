import { useState } from 'react'
import { Users, GraduationCap, CalendarCheck, Star, Activity, AlertTriangle, TrendingDown, X, Sparkles, RefreshCw } from 'lucide-react'
import { useApp } from '../../context/AppContext'

function MetricCard({ icon: Icon, label, value, sub, color = 'text-gray-900' }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500">{label}</span>
        <Icon size={16} className="text-gray-400" />
      </div>
      <p className={`text-2xl font-semibold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-[480px] max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><X size={16} /></button>
        </div>
        <div className="px-6 py-4 space-y-3">{children}</div>
      </div>
    </div>
  )
}

function BarChart({ data, valueKey, labelKey, color = '#2563eb', activeKey }) {
  const W = 340, H = 100, pad = { l: 8, r: 8, t: 8, b: 24 }
  const max = Math.max(...data.map(d => d[valueKey])) || 1
  const bw = (W - pad.l - pad.r) / data.length - 4
  return (
    <svg viewBox={`0 0 ${W} ${H + pad.b}`} className="w-full">
      {data.map((d, i) => {
        const bh = Math.max(2, ((d[valueKey] / max) * H) - pad.t)
        const x = pad.l + i * ((W - pad.l - pad.r) / data.length) + 2
        const y = H - bh
        const fill = activeKey ? (d[activeKey] ? color : '#e5e7eb') : color
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={bh} rx={3} fill={fill} />
            <text x={x + bw / 2} y={H + 16} textAnchor="middle" fontSize={9} fill="#9ca3af">{d[labelKey]}</text>
            <text x={x + bw / 2} y={y - 3} textAnchor="middle" fontSize={8} fill="#6b7280">{d[valueKey]}</text>
          </g>
        )
      })}
    </svg>
  )
}

function LineChart({ values, labels, color = '#2563eb', fill = false }) {
  const W = 340, H = 90, padX = 20, padY = 10
  const min = Math.min(...values) - 5
  const max = Math.max(...values) + 5
  const range = max - min || 1
  const pts = values.map((v, i) => {
    const x = padX + (i / (values.length - 1)) * (W - padX * 2)
    const y = padY + (1 - (v - min) / range) * (H - padY * 2)
    return [x, y]
  })
  const polyline = pts.map(p => p.join(',')).join(' ')
  const area = `${pts[0][0]},${H} ` + polyline + ` ${pts[pts.length - 1][0]},${H}`
  return (
    <svg viewBox={`0 0 ${W} ${H + 20}`} className="w-full">
      {[0, 0.5, 1].map((t, i) => {
        const y = padY + t * (H - padY * 2)
        return <line key={i} x1={padX} x2={W - padX} y1={y} y2={y} stroke="#f3f4f6" strokeWidth={1} />
      })}
      {fill && <polygon points={area} fill={color} fillOpacity={0.08} />}
      <polyline points={polyline} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={3} fill={color} />
          <text x={x} y={H + 16} textAnchor="middle" fontSize={9} fill="#9ca3af">{labels[i]}</text>
          <text x={x} y={y - 6} textAnchor="middle" fontSize={8} fill="#6b7280">{values[i]}%</text>
        </g>
      ))}
    </svg>
  )
}

function ChartCard({ title, sub, stat, statLabel, statColor = 'text-blue-600', children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
        </div>
        <div className="text-right">
          <p className={`text-xl font-semibold ${statColor}`}>{stat}</p>
          <p className="text-xs text-gray-400">{statLabel}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

const PRIORITY_CONFIG = {
  high:     { dot: 'bg-red-500',    badge: 'bg-red-50 text-red-600 border-red-200',          border: 'border-l-red-400' },
  medium:   { dot: 'bg-yellow-400', badge: 'bg-yellow-50 text-yellow-700 border-yellow-200', border: 'border-l-yellow-400' },
  positive: { dot: 'bg-green-500',  badge: 'bg-green-50 text-green-600 border-green-200',    border: 'border-l-green-400' },
}

function AISuggestions({ students, mentors, analytics }) {
  const buildSuggestions = () => {
    const highRisk = students.filter(s => (s.progress || 0) < 40 || (s.attendance || 100) < 65)
    const lowMentors = mentors.filter(m => (m.avgImprovement || 0) < 15)
    const suggestions = []

    if (highRisk.length > 0) {
      suggestions.push({
        id: 1, priority: 'high', category: 'Students',
        title: `Intervene for ${highRisk.length} at-risk student${highRisk.length > 1 ? 's' : ''}`,
        detail: `${highRisk.map(s => s.name).join(', ')} ${highRisk.length > 1 ? 'are' : 'is'} showing low progress or attendance. Schedule a direct check-in or assign additional support.`,
        action: 'Schedule Check-in',
      })
    }
    if (lowMentors.length > 0) {
      suggestions.push({
        id: 2, priority: 'high', category: 'Mentors',
        title: `Review performance of ${lowMentors.length} mentor${lowMentors.length > 1 ? 's' : ''}`,
        detail: `${lowMentors.map(m => m.name).join(', ')} ${lowMentors.length > 1 ? 'have' : 'has'} low improvement rates. Consider enrolling them in training or reassigning students.`,
        action: 'Assign Training',
      })
    }
    if ((analytics.attendanceRate || 0) < 85) {
      suggestions.push({
        id: 3, priority: 'medium', category: 'Attendance',
        title: 'Attendance rate needs attention',
        detail: `Overall attendance is ${analytics.attendanceRate}%, below the 85% target. Identify frequent absentees and reach out to their families or mentors.`,
        action: 'View Attendance',
      })
    }
    const weakSubject = (analytics.weakSubjects || [])[0]
    if (weakSubject) {
      suggestions.push({
        id: 4, priority: 'medium', category: 'Curriculum',
        title: `Strengthen ${weakSubject.subject} curriculum`,
        detail: `${weakSubject.percentage}% of students are struggling in ${weakSubject.subject}. Upload additional modules or assign a stronger mentor to focus on this subject.`,
        action: 'Upload Module',
      })
    }
    const top = [...mentors].sort((a, b) => (b.avgImprovement || 0) - (a.avgImprovement || 0))[0]
    if (top) {
      suggestions.push({
        id: 5, priority: 'positive', category: 'Recognition',
        title: `Recognise ${top.name}'s performance`,
        detail: `${top.name} has the highest improvement rate at ${top.avgImprovement}% with ${top.sessionsCompleted} sessions. Feature them as a model mentor.`,
        action: 'Send Recognition',
      })
    }
    return suggestions
  }

  const [suggestions, setSuggestions] = useState(buildSuggestions)
  const [loading, setLoading] = useState(false)
  const [dismissed, setDismissed] = useState([])

  const regenerate = () => {
    setLoading(true)
    setTimeout(() => { setSuggestions(buildSuggestions()); setDismissed([]); setLoading(false) }, 1200)
  }

  const visible = suggestions.filter(s => !dismissed.includes(s.id))

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-blue-500" />
          <h2 className="text-sm font-semibold text-gray-900">AI Suggestions</h2>
          <span className="text-xs text-gray-400">Based on current data</span>
        </div>
        <button onClick={regenerate} disabled={loading}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50">
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Analysing...' : 'Regenerate'}
        </button>
      </div>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : visible.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">All suggestions dismissed. Click Regenerate to refresh.</p>
      ) : (
        <div className="space-y-3">
          {visible.map(s => {
            const cfg = PRIORITY_CONFIG[s.priority]
            return (
              <div key={s.id} className={`flex items-start gap-3 p-3 border border-gray-100 border-l-4 ${cfg.border} rounded-xl`}>
                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-sm font-medium text-gray-900">{s.title}</p>
                    <span className={`text-xs border px-1.5 py-0.5 rounded-full ${cfg.badge}`}>{s.category}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.detail}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button className="text-xs px-2.5 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">{s.action}</button>
                  <button onClick={() => setDismissed(d => [...d, s.id])} className="p-1 text-gray-300 hover:text-gray-500 rounded transition-colors"><X size={13} /></button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const { appData } = useApp()
  const { analytics, students, mentors } = appData

  const highRiskStudents = students.filter(s => (s.progress || 0) < 40 || (s.attendance || 100) < 65)
  const lowPerformingMentors = mentors.filter(m => (m.avgImprovement || 0) < 15)

  const subjectScores = {}
  students.forEach(s => {
    s.subjects.forEach(sub => {
      if (!subjectScores[sub]) subjectScores[sub] = []
      subjectScores[sub].push(s.progress || 0)
    })
  })
  const decliningSubjects = Object.entries(subjectScores)
    .map(([subject, scores]) => ({
      subject,
      avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      studentCount: scores.length,
    }))
    .sort((a, b) => a.avgScore - b.avgScore)
    .slice(0, 2)

  const mentorActivityData = mentors.map(m => ({
    name: m.name.split(' ')[0],
    sessions: m.sessionsCompleted || 0,
    active: (m.assignedStudents || []).length > 0,
  }))

  const attendanceWeekly = (analytics.weeklyProgress || []).map(w => w.progress || 0).slice(-6)
  const attendanceLabels = (analytics.weeklyProgress || []).map(w => w.week || '').slice(-6)
  const growthData = attendanceWeekly.map((v, i) => Math.min(100, v + i * 2))

  const [modal, setModal] = useState(null)

  return (
    <div className="p-6 space-y-6">

      {/* Metric Cards */}
      <div className="grid grid-cols-5 gap-4">
        <MetricCard icon={Users} label="Total Students" value={analytics.totalStudents} sub="enrolled" />
        <MetricCard icon={GraduationCap} label="Active Mentors" value={analytics.activeMentors} sub="this month" />
        <MetricCard icon={CalendarCheck} label="Total Sessions" value={analytics.totalSessions || 0} sub="conducted" />
        <MetricCard icon={Star} label="Avg Progress" value={`${analytics.avgProgress}%`} sub="across all subjects" color="text-blue-600" />
        <MetricCard icon={Activity} label="Attendance Rate" value={`${analytics.attendanceRate}%`} sub="this week" color="text-green-600" />
      </div>

      {/* Alert Buttons */}
      <div className="grid grid-cols-3 gap-4">
        <button onClick={() => setModal('risk')} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-left">
          <AlertTriangle size={16} />
          <span className="text-sm font-medium">{highRiskStudents.length} High-Risk Students</span>
        </button>
        <button onClick={() => setModal('mentor')} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors text-left">
          <AlertTriangle size={16} />
          <span className="text-sm font-medium">{lowPerformingMentors.length} Low-performing Mentors</span>
        </button>
        <button onClick={() => setModal('subject')} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors text-left">
          <TrendingDown size={16} />
          <span className="text-sm font-medium">{decliningSubjects.length} Subjects Declining</span>
        </button>
      </div>

      {/* Charts */}
      {attendanceWeekly.length > 1 && (
        <div className="grid grid-cols-3 gap-4">
          <ChartCard title="Mentor Activeness" sub="Sessions conducted per mentor"
            stat={mentors.filter(m => (m.assignedStudents || []).length > 0).length}
            statLabel="active mentors" statColor="text-blue-600">
            <BarChart data={mentorActivityData} valueKey="sessions" labelKey="name" color="#2563eb" activeKey="active" />
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-xs text-gray-400"><span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block" /> Active</span>
              <span className="flex items-center gap-1 text-xs text-gray-400"><span className="w-2.5 h-2.5 rounded-sm bg-gray-200 inline-block" /> Inactive</span>
            </div>
          </ChartCard>
          <ChartCard title="Weekly Progress" sub="Average progress rate"
            stat={`${attendanceWeekly[attendanceWeekly.length - 1]}%`}
            statLabel="this week" statColor="text-green-600">
            <LineChart values={attendanceWeekly} labels={attendanceLabels} color="#16a34a" fill />
          </ChartCard>
          <ChartCard title="Growth Velocity" sub="Avg student score over time"
            stat={`+${growthData[growthData.length - 1] - growthData[0]}%`}
            statLabel="total gain" statColor="text-purple-600">
            <LineChart values={growthData} labels={attendanceLabels} color="#7c3aed" fill />
          </ChartCard>
        </div>
      )}

      {/* AI Suggestions */}
      <AISuggestions students={students} mentors={mentors} analytics={analytics} />

      {/* Modals */}
      {modal === 'risk' && (
        <Modal title={`High-Risk Students (${highRiskStudents.length})`} onClose={() => setModal(null)}>
          {highRiskStudents.length === 0
            ? <p className="text-sm text-gray-400 text-center py-4">No high-risk students.</p>
            : highRiskStudents.map(s => {
              const mentor = mentors.find(m => m.id === s.mentorId)
              return (
                <div key={s.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.class} · Mentor: {mentor?.name || 'Unassigned'}</p>
                    {Object.values(s.weakTopics || {}).flat().length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {Object.values(s.weakTopics).flat().map(t => <span key={t} className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">{t}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <p className="text-xs text-gray-500">Progress</p>
                    <p className="text-sm font-semibold text-red-500">{s.progress}%</p>
                    <p className="text-xs text-gray-500 mt-0.5">Attendance: {s.attendance}%</p>
                  </div>
                </div>
              )
            })}
        </Modal>
      )}
      {modal === 'mentor' && (
        <Modal title={`Low-Performing Mentors (${lowPerformingMentors.length})`} onClose={() => setModal(null)}>
          {lowPerformingMentors.length === 0
            ? <p className="text-sm text-gray-400 text-center py-4">All mentors performing well.</p>
            : lowPerformingMentors.map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-100 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-900">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.subjects.join(', ')} · {(m.assignedStudents || []).length} students</p>
                </div>
                <div className="text-right ml-4 shrink-0 space-y-0.5">
                  <p className="text-xs text-gray-500">Improvement</p>
                  <p className="text-sm font-semibold text-yellow-600">{m.avgImprovement}%</p>
                  <p className="text-xs text-gray-500">Sessions: {m.sessionsCompleted}</p>
                </div>
              </div>
            ))}
        </Modal>
      )}
      {modal === 'subject' && (
        <Modal title={`Declining Subjects (${decliningSubjects.length})`} onClose={() => setModal(null)}>
          {decliningSubjects.map(({ subject, avgScore, studentCount }) => {
            const affected = students.filter(s => s.subjects.includes(subject) && (s.progress || 0) < 50)
            return (
              <div key={subject} className="p-3 bg-orange-50 border border-orange-100 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{subject}</p>
                    <p className="text-xs text-gray-500">{studentCount} students enrolled</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Avg Progress</p>
                    <p className="text-sm font-semibold text-orange-600">{avgScore}%</p>
                  </div>
                </div>
                {affected.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {affected.map(s => <span key={s.id} className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">{s.name}</span>)}
                  </div>
                )}
              </div>
            )
          })}
        </Modal>
      )}
    </div>
  )
}
