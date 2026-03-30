import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, BookOpen, Star, Briefcase, GraduationCap, ChevronRight, ChevronLeft, Award, User
} from 'lucide-react';

const MentorOnboarding = ({ onComplete }) => {
  const { addMentor } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    education: '',
    subjects: [],
    selfRating: {},
    hasExperience: false,
    experienceValue: '',
    testAnswers: {}
  });

  const subjectCategories = [
    { 
      category: 'Core Subjects', 
      subjects: ['Mathematics', 'English', 'Science', 'EVS'],
      color: 'blue'
    },
    { 
      category: 'Support Subjects', 
      subjects: ['General Knowledge', 'Reading & Comprehension', 'Writing Skills', 'Spoken English'],
      color: 'purple'
    },
    { 
      category: 'Skill Subjects', 
      subjects: ['Logical Reasoning', 'Communication Skills', 'Storytelling'],
      color: 'emerald'
    }
  ];

  // Simple MCQ Database per subject
  const mcqDatabase = {
    'Mathematics': [
      { id: 1, question: "A student struggles with word problems despite knowing arithmetic. What is the best teaching approach?", options: ["Drill more arithmetic", "Teach them to identify key information and translate words to equations", "Skip word problems entirely"], correct: 1 },
      { id: 2, question: "When introducing fractions to young learners, which method is most effective?", options: ["Start with abstract notation like 3/4", "Use visual models like pie charts and number lines", "Memorize fraction rules first"], correct: 1 },
      { id: 3, question: "What does Bloom's Taxonomy suggest about structuring math lessons?", options: ["Always start with the hardest problems", "Progress from recall to application to analysis", "Focus only on memorization"], correct: 1 }
    ],
    'English': [
      { id: 1, question: "A student writes grammatically correct sentences but lacks coherence in paragraphs. What should you focus on?", options: ["More grammar drills", "Teaching transition words and paragraph structure", "Correcting spelling mistakes"], correct: 1 },
      { id: 2, question: "What is the best strategy to improve vocabulary retention in students?", options: ["Memorizing dictionary definitions", "Contextual learning through reading and usage", "Weekly spelling tests only"], correct: 1 },
      { id: 3, question: "Which approach best develops critical thinking in English literature?", options: ["Summarizing the plot only", "Asking open-ended questions about character motivation and themes", "Focusing solely on the author's biography"], correct: 1 }
    ],
    'Science': [
      { id: 1, question: "A student believes heavy objects fall faster than light ones. How should you address this misconception?", options: ["Tell them they are wrong and give the correct answer", "Design a hands-on experiment comparing falling objects", "Ignore it and move to the next topic"], correct: 1 },
      { id: 2, question: "What is the inquiry-based learning approach in Science teaching?", options: ["Students memorize facts from textbooks", "Students investigate questions through experiments and observations", "Teacher lectures while students take notes"], correct: 1 },
      { id: 3, question: "When teaching the scientific method, what is the correct sequence?", options: ["Hypothesis → Observation → Experiment", "Observation → Hypothesis → Experiment → Analysis", "Experiment → Hypothesis → Observation"], correct: 1 }
    ],
    'EVS': [
      { id: 1, question: "What is the most effective way to teach environmental awareness to young students?", options: ["Textbook reading only", "Field trips and hands-on activities like gardening", "Watching documentaries without discussion"], correct: 1 },
      { id: 2, question: "How should a mentor handle conflicting information about climate change from students' homes?", options: ["Dismiss the parents' views", "Present evidence-based facts and encourage critical thinking", "Avoid the topic altogether"], correct: 1 },
      { id: 3, question: "Which pedagogical approach works best for EVS with primary students?", options: ["Abstract lectures on ecosystems", "Place-based learning connecting lessons to the local environment", "Rote memorization of environmental terms"], correct: 1 }
    ],
    'General Knowledge': [
      { id: 1, question: "How can a mentor make GK sessions engaging rather than just fact-based?", options: ["Give students lists to memorize", "Use quiz games, current events discussions, and project-based exploration", "Test students every class"], correct: 1 },
      { id: 2, question: "A student shows no interest in General Knowledge topics. What is the best approach?", options: ["Force them to study harder", "Connect GK topics to their personal interests and hobbies", "Reduce their GK curriculum"], correct: 1 },
      { id: 3, question: "What is the role of formative assessment in GK teaching?", options: ["Only used for final grading", "Ongoing checks to guide teaching and identify gaps", "Testing memorization of dates and facts"], correct: 1 }
    ],
    'Reading & Comprehension': [
      { id: 1, question: "A student can read fluently but cannot answer inference-based questions. What does this indicate?", options: ["They need phonics practice", "They lack higher-order comprehension skills", "They are reading too fast"], correct: 1 },
      { id: 2, question: "Which strategy helps struggling readers build comprehension?", options: ["Reading longer passages", "Teaching them to visualize, predict, and summarize while reading", "Increasing reading speed drills"], correct: 1 },
      { id: 3, question: "What is 'scaffolded reading' in a teaching context?", options: ["Reading without any support", "Providing structured support that is gradually removed as the student improves", "Only reading aloud to students"], correct: 1 }
    ],
    'Writing Skills': [
      { id: 1, question: "A student's essays lack structure. What is the most effective intervention?", options: ["Mark all errors in red", "Teach outlining and graphic organizers before writing", "Ask them to rewrite until it's perfect"], correct: 1 },
      { id: 2, question: "What is the 'process writing' approach?", options: ["Writing a final draft in one sitting", "A cycle of prewriting, drafting, revising, editing, and publishing", "Copying model essays"], correct: 1 },
      { id: 3, question: "How should a mentor give feedback on creative writing?", options: ["Focus only on grammar and spelling errors", "Balance positive feedback with specific, constructive suggestions", "Rewrite the student's work for them"], correct: 1 }
    ],
    'Spoken English': [
      { id: 1, question: "A student is fluent but speaks with poor pronunciation. What approach works best?", options: ["Correct every mistake immediately", "Model correct pronunciation naturally and use minimal pairs practice", "Discourage them from speaking until pronunciation improves"], correct: 1 },
      { id: 2, question: "What is the Communicative Language Teaching (CLT) approach?", options: ["Focus on grammar translation", "Emphasize real-life communication and meaningful interaction", "Memorize dialogues from textbooks"], correct: 1 },
      { id: 3, question: "How do you build confidence in a shy student during spoken English sessions?", options: ["Call on them frequently in front of the class", "Start with pair activities and small group discussions before larger groups", "Let them only do written work"], correct: 1 }
    ],
    'Logical Reasoning': [
      { id: 1, question: "What is the best way to develop logical thinking in young learners?", options: ["Give them complex puzzles immediately", "Use age-appropriate pattern recognition, sequencing, and classification activities", "Focus only on mathematics"], correct: 1 },
      { id: 2, question: "A student gives the right answer but cannot explain their reasoning. What should you do?", options: ["Accept the answer and move on", "Ask probing questions to help them articulate their thought process", "Mark it as incorrect"], correct: 1 },
      { id: 3, question: "Which tool is most effective for teaching deductive reasoning?", options: ["Memorization worksheets", "Venn diagrams and truth tables with real-world scenarios", "Speed-based quizzes"], correct: 1 }
    ],
    'Communication Skills': [
      { id: 1, question: "What is the biggest barrier to effective communication in a classroom?", options: ["Using too many visual aids", "Lack of active listening and one-way lecturing", "Speaking too slowly"], correct: 1 },
      { id: 2, question: "How should a mentor teach students to handle disagreements constructively?", options: ["Avoid all conflicts", "Model respectful debate techniques and teach 'I' statements", "Let students resolve conflicts without guidance"], correct: 1 },
      { id: 3, question: "What role does non-verbal communication play in effective teaching?", options: ["It is irrelevant in education", "Body language, eye contact, and gestures significantly impact student engagement", "Only verbal communication matters"], correct: 1 }
    ],
    'Storytelling': [
      { id: 1, question: "What makes storytelling an effective pedagogical tool?", options: ["It fills classroom time", "It engages emotions, aids memory retention, and makes abstract concepts relatable", "It replaces the need for structured lessons"], correct: 1 },
      { id: 2, question: "How can a mentor use storytelling to teach moral values without being preachy?", options: ["State the moral directly at the start", "Let students discover the moral through guided discussion after the story", "Only use stories from textbooks"], correct: 1 },
      { id: 3, question: "What is the key difference between reading a story and storytelling?", options: ["There is no difference", "Storytelling involves voice modulation, gestures, eye contact, and audience interaction", "Reading is always better than telling"], correct: 1 }
    ]
  };

  const handleSubjectToggle = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleRating = (subject, rating) => {
    setFormData(prev => ({
      ...prev,
      selfRating: { ...prev.selfRating, [subject]: rating }
    }));
  };

  const handleTestAnswer = (subject, questionId, selectedOptionIdx) => {
    setFormData(prev => ({
      ...prev,
      testAnswers: {
        ...prev.testAnswers,
        [`${subject}-${questionId}`]: selectedOptionIdx
      }
    }));
  };

  // Logic calculation for final screen
  const calculateResult = () => {
    // 1. Calculate Test Score Percentage
    let correctAnswers = 0;
    let totalQuestions = 0;

    formData.subjects.forEach(sub => {
      const qs = mcqDatabase[sub] || [];
      qs.forEach(q => {
        totalQuestions++;
        const answerKey = `${sub}-${q.id}`;
        if (formData.testAnswers[answerKey] === q.correct) {
          correctAnswers++;
        }
      });
    });

    const testScore = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    // 2. Average Self Rating
    let totalRating = 0;
    formData.subjects.forEach(sub => {
      totalRating += formData.selfRating[sub] || 3;
    });
    const avgRating = formData.subjects.length > 0 ? (totalRating / formData.subjects.length) : 0; // out of 5

    // 3. Optional: factor experience. For now, experience gives a slight bump.
    const hasExp = formData.hasExperience;

    // Final Metric out of 100 roughly combining rating and test score.
    // E.g., Test Score is 70% weight, Rating is 30% weight
    const ratingScore = (avgRating / 5) * 100;
    let finalMetric = (0.7 * testScore) + (0.3 * ratingScore);
    if (hasExp) finalMetric += 5; // experience bump

    let level = 'Beginner';
    let classRange = 'Class 1-5';

    if (finalMetric > 80) {
      level = 'Advanced';
      classRange = 'Class 9-12';
    } else if (finalMetric > 50) {
      level = 'Intermediate';
      classRange = 'Class 6-8';
    }

    return { testScore: Math.round(testScore), finalMetric, level, classRange };
  };

  const finishOnboarding = () => {
    const { level, classRange, finalMetric } = calculateResult();

    const newMentor = {
      ...formData,
      id: Date.now(),
      level,
      classRange,
      skillScore: Math.round(finalMetric),
      onboarded: true,
      teachingCapacity: 5,
      assignedStudents: [],
      sessionsCompleted: 0
    };

    addMentor(newMentor);
    onComplete(newMentor);
  };

  const canProceed = () => {
    if (step === 1) return formData.name.trim() !== '' && formData.age !== '' && formData.education.trim() !== '';
    if (step === 2) return formData.subjects.length > 0;
    if (step === 3) return formData.subjects.every(s => formData.selfRating[s]);
    if (step === 4) return !formData.hasExperience || formData.experienceValue.trim() !== '';
    if (step === 5) {
      // Must answer all questions 
      let allAnswered = true;
      formData.subjects.forEach(sub => {
        const qs = mcqDatabase[sub] || [];
        qs.forEach(q => {
          if (formData.testAnswers[`${sub}-${q.id}`] === undefined) {
             allAnswered = false;
          }
        });
      });
      return allAnswered;
    }
    return true;
  };

  const stepTitles = [
    "Basic Information",
    "Subject Selection",
    "Self-Rating",
    "Teaching Experience",
    "Assessment Test",
    "Your Results!"
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center p-4 py-8">
      <div className="max-w-4xl w-full">
        <Card className="shadow-xl shadow-blue-900/5 border-0 bg-white rounded-3xl overflow-hidden">
          
          {/* Header & Progress Bar */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-gray-100 p-8 pb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Mentor Application</h1>
                <p className="text-gray-500 font-medium">Step {step} of 6: {stepTitles[step-1]}</p>
              </div>
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm border border-gray-100 font-bold text-xl">
                {step}/6
              </div>
            </div>
            {/* Progress line */}
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-600 rounded-full"
                initial={{ width: `${((step-1) / 6) * 100}%` }}
                animate={{ width: `${(step / 6) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="p-8 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* STEP 1: Basic Info */}
                {step === 1 && (
                  <div className="space-y-6 max-w-2xl">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Age</label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500"
                        placeholder="e.g. 24"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Highest Education Level</label>
                      <div className="relative">
                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={formData.education}
                          onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500"
                          placeholder="e.g. M.Sc Mathematics, B.Ed"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Subject Selection */}
                {step === 2 && (
                  <div className="space-y-8">
                    {subjectCategories.map((group, idx) => (
                      <div key={idx}>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">{group.category}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {group.subjects.map(subject => {
                            const isSelected = formData.subjects.includes(subject);
                            
                            let activeClassStr = 'border-gray-500 bg-gray-50';
                            let activeInputStr = 'text-gray-600 focus:ring-gray-500';
                            
                            if (group.color === 'blue') {
                                activeClassStr = 'border-blue-500 bg-blue-50';
                                activeInputStr = 'text-blue-600 focus:ring-blue-500';
                            } else if (group.color === 'purple') {
                                activeClassStr = 'border-purple-500 bg-purple-50';
                                activeInputStr = 'text-purple-600 focus:ring-purple-500';
                            } else if (group.color === 'emerald') {
                                activeClassStr = 'border-emerald-500 bg-emerald-50';
                                activeInputStr = 'text-emerald-600 focus:ring-emerald-500';
                            }

                            return (
                              <label
                                key={subject}
                                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                  isSelected 
                                    ? activeClassStr 
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleSubjectToggle(subject)}
                                  className={`w-5 h-5 rounded ${activeInputStr}`}
                                />
                                <span className={`font-semibold ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                                  {subject}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* STEP 3: Self Rating */}
                {step === 3 && (
                  <div className="space-y-6">
                    <p className="text-gray-500 mb-6">Rate your proficiency in the subjects you selected (1 = Beginner, 5 = Expert).</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      {formData.subjects.map(subject => (
                        <div key={subject} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <span className="font-bold text-gray-800 text-lg flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-500" />
                            {subject}
                          </span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => {
                              const active = (formData.selfRating[subject] || 0) >= star;
                              return (
                                <button
                                  key={star}
                                  onClick={() => handleRating(subject, star)}
                                  className="p-1 transition-all hover:scale-110"
                                >
                                  <Star className={`w-8 h-8 ${active ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm' : 'fill-gray-100 text-gray-300'}`} />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 4: Experience */}
                {step === 4 && (
                  <div className="space-y-8 max-w-2xl">
                    <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                      <label className="flex items-center gap-4 cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={formData.hasExperience}
                            onChange={(e) => setFormData({ ...formData, hasExperience: e.target.checked })}
                            className="sr-only"
                          />
                          <div className={`block w-14 h-8 rounded-full transition-colors ${formData.hasExperience ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                          <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.hasExperience ? 'translate-x-6' : ''}`}></div>
                        </div>
                        <span className="text-xl font-bold text-gray-800">Have you taught before?</span>
                      </label>
                    </div>

                    <AnimatePresence>
                      {formData.hasExperience && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 overflow-hidden"
                        >
                          <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Enter Total Experience</label>
                          <div className="relative">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="text"
                              value={formData.experienceValue}
                              onChange={(e) => setFormData({ ...formData, experienceValue: e.target.value })}
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 placeholder-gray-400"
                              placeholder="e.g. 2 years or 6 months"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* STEP 5: Assessment */}
                {step === 5 && (
                  <div className="space-y-10">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
                       <Award className="w-6 h-6 text-blue-600 shrink-0" />
                       <p className="text-blue-900 font-medium">Please answer these basic questions to complete your subject verification.</p>
                    </div>

                    {formData.subjects.map(subject => {
                      const questions = mcqDatabase[subject] || [];
                      return (
                        <div key={subject} className="space-y-6 pb-6 border-b border-gray-100 last:border-0">
                          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                             {subject}
                          </h3>
                          {questions.length === 0 && <p className="text-gray-500 italic">No assessment needed for this subject.</p>}
                          
                          {questions.map((q, idx) => (
                            <div key={q.id} className="bg-white border-2 border-gray-100 p-6 rounded-2xl shadow-sm">
                              <p className="font-bold text-lg text-gray-800 mb-4">{idx + 1}. {q.question}</p>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {q.options.map((opt, optIdx) => {
                                  const isSelected = formData.testAnswers[`${subject}-${q.id}`] === optIdx;
                                  return (
                                    <button
                                      key={optIdx}
                                      onClick={() => handleTestAnswer(subject, q.id, optIdx)}
                                      className={`p-3 text-left rounded-xl font-medium border-2 transition-all ${
                                        isSelected 
                                          ? 'border-blue-500 bg-blue-50 text-blue-800' 
                                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* STEP 6: Result Classification */}
                {step === 6 && (
                  <div className="py-8">
                    {(() => {
                      const result = calculateResult();
                      return (
                        <div className="max-w-xl mx-auto text-center space-y-6">
                          <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl ${
                              result.level === 'Advanced' ? 'bg-gradient-to-br from-emerald-400 to-green-600 shadow-green-500/30' :
                              result.level === 'Intermediate' ? 'bg-gradient-to-br from-blue-400 to-indigo-600 shadow-blue-500/30' :
                              'bg-gradient-to-br from-amber-400 to-orange-500 shadow-orange-500/30'
                            }`}
                          >
                            <Award className="w-12 h-12 text-white" />
                          </div>
                          
                          <h2 className="text-4xl font-extrabold text-gray-900">You are an <br/><span className={
                              result.level === 'Advanced' ? 'text-green-600' :
                              result.level === 'Intermediate' ? 'text-blue-600' : 'text-orange-500'
                            }>{result.level}</span> Mentor</h2>
                          
                          <p className="text-xl text-gray-600 mt-2">
                            Assessment Score: <span className="font-bold text-gray-900">{result.testScore}%</span>
                          </p>

                          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-left mt-8 space-y-4">
                            <div>
                              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Approved to Teach</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {formData.subjects.map(s => (
                                  <span key={s} className="px-3 py-1 bg-white border border-gray-200 rounded-lg font-semibold text-gray-700">{s}</span>
                                ))}
                              </div>
                            </div>
                            <div>
                               <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Recommended Range</p>
                               <span className="inline-block mt-1 text-lg font-bold text-gray-900">{result.classRange}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="p-6 px-8 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            {step > 1 && step < 6 ? (
              <button 
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-6 py-3 font-bold text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
            ) : <div></div>}

            {step < 5 && (
              <button
                disabled={!canProceed()}
                onClick={() => setStep(step + 1)}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
                  canProceed() 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {step === 5 && (
              <button
                disabled={!canProceed()}
                onClick={() => setStep(step + 1)}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
                  canProceed() 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Submit Assessment <CheckCircle2 className="w-5 h-5 mx-1" />
              </button>
            )}

            {step === 6 && (
               <button
                 onClick={finishOnboarding}
                 className="w-full sm:w-auto flex justify-center items-center gap-2 px-10 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/10 text-lg"
               >
                 Go to Dashboard <ChevronRight className="w-6 h-6" />
               </button>
            )}
          </div>

        </Card>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        /* Removing arrows from number input */
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}} />
    </div>
  );
};

export default MentorOnboarding;
