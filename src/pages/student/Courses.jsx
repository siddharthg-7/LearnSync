import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { ChevronRight, CheckCircle, Play, Clock, Award, ArrowLeft, Sparkles, BookOpen, FlaskConical, Calculator, PenTool, Landmark, Atom, Zap, Trophy, HelpCircle } from 'lucide-react';
import { courseData } from '../../data/courseData';

// Icon mapping for course types (no emojis)
const courseIcons = {
  math: Calculator,
  english: PenTool,
  science: FlaskConical,
  physics: Zap,
  chemistry: FlaskConical,
  history: Landmark,
};

const getCourseIcon = (iconType) => {
  return courseIcons[iconType] || BookOpen;
};

const Courses = () => {
  const { appData, currentUser } = useApp();
  const [view, setView] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completedSubtopics, setCompletedSubtopics] = useState(() => {
    const saved = localStorage.getItem('learnsync-completed-subtopics');
    return saved ? JSON.parse(saved) : [];
  });

  const student = appData.students.find(s => s.id === currentUser?.id) || appData.students[0];
  const level = student?.level || 'foundation';
  const baseCourses = courseData[level] || courseData.foundation;

  // Convert mentor-created courses (from appData) into the same format
  const mentorCourses = appData.courses
    .filter(c => c.id?.startsWith?.('course_'))
    .map(mc => {
      // Build lessons from chapters & topics
      const chapters = appData.chapters.filter(ch => (mc.chapters || []).includes(ch.id));
      const lessons = chapters.map(ch => {
        const topics = appData.topics.filter(t => (ch.topics || []).includes(t.id));
        return {
          id: ch.id,
          title: ch.name,
          subtopics: topics.map(t => ({
            id: t.id,
            title: t.name,
            content: t.content || t.summary || 'Content from mentor',
            duration: '20 min',
            keyPoints: t.keyPoints || [],
            examples: t.examples || [],
          })),
          quiz: topics[0]?.questions?.length > 0
            ? { questions: topics[0].questions.map(q => ({ q: q.question, opts: q.options, ans: q.correct })) }
            : { questions: [] }
        };
      });

      // Map subject to iconType
      const subjectIconMap = { Math: 'math', Science: 'science', English: 'english', Physics: 'physics', Chemistry: 'chemistry', History: 'history' };

      return {
        id: mc.id,
        name: mc.name,
        iconType: subjectIconMap[mc.subject] || 'math',
        color: 'from-blue-500 to-indigo-600',
        description: mc.description || `${mc.subject} - ${mc.level || 'beginner'}`,
        lessons,
        isMentorCreated: true,
      };
    })
    .filter(mc => mc.lessons.length > 0); // Only show courses that have at least one chapter

  // Combine: hardcoded curriculum + mentor-created courses
  const courses = [...baseCourses, ...mentorCourses];

  const markComplete = (subtopicId) => {
    if (!completedSubtopics.includes(subtopicId)) {
      const updated = [...completedSubtopics, subtopicId];
      setCompletedSubtopics(updated);
      localStorage.setItem('learnsync-completed-subtopics', JSON.stringify(updated));
    }
  };

  const openCourse = (course) => { setSelectedCourse(course); setView('lessons'); };
  const openLesson = (lesson) => { setSelectedLesson(lesson); setView('subtopics'); setQuizMode(false); setQuizSubmitted(false); setQuizAnswers({}); };
  const openSubtopic = (subtopic) => { setSelectedSubtopic(subtopic); setView('content'); };

  const goBack = () => {
    if (view === 'content') setView('subtopics');
    else if (view === 'subtopics') { setView('lessons'); setQuizMode(false); }
    else if (view === 'lessons') { setView('courses'); setSelectedCourse(null); }
  };

  const startQuiz = () => { setQuizMode(true); setQuizAnswers({}); setQuizSubmitted(false); };

  const submitQuiz = () => {
    setQuizSubmitted(true);
    markComplete(`quiz-${selectedLesson.id}`);
  };

  const getQuizScore = () => {
    if (!selectedLesson?.quiz) return { correct: 0, total: 0 };
    const qs = selectedLesson.quiz.questions;
    const correct = qs.filter((q, i) => quizAnswers[i] === q.ans).length;
    return { correct, total: qs.length, percent: Math.round((correct / qs.length) * 100) };
  };

  const getCourseProgress = (course) => {
    const total = course.lessons.reduce((sum, l) => sum + l.subtopics.length + 1, 0);
    const done = course.lessons.reduce((sum, l) => {
      const subtopicsDone = l.subtopics.filter(s => completedSubtopics.includes(s.id)).length;
      const quizDone = completedSubtopics.includes(`quiz-${l.id}`) ? 1 : 0;
      return sum + subtopicsDone + quizDone;
    }, 0);
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  // ─── COURSE LIST VIEW ───
  if (view === 'courses') {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="px-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            {level === 'foundation' ? 'Foundation Level (Class 1-5)' : level === 'growth' ? 'Growth Level (Class 6-8)' : 'Mastery Level (Class 9-12)'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {courses.map(course => {
            const progress = getCourseProgress(course);
            const totalLessons = course.lessons.length;
            const totalSubtopics = course.lessons.reduce((s, l) => s + l.subtopics.length, 0);
            const IconComponent = getCourseIcon(course.iconType);

            return (
              <div key={course.id} onClick={() => openCourse(course)}
                className="bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
              >
                {/* Card Header with image + gradient overlay */}
                <div
                  className="relative p-4 sm:p-5 overflow-hidden h-36 sm:h-40 flex flex-col justify-between"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.25)), url(${
                      course.iconType === 'math' ? 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80' :
                      course.iconType === 'science' ? 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80' :
                      course.iconType === 'physics' ? 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&q=80' :
                      course.iconType === 'chemistry' ? 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=600&q=80' :
                      course.iconType === 'english' ? 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80' :
                      course.iconType === 'history' ? 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&q=80' :
                      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80'
                    })`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-white truncate drop-shadow-sm">{course.name}</h3>
                        <p className="text-white/80 text-xs sm:text-sm line-clamp-1 drop-shadow-sm">{course.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform flex-shrink-0 mt-0.5" />
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-white/90 mt-auto">
                    <span>{totalLessons} Lessons</span>
                    <span className="text-white/50">|</span>
                    <span>{totalSubtopics} Topics</span>
                  </div>
                </div>

                {/* Progress section */}
                <div className="p-4 sm:p-5 bg-white">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-2">
                    <span className="font-medium">Your Progress</span>
                    <span className="font-bold text-gray-900">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 sm:h-2.5">
                    {progress > 0 && (
                      <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── LESSONS VIEW ───
  if (view === 'lessons') {
    const progress = getCourseProgress(selectedCourse);
    const IconComponent = getCourseIcon(selectedCourse.iconType);

    return (
      <div className="space-y-4 sm:space-y-6">
        <button onClick={goBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium text-sm sm:text-base">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Back to Courses
        </button>

        {/* Course header banner */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-gray-200 relative overflow-hidden">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <IconComponent className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{selectedCourse.name}</h1>
              <p className="text-gray-500 text-xs sm:text-sm">{selectedCourse.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-100 rounded-full h-2.5 sm:h-3">
              {progress > 0 && (
                <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
              )}
            </div>
            <span className="font-bold text-sm sm:text-lg text-gray-900">{progress}%</span>
          </div>
        </div>

        {/* Lessons list */}
        <div className="space-y-3">
          {selectedCourse.lessons.map((lesson, idx) => {
            const doneSubs = lesson.subtopics.filter(s => completedSubtopics.includes(s.id)).length;
            const quizDone = completedSubtopics.includes(`quiz-${lesson.id}`);
            const totalItems = lesson.subtopics.length + 1;
            const doneItems = doneSubs + (quizDone ? 1 : 0);
            const lessonProgress = Math.round((doneItems / totalItems) * 100);

            return (
              <div key={lesson.id} onClick={() => openLesson(lesson)}
                className="bg-white rounded-xl border-2 border-gray-100 hover:border-blue-200 p-3.5 sm:p-5 cursor-pointer hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0 ${lessonProgress === 100 ? 'bg-green-500' : 'bg-blue-600'}`}>
                    {lessonProgress === 100 ? <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" /> : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors truncate">{lesson.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-xs sm:text-sm text-gray-500">
                      <span>{lesson.subtopics.length} topics</span>
                      <span className="text-gray-300">|</span>
                      <span>1 quiz</span>
                      <span className="text-gray-300">|</span>
                      <span>{doneItems}/{totalItems} done</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 max-w-[200px] sm:max-w-xs">
                      <div className={`h-1.5 rounded-full transition-all ${lessonProgress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${lessonProgress}%` }} />
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── SUBTOPICS + QUIZ VIEW ───
  if (view === 'subtopics') {
    return (
      <div className="space-y-4 sm:space-y-6">
        <button onClick={goBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium text-sm sm:text-base">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Back to {selectedCourse.name}
        </button>

        <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-100 p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{selectedLesson.title}</h2>
          <p className="text-gray-500 text-xs sm:text-sm">{selectedLesson.subtopics.length} topics + 1 quiz</p>
        </div>

        {/* Subtopics list */}
        <div className="space-y-2.5 sm:space-y-3">
          {selectedLesson.subtopics.map((subtopic, idx) => {
            const isDone = completedSubtopics.includes(subtopic.id);
            return (
              <div key={subtopic.id}>
                <div onClick={() => openSubtopic(subtopic)}
                  className={`bg-white rounded-xl border-2 p-3 sm:p-4 cursor-pointer hover:shadow-md transition-all flex items-center gap-3 sm:gap-4 ${isDone ? 'border-green-200 bg-green-50/50' : 'border-gray-100 hover:border-blue-200'}`}
                >
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isDone ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {isDone ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : <span className="font-bold text-xs sm:text-sm">{idx + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{subtopic.title}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-400">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span>{subtopic.duration}</span>
                    </div>
                  </div>
                  {isDone ? (
                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold flex-shrink-0">Done</span>
                  ) : (
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                  )}
                </div>

                {/* Quiz separator between subtopics */}
                {idx < selectedLesson.subtopics.length - 1 && (
                  <div className="flex items-center gap-2 py-1.5 px-3 sm:px-4">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-[10px] sm:text-xs text-gray-300 font-medium flex items-center gap-1">
                      <HelpCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Quiz checkpoint
                    </span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Quiz Card */}
          {!quizMode ? (
            <div onClick={startQuiz}
              className={`bg-white rounded-xl border-2 p-3 sm:p-4 cursor-pointer hover:shadow-md transition-all flex items-center gap-3 sm:gap-4 ${completedSubtopics.includes(`quiz-${selectedLesson.id}`) ? 'border-green-200 bg-green-50/50' : 'border-purple-200 hover:border-purple-400 bg-purple-50/30'}`}
            >
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${completedSubtopics.includes(`quiz-${selectedLesson.id}`) ? 'bg-green-500 text-white' : 'bg-purple-500 text-white'}`}>
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Lesson Quiz</h4>
                <p className="text-xs text-gray-400">{selectedLesson.quiz.questions.length} questions - Test your understanding</p>
              </div>
              {completedSubtopics.includes(`quiz-${selectedLesson.id}`) ? (
                <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold flex-shrink-0">Passed</span>
              ) : (
                <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-semibold flex-shrink-0">Take Quiz</span>
              )}
            </div>
          ) : (
            <Card className="border-2 border-purple-200 bg-purple-50/30">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">Lesson Quiz: {selectedLesson.title}</h3>
              </div>
              <div className="space-y-3 sm:space-y-5">
                {selectedLesson.quiz.questions.map((q, qIdx) => (
                  <div key={qIdx} className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100">
                    <p className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">{qIdx + 1}. {q.q}</p>
                    <div className="space-y-1.5 sm:space-y-2">
                      {q.opts.map((opt, oIdx) => {
                        let optClass = 'border-gray-200 hover:border-blue-300';
                        if (quizSubmitted) {
                          if (oIdx === q.ans) optClass = 'border-green-500 bg-green-50';
                          else if (quizAnswers[qIdx] === oIdx) optClass = 'border-red-500 bg-red-50';
                        } else if (quizAnswers[qIdx] === oIdx) {
                          optClass = 'border-blue-500 bg-blue-50';
                        }
                        return (
                          <label key={oIdx} className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border-2 cursor-pointer transition-all text-sm ${optClass}`}>
                            <input type="radio" name={`q-${qIdx}`} disabled={quizSubmitted} checked={quizAnswers[qIdx] === oIdx}
                              onChange={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }))} className="w-3.5 h-3.5 sm:w-4 sm:h-4 accent-blue-600 flex-shrink-0" />
                            <span className="text-gray-700 text-xs sm:text-sm">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {!quizSubmitted ? (
                <Button onClick={submitQuiz} disabled={Object.keys(quizAnswers).length < selectedLesson.quiz.questions.length} className="w-full mt-4 sm:mt-5">
                  Submit Quiz
                </Button>
              ) : (
                <div className={`mt-4 sm:mt-5 p-3 sm:p-4 rounded-xl border-2 text-center ${getQuizScore().percent >= 50 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Trophy className={`w-5 h-5 sm:w-6 sm:h-6 ${getQuizScore().percent >= 50 ? 'text-green-600' : 'text-red-400'}`} />
                    <p className="font-bold text-base sm:text-lg text-gray-900">Score: {getQuizScore().correct}/{getQuizScore().total} ({getQuizScore().percent}%)</p>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">{getQuizScore().percent >= 50 ? 'Great work! You passed!' : 'Review the topics and try again.'}</p>
                  <button onClick={() => { setQuizMode(false); setQuizSubmitted(false); setQuizAnswers({}); }} className="mt-2 sm:mt-3 text-xs sm:text-sm text-blue-600 hover:underline font-medium">Close Quiz</button>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    );
  }

  // ─── CONTENT VIEW ───
  if (view === 'content') {
    const isDone = completedSubtopics.includes(selectedSubtopic.id);
    return (
      <div className="space-y-4 sm:space-y-6">
        <button onClick={goBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium text-sm sm:text-base">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Back to {selectedLesson.title}
        </button>

        <Card className="border-2 border-gray-100">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm mb-4">
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-100 text-blue-700 rounded-full font-semibold truncate max-w-[120px] sm:max-w-none">{selectedCourse.name}</span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-500 truncate">{selectedLesson.title}</span>
          </div>

          <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">{selectedSubtopic.title}</h1>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 flex-shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{selectedSubtopic.duration}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <div className="bg-blue-50 rounded-xl p-4 sm:p-5 border border-blue-100 mb-4 sm:mb-6">
              <p className="text-gray-800 text-sm sm:text-lg leading-relaxed whitespace-pre-line">{selectedSubtopic.content}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
            {!isDone && (
              <Button onClick={() => markComplete(selectedSubtopic.id)} className="flex-1 flex items-center justify-center gap-2 text-sm sm:text-base py-2.5 sm:py-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> Mark as Complete
              </Button>
            )}
            <Button variant="secondary" onClick={() => {
              window.dispatchEvent(new CustomEvent('open-ai-drawer', { detail: { title: selectedSubtopic.title, content: selectedSubtopic.content } }));
            }} className="flex-1 flex items-center justify-center gap-2 text-sm sm:text-base py-2.5 sm:py-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" /> Ask AI About This
            </Button>
          </div>

          {isDone && (
            <div className="mt-3 sm:mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-center">
              <p className="text-green-700 font-semibold text-sm sm:text-base flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> You have completed this topic!
              </p>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return null;
};

export default Courses;
