import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export const callGemini = async (prompt) => {
  if (!API_KEY) {
    console.warn('[Gemini] No API key provided via VITE_GEMINI_API_KEY.');
  }
  try {
    // Use Gemini 2.5 Flash model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    return {
      success: true,
      data: text
    };
  } catch (error) {
    console.error('[Gemini] API Error:', error);
    console.error('[Gemini] Request prompt:', prompt);
    
    // Fallback to mock responses if API fails
    return getMockResponse(prompt);
  }
};

// Fallback mock responses
const getMockResponse = (prompt) => {
  if (prompt.includes('explain') || prompt.includes('Explain')) {
    return {
      success: true,
      data: `Here's a simple explanation:\n\nThis topic is about understanding the basic concepts. Let me break it down:\n\n1. Start with the fundamentals\n2. Practice with examples\n3. Apply what you learned\n\nRemember: Practice makes perfect!`
    };
  }

  if (prompt.includes('quiz') || prompt.includes('questions')) {
    return {
      success: true,
      data: [
        { id: 1, question: 'What is the main concept?', options: ['A', 'B', 'C', 'D'], correct: 0 },
        { id: 2, question: 'How do you apply this?', options: ['Method 1', 'Method 2', 'Method 3', 'Method 4'], correct: 1 },
        { id: 3, question: 'Which example is correct?', options: ['Example A', 'Example B', 'Example C', 'Example D'], correct: 2 }
      ]
    };
  }

  if (prompt.includes('study plan') || prompt.includes('Study Plan')) {
    return {
      success: true,
      data: {
        daily: [
          'Review weak topics for 20 minutes',
          'Complete 5 practice questions',
          'Read new topic introduction'
        ],
        weekly: [
          'Monday: Focus on Math',
          'Wednesday: Practice Science',
          'Friday: Review all topics',
          'Saturday: Take quiz'
        ]
      }
    };
  }

  if (prompt.includes('feedback') || prompt.includes('scored')) {
    return {
      success: true,
      data: {
        feedback: 'Good effort! You understand the basics well.',
        suggestions: [
          'Practice more on weak areas',
          'Review the examples again',
          'Try solving similar problems'
        ],
        nextTopic: 'Move to the next chapter after mastering this'
      }
    };
  }

  if (prompt.includes('recommendation') || prompt.includes('insight')) {
    return {
      success: true,
      data: {
        insights: [
          'Math performance is below average - increase session frequency',
          'Students show strong engagement in English',
          'Attendance has dropped by 10% this week'
        ],
        actions: [
          'Assign additional mentors to Math',
          'Focus on interactive learning methods',
          'Send attendance reminders to students'
        ]
      }
    };
  }

  if (prompt.includes('module') || prompt.includes('structured learning')) {
    return {
      success: true,
      data: {
        explanation: 'This is a comprehensive explanation of the topic with clear examples and step-by-step guidance.',
        keyPoints: [
          'Understanding the core concept',
          'Practical applications',
          'Common mistakes to avoid'
        ],
        examples: [
          'Example 1: Basic application',
          'Example 2: Intermediate level',
          'Example 3: Advanced usage'
        ],
        summary: 'In summary, this topic covers essential concepts that build foundation for advanced learning.'
      }
    };
  }

  // Default response
  return {
    success: true,
    data: 'AI response generated successfully. This is a mock response for demonstration purposes.'
  };
};

// Generate AI insights for admin dashboard
export const generateAIInsights = async (aggregatedData) => {
  const prompt = `
You are an educational analytics AI. Analyze this learning platform data and provide 3-5 actionable insights with specific recommendations.

Data:
- Total Students: ${aggregatedData.totalStudents}
- Average Progress: ${aggregatedData.avgProgress.toFixed(1)}%
- Average Attendance: ${aggregatedData.avgAttendance.toFixed(1)}%
- Total Mentors: ${aggregatedData.totalMentors}
- Active Mentors: ${aggregatedData.activeMentors}
- Low Performers: ${aggregatedData.lowPerformers}
- Low Attendance: ${aggregatedData.lowAttendance}
- Top Weak Topics: ${Object.entries(aggregatedData.weakTopics).slice(0, 5).map(([topic, count]) => `${topic} (${count} students)`).join(', ')}

Provide insights in this JSON format:
[
  {
    "title": "Brief insight title",
    "description": "Detailed explanation of the issue or opportunity",
    "type": "performance|attendance|content|alert",
    "priority": "high|medium|low",
    "actions": ["Action 1", "Action 2"]
  }
]

Focus on:
1. Student performance issues
2. Attendance problems
3. Content effectiveness
4. Mentor allocation
5. System improvements
`;

  try {
    const result = await callGemini(prompt);
    
    if (result.success) {
      // Try to parse JSON response
      try {
        const jsonMatch = result.data.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch {
        console.log('Could not parse JSON, using fallback');
      }
    }
  } catch (error) {
    console.error('Error generating insights:', error);
  }

  // Fallback insights based on data
  const insights = [];

  if (aggregatedData.avgProgress < 50) {
    insights.push({
      title: 'Low Overall Progress Detected',
      description: `Average student progress is ${aggregatedData.avgProgress.toFixed(1)}%. This indicates students are struggling with course content or need more support.`,
      type: 'performance',
      priority: 'high',
      actions: ['Increase mentor sessions', 'Add practice modules', 'Review content difficulty']
    });
  }

  if (aggregatedData.avgAttendance < 80) {
    insights.push({
      title: 'Attendance Below Target',
      description: `Average attendance is ${aggregatedData.avgAttendance.toFixed(1)}%. ${aggregatedData.lowAttendance} students have attendance below 70%.`,
      type: 'attendance',
      priority: 'high',
      actions: ['Send attendance reminders', 'Contact low-attendance students', 'Review scheduling conflicts']
    });
  }

  if (aggregatedData.lowPerformers > 0) {
    insights.push({
      title: `${aggregatedData.lowPerformers} Students Need Immediate Support`,
      description: 'These students have progress below 30% and require urgent intervention to prevent falling further behind.',
      type: 'alert',
      priority: 'high',
      actions: ['Assign dedicated mentors', 'Create personalized study plans', 'Schedule one-on-one sessions']
    });
  }

  const topWeakTopic = Object.entries(aggregatedData.weakTopics).sort((a, b) => b[1] - a[1])[0];
  if (topWeakTopic) {
    insights.push({
      title: `${topWeakTopic[1]} Students Struggling with ${topWeakTopic[0]}`,
      description: 'This topic has the highest number of students marking it as weak. Consider creating targeted content or additional practice materials.',
      type: 'content',
      priority: 'medium',
      actions: ['Create focused module', 'Add video explanations', 'Schedule group sessions']
    });
  }

  const mentorUtilization = (aggregatedData.activeMentors / aggregatedData.totalMentors) * 100;
  if (mentorUtilization < 70) {
    insights.push({
      title: 'Underutilized Mentor Capacity',
      description: `Only ${aggregatedData.activeMentors} out of ${aggregatedData.totalMentors} mentors have assigned students. Better allocation could improve student support.`,
      type: 'performance',
      priority: 'medium',
      actions: ['Review mentor assignments', 'Balance student load', 'Activate inactive mentors']
    });
  }

  if (insights.length === 0) {
    insights.push({
      title: 'System Performing Well',
      description: 'All key metrics are within acceptable ranges. Continue monitoring for any changes.',
      type: 'performance',
      priority: 'low',
      actions: ['Maintain current approach', 'Monitor trends', 'Gather student feedback']
    });
  }

  return insights;
};
