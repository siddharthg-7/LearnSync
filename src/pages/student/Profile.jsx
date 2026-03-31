import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import { User, Award, TrendingUp, Target, Zap, Calendar, BookOpen, Flame, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { appData, currentUser } = useApp();
  const student = appData.students.find(s => s.id === currentUser?.id) || appData.students[0];
  const mentor = appData.mentors.find(m => m.assignedStudents?.includes(student.id)) || appData.mentors[0];

  // Use student.progress as the main completion metric
  const completionRate = student.progress || 45;

  // Subject-wise progress mock data
  const subjectProgress = (student.subjects || ['Math', 'English', 'Science']).map((subject, i) => {
    const progressValues = [72, 58, 41, 65, 80];
    const colors = [
      { bar: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      { bar: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
      { bar: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
      { bar: 'bg-purple-500', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
      { bar: 'bg-rose-500', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    ];
    return {
      name: subject,
      progress: progressValues[i % progressValues.length],
      ...colors[i % colors.length],
      topics: Math.floor(Math.random() * 8) + 4,
      completed: Math.floor(Math.random() * 6) + 2,
    };
  });

  // Quiz history mock data
  const quizHistory = [
    { date: '2026-03-28', topic: 'Fractions', score: 4, total: 5, subject: 'Math' },
    { date: '2026-03-27', topic: 'Grammar Rules', score: 5, total: 5, subject: 'English' },
    { date: '2026-03-26', topic: 'Algebra Basics', score: 3, total: 5, subject: 'Math' },
    { date: '2026-03-25', topic: 'Photosynthesis', score: 4, total: 5, subject: 'Science' },
    { date: '2026-03-24', topic: 'Decimals', score: 5, total: 5, subject: 'Math' },
  ];

  // Progress over time
  const progressHistory = [
    { week: 'Week 1', progress: 18 },
    { week: 'Week 2', progress: 32 },
    { week: 'Week 3', progress: 48 },
    { week: 'Week 4', progress: completionRate },
  ];

  const maxProgress = Math.max(...progressHistory.map(w => w.progress));

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">Track your learning journey</p>
      </div>

      {/* Personal Info Card */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-2xl sm:text-3xl font-bold text-blue-600">{student.name?.[0]}</span>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{student.name}</h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Class {student.class} - Age {student.age}</p>
            <p className="text-gray-600 text-sm sm:text-base">Learning Mode: <span className="font-semibold capitalize">{student.level}</span></p>
            {mentor && (
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Mentor: <span className="font-semibold">{mentor.name}</span></p>
            )}
          </div>
          <div className="text-center sm:text-right">
            <div className="flex items-center gap-2 mb-2 justify-center sm:justify-end">
              <Award className="w-5 h-5 text-yellow-600" />
              <span className="text-xl sm:text-2xl font-bold text-gray-900">Level {student.level_number}</span>
            </div>
            <p className="text-gray-600 text-sm">{student.xp} XP</p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-blue-600" />
            <p className="text-gray-500 text-xs sm:text-sm">Total XP</p>
          </div>
          <p className="text-xl sm:text-3xl font-bold text-gray-900">{student.xp}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-green-600" />
            <p className="text-gray-500 text-xs sm:text-sm">Progress</p>
          </div>
          <p className="text-xl sm:text-3xl font-bold text-green-600">{completionRate}%</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-orange-600" />
            <p className="text-gray-500 text-xs sm:text-sm">Streak</p>
          </div>
          <p className="text-xl sm:text-3xl font-bold text-orange-600">{student.streak}d</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <p className="text-gray-500 text-xs sm:text-sm">Quizzes</p>
          </div>
          <p className="text-xl sm:text-3xl font-bold text-purple-600">{quizHistory.length}</p>
        </Card>
      </div>

      {/* Progress Over Time - Bar Chart */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Progress Over Time
        </h2>
        <div className="flex items-end gap-3 sm:gap-4" style={{ height: '180px' }}>
          {progressHistory.map((week, index) => {
            const barHeight = maxProgress > 0 ? (week.progress / maxProgress) * 100 : 0;
            return (
              <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-xs font-bold text-gray-700 mb-1">{week.progress}%</span>
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-700 hover:to-blue-500 cursor-pointer"
                  style={{ height: `${barHeight}%`, minHeight: '8px' }}
                />
                <p className="text-gray-500 text-xs mt-2 font-medium">{week.week}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Subject Progress + Completion Ring */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Subjects with Progress */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-3">My Subjects</h3>
          <div className="space-y-3">
            {subjectProgress.map((subject) => (
              <div key={subject.name} className={`p-3 ${subject.bg} rounded-xl border ${subject.border}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`font-semibold ${subject.text} text-sm`}>{subject.name}</p>
                  <span className={`text-xs font-bold ${subject.text}`}>{subject.progress}%</span>
                </div>
                <div className="w-full bg-white rounded-full h-2.5">
                  <div className={`${subject.bar} h-full rounded-full transition-all duration-500`} style={{ width: `${subject.progress}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-1.5">{subject.completed} of {subject.topics} topics completed</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Completion Rate Circle */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-3">Overall Completion</h3>
          <div className="text-center py-4">
            <div className="relative inline-flex items-center justify-center w-36 h-36">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle cx="72" cy="72" r="60" stroke="currentColor" strokeWidth="10" fill="none" className="text-gray-100" />
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 60}`}
                  strokeDashoffset={`${2 * Math.PI * 60 * (1 - completionRate / 100)}`}
                  className="text-blue-600 transition-all duration-700"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-bold text-gray-900">{completionRate}%</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-3">
              {completionRate >= 70 ? 'Great progress! Keep it up!' : completionRate >= 40 ? 'Good job, keep learning!' : 'Keep going, you can do it!'}
            </p>
          </div>
        </Card>
      </div>

      {/* Weak Topics */}
      {Object.entries(student.weakTopics || {}).length > 0 && (
        <Card>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-red-500" />
            Areas for Improvement
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(student.weakTopics).map(([subject, topics]) =>
              topics.map((topic) => (
                <div key={`${subject}-${topic}`} className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="font-semibold text-red-600 capitalize text-sm">{topic}</p>
                  <p className="text-xs text-red-400">{subject}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* Strong Topics */}
      {Object.entries(student.strongTopics || {}).length > 0 && (
        <Card>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-green-500" />
            Strengths
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(student.strongTopics).map(([subject, topics]) =>
              topics.map((topic) => (
                <div key={`${subject}-${topic}`} className="p-3 bg-green-50 border border-green-200 rounded-xl">
                  <p className="font-semibold text-green-600 capitalize text-sm">{topic}</p>
                  <p className="text-xs text-green-400">{subject}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* Quiz History */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-3">Recent Quiz Scores</h3>
        <div className="space-y-2">
          {quizHistory.map((quiz, index) => {
            const percent = Math.round((quiz.score / quiz.total) * 100);
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm truncate">{quiz.topic}</p>
                  <p className="text-xs text-gray-400">{quiz.subject} · {quiz.date}</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-3">
                  <div className="w-16 sm:w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-full rounded-full ${percent >= 80 ? 'bg-green-500' : percent >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className={`font-bold text-sm ${
                    percent >= 80 ? 'text-green-600' : percent >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {quiz.score}/{quiz.total}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Attendance */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Attendance
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className={`h-full rounded-full ${student.attendance >= 80 ? 'bg-green-500' : student.attendance >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${student.attendance}%` }}
              />
            </div>
          </div>
          <span className="text-2xl font-bold text-gray-900">{student.attendance}%</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <CheckCircle className={`w-4 h-4 ${student.attendance >= 80 ? 'text-green-500' : student.attendance >= 60 ? 'text-yellow-500' : 'text-red-500'}`} />
          <p className="text-gray-500 text-sm">
            {student.attendance >= 80 ? 'Great attendance! Keep it up!' :
             student.attendance >= 60 ? 'Try to attend more sessions' :
             'Attendance needs improvement'}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
