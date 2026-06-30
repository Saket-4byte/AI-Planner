import React from 'react';
import { motion } from 'framer-motion';
import { Brain, CheckCircle, Circle, RefreshCw, Terminal } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const LiveRebuilder = ({ steps = [], isOpen = false }) => {
  const { rawPromptLog } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel w-full max-w-4xl rounded-3xl border border-white/10 shadow-glow-primary p-6 md:p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/5 via-transparent to-brand-secondary/5 opacity-50 pointer-events-none" />

        {/* Header Title */}
        <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
            <Brain className="w-5.5 h-5.5 text-brand-primary animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
              AI Decision Rebuild Pipeline
            </h3>
            <p className="text-xs text-slate-400">Jarvis router executing timeline reprioritizations</p>
          </div>
        </div>

        {/* Split Console Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Console: Rebuild Steps Progress */}
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              1. Compilation Steps
            </span>
            <div className="bg-[#05060b] border border-white/5 rounded-2xl p-4 font-mono text-xs space-y-4 shadow-inner">
              {steps.map((step, idx) => {
                const isCompleted = step.status === 'done';
                const isLoading = step.status === 'loading';

                return (
                  <div key={idx} className="flex items-start justify-between gap-3 text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="text-slate-500 font-bold">[{idx + 1}/5]</span>
                      <span className={isCompleted ? 'text-slate-400' : 'text-slate-200'}>
                        {step.text}
                      </span>
                    </div>

                    <div className="flex-shrink-0 mt-0.5">
                      {isCompleted ? (
                        <CheckCircle className="w-4.5 h-4.5 text-brand-success" />
                      ) : isLoading ? (
                        <RefreshCw className="w-4.5 h-4.5 text-brand-primary animate-spin" />
                      ) : (
                        <Circle className="w-4.5 h-4.5 text-slate-700" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Console: Raw LLM prompt Prompt Trace */}
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-brand-primary" /> 2. Raw LLM prompt Context Trace
            </span>
            <div className="bg-[#030408] border border-white/5 rounded-2xl p-4 font-mono text-[10px] text-brand-primary/95 leading-relaxed h-[200px] overflow-y-auto shadow-inner select-text scrollbar-thin">
              <pre className="whitespace-pre-wrap select-text">{rawPromptLog || 'Waiting for orchestrator query routes...'}</pre>
            </div>
          </div>

        </div>

        {/* Neural loader branding */}
        <div className="mt-6 pt-4 border-t border-white/5 text-center flex justify-between items-center text-[10px] text-slate-500 font-mono">
          <span>Target calibrator: Google Gemini-1.5-flash</span>
          <span>Orchestrator v4.0 Active</span>
        </div>
      </motion.div>
    </div>
  );
};

export default LiveRebuilder;
