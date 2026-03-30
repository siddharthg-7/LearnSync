import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Mic, Brain, Plus, X } from 'lucide-react';
import { allocateMentor } from '../../utils/mentorAllocation';

const StudentOnboarding = ({ onComplete }) => {
  const { addStudent, appData, updateMentor } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    class: '',
    subjects: [],
    availability: [],
    skillAssessment: {},
    quizAnswers: {}
  });
  const [newSubject, setNewSubject] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [selectedSubjectForTopics, setSelectedSubjectForTopics] = useState('');

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const timeSlots = ['4PM', '5PM', '6PM', '7PM', '8PM'];

  // Dynamic quiz questions generator - 6 questions (2 easy, 2 medium, 2 hard)
  const generateQuizQuestions = (subject) => {
    return [
      // Easy questions (Q1-Q2)
      { 
        id: 1, 
        question: `What is your basic understanding of ${subject}?`, 
        options: ['Just starting', 'Know a little', 'Understand basics', 'Very comfortable'], 
        correct: 2, 
        level: 'easy',
        difficulty: 'Easy'
      },
      { 
        id: 2, 
        question: `Can you solve simple ${subject} problems?`, 
        options: ['No', 'With help', 'Yes, usually', 'Yes, easily'], 
        correct: 2, 
        level: 'easy',
        difficulty: 'Easy'
      },
      // Medium questions (Q3-Q4)
      { 
        id: 3, 
        question: `How well do you understand ${subject} concepts?`, 
        options: ['Not well', 'Somewhat', 'Well', 'Very well'], 
        correct: 2, 
        level: 'medium',
        difficulty: 'Medium'
      },
      { 
        id: 4, 
        question: `Can you apply ${subject} in different situations?`, 
        options: ['Rarely', 'Sometimes', 'Often', 'Always'], 
        correct: 2, 
        level: 'medium',
        difficulty: 'Medium'
      },
      // Hard questions (Q5-Q6)
      { 
        id: 5, 
        question: `Can you solve complex ${subject} problems independently?`, 
        options: ['No', 'With guidance', 'Yes, mostly', 'Yes, confidently'], 
        correct: 2, 
        level: 'hard',
        difficulty: 'Hard'
      },
      { 
        id: 6, 
        question: `Can you teach ${subject} concepts to others?`, 
        options: ['No', 'Basic concepts only', 'Most concepts', 'Yes, confidently'], 
        correct: 2, 
        level: 'hard',
        difficulty: 'Hard'
      }
    ];
  };

  const handleAddSubject = () => {
    if (newSubject.trim() && !formData.subjects.includes(newSubject.trim())) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()],
        skillAssessment: {
          ...prev.skillAssessment,
          [newSubject.trim()]: {}
        }
      }));
      setNewSubject('');
    }
  };

  const handleRemoveSubject = (subject) => {
    setFormData(prev => {
      const newSkillAssessment = { ...prev.skillAssessment };
      delete newSkillAssessment[subject];
      
      return {
        ...prev,
        subjects: prev.subjects.filter(s => s !== subject),
        skillAssessment: newSkillAssessment
      };
    });
  };

  const handleAddTopic = (subject) => {
    if (newTopic.trim()) {
      setFormData(prev => ({
        ...prev,
        skillAssessment: {
          ...prev.skillAssessment,
          [subject]: {
            ...prev.skillAssessment[subject],
            [newTopic.trim()]: 'okay'
          }
        }
      }));
      setNewTopic('');
      setSelectedSubjectForTopics('');
    }
  };

  const handleRemoveTopic = (subject, topic) => {
    setFormData(prev => {
      const newSubjectTopics = { ...prev.skillAssessment[subject] };
      delete newSubjectTopics[topic];
      
      return {
        ...prev,
        skillAssessment: {
          ...prev.skillAssessment,
          [subject]: newSubjectTopics
        }
      };
    });
  };

  const handleAvailabilityToggle = (day, time) => {
    const slot = `${day} ${time}`;
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(slot)
        ? prev.availability.filter(s => s !== slot)
        : [...prev.availability, slot]
    }));
  };

  const handleSkillAssessment = (subject, topic, level) => {
    setFormData(prev => ({
      ...prev,
      skillAssessment: {
        ...prev.skillAssessment,
        [subject]: {
          ...prev.skillAssessment[subject],
          [topic]: level
        }
      }
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

  const calculateLevel = () => {
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

    // Evaluation Logic: Score ≤ 2 → Beginner, Score ≤ 4 → Intermediate, Score ≥ 5 → Advanced
    const avgScore = totalQuestions > 0 ? totalScore / formData.subjects.length : 0;
    
    if (avgScore <= 2) return 'beginner';
    if (avgScore <= 4) return 'intermediate';
    return 'advanced';
  };

  const handleSubmit = () => {
    const weakTopics = {};
    const strongTopics = {};

    Object.entries(formData.skillAssessment).forEach(([subject, topics]) => {
      weakTopics[subject] = [];
      strongTopics[subject] = [];
      
      Object.entries(topics).forEach(([topic, level]) => {
        if (level === 'weak') weakTopics[subject].push(topic.toLowerCase());
        if (level === 'strong') strongTopics[subject].push(topic.toLowerCase());
      });
    });

    const ageMode = formData.age <= 10 ? 'foundation' : formData.age <= 15 ? 'growth' : 'mastery';
    const detectedLevel = calculateLevel();

    // Allocate mentor based on student profile
    const allocatedMentor = allocateMentor({
      ...formData,
      age: formData.age,
      detectedLevel,
      subjects: formData.subjects
    }, appData.mentors);

    const newStudent = {
      ...formData,
      level: ageMode,
      detectedLevel,
      weakTopics,
      strongTopics,
      mentorId: allocatedMentor?.id || null,
      progress: 0,
      xp: 0,
      level_number: 1,
      streak: 0,
      attendance: 100,
      completedTopics: [],
      onboarded: true
    };

    const studentId = Date.now();
    const studentWithId = { ...newStudent, id: studentId };

    // Update mentor's assigned students
    if (allocatedMentor) {
      updateMentor(allocatedMentor.id, {
        assignedStudents: [...allocatedMentor.assignedStudents, studentId]
      });
    }

    addStudent(studentWithId);
    onComplete(studentWithId);
  };

  const canProceed = () => {
    if (step === 1) return formData.name && formData.age && formData.class;
    if (step === 2) return formData.subjects.length > 0;
    if (step === 3) return formData.availability.length > 0;
    if (step === 4) {
      return formData.subjects.every(subject => 
        formData.skillAssessment[subject] && 
        Object.keys(formData.skillAssessment[subject]).length > 0
      );
    }
    if (step === 5) {
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
            <h2 className="text-2xl font-semibold text-gray-900">Welcome to LearnSync!</h2>
            <span className="text-gray-500">Step {step} of 5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Tell us about yourself</h3>
            <div>
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your age"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Class</label>
                <input
                  type="text"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 7th"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Dynamic Subjects */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">What subjects do you want to learn?</h3>
            <p className="text-gray-600 text-sm">Add any subjects you're studying</p>
            
            {/* Add Subject Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Mathematics, Science, English..."
              />
              <Button onClick={handleAddSubject}>
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            {/* Subject List */}
            <div className="space-y-2">
              {formData.subjects.map((subject) => (
                <div
                  key={subject}
                  className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl"
                >
                  <span className="font-medium text-blue-900">{subject}</span>
                  <button
                    onClick={() => handleRemoveSubject(subject)}
                    className="p-1 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
              ))}
            </div>

            {formData.subjects.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">
                Add at least one subject to continue
              </p>
            )}
          </div>
        )}

        {/* Step 3: Availability */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">When can you study?</h3>
            <p className="text-gray-600 text-sm">Select your available days and times</p>
            <div className="space-y-3">
              {days.map((day) => (
                <div key={day}>
                  <p className="text-gray-700 font-medium mb-2">{day}</p>
                  <div className="flex gap-2 flex-wrap">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleAvailabilityToggle(day, time)}
                        className={`px-4 py-2 rounded-xl border transition-all ${
                          formData.availability.includes(`${day} ${time}`)
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Dynamic Self Assessment */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Tell us about your skills</h3>
                <p className="text-gray-600 text-sm">Add topics for each subject and rate your level</p>
              </div>
              <button className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100">
                <Mic className="w-4 h-4" />
                <span className="text-sm">Voice Input</span>
              </button>
            </div>

            {formData.subjects.map((subject) => (
              <div key={subject} className="space-y-2 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-gray-900">{subject}</p>
                  {selectedSubjectForTopics !== subject && (
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedSubjectForTopics(subject)}
                      className="text-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Topic
                    </Button>
                  )}
                </div>

                {/* Add Topic Input */}
                {selectedSubjectForTopics === subject && (
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTopic(subject)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Algebra, Fractions, Grammar..."
                      autoFocus
                    />
                    <Button onClick={() => handleAddTopic(subject)} className="text-sm">
                      Add
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSelectedSubjectForTopics('');
                        setNewTopic('');
                      }}
                      className="text-sm"
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                {/* Topics List */}
                {Object.keys(formData.skillAssessment[subject] || {}).map((topic) => (
                  <div key={topic} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700">{topic}</span>
                      <button
                        onClick={() => handleRemoveTopic(subject, topic)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <X className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      {['weak', 'okay', 'strong'].map((level) => (
                        <button
                          key={level}
                          onClick={() => handleSkillAssessment(subject, topic, level)}
                          className={`px-3 py-1 rounded-lg text-sm transition-all ${
                            formData.skillAssessment[subject]?.[topic] === level
                              ? level === 'weak'
                                ? 'bg-red-500 text-white'
                                : level === 'okay'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          {level === 'weak' ? '😕' : level === 'okay' ? '😐' : '😊'}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {Object.keys(formData.skillAssessment[subject] || {}).length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-2">
                    Add topics for {subject}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step 5: Dynamic Mini Quiz */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Quick Assessment</h3>
                <p className="text-gray-600 text-sm">Help us understand your current level</p>
              </div>
            </div>
            
            {formData.subjects.map((subject) => (
              <div key={subject} className="space-y-4">
                <h4 className="font-semibold text-gray-900 text-lg">{subject}</h4>
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
          {step < 5 ? (
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

export default StudentOnboarding;
