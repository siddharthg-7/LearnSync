import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { HelpCircle, Send, CheckCircle, Sparkles } from 'lucide-react';
import { callGemini } from '../../utils/gemini';

const MentorDoubts = () => {
  const { appData, currentUser, updateDoubt } = useApp();
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [reply, setReply] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const mentor = appData.mentors.find(m => m.id === currentUser?.id) || appData.mentors[0];
  
  // Filter doubts by mentor's subjects
  const relevantDoubts = appData.doubts.filter(d => 
    mentor.subjects.includes(d.subject)
  );

  const openDoubts = relevantDoubts.filter(d => d.status === 'open');
  const resolvedDoubts = relevantDoubts.filter(d => d.status === 'resolved');

  const handleReply = (doubt) => {
    setSelectedDoubt(doubt);
    setReply('');
  };

  const handleSubmitReply = () => {
    if (selectedDoubt && reply.trim()) {
      const updatedDoubt = {
        ...selectedDoubt,
        status: 'resolved',
        replies: [
          ...(selectedDoubt.replies || []),
          {
            mentorId: mentor.id,
            mentorName: mentor.name,
            reply: reply.trim(),
            date: new Date().toISOString().split('T')[0]
          }
        ]
      };

      updateDoubt(selectedDoubt.id, updatedDoubt);
      setSelectedDoubt(null);
      setReply('');
    }
  };

  const handleAISuggestion = async () => {
    if (!selectedDoubt) return;

    setLoadingAI(true);
    try {
      const prompt = `As a ${selectedDoubt.subject} teacher, provide a clear and helpful answer to this student's question:

Topic: ${selectedDoubt.topic}
Question: ${selectedDoubt.question}

Provide a concise, educational response suitable for a student.`;

      const response = await callGemini(prompt);
      if (response.success) {
        setReply(response.data);
      }
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Student Doubts</h1>
        <p className="text-gray-500 mt-1">Help students by resolving their questions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-50 rounded-xl">
              <HelpCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{openDoubts.length}</p>
              <p className="text-gray-600 text-sm">Pending</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{resolvedDoubts.length}</p>
              <p className="text-gray-600 text-sm">Resolved</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Open Doubts */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Doubts</h2>
        {openDoubts.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
            <p className="text-gray-500">All doubts resolved! Great work!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {openDoubts.map((doubt) => (
              <div key={doubt.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{doubt.studentName}</p>
                    <p className="text-sm text-gray-600">{doubt.subject} • {doubt.topic}</p>
                    <p className="text-xs text-gray-500 mt-1">{doubt.date}</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
                    Pending
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{doubt.question}</p>

                {selectedDoubt?.id === doubt.id ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={handleAISuggestion}
                        disabled={loadingAI}
                        className="flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        {loadingAI ? 'Generating...' : 'AI Suggestion'}
                      </Button>
                    </div>

                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                      placeholder="Type your answer here..."
                    />

                    <div className="flex gap-2">
                      <Button onClick={handleSubmitReply} disabled={!reply.trim()}>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Answer
                      </Button>
                      <Button variant="secondary" onClick={() => setSelectedDoubt(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => handleReply(doubt)}>
                    Reply
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Resolved Doubts */}
      {resolvedDoubts.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recently Resolved</h2>
          <div className="space-y-3">
            {resolvedDoubts.slice(0, 5).map((doubt) => (
              <div key={doubt.id} className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{doubt.studentName}</p>
                    <p className="text-sm text-gray-600">{doubt.subject} • {doubt.topic}</p>
                    <p className="text-xs text-gray-500 mt-1">{doubt.date}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Resolved
                  </span>
                </div>

                <p className="text-gray-700 mb-3">{doubt.question}</p>

                {doubt.replies && doubt.replies.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-sm font-medium text-green-900 mb-1">Your Answer:</p>
                    <p className="text-sm text-gray-700">{doubt.replies[doubt.replies.length - 1].reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MentorDoubts;
