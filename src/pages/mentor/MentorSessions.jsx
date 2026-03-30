import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Play, Square, Users, CheckCircle, Calendar, ChevronDown, ChevronUp } from 'lucide-react'

function AttendanceModal({ students, attendance, onSave, onClose }) {
  const [local, setLocal] = useState(attendance)
  const toggle = (id) => setLocal(prev => prev.map(a => a.studentId === id ? { ...a, status: a.status === 'present' ? 'absent' : 'present' } : a))
  const presentCount = local.filter(a => a.status === 'present').length

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-[440px] max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-sm font-semibold text-gray-900">Take Attendance</p>
            <p className="text-xs text-gray-400">{presentCount} of {local.length} present</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 text-lg leading-none">×</button>
        </div>
        <div className="px-6 py-4 space-y-2">
          {local.map(a => {
            const student = students.find(s => s.id === a.studentId)
            const present = a.status === 'present'
            return (
              <button key={a.studentId} onClick={() => toggle(a.studentId)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${present ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${present ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-600'}`}>
                    {student?.name?.[0]}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{student?.name}</p>
                    <p className="text-xs text-gray-400">Class {student?.class}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${present ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {present ? 'Present' : 'Absent'}
                </span>
              </button>
            )
          })}
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="text-sm px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={() => { onSave(local); onClose() }}
            className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Save Attendance
          </button>
        </div>
      </div>
    </div>
  )
}

function StartSessionModal({ onStart, onClose }) {
  const [topic, setTopic] = useState('')
  const [notes, setNotes] = useState('')
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-[440px]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900">Start New Session</p>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 text-lg leading-none">×</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Topic</label>
            <input type="text" placeholder="e.g. Fractions, Grammar Basics" value={topic}
              onChange={e => setTopic(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Notes (optional)</label>
            <textarea placeholder="Any pre-session notes..." value={notes}
              onChange={e => setNotes(e.target.value)} rows={2}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <p className="text-xs text-blue-700">The session starts immediately. Take attendance anytime during the session.</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="text-sm px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
          <button disabled={!topic.trim()} onClick={() => onStart({ topic, notes })}
            className="flex items-center gap-2 text-sm px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-40 transition-colors">
            <Play size={13} /> Start Session
          </button>
        </div>
      </div>
    </div>
  )
}

const MentorSessions = () => {
  const { appData, currentUser, addSession } = useApp()
  const mentor = appData.mentors.find(m => m.id === currentUser?.id) || appData.mentors[0]
  const assignedStudents = appData.students.filter(s => mentor.assignedStudents.includes(s.id))
  const mentorSessions = appData.sessions.filter(s => s.mentorId === mentor.id)

  const [liveSession, setLiveSession] = useState(null)
  const [showStart, setShowStart] = useState(false)
  const [showAttendance, setShowAttendance] = useState(false)
  const [sortKey, setSortKey] = useState('date')
  const [sortDir, setSortDir] = useState('desc')

  const handleStart = ({ topic, notes }) => {
    setLiveSession({
      topic, notes,
      attendance: assignedStudents.map(s => ({ studentId: s.id, status: 'present' }))
    })
    setShowStart(false)
  }

  const handleEndSession = () => {
    if (!liveSession) return
    addSession({
      mentorId: mentor.id,
      studentId: liveSession.attendance[0]?.studentId || null,
      topic: liveSession.topic,
      date: new Date().toISOString().split('T')[0],
      notes: liveSession.notes,
      attendance: liveSession.attendance,
    })
    setLiveSession(null)
  }

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ChevronUp size={12} className="text-gray-300" />
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-blue-500" /> : <ChevronDown size={12} className="text-blue-500" />
  }

  const sorted = [...mentorSessions].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1
    if (sortKey === 'date') return ((a.date || '') > (b.date || '') ? 1 : -1) * dir
    return ((a[sortKey] || '') > (b[sortKey] || '') ? 1 : -1) * dir
  })

  const completedCount = mentorSessions.filter(s => s.score || s.attendance?.length).length

  return (
    <div className="p-6 space-y-5">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Sessions</h2>
          <p className="text-sm text-gray-500">Log and track your teaching sessions</p>
        </div>
        {!liveSession && (
          <button onClick={() => setShowStart(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
            <Play size={14} /> Start Session
          </button>
        )}
      </div>

      {/* Live Session Banner */}
      {liveSession && (
        <div className="bg-green-50 border-2 border-green-300 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <div>
                <p className="text-sm font-semibold text-green-800">Session in progress — {liveSession.topic}</p>
                <p className="text-xs text-green-600">
                  {liveSession.attendance.length} students · {liveSession.attendance.filter(a => a.status === 'present').length} present
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowAttendance(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors">
                <Users size={14} /> Attendance
              </button>
              <button onClick={handleEndSession}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Square size={14} /> End Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center"><Calendar size={16} className="text-blue-500" /></div>
          <div><p className="text-xs text-gray-500">Total Sessions</p><p className="text-xl font-semibold text-gray-900">{mentorSessions.length}</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center"><CheckCircle size={16} className="text-green-500" /></div>
          <div><p className="text-xs text-gray-500">Completed</p><p className="text-xl font-semibold text-green-600">{completedCount}</p></div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {[
                { key: 'topic', label: 'Topic' },
                { key: null, label: 'Students' },
                { key: 'date', label: 'Date' },
                { key: null, label: 'Attendance' },
                { key: null, label: 'Status' },
              ].map(col => (
                <th key={col.label} onClick={() => col.key && handleSort(col.key)}
                  className={`text-left px-4 py-3 text-xs font-medium text-gray-500 ${col.key ? 'cursor-pointer hover:text-gray-700 select-none' : ''}`}>
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.key && <SortIcon col={col.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map(session => {
              const presentStudents = (session.attendance || []).filter(a => a.status === 'present')
              const absentStudents = (session.attendance || []).filter(a => a.status === 'absent')
              const isCompleted = !!(session.score || session.attendance?.length)
              return (
                <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{session.topic}</p>
                    {session.notes && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[160px]">{session.notes}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(session.attendance || []).map(a => {
                        const st = appData.students.find(s => s.id === a.studentId)
                        return st ? (
                          <span key={a.studentId} className={`text-xs px-1.5 py-0.5 rounded border ${a.status === 'present' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-500 border-red-200'}`}>
                            {st.name.split(' ')[0]}
                          </span>
                        ) : null
                      })}
                      {(!session.attendance || session.attendance.length === 0) && <span className="text-xs text-gray-400">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{session.date || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {presentStudents.length > 0 && <span className="text-green-600">{presentStudents.length} present</span>}
                    {presentStudents.length > 0 && absentStudents.length > 0 && <span className="mx-1">·</span>}
                    {absentStudents.length > 0 && <span className="text-red-500">{absentStudents.length} absent</span>}
                    {!session.attendance?.length && '—'}
                  </td>
                  <td className="px-4 py-3">
                    {isCompleted
                      ? <span className="text-xs text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Completed</span>
                      : <span className="text-xs text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">Upcoming</span>}
                  </td>
                </tr>
              )
            })}
            {sorted.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400">No sessions yet. Start one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showStart && <StartSessionModal onStart={handleStart} onClose={() => setShowStart(false)} />}
      {showAttendance && liveSession && (
        <AttendanceModal
          students={assignedStudents}
          attendance={liveSession.attendance}
          onSave={updated => setLiveSession(prev => ({ ...prev, attendance: updated }))}
          onClose={() => setShowAttendance(false)}
        />
      )}
    </div>
  )
}

export default MentorSessions
