import React from 'react';
import { Activity, ShieldAlert, Cpu } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const HealthMonitor = () => {
  const { diagnostics } = useApp();

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            AI Health Monitor
          </h3>
          <p className="text-[10px] text-slate-400">LLM latency and parsing diagnostics</p>
        </div>
        <Cpu className="w-4.5 h-4.5 text-brand-primary" />
      </div>

      <div className="grid grid-cols-2 gap-3.5 text-xs">
        <div className="bg-white/2 border border-white/3 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[9px] text-slate-500 uppercase block">Gemini Latency</span>
          <span className="text-sm font-extrabold text-white mt-1">{diagnostics.responseTime}</span>
        </div>

        <div className="bg-white/2 border border-white/3 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[9px] text-slate-500 uppercase block">Avg Inference</span>
          <span className="text-sm font-extrabold text-white mt-1">{diagnostics.inferenceTime}</span>
        </div>

        <div className="bg-white/2 border border-white/3 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[9px] text-slate-500 uppercase block">Simulation Runs</span>
          <span className="text-sm font-extrabold text-white mt-1">{diagnostics.simulations}</span>
        </div>

        <div className="bg-white/2 border border-white/3 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[9px] text-slate-500 uppercase block">System Decisions</span>
          <span className="text-sm font-extrabold text-brand-primary mt-1">{diagnostics.decisions}</span>
        </div>
      </div>

      {/* Ticker logs info */}
      <div className="flex items-center gap-2 text-[10px] text-slate-400 border-t border-white/5 pt-3">
        <span className="w-2 h-2 rounded-full bg-brand-success animate-ping" />
        <span>Memory buffers: {diagnostics.memorySize} • Interventions active: {diagnostics.interventions}</span>
      </div>
    </div>
  );
};

export default HealthMonitor;
