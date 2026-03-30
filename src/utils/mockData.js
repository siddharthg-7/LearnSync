// Mock data initialization
export const initializeMockData = () => {

  /* ── Students ── */
  const mockStudents = [
    { id: 1, name: 'Aarav Kumar', age: 12, class: '7th', subjects: ['Math', 'Science', 'English'], availability: ['Mon 4PM', 'Wed 4PM', 'Fri 4PM'], level: 'growth', weakTopics: { Math: ['fractions', 'decimals'], Science: ['photosynthesis'] }, strongTopics: { Math: ['addition'], English: ['grammar'] }, mentorId: 1, progress: 65, xp: 450, level_number: 5, streak: 7, attendance: 85, completedTopics: ['addition', 'grammar'], onboarded: true },
    { id: 2, name: 'Priya Sharma', age: 9, class: '4th', subjects: ['Math', 'English'], availability: ['Tue 5PM', 'Thu 5PM'], level: 'foundation', weakTopics: { Math: ['subtraction'], English: ['reading'] }, strongTopics: { Math: ['counting'] }, mentorId: 2, progress: 45, xp: 280, level_number: 3, streak: 3, attendance: 70, completedTopics: ['counting'], onboarded: true },
    { id: 3, name: 'Rohan Patel', age: 16, class: '11th', subjects: ['Math', 'Science', 'English'], availability: ['Mon 6PM', 'Wed 6PM', 'Sat 10AM'], level: 'mastery', weakTopics: { Math: ['calculus'], Science: ['organic chemistry'] }, strongTopics: { Math: ['algebra'], English: ['essay writing'] }, mentorId: 1, progress: 78, xp: 890, level_number: 9, streak: 12, attendance: 92, completedTopics: ['algebra', 'essay writing', 'trigonometry'], onboarded: true },
  ];

  /* ── Mentors ── */
  const mockMentors = [
    { id: 1, name: 'Dr. Anjali Verma', education: 'M.Sc Mathematics', subjects: ['Math', 'Science'], skillLevel: 'advanced', experience: 5, teachingExperience: true, ratings: { Math: 5, Science: 4 }, availability: ['Mon 4PM', 'Wed 4PM', 'Fri 4PM', 'Sat 10AM'], assignedStudents: [1, 3], sessionsCompleted: 45, avgImprovement: 25, onboarded: true },
    { id: 2, name: 'Rahul Mehta', education: 'B.A English Literature', subjects: ['English', 'Math'], skillLevel: 'intermediate', experience: 2, teachingExperience: true, ratings: { English: 5, Math: 3 }, availability: ['Tue 5PM', 'Thu 5PM', 'Sat 2PM'], assignedStudents: [2], sessionsCompleted: 28, avgImprovement: 18, onboarded: true },
  ];

  /* ── Courses ── */
  const mockCourses = [
    { id: 1, name: 'Mathematics - Primary', subject: 'Mathematics', level: 'foundation', createdBy: 1, chapters: [1, 2, 3, 4] },
    { id: 2, name: 'English Grammar - Primary', subject: 'English', level: 'foundation', createdBy: 2, chapters: [5, 6] },
    { id: 3, name: 'Environmental Studies', subject: 'Environmental Studies (EVS)', level: 'foundation', createdBy: 1, chapters: [7, 8] },
    { id: 4, name: 'Mathematics - Middle School', subject: 'Mathematics', level: 'growth', createdBy: 1, chapters: [9, 10, 11] },
    { id: 5, name: 'Science - Middle School', subject: 'Science', level: 'growth', createdBy: 1, chapters: [12, 13, 14] },
    { id: 6, name: 'Social Studies', subject: 'Social Studies', level: 'growth', createdBy: 2, chapters: [15, 16] },
    { id: 7, name: 'Physics - Secondary', subject: 'Science (Physics)', level: 'mastery', createdBy: 1, chapters: [17, 18] },
    { id: 8, name: 'Chemistry - Secondary', subject: 'Science (Chemistry)', level: 'mastery', createdBy: 1, chapters: [19, 20] },
    { id: 9, name: 'Biology - Secondary', subject: 'Science (Biology)', level: 'mastery', createdBy: 1, chapters: [21, 22] },
    { id: 10, name: 'Mathematics - Secondary', subject: 'Mathematics', level: 'mastery', createdBy: 1, chapters: [23, 24] },
  ];

  /* ── Chapters ── */
  const mockChapters = [
    { id: 1, courseId: 1, name: 'Numbers and Counting', topics: [1, 2, 3], order: 1 },
    { id: 2, courseId: 1, name: 'Addition and Subtraction', topics: [4, 5], order: 2 },
    { id: 3, courseId: 1, name: 'Multiplication and Division', topics: [6, 7], order: 3 },
    { id: 4, courseId: 1, name: 'Shapes and Patterns', topics: [8, 9], order: 4 },
    { id: 5, courseId: 2, name: 'Parts of Speech', topics: [10, 11, 12], order: 1 },
    { id: 6, courseId: 2, name: 'Sentence Structure', topics: [13, 14], order: 2 },
    { id: 7, courseId: 3, name: 'Plants and Animals', topics: [15, 16], order: 1 },
    { id: 8, courseId: 3, name: 'Our Environment', topics: [17, 18], order: 2 },
    { id: 9, courseId: 4, name: 'Fractions and Decimals', topics: [1, 2, 3], order: 1 },
    { id: 10, courseId: 4, name: 'Algebra Basics', topics: [19, 20], order: 2 },
    { id: 11, courseId: 4, name: 'Geometry', topics: [21, 22], order: 3 },
    { id: 12, courseId: 5, name: 'Matter and Materials', topics: [23, 24], order: 1 },
    { id: 13, courseId: 5, name: 'Living Organisms', topics: [25, 26], order: 2 },
    { id: 14, courseId: 5, name: 'Energy and Motion', topics: [27, 28], order: 3 },
    { id: 15, courseId: 6, name: 'History of India', topics: [29, 30], order: 1 },
    { id: 16, courseId: 6, name: 'Geography Basics', topics: [31, 32], order: 2 },
    { id: 17, courseId: 7, name: 'Motion and Force', topics: [33, 34], order: 1 },
    { id: 18, courseId: 7, name: 'Light and Electricity', topics: [35, 36], order: 2 },
    { id: 19, courseId: 8, name: 'Chemical Reactions', topics: [37, 38], order: 1 },
    { id: 20, courseId: 8, name: 'Acids, Bases and Salts', topics: [39, 40], order: 2 },
    { id: 21, courseId: 9, name: 'Cell Structure', topics: [41, 42], order: 1 },
    { id: 22, courseId: 9, name: 'Human Body Systems', topics: [43, 44], order: 2 },
    { id: 23, courseId: 10, name: 'Quadratic Equations', topics: [45, 46], order: 1 },
    { id: 24, courseId: 10, name: 'Trigonometry', topics: [47, 48], order: 2 },
  ];

  /* ── Topics (ids 1–48, full content) ── */
  const mockTopics = [
    // ── FRACTIONS (ids 1-3, reused by chapters 1 & 9) ──
    {
      id: 1, chapterId: 1, name: 'Introduction to Fractions',
      content: 'A fraction represents a part of a whole. It is written as numerator/denominator. The numerator (top number) tells how many parts we have. The denominator (bottom number) tells how many equal parts the whole is divided into.',
      keyPoints: ['Numerator = top number (parts we have)', 'Denominator = bottom number (total equal parts)', '1/2 means 1 out of 2 equal parts', 'Fractions can be proper (1/2), improper (5/3), or mixed (1½)'],
      examples: ['Pizza cut into 4 slices — eating 1 slice = 1/4', 'A day has 24 hours — 6 hours = 6/24 = 1/4 of the day', 'Shading 3 out of 5 boxes = 3/5'],
      summary: 'Fractions describe parts of a whole using two numbers separated by a line. Master numerator and denominator first.',
      difficulty: 'basic', xpReward: 50,
      questions: [
        { id: 1, question: 'In the fraction 3/7, what is the denominator?', options: ['3', '7', '10', '4'], correct: 1 },
        { id: 2, question: 'Which fraction means "half"?', options: ['1/4', '2/3', '1/2', '3/4'], correct: 2 },
      ]
    },
    {
      id: 2, chapterId: 1, name: 'Adding Fractions',
      content: 'To add fractions with the same denominator, simply add the numerators and keep the denominator. For different denominators, first find the Least Common Denominator (LCD), convert both fractions, then add.',
      keyPoints: ['Same denominator: add numerators only', 'Different denominators: find LCD first', 'Always simplify the result', '1/4 + 2/4 = 3/4 (same denominator)'],
      examples: ['1/5 + 2/5 = 3/5', '1/3 + 1/6 → LCD=6 → 2/6 + 1/6 = 3/6 = 1/2', '3/8 + 1/8 = 4/8 = 1/2'],
      summary: 'Adding fractions is easy when denominators match. When they differ, convert to a common denominator first.',
      difficulty: 'basic', xpReward: 50,
      questions: [
        { id: 1, question: '1/4 + 2/4 = ?', options: ['3/4', '3/8', '1/2', '2/4'], correct: 0 },
        { id: 2, question: '1/3 + 1/3 = ?', options: ['2/6', '1/3', '2/3', '1/6'], correct: 2 },
      ]
    },
    {
      id: 3, chapterId: 1, name: 'Subtracting Fractions',
      content: 'Subtracting fractions follows the same rules as addition. With the same denominator, subtract the numerators. With different denominators, find the LCD first, then subtract.',
      keyPoints: ['Same denominator: subtract numerators', 'Different denominators: find LCD first', 'Result may need simplification', 'You cannot subtract a larger fraction from a smaller one without borrowing'],
      examples: ['3/4 - 1/4 = 2/4 = 1/2', '5/6 - 1/3 → 5/6 - 2/6 = 3/6 = 1/2', '7/8 - 3/8 = 4/8 = 1/2'],
      summary: 'Subtraction of fractions mirrors addition — match denominators, then operate on numerators.',
      difficulty: 'intermediate', xpReward: 60,
      questions: [
        { id: 1, question: '3/5 - 1/5 = ?', options: ['2/5', '4/5', '2/10', '1/5'], correct: 0 },
        { id: 2, question: '3/4 - 1/2 = ?', options: ['1/4', '2/4', '1/2', '3/8'], correct: 0 },
      ]
    },
    // ── ADDITION & SUBTRACTION (ids 4-5) ──
    {
      id: 4, chapterId: 2, name: 'Addition of Numbers',
      content: 'Addition is combining two or more numbers to get a total called the sum. We add from right to left, carrying over when a column exceeds 9.',
      keyPoints: ['Sum = result of addition', 'Carry over when digits exceed 9', 'Order does not matter: 3+5 = 5+3 (commutative)', 'Adding 0 to any number gives the same number'],
      examples: ['23 + 14 = 37', '58 + 47 = 105 (carry the 1)', '100 + 250 = 350'],
      summary: 'Addition combines numbers into a sum. Always add right to left and carry when needed.',
      difficulty: 'basic', xpReward: 40,
      questions: [
        { id: 1, question: '45 + 38 = ?', options: ['73', '83', '93', '63'], correct: 1 },
        { id: 2, question: 'What is 0 + 99?', options: ['0', '9', '99', '100'], correct: 2 },
      ]
    },
    {
      id: 5, chapterId: 2, name: 'Subtraction of Numbers',
      content: 'Subtraction finds the difference between two numbers. We subtract from right to left, borrowing from the next column when needed.',
      keyPoints: ['Difference = result of subtraction', 'Borrow when top digit is smaller', 'Subtraction is NOT commutative: 5-3 ≠ 3-5', 'Subtracting 0 gives the same number'],
      examples: ['75 - 32 = 43', '100 - 47 = 53 (borrow)', '200 - 156 = 44'],
      summary: 'Subtraction finds what remains after taking away. Work right to left and borrow when needed.',
      difficulty: 'basic', xpReward: 40,
      questions: [
        { id: 1, question: '82 - 35 = ?', options: ['47', '57', '37', '53'], correct: 0 },
        { id: 2, question: '100 - 64 = ?', options: ['44', '36', '46', '34'], correct: 1 },
      ]
    },
    // ── MULTIPLICATION & DIVISION (ids 6-7) ──
    {
      id: 6, chapterId: 3, name: 'Multiplication Basics',
      content: 'Multiplication is repeated addition. 4 × 3 means adding 4 three times (4+4+4=12). The result is called the product.',
      keyPoints: ['Product = result of multiplication', 'Any number × 0 = 0', 'Any number × 1 = itself', 'Order does not matter: 3×4 = 4×3'],
      examples: ['6 × 7 = 42', '12 × 5 = 60', '9 × 9 = 81'],
      summary: 'Multiplication is fast repeated addition. Learn your times tables up to 12 for speed.',
      difficulty: 'basic', xpReward: 50,
      questions: [
        { id: 1, question: '8 × 7 = ?', options: ['54', '56', '48', '63'], correct: 1 },
        { id: 2, question: 'Any number multiplied by 0 equals?', options: ['1', 'The number itself', '0', 'Undefined'], correct: 2 },
      ]
    },
    {
      id: 7, chapterId: 3, name: 'Division Basics',
      content: 'Division splits a number into equal groups. 12 ÷ 4 = 3 means 12 split into 4 equal groups gives 3 each. The result is called the quotient.',
      keyPoints: ['Quotient = result of division', 'Remainder = what is left over', 'Division by 0 is undefined', 'Dividend ÷ Divisor = Quotient'],
      examples: ['20 ÷ 4 = 5', '17 ÷ 3 = 5 remainder 2', '100 ÷ 10 = 10'],
      summary: 'Division is the inverse of multiplication. It splits a total into equal parts.',
      difficulty: 'basic', xpReward: 50,
      questions: [
        { id: 1, question: '36 ÷ 6 = ?', options: ['5', '6', '7', '8'], correct: 1 },
        { id: 2, question: 'What is the remainder of 17 ÷ 5?', options: ['1', '2', '3', '4'], correct: 1 },
      ]
    },
    // ── SHAPES & PATTERNS (ids 8-9) ──
    {
      id: 8, chapterId: 4, name: '2D Shapes',
      content: '2D (two-dimensional) shapes are flat figures with length and width but no depth. Common 2D shapes include circles, triangles, squares, and rectangles.',
      keyPoints: ['Circle: no sides, no corners', 'Triangle: 3 sides, 3 corners', 'Square: 4 equal sides, 4 right angles', 'Rectangle: 4 sides, opposite sides equal'],
      examples: ['A coin is a circle', 'A yield sign is a triangle', 'A chessboard square is a square', 'A door is a rectangle'],
      summary: '2D shapes are flat. Know their sides, angles, and real-world examples.',
      difficulty: 'basic', xpReward: 40,
      questions: [
        { id: 1, question: 'How many sides does a triangle have?', options: ['2', '3', '4', '5'], correct: 1 },
        { id: 2, question: 'Which shape has no corners?', options: ['Square', 'Triangle', 'Circle', 'Rectangle'], correct: 2 },
      ]
    },
    {
      id: 9, chapterId: 4, name: 'Patterns and Sequences',
      content: 'A pattern is a repeated arrangement of numbers, shapes, or colours. Recognising patterns helps predict what comes next.',
      keyPoints: ['Identify the rule first', 'Number patterns can increase or decrease', 'Shape patterns repeat a sequence', 'Patterns are the foundation of algebra'],
      examples: ['2, 4, 6, 8, ? → rule: +2 → answer: 10', '△ ○ △ ○ ? → answer: △', '1, 3, 9, 27, ? → rule: ×3 → answer: 81'],
      summary: 'Find the rule, then apply it. Patterns are everywhere in maths and nature.',
      difficulty: 'basic', xpReward: 40,
      questions: [
        { id: 1, question: 'What comes next: 5, 10, 15, 20, ?', options: ['22', '24', '25', '30'], correct: 2 },
        { id: 2, question: 'What is the rule in 3, 6, 12, 24?', options: ['Add 3', 'Multiply by 2', 'Add 6', 'Multiply by 3'], correct: 1 },
      ]
    },
    // ── PARTS OF SPEECH (ids 10-12) ──
    {
      id: 10, chapterId: 5, name: 'Nouns',
      introduction: "Welcome to Nouns! Nouns are the 'naming words' that help us identify everyone and everything around us.",
      content: 'A noun is a word that names a person, place, thing, or idea. Nouns can be common (general) or proper (specific names).',
      detailedExplanation: "Every sentence usually centers around a noun. Common nouns like 'boy' or 'city' aren't capitalized unless they start a sentence. Proper nouns like 'Antigravity' or 'Mumbai' always start with a capital letter because they name something unique.",
      keyPoints: ['Common noun: general name (city, dog)', 'Proper noun: specific name (Mumbai, Bruno)', 'Collective noun: group (flock, team)', 'Abstract noun: idea or feeling (love, freedom)'],
      examples: ['"The dog ran fast." — dog is a noun', '"Mumbai is a big city." — Mumbai (proper), city (common)', 'Happiness, courage, knowledge are abstract nouns'],
      diagramDesc: `
[ Nouns Classification ]
      /      \\
  [Common]  [Proper]
   (city)    (Delhi)
      `,
      summary: 'Nouns name things. Identify whether they are common, proper, collective, or abstract.',
      glossary: [
        { t: 'Common Noun', d: 'General names like cat, table, school.' },
        { t: 'Proper Noun', d: 'Specific names like Monday, India, Ravi.' }
      ],
      difficulty: 'basic', xpReward: 40,
      questions: [
        { id: 1, question: 'Which is a proper noun?', options: ['city', 'river', 'Amazon', 'mountain'], correct: 2 },
        { id: 2, question: '"The team won the match." What type of noun is "team"?', options: ['Proper', 'Abstract', 'Collective', 'Common'], correct: 2 },
      ]
    },
    {
      id: 11, chapterId: 5, name: 'Verbs',
      introduction: "Verbs are the 'doing words' or 'being words' that make a sentence alive with action or state.",
      content: 'A verb is an action or state-of-being word. Every sentence needs a verb. Verbs change form based on tense (past, present, future).',
      detailedExplanation: "To find a verb, ask: 'What is happening?' or 'What is the subject doing/being?'. Action verbs like 'sing' show movement, while state verbs like 'am' or 'is' link the subject to a description.",
      keyPoints: ['Action verbs: run, eat, write', 'State verbs: is, are, was, seem', 'Tense shows when the action happens', 'Subject and verb must agree in number'],
      examples: ['"She runs every morning." — runs is the verb', '"They were happy." — were is a state verb', '"He will come tomorrow." — will come (future tense)'],
      diagramDesc: `
[ Subject ] --( Action Verb )--> [ Object ]
[   She   ] --(    runs    )--> [  fast  ]

[ Subject ] --( State Verb  )--> [ Adjective ]
[   They  ] --(     are     )--> [  happy   ]
      `,
      summary: 'Verbs are the engine of a sentence. They show action or state and must match the subject.',
      glossary: [
        { t: 'Action Verb', d: 'Physical or mental activity like think, jump.' },
        { t: 'State Verb', d: 'Conditions or states like exist, belong, believe.' }
      ],
      difficulty: 'basic', xpReward: 40,
      questions: [
        { id: 1, question: 'Identify the verb: "The cat sleeps on the mat."', options: ['cat', 'sleeps', 'mat', 'the'], correct: 1 },
        { id: 2, question: 'Which is a state verb?', options: ['jump', 'run', 'is', 'write'], correct: 2 },
      ]
    },
    {
      id: 12, chapterId: 5, name: 'Adjectives',
      introduction: "Adjectives are the 'describing words' that bring color and detail to your nouns.",
      content: 'An adjective describes or modifies a noun. It tells us more about the noun — its size, colour, shape, or quality.',
      detailedExplanation: "Without adjectives, reading would be boring! Instead of saying 'He has a ball', we say 'He has a shiny, large, blue ball'. This gives the reader a clearer picture.",
      keyPoints: ['Adjectives answer: What kind? How many? Which one?', 'They come before the noun usually', 'Comparative: taller, faster', 'Superlative: tallest, fastest'],
      examples: ['"The red apple is sweet." — red and sweet are adjectives', '"She is taller than her brother." — comparative', 'Mount Everest is the highest mountain." — superlative'],
      diagramDesc: `
[ Adjective ] + [ Noun ]
[   Red     ] + [ Apple ]
[  Beautiful] + [ House ]
      `,
      summary: 'Adjectives add detail to nouns. Learn comparative and superlative forms for richer writing.',
      glossary: [
        { t: 'Comparative', d: 'Comparing two things (longer).' },
        { t: 'Superlative', d: 'Comparing three or more (longest).' }
      ],
      difficulty: 'basic', xpReward: 40,
      questions: [
        { id: 1, question: 'Which word is an adjective: "The big brown dog barked."', options: ['dog', 'barked', 'big', 'the'], correct: 2 },
        { id: 2, question: 'Superlative form of "good" is?', options: ['gooder', 'better', 'best', 'most good'], correct: 2 },
      ]
    },
    // ── SENTENCE STRUCTURE (ids 13-14) ──
    {
      id: 13, chapterId: 6, name: 'Types of Sentences',
      introduction: "A sentence is a group of words that expresses a complete thought. There are four main types depending on your purpose.",
      content: 'Sentences are classified by purpose: declarative (statement), interrogative (question), imperative (command), and exclamatory (strong feeling).',
      detailedExplanation: "Every time you speak, you use one of these. When you tell a fact, it's declarative. When you ask something, it's interrogative. When you give an order, it's imperative. And when you scream in joy, it's exclamatory!",
      keyPoints: ['Declarative ends with a full stop', 'Interrogative ends with a question mark', 'Imperative gives a command', 'Exclamatory ends with an exclamation mark'],
      examples: ['"The sun rises in the east." — declarative', '"Where are you going?" — interrogative', '"Close the door." — imperative', '"What a beautiful day!" — exclamatory'],
      diagramDesc: `
Purpose -> [  Command  |  Question |  Fact  | Emotion ]
Type    -> [ Imperative | Interrog. | Decl.  | Exclam. ]
      `,
      summary: 'Every sentence has a purpose. Identify it by its ending punctuation and meaning.',
      glossary: [
        { t: 'Declarative', d: 'A simple statement of fact.' },
        { t: 'Imperative', d: 'A direct command or request.' }
      ],
      difficulty: 'basic', xpReward: 40,
      questions: [
        { id: 1, question: '"Please sit down." is what type of sentence?', options: ['Declarative', 'Interrogative', 'Imperative', 'Exclamatory'], correct: 2 },
        { id: 2, question: 'Which punctuation ends an interrogative sentence?', options: ['.', '!', '?', ','], correct: 2 },
      ]
    },
    {
      id: 14, chapterId: 6, name: 'Subject and Predicate',
      introduction: "Every full sentence must have two partners: the one who acts (Subject) and what they did (Predicate).",
      content: 'Every sentence has two parts: the subject (who or what the sentence is about) and the predicate (what the subject does or is).',
      detailedExplanation: "Think of it as a team. The Subject is the star of the show. The Predicate is everything they do in the scene. Without both, the sentence isn't finished.",
      keyPoints: ['Subject = who/what the sentence is about', 'Predicate = what the subject does/is', 'Simple subject = main noun', 'Simple predicate = main verb'],
      examples: ['"The birds sing sweetly." — Subject: The birds | Predicate: sing sweetly', '"My friend plays cricket." — Subject: My friend | Predicate: plays cricket'],
      diagramDesc: `
[      Subject      ] | [      Predicate      ]
[     The Birds     ] | [    sing sweetly     ]
[    My Friend      ] | [    plays cricket    ]
      `,
      summary: 'Split any sentence into subject + predicate. The subject acts; the predicate describes the action.',
      glossary: [
        { t: 'Subject', d: 'The person or thing performing the action.' },
        { t: 'Predicate', d: 'The part of the sentence containing the verb.' }
      ],
      difficulty: 'intermediate', xpReward: 50,
      questions: [
        { id: 1, question: 'In "The dog barked loudly", what is the subject?', options: ['barked', 'loudly', 'The dog', 'dog barked'], correct: 2 },
        { id: 2, question: 'The predicate of a sentence contains the?', options: ['Noun', 'Adjective', 'Verb', 'Article'], correct: 2 },
      ]
    },
    // ── EVS: PLANTS & ANIMALS (ids 15-16) ──
    { id: 15, chapterId: 7, name: 'Parts of a Plant', content: 'Plants have roots, stem, leaves, flowers, and fruits. Each part has a specific function. Roots absorb water and minerals. The stem transports water. Leaves make food through photosynthesis.', keyPoints: ['Roots: absorb water and anchor the plant', 'Stem: transports water and nutrients', 'Leaves: make food using sunlight (photosynthesis)', 'Flowers: reproduction; Fruits: protect seeds'], examples: ['Carrot is an edible root', 'Sugarcane is an edible stem', 'Spinach is an edible leaf', 'Mango is a fruit containing a seed'], summary: 'Every part of a plant has a job. Roots absorb, stems transport, leaves produce food, flowers reproduce.', difficulty: 'basic', xpReward: 40, assignment: { title: 'Plant Parts Drawing', description: 'Draw a plant and label all 5 parts. Write one function for each part.', dueIn: '3 days' }, sources: [{ title: 'NCERT Class 4 EVS Chapter 7', url: '#' }, { title: 'Plants for Kids - BBC Bitesize', url: '#' }], questions: [{ id: 1, question: 'Which part of the plant absorbs water from the soil?', options: ['Leaf', 'Stem', 'Root', 'Flower'], correct: 2 }, { id: 2, question: 'Where does photosynthesis take place?', options: ['Root', 'Stem', 'Flower', 'Leaf'], correct: 3 }] },
    { id: 16, chapterId: 7, name: 'Types of Animals', content: 'Animals are classified by what they eat: herbivores (plants only), carnivores (meat only), and omnivores (both). They are also grouped as domestic or wild.', keyPoints: ['Herbivore: eats only plants (cow, rabbit)', 'Carnivore: eats only meat (lion, eagle)', 'Omnivore: eats both (humans, bears)', 'Domestic animals live with humans; wild animals live in nature'], examples: ['Cow eats grass → herbivore', 'Lion hunts deer → carnivore', 'Humans eat vegetables and meat → omnivore', 'Dog is domestic; tiger is wild'], summary: 'Animals are classified by diet and habitat. Know herbivore, carnivore, omnivore with examples.', difficulty: 'basic', xpReward: 40, assignment: { title: 'Animal Classification Chart', description: 'List 3 animals each for herbivore, carnivore, and omnivore. Add one fact about each.', dueIn: '2 days' }, sources: [{ title: 'NCERT Class 3 EVS', 'url': '#' }, { title: 'Animal Types - National Geographic Kids', url: '#' }], questions: [{ id: 1, question: 'A lion is a?', options: ['Herbivore', 'Omnivore', 'Carnivore', 'Domestic animal'], correct: 2 }, { id: 2, question: 'Which animal is an omnivore?', options: ['Cow', 'Eagle', 'Bear', 'Rabbit'], correct: 2 }] },
    // ── EVS: OUR ENVIRONMENT (ids 17-18) ──
    { id: 17, chapterId: 8, name: 'Air and Water Pollution', content: 'Pollution is the introduction of harmful substances into the environment. Air pollution is caused by vehicle emissions and factory smoke. Water pollution is caused by dumping waste into rivers and lakes.', keyPoints: ['Air pollution: smoke, dust, vehicle exhaust', 'Water pollution: industrial waste, plastic, sewage', 'Effects: respiratory diseases, unsafe drinking water', 'Prevention: use public transport, avoid plastic'], examples: ['Factory chimneys releasing black smoke = air pollution', 'Plastic bottles in rivers = water pollution', 'Using CNG buses reduces air pollution'], summary: 'Pollution harms our environment and health. Reduce, reuse, and recycle to prevent it.', difficulty: 'basic', xpReward: 50, assignment: { title: 'Pollution Poster', description: 'Create a poster showing one type of pollution, its causes, effects, and 3 ways to prevent it.', dueIn: '5 days' }, sources: [{ title: 'NCERT EVS Class 5', url: '#' }, { title: 'Pollution Facts - WWF', url: '#' }], questions: [{ id: 1, question: 'Vehicle exhaust causes which type of pollution?', options: ['Water', 'Soil', 'Air', 'Noise'], correct: 2 }, { id: 2, question: 'Which is a way to reduce air pollution?', options: ['Burn more fuel', 'Use public transport', 'Dump waste in rivers', 'Cut more trees'], correct: 1 }] },
    { id: 18, chapterId: 8, name: 'Conservation of Natural Resources', content: 'Natural resources like water, forests, and minerals are limited. Conservation means using them wisely so future generations can also benefit.', keyPoints: ['Renewable resources: solar, wind, water', 'Non-renewable: coal, petroleum (limited supply)', '3 Rs: Reduce, Reuse, Recycle', 'Deforestation destroys habitats and causes floods'], examples: ['Turning off taps saves water', 'Solar panels use renewable energy', 'Recycling paper saves trees', 'Planting trees prevents soil erosion'], summary: 'Conserve resources by using less, reusing items, and recycling waste. Every small action counts.', difficulty: 'intermediate', xpReward: 50, assignment: { title: 'Conservation Diary', description: 'For one week, record 3 things you did each day to conserve resources.', dueIn: '7 days' }, sources: [{ title: 'NCERT Class 5 EVS Chapter 10', url: '#' }, { title: 'Conservation - UNEP Kids', url: '#' }], questions: [{ id: 1, question: 'Which is a renewable resource?', options: ['Coal', 'Petroleum', 'Solar energy', 'Natural gas'], correct: 2 }, { id: 2, question: 'What does "Recycle" mean?', options: ['Use less', 'Use again', 'Convert waste into new products', 'Throw away'], correct: 2 }] },
    // ── ALGEBRA BASICS (ids 19-20) ──
    { id: 19, chapterId: 10, name: 'Introduction to Algebra', content: 'Algebra uses letters (variables) to represent unknown numbers. An expression like 2x + 3 means "2 times some number plus 3". Algebra helps solve real-world problems.', keyPoints: ['Variable: a letter representing an unknown (x, y, n)', 'Expression: combination of numbers and variables (3x + 2)', 'Equation: expression with an equals sign (3x + 2 = 11)', 'Solving: finding the value of the variable'], examples: ['If x = 5, then 2x = 10', '3n + 1 = 10 → 3n = 9 → n = 3', 'Perimeter of square = 4s (s = side length)'], summary: 'Algebra replaces unknown numbers with letters. Set up equations and solve step by step.', difficulty: 'intermediate', xpReward: 60, assignment: { title: 'Algebra Word Problems', description: 'Solve 5 word problems by writing an equation first, then solving for the variable.', dueIn: '4 days' }, sources: [{ title: 'NCERT Class 6 Maths Chapter 11', url: '#' }, { title: 'Algebra Basics - Khan Academy', url: '#' }], questions: [{ id: 1, question: 'If 2x = 14, what is x?', options: ['5', '6', '7', '8'], correct: 2 }, { id: 2, question: 'Which of these is an equation?', options: ['3x + 2', '5y', '2a + 1 = 9', '4b'], correct: 2 }] },
    { id: 20, chapterId: 10, name: 'Linear Equations', content: 'A linear equation has one variable with no exponents. The goal is to isolate the variable on one side. Use inverse operations: if something is added, subtract it; if multiplied, divide.', keyPoints: ['Isolate the variable to solve', 'Use inverse operations', 'Whatever you do to one side, do to the other', 'Check your answer by substituting back'], examples: ['x + 7 = 12 → x = 12 - 7 = 5', '3x = 18 → x = 18 ÷ 3 = 6', '2x - 4 = 10 → 2x = 14 → x = 7'], summary: 'Solve linear equations by isolating the variable using inverse operations. Always check your answer.', difficulty: 'intermediate', xpReward: 70, assignment: { title: 'Equation Solving Practice', description: 'Solve 10 linear equations showing all steps. Verify each answer by substitution.', dueIn: '3 days' }, sources: [{ title: 'NCERT Class 7 Maths Chapter 4', url: '#' }, { title: 'Linear Equations - Math is Fun', url: '#' }], questions: [{ id: 1, question: 'Solve: x + 9 = 15', options: ['x=5', 'x=6', 'x=7', 'x=24'], correct: 1 }, { id: 2, question: 'Solve: 4x = 28', options: ['x=6', 'x=7', 'x=8', 'x=9'], correct: 1 }] },
    // ── GEOMETRY (ids 21-22) ──
    { id: 21, chapterId: 11, name: 'Angles and Triangles', content: 'An angle is formed when two rays meet at a point. Angles are measured in degrees. Triangles have 3 sides and 3 angles that always add up to 180°.', keyPoints: ['Acute angle: less than 90°', 'Right angle: exactly 90°', 'Obtuse angle: between 90° and 180°', 'Triangle angle sum = 180°'], examples: ['Corner of a book = 90° (right angle)', 'Equilateral triangle: all angles = 60°', 'If two angles are 70° and 60°, third = 50°'], summary: 'Angles classify shapes. Triangle angles always sum to 180° — use this to find missing angles.', difficulty: 'intermediate', xpReward: 60, assignment: { title: 'Angle Hunt', description: 'Find 5 angles in your home or classroom. Measure or estimate each and classify them.', dueIn: '3 days' }, sources: [{ title: 'NCERT Class 6 Maths Chapter 5', url: '#' }, { title: 'Geometry - BBC Bitesize', url: '#' }], questions: [{ id: 1, question: 'What is the sum of angles in a triangle?', options: ['90°', '180°', '270°', '360°'], correct: 1 }, { id: 2, question: 'An angle of 120° is called?', options: ['Acute', 'Right', 'Obtuse', 'Reflex'], correct: 2 }] },
    { id: 22, chapterId: 11, name: 'Area and Perimeter', content: 'Perimeter is the total distance around a shape. Area is the space inside a shape. Different shapes have different formulas.', keyPoints: ['Perimeter of rectangle = 2(l + b)', 'Area of rectangle = l × b', 'Perimeter of square = 4s', 'Area of square = s²'], examples: ['Rectangle 5cm × 3cm: Perimeter = 16cm, Area = 15cm²', 'Square 4cm: Perimeter = 16cm, Area = 16cm²', 'Fencing a garden requires perimeter calculation'], summary: 'Perimeter measures the boundary; area measures the surface. Memorise formulas for common shapes.', difficulty: 'intermediate', xpReward: 60, assignment: { title: 'Room Measurement', description: 'Measure your room or a piece of furniture. Calculate its perimeter and area. Show all working.', dueIn: '4 days' }, sources: [{ title: 'NCERT Class 5 Maths Chapter 11', url: '#' }, { title: 'Area and Perimeter - Math Antics', url: '#' }], questions: [{ id: 1, question: 'Area of a rectangle 6cm × 4cm?', options: ['20cm²', '24cm²', '10cm²', '48cm²'], correct: 1 }, { id: 2, question: 'Perimeter of a square with side 5cm?', options: ['10cm', '15cm', '20cm', '25cm'], correct: 2 }] },

    // ── SCIENCE MIDDLE: MATTER & MATERIALS (ids 23-24) ──
    {
      id: 23, chapterId: 12, name: 'States of Matter',
      content: 'All matter exists in three states: solid, liquid, and gas. The state depends on how tightly particles are packed and how much energy they have. Solids have a fixed shape and volume. Liquids have a fixed volume but take the shape of their container. Gases have neither fixed shape nor volume.',
      keyPoints: ['Solid: tightly packed particles, fixed shape and volume', 'Liquid: loosely packed, fixed volume, no fixed shape', 'Gas: particles far apart, no fixed shape or volume', 'Heating causes solids to melt into liquids, liquids to evaporate into gases', 'Cooling reverses the process: condensation and freezing'],
      examples: ['Ice (solid) → Water (liquid) → Steam (gas) — all the same substance H₂O', 'A glass of juice takes the shape of the glass (liquid)', 'Air fills any container completely (gas)', 'Melting point of ice = 0°C; Boiling point of water = 100°C'],
      summary: 'Matter exists as solid, liquid, or gas depending on particle arrangement and energy. Temperature changes cause transitions between states.',
      difficulty: 'basic', xpReward: 50,
      assignment: { title: 'States of Matter Observation', description: 'Observe 5 objects at home. Classify each as solid, liquid, or gas. For one object, describe what would happen if you heated or cooled it.', dueIn: '2 days' },
      sources: [{ title: 'NCERT Class 6 Science Chapter 4', url: '#' }, { title: 'States of Matter - BBC Bitesize', url: '#' }],
      questions: [{ id: 1, question: 'Which state of matter has a fixed shape and volume?', options: ['Gas', 'Liquid', 'Solid', 'Plasma'], correct: 2 }, { id: 2, question: 'What happens when water is heated to 100°C?', options: ['It freezes', 'It melts', 'It evaporates', 'It condenses'], correct: 2 }]
    },
    {
      id: 24, chapterId: 12, name: 'Mixtures and Solutions',
      content: 'A mixture is a combination of two or more substances that are not chemically combined. In a solution, one substance (solute) dissolves completely in another (solvent). Mixtures can be separated by physical methods.',
      keyPoints: ['Mixture: components retain their properties and can be separated', 'Solution: homogeneous mixture where solute dissolves in solvent', 'Solute = substance that dissolves; Solvent = substance that dissolves the solute', 'Separation methods: filtration, evaporation, distillation, magnetic separation'],
      examples: ['Salt dissolved in water = solution (salt is solute, water is solvent)', 'Sand and iron filings = mixture (separated by magnet)', 'Muddy water = mixture (separated by filtration)', 'Seawater → evaporation → salt remains'],
      summary: 'Mixtures combine substances physically; solutions are uniform mixtures. Both can be separated using physical methods.',
      difficulty: 'intermediate', xpReward: 60,
      assignment: { title: 'Separation Experiment', description: 'Take a mixture of sand and salt. Describe step by step how you would separate both components. Which method would you use for each?', dueIn: '3 days' },
      sources: [{ title: 'NCERT Class 6 Science Chapter 5', url: '#' }, { title: 'Mixtures and Solutions - Khan Academy', url: '#' }],
      questions: [{ id: 1, question: 'What is the solvent in a salt-water solution?', options: ['Salt', 'Water', 'Both', 'Neither'], correct: 1 }, { id: 2, question: 'Which method separates iron filings from sand?', options: ['Filtration', 'Evaporation', 'Magnetic separation', 'Distillation'], correct: 2 }]
    },
    // ── SCIENCE MIDDLE: LIVING ORGANISMS (ids 25-26) ──
    {
      id: 25, chapterId: 13, name: 'Cell — The Basic Unit of Life',
      content: 'The cell is the smallest structural and functional unit of all living organisms. Every living thing is made of cells. Some organisms have only one cell (unicellular) while others have trillions (multicellular). Cells were first observed by Robert Hooke in 1665.',
      keyPoints: ['Cell = basic unit of life', 'Unicellular: single cell (Amoeba, Bacteria)', 'Multicellular: many cells (humans, plants)', 'Plant cells have a cell wall; animal cells do not', 'Key organelles: nucleus (control centre), mitochondria (energy), cell membrane (boundary)'],
      examples: ['Amoeba is a single-celled organism that can move and eat', 'Human body has approximately 37 trillion cells', 'Onion peel cells are easy to observe under a microscope', 'Red blood cells carry oxygen throughout the body'],
      summary: 'Cells are the building blocks of life. Plant and animal cells share some organelles but differ in cell wall, chloroplasts, and vacuole size.',
      difficulty: 'intermediate', xpReward: 60,
      assignment: { title: 'Cell Diagram', description: 'Draw a labelled diagram of both a plant cell and an animal cell. List 3 differences between them.', dueIn: '4 days' },
      sources: [{ title: 'NCERT Class 8 Science Chapter 8', url: '#' }, { title: 'Cell Biology - Khan Academy', url: '#' }],
      questions: [{ id: 1, question: 'Who first observed cells?', options: ['Darwin', 'Newton', 'Robert Hooke', 'Pasteur'], correct: 2 }, { id: 2, question: 'Which organelle is called the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Vacuole'], correct: 2 }]
    },
    {
      id: 26, chapterId: 13, name: 'Photosynthesis',
      content: 'Photosynthesis is the process by which green plants make their own food using sunlight, water, and carbon dioxide. It takes place in the chloroplasts, which contain a green pigment called chlorophyll. Oxygen is released as a by-product.',
      keyPoints: ['Equation: 6CO₂ + 6H₂O + sunlight → C₆H₁₂O₆ + 6O₂', 'Occurs in chloroplasts (contain chlorophyll)', 'Inputs: carbon dioxide, water, sunlight', 'Outputs: glucose (food) and oxygen', 'Leaves are the main site of photosynthesis'],
      examples: ['Plants absorb CO₂ through tiny pores called stomata', 'Aquatic plants like Hydrilla release visible oxygen bubbles in sunlight', 'Variegated leaves (partly green, partly white) only photosynthesise in green parts', 'Farmers ensure crops get enough sunlight for maximum yield'],
      summary: 'Photosynthesis converts light energy into chemical energy (glucose). It is the foundation of almost all food chains on Earth.',
      difficulty: 'intermediate', xpReward: 70,
      assignment: { title: 'Photosynthesis Experiment', description: 'Place a plant in sunlight and another in a dark room for 48 hours. Test both leaves for starch using iodine solution. Record and explain your observations.', dueIn: '5 days' },
      sources: [{ title: 'NCERT Class 7 Science Chapter 1', url: '#' }, { title: 'Photosynthesis - National Geographic', url: '#' }],
      questions: [{ id: 1, question: 'What gas do plants release during photosynthesis?', options: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'], correct: 2 }, { id: 2, question: 'Where does photosynthesis occur in a plant cell?', options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Chloroplast'], correct: 3 }]
    },
    // ── SCIENCE MIDDLE: ENERGY & MOTION (ids 27-28) ──
    {
      id: 27, chapterId: 14, name: 'Force and Motion',
      content: 'A force is a push or pull that can change the state of motion of an object. Motion is the change in position of an object over time. Forces can start, stop, speed up, slow down, or change the direction of motion.',
      keyPoints: ['Force = push or pull (measured in Newtons)', 'Types: gravitational, frictional, magnetic, electrostatic, muscular', 'Friction opposes motion between surfaces', 'Balanced forces = no change in motion; Unbalanced = change in motion', 'Speed = Distance ÷ Time'],
      examples: ['Kicking a ball applies muscular force to set it in motion', 'Friction between tyres and road allows cars to brake', 'A magnet attracting iron nails = magnetic force', 'Gravity pulls objects downward (9.8 m/s² on Earth)', 'A book on a table: gravity pulls down, table pushes up — balanced forces'],
      summary: 'Forces cause changes in motion. Friction, gravity, and magnetic forces are common types. Speed measures how fast an object moves.',
      difficulty: 'intermediate', xpReward: 60,
      assignment: { title: 'Force Investigation', description: 'Push a book across two different surfaces (smooth table and rough carpet). Measure the distance it travels each time. Which surface has more friction? Explain why.', dueIn: '3 days' },
      sources: [{ title: 'NCERT Class 8 Science Chapter 11', url: '#' }, { title: 'Forces and Motion - Physics Classroom', url: '#' }],
      questions: [{ id: 1, question: 'What is the unit of force?', options: ['Joule', 'Watt', 'Newton', 'Metre'], correct: 2 }, { id: 2, question: 'Which force opposes motion between two surfaces?', options: ['Gravity', 'Friction', 'Magnetic', 'Electrostatic'], correct: 1 }]
    },
    {
      id: 28, chapterId: 14, name: 'Energy and Its Forms',
      content: 'Energy is the ability to do work. It exists in many forms and can be converted from one form to another, but it cannot be created or destroyed (Law of Conservation of Energy). The SI unit of energy is the Joule (J).',
      keyPoints: ['Forms: kinetic, potential, thermal, light, sound, electrical, chemical', 'Kinetic energy = energy of motion (KE = ½mv²)', 'Potential energy = stored energy due to position (PE = mgh)', 'Energy conversion: one form changes to another', 'Law of Conservation: total energy remains constant'],
      examples: ['A moving car has kinetic energy', 'A stretched rubber band has potential energy', 'A light bulb converts electrical energy to light and heat', 'Food contains chemical energy that our body converts to kinetic energy', 'Hydroelectric dam: potential energy of water → kinetic → electrical'],
      summary: 'Energy drives everything. It converts between forms but is never lost. Kinetic and potential are the two fundamental mechanical forms.',
      difficulty: 'intermediate', xpReward: 70,
      assignment: { title: 'Energy Conversion Chain', description: 'Choose any 3 household appliances. For each, write the energy input and output. Draw an energy conversion diagram.', dueIn: '3 days' },
      sources: [{ title: 'NCERT Class 7 Science Chapter 13', url: '#' }, { title: 'Energy Forms - Physics Classroom', url: '#' }],
      questions: [{ id: 1, question: 'What is the SI unit of energy?', options: ['Watt', 'Newton', 'Joule', 'Ampere'], correct: 2 }, { id: 2, question: 'A ball at the top of a hill has which type of energy?', options: ['Kinetic', 'Sound', 'Thermal', 'Potential'], correct: 3 }]
    },

    // ── SOCIAL STUDIES: HISTORY (ids 29-30) ──
    {
      id: 29, chapterId: 15, name: 'The Indus Valley Civilisation',
      content: 'The Indus Valley Civilisation (also called Harappan Civilisation) was one of the world\'s earliest urban civilisations, flourishing around 2500–1900 BCE in the northwestern Indian subcontinent. Major cities included Mohenjo-daro and Harappa.',
      keyPoints: ['Period: approximately 2500–1900 BCE', 'Major sites: Mohenjo-daro, Harappa, Lothal, Dholavira', 'Known for: town planning'],
      questions: [{ id: 1, question: 'What was another name for the Indus Valley Civilisation?', options: ['Mesopotamia', 'Harappan', 'Egyptian', 'Maya'], correct: 1 }]
    },
    {
      id: 30, chapterId: 15, name: 'The Maurya Empire',
      content: 'The Maurya Empire was one of the largest empires in ancient India. It was founded by Chandragupta Maurya and later expanded by Ashoka. Ashoka is remembered for promoting peace and spreading Buddhism after the Kalinga war.',
      keyPoints: ['Founder: Chandragupta Maurya', 'Ashoka expanded the empire widely', 'Kalinga war led Ashoka to embrace non-violence', 'Buddhism spread through Ashoka’s messages and missions'],
      examples: ['Ashoka’s edicts were carved on pillars and rocks', 'The lion capital of Ashoka is a national symbol of India'],
      summary: 'The Maurya Empire united large parts of India. Ashoka’s rule is famous for peace, public welfare, and the spread of Buddhism.',
      difficulty: 'basic',
      xpReward: 50,
      questions: [
        { id: 1, question: 'Who founded the Maurya Empire?', options: ['Ashoka', 'Chandragupta Maurya', 'Harsha', 'Akbar'], correct: 1 },
        { id: 2, question: 'After which war did Ashoka promote non-violence?', options: ['Plassey', 'Kalinga', 'Panipat', 'Talikwata'], correct: 1 },
      ]
    },
    {
      id: 31, chapterId: 16, name: 'Maps and Directions',
      content: 'Maps are drawings of places seen from above. They help us locate places using symbols, a compass direction (North, South, East, West), and a scale. A legend (key) explains the symbols used on the map.',
      keyPoints: ['Compass directions: N, S, E, W', 'Symbols represent real features', 'Scale shows distance on the ground', 'Legend/key explains map symbols'],
      examples: ['A river may be shown with a blue line', 'A road may be shown with a black line', 'If 1 cm = 1 km, then 3 cm = 3 km on the ground'],
      summary: 'Maps use symbols, directions, and scales to show real places. Read the legend and use the compass to navigate.',
      difficulty: 'basic',
      xpReward: 50,
      questions: [
        { id: 1, question: 'What does a map legend show?', options: ['Weather', 'Symbols meaning', 'Time', 'Population'], correct: 1 },
        { id: 2, question: 'Which direction is opposite to East?', options: ['West', 'North', 'South', 'North-East'], correct: 0 },
      ]
    },
    {
      id: 32, chapterId: 16, name: 'Landforms',
      content: 'Landforms are natural features of Earth’s surface. Mountains are high and steep, plains are flat and fertile, plateaus are raised flat areas, and valleys are low areas between hills or mountains.',
      keyPoints: ['Mountains: high, steep land', 'Plains: flat and often fertile', 'Plateaus: raised flat areas', 'Valleys: low land between hills/mountains'],
      examples: ['The Himalayas are mountains', 'The Indo-Gangetic plain is a large plain', 'The Deccan Plateau is a plateau'],
      summary: 'Landforms shape climate, farming, and where people live. Learn the main types: mountains, plains, plateaus, and valleys.',
      difficulty: 'basic',
      xpReward: 50,
      questions: [
        { id: 1, question: 'Which landform is raised and flat?', options: ['Valley', 'Plateau', 'Plain', 'Delta'], correct: 1 },
        { id: 2, question: 'Which landform is flat and often fertile?', options: ['Plain', 'Mountain', 'Volcano', 'Cliff'], correct: 0 },
      ]
    },
    {
      id: 33, chapterId: 17, name: 'Speed, Distance and Time',
      content: 'Speed tells how fast something moves. It is calculated as Speed = Distance ÷ Time. If an object moves the same distance in less time, it has higher speed.',
      keyPoints: ['Speed = Distance ÷ Time', 'Units: m/s or km/h', 'Higher distance in same time → higher speed', 'Same distance in less time → higher speed'],
      examples: ['If you travel 60 km in 2 hours, speed = 30 km/h', 'If you run 100 m in 20 s, speed = 5 m/s'],
      summary: 'Speed is a measure of motion. Use the formula Speed = Distance ÷ Time and keep units consistent.',
      difficulty: 'basic',
      xpReward: 60,
      questions: [
        { id: 1, question: 'Speed is calculated as?', options: ['Time ÷ Distance', 'Distance ÷ Time', 'Distance × Time', 'Distance + Time'], correct: 1 },
        { id: 2, question: 'If distance is 50 km and time is 5 h, speed is?', options: ['10 km/h', '25 km/h', '5 km/h', '55 km/h'], correct: 0 },
      ]
    },
    {
      id: 34, chapterId: 17, name: 'Balanced and Unbalanced Forces',
      content: 'Forces are pushes or pulls. Balanced forces cancel each other and do not change motion. Unbalanced forces cause changes like starting, stopping, speeding up, slowing down, or changing direction.',
      keyPoints: ['Balanced forces → no change in motion', 'Unbalanced forces → change in motion', 'Net force decides the effect', 'Friction is a common force that opposes motion'],
      examples: ['Book on table: gravity down, normal force up (balanced)', 'Pushing a cart harder makes it speed up (unbalanced)'],
      summary: 'Balanced forces keep an object’s motion the same. Unbalanced forces change motion.',
      difficulty: 'intermediate',
      xpReward: 70,
      questions: [
        { id: 1, question: 'Balanced forces cause?', options: ['Change in motion', 'No change in motion', 'Always faster motion', 'Only circular motion'], correct: 1 },
        { id: 2, question: 'Which force opposes motion between surfaces?', options: ['Gravity', 'Friction', 'Magnetic', 'Nuclear'], correct: 1 },
      ]
    },
    {
      id: 35, chapterId: 18, name: 'Light: Reflection Basics',
      content: 'Light travels in straight lines. When light hits a smooth surface like a mirror, it reflects. The angle of incidence equals the angle of reflection.',
      keyPoints: ['Light travels in straight lines', 'Reflection happens on smooth surfaces', 'Angle of incidence = angle of reflection', 'A mirror forms images by reflection'],
      examples: ['Seeing your face in a mirror', 'A torch beam reflecting off a shiny surface'],
      summary: 'Reflection is the bouncing back of light. Mirror reflection follows the rule: incidence angle equals reflection angle.',
      difficulty: 'basic',
      xpReward: 60,
      questions: [
        { id: 1, question: 'Light usually travels in?', options: ['Circles', 'Straight lines', 'Zig-zag only', 'Spirals'], correct: 1 },
        { id: 2, question: 'In reflection, angle of incidence is?', options: ['Greater than reflection', 'Equal to reflection', 'Always 90°', 'Always 0°'], correct: 1 },
      ]
    },
    {
      id: 36, chapterId: 18, name: 'Electric Circuits',
      content: 'An electric circuit is a closed path through which current flows. A simple circuit includes a cell/battery, wires, and a bulb. If the circuit is open (broken), current cannot flow and the bulb will not glow.',
      keyPoints: ['Circuit must be closed for current to flow', 'Battery provides energy', 'Switch opens/closes the circuit', 'Bulb glows when current flows'],
      examples: ['Turning on a torch closes the circuit', 'A broken wire opens the circuit so the bulb stays off'],
      summary: 'Electricity flows only in a closed circuit. Switches control whether the path is open or closed.',
      difficulty: 'basic',
      xpReward: 70,
      questions: [
        { id: 1, question: 'Current flows when the circuit is?', options: ['Open', 'Closed', 'Curved', 'Wet'], correct: 1 },
        { id: 2, question: 'What controls opening/closing a circuit?', options: ['Bulb', 'Switch', 'Wire color', 'Fan'], correct: 1 },
      ]
    },
    {
      id: 37, chapterId: 19, name: 'Physical and Chemical Changes',
      content: 'A physical change changes the form of a substance but not its identity (like melting). A chemical change forms a new substance (like rusting). Chemical changes are often hard to reverse.',
      keyPoints: ['Physical change: no new substance', 'Chemical change: new substance forms', 'Rusting and burning are chemical changes', 'Melting and freezing are physical changes'],
      examples: ['Ice melting into water (physical)', 'Iron rusting (chemical)', 'Paper burning into ash (chemical)'],
      summary: 'Physical changes affect shape/state; chemical changes create new substances.',
      difficulty: 'basic',
      xpReward: 60,
      questions: [
        { id: 1, question: 'Rusting is a?', options: ['Physical change', 'Chemical change', 'No change', 'Only melting'], correct: 1 },
        { id: 2, question: 'Melting ice is a?', options: ['Chemical change', 'Physical change', 'Nuclear change', 'Electrical change'], correct: 1 },
      ]
    },
    {
      id: 38, chapterId: 19, name: 'Simple Chemical Reactions',
      content: 'A chemical reaction occurs when substances (reactants) change into new substances (products). Signs include color change, gas formation, temperature change, or formation of a precipitate (solid).',
      keyPoints: ['Reactants → Products', 'New substances form', 'Signs: gas, heat, color change, precipitate', 'Reactions can release or absorb energy'],
      examples: ['Vinegar + baking soda produces gas bubbles', 'Iron and oxygen form rust over time'],
      summary: 'Chemical reactions create new substances. Look for common signs like gas bubbles, heat, or color change.',
      difficulty: 'intermediate',
      xpReward: 70,
      questions: [
        { id: 1, question: 'Substances at the start of a reaction are called?', options: ['Products', 'Reactants', 'Solutions', 'Mixtures'], correct: 1 },
        { id: 2, question: 'Gas bubbles often indicate a?', options: ['Map', 'Chemical reaction', 'Shadow', 'Magnet'], correct: 1 },
      ]
    },
    {
      id: 39, chapterId: 20, name: 'Acids and Bases',
      content: 'Acids are substances that taste sour (like lemon) and turn blue litmus red. Bases are bitter/slippery and turn red litmus blue. Indicators help us identify acids and bases.',
      keyPoints: ['Acids: sour; blue litmus → red', 'Bases: bitter/slippery; red litmus → blue', 'Indicators: litmus, turmeric, phenolphthalein', 'Neutral substances do not change litmus'],
      examples: ['Lemon juice is acidic', 'Soap solution is basic', 'Pure water is neutral'],
      summary: 'Acids and bases can be identified using indicators like litmus paper.',
      difficulty: 'basic',
      xpReward: 60,
      questions: [
        { id: 1, question: 'An acid turns blue litmus to?', options: ['Blue', 'Red', 'Green', 'Yellow'], correct: 1 },
        { id: 2, question: 'Soap solution is usually?', options: ['Acidic', 'Basic', 'Neutral', 'Metallic'], correct: 1 },
      ]
    },
    {
      id: 40, chapterId: 20, name: 'Neutralization',
      content: 'Neutralization is a reaction between an acid and a base that produces salt and water. This reaction is useful in daily life, for example, antacids neutralize excess stomach acid.',
      keyPoints: ['Acid + Base → Salt + Water', 'Neutralization reduces acidity/basicity', 'Antacids neutralize stomach acid', 'Lime is used to treat acidic soil'],
      examples: ['Stomach antacid tablets', 'Adding lime to acidic soil to help plants grow'],
      summary: 'Neutralization happens when acids and bases react to form salt and water and make a mixture closer to neutral.',
      difficulty: 'intermediate',
      xpReward: 70,
      questions: [
        { id: 1, question: 'Neutralization produces?', options: ['Salt and water', 'Only water', 'Only salt', 'Only gas'], correct: 0 },
        { id: 2, question: 'Antacids help by?', options: ['Making more acid', 'Neutralizing acid', 'Freezing acid', 'Turning acid into metal'], correct: 1 },
      ]
    },
    {
      id: 41, chapterId: 21, name: 'Cell Organelles',
      content: 'Cells contain parts called organelles that do specific jobs. The nucleus controls the cell, mitochondria release energy, and the cell membrane controls what enters and leaves the cell.',
      keyPoints: ['Nucleus: control center', 'Mitochondria: energy release', 'Cell membrane: controls entry/exit', 'Organelles work together to keep the cell alive'],
      examples: ['Nucleus stores genetic information', 'Mitochondria are more in active cells like muscle cells'],
      summary: 'Organelles are specialized parts of a cell. Each organelle has a role that helps the cell function.',
      difficulty: 'intermediate',
      xpReward: 70,
      questions: [
        { id: 1, question: 'Which organelle controls the cell?', options: ['Nucleus', 'Ribosome', 'Cell wall', 'Vacuole'], correct: 0 },
        { id: 2, question: 'Mitochondria are mainly related to?', options: ['Energy', 'Color', 'Sound', 'Gravity'], correct: 0 },
      ]
    },
    {
      id: 42, chapterId: 21, name: 'Plant Cell vs Animal Cell',
      content: 'Plant and animal cells share many features, but plant cells have a cell wall and chloroplasts. Animal cells do not have a cell wall, and their vacuoles are usually smaller.',
      keyPoints: ['Plant cells: cell wall, chloroplasts, large vacuole', 'Animal cells: no cell wall, no chloroplasts', 'Both have nucleus and cell membrane', 'Chloroplasts help in photosynthesis'],
      examples: ['Leaf cells contain chloroplasts', 'Cheek cells are animal cells without a cell wall'],
      summary: 'Plant cells and animal cells are similar but differ in cell wall and chloroplast presence.',
      difficulty: 'basic',
      xpReward: 60,
      questions: [
        { id: 1, question: 'Which is found in plant cells but not animal cells?', options: ['Nucleus', 'Cell membrane', 'Chloroplast', 'Cytoplasm'], correct: 2 },
        { id: 2, question: 'Plant cells have a?', options: ['Cell wall', 'Only mitochondria', 'No boundary', 'Only nucleus'], correct: 0 },
      ]
    },
    {
      id: 43, chapterId: 22, name: 'Digestive System',
      content: 'The digestive system breaks down food into nutrients the body can use. The process begins in the mouth, continues in the stomach, and nutrients are absorbed mainly in the small intestine.',
      keyPoints: ['Digestion starts in the mouth', 'Stomach mixes food with digestive juices', 'Small intestine absorbs nutrients', 'Large intestine absorbs water and forms waste'],
      examples: ['Chewing helps break food into smaller pieces', 'Villi in the small intestine increase absorption area'],
      summary: 'The digestive system breaks food into nutrients and absorbs them for energy and growth.',
      difficulty: 'basic',
      xpReward: 60,
      questions: [
        { id: 1, question: 'Where are nutrients mainly absorbed?', options: ['Stomach', 'Small intestine', 'Large intestine', 'Mouth'], correct: 1 },
        { id: 2, question: 'Digestion starts in the?', options: ['Mouth', 'Heart', 'Lungs', 'Kidney'], correct: 0 },
      ]
    },
    {
      id: 44, chapterId: 22, name: 'Circulatory System',
      content: 'The circulatory system transports blood, oxygen, and nutrients throughout the body. The heart pumps blood through blood vessels: arteries, veins, and capillaries.',
      keyPoints: ['Heart pumps blood', 'Arteries carry blood away from the heart', 'Veins carry blood to the heart', 'Capillaries help exchange gases and nutrients with cells'],
      examples: ['Pulse is caused by blood moving through arteries', 'Capillaries are very thin for easy exchange'],
      summary: 'The circulatory system moves blood around the body to supply oxygen and nutrients and remove wastes.',
      difficulty: 'intermediate',
      xpReward: 70,
      questions: [
        { id: 1, question: 'Which organ pumps blood?', options: ['Lungs', 'Heart', 'Stomach', 'Brain'], correct: 1 },
        { id: 2, question: 'Arteries carry blood?', options: ['To the heart', 'Away from the heart', 'Only to lungs', 'Only to brain'], correct: 1 },
      ]
    },
    {
      id: 45, chapterId: 23, name: 'Quadratic Equations — Basics',
      content: 'A quadratic equation is an equation where the highest power of the variable is 2. A common form is ax² + bx + c = 0 where a ≠ 0. Quadratic equations can often be solved by factorization for simple cases.',
      keyPoints: ['Highest power is 2', 'Standard form: ax² + bx + c = 0', 'a cannot be 0', 'Some quadratics can be solved by factorization'],
      examples: ['x² - 5x + 6 = 0 can factor to (x-2)(x-3)=0', 'x² = 9 has solutions x=3 and x=-3'],
      summary: 'Quadratic equations involve \(x^2\). Many can be solved by rewriting them and using factorization.',
      difficulty: 'intermediate',
      xpReward: 80,
      questions: [
        { id: 1, question: 'The highest power in a quadratic equation is?', options: ['1', '2', '3', '0'], correct: 1 },
        { id: 2, question: 'Which is a quadratic equation?', options: ['2x + 1 = 0', 'x² + 3x + 2 = 0', 'x³ - 1 = 0', '5 = 0'], correct: 1 },
      ]
    },
    {
      id: 46, chapterId: 23, name: 'Solving by Factorization',
      content: 'To solve some quadratic equations, we factor the expression and set each factor equal to zero. This works well when the quadratic can be factored into two linear factors.',
      keyPoints: ['Factor the quadratic expression', 'Use zero product rule: if ab=0 then a=0 or b=0', 'Check solutions by substitution', 'Not all quadratics factor nicely'],
      examples: ['x² - 7x + 12 = 0 → (x-3)(x-4)=0 → x=3,4', 'x² - 4 = 0 → (x-2)(x+2)=0 → x=2,-2'],
      summary: 'Factorization turns a quadratic into simpler parts. Set each factor to zero to find solutions.',
      difficulty: 'intermediate',
      xpReward: 90,
      questions: [
        { id: 1, question: 'If (x-5)(x+1)=0, x can be?', options: ['5 or -1', '5 only', '-1 only', '0'], correct: 0 },
        { id: 2, question: 'Factorization uses which rule?', options: ['Pythagoras', 'Zero product rule', 'Ohm’s law', 'Newton’s law'], correct: 1 },
      ]
    },
    {
      id: 47, chapterId: 24, name: 'Trigonometric Ratios',
      content: 'In a right-angled triangle, trigonometric ratios relate angles to side lengths. For an angle θ: sin θ = (opposite/hypotenuse), cos θ = (adjacent/hypotenuse), and tan θ = (opposite/adjacent).',
      keyPoints: ['Works in right-angled triangles', 'sin θ = opp/hyp', 'cos θ = adj/hyp', 'tan θ = opp/adj'],
      examples: ['If opposite=3 and hypotenuse=5, sin θ = 3/5', 'If adjacent=4 and hypotenuse=5, cos θ = 4/5'],
      summary: 'Trigonometric ratios help compare sides in right triangles. Memorize sin, cos, and tan definitions.',
      difficulty: 'intermediate',
      xpReward: 90,
      questions: [
        { id: 1, question: 'sin θ equals?', options: ['adj/hyp', 'opp/hyp', 'opp/adj', 'hyp/opp'], correct: 1 },
        { id: 2, question: 'tan θ equals?', options: ['opp/adj', 'adj/hyp', 'opp/hyp', 'hyp/adj'], correct: 0 },
      ]
    },
    {
      id: 48, chapterId: 24, name: 'Using Trigonometry',
      content: 'Trigonometry helps find unknown sides or angles in right triangles. If you know one angle and one side, you can use sin, cos, or tan to find another side.',
      keyPoints: ['Choose sin/cos/tan based on known sides', 'Rearrange the formula to solve', 'Angles are often measured in degrees', 'Check if the triangle is right-angled'],
      examples: ['If sin θ = 3/5 and hyp=10, opposite = 6', 'If tan θ = 3/4 and adjacent=8, opposite = 6'],
      summary: 'Use trigonometric ratios to solve right-triangle problems by plugging known values into the correct ratio.',
      difficulty: 'advanced',
      xpReward: 100,
      questions: [
        { id: 1, question: 'Which ratio uses opposite and adjacent?', options: ['sin', 'cos', 'tan', 'sec'], correct: 2 },
        { id: 2, question: 'Trigonometry ratios apply to which triangles?', options: ['Any triangle', 'Right-angled triangles', 'Only equilateral', 'Only isosceles'], correct: 1 },
      ]
    },
    {
      id: 49,
      name: 'Introduction to Data Structures',
      difficulty: 'basic',
      xpReward: 100,
      introduction: "Welcome to the world of Data Structures! Just like a well-organized library helps you find books quickly, data structures allow computers to manage information with lightning speed.",
      content: "A data structure is a specialized format for organizing, processing, retrieving, and storing data. It is the foundation of efficient algorithms.",
      keyPoints: [
        "Primitive vs. Non-Primitive: Integers vs. Arrays.",
        "Linear vs. Non-Linear: Sequences vs. Trees.",
        "Static vs. Dynamic: Fixed size vs. Growing size."
      ],
      detailedExplanation: "In computing, an array is the simplest linear data structure. It stores elements in contiguous memory locations, allowing for constant-time access. However, adding or removing elements can be expensive as it requires shifting other elements. On the other hand, Linked Lists offer dynamic sizing but require linear time to access a specific element.",
      examples: [
        "A stack of plates (Last-In, First-Out).",
        "A queue at a movie theater (First-In, First-Out).",
        "A contact list on your phone (Array/List)."
      ],
      diagramDesc: `
[ Index 0 | Index 1 | Index 2 | Index 3 ]
[  "Data" |  "Next" |  "Info" |  "Link" ]
 ──────────────────────────────────────
      Contiguous Memory Slots (Array)

[Data | Next] --> [Data | Next] --> NULL
      Linked List Representation
      `,
      summary: "Data structures are essential for writing efficient code. Arrays, Stacks, and Queues are the building blocks of every software application.",
      glossary: [
        { t: "LIFO", d: "Last-In, First-Out principle used in Stacks." },
        { t: "FIFO", d: "First-In, First-Out principle used in Queues." },
        { t: "Node", d: "A basic unit of a data structure, such as in a Linked List." }
      ],
      questions: [
        { id: 1, question: "Which data structure follows the LIFO principle?", options: ["Queue", "Stack", "Array", "Linked List"], correct: 1 },
        { id: 2, question: "What is the simplest linear data structure?", options: ["Tree", "Graph", "Array", "Stack"], correct: 2 }
      ]
    }
    ,
    {
      id: 50,
      chapterId: 9,
      name: 'Decimals (Chapter 2)',
      content: 'A decimal is another way to write fractions based on powers of 10. The decimal point separates the whole part from the fractional part. For example, 0.5 means five tenths and is equal to 5/10 = 1/2. The first digit after the decimal point is the tenths place, the second is the hundredths place, and the third is the thousandths place.',
      keyPoints: [
        'Decimal point separates whole and fractional parts',
        'Tenths, hundredths, thousandths are place values to the right of the decimal',
        '0.5 = 5/10 = 1/2',
        '0.25 = 25/100 = 1/4',
        'To compare decimals, compare place values from left to right'
      ],
      examples: [
        '0.7 means 7 tenths = 7/10',
        '2.34 means 2 and 34 hundredths = 234/100',
        '0.50 equals 0.5 (trailing zeros do not change the value)',
        'Compare 0.8 and 0.75: 0.80 > 0.75 so 0.8 is larger'
      ],
      summary: 'Decimals represent parts of a whole using base-10 place values. Use tenths/hundredths to read, compare, and connect decimals to fractions.',
      difficulty: 'basic',
      xpReward: 60,
      questions: [
        { id: 1, question: 'What place value is the first digit to the right of the decimal point?', options: ['Ones', 'Tenths', 'Hundredths', 'Thousands'], correct: 1 },
        { id: 2, question: '0.5 is equal to which fraction?', options: ['1/4', '1/2', '2/5', '5/2'], correct: 1 }
      ]
    }
  ];

  /* ── Chapters (Updating first chapter to include our new topic) ── */
  mockChapters[0].topics.push(49);
  // Add Decimals topic under Fractions & Decimals chapter
  mockChapters.find(c => c.id === 9)?.topics.push(50);

  return {
    students: mockStudents,
    mentors: mockMentors,
    courses: mockCourses,
    chapters: mockChapters,
    topics: mockTopics,
    sessions: [],
    doubts: []
  };
};
