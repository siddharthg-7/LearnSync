import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { CheckCircle, Circle, Sparkles, Settings, Target } from 'lucide-react';
import { callGemini } from '../../utils/gemini';

const MAX_AI_TASKS = 6;

const normalizeTaskText = (text = '') => {
  const cleaned = text.replace(/^(\d+\.\s*|[-*•]\s*)/u, '').trim();
  return cleaned.replace(/\s+/g, ' ');
};

const guessTopicFromText = (text = '', settings = {}) => {
  const focusTopics = (settings.focusTopics || []).map(topic => topic.toLowerCase());
  const focusSubjects = (settings.focusSubjects || []).map(subject => subject.toLowerCase());
  const lowerText = text.toLowerCase();

  const topicMatch = focusTopics.find(topic => topic && lowerText.includes(topic));
  if (topicMatch) {
    return settings.focusTopics[focusTopics.indexOf(topicMatch)];
  }

  const subjectMatch = focusSubjects.find(subject => subject && lowerText.includes(subject));
  if (subjectMatch) {
    return settings.focusSubjects[focusSubjects.indexOf(subjectMatch)];
  }

  return settings.focusTopics?.[0] || settings.focusSubjects?.[0] || 'General';
};

const calculateXPForTopic = (topic, settings = {}) => {
  const normalized = (topic || '').toString().toLowerCase();
  if ((settings.focusTopics || []).some(t => t.toLowerCase() === normalized)) {
    return 60;
  }
  if ((settings.focusSubjects || []).some(s => s.toLowerCase() === normalized)) {
    return 50;
  }
  return 40;
};

const createTasksFromAIResponse = (data, settings) => {
  if (!data) return [];

  const tasks = [];
  let taskId = 1;

  const pushTask = (rawText, hintTopic) => {
    if (tasks.length >= MAX_AI_TASKS) return;
    const cleanedText = normalizeTaskText(rawText);
    if (!cleanedText) return;
    const topic = hintTopic || guessTopicFromText(cleanedText, settings);
    tasks.push({
      id: taskId++,
      topic,
      task: cleanedText,
      completed: false,
      xp: calculateXPForTopic(topic, settings)
    });
  };

  const parseStructuredEntries = (entries = [], fallbackHintField) => {
    entries.forEach(entry => {
      if (tasks.length >= MAX_AI_TASKS) return;
      if (!entry) return;
      if (typeof entry === 'string') {
        pushTask(entry);
        return;
      }
      const rawText = entry.task || entry.description || entry.title || entry.name || '';
      const hint = entry[fallbackHintField] || entry.topic || entry.subject;
      pushTask(rawText, hint);
    });
  };

  if (typeof data === 'object' && !Array.isArray(data)) {
    parseStructuredEntries(data.daily, 'topic');
    parseStructuredEntries(data.weekly, 'subject');
    parseStructuredEntries(data.tasks, 'topic');
    parseStructuredEntries(data.suggestions, 'topic');
  }

  const textPayload = typeof data === 'string' ? data : data?.text;
  if (textPayload) {
    const lines = textPayload
      .split(/\r?\n/)
      .map(line => normalizeTaskText(line))
      .filter(line => line.length > 5);

    lines.forEach(line => {
      if (tasks.length >= MAX_AI_TASKS) return;
      pushTask(line);
    });
  }

  return tasks;
};

const StudyPlan = () => {
  const { appData, currentUser, updateStudyPlan, addStudyPlan } = useApp();
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [planSettings, setPlanSettings] = useState({
    focusDays: [],
    focusSubjects: [],
    focusTopics: [],
    studyHoursPerDay: 2
  });

  const student = appData.students.find(s => s.id === currentUser?.id) || appData.students[0];
  const studyPlan = appData.studyPlans.find(p => p.studentId === student.id);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    const availabilityDays = (student?.availability || []).map(slot => slot.split(' ')[0]);
    const weakTopics = Object.values(student?.weakTopics || {}).flat();

    setPlanSettings({
      focusDays: availabilityDays,
      focusSubjects: student?.subjects || [],
      focusTopics: weakTopics,
      studyHoursPerDay: 2
    });
  }, [student]);

  const handleTaskToggle = (taskId) => {
    if (studyPlan) {
      const updatedTasks = studyPlan.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      updateStudyPlan(studyPlan.id, { tasks: updatedTasks });
    }
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const prompt = `Generate a personalized study plan for a ${student.level} level student.
      
Student Profile:
- Age: ${student.age}
- Subjects: ${planSettings.focusSubjects.join(', ')}
- Weak Topics: ${planSettings.focusTopics.join(', ')}
- Available Days: ${planSettings.focusDays.join(', ')}
- Study Hours Per Day: ${planSettings.studyHoursPerDay}

Create a daily and weekly study plan that:
1. Prioritizes weak topics
2. Balances different subjects
3. Includes practice and revision
4. Is realistic and achievable`;

      const response = await callGemini(prompt);
      const aiTasks = response?.success
        ? createTasksFromAIResponse(response.data, planSettings)
        : [];
      // Generate tasks based on AI response and student data (fallback to deterministic plan)
      const newTasks = aiTasks.length ? aiTasks : generateTasksFromSettings();
      
      if (studyPlan) {
        updateStudyPlan(studyPlan.id, { tasks: newTasks });
      } else {
        addStudyPlan({
          studentId: student.id,
          date: new Date().toISOString().split('T')[0],
          tasks: newTasks
        });
      }
    } catch (error) {
      console.error('Error generating plan:', error);
    } finally {
      setLoading(false);
      setShowSettings(false);
    }
  };

  const generateTasksFromSettings = () => {
    const tasks = [];
    let taskId = 1;

    // Prioritize weak topics
    planSettings.focusTopics.forEach((topic, index) => {
      if (index < 3) { // Top 3 weak topics
        tasks.push({
          id: taskId++,
          topic: topic,
          task: `Revise ${topic}`,
          completed: false,
          xp: 30
        });
        tasks.push({
          id: taskId++,
          topic: topic,
          task: `Practice 5 questions on ${topic}`,
          completed: false,
          xp: 50
        });
      }
    });

    // Add subject-based tasks
    planSettings.focusSubjects.forEach(subject => {
      tasks.push({
        id: taskId++,
        topic: subject,
        task: `Complete ${subject} lesson`,
        completed: false,
        xp: 40
      });
    });

    return tasks.slice(0, 6); // Limit to 6 tasks per day
  };

  const completedTasks = studyPlan?.tasks.filter(t => t.completed).length || 0;
  const totalTasks = studyPlan?.tasks.length || 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Study Planner</h1>
          <p className="text-gray-500 mt-1">Your personalized learning schedule</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Customize Plan
          </Button>
          <Button onClick={handleGeneratePlan} disabled={loading}>
            <Sparkles className="w-4 h-4 mr-2 inline" />
            {loading ? 'Generating...' : 'Generate AI Plan'}
          </Button>
        </div>
      </div>

      {/* Plan Settings */}
      {showSettings && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customize Your Study Plan</h3>
          
          {/* Focus Days */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Study Days</label>
            <div className="flex gap-2 flex-wrap">
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => {
                    setPlanSettings(prev => ({
                      ...prev,
                      focusDays: prev.focusDays.includes(day)
                        ? prev.focusDays.filter(d => d !== day)
                        : [...prev.focusDays, day]
                    }));
                  }}
                  className={`px-4 py-2 rounded-xl border-2 transition-all ${
                    planSettings.focusDays.includes(day)
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Focus Subjects */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Focus Subjects</label>
            <div className="flex gap-2 flex-wrap">
              {student.subjects.map(subject => (
                <button
                  key={subject}
                  onClick={() => {
                    setPlanSettings(prev => ({
                      ...prev,
                      focusSubjects: prev.focusSubjects.includes(subject)
                        ? prev.focusSubjects.filter(s => s !== subject)
                        : [...prev.focusSubjects, subject]
                    }));
                  }}
                  className={`px-4 py-2 rounded-xl border-2 transition-all ${
                    planSettings.focusSubjects.includes(subject)
                      ? 'border-green-600 bg-green-50 text-green-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          {/* Focus Topics */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Topics to Cover</label>
            <div className="flex gap-2 flex-wrap">
              {Object.values(student.weakTopics).flat().map(topic => (
                <button
                  key={topic}
                  onClick={() => {
                    setPlanSettings(prev => ({
                      ...prev,
                      focusTopics: prev.focusTopics.includes(topic)
                        ? prev.focusTopics.filter(t => t !== topic)
                        : [...prev.focusTopics, topic]
                    }));
                  }}
                  className={`px-3 py-1 rounded-lg border-2 transition-all capitalize ${
                    planSettings.focusTopics.includes(topic)
                      ? 'border-purple-600 bg-purple-50 text-purple-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Study Hours */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Study Hours Per Day: {planSettings.studyHoursPerDay}h
            </label>
            <input
              type="range"
              min="1"
              max="6"
              value={planSettings.studyHoursPerDay}
              onChange={(e) => setPlanSettings(prev => ({
                ...prev,
                studyHoursPerDay: parseInt(e.target.value)
              }))}
              className="w-full"
            />
          </div>
        </Card>
      )}

      {/* Progress Overview */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Today's Progress</h2>
          <span className="text-gray-600">{completedTasks} / {totalTasks} tasks</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-700 font-medium">🎉 Great job! You completed all tasks today!</p>
          </div>
        )}
      </Card>

      {/* Today's Tasks */}
      {studyPlan && (
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Today's Tasks</h2>
          </div>
          <div className="space-y-3">
            {studyPlan.tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleTaskToggle(task.id)}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  task.completed
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {task.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className={`font-medium ${task.completed ? 'text-green-900 line-through' : 'text-gray-900'}`}>
                    {task.task}
                  </p>
                  <p className="text-gray-500 text-sm">{task.topic} • {task.xp} XP</p>
                </div>
                {task.completed && (
                  <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                    +{task.xp} XP
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Weekly Overview */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">This Week</h2>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const isAvailable = planSettings.focusDays.includes(day);
            const isPast = index < new Date().getDay();
            
            return (
              <div key={day} className="text-center">
                <p className="text-gray-600 text-sm mb-2">{day}</p>
                <div className={`h-20 rounded-xl flex items-center justify-center ${
                  isPast && isAvailable ? 'bg-green-100 text-green-600' :
                  isAvailable ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {isPast && isAvailable ? '✓' : isAvailable ? '○' : '-'}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Study Tips */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-3">💡 Study Tips</h3>
        <ul className="space-y-2 text-gray-700 text-sm">
          <li>• Focus on weak topics first when you're most alert</li>
          <li>• Take 5-minute breaks every 25 minutes</li>
          <li>• Review completed topics weekly to retain knowledge</li>
          <li>• Ask questions when you're stuck - use the AI chatbot!</li>
        </ul>
      </Card>
    </div>
  );
};

export default StudyPlan;
