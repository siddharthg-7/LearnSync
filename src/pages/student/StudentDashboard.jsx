import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import Button from '../../components/Button';
import { BookOpen, TrendingUp, Zap, Star, Flame, Trophy, Award } from 'lucide-react';

// Foundation Mode (5-10 years) - Big, colorful, fun, super gamified
const FoundationDashboard = ({ student, studyPlan, courses }) => {
  const nextLevelXP = 1000;
  const progressPercent = (student.xp / nextLevelXP) * 100;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Big Welcome with Rocket */}
      <div className="text-center bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 rounded-3xl p-6 md:p-8">
        <div className="text-6xl md:text-8xl mb-3">🚀</div>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">
          Hi {student.name}!
        </h1>
        <div className="inline-flex items-center gap-2 bg-yellow-400 px-4 md:px-6 py-2 md:py-3 rounded-full">
          <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-900" />
          <span className="text-lg md:text-2xl font-bold text-yellow-900">Level {student.level_number}</span>
        </div>
      </div>

      {/* Level Progress Bar - Big and Colorful */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border-4 border-purple-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-base md:text-lg font-bold text-gray-700">Next Level</span>
          <span className="text-base md:text-lg font-bold text-purple-600">{student.xp} / {nextLevelXP} ⭐</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-6 md:h-8 relative overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
            style={{ width: `${progressPercent}%` }}
          >
            <span className="text-white font-bold text-xs md:text-sm">🎯</span>
          </div>
        </div>
      </div>

      {/* Big Stats with Animations */}
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-3xl p-6 md:p-8 text-center shadow-xl transform hover:scale-105 transition-transform">
          <div className="text-5xl md:text-6xl mb-2">⭐</div>
          <p className="text-3xl md:text-4xl font-bold text-white mb-1">{student.xp}</p>
          <p className="text-base md:text-lg text-yellow-100 font-semibold">Stars</p>
        </div>

        <div className="bg-gradient-to-br from-orange-400 to-red-400 rounded-3xl p-6 md:p-8 text-center shadow-xl transform hover:scale-105 transition-transform">
          <div className="text-5xl md:text-6xl mb-2">🔥</div>
          <p className="text-3xl md:text-4xl font-bold text-white mb-1">{student.streak}</p>
          <p className="text-base md:text-lg text-orange-100 font-semibold">Day Streak</p>
        </div>
      </div>

      {/* Today's Missions - Colorful Cards */}
      {studyPlan && studyPlan.tasks && studyPlan.tasks.length > 0 && (
        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-lg border-4 border-blue-200">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="text-4xl md:text-5xl">🎯</div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Today's Missions</h2>
          </div>
          <div className="space-y-3 md:space-y-4">
            {studyPlan.tasks.slice(0, 3).map((task, index) => (
              <div key={task.id} className={`flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-2xl border-4 ${
                index === 0 ? 'bg-blue-100 border-blue-400' :
                index === 1 ? 'bg-green-100 border-green-400' :
                'bg-purple-100 border-purple-400'
              } transform hover:scale-102 transition-transform`}>
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-2xl md:text-3xl ${
                  index === 0 ? 'bg-blue-400' :
                  index === 1 ? 'bg-green-400' :
                  'bg-purple-400'
                }`}>
                  {task.completed ? '✅' : '⭐'}
                </div>
                <div className="flex-1">
                  <p className="text-base md:text-xl font-bold text-gray-900">{task.task}</p>
                  <p className="text-sm md:text-lg font-semibold text-yellow-600">+{task.xp} Stars</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 md:mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg md:text-xl font-bold py-4 md:py-5 rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg">
            Start Learning! 🚀
          </button>
        </div>
      )}

      {/* My Courses - Big Colorful Cards */}
      <div>
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="text-4xl md:text-5xl">📚</div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">My Learning</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {courses.slice(0, 3).map((course, index) => (
            <div key={course.id} className={`rounded-3xl p-5 md:p-6 shadow-xl border-4 transform hover:scale-102 transition-transform ${
              index === 0 ? 'bg-gradient-to-br from-pink-100 to-purple-100 border-pink-300' :
              index === 1 ? 'bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-300' :
              'bg-gradient-to-br from-green-100 to-yellow-100 border-green-300'
            }`}>
              <div className="flex items-center gap-3 md:gap-4 mb-4">
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-3xl md:text-4xl ${
                  index === 0 ? 'bg-pink-300' :
                  index === 1 ? 'bg-blue-300' :
                  'bg-green-300'
                }`}>
                  {index === 0 ? '🎨' : index === 1 ? '🔢' : '🌍'}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">{course.name}</h3>
              </div>
              <div className="mb-4">
                <div className="w-full bg-white rounded-full h-5 md:h-6 border-2 border-gray-300">
                  <div className={`h-full rounded-full ${
                    index === 0 ? 'bg-gradient-to-r from-pink-400 to-purple-400' :
                    index === 1 ? 'bg-gradient-to-r from-blue-400 to-cyan-400' :
                    'bg-gradient-to-r from-green-400 to-yellow-400'
                  }`} style={{ width: '60%' }}></div>
                </div>
              </div>
              <button className={`w-full text-base md:text-lg font-bold py-3 md:py-4 rounded-xl transition-all transform hover:scale-105 ${
                index === 0 ? 'bg-pink-400 hover:bg-pink-500 text-white' :
                index === 1 ? 'bg-blue-400 hover:bg-blue-500 text-white' :
                'bg-green-400 hover:bg-green-500 text-white'
              }`}>
                Continue Learning 🎯
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-3xl p-4 md:p-6 border-4 border-yellow-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-4xl md:text-5xl">🏆</div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">My Badges</h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { emoji: '🌟', name: 'First Star', unlocked: true },
            { emoji: '🔥', name: '7 Day Streak', unlocked: student.streak >= 7 },
            { emoji: '📚', name: 'Bookworm', unlocked: true },
            { emoji: '🎯', name: 'Perfect Score', unlocked: false },
            { emoji: '⚡', name: 'Speed Learner', unlocked: false },
            { emoji: '🚀', name: 'Rocket', unlocked: false },
          ].map((badge, index) => (
            <div key={index} className={`text-center p-3 md:p-4 rounded-2xl ${
              badge.unlocked ? 'bg-white border-4 border-yellow-400' : 'bg-gray-200 border-4 border-gray-300 opacity-50'
            }`}>
              <div className="text-3xl md:text-4xl mb-1">{badge.emoji}</div>
              <p className="text-xs md:text-sm font-bold text-gray-700">{badge.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Growth Mode (11-14 years) - Gamified with XP and badges
const GrowthDashboard = ({ student, studyPlan, courses }) => {
  return (
    <div className="space-y-6">
      {/* Welcome with Level */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, {student.name}! 🚀
          </h1>
          <p className="text-lg text-blue-600 mt-1">Growth Mode • Level {student.level_number}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Next Level</p>
          <div className="w-48 bg-gray-200 rounded-full h-3 mt-1">
            <div className="bg-blue-600 h-3 rounded-full" style={{ width: '70%' }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{student.xp} / 1000 XP</p>
        </div>
      </div>

      {/* XP Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-900">{student.xp}</p>
          <p className="text-sm text-gray-500">Total XP</p>
        </Card>

        <Card className="text-center p-4">
          <Flame className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-900">{student.streak}</p>
          <p className="text-sm text-gray-500">Day Streak</p>
        </Card>

        <Card className="text-center p-4">
          <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-900">{student.progress}%</p>
          <p className="text-sm text-gray-500">Progress</p>
        </Card>

        <Card className="text-center p-4">
          <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-900">{student.level_number}</p>
          <p className="text-sm text-gray-500">Level</p>
        </Card>
      </div>

      {/* Daily Quests */}
      {studyPlan && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Daily Quests</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
              {studyPlan.tasks.filter(t => t.completed).length}/{studyPlan.tasks.length} Complete
            </span>
          </div>
          <div className="space-y-3">
            {studyPlan.tasks.map((task) => (
              <div key={task.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 ${
                task.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  task.completed ? 'bg-green-500' : 'bg-blue-500'
                }`}>
                  {task.completed ? (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <Zap className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{task.task}</p>
                  <p className="text-sm text-gray-500">{task.topic}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">+{task.xp}</p>
                  <p className="text-xs text-gray-500">XP</p>
                </div>
              </div>
            ))}
          </div>
          <Button className="mt-4 w-full">Continue Learning</Button>
        </Card>
      )}

      {/* Courses with Progress */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Courses</h2>
        <div className="grid grid-cols-3 gap-4">
          {courses.map((course) => (
            <Card key={course.id}>
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h3 className="font-bold text-gray-900">{course.name}</h3>
              </div>
              <ProgressBar progress={65} className="mb-3" />
              <p className="text-sm text-gray-500 mb-3">{course.chapters.length} chapters</p>
              <Button variant="secondary" className="w-full">Continue</Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Weak Areas */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Focus Areas</h2>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(student.weakTopics).map(([subject, topics]) => (
            topics.map((topic) => (
              <div key={topic} className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="font-semibold text-red-600 capitalize">{topic}</p>
                <p className="text-sm text-red-500">{subject}</p>
              </div>
            ))
          ))}
        </div>
      </Card>
    </div>
  );
};

// Mastery Mode (15-19 years) - Clean, minimal, analytics-focused
const MasteryDashboard = ({ student, studyPlan, courses }) => {
  return (
    <div className="space-y-6">
      {/* Minimal Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">
          {student.name}
        </h1>
        <p className="text-gray-500 mt-1">Mastery Mode 🎯 • Level {student.level_number}</p>
      </div>

      {/* Clean Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-gray-500 mb-1">XP</p>
          <p className="text-2xl font-semibold text-gray-900">{student.xp}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 mb-1">Streak</p>
          <p className="text-2xl font-semibold text-gray-900">{student.streak} days</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 mb-1">Progress</p>
          <p className="text-2xl font-semibold text-gray-900">{student.progress}%</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 mb-1">Attendance</p>
          <p className="text-2xl font-semibold text-gray-900">{student.attendance}%</p>
        </Card>
      </div>

      {/* Study Plan */}
      {studyPlan && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Schedule</h2>
          <div className="space-y-2">
            {studyPlan.tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={task.completed}
                  className="w-4 h-4 text-blue-600 rounded"
                  readOnly
                />
                <div className="flex-1">
                  <p className="text-gray-900">{task.task}</p>
                  <p className="text-sm text-gray-500">{task.topic} • {task.xp} XP</p>
                </div>
              </div>
            ))}
          </div>
          <Button className="mt-4 w-full">Start Session</Button>
        </Card>
      )}

      {/* Courses Table */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Courses</h2>
        <div className="space-y-3">
          {courses.map((course) => (
            <div key={course.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <BookOpen className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{course.name}</p>
                <p className="text-sm text-gray-500">{course.chapters.length} chapters</p>
              </div>
              <div className="w-32">
                <ProgressBar progress={65} />
              </div>
              <Button variant="secondary" className="text-sm">Continue</Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Areas for Improvement */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Areas for Improvement</h2>
        <div className="space-y-2">
          {Object.entries(student.weakTopics).map(([subject, topics]) => (
            topics.map((topic) => (
              <div key={topic} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900 capitalize">{topic}</span>
                <span className="text-sm text-gray-500">{subject}</span>
              </div>
            ))
          ))}
        </div>
      </Card>
    </div>
  );
};

// Main Dashboard Component
const StudentDashboard = () => {
  const { appData, currentUser } = useApp();
  
  const student = appData.students.find(s => s.id === currentUser?.id) || appData.students[0];
  const studyPlan = appData.studyPlans.find(p => p.studentId === student.id);
  const courses = appData.courses.filter(c => student.subjects.includes(c.subject));

  // Determine which dashboard to show based on age
  if (student.age <= 10) {
    return <FoundationDashboard student={student} studyPlan={studyPlan} courses={courses} />;
  } else if (student.age <= 14) {
    return <GrowthDashboard student={student} studyPlan={studyPlan} courses={courses} />;
  } else {
    return <MasteryDashboard student={student} studyPlan={studyPlan} courses={courses} />;
  }
};

export default StudentDashboard;
