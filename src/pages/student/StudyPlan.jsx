import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { CheckCircle, Circle, Sparkles, Clock, BookOpen, Calendar, ChevronRight, ChevronDown, Plus, X, CalendarDays, Target, Zap, Brain, MessageCircle, Award, Loader2 } from 'lucide-react';
import { callGemini } from '../../utils/gemini';

const StudyPlan = () => {
  const { appData, currentUser } = useApp();
  const [loading, setLoading] = useState(false);
  const [showPlanBuilder, setShowPlanBuilder] = useState(false);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState([]);
  const [customSubject, setCustomSubject] = useState('');
  const [expandedTask, setExpandedTask] = useState(null);
  const [taskContent, setTaskContent] = useState({});

  const [planInputs, setPlanInputs] = useState({
    freeTimeStart: '09:00',
    freeTimeEnd: '12:00',
    subjects: [],
    topics: '',
    daysCount: 7,
  });

  const student = appData.students.find(s => s.id === currentUser?.id) || appData.students[0];
  const allSubjects = ['Mathematics', 'English', 'Science', 'History', 'EVS', 'General Knowledge', 'Logical Reasoning', 'Communication Skills'];

  const getDefaultCurriculum = () => [
    { id: 'cur-1', time: '08:00 AM', subject: 'Mathematics', task: 'Chapter Review & Practice Problems', duration: '45 min', type: 'curriculum', completed: false },
    { id: 'cur-2', time: '09:00 AM', subject: 'English', task: 'Reading Comprehension & Grammar', duration: '40 min', type: 'curriculum', completed: false },
    { id: 'cur-3', time: '10:00 AM', subject: 'Science', task: 'Concept Study & Lab Notes', duration: '45 min', type: 'curriculum', completed: false },
    { id: 'cur-4', time: '11:00 AM', subject: 'EVS', task: 'Environmental Studies Module', duration: '30 min', type: 'curriculum', completed: false },
  ];

  useEffect(() => {
    const savedToday = localStorage.getItem(`studyplan-today-${student?.id}`);
    const savedUpcoming = localStorage.getItem(`studyplan-upcoming-${student?.id}`);
    if (savedToday) setTodaySchedule(JSON.parse(savedToday));
    else setTodaySchedule(getDefaultCurriculum());
    if (savedUpcoming) setUpcomingSchedule(JSON.parse(savedUpcoming));
  }, [student?.id]);

  useEffect(() => {
    if (todaySchedule.length > 0) localStorage.setItem(`studyplan-today-${student?.id}`, JSON.stringify(todaySchedule));
  }, [todaySchedule, student?.id]);

  useEffect(() => {
    if (upcomingSchedule.length > 0) localStorage.setItem(`studyplan-upcoming-${student?.id}`, JSON.stringify(upcomingSchedule));
  }, [upcomingSchedule, student?.id]);

  const toggleSubject = (subject) => {
    setPlanInputs(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject) ? prev.subjects.filter(s => s !== subject) : [...prev.subjects, subject]
    }));
  };

  const addCustomSubject = () => {
    if (customSubject.trim() && !planInputs.subjects.includes(customSubject.trim())) {
      setPlanInputs(prev => ({ ...prev, subjects: [...prev.subjects, customSubject.trim()] }));
      setCustomSubject('');
    }
  };

  const toggleTaskComplete = (taskId) => {
    setTodaySchedule(prev => prev.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task));
  };

  // ─── ELABORATE: AI explains topic + examples + quiz ───
  const handleElaborate = async (task) => {
    setTaskContent(prev => ({ ...prev, [task.id]: { loading: true, phase: 'explaining' } }));

    try {
      const prompt = `You are an expert teacher. A student needs to learn this topic:

Subject: ${task.subject}
Task: ${task.task}
Student Level: ${student?.level || 'foundation'} (Class ${student?.class || '5'})

Please provide:
1. A clear, detailed explanation of the topic (3-4 paragraphs)
2. Two practical examples that make the concept easy to understand
3. A 5-question multiple choice quiz to test understanding

Respond ONLY with valid JSON in this exact format:
{
  "explanation": "Detailed explanation...",
  "examples": [
    { "title": "Example 1 Title", "content": "Detailed example..." },
    { "title": "Example 2 Title", "content": "Detailed example..." }
  ],
  "quiz": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }
  ]
}

Make the content age-appropriate and engaging. Use simple language. Do NOT use asterisks, markdown, bullet points, or any special formatting. Write in plain text with clear paragraph breaks.`;

      const response = await callGemini(prompt);
      if (response.success && typeof response.data === 'string') {
        const jsonMatch = response.data.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const data = JSON.parse(jsonMatch[0]);
          const cleanText = (t) => t ? t.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#{1,6}\s/g, '').replace(/`/g, '').trim() : '';
          setTaskContent(prev => ({
            ...prev,
            [task.id]: {
              explanation: cleanText(data.explanation),
              examples: (data.examples || []).map(e => ({ title: cleanText(e.title), content: cleanText(e.content) })),
              quiz: data.quiz || [],
              loading: false,
              phase: 'explanation',
              quizAnswers: {},
              quizSubmitted: false,
            }
          }));
          return;
        }
      }
      throw new Error('Failed to parse');
    } catch (error) {
      console.error('Elaborate error:', error);
      setTaskContent(prev => ({
        ...prev,
        [task.id]: {
          explanation: `Let me explain "${task.task}" for ${task.subject}. This is an important topic. Please try the Elaborate button again for a detailed AI explanation.`,
          examples: [], quiz: [], loading: false, phase: 'explanation', quizAnswers: {}, quizSubmitted: false,
        }
      }));
    }
  };

  const handleAIHelp = (task) => {
    window.dispatchEvent(new CustomEvent('open-ai-drawer', {
      detail: { title: `${task.subject}: ${task.task}`, content: task.task }
    }));
  };

  const handleQuizAnswer = (taskId, qIdx, ansIdx) => {
    setTaskContent(prev => ({
      ...prev,
      [taskId]: { ...prev[taskId], quizAnswers: { ...prev[taskId].quizAnswers, [qIdx]: ansIdx } }
    }));
  };

  const handleSubmitQuiz = (taskId) => {
    setTaskContent(prev => ({ ...prev, [taskId]: { ...prev[taskId], quizSubmitted: true, phase: 'done' } }));
    toggleTaskComplete(taskId);
  };

  const getQuizScore = (taskId) => {
    const tc = taskContent[taskId];
    if (!tc?.quiz || !tc?.quizAnswers) return { correct: 0, total: 0, percent: 0 };
    const correct = tc.quiz.filter((q, i) => tc.quizAnswers[i] === q.correctAnswer).length;
    return { correct, total: tc.quiz.length, percent: Math.round((correct / tc.quiz.length) * 100) };
  };

  const handleGeneratePlan = async () => {
    if (planInputs.subjects.length === 0) return;
    setLoading(true);
    try {
      const prompt = `You are an expert study planner. Create a time-blocked study schedule.
Student: ${student?.name || 'Student'}, Class ${student?.class || '5'}, Level: ${student?.level || 'foundation'}
Free time: ${planInputs.freeTimeStart} to ${planInputs.freeTimeEnd}
Subjects: ${planInputs.subjects.join(', ')}
Topics: ${planInputs.topics || 'General revision'}
Duration: ${planInputs.daysCount} days

Respond ONLY with valid JSON:
{
  "todayTasks": [{ "time": "09:00 AM", "subject": "Math", "task": "Task description", "duration": "30 min" }],
  "upcomingDays": [{ "day": "Tomorrow", "tasks": [{ "time": "09:00 AM", "subject": "Science", "task": "Task", "duration": "45 min" }] }]
}`;

      const response = await callGemini(prompt);
      if (response.success && typeof response.data === 'string') {
        const jsonMatch = response.data.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const planData = JSON.parse(jsonMatch[0]);
          if (planData.todayTasks?.length > 0) {
            const aiTasks = planData.todayTasks.map((t, i) => ({
              id: `ai-today-${Date.now()}-${i}`, time: t.time, subject: t.subject, task: t.task, duration: t.duration, type: 'ai-generated', completed: false
            }));
            setTodaySchedule(prev => {
              const merged = [...prev, ...aiTasks];
              merged.sort((a, b) => a.time.replace(/[APM ]/gi, '').localeCompare(b.time.replace(/[APM ]/gi, '')));
              return merged;
            });
          }
          if (planData.upcomingDays?.length > 0) {
            setUpcomingSchedule(planData.upcomingDays.map((day, di) => ({
              id: `upcoming-${Date.now()}-${di}`, day: day.day,
              tasks: (day.tasks || []).map((t, ti) => ({ id: `up-${Date.now()}-${di}-${ti}`, time: t.time, subject: t.subject, task: t.task, duration: t.duration, completed: false }))
            })));
          }
        }
      }
      setShowPlanBuilder(false);
    } catch (e) { console.error('Plan error:', e); }
    finally { setLoading(false); }
  };

  const completedToday = todaySchedule.filter(t => t.completed).length;
  const totalToday = todaySchedule.length;
  const progressPercent = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // ─── Render a single interactive task item ───
  const renderTaskItem = (task) => {
    const isExpanded = expandedTask === task.id;
    const tc = taskContent[task.id];

    return (
      <div key={task.id} className="border-2 border-gray-100 rounded-xl overflow-hidden transition-all hover:border-blue-200">
        {/* Task Header */}
        <div
          onClick={() => setExpandedTask(isExpanded ? null : task.id)}
          className={`flex items-center gap-4 p-4 cursor-pointer transition-all ${task.completed ? 'bg-green-50' : 'hover:bg-gray-50'}`}
        >
          <div className={`w-20 text-center py-2 rounded-lg text-xs font-bold flex-shrink-0 ${task.completed ? 'bg-green-200 text-green-800' : 'bg-blue-100 text-blue-700'}`}>
            {task.time}
          </div>
          {task.completed ? <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" /> : <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${task.type === 'ai-generated' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{task.subject}</span>
              {task.type === 'ai-generated' && <span className="px-2 py-0.5 bg-purple-50 text-purple-500 rounded-full text-xs flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI</span>}
              <span className="text-xs text-gray-400">{task.duration}</span>
            </div>
            <p className={`text-sm font-medium truncate ${task.completed ? 'text-green-800 line-through' : 'text-gray-800'}`}>{task.task}</p>
          </div>
          {task.completed ? (
            <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full font-semibold flex-shrink-0">Done ✓</span>
          ) : (
            <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          )}
        </div>

        {/* Expanded Content */}
        {isExpanded && !task.completed && (
          <div className="border-t-2 border-gray-100 bg-gray-50/50">
            {/* Action Buttons */}
            {!tc?.explanation && !tc?.loading && (
              <div className="p-4 flex gap-3">
                <button onClick={(e) => { e.stopPropagation(); handleElaborate(task); }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md">
                  <Brain className="w-5 h-5" /> Elaborate & Learn
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleAIHelp(task); }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md">
                  <MessageCircle className="w-5 h-5" /> AI Help
                </button>
              </div>
            )}

            {/* Loading */}
            {tc?.loading && (
              <div className="p-8 text-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                <p className="text-gray-600 font-medium">AI is preparing your lesson...</p>
                <p className="text-sm text-gray-400 mt-1">Generating explanation, examples & quiz</p>
              </div>
            )}

            {/* Explanation Phase */}
            {tc?.phase === 'explanation' && tc?.explanation && (
              <div className="p-5 space-y-5">
                <div className="bg-white rounded-xl p-5 border border-blue-100">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-gray-900 text-lg">Explanation</h3>
                  </div>
                  <div className="text-gray-700 leading-relaxed space-y-3">
                    {tc.explanation.split(/\n+/).filter(p => p.trim()).map((para, i) => (
                      <p key={i}>{para.trim()}</p>
                    ))}
                  </div>
                </div>

                {tc.examples?.length > 0 && (
                  <div className="bg-white rounded-xl p-5 border border-green-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-green-600" />
                      <h3 className="font-bold text-gray-900 text-lg">Examples</h3>
                    </div>
                    <div className="space-y-4">
                      {tc.examples.map((ex, i) => (
                        <div key={i} className="bg-green-50 rounded-lg p-4 border border-green-100">
                          <h4 className="font-semibold text-green-800 mb-2">📌 {ex.title}</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {ex.content.split(/\n+/).filter(p => p.trim()).map((para, i) => (
                              <span key={i} className="block mb-2 last:mb-0">{para.trim()}</span>
                            ))}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tc.quiz?.length > 0 && (
                  <button onClick={(e) => { e.stopPropagation(); setTaskContent(prev => ({ ...prev, [task.id]: { ...prev[task.id], phase: 'quiz' } })); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-700 transition-all shadow-md text-lg">
                    <Award className="w-5 h-5" /> Take Quiz ({tc.quiz.length} questions)
                  </button>
                )}
              </div>
            )}

            {/* Quiz Phase */}
            {tc?.phase === 'quiz' && tc?.quiz?.length > 0 && (
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-gray-900 text-lg">Quiz: {task.subject}</h3>
                </div>
                {tc.quiz.map((q, qIdx) => (
                  <div key={qIdx} className="bg-white rounded-xl p-4 border border-gray-200">
                    <p className="font-semibold text-gray-900 mb-3">{qIdx + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => {
                        let cls = 'border-gray-200 hover:border-blue-300 hover:bg-blue-50';
                        if (tc.quizSubmitted) {
                          if (oIdx === q.correctAnswer) cls = 'border-green-500 bg-green-50';
                          else if (tc.quizAnswers[qIdx] === oIdx) cls = 'border-red-500 bg-red-50';
                        } else if (tc.quizAnswers[qIdx] === oIdx) cls = 'border-blue-500 bg-blue-50';
                        return (
                          <label key={oIdx} className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${cls}`} onClick={(e) => e.stopPropagation()}>
                            <input type="radio" name={`q-${task.id}-${qIdx}`} disabled={tc.quizSubmitted} checked={tc.quizAnswers[qIdx] === oIdx}
                              onChange={() => handleQuizAnswer(task.id, qIdx, oIdx)} className="w-4 h-4" />
                            <span className="text-gray-700 text-sm">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {!tc.quizSubmitted ? (
                  <button onClick={(e) => { e.stopPropagation(); handleSubmitQuiz(task.id); }}
                    disabled={Object.keys(tc.quizAnswers || {}).length < tc.quiz.length}
                    className={`w-full py-3 rounded-xl font-bold text-white transition-all ${Object.keys(tc.quizAnswers || {}).length < tc.quiz.length ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md'}`}>
                    Submit Quiz
                  </button>
                ) : (
                  <div className={`p-5 rounded-xl border-2 text-center ${getQuizScore(task.id).percent >= 60 ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                    <p className="text-3xl mb-2">{getQuizScore(task.id).percent >= 60 ? '🎉' : '📚'}</p>
                    <p className="font-bold text-xl text-gray-900">Score: {getQuizScore(task.id).correct}/{getQuizScore(task.id).total}</p>
                    <p className="text-sm text-gray-500 mt-1">{getQuizScore(task.id).percent >= 60 ? 'Great job! Task marked complete!' : 'Review the topic and try again!'}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Study Planner</h1>
          <p className="text-slate-500 text-sm mt-1">{todayDate}</p>
        </div>
        <button
          onClick={() => setShowPlanBuilder(!showPlanBuilder)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
        >
          {showPlanBuilder ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showPlanBuilder ? 'Close Builder' : 'AI Plan Builder'}
        </button>
      </div>

      {showPlanBuilder && (
        <div className="bg-gradient-to-br from-blue-50 to-sky-50 border-2 border-blue-200 rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><Sparkles className="w-5 h-5 text-white" /></div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Study Plan Builder</h2>
              <p className="text-sm text-gray-500">Tell us your free time and what you need to study</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3"><Clock className="w-4 h-4 inline mr-2" />When are you free to study?</label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <input type="time" value={planInputs.freeTimeStart} onChange={(e) => setPlanInputs(prev => ({ ...prev, freeTimeStart: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg font-medium" />
              </div>
              <span className="text-gray-400 font-medium mt-5">to</span>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Until</label>
                <input type="time" value={planInputs.freeTimeEnd} onChange={(e) => setPlanInputs(prev => ({ ...prev, freeTimeEnd: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg font-medium" />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3"><BookOpen className="w-4 h-4 inline mr-2" />What subjects do you need to cover?</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {allSubjects.map(subject => (
                <button key={subject} onClick={() => toggleSubject(subject)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${planInputs.subjects.includes(subject) ? 'bg-blue-600 text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                  {subject}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={customSubject} onChange={(e) => setCustomSubject(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addCustomSubject()}
                placeholder="Add a custom subject..." className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500" />
              <button onClick={addCustomSubject} className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all">Add</button>
            </div>
            {planInputs.subjects.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {planInputs.subjects.map(s => (
                  <span key={s} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {s}<button onClick={() => toggleSubject(s)} className="hover:text-blue-900"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3"><Target className="w-4 h-4 inline mr-2" />Any specific topics or goals? (optional)</label>
            <textarea value={planInputs.topics} onChange={(e) => setPlanInputs(prev => ({ ...prev, topics: e.target.value }))}
              placeholder="e.g., Prepare for math exam on fractions..." className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm resize-none" rows={3} />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3"><CalendarDays className="w-4 h-4 inline mr-2" />Plan for how many days?</label>
            <div className="flex gap-2">
              {[3, 5, 7, 14].map(d => (
                <button key={d} onClick={() => setPlanInputs(prev => ({ ...prev, daysCount: d }))}
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${planInputs.daysCount === d ? 'bg-blue-600 text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                  {d} days
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGeneratePlan}
            disabled={loading || planInputs.subjects.length === 0}
            className="w-full py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl
              hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'AI is creating your schedule…' : 'Generate My Study Plan'}
          </button>
          
          {planInputs.subjects.length === 0 && (
            <p className="text-center text-sm text-red-400 mt-2">Please select at least one subject</p>
          )}
        </div>
      )}

      {/* Today's Progress Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Today's Progress</h2>
            <p className="text-slate-500 text-sm">{completedToday} of {totalToday} tasks completed</p>
          </div>
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="#e2e8f0" strokeWidth="5" />
              <circle cx="32" cy="32" r="28" fill="none" stroke="#3b82f6" strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - progressPercent / 100)}`}
                strokeLinecap="round" className="transition-all duration-700" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-slate-900">{progressPercent}%</span>
            </div>
          </div>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          {progressPercent > 0 && (
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-700" style={{ width: `${progressPercent}%` }} />
          )}
        </div>
        {progressPercent === 100 && (
          <div className="mt-3 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            <p className="font-semibold text-emerald-700 text-sm flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" /> All tasks completed — great work!
            </p>
          </div>
        )}
      </div>

      {/* Today's Schedule */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Today's Schedule</h2>
          </div>
          <span className="px-2.5 py-1 bg-slate-100 rounded-full text-xs text-slate-600 font-medium">
            {todayDate.split(',')[0]}
          </span>
        </div>
        
        <div className="space-y-2.5">
          {todaySchedule.map((task) => (
            <div key={task.id} onClick={() => toggleTaskComplete(task.id)}
              className={`flex items-center gap-3.5 p-3.5 rounded-xl border-2 cursor-pointer transition-all group
                ${task.completed ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'}`}>
              {/* Time */}
              <div className={`w-16 text-center py-1.5 rounded-lg text-xs font-bold flex-shrink-0
                ${task.completed ? 'bg-emerald-200 text-emerald-800' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                {task.time}
              </div>
              {/* Checkbox */}
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                ${task.completed ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 group-hover:border-blue-400'}`}>
                {task.completed && <CheckCircle className="w-3.5 h-3.5 text-white" />}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                    ${task.type === 'ai-generated' ? 'bg-sky-100 text-sky-700' : 'bg-blue-100 text-blue-700'}`}>
                    {task.subject}
                  </span>
                  {task.type === 'ai-generated' && (
                    <span className="flex items-center gap-0.5 text-sky-500 text-xs font-medium">
                      <Sparkles className="w-3 h-3" /> AI
                    </span>
                  )}
                  <span className="text-xs text-slate-400">{task.duration}</span>
                </div>
                <p className={`text-sm font-medium truncate ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                  {task.task}
                </p>
              </div>
              {task.completed && (
                <span className="px-2.5 py-1 bg-emerald-600 text-white text-xs rounded-full font-semibold flex-shrink-0">Done</span>
              )}
            </div>
          ))}
          {todaySchedule.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium text-sm">No tasks scheduled yet</p>
              <p className="text-xs mt-1">Use the AI Plan Builder to create your schedule!</p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming */}
      {upcomingSchedule.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-slate-600" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Upcoming Schedule</h2>
          </div>
          
          <div className="space-y-3">
            {upcomingSchedule.map((day) => (
              <div key={day.id} className="border-2 border-slate-100 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-100">
                  <span className="font-bold text-slate-800 text-sm">{day.day}</span>
                  <span className="text-xs text-slate-400 font-medium">{day.tasks.length} tasks</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {day.tasks.map((task) => (
                    <div key={task.id} className="px-4 py-3 flex items-center gap-3">
                      <div className="w-14 text-center py-1 rounded-lg bg-blue-50 text-xs font-bold text-blue-700 flex-shrink-0">
                        {task.time}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">{task.subject}</span>
                          <span className="text-xs text-slate-400">{task.duration}</span>
                        </div>
                        <p className="text-sm text-slate-700 truncate">{task.task}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Done Today', value: completedToday, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Day Streak', value: student?.streak || 0, icon: Zap, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Upcoming', value: upcomingSchedule.reduce((acc, day) => acc + day.tasks.length, 0), icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(s => {
          const SIcon = s.icon;
          return (
            <div key={s.label} className={`${s.bg} border border-slate-200 rounded-2xl p-4 text-center`}>
              <SIcon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudyPlan;
