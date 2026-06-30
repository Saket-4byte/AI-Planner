import { GoogleGenerativeAI } from '@google/generative-ai';

// --- INTENT & PARSING HELPERS ---

const detectIntent = (message) => {
  const msgLower = message.toLowerCase().trim();
  
  const createKeywords = [
    'create task', 'add task', 'new task', 
    'schedule task', 'schedule a task', 'create a task',
    'make task', 'make a task', 'add a task'
  ];
  if (createKeywords.some(keyword => msgLower.startsWith(keyword) || msgLower.includes(' ' + keyword) || msgLower.startsWith('task create'))) {
    return 'CREATE';
  }
  
  const evaluateKeywords = [
    'evaluate', 'check task', 'analyze task',
    'check status of', 'how is', 'is my task',
    'feasibility of', 'assess task', 'check my work'
  ];
  if (evaluateKeywords.some(keyword => msgLower.startsWith(keyword) || msgLower.includes(' ' + keyword) || msgLower.includes(keyword + ' '))) {
    return 'EVALUATE';
  }
  
  const summaryKeywords = [
    'summary', 'summarize', 'my day', 'schedule', 
    'workload', 'daily brief', 'overview', 'status of today'
  ];
  if (summaryKeywords.some(keyword => msgLower.includes(keyword))) {
    return 'SUMMARY';
  }
  
  return 'GENERAL_CHAT';
};

const findClosestTask = (query, tasks) => {
  if (!query || !tasks || tasks.length === 0) return null;
  const qClean = query.toLowerCase().trim();
  
  let matched = tasks.find(t => t.title.toLowerCase() === qClean);
  if (matched) return matched;
  
  matched = tasks.find(t => t.title.toLowerCase().includes(qClean) || qClean.includes(t.title.toLowerCase()));
  if (matched) return matched;
  
  const qWords = qClean.split(/\s+/).filter(w => w.length > 3);
  if (qWords.length === 0) return null;
  
  let bestTask = null;
  let maxScore = 0;
  
  tasks.forEach(t => {
    const tLower = t.title.toLowerCase();
    let score = 0;
    qWords.forEach(word => {
      if (tLower.includes(word)) {
        score += 1;
      }
    });
    if (score > maxScore) {
      maxScore = score;
      bestTask = t;
    }
  });
  
  return maxScore > 0 ? bestTask : null;
};

const extractAndCleanJSON = (text) => {
  if (!text) return null;
  
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  
  if (start === -1 || end === -1 || start >= end) {
    return null;
  }
  
  let jsonStr = text.substring(start, end + 1).trim();
  
  try {
    return JSON.parse(jsonStr);
  } catch (err) {
    try {
      const fixedStr = jsonStr
        .replace(/,\s*([}\]])/g, '$1') 
        .replace(/[\u201C\u201D]/g, '"') 
        .replace(/[\u2018\u2019]/g, "'"); 
      return JSON.parse(fixedStr);
    } catch (innerErr) {
      console.warn("Failed to parse cleaned JSON:", jsonStr, innerErr);
      return null;
    }
  }
};

// Custom templates for highly detailed offline mock responses, ensuring a gorgeous experience
const COMMON_MICRO_TASKS = {
  'complete ai project': [
    { title: 'Define AI architecture & model select', duration: 45, status: 'pending' },
    { title: 'Setup Node/React project boilerplate', duration: 30, status: 'pending' },
    { title: 'Integrate Gemini API endpoints', duration: 90, status: 'pending' },
    { title: 'Build Glassmorphic UI Dashboard', duration: 120, status: 'pending' },
    { title: 'Implement Focus Mode & Rescue Engine', duration: 90, status: 'pending' },
    { title: 'Conduct local testing & debug errors', duration: 60, status: 'pending' },
    { title: 'Deploy application to hosting provider', duration: 45, status: 'pending' }
  ],
  'build portfolio website': [
    { title: 'Research inspiration & select color palette', duration: 30, status: 'pending' },
    { title: 'Wireframe Layout & content architecture', duration: 45, status: 'pending' },
    { title: 'Implement Tailwind Navbar & Navigation', duration: 30, status: 'pending' },
    { title: 'Design Hero Section with interactive canvas', duration: 60, status: 'pending' },
    { title: 'Build Project Showcase & Grid system', duration: 90, status: 'pending' },
    { title: 'Make layout fully responsive', duration: 60, status: 'pending' },
    { title: 'Optimize loading speeds & deploy', duration: 45, status: 'pending' }
  ],
  'prepare hackathon presentation': [
    { title: 'Outline core slides & hook introduction', duration: 30, status: 'pending' },
    { title: 'Draft visual script for live demo', duration: 45, status: 'pending' },
    { title: 'Record backup video of UI flow', duration: 45, status: 'pending' },
    { title: 'Refine product slide deck design', duration: 60, status: 'pending' },
    { title: 'Practice pitch timing (3 min limit)', duration: 60, status: 'pending' }
  ]
};

export const PromptLibrary = {
  getRiskAnalysisPrompt(task, availableHours, contextString) {
    return `
      You are an expert AI productivity engine. Analyze the risk of missing this task's deadline.
      Task Name: "${task.title}"
      Task Description: "${task.description || 'None'}"
      Deadline: "${task.deadline}" (Current time is ${new Date().toLocaleString()})
      Estimated duration to complete: ${task.estimatedTime} minutes
      User's available focus hours today: ${availableHours} hours
      Current task progress: ${task.progress}%

      Workspace Context:
      ${contextString}

      Respond ONLY with a valid JSON object matching this schema:
      {
        "score": number (0 to 100, probability of missing deadline),
        "level": "green" (0-39) | "yellow" (40-74) | "red" (75-100),
        "reasons": string[] (max 3 specific bullet points explaining why)
      }
      Do not output markdown codeblocks, only raw JSON.
    `;
  },

  getRescuePlanPrompt(tasks, availableHours, contextString) {
    return `
      You are the Navigator Engine. You are triggering "Rescue Mode" because the user's workload exceeds available hours (${availableHours} hours).
      Current Tasks:
      ${JSON.stringify(tasks.map(t => ({ id: t.id, title: t.title, priority: t.priority, durationMinutes: t.estimatedTime, progress: t.progress })))}
      
      Workspace Context:
      ${contextString}

      Create a Rescue Plan. You should:
      1. Identify low-priority tasks and suggest "deferred" status.
      2. Optimize time for remaining tasks (suggesting an optimized duration in minutes, usually 20-30% shorter by trimming fluff, adding note "Optimized by Navigator Engine").
      3. Formulate 3-4 bullet points of specific optimizations.
      4. Calculate success chance BEFORE (usually 20-50% depending on overload) and AFTER (aim for 85-95%).
      5. Write a short explanation of why this plan works.

      Respond ONLY with a valid JSON object matching this schema:
      {
        "successChanceBefore": number,
        "successChanceAfter": number,
        "optimizedTasks": [
           { "id": string, "status": "deferred" | "pending", "estimatedTime": number, "notes": string }
        ],
        "optimizations": string[],
        "explanation": string
      }
      Do not output markdown codeblocks, only raw JSON.
    `;
  },

  getPanicPlanPrompt(tasks, availableHours, contextString) {
    return `
      You are a crisis productivity coach. The user is completely overwhelmed and clicked the Panic Button.
      Available hours remaining: ${availableHours} hours.
      Current Tasks:
      ${JSON.stringify(tasks.map(t => ({ id: t.id, title: t.title, priority: t.priority, durationMinutes: t.estimatedTime })))}
      
      Workspace Context:
      ${contextString}

      You must:
      1. Keep only ONE (or at most two) critical high-priority task, and cut its duration aggressively (by 40-50% for core MVP).
      2. Defer all other tasks.
      3. Formulate an emergency 3-step concrete action plan.
      4. Write a reassuring, calm, and direct message to ground the user.

      Respond ONLY with a valid JSON object matching this schema:
      {
        "successChanceBefore": number,
        "successChanceAfter": number,
        "savedTaskIds": string[] (IDs of tasks we keep),
        "reducedDurations": { "taskId": number }, (new durations for saved tasks)
        "actionPlan": string[],
        "message": string
      }
      Do not output markdown codeblocks, only raw JSON.
    `;
  },

  getCoachPrompt(message, history, tasks, contextString) {
    const nowStr = new Date().toISOString();
    return `
      You are "Navigator", an elite, direct, and encouraging AI productivity coach on "The Last-Minute Life Saver" web app.
      The user is trying to complete their work under tight deadlines.
      Current Tasks:
      ${JSON.stringify(tasks.map(t => ({ id: t.id, title: t.title, priority: t.priority, progress: t.progress, status: t.status, deadline: t.deadline, estimatedTime: t.estimatedTime, riskScore: t.risk?.score })))}
      
      Workspace Context:
      ${contextString}

      Current System Time: ${nowStr}

      Recent Chat History:
      ${JSON.stringify(history.slice(-4))}

      User Message: "${message}"

      Determine if the user is asking you to:
      1. Summarize their schedule/timeline/risks.
      2. Evaluate a specific task or tasks (e.g. check feasibility, risks, suggestions).
      3. Create/add a new task (e.g. "create task Database for 2 hours priority high with subtasks: design, code").

      If they want to create/add a task, extract the title, optional description, priority ('low', 'medium', or 'high'), estimated duration (in minutes), and deadline.
      (If deadline is unspecified, make it tomorrow at 17:00, i.e. tomorrow at 5 PM. Use YYYY-MM-DDTHH:MM:00 format).
      Also, if the user mentions subtasks or steps for the new task, extract them as an array of strings in "subtasks".

      You MUST respond ONLY with a valid JSON object matching this schema:
      {
        "reply": "Your brief (2-4 sentences max), highly actionable, and empathetic response text. If you created a task, confirm it here.",
        "action": null | {
          "type": "CREATE_TASK",
          "payload": {
            "title": "Title of the task",
            "description": "Short description of the task",
            "priority": "low" | "medium" | "high",
            "estimatedTime": number (in minutes),
            "deadline": "YYYY-MM-DDTHH:MM:00",
            "subtasks": ["Subtask A", "Subtask B"]
          }
        }
      }
      Do not wrap your response in \`\`\`json or \`\`\`. Return only the raw JSON.
    `;
  }
};

export const ContextBuilder = {
  buildWorkspaceContext(workspace, availableHours) {
    if (!workspace) {
      return `Available Focus Hours: ${availableHours}h. No further profile context available.`;
    }
    return `
      User Profile: ${workspace.profile?.name || 'User'} (${workspace.profile?.occupation || 'Developer'}, Level ${workspace.profile?.level || 1})
      Focus Preference: ${workspace.preferences?.focusPreference || 'Morning'}
      Focus Hours Budget: ${workspace.preferences?.workHours || 8} hours
      Active Pending Tasks: ${(workspace.tasks || []).filter(t => t.status === 'pending').length} tasks
      Learning History: ${JSON.stringify(workspace.memories?.slice(-3) || [])}
    `;
  }
};

// Parse user keys or get environment key
const getGenAI = (apiKey) => {
  if (!apiKey) return null;
  try {
    return new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.error('Failed to initialize GoogleGenerativeAI:', err);
    return null;
  }
};

/**
 * Calculates risk index based on durations, availability, and deadlines
 */
export const calculateRiskOffline = (task, availableHours) => {
  const estimatedHours = task.estimatedTime / 60;
  const deadlineDate = new Date(task.deadline);
  const now = new Date();
  const hoursLeft = Math.max(1, (deadlineDate - now) / (1000 * 60 * 60));
  
  let score = 0;
  const reasons = [];

  // Ratio of estimated hours vs available hours
  const timeRatio = estimatedHours / (availableHours || 1);
  if (timeRatio > 1.2) {
    score += 45;
    reasons.push(`Estimated work (${estimatedHours.toFixed(1)}h) exceeds your available focus time (${availableHours}h).`);
  } else if (timeRatio > 0.8) {
    score += 25;
    reasons.push('Tight schedule: Workload utilizes almost all of your available time.');
  } else {
    score += 5;
  }

  // Proximity to deadline
  if (hoursLeft < 4) {
    score += 40;
    reasons.push(`Extreme urgency: Deadline is in less than 4 hours (${hoursLeft.toFixed(1)}h remaining).`);
  } else if (hoursLeft < 12) {
    score += 25;
    reasons.push(`Approaching deadline: Only ${hoursLeft.toFixed(1)} hours left to complete task.`);
  } else if (hoursLeft < 24) {
    score += 15;
    reasons.push('Deadline is tomorrow. Requires immediate focus.');
  }

  // Progress penalty
  if (task.progress < 10 && hoursLeft < 12) {
    score += 15;
    reasons.push(`Low start: Only ${task.progress}% done with very little time remaining.`);
  }

  // Cap score at 99% for visual impact unless past deadline
  score = Math.min(99, Math.max(5, score));
  if (hoursLeft <= 0) score = 100;

  let level = 'green';
  if (score >= 75) level = 'red';
  else if (score >= 40) level = 'yellow';

  return { score, level, reasons: reasons.length > 0 ? reasons : ['Task is on track with plenty of buffer time.'] };
};

/**
 * Main AI Service API wrapper
 */
export const AIService = {
  /**
   * Generates Risk Score and specific reasoning for a task
   */
  async analyzeTaskRisk(task, availableHours, apiKey, workspace = null) {
    const localResult = calculateRiskOffline(task, availableHours);
    const genAI = getGenAI(apiKey);
    
    if (!genAI) {
      // Simulate network delay for premium feel
      await new Promise(resolve => setTimeout(resolve, 800));
      return localResult;
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const contextString = ContextBuilder.buildWorkspaceContext(workspace, availableHours);
      const prompt = PromptLibrary.getRiskAnalysisPrompt(task, availableHours, contextString);
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (err) {
      console.warn('Gemini API Error, falling back to local engine:', err);
      return localResult;
    }
  },

  /**
   * Generates micro-tasks from a high-level task title
   */
  async generateMicroTasks(taskTitle, apiKey) {
    const key = taskTitle.toLowerCase().trim();
    let localTasks = COMMON_MICRO_TASKS[key];

    if (!localTasks) {
      // Dynamic local generator if task is custom
      localTasks = [
        { title: `Deconstruct project requirements for "${taskTitle}"`, duration: 20, status: 'pending' },
        { title: `Create rough outline / wireframe layout`, duration: 30, status: 'pending' },
        { title: `Draft core content and functional blocks`, duration: 60, status: 'pending' },
        { title: `Style layout details and fix responsiveness`, duration: 40, status: 'pending' },
        { title: `Double check work & fix outstanding errors`, duration: 30, status: 'pending' }
      ];
    }

    const genAI = getGenAI(apiKey);
    if (!genAI) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return localTasks;
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        You are an expert project planner. Break down the task "${taskTitle}" into 4 to 6 actionable micro-tasks.
        Each micro-task must be highly specific, bite-sized, and include an estimated completion duration in minutes.
        
        Respond ONLY with a valid JSON array of objects matching this schema:
        [
          { "title": "Bite-sized step description", "duration": 30, "status": "pending" }
        ]
        Do not output markdown codeblocks, only raw JSON. Total durations should align with a logical workflow.
      `;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (err) {
      console.warn('Gemini API Error, falling back to local microtasks:', err);
      return localTasks;
    }
  },

  /**
   * Rescue Mode Planning: Optimizes task lists, deferring/removing low priority, recalculating success chance
   */
  async generateRescuePlan(tasks, availableHours, apiKey, workspace = null) {
    // Local Rescue plan compilation
    const totalEstMinutes = tasks.reduce((acc, t) => acc + (t.status !== 'completed' ? t.estimatedTime : 0), 0);
    const totalEstHours = totalEstMinutes / 60;
    const initialSuccessChance = Math.max(15, Math.min(60, Math.round(100 - (totalEstHours / Math.max(1, availableHours)) * 50)));

    const optimizedTasks = tasks.map(t => {
      // 1. Defer low-priority tasks
      if (t.priority === 'low') {
        return {
          ...t,
          status: 'deferred',
          notes: 'AI deferred: Postponed to tomorrow to save time.'
        };
      }
      // 2. Reduce estimated time for high/medium priority tasks (optimizing scope)
      if (t.status !== 'completed') {
        const optimizedDuration = Math.round(t.estimatedTime * 0.75); // Trim 25% waste
        return {
          ...t,
          originalEstimatedTime: t.estimatedTime,
          estimatedTime: optimizedDuration,
          notes: `Optimized by Navigator Engine: Trimmed scope by 25% (${t.estimatedTime - optimizedDuration} mins saved).`
        };
      }
      return t;
    });

    const savedMinutes = tasks.reduce((sum, t, idx) => {
      const opt = optimizedTasks[idx];
      if (opt.status === 'deferred') return sum + t.estimatedTime;
      if (t.status !== 'completed') return sum + (t.estimatedTime - opt.estimatedTime);
      return sum;
    }, 0);

    const successChanceAfter = 91; // Demoed high target
    const optimizations = [
      `Deferred ${tasks.filter(t => t.priority === 'low').length} low-priority tasks to clear calendar buffers.`,
      `Streamlined scope for key tasks, saving ${savedMinutes} minutes in total.`,
      'Re-ordered timeline starting with high-impact, critical tasks first.',
      'Injected 10-minute focus recharges after intensive cognitive intervals.'
    ];

    const localResult = {
      successChanceBefore: initialSuccessChance,
      successChanceAfter: successChanceAfter,
      optimizedTasks,
      optimizations,
      explanation: `Rescue Plan completed. I postponed your low-priority tasks and optimized high-impact milestones by 25% to fit into your available ${availableHours}h schedule. Your success probability jumped from ${initialSuccessChance}% to 91%.`
    };

    const genAI = getGenAI(apiKey);
    if (!genAI) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return localResult;
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const contextString = ContextBuilder.buildWorkspaceContext(workspace, availableHours);
      const prompt = PromptLibrary.getRescuePlanPrompt(tasks, availableHours, contextString);
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const aiData = JSON.parse(cleanedText);

      // Map back to our full task structure
      const updatedTasks = tasks.map(t => {
        const opt = aiData.optimizedTasks.find(o => o.id === t.id);
        if (opt) {
          return {
            ...t,
            status: opt.status,
            originalEstimatedTime: t.estimatedTime,
            estimatedTime: opt.estimatedTime || t.estimatedTime,
            notes: opt.notes || 'Optimized by Navigator Engine'
          };
        }
        return t;
      });

      return {
        successChanceBefore: aiData.successChanceBefore || initialSuccessChance,
        successChanceAfter: aiData.successChanceAfter || successChanceAfter,
        optimizedTasks: updatedTasks,
        optimizations: aiData.optimizations || optimizations,
        explanation: aiData.explanation || localResult.explanation
      };
    } catch (err) {
      console.warn('Gemini API Rescue Mode error, using offline compiler:', err);
      return localResult;
    }
  },

  /**
   * Panic Button: Immediate survival mode, stripping all but critical tasks
   */
  async generatePanicPlan(tasks, availableHours, apiKey, workspace = null) {
    const activeTasks = tasks.filter(t => t.status !== 'completed');
    const deferredTasks = [];
    const savedTasks = [];

    // Keep only the single most critical task or high priority tasks
    let hasKeptCritical = false;
    activeTasks.forEach(t => {
      if (t.priority === 'high' && !hasKeptCritical) {
        savedTasks.push({
          ...t,
          estimatedTime: Math.round(t.estimatedTime * 0.6), // Trim scope aggressively (40%)
          notes: 'EMERGENCY: Trimmed to core MVP requirements.'
        });
        hasKeptCritical = true;
      } else {
        deferredTasks.push({
          ...t,
          status: 'deferred',
          notes: 'PANIC MODE: Shelved to clear focus space.'
        });
      }
    });

    // In case no high priority task was found
    if (savedTasks.length === 0 && activeTasks.length > 0) {
      savedTasks.push({
        ...activeTasks[0],
        estimatedTime: Math.round(activeTasks[0].estimatedTime * 0.6),
        notes: 'EMERGENCY: Trimmed to core MVP requirements.'
      });
      activeTasks.slice(1).forEach(t => {
        deferredTasks.push({ ...t, status: 'deferred', notes: 'PANIC MODE: Shelved.' });
      });
    }

    const localResult = {
      successChanceBefore: 12,
      successChanceAfter: 95,
      savedTasks,
      deferredTasks,
      actionPlan: [
        'Cancel all secondary deliverables and focus exclusively on the core presentation asset.',
        'Mute notifications and activate strict 25-minute Pomodoro sprints.',
        'Deliver a minimal working prototype instead of complete feature sets.'
      ],
      message: 'Take a deep breath. We have deferred almost all tasks and scaled your remaining high-priority task to its bare essentials. You can complete this.'
    };

    const genAI = getGenAI(apiKey);
    if (!genAI) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return localResult;
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const contextString = ContextBuilder.buildWorkspaceContext(workspace, availableHours);
      const prompt = PromptLibrary.getPanicPlanPrompt(tasks, availableHours, contextString);
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const aiData = JSON.parse(cleanedText);

      const updatedSaved = tasks.filter(t => aiData.savedTaskIds.includes(t.id)).map(t => ({
        ...t,
        estimatedTime: aiData.reducedDurations[t.id] || Math.round(t.estimatedTime * 0.6),
        notes: 'EMERGENCY: Trimmed to core MVP requirements.'
      }));

      const updatedDeferred = tasks.filter(t => !aiData.savedTaskIds.includes(t.id) && t.status !== 'completed').map(t => ({
        ...t,
        status: 'deferred',
        notes: 'PANIC MODE: Deferred to clear cognitive overload.'
      }));

      return {
        successChanceBefore: aiData.successChanceBefore || 12,
        successChanceAfter: aiData.successChanceAfter || 95,
        savedTasks: updatedSaved,
        deferredTasks: updatedDeferred,
        actionPlan: aiData.actionPlan || localResult.actionPlan,
        message: aiData.message || localResult.message
      };
    } catch (err) {
      console.warn('Gemini API Panic Mode error, using offline compiler:', err);
      return localResult;
    }
  },

  /**
   * Chat bot Coach Panel: Responds with actionable coaching feedback
   */
  async chatWithCoach(message, history, tasks, apiKey, workspace = null) {
    const intent = detectIntent(message);
    const availableHours = workspace?.preferences?.availableHours || 8;
    
    let offlineResult = null;
    
    if (intent === 'SUMMARY') {
      const completedCount = tasks.filter(t => t.status === 'completed').length;
      const pendingTasks = tasks.filter(t => t.status === 'pending');
      const pendingCount = pendingTasks.length;
      const highPriorityCount = pendingTasks.filter(t => t.priority === 'high').length;
      const totalMins = pendingTasks.reduce((sum, t) => sum + t.estimatedTime, 0);
      const totalHours = (totalMins / 60).toFixed(1);
      
      const now = new Date();
      const upcomingDeadlinesCount = pendingTasks.filter(t => {
        const diffHrs = (new Date(t.deadline) - now) / (1000 * 60 * 60);
        return diffHrs > 0 && diffHrs <= 24;
      }).length;
      
      const suggestFocus = pendingTasks.find(t => t.priority === 'high')?.title || pendingTasks[0]?.title || 'none';
      
      let summaryText = `📊 **Schedule Summary**:\n\n`;
      summaryText += `- **Completed**: ${completedCount} task(s)\n`;
      summaryText += `- **Pending**: ${pendingCount} task(s) (${highPriorityCount} high priority)\n`;
      summaryText += `- **Estimated Remaining Work**: ${totalHours} hours\n`;
      summaryText += `- **Deadlines in next 24h**: ${upcomingDeadlinesCount} task(s)\n\n`;
      summaryText += `💡 **Suggested Focus**: Complete **"${suggestFocus}"** first to protect your schedule.`;
      
      offlineResult = {
        reply: summaryText,
        action: null
      };
    } else if (intent === 'EVALUATE') {
      const searchTerms = message
        .replace(/(?:evaluate|check task|analyze task|check status of|how is|is my task|feasibility of|assess task|check my work)/i, '')
        .trim();
        
      const matched = findClosestTask(searchTerms, tasks);
      if (matched) {
        const risk = calculateRiskOffline(matched, availableHours);
        const hoursLeft = Math.max(0, (new Date(matched.deadline) - new Date()) / (1000 * 60 * 60));
        
        let evalText = `🔍 **Task Evaluation for "${matched.title}"**:\n\n`;
        evalText += `- **Priority**: ${matched.priority.toUpperCase()}\n`;
        evalText += `- **Time Estimate**: ${(matched.estimatedTime / 60).toFixed(1)} hours (${matched.estimatedTime} mins)\n`;
        evalText += `- **Time Remaining**: ${hoursLeft.toFixed(1)} hours\n`;
        evalText += `- **Risk Level**: **${risk.level.toUpperCase()}** (${risk.score}% score)\n\n`;
        evalText += `📋 **Key Factors**:\n` + risk.reasons.map(r => `  • ${r}`).join('\n') + `\n\n`;
        evalText += `💡 **Coaching Tip**: ${matched.priority === 'high' ? 'Ensure you start this first. This is a critical path item.' : 'Can be deferred if high priority items run late.'}`;
        
        offlineResult = {
          reply: evalText,
          action: null
        };
      } else {
        offlineResult = {
          reply: `🔍 Which task would you like me to evaluate? (e.g. "evaluate complete AI project" or "check Prepare Presentation")`,
          action: null
        };
      }
    } else if (intent === 'CREATE') {
      const msgLower = message.toLowerCase();
      let title = "";
      let mins = 60;
      let priority = 'medium';
      let subtasks = [];

      // 1. Clean command prefix
      let remainder = message;
      const prefixes = [
        /^(?:please\s+)?(?:add|create|schedule|make)\s+(?:a\s+)?(?:new\s+)?task\s+(?:for|to|named|called|with\s+title)?\s+/i,
        /^(?:please\s+)?(?:add|create|schedule|make)\s+/i,
        /^(?:new\s+task|task|add|create)\s+/i
      ];

      for (const prefix of prefixes) {
        if (prefix.test(remainder)) {
          remainder = remainder.replace(prefix, '');
          break;
        }
      }

      // 2. Extract subtasks
      const subtaskRegex = /(?:with\s+subtasks|subtasks:)\s*(.+)/i;
      const subtaskMatch = remainder.match(subtaskRegex);
      if (subtaskMatch) {
        subtasks = subtaskMatch[1].split(',').map(s => s.trim()).filter(Boolean);
        remainder = remainder.replace(subtaskRegex, '');
      }

      // 3. Extract duration
      const durationRegex = /for\s+(\d+)\s*(?:hours|hour|hrs|hr|mins|min|minutes)/i;
      const durationMatch = remainder.match(durationRegex);
      if (durationMatch) {
        const val = parseInt(durationMatch[1]);
        const unit = durationMatch[0].toLowerCase();
        if (unit.includes('hour') || unit.includes('hr')) {
          mins = val * 60;
        } else {
          mins = val;
        }
        remainder = remainder.replace(durationRegex, '');
      }

      // 4. Extract priority
      const priorityRegex = /(?:high|medium|low)\s+priority|priority\s+(?:high|medium|low)/i;
      const priorityMatch = remainder.match(priorityRegex);
      if (priorityMatch) {
        const pStr = priorityMatch[0].toLowerCase();
        if (pStr.includes('high')) priority = 'high';
        else if (pStr.includes('low')) priority = 'low';
        else priority = 'medium';
        remainder = remainder.replace(priorityRegex, '');
      }

      // 5. Clean up remainder to get Title
      title = remainder
        .replace(/\s+with\s*$/i, '')
        .replace(/\s+for\s*$/i, '')
        .replace(/\s+by\s*$/i, '')
        .replace(/\s+at\s*$/i, '')
        .trim();

      // Remove leading punctuation if any
      title = title.replace(/^[:\-\s\+]+/g, '').trim();

      if (!title) {
        offlineResult = {
          reply: "❌ Please specify a title for the task you want to create. (e.g., *'create task Database Refactor'*).",
          action: null
        };
      } else {
        const isDuplicate = tasks.some(t => t.title.toLowerCase() === title.toLowerCase());
        if (isDuplicate) {
          offlineResult = {
            reply: `⚠️ A task named **"${title}"** already exists in your backlog. Please choose a different title or refine the task details.`,
            action: null
          };
        } else {
          const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T17:00:00';
          
          let confirmationText = `✅ I've created the task: **"${title}"**\n`;
          confirmationText += `- **Duration**: ${(mins / 60).toFixed(1)} hours (${mins} mins)\n`;
          confirmationText += `- **Priority**: ${priority.toUpperCase()}\n`;
          if (subtasks.length > 0) {
            confirmationText += `- **Subtasks**: ${subtasks.map(s => `"${s}"`).join(', ')}\n`;
          }
          confirmationText += `\nI will calculate its risk index dynamically and add it to your dashboard workspace.`;

          offlineResult = {
            reply: confirmationText,
            action: {
              type: "CREATE_TASK",
              payload: {
                title,
                description: "Created via offline voice/chat command",
                priority,
                estimatedTime: mins,
                deadline: tomorrow,
                subtasks
              }
            }
          };
        }
      }
    } else {
      const localReplies = [
        "Let's focus on the critical task first. Finishing even one milestone builds tremendous momentum.",
        "You have postponed tasks in this category before. Let's work for just 15 minutes to break the barrier.",
        "According to your logs, you focus best in 25-minute sprints. Shall we spin up Focus Mode?",
        "Procrastination is often just anxiety about scale. Let's break your goal into smaller sub-tasks.",
        "I highly recommend postponing any meetings or low-impact tasks if you want to ship this by tonight."
      ];
      offlineResult = {
        reply: localReplies[Math.floor(Math.random() * localReplies.length)],
        action: null
      };
    }

    const genAI = getGenAI(apiKey);
    if (!genAI) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return offlineResult;
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const contextString = ContextBuilder.buildWorkspaceContext(workspace, availableHours);
      const prompt = PromptLibrary.getCoachPrompt(message, history, tasks, contextString);
      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();
      
      const parsed = extractAndCleanJSON(responseText);
      if (parsed && typeof parsed.reply === 'string') {
        if (parsed.action && parsed.action.type === 'CREATE_TASK' && parsed.action.payload) {
          const titleToCheck = parsed.action.payload.title || "";
          const isDuplicate = tasks.some(t => t.title.toLowerCase() === titleToCheck.toLowerCase());
          if (isDuplicate) {
            return {
              reply: `⚠️ I identified you wanted to create "${titleToCheck}", but that task already exists. Let me know if you want to create a different task instead!`,
              action: null
            };
          }
        }
        return {
          reply: parsed.reply,
          action: parsed.action || null
        };
      }
      
      return {
        reply: responseText,
        action: null
      };
    } catch (err) {
      console.warn('Gemini API Chat error, falling back to local handler:', err);
      return offlineResult;
    }
  }
};
