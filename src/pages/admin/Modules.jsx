import { useState, useRef } from 'react'
import { Plus, X, Upload, FileText, File, ChevronDown, ChevronUp, Users, GraduationCap, BookOpen, ShieldCheck, Trash2 } from 'lucide-react'
import { mockNGOCourses as initialStudentCourses } from '../../utils/mockData'

const LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const TRAINING_TOPICS = ['Classroom Management', 'Child Psychology', 'Lesson Planning', 'Assessment Techniques', 'Digital Tools', 'Communication Skills']

function fileExt(name) { return name.split('.').pop().toLowerCase() }
function fileIcon(type) {
  if (type === 'pdf') return <FileText size={14} className="text-red-500" />
  return <File size={14} className="text-blue-500" />
}

function LevelBadge({ level }) {
  const styles = { Beginner: 'bg-green-50 text-green-600 border-green-200', Intermediate: 'bg-blue-50 text-blue-600 border-blue-200', Advanced: 'bg-purple-50 text-purple-600 border-purple-200' }
  return <span className={`text-xs border px-2 py-0.5 rounded-full ${styles[level] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>{level}</span>
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

function PopularityBar({ value, max }) {
  const pct = Math.round((value / (max || 1)) * 100)
  const color = pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-blue-500' : 'bg-gray-300'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500 w-6 text-right">{value}</span>
    </div>
  )
}

function FileUploader({ files, setFiles }) {
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef()
  const handleFiles = (incoming) => {
    const newFiles = Array.from(incoming).map(f => ({
      id: Date.now() + Math.random(),
      name: f.name,
      type: fileExt(f.name),
      size: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${Math.round(f.size / 1024)} KB`,
      uploadedAt: new Date().toISOString().split('T')[0],
    }))
    setFiles(prev => [...prev, ...newFiles])
  }
  return (
    <div className="space-y-3">
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => fileRef.current.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
        <Upload size={20} className="mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">Drag & drop files here, or <span className="text-blue-600">browse</span></p>
        <p className="text-xs text-gray-400 mt-1">Any file format accepted</p>
        <input ref={fileRef} type="file" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
      </div>
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map(f => (
            <div key={f.id} className="flex items-center gap-3 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg">
              {fileIcon(f.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">{f.name}</p>
                <p className="text-xs text-gray-400">{f.size}</p>
              </div>
              <button onClick={() => setFiles(prev => prev.filter(x => x.id !== f.id))} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AddCourseModal({ onClose, onAdd }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', forClass: '', level: 'Beginner' })
  const [files, setFiles] = useState([])
  const handleAdd = () => { onAdd({ id: Date.now(), ...form, students: 0, mentors: 0, avgProgress: 0, modules: files }); onClose() }
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-[480px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div><p className="text-sm font-semibold text-gray-900">Add Student Course</p><p className="text-xs text-gray-400">Step {step} of 2</p></div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {step === 1 && (<>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Course Name</label>
              <input type="text" placeholder="e.g. Mathematics Fundamentals" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">For Class</label>
              <input
                type="number" min={1} max={12} placeholder="Enter class (1 – 12)" value={form.forClass}
                onChange={e => {
                  const val = e.target.value
                  if (val === '' || (/^\d+$/.test(val) && Number(val) >= 1 && Number(val) <= 12))
                    setForm(f => ({ ...f, forClass: val }))
                }}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {form.forClass && (Number(form.forClass) < 1 || Number(form.forClass) > 12) && (
                <p className="text-xs text-red-500 mt-1">Please enter a class between 1 and 12.</p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Level</label>
              <div className="flex gap-2">
                {LEVELS.map(l => (
                  <button key={l} onClick={() => setForm(f => ({ ...f, level: l }))}
                    className={`flex-1 text-sm py-2 rounded-lg border transition-colors ${form.level === l ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{l}</button>
                ))}
              </div>
            </div>
          </>)}
          {step === 2 && (<><p className="text-xs text-gray-500">Upload learning modules. Any file format accepted.</p><FileUploader files={files} setFiles={setFiles} /></>)}
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          {step === 2 ? <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-700">Back</button> : <div />}
          <div className="flex gap-2">
            <button onClick={onClose} className="text-sm px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
            {step === 1
              ? <button disabled={!form.name.trim() || !form.forClass || Number(form.forClass) < 1 || Number(form.forClass) > 12} onClick={() => setStep(2)} className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40">Next</button>
              : <button onClick={handleAdd} className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Course</button>}
          </div>
        </div>
      </div>
    </div>
  )
}

function AddTrainingModal({ onClose, onAdd }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', topics: [], duration: '', description: '' })
  const [files, setFiles] = useState([])
  const toggleTopic = (t) => setForm(f => ({ ...f, topics: f.topics.includes(t) ? f.topics.filter(x => x !== t) : [...f.topics, t] }))
  const handleAdd = () => { onAdd({ id: Date.now(), ...form, mentorsEnrolled: 0, avgCompletion: 0, modules: files }); onClose() }
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-[480px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div><p className="text-sm font-semibold text-gray-900">Add Mentor Training Course</p><p className="text-xs text-gray-400">Step {step} of 2</p></div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {step === 1 && (<>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Training Course Name</label>
              <input type="text" placeholder="e.g. Effective Teaching Methods" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Description</label>
              <textarea placeholder="What will mentors learn from this course?" value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Duration</label>
              <input type="text" placeholder="e.g. 4 weeks" value={form.duration}
                onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-2">Training Topics</label>
              <div className="flex flex-wrap gap-2">
                {TRAINING_TOPICS.map(t => (
                  <button key={t} onClick={() => toggleTopic(t)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${form.topics.includes(t) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{t}</button>
                ))}
              </div>
            </div>
          </>)}
          {step === 2 && (<><p className="text-xs text-gray-500">Upload training materials for mentors. Any file format accepted.</p><FileUploader files={files} setFiles={setFiles} /></>)}
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          {step === 2 ? <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-700">Back</button> : <div />}
          <div className="flex gap-2">
            <button onClick={onClose} className="text-sm px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
            {step === 1
              ? <button disabled={!form.name.trim()} onClick={() => setStep(2)} className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40">Next</button>
              : <button onClick={handleAdd} className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Training</button>}
          </div>
        </div>
      </div>
    </div>
  )
}

function CourseRow({ course, maxStudents, onRemove }) {
  const [expanded, setExpanded] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState(false)
  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3"><p className="font-medium text-gray-900">{course.name}</p><p className="text-xs text-gray-400">{course.forClass || course.subject || '—'}</p></td>
        <td className="px-4 py-3"><LevelBadge level={course.level} /></td>
        <td className="px-4 py-3"><div className="flex items-center gap-1.5 text-gray-700"><Users size={13} className="text-gray-400" />{course.students}</div></td>
        <td className="px-4 py-3"><div className="flex items-center gap-1.5 text-gray-700"><GraduationCap size={13} className="text-gray-400" />{course.mentors}</div></td>
        <td className="px-4 py-3 w-36"><PopularityBar value={course.students} max={maxStudents} /></td>
        <td className="px-4 py-3 w-36"><ProgressBar value={course.avgProgress} /></td>
        <td className="px-4 py-3 text-gray-700">{course.modules.length}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            <button onClick={() => setExpanded(e => !e)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {confirmRemove ? (
              <div className="flex items-center gap-1">
                <button onClick={onRemove} className="text-xs text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-lg">Confirm</button>
                <button onClick={() => setConfirmRemove(false)} className="text-xs text-gray-500 px-2 py-1 rounded-lg border border-gray-200">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirmRemove(true)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
            )}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-gray-50">
          <td colSpan={8} className="px-6 py-3">
            {course.modules.length === 0 ? <p className="text-xs text-gray-400">No modules uploaded yet.</p> : (
              <div className="flex flex-wrap gap-2">
                {course.modules.map(m => (
                  <div key={m.id} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg">
                    {fileIcon(m.type)}
                    <div><p className="text-xs font-medium text-gray-800">{m.name}</p><p className="text-xs text-gray-400">{m.size} · {m.uploadedAt}</p></div>
                  </div>
                ))}
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  )
}

function TrainingRow({ course, onRemove }) {
  const [expanded, setExpanded] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState(false)
  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3"><p className="font-medium text-gray-900">{course.name}</p><p className="text-xs text-gray-400 mt-0.5">{course.description || '—'}</p></td>
        <td className="px-4 py-3 text-gray-700">{course.duration || '—'}</td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1">
            {course.topics && course.topics.length > 0
              ? course.topics.map(t => <span key={t} className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded">{t}</span>)
              : <span className="text-xs text-gray-400">—</span>}
          </div>
        </td>
        <td className="px-4 py-3"><div className="flex items-center gap-1.5 text-gray-700"><GraduationCap size={13} className="text-gray-400" />{course.mentorsEnrolled}</div></td>
        <td className="px-4 py-3 w-36"><ProgressBar value={course.avgCompletion} /></td>
        <td className="px-4 py-3 text-gray-700">{course.modules.length}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            <button onClick={() => setExpanded(e => !e)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {confirmRemove ? (
              <div className="flex items-center gap-1">
                <button onClick={onRemove} className="text-xs text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-lg">Confirm</button>
                <button onClick={() => setConfirmRemove(false)} className="text-xs text-gray-500 px-2 py-1 rounded-lg border border-gray-200">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirmRemove(true)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
            )}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-gray-50">
          <td colSpan={7} className="px-6 py-3">
            {course.modules.length === 0 ? <p className="text-xs text-gray-400">No materials uploaded yet.</p> : (
              <div className="flex flex-wrap gap-2">
                {course.modules.map(m => (
                  <div key={m.id} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg">
                    {fileIcon(m.type)}
                    <div><p className="text-xs font-medium text-gray-800">{m.name}</p><p className="text-xs text-gray-400">{m.size} · {m.uploadedAt}</p></div>
                  </div>
                ))}
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  )
}

const initialMentorCourses = [
  { id: 101, name: 'Effective Teaching Methods', description: 'Core pedagogy for new mentors', duration: '3 weeks', topics: ['Lesson Planning', 'Classroom Management'], mentorsEnrolled: 4, avgCompletion: 65, modules: [{ id: 1, name: 'Pedagogy Guide.pdf', type: 'pdf', size: '1.4 MB', uploadedAt: '2026-03-05' }] },
  { id: 102, name: 'Child Psychology Basics', description: 'Understanding student behaviour and motivation', duration: '2 weeks', topics: ['Child Psychology', 'Communication Skills'], mentorsEnrolled: 3, avgCompletion: 40, modules: [] },
]

export default function Modules() {
  const [tab, setTab] = useState('student')
  const [studentCourses, setStudentCourses] = useState(initialStudentCourses)
  const [mentorCourses, setMentorCourses] = useState(initialMentorCourses)
  const [showStudentModal, setShowStudentModal] = useState(false)
  const [showTrainingModal, setShowTrainingModal] = useState(false)

  const maxStudents = Math.max(...studentCourses.map(c => c.students), 1)

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Courses</h2>
          <p className="text-sm text-gray-500">Manage student courses and mentor training</p>
        </div>
        <button onClick={() => tab === 'student' ? setShowStudentModal(true) : setShowTrainingModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={14} />
          {tab === 'student' ? 'Add Course' : 'Add Training'}
        </button>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button onClick={() => setTab('student')}
          className={`flex items-center gap-2 px-4 py-1.5 text-sm rounded-md transition-colors ${tab === 'student' ? 'bg-white text-gray-900 shadow-sm font-medium' : 'text-gray-500 hover:text-gray-700'}`}>
          <BookOpen size={14} /> Student Courses
        </button>
        <button onClick={() => setTab('mentor')}
          className={`flex items-center gap-2 px-4 py-1.5 text-sm rounded-md transition-colors ${tab === 'mentor' ? 'bg-white text-gray-900 shadow-sm font-medium' : 'text-gray-500 hover:text-gray-700'}`}>
          <ShieldCheck size={14} /> Mentor Training
        </button>
      </div>

      {tab === 'student' && (<>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4"><p className="text-xs text-gray-500">Total Courses</p><p className="text-2xl font-semibold text-gray-900 mt-1">{studentCourses.length}</p></div>
          <div className="bg-white border border-gray-200 rounded-xl p-4"><p className="text-xs text-gray-500">Total Enrollments</p><p className="text-2xl font-semibold text-blue-600 mt-1">{studentCourses.reduce((s, c) => s + c.students, 0)}</p></div>
          <div className="bg-white border border-gray-200 rounded-xl p-4"><p className="text-xs text-gray-500">Avg Progress</p><p className="text-2xl font-semibold text-green-600 mt-1">{studentCourses.length ? Math.round(studentCourses.reduce((s, c) => s + c.avgProgress, 0) / studentCourses.length) : 0}%</p></div>
          <div className="bg-white border border-gray-200 rounded-xl p-4"><p className="text-xs text-gray-500">Total Modules</p><p className="text-2xl font-semibold text-gray-900 mt-1">{studentCourses.reduce((s, c) => s + c.modules.length, 0)}</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Course</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Level</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Students</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Mentors</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Popularity</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Avg Progress</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Modules</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {studentCourses.map(c => <CourseRow key={c.id} course={c} maxStudents={maxStudents} onRemove={() => setStudentCourses(prev => prev.filter(x => x.id !== c.id))} />)}
              {studentCourses.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">No courses yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </>)}

      {tab === 'mentor' && (<>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4"><p className="text-xs text-gray-500">Training Courses</p><p className="text-2xl font-semibold text-gray-900 mt-1">{mentorCourses.length}</p></div>
          <div className="bg-white border border-gray-200 rounded-xl p-4"><p className="text-xs text-gray-500">Mentors Enrolled</p><p className="text-2xl font-semibold text-blue-600 mt-1">{mentorCourses.reduce((s, c) => s + c.mentorsEnrolled, 0)}</p></div>
          <div className="bg-white border border-gray-200 rounded-xl p-4"><p className="text-xs text-gray-500">Avg Completion</p><p className="text-2xl font-semibold text-green-600 mt-1">{mentorCourses.length ? Math.round(mentorCourses.reduce((s, c) => s + c.avgCompletion, 0) / mentorCourses.length) : 0}%</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Training Course</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Duration</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Topics Covered</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Mentors</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Completion</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Materials</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mentorCourses.map(c => <TrainingRow key={c.id} course={c} onRemove={() => setMentorCourses(prev => prev.filter(x => x.id !== c.id))} />)}
              {mentorCourses.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">No training courses yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </>)}

      {showStudentModal && <AddCourseModal onClose={() => setShowStudentModal(false)} onAdd={c => setStudentCourses(prev => [...prev, c])} />}
      {showTrainingModal && <AddTrainingModal onClose={() => setShowTrainingModal(false)} onAdd={c => setMentorCourses(prev => [...prev, c])} />}
    </div>
  )
}
