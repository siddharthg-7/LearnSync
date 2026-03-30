import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Brain, FileText, Upload, X, ChevronDown, ChevronUp } from 'lucide-react';
import { callGemini } from '../utils/gemini';

/* ─────────────────────────────────────────────
   PDF text extractor  (no external lib needed —
   reads the raw text layer via FileReader)
───────────────────────────────────────────── */
const extractPdfText = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const raw = new Uint8Array(reader.result);
        // Pull printable ASCII runs ≥ 4 chars from the binary PDF stream
        let text = '';
        let run = '';
        for (let i = 0; i < raw.length; i++) {
          const c = raw[i];
          if (c >= 32 && c < 127) {
            run += String.fromCharCode(c);
          } else {
            if (run.length >= 4) text += run + ' ';
            run = '';
          }
        }
        if (run.length >= 4) text += run;
        resolve(text.slice(0, 12000)); // cap at ~12k chars for prompt safety
      } catch {
        resolve('');
      }
    };
    reader.readAsArrayBuffer(file);
  });

/* ─────────────────────────────────────────────
   System prompt builder
───────────────────────────────────────────── */
const buildSystemPrompt = (moduleContext, pdfText) => {
  const docSection = pdfText
    ? `\n\nATTACHED DOCUMENT CONTENT:\n"""\n${pdfText}\n"""`
    : moduleContext?.content
    ? `\n\nMODULE CONTENT:\n"""\n${moduleContext.content}\n"""`
    : '';

  return `You are an AI Tutor integrated into a learning platform.
${moduleContext?.title ? `The student is currently viewing the module: "${moduleContext.title}".` : ''}
${docSection}

STRICT RULES:
- Base ALL answers strictly on the document/module content above.
- If the answer is not present in the document, respond exactly: "This is not covered in the module."
- Never invent facts outside the provided content.

BEHAVIOR:
- Explain concepts clearly and step-by-step.
- Use examples where possible.
- Keep explanations beginner-friendly unless asked for advanced detail.
- Highlight key terms and definitions.
- Summarize sections before answering when relevant.

CAPABILITIES:
- Answer questions from the document
- Summarize sections or the entire module
- Generate quizzes from the content
- Explain difficult topics
- Provide real-world applications

TONE: Friendly, mentor-like, but precise. No unnecessary fluff.
OUTPUT: Use bullet points or numbered sections when helpful. Keep responses clean and readable.
FORMATTING: Plain text only. No asterisks, no markdown symbols, no hash headers.`;
};

/* ─────────────────────────────────────────────
   Quick-action chips
───────────────────────────────────────────── */
const QUICK_ACTIONS = [
  { label: '📋 Summarize module', prompt: 'Summarize this entire module in simple terms.' },
  { label: '❓ Key questions', prompt: 'Give me the most important questions from this module.' },
  { label: '🧠 Create a quiz', prompt: 'Create a 5-question multiple choice quiz from this module.' },
  { label: '🔑 Key terms', prompt: 'List and define all key terms from this module.' },
  { label: '🌍 Real-world use', prompt: 'Give real-world applications of the concepts in this module.' },
];

/* ─────────────────────────────────────────────
   Typing indicator
───────────────────────────────────────────── */
const TypingDots = ({ dark }) => (
  <div className="flex gap-1 py-1">
    {[0, 0.15, 0.3].map((delay, i) => (
      <div key={i} className={`w-2 h-2 rounded-full animate-bounce ${dark ? 'bg-indigo-400' : 'bg-blue-400'}`}
        style={{ animationDelay: `${delay}s` }} />
    ))}
  </div>
);

/* ─────────────────────────────────────────────
   Message bubble
───────────────────────────────────────────── */
const MessageBubble = ({ message, dark }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          dark ? 'bg-indigo-500/15 border border-indigo-500/20' : 'bg-blue-100'
        }`}>
          <Sparkles className={`w-4 h-4 ${dark ? 'text-indigo-400' : 'text-blue-600'}`} />
        </div>
      )}
      <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
        isUser
          ? 'text-white rounded-br-sm'
          : dark
          ? 'text-zinc-200 rounded-bl-sm'
          : 'text-gray-800 rounded-bl-sm'
      }`} style={isUser
        ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }
        : dark
        ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }
        : { background: '#f8fafc', border: '1px solid #e2e8f0' }
      }>
        {message.content}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   PDF upload strip
───────────────────────────────────────────── */
const PdfStrip = ({ pdfFile, onUpload, onRemove, dark }) => {
  const fileRef = useRef();
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium ${
      dark
        ? 'bg-white/4 border-white/8 text-zinc-400'
        : 'bg-gray-50 border-gray-200 text-gray-500'
    }`}>
      <FileText className="w-4 h-4 flex-shrink-0" />
      {pdfFile ? (
        <>
          <span className="flex-1 truncate">{pdfFile.name}</span>
          <button onClick={onRemove} className="hover:text-red-400 transition-colors flex-shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </>
      ) : (
        <>
          <span className="flex-1">Attach a PDF to ground answers in your document</span>
          <button
            onClick={() => fileRef.current.click()}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors flex-shrink-0 ${
              dark ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            <Upload className="w-3 h-3" /> Upload PDF
          </button>
          <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={onUpload} />
        </>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Quiz renderer (inline in chat)
───────────────────────────────────────────── */
const InlineQuiz = ({ quiz, answers, submitted, onAnswer, onSubmit, dark }) => (
  <div className="space-y-4 mt-2">
    {quiz.questions.map((q, qi) => (
      <div key={qi} className={`p-4 rounded-xl border ${
        dark ? 'bg-white/4 border-white/8' : 'bg-gray-50 border-gray-200'
      }`}>
        <p className={`font-semibold text-sm mb-3 ${dark ? 'text-zinc-100' : 'text-gray-900'}`}>
          {qi + 1}. {q.question}
        </p>
        <div className="space-y-2">
          {q.options.map((opt, oi) => {
            const selected = answers[qi] === oi;
            const correct = submitted && oi === q.correct;
            const wrong = submitted && selected && oi !== q.correct;
            return (
              <label key={oi} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-sm ${
                wrong   ? 'border-red-400 bg-red-500/10 text-red-400' :
                correct ? 'border-emerald-400 bg-emerald-500/10 text-emerald-400' :
                selected
                  ? dark ? 'border-indigo-500/60 bg-indigo-500/15 text-zinc-100' : 'border-blue-500 bg-blue-50 text-gray-900'
                  : dark ? 'border-white/8 bg-white/3 text-zinc-300 hover:border-white/20' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}>
                <input type="radio" name={`q-${qi}`} checked={selected}
                  onChange={() => !submitted && onAnswer(qi, oi)}
                  className="w-4 h-4 accent-indigo-500" />
                {opt}
                {correct && <span className="ml-auto text-xs">✓</span>}
                {wrong   && <span className="ml-auto text-xs">✗</span>}
              </label>
            );
          })}
        </div>
      </div>
    ))}
    {!submitted && (
      <button
        onClick={onSubmit}
        disabled={Object.keys(answers).length < quiz.questions.length}
        className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
      >
        Submit Quiz
      </button>
    )}
  </div>
);

/* ─────────────────────────────────────────────
   Main ChatbotPanel
───────────────────────────────────────────── */
const ChatbotPanel = ({
  isOpen,
  context       = null,   // { title, content }
  onQuizGenerated = null,
  studentId     = null,
  panelMode     = false,  // true → dark slide-in panel (from Courses page)
}) => {
  const [messages, setMessages]         = useState([]);
  const [input, setInput]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [pdfFile, setPdfFile]           = useState(null);
  const [pdfText, setPdfText]           = useState('');
  const [pdfLoading, setPdfLoading]     = useState(false);
  const [activeQuiz, setActiveQuiz]     = useState(null);   // { questions }
  const [quizAnswers, setQuizAnswers]   = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showChips, setShowChips]       = useState(true);
  const messagesEndRef = useRef(null);
  const dark = panelMode;

  /* Welcome message & Auto-prompt */
  useEffect(() => {
    if (!isOpen) return;

    // Reset state
    setActiveQuiz(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setShowChips(true);

    const greeting = context
      ? `I'm your AI Tutor for "${context.title}".\n\nYou can ask me anything about this module — or upload a PDF to ground my answers in your document.\n\nTry one of the quick actions below, or type your own question.`
      : `Hi! I'm your AI Tutor.\n\nUpload a PDF or ask me anything about your studies.`;
    
    setMessages([{ role: 'assistant', content: greeting }]);
    setInput('');

    // Handle auto-prompt if provided
    if (context?.autoPrompt) {
      setTimeout(() => {
        sendMessage(context.autoPrompt);
      }, 500);
    }
  }, [context, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  /* PDF upload */
  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfFile(file);
    setPdfLoading(true);
    const text = await extractPdfText(file);
    setPdfText(text);
    setPdfLoading(false);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `PDF "${file.name}" loaded. I'll now base all my answers strictly on this document. What would you like to know?`
    }]);
  };

  const handlePdfRemove = () => {
    setPdfFile(null);
    setPdfText('');
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: 'PDF removed. I\'ll now answer based on the module content.'
    }]);
  };

  /* Parse quiz JSON from AI response */
  const tryParseQuiz = (text) => {
    try {
      const match = text.match(/\{[\s\S]*"questions"[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed.questions) && parsed.questions.length > 0) return parsed;
      }
    } catch { /* ignore */ }
    return null;
  };

  /* Core send */
  const sendMessage = async (userText) => {
    if (!userText.trim() || loading) return;
    setInput('');
    setShowChips(false);
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setLoading(true);

    const systemPrompt = buildSystemPrompt(context, pdfText);
    const isQuizRequest = /quiz|questions|test me/i.test(userText);

    const fullPrompt = isQuizRequest
      ? `${systemPrompt}\n\nStudent request: ${userText}\n\nGenerate a quiz. Respond ONLY with valid JSON:\n{"questions":[{"question":"...","options":["A","B","C","D"],"correct":0}]}`
      : `${systemPrompt}\n\nStudent question: ${userText}\n\nAnswer strictly based on the document above. Plain text only, no markdown symbols.`;

    try {
      const response = await callGemini(fullPrompt);
      let raw = typeof response.data === 'string' ? response.data : '';

      // Strip markdown symbols
      const clean = raw
        .replace(/\*\*/g, '').replace(/\*/g, '')
        .replace(/#{1,6}\s/g, '').replace(/`{1,3}/g, '')
        .trim();

      // Try to extract quiz
      const quiz = isQuizRequest ? tryParseQuiz(raw) : null;
      if (quiz) {
        setActiveQuiz(quiz);
        setQuizAnswers({});
        setQuizSubmitted(false);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Here's your quiz on "${context?.title || 'this module'}". Answer all questions then submit.`,
          quiz
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: clean || 'This is not covered in the module.' }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSubmit = () => {
    if (!activeQuiz) return;
    const correct = activeQuiz.questions.filter((q, i) => quizAnswers[i] === q.correct).length;
    const score = (correct / activeQuiz.questions.length) * 100;
    setQuizSubmitted(true);
    const msg = score >= 80 ? 'Excellent work! 🎉' : score >= 60 ? 'Good effort! 👍' : 'Keep practicing! 💪';
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `${msg}\nYou scored ${correct}/${activeQuiz.questions.length} (${score.toFixed(0)}%).`
    }]);
    onQuizGenerated?.({ topic: context?.title || 'General', score, correctCount: correct, totalQuestions: activeQuiz.questions.length, studentId });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  if (!isOpen) return null;

  /* ── Shared input area ── */
  const InputArea = () => (
    <div className={`flex-shrink-0 p-4 space-y-3 ${dark ? '' : 'border-t border-gray-200 bg-white'}`}
      style={dark ? { borderTop: '1px solid rgba(255,255,255,0.06)', background: '#0d0d14' } : {}}>

      {/* PDF strip */}
      <PdfStrip pdfFile={pdfFile} onUpload={handlePdfUpload} onRemove={handlePdfRemove} dark={dark} />

      {/* Quick-action chips */}
      {showChips && (
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((a) => (
            <button key={a.label} onClick={() => sendMessage(a.prompt)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover:scale-105 active:scale-95 ${
                dark
                  ? 'bg-white/5 border-white/10 text-zinc-300 hover:bg-indigo-500/15 hover:border-indigo-500/30 hover:text-indigo-300'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600'
              }`}>
              {a.label}
            </button>
          ))}
        </div>
      )}

      {/* Text input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={pdfFile ? `Ask about "${pdfFile.name}"…` : context ? `Ask about "${context.title}"…` : 'Ask me anything about this module…'}
          disabled={loading || pdfLoading}
          className={`flex-1 px-4 py-3 rounded-xl text-sm transition-all focus:outline-none ${
            dark
              ? 'text-zinc-100 placeholder-zinc-600 focus:ring-1 focus:ring-indigo-500/50'
              : 'text-gray-900 placeholder-gray-400 border border-gray-200 focus:ring-2 focus:ring-blue-500'
          }`}
          style={dark ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' } : {}}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || pdfLoading || !input.trim()}
          className="px-4 rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-40 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {pdfLoading && (
        <p className={`text-xs text-center ${dark ? 'text-zinc-500'
 : 'text-gray-400'}`}>Extracting PDF content…</p>
      )}
    </div>
  );

  /* ── Messages list ── */
  const MessagesList = () => (
    <div className={`flex-1 overflow-y-auto p-4 space-y-4`}
      style={{ scrollbarWidth: 'thin', scrollbarColor: dark ? 'rgba(99,102,241,0.3) transparent' : 'rgba(0,0,0,0.1) transparent' }}>
      {messages.map((msg, i) => (
        <div key={i}>
          <MessageBubble message={msg} dark={dark} />
          {/* Render inline quiz attached to a message */}
          {msg.quiz && (
            <div className="mt-3 ml-11">
              <InlineQuiz
                quiz={msg.quiz}
                answers={quizAnswers}
                submitted={quizSubmitted}
                onAnswer={(qi, oi) => setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                onSubmit={handleQuizSubmit}
                dark={dark}
              />
            </div>
          )}
        </div>
      ))}
      {loading && (
        <div className="flex gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
            dark ? 'bg-indigo-500/15 border border-indigo-500/20' : 'bg-blue-100'
          }`}>
            <Sparkles className={`w-4 h-4 ${dark ? 'text-indigo-400' : 'text-blue-600'}`} />
          </div>
          <div className={`px-4 py-3 rounded-2xl rounded-bl-sm ${
            dark ? 'bg-white/5 border border-white/8' : 'bg-gray-50 border border-gray-200'
          }`}>
            <TypingDots dark={dark} />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );

  /* ── Panel mode (dark slide-in from Courses page) ── */
  if (panelMode) {
    return (
      <div className="flex flex-col h-full" style={{ background: '#0d0d14' }}>
        <MessagesList />
        <InputArea />
      </div>
    );
  }

  /* ── Standalone page mode (Layout AI Tutor nav item) ── */
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">AI Tutor</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {pdfFile
            ? `Answering from: ${pdfFile.name}`
            : context
            ? `Module: ${context.title}`
            : 'Upload a PDF or ask anything about your studies'}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden"
        style={{ height: 'calc(100vh - 220px)' }}>
        <MessagesList />
        <InputArea />
      </div>
    </div>
  );
};

export default ChatbotPanel;
