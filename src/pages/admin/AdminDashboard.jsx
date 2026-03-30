import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import { Users, BookOpen, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
  const { appData } = useApp();

  // Calculate stats from real data
  const totalStudents = appData.students.length;
  const activeMentors = appData.mentors.filter(m => m.onboarded).length;
  const totalSessions = appData.sessions.length;
  
  // Calculate average progress
  const avgProgress = totalStudents > 0 
    ? Math.round(appData.students.reduce((sum, s) => sum + (s.progress || 0), 0) / totalStudents)
    : 0;
  
  // Calculate attendance rate
  const avgAttendance = totalStudents > 0
    ? Math.round(appData.students.reduce((sum, s) => sum + (s.attendance || 0), 0) / totalStudents)
    : 0;

  // High-risk students (progress < 50 or attendance < 70)
  const highRiskStudents = appData.students.filter(s => 
    (s.progress || 0) < 50 || (s.attendance || 0) < 70
  ).length;

  // Low-performing mentors (avgImprovement < 15)
  const lowPerformingMentors = appData.mentors.filter(m => 
    (m.avgImprovement || 0) < 15
  ).length;

  // Mock data for charts
  const weeklyProgress = [
    { week: 'Week 1', value: 55 },
    { week: 'Week 2', value: 58 },
    { week: 'Week 3', value: 61 },
    { week: 'Week 4', value: 63 }
  ];

  const mentorActivity = [
    { week: 'Week 1', value: 2 },
    { week: 'Week 2', value: 2 },
    { week: 'Week 3', value: 2 },
    { week: 'Week 4', value: 2 }
  ];

  const growthVelocity = [
    { week: 'Week 1', value: 18 },
    { week: 'Week 2', value: 20 },
    { week: 'Week 3', value: 22 },
    { week: 'Week 4', value: 24 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Students</p>
              <p className="text-3xl font-semibold text-gray-900 mt-1">{totalStudents}</p>
              <p className="text-xs text-gray-400 mt-1">enrolled</p>
            </div>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Mentors</p>
              <p className="text-3xl font-semibold text-gray-900 mt-1">{activeMentors}</p>
              <p className="text-xs text-gray-400 mt-1">this month</p>
            </div>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Sessions</p>
              <p className="text-3xl font-semibold text-gray-900 mt-1">{totalSessions}</p>
              <p className="text-xs text-gray-400 mt-1">conducted</p>
            </div>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg Progress</p>
              <p className="text-3xl font-semibold text-blue-600 mt-1">{avgProgress}%</p>
              <p className="text-xs text-gray-400 mt-1">across all subjects</p>
            </div>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Attendance Rate</p>
              <p className="text-3xl font-semibold text-green-600 mt-1">{avgAttendance}%</p>
              <p className="text-xs text-gray-400 mt-1">this week</p>
            </div>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
        </Card>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-red-50 border border-red-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-red-900">{highRiskStudents} High-Risk Students</span>
          </div>
        </Card>

        <Card className="bg-orange-50 border border-orange-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-orange-900">{lowPerformingMentors} Low-performing Mentors</span>
          </div>
        </Card>

        <Card className="bg-yellow-50 border border-yellow-200">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-600" />
            <span className="font-semibold text-yellow-900">2 Subjects Declining</span>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mentor Activeness */}
        <Card>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Mentor Activeness</h3>
            <p className="text-xs text-gray-500">Active mentors per week</p>
          </div>
          <div className="flex items-end justify-between h-32 gap-2">
            {mentorActivity.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-blue-500 rounded-t" style={{ height: `${(item.value / 4) * 100}%` }}></div>
                <p className="text-xs text-gray-500 mt-2">{item.week.split(' ')[1]}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <p className="text-2xl font-semibold text-gray-900">{activeMentors}</p>
            <p className="text-xs text-gray-500">active mentors</p>
          </div>
        </Card>

        {/* Weekly Progress */}
        <Card>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Weekly Progress</h3>
            <p className="text-xs text-gray-500">Average progress rate</p>
          </div>
          <div className="flex items-end justify-between h-32 gap-2">
            {weeklyProgress.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-green-500 rounded-t" style={{ height: `${item.value}%` }}></div>
                <p className="text-xs text-gray-500 mt-2">{item.week.split(' ')[1]}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <p className="text-2xl font-semibold text-green-600">{avgProgress}%</p>
            <p className="text-xs text-gray-500">this week</p>
          </div>
        </Card>

        {/* Growth Velocity */}
        <Card>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Growth Velocity</h3>
            <p className="text-xs text-gray-500">Avg student score over time</p>
          </div>
          <div className="relative h-32">
            <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
              <polyline
                points="0,82 50,80 100,78 150,76 200,76"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
              />
              <circle cx="0" cy="82" r="3" fill="#8b5cf6" />
              <circle cx="50" cy="80" r="3" fill="#8b5cf6" />
              <circle cx="100" cy="78" r="3" fill="#8b5cf6" />
              <circle cx="150" cy="76" r="3" fill="#8b5cf6" />
              <circle cx="200" cy="76" r="3" fill="#8b5cf6" />
            </svg>
            <div className="flex justify-between mt-2">
              {growthVelocity.map((item, idx) => (
                <p key={idx} className="text-xs text-gray-500">{item.week.split(' ')[1]}</p>
              ))}
            </div>
          </div>
          <div className="mt-4 text-right">
            <p className="text-2xl font-semibold text-purple-600">+24%</p>
            <p className="text-xs text-gray-500">total gain</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
