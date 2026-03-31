import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export const callGemini = async (prompt) => {
  if (!API_KEY) {
    console.warn('[Gemini] No API key provided via VITE_GEMINI_API_KEY.');
    return {
      success: false,
      data: 'Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.'
    };
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

    return {
      success: false,
      data: `I'm having trouble connecting to the AI service right now. Error: ${error.message || 'Unknown error'}. Please check your API key and try again.`
    };
  }
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
