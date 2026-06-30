import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';

const StressMeter = ({ tasks = [], availableHours = 3 }) => {
  // Calculate stress level based on pending tasks and available focus hours
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const totalEstMinutes = pendingTasks.reduce((sum, t) => sum + t.estimatedTime, 0);
  const totalEstHours = totalEstMinutes / 60;
  
  let stressScore = Math.round((totalEstHours / Math.max(1, availableHours)) * 50);
  // Add penalty for high priority tasks
  const highPriorityCount = pendingTasks.filter(t => t.priority === 'high').length;
  stressScore += highPriorityCount * 12;

  // Cap between 5% and 98% for visual impact
  stressScore = Math.min(98, Math.max(5, stressScore));
  
  // Set levels
  let level = 'green';
  let message = 'Stress indicators are within optimal bounds.';
  let recommendation = 'Keep doing what you are doing. Schedule recharge slots.';

  if (stressScore >= 75) {
    level = 'red';
    message = 'High cognitive load: Workload exceeds available buffer.';
    recommendation = 'Activate Rescue Mode or defer low-priority tasks.';
  } else if (stressScore >= 40) {
    level = 'yellow';
    message = 'Moderate workload: Tight deadline buffers.';
    recommendation = 'Inject a 10-minute recovery break after focus sprints.';
  }

  const colorMap = {
    red: 'bg-brand-danger shadow-glow-danger text-brand-danger border-brand-danger/20',
    yellow: 'bg-brand-warning shadow-glow-primary text-brand-warning border-brand-warning/20',
    green: 'bg-brand-success shadow-glow-success text-brand-success border-brand-success/20'
  };

  const activeColor = colorMap[level];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            AI Stress Index
          </h3>
          <p className="text-[10px] text-slate-400">Anxiety factors and workload thresholds</p>
        </div>
        <Activity className="w-4.5 h-4.5 text-brand-primary" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Current Load Index</span>
          <span className="text-white font-extrabold">{stressScore}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stressScore}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${level === 'red' ? 'bg-brand-danger' : level === 'yellow' ? 'bg-brand-warning' : 'bg-brand-success'}`}
          />
        </div>
      </div>

      {/* Stress factors and recommendations */}
      <div className="space-y-3 bg-white/2 rounded-xl p-3 border border-white/3 text-[11px] leading-relaxed">
        <div className="flex items-start gap-2 text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
          <p>{message}</p>
        </div>

        <div className="flex items-start gap-2">
          {level === 'red' ? (
            <ShieldAlert className="w-4.5 h-4.5 text-brand-danger flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4.5 h-4.5 text-brand-success flex-shrink-0" />
          )}
          <p className="text-slate-200">
            <strong>AI Recommendation</strong>: {recommendation}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StressMeter;
