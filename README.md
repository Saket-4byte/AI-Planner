# Saver.AI — The Autonomous AI Productivity OS 🚨

Saver.AI is a premium, high-fidelity AI-powered productivity web application designed to help students, developers, and professionals complete critical tasks and beat tight deadlines. 

Unlike traditional, static todo lists that simply trigger passive notifications, Saver.AI functions like an autonomous multi-agent operating system. It predicts deadline risks, dynamically re-calculates focus slots, breaks projects down into micro-milestones, and initiates emergency "Rescue" and "Panic" protocols when workloads exceed focus capacity.

---

## 🎓 How Saver.AI Benefits Students
Keeping track of assignments, lab submissions, exam preparation, and projects can be overwhelming. Saver.AI is built specifically to address the modern student's workflow challenges:

*   **Workload Capacity Matching**: Students often underestimate how long assignments take. Saver.AI calculates your remaining work in hours against your active "Focus Budget" for the day, highlighting overall feasibility.
*   **Burnout Prevention**: The built-in **Focus Hub** automatically schedules structured **10-minute Brain Recharge Breaks** with contextual tips after intensive Pomodoro sprints.
*   **AI-Powered Study Planning**: Type general goals like *"DSA preparation"* into the chat sidebar, and the Navigator AI will decompose it into actionable sub-tasks (e.g. *"Schema design"*, *"Seed data"*, *"Index queries"*), sizing each into focus blocks.
*   **Intelligent Backlog Relief**: If you're overloaded with homework due tomorrow, the **Rescue Mode** automatically identifies low-priority tasks (like refactoring code or general reading) and postpones them, trimming fluff off high-priority deliverables so you can submit your core work on time.

---

## ⚡ Unique & Advanced Features

### 1. The Navigator AI Chatbot (Dynamic Action Dispatcher)
The sidebar coach is not just conversational—it is hooked directly into the application's task state:
*   **Intent Detection & Offline Fallbacks**: The chat router detects whether you are asking for a summary, task evaluation, or task creation, with robust local pattern-matching in offline mode.
*   **Natural Language Task Creation**: Type *"Create task Math HW for 2 hours high priority"* or *"please add a task for my dsa with subtasks: read arrays, code stack"* and watch it populate your checklist with live micro-tasks.
*   **Fuzzy Task Evaluation**: Ask *"evaluate my presentation"* and the chatbot will run fuzzy token matching, calculate a deterministic risk score, check deadline margins, and give you an actionable recommendation.
*   **Workload Summarization**: Type *"summarize my day"* to get a formatted rundown of your tasks, estimated hours remaining, upcoming deadlines, and a suggested starting point.

### 2. Emergency Rescue & Panic Protocols
*   **Cinematic Rebuild Overlay**: When the workload is impossible, deploying "Rescue Mode" starts a full-screen terminal rebuild animation showing the Gemini Agent re-arranging timelines and stripping scope to fit your hours.
*   **Panic Button isolation**: Instantly Shelves all low/medium priority tasks and isolates a single, high-priority MVP deliverable, reducing stress levels to 0.

### 3. Time Outcome Simulator
*   Simulate your day at warp speed to see where procrastination warnings or scheduling overlaps occur.
*   Drag focus hours sliders or postpone items to see your daily success probability and stress meters adjust in real-time.

### 4. Developer HUD & Learning Ledger
*   **Learning Logs**: Calibrates prediction errors over time (*"Yesterday: Predicted 2h, Actual 3h 12m (+36% error)..."*).
*   **Black Box Ledger**: Tracks every action and rationale taken by the AI OS.

---

## 🚀 Getting Started

### 1. Install Dependencies
Make sure you have [Node.js](https://nodejs.org/) installed, then run:
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 3. Add Gemini API Key (Optional)
To enable the full power of the Google Gemini multi-agent engine:
1. Click the **Gear Icon (Settings)** in the top right.
2. Paste your **Gemini API Key**.
3. (Optional) Adjust your available focus budget hours for the day and click **Apply OS Configs**.

---

## 💬 Navigator Chat Commands Guide
You can talk to the Coach in the bottom-right sidebar using these commands:

| Action | Example Command | Expected Behavior |
| :--- | :--- | :--- |
| **Summarize Schedule** | *"Summarize my day"* / *"What does my workload look like?"* | Returns completed/pending task metrics, estimated remaining work, and focus suggestions. |
| **Evaluate Task** | *"Evaluate Complete AI Project"* / *"Check presentation task"* | Fuzzy matches your task, runs a deterministic risk calculation, and shows deadline safety details. |
| **Create Task** | *"Create task Database Design for 2 hours high priority"* | Adds the task to your backlog with a Gemini-calibrated risk and duration. |
| **Add with Subtasks** | *"Add task Launch Website with subtasks: Purchase Domain, Set DNS, Deploy"* | Adds the task and pre-populates its micro-tasks list immediately. |

---

## 🛠️ Architecture & Technology Stack
*   **Core UI & Layout**: React (Vite template) with Framer Motion animations.
*   **Styling**: Vanilla CSS + Tailwind CSS (curated glassmorphic colors, neon glows, custom scrollbars).
*   **Data HUD Graphs**: Recharts (Weekly Capacity Radar, energy levels tracking).
*   **Database & Session Persistence**: LocalStorage state management. Sessions remain logged in on the Dashboard across browser refreshes.
*   **AI Engine**: Google Gemini API (`gemini-1.5-flash`) via `@google/generative-ai` with a local context-aware offline fallback router.
