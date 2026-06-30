import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Coffee, Sparkles } from 'lucide-react';

const Timeline = ({ items = [] }) => {
  if (items.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center text-slate-400">
        <Sparkles className="w-8 h-8 text-brand-primary/40 mx-auto mb-2" />
        <p className="text-sm">No tasks scheduled yet. Add tasks above to populate your timeline.</p>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="relative">
      {/* Timeline track line */}
      <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-gradient-to-b from-brand-primary/20 via-slate-800 to-transparent pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {items.map((item) => {
          if (item.isBreak) {
            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="flex items-center gap-4 pl-3"
              >
                {/* Break Timeline Node */}
                <div className="z-10 flex items-center justify-center w-6.5 h-6.5 rounded-full bg-slate-900 border border-slate-700/50 text-slate-400 p-1">
                  <Coffee className="w-3.5 h-3.5" />
                </div>
                
                {/* Break Card */}
                <div className="flex-1 bg-slate-900/40 rounded-xl p-2.5 border border-slate-800/40 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-medium">{item.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                      {item.duration}m
                    </span>
                    <span>
                      {item.startTime} - {item.endTime}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          }

          const priorityStyles = {
            high: 'border-brand-danger/20 hover:border-brand-danger/40 bg-brand-danger/5 shadow-[0_0_15px_rgba(239,68,68,0.03)]',
            medium: 'border-brand-warning/20 hover:border-brand-warning/40 bg-brand-warning/5',
            low: 'border-brand-primary/20 hover:border-brand-primary/40 bg-brand-primary/5'
          };

          const priorityDot = {
            high: 'bg-brand-danger',
            medium: 'bg-brand-warning',
            low: 'bg-brand-primary'
          };

          return (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="flex items-start gap-4 pl-3"
            >
              {/* Task Timeline Node */}
              <div className={`z-10 flex items-center justify-center w-7 h-7 rounded-full bg-slate-950 border border-slate-700 p-1 text-slate-300 mt-1`}>
                <Clock className="w-4 h-4 text-brand-primary" />
              </div>

              {/* Task Card */}
              <div className={`flex-1 glass-panel rounded-xl p-3.5 border transition-all ${priorityStyles[item.priority] || priorityStyles.medium}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${priorityDot[item.priority] || priorityDot.medium}`} />
                      <h4 className="text-sm font-semibold text-white leading-tight">
                        {item.title}
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                      Duration: {item.duration} minutes
                    </span>
                  </div>
                  <span className="text-xs font-mono bg-slate-900 border border-slate-800/80 px-2 py-0.5 rounded text-slate-300 flex-shrink-0">
                    {item.startTime} - {item.endTime}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Timeline;
