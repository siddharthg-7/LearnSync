import { useState } from 'react'
import { AlertTriangle, TrendingDown, User, GraduationCap, CheckCheck, Trash2, Filter } from 'lucide-react'
import { mockNotifications as initialNotifications } from '../../utils/mockData'

const PRIORITY_STYLES = {
  high: 'bg-red-50 border-red-200 text-red-600',
  medium: 'bg-yellow-50 border-yellow-200 text-yellow-600',
}
const PRIORITY_DOT = {
  high: 'bg-red-500',
  medium: 'bg-yellow-400',
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

function StudentFlagCard({ notif, onMarkRead, onDismiss }) {
  return (
    <div className={`bg-white border rounded-xl p-4 space-y-3 ${notif.status === 'unread' ? 'border-red-200' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${notif.status === 'unread' ? PRIORITY_DOT[notif.priority] : 'bg-gray-300'}`} />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-900">{notif.student}</span>
              <span className={`text-xs border px-2 py-0.5 rounded-full ${PRIORITY_STYLES[notif.priority]}`}>{notif.priority} priority</span>
              <span className="text-xs bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full">{notif.issue}</span>
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
      <div className="pl-5 flex gap-2">
        <button className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Take Action</button>
        <button className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">View Student</button>
      </div>
    </div>
  )
}

function MentorPerformanceCard({ notif, onMarkRead, onDismiss }) {
  return (
    <div className={`bg-white border rounded-xl p-4 space-y-3 ${notif.status === 'unread' ? 'border-yellow-200' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${notif.status === 'unread' ? PRIORITY_DOT[notif.priority] : 'bg-gray-300'}`} />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-900">{notif.mentor}</span>
              <span className={`text-xs border px-2 py-0.5 rounded-full ${PRIORITY_STYLES[notif.priority]}`}>{notif.priority} priority</span>
              <TrendBadge trend={notif.trend} />
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
        <div className="shrink-0">
          <p className="text-xs text-gray-400 mb-1 text-center">Score trend</p>
          <ScoreSparkline history={notif.scoreHistory} />
        </div>
      </div>
      <div className="pl-5 flex gap-2">
        <button className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Review Mentor</button>
        <button className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">View Profile</button>
      </div>
    </div>
  )
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [filter, setFilter] = useState('all')

  const unreadCount = notifications.filter(n => n.status === 'unread').length
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'read' } : n))
  const dismiss = (id) => setNotifications(prev => prev.filter(n => n.id !== id))
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })))

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
          {studentFlags.map(n => <StudentFlagCard key={n.id} notif={n} onMarkRead={markRead} onDismiss={dismiss} />)}
        </div>
      )}

      {mentorFlags.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <GraduationCap size={14} className="text-yellow-500" />
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Mentor Performance Alerts</p>
          </div>
          {mentorFlags.map(n => <MentorPerformanceCard key={n.id} notif={n} onMarkRead={markRead} onDismiss={dismiss} />)}
        </div>
      )}
    </div>
  )
}
