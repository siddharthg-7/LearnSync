import { useState } from 'react'
import { Trash2, Search, ChevronUp, ChevronDown, X, Users, BookOpen, TrendingUp, Star, Calendar } from 'lucide-react'
import { useApp } from '../../context/AppContext'

function ProgressBar({ value }) {
  const color = value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-blue-500' : 'bg-red-400'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-gray-500 w-8 text-right">{value}%</span>
    </div>
  )
}

function StatusBadge({ status }) {
  if (status === 'active') return <span className="text-xs text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Active</span>
  return <span className="text-xs text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">Low Performing</span>
}

function StatBox({ label, value, color = 'text-gray-900' }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xl font-semibold ${color}`}>{value}</p>
    </div>
  )
}

function MentorDetailModal({ mentor, onClose, students }) {
  const assignedStudents = students.filter(s => s.mentorId === mentor.id)

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full max-w-[560px] max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
              {mentor.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{mentor.name}</p>
              <p className="text-xs text-gray-500">{(mentor.subjects || []).join(', ')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 ml-2"><X size={16} /></button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Key Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatBox label="Students" value={(mentor.assignedStudents || []).length} />
            <StatBox label="Sessions Done" value={mentor.sessionsCompleted || 0} color="text-blue-600" />
            <StatBox label="Teaching Capacity" value={mentor.teachingCapacity || 5} color="text-purple-600" />
            <StatBox label="Experience" value={`${mentor.experience || 0} yrs`} color="text-green-600" />
          </div>

          {/* Education & Skill Level */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-gray-500" />
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Qualifications</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Education</p>
                  <p className="text-sm font-medium text-gray-900">{mentor.education || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Skill Level</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">{mentor.skillLevel || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={14} className="text-gray-500" />
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Subjects Teaching</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(mentor.subjects || []).map(s => (
                <span key={s} className="text-sm bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1.5 rounded-xl font-medium">{s}</span>
              ))}
            </div>
          </div>

          {/* Assigned Students */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users size={14} className="text-gray-500" />
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Assigned Students ({assignedStudents.length})</p>
            </div>
            {assignedStudents.length > 0 ? (
              <div className="space-y-2">
                {assignedStudents.map(student => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-400">Class {student.class} · {(student.subjects || []).join(', ')}</p>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="text-xs text-gray-400">Progress</p>
                        <p className={`text-sm font-semibold ${(student.progress || 0) >= 75 ? 'text-green-600' : (student.progress || 0) >= 50 ? 'text-blue-600' : 'text-red-500'}`}>{student.progress || 0}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Attendance</p>
                        <p className={`text-sm font-semibold ${(student.attendance || 0) >= 75 ? 'text-green-600' : 'text-red-500'}`}>{student.attendance || 0}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">XP</p>
                        <p className="text-sm font-semibold text-gray-700">{student.xp || 0}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 bg-gray-50 border border-gray-100 rounded-xl p-4">No students assigned yet.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

const cols = [
  { key: 'name', label: 'Mentor' },
  { key: 'assignedStudents', label: 'Students' },
  { key: 'sessionsCompleted', label: 'Sessions' },
  { key: 'education', label: 'Education' },
  { key: 'skillLevel', label: 'Skill Level' },
]

export default function AdminMentors() {
  const { appData } = useApp()
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('sessionsCompleted')
  const [sortDir, setSortDir] = useState('desc')
  const [confirmId, setConfirmId] = useState(null)
  const [selected, setSelected] = useState(null)
  
  // Filter out demo mentors (those with IDs like 'mentor_1', 'mentor_2', etc.)
  const realMentors = appData.mentors.filter(m => {
    return !m.id.match(/^mentor_\d+$/)
  })
  
  const realStudents = appData.students.filter(s => {
    return !s.id.match(/^student_\d+$/)
  })

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const handleRemove = (id) => { 
    // TODO: Implement actual deletion from Firestore
    console.log('Delete mentor:', id)
    setConfirmId(null) 
  }

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ChevronUp size={12} className="text-gray-300" />
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-blue-500" /> : <ChevronDown size={12} className="text-blue-500" />
  }

  const filtered = realMentors
    .filter(m =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.subjects || []).some(s => s.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      let aVal = a[sortKey]
      let bVal = b[sortKey]
      
      // Handle assignedStudents array length
      if (sortKey === 'assignedStudents') {
        aVal = (a.assignedStudents || []).length
        bVal = (b.assignedStudents || []).length
      } else {
        aVal = aVal || 0
        bVal = bVal || 0
      }
      
      return (aVal > bVal ? 1 : -1) * dir
    })

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Mentors</h2>
          <p className="text-sm text-gray-500">{realMentors.length} mentors registered (excluding demo accounts)</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search mentors..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-56" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4"><p className="text-xs text-gray-500">Total Mentors</p><p className="text-2xl font-semibold text-gray-900 mt-1">{realMentors.length}</p></div>
        <div className="bg-white border border-gray-200 rounded-xl p-4"><p className="text-xs text-gray-500">Total Sessions</p><p className="text-2xl font-semibold text-blue-600 mt-1">{realMentors.reduce((s, m) => s + (m.sessionsCompleted || 0), 0)}</p></div>
        <div className="bg-white border border-gray-200 rounded-xl p-4"><p className="text-xs text-gray-500">Students Assigned</p><p className="text-2xl font-semibold text-purple-600 mt-1">{realMentors.reduce((s, m) => s + (m.assignedStudents || []).length, 0)}</p></div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {cols.map(col => (
                <th key={col.key} onClick={() => handleSort(col.key)}
                  className="text-left px-4 py-3 text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-900">
                  <span className="flex items-center gap-1">{col.label}<SortIcon col={col.key} /></span>
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(mentor => (
              <tr key={mentor.id}
                onClick={() => confirmId !== mentor.id && setSelected(mentor)}
                className="hover:bg-gray-50 transition-colors cursor-pointer">
                <td className="px-4 py-3"><p className="font-medium text-gray-900">{mentor.name}</p><p className="text-xs text-gray-400">{(mentor.subjects || []).join(', ')}</p></td>
                <td className="px-4 py-3 text-gray-700">{(mentor.assignedStudents || []).length}</td>
                <td className="px-4 py-3 text-gray-700">{mentor.sessionsCompleted || 0}</td>
                <td className="px-4 py-3 text-gray-700">{mentor.education || 'Not specified'}</td>
                <td className="px-4 py-3 text-gray-700 capitalize">{mentor.skillLevel || 'Not specified'}</td>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  {confirmId === mentor.id ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleRemove(mentor.id)} className="text-xs text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-lg">Confirm</button>
                      <button onClick={() => setConfirmId(null)} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg border border-gray-200">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmId(mentor.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">No mentors found</td></tr>}
          </tbody>
        </table>
      </div>

      {selected && <MentorDetailModal mentor={selected} students={realStudents} onClose={() => setSelected(null)} />}
    </div>
  )
}
