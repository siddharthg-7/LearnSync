import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, Sparkles, Clock, BookOpen, Calendar, ChevronRight, Plus, X, CalendarDays, Target, Zap } from 'lucide-react';
import { callGemini } from '../../utils/gemini';

const StudyPlan = () => {
  const { appData, currentUser } = useApp();
  const [loading, setLoading] = useState(false);
  const [showPlanBuilder, setShowPlanBuilder] = useState(false);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState([]);
  const [customSubject, setCustomSubject] = useState('');

  // Plan builder inputs
  const [planInputs, setPlanInputs] = useState({
    freeTimeStart: '09:00',
    freeTimeEnd: '12:00',
    subjects: [],
    topics: '',
    daysCount: 7,
  });

  const student = appData.students.find(s => s.id === currentUser?.id) || appData.students[0];

  const allSubjects = ['Mathematics', 'English', 'Science', 'History', 'EVS', 'General Knowledge', 'Logical Reasoning', 'Communication Skills'];

  // Default curriculum schedule per class
  const getDefaultCurriculum = () => {
    return [
      { id: 'cur-1', time: '08:00 AM', subject: 'Mathematics', task: 'Chapter Review & Practice Problems', duration: '45 min', type: 'curriculum', completed: false },
      { id: 'cur-2', time: '09:00 AM', subject: 'English', task: 'Reading Comprehension & Grammar', duration: '40 min', type: 'curriculum', completed: false },
      { id: 'cur-3', time: '10:00 AM', subject: 'Science', task: 'Concept Study & Lab Notes', duration: '45 min', type: 'curriculum', completed: false },
      { id: 'cur-4', time: '11:00 AM', subject: 'EVS', task: 'Environmental Studies Module', duration: '30 min', type: 'curriculum', completed: false },
    ];
  };

  // Load saved schedules from localStorage
  useEffect(() => {
    const savedToday = localStorage.getItem(`studyplan-today-${student?.id}`);
    const savedUpcoming = localStorage.getItem(`studyplan-upcoming-${student?.id}`);
    
    if (savedToday) {
      setTodaySchedule(JSON.parse(savedToday));
    } else {
      setTodaySchedule(getDefaultCurriculum());
    }
    
    if (savedUpcoming) {
      setUpcomingSchedule(JSON.parse(savedUpcoming));
    }
  }, [student?.id]);

  // Save schedules to localStorage
  useEffect(() => {
    if (todaySchedule.length > 0) {
      localStorage.setItem(`studyplan-today-${student?.id}`, JSON.stringify(todaySchedule));
    }
  }, [todaySchedule, student?.id]);

  useEffect(() => {
    if (upcomingSchedule.length > 0) {
      localStorage.setItem(`studyplan-upcoming-${student?.id}`, JSON.stringify(upcomingSchedule));
    }
  }, [upcomingSchedule, student?.id]);

  const toggleSubject = (subject) => {
    setPlanInputs(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const addCustomSubject = () => {
    if (customSubject.trim() && !planInputs.subjects.includes(customSubject.trim())) {
      setPlanInputs(prev => ({
        ...prev,
        subjects: [...prev.subjects, customSubject.trim()]
      }));
      setCustomSubject('');
    }
  };

  const toggleTaskComplete = (taskId) => {
    setTodaySchedule(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleGeneratePlan = async () => {
    if (planInputs.subjects.length === 0) return;
    
    setLoading(true);
    try {
      const prompt = `You are an expert study planner for students. Create a detailed, time-blocked study schedule.

Student Info:
- Name: ${student?.name || 'Student'}
- Class: ${student?.class || 'General'}
- Level: ${student?.level || 'foundation'}

Student's Request:
- Free time: ${planInputs.freeTimeStart} to ${planInputs.freeTimeEnd}
- Subjects to cover: ${planInputs.subjects.join(', ')}
- Specific topics/goals: ${planInputs.topics || 'General revision and practice'}
- Plan duration: ${planInputs.daysCount} days

Create a structured schedule. For TODAY, create time-blocked study tasks that fit within the free time window. For the UPCOMING ${planInputs.daysCount - 1} days, create daily study goals.

Respond ONLY with valid JSON in this exact format:
{
  "todayTasks": [
    {
      "time": "09:00 AM",
      "subject": "Mathematics",
      "task": "Specific task description",
      "duration": "30 min"
    }
  ],
  "upcomingDays": [
    {
      "day": "Tomorrow",
      "tasks": [
        {
          "time": "09:00 AM",
          "subject": "Science",
          "task": "Specific task",
          "duration": "45 min"
        }
      ]
    }
  ]
}

Make tasks specific and actionable. Distribute subjects evenly across days. Each task should be 25-45 minutes.`;

      const response = await callGemini(prompt);
      
      if (response.success && typeof response.data === 'string') {
        const jsonMatch = response.data.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const planData = JSON.parse(jsonMatch[0]);
          
          // Add today's AI tasks to existing curriculum
          if (planData.todayTasks && planData.todayTasks.length > 0) {
            const aiTasks = planData.todayTasks.map((task, idx) => ({
              id: `ai-today-${Date.now()}-${idx}`,
              time: task.time,
              subject: task.subject,
              task: task.task,
              duration: task.duration,
              type: 'ai-generated',
              completed: false
            }));
            
            setTodaySchedule(prev => {
              const merged = [...prev, ...aiTasks];
              // Sort by time
              merged.sort((a, b) => {
                const timeA = a.time.replace(/[APM ]/gi, '');
                const timeB = b.time.replace(/[APM ]/gi, '');
                return timeA.localeCompare(timeB);
              });
              return merged;
            });
          }
          
          // Set upcoming days
          if (planData.upcomingDays && planData.upcomingDays.length > 0) {
            const upcoming = planData.upcomingDays.map((day, dayIdx) => ({
              id: `upcoming-${Date.now()}-${dayIdx}`,
              day: day.day,
              tasks: (day.tasks || []).map((task, taskIdx) => ({
                id: `upcoming-task-${Date.now()}-${dayIdx}-${taskIdx}`,
                time: task.time,
                subject: task.subject,
                task: task.task,
                duration: task.duration,
                completed: false
              }))
            }));
            
            setUpcomingSchedule(upcoming);
          }
        }
      }
      
      setShowPlanBuilder(false);
    } catch (error) {
      console.error('Error generating plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const completedToday = todaySchedule.filter(t => t.completed).length;
  const totalToday = todaySchedule.length;
  const progressPercent = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

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

      {/* Plan Builder Panel */}
      {showPlanBuilder && (
        <div className="bg-gradient-to-br from-blue-50 to-sky-50 border-2 border-blue-200 rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Study Plan Builder</h2>
              <p className="text-sm text-gray-500">Tell us your free time and what you need to study</p>
            </div>
          </div>

          {/* Free Time Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Clock className="w-4 h-4 inline mr-2" />
              When are you free to study?
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <input
                  type="time"
                  value={planInputs.freeTimeStart}
                  onChange={(e) => setPlanInputs(prev => ({ ...prev, freeTimeStart: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg font-medium"
                />
              </div>
              <span className="text-gray-400 font-medium mt-5">to</span>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Until</label>
                <input
                  type="time"
                  value={planInputs.freeTimeEnd}
                  onChange={(e) => setPlanInputs(prev => ({ ...prev, freeTimeEnd: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg font-medium"
                />
              </div>
            </div>
          </div>

          {/* Subject Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <BookOpen className="w-4 h-4 inline mr-2" />
              What subjects do you need to cover?
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {allSubjects.map(subject => (
                <button
                  key={subject}
                  onClick={() => toggleSubject(subject)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    planInputs.subjects.includes(subject)
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-300'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
            {/* Custom subject input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomSubject()}
                placeholder="Add a custom subject..."
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              />
              <button 
                onClick={addCustomSubject}
                className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all"
              >
                Add
              </button>
            </div>
            {planInputs.subjects.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {planInputs.subjects.map(s => (
                  <span key={s} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {s}
                    <button onClick={() => toggleSubject(s)} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Topics / Goals */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Target className="w-4 h-4 inline mr-2" />
              Any specific topics or goals? (optional)
            </label>
            <textarea
              value={planInputs.topics}
              onChange={(e) => setPlanInputs(prev => ({ ...prev, topics: e.target.value }))}
              placeholder="e.g., Prepare for math exam on fractions, revise photosynthesis chapter, practice English essay writing..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm resize-none"
              rows={3}
            />
          </div>

          {/* Plan Duration */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <CalendarDays className="w-4 h-4 inline mr-2" />
              Plan for how many days?
            </label>
            <div className="flex gap-2">
              {[3, 5, 7, 14].map(d => (
                <button
                  key={d}
                  onClick={() => setPlanInputs(prev => ({ ...prev, daysCount: d }))}
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                    planInputs.daysCount === d
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-300'
                  }`}
                >
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

      {/* Upcoming Schedule */}
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
