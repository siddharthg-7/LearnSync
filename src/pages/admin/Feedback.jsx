import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { MessageSquare, CheckCircle, Clock, AlertCircle, User } from 'lucide-react';

const Feedback = () => {
  const { appData, updateData } = useApp();
  const [filter, setFilter] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Initialize feedback if not exists
  const feedbacks = appData.feedbacks || [
    {
      id: 1,
      userId: 1,
      userName: 'Rahul Kumar',
      userRole: 'student',
      type: 'issue',
      message: 'The quiz timer is too short for complex questions',
      status: 'open',
      createdAt: new Date().toISOString(),
      response: null
    },
    {
      id: 2,
      userId: 2,
      userName: 'Priya Sharma',
      userRole: 'student',
      type: 'suggestion',
      message: 'Can we have video explanations for difficult topics?',
      status: 'open',
      createdAt: '2026-03-29T00:00:00.000Z',
      response: null
    },
    {
      id: 3,
      userId: 1,
      userName: 'Amit Patel',
      userRole: 'mentor',
      type: 'complaint',
      message: 'Student attendance tracking is not accurate',
      status: 'resolved',
      createdAt: '2026-03-28T00:00:00.000Z',
      response: 'Fixed in latest update'
    }
  ];

  const filteredFeedbacks = filter === 'all' 
    ? feedbacks 
    : feedbacks.filter(f => f.status === filter);

  const handleResolve = (feedbackId, response) => {
    const updatedFeedbacks = feedbacks.map(f =>
      f.id === feedbackId ? { ...f, status: 'resolved', response } : f
    );
    updateData('feedbacks', updatedFeedbacks);
    setSelectedFeedback(null);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'complaint': return AlertCircle;
      case 'issue': return AlertCircle;
      case 'suggestion': return MessageSquare;
      default: return MessageSquare;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'complaint': return 'text-red-600 bg-red-50';
      case 'issue': return 'text-orange-600 bg-orange-50';
      case 'suggestion': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-yellow-700 bg-yellow-100';
      case 'resolved': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">User Feedback</h1>
        <p className="text-gray-600 mt-1">Track and resolve user issues and suggestions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-50 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {feedbacks.filter(f => f.status === 'open').length}
              </p>
              <p className="text-gray-600 text-sm">Open</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {feedbacks.filter(f => f.status === 'resolved').length}
              </p>
              <p className="text-gray-600 text-sm">Resolved</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {feedbacks.length}
              </p>
              <p className="text-gray-600 text-sm">Total</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'primary' : 'secondary'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'open' ? 'primary' : 'secondary'}
          onClick={() => setFilter('open')}
        >
          Open
        </Button>
        <Button
          variant={filter === 'resolved' ? 'primary' : 'secondary'}
          onClick={() => setFilter('resolved')}
        >
          Resolved
        </Button>
      </div>

      {/* Feedback List */}
      <div className="space-y-3">
        {filteredFeedbacks.map((feedback) => {
          const TypeIcon = getTypeIcon(feedback.type);
          
          return (
            <Card key={feedback.id}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${getTypeColor(feedback.type)}`}>
                  <TypeIcon className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{feedback.userName}</span>
                        <span className="text-gray-500 text-sm">({feedback.userRole})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(feedback.type)}`}>
                          {feedback.type}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(feedback.status)}`}>
                          {feedback.status}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{feedback.message}</p>

                  {feedback.response && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-green-700">Response: </span>
                        {feedback.response}
                      </p>
                    </div>
                  )}

                  {feedback.status === 'open' && (
                    <Button
                      variant="secondary"
                      className="text-sm"
                      onClick={() => setSelectedFeedback(feedback)}
                    >
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}

        {filteredFeedbacks.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No feedback found</p>
            </div>
          </Card>
        )}
      </div>

      {/* Resolve Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolve Feedback</h3>
            <p className="text-gray-700 mb-4">{selectedFeedback.message}</p>
            
            <textarea
              placeholder="Enter your response..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows="4"
              id="response-input"
            />

            <div className="flex gap-2 justify-end">
              <Button
                variant="secondary"
                onClick={() => setSelectedFeedback(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const response = document.getElementById('response-input').value;
                  if (response.trim()) {
                    handleResolve(selectedFeedback.id, response);
                  }
                }}
              >
                Mark as Resolved
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Feedback;
