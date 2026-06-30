import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Send, Sparkles, Brain, Mic, Play, Zap, HelpCircle, AlertOctagon 
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import VoiceCommandOverlay from './VoiceCommandOverlay';

const AICoach = () => {
  const { 
    coachMessages, sendCoachChat, startDaySimulation, activateRescueMode, activatePanicMode 
  } = useApp();
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // chat | commands
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      scrollToBottom();
    }
  }, [coachMessages, isOpen, isTyping, activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentInput = input;
    setInput('');
    setIsTyping(true);
    await sendCoachChat(currentInput);
    setIsTyping(false);
  };

  const handleQuickPrompt = async (prompt) => {
    setIsTyping(true);
    await sendCoachChat(prompt);
    setIsTyping(false);
  };

  const quickPrompts = [
    "How is my schedule looking?",
    "Give me a quick productivity tip",
    "Which task should I start first?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="coach-trigger"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary text-white shadow-glow-primary hover:shadow-2xl transition-shadow relative"
          >
            <Brain className="w-6 h-6 animate-pulse-slow" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-danger rounded-full border-2 border-dark-bg flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="coach-window"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="glass-panel w-96 h-[520px] rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30">
                  <Sparkles className="w-4 h-4 text-brand-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Navigator</h4>
                  <span className="text-[10px] text-brand-success font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-brand-success rounded-full" />
                    Navigator Engine
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsVoiceOpen(true)}
                  className="p-1 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  title="Voice command Mode"
                >
                  <Mic className="w-4.5 h-4.5 text-brand-primary animate-pulse" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Tab Toggles */}
            <div className="flex border-b border-white/5 bg-slate-950/50">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                  activeTab === 'chat' 
                    ? 'border-brand-primary text-white' 
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Conversations
              </button>
              <button
                onClick={() => setActiveTab('commands')}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                  activeTab === 'commands' 
                    ? 'border-brand-primary text-white' 
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                OS Actions
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'chat' ? (
              <div className="flex-1 flex flex-col min-h-0 bg-[#07080f]/40">
                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {coachMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-xs leading-normal ${
                          msg.sender === 'user'
                            ? 'bg-brand-primary text-white rounded-tr-none'
                            : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        <span className="block text-[8px] text-slate-400/80 text-right mt-1.5 font-mono">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-3 max-w-[85%]">
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts Chips */}
                <div className="px-4 py-2 border-t border-white/5 bg-slate-900/20 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
                  {quickPrompts.map((qp, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickPrompt(qp)}
                      className="text-[10px] text-slate-300 hover:text-white bg-white/5 hover:bg-brand-primary/10 border border-white/8 hover:border-brand-primary/30 px-2.5 py-1 rounded-full transition-colors flex-shrink-0"
                    >
                      {qp}
                    </button>
                  ))}
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="p-3 border-t border-white/5 bg-slate-950 flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Navigator about your timeline..."
                    className="flex-1 bg-white/5 border border-white/8 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-glow-primary"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              // Jarvis OS Commands list (tab 2)
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#07080f]/40">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Active Direct Actions
                </span>

                {/* 1. Simulate Day Command */}
                <button
                  onClick={() => { startDaySimulation(); setIsOpen(false); }}
                  className="w-full bg-white/2 border border-white/5 hover:border-brand-primary/30 p-3 rounded-xl flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded bg-brand-primary/10 text-brand-primary">
                      <Play className="w-4.5 h-4.5 fill-brand-primary" />
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-white block">Simulate My Day</span>
                      <span className="text-[10px] text-slate-400">Play forward daily schedules</span>
                    </div>
                  </div>
                  <HelpCircle className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                {/* 2. Optimize Schedule (Rescue) */}
                <button
                  onClick={() => { activateRescueMode(); setIsOpen(false); }}
                  className="w-full bg-white/2 border border-white/5 hover:border-brand-success/30 p-3 rounded-xl flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded bg-brand-success/10 text-brand-success">
                      <Zap className="w-4.5 h-4.5 fill-brand-success" />
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-white block">Deploy Rescue Mode</span>
                      <span className="text-[10px] text-slate-400">Run neural re-scheduler audits</span>
                    </div>
                  </div>
                  <HelpCircle className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                {/* 3. Panic Overloader */}
                <button
                  onClick={() => { activatePanicMode(); setIsOpen(false); }}
                  className="w-full bg-white/2 border border-white/5 hover:border-brand-danger/30 p-3 rounded-xl flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded bg-brand-danger/10 text-brand-danger">
                      <AlertOctagon className="w-4.5 h-4.5" />
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-white block">Panic Protocol</span>
                      <span className="text-[10px] text-slate-400">Shelve all secondary deliverables</span>
                    </div>
                  </div>
                  <HelpCircle className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice command popup overlay */}
      <VoiceCommandOverlay 
        isOpen={isVoiceOpen} 
        onClose={() => setIsVoiceOpen(false)} 
      />
    </div>
  );
};

export default AICoach;
