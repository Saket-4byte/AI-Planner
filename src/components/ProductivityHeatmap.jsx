import React from 'react';
import { CalendarRange, Zap, Clock, ShieldAlert } from 'lucide-react';

const ProductivityHeatmap = () => {
  const heatmaps = [
    { period: 'Morning', energy: 75, focus: 65, prob: 80, tip: 'Focus on high cognitive logic.' },
    { period: 'Afternoon', energy: 50, focus: 45, prob: 60, tip: 'Schedule meetings & low focus tasks.' },
    { period: 'Evening', energy: 95, focus: 95, prob: 94, tip: 'Peak programming slot. Lock code.' },
    { period: 'Night', energy: 40, focus: 55, prob: 45, tip: 'Decompress & shut down for rest.' }
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            AI Productivity Heatmap
          </h3>
          <p className="text-[10px] text-slate-400">Peak concentration and scheduling slots</p>
        </div>
        <CalendarRange className="w-4.5 h-4.5 text-brand-primary" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {heatmaps.map((h, idx) => (
          <div key={idx} className="bg-white/2 border border-white/5 rounded-xl p-3 flex flex-col justify-between space-y-3 hover:bg-white/3 transition-colors">
            <div>
              <span className="text-[10px] font-bold text-white uppercase tracking-wider block">{h.period}</span>
              <span className="text-[9px] text-slate-400">Optimal Window</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400 flex items-center gap-0.5"><Zap className="w-2.5 h-2.5 text-brand-warning" /> Energy</span>
                <span className="text-white font-bold">{h.energy}%</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400 flex items-center gap-0.5"><Clock className="w-2.5 h-2.5 text-brand-primary" /> Focus</span>
                <span className="text-white font-bold">{h.focus}%</span>
              </div>
              <div className="flex justify-between text-[10px] border-t border-white/5 pt-1 mt-1">
                <span className="text-brand-success font-bold">Capacity</span>
                <span className="text-brand-success font-black">{h.prob}%</span>
              </div>
            </div>

            <div className="bg-white/3 p-1.5 rounded-lg text-[9px] text-slate-300 italic leading-snug border border-white/3">
              "{h.tip}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductivityHeatmap;
