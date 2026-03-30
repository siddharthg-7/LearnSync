import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import { User, Award, TrendingUp, Target, Zap, Calendar, BookOpen } from 'lucide-react';

const Profile = () => {
  const { appData, currentUser } = useApp();
  const student = appData.students.find(s => s.id === currentUser?.id) || appData.students[0];
  const mentor = appData.mentors.find(m => m.id === student.mentorId);

  // Calculate stats
  const totalTopics = appData.topics.length;
  const completedCount = student.completedTopics.length;
  const completionRate = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  // Get quiz history (mock data for now)
  const quizHistory = [
    { date: '2026-03-28', topic: 'Fractions', score: 4, total: 6 },
    { date: '2026-03-27', topic: 'Grammar', score: 5, total: 6 },
    { date: '2026-03-26', topic: 'Algebra', score: 3, total: 6 },
    { date: '2026-03-25', topic: 'Decimals', score: 5, total: 6 }
  ];

  // Progress over time (mock data)
  const progressHistory = [
    { week: 'Week 1', progress: 20 },
    { week: 'Week 2', progress: 35 },
    { week: 'Week 3', progress: 50 },
    { week: 'Week 4', progress: student.progress }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Track your learning journey</p>
      </div>

      {/* Personal Info Card */}
      <Card>
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
            <p className="text-gray-600 mt-1">Class {student.class} • Age {student.age}</p>
            <p className="text-gray-600">Learning Mode: <span className="font-semibold capitalize">{student.level}</span></p>
            {mentor && (
              <p className="text-gray-600 mt-2">Mentor: <span className="font-semibold">{mentor.name}</span></p>
            )}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <span className="text-2xl font-bold text-gray-900">Level {student.level_number}</span>
            </div>
            <p className="text-gray-600 text-sm">{student.xp} XP</p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <p className="text-gray-500 text-sm">Total XP</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{student.xp}</p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-green-600" />
            <p className="text-gray-500 text-sm">Progress</p>
          </div>
          <p className="text-3xl font-bold text-green-600">{student.progress}%</p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <p className="text-gray-500 text-sm">Streak</p>
          </div>
          <p className="text-3xl font-bold text-orange-600">{student.streak} days</p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <p className="text-gray-500 text-sm">Completed</p>
          </div>
          <p className="text-3xl font-bold text-purple-600">{completedCount}/{totalTopics}</p>
        </Card>
      </div>

      {/* Progress Over Time */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Progress Over Time
        </h2>
        <div className="flex items-end gap-4 h-48">
          {progressHistory.map((week, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-blue-600 rounded-t-xl transition-all hover:bg-blue-700" 
                   style={{ height: `${week.progress}%` }}>
              </div>
              <p className="text-gray-600 text-sm mt-2">{week.week}</p>
              <p className="text-gray-900 font-semibold">{week.progress}%</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Subjects & Topics */}
      <div className="grid grid-cols-2 gap-4">
        {/* Subjects */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-3">My Subjects</h3>
          <div className="space-y-2">
            {student.subjects.map((subject) => (
              <div key={subject} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-medium text-blue-900">{subject}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Completion Rate */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-3">Topic Completion</h3>
          <div className="text-center py-6">
            <div className="relative inline-flex items-center justify-center w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - completionRate / 100)}`}
                  className="text-blue-600 transition-all duration-500"
                />
              </svg>
              <span className="absolute text-3xl font-bold text-gray-900">{completionRate}%</span>
            </div>
            <p className="text-gray-600 mt-4">{completedCount} of {totalTopics} topics completed</p>
          </div>
        </Card>
      </div>

      {/* Weak Topics */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-red-600" />
          Areas for Improvement
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(student.weakTopics).map(([subject, topics]) => (
            topics.map((topic) => (
              <div key={`${subject}-${topic}`} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-semibold text-red-600 capitalize">{topic}</p>
                <p className="text-sm text-red-500">{subject}</p>
              </div>
            ))
          ))}
        </div>
      </Card>

      {/* Strong Topics */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-green-600" />
          Strengths
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(student.strongTopics).map(([subject, topics]) => (
            topics.map((topic) => (
              <div key={`${subject}-${topic}`} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-semibold text-green-600 capitalize">{topic}</p>
                <p className="text-sm text-green-500">{subject}</p>
              </div>
            ))
          ))}
        </div>
      </Card>

      {/* Quiz History */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-3">Recent Quiz Scores</h3>
        <div className="space-y-2">
          {quizHistory.map((quiz, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{quiz.topic}</p>
                <p className="text-sm text-gray-500">{quiz.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <ProgressBar 
                  progress={(quiz.score / quiz.total) * 100} 
                  className="w-32"
                />
                <span className={`font-semibold ${
                  quiz.score / quiz.total >= 0.8 ? 'text-green-600' :
                  quiz.score / quiz.total >= 0.6 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {quiz.score}/{quiz.total}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Attendance */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-3">Attendance</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <ProgressBar progress={student.attendance} />
          </div>
          <span className="text-2xl font-bold text-gray-900">{student.attendance}%</span>
        </div>
        <p className="text-gray-600 text-sm mt-2">
          {student.attendance >= 80 ? '✅ Great attendance!' : 
           student.attendance >= 60 ? '⚠️ Try to attend more sessions' :
           '❌ Attendance needs improvement'}
        </p>
      </Card>
    </div>
  );
};

export default Profile;
