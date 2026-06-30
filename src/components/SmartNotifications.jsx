import React from 'react';
import { ShieldAlert, Award, Sparkles } from 'lucide-react';

const SmartNotifications = () => {
  return (
    <div className="space-y-3">
      {/* High Danger Alert Card */}
      <div className="glass-panel border-brand-danger/20 bg-brand-danger/3 rounded-2xl p-4 flex items-start gap-3 shadow-[0_0_15px_rgba(239,68,68,0.02)]">
        <ShieldAlert className="w-5 h-5 text-brand-danger flex-shrink-0 mt-0.5 animate-pulse" />
        <div>
          <span className="text-[9px] bg-brand-danger/10 text-brand-danger border border-brand-danger/15 px-2 py-0.5 rounded font-bold uppercase">
            Deadline Collision Alert
          </span>
          <p className="text-xs text-slate-200 leading-relaxed mt-1.5 font-sans">
            Starting <strong>Complete AI Project</strong> now gives you a <strong className="text-brand-success text-glow-success">91%</strong> completion probability. Waiting another hour reduces success chance to <strong className="text-brand-danger">58%</strong>.
          </p>
        </div>
      </div>

      {/* Optimizing Focus Alert Card */}
      <div className="glass-panel border-brand-primary/20 bg-brand-primary/3 rounded-2xl p-4 flex items-start gap-3 shadow-[0_0_15px_rgba(99,102,241,0.02)]">
        <Sparkles className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-[9px] bg-brand-primary/10 text-brand-primary border border-brand-primary/15 px-2 py-0.5 rounded font-bold uppercase">
            Optimal Focus Window
          </span>
          <p className="text-xs text-slate-200 leading-relaxed mt-1.5 font-sans">
            You are entering your peak productivity window (6 PM - 9 PM) based on historical coding logs. We recommend initiating <strong>Focus Mode</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartNotifications;
