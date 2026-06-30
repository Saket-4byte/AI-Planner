import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, Heart, ChevronRight, Zap } from 'lucide-react';

const PanicOverlay = ({ isOpen, onClose, data, onStartSprint }) => {
  const [phase, setPhase] = useState('alarm'); // alarm -> calm

  useEffect(() => {
    if (isOpen) {
      setPhase('alarm');
      // After 2 seconds of high-impact alarm animation, transition to the calm plan
      const timer = setTimeout(() => {
        setPhase('calm');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen || !data) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030306]/95 backdrop-blur-xl overflow-y-auto">
        
        {/* Phase 1: Alarm Sequence */}
        {phase === 'alarm' && (
          <motion.div
            key="alarm-phase"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center max-w-md p-6"
          >
            {/* Pulsing red alarm indicator */}
            <motion.div
              animate={{ 
                scale: [1, 1.15, 1],
                boxShadow: [
                  '0 0 20px rgba(239, 68, 68, 0.4)',
                  '0 0 50px rgba(239, 68, 68, 0.8)',
                  '0 0 20px rgba(239, 68, 68, 0.4)'
                ]
              }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="w-24 h-24 rounded-full bg-brand-danger flex items-center justify-center border border-brand-danger/30 mb-8"
            >
              <AlertOctagon className="w-12 h-12 text-white" />
            </motion.div>
            
            <h2 className="text-3xl font-black text-white text-glow-danger tracking-tighter mb-4 uppercase">
              Panic Protocol Engaged
            </h2>
            <p className="text-sm text-slate-400 font-mono tracking-widest uppercase">
              AI is isolating core MVP and offloading cognitive load...
            </p>

            {/* Glowing background sweep */}
            <div className="absolute inset-0 bg-brand-danger/5 animate-pulse pointer-events-none" />
          </motion.div>
        )}

        {/* Phase 2: Calm Emergency Action Plan */}
        {phase === 'calm' && (
          <motion.div
            key="calm-phase"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="glass-panel relative w-full max-w-xl rounded-3xl overflow-hidden border border-brand-danger/30 shadow-glow-danger p-6 md:p-8"
          >
            {/* Glowing gradient background element */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-danger/10 rounded-full blur-3xl pointer-events-none" />

            {/* Headings */}
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1 bg-brand-danger/15 text-brand-danger px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
                <Heart className="w-3 h-3 fill-brand-danger animate-pulse" /> Take A Deep Breath
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Crisis Action Plan Compiled
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                We have deferred all secondary items and prioritized your single most critical milestone.
              </p>
            </div>

            {/* Probability Buffer */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mb-6 text-center">
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block mb-1">
                Adjusted Target Success Probability
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-lg text-slate-500 line-through font-bold">
                  {data.successChanceBefore}%
                </span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
                <span className="text-3xl font-black text-brand-success text-glow-success">
                  {data.successChanceAfter}%
                </span>
              </div>
            </div>

            {/* Emergency Steps */}
            <div className="space-y-4 mb-8">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
                Immediate Execution Steps
              </span>
              
              <div className="space-y-2">
                {data.actionPlan.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/2 rounded-xl p-3 border border-white/5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-lg bg-brand-danger/10 border border-brand-danger/20 text-brand-danger text-[10px] font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-xs text-slate-200 leading-snug">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coach Voice */}
            <div className="bg-brand-danger/5 rounded-xl p-3 border border-brand-danger/10 mb-8 text-center text-xs text-slate-300 italic">
              "{data.message}"
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-400 hover:text-white bg-white/3 border border-white/5 hover:bg-white/5 transition-all order-2 sm:order-1"
              >
                Close Plan
              </button>
              <button
                onClick={() => {
                  onClose();
                  onStartSprint();
                }}
                className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-brand-danger to-orange-600 hover:brightness-110 shadow-glow-danger transition-all flex items-center justify-center gap-1.5 order-1 sm:order-2"
              >
                <Zap className="w-3.5 h-3.5 fill-white" /> Initiate Emergency Sprint
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </AnimatePresence>
  );
};

const ArrowRight = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

export default PanicOverlay;
