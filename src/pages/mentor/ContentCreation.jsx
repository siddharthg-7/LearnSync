import { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { BookOpen, Plus, Sparkles, Eye, Upload, FileText, X, Loader2 } from 'lucide-react';
import { callGemini } from '../../utils/gemini';
import { extractTextFromPDF } from '../../utils/pdfExtractor';

const ContentCreation = () => {
  const { appData, currentUser, addCourse, addChapter, addTopic } = useApp();
  const [step, setStep] = useState('select'); // select, course, chapter, topic
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfExtracting, setPdfExtracting] = useState(false);
  const [pdfInfo, setPdfInfo] = useState(null);
  const fileInputRef = useRef(null);

  const [courseForm, setCourseForm] = useState({
    name: '',
    subject: '',
    level: 'beginner'
  });

  const [chapterForm, setChapterForm] = useState({
    name: '',
    order: 1
  });

  const [topicForm, setTopicForm] = useState({
    name: '',
    content: '',
    difficulty: 'basic',
    xpReward: 50
  });

  const mentor = appData.mentors.find(m => m.id === currentUser?.id) || appData.mentors[0];
  const mentorCourses = appData.courses.filter(c => c.createdBy === mentor.id);

  const handleCreateCourse = () => {
    if (courseForm.name && courseForm.subject) {
      const newCourse = {
        ...courseForm,
        createdBy: mentor.id,
        chapters: []
      };
      addCourse(newCourse);
      setCourseForm({ name: '', subject: '', level: 'beginner' });
      setSuccessMsg('Course created successfully!');
      setTimeout(() => { setSuccessMsg(''); setStep('select'); }, 1500);
    }
  };

  const handleCreateChapter = () => {
    if (chapterForm.name && selectedCourse) {
      const newChapter = {
        ...chapterForm,
        courseId: selectedCourse.id,
        topics: []
      };
      addChapter(newChapter);
      setChapterForm({ name: '', order: 1 });
      setSuccessMsg('Chapter added successfully!');
      setTimeout(() => { setSuccessMsg(''); setStep('select'); }, 1500);
    }
  };

  const handleProcessWithAI = async () => {
    if (!topicForm.content) return;

    setLoading(true);
    try {
      const prompt = `Process this educational content into structured format:

Content: ${topicForm.content}

Generate a JSON response with:
{
  "keyPoints": ["point 1", "point 2", "point 3", "point 4"],
  "examples": ["example 1", "example 2", "example 3"],
  "summary": "brief summary",
  "questions": [
    {
      "question": "question text",
      "options": ["option1", "option2", "option3", "option4"],
      "correct": 0
    }
  ]
}`;

      const response = await callGemini(prompt);
      
      // Try to parse JSON from response
      try {
        const jsonMatch = response.data.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const processed = JSON.parse(jsonMatch[0]);
          setPreview(processed);
        } else {
          // Fallback to mock data
          setPreview({
            keyPoints: [
              'Understanding the core concept',
              'Practical applications',
              'Common mistakes to avoid',
              'Best practices'
            ],
            examples: [
              'Example 1: Basic application',
              'Example 2: Intermediate usage',
              'Example 3: Advanced scenario'
            ],
            summary: 'This topic covers essential concepts for understanding the subject matter.',
            questions: [
              {
                question: 'What is the main concept?',
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correct: 0
              },
              {
                question: 'How do you apply this?',
                options: ['Method 1', 'Method 2', 'Method 3', 'Method 4'],
                correct: 1
              }
            ]
          });
        }
      } catch {
        // Fallback
        setPreview({
          keyPoints: ['Key concept 1', 'Key concept 2', 'Key concept 3'],
          examples: ['Example 1', 'Example 2'],
          summary: 'Summary of the topic',
          questions: []
        });
      }
    } catch (error) {
      console.error('Error processing content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = () => {
    if (topicForm.name && topicForm.content && selectedChapter && preview) {
      const newTopic = {
        ...topicForm,
        chapterId: selectedChapter.id,
        keyPoints: preview.keyPoints,
        examples: preview.examples,
        summary: preview.summary,
        questions: preview.questions.map((q, i) => ({ ...q, id: i + 1 }))
      };
      addTopic(newTopic);
      setTopicForm({ name: '', content: '', difficulty: 'basic', xpReward: 50 });
      setPreview(null);
      setSuccessMsg('Topic published successfully!');
      setTimeout(() => { setSuccessMsg(''); setStep('select'); }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Content Creation</h1>
        <p className="text-gray-500 mt-1">Create courses, chapters, and topics for students</p>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium text-sm flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          {successMsg}
        </div>
      )}

      {/* Action Buttons */}
      {step === 'select' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStep('course')}>
            <div className="text-center p-6">
              <Plus className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Create Course</h3>
              <p className="text-sm text-gray-600">Start a new course</p>
            </div>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStep('chapter')}>
            <div className="text-center p-6">
              <BookOpen className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Add Chapter</h3>
              <p className="text-sm text-gray-600">Add to existing course</p>
            </div>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStep('topic')}>
            <div className="text-center p-6">
              <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Create Topic</h3>
              <p className="text-sm text-gray-600">Add topic with AI</p>
            </div>
          </Card>
        </div>
      )}

      {/* Create Course Form */}
      {step === 'course' && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Course</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Course Name</label>
              <input
                type="text"
                value={courseForm.name}
                onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Advanced Mathematics"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Subject</label>
              <select
                value={courseForm.subject}
                onChange={(e) => setCourseForm({ ...courseForm, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select subject</option>
                {mentor.subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Level</label>
              <select
                value={courseForm.level}
                onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateCourse} disabled={!courseForm.name || !courseForm.subject}>
                Create Course
              </Button>
              <Button variant="secondary" onClick={() => setStep('select')}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Create Chapter Form */}
      {step === 'chapter' && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Chapter</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Select Course</label>
              <select
                value={selectedCourse?.id || ''}
                onChange={(e) => setSelectedCourse(mentorCourses.find(c => c.id === e.target.value) || allCourses.find(c => c.id === e.target.value))}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a course</option>
                {[...mentorCourses, ...appData.courses.filter(c => !mentorCourses.find(mc => mc.id === c.id))].map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Chapter Name</label>
              <input
                type="text"
                value={chapterForm.name}
                onChange={(e) => setChapterForm({ ...chapterForm, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Introduction to Algebra"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Chapter Order</label>
              <input
                type="number"
                value={chapterForm.order}
                onChange={(e) => setChapterForm({ ...chapterForm, order: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateChapter} disabled={!chapterForm.name || !selectedCourse}>
                Add Chapter
              </Button>
              <Button variant="secondary" onClick={() => setStep('select')}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Create Topic Form */}
      {step === 'topic' && (
        <div className="space-y-4">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Topic with AI</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Select Chapter</label>
                <select
                  value={selectedChapter?.id || ''}
                  onChange={(e) => {
                    const chapter = appData.chapters.find(ch => ch.id === e.target.value);
                    setSelectedChapter(chapter);
                    if (chapter) {
                      const course = appData.courses.find(c => (c.chapters || []).includes(chapter.id));
                      setSelectedCourse(course);
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a chapter</option>
                  {appData.chapters.length > 0 ? (
                    appData.chapters.map(chapter => {
                      const course = appData.courses.find(c => (c.chapters || []).includes(chapter.id));
                      return (
                        <option key={chapter.id} value={chapter.id}>
                          {chapter.name} {course ? `(${course.name})` : ''}
                        </option>
                      );
                    })
                  ) : (
                    <option disabled>No chapters yet — create a chapter first</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Topic Name</label>
                <input
                  type="text"
                  value={topicForm.name}
                  onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Linear Equations"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Content</label>
                
                {/* PDF Upload Zone */}
                <div className="mb-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      setPdfFile(file);
                      setPdfExtracting(true);
                      
                      try {
                        let extractedText = '';
                        let pageCount = 0;
                        
                        if (file.name.endsWith('.pdf')) {
                          const result = await extractTextFromPDF(file);
                          extractedText = result.text;
                          pageCount = result.pageCount;
                        } else {
                          // .txt file
                          extractedText = await file.text();
                          pageCount = 1;
                        }
                        
                        setTopicForm(prev => ({ ...prev, content: extractedText }));
                        setPdfInfo({ name: file.name, pages: pageCount, chars: extractedText.length });
                        
                        // Auto-fill topic name from filename if empty
                        if (!topicForm.name) {
                          const nameFromFile = file.name.replace(/\.(pdf|txt)$/i, '').replace(/[_-]/g, ' ');
                          setTopicForm(prev => ({ ...prev, name: nameFromFile }));
                        }
                      } catch (err) {
                        console.error('Error extracting PDF text:', err);
                        setSuccessMsg('');
                        alert('Could not extract text from this PDF. Please try pasting the content manually.');
                      } finally {
                        setPdfExtracting(false);
                      }
                    }}
                  />
                  
                  {!pdfInfo ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={pdfExtracting}
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center gap-2 text-gray-500 hover:text-blue-600"
                    >
                      {pdfExtracting ? (
                        <>
                          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                          <span className="text-sm font-medium text-blue-600">Extracting text from PDF...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8" />
                          <span className="text-sm font-medium">Upload PDF or Text File</span>
                          <span className="text-xs text-gray-400">Supported: .pdf, .txt</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                      <FileText className="w-8 h-8 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{pdfInfo.name}</p>
                        <p className="text-xs text-gray-500">{pdfInfo.pages} page{pdfInfo.pages > 1 ? 's' : ''} • {pdfInfo.chars.toLocaleString()} characters extracted</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPdfFile(null);
                          setPdfInfo(null);
                          setTopicForm(prev => ({ ...prev, content: '' }));
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="p-1 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Divider */}
                {!pdfInfo && (
                  <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                    <div className="relative flex justify-center text-xs"><span className="px-2 bg-white text-gray-400">or type content manually</span></div>
                  </div>
                )}

                <textarea
                  value={topicForm.content}
                  onChange={(e) => setTopicForm({ ...topicForm, content: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 text-sm"
                  placeholder="Enter the topic content here or upload a PDF above..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={topicForm.difficulty}
                    onChange={(e) => setTopicForm({ ...topicForm, difficulty: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="basic">Basic</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">XP Reward</label>
                  <input
                    type="number"
                    value={topicForm.xpReward}
                    onChange={(e) => setTopicForm({ ...topicForm, xpReward: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="10"
                    step="10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleProcessWithAI}
                  disabled={!topicForm.content || loading}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {loading ? 'Processing...' : 'Process with AI'}
                </Button>
                <Button variant="secondary" onClick={() => setStep('select')}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>

          {/* Preview */}
          {preview && (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI Generated Content Preview</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Key Points</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {preview.keyPoints.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Examples</h4>
                  <div className="space-y-2">
                    {preview.examples.map((example, i) => (
                      <div key={i} className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-gray-700">{example}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
                  <p className="text-gray-700 bg-green-50 p-3 rounded-lg">{preview.summary}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Quiz Questions ({preview.questions.length})</h4>
                  <div className="space-y-2">
                    {preview.questions.map((q, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900 mb-2">{i + 1}. {q.question}</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {q.options.map((opt, j) => (
                            <li key={j} className={j === q.correct ? 'text-green-600 font-medium' : ''}>
                              {opt} {j === q.correct && '✓'}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleCreateTopic}
                  disabled={!topicForm.name || !selectedChapter}
                  className="w-full"
                >
                  Publish Topic
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* My Courses */}
      {step === 'select' && mentorCourses.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Courses</h2>
          <div className="space-y-2">
            {mentorCourses.map(course => (
              <div key={course.id} className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{course.name}</p>
                  <p className="text-sm text-gray-600">{course.subject} • {course.level}</p>
                </div>
                <span className="text-sm text-gray-500">{course.chapters.length} chapters</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ContentCreation;
