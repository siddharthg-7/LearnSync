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
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

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

// Generate a structured theory module + quizzes from a training course's details
export const generateTrainingModule = async (course, quizCount = 3) => {
  const fileList = (course.modules || []).map(f => f.name).join(', ') || 'No files uploaded'
  const topicList = (course.topics || []).join(', ') || 'General training'

  const prompt = `
You are an expert educational content creator for a mentor training platform.

A new training course has been added with the following details:
- Course Name: ${course.name}
- Description: ${course.description || 'Not provided'}
- Duration: ${course.duration || 'Not specified'}
- Topics Covered: ${topicList}
- Uploaded Resources: ${fileList}

Generate a comprehensive theory learning module AND ${quizCount} quiz questions for mentors.
Respond ONLY with a valid JSON object in this exact format:
{
  "overview": "2-3 sentence overview of what this course covers and why it matters for mentors",
  "objectives": ["learning objective 1", "learning objective 2", "learning objective 3", "learning objective 4"],
  "sections": [
    {
      "title": "Section title",
      "content": "Detailed explanation of this section (3-5 sentences with practical guidance for mentors)",
      "keyPoints": ["key point 1", "key point 2", "key point 3"]
    },
    {
      "title": "Section title",
      "content": "Detailed explanation",
      "keyPoints": ["key point 1", "key point 2", "key point 3"]
    },
    {
      "title": "Section title",
      "content": "Detailed explanation",
      "keyPoints": ["key point 1", "key point 2", "key point 3"]
    }
  ],
  "summary": "A concise 2-3 sentence summary of the entire module and key takeaways for mentors",
  "practicalTips": ["practical tip 1", "practical tip 2", "practical tip 3", "practical tip 4"],
  "quizzes": [
    {
      "id": 1,
      "question": "Question text based on the course content?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0
    }
  ]
}

Generate exactly ${quizCount} quiz questions in the quizzes array. Each question must have exactly 4 options and a correct index (0-3). Questions must be directly based on the course topics.
`

  try {
    const result = await callGemini(prompt)
    if (result.success) {
      const jsonMatch = result.data.match(/\{[\s\S]*\}/)
      if (jsonMatch) return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('Error generating training module:', e)
  }

  // Fallback
  const fallbackQuizzes = Array.from({ length: quizCount }, (_, i) => ({
    id: i + 1,
    question: `Which of the following best describes a key principle of ${course.name}?`,
    options: ['Active listening and clear communication', 'Avoiding student feedback', 'Skipping lesson planning', 'Ignoring learning differences'],
    correct: 0
  }))

  return {
    overview: `This course on "${course.name}" is designed to equip mentors with practical skills and knowledge in ${topicList}. It covers essential concepts that will directly improve teaching effectiveness and student outcomes.`,
    objectives: [
      `Understand the core principles of ${course.name}`,
      `Apply ${topicList} techniques in real teaching scenarios`,
      'Develop structured lesson plans based on course content',
      'Evaluate and adapt teaching strategies for different learners'
    ],
    sections: [
      {
        title: 'Introduction & Foundations',
        content: `This section introduces the fundamental concepts of ${course.name}. Mentors will gain a solid understanding of the theoretical background and why these principles are critical for effective teaching.`,
        keyPoints: ['Core definitions and terminology', 'Why this matters for student outcomes', 'How to introduce concepts to students']
      },
      {
        title: 'Practical Application',
        content: `Building on the foundations, this section focuses on hands-on application of ${topicList}. Mentors will explore real-world scenarios and learn how to adapt these techniques to different student needs.`,
        keyPoints: ['Step-by-step implementation guide', 'Common challenges and how to overcome them', 'Adapting techniques for different age groups']
      },
      {
        title: 'Assessment & Feedback',
        content: 'Effective mentoring requires continuous assessment and constructive feedback. This section covers how to measure student progress and provide feedback that motivates improvement.',
        keyPoints: ['Methods for tracking student progress', 'Giving constructive and motivating feedback', 'Adjusting your approach based on results']
      }
    ],
    summary: `This module provides mentors with a comprehensive foundation in ${course.name}. By completing this course, mentors will be better equipped to deliver impactful sessions and support student growth effectively.`,
    practicalTips: [
      'Review this module before your first session on this topic',
      'Take notes on sections most relevant to your assigned students',
      'Discuss key concepts with fellow mentors for deeper understanding',
      'Revisit the summary section regularly as a quick reference'
    ],
    quizzes: fallbackQuizzes
  }
}
