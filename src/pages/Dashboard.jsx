import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Zap, AlertCircle, Clock, Settings, RefreshCw, LogOut, 
  HelpCircle, Sparkles, Play, Award, ShieldAlert, CheckCircle2, ChevronDown, ChevronUp, Brain, Terminal
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import RiskGauge from '../components/RiskGauge';
import Timeline from '../components/Timeline';
import RescueModeModal from '../components/RescueModeModal';
import PanicOverlay from '../components/PanicOverlay';
import OutcomeSimulator from '../components/OutcomeSimulator';
import DependencyGraph from '../components/DependencyGraph';
import LiveRebuilder from '../components/LiveRebuilder';
import StressMeter from '../components/StressMeter';
import ExplainabilityDashboard from '../components/ExplainabilityDashboard';
import ProductivityHeatmap from '../components/ProductivityHeatmap';
import SmartNotifications from '../components/SmartNotifications';
import TrustCenter from '../components/TrustCenter';
import HealthMonitor from '../components/HealthMonitor';

const Dashboard = ({ onLogout, onEnterFocus }) => {
  const {
    tasks,
    availableHours,
    setAvailableHours,
    user,
    timeline,
    isRescueModeActive,
    rescueData,
    isPanicModeActive,
    panicData,
    isAnalyzing,
    triggerGlobalRiskAnalysis,
    addTask,
    updateTask,
    deleteTask,
    activateRescueMode,
    deactivateRescueMode,
    activatePanicMode,
    deactivatePanicMode,
    resetDemo,
    memories,
    blackBoxLogs,
    isRebuilding,
    rebuildSteps,
    isSimulating,
    simStep,
    simLogs,
    startDaySimulation,
    deviceContext,
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
    metadata
  } = useApp();

  const [showAddTask, setShowAddTask] = useState(false);
  const [showWhyBrief, setShowWhyBrief] = useState(false);
  
  // Dashboard Tabs (The AI Decision Pipeline)
  const [activeTab, setActiveTab] = useState('mission'); // mission | execution | brain | analytics

  // Task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [deadlineTime, setDeadlineTime] = useState('17:00');
  const [estimatedTime, setEstimatedTime] = useState(60);



  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const totalEstMinutes = pendingTasks.reduce((sum, t) => sum + t.estimatedTime, 0);
  const totalEstHours = totalEstMinutes / 60;
  const maxRiskTask = pendingTasks.reduce((max, t) => (t.risk?.score > (max?.risk?.score || 0) ? t : max), null);
  const aggregateRisk = maxRiskTask?.risk || { score: 10, level: 'green', reasons: ['Schedules balanced.'] };

  const handleAddTaskSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const deadline = `${tomorrow}T${deadlineTime}:00`;

    addTask({ title, description, priority, deadline, estimatedTime: Number(estimatedTime) });
    setShowAddTask(false);
    
    // Clear forms
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDeadlineTime('17:00');
    setEstimatedTime(60);
  };



  const handleNegotiate = (item) => {
    // Simulate negotiator trimming task list duration or deferring low priority
    if (item.text.includes('CSS')) {
      const cssTask = tasks.find(t => t.title.toLowerCase().includes('css'));
      if (cssTask) {
        updateTask(cssTask.id, { status: 'deferred', notes: 'Deferred by AI Negotiator' });
      }
    } else {
      // Just simulate scheduling optimization
      updateTask('task-1', { estimatedTime: 360, notes: 'Calibrated scope by AI Negotiator' });
    }
  };

  const getDynamicBriefText = () => {
    if (pendingTasks.length === 0) {
      return "Your workspace is clear. Add your current tasks and set your Focus Budget to receive real-time schedule diagnostics.";
    }

    let lateCount = 0;
    let mainBlocker = "";
    
    const highPriorityTasks = pendingTasks.filter(t => t.priority === 'high');
    if (highPriorityTasks.length > 0) {
      mainBlocker = highPriorityTasks[0].title;
    } else if (pendingTasks.length > 0) {
      mainBlocker = pendingTasks[0].title;
    }

    let currentEstTime = 0;
    const now = Date.now();
    pendingTasks.forEach(task => {
      currentEstTime += task.estimatedTime;
      const scheduledEnd = new Date(now + currentEstTime * 60 * 1000);
      const deadlineDate = new Date(task.deadline);
      if (scheduledEnd > deadlineDate) {
        lateCount++;
      }
    });

    const totalEstHoursVal = totalEstHours;
    if (totalEstHoursVal > availableHours) {
      const excessHours = (totalEstHoursVal - availableHours).toFixed(1);
      if (lateCount > 0) {
        return `I've analyzed today's schedule. You are overloaded by ${excessHours} hours, and you'll probably miss ${lateCount} deadline${lateCount > 1 ? 's' : ''}. The main reason is your "${mainBlocker}" blocks the schedule. I already prepared a rescue plan to optimize deadlines.`;
      } else {
        return `I've analyzed today's schedule. You are overloaded by ${excessHours} hours. The main reason is your "${mainBlocker}" requires significant focus time. I already prepared a rescue plan to optimize deadlines.`;
      }
    }

    if (lateCount > 0) {
      return `I've analyzed today's schedule. You'll probably miss ${lateCount} deadline${lateCount > 1 ? 's' : ''} due to timing conflicts. The main blocker is "${mainBlocker}". I already prepared a rescue plan to optimize deadlines.`;
    }

    return `All pending tasks are currently within your focus budget. Your schedule looks healthy and achievable!`;
  };

  const getBriefExplanation = () => {
    if (pendingTasks.length === 0) {
      return {
        why: "Your workspace has no pending tasks, so there are no scheduling conflicts or risks.",
        whyNow: "Set up tasks to let the AI negotiate focus slots based on your active windows.",
        whatIf: "Without tasks, the system cannot predict deadline failures or recommend rescue plans."
      };
    }

    const highPriorityTasks = pendingTasks.filter(t => t.priority === 'high');
    const mainBlocker = highPriorityTasks.length > 0 ? highPriorityTasks[0].title : pendingTasks[0].title;
    
    const blockersWithDeps = pendingTasks.filter(t => t.dependencyCount > 0);
    const blockerReason = blockersWithDeps.length > 0
      ? `"${blockersWithDeps[0].title}" blocks ${blockersWithDeps[0].dependencyCount} dependent milestone(s).`
      : `"${mainBlocker}" consumes most of your estimated focus budget.`;

    const baselineSuccess = 100 - dynamicRisk;

    return {
      why: blockerReason,
      whyNow: "Current calendar slots have an optimized focus block starting now to prevent context switching.",
      whatIf: `Overall completion probability falls from ${dynamicConfidence}% down to ${baselineSuccess}%.`
    };
  };

  const explanations = getBriefExplanation();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6 select-none relative">
      
      {/* Top OS Navigation Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div onClick={() => setActiveTab('mission')} className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shadow-glow-primary">
            <Flame className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">Saver.AI</h1>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Productivity OS v4.0</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Inline Focus Budget Slider */}
          <div className="glass-panel px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-3 text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px] whitespace-nowrap">Focus Budget:</span>
            <span className="text-white font-mono font-bold whitespace-nowrap">{availableHours}h</span>
            <input
              type="range" min="1" max="12" step="0.5"
              value={availableHours} onChange={(e) => {
                setAvailableHours(Number(e.target.value));
                setTimeout(() => triggerGlobalRiskAnalysis(), 100);
              }}
              className="w-24 accent-brand-primary bg-slate-800 h-1 rounded-lg cursor-pointer"
            />
          </div>

          {/* User Profile HUD */}
          <div className="glass-panel px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-2 text-xs">
            <span className="font-bold text-brand-secondary">{user.productivityRank}</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="font-bold text-white">LVL {user.level}</span>
            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary" 
                style={{ width: `${(user.xp / (user.level * 500)) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-brand-success font-bold font-mono">Streak: {user.streak}d 🔥</span>
          </div>

          {metadata?.type === 'demo' && (
            <>
              <button onClick={resetDemo} className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-brand-primary/10 rounded-xl border border-white/5 transition-all" title="Reset Demo Flow">
                <RefreshCw className="w-4.5 h-4.5" />
              </button>

              <button onClick={onLogout} className="p-2 text-slate-400 hover:text-brand-danger bg-white/5 hover:bg-brand-danger/5 rounded-xl border border-white/5 transition-all">
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* PILLAR 1: AI Daily Brief Hero HUD */}
      <div className="glass-panel rounded-3xl p-6 border border-brand-primary/10 bg-brand-primary/2 relative overflow-hidden space-y-4">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-transparent to-brand-secondary/5 opacity-40 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Executive Daily Brief
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Good Evening {user.name}.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
              {getDynamicBriefText()}
            </p>

            {pendingTasks.length > 0 && (
              <div className="flex items-center gap-3 text-xs bg-slate-900/60 border border-white/3 rounded-xl p-2.5 max-w-sm">
                <span className="text-slate-400 uppercase font-bold text-[10px]">Today's Success:</span>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 line-through font-bold">{100 - dynamicRisk}%</span>
                  <span className="text-slate-400">➔</span>
                  <span className="text-brand-success font-black text-glow-success text-sm">{dynamicConfidence}%</span>
                  <span className="text-slate-400 text-[10px]">after Rescue</span>
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-2.5 flex-shrink-0 self-start md:self-auto z-10">
            <button 
              onClick={activateRescueMode} 
              disabled={pendingTasks.length === 0}
              className="py-3 px-5 bg-gradient-to-r from-brand-primary to-brand-secondary hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-glow-primary hover:shadow-2xl transition-all flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4 fill-white" /> Activate Rescue
            </button>
            <button 
              onClick={activatePanicMode}
              disabled={pendingTasks.length === 0}
              className="py-3 px-4 bg-gradient-to-r from-brand-danger to-orange-600 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-glow-danger hover:shadow-2xl transition-all flex items-center gap-1.5"
            >
              <AlertCircle className="w-4 h-4" /> Overwhelmed
            </button>
          </div>
        </div>

        {/* Why this recommendations accordion */}
        <div className="border-t border-white/5 pt-3">
          <button 
            onClick={() => setShowWhyBrief(!showWhyBrief)}
            className="flex items-center gap-1 text-[11px] font-bold text-brand-primary uppercase hover:text-brand-primary/80 transition-colors"
          >
            {showWhyBrief ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Explain this recommendation
          </button>

          <AnimatePresence>
            {showWhyBrief && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 bg-slate-950/40 border border-white/3 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed space-y-3.5 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/2 border border-white/3 p-3 rounded-xl space-y-1">
                    <span className="block font-bold text-white uppercase text-[10px]">Why?</span>
                    <p className="text-slate-400">{explanations.why}</p>
                  </div>
                  <div className="bg-white/2 border border-white/3 p-3 rounded-xl space-y-1">
                    <span className="block font-bold text-white uppercase text-[10px]">Why Now?</span>
                    <p className="text-slate-400">{explanations.whyNow}</p>
                  </div>
                  <div className="bg-white/2 border border-white/3 p-3 rounded-xl space-y-1">
                    <span className="block font-bold text-white uppercase text-[10px]">What If I Don't?</span>
                    <p className={pendingTasks.length > 0 ? "text-brand-danger" : "text-slate-400"}>{explanations.whatIf}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* PILLAR 9: AI Negotiator Panel (Visible if workload is impossible and rescue is inactive) */}
      {!isRescueModeActive && pendingTasks.length > 1 && (
        <div className="glass-panel border-brand-warning/20 bg-brand-warning/3 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] bg-brand-warning/15 text-brand-warning border border-brand-warning/20 px-2 py-0.5 rounded font-bold uppercase">
              AI Negotiator Active
            </span>
            <span className="text-xs text-slate-400">Current workload is mathematically impossible.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {negotiatorSuggestions.map((item, idx) => (
              <div key={idx} className="bg-[#0b0c14]/40 border border-white/5 rounded-xl p-3.5 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-xs font-bold text-white block">{item.text}</span>
                  <span className="text-[10px] text-slate-400 mt-1 block">Saves: {item.savings}</span>
                </div>
                <button
                  onClick={() => handleNegotiate(item)}
                  className="py-1.5 bg-brand-warning/10 hover:bg-brand-warning/20 text-brand-warning font-bold text-[10px] uppercase rounded-lg border border-brand-warning/20 transition-all text-center"
                >
                  Adopt recommendation ({item.utility})
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OS Stepper Tab Pipeline (Mission Control ➔ Execution ➔ AI Brain ➔ Analytics) */}
      <div className="flex border border-white/5 rounded-2xl bg-slate-950 overflow-hidden text-center text-xs font-bold font-sans uppercase tracking-wider shadow-inner">
        {[
          { key: 'mission', label: '1. Mission Control', desc: 'Navigator predicts conflicts' },
          { key: 'execution', label: '2. Execution Hub', desc: 'Navigator guides focus' },
          { key: 'brain', label: '3. Decision Trace', desc: 'Navigator explains decisions' },
          { key: 'analytics', label: '4. System Monitor', desc: 'Navigator calibrates logs' }
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex-1 py-3 border-r border-white/5 last:border-0 transition-all flex flex-col items-center justify-center ${
              activeTab === t.key 
                ? 'bg-brand-primary text-white shadow-glow-primary' 
                : 'text-slate-400 hover:text-white hover:bg-white/1'
            }`}
          >
            <span>{t.label}</span>
            <span className="text-[8px] opacity-70 font-medium normal-case font-mono mt-0.5">{t.desc}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: Mission Control (Predict) */}
          {activeTab === 'mission' && (
            <motion.div
              key="tab-mission"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
            >
              {pendingTasks.length === 0 ? (
                <div className="md:col-span-8 glass-panel rounded-3xl p-8 border border-white/5 flex flex-col items-center justify-center text-center space-y-6 min-h-[350px]">
                  <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shadow-glow-primary">
                    <Brain className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h3 className="text-lg font-extrabold text-white tracking-tight">Mission Control Clear</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      No active missions detected in this workspace. Let's create your first task or sync your external agenda to start real-time schedule risk forecasting.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setShowAddTask(true)}
                      className="py-3 px-6 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-glow-primary hover:shadow-2xl transition-all"
                    >
                      + Create First Task
                    </button>
                    <button 
                      onClick={() => {
                        addTask({
                          title: 'Imported Calendar Sync',
                          description: 'Synchronized meetings and appointments from Google Calendar.',
                          priority: 'medium',
                          estimatedTime: 120,
                          deadline: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString()
                        });
                      }}
                      className="py-3 px-6 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/5 transition-all"
                    >
                      Import Calendar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="md:col-span-8 space-y-6">
                  {/* Simulator right under daily brief */}
                  <OutcomeSimulator />
                  
                  {/* Risk and Confidence gauges */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">AI Threat Diagnostics</span>
                      <RiskGauge score={dynamicRisk} level={dynamicRisk > 75 ? 'red' : dynamicRisk > 40 ? 'yellow' : 'green'} reasons={aggregateRisk.reasons} />
                    </div>

                    {/* Confidence explainability weights */}
                    <div className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col justify-between space-y-3.5">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">Calibration Confidence</span>
                          <span className="text-brand-success font-black text-xs">{dynamicConfidence}%</span>
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono">Calculated from dynamic factors</span>
                      </div>

                      <div className="space-y-2">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                            <span>Calendar availability slots</span>
                            <span>31%</span>
                          </div>
                          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-primary" style={{ width: '31%' }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                            <span>Task blocker dependencies</span>
                            <span>24%</span>
                          </div>
                          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-primary" style={{ width: '24%' }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                            <span>Workload density buffer</span>
                            <span>19%</span>
                          </div>
                          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-primary" style={{ width: '19%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="md:col-span-4 space-y-6">
                <StressMeter tasks={tasks} availableHours={availableHours} />
                <SmartNotifications />
              </div>
            </motion.div>
          )}

          {/* TAB 2: Execution Hub (Action) */}
          {activeTab === 'execution' && (
            <motion.div
              key="tab-execution"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
            >
              <div className="md:col-span-8 space-y-6">
                
                {/* Smart Focus card with 3 explainability questions */}
                {pendingTasks.length > 0 && (
                  <div className="glass-panel rounded-2xl p-5 border border-brand-primary/15 bg-brand-primary/3 flex flex-col justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary flex-shrink-0 mt-0.5">
                        <Play className="w-5 h-5 fill-brand-primary animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-primary font-bold uppercase tracking-wider block">Priority Focus Session</span>
                        <h4 className="text-sm font-bold text-white leading-tight">{pendingTasks[0].title}</h4>
                        <p className="text-[11px] text-slate-400">Goal: <strong>{pendingTasks[0].goalName}</strong> • Milestone: <strong>{pendingTasks[0].milestoneName}</strong></p>
                        
                        {/* Explainability Engine answers */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 border-t border-white/5 pt-3 text-[10px] leading-relaxed">
                          <div className="bg-black/40 p-2.5 rounded-xl border border-white/3">
                            <span className="block font-bold text-white uppercase text-[8px]">Why?</span>
                            <span className="text-slate-400">Unlocks 3 dependent milestones.</span>
                          </div>
                          <div className="bg-black/40 p-2.5 rounded-xl border border-white/3">
                            <span className="block font-bold text-white uppercase text-[8px]">Why Now?</span>
                            <span className="text-slate-400">Google Calendar has 2h free block.</span>
                          </div>
                          <div className="bg-black/40 p-2.5 rounded-xl border border-white/3">
                            <span className="block font-bold text-brand-danger uppercase text-[8px]">What if I don't?</span>
                            <span className="text-brand-danger">Completion drops from 91% to 57%.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onEnterFocus(pendingTasks[0])}
                      className="w-full bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs py-3 rounded-xl shadow-glow-primary transition-all flex items-center justify-center gap-1.5"
                    >
                      Enter Focus Mode
                    </button>
                  </div>
                )}

                {/* Backlog List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Backlog Backplane ({tasks.length})</h3>
                    <button 
                      onClick={() => setShowAddTask(true)}
                      className="bg-white/5 hover:bg-white/10 text-white font-bold text-xs px-3 py-1.5 rounded-xl border border-white/5 transition-all"
                    >
                      + Add Task
                    </button>
                  </div>

                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div 
                        key={task.id} 
                        className={`glass-panel rounded-2xl p-4 border transition-all ${
                          task.status === 'completed' 
                            ? 'border-brand-success/15 bg-brand-success/2 opacity-65'
                            : task.status === 'deferred'
                            ? 'border-slate-800 bg-slate-900/20 opacity-55'
                            : 'border-white/5'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex gap-2.5 items-start">
                            <button
                              onClick={() => updateTask(task.id, { 
                                status: task.status === 'completed' ? 'pending' : 'completed',
                                progress: task.status === 'completed' ? 0 : 100
                              })}
                              className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
                                task.status === 'completed'
                                  ? 'bg-brand-success border-brand-success text-white'
                                  : 'border-slate-600 hover:border-white text-transparent'
                              }`}
                            >
                              <svg className="w-3.5 h-3.5 stroke-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </button>

                            <div>
                              <span className={`text-xs font-bold text-white block ${task.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                                {task.title}
                              </span>
                              <p className="text-[11px] text-slate-400 leading-normal">{task.description}</p>
                              
                              {/* AI Evidence Sources checklist */}
                              <div className="flex gap-2.5 flex-wrap mt-2">
                                {task.evidence?.map((ev, evIdx) => (
                                  <span key={evIdx} className="bg-slate-900 border border-white/3 text-[9px] text-slate-400 px-2 py-0.5 rounded-full font-sans">
                                    {ev}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1.5 font-mono text-[10px] text-slate-400 text-right flex-shrink-0">
                            <span>{task.estimatedTime}m</span>
                            <span>{task.progress}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="md:col-span-4 space-y-6">
                {/* Timeline */}
                <div className="glass-panel rounded-2xl p-5 border border-white/5">
                  <Timeline items={timeline} />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: AI Brain (Reasoning) */}
          {activeTab === 'brain' && (
            <motion.div
              key="tab-brain"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
            >
              <div className="md:col-span-8 space-y-6">
                
                {/* AI Decisions explainability grid */}
                <ExplainabilityDashboard />

                {/* Mission Black Box replay logs (Pillar 10) */}
                <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Decision Trace Ledger
                      </h3>
                      <p className="text-[10px] text-slate-400">Chronological explanation audits</p>
                    </div>
                    <button
                      onClick={startDaySimulation}
                      className="py-1.5 px-3 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary border border-brand-primary/20 font-bold text-[10px] uppercase rounded-xl transition-all"
                    >
                      Start Mission Replay
                    </button>
                  </div>

                  <div className="space-y-3.5 relative">
                    <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-slate-800" />
                    {blackBoxLogs.map((log) => (
                      <div key={log.id} className="flex items-start gap-4 relative z-10 pl-2">
                        <span className="font-mono text-slate-500 font-bold text-[10px] bg-[#0a0b12] py-0.5">{log.time}</span>
                        <div className="flex-1 bg-white/2 border border-white/3 rounded-xl p-3 space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-white">{log.event}</span>
                            <span className="text-[9px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded font-mono uppercase">
                              Deduction: Active
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-snug">{log.rationale}</p>
                          <p className="text-[10px] text-slate-400 leading-relaxed italic border-t border-white/3 pt-1.5">
                            Why: "{log.why}"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Predict Tomorrow Mode (Pillar 6) */}
                <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Predictive Future Planner
                      </h3>
                      <p className="text-[10px] text-slate-400">Simulate tomorrow's capacity</p>
                    </div>
                    <button
                      onClick={() => setShowTomorrowForecast(!showTomorrowForecast)}
                      className="py-1.5 px-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 rounded-xl text-[10px] font-bold uppercase transition-all"
                    >
                      {showTomorrowForecast ? 'Hide Forecast' : 'Predict Tomorrow'}
                    </button>
                  </div>

                  <AnimatePresence>
                    {showTomorrowForecast && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-[#05060b] border border-white/5 rounded-xl p-4 text-xs space-y-3.5 overflow-hidden"
                      >
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tomorrow's Forecast Indicators</span>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-slate-500 block">Expected work load</span>
                            <span className="text-sm font-extrabold text-white">4.5 Hours</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-slate-500 block">Success probability</span>
                            <span className="text-sm font-extrabold text-brand-success">94% Target</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-slate-500 block">Potential conflicts</span>
                            <span className="text-sm font-extrabold text-brand-warning">0 Overlaps</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-slate-500 block">Best focus window</span>
                            <span className="text-sm font-extrabold text-brand-primary">10:00 - 13:00</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

              <div className="md:col-span-4 space-y-6">
                
                {/* AI Learning engine memories list */}
                <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Learning Center</span>
                  <div className="space-y-2">
                    {memories.map((m, i) => (
                      <div key={i} className="bg-white/2 border border-white/3 p-2.5 rounded-xl text-[11px] text-slate-300 leading-snug">
                        {m}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Day Simulators HUD */}
                {isSimulating && (
                  <div className="glass-panel rounded-2xl p-5 border border-brand-primary/30 shadow-glow-primary bg-[#05060c] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-brand-primary animate-ping" /> Day simulation
                      </span>
                      <span className="text-xs font-mono font-bold text-brand-primary bg-slate-900 px-2 py-0.5 rounded">
                        Time: {simStep === 1 ? '09:00' : simStep === 2 ? '11:00' : simStep === 3 ? '12:30' : simStep === 4 ? '13:00' : simStep === 5 ? '15:00' : '19:00'}
                      </span>
                    </div>

                    <div className="bg-black/60 border border-white/3 rounded-xl p-3 font-mono text-[9px] text-slate-300 space-y-2 h-36 overflow-y-auto">
                      {simLogs.map((log, lIdx) => <div key={lIdx}>{log}</div>)}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}

          {/* TAB 4: Analytics (Calibrate) */}
          {activeTab === 'analytics' && (
            <motion.div
              key="tab-analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
            >
              <div className="md:col-span-8 space-y-6">
                {/* Replacing heatmap with energy radar stats */}
                <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        System Monitor Radar
                      </h3>
                      <p className="text-[10px] text-slate-400">Peak focus tracking metrics</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { period: 'Morning', energy: 82, focus: 'High', color: 'text-brand-success' },
                      { period: 'Afternoon', energy: 61, focus: 'Medium', color: 'text-brand-warning' },
                      { period: 'Evening', energy: 96, focus: 'Peak focus', color: 'text-brand-success text-glow-success font-black' },
                      { period: 'Night', energy: 34, focus: 'Cognitive rest', color: 'text-slate-500' }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white/2 border border-white/3 rounded-xl p-3 flex flex-col justify-between space-y-3">
                        <span className="text-[10px] font-bold text-white uppercase">{item.period}</span>
                        <div className="space-y-1 text-xs">
                          <span className="text-slate-400 text-[10px] block">Energy: {item.energy}%</span>
                          <span className={`${item.color} text-[10px] uppercase font-bold block`}>{item.focus}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-brand-primary/5 p-3 rounded-xl border border-brand-primary/10 text-xs text-slate-300 italic">
                    "Navigator Engine: Schedule deep work sprints between 6 PM - 9 PM. Afternoon slots show 20% energy drops, suitable for low priority documentation tasks."
                  </div>
                </div>

                <DependencyGraph />
              </div>

              <div className="md:col-span-4 space-y-6">
                <TrustCenter />
                <HealthMonitor />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* QUICK ADD TASK MODAL POPUP */}
      <AnimatePresence>
        {showAddTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-white">Create Workspace Task</h3>
                <button onClick={() => setShowAddTask(false)} className="text-slate-400 hover:text-white">Close</button>
              </div>

              <form onSubmit={handleAddTaskSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Task Title</label>
                  <input
                    type="text" required placeholder="e.g. Complete AI Project"
                    value={title} onChange={(e) => setTitle(e.target.value)}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea
                    placeholder="Provide scope details..."
                    value={description} onChange={(e) => setDescription(e.target.value)}
                    rows="3" className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Est. Duration (m)</label>
                    <input
                      type="number" required min="1"
                      value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)}
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Deadline (Tomorrow)</label>
                    <input
                      type="time" required
                      value={deadlineTime} onChange={(e) => setDeadlineTime(e.target.value)}
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Priority</label>
                  <div className="flex gap-2">
                    {['low', 'medium', 'high'].map((p) => (
                      <button
                        key={p} type="button" onClick={() => setPriority(p)}
                        className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg border transition-all ${
                          priority === p
                            ? p === 'high'
                              ? 'bg-brand-danger/25 border-brand-danger text-white'
                              : p === 'medium'
                              ? 'bg-brand-warning/25 border-brand-warning text-white'
                              : 'bg-brand-primary/25 border-brand-primary text-white'
                            : 'bg-white/3 border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-brand-primary to-brand-secondary shadow-glow-primary">
                  Compile Task Risk
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PROACTIVE INTERVENTION DIALOG CARD */}
      <AnimatePresence>
        {proactiveAlert && (
          <div className="fixed bottom-24 left-6 z-40 max-w-sm">
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel rounded-2xl p-5 border-brand-danger/30 bg-brand-danger/5 shadow-glow-danger flex gap-3 relative overflow-hidden"
            >
              <div className="p-2 rounded bg-brand-danger/10 text-brand-danger h-9 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-[9px] bg-brand-danger/10 text-brand-danger border border-brand-danger/15 px-2 py-0.5 rounded font-bold uppercase">
                    Proactive Intervention
                  </span>
                  <p className="text-xs text-slate-200 mt-1.5 leading-relaxed font-sans">
                    {user.name}, I detected you are highly unlikely to complete today's work. I've already prepared an optimized Rescue Plan.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setProactiveAlert(false); activateRescueMode(); }}
                    className="py-1.5 px-3 bg-brand-danger hover:brightness-110 text-white font-bold text-[10px] uppercase rounded-lg shadow-md transition-all"
                  >
                    Deploy Rescue Mode
                  </button>
                  <button
                    onClick={() => setProactiveAlert(false)}
                    className="py-1.5 px-2.5 bg-white/5 border border-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-[10px] uppercase rounded-lg transition-all"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      <LiveRebuilder isOpen={isRebuilding} steps={rebuildSteps} />

      <RescueModeModal isOpen={isRescueModeActive} onClose={deactivateRescueMode} data={rescueData} />

      <PanicOverlay isOpen={isPanicModeActive} onClose={deactivatePanicMode} data={panicData} onStartSprint={() => {
        const saved = tasks.find(t => t.status === 'pending');
        if (saved) onEnterFocus(saved);
      }} />
    </div>
  );
};

export default Dashboard;
