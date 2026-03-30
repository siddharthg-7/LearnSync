// Mock data initialization
export const initializeMockData = () => {
  const mockStudents = [
    {
      id: 1,
      name: 'Aarav Kumar',
      age: 12,
      class: '7th',
      subjects: ['Math', 'Science', 'English'],
      availability: ['Mon 4PM', 'Wed 4PM', 'Fri 4PM'],
      level: 'growth',
      weakTopics: { Math: ['fractions', 'decimals'], Science: ['photosynthesis'] },
      strongTopics: { Math: ['addition'], English: ['grammar'] },
      mentorId: 1,
      progress: 65,
      xp: 450,
      level_number: 5,
      streak: 7,
      attendance: 85,
      completedTopics: ['addition', 'grammar'],
      onboarded: true
    },
    {
      id: 2,
      name: 'Priya Sharma',
      age: 9,
      class: '4th',
      subjects: ['Math', 'English'],
      availability: ['Tue 5PM', 'Thu 5PM'],
      level: 'foundation',
      weakTopics: { Math: ['subtraction'], English: ['reading'] },
      strongTopics: { Math: ['counting'] },
      mentorId: 2,
      progress: 45,
      xp: 280,
      level_number: 3,
      streak: 3,
      attendance: 70,
      completedTopics: ['counting'],
      onboarded: true
    },
    {
      id: 3,
      name: 'Rohan Patel',
      age: 16,
      class: '11th',
      subjects: ['Math', 'Science', 'English'],
      availability: ['Mon 6PM', 'Wed 6PM', 'Sat 10AM'],
      level: 'mastery',
      weakTopics: { Math: ['calculus'], Science: ['organic chemistry'] },
      strongTopics: { Math: ['algebra'], English: ['essay writing'] },
      mentorId: 1,
      progress: 78,
      xp: 890,
      level_number: 9,
      streak: 12,
      attendance: 92,
      completedTopics: ['algebra', 'essay writing', 'trigonometry'],
      onboarded: true
    }
  ];

  const mockMentors = [
    {
      id: 1,
      name: 'Dr. Anjali Verma',
      education: 'M.Sc Mathematics',
      subjects: ['Math', 'Science'],
      skillLevel: 'advanced',
      experience: 5,
      teachingExperience: true,
      ratings: { Math: 5, Science: 4 },
      availability: ['Mon 4PM', 'Wed 4PM', 'Fri 4PM', 'Sat 10AM'],
      assignedStudents: [1, 3],
      sessionsCompleted: 45,
      avgImprovement: 25,
      onboarded: true
    },
    {
      id: 2,
      name: 'Rahul Mehta',
      education: 'B.A English Literature',
      subjects: ['English', 'Math'],
      skillLevel: 'intermediate',
      experience: 2,
      teachingExperience: true,
      ratings: { English: 5, Math: 3 },
      availability: ['Tue 5PM', 'Thu 5PM', 'Sat 2PM'],
      assignedStudents: [2],
      sessionsCompleted: 28,
      avgImprovement: 18,
      onboarded: true
    }
  ];

  const mockCourses = [
    {
      id: 1,
      name: 'Mathematics',
      subject: 'Math',
      level: 'growth',
      createdBy: 1,
      chapters: [1, 2, 3]
    },
    {
      id: 2,
      name: 'English Grammar',
      subject: 'English',
      level: 'foundation',
      createdBy: 2,
      chapters: [4, 5]
    },
    {
      id: 3,
      name: 'Science Basics',
      subject: 'Science',
      level: 'growth',
      createdBy: 1,
      chapters: [6, 7]
    }
  ];

  const mockChapters = [
    { id: 1, courseId: 1, name: 'Fractions', topics: [1, 2, 3], order: 1 },
    { id: 2, courseId: 1, name: 'Decimals', topics: [4, 5], order: 2 },
    { id: 3, courseId: 1, name: 'Algebra Basics', topics: [6, 7], order: 3 },
    { id: 4, courseId: 2, name: 'Parts of Speech', topics: [8, 9], order: 1 },
    { id: 5, courseId: 2, name: 'Sentence Structure', topics: [10], order: 2 },
    { id: 6, courseId: 3, name: 'Photosynthesis', topics: [11, 12], order: 1 },
    { id: 7, courseId: 3, name: 'Human Body', topics: [13], order: 2 }
  ];

  const mockTopics = [
    {
      id: 1,
      chapterId: 1,
      name: 'Introduction to Fractions',
      content: 'A fraction represents a part of a whole. It has two parts: numerator (top) and denominator (bottom).',
      keyPoints: [
        'A fraction has two parts: numerator and denominator',
        'The numerator is the top number',
        'The denominator is the bottom number',
        'Fractions represent parts of a whole'
      ],
      examples: [
        'If you cut a pizza into 4 slices and eat 1, you ate 1/4 of the pizza',
        '1/2 means one part out of two equal parts',
        '3/4 means three parts out of four equal parts'
      ],
      summary: 'Fractions are a way to represent parts of a whole. Understanding numerator and denominator is key to working with fractions.',
      difficulty: 'basic',
      xpReward: 50,
      questions: [
        { id: 1, question: 'What is 1/2 + 1/2?', options: ['1', '1/4', '2/2', '0'], correct: 0 },
        { id: 2, question: 'Which fraction is larger: 1/2 or 1/4?', options: ['1/2', '1/4', 'Same', 'Cannot compare'], correct: 0 }
      ]
    },
    {
      id: 2,
      chapterId: 1,
      name: 'Adding Fractions',
      content: 'To add fractions with the same denominator, add the numerators and keep the denominator.',
      keyPoints: [
        'Only add numerators, keep denominator same',
        'Denominators must be equal',
        'Simplify the result if possible',
        'Check if the answer can be reduced'
      ],
      examples: [
        '1/4 + 2/4 = 3/4 (add 1+2, keep 4)',
        '2/5 + 1/5 = 3/5 (add 2+1, keep 5)',
        '1/8 + 3/8 = 4/8 = 1/2 (simplify)'
      ],
      summary: 'Adding fractions with the same denominator is simple: add the numerators and keep the denominator unchanged.',
      difficulty: 'basic',
      xpReward: 50,
      questions: [
        { id: 1, question: '1/4 + 2/4 = ?', options: ['3/4', '3/8', '1/2', '2/4'], correct: 0 },
        { id: 2, question: '2/5 + 1/5 = ?', options: ['3/10', '3/5', '2/5', '1/5'], correct: 1 }
      ]
    },
    {
      id: 3,
      chapterId: 1,
      name: 'Subtracting Fractions',
      content: 'To subtract fractions with the same denominator, subtract the numerators and keep the denominator.',
      keyPoints: [
        'Subtract numerators, keep denominator',
        'Denominators must be equal',
        'Result can be simplified',
        'Always check for simplification'
      ],
      examples: [
        '3/4 - 1/4 = 2/4 = 1/2',
        '4/5 - 2/5 = 2/5',
        '5/6 - 1/6 = 4/6 = 2/3'
      ],
      summary: 'Subtracting fractions follows the same rule as addition: work with numerators while keeping the denominator constant.',
      difficulty: 'intermediate',
      xpReward: 60,
      questions: [
        { id: 1, question: '3/4 - 1/4 = ?', options: ['2/4', '1/2', 'Both A and B', '3/4'], correct: 2 },
        { id: 2, question: '4/5 - 2/5 = ?', options: ['2/5', '2/10', '6/5', '1/5'], correct: 0 }
      ]
    }
  ];

  const mockSessions = [
    {
      id: 1,
      mentorId: 1,
      studentId: 1,
      topic: 'Fractions',
      date: '2026-03-25',
      score: 4,
      notes: 'Good progress, needs more practice',
      attendance: [{ studentId: 1, status: 'present' }]
    },
    {
      id: 2,
      mentorId: 2,
      studentId: 2,
      topic: 'Grammar Basics',
      date: '2026-03-26',
      score: 3,
      notes: 'Struggling with verbs',
      attendance: [{ studentId: 2, status: 'present' }]
    },
    {
      id: 3,
      mentorId: 1,
      studentId: 3,
      topic: 'Algebra',
      date: '2026-03-28',
      score: 5,
      notes: 'Excellent understanding',
      attendance: [{ studentId: 3, status: 'present' }]
    }
  ];

  const mockDoubts = [
    {
      id: 1,
      studentId: 1,
      studentName: 'Aarav Kumar',
      subject: 'Math',
      topic: 'Fractions',
      level: 'growth',
      question: 'How do I add fractions with different denominators?',
      date: '2026-03-29',
      status: 'open',
      replies: []
    },
    {
      id: 2,
      studentId: 2,
      studentName: 'Priya Sharma',
      subject: 'English',
      topic: 'Grammar',
      level: 'foundation',
      question: 'What is the difference between a noun and a verb?',
      date: '2026-03-28',
      status: 'resolved',
      replies: [
        {
          mentorId: 2,
          mentorName: 'Rahul Mehta',
          reply: 'A noun is a person, place, or thing. A verb is an action word.',
          date: '2026-03-28'
        }
      ]
    }
  ];

  const mockStudyPlans = [
    {
      id: 1,
      studentId: 1,
      date: '2026-03-30',
      tasks: [
        { id: 1, topic: 'Fractions', task: 'Revise adding fractions', completed: false, xp: 30 },
        { id: 2, topic: 'Fractions', task: 'Solve 5 practice questions', completed: false, xp: 50 },
        { id: 3, topic: 'Decimals', task: 'Read introduction', completed: false, xp: 20 }
      ]
    },
    {
      id: 2,
      studentId: 2,
      date: '2026-03-30',
      tasks: [
        { id: 1, topic: 'Grammar', task: 'Learn parts of speech', completed: false, xp: 40 },
        { id: 2, topic: 'Reading', task: 'Read short story', completed: false, xp: 30 }
      ]
    }
  ];

  const mockAnalytics = {
    totalStudents: 3,
    activeMentors: 2,
    avgProgress: 63,
    attendanceRate: 82,
    totalSessions: 45,
    avgImprovement: 22,
    activeCourses: 3,
    weakSubjects: [
      { subject: 'Math', percentage: 70 },
      { subject: 'Science', percentage: 40 }
    ],
    weeklyProgress: [
      { week: 'Week 1', progress: 45 },
      { week: 'Week 2', progress: 52 },
      { week: 'Week 3', progress: 58 },
      { week: 'Week 4', progress: 63 }
    ]
  };

  return {
    students: mockStudents,
    mentors: mockMentors,
    courses: mockCourses,
    chapters: mockChapters,
    topics: mockTopics,
    sessions: mockSessions,
    doubts: mockDoubts,
    studyPlans: mockStudyPlans,
    analytics: mockAnalytics,
    currentUser: null,
    currentRole: 'student'
  };
};
