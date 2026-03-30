import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import ProgressBar from '../../components/ProgressBar';
import { User, TrendingUp, Target, Calendar, FileText, AlertCircle } from 'lucide-react';

const Students = () => {
  const { appData, currentUser, updateStudent } = useApp();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [notes, setNotes] = useState('');

  const mentor = appData.mentors.find(m => m.id === currentUser?.id) || appData.mentors[0];
  const assignedStudents = appData.students.filter(s => mentor.assignedStudents.includes(s.id));

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setNotes(student.mentorNotes || '');
    setShowDetailModal(true);
  };

  const handleSaveNotes = () => {
    if (selectedStudent) {
      updateStudent(selectedStudent.id, { mentorNotes: notes });
      setShowDetailModal(false);
    }
  };

  // Get quiz history for student
  const getQuizHistory = (studentId) => {
    return appData.sessions
      .filter(s => s.studentId === studentId && s.score)
      .map(s => ({
        date: s.date,
        topic: s.topic,
        score: s.score,
        total: 5
      }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">My Students</h1>
        <p className="text-gray-500 mt-1">Manage and track student progress</p>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignedStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-500">Age {student.age} • Class {student.class}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-semibold text-gray-900">{student.progress}%</span>
                </div>
                <ProgressBar progress={student.progress} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Attendance</span>
                  <span className="text-sm font-semibold text-gray-900">{student.attendance}%</span>
                </div>
                <ProgressBar progress={student.attendance} />
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">XP</span>
              <span className="text-lg font-bold text-blue-600">{student.xp}</span>
            </div>

            {/* Status Badge */}
            <div className="mb-4">
              <span className={`px-3 py-1 rounded-full text-sm ${
                student.progress >= 70 && student.attendance >= 80 ? 'bg-green-100 text-green-600' :
                student.progress >= 40 || student.attendance >= 60 ? 'bg-yellow-100 text-yellow-600' :
                'bg-red-100 text-red-600'
              }`}>
                {student.progress >= 70 && student.attendance >= 80 ? 'On Track' :
                 student.progress >= 40 || student.attendance >= 60 ? 'Needs Support' :
                 'At Risk'}
              </span>
            </div>

            <Button onClick={() => handleViewDetails(student)} className="w-full">
              View Details
            </Button>
          </Card>
        ))}
      </div>

      {assignedStudents.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No students assigned yet</p>
          </div>
        </Card>
      )}

      {/* Student Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={selectedStudent?.name || 'Student Details'}
      >
        {selectedStudent && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedStudent.name}</h3>
                <p className="text-gray-600">Age {selectedStudent.age} • Class {selectedStudent.class}</p>
                <p className="text-gray-600 text-sm">Level: <span className="capitalize">{selectedStudent.level}</span></p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <TrendingUp className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-900">{selectedStudent.progress}%</p>
                <p className="text-xs text-gray-600">Progress</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <Calendar className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-900">{selectedStudent.attendance}%</p>
                <p className="text-xs text-gray-600">Attendance</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <Target className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-900">{selectedStudent.xp}</p>
                <p className="text-xs text-gray-600">XP</p>
              </div>
            </div>

            {/* Weak Topics */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Weak Topics
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(selectedStudent.weakTopics).map(([subject, topics]) => (
                  topics.map((topic) => (
                    <div key={`${subject}-${topic}`} className="p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="font-medium text-red-600 capitalize text-sm">{topic}</p>
                      <p className="text-xs text-red-500">{subject}</p>
                    </div>
                  ))
                ))}
              </div>
            </div>

            {/* Quiz Scores */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Recent Quiz Scores</h4>
              <div className="space-y-2">
                {getQuizHistory(selectedStudent.id).slice(0, 5).map((quiz, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{quiz.topic}</p>
                      <p className="text-xs text-gray-500">{quiz.date}</p>
                    </div>
                    <span className={`font-semibold ${
                      quiz.score / quiz.total >= 0.8 ? 'text-green-600' :
                      quiz.score / quiz.total >= 0.6 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {quiz.score}/{quiz.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                Mentor Notes
              </h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                placeholder="Add notes about this student's progress, concerns, or observations..."
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveNotes} className="flex-1">
                Save Notes
              </Button>
              <Button variant="secondary" onClick={() => setShowDetailModal(false)} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Students;
