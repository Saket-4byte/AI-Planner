import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronRight, Zap, ShieldAlert, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

const RescueModeModal = ({ isOpen, onClose, data }) => {
  const [successCount, setSuccessCount] = useState(0);

  useEffect(() => {
    if (isOpen && data) {
      // Trigger celebrate confetti on compilation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Animated count up for probability
      setSuccessCount(0);
      const target = data.successChanceAfter || 91;
      const duration = 1200; // ms
      const stepTime = Math.abs(Math.floor(duration / target));
      let current = 0;
      
      const timer = setInterval(() => {
        current += 1;
        setSuccessCount(current);
        if (current >= target) {
          clearInterval(timer);
        }
      }, stepTime);
      
      return () => clearInterval(timer);
    }
  }, [isOpen, data]);

  if (!isOpen || !data) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="glass-panel relative w-full max-w-2xl rounded-3xl overflow-hidden border border-white/10 shadow-glow-primary my-8"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-primary via-brand-secondary to-indigo-950 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <Zap className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  AI RESCUE ENGINE ENGAGED
                </h3>
                <p className="text-xs text-white/80">
                  Timeline optimized for available workload capacity
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            
            {/* Success Probability metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Success Probability Comparison */}
              <div className="bg-white/3 border border-white/5 rounded-2xl p-4 text-center col-span-1 flex flex-col justify-center">
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block mb-1">
                  Completion Chance
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl text-slate-500 line-through font-bold">
                    {data.successChanceBefore}%
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                  <span className="text-3xl font-black text-brand-success text-glow-success">
                    {successCount}%
                  </span>
                </div>
                <span className="text-[9px] text-brand-success font-semibold mt-1 flex items-center justify-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> High Feasibility
                </span>
              </div>

              {/* Time saved */}
              <div className="bg-white/3 border border-white/5 rounded-2xl p-4 text-center col-span-1 flex flex-col justify-center">
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block mb-1">
                  Buffer Hours Saved
                </span>
                <span className="text-2xl font-black text-brand-primary">
                  3h 20m
                </span>
                <span className="text-[9px] text-slate-400 mt-1">Pruned redundant tasks</span>
              </div>

              {/* Risk reduction */}
              <div className="bg-white/3 border border-white/5 rounded-2xl p-4 text-center col-span-1 flex flex-col justify-center">
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block mb-1">
                  Workload Risk Index
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl text-brand-danger line-through font-bold">96%</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                  <span className="text-2xl font-black text-slate-200">41%</span>
                </div>
                <span className="text-[9px] text-slate-400 mt-1">Safe Operating margins</span>
              </div>

            </div>

            {/* AI Decision Tree Graphic (Pillar 7) */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mb-3">
                AI Scheduling Decision Logic Tree
              </span>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-slate-950/60 border border-white/5 rounded-2xl p-4 text-[10px] font-mono text-slate-300">
                <div className="bg-brand-danger/10 border border-brand-danger/25 p-2 rounded text-center w-full sm:w-auto">
                  <span className="block text-brand-danger font-bold">Current Tasks</span>
                  <span>15h Load</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 rotate-90 sm:rotate-0" />
                
                <div className="bg-brand-warning/10 border border-brand-warning/25 p-2 rounded text-center w-full sm:w-auto">
                  <span className="block text-brand-warning font-bold">Conflict Check</span>
                  <span>3h Available</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 rotate-90 sm:rotate-0" />

                <div className="bg-brand-primary/10 border border-brand-primary/25 p-2 rounded text-center w-full sm:w-auto">
                  <span className="block text-brand-primary font-bold">Prune Low-Pri</span>
                  <span>Deferred CSS (-4h)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 rotate-90 sm:rotate-0" />

                <div className="bg-brand-success/10 border border-brand-success/25 p-2 rounded text-center w-full sm:w-auto">
                  <span className="block text-brand-success font-bold">Stable Timeline</span>
                  <span>Success Rate 91%</span>
                </div>
              </div>
            </div>

            {/* Emergency Report Audit details */}
            <div className="bg-white/2 border border-white/5 rounded-2xl p-4 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Emergency Execution Audit
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="border-r border-white/5">
                  <span className="text-[9px] text-slate-500 uppercase block">Conflicts Found</span>
                  <span className="text-base font-extrabold text-white">4</span>
                </div>
                <div className="sm:border-r border-white/5">
                  <span className="text-[9px] text-slate-500 uppercase block">Resolved</span>
                  <span className="text-base font-extrabold text-brand-success">4</span>
                </div>
                <div className="border-r border-white/5">
                  <span className="text-[9px] text-slate-500 uppercase block">Cognitive Buffer</span>
                  <span className="text-base font-extrabold text-brand-primary">+2.5 Hours</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase block">Confidence index</span>
                  <span className="text-base font-extrabold text-brand-success">96%</span>
                </div>
              </div>
            </div>

            {/* Bullet changes */}
            <ul className="space-y-2">
              {data.optimizations.map((opt, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 bg-white/2 rounded-xl p-3 border border-white/5 text-xs text-slate-200"
                >
                  <ChevronRight className="w-4.5 h-4.5 text-brand-success flex-shrink-0 mt-0.5" />
                  <span>{opt}</span>
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="flex gap-4 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-400 hover:text-white bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all"
              >
                Dismiss
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:brightness-110 shadow-glow-primary transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4.5 h-4.5" /> Adopt Optimized Timeline
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RescueModeModal;
