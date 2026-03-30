# LearnSync - AI-Powered Learning Coordination Platform

A fully dynamic, interconnected Student Portal built with React and Tailwind CSS. LearnSync acts as a personal AI tutor, planner, and assistant that adapts based on student performance and behavior.

## 🚀 Features

### 🎓 Student Portal (Fully Dynamic)

#### 1. Dynamic Onboarding System (5 Steps)
- **Step 1**: Basic Info (Name, Age, Class)
- **Step 2**: Subject Selection (Multi-select)
- **Step 3**: Availability (Days + Time Slots)
- **Step 4**: Self-Assessment (Weak/Okay/Strong per topic)
  - Voice input UI ready
  - Dynamic topic selection based on subjects
- **Step 5**: Mini Quiz (Level Detection)
  - 3 questions per subject
  - Automatic level calculation (Beginner/Intermediate/Advanced)
  - Adapts difficulty based on performance

#### 2. Age-Adaptive UI System
Three distinct interfaces based on age:

**Foundation Mode (5-10 years)**
- Big, colorful, fun interface
- Large text and icons
- "Missions" instead of tasks
- Stars and emojis
- Simple, encouraging language

**Growth Mode (11-14 years)**
- Gamified with XP system
- Progress bars and badges
- "Daily Quests" concept
- Level progression visible
- Achievement-focused

**Mastery Mode (15-19 years)**
- Clean, minimal, professional
- Analytics-focused
- Table-like layouts
- Subtle colors
- Efficiency-oriented

#### 3. Main Dashboard (Control Center)
Dynamic sections that adapt to student:
- **Today's Task (Hero)**: Priority tasks for the day
- **Pending Tasks**: Remaining lessons
- **Courses**: Progress tracking with XP
- **Weak Areas**: Highlighted topics needing attention
- **Progress**: Weekly improvement graphs

#### 4. Course System (Structured Learning)
- **Structure**: Course → Chapter → Topic
- **Content Sources**:
  - Mentor-created content
  - NGO modules
  - AI-processed explanations
- **Features**:
  - Explanation with AI simplification
  - Key points and examples
  - Practice questions
  - Instant feedback
  - XP rewards
  - Progress tracking

#### 5. AI Chatbot with Context
- **Contextual Help**: Send any topic to chatbot
- **Features**:
  - Topic-aware responses
  - Simple explanations
  - Step-by-step guidance
  - Real-time chat interface
- **Integration**: Available from any topic page

#### 6. Dynamic Study Planner
**Input System**:
- Select study days
- Choose focus subjects
- Pick topics to cover
- Set study hours per day

**AI Logic**:
- Prioritizes weak topics
- Balances different subjects
- Allocates realistic time
- Adapts to availability

**Output**:
- Daily task list
- Weekly schedule
- Progress tracking
- Completion rewards

#### 7. Doubt System (Collaborative)
- Raise doubts with subject and topic
- Broadcast to relevant mentors
- Track status (Pending/Answered)
- Alternative: Ask AI chatbot

#### 8. Continuous Adaptation
System automatically updates after every action:
- Quiz performance → Updates weak topics
- Completed topics → Updates progress
- Weak topics → Influences study plan
- XP earned → Levels up student

### 👨‍🏫 Mentor Portal

#### Features:
- Dashboard with assigned students
- Content creation (Courses, Chapters, Topics)
- Session logging with attendance
- Doubt resolution system
- Student insights and analytics
- Performance tracking

### 🏢 NGO Admin Portal

#### Features:
- **Dashboard**: System-wide analytics with critical alerts and drill-down capabilities
- **Modules**: Content management with effectiveness tracking (students using, avg improvement)
- **Sessions**: Scheduling, tracking (upcoming/completed/missed), and rescheduling
- **AI Insights**: Data-driven recommendations with actionable buttons (powered by Gemini AI)
- **Feedback**: User feedback management system (complaints, issues, suggestions)
- Student management and monitoring
- Mentor performance tracking
- Attendance analytics
- Data-driven decision support

## 🛠️ Tech Stack

- **React 18** - Functional components with hooks
- **React Router** - Client-side routing
- **Tailwind CSS 3** - Utility-first styling
- **Lucide React** - Icon library
- **LocalStorage** - Mock backend persistence
- **Vite** - Build tool and dev server

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎨 Design System

Clean, minimal, professional design:
- **NO gradients**
- **NO glassmorphism**
- **NO flashy effects**

### Colors:
- Background: `bg-gray-50`
- Cards: `bg-white`
- Borders: `border-gray-200`
- Primary: `bg-blue-600`
- Success: `text-green-600`
- Warning: `text-red-500`

### Spacing:
- Padding: `p-4`, `p-6`
- Gaps: `gap-4`
- Rounded: `rounded-xl`
- Shadows: `shadow-sm`

## 🗂️ Project Structure

```
src/
├── components/
│   ├── Layout.jsx           # Main layout with sidebar
│   ├── Card.jsx             # Reusable card component
│   ├── Button.jsx           # Button component
│   ├── Modal.jsx            # Modal component
│   ├── ProgressBar.jsx      # Progress bar
│   └── ChatbotPanel.jsx     # AI chatbot interface
├── context/
│   └── AppContext.jsx       # Global state management
├── pages/
│   ├── Login.jsx            # Role-based login
│   ├── student/
│   │   ├── StudentDashboard.jsx    # Age-adaptive dashboards
│   │   ├── StudentOnboarding.jsx   # 5-step onboarding
│   │   ├── Courses.jsx             # Course learning
│   │   ├── StudyPlan.jsx           # Dynamic planner
│   │   └── Doubts.jsx              # Doubt system
│   ├── mentor/
│   │   └── MentorDashboard.jsx
│   └── admin/
│       ├── AdminDashboard.jsx      # Control center
│       ├── Modules.jsx             # Content management
│       ├── Sessions.jsx            # Session tracking
│       ├── AIInsights.jsx          # AI recommendations
│       └── Feedback.jsx            # User feedback
├── utils/
│   ├── storage.js           # LocalStorage helpers
│   ├── mockData.js          # Mock data initialization
│   └── gemini.js            # AI integration (mock)
├── App.jsx                  # Main app component
└── main.jsx                 # Entry point
```

## 🔄 System Interconnection

### Flow 1: Onboarding → Profile → UI Adaptation
```
Survey → Profile Created → Age-Adaptive UI Loads
```

### Flow 2: Weak Topics → Study Plan → Course Priority
```
Self-Assessment → Weak Topics Identified → Study Plan Generated → Courses Prioritized
```

### Flow 3: Mentor Content → AI → Student Learning
```
Mentor Creates Content → AI Processes → Student Learns → Performance Tracked
```

### Flow 4: Topic → Chatbot → Doubt Resolution
```
Student Opens Topic → Sends to Chatbot → Gets Help → Continues Learning
```

### Flow 5: Quiz → Feedback → Profile Update
```
Student Takes Quiz → Performance Analyzed → Weak Topics Updated → Plan Adjusted
```

## 🎯 Key Principles

### 1. Personalization
- Every student gets a unique experience
- UI adapts to age and level
- Content matches skill level
- Plan based on availability

### 2. Guidance
- Always shows next action
- Clear learning path
- Step-by-step progression
- Contextual help available

### 3. Simplicity
- Minimal clicks
- Clean layouts
- Clear actions
- Intuitive navigation

### 4. Interconnection
- All features work together
- Data flows between components
- Continuous adaptation
- Holistic learning system

## 🚀 Getting Started

### 1. Run the Application
```bash
npm run dev
```
Open `http://localhost:5174`

### 2. Login
Choose a role and user:
- **Students**: Priya (9), Aarav (12), Rohan (16), or create new
- **Mentors**: Dr. Anjali Verma, Rahul Mehta
- **Admin**: Administrator

### 3. Experience Different Modes
- Login as Priya (9) → See Foundation Mode
- Login as Aarav (12) → See Growth Mode
- Login as Rohan (16) → See Mastery Mode

### 4. Try Key Features
- Complete onboarding as new student
- Take a quiz and see XP rewards
- Use "Ask AI About This" in any topic
- Generate AI study plan
- Raise a doubt
- Track progress

## 🤖 AI Integration

Mock AI integration using Gemini 2.5 Flash structure:
- Content simplification
- Quiz generation
- Study plan creation
- Feedback generation
- Doubt resolution
- NGO recommendations

To integrate real AI, update `src/utils/gemini.js` with actual API calls.

## 💾 Data Persistence

All data stored in browser localStorage:
- Student profiles
- Progress tracking
- Study plans
- Doubts and replies
- Course completion
- XP and levels

To reset data:
```javascript
localStorage.clear();
location.reload();
```

## 🎮 Gamification

- **XP Points**: Earned by completing topics
- **Levels**: Progress through levels
- **Streaks**: Daily learning streaks
- **Badges**: Achievement system (UI ready)
- **Progress Bars**: Visual feedback
- **Unlocking**: Sequential chapter unlocking

## 📱 Responsive Design

Fully responsive across:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🔐 Mock Users

### Students:
1. **Priya Sharma** (9 years, Foundation Mode)
2. **Aarav Kumar** (12 years, Growth Mode)
3. **Rohan Patel** (16 years, Mastery Mode)

### Mentors:
1. **Dr. Anjali Verma** (Math, Science)
2. **Rahul Mehta** (English, Math)

### Admin:
- **Administrator** (Full access)

## 🚧 Future Enhancements

- Real backend API integration
- Actual Gemini AI integration
- Video conferencing for sessions
- File upload for assignments
- Push notifications
- Mobile app version
- Multi-language support
- Voice input implementation
- Advanced analytics
- Parent portal

## 📄 License

This project is created for educational purposes.

## 🙏 Acknowledgments

Built following comprehensive specifications for:
- Dynamic student portal
- Age-adaptive UI system
- AI-powered learning
- Interconnected features
- Continuous adaptation

---

**LearnSync** - Empowering NGOs to transform education through AI-powered personalized learning.
