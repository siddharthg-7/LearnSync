import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import ProgressBar from '../../components/ProgressBar';
import { BookOpen, Lock, CheckCircle, Play, MessageCircle, Sparkles, Brain } from 'lucide-react';

const Courses = () => {
  const { appData, currentUser, updateStudent } = useApp();
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showTopicModal, setShowTopicModal] = useState(false);
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
    
    // TODO: Notify mentor about quiz completion
    console.log('Quiz completed - notify mentor:', {
      studentId: student.id,
      studentName: student.name,
      topic: quizResult.topic,
      score: quizResult.score,
      mentorId: student.mentorId
    });
  };

  const student = appData.students.find(s => s.id === currentUser?.id) || appData.students[0];
  
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
        <>
          {/* Debug info - remove after testing */}
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-sm text-gray-700">
              <strong>Debug Info:</strong> Class: {student.class} | Level: {studentLevel} | 
              Subjects: {student.subjects.join(', ')} | 
              Total Courses Available: {appData.courses.length} | 
              Filtered Courses: {courses.length}
            </p>
          </div>
          
          {courses.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Available</h3>
                <p className="text-gray-500">
                  Courses for your selected subjects will appear here once they're created.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Your subjects: {student.subjects.join(', ')}
                </p>
              </div>
            </Card>
          ) : (
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
            ← Back to Courses
          </Button>

          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{selectedCourse.name}</h2>
            
            {appData.chapters
              .filter(ch => selectedCourse.chapters.includes(ch.id))
              .sort((a, b) => a.order - b.order)
              .map((chapter, chapterIndex) => {
                const topics = (chapter.topics || [])
                  .map((id) => appData.topics.find(t => t.id === id))
                  .filter(Boolean);
                
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

      {/* Topic Learning Modal — Premium Learning Module Format */}
      <Modal
        isOpen={showTopicModal}
        onClose={() => setShowTopicModal(false)}
        title={selectedTopic?.name || ''}
      >
        {selectedTopic && (
          <div className="space-y-12 pb-8">
            {/* 1. Header Action Panel */}
            <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-2xl border border-indigo-100 shadow-sm sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Topic Study Mode</span>
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  navigate('/ai-tutor', {
                    state: {
                      context: {
                        title: selectedTopic.name,
                        content: selectedTopic.content,
                        autoPrompt: 'Explain'
                      }
                    }
                  });
                  setShowTopicModal(false); // Close modal and focus on AI
                }}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-md transform hover:scale-105 active:scale-95 text-xs py-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Ask AI Assistant
              </Button>
            </div>

            {/* 2. Introduction Section */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 pb-1">Introduction</h2>
              </div>
              <p className="text-lg text-gray-700 font-medium leading-relaxed italic border-l-4 border-blue-200 pl-4 py-2 bg-blue-50/30 rounded-r-lg">
                {selectedTopic.introduction || "Let's explore the core principles of this topic and understand why it matters in our daily lives."}
              </p>
              <p className="mt-4 text-gray-700 leading-relaxed">
                {selectedTopic.content}
              </p>
            </section>

            {/* 3. Key Concepts & 4. Detailed Explanation */}
            <section className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-inner">
               <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 border-b-2 border-amber-500 pb-1">Key Concepts</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {(selectedTopic.keyPoints || ["Basic fundamentals", "Core theory", "Practical use"]).map((point, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <span className="w-6 h-6 flex items-center justify-center bg-amber-50 text-amber-600 rounded-full text-xs font-bold shrink-0">{i+1}</span>
                    <p className="text-sm text-gray-700">{point}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 prose prose-indigo max-w-none">
                <h3 className="text-lg font-semibold text-gray-800">Detailed Explanation</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedTopic.detailedExplanation || `To understand ${selectedTopic.name}, we must dive deeper into how its components interact. This involves analyzing patterns, structures, and their impact on surrounding elements.`}
                </p>
              </div>
            </section>

            {/* 5. Real-world Examples */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 border-b-2 border-emerald-500 pb-1">Examples</h2>
              </div>
              <div className="space-y-4">
                {(selectedTopic.examples || ["Consider how this works in a car engine", "Imagine a library where books are sorted by color"]).map((example, i) => (
                  <div key={i} className="p-5 bg-gradient-to-r from-emerald-50 to-white rounded-2xl border-l-4 border-emerald-500 shadow-sm">
                    <p className="text-gray-800 font-medium leading-relaxed">{example}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Diagrams Section (Text-based with premium container) */}
            <section className="bg-zinc-900 p-8 rounded-3xl text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <BookOpen className="w-24 h-24" />
              </div>
              <h2 className="text-xl font-bold mb-6 text-indigo-400 border-b border-white/10 pb-2">Topic Visualizer</h2>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl font-mono text-xs sm:text-sm leading-6 whitespace-pre text-indigo-100">
                {selectedTopic.diagramDesc || `
[ Index 0 | Index 1 | Index 2 | Index 3 ]
[ "DataA" | "DataB" | "DataC" | "DataD" ]
 ──────────────────────────────────────
      Contiguous Memory Slots
                `}
              </div>
              <p className="mt-4 text-xs text-zinc-400 text-center italic uppercase tracking-widest">Figure 1.1 — Structural Representation of {selectedTopic.name}</p>
            </section>

            {/* 7. Summary & 10. Glossary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                <h2 className="text-xl font-bold text-indigo-900 mb-4">Quick Summary</h2>
                <ul className="space-y-3">
                  {(selectedTopic.summary ? [selectedTopic.summary] : ["Core fundamentals are mastered.", "Patterns are identified.", "Ready for assessment."]).map((s, i) => (
                    <li key={i} className="flex gap-2 text-indigo-800 text-sm italic">
                      <span className="text-indigo-400">•</span> {s}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Glossary</h2>
                <div className="space-y-3">
                  {(selectedTopic.glossary || [
                    { t: "Logic", d: "A systematic way of thinking." },
                    { t: "Pattern", d: "A regular and intelligible form or sequence." }
                  ]).map((item, i) => (
                    <div key={i} className="text-sm">
                      <span className="font-bold text-slate-900">{item.t}:</span> <span className="text-slate-600">{item.d}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* 8. Important Questions Section */}
            <section className="border-t-2 border-dashed border-gray-200 pt-12">
               <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Critical Inquiry Questions</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-white rounded-xl border-t-4 border-indigo-400 shadow-sm">
                  <h4 className="font-bold text-xs text-indigo-600 uppercase mb-2">Conceptual Question</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    How does {selectedTopic.name} impact the overall performance of a system when data sizes grow exponentially?
                  </p>
                </div>
                <div className="p-5 bg-white rounded-xl border-t-4 border-rose-400 shadow-sm">
                  <h4 className="font-bold text-xs text-rose-600 uppercase mb-2">Practical Application</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Identify three scenarios in modern software development where choosing an alternative approach would be superior to {selectedTopic.name}.
                  </p>
                </div>
              </div>
            </section>

            {/* 9. Interactive Quiz Section */}
            <section className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl shadow-xl text-white">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-white/20 text-white rounded-lg">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">Knowledge Check</h2>
              </div>
              
              <div className="space-y-6">
                {(selectedTopic.questions || []).map((q, index) => (
                  <div key={q.id} className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                    <p className="font-semibold text-lg mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 flex items-center justify-center bg-white text-indigo-700 rounded-full text-sm font-bold">{index + 1}</span>
                      {q.question}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((option, optIndex) => (
                        <label
                          key={optIndex}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            showResults
                              ? optIndex === q.correct
                                ? 'border-emerald-400 bg-emerald-400/20 shadow-lg'
                                : answers[q.id] === optIndex
                                ? 'border-rose-400 bg-rose-400/20'
                                : 'border-white/10'
                              : answers[q.id] === optIndex
                              ? 'border-white bg-white/20 scale-[1.02]'
                              : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${q.id}`}
                            checked={answers[q.id] === optIndex}
                            onChange={() => setAnswers({ ...answers, [q.id]: optIndex })}
                            disabled={showResults}
                            className="hidden"
                          />
                          <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[q.id] === optIndex ? 'bg-white border-white' : 'border-white/40'}`}>
                            {answers[q.id] === optIndex && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                          </span>
                          <span className="text-white/90 font-medium">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {!showResults ? (
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(answers).length !== (selectedTopic.questions?.length || 0)}
                  className="w-full mt-8 bg-white text-indigo-600 hover:bg-gray-100 border-none py-4 text-lg font-bold shadow-2xl transition-all hover:translate-y-[-2px] active:translate-y-[1px] disabled:opacity-50"
                >
                  Confirm Answers & Claim XP
                </Button>
              ) : (
                <div className="mt-8 p-6 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-white/80 uppercase tracking-widest text-xs font-bold mb-1">Your Performance</p>
                    <p className="text-3xl font-black">
                      Score: {selectedTopic.questions.filter(q => answers[q.id] === q.correct).length} / {selectedTopic.questions.length}
                    </p>
                  </div>
                  <div className="bg-emerald-400 text-emerald-950 px-6 py-2 rounded-full font-bold shadow-lg">
                    +{selectedTopic.xpReward} XP Earned
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Courses;
