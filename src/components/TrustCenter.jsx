import React from 'react';
import { ShieldCheck, BarChart3, Clock, Scale } from 'lucide-react';

const TrustCenter = () => {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            AI Trust Center
          </h3>
          <p className="text-[10px] text-slate-400">Responsible, explainable system calibration</p>
        </div>
        <ShieldCheck className="w-4.5 h-4.5 text-brand-success" />
      </div>

      {/* Accuracy KPI Grid */}
      <div className="grid grid-cols-2 gap-3.5 border-b border-white/5 pb-4">
        <div className="bg-slate-950/40 p-3 border border-white/3 rounded-xl text-center">
          <span className="text-[9px] text-slate-500 uppercase block font-semibold">Prediction Accuracy</span>
          <span className="text-2xl font-black text-brand-success text-glow-success">89%</span>
        </div>
        <div className="bg-slate-950/40 p-3 border border-white/3 rounded-xl text-center">
          <span className="text-[9px] text-slate-500 uppercase block font-semibold">Schedule Calibration</span>
          <span className="text-xl font-bold text-white">Excellent</span>
        </div>
      </div>

      {/* Metrics list */}
      <div className="space-y-2.5 text-xs text-slate-300">
        <div className="flex justify-between items-center bg-white/2 p-2 rounded-xl">
          <span className="text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-500" /> Avg Estimation Error</span>
          <span className="font-bold text-white">12 minutes</span>
        </div>

        <div className="flex justify-between items-center bg-white/2 p-2 rounded-xl">
          <span className="text-slate-400 flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5 text-slate-500" /> Success Calibration</span>
          <span className="font-bold text-white">91% Accuracy</span>
        </div>

        <div className="flex justify-between items-center bg-white/2 p-2 rounded-xl">
          <span className="text-slate-400 flex items-center gap-1.5"><Scale className="w-3.5 h-3.5 text-slate-500" /> Total Model Updates</span>
          <span className="font-bold text-white">42 learning logs</span>
        </div>
      </div>

      {/* Model calibration log */}
      <div className="bg-brand-success/5 border border-brand-success/15 rounded-xl p-3 text-[10px] leading-relaxed">
        <span className="text-brand-success font-bold block mb-1">Calibration Alert:</span>
        <p className="text-slate-300">
          "Yesterday: Predicted 2h for visual scaffold, Actual 3h 12m (+36% error). Learner updated future visual tasks weights."
        </p>
      </div>
    </div>
  );
};

export default TrustCenter;
