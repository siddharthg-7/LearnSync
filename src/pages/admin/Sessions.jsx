import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Calendar, CheckCircle, XCircle, Clock, User } from 'lucide-react';

const Sessions = () => {
  const { appData } = useApp();

  const upcomingSessions = appData.sessions.filter(s => !s.score).slice(0, 5);
  const completedSessions = appData.sessions.filter(s => s.score);
  const missedSessions = appData.sessions.filter(s => 
    s.attendance && s.attendance.some(a => a.status === 'absent')
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Session Tracking</h1>
        <p className="text-gray-500 mt-1">Monitor teaching execution</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <p className="text-gray-500 text-sm">Upcoming</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{upcomingSessions.length}</p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-gray-500 text-sm">Completed</p>
          </div>
          <p className="text-3xl font-bold text-green-600">{completedSessions.length}</p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <p className="text-gray-500 text-sm">Missed</p>
          </div>
          <p className="text-3xl font-bold text-red-600">{missedSessions.length}</p>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>
        <div className="space-y-3">
          {upcomingSessions.map((session) => {
            const mentor = appData.mentors.find(m => m.id === session.mentorId);
            const student = appData.students.find(s => s.id === session.studentId);

            return (
              <div key={session.id} className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">{session.topic}</p>
                    <p className="text-sm text-gray-600">
                      {mentor?.name} → {student?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{session.date}</span>
                  <Button variant="secondary" className="text-sm">
                    Reschedule
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Completed Sessions */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Completed Sessions</h2>
        <div className="space-y-3">
          {completedSessions.slice(0, 10).map((session) => {
            const mentor = appData.mentors.find(m => m.id === session.mentorId);
            const student = appData.students.find(s => s.id === session.studentId);

            return (
              <div key={session.id} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">{session.topic}</p>
                    <p className="text-sm text-gray-600">
                      {mentor?.name} → {student?.name}
                    </p>
                    {session.notes && (
                      <p className="text-xs text-gray-500 mt-1">{session.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Score</p>
                    <p className="text-lg font-bold text-green-600">{session.score}/5</p>
                  </div>
                  <span className="text-sm text-gray-600">{session.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Missed Sessions */}
      {missedSessions.length > 0 && (
        <Card className="border-2 border-red-200">
          <h2 className="text-xl font-semibold text-red-900 mb-4">Missed Sessions</h2>
          <div className="space-y-3">
            {missedSessions.map((session) => {
              const mentor = appData.mentors.find(m => m.id === session.mentorId);
              const student = appData.students.find(s => s.id === session.studentId);

              return (
                <div key={session.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center gap-4">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-semibold text-gray-900">{session.topic}</p>
                      <p className="text-sm text-gray-600">
                        {mentor?.name} → {student?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{session.date}</span>
                    <Button variant="danger" className="text-sm">
                      Reschedule
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Sessions;
