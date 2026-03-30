import { useState, useEffect } from 'react'
import { BookOpen, ChevronDown, ChevronUp, Sparkles, CheckCircle, Clock, Target, Lightbulb, RefreshCw, AlertTriangle, Trophy } from 'lucide-react'
import { getMentorTrainingModulesForMentor } from '../admin/Modules'
import { useApp } from '../../context/AppContext'
import { mockMentors } from '../../utils/mockData'

const PASS_SCORE = 70 // % required to pass

function ProgressBar({ value }) {
  const color = value >= 75 ? 'bg-green-500' : value >= 40 ? 'bg-blue-500' : 'bg-gray-300'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-gray-500 w-8 text-right">{value}%</span>
    </div>
  )
}

function SectionCard({ section, index }) {
  const [open, setOpen] = useState(index === 0)
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold flex items-center justify-center shrink-0">{index + 1}</span>
          <p className="text-sm font-semibold text-gray-900">{section.title}</p>
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed pt-4">{section.content}</p>
          {section.keyPoints?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Key Points</p>
              <ul className="space-y-1.5">
                {section.keyPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle size={13} className="text-green-500 mt-0.5 shrink-0" />{pt}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function QuizSection({ quizzes, onPass }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(null)

  const handleSubmit = () => {
    const correct = quizzes.filter((q, i) => answers[i] === q.correct).length
    const pct = Math.round((correct / quizzes.length) * 100)
    setScore(pct)
    setSubmitted(true)
    if (pct >= PASS_SCORE) onPass(pct)
  }

  const allAnswered = quizzes.every((_, i) => answers[i] !== undefined)

  if (submitted) {
    const passed = score >= PASS_SCORE
    return (
      <div className={`rounded-xl p-6 border text-center ${passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        {passed
          ? <Trophy size={32} className="mx-auto text-green-500 mb-3" />
          : <AlertTriangle size={32} className="mx-auto text-red-400 mb-3" />}
        <p className={`text-lg font-semibold mb-1 ${passed ? 'text-green-700' : 'text-red-600'}`}>
          {passed ? 'Quiz Passed!' : 'Quiz Failed'}
        </p>
        <p className={`text-sm mb-4 ${passed ? 'text-green-600' : 'text-red-500'}`}>
          You scored {score}% — {passed ? 'Course marked as complete.' : `Need ${PASS_SCORE}% to pass. Review the content and try again.`}
        </p>
        {!passed && (
          <button onClick={() => { setAnswers({}); setSubmitted(false); setScore(null) }}
            className="text-sm px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Retry Quiz
          </button>
        )}
        <div className="mt-4 space-y-2 text-left">
          {quizzes.map((q, i) => {
            const correct = answers[i] === q.correct
            return (
              <div key={i} className={`p-3 rounded-lg border text-sm ${correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="font-medium text-gray-800 mb-1">{i + 1}. {q.question}</p>
                <p className={correct ? 'text-green-600' : 'text-red-500'}>
                  Your answer: {q.options[answers[i]] ?? '—'} {correct ? '✓' : `✗ (Correct: ${q.options[q.correct]})`}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Final Quiz</p>
        <span className="text-xs text-gray-400">{Object.keys(answers).length}/{quizzes.length} answered · Pass: {PASS_SCORE}%</span>
      </div>
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
        <p className="text-xs text-amber-700">You must score at least {PASS_SCORE}% to complete this course. Read all sections carefully before attempting.</p>
      </div>
      {quizzes.map((q, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm font-medium text-gray-900 mb-3">{i + 1}. {q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, j) => (
              <button key={j} onClick={() => setAnswers(a => ({ ...a, [i]: j }))}
                className={`w-full text-left text-sm px-4 py-2.5 rounded-lg border transition-colors ${answers[i] === j ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={handleSubmit} disabled={!allAnswered}
        className="w-full py-3 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-40 transition-colors">
        Submit Quiz
      </button>
    </div>
  )
}

function CourseDetail({ entry, onBack, onComplete, completed }) {
  const { aiModule, courseName, description, topics, duration } = entry
  const [showQuiz, setShowQuiz] = useState(false)
  const quizzes = aiModule?.quizzes || []

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={15} className="text-blue-500" />
              <span className="text-xs text-blue-600 font-medium">AI-Generated Module</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">{courseName}</h2>
            <p className="text-sm text-gray-500">{description || 'Mentor training course'}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {(topics || []).map(t => <span key={t} className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">{t}</span>)}
              {duration && <span className="text-xs bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full">{duration}</span>}
              {quizzes.length > 0 && <span className="text-xs bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded-full">{quizzes.length} quiz questions</span>}
            </div>
          </div>
          {completed
            ? <span className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 border border-green-200"><CheckCircle size={14} />Completed</span>
            : quizzes.length > 0
              ? <button onClick={() => setShowQuiz(true)} className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  Take Quiz to Complete
                </button>
              : <button onClick={() => onComplete(100)} className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  <CheckCircle size={14} />Mark Complete
                </button>
          }
        </div>
      </div>

      {aiModule?.overview && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Overview</p>
          <p className="text-sm text-blue-900 leading-relaxed">{aiModule.overview}</p>
        </div>
      )}

      {aiModule?.objectives?.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target size={14} className="text-purple-500" />
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Learning Objectives</p>
          </div>
          <ul className="space-y-2">
            {aiModule.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                {obj}
              </li>
            ))}
          </ul>
        </div>
      )}

      {aiModule?.sections?.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Course Content</p>
          {aiModule.sections.map((section, i) => <SectionCard key={i} section={section} index={i} />)}
        </div>
      )}

      {aiModule?.practicalTips?.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={14} className="text-yellow-600" />
            <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">Practical Tips</p>
          </div>
          <ul className="space-y-2">
            {aiModule.practicalTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-yellow-800">
                <span className="text-yellow-500 mt-0.5">•</span>{tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {aiModule?.summary && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-5">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">Summary</p>
          <p className="text-sm text-green-900 leading-relaxed">{aiModule.summary}</p>
        </div>
      )}

      {/* Quiz */}
      {quizzes.length > 0 && !completed && (
        <div>
          {!showQuiz
            ? <button onClick={() => setShowQuiz(true)}
                className="w-full py-3 border-2 border-dashed border-blue-300 text-blue-600 text-sm font-medium rounded-xl hover:bg-blue-50 transition-colors">
                Start Final Quiz ({quizzes.length} questions · {PASS_SCORE}% to pass)
              </button>
            : <QuizSection quizzes={quizzes} courseId={entry.courseId} onPass={(score) => onComplete(score)} />
          }
        </div>
      )}
    </div>
  )
}

export default function MentorCourses() {
  const { currentUser } = useApp()
  const [modules, setModules] = useState([])
  const [selected, setSelected] = useState(null)
  const [completedMap, setCompletedMap] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mentorCompletedCourses') || '{}') } catch { return {} }
  })

  // Resolve mentor ID — match by name from mockMentors or use currentUser.id
  const mentorId = currentUser?.id || (mockMentors.find(m => m.name === currentUser?.name)?.id) || null

  useEffect(() => {
    const all = mentorId !== null
      ? getMentorTrainingModulesForMentor(mentorId)
      : []
    setModules(all)
  }, [mentorId])

  const loadModules = () => {
    const all = mentorId !== null
      ? getMentorTrainingModulesForMentor(mentorId)
      : []
    setModules(all)
  }

  const handleComplete = (courseId, score) => {
    const updated = { ...completedMap, [courseId]: { score, completedAt: new Date().toISOString() } }
    setCompletedMap(updated)
    localStorage.setItem('mentorCompletedCourses', JSON.stringify(updated))
    // refresh selected entry to show completed state
    setSelected(prev => prev ? { ...prev } : null)
  }

  const completedCount = modules.filter(m => completedMap[m.courseId]).length

  if (selected) {
    return (
      <div className="p-6">
        <CourseDetail
          entry={selected}
          onBack={() => setSelected(null)}
          onComplete={(score) => handleComplete(selected.courseId, score)}
          completed={!!completedMap[selected.courseId]}
        />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">My Training Courses</h2>
          <p className="text-sm text-gray-500">AI-generated learning modules assigned to you by the NGO</p>
        </div>
        <button onClick={loadModules} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4"><p className="text-xs text-gray-500">Assigned</p><p className="text-2xl font-semibold text-gray-900 mt-1">{modules.length}</p></div>
        <div className="bg-white border border-gray-200 rounded-xl p-4"><p className="text-xs text-gray-500">Completed</p><p className="text-2xl font-semibold text-green-600 mt-1">{completedCount}</p></div>
        <div className="bg-white border border-gray-200 rounded-xl p-4"><p className="text-xs text-gray-500">Pending</p><p className="text-2xl font-semibold text-blue-600 mt-1">{modules.length - completedCount}</p></div>
      </div>

      {modules.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <BookOpen size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-500">No courses assigned yet</p>
          <p className="text-xs text-gray-400 mt-1">The NGO admin will assign training courses to you. Check back later.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {modules.map(entry => {
            const done = !!completedMap[entry.courseId]
            const quizCount = entry.aiModule?.quizzes?.length || 0
            return (
              <div key={entry.courseId} onClick={() => setSelected(entry)}
                className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-blue-200 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles size={13} className="text-blue-500 shrink-0" />
                      <p className="text-sm font-semibold text-gray-900 truncate">{entry.courseName}</p>
                      {done && <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full shrink-0">Completed</span>}
                    </div>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{entry.description || 'AI-generated training module'}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(entry.topics || []).map(t => <span key={t} className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">{t}</span>)}
                      {entry.duration && <span className="text-xs bg-gray-100 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full flex items-center gap-1"><Clock size={10} />{entry.duration}</span>}
                      {quizCount > 0 && <span className="text-xs bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded-full">{quizCount} quiz questions</span>}
                    </div>
                    <ProgressBar value={done ? 100 : 0} />
                    {done && completedMap[entry.courseId]?.score && (
                      <p className="text-xs text-green-600 mt-1">Quiz score: {completedMap[entry.courseId].score}%</p>
                    )}
                  </div>
                  <ChevronDown size={16} className="text-gray-400 shrink-0 mt-1 -rotate-90" />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
