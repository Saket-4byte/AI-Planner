import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './contexts/AppContext';
import LandingAuth from './pages/LandingAuth';
import Dashboard from './pages/Dashboard';
import FocusMode from './pages/FocusMode';
import AICoach from './components/AICoach';

const MainAppContent = () => {
  const [view, setView] = useState(() => {
    const isLoggedIn = localStorage.getItem('saver_is_logged_in') === 'true';
    return isLoggedIn ? 'dashboard' : 'landing';
  });
  const [focusTask, setFocusTask] = useState(null);

  const handleLoginSuccess = () => {
    localStorage.setItem('saver_is_logged_in', 'true');
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('saver_is_logged_in');
    setView('landing');
  };

  const handleEnterFocus = (task) => {
    setFocusTask(task);
    setView('focus');
  };

  const handleExitFocus = () => {
    setFocusTask(null);
    setView('dashboard');
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-white">
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingAuth onLoginSuccess={handleLoginSuccess} />
          </motion.div>
        )}

        {view === 'dashboard' && (
          <motion.div
            key="dashboard-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pb-24"
          >
            <Dashboard 
              onLogout={handleLogout} 
              onEnterFocus={handleEnterFocus} 
            />
            {/* The Coach is active in the dashboard */}
            <AICoach />
          </motion.div>
        )}

        {view === 'focus' && (
          <motion.div
            key="focus-page"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <FocusMode 
              task={focusTask} 
              onExit={handleExitFocus} 
            />
            {/* Coach is also accessible in Focus mode */}
            <AICoach />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
