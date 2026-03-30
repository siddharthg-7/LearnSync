import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import ProgressBar from '../../components/ProgressBar';
import { User, TrendingUp, Target, Calendar, FileText, AlertCircle, AlertTriangle, Send, CheckCircle } from 'lucide-react';

const ISSUE_TYPES = [
  'Learning Difficulty',
  'Attendance Concern',
  'Behavioral Issue',
  'Personal Issues',
  'Health Concern',
  'Financial Constraint',
  'Other',
];

const Students = () => {
  const { appData, currentUser, updateStudent, addNotification } = useApp();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [notes, setNotes] = useState('');

  // Report to NGO state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportStudent, setReportStudent] = useState(null);
  const [reportIssue, setReportIssue] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportPriority, setReportPriority] = useState('high');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const mentor = appData.mentors.find(m => m.id === currentUser?.id) || appData.mentors[0];
  const assignedStudents = appData.students.filter(s => {
    if (mentor.assignedStudents && mentor.assignedStudents.includes(s.id)) return true;
    if (s.mentorId === mentor.id) return true;
    return false;
  });

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

  // Report to NGO handlers
  const handleOpenReport = (student) => {
    setReportStudent(student);
    setReportIssue('');
    setReportDescription('');
    setReportPriority('high');
    setReportSubmitted(false);
    setShowReportModal(true);
  };

  const handleSubmitReport = () => {
    if (!reportIssue || !reportDescription.trim()) return;

    addNotification({
      type: 'student-flag',
      priority: reportPriority,
      flaggedBy: mentor.name,
      student: reportStudent.name,
      studentId: reportStudent.id,
      issue: reportIssue,
      description: reportDescription.trim(),
    });

    setReportSubmitted(true);
  };

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
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{student.name}</h3>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleOpenReport(student); }}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-colors"
                    title="Report this student's issue to NGO Administrator"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    Report to NGO
                  </button>
                </div>
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
              <Button
                variant="danger"
                onClick={() => { setShowDetailModal(false); handleOpenReport(selectedStudent); }}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Report to NGO
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Report to NGO Modal ──────────────────────────────────────────── */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title={reportSubmitted ? 'Report Submitted' : `Report ${reportStudent?.name || 'Student'} to NGO`}
      >
        {reportSubmitted ? (
          /* Success state */
          <div className="text-center py-6 space-y-4">
            <div className="inline-flex p-4 bg-green-100 rounded-full">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Report Sent Successfully</h3>
            <p className="text-sm text-gray-600 max-w-sm mx-auto">
              Your report about <strong>{reportStudent?.name}</strong> has been sent to the NGO Administrator.
              They will review it and take appropriate action.
            </p>
            <div className="p-3 bg-gray-50 rounded-xl text-left">
              <p className="text-xs text-gray-500 mb-1">Issue reported</p>
              <p className="text-sm font-medium text-gray-900">{reportIssue}</p>
              <p className="text-xs text-gray-500 mt-2 mb-1">Priority</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                reportPriority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
              }`}>{reportPriority}</span>
            </div>
            <Button onClick={() => setShowReportModal(false)} className="w-full mt-4">
              Done
            </Button>
          </div>
        ) : (
          /* Report form */
          <div className="space-y-5">
            {/* Student info banner */}
            {reportStudent && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{reportStudent.name}</p>
                  <p className="text-xs text-gray-500">Age {reportStudent.age} • Class {reportStudent.class} • {reportStudent.level} level</p>
                </div>
              </div>
            )}

            {/* Issue type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Issue Type *</label>
              <div className="grid grid-cols-2 gap-2">
                {ISSUE_TYPES.map(issue => (
                  <button
                    key={issue}
                    onClick={() => setReportIssue(issue)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-all text-left ${
                      reportIssue === issue
                        ? 'border-red-400 bg-red-50 text-red-800 font-medium'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {issue}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setReportPriority('high')}
                  className={`flex-1 px-4 py-2 text-sm rounded-lg border transition-all ${
                    reportPriority === 'high'
                      ? 'border-red-400 bg-red-50 text-red-800 font-medium'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  🔴 High
                </button>
                <button
                  onClick={() => setReportPriority('medium')}
                  className={`flex-1 px-4 py-2 text-sm rounded-lg border transition-all ${
                    reportPriority === 'medium'
                      ? 'border-yellow-400 bg-yellow-50 text-yellow-800 font-medium'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  🟡 Medium
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Describe the Issue *</label>
              <textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 h-32 text-sm"
                placeholder="Explain the problem in detail. What have you tried? Why does this need NGO intervention? ..."
              />
              <p className="text-xs text-gray-400 mt-1">{reportDescription.length} characters</p>
            </div>

            {/* Info box */}
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-xs text-yellow-800">
                <strong>Note:</strong> This report will be sent to the NGO Administrator as a high-priority notification.
                They will review it and may contact you for further details.
              </p>
            </div>

            {/* Submit */}
            <div className="flex gap-2">
              <Button
                variant="danger"
                onClick={handleSubmitReport}
                disabled={!reportIssue || !reportDescription.trim()}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Report
              </Button>
              <Button variant="secondary" onClick={() => setShowReportModal(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Students;
