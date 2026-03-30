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

  const handleQuizCompletion = (quizResult) => {
    // Update student progress with AI quiz results
    const updatedStudent = {
      ...student,
      xp: student.xp + Math.floor(quizResult.score / 10), // Award XP based on score
      completedTopics: quizResult.score >= 70 && !student.completedTopics.includes(quizResult.topic?.toLowerCase())
        ? [...student.completedTopics, quizResult.topic.toLowerCase()]
        : student.completedTopics
    };

    updateStudent(student.id, updatedStudent);
  };

  const student = appData.students.find(s => s.id === currentUser?.id) || appData.students[0];
  const isYoungStudent = student.age <= 10; // Foundation mode for ages 5-10
  
  // Determine student level based on class
  const getStudentLevel = (classValue) => {
    const classNum = parseInt(classValue);
    if (classNum >= 1 && classNum <= 5) return 'foundation';
    if (classNum >= 6 && classNum <= 8) return 'growth';
    return 'mastery'; // Classes 9-12
  };
  
  const studentLevel = getStudentLevel(student.class);
  
  // Filter courses based on student's selected subjects AND appropriate level
  const courses = appData.courses.filter(course => {
    // First check if level matches
    if (course.level !== studentLevel) return false;
    
    // Then check if any of the student's subjects match this course's subject
    const matches = student.subjects.some(studentSubject => {
      const courseSubj = course.subject.toLowerCase().trim();
      const studentSubj = studentSubject.toLowerCase().trim();
      
      // Direct exact match: "Mathematics" === "Mathematics"
      if (courseSubj === studentSubj) return true;
      
      // Handle Science subjects: "Physics" should match "Science (Physics)"
      if (courseSubj.includes(`(${studentSubj})`)) return true;
      
      // Handle subject with level suffix: "Mathematics" matches "Mathematics - Primary"
      // But only if it's the same base subject
      if (courseSubj.startsWith(studentSubj + ' -') || courseSubj.startsWith(studentSubj + '-')) return true;
      
      return false;
    });
    
    return matches;
  });

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
    <div className="space-y-4 md:space-y-6">
      {/* Header - Gamified for young students */}
      {isYoungStudent ? (
        <div className="text-center bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 rounded-3xl p-4 md:p-6">
          <div className="text-5xl md:text-6xl mb-2">📚</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Adventures!</h1>
          <p className="text-base md:text-lg text-purple-600 font-semibold mt-1">Choose your quest</p>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">My Courses</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Continue your learning journey</p>
        </div>
      )}

      {!selectedCourse ? (
        <>
          {courses.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Available</h3>
                <p className="text-gray-500">
                  Courses for your selected subjects will appear here once they're created.
                </p>
              </div>
            </Card>
          ) : isYoungStudent ? (
            // Gamified course cards for young students
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {courses.map((course, index) => {
                const chapters = appData.chapters.filter(ch => course.chapters.includes(ch.id));
                const totalTopics = chapters.reduce((sum, ch) => sum + ch.topics.length, 0);
                const completedTopics = student.completedTopics.length;
                const progress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

                const colors = [
                  { bg: 'from-pink-200 to-purple-200', border: 'border-pink-400', button: 'bg-pink-400 hover:bg-pink-500', emoji: '🎨' },
                  { bg: 'from-blue-200 to-cyan-200', border: 'border-blue-400', button: 'bg-blue-400 hover:bg-blue-500', emoji: '🔢' },
                  { bg: 'from-green-200 to-yellow-200', border: 'border-green-400', button: 'bg-green-400 hover:bg-green-500', emoji: '🌍' },
                  { bg: 'from-orange-200 to-red-200', border: 'border-orange-400', button: 'bg-orange-400 hover:bg-orange-500', emoji: '🔬' },
                ];
                const color = colors[index % colors.length];

                return (
                  <div key={course.id} className={`bg-gradient-to-br ${color.bg} rounded-3xl p-5 md:p-6 border-4 ${color.border} shadow-xl transform hover:scale-102 transition-all cursor-pointer`}
                    onClick={() => setSelectedCourse(course)}>
                    <div className="flex items-center gap-3 md:gap-4 mb-4">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl flex items-center justify-center text-4xl md:text-5xl shadow-lg">
                        {color.emoji}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900">{course.name}</h3>
                        <p className="text-sm md:text-base text-gray-700 font-semibold">{chapters.length} Adventures</p>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm md:text-base font-bold text-gray-700">Progress</span>
                        <span className="text-sm md:text-base font-bold text-gray-700">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-white rounded-full h-5 md:h-6 border-2 border-gray-300 shadow-inner">
                        <div className={`h-full rounded-full bg-gradient-to-r ${color.button} transition-all duration-500`} style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>

                    {/* Stars earned */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl md:text-3xl">⭐</span>
                        <span className="text-base md:text-lg font-bold text-gray-900">{completedTopics * 10} Stars</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl md:text-3xl">🏆</span>
                        <span className="text-base md:text-lg font-bold text-gray-900">{completedTopics}/{totalTopics}</span>
                      </div>
                    </div>

                    <button className={`w-full ${color.button} text-white text-base md:text-lg font-bold py-3 md:py-4 rounded-2xl transition-all transform hover:scale-105 shadow-lg`}>
                      Start Adventure! 🚀
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            // Regular course cards for older students
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
          )}
        </>
      ) : (
        <div>
          <Button variant="secondary" onClick={() => setSelectedCourse(null)} className="mb-4">
            ← Back to {isYoungStudent ? 'Adventures' : 'Courses'}
          </Button>

          {isYoungStudent ? (
            // Gamified chapter view for young students
            <div className="space-y-4 md:space-y-6">
              <div className="text-center bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-4 md:p-6 border-4 border-purple-300">
                <div className="text-5xl md:text-6xl mb-2">🗺️</div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{selectedCourse.name}</h2>
                <p className="text-base md:text-lg text-purple-600 font-semibold mt-1">Your Learning Map</p>
              </div>

              {appData.chapters
                .filter(ch => selectedCourse.chapters.includes(ch.id))
                .sort((a, b) => a.order - b.order)
                .map((chapter, chapterIndex) => {
                  const topics = appData.topics.filter(t => chapter.topics.includes(t.id));
                  const chapterColors = [
                    { bg: 'from-pink-100 to-purple-100', border: 'border-pink-300', icon: '🎯' },
                    { bg: 'from-blue-100 to-cyan-100', border: 'border-blue-300', icon: '🌟' },
                    { bg: 'from-green-100 to-yellow-100', border: 'border-green-300', icon: '🏆' },
                  ];
                  const color = chapterColors[chapterIndex % chapterColors.length];

                  return (
                    <div key={chapter.id} className={`bg-gradient-to-br ${color.bg} rounded-3xl p-4 md:p-6 border-4 ${color.border} shadow-lg`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-4xl md:text-5xl">{color.icon}</div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                          Level {chapter.order}: {chapter.name}
                        </h3>
                      </div>
                      
                      <div className="space-y-3">
                        {topics.map((topic, topicIndex) => {
                          const isCompleted = student.completedTopics.includes(topic.name.toLowerCase());
                          const isLocked = chapterIndex > 0 && topicIndex > 0 && !isCompleted;

                          return (
                            <div
                              key={topic.id}
                              onClick={() => !isLocked && handleTopicClick(topic)}
                              className={`flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-2xl border-4 transition-all transform hover:scale-102 ${
                                isLocked
                                  ? 'bg-gray-200 border-gray-300 cursor-not-allowed opacity-60'
                                  : isCompleted
                                  ? 'bg-green-200 border-green-400 cursor-pointer'
                                  : 'bg-white border-yellow-400 cursor-pointer hover:shadow-lg'
                              }`}
                            >
                              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-2xl md:text-3xl ${
                                isLocked ? 'bg-gray-300' : isCompleted ? 'bg-green-400' : 'bg-yellow-400'
                              }`}>
                                {isLocked ? '🔒' : isCompleted ? '✅' : '⭐'}
                              </div>
                              <div className="flex-1">
                                <p className="text-base md:text-lg font-bold text-gray-900">{topic.name}</p>
                                <p className="text-sm md:text-base font-semibold text-yellow-600">+{topic.xpReward} Stars</p>
                              </div>
                              {isCompleted && (
                                <div className="text-3xl md:text-4xl">🏆</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            // Regular chapter view for older students
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
          )}
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
        onQuizGenerated={handleQuizCompletion}
        studentId={student.id}
      />
    </div>
  );
};

export default Courses;
