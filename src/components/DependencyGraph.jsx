import React from 'react';
import { GitFork, AlertTriangle, CheckCircle, Lock, Link } from 'lucide-react';

const DependencyGraph = () => {
  const dependencyTree = [
    {
      id: 'dep-1',
      title: 'Complete AI Project',
      status: 'blocker', // blocker | locked | unlocked | completed
      reasons: 'Unlocks 3 downstream milestones',
      children: [
        { title: 'Define AI architecture', status: 'completed' },
        { title: 'Boilerplate project setup', status: 'unlocked' },
        { title: 'Integrate Gemini API', status: 'locked' }
      ]
    },
    {
      id: 'dep-2',
      title: 'Prepare Slide Deck Presentation',
      status: 'locked',
      reasons: 'Requires complete AI project prototype',
      children: []
    }
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            AI Dependency Graph
          </h3>
          <p className="text-[10px] text-slate-400">Chronological blocker dependencies</p>
        </div>
        <GitFork className="w-4.5 h-4.5 text-brand-primary" />
      </div>

      <div className="space-y-4 relative">
        {/* Connection line between parent dependency nodes */}
        <div className="absolute left-[13px] top-6 bottom-6 w-0.5 bg-slate-800" />

        {dependencyTree.map((node) => {
          const statusConfig = {
            blocker: {
              border: 'border-brand-danger/25 bg-brand-danger/3',
              icon: <AlertTriangle className="w-4.5 h-4.5 text-brand-danger animate-pulse" />,
              badge: 'bg-brand-danger/10 text-brand-danger border border-brand-danger/15'
            },
            locked: {
              border: 'border-slate-800 bg-slate-950/20 opacity-60',
              icon: <Lock className="w-4.5 h-4.5 text-slate-500" />,
              badge: 'bg-slate-900 text-slate-500 border border-slate-800'
            },
            unlocked: {
              border: 'border-brand-primary/20 bg-brand-primary/2',
              icon: <Link className="w-4.5 h-4.5 text-brand-primary" />,
              badge: 'bg-brand-primary/10 text-brand-primary border border-brand-primary/15'
            },
            completed: {
              border: 'border-brand-success/20 bg-brand-success/2',
              icon: <CheckCircle className="w-4.5 h-4.5 text-brand-success" />,
              badge: 'bg-brand-success/10 text-brand-success border border-brand-success/15'
            }
          };

          const currentConfig = statusConfig[node.status] || statusConfig.unlocked;

          return (
            <div key={node.id} className="space-y-2.5 pl-0 relative z-10">
              {/* Parent Task Card */}
              <div className={`glass-panel rounded-xl p-3.5 border flex items-center justify-between gap-4 ${currentConfig.border}`}>
                <div className="flex items-center gap-3">
                  <div className="p-1 rounded bg-slate-900 border border-slate-800/80">
                    {currentConfig.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">{node.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{node.reasons}</p>
                  </div>
                </div>
                <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${currentConfig.badge}`}>
                  {node.status}
                </span>
              </div>

              {/* Sub-dependencies/children list */}
              {node.children.length > 0 && (
                <div className="pl-8 space-y-2 relative">
                  {node.children.map((child, cIdx) => {
                    const childIcon = child.status === 'completed' 
                      ? <CheckCircle className="w-3.5 h-3.5 text-brand-success" />
                      : child.status === 'locked'
                      ? <Lock className="w-3.5 h-3.5 text-slate-500" />
                      : <Link className="w-3.5 h-3.5 text-brand-primary" />;

                    return (
                      <div key={cIdx} className="flex items-center gap-2 text-[11px] text-slate-300">
                        {/* Horizontal branch line indicator */}
                        <div className="absolute -left-4 w-4 h-0.5 bg-slate-800 top-3" />
                        <div className="absolute -left-4 w-0.5 h-5 bg-slate-800 -top-2" />
                        
                        {childIcon}
                        <span className={child.status === 'completed' ? 'line-through text-slate-500' : ''}>
                          {child.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DependencyGraph;
