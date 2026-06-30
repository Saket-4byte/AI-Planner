import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck, Info } from 'lucide-react';

const RiskGauge = ({ score = 0, level = 'green', reasons = [] }) => {
  // SVG Circle parameters
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const colorMap = {
    red: {
      text: 'text-brand-danger',
      stroke: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'border-brand-danger/20',
      glow: 'shadow-glow-danger',
      icon: <AlertTriangle className="w-5 h-5 text-brand-danger" />
    },
    yellow: {
      text: 'text-brand-warning',
      stroke: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'border-brand-warning/20',
      glow: 'shadow-glow-primary',
      icon: <Info className="w-5 h-5 text-brand-warning" />
    },
    green: {
      text: 'text-brand-success',
      stroke: '#10b981',
      bg: 'rgba(16, 185, 129, 0.1)',
      border: 'border-brand-success/20',
      glow: 'shadow-glow-success',
      icon: <ShieldCheck className="w-5 h-5 text-brand-success" />
    }
  };

  const theme = colorMap[level] || colorMap.green;

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center gap-6 border border-white/5">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/5 via-transparent to-brand-secondary/5 opacity-50 pointer-events-none" />

      {/* Circle Gauge Container */}
      <div className="relative flex-shrink-0">
        <svg className="w-32 h-32 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress circle */}
          <motion.circle
            cx="64"
            cy="64"
            r={radius}
            stroke={theme.stroke}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold font-sans tracking-tight text-white">
            {score}%
          </span>
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            Risk Score
          </span>
        </div>
      </div>

      {/* Reasoning and Explanations */}
      <div className="flex-1 w-full">
        <div className="flex items-center gap-2 mb-3">
          {theme.icon}
          <h3 className="text-lg font-bold font-sans text-white capitalize">
            {level === 'red' ? 'Critical Action Required' : level === 'yellow' ? 'Moderate Warning' : 'Task Schedule Safe'}
          </h3>
        </div>

        <ul className="space-y-2">
          {reasons.map((reason, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.3 }}
              className="flex items-start gap-2.5 text-sm text-slate-300 leading-snug"
            >
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0`} style={{ backgroundColor: theme.stroke }} />
              <span>{reason}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RiskGauge;
