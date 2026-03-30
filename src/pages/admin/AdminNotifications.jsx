import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { AlertTriangle, TrendingDown, User, GraduationCap, CheckCheck, Trash2, Filter, X, BookOpen, Target, MessageSquare, Send } from 'lucide-react'
import { mockStudents, mockNGOCourses as mockCourses, MOCK_APP_STUDENTS } from '../../utils/mockData'

const PRIORITY_STYLES = {
  high: 'bg-red-50 border-red-200 text-red-600',
  medium: 'bg-yellow-50 border-yellow-200 text-yellow-600',
}
const PRIORITY_DOT = {
  high: 'bg-red-500',
  medium: 'bg-yellow-400',
}

function ProgressBar({ value }) {
  const color = value >= 75 ? 'bg-green-500' : value >= 50 ? 'bg-blue-500' : 'bg-red-400'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-gray-500 w-8 text-right">{value}%</span>
    </div>
  )
}

// ── Student detail modal (works with both admin-level and app-level student objects)
function StudentModal({ student, onClose }) {
  if (!student) return null

  // Normalize fields: app-level students use 'progress' while admin-level uses 'overallProgress'
  const progress = student.overallProgress ?? student.progress ?? 0
  const sessions = student.sessions ?? 0
  const avgScore = student.avgScore ?? student.xp ?? 0
  const attendance = student.attendance ?? 0
  const name = student.name ?? 'Unknown'
  const cls = student.class ?? ''
  const age = student.age ?? ''
  const status = student.status ?? (progress < 50 ? 'at-risk' : 'active')
  const subjects = student.subjects ?? []
  const assignedMentor = student.assignedMentor ?? 'Not assigned'

  // Normalize weak topics — app-level: object {Math: ['fractions']}, admin-level: array ['Fractions']
  let weakTopicsArray = []
  if (Array.isArray(student.weakTopics)) {
    weakTopicsArray = student.weakTopics
  } else if (student.weakTopics && typeof student.weakTopics === 'object') {
    weakTopicsArray = Object.entries(student.weakTopics).flatMap(([subj, topics]) =>
      topics.map(t => `${t} (${subj})`)
    )
  }

  const enrolledCourses = mockCourses.filter(c => subjects.includes(c.subject))
  const weeksAttended = Math.round(sessions / 1.5) || 0

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-[520px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
              {name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{name}</p>
              <p className="text-xs text-gray-500">Class {cls} · Age {age}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${status === 'active' ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-500 bg-red-50 border-red-200'}`}>
              {status === 'active' ? 'Active' : 'At Risk'}
            </span>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 ml-1"><X size={16} /></button>
          </div>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Sessions', value: sessions },
              { label: 'Weeks Attended', value: weeksAttended, color: 'text-blue-600' },
              { label: 'Attendance', value: `${attendance}%`, color: attendance >= 75 ? 'text-green-600' : 'text-red-500' },
              { label: 'Avg Score', value: typeof avgScore === 'number' && avgScore > 100 ? avgScore : `${avgScore}%`, color: avgScore >= 75 ? 'text-green-600' : avgScore >= 50 ? 'text-blue-600' : 'text-red-500' },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className={`text-lg font-semibold ${s.color || 'text-gray-900'}`}>{s.value}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Overall Progress</p>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Progress across all subjects</span>
                <span className={`text-sm font-semibold ${progress >= 75 ? 'text-green-600' : progress >= 50 ? 'text-blue-600' : 'text-red-500'}`}>{progress}%</span>
              </div>
              <ProgressBar value={progress} />
            </div>
          </div>
          {enrolledCourses.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={13} className="text-gray-400" />
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Current Courses</p>
              </div>
              <div className="space-y-2">
                {enrolledCourses.map(c => (
                  <div key={c.id} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-medium text-gray-900">{c.name}</p>
                      <span className="text-sm font-semibold text-blue-600">{c.avgProgress}%</span>
                    </div>
                    <ProgressBar value={c.avgProgress} />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Mentor</p>
              <p className="text-sm font-medium text-gray-900">{assignedMentor}</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Subjects</p>
              <div className="flex flex-wrap gap-1">
                {subjects.map(s => <span key={s} className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">{s}</span>)}
              </div>
            </div>
          </div>
          {weakTopicsArray.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target size={13} className="text-red-400" />
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Weak Topics</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {weakTopicsArray.map(t => <span key={t} className="text-xs bg-red-50 text-red-500 border border-red-200 px-3 py-1 rounded-full">{t}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Take Action modal
function ActionModal({ notif, onClose, onSubmit }) {
  const [response, setResponse] = useState('')
  const [actionType, setActionType] = useState('acknowledge')
  const [submitted, setSubmitted] = useState(false)

  const actions = [
    { key: 'acknowledge', label: '✅ Acknowledge & Monitor', desc: 'Mark as seen, will follow up' },
    { key: 'schedule-meeting', label: '📅 Schedule Meeting', desc: 'Arrange a meeting with the mentor' },
    { key: 'assign-counselor', label: '🩺 Assign Counselor', desc: 'Refer student to a counselor' },
    { key: 'contact-parents', label: '📞 Contact Parents', desc: 'Reach out to parents/guardians' },
    { key: 'reassign-mentor', label: '🔄 Reassign Mentor', desc: 'Assign a different mentor' },
  ]

  const handleSubmit = () => {
    onSubmit(notif.id, { actionType, response: response.trim() })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-[440px] p-8 text-center space-y-4">
          <div className="inline-flex p-3 bg-green-100 rounded-full">
            <CheckCheck className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Action Recorded</h3>
          <p className="text-sm text-gray-600">
            The notification for <strong>{notif.student || notif.mentor}</strong> has been marked as actioned.
            {actionType === 'schedule-meeting' && ' A meeting request will be sent to the mentor.'}
            {actionType === 'assign-counselor' && ' The student will be referred for counseling support.'}
            {actionType === 'contact-parents' && ' The parent contact process has been initiated.'}
            {actionType === 'reassign-mentor' && ' The mentor reassignment is being processed.'}
          </p>
          <button onClick={onClose} className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-[520px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Take Action</h3>
            <p className="text-xs text-gray-500">Respond to report about {notif.student || notif.mentor}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-5">
          {/* Context */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs border px-2 py-0.5 rounded-full ${PRIORITY_STYLES[notif.priority]}`}>{notif.priority} priority</span>
              {notif.issue && <span className="text-xs bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full">{notif.issue}</span>}
            </div>
            <p className="text-sm text-gray-600 mt-2">{notif.description}</p>
            <p className="text-xs text-gray-400 mt-2">Reported by {notif.flaggedBy || 'System'} · {notif.date}</p>
          </div>

          {/* Action type */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Select Action</p>
            <div className="space-y-2">
              {actions.map(a => (
                <button key={a.key} onClick={() => setActionType(a.key)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    actionType === a.key ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                  <p className={`text-sm font-medium ${actionType === a.key ? 'text-blue-800' : 'text-gray-900'}`}>{a.label}</p>
                  <p className="text-xs text-gray-500">{a.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Admin notes */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Admin Notes (optional)</p>
            <textarea
              value={response}
              onChange={e => setResponse(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 h-24 resize-none"
              placeholder="Add notes about this action..."
            />
          </div>

          <div className="flex gap-2">
            <button onClick={handleSubmit}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
              <Send size={14} /> Submit Action
            </button>
            <button onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TrendBadge({ trend }) {
  if (trend === 'decreasing') return <span className="text-xs bg-red-50 text-red-500 border border-red-200 px-2 py-0.5 rounded-full">Decreasing</span>
  return <span className="text-xs bg-yellow-50 text-yellow-600 border border-yellow-200 px-2 py-0.5 rounded-full">Stagnant</span>
}

function ScoreSparkline({ history }) {
  const max = Math.max(...history)
  const min = Math.min(...history) - 5
  const range = max - min || 1
  const w = 80, h = 28
  const pts = history.map((v, i) => {
    const x = (i / (history.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')
  const isDown = history[history.length - 1] < history[0]
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={isDown ? '#ef4444' : '#f59e0b'} strokeWidth="1.5" strokeLinejoin="round" />
      {history.map((v, i) => {
        const x = (i / (history.length - 1)) * w
        const y = h - ((v - min) / range) * h
        return <circle key={i} cx={x} cy={y} r="2.5" fill={isDown ? '#ef4444' : '#f59e0b'} />
      })}
    </svg>
  )
}

function StudentFlagCard({ notif, onMarkRead, onDismiss, onViewStudent, onTakeAction }) {
  return (
    <div className={`bg-white border rounded-xl p-4 space-y-3 ${notif.status === 'unread' ? 'border-red-200' : notif.status === 'actioned' ? 'border-green-200' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${notif.status === 'unread' ? PRIORITY_DOT[notif.priority] : notif.status === 'actioned' ? 'bg-green-500' : 'bg-gray-300'}`} />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-900">{notif.student}</span>
              <span className={`text-xs border px-2 py-0.5 rounded-full ${PRIORITY_STYLES[notif.priority]}`}>{notif.priority} priority</span>
              <span className="text-xs bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full">{notif.issue}</span>
              {notif.status === 'actioned' && (
                <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full">Actioned</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Flagged by <span className="font-medium text-gray-700">{notif.flaggedBy}</span> · {notif.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {notif.status === 'unread' && (
            <button onClick={() => onMarkRead(notif.id)} title="Mark as read" className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><CheckCheck size={14} /></button>
          )}
          <button onClick={() => onDismiss(notif.id)} title="Dismiss" className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
        </div>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed pl-5">{notif.description}</p>
      {notif.adminResponse && (
        <div className="ml-5 p-2 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-xs text-blue-700"><strong>Admin response:</strong> {notif.adminResponse}</p>
        </div>
      )}
      <div className="pl-5 flex gap-2">
        {notif.status !== 'actioned' && (
          <button onClick={() => onTakeAction(notif)} className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
            <MessageSquare size={12} /> Take Action
          </button>
        )}
        <button onClick={() => onViewStudent(notif.studentId)} className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">View Student</button>
      </div>
    </div>
  )
}

function MentorPerformanceCard({ notif, onMarkRead, onDismiss, onTakeAction }) {
  return (
    <div className={`bg-white border rounded-xl p-4 space-y-3 ${notif.status === 'unread' ? 'border-yellow-200' : notif.status === 'actioned' ? 'border-green-200' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${notif.status === 'unread' ? PRIORITY_DOT[notif.priority] : notif.status === 'actioned' ? 'bg-green-500' : 'bg-gray-300'}`} />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-900">{notif.mentor}</span>
              <span className={`text-xs border px-2 py-0.5 rounded-full ${PRIORITY_STYLES[notif.priority]}`}>{notif.priority} priority</span>
              <TrendBadge trend={notif.trend} />
              {notif.status === 'actioned' && (
                <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full">Actioned</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">System flagged · {notif.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {notif.status === 'unread' && (
            <button onClick={() => onMarkRead(notif.id)} title="Mark as read" className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><CheckCheck size={14} /></button>
          )}
          <button onClick={() => onDismiss(notif.id)} title="Dismiss" className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
        </div>
      </div>
      <div className="pl-5 flex items-center justify-between gap-4">
        <p className="text-sm text-gray-600 leading-relaxed flex-1">{notif.description}</p>
        {notif.scoreHistory && (
          <div className="shrink-0">
            <p className="text-xs text-gray-400 mb-1 text-center">Score trend</p>
            <ScoreSparkline history={notif.scoreHistory} />
          </div>
        )}
      </div>
      {notif.adminResponse && (
        <div className="ml-5 p-2 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-xs text-blue-700"><strong>Admin response:</strong> {notif.adminResponse}</p>
        </div>
      )}
      <div className="pl-5 flex gap-2">
        {notif.status !== 'actioned' && (
          <button onClick={() => onTakeAction(notif)} className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
            <MessageSquare size={12} /> Take Action
          </button>
        )}
        <button className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">View Profile</button>
      </div>
    </div>
  )
}

export default function AdminNotifications() {
  const { notifications, updateNotification, dismissNotification, markAllNotificationsRead, appData } = useApp()
  const [filter, setFilter] = useState('all')
  const [viewStudent, setViewStudent] = useState(null)
  const [actionNotif, setActionNotif] = useState(null) // notification being actioned

  const unreadCount = notifications.filter(n => n.status === 'unread').length

  const markRead = (id) => updateNotification(id, { status: 'read' })
  const dismiss = (id) => dismissNotification(id)
  const markAllRead = () => markAllNotificationsRead()

  // Resolve student from EITHER admin-level mockStudents (numeric IDs) OR app-level students (string IDs like 'student_1')
  const handleViewStudent = (studentId) => {
    // 1. Check admin-level mockStudents (numeric IDs like 2, 6, 8)
    let student = mockStudents.find(s => s.id === studentId)
    if (student) { setViewStudent(student); return }

    // 2. Check app-level students from appData (string IDs like 'student_1')
    const appStudent = appData.students.find(s => s.id === studentId)
    if (appStudent) {
      // Also check MOCK_APP_STUDENTS for the full canonical data
      const canonical = MOCK_APP_STUDENTS.find(s => s.id === studentId) || appStudent
      // Find mentor name for display
      const mentor = appData.mentors.find(m => m.assignedStudents?.includes(studentId))
      setViewStudent({
        ...canonical,
        overallProgress: canonical.progress,
        sessions: appData.sessions.filter(s => s.studentId === studentId).length,
        avgScore: canonical.xp,
        assignedMentor: mentor?.name || 'Not assigned',
        status: canonical.progress < 50 ? 'at-risk' : 'active',
      })
      return
    }

    // 3. Fallback: not found
    console.warn('Student not found:', studentId)
  }

  // Handle Take Action submission
  const handleActionSubmit = (notifId, { actionType, response }) => {
    updateNotification(notifId, {
      status: 'actioned',
      actionType,
      adminResponse: response || `Action: ${actionType}`,
      actionDate: new Date().toISOString().split('T')[0],
    })
  }

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return n.status === 'unread'
    if (filter === 'student-flag') return n.type === 'student-flag'
    if (filter === 'mentor-performance') return n.type === 'mentor-performance'
    return true
  })

  const studentFlags = filtered.filter(n => n.type === 'student-flag')
  const mentorFlags = filtered.filter(n => n.type === 'mentor-performance')

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'student-flag', label: 'Student Flags' },
    { key: 'mentor-performance', label: 'Mentor Performance' },
  ]

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-gray-900">Notifications</h2>
          {unreadCount > 0 && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-medium">{unreadCount} new</span>}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors">
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center"><AlertTriangle size={16} className="text-red-500" /></div>
          <div><p className="text-xs text-gray-500">Student Flags</p><p className="text-xl font-semibold text-gray-900">{notifications.filter(n => n.type === 'student-flag').length}</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center"><TrendingDown size={16} className="text-yellow-500" /></div>
          <div><p className="text-xs text-gray-500">Mentor Alerts</p><p className="text-xl font-semibold text-gray-900">{notifications.filter(n => n.type === 'mentor-performance').length}</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center"><Filter size={16} className="text-blue-500" /></div>
          <div><p className="text-xs text-gray-500">Unread</p><p className="text-xl font-semibold text-gray-900">{unreadCount}</p></div>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {filters.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${filter === f.key ? 'bg-white text-gray-900 shadow-sm font-medium' : 'text-gray-500 hover:text-gray-700'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <p className="text-sm text-gray-400">No notifications here.</p>
        </div>
      )}

      {studentFlags.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User size={14} className="text-red-500" />
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Student Flags</p>
          </div>
          {studentFlags.map(n => (
            <StudentFlagCard key={n.id} notif={n} onMarkRead={markRead} onDismiss={dismiss} onViewStudent={handleViewStudent} onTakeAction={setActionNotif} />
          ))}
        </div>
      )}

      {mentorFlags.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <GraduationCap size={14} className="text-yellow-500" />
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Mentor Performance Alerts</p>
          </div>
          {mentorFlags.map(n => (
            <MentorPerformanceCard key={n.id} notif={n} onMarkRead={markRead} onDismiss={dismiss} onTakeAction={setActionNotif} />
          ))}
        </div>
      )}

      {viewStudent && <StudentModal student={viewStudent} onClose={() => setViewStudent(null)} />}
      {actionNotif && <ActionModal notif={actionNotif} onClose={() => setActionNotif(null)} onSubmit={handleActionSubmit} />}
    </div>
  )
}
