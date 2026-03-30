import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatbotPanel from '../../components/ChatbotPanel';
import Button from '../../components/Button';

const STORAGE_KEY = 'learnsync.aiTutor.context';

const AITutor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [restoredContext, setRestoredContext] = useState(null);

  const incomingContext = location.state?.context || null;

  useEffect(() => {
    if (incomingContext) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(incomingContext));
      } catch {
        // ignore
      }
      setRestoredContext(incomingContext);
      return;
    }

    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setRestoredContext(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, [incomingContext]);

  const context = useMemo(() => {
    if (!restoredContext) return null;
    const { title, content, autoPrompt } = restoredContext;
    return {
      title: title || 'Module',
      content: content || '',
      autoPrompt,
    };
  }, [restoredContext]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">AI Tutor</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {context?.title ? `Module: ${context.title}` : 'Open a topic from Courses and tap “Ask AI Assistant” to start.'}
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate(-1)} className="shrink-0">
          ← Back
        </Button>
      </div>

      <ChatbotPanel isOpen={true} context={context} />
    </div>
  );
};

export default AITutor;

