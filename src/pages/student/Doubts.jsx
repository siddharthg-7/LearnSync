import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { HelpCircle, MessageCircle, CheckCircle } from 'lucide-react';

const Doubts = () => {
  const { appData, currentUser, addDoubt } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    question: ''
  });

  const student = appData.students.find(s => s.id === currentUser?.id) || appData.students[0];
  const myDoubts = appData.doubts.filter(d => d.studentId === student.id);

  const handleSubmit = () => {
    if (formData.subject && formData.topic && formData.question) {
      addDoubt({
        studentId: student.id,
        studentName: student.name,
        subject: formData.subject,
        topic: formData.topic,
        level: student.level,
        question: formData.question,
        date: new Date().toISOString().split('T')[0]
      });
      setFormData({ subject: '', topic: '', question: '' });
      setShowModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">My Doubts</h1>
          <p className="text-gray-500 mt-1">Ask questions and get help from mentors</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <HelpCircle className="w-4 h-4 mr-2 inline" />
          Raise Doubt
        </Button>
      </div>

      {myDoubts.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No doubts yet. Ask your first question!</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {myDoubts.map((doubt) => (
            <Card key={doubt.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    doubt.status === 'resolved' ? 'bg-green-50' : 'bg-yellow-50'
                  }`}>
                    {doubt.status === 'resolved' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <HelpCircle className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{doubt.subject} • {doubt.topic}</p>
                    <p className="text-gray-500 text-sm">{doubt.date}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  doubt.status === 'resolved'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {doubt.status === 'resolved' ? 'Resolved' : 'Open'}
                </span>
              </div>

              <p className="text-gray-700 mb-4">{doubt.question}</p>

              {doubt.replies && doubt.replies.length > 0 && (
                <div className="space-y-3 mt-4 pt-4 border-t border-gray-200">
                  {doubt.replies.map((reply, index) => (
                    <div key={index} className="flex gap-3">
                      <MessageCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">{reply.mentorName}</p>
                        <p className="text-gray-700 text-sm">{reply.reply}</p>
                        <p className="text-gray-500 text-xs mt-1">{reply.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Raise Doubt Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Raise a Doubt"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Subject</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select subject</option>
              {student.subjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
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
            <label className="block text-gray-700 mb-2">Your Question</label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              placeholder="Describe your doubt in detail..."
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!formData.subject || !formData.topic || !formData.question}
            className="w-full"
          >
            Submit Doubt
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Doubts;
