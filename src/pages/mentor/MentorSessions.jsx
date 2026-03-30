import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { Calendar, Plus, CheckCircle, User } from 'lucide-react';

const MentorSessions = () => {
  const { appData, currentUser, addSession } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    topic: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    attendance: 'present'
  });

  const mentor = appData.mentors.find(m => m.id === currentUser?.id) || appData.mentors[0];
  const assignedStudents = appData.students.filter(s => mentor.assignedStudents.includes(s.id));
  const mentorSessions = appData.sessions.filter(s => s.mentorId === mentor.id);

  const handleSubmit = () => {
    if (formData.studentId && formData.topic && formData.date) {
      addSession({
        mentorId: mentor.id,
        studentId: parseInt(formData.studentId),
        topic: formData.topic,
        date: formData.date,
        notes: formData.notes,
        attendance: [{
          studentId: parseInt(formData.studentId),
          status: formData.attendance
        }]
      });

      setFormData({
        studentId: '',
        topic: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        attendance: 'present'
      });
      setShowModal(false);
    }
  };

  const upcomingSessions = mentorSessions.filter(s => !s.score);
  const completedSessions = mentorSessions.filter(s => s.score);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Sessions</h1>
          <p className="text-gray-500 mt-1">Log and track teaching sessions</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Log Session
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{mentorSessions.length}</p>
              <p className="text-gray-600 text-sm">Total Sessions</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{completedSessions.length}</p>
              <p className="text-gray-600 text-sm">Completed</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-50 rounded-xl">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{upcomingSessions.length}</p>
              <p className="text-gray-600 text-sm">Upcoming</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Sessions</h2>
        <div className="space-y-3">
          {mentorSessions.slice(0, 10).map((session) => {
            const student = appData.students.find(s => s.id === session.studentId);
            const isCompleted = !!session.score;
            const attendance = session.attendance?.[0]?.status || 'unknown';

            return (
              <div
                key={session.id}
                className={`p-4 rounded-xl border-2 ${
                  isCompleted ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      isCompleted ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Calendar className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{session.topic}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                        <User className="w-4 h-4" />
                        {student?.name}
                      </p>
                      {session.notes && (
                        <p className="text-sm text-gray-600 mt-2">{session.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{session.date}</p>
                    {isCompleted && session.score && (
                      <p className="text-lg font-bold text-green-600 mt-1">
                        Score: {session.score}/5
                      </p>
                    )}
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${
                      attendance === 'present' ? 'bg-green-100 text-green-700' :
                      attendance === 'absent' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {attendance === 'present' ? 'Present' : attendance === 'absent' ? 'Absent' : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {mentorSessions.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No sessions logged yet</p>
            </div>
          )}
        </div>
      </Card>

      {/* Log Session Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Log New Session"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Student</label>
            <select
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select student</option>
              {assignedStudents.map((student) => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Topic</label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Fractions"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Attendance</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="present"
                  checked={formData.attendance === 'present'}
                  onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Present</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="absent"
                  checked={formData.attendance === 'absent'}
                  onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Absent</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              placeholder="Add any notes about the session..."
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!formData.studentId || !formData.topic || !formData.date}
            className="w-full"
          >
            Log Session
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MentorSessions;
