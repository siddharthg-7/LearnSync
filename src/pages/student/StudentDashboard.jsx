import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import Button from '../../components/Button';
import { BookOpen, Target, TrendingUp, Zap, Star, Flame, Trophy, Award } from 'lucide-react';

// Foundation Mode (5-10 years) - Big, colorful, fun
const FoundationDashboard = ({ student, studyPlan, courses }) => {
  return (
    <div className="space-y-8">
      {/* Big Welcome */}
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-2">
          Hi {student.name}! ⭐
        </h1>
        <p className="text-2xl text-yellow-600 font-semibold">Level {student.level_number} Star</p>
      </div>

      {/* Big Stats with Icons */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="text-center p-8 bg-gradient-to-br from-yellow-50 to-yellow-100">
          <Star className="w-16 h-16 text-yellow-500 mx-auto mb-3" />
          <p className="text-4xl font-bold text-gray-900 mb-1">{student.xp}</p>
          <p className="text-lg text-gray-600">Stars Earned</p>
        </Card>

        <Card className="text-center p-8 bg-gradient-to-br from-orange-50 to-orange-100">
          <Flame className="w-16 h-16 text-orange-500 mx-auto mb-3" />
          <p className="text-4xl font-bold text-gray-900 mb-1">{student.streak}</p>
          <p className="text-lg text-gray-600">Day Streak</p>
        </Card>
      </div>

      {/* Today's Missions */}
      {studyPlan && (
        <Card className="p-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Today's Missions
          </h2>
          <div className="space-y-4">
            {studyPlan.tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xl font-semibold text-gray-900">{task.task}</p>
                  <p className="text-lg text-blue-600">+{task.xp} Stars</p>
                </div>
              </div>
            ))}
          </div>
          <Button className="mt-6 w-full text-xl py-4">Start Learning! 🚀</Button>
        </Card>
      )}

      {/* My Courses - Big Cards */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">My Learning</h2>
        <div className="grid grid-cols-1 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{course.name}</h3>
              </div>
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div className="bg-purple-600 h-6 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <Button variant="secondary" className="w-full text-lg py-3">Continue</Button>
            </Card>
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

  if (!appData) {
    return null;
  }

  const students = Array.isArray(appData.students) ? appData.students : [];
  const student = students.find(s => s.id === currentUser?.id) || students[0];
  const studyPlans = Array.isArray(appData.studyPlans) ? appData.studyPlans : [];
  const studyPlan = student ? studyPlans.find(p => p.studentId === student.id) : null;
  const allCourses = Array.isArray(appData.courses) ? appData.courses : [];
  const courses = student
    ? allCourses.filter(c => (student.subjects || []).includes(c.subject))
    : [];

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
