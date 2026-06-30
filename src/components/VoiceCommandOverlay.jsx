import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Volume2, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const VoiceCommandOverlay = ({ isOpen, onClose }) => {
  const { activateRescueMode, startDaySimulation, resetDemo, addCoachMessage } = useApp();
  const [listeningText, setListeningText] = useState('Speak now...');
  const [voiceWave, setVoiceWave] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setListeningText('Listening...');
      setVoiceWave(true);

      // Simulate a voice prompt after 1.5 seconds
      const voicePrompts = [
        { spoken: '"Rescue my day"', action: () => { activateRescueMode(); onClose(); } },
        { spoken: '"Simulate my workload"', action: () => { startDaySimulation(); onClose(); } },
        { spoken: '"Reset system demo"', action: () => { resetDemo(); onClose(); } }
      ];

      const selected = voicePrompts[Math.floor(Math.random() * voicePrompts.length)];

      const typingTimer = setTimeout(() => {
        setListeningText(`Recognized: ${selected.spoken}`);
        setVoiceWave(false);
      }, 1500);

      const actionTimer = setTimeout(() => {
        selected.action();
      }, 3000);

      return () => {
        clearTimeout(typingTimer);
        clearTimeout(actionTimer);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-panel w-full max-w-sm rounded-2xl border border-white/10 shadow-glow-primary p-6 relative flex flex-col items-center text-center overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mb-6 relative">
            <Mic className="w-6 h-6 text-brand-primary animate-pulse" />
            
            {/* Pulsing wave ring */}
            {voiceWave && (
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="absolute inset-0 rounded-full border border-brand-primary/40"
              />
            )}
          </div>

          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-2">
            AI Voice Command Center
          </h3>
          
          <p className="text-xs text-brand-primary font-mono select-none h-6">
            {listeningText}
          </p>

          {/* Sound waves animation */}
          {voiceWave && (
            <div className="flex gap-1 h-6 items-center justify-center mt-4">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [4, 24, 4] }}
                  transition={{ repeat: Infinity, duration: 0.6 + i * 0.1, ease: 'easeInOut' }}
                  className="w-1 bg-brand-primary rounded"
                />
              ))}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-white/5 w-full text-[10px] text-slate-400">
            <span className="block font-bold uppercase mb-1">Try saying:</span>
            <span>"Rescue my day" • "Simulate my workload" • "Reset system"</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VoiceCommandOverlay;
