# Saver.AI — The Autonomous AI Productivity OS (v4) 🚨

Saver.AI is a premium, high-fidelity AI-powered productivity web application designed to help users complete critical tasks before missing deadlines. 

Unlike traditional reminder tools that simply trigger notifications, this app functions like an autonomous multi-agent assistant: predicting deadline risks, re-compiling schedules, breaking tasks into micro-milestones, and initiating Emergency Rescue and Panic modes when workloads exceed available focus capacity.

---

## ⚡ Tech Stack & Architecture
- **Core Framework**: React (Vite template)
- **Styling**: Tailwind CSS (Glassmorphism panels, glowing gauges, neural animations)
- **Animations**: Framer Motion
- **Inference Diagnostics**: Recharts (Weekly Capacity Matrix, Performance HUD)
- **AI Engine**: Google Gemini API (`gemini-1.5-flash`) via `@google/generative-ai` with a context-aware smart fallback engine.

Saver.AI is structured around a **5-Layer Architecture**:
1.  **Data Collection Layer**: Gathers user backlogs, Google Calendar slots, and live device context (e.g. Battery, network status).
2.  **Mathematical Scoring Engine**: Deterministically calculates initial Risk, Stress, and baseline Confidence scores.
3.  **Gemini Multi-Agent Engine**: Multi-agent router (Planner Agent, Risk Agent, Coach Agent, Learning Agent) that reasons over structured scoring signals.
4.  **AI Action Engine**: Maps timeline modifications, triggers recovery breaks, and executes Pomodoro sprints.
5.  **AI Learning Engine**: Calibrates prediction errors, updates habits, and builds semantic memory.

---

## 🚀 Getting Started

### 1. Install Dependencies
Ensure you have [Node.js](https://nodejs.org/) installed, then run:
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your web browser.

### 3. Add Gemini API Key (Optional)
1. Click the **Gear Icon (Settings)** in the top right.
2. Paste your **Gemini API Key**.
3. Adjust the slider to set your available focus hours today (e.g. 3 hours) and click **Apply OS Configs**.

---

## 🏆 Hackathon Pitch Walkthrough Script (5 Minutes)

Follow this lifecycle demo sequence to showcase the autonomous features of Saver.AI:

### Minute 1: The Daily Brief (Understand)
1.  Click **"Instant Sandbox Demo Access"** on the landing page.
2.  Observe the **AI Daily Brief** hero card greeting **Saket**. Note the Jarvis-voiced summary: *"You have 15h of tasks but only 3h available. I already prepared a rescue plan."*
3.  Click **"Explain this recommendation"** to expand the **3-Question Decision Engine** details: *Why?*, *Why Now?*, *What if I don't?*.

### Minute 2: Predict Outcomes (Predict)
1.  Navigate to the **Mission Control** tab.
2.  Interact with the **AI Success Simulator**: click `+1h`, `+2h`, or `Postpone`. Watch the risk scores and success rates dynamically recalibrate in real-time.
3.  Note the **Confidence Breakdown** (Calendar 31%, Dependencies 24%) and **Stress Meter** calculations.

### Minute 3: Proactive Alert & Cinematic Rescue (Act)
1.  Wait 5 seconds on the dashboard. Watch the **Proactive AI Alert** prompt slide in from the bottom left: *"I detected you are unlikely to complete today's work. [Deploy Rescue Mode]"*.
2.  Click **"Deploy Rescue Mode"**.
3.  Watch the fullscreen **Cinematic Rebuild Overlay** activate. It displays terminal checklists alongside the **Raw LLM prompt Context Trace** console showing the prompt context routed to Gemini.
4.  After completion, click **"Adopt Optimized Timeline"** (confettis celebrate the compilation).

### Minute 4: Smart Buffers & Day Simulation (Act)
1.  Go to the **Execution Hub** tab. Start a **Focus Mode** sprint on the active task. Note the explainability card and active Pomodoro countdown. Check off micro-tasks for **+50 XP** bubbles. Note that the timer automatically schedules a **10-minute Brain Recharge Break** with burnout prevention tips.
2.  Return to the dashboard. Go to the **AI Brain** tab and click **"Simulate My Day"**. Watch the timeline run at warp speed, automatically adapting to procrastination warnings and shifting blocks.

### Minute 5: Explainability & Memory Evolution (Learn)
1.  While in the **AI Brain** tab, inspect the **Mission Black Box Ledger** explaining *what* the AI did and *why* (linking actions to calendar conflicts).
2.  Look at the **AI Learning Logs** tracking predictions error calibration (*"Yesterday: Predicted 2h, Actual 3h 12m (+36% error)..."*).
3.  Go to the **Analytics** tab. Review the **AI Energy Radar** (peak windows 6 PM - 9 PM) and the developer diagnostics **Health Monitor** panel.
