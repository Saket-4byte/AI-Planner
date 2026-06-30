import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, ArrowLeft, CheckCircle2, 
  Sparkles, ShieldCheck, Award, Hourglass, Brain, HelpCircle 
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import confetti from 'canvas-confetti';

const FocusMode = ({ task, onExit }) => {
  const { updateTask, awardXP } = useApp();
  
  // Pomodoro State (25 mins default)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState('focus'); // focus | break

  // Task copies
  const [microTasks, setMicroTasks] = useState(task.microTasks || []);
  const [progress, setProgress] = useState(task.progress || 0);

  const [tip, setTip] = useState("Let's focus on the initial step. Take it one micro-task at a time.");
  const [xpAwardedText, setXpAwardedText] = useState('');

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            handleSessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    const coachTips = {
      started: [
        "Eliminate distractions. Close secondary tabs.",
        "Take a deep breath. Focus solely on the active micro-task."
      ],
      running: [
        "Excellent pace. Keep pushing for just another 10 minutes.",
        "You are building momentum. Stay locked in."
      ],
      break: [
        "Step away from the screen. Stretch your body.",
        "Hydrate and relax. Your brain is compiling information."
      ]
    };

    let timer = null;
    if (isRunning) {
      const tips = coachTips.running;
      timer = setInterval(() => {
        setTip(tips[Math.floor(Math.random() * tips.length)]);
      }, 15000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleSessionEnd = () => {
    if (sessionType === 'focus') {
      awardXP(150);
      setXpAwardedText('+150 XP Focus Sprint Completed!');
      triggerConfetti();
      
      // Auto transition to break (10 mins) - Smart Buffer (Pillar 6)
      setSessionType('break');
      setTimeLeft(10 * 60);
      setTip("Time for a brain break. Step away from your computer.");
    } else {
      setSessionType('focus');
      setTimeLeft(25 * 60);
      setTip("Break over. Let's start the next focus block.");
    }
  };

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(sessionType === 'focus' ? 25 * 60 : 10 * 60);
  };

  const handleToggleMicroTask = (index) => {
    const updated = [...microTasks];
    const isCompleted = updated[index].status === 'completed';
    updated[index].status = isCompleted ? 'pending' : 'completed';
    setMicroTasks(updated);

    const completedCount = updated.filter(m => m.status === 'completed').length;
    const newProgress = updated.length > 0 
      ? Math.round((completedCount / updated.length) * 100) 
      : 100;
    
    setProgress(newProgress);

    if (!isCompleted) {
      awardXP(50);
      setXpAwardedText('+50 XP Micro-task finished!');
      setTimeout(() => setXpAwardedText(''), 3000);
      
      if (newProgress === 100) {
        awardXP(200);
        setXpAwardedText('🏆 +200 XP Full Goal Completed!');
        triggerConfetti();
        updateTask(task.id, { 
          progress: 100, 
          status: 'completed', 
          microTasks: updated,
          risk: { score: 0, level: 'green', reasons: ['Task is completed.'] }
        });
      } else {
        updateTask(task.id, { progress: newProgress, microTasks: updated });
      }
    } else {
      updateTask(task.id, { progress: newProgress, microTasks: updated });
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const totalDuration = sessionType === 'focus' ? 25 * 60 : 10 * 60;
  const strokeDashoffset = circumference - ((totalDuration - timeLeft) / totalDuration) * circumference;

  return (
    <div className="min-h-screen bg-[#040407] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <button
        onClick={onExit}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white bg-white/5 border border-white/5 px-4 py-2 rounded-xl transition-all text-xs font-bold"
      >
        <ArrowLeft className="w-4.5 h-4.5" /> Back to OS Dashboard
      </button>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left Side: Timer Circle (5 cols) */}
        <div className="md:col-span-5 flex flex-col items-center space-y-6 text-center">
          
          <AnimatePresence>
            {xpAwardedText && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-brand-secondary/15 border border-brand-secondary/30 text-brand-secondary font-bold text-xs px-4 py-2 rounded-xl shadow-glow-primary flex items-center gap-1.5"
              >
                <Award className="w-4 h-4 text-brand-secondary" /> {xpAwardedText}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <svg className="w-56 h-56 transform -rotate-90">
              <circle
                cx="112"
                cy="112"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="6"
                fill="transparent"
              />
              <motion.circle
                cx="112"
                cy="112"
                r={radius}
                stroke={sessionType === 'focus' ? '#6366f1' : '#10b981'}
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.5, ease: 'linear' }}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold font-mono tracking-tight text-white select-none">
                {formatTime(timeLeft)}
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mt-1 flex items-center gap-1">
                <Hourglass className="w-3 h-3 text-brand-primary" /> {sessionType === 'focus' ? 'Focus Sprint' : 'Smart buffer break'}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleToggleTimer}
              className={`p-3.5 rounded-full text-white shadow-lg transition-all ${
                isRunning 
                  ? 'bg-slate-800 border border-slate-700 hover:bg-slate-700' 
                  : 'bg-brand-primary hover:bg-brand-primary/95 shadow-glow-primary'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
            </button>
            <button
              onClick={handleResetTimer}
              className="p-3.5 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Side: Micro Tasks & Explanations (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Goal Information & AI Focus Explanation */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3.5">
            <div>
              <span className="text-[9px] text-brand-primary font-bold uppercase tracking-wider block">Active Goal HUD</span>
              <h2 className="text-xl font-bold text-white leading-tight">{task.title}</h2>
              <p className="text-xs text-slate-400">{task.description}</p>
            </div>

            {/* Pillar 10: AI Focus Explanation metadata */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-2.5 my-2.5 text-[11px]">
              <div>
                <span className="text-slate-500 block">Task Dependency Blockers</span>
                <span className="text-white font-extrabold">{task.dependencyCount || 0} downstream milestones</span>
              </div>
              <div>
                <span className="text-slate-500 block">Sprinting Est. buffer</span>
                <span className="text-white font-extrabold">{task.estimatedTime} Minutes</span>
              </div>
            </div>

            <div className="bg-slate-950/50 p-3 border border-white/3 rounded-xl text-xs text-slate-300 leading-relaxed">
              <strong>AI Focus Rationale:</strong> Completing this task unlocks downstream deliverables. Starting this session immediately adds a <strong className="text-brand-success">+24% success chance multiplier</strong> to today's schedule index.
            </div>
            
            {/* Progress */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span>Milestone Complete index</span>
                <span className="font-bold text-white">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Micro Tasks Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-brand-primary" /> Micro-task Breakdown
              </h3>
            </div>

            {microTasks.length === 0 ? (
              <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center text-xs text-slate-400">
                <p>No micro-tasks breakdown generated for this project.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {microTasks.map((mt, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleToggleMicroTask(idx)}
                    className={`glass-panel rounded-xl p-3 border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      mt.status === 'completed'
                        ? 'border-brand-success/15 bg-brand-success/2 opacity-70'
                        : 'border-white/5 hover:border-brand-primary/25'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
                        mt.status === 'completed'
                          ? 'bg-brand-success border-brand-success text-white'
                          : 'border-slate-600'
                      }`}>
                        {mt.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className={`text-xs text-slate-200 ${mt.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                        {mt.title}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono bg-slate-900 border border-slate-800/80 px-2 py-0.5 rounded">
                      {mt.duration}m
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pillar 6: Smart Buffer Recovery advice */}
          {sessionType === 'break' && (
            <div className="glass-panel p-4 border border-brand-success/20 bg-brand-success/3 rounded-2xl flex items-start gap-3">
              <Award className="w-5 h-5 text-brand-success flex-shrink-0 mt-0.5 animate-bounce" />
              <div>
                <span className="text-[9px] text-brand-success font-bold uppercase tracking-wider block">AI Recovery Break Active</span>
                <p className="text-xs text-slate-300 italic mt-0.5">
                  "I have automatically scheduled a 10-minute recovery break after this intensive cognitive block to restore concentration bandwidth and prevent cognitive burnout."
                </p>
              </div>
            </div>
          )}

          {/* Tip */}
          {sessionType === 'focus' && (
            <div className="glass-panel p-4 rounded-2xl border border-brand-primary/10 bg-brand-primary/2 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-brand-primary mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-[9px] text-brand-primary font-bold uppercase tracking-wider block">Coach Savey Tip</span>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{tip}"
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default FocusMode;
