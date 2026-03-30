import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Brain, TrendingUp, AlertTriangle, Users, BookOpen } from 'lucide-react';
import { generateAIInsights } from '../../utils/gemini';

const AIInsights = () => {
  const { appData } = useApp();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadInsights = async () => {
      setLoading(true);
      
      // Aggregate data for AI analysis
      const aggregatedData = {
        totalStudents: appData.students.length,
        avgProgress: appData.students.reduce((sum, s) => sum + (s.progress || 0), 0) / appData.students.length,
        avgAttendance: appData.students.reduce((sum, s) => sum + (s.attendance || 100), 0) / appData.students.length,
        totalMentors: appData.mentors.length,
        activeMentors: appData.mentors.filter(m => m.assignedStudents.length > 0).length,
        weakTopics: {},
        lowPerformers: appData.students.filter(s => (s.progress || 0) < 30).length,
        lowAttendance: appData.students.filter(s => (s.attendance || 100) < 70).length
      };

      // Collect weak topics
      appData.students.forEach(student => {
        Object.entries(student.weakTopics || {}).forEach(([subject, topics]) => {
          topics.forEach(topic => {
            const key = `${subject}: ${topic}`;
            aggregatedData.weakTopics[key] = (aggregatedData.weakTopics[key] || 0) + 1;
          });
        });
      });

      // Get AI recommendations
      const aiInsights = await generateAIInsights(aggregatedData);
      setInsights(aiInsights);
      setLoading(false);
    };

    loadInsights();
  }, [appData]);

  const getInsightIcon = (type) => {
    switch (type) {
      case 'performance': return TrendingUp;
      case 'attendance': return Users;
      case 'content': return BookOpen;
      case 'alert': return AlertTriangle;
      default: return Brain;
    }
  };

  const getInsightColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">AI Insights</h1>
          <p className="text-gray-600 mt-1">Data-driven recommendations for system improvement</p>
        </div>
        <Button onClick={() => window.location.reload()} disabled={loading}>
          <Brain className="w-4 h-4 mr-2" />
          {loading ? 'Generating...' : 'Refresh Insights'}
        </Button>
      </div>

      {loading ? (
        <Card>
          <div className="text-center py-12">
            <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Analyzing system data...</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = getInsightIcon(insight.type);
            return (
              <Card key={index} className={`border-2 ${getInsightColor(insight.priority)}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    insight.priority === 'high' ? 'bg-red-100' :
                    insight.priority === 'medium' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      insight.priority === 'high' ? 'text-red-600' :
                      insight.priority === 'medium' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        insight.priority === 'high' ? 'bg-red-100 text-red-700' :
                        insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {insight.priority} priority
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{insight.description}</p>
                    
                    {insight.actions && insight.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {insight.actions.map((action, actionIndex) => (
                          <Button
                            key={actionIndex}
                            variant="secondary"
                            className="text-sm"
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}

          {insights.length === 0 && (
            <Card>
              <div className="text-center py-12">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No insights available. Click "Refresh Insights" to generate.</p>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AIInsights;
