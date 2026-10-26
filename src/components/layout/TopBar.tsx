import React, { useState } from 'react';
import { useLearningStore } from '../../store/useLearningStore';
import { lessons } from '../../data/lessons';
import { AuthModal } from '../auth/AuthModal';
import {
  Code2,
  Zap,
  ChevronRight,
  Home,
  Compass,
  Layers,
  Play,
  Flag,
  Volume2,
  VolumeX,
  Menu,
  X,
  Shield,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function TopBar() {
  const {
    currentScreen,
    currentLesson,
    goToScreen,
    setLesson,
    isSoundEnabled,
    toggleSound,
    user,
  } = useLearningStore();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenLab = () => {
    if (!currentLesson) {
      const bubble = lessons.find((l) => l.id === 'bubble-sort') || lessons[0];
      setLesson(bubble);
    } else {
      goToScreen('lab');
    }
  };

  const handleNav = (screen: 'landing' | 'dashboard' | 'lab' | 'race') => {
    setMobileMenuOpen(false);
    if (screen === 'lab') {
      handleOpenLab();
    } else {
      goToScreen(screen);
    }
  };

  return (
    <>
      <header
        className="flex items-center justify-between px-3 sm:px-6 py-2 border-b z-40 flex-shrink-0"
        style={{
          background: 'linear-gradient(to right, #1a130c, #2a1e13)',
          borderColor: 'rgba(110, 78, 55, 0.3)',
          minHeight: 52,
        }}
      >
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg transition-colors hover:bg-mocha-900/40 text-platinum"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <button
            onClick={() => handleNav('landing')}
            className="flex items-center gap-2 group transition-transform hover:scale-105"
          >
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shadow-md transition-shadow group-hover:shadow-lg flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #6F4E37, #5a3e2b)',
                border: '1px solid rgba(229, 228, 226, 0.25)',
                boxShadow: '0 0 14px rgba(110, 78, 55, 0.5)',
              }}
            >
              <Code2 size={16} color="#E5E4E2" />
            </div>
            <span
              className="text-base sm:text-lg font-bold tracking-tight"
              style={{ color: '#E5E4E2' }}
            >
              Code<span style={{ color: '#E6E0F0' }}>Quest</span>
            </span>
          </button>

          {/* Desktop Navigation tabs */}
          <nav className="hidden md:flex items-center gap-1.5 ml-2">
            <button
              onClick={() => handleNav('landing')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: currentScreen === 'landing' ? 'rgba(110, 78, 55, 0.3)' : 'transparent',
                color: currentScreen === 'landing' ? '#E6E0F0' : '#a8a7a5',
                border: currentScreen === 'landing' ? '1px solid rgba(110, 78, 55, 0.5)' : '1px solid transparent',
              }}
            >
              <Compass size={13} />
              <span>3D Showcase</span>
            </button>

            <button
              onClick={() => handleNav('dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: currentScreen === 'dashboard' ? 'rgba(110, 78, 55, 0.3)' : 'transparent',
                color: currentScreen === 'dashboard' ? '#E6E0F0' : '#a8a7a5',
                border: currentScreen === 'dashboard' ? '1px solid rgba(110, 78, 55, 0.5)' : '1px solid transparent',
              }}
            >
              <Layers size={13} />
              <span>Mission Control</span>
            </button>

            <button
              onClick={() => handleNav('lab')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: (currentScreen === 'lab' || currentScreen === 'playground') ? 'rgba(110, 78, 55, 0.3)' : 'transparent',
                color: (currentScreen === 'lab' || currentScreen === 'playground') ? '#E6E0F0' : '#a8a7a5',
                border: (currentScreen === 'lab' || currentScreen === 'playground') ? '1px solid rgba(110, 78, 55, 0.5)' : '1px solid transparent',
              }}
            >
              <Play size={12} fill="currentColor" />
              <span>Execution Lab</span>
            </button>

            <button
              onClick={() => handleNav('race')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: currentScreen === 'race' ? 'rgba(110, 78, 55, 0.3)' : 'transparent',
                color: currentScreen === 'race' ? '#E6E0F0' : '#a8a7a5',
                border: currentScreen === 'race' ? '1px solid rgba(110, 78, 55, 0.5)' : '1px solid transparent',
              }}
            >
              <Flag size={12} color="#E6E0F0" />
              <span>Algorithm Race</span>
            </button>
          </nav>
        </div>

        {/* Center: Breadcrumbs when deep in a lesson (Desktop) */}
        {currentLesson && (currentScreen === 'lab' || currentScreen === 'results') && (
          <div className="hidden xl:flex items-center gap-2 text-xs" style={{ color: '#a8a7a5' }}>
            <button
              onClick={() => handleNav('dashboard')}
              className="flex items-center gap-1 hover:text-white transition-colors"
              style={{ color: '#a8a7a5' }}
            >
              <Home size={12} />
              <span>Mission Control</span>
            </button>
            <ChevronRight size={12} color="#686765" />
            <span style={{ color: '#E6E0F0', fontWeight: 600 }}>
              {currentLesson.icon} {currentLesson.title}
            </span>
          </div>
        )}

        {/* Right side: Audio, User Profile / Google Sign-In, and CTA */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            title={isSoundEnabled ? 'Audio Synth ON (click to mute)' : 'Audio Synth OFF (click to unmute)'}
            className="p-1.5 rounded-lg text-xs transition-all hover:scale-105"
            style={{
              background: isSoundEnabled ? 'rgba(110, 78, 55, 0.25)' : 'rgba(229, 228, 226, 0.04)',
              color: isSoundEnabled ? '#E6E0F0' : '#686765',
              border: isSoundEnabled ? '1px solid #6F4E37' : '1px solid rgba(110, 78, 55, 0.2)',
            }}
          >
            {isSoundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>

          {/* User Profile / Google Sign-In Button */}
          {user ? (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-xl transition-all hover:scale-105 cursor-pointer"
              style={{
                background: 'rgba(230, 224, 240, 0.1)',
                border: '1px solid rgba(230, 224, 240, 0.3)',
              }}
              title="Click to view profile & cloud stats"
            >
              {user.picture ? (
                <img src={user.picture} alt={user.name} className="w-5 h-5 rounded-full border border-lavender" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-mocha-700 flex items-center justify-center text-[10px] font-bold text-platinum">
                  {user.name[0]}
                </div>
              )}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[11px] font-bold text-platinum truncate max-w-[80px]">
                  {user.name.split(' ')[0]}
                </span>
                <span className="text-[9px] font-mono text-lavender-200">
                  {user.xp} XP
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                background: 'rgba(230, 224, 240, 0.12)',
                color: '#E6E0F0',
                border: '1px solid rgba(230, 224, 240, 0.35)',
              }}
              title="Sign in with Google or test with demo account"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#E6E0F0"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#d4a882"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#a8a7a5"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#E5E4E2"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {currentScreen !== 'lab' && (
            <button
              onClick={handleOpenLab}
              className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #6F4E37, #5a3e2b)',
                color: '#E5E4E2',
                border: '1px solid rgba(229, 228, 226, 0.2)',
                boxShadow: '0 0 16px rgba(110, 78, 55, 0.4)',
              }}
            >
              <Play size={10} fill="currentColor" />
              <span className="text-xs">Lab</span>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden z-40 border-b overflow-hidden"
            style={{
              background: '#130d07',
              borderColor: 'rgba(110, 78, 55, 0.3)',
            }}
          >
            <div className="px-4 py-3 space-y-1.5">
              <button
                onClick={() => handleNav('landing')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left"
                style={{
                  background: currentScreen === 'landing' ? 'rgba(110, 78, 55, 0.35)' : 'transparent',
                  color: currentScreen === 'landing' ? '#E6E0F0' : '#E5E4E2',
                }}
              >
                <Compass size={15} className="text-lavender-300" />
                <span>3D Showcase (Landing)</span>
              </button>

              <button
                onClick={() => handleNav('dashboard')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left"
                style={{
                  background: currentScreen === 'dashboard' ? 'rgba(110, 78, 55, 0.35)' : 'transparent',
                  color: currentScreen === 'dashboard' ? '#E6E0F0' : '#E5E4E2',
                }}
              >
                <Layers size={15} className="text-lavender-300" />
                <span>Mission Control (Lessons)</span>
              </button>

              <button
                onClick={() => handleNav('lab')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left"
                style={{
                  background: (currentScreen === 'lab' || currentScreen === 'playground') ? 'rgba(110, 78, 55, 0.35)' : 'transparent',
                  color: (currentScreen === 'lab' || currentScreen === 'playground') ? '#E6E0F0' : '#E5E4E2',
                }}
              >
                <Play size={14} fill="currentColor" className="text-mocha-300" />
                <span>Execution Lab</span>
              </button>

              <button
                onClick={() => handleNav('race')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left"
                style={{
                  background: currentScreen === 'race' ? 'rgba(110, 78, 55, 0.35)' : 'transparent',
                  color: currentScreen === 'race' ? '#E6E0F0' : '#E5E4E2',
                }}
              >
                <Flag size={14} className="text-lavender-200" />
                <span>Algorithm Race Arena</span>
              </button>

              {user && (
                <div className="pt-2 mt-2 border-t border-mocha-900/40 flex items-center justify-between text-xs px-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lavender font-bold">{user.name}</span>
                    <span className="text-[10px] text-[#888] font-mono">({user.xp} XP)</span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthModalOpen(true);
                    }}
                    className="text-[11px] text-lavender-300 underline"
                  >
                    Profile
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
