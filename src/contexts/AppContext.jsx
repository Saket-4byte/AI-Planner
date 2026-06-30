import React, { createContext, useState, useEffect, useContext } from 'react';
import { AIService } from '../services/aiService';
import { generateTimeline } from '../utils/scheduler';
import { StorageProvider } from '../services/storageProvider';

const AppContext = createContext();

const DEFAULT_TASKS = [
  {
    id: 'task-1',
    goalName: 'Hackathon Submission',
    milestoneName: 'Finish AI Dashboard',
    title: 'Complete AI Project',
    description: 'Finish dashboard views, integrate Gemini API, and clean CSS code.',
    priority: 'high',
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T23:59:00', // Tomorrow 11:59 PM
    estimatedTime: 480, // 8 hours
    originalEstimatedTime: 480,
    progress: 5,
    status: 'pending',
    dependencyCount: 3,
    microTasks: [
      { title: 'Define AI architecture & prompt setup', duration: 45, status: 'completed' },
      { title: 'Setup React/Vite boilerplate', duration: 30, status: 'pending' },
      { title: 'Integrate Gemini API endpoints', duration: 90, status: 'pending' },
      { title: 'Build Glassmorphic UI Dashboard', duration: 120, status: 'pending' }
    ],
    notes: 'Primary Blocker',
    evidence: ['✓ Google Calendar slots', '✓ Backlog durations', '✓ Blocker dependency chain']
  },
  {
    id: 'task-2',
    goalName: 'Hackathon Submission',
    milestoneName: 'Presentation Pitch',
    title: 'Prepare Hackathon Presentation',
    description: 'Draft the 3-minute pitch deck and rehearse visual walkthrough timing.',
    priority: 'high',
    deadline: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T17:00:00', // Tomorrow 5:00 PM
    estimatedTime: 180, // 3 hours
    originalEstimatedTime: 180,
    progress: 0,
    status: 'pending',
    dependencyCount: 1,
    microTasks: [
      { title: 'Outline core slides', duration: 30, status: 'pending' },
      { title: 'Draft script for live demo', duration: 45, status: 'pending' },
      { title: 'Practice pitch timing limits', duration: 60, status: 'pending' }
    ],
    notes: 'Blocked by Task-1',
    evidence: ['✓ Dependencies map', '✓ Deadline proximity']
  },
  {
    id: 'task-3',
    goalName: 'Hackathon Submission',
    milestoneName: 'Refactoring Phase',
    title: 'Refactor CSS Styling',
    description: 'Consolidate glassmorphism border colors and clean up Tailwind variables.',
    priority: 'low',
    deadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T18:00:00', // In 2 days
    estimatedTime: 240, // 4 hours
    originalEstimatedTime: 240,
    progress: 0,
    status: 'pending',
    dependencyCount: 0,
    microTasks: [],
    notes: '',
    evidence: ['✓ Priority index']
  }
];

const DEFAULT_MEMORIES = [
  "🧠 Today: Completed 'Define AI architecture' 18 minutes faster. Future estimates adjusted.",
  "🧠 Yesterday: Ignored afternoon Pomodoro reminders. Prioritizing morning focus sprints.",
  "🧠 Last Week: Weekend productivity index increased by 14%."
];

const DEMO_WORKSPACE = {
  metadata: {
    id: 'ws-demo',
    type: 'demo',
    version: 1,
    schemaVersion: '1.0',
    aiVersion: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSync: new Date().toISOString()
  },
  profile: {
    name: 'Saket',
    xp: 320,
    level: 2,
    productivityRank: 'Elite Focus Apprentice',
    streak: 5,
    deepHours: 14.5,
    sessions: 8,
    occupation: 'Developer'
  },
  preferences: {
    focusPreference: 'Evening',
    workHours: 3,
    availableHours: 3
  },
  analytics: {
    productivityRank: 'Elite Focus Apprentice',
    completedMissions: 8,
    efficiencyRating: 88
  },
  ai: {
    status: 'idle',
    lastReasoning: '',
    activeMission: null,
    confidence: 91,
    lastSimulation: null,
    learningState: null,
    lastPrediction: null
  },
  tasks: DEFAULT_TASKS,
  availableHours: 3,
  memories: DEFAULT_MEMORIES,
  coachMessages: [
    {
      sender: 'coach',
      text: "Good Evening Saket. I've analyzed today's schedule. You'll probably miss 2 deadlines. The main reason is your AI Project blocks 4 remaining tasks. I already prepared a rescue plan (28% ➔ 91%).",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ],
  blackBoxLogs: [
    { id: 'bb-1', time: '09:00', event: 'Calendar Sync', rationale: 'Google Calendar synchronized successfully.', why: 'To verify active cognitive blocks.' },
    { id: 'bb-2', time: '09:01', event: 'Workload Check', rationale: 'Workload conflict detected (15h vs 3h available).', why: 'Total estimated backlog exceeds available focus capacity.' },
    { id: 'bb-3', time: '09:01', event: 'Threat Diagnostic', rationale: 'Threat level set to CRITICAL (96% risk calculated).', why: 'Overload ratio exceeds safe buffer margins.' }
  ],
  snapshots: []
};

export const AppProvider = ({ children }) => {
  const initialUser = StorageProvider.getCurrentUser() || 'Saket';
  const initialWS = StorageProvider.loadWorkspace(initialUser) || (initialUser === 'Saket' ? DEMO_WORKSPACE : null);

  const [metadata, setMetadata] = useState(() => {
    return initialWS ? initialWS.metadata : {
      id: `ws-${initialUser.toLowerCase()}`,
      type: initialUser === 'Saket' ? 'demo' : 'personal',
      version: 1,
      schemaVersion: '1.0',
      aiVersion: '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastSync: new Date().toISOString()
    };
  });

  const [user, setUser] = useState(() => {
    return initialWS ? initialWS.profile : { 
      name: 'Saket', 
      xp: 320, 
      level: 2, 
      productivityRank: 'Elite Focus Apprentice',
      streak: 5,
      deepHours: 14.5,
      sessions: 8,
      occupation: 'Developer'
    };
  });

  const [preferences, setPreferences] = useState(() => {
    return initialWS ? initialWS.preferences : {
      focusPreference: 'Evening',
      workHours: 3,
      availableHours: 3
    };
  });

  const [analytics, setAnalytics] = useState(() => {
    return initialWS ? initialWS.analytics : {
      productivityRank: 'Elite Focus Apprentice',
      completedMissions: 8,
      efficiencyRating: 88
    };
  });

  const [aiState, setAiState] = useState(() => {
    return initialWS ? initialWS.ai : {
      status: 'idle',
      lastReasoning: '',
      activeMission: null,
      confidence: 91,
      lastSimulation: null,
      learningState: null,
      lastPrediction: null
    };
  });

  const [tasks, setTasks] = useState(() => {
    return initialWS ? initialWS.tasks : DEFAULT_TASKS;
  });

  const [availableHours, setAvailableHours] = useState(() => {
    return initialWS ? initialWS.availableHours : 3;
  });

  const [apiKey, setApiKey] = useState(() => {
    return import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('saver_gemini_key') || '';
  });

  // V4 OS States
  const [isRescueModeActive, setIsRescueModeActive] = useState(false);
  const [rescueData, setRescueData] = useState(null);
  const [isPanicModeActive, setIsPanicModeActive] = useState(false);
  const [panicData, setPanicData] = useState(null);
  const [memories, setMemories] = useState(() => {
    return initialWS ? initialWS.memories : DEFAULT_MEMORIES;
  });
  const [activeFocusTask, setActiveFocusTask] = useState(null);
  const [rescueVersion, setRescueVersion] = useState('v1');
  const [timeline, setTimeline] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Proactive Interventions State (Pillar 3)
  const [proactiveAlert, setProactiveAlert] = useState(false);
  const [hasIntervened, setHasIntervened] = useState(false);

  // Rebuilder console sequence state (Pillar 7)
  const [isRebuilding, setIsRebuilding] = useState(false);
  const [rebuildSteps, setRebuildSteps] = useState([]);
  const [rawPromptLog, setRawPromptLog] = useState('');

  // Simulation day states (Pillar 8)
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [simLogs, setSimLogs] = useState([]);

  // Predictive Tomorrow State (Pillar 6)
  const [showTomorrowForecast, setShowTomorrowForecast] = useState(false);
  
  const [coachMessages, setCoachMessages] = useState(() => {
    return initialWS ? initialWS.coachMessages : [
      {
        sender: 'coach',
        text: "Good Evening Saket. I've analyzed today's schedule. You'll probably miss 2 deadlines. The main reason is your AI Project blocks 4 remaining tasks. I already prepared a rescue plan (28% ➔ 91%).",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  
  // Mission Black Box Logger (Pillar 10)
  const [blackBoxLogs, setBlackBoxLogs] = useState(() => {
    return initialWS ? initialWS.blackBoxLogs : [
      { id: 'bb-1', time: '09:00', event: 'Calendar Sync', rationale: 'Google Calendar synchronized successfully.', why: 'To verify active cognitive blocks.' },
      { id: 'bb-2', time: '09:01', event: 'Workload Check', rationale: 'Workload conflict detected (15h vs 3h available).', why: 'Total estimated backlog exceeds available focus capacity.' },
      { id: 'bb-3', time: '09:01', event: 'Threat Diagnostic', rationale: 'Threat level set to CRITICAL (96% risk calculated).', why: 'Overload ratio exceeds safe buffer margins.' }
    ];
  });

  const [snapshots, setSnapshots] = useState(() => {
    return initialWS ? initialWS.snapshots || [] : [];
  });

  // Context device inputs (Pillar 3)
  const [deviceContext] = useState({ battery: 9, network: 'Online' });

  // AI Developer diagnostics HUD (Pillar 6)
  const [diagnostics] = useState({
    responseTime: '840ms',
    inferenceTime: '1.2s',
    memorySize: '24KB',
    simulations: 8,
    decisions: 14,
    interventions: 5
  });

  // Dynamic formula calculations (Pillar 1)
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const totalEstMinutes = pendingTasks.reduce((sum, t) => sum + t.estimatedTime, 0);
  const totalEstHours = totalEstMinutes / 60;
  
  // Calculate dynamic Risk
  let dynamicRisk = Math.round((totalEstHours / Math.max(1, availableHours)) * 40);
  const highPriorityCount = pendingTasks.filter(t => t.priority === 'high').length;
  if (highPriorityCount > 0) dynamicRisk += 25; // urgency penalty
  const blockerCount = pendingTasks.filter(t => t.dependencyCount >= 2).length;
  if (blockerCount > 0) dynamicRisk += 15; // dependency penalty
  dynamicRisk = Math.min(99, Math.max(5, dynamicRisk));
  if (pendingTasks.length === 0) dynamicRisk = 0;

  // Calculate dynamic Stress
  let dynamicStress = Math.round((totalEstHours / Math.max(1, availableHours)) * 35);
  dynamicStress += highPriorityCount * 10;
  // Deduct stress based on timeline break count
  const breakCount = tasks.filter(t => t.status === 'pending').length > 1 ? tasks.filter(t => t.status === 'pending').length - 1 : 0;
  dynamicStress -= breakCount * 5;
  dynamicStress = Math.min(98, Math.max(5, dynamicStress));
  if (pendingTasks.length === 0) dynamicStress = 0;

  // Calculate dynamic Confidence
  const overloadRatio = totalEstHours / Math.max(1, availableHours);
  let dynamicConfidence = 100 - Math.round(overloadRatio * 8) - (highPriorityCount * 5);
  dynamicConfidence = Math.max(10, Math.min(98, dynamicConfidence));
  if (isRescueModeActive) dynamicConfidence = 91; // Calibrated post-rescue

  // Confidence Explainability weights breakdown
  const confidenceBreakdown = {
    calendar: Math.round(dynamicConfidence * 0.32),
    dependencies: Math.round(dynamicConfidence * 0.25),
    workload: Math.round(dynamicConfidence * 0.20),
    history: Math.round(dynamicConfidence * 0.13),
    energy: Math.round(dynamicConfidence * 0.10)
  };

  // AI Negotiator Suggestions (Pillar 9)
  const negotiatorSuggestions = [
    { text: 'Move CSS Refactoring to tomorrow', savings: '4 hours', utility: '+35% success chance' },
    { text: 'Reschedule afternoon status meeting', savings: '1 hour', utility: '+12% success chance' },
    { text: 'Scale visual mock layouts to MVP essentials', savings: '2 hours', utility: '+18% success chance' }
  ];

  // Proactive alert scheduler (fires 5 seconds after loading the dashboard)
  useEffect(() => {
    if (dynamicRisk > 75 && !hasIntervened && !isRescueModeActive) {
      const timer = setTimeout(() => {
        setProactiveAlert(true);
        setHasIntervened(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [dynamicRisk, hasIntervened, isRescueModeActive]);

  // Sync state with localStorage and compute timeline
  useEffect(() => {
    if (user && user.name) {
      const nameKey = user.name.toLowerCase();
      const ws = {
        metadata: {
          ...metadata,
          updatedAt: new Date().toISOString()
        },
        profile: user,
        preferences: {
          ...preferences,
          availableHours
        },
        analytics,
        ai: {
          ...aiState,
          confidence: dynamicConfidence
        },
        tasks,
        availableHours,
        memories,
        coachMessages,
        blackBoxLogs,
        snapshots
      };
      
      StorageProvider.saveWorkspace(user.name, ws);
    }
    setTimeline(generateTimeline(tasks));
  }, [tasks, user, availableHours, memories, coachMessages, blackBoxLogs, snapshots]);

  const getWorkspaceSnapshotObj = () => {
    return {
      metadata,
      profile: user,
      preferences: { ...preferences, availableHours },
      analytics,
      ai: { ...aiState, confidence: dynamicConfidence },
      tasks,
      availableHours,
      memories,
      coachMessages,
      blackBoxLogs,
      snapshots
    };
  };

  const initializeWorkspace = (username, type = 'personal', onboardingData = {}) => {
    const nameKey = username.toLowerCase();
    
    let ws = {};
    if (type === 'demo') {
      ws = {
        metadata: {
          id: 'ws-demo',
          type: 'demo',
          version: 1,
          schemaVersion: '1.0',
          aiVersion: '1.0.0',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastSync: new Date().toISOString()
        },
        profile: {
          name: username || 'Saket',
          xp: 320,
          level: 2,
          productivityRank: 'Elite Focus Apprentice',
          streak: 5,
          deepHours: 14.5,
          sessions: 8,
          occupation: 'Developer'
        },
        preferences: {
          focusPreference: 'Evening',
          workHours: 3,
          availableHours: 3
        },
        analytics: {
          productivityRank: 'Elite Focus Apprentice',
          completedMissions: 8,
          efficiencyRating: 88
        },
        ai: {
          status: 'idle',
          lastReasoning: '',
          activeMission: null,
          confidence: 91,
          lastSimulation: null,
          learningState: null,
          lastPrediction: null
        },
        tasks: DEFAULT_TASKS,
        availableHours: 3,
        memories: DEFAULT_MEMORIES,
        coachMessages: [
          {
            sender: 'coach',
            text: "Good Evening Saket. I've analyzed today's schedule. You'll probably miss 2 deadlines. The main reason is your AI Project blocks 4 remaining tasks. I already prepared a rescue plan (28% ➔ 91%).",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ],
        blackBoxLogs: [
          { id: 'bb-1', time: '09:00', event: 'Calendar Sync', rationale: 'Google Calendar synchronized successfully.', why: 'To verify active cognitive blocks.' },
          { id: 'bb-2', time: '09:01', event: 'Workload Check', rationale: 'Workload conflict detected (15h vs 3h available).', why: 'Total estimated backlog exceeds available focus capacity.' },
          { id: 'bb-3', time: '09:01', event: 'Threat Diagnostic', rationale: 'Threat level set to CRITICAL (96% risk calculated).', why: 'Overload ratio exceeds safe buffer margins.' }
        ],
        snapshots: []
      };
    } else {
      const occ = onboardingData.occupation || 'Developer';
      const pref = onboardingData.focusPreference || 'Morning';
      const hours = Number(onboardingData.workHours || 8);

      ws = {
        metadata: {
          id: `ws-${nameKey}`,
          type: 'personal',
          version: 1,
          schemaVersion: '1.0',
          aiVersion: '1.0.0',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastSync: new Date().toISOString()
        },
        profile: {
          name: username,
          xp: 0,
          level: 1,
          productivityRank: 'Focus Novice',
          streak: 0,
          deepHours: 0,
          sessions: 0,
          occupation: occ
        },
        preferences: {
          focusPreference: pref,
          workHours: hours,
          availableHours: hours
        },
        analytics: {
          productivityRank: 'Focus Novice',
          completedMissions: 0,
          efficiencyRating: 100
        },
        ai: {
          status: 'idle',
          lastReasoning: '',
          activeMission: null,
          confidence: 100,
          lastSimulation: null,
          learningState: null,
          lastPrediction: null
        },
        tasks: [],
        availableHours: hours,
        memories: [
          `🧠 Memory #1: User profile created. Occupation: ${occ}. Focus Preference: ${pref}. No productivity history available. Entering observation mode.`
        ],
        coachMessages: [
          {
            sender: 'coach',
            text: `👋 Welcome to Saver.AI, ${username}! I've analyzed your onboarding preferences. As a ${occ} who prefers ${pref} focus blocks, I will calibrate your schedule to protect your peak energy times. Create your first task to get started!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ],
        blackBoxLogs: [
          { 
            id: 'bb-1', 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
            event: 'Workspace Initialized', 
            rationale: `Created fresh personal workspace for ${username}.`, 
            why: `Initialized settings for ${occ} with ${hours}h budget.` 
          }
        ],
        snapshots: []
      };
    }

    setMetadata(ws.metadata);
    setUser(ws.profile);
    setPreferences(ws.preferences);
    setAnalytics(ws.analytics);
    setAiState(ws.ai);
    setTasks(ws.tasks);
    setAvailableHours(ws.availableHours);
    setMemories(ws.memories);
    setCoachMessages(ws.coachMessages);
    setBlackBoxLogs(ws.blackBoxLogs);
    setSnapshots(ws.snapshots);

    StorageProvider.saveWorkspace(username, ws);
  };

  const createWorkspaceSnapshot = (eventLabel) => {
    const snapshot = {
      id: `snap-${Date.now()}`,
      timestamp: new Date().toISOString(),
      event: eventLabel,
      risk: dynamicRisk,
      confidence: dynamicConfidence,
      taskCount: tasks.filter(t => t.status === 'pending').length,
      estimatedHours: (tasks.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.estimatedTime, 0) / 60).toFixed(1)
    };
    setSnapshots(prev => [...prev, snapshot]);
  };

  const triggerGlobalRiskAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const currentWS = getWorkspaceSnapshotObj();
      const updated = await Promise.all(tasks.map(async (task) => {
        if (task.status === 'pending') {
          const risk = await AIService.analyzeTaskRisk(task, availableHours, apiKey, currentWS);
          return { ...task, risk };
        }
        return task;
      }));
      setTasks(updated);
      addBlackBoxLog('Risk Re-analysis', 'Triggered global workload risk re-evaluation.', 'Recalculated safety margins.');
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addBlackBoxLog = (event, rationale, why) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setBlackBoxLogs(prev => [
      ...prev,
      { id: `bb-${Date.now()}`, time, event, rationale, why }
    ]);
  };

  const addTask = async (taskData) => {
    const isFirstTask = tasks.length === 0;
    const initialMicroTasks = (taskData.subtasks && taskData.subtasks.length > 0)
      ? taskData.subtasks.map(subTitle => ({ 
          title: subTitle, 
          duration: Math.round(Number(taskData.estimatedTime || 60) / taskData.subtasks.length), 
          status: 'pending' 
        }))
      : [];

    const newTask = {
      id: `task-${Date.now()}`,
      goalName: 'Hackathon Submission',
      milestoneName: 'Backlog Tasks',
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      deadline: taskData.deadline || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      estimatedTime: Number(taskData.estimatedTime || 60),
      originalEstimatedTime: Number(taskData.estimatedTime || 60),
      progress: 0,
      status: 'pending',
      dependencyCount: taskData.priority === 'high' ? 2 : 0,
      microTasks: initialMicroTasks,
      notes: '',
      evidence: ['✓ Project parameters', '✓ Baseline estimates']
    };

    setTasks(prev => [newTask, ...prev]);
    addBlackBoxLog('Add Task', `Created task: "${newTask.title}".`, 'Backlog inventory synchronized.');

    setTimeout(async () => {
      try {
        const currentWS = getWorkspaceSnapshotObj();
        const risk = await AIService.analyzeTaskRisk(newTask, availableHours, apiKey, currentWS);
        const microTasks = (newTask.microTasks && newTask.microTasks.length > 0)
          ? newTask.microTasks
          : await AIService.generateMicroTasks(newTask.title, apiKey);
        setTasks(current => current.map(t => t.id === newTask.id ? { ...t, risk, microTasks } : t));
        addBlackBoxLog('Risk Analyzed', `Analyzed risk for "${newTask.title}".`, 'Assigned priority weight matrix.');
        
        if (isFirstTask) {
          setCoachMessages(prev => [
            ...prev,
            {
              sender: 'coach',
              text: `🧠 Interesting choice. You've added your first task: "${newTask.title}". I've queued it up in the Navigator Engine for priority tracking. I will dynamically calculate completion probabilities and optimize focus slots around it.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
          setMemories(prev => [
            ...prev,
            `🧠 Memory #2: First task created: "${newTask.title}". Calibrating focus engine for priority routing.`
          ]);
        }
        
        setTimeout(() => createWorkspaceSnapshot(isFirstTask ? 'First Task Added' : `Task Added: ${newTask.title}`), 100);
      } catch (e) {
        console.error(e);
      }
    }, 500);
  };

  const updateTask = (taskId, updates) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updated = { ...t, ...updates };
        if (updates.status === 'completed' && t.status !== 'completed') {
          awardXP(100);
          addBlackBoxLog('Task Complete', `Completed "${t.title}".`, 'XP bounds updated (+100 XP).');
          setTimeout(() => createWorkspaceSnapshot(`Task Completed: ${t.title}`), 100);
        }
        return updated;
      }
      return t;
    }));
  };

  const deleteTask = (taskId) => {
    const deleted = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (deleted) {
      addBlackBoxLog('Delete Task', `Removed "${deleted.title}".`, 'Cleared workspace blockers.');
      setTimeout(() => createWorkspaceSnapshot(`Task Deleted: ${deleted.title}`), 100);
    }
  };

  const awardXP = (xpAmount) => {
    setUser(prev => {
      const newXp = prev.xp + xpAmount;
      const nextLevelThreshold = prev.level * 500;
      if (newXp >= nextLevelThreshold) {
        addBlackBoxLog('Level Up', `User leveled up to LVL ${prev.level + 1}.`, 'Cognitive thresholds scaled.');
        return {
          ...prev,
          level: prev.level + 1,
          xp: newXp - nextLevelThreshold
        };
      }
      return { ...prev, xp: newXp };
    });
  };

  /**
   * Rescue Mode with Cinematic Raw Prompt Logs
   */
  const activateRescueMode = async () => {
    setIsRebuilding(true);
    setRawPromptLog(`[Saver.AI Orchestrator v4]
Input Context:
- Backlog: ${tasks.length} tasks
- Workload: ${totalEstHours} hours
- Available Focus Time: ${availableHours} hours
- Google Calendar Status: Conflicts at 17:00 and 23:59
- Device Context: Battery 9%, Network: Online

Triggering Gemini Decision Engine multi-agent optimizer...`);

    setRebuildSteps([
      { text: 'Scanning Google Calendar nodes...', status: 'loading' },
      { text: 'Analyzing task blocker dependencies...', status: 'pending' },
      { text: 'Activating AI Negotiator: Pruning CSS styling...', status: 'pending' },
      { text: 'Optimizing durations (25% cognitive savings)...', status: 'pending' },
      { text: 'Mapping optimized daily timeline schedule...', status: 'pending' }
    ]);

    await new Promise(r => setTimeout(r, 600));
    setRebuildSteps(prev => prev.map((s, idx) => idx === 0 ? { ...s, status: 'done' } : idx === 1 ? { ...s, status: 'loading' } : s));
    
    await new Promise(r => setTimeout(r, 600));
    setRebuildSteps(prev => prev.map((s, idx) => idx === 1 ? { ...s, status: 'done' } : idx === 2 ? { ...s, status: 'loading' } : s));

    await new Promise(r => setTimeout(r, 600));
    setRebuildSteps(prev => prev.map((s, idx) => idx === 2 ? { ...s, status: 'done' } : idx === 3 ? { ...s, status: 'loading' } : s));

    await new Promise(r => setTimeout(r, 600));
    setRebuildSteps(prev => prev.map((s, idx) => idx === 3 ? { ...s, status: 'done' } : idx === 4 ? { ...s, status: 'loading' } : s));

    await new Promise(r => setTimeout(r, 600));
    setRebuildSteps(prev => prev.map((s, idx) => idx === 4 ? { ...s, status: 'done' } : s));

    try {
      const currentWS = getWorkspaceSnapshotObj();
      const plan = await AIService.generateRescuePlan(tasks, availableHours, apiKey, currentWS);
      setRescueData(plan);
      setTasks(plan.optimizedTasks);
      setIsRescueModeActive(true);
      setRescueVersion(prev => prev === 'v1' ? 'v2 Accepted' : 'v3 Optimized');
      
      setUser(prev => ({ ...prev, productivityScore: 92 }));
      addBlackBoxLog('Rescue Mode', 'Deploying Rescue Plan v2.', 'Adjusted workload threat indicators.');
      setTimeout(() => createWorkspaceSnapshot('Rescue Mode Activated'), 100);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRebuilding(false);
      setRawPromptLog('');
    }
  };

  const activatePanicMode = async () => {
    setIsAnalyzing(true);
    try {
      const currentWS = getWorkspaceSnapshotObj();
      const plan = await AIService.generatePanicPlan(tasks, availableHours, apiKey, currentWS);
      setPanicData(plan);
      setTasks([...plan.savedTasks, ...plan.deferredTasks]);
      setIsPanicModeActive(true);
      setUser(prev => ({ ...prev, productivityScore: 95 }));
      addBlackBoxLog('Panic Protocol', 'Panic plan initiated.', 'Muted notifications and isolated single focus.');
      setTimeout(() => createWorkspaceSnapshot('Panic Mode Activated'), 100);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const deactivateRescueMode = () => {
    setIsRescueModeActive(false);
    setRescueData(null);
  };

  const deactivatePanicMode = () => {
    setIsPanicModeActive(false);
    setPanicData(null);
  };

  const validateAction = (action, existingTasks) => {
    if (!action || typeof action !== 'object') {
      return { isValid: false, reason: "Action is empty or not an object." };
    }
    
    const { type, payload } = action;
    
    if (type !== 'CREATE_TASK') {
      return { isValid: false, reason: `Unsupported action type: "${type}"` };
    }
    
    if (!payload || typeof payload !== 'object') {
      return { isValid: false, reason: "Action payload is empty or not an object." };
    }
    
    const { title, estimatedTime, priority, deadline } = payload;
    
    if (!title || typeof title !== 'string' || !title.trim()) {
      return { isValid: false, reason: "Task title must be a non-empty string." };
    }
    
    if (estimatedTime !== undefined && (isNaN(Number(estimatedTime)) || Number(estimatedTime) <= 0)) {
      return { isValid: false, reason: "Task estimatedTime must be a positive number." };
    }
    
    if (priority !== undefined && !['low', 'medium', 'high'].includes(priority)) {
      return { isValid: false, reason: "Task priority must be 'low', 'medium', or 'high'." };
    }
    
    if (deadline !== undefined && isNaN(Date.parse(deadline))) {
      return { isValid: false, reason: "Task deadline must be a valid date string." };
    }
    
    const isDuplicate = existingTasks.some(t => t.title.toLowerCase() === title.trim().toLowerCase());
    if (isDuplicate) {
      return { isValid: false, reason: `A task with title "${title}" already exists.` };
    }
    
    return { isValid: true };
  };

  const sendCoachChat = async (text) => {
    const newUserMsg = { sender: 'user', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const updatedHistory = [...coachMessages, newUserMsg];
    setCoachMessages(updatedHistory);

    setTimeout(async () => {
      try {
        const currentWS = getWorkspaceSnapshotObj();
        const chatResponse = await AIService.chatWithCoach(text, updatedHistory, tasks, apiKey, currentWS);
        
        setCoachMessages(prev => [
          ...prev,
          { sender: 'coach', text: chatResponse.reply, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);

        if (chatResponse.action) {
          const action = chatResponse.action;
          const validation = validateAction(action, tasks);
          
          if (validation.isValid) {
            if (action.type === 'CREATE_TASK') {
              const payload = action.payload;
              const validatedPayload = {
                title: payload.title.trim(),
                description: payload.description || 'Created via Coach command',
                priority: payload.priority || 'medium',
                estimatedTime: Number(payload.estimatedTime || 60),
                deadline: payload.deadline || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                subtasks: payload.subtasks || []
              };
              await addTask(validatedPayload);
            }
          } else {
            console.warn(`[Coach Action Dispatcher] Invalid action: ${validation.reason}`);
            setCoachMessages(prev => [
              ...prev,
              { 
                sender: 'coach', 
                text: `⚠️ **Action Rejected**: ${validation.reason}`, 
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
              }
            ]);
          }
        }
      } catch (e) {
        console.error("Coach chat processing error:", e);
      }
    }, 500);
  };

  const startDaySimulation = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep(1);
    setSimLogs(['[09:00] - Saket initiates morning Focus block for coding...']);

    await new Promise(r => setTimeout(r, 2000));
    setSimStep(2);
    setSimLogs(prev => [...prev, '[11:00] - Quick stand-up meeting completed (+25 XP).']);

    await new Promise(r => setTimeout(r, 2000));
    setSimStep(3);
    setSimLogs(prev => [...prev, '[12:30] - ⚠️ Procrastination Warning: Delay detected. Buffer reduced.']);
    
    await new Promise(r => setTimeout(r, 2000));
    setSimStep(4);
    setSimLogs(prev => [...prev, '[13:00] - AI re-planner slides timeline schedule to protect 5 PM milestone.']);

    await new Promise(r => setTimeout(r, 2000));
    setSimStep(5);
    setSimLogs(prev => [...prev, '[15:00] - "Complete AI Project" successfully finished (+200 XP).']);

    await new Promise(r => setTimeout(r, 2000));
    setSimStep(6);
    setSimLogs(prev => [...prev, '[19:00] - Slide deck presentation rehearsed and uploaded. Final Day success rate: 94%.']);

    await new Promise(r => setTimeout(r, 3000));
    setIsSimulating(false);
    setSimStep(0);
    setSimLogs([]);
  };

  const resetDemo = () => {
    initializeWorkspace('Saket', 'demo');
  };

  const loginUser = (name) => {
    const loaded = StorageProvider.loadWorkspace(name);
    if (loaded) {
      setMetadata(loaded.metadata);
      setUser(loaded.profile);
      setPreferences(loaded.preferences);
      setAnalytics(loaded.analytics);
      setAiState(loaded.ai);
      setTasks(loaded.tasks);
      setAvailableHours(loaded.availableHours);
      setMemories(loaded.memories);
      setCoachMessages(loaded.coachMessages);
      setBlackBoxLogs(loaded.blackBoxLogs);
      setSnapshots(loaded.snapshots || []);
      localStorage.setItem('saver_current_user', name);
    } else {
      initializeWorkspace(name, 'personal', {});
    }
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        availableHours,
        setAvailableHours,
        user,
        apiKey,
        setApiKey,
        activeFocusTask,
        setActiveFocusTask,
        isRescueModeActive,
        rescueData,
        isPanicModeActive,
        panicData,
        coachMessages,
        timeline,
        isAnalyzing,
        memories,
        blackBoxLogs,
        isRebuilding,
        rebuildSteps,
        rawPromptLog,
        isSimulating,
        simStep,
        simLogs,
        deviceContext,
        diagnostics,
        dynamicRisk,
        dynamicStress,
        dynamicConfidence,
        confidenceBreakdown,
        negotiatorSuggestions,
        rescueVersion,
        proactiveAlert,
        setProactiveAlert,
        showTomorrowForecast,
        setShowTomorrowForecast,
        triggerGlobalRiskAnalysis,
        addTask,
        updateTask,
        deleteTask,
        awardXP,
        activateRescueMode,
        deactivateRescueMode,
        activatePanicMode,
        deactivatePanicMode,
        sendCoachChat,
        startDaySimulation,
        resetDemo,
        loginUser,
        initializeWorkspace,
        snapshots,
        metadata
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
