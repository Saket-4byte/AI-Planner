import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Info, ShieldAlert } from 'lucide-react';

const OutcomeSimulator = () => {
  const [simulatorDelay, setSimulatorDelay] = useState(0);

  const simulatorOptions = [
    { label: 'Baseline', hours: 0, probability: 91, level: 'green', text: 'On track to comfortably finish.' },
    { label: 'Delay 1h', hours: 1, probability: 73, level: 'yellow', text: 'Buffer shrinking. Margin of error tightens.' },
    { label: 'Delay 2h', hours: 2, probability: 42, level: 'red', text: 'Schedule conflicts. Deadline missed by 1.2h.' },
    { label: 'Delay Tomorrow', hours: 24, probability: 12, level: 'red', text: 'Failure. High-priority tasks locked.' }
  ];

  const activeOption = simulatorOptions.find(o => o.hours === simulatorDelay) || simulatorOptions[0];

  const colors = {
    green: 'text-brand-success stroke-brand-success bg-brand-success/10 border-brand-success/20',
    yellow: 'text-brand-warning stroke-brand-warning bg-brand-warning/10 border-brand-warning/20',
    red: 'text-brand-danger stroke-brand-danger bg-brand-danger/10 border-brand-danger/20'
  };

  const activeColor = colors[activeOption.level];

  // Circle path for simulator ring
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (activeOption.probability / 100) * circumference;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            AI Success Simulator
          </h3>
          <p className="text-[10px] text-slate-400">Explore outcomes by delaying tasks</p>
        </div>
        <Clock className="w-4.5 h-4.5 text-brand-primary" />
      </div>

      {/* Probability Gauge comparison */}
      <div className="flex items-center gap-4 bg-white/3 rounded-xl p-3 border border-white/5">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r={radius}
              className="stroke-slate-800"
              strokeWidth="4"
              fill="transparent"
            />
            <motion.circle
              cx="40"
              cy="40"
              r={radius}
              stroke={activeOption.level === 'green' ? '#10b981' : activeOption.level === 'yellow' ? '#f59e0b' : '#ef4444'}
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-base font-extrabold text-white">{activeOption.probability}%</span>
            <span className="text-[7px] uppercase font-bold text-slate-400">Success</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase text-slate-400">Simulation Output</span>
          <p className="text-xs text-white font-bold leading-tight mt-0.5">{activeOption.label}</p>
          <p className="text-[11px] text-slate-300 leading-snug mt-1">{activeOption.text}</p>
        </div>
      </div>

      {/* Button selectors */}
      <div className="flex gap-2">
        {simulatorOptions.map((opt) => (
          <button
            key={opt.hours}
            onClick={() => setSimulatorDelay(opt.hours)}
            className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg border transition-all ${
              simulatorDelay === opt.hours
                ? activeOption.level === 'green'
                  ? 'bg-brand-success/15 border-brand-success text-brand-success'
                  : activeOption.level === 'yellow'
                  ? 'bg-brand-warning/15 border-brand-warning text-brand-warning'
                  : 'bg-brand-danger/15 border-brand-danger text-brand-danger'
                : 'bg-white/3 border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {opt.hours === 0 ? 'Current' : opt.hours === 24 ? 'Postpone' : `+${opt.hours}h`}
          </button>
        ))}
      </div>

      {/* Consequences disclaimer */}
      {simulatorDelay > 0 && (
        <div className={`flex items-start gap-2 p-2.5 rounded-xl border text-[10px] leading-normal ${activeColor}`}>
          <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Warning</strong>: Delaying the implementation blocks critical task dependencies, reducing available focus buffer below safe parameters.
          </p>
        </div>
      )}
    </div>
  );
};

export default OutcomeSimulator;
