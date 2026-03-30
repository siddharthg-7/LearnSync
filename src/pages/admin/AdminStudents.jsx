import { useState } from 'react'
import { Search, ChevronUp, ChevronDown, Trash2, X, User, BookOpen, Calendar, TrendingUp, AlertTriangle } from 'lucide-react'
import { mockStudents as initialStudents, mockNGOCourses as mockCourses } from '../../utils/mockData'

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

function StatusBadge({ status }) {
  if (status === 'active') return <span className="text-xs text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Active</span>
  return <span className="text-xs text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">At Risk</span>
}

function StatBox({ label, value, color = 'text-gray-900' }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xl font-semibold ${color}`}>{value}</p>
    </div>
  )
}

function StudentDetailModal({ student, onClose }) {
  // derive courses this student is enrolled in based on subjects
  const enrolledCourses = mockCourses.filter(c => student.subjects.includes(c.subject))
  // estimate weeks attended from sessions (assume ~1.5 sessions/week)
  const weeksAttended = Math.round(student.sessions / 1.5)

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-[560px] max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
              {student.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{student.name}</p>
              <p className="text-xs text-gray-500">Class {student.class} · Age {student.age}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={student.status} />
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 ml-2"><X size={16} /></button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Key Stats */}
          <div className="grid grid-cols-4 gap-3">
            <StatBox label="Sessions" value={student.sessions} />
            <StatBox label="Weeks Attended" value={weeksAttended} color="text-blue-600" />
            <StatBox label="Attendance" value={`${student.attendance}%`} color={student.attendance >= 75 ? 'text-green-600' : 'text-red-500'} />
            <StatBox label="Avg Score" value={`${student.avgScore}%`} color={student.avgScore >= 75 ? 'text-green-600' : student.avgScore >= 50 ? 'text-blue-600' : 'text-red-500'} />
          </div>

          {/* Overall Progress */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-gray-500" />
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Overall Progress</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Progress across all subjects</span>
                <span className={`text-sm font-semibold ${student.overallProgress >= 75 ? 'text-green-600' : student.overallProgress >= 50 ? 'text-blue-600' : 'text-red-500'}`}>{student.overallProgress}%</span>
              </div>
              <ProgressBar value={student.overallProgress} />
            </div>
          </div>

          {/* Enrolled Courses */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={14} className="text-gray-500" />
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Current Courses</p>
            </div>
            {enrolledCourses.length > 0 ? (
              <div className="space-y-2">
                {enrolledCourses.map(course => (
                  <div key={course.id} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{course.name}</p>
                        <p className="text-xs text-gray-400">{course.subject} · {course.level}</p>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">{course.avgProgress}%</span>
                    </div>
                    <ProgressBar value={course.avgProgress} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 bg-gray-50 border border-gray-100 rounded-xl p-4">No courses matched.</p>
            )}
          </div>

          {/* Mentor & Subjects */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <User size={13} className="text-gray-400" />
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Assigned Mentor</p>
              </div>
              <p className="text-sm font-medium text-gray-900">{student.assignedMentor}</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={13} className="text-gray-400" />
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Subjects</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {student.subjects.map(s => (
                  <span key={s} className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Weak Topics */}
          {student.weakTopics.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} className="text-red-400" />
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Weak Topics</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {student.weakTopics.map(t => (
                  <span key={t} className="text-xs bg-red-50 text-red-500 border border-red-200 px-3 py-1 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

const cols = [
  { key: 'name', label: 'Student' },
  { key: 'class', label: 'Class' },
  { key: 'assignedMentor', label: 'Mentor' },
  { key: 'sessions', label: 'Sessions' },
  { key: 'avgScore', label: 'Avg Score' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'status', label: 'Status' },
]

export default function AdminStudents() {
  const [students, setStudents] = useState(initialStudents)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('overallProgress')
  const [sortDir, setSortDir] = useState('desc')
  const [confirmId, setConfirmId] = useState(null)
  const [selected, setSelected] = useState(null)

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const handleRemove = (id) => { setStudents(prev => prev.filter(s => s.id !== id)); setConfirmId(null) }

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ChevronUp size={12} className="text-gray-300" />
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-blue-500" /> : <ChevronDown size={12} className="text-blue-500" />
  }

  const filtered = students
    .filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.assignedMentor.toLowerCase().includes(search.toLowerCase()) ||
      s.subjects.some(sub => sub.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      return (a[sortKey] > b[sortKey] ? 1 : -1) * dir
    })

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Students</h2>
          <p className="text-sm text-gray-500">{students.length} students enrolled</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-56" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4"><p className="text-xs text-gray-500">Total Students</p><p className="text-2xl font-semibold text-gray-900 mt-1">{students.length}</p></div>
        <div className="bg-white border border-gray-200 rounded-xl p-4"><p className="text-xs text-gray-500">Avg Progress</p><p className="text-2xl font-semibold text-blue-600 mt-1">{Math.round(students.reduce((s, st) => s + st.overallProgress, 0) / students.length)}%</p></div>
        <div className="bg-white border border-gray-200 rounded-xl p-4"><p className="text-xs text-gray-500">Avg Attendance</p><p className="text-2xl font-semibold text-green-600 mt-1">{Math.round(students.reduce((s, st) => s + st.attendance, 0) / students.length)}%</p></div>
        <div className="bg-white border border-gray-200 rounded-xl p-4"><p className="text-xs text-gray-500">At Risk</p><p className="text-2xl font-semibold text-red-500 mt-1">{students.filter(s => s.status === 'at-risk').length}</p></div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {cols.map(col => (
                <th key={col.key} onClick={() => col.key !== 'status' && col.key !== 'assignedMentor' && handleSort(col.key)}
                  className={`text-left px-4 py-3 text-xs font-medium text-gray-500 ${col.key !== 'status' && col.key !== 'assignedMentor' ? 'cursor-pointer hover:text-gray-900' : ''}`}>
                  <span className="flex items-center gap-1">{col.label}{col.key !== 'status' && col.key !== 'assignedMentor' && <SortIcon col={col.key} />}</span>
                </th>
              ))}
              <th className="px-4 py-3 text-xs font-medium text-gray-500 text-left">Overall Progress</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 text-left">Weak Topics</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(student => (
              <tr key={student.id}
                onClick={() => confirmId !== student.id && setSelected(student)}
                className="hover:bg-gray-50 transition-colors cursor-pointer">
                <td className="px-4 py-3"><p className="font-medium text-gray-900">{student.name}</p><p className="text-xs text-gray-400">{student.subjects.join(', ')} · Age {student.age}</p></td>
                <td className="px-4 py-3 text-gray-700">{student.class}</td>
                <td className="px-4 py-3 text-gray-700">{student.assignedMentor}</td>
                <td className="px-4 py-3 text-gray-700">{student.sessions}</td>
                <td className="px-4 py-3"><span className={`font-semibold ${student.avgScore >= 75 ? 'text-green-600' : student.avgScore >= 50 ? 'text-blue-600' : 'text-red-500'}`}>{student.avgScore}%</span></td>
                <td className="px-4 py-3 text-gray-700">{student.attendance}%</td>
                <td className="px-4 py-3"><StatusBadge status={student.status} /></td>
                <td className="px-4 py-3 w-36"><ProgressBar value={student.overallProgress} /></td>
                <td className="px-4 py-3">
                  {student.weakTopics.length > 0
                    ? <div className="flex flex-wrap gap-1">{student.weakTopics.map(t => <span key={t} className="text-xs bg-red-50 text-red-500 border border-red-100 px-1.5 py-0.5 rounded">{t}</span>)}</div>
                    : <span className="text-xs text-gray-400">None</span>}
                </td>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  {confirmId === student.id ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleRemove(student.id)} className="text-xs text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-lg">Confirm</button>
                      <button onClick={() => setConfirmId(null)} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg border border-gray-200">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmId(student.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={10} className="px-4 py-8 text-center text-sm text-gray-400">No students found</td></tr>}
          </tbody>
        </table>
      </div>

      {selected && <StudentDetailModal student={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
