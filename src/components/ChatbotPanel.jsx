import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Sparkles, Brain, Mic, MicOff, Volume2, VolumeX, Globe } from 'lucide-react';
import { callGemini } from '../utils/gemini';
import Button from './Button';

const LANGUAGES = [
  { code: 'en-US', label: 'English', flag: '🇬🇧', ttsLang: 'en', geminiInstruction: 'Respond in English.' },
  { code: 'hi-IN', label: 'हिन्दी', flag: '🇮🇳', ttsLang: 'hi', geminiInstruction: 'Respond in Hindi (हिन्दी). Use Devanagari script.' },
  { code: 'te-IN', label: 'తెలుగు', flag: '🇮🇳', ttsLang: 'te', geminiInstruction: 'Respond in Telugu (తెలుగు). Use Telugu script.' },
];

const ChatbotPanel = ({ isOpen, context = null, onQuizGenerated = null, studentId = null }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationCount, setConversationCount] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [voiceModeEnabled, setVoiceModeEnabled] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const errorTimeoutRef = useRef(null);
  const ttsAudioRef = useRef(null);

  // Split text into speakable chunks (Google TTS has ~200 char limit)
  const chunkText = (text, maxLen = 190) => {
    const chunks = [];
    let rest = text;
    while (rest.length > 0) {
      if (rest.length <= maxLen) { chunks.push(rest); break; }
      let i = rest.lastIndexOf('।', maxLen);  // Hindi/Telugu sentence end
      if (i < 30) i = rest.lastIndexOf('.', maxLen);
      if (i < 30) i = rest.lastIndexOf(' ', maxLen);
      if (i < 30) i = maxLen;
      chunks.push(rest.substring(0, i + 1).trim());
      rest = rest.substring(i + 1).trim();
    }
    return chunks;
  };

  // Text-to-Speech: Speak in any language
  const speakText = useCallback((text) => {
    if (!text) return;

    // Stop any current playback
    if (ttsAudioRef.current) { ttsAudioRef.current.pause(); ttsAudioRef.current = null; }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    // For English, use native browser TTS
    if (selectedLang.ttsLang === 'en') {
      if (!('speechSynthesis' in window)) return;
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synth.speak(utterance);
      return;
    }

    // For Hindi/Telugu, use Google Translate TTS
    const langCode = selectedLang.ttsLang; // 'hi' or 'te'
    const chunks = chunkText(text);
    let idx = 0;
    setIsSpeaking(true);

    const playNext = () => {
      if (idx >= chunks.length) { setIsSpeaking(false); return; }
      const q = encodeURIComponent(chunks[idx]);
      const audio = new Audio(`/tts-api?q=${q}&tl=${langCode}`);
      ttsAudioRef.current = audio;
      audio.onended = () => { idx++; playNext(); };
      audio.onerror = () => { console.error('[TTS] Audio chunk failed'); idx++; playNext(); };
      audio.play().catch(err => { console.error('[TTS] Play error:', err); setIsSpeaking(false); });
    };
    playNext();
  }, [selectedLang]);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setVoiceError('');
  }, [setVoiceError]);

  const requestMicrophonePermissionAndStart = useCallback(() => {
    if (!recognitionRef.current) {
      setVoiceError('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    const startRecognition = () => {
      try {
        recognitionRef.current?.start();
      } catch {
        setVoiceError('Could not start voice input. Please try again.');
      }
    };

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setVoiceError('');
          startRecognition();
        })
        .catch((err) => {
          if (err.name === 'NotAllowedError') {
            setVoiceError('Microphone permission denied. Please allow access.');
          } else if (err.name === 'NotFoundError') {
            setVoiceError('No microphone found. Please connect one and try again.');
          } else {
            setVoiceError('Could not access microphone. Please check your settings.');
          }
        });
    } else {
      setVoiceError('');
      startRecognition();
    }
  }, [setVoiceError]);

  // Handle sending voice message
  const handleSendVoiceMessage = useCallback(async (transcript) => {
    if (!transcript.trim()) return;

    const userMessage = transcript.trim();
    setInput('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    setConversationCount(prev => prev + 1);

    try {
      let prompt = userMessage;
      const langInstr = selectedLang.geminiInstruction;
      
      if (context) {
        prompt = `${langInstr}\nTopic: ${context.title}\nContent: ${context.content}\n\nStudent question: ${userMessage}\n\nProvide a clear, concise explanation in plain text. Do not use asterisks, markdown formatting, or special characters. Write in simple paragraphs.`;
      } else {
        prompt = `${langInstr}\nStudent asks: ${userMessage}\n\nProvide a helpful, educational response in plain text. Do not use asterisks, markdown formatting, bullet points, or special characters. Write in simple, clear paragraphs suitable for a student.`;
      }

      const response = await callGemini(prompt);
      
      let cleanedResponse = typeof response.data === 'string' ? response.data : 'Let me help you with that.';
      cleanedResponse = cleanedResponse
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/#{1,6}\s/g, '')
        .replace(/`{1,3}/g, '')
        .trim();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: cleanedResponse
      }]);
      
      // Always speak back when question was asked via voice
      speakText(cleanedResponse);
      
      if (conversationCount + 1 >= 2 && !showQuiz && !quizSubmitted) {
        setTimeout(() => {
          const quizSuggestion = "Would you like to take a quick quiz to test your understanding of what we discussed?";
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: quizSuggestion
          }]);
          speakText(quizSuggestion);
        }, 1000);
      }
    } catch {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  }, [context, conversationCount, showQuiz, quizSubmitted, speakText]);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = selectedLang.code;
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onstart = () => {
        setVoiceError('');
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        setVoiceError('');
        
        setVoiceError('✓ Got it! Sending your question...');
        
        setTimeout(() => {
          setVoiceError('');
          handleSendVoiceMessage(transcript);
        }, 500);
      };

      recognitionRef.current.onerror = (event) => {
        setIsListening(false);
        
        if (errorTimeoutRef.current) {
          clearTimeout(errorTimeoutRef.current);
        }
        
        let errorMessage = '';
        switch (event.error) {
          case 'no-speech':
            errorMessage = '🎤 No speech detected. Click mic and speak immediately!';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not found. Please check your device.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please allow access.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your connection.';
            break;
          case 'aborted':
            break;
          default:
            errorMessage = `Voice input error: ${event.error}`;
        }
        
        if (errorMessage) {
          setVoiceError(errorMessage);
          errorTimeoutRef.current = setTimeout(() => {
            setVoiceError('');
          }, 5000);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      // Force load voices
      synthRef.current.getVoices();
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [handleSendVoiceMessage, selectedLang]);

  useEffect(() => {
    if (context) {
      const welcomeMessage = `I'm here to help you understand "${context.title}". Ask me anything about this topic.`;
      setMessages([{
        role: 'assistant',
        content: welcomeMessage
      }]);
      if (autoSpeak) {
        speakText(welcomeMessage);
      }
    } else {
      const welcomeMessage = "Hi! I'm your AI learning assistant. How can I help you today?";
      setMessages([{
        role: 'assistant',
        content: welcomeMessage
      }]);
      if (autoSpeak) {
        speakText(welcomeMessage);
      }
    }
    setConversationCount(0);
    setShowQuiz(false);
    setGeneratedQuiz(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;

    if (voiceModeEnabled && !isListening) {
      requestMicrophonePermissionAndStart();
      return;
    }

    if (!voiceModeEnabled && isListening) {
      stopRecognition();
    }
  }, [voiceModeEnabled, isOpen, isListening, requestMicrophonePermissionAndStart, stopRecognition]);

  useEffect(() => {
    if (!isOpen && voiceModeEnabled) {
      stopRecognition();
      setVoiceModeEnabled(false);
    }
  }, [isOpen, voiceModeEnabled, stopRecognition]);

  const toggleListening = () => {
    if (isListening) {
      stopRecognition();
      return;
    }

    requestMicrophonePermissionAndStart();
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (ttsAudioRef.current) { ttsAudioRef.current.pause(); ttsAudioRef.current = null; }
    setIsSpeaking(false);
  };

  const toggleAutoSpeak = () => {
    setAutoSpeak(!autoSpeak);
    if (isSpeaking) {
      stopSpeaking();
    }
  };

  const handleGenerateQuiz = async () => {
    setLoading(true);
    setShowQuiz(true);
    
    try {
      // Build context from actual conversation history
      const conversationHistory = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => `${m.role === 'user' ? 'Student' : 'AI Tutor'}: ${m.content}`)
        .join('\n');
      
      const topicContext = context 
        ? `Topic: ${context.title}\nContent: ${context.content}\n\nConversation so far:\n${conversationHistory}` 
        : `Conversation so far:\n${conversationHistory}`;
      
      const prompt = `${topicContext}

Based ONLY on the conversation above, generate a quiz with 3 multiple-choice questions that test the student's understanding of what was actually discussed. The questions must be specific to the topics covered in the conversation, not generic.

Respond ONLY with valid JSON in this exact format, no additional text before or after:
{
  "questions": [
    {
      "question": "A specific question based on what was discussed",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0
    },
    {
      "question": "Another specific question based on the conversation",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 1
    },
    {
      "question": "A third specific question about the discussed topic",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 2
    }
  ]
}`;

      const response = await callGemini(prompt);
      
      let quizData;
      const jsonMatch = response.data.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        quizData = JSON.parse(jsonMatch[0]);
      }
      
      if (!quizData || !quizData.questions || quizData.questions.length === 0) {
        throw new Error('Could not generate quiz questions');
      }
      
      setGeneratedQuiz(quizData);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I've created a quiz based on what we just discussed. Answer the questions below!`
      }]);
    } catch (err) {
      console.error('Quiz generation error:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I had trouble creating the quiz. Please try asking me more questions first, then try again.'
      }]);
      setShowQuiz(false);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSubmit = () => {
    if (!generatedQuiz) return;
    
    const correctCount = generatedQuiz.questions.filter((q, idx) => 
      quizAnswers[idx] === q.correct
    ).length;
    
    const score = (correctCount / generatedQuiz.questions.length) * 100;
    
    setQuizSubmitted(true);
    
    const message = score >= 80 ? 'Excellent work!' : score >= 60 ? 'Good job!' : 'Keep practicing!';
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `${message} You scored ${correctCount}/${generatedQuiz.questions.length} (${score.toFixed(0)}%)`
    }]);
    
    if (onQuizGenerated) {
      onQuizGenerated({
        topic: context?.title || 'General',
        score,
        correctCount,
        totalQuestions: generatedQuiz.questions.length,
        studentId
      });
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    setConversationCount(prev => prev + 1);

    try {
      let prompt = userMessage;
      const langInstr = selectedLang.geminiInstruction;
      
      if (context) {
        prompt = `${langInstr}\nTopic: ${context.title}\nContent: ${context.content}\n\nStudent question: ${userMessage}\n\nProvide a clear, concise explanation in plain text. Do not use asterisks, markdown formatting, or special characters. Write in simple paragraphs.`;
      } else {
        prompt = `${langInstr}\nStudent asks: ${userMessage}\n\nProvide a helpful, educational response in plain text. Do not use asterisks, markdown formatting, bullet points, or special characters. Write in simple, clear paragraphs suitable for a student.`;
      }

      const response = await callGemini(prompt);
      
      let cleanedResponse = typeof response.data === 'string' ? response.data : 'Let me help you with that.';
      cleanedResponse = cleanedResponse
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/#{1,6}\s/g, '')
        .replace(/`{1,3}/g, '')
        .trim();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: cleanedResponse
      }]);
      
      // Speak back if voice mode or auto-speak is on
      if (autoSpeak || voiceModeEnabled) {
        speakText(cleanedResponse);
      }
      
      if (conversationCount + 1 >= 2 && !showQuiz && !quizSubmitted) {
        setTimeout(() => {
          const quizSuggestion = "Would you like to take a quick quiz to test your understanding of what we discussed?";
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: quizSuggestion
          }]);
          if (autoSpeak || voiceModeEnabled) {
            speakText(quizSuggestion);
          }
        }, 1000);
      }
    } catch {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="h-full flex flex-col bg-white">

      {/* ── Voice controls bar (compact) ── */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-100 bg-slate-50 flex-shrink-0">
        {context && (
          <span className="flex-1 text-xs text-slate-500 font-medium truncate">
            Topic: {context.title}
          </span>
        )}
        {!context && (
          <span className="flex-1 text-xs text-slate-500">Ask me anything about your studies</span>
        )}

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setVoiceModeEnabled(prev => !prev)}
            className={`p-2 rounded-xl transition-all text-xs flex items-center gap-1.5 ${
              voiceModeEnabled
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title={voiceModeEnabled ? 'Voice mode ON' : 'Enable voice mode'}
          >
            <Mic className="w-3.5 h-3.5" />
            {voiceModeEnabled && <span className="text-xs font-medium hidden sm:inline">Live</span>}
          </button>

          <button
            onClick={toggleAutoSpeak}
            className={`p-2 rounded-xl transition-all ${
              autoSpeak
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title={autoSpeak ? 'Auto-speak ON' : 'Auto-speak OFF'}
          >
            {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
              title="Stop speaking"
            >
              <VolumeX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Messages area ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {/* Voice tip – only on first load */}
        {messages.length === 1 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-2">
              <Mic className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-blue-900 mb-0.5">Voice Mode Available</p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Tap the mic icon above to enable voice mode, or use the mic button below for single questions.
                </p>
              </div>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-2.5 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-slate-100 text-slate-800 rounded-bl-sm'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === 'assistant' && (
              <button
                onClick={() => speakText(message.content)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all flex-shrink-0 self-start mt-0.5"
                title="Read aloud"
                disabled={isSpeaking}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Bottom area: quiz + input ── */}
      <div className="border-t border-slate-200 bg-white p-3 flex-shrink-0">

        {/* Quiz questions */}
        {showQuiz && generatedQuiz && !quizSubmitted && (
          <div className="mb-3 space-y-2.5 max-h-56 overflow-y-auto">
            {generatedQuiz.questions.map((q, qIdx) => (
              <div key={qIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-semibold text-slate-900 mb-2 text-sm">{qIdx + 1}. {q.question}</p>
                <div className="space-y-1.5">
                  {q.options.map((option, optIdx) => (
                    <label
                      key={optIdx}
                      className={`flex items-center gap-2.5 p-2 rounded-lg border-2 cursor-pointer transition-all text-sm ${
                        quizAnswers[qIdx] === optIdx
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`quiz-${qIdx}`}
                        checked={quizAnswers[qIdx] === optIdx}
                        onChange={() => setQuizAnswers({ ...quizAnswers, [qIdx]: optIdx })}
                        className="w-3.5 h-3.5 accent-blue-600"
                      />
                      <span className="text-slate-700 text-xs">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={handleQuizSubmit}
              disabled={Object.keys(quizAnswers).length !== generatedQuiz.questions.length}
              className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Submit Quiz
            </button>
          </div>
        )}

        {/* Generate quiz button */}
        {!showQuiz && !quizSubmitted && conversationCount >= 2 && (
          <button
            onClick={handleGenerateQuiz}
            disabled={loading}
            className="w-full mb-2.5 py-2 flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-xl hover:bg-emerald-100 transition-colors disabled:opacity-50"
          >
            <Brain className="w-4 h-4" /> Generate Quiz
          </button>
        )}

        {/* Voice error */}
        {voiceError && (
          <div className={`mb-2.5 px-3 py-2 rounded-xl flex items-center gap-2 text-xs ${
            voiceError.startsWith('✓')
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <span className="flex-1">{voiceError}</span>
            <button onClick={() => setVoiceError('')} className="opacity-60 hover:opacity-100">×</button>
          </div>
        )}

        {/* Input row */}
        <div className="flex gap-2 items-center">
          <div className="relative">
            <button
              onClick={toggleListening}
              disabled={loading || voiceModeEnabled}
              className={`p-2.5 rounded-xl transition-all ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              } ${voiceModeEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isListening ? 'Listening…' : 'Tap to speak'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            {isListening && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">
                Listening…
              </div>
            )}
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? 'Listening…' : 'Type or click mic…'}
            className="flex-1 px-3.5 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-60"
            disabled={loading || isListening}
          />

          <button
            onClick={handleSend}
            disabled={loading || !input.trim() || isListening}
            className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPanel;
