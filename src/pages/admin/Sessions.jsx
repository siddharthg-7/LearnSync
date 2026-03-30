import { useState } from 'react'
import { CheckCircle, XCircle, Clock, ChevronUp, ChevronDown, Search } from 'lucide-react'
import { useApp } from '../../context/AppContext'

function StatusBadge({ session }) {
  if (session.score) return <span className="text-xs text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Completed</span>
  const missed = session.attendance && session.attendance.some(a => a.status === 'absent')
  if (missed) return <span className="text-xs text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">Missed</span>
  return <span className="text-xs text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">Upcoming</span>
}

function ScoreBadge({ score }) {
  if (!score) return <span className="text-xs text-gray-400">—</span>
  const color = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-blue-600' : 'text-red-500'
  return <span className={`text-sm font-semibold ${color}`}>{score}%</span>
}

function SortIcon({ active, dir }) {
  if (!active) return <ChevronUp size={12} className="text-gray-300" />
  return dir === 'asc' ? <ChevronUp size={12} className="text-blue-500" /> : <ChevronDown size={12} className="text-blue-500" />
}

export default function Sessions() {
  const { appData } = useApp()
  const { sessions, mentors, students } = appData

  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('date')
  const [sortDir, setSortDir] = useState('desc')
  const [filter, setFilter] = useState('all')

  const upcoming = sessions.filter(s => !s.score && !(s.attendance && s.attendance.some(a => a.status === 'absent')))
  const completed = sessions.filter(s => s.score)
  const missed = sessions.filter(s => s.attendance && s.attendance.some(a => a.status === 'absent'))

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const filtered = sessions
    .filter(s => {
      const mentor = mentors.find(m => m.id === s.mentorId)
      const student = students.find(st => st.id === s.studentId)
      const matchSearch = (s.topic || '').toLowerCase().includes(search.toLowerCase()) ||
        (mentor?.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (student?.name || '').toLowerCase().includes(search.toLowerCase())
      if (!matchSearch) return false
      if (filter === 'upcoming') return !s.score && !(s.attendance && s.attendance.some(a => a.status === 'absent'))
      if (filter === 'completed') return !!s.score
      if (filter === 'missed') return s.attendance && s.attendance.some(a => a.status === 'absent')
      return true
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortKey === 'score') return ((a.score || 0) - (b.score || 0)) * dir
      if (sortKey === 'date') return ((a.date || '') > (b.date || '') ? 1 : -1) * dir
      if (sortKey === 'topic') return ((a.topic || '') > (b.topic || '') ? 1 : -1) * dir
      return 0
    })

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
    { key: 'missed', label: 'Missed' },
  ]

  const cols = [
    { key: 'topic', label: 'Topic' },
    { key: null, label: 'Mentor' },
    { key: null, label: 'Student' },
    { key: 'date', label: 'Date' },
    { key: 'score', label: 'Score' },
    { key: null, label: 'Status' },
  ]

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Session Tracking</h2>
          <p className="text-sm text-gray-500">Monitor teaching execution across all mentors</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center"><Clock size={16} className="text-blue-500" /></div>
          <div><p className="text-xs text-gray-500">Upcoming</p><p className="text-xl font-semibold text-gray-900">{upcoming.length}</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center"><CheckCircle size={16} className="text-green-500" /></div>
          <div><p className="text-xs text-gray-500">Completed</p><p className="text-xl font-semibold text-green-600">{completed.length}</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center"><XCircle size={16} className="text-red-500" /></div>
          <div><p className="text-xs text-gray-500">Missed</p><p className="text-xl font-semibold text-red-500">{missed.length}</p></div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 text-sm rounded-md transition-colors ${filter === f.key ? 'bg-white text-gray-900 shadow-sm font-medium' : 'text-gray-500 hover:text-gray-700'}`}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search sessions..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-56" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {cols.map(col => (
                <th key={col.label} onClick={() => col.key && handleSort(col.key)}
                  className={`text-left px-4 py-3 text-xs font-medium text-gray-500 ${col.key ? 'cursor-pointer hover:text-gray-700 select-none' : ''}`}>
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.key && <SortIcon active={sortKey === col.key} dir={sortDir} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(session => {
              const mentor = mentors.find(m => m.id === session.mentorId)
              const student = students.find(s => s.id === session.studentId)
              return (
                <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{session.topic}</p>
                    {session.notes && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px]">{session.notes}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{mentor?.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-700">{student?.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{session.date || '—'}</td>
                  <td className="px-4 py-3"><ScoreBadge score={session.score} /></td>
                  <td className="px-4 py-3"><StatusBadge session={session} /></td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">No sessions found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
