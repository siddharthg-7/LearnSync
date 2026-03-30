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
      completedTopics: [1, 2, 4, 5, 10, 11, 19, 20, 23, 24, 27],
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
      completedTopics: [1, 2, 3, 8, 10],
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
      completedTopics: [1, 2, 3, 4, 5, 6, 7, 10, 11, 19, 20, 21, 33, 34, 35, 37, 38, 45, 46, 47],
      onboarded: true
    }
  ];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: Canonical app-level students
// Used by: AppContext (appData.students), seedFirestore, LoginAuth demo cards
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_APP_STUDENTS = [
  {
    id: 'student_1',
    name: 'Priya',
    age: 9,
    class: '4th',
    level: 'foundation',
    role: 'student',
    onboarded: true,
    subjects: ['Math', 'English', 'Science'],
    availability: ['Tue 5PM', 'Thu 5PM'],
    progress: 45,
    xp: 280,
    level_number: 3,
    streak: 3,
    attendance: 70,
    completedTopics: ['counting'],
    weakTopics: { Math: ['subtraction', 'fractions'], English: ['reading'] },
    strongTopics: { Math: ['counting'] },
  },
  {
    id: 'student_2',
    name: 'Aarav',
    age: 12,
    class: '7th',
    level: 'growth',
    role: 'student',
    onboarded: true,
    subjects: ['Math', 'Science', 'English'],
    availability: ['Mon 4PM', 'Wed 4PM', 'Fri 4PM'],
    progress: 65,
    xp: 450,
    level_number: 5,
    streak: 7,
    attendance: 85,
    completedTopics: ['addition', 'grammar'],
    weakTopics: { Math: ['fractions', 'decimals'], Science: ['photosynthesis'] },
    strongTopics: { Math: ['addition'], English: ['grammar'] },
  },
  {
    id: 'student_3',
    name: 'Rohan',
    age: 16,
    class: '11th',
    level: 'mastery',
    role: 'student',
    onboarded: true,
    subjects: ['Math', 'Science', 'English'],
    availability: ['Mon 6PM', 'Wed 6PM', 'Sat 10AM'],
    progress: 78,
    xp: 890,
    level_number: 9,
    streak: 12,
    attendance: 92,
    completedTopics: ['algebra', 'essay writing', 'trigonometry'],
    weakTopics: { Math: ['calculus'], Science: ['organic chemistry'] },
    strongTopics: { Math: ['algebra'], English: ['essay writing'] },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: Canonical app-level mentors
// Used by: AppContext (appData.mentors), seedFirestore, LoginAuth demo cards
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_APP_MENTORS = [
  {
    id: 'mentor_1',
    name: 'Dr. Anjali',
    fullName: 'Dr. Anjali Verma',
    education: 'M.Sc Mathematics',
    subjects: ['Math', 'Science'],
    skillLevel: 'advanced',
    experience: 5,
    teachingExperience: true,
    ratings: { Math: 5, Science: 4 },
    availability: ['Mon 4PM', 'Wed 4PM', 'Fri 4PM', 'Sat 10AM'],
    assignedStudents: ['student_1', 'student_2', 'student_3'],
    sessionsCompleted: 45,
    avgImprovement: 25,
    teachingCapacity: 10,
    role: 'mentor',
    onboarded: true,
  },
  {
    id: 'mentor_2',
    name: 'Rahul Mehta',
    fullName: 'Rahul Mehta',
    education: 'B.A English Literature',
    subjects: ['English', 'Math'],
    skillLevel: 'intermediate',
    experience: 2,
    teachingExperience: true,
    ratings: { English: 5, Math: 3 },
    availability: ['Tue 5PM', 'Thu 5PM', 'Sat 2PM'],
    assignedStudents: [],
    sessionsCompleted: 28,
    avgImprovement: 18,
    teachingCapacity: 5,
    role: 'mentor',
    onboarded: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: Canonical app-level courses
// Used by: AppContext (appData.courses)
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_APP_COURSES = [
  { id: 'course_1', name: 'Mathematics Fundamentals', subject: 'Math', description: 'Core math concepts for foundation learners', level: 'foundation' },
  { id: 'course_2', name: 'Science Exploration', subject: 'Science', description: 'Discover the world through science', level: 'growth' },
  { id: 'course_3', name: 'English Mastery', subject: 'English', description: 'Advanced reading, writing and grammar', level: 'mastery' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: Canonical sessions, doubts, study plans
// IDs match MOCK_APP_STUDENTS and MOCK_APP_MENTORS
// Used by: AppContext (appData.sessions / doubts), seedFirestore
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_SESSIONS = [
  { id: 'session_1', mentorId: 'mentor_1', studentId: 'student_1', subject: 'Math', topic: 'Fractions', date: '2026-03-28', status: 'completed', score: 4, notes: 'Good progress, needs more practice' },
  { id: 'session_2', mentorId: 'mentor_1', studentId: 'student_2', subject: 'Science', topic: 'Photosynthesis', date: '2026-03-29', status: 'scheduled' },
  { id: 'session_3', mentorId: 'mentor_1', studentId: 'student_3', subject: 'Math', topic: 'Algebra', date: '2026-03-28', status: 'completed', score: 5, notes: 'Excellent understanding' },
];

export const MOCK_DOUBTS = [
  { id: 'doubt_1', studentId: 'student_1', studentName: 'Priya', subject: 'Math', topic: 'Fractions', level: 'foundation', question: 'How do I solve fraction addition?', status: 'open', replies: [], date: '2026-03-29', createdAt: '2026-03-29' },
  { id: 'doubt_2', studentId: 'student_2', studentName: 'Aarav', subject: 'Math', topic: 'Fractions', level: 'growth', question: 'How do I add fractions with different denominators?', status: 'open', replies: [], date: '2026-03-29', createdAt: '2026-03-29' },
];

export const MOCK_STUDY_PLANS = [
  {
    id: 'plan_1',
    studentId: 'student_1',
    date: '2026-03-30',
    tasks: [
      { id: 1, topic: 'Math', task: 'Revise adding fractions', completed: false, xp: 30 },
      { id: 2, topic: 'English', task: 'Read short story', completed: false, xp: 20 },
    ],
  },
  {
    id: 'plan_2',
    studentId: 'student_2',
    date: '2026-03-30',
    tasks: [
      { id: 1, topic: 'Math', task: 'Practice fractions with different denominators', completed: false, xp: 50 },
      { id: 2, topic: 'Science', task: 'Study photosynthesis diagram', completed: false, xp: 40 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5: Demo login cards
// Derives display info from MOCK_APP_STUDENTS / MOCK_APP_MENTORS so IDs and
// fields are always in sync. Add UI-only fields (emoji, color, email, password).
// Used by: LoginAuth.jsx
// ─────────────────────────────────────────────────────────────────────────────
const [priya, aarav, rohan] = MOCK_APP_STUDENTS;
const [drAnjali] = MOCK_APP_MENTORS;

export const DEMO_USERS = [
  {
    id: priya.id,
    name: priya.name,
    age: priya.age,
    class: priya.class,
    level: priya.level,
    subjects: priya.subjects,
    email: 'priya@demo.com',
    password: 'demo123',
    role: 'student',
    emoji: '🎨',
    color: 'from-pink-400 to-purple-400',
  },
  {
    id: aarav.id,
    name: aarav.name,
    age: aarav.age,
    class: aarav.class,
    level: aarav.level,
    subjects: aarav.subjects,
    email: 'aarav@demo.com',
    password: 'demo123',
    role: 'student',
    emoji: '🚀',
    color: 'from-blue-400 to-cyan-400',
  },
  {
    id: rohan.id,
    name: rohan.name,
    age: rohan.age,
    class: rohan.class,
    level: rohan.level,
    subjects: rohan.subjects,
    email: 'rohan@demo.com',
    password: 'demo123',
    role: 'student',
    emoji: '🎯',
    color: 'from-gray-700 to-gray-900',
  },
  {
    id: drAnjali.id,
    name: drAnjali.name,
    subjects: drAnjali.subjects,
    email: 'anjali@demo.com',
    password: 'demo123',
    role: 'mentor',
    emoji: '👩‍🏫',
    color: 'from-green-400 to-emerald-500',
  },
  {
    id: 'admin',
    name: 'Demo Admin',
    email: 'admin@demo.com',
    password: 'demo123',
    role: 'admin',
    emoji: '🛡️',
    color: 'from-purple-500 to-indigo-600',
    organization: 'LearnSync NGO',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6: Admin portal data
// A richer population visible only in admin views (AdminStudents, AdminMentors,
// AdminNotifications, Modules). Separate from the 3 demo login accounts above.
// Used by: AdminMentors, AdminStudents, AdminNotifications, Modules, MentorCourses
// ─────────────────────────────────────────────────────────────────────────────
export const mockMentors = [
  { id: 1, name: 'Priya Sharma',  subjects: ['Math', 'Science'],   studentsAssigned: 8,  sessionsCompleted: 24, avgImprovement: 18, effectivenessScore: 87, attendance: 92, status: 'active',          progress: 87 },
  { id: 2, name: 'Rahul Verma',   subjects: ['English', 'Math'],   studentsAssigned: 6,  sessionsCompleted: 18, avgImprovement: 12, effectivenessScore: 74, attendance: 85, status: 'active',          progress: 74 },
  { id: 3, name: 'Anita Desai',   subjects: ['Science'],           studentsAssigned: 5,  sessionsCompleted: 10, avgImprovement: 6,  effectivenessScore: 48, attendance: 70, status: 'low-performing', progress: 48 },
  { id: 4, name: 'Karan Mehta',   subjects: ['Math'],              studentsAssigned: 7,  sessionsCompleted: 20, avgImprovement: 15, effectivenessScore: 81, attendance: 90, status: 'active',          progress: 81 },
  { id: 5, name: 'Sneha Patil',   subjects: ['English'],           studentsAssigned: 4,  sessionsCompleted: 8,  avgImprovement: 4,  effectivenessScore: 42, attendance: 65, status: 'low-performing', progress: 42 },
  { id: 6, name: 'Amit Joshi',    subjects: ['Science', 'Math'],   studentsAssigned: 9,  sessionsCompleted: 28, avgImprovement: 20, effectivenessScore: 93, attendance: 96, status: 'active',          progress: 93 },
];

export const mockStudents = [
  { id: 1, name: 'Aarav Singh',     age: 13, class: '8th',  assignedMentor: 'Priya Sharma', subjects: ['Math', 'Science'],    overallProgress: 78, sessions: 12, attendance: 90, avgScore: 74, weakTopics: ['Fractions'],              status: 'active'  },
  { id: 2, name: 'Diya Patel',      age: 11, class: '6th',  assignedMentor: 'Rahul Verma',  subjects: ['English', 'Math'],    overallProgress: 55, sessions: 8,  attendance: 72, avgScore: 58, weakTopics: ['Grammar', 'Division'],    status: 'at-risk' },
  { id: 3, name: 'Rohan Gupta',     age: 15, class: '10th', assignedMentor: 'Amit Joshi',   subjects: ['Math', 'Science'],    overallProgress: 91, sessions: 18, attendance: 95, avgScore: 88, weakTopics: [],                         status: 'active'  },
  { id: 4, name: 'Meera Nair',      age: 10, class: '5th',  assignedMentor: 'Anita Desai',  subjects: ['Science'],            overallProgress: 42, sessions: 5,  attendance: 60, avgScore: 45, weakTopics: ['Plants', 'Animals'],      status: 'at-risk' },
  { id: 5, name: 'Arjun Rao',       age: 14, class: '9th',  assignedMentor: 'Karan Mehta',  subjects: ['Math'],               overallProgress: 83, sessions: 15, attendance: 88, avgScore: 80, weakTopics: ['Trigonometry'],           status: 'active'  },
  { id: 6, name: 'Priya Iyer',      age: 12, class: '7th',  assignedMentor: 'Sneha Patil',  subjects: ['English'],            overallProgress: 38, sessions: 4,  attendance: 55, avgScore: 40, weakTopics: ['Writing', 'Comprehension'], status: 'at-risk' },
  { id: 7, name: 'Kabir Malhotra',  age: 16, class: '11th', assignedMentor: 'Amit Joshi',   subjects: ['Math', 'Science'],    overallProgress: 88, sessions: 20, attendance: 93, avgScore: 85, weakTopics: [],                         status: 'active'  },
  { id: 8, name: 'Ananya Sharma',   age: 9,  class: '4th',  assignedMentor: 'Priya Sharma', subjects: ['Math', 'English'],    overallProgress: 65, sessions: 10, attendance: 80, avgScore: 62, weakTopics: ['Subtraction'],            status: 'active'  },
];

export const mockNGOCourses = [
  { id: 1, name: 'Mathematics Fundamentals',  subject: 'Math',    level: 'Beginner',     students: 18, mentors: 3, avgProgress: 72, modules: [{ id: 1, name: 'Fractions Basics.pdf',       type: 'pdf',  size: '1.2 MB', uploadedAt: '2026-03-10' }, { id: 2, name: 'Addition & Subtraction.docx', type: 'docx', size: '840 KB', uploadedAt: '2026-03-12' }] },
  { id: 2, name: 'English Grammar & Writing',  subject: 'English', level: 'Intermediate', students: 12, mentors: 2, avgProgress: 58, modules: [{ id: 1, name: 'Grammar Rules.pdf',           type: 'pdf',  size: '2.1 MB', uploadedAt: '2026-03-08' }] },
  { id: 3, name: 'Science Explorers',          subject: 'Science', level: 'Beginner',     students: 15, mentors: 2, avgProgress: 65, modules: [{ id: 1, name: 'Plants & Animals.pptx',       type: 'pptx', size: '3.4 MB', uploadedAt: '2026-03-15' }, { id: 2, name: 'Lab Notes.pdf',              type: 'pdf',  size: '980 KB', uploadedAt: '2026-03-18' }] },
  { id: 4, name: 'Advanced Mathematics',        subject: 'Math',    level: 'Advanced',     students: 9,  mentors: 2, avgProgress: 84, modules: [{ id: 1, name: 'Trigonometry.pdf',           type: 'pdf',  size: '1.8 MB', uploadedAt: '2026-03-20' }] },
];

export const mockNotifications = [
  { id: 1, type: 'student-flag',       status: 'unread', priority: 'high',   flaggedBy: 'Dr. Anjali',   student: 'Priya',         studentId: 'student_1', issue: 'Learning Difficulty', description: 'Priya is struggling with subtraction and fraction concepts despite repeated practice sessions. She gets frustrated easily and has started refusing to attempt Math problems. I believe she may need a different teaching approach or specialist assessment.', date: '2026-03-29' },
  { id: 2, type: 'student-flag',       status: 'unread', priority: 'high',   flaggedBy: 'Rahul Verma',  student: 'Diya Patel',    studentId: 2, issue: 'Attendance Concern',    description: 'Student has missed 4 consecutive sessions without explanation. Parents not responding to communication. Needs NGO intervention.', date: '2026-03-27' },
  { id: 3, type: 'student-flag',       status: 'read',   priority: 'medium', flaggedBy: 'Sneha Patil',  student: 'Priya Iyer',    studentId: 6, issue: 'Learning Difficulty',   description: 'Student is struggling significantly with comprehension. Despite multiple approaches, no improvement. May need a specialist evaluation.', date: '2026-03-25' },
  { id: 4, type: 'mentor-performance', status: 'unread', priority: 'high',   mentor: 'Sneha Patil',  mentorId: 5, description: 'Effectiveness score has dropped from 61% to 42% over the last 4 weeks. Student improvement rate is consistently below threshold. Immediate review recommended.', trend: 'decreasing', scoreHistory: [61, 55, 49, 42], date: '2026-03-29' },
  { id: 5, type: 'mentor-performance', status: 'read',   priority: 'medium', mentor: 'Anita Desai',  mentorId: 3, description: 'No improvement in effectiveness score for 3 consecutive weeks. Currently at 48%. Students assigned are showing stagnant progress.', trend: 'stagnant',    scoreHistory: [48, 47, 49, 48], date: '2026-03-22' },
];

export const mockStats = {
  totalStudents: 47,
  activeMentors: 6,
  sessionsThisWeek: 34,
  avgStudentScore: 68,
  attendanceRate: 82,
  highRiskStudents: 5,
  lowPerformingMentors: 3,
  decliningSubjects: 2,
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 7: Rich course/chapter/topic data
// Used by: seedFirestore (full DB seed), MentorCourses
// ─────────────────────────────────────────────────────────────────────────────
const _mockCourses = [
  { id: 1,  name: 'Mathematics - Primary',                    subject: 'Mathematics',          level: 'foundation', createdBy: 1, chapters: [1, 2, 3, 4] },
  { id: 2,  name: 'English Grammar - Primary',                subject: 'English',              level: 'foundation', createdBy: 2, chapters: [5, 6] },
  { id: 3,  name: 'Environmental Studies',                    subject: 'Environmental Studies (EVS)', level: 'foundation', createdBy: 1, chapters: [7, 8] },
  { id: 4,  name: 'Mathematics - Middle School',              subject: 'Mathematics',          level: 'growth',     createdBy: 1, chapters: [9, 10, 11] },
  { id: 5,  name: 'Science - Middle School',                  subject: 'Science',              level: 'growth',     createdBy: 1, chapters: [12, 13, 14] },
  { id: 6,  name: 'Social Studies',                           subject: 'Social Studies',       level: 'growth',     createdBy: 2, chapters: [15, 16] },
  { id: 7,  name: 'Physics - Secondary',                      subject: 'Science (Physics)',    level: 'mastery',    createdBy: 1, chapters: [17, 18] },
  { id: 8,  name: 'Chemistry - Secondary',                    subject: 'Science (Chemistry)', level: 'mastery',    createdBy: 1, chapters: [19, 20] },
  { id: 9,  name: 'Biology - Secondary',                      subject: 'Science (Biology)',   level: 'mastery',    createdBy: 1, chapters: [21, 22] },
  { id: 10, name: 'Mathematics - Secondary',                  subject: 'Mathematics',          level: 'mastery',    createdBy: 1, chapters: [23, 24] },
  { id: 11, name: 'Infosys Springboard - Spring Boot Fundamentals', subject: 'Computer Science', level: 'mastery', createdBy: 1, chapters: [25, 26, 27, 28] },
  { id: 12, name: 'Web Development Basics',                   subject: 'Computer Science',    level: 'mastery',    createdBy: 1, chapters: [29, 30] },
];

const _mockChapters = [
  { id: 1,  courseId: 1,  name: 'Numbers and Counting',              topics: [1, 2, 3],      order: 1 },
  { id: 2,  courseId: 1,  name: 'Addition and Subtraction',          topics: [4, 5],         order: 2 },
  { id: 3,  courseId: 1,  name: 'Multiplication and Division',       topics: [6, 7],         order: 3 },
  { id: 4,  courseId: 1,  name: 'Shapes and Patterns',               topics: [8, 9],         order: 4 },
  { id: 5,  courseId: 2,  name: 'Parts of Speech',                   topics: [10, 11, 12],   order: 1 },
  { id: 6,  courseId: 2,  name: 'Sentence Structure',                topics: [13, 14],       order: 2 },
  { id: 7,  courseId: 3,  name: 'Plants and Animals',                topics: [15, 16],       order: 1 },
  { id: 8,  courseId: 3,  name: 'Our Environment',                   topics: [17, 18],       order: 2 },
  { id: 9,  courseId: 4,  name: 'Fractions and Decimals',            topics: [1, 2, 3],      order: 1 },
  { id: 10, courseId: 4,  name: 'Algebra Basics',                    topics: [19, 20],       order: 2 },
  { id: 11, courseId: 4,  name: 'Geometry',                          topics: [21, 22],       order: 3 },
  { id: 12, courseId: 5,  name: 'Matter and Materials',              topics: [23, 24],       order: 1 },
  { id: 13, courseId: 5,  name: 'Living Organisms',                  topics: [25, 26],       order: 2 },
  { id: 14, courseId: 5,  name: 'Energy and Motion',                 topics: [27, 28],       order: 3 },
  { id: 15, courseId: 6,  name: 'History of India',                  topics: [29, 30],       order: 1 },
  { id: 16, courseId: 6,  name: 'Geography Basics',                  topics: [31, 32],       order: 2 },
  { id: 17, courseId: 7,  name: 'Motion and Force',                  topics: [33, 34],       order: 1 },
  { id: 18, courseId: 7,  name: 'Light and Electricity',             topics: [35, 36],       order: 2 },
  { id: 19, courseId: 8,  name: 'Chemical Reactions',                topics: [37, 38],       order: 1 },
  { id: 20, courseId: 8,  name: 'Acids, Bases and Salts',            topics: [39, 40],       order: 2 },
  { id: 21, courseId: 9,  name: 'Cell Structure',                    topics: [41, 42],       order: 1 },
  { id: 22, courseId: 9,  name: 'Human Body Systems',                topics: [43, 44],       order: 2 },
  { id: 23, courseId: 10, name: 'Quadratic Equations',               topics: [45, 46],       order: 1 },
  { id: 24, courseId: 10, name: 'Trigonometry',                      topics: [47, 48],       order: 2 },
  { id: 25, courseId: 11, name: 'Introduction to Spring Framework',  topics: [49, 50, 51],   order: 1 },
  { id: 26, courseId: 11, name: 'Spring Boot Basics',                topics: [52, 53, 54],   order: 2 },
  { id: 27, courseId: 11, name: 'REST APIs with Spring Boot',        topics: [55, 56, 57],   order: 3 },
  { id: 28, courseId: 11, name: 'Database Integration',              topics: [58, 59, 60],   order: 4 },
  { id: 29, courseId: 12, name: 'HTML & CSS Fundamentals',           topics: [61, 62, 63],   order: 1 },
  { id: 30, courseId: 12, name: 'JavaScript Basics',                 topics: [64, 65, 66],   order: 2 },
];

const _mockTopics = [
  {
    id: 1, chapterId: 1, name: 'Introduction to Fractions',
    content: 'A fraction represents a part of a whole. It has two parts: numerator (top) and denominator (bottom).',
    keyPoints: ['A fraction has two parts: numerator and denominator', 'The numerator is the top number', 'The denominator is the bottom number', 'Fractions represent parts of a whole'],
    examples: ['If you cut a pizza into 4 slices and eat 1, you ate 1/4 of the pizza', '1/2 means one part out of two equal parts', '3/4 means three parts out of four equal parts'],
    summary: 'Fractions are a way to represent parts of a whole. Understanding numerator and denominator is key to working with fractions.',
    difficulty: 'basic', xpReward: 50,
    questions: [
      { id: 1, question: 'What is 1/2 + 1/2?', options: ['1', '1/4', '2/2', '0'], correct: 0 },
      { id: 2, question: 'Which fraction is larger: 1/2 or 1/4?', options: ['1/2', '1/4', 'Same', 'Cannot compare'], correct: 0 },
    ],
  },
  {
    id: 2, chapterId: 1, name: 'Adding Fractions',
    content: 'To add fractions with the same denominator, add the numerators and keep the denominator.',
    keyPoints: ['Only add numerators, keep denominator same', 'Denominators must be equal', 'Simplify the result if possible', 'Check if the answer can be reduced'],
    examples: ['1/4 + 2/4 = 3/4 (add 1+2, keep 4)', '2/5 + 1/5 = 3/5 (add 2+1, keep 5)', '1/8 + 3/8 = 4/8 = 1/2 (simplify)'],
    summary: 'Adding fractions with the same denominator is simple: add the numerators and keep the denominator unchanged.',
    difficulty: 'basic', xpReward: 50,
    questions: [
      { id: 1, question: '1/4 + 2/4 = ?', options: ['3/4', '3/8', '1/2', '2/4'], correct: 0 },
      { id: 2, question: '2/5 + 1/5 = ?', options: ['3/10', '3/5', '2/5', '1/5'], correct: 1 },
    ],
  },
  {
    id: 3, chapterId: 1, name: 'Subtracting Fractions',
    content: 'To subtract fractions with the same denominator, subtract the numerators and keep the denominator.',
    keyPoints: ['Subtract numerators, keep denominator', 'Denominators must be equal', 'Result can be simplified', 'Always check for simplification'],
    examples: ['3/4 - 1/4 = 2/4 = 1/2', '4/5 - 2/5 = 2/5', '5/6 - 1/6 = 4/6 = 2/3'],
    summary: 'Subtracting fractions follows the same rule as addition: work with numerators while keeping the denominator constant.',
    difficulty: 'intermediate', xpReward: 60,
    questions: [
      { id: 1, question: '3/4 - 1/4 = ?', options: ['2/4', '1/2', 'Both A and B', '3/4'], correct: 2 },
      { id: 2, question: '4/5 - 2/5 = ?', options: ['2/5', '2/10', '6/5', '1/5'], correct: 0 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 8: initializeMockData() — for seedFirestore
// Uses canonical constants above so seeding stays in sync with app data.
// ─────────────────────────────────────────────────────────────────────────────
export const initializeMockData = () => ({
  students: MOCK_APP_STUDENTS,
  mentors: MOCK_APP_MENTORS,
  courses: _mockCourses,
  chapters: _mockChapters,
  topics: _mockTopics,
  sessions: MOCK_SESSIONS,
  doubts: MOCK_DOUBTS,
  studyPlans: MOCK_STUDY_PLANS,
  analytics: {
    totalStudents: MOCK_APP_STUDENTS.length,
    activeMentors: MOCK_APP_MENTORS.length,
    avgProgress: Math.round(MOCK_APP_STUDENTS.reduce((s, st) => s + st.progress, 0) / MOCK_APP_STUDENTS.length),
    attendanceRate: Math.round(MOCK_APP_STUDENTS.reduce((s, st) => s + st.attendance, 0) / MOCK_APP_STUDENTS.length),
    totalSessions: MOCK_SESSIONS.length,
    avgImprovement: Math.round(MOCK_APP_MENTORS.reduce((s, m) => s + m.avgImprovement, 0) / MOCK_APP_MENTORS.length),
    activeCourses: _mockCourses.length,
    weakSubjects: [
      { subject: 'Math', percentage: 70 },
      { subject: 'Science', percentage: 40 },
    ],
    weeklyProgress: [
      { week: 'Week 1', progress: 45 },
      { week: 'Week 2', progress: 52 },
      { week: 'Week 3', progress: 58 },
      { week: 'Week 4', progress: 63 },
    ],
  },
  currentUser: null,
  currentRole: 'student',
});
