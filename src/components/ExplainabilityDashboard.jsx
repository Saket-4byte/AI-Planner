import React from 'react';
import { HelpCircle, Brain, Target, ShieldCheck } from 'lucide-react';

const ExplainabilityDashboard = () => {
  const decisions = [
    {
      decision: 'Prioritized "Complete AI Project" first',
      rationale: 'This milestone acts as a blocker for 3 dependent slide and presentation deliverables. Completing it first reduces aggregate deadline risk by 45%.',
      icon: <Target className="w-4 h-4 text-brand-danger" />
    },
    {
      decision: 'Postponed CSS Refactoring',
      rationale: 'Deadline is in 48 hours. Deferring this task frees up 4 critical focus hours, boosting today\'s mission success probability from 28% to 91%.',
      icon: <Brain className="w-4 h-4 text-brand-primary" />
    },
    {
      decision: 'Injected 10-minute focus recharges',
      rationale: 'Productivity logs suggest a 40% concentration decay after 90 minutes of continuous coding. Recovery breaks sustain baseline cognitive speeds.',
      icon: <ShieldCheck className="w-4 h-4 text-brand-success" />
    }
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            AI Explainability HUD
          </h3>
          <p className="text-[10px] text-slate-400">Decisions and mathematical rationales</p>
        </div>
        <HelpCircle className="w-4 h-4 text-brand-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {decisions.map((d, idx) => (
          <div key={idx} className="bg-white/2 border border-white/5 rounded-xl p-3.5 space-y-2 hover:bg-white/3 transition-colors">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-slate-900 border border-slate-800">
                {d.icon}
              </div>
              <span className="text-xs font-bold text-white">{d.decision}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              {d.rationale}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplainabilityDashboard;
