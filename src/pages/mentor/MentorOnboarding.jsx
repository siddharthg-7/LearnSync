import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Brain, BookOpen, Award } from 'lucide-react';

const MentorOnboarding = ({ onComplete }) => {
  const { addMentor, appData } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    education: '',
    subjects: [],
    teachingCapacity: 5,
    experience: 0,
    achievements: '',
    quizAnswers: {}
  });

  const subjects = ['Math', 'Science', 'English', 'Physics', 'Chemistry', 'Biology', 'Social Studies'];

  // 8-Question Assessment Quiz
  const generateQuizQuestions = (subject) => {
    return [
      {
        id: 1,
        question: `How would you explain ${subject} concepts to beginners?`,
        options: ['Use simple examples', 'Start with theory', 'Use visual aids', 'All of the above'],
        correct: 3
      },
      {
        id: 2,
        question: `What is your approach to handling student doubts in ${subject}?`,
        options: ['Give direct answers', 'Guide them to find answers', 'Provide examples', 'Encourage peer learning'],
        correct: 1
      },
      {
        id: 3,
        question: `How do you assess student understanding in ${subject}?`,
        options: ['Only tests', 'Continuous observation', 'Projects', 'All methods'],
        correct: 3
      },
      {
        id: 4,
        question: `What teaching method works best for ${subject}?`,
        options: ['Lecture', 'Interactive', 'Practical', 'Mixed approach'],
        correct: 3
      },
      {
        id: 5,
        question: `How do you handle students struggling with ${subject}?`,
        options: ['Extra classes', 'Simplified content', 'One-on-one attention', 'All approaches'],
        correct: 3
      },
      {
        id: 6,
        question: `What resources do you use for teaching ${subject}?`,
        options: ['Textbooks only', 'Online resources', 'Real-world examples', 'Multiple resources'],
        correct: 3
      },
      {
        id: 7,
        question: `How do you keep students engaged in ${subject}?`,
        options: ['Stories', 'Games', 'Challenges', 'All methods'],
        correct: 3
      },
      {
        id: 8,
        question: `How do you measure your teaching effectiveness in ${subject}?`,
        options: ['Test scores', 'Student feedback', 'Progress tracking', 'All metrics'],
        correct: 3
      }
    ];
  };

  const handleSubjectToggle = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleQuizAnswer = (subject, questionId, answerIndex) => {
    setFormData(prev => ({
      ...prev,
      quizAnswers: {
        ...prev.quizAnswers,
        [subject]: {
          ...prev.quizAnswers[subject],
          [questionId]: answerIndex
        }
      }
    }));
  };

  const calculateSkillLevel = () => {
    let totalScore = 0;
    let totalQuestions = 0;

    formData.subjects.forEach(subject => {
      const questions = generateQuizQuestions(subject);
      const answers = formData.quizAnswers[subject] || {};
      
      questions.forEach(q => {
        if (answers[q.id] !== undefined) {
          totalQuestions++;
          if (answers[q.id] === q.correct) {
            totalScore++;
          }
        }
      });
    });

    const percentage = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;
    
    if (percentage >= 75) return 'advanced';
    if (percentage >= 50) return 'intermediate';
    return 'beginner';
  };

  const handleSubmit = () => {
    const skillLevel = calculateSkillLevel();
    
    // Calculate ratings per subject
    const ratings = {};
    formData.subjects.forEach(subject => {
      const questions = generateQuizQuestions(subject);
      const answers = formData.quizAnswers[subject] || {};
      const correctAnswers = questions.filter(q => answers[q.id] === q.correct).length;
      ratings[subject] = Math.round((correctAnswers / questions.length) * 5);
    });

    const newMentor = {
      ...formData,
      skillLevel,
      ratings,
      teachingExperience: formData.experience > 0,
      availability: [],
      assignedStudents: [],
      sessionsCompleted: 0,
      avgImprovement: 0,
      onboarded: true
    };

    const mentorId = Date.now();
    const mentorWithId = { ...newMentor, id: mentorId };

    addMentor(mentorWithId);
    onComplete(mentorWithId);
  };

  const canProceed = () => {
    if (step === 1) return formData.name && formData.education;
    if (step === 2) return formData.teachingCapacity > 0;
    if (step === 3) return formData.subjects.length > 0;
    if (step === 4) {
      return formData.subjects.every(subject => {
        const questions = generateQuizQuestions(subject);
        const answers = formData.quizAnswers[subject] || {};
        return questions.every(q => answers[q.id] !== undefined);
      });
    }
    return true;
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold text-gray-900">Mentor Onboarding</h2>
            <span className="text-gray-500">Step {step} of 4</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            <div>
              <label className="block text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Education</label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., M.Sc Mathematics, B.Ed"
              />
            </div>
          </div>
        )}

        {/* Step 2: Teaching Capacity & Experience */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Teaching Capacity</h3>
            <div>
              <label className="block text-gray-700 mb-2">
                How many students can you handle? {formData.teachingCapacity}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={formData.teachingCapacity}
                onChange={(e) => setFormData({ ...formData, teachingCapacity: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>1</span>
                <span>20</span>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Years of Teaching Experience</label>
              <input
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Achievements or Certifications (Optional)</label>
              <textarea
                value={formData.achievements}
                onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                placeholder="List any relevant achievements, certifications, or awards..."
              />
            </div>
          </div>
        )}

        {/* Step 3: Subject Selection */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Subjects You Can Teach</h3>
            <p className="text-gray-600 text-sm">Select all subjects you're comfortable teaching</p>
            <div className="grid grid-cols-2 gap-3">
              {subjects.map(subject => (
                <button
                  key={subject}
                  onClick={() => handleSubjectToggle(subject)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.subjects.includes(subject)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <BookOpen className={`w-5 h-5 mb-2 ${
                    formData.subjects.includes(subject) ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <p className={`font-medium ${
                    formData.subjects.includes(subject) ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {subject}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Skill Assessment Quiz */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Skill Assessment</h3>
                <p className="text-gray-600 text-sm">Answer questions to determine your teaching level</p>
              </div>
            </div>
            
            {formData.subjects.map((subject) => (
              <div key={subject} className="space-y-4">
                <h4 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  {subject}
                </h4>
                {generateQuizQuestions(subject).map((q, index) => (
                  <div key={q.id} className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-medium text-gray-900 mb-3">
                      {index + 1}. {q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((option, optIndex) => (
                        <label
                          key={optIndex}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            formData.quizAnswers[subject]?.[q.id] === optIndex
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`${subject}-${q.id}`}
                            checked={formData.quizAnswers[subject]?.[q.id] === optIndex}
                            onChange={() => handleQuizAnswer(subject, q.id, optIndex)}
                            className="w-4 h-4"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button 
              onClick={() => setStep(step + 1)} 
              className="ml-auto"
              disabled={!canProceed()}
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              className="ml-auto"
              disabled={!canProceed()}
            >
              Complete Setup
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MentorOnboarding;
