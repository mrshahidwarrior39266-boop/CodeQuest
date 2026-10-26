import React, { useState } from 'react';
import { useLearningStore } from '../../store/useLearningStore';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import {
  User,
  Shield,
  Key,
  Copy,
  Check,
  Zap,
  Sparkles,
  Trophy,
  ExternalLink,
  Flame,
  LogOut,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, loginUser, logoutUser, completedLessons } = useLearningStore();
  const [clientId, setClientId] = useState<string>(
    localStorage.getItem('cq_google_client_id') || import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveClientId = (val: string) => {
    setClientId(val);
    localStorage.setItem('cq_google_client_id', val);
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        const decoded: any = jwtDecode(credentialResponse.credential);
        loginUser({
          name: decoded.name || 'Google User',
          email: decoded.email,
          picture: decoded.picture,
          xp: user?.xp || 200,
        });
        onClose();
      } catch (err) {
        console.error('Failed to decode Google JWT', err);
      }
    }
  };

  const handleDemoLogin = (role: 'apprentice' | 'master') => {
    if (role === 'master') {
      loginUser({
        name: 'Alex Rivera (Grandmaster)',
        email: 'alex.rivera@codequest.dev',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        xp: 1250,
        streak: 7,
      });
    } else {
      loginUser({
        name: 'Dev Explorer',
        email: 'dev@codequest.dev',
        picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        xp: 250,
        streak: 3,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        style={{
          background: 'linear-gradient(150deg, #18110b 0%, #100a06 100%)',
          border: '1px solid rgba(110, 78, 55, 0.4)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(110, 78, 55, 0.3)',
        }}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'rgba(110, 78, 55, 0.25)', background: '#130d07' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6F4E37, #5a3e2b)' }}
            >
              <Shield size={16} className="text-lavender-100" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-platinum">CodeQuest Identity & Cloud Sync</h2>
              <p className="text-[11px] text-[#888]">Google Cloud OAuth 2.0 & Student Leveling</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#888] hover:text-white hover:bg-mocha-900/30"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-platinum">
          {user ? (
            /* Logged-In User Profile Card */
            <div className="space-y-4">
              <div
                className="p-4 rounded-xl flex items-center gap-4"
                style={{ background: '#0e0905', border: '1px solid rgba(110, 78, 55, 0.35)' }}
              >
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="w-14 h-14 rounded-full border-2 border-mocha-500" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-mocha-700 flex items-center justify-center text-xl font-bold text-platinum">
                    {user.name[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-platinum truncate">{user.name}</h3>
                  <p className="text-xs text-[#a8a7a5] truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: 'rgba(230, 224, 240, 0.15)', color: '#E6E0F0', border: '1px solid #E6E0F0' }}
                    >
                      {user.level}
                    </span>
                    <span className="text-[11px] font-mono text-lavender font-bold">
                      {user.xp} XP
                    </span>
                    <span className="text-[11px] text-[#888] flex items-center gap-1">
                      <Flame size={12} className="text-orange-400" /> {user.streak}d streak
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-[#0a0603] border border-mocha-900/40">
                  <span className="text-[#888] block text-[10px]">Completed Lessons</span>
                  <span className="text-platinum text-base font-bold">{completedLessons.length} / 6</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0a0603] border border-mocha-900/40">
                  <span className="text-[#888] block text-[10px]">Cloud Sync Status</span>
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 mt-0.5">
                    <Check size={13} /> Active & Saved
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  logoutUser();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl border border-red-900/40 text-red-300 hover:bg-red-950/20 font-bold transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={14} />
                Sign Out from CodeQuest
              </button>
            </div>
          ) : (
            /* Unauthenticated View: Google OAuth & Demo Sign-In */
            <div className="space-y-4">
              {/* Google OAuth Section */}
              <div
                className="p-4 rounded-xl space-y-3"
                style={{ background: '#0e0905', border: '1px solid rgba(110, 78, 55, 0.35)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-platinum text-xs flex items-center gap-1.5">
                    <Key size={13} className="text-lavender-200" />
                    Google Cloud OAuth Client
                  </span>
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-lavender hover:underline flex items-center gap-1 font-mono"
                  >
                    Open Console <ExternalLink size={10} />
                  </a>
                </div>

                {/* Optional Custom Client ID input */}
                <div>
                  <label className="block text-[10px] text-[#888] mb-1 font-mono">
                    Google OAuth Web Client ID (from Google Cloud Console):
                  </label>
                  <input
                    type="text"
                    value={clientId}
                    onChange={(e) => handleSaveClientId(e.target.value)}
                    placeholder="e.g. 1234567890-xxx.apps.googleusercontent.com"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#140d07] border border-mocha-800/60 text-platinum text-xs font-mono focus:outline-none focus:border-lavender"
                  />
                </div>

                {/* Google Sign-In Button or Provider */}
                {clientId ? (
                  <div className="pt-2 flex justify-center">
                    <GoogleOAuthProvider clientId={clientId}>
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => console.error('Login Failed')}
                        theme="filled_black"
                        shape="pill"
                        text="signin_with"
                      />
                    </GoogleOAuthProvider>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-[#140e08] border border-mocha-800/30 text-[11px] text-[#a8a7a5] leading-relaxed">
                    Paste your Google Web Client ID above, or use the instant demo profiles below to test leveling right now.
                  </div>
                )}
              </div>

              {/* Exact Google Cloud Console URIs to copy */}
              <div
                className="p-3.5 rounded-xl space-y-2 bg-[#0c0704] border border-mocha-900/40"
              >
                <p className="text-[11px] font-bold text-lavender-200 uppercase tracking-wider">
                  Copy to Google Cloud Console (OAuth Credentials):
                </p>

                {/* Origin 1: Localhost */}
                <div className="flex items-center justify-between bg-[#150e08] px-2.5 py-1.5 rounded-lg border border-mocha-900/40">
                  <span className="font-mono text-[10px] text-[#a8a7a5] truncate">http://localhost:5173</span>
                  <button
                    onClick={() => handleCopy('http://localhost:5173', 'local')}
                    className="text-[10px] text-lavender hover:text-white flex items-center gap-1 font-mono ml-2"
                  >
                    {copiedField === 'local' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    {copiedField === 'local' ? 'Copied' : 'Copy'}
                  </button>
                </div>

                {/* Origin 2: Production Vercel */}
                <div className="flex items-center justify-between bg-[#150e08] px-2.5 py-1.5 rounded-lg border border-mocha-900/40">
                  <span className="font-mono text-[10px] text-[#a8a7a5] truncate">https://codequest-lab.vercel.app</span>
                  <button
                    onClick={() => handleCopy('https://codequest-lab.vercel.app', 'prod')}
                    className="text-[10px] text-lavender hover:text-white flex items-center gap-1 font-mono ml-2"
                  >
                    {copiedField === 'prod' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    {copiedField === 'prod' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Instant One-Click Demo Profiles */}
              <div className="space-y-2">
                <span className="text-[11px] text-[#888] font-bold uppercase tracking-wider">
                  Or Test Instantly with Demo Profiles:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDemoLogin('apprentice')}
                    className="p-2.5 rounded-xl border border-mocha-700/50 hover:border-lavender/50 text-left transition-all bg-[#140e08] group cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-platinum text-xs">
                      <Sparkles size={12} className="text-lavender" />
                      Apprentice
                    </div>
                    <span className="text-[10px] text-[#888] block mt-0.5">250 XP · Level 2</span>
                  </button>

                  <button
                    onClick={() => handleDemoLogin('master')}
                    className="p-2.5 rounded-xl border border-mocha-700/50 hover:border-lavender/50 text-left transition-all bg-[#140e08] group cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-platinum text-xs">
                      <Trophy size={12} className="text-amber-300" />
                      Grandmaster
                    </div>
                    <span className="text-[10px] text-[#888] block mt-0.5">1250 XP · Level 5</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
