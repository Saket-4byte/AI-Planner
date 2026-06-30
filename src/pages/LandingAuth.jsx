import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Brain, Zap, Clock, Lock, Mail, ChevronRight, UserCheck } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const LandingAuth = ({ onLoginSuccess }) => {
  const { resetDemo, loginUser, initializeWorkspace } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // Onboarding Wizard states
  const [onboardingStep, setOnboardingStep] = useState('auth'); // auth | profile | completed
  const [occupation, setOccupation] = useState('Developer');
  const [focusPreference, setFocusPreference] = useState('Morning');
  const [workHours, setWorkHours] = useState(8);

  const handleAuth = (e) => {
    e.preventDefault();
    
    let customName = 'User';
    if (!isLogin && name) {
      customName = name;
    } else if (email) {
      const prefix = email.split('@')[0];
      customName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }
    
    if (isLogin) {
      setLoading(true);
      loginUser(customName);
      setTimeout(() => {
        setLoading(false);
        onLoginSuccess();
      }, 800);
    } else {
      setOnboardingStep('profile');
    }
  };

  const handleOnboardingComplete = () => {
    setLoading(true);
    setOnboardingStep('completed');
    
    let customName = 'User';
    if (name) {
      customName = name;
    } else if (email) {
      const prefix = email.split('@')[0];
      customName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }

    initializeWorkspace(customName, 'personal', { occupation, focusPreference, workHours });

    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  const handleSandboxLogin = () => {
    setLoading(true);
    resetDemo(); // Clear and preload the specific demo tasks
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 500);
  };

  if (onboardingStep === 'profile') {
    return (
      <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-12">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel w-full max-w-xl rounded-3xl p-6 md:p-8 border border-white/8 shadow-2xl relative space-y-6"
        >
          <div className="text-center">
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
              <Brain className="w-5.5 h-5.5 text-brand-primary animate-pulse" /> Calibrate Navigator Engine
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Configure your profile to let the AI learn your work style immediately.
            </p>
          </div>

          <div className="space-y-4">
            {/* Occupation Selector */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                What is your occupation?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Student', 'Developer', 'Professional', 'Founder'].map((occ) => (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => setOccupation(occ)}
                    className={`py-3 px-4 text-xs font-bold rounded-xl border transition-all ${
                      occupation === occ
                        ? 'bg-brand-primary/15 border-brand-primary text-white shadow-glow-primary'
                        : 'bg-white/3 border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* Peak Energy Selector */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                When is your peak energy / focus preference?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Morning', 'Afternoon', 'Evening'].map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => setFocusPreference(pref)}
                    className={`py-3 px-2 text-xs font-bold rounded-xl border transition-all ${
                      focusPreference === pref
                        ? 'bg-brand-secondary/15 border-brand-secondary text-white shadow-glow-secondary'
                        : 'bg-white/3 border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>

            {/* Work Hours Focus Budget Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Typical daily focus hours budget?
                </label>
                <span className="text-brand-primary font-mono font-bold text-xs">{workHours} Hours</span>
              </div>
              <input
                type="range"
                min="4"
                max="12"
                step="1"
                value={workHours}
                onChange={(e) => setWorkHours(Number(e.target.value))}
                className="w-full accent-brand-primary bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleOnboardingComplete}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:brightness-110 transition-all shadow-glow-primary flex items-center justify-center gap-1.5"
          >
            Create Workspace <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  if (onboardingStep === 'completed') {
    return (
      <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-12">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel w-full max-w-sm rounded-3xl p-8 border border-white/8 text-center space-y-6 shadow-2xl relative"
        >
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-brand-primary/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
            <Brain className="w-8 h-8 text-brand-primary animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-white tracking-tight">Assembling Workspace</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configuring Navigator Engine models, calibrating timeline matrices, and setting up observation nodes...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-12">
      {/* Dynamic Grid Background Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
      
      {/* Ambient Radial Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-brand-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Layout Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left Side: Product Intro Copy */}
        <div className="lg:col-span-7 text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
          >
            <Brain className="w-3.5 h-3.5" /> Next-Gen AI Productivity
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight"
          >
            The Last-Minute <br />
            <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-pink-500 bg-clip-text text-transparent">
              Life Saver
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed"
          >
            Traditional reminder apps only notify you. <strong>The Last-Minute Life Saver</strong> actively steps in. It predicts deadline failures, trims project scopes, creates hourly timelines, and generates emergency schedules when you are overwhelmed.
          </motion.p>

          {/* Core Feature Pill Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg"
          >
            <div className="glass-panel p-3.5 rounded-xl border border-white/5 flex gap-3 items-center">
              <div className="w-8 h-8 rounded-lg bg-brand-danger/10 border border-brand-danger/25 flex items-center justify-center text-brand-danger">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">AI Risk Engine</h3>
                <p className="text-[10px] text-slate-400">Computes real-time deadline risks</p>
              </div>
            </div>

            <div className="glass-panel p-3.5 rounded-xl border border-white/5 flex gap-3 items-center">
              <div className="w-8 h-8 rounded-lg bg-brand-success/10 border border-brand-success/25 flex items-center justify-center text-brand-success">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Rescue Mode</h3>
                <p className="text-[10px] text-slate-400">Boosts success rates (28% ➔ 91%)</p>
              </div>
            </div>

            <div className="glass-panel p-3.5 rounded-xl border border-white/5 flex gap-3 items-center">
              <div className="w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/25 flex items-center justify-center text-brand-primary">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Smart Planner</h3>
                <p className="text-[10px] text-slate-400">Generates hourly timelines automatically</p>
              </div>
            </div>

            <div className="glass-panel p-3.5 rounded-xl border border-white/5 flex gap-3 items-center">
              <div className="w-8 h-8 rounded-lg bg-brand-warning/10 border border-brand-warning/25 flex items-center justify-center text-brand-warning">
                <Brain className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Cognitive Coach</h3>
                <p className="text-[10px] text-slate-400">Provides natural active feedback</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Glassmorphic Auth Form */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="glass-panel w-full max-w-sm rounded-3xl p-6 md:p-8 border border-white/8 shadow-2xl relative"
          >
            {/* Form Title */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-extrabold text-white font-sans tracking-tight">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {isLogin ? 'Access your optimized schedule dashboard' : 'Join the next generation of productivity'}
              </p>
            </div>

            {/* Sandbox Quick Access Button */}
            <button
              type="button"
              onClick={handleSandboxLogin}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:brightness-115 transition-all shadow-glow-primary hover:shadow-2xl flex items-center justify-center gap-2 mb-6"
            >
              <UserCheck className="w-4 h-4" /> Instant Sandbox Demo Access
            </button>

            {/* OR Separator */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-full border-t border-white/5" />
              <span className="absolute bg-[#0b0c14] px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                OR SIGN IN WITH
              </span>
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500"
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                      <svg className="w-4.5 h-4.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500"
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white/5 border border-white/8 hover:bg-white/10 hover:border-white/20 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all flex items-center justify-center gap-1"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Sign Up'} <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle Link */}
            <div className="text-center mt-5">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[11px] text-slate-400 hover:text-white transition-colors"
              >
                {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
              </button>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default LandingAuth;
