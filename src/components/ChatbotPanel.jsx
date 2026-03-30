import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Sparkles, Brain, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { callGemini } from '../utils/gemini';
import Button from './Button';

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
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const errorTimeoutRef = useRef(null);

  // Text-to-Speech: Speak the text
  const speakText = useCallback((text) => {
    if (!synthRef.current) {
      return;
    }

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Google US English')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  }, []);

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
      
      if (context) {
        prompt = `Topic: ${context.title}\nContent: ${context.content}\n\nStudent question: ${userMessage}\n\nProvide a clear, concise explanation in plain text. Do not use asterisks, markdown formatting, or special characters. Write in simple paragraphs.`;
      } else {
        prompt = `Student asks: ${userMessage}\n\nProvide a helpful, educational response in plain text. Do not use asterisks, markdown formatting, bullet points, or special characters. Write in simple, clear paragraphs suitable for a student.`;
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
      
      if (autoSpeak) {
        speakText(cleanedResponse);
      }
      
      if (conversationCount + 1 >= 2 && !showQuiz && !quizSubmitted) {
        setTimeout(() => {
          const quizSuggestion = "Would you like to take a quick quiz to test your understanding of what we discussed?";
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: quizSuggestion
          }]);
          if (autoSpeak) {
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
  }, [context, autoSpeak, conversationCount, showQuiz, quizSubmitted, speakText]);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
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

    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
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
  }, [handleSendVoiceMessage]);

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
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
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
      const topicContext = context ? `Topic: ${context.title}\nContent: ${context.content}` : 
        `Based on our conversation about the topics discussed`;
      
      const prompt = `${topicContext}

Generate a quiz with 3 multiple-choice questions to test understanding. 
Respond ONLY with valid JSON in this exact format, no additional text:
{
  "questions": [
    {
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0
    }
  ]
}`;

      const response = await callGemini(prompt);
      
      let quizData;
      try {
        const jsonMatch = response.data.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          quizData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch {
        quizData = {
          questions: [
            {
              question: `What is the main concept we discussed about ${context?.title || 'this topic'}?`,
              options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
              correct: 0
            },
            {
              question: 'Which statement best describes what we learned?',
              options: ['Statement A', 'Statement B', 'Statement C', 'Statement D'],
              correct: 1
            },
            {
              question: 'How would you apply this knowledge?',
              options: ['Application A', 'Application B', 'Application C', 'Application D'],
              correct: 2
            }
          ]
        };
      }
      
      setGeneratedQuiz(quizData);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I've created a quiz to test your understanding. Please answer the questions below.`
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I had trouble creating the quiz. Please try again.'
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
      
      if (context) {
        prompt = `Topic: ${context.title}\nContent: ${context.content}\n\nStudent question: ${userMessage}\n\nProvide a clear, concise explanation in plain text. Do not use asterisks, markdown formatting, or special characters. Write in simple paragraphs.`;
      } else {
        prompt = `Student asks: ${userMessage}\n\nProvide a helpful, educational response in plain text. Do not use asterisks, markdown formatting, bullet points, or special characters. Write in simple, clear paragraphs suitable for a student.`;
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
      
      if (autoSpeak) {
        speakText(cleanedResponse);
      }
      
      if (conversationCount + 1 >= 2 && !showQuiz && !quizSubmitted) {
        setTimeout(() => {
          const quizSuggestion = "Would you like to take a quick quiz to test your understanding of what we discussed?";
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: quizSuggestion
          }]);
          if (autoSpeak) {
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
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">AI Tutor</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            {context ? `Learning about: ${context.title}` : 'Ask me anything about your studies'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVoiceModeEnabled(prev => !prev)}
            className={`p-2 md:p-3 rounded-xl transition-all ${
              voiceModeEnabled
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={voiceModeEnabled ? 'Voice mode enabled' : 'Enable voice mode'}
          >
            <Mic className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          {voiceModeEnabled && (
            <span className="text-xs md:text-sm text-green-600 font-medium hidden md:inline">
              Voice mode listening
            </span>
          )}

          <button
            onClick={toggleAutoSpeak}
            className={`p-2 md:p-3 rounded-xl transition-all ${
              autoSpeak
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={autoSpeak ? 'Auto-speak enabled' : 'Auto-speak disabled'}
          >
            {autoSpeak ? <Volume2 className="w-4 h-4 md:w-5 md:h-5" /> : <VolumeX className="w-4 h-4 md:w-5 md:h-5" />}
          </button>
          
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="p-2 md:p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
              title="Stop speaking"
            >
              <VolumeX className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col" style={{ height: 'calc(100vh - 200px)', maxHeight: '600px' }}>
        <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4">
          {messages.length === 1 && (
            <div className="mb-3 md:mb-4 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2 md:gap-3">
                <Mic className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs md:text-sm font-medium text-blue-900 mb-1">Voice Mode Available!</p>
                  <p className="text-xs text-blue-700 mb-1 md:mb-2">
                    Click the microphone button (or toggle the Voice Mode button above) and speak your question, or type as usual. 
                    Enable auto-speak (speaker icon above) to hear responses read aloud.
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    💡 Tip: Start speaking immediately after clicking the mic button!
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                </div>
              )}
              <div
                className={`max-w-[85%] md:max-w-[75%] p-2 md:p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 text-gray-800 border border-gray-200'
                }`}
              >
                <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'assistant' && (
                <button
                  onClick={() => speakText(message.content)}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all flex-shrink-0"
                  title="Read aloud"
                  disabled={isSpeaking}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

      <div className="border-t border-gray-200 bg-white p-3 md:p-4">
        {showQuiz && generatedQuiz && !quizSubmitted && (
          <div className="mb-4 space-y-3 max-h-64 overflow-y-auto">
            {generatedQuiz.questions.map((q, qIdx) => (
              <div key={qIdx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="font-medium text-gray-900 mb-3 text-sm">
                  {qIdx + 1}. {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((option, optIdx) => (
                    <label
                      key={optIdx}
                      className={`flex items-center gap-3 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                        quizAnswers[qIdx] === optIdx
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`quiz-${qIdx}`}
                        checked={quizAnswers[qIdx] === optIdx}
                        onChange={() => setQuizAnswers({ ...quizAnswers, [qIdx]: optIdx })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <Button
              onClick={handleQuizSubmit}
              disabled={Object.keys(quizAnswers).length !== generatedQuiz.questions.length}
              className="w-full"
            >
              Submit Quiz
            </Button>
          </div>
        )}
        
        {!showQuiz && !quizSubmitted && conversationCount >= 2 && (
          <div className="mb-3">
            <Button
              onClick={handleGenerateQuiz}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Brain className="w-4 h-4" />
              Generate Quiz
            </Button>
          </div>
        )}
        
        {voiceError && (
          <div className={`mb-3 p-3 rounded-lg flex items-start gap-2 ${
            voiceError.startsWith('✓') 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
              voiceError.startsWith('✓')
                ? 'bg-green-100'
                : 'bg-red-100'
            }`}>
              <span className={`text-xs font-bold ${
                voiceError.startsWith('✓')
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {voiceError.startsWith('✓') ? '✓' : '!'}
              </span>
            </div>
            <p className={`text-sm flex-1 ${
              voiceError.startsWith('✓')
                ? 'text-green-700'
                : 'text-red-700'
            }`}>
              {voiceError}
            </p>
            {!voiceError.startsWith('✓') && (
              <button
                onClick={() => setVoiceError('')}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                ×
              </button>
            )}
          </div>
        )}
        
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={toggleListening}
              disabled={loading || voiceModeEnabled}
              className={`p-2 md:p-3 rounded-lg transition-all ${
                isListening
                  ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${voiceModeEnabled ? 'cursor-not-allowed opacity-60' : ''}`}
              title={voiceModeEnabled
                ? 'Voice mode manages the microphone'
                : isListening
                  ? 'Stop listening (click or speak)'
                  : 'Start voice input (click and speak)'}
            >
              {isListening ? <MicOff className="w-4 h-4 md:w-5 md:h-5" /> : <Mic className="w-4 h-4 md:w-5 md:h-5" />}
            </button>
            {isListening && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Listening...
              </div>
            )}
          </div>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening..." : "Type or click mic..."}
            className="flex-1 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading || isListening}
          />
          <Button
            onClick={handleSend}
            disabled={loading || !input.trim() || isListening}
            className="px-4 md:px-6 py-2 md:py-3"
            title="Send message"
          >
            <Send className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ChatbotPanel;
