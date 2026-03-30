import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import ProgressBar from '../../components/ProgressBar';
import ChatbotPanel from '../../components/ChatbotPanel';
import { BookOpen, Lock, CheckCircle, Play, MessageCircle, Sparkles } from 'lucide-react';

const Courses = () => {
  const { appData, currentUser, updateStudent } = useApp();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatbotContext, setChatbotContext] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const student = appData.students.find(s => s.id === currentUser?.id) || appData.students[0];
  const courses = appData.courses.filter(c => student.subjects.includes(c.subject));

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setShowTopicModal(true);
    setAnswers({});
    setShowResults(false);
  };

  const handleSendToChatbot = () => {
    setChatbotContext({
      title: selectedTopic.name,
      content: selectedTopic.content
    });
    setShowChatbot(true);
  };

  const handleSubmitQuiz = () => {
    const correctAnswers = selectedTopic.questions.filter(q => answers[q.id] === q.correct).length;
    const totalQuestions = selectedTopic.questions.length;
    const score = (correctAnswers / totalQuestions) * 100;

    // Update student progress
    const updatedStudent = {
      ...student,
      xp: student.xp + selectedTopic.xpReward,
      completedTopics: [...student.completedTopics, selectedTopic.name.toLowerCase()]
    };

    // Update weak topics based on performance
    if (score < 60) {
      const subject = courses.find(c => c.chapters.some(ch => 
        appData.chapters.find(chapter => chapter.id === ch)?.topics.includes(selectedTopic.id)
      ))?.subject;
      
      if (subject && !student.weakTopics[subject]?.includes(selectedTopic.name.toLowerCase())) {
        updatedStudent.weakTopics = {
          ...student.weakTopics,
          [subject]: [...(student.weakTopics[subject] || []), selectedTopic.name.toLowerCase()]
        };
      }
    }

    updateStudent(student.id, updatedStudent);
    setShowResults(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">My Courses</h1>
        <p className="text-gray-500 mt-1">Continue your learning journey</p>
      </div>

      {!selectedCourse ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => {
            const chapters = appData.chapters.filter(ch => course.chapters.includes(ch.id));
            const totalTopics = chapters.reduce((sum, ch) => sum + ch.topics.length, 0);
            const completedTopics = student.completedTopics.length;
            const progress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

            return (
              <Card key={course.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                </div>
                <ProgressBar progress={progress} className="mb-3" />
                <p className="text-gray-500 text-sm mb-4">
                  {chapters.length} chapters • {totalTopics} topics
                </p>
                <Button onClick={() => setSelectedCourse(course)} className="w-full">
                  Continue Learning
                </Button>
              </Card>
            );
          })}
        </div>
      ) : (
        <div>
          <Button variant="secondary" onClick={() => setSelectedCourse(null)} className="mb-4">
            ← Back to Courses
          </Button>

          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{selectedCourse.name}</h2>
            
            {appData.chapters
              .filter(ch => selectedCourse.chapters.includes(ch.id))
              .sort((a, b) => a.order - b.order)
              .map((chapter, chapterIndex) => {
                const topics = appData.topics.filter(t => chapter.topics.includes(t.id));
                
                return (
                  <div key={chapter.id} className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Chapter {chapter.order}: {chapter.name}
                    </h3>
                    
                    <div className="space-y-2">
                      {topics.map((topic, topicIndex) => {
                        const isCompleted = student.completedTopics.includes(topic.name.toLowerCase());
                        const isLocked = chapterIndex > 0 && topicIndex > 0 && !isCompleted;

                        return (
                          <div
                            key={topic.id}
                            onClick={() => !isLocked && handleTopicClick(topic)}
                            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                              isLocked
                                ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                : isCompleted
                                ? 'border-green-200 bg-green-50 cursor-pointer hover:border-green-300'
                                : 'border-blue-200 bg-blue-50 cursor-pointer hover:border-blue-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {isLocked ? (
                                <Lock className="w-5 h-5 text-gray-400" />
                              ) : isCompleted ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <Play className="w-5 h-5 text-blue-600" />
                              )}
                              <div>
                                <p className="font-medium text-gray-900">{topic.name}</p>
                                <p className="text-sm text-gray-500">{topic.difficulty} • {topic.xpReward} XP</p>
                              </div>
                            </div>
                            {isCompleted && (
                              <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                                Completed
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </Card>
        </div>
      )}

      {/* Topic Learning Modal */}
      <Modal
        isOpen={showTopicModal}
        onClose={() => setShowTopicModal(false)}
        title={selectedTopic?.name || ''}
      >
        {selectedTopic && (
          <div className="space-y-6">
            {/* Send to Chatbot Button */}
            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={handleSendToChatbot}
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Ask AI About This
              </Button>
            </div>

            {/* Content */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Explanation</h3>
              <p className="text-gray-700">{selectedTopic.content}</p>
            </div>

            {/* Key Points */}
            {selectedTopic.keyPoints && selectedTopic.keyPoints.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Key Points</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {selectedTopic.keyPoints.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Examples */}
            {selectedTopic.examples && selectedTopic.examples.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Examples</h3>
                <div className="space-y-2">
                  {selectedTopic.examples.map((example, i) => (
                    <div key={i} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-gray-700">{example}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            {selectedTopic.summary && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
                <p className="text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200">
                  {selectedTopic.summary}
                </p>
              </div>
            )}

            {/* AI Simplify Button */}
            <Button
              variant="secondary"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => {
                setChatbotContext({
                  title: selectedTopic.name,
                  content: selectedTopic.content
                });
                setShowChatbot(true);
              }}
            >
              <Sparkles className="w-4 h-4" />
              Explain Simply with AI
            </Button>

            {/* Questions */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Practice Questions</h3>
              <div className="space-y-4">
                {selectedTopic.questions.map((q, index) => (
                  <div key={q.id} className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-medium text-gray-900 mb-3">
                      {index + 1}. {q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((option, optIndex) => (
                        <label
                          key={optIndex}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            showResults
                              ? optIndex === q.correct
                                ? 'border-green-500 bg-green-50'
                                : answers[q.id] === optIndex
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200'
                              : answers[q.id] === optIndex
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${q.id}`}
                            checked={answers[q.id] === optIndex}
                            onChange={() => setAnswers({ ...answers, [q.id]: optIndex })}
                            disabled={showResults}
                            className="w-4 h-4"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!showResults ? (
              <Button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(answers).length !== selectedTopic.questions.length}
                className="w-full"
              >
                Submit Answers
              </Button>
            ) : (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-blue-900 font-semibold">
                  Score: {selectedTopic.questions.filter(q => answers[q.id] === q.correct).length} / {selectedTopic.questions.length}
                </p>
                <p className="text-blue-700 text-sm mt-1">
                  You earned {selectedTopic.xpReward} XP!
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Chatbot Panel */}
      <ChatbotPanel
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
        context={chatbotContext}
      />
    </div>
  );
};

export default Courses;
