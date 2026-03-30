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
    // Primary School (Classes 1-5)
    {
      id: 1,
      name: 'Mathematics - Primary',
      subject: 'Mathematics',
      level: 'foundation',
      createdBy: 1,
      chapters: [1, 2, 3, 4]
    },
    {
      id: 2,
      name: 'English Grammar - Primary',
      subject: 'English',
      level: 'foundation',
      createdBy: 2,
      chapters: [5, 6]
    },
    {
      id: 3,
      name: 'Environmental Studies',
      subject: 'Environmental Studies (EVS)',
      level: 'foundation',
      createdBy: 1,
      chapters: [7, 8]
    },
    // Middle School (Classes 6-8)
    {
      id: 4,
      name: 'Mathematics - Middle School',
      subject: 'Mathematics',
      level: 'growth',
      createdBy: 1,
      chapters: [9, 10, 11]
    },
    {
      id: 5,
      name: 'Science - Middle School',
      subject: 'Science',
      level: 'growth',
      createdBy: 1,
      chapters: [12, 13, 14]
    },
    {
      id: 6,
      name: 'Social Studies',
      subject: 'Social Studies',
      level: 'growth',
      createdBy: 2,
      chapters: [15, 16]
    },
    // Secondary School (Classes 9-10)
    {
      id: 7,
      name: 'Physics - Secondary',
      subject: 'Science (Physics)',
      level: 'mastery',
      createdBy: 1,
      chapters: [17, 18]
    },
    {
      id: 8,
      name: 'Chemistry - Secondary',
      subject: 'Science (Chemistry)',
      level: 'mastery',
      createdBy: 1,
      chapters: [19, 20]
    },
    {
      id: 9,
      name: 'Biology - Secondary',
      subject: 'Science (Biology)',
      level: 'mastery',
      createdBy: 1,
      chapters: [21, 22]
    },
    {
      id: 10,
      name: 'Mathematics - Secondary',
      subject: 'Mathematics',
      level: 'mastery',
      createdBy: 1,
      chapters: [23, 24]
    }
  ];

  const mockChapters = [
    // Mathematics - Primary (Course 1)
    { id: 1, courseId: 1, name: 'Numbers and Counting', topics: [1, 2, 3], order: 1 },
    { id: 2, courseId: 1, name: 'Addition and Subtraction', topics: [4, 5], order: 2 },
    { id: 3, courseId: 1, name: 'Multiplication and Division', topics: [6, 7], order: 3 },
    { id: 4, courseId: 1, name: 'Shapes and Patterns', topics: [8, 9], order: 4 },
    
    // English - Primary (Course 2)
    { id: 5, courseId: 2, name: 'Parts of Speech', topics: [10, 11, 12], order: 1 },
    { id: 6, courseId: 2, name: 'Sentence Structure', topics: [13, 14], order: 2 },
    
    // EVS (Course 3)
    { id: 7, courseId: 3, name: 'Plants and Animals', topics: [15, 16], order: 1 },
    { id: 8, courseId: 3, name: 'Our Environment', topics: [17, 18], order: 2 },
    
    // Mathematics - Middle School (Course 4)
    { id: 9, courseId: 4, name: 'Fractions and Decimals', topics: [1, 2, 3], order: 1 },
    { id: 10, courseId: 4, name: 'Algebra Basics', topics: [19, 20], order: 2 },
    { id: 11, courseId: 4, name: 'Geometry', topics: [21, 22], order: 3 },
    
    // Science - Middle School (Course 5)
    { id: 12, courseId: 5, name: 'Matter and Materials', topics: [23, 24], order: 1 },
    { id: 13, courseId: 5, name: 'Living Organisms', topics: [25, 26], order: 2 },
    { id: 14, courseId: 5, name: 'Energy and Motion', topics: [27, 28], order: 3 },
    
    // Social Studies (Course 6)
    { id: 15, courseId: 6, name: 'History of India', topics: [29, 30], order: 1 },
    { id: 16, courseId: 6, name: 'Geography Basics', topics: [31, 32], order: 2 },
    
    // Physics - Secondary (Course 7)
    { id: 17, courseId: 7, name: 'Motion and Force', topics: [33, 34], order: 1 },
    { id: 18, courseId: 7, name: 'Light and Electricity', topics: [35, 36], order: 2 },
    
    // Chemistry - Secondary (Course 8)
    { id: 19, courseId: 8, name: 'Chemical Reactions', topics: [37, 38], order: 1 },
    { id: 20, courseId: 8, name: 'Acids, Bases and Salts', topics: [39, 40], order: 2 },
    
    // Biology - Secondary (Course 9)
    { id: 21, courseId: 9, name: 'Cell Structure', topics: [41, 42], order: 1 },
    { id: 22, courseId: 9, name: 'Human Body Systems', topics: [43, 44], order: 2 },
    
    // Mathematics - Secondary (Course 10)
    { id: 23, courseId: 10, name: 'Quadratic Equations', topics: [45, 46], order: 1 },
    { id: 24, courseId: 10, name: 'Trigonometry', topics: [47, 48], order: 2 }
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

// ── NGO admin mock data (used by admin pages) ─────────────────────────────────

export const mockMentors = [
  { id: 1, name: 'Priya Sharma', subjects: ['Math', 'Science'], studentsAssigned: 8, sessionsCompleted: 24, avgImprovement: 18, effectivenessScore: 87, attendance: 92, status: 'active', progress: 87 },
  { id: 2, name: 'Rahul Verma', subjects: ['English', 'Math'], studentsAssigned: 6, sessionsCompleted: 18, avgImprovement: 12, effectivenessScore: 74, attendance: 85, status: 'active', progress: 74 },
  { id: 3, name: 'Anita Desai', subjects: ['Science'], studentsAssigned: 5, sessionsCompleted: 10, avgImprovement: 6, effectivenessScore: 48, attendance: 70, status: 'low-performing', progress: 48 },
  { id: 4, name: 'Karan Mehta', subjects: ['Math'], studentsAssigned: 7, sessionsCompleted: 20, avgImprovement: 15, effectivenessScore: 81, attendance: 90, status: 'active', progress: 81 },
  { id: 5, name: 'Sneha Patil', subjects: ['English'], studentsAssigned: 4, sessionsCompleted: 8, avgImprovement: 4, effectivenessScore: 42, attendance: 65, status: 'low-performing', progress: 42 },
  { id: 6, name: 'Amit Joshi', subjects: ['Science', 'Math'], studentsAssigned: 9, sessionsCompleted: 28, avgImprovement: 20, effectivenessScore: 93, attendance: 96, status: 'active', progress: 93 },
]

export const mockStudents = [
  { id: 1, name: 'Aarav Singh', age: 13, class: '8th', assignedMentor: 'Priya Sharma', subjects: ['Math', 'Science'], overallProgress: 78, sessions: 12, attendance: 90, avgScore: 74, weakTopics: ['Fractions'], status: 'active' },
  { id: 2, name: 'Diya Patel', age: 11, class: '6th', assignedMentor: 'Rahul Verma', subjects: ['English', 'Math'], overallProgress: 55, sessions: 8, attendance: 72, avgScore: 58, weakTopics: ['Grammar', 'Division'], status: 'at-risk' },
  { id: 3, name: 'Rohan Gupta', age: 15, class: '10th', assignedMentor: 'Amit Joshi', subjects: ['Math', 'Science'], overallProgress: 91, sessions: 18, attendance: 95, avgScore: 88, weakTopics: [], status: 'active' },
  { id: 4, name: 'Meera Nair', age: 10, class: '5th', assignedMentor: 'Anita Desai', subjects: ['Science'], overallProgress: 42, sessions: 5, attendance: 60, avgScore: 45, weakTopics: ['Plants', 'Animals'], status: 'at-risk' },
  { id: 5, name: 'Arjun Rao', age: 14, class: '9th', assignedMentor: 'Karan Mehta', subjects: ['Math'], overallProgress: 83, sessions: 15, attendance: 88, avgScore: 80, weakTopics: ['Trigonometry'], status: 'active' },
  { id: 6, name: 'Priya Iyer', age: 12, class: '7th', assignedMentor: 'Sneha Patil', subjects: ['English'], overallProgress: 38, sessions: 4, attendance: 55, avgScore: 40, weakTopics: ['Writing', 'Comprehension'], status: 'at-risk' },
  { id: 7, name: 'Kabir Malhotra', age: 16, class: '11th', assignedMentor: 'Amit Joshi', subjects: ['Math', 'Science'], overallProgress: 88, sessions: 20, attendance: 93, avgScore: 85, weakTopics: [], status: 'active' },
  { id: 8, name: 'Ananya Sharma', age: 9, class: '4th', assignedMentor: 'Priya Sharma', subjects: ['Math', 'English'], overallProgress: 65, sessions: 10, attendance: 80, avgScore: 62, weakTopics: ['Subtraction'], status: 'active' },
]

export const mockNGOCourses = [
  { id: 1, name: 'Mathematics Fundamentals', subject: 'Math', level: 'Beginner', students: 18, mentors: 3, avgProgress: 72, modules: [{ id: 1, name: 'Fractions Basics.pdf', type: 'pdf', size: '1.2 MB', uploadedAt: '2026-03-10' }, { id: 2, name: 'Addition & Subtraction.docx', type: 'docx', size: '840 KB', uploadedAt: '2026-03-12' }] },
  { id: 2, name: 'English Grammar & Writing', subject: 'English', level: 'Intermediate', students: 12, mentors: 2, avgProgress: 58, modules: [{ id: 1, name: 'Grammar Rules.pdf', type: 'pdf', size: '2.1 MB', uploadedAt: '2026-03-08' }] },
  { id: 3, name: 'Science Explorers', subject: 'Science', level: 'Beginner', students: 15, mentors: 2, avgProgress: 65, modules: [{ id: 1, name: 'Plants & Animals.pptx', type: 'pptx', size: '3.4 MB', uploadedAt: '2026-03-15' }, { id: 2, name: 'Lab Notes.pdf', type: 'pdf', size: '980 KB', uploadedAt: '2026-03-18' }] },
  { id: 4, name: 'Advanced Mathematics', subject: 'Math', level: 'Advanced', students: 9, mentors: 2, avgProgress: 84, modules: [{ id: 1, name: 'Trigonometry.pdf', type: 'pdf', size: '1.8 MB', uploadedAt: '2026-03-20' }] },
]

export const mockNotifications = [
  { id: 1, type: 'student-flag', status: 'unread', priority: 'high', flaggedBy: 'Priya Sharma', student: 'Ananya Sharma', studentId: 8, issue: 'Personal Issues', description: 'Student has been emotionally withdrawn for the past 2 weeks. Mentioned family problems affecting her ability to focus. Requires counselling support beyond my capacity.', date: '2026-03-28' },
  { id: 2, type: 'student-flag', status: 'unread', priority: 'high', flaggedBy: 'Rahul Verma', student: 'Diya Patel', studentId: 2, issue: 'Attendance Concern', description: 'Student has missed 4 consecutive sessions without explanation. Parents not responding to communication. Needs NGO intervention.', date: '2026-03-27' },
  { id: 3, type: 'student-flag', status: 'read', priority: 'medium', flaggedBy: 'Sneha Patil', student: 'Priya Iyer', studentId: 6, issue: 'Learning Difficulty', description: 'Student is struggling significantly with comprehension. Despite multiple approaches, no improvement. May need a specialist evaluation.', date: '2026-03-25' },
  { id: 4, type: 'mentor-performance', status: 'unread', priority: 'high', mentor: 'Sneha Patil', mentorId: 5, description: 'Effectiveness score has dropped from 61% to 42% over the last 4 weeks. Student improvement rate is consistently below threshold. Immediate review recommended.', trend: 'decreasing', scoreHistory: [61, 55, 49, 42], date: '2026-03-29' },
  { id: 5, type: 'mentor-performance', status: 'read', priority: 'medium', mentor: 'Anita Desai', mentorId: 3, description: 'No improvement in effectiveness score for 3 consecutive weeks. Currently at 48%. Students assigned are showing stagnant progress.', trend: 'stagnant', scoreHistory: [48, 47, 49, 48], date: '2026-03-22' },
]

export const mockStats = {
  totalStudents: 47, activeMentors: 6, sessionsThisWeek: 34,
  avgStudentScore: 68, attendanceRate: 82, highRiskStudents: 5,
  lowPerformingMentors: 3, decliningSubjects: 2,
}
