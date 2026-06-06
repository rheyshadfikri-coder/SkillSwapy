/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ShieldAlert, Sparkles, LogIn, ArrowRight, ShieldCheck, RefreshCw, X, HelpCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_USERS } from '../data/initialData';
import { User } from '../types';

interface LoginRegisterProps {
  initialMode?: 'login' | 'register';
  onAuthSuccess: (user: User) => void;
  onNavigate: (page: string) => void;
  registeredUsers?: User[];
}

export default function LoginRegister({ initialMode = 'login', onAuthSuccess, onNavigate, registeredUsers = [] }: LoginRegisterProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorText, setErrorText] = useState('');

  // Clerk Google Simulated OAuth States
  const [showClerkModal, setShowClerkModal] = useState(false);
  const [clerkStage, setClerkStage] = useState<'select' | 'custom' | 'authorizing' | 'success'>('select');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [clerkLogMsg, setClerkLogMsg] = useState('');
  const [selectedProfilePic, setSelectedProfilePic] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200');

  // Quick log-in shortcuts helper
  const handleQuickLogin = (userKey: string) => {
    const matched = (registeredUsers.length ? registeredUsers : INITIAL_USERS).find(u => u.id === userKey);
    if (matched) {
      onAuthSuccess(matched);
      onNavigate('dashboard');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    const usersList = registeredUsers.length ? registeredUsers : INITIAL_USERS;

    if (mode === 'login') {
      if (!email || !password) {
        setErrorText('Silakan isi seluruh kolom data log masuk.');
        return;
      }
      // Check if matches the registered email catalog
      const match = usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (match) {
        onAuthSuccess(match);
        onNavigate('dashboard');
      } else {
        setErrorText('Akun belum terdaftar dengan email ini. Silakan daftar terlebih dahulu atau gunakan pintasan akun uji coba di bawah.');
        return;
      }
    } else {
      // Register Mode
      if (!username || !email || !password || !confirmPassword) {
        setErrorText('Silakan isi seluruh kolom formulir pendaftaran.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorText('Kata sandi konfirmasi tidak cocok.');
        return;
      }

      // Check if email already registered
      const alreadyRegistered = usersList.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (alreadyRegistered) {
        setErrorText('Alamat email ini sudah terdaftar. Silakan menuju halaman Log Masuk.');
        return;
      }

      // Successful registration creates a user profile and routes to Onboarding Setup
      const newUser: User = {
        id: `usr_${Date.now()}`,
        username: username,
        email: email,
        bio: 'Just registered! Looking to swap high value skills with community peers.',
        profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
        title: 'New Student Node',
        xp: 150,
        level: 1,
        interests: [],
        skills: []
      };

      onAuthSuccess(newUser);
      onNavigate('onboarding'); // Immediately onboard skills
    }
  };

  // Clerk SSO authorization ticker simulation
  const startClerkOAuthProcess = (name: string, emailAddr: string) => {
    setClerkStage('authorizing');
    setClerkLogMsg('Contacting Clerk authorization servers...');

    setTimeout(() => {
      setClerkLogMsg('Requesting secure Google OAuth scopes (profile, email)...');
    }, 800);

    setTimeout(() => {
      setClerkLogMsg('Generating token tickets & validating handshake keys...');
    }, 1600);

    setTimeout(() => {
      setClerkLogMsg('Clerk session established! Constructing SkillSwap student session...');
    }, 2400);

    setTimeout(() => {
      setClerkStage('success');
      // Create user auth structure matching demo or custom database
      const usersList = registeredUsers.length ? registeredUsers : INITIAL_USERS;
      const match = usersList.find(u => u.email.toLowerCase() === emailAddr.toLowerCase());
      
      const authenticatedUser: User = match || {
        id: `usr_clerk_${Date.now()}`,
        username: name,
        email: emailAddr,
        bio: 'Authenticated safely using Clerk Google SSO. Welcome to the SkillSwap node mesh!',
        profileImage: selectedProfilePic,
        title: 'Clerk Verified Scholar',
        xp: 250,
        level: 2,
        interests: ['UI/UX Design', 'Software Automation', 'Academic Writing'],
        skills: [
          { id: 'usr_clerk_s1', userId: 'usr_clerk_temp', name: 'Clerk SSO Security', type: 'teach', level: 'expert' }
        ]
      };

      setTimeout(() => {
        onAuthSuccess(authenticatedUser);
        setShowClerkModal(false);
        // If it's a custom user, send to Onboarding, else directly to Dashboard
        if (!match) {
          onNavigate('onboarding');
        } else {
          onNavigate('dashboard');
        }
      }, 1000);

    }, 3200);
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4 text-left relative">
      <div className="text-center space-y-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/60 border border-blue-200 text-xs font-bold text-blue-600 shadow-sm"
        >
          <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
          <span>SkillSwap Authentication Flow</span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-extrabold text-slate-00 tracking-tight leading-tight"
        >
          {mode === 'login' ? 'Welcome Back!' : 'Create Your Peer Account'}
        </motion.h2>
        
        <p className="font-sans text-xs sm:text-sm text-slate-400">
          {mode === 'login' 
            ? 'Sign in to access your direct learning sessions and active matching parameters.' 
            : 'Register a node to start publishing your teach/learn tags.'}
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="p-8 rounded-3xl glass-panel border border-white/60 shadow-xl space-y-6 bg-white/50"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <AnimatePresence mode="wait">
            {mode === 'register' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1 bg-transparent overflow-hidden"
              >
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block">Account Username</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brandon Lee"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2.5 pl-9 rounded-xl text-xs font-sans border border-slate-200 bg-white/60 focus:bg-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    id="regUsername"
                  />
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="e.g. brandon.design@skillswap.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 pl-9 rounded-xl text-xs font-sans border border-slate-200 bg-white/60 focus:bg-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                id="authEmail"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block">Account Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 pl-9 rounded-xl text-xs font-sans border border-slate-200 bg-white/60 focus:bg-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                id="authPassword"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'register' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1 overflow-hidden"
              >
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block">Confirm Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2.5 pl-9 rounded-xl text-xs font-sans border border-slate-200 bg-white/60 focus:bg-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    id="authConfirmPassword"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {errorText && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex gap-2 p-3 rounded-lg text-xs font-medium text-red-600 bg-red-50 border border-red-150 animate-pulse"
            >
              <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
              <span>{errorText}</span>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-display text-xs font-bold rounded-xl shadow-lg hover:shadow-indigo-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer outline-none"
            id="authSubmitBtn"
          >
            <LogIn className="h-4 w-4" />
            <span>{mode === 'login' ? 'Authenticate Node' : 'Register & Onboard'}</span>
          </motion.button>
        </form>

        {/* Divider OR Clerk Google login section */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
            or use Clerk SSO
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Clerk SSO Google Login Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setShowClerkModal(true);
            setClerkStage('select');
          }}
          className="w-full py-3 bg-white hover:bg-slate-50 text-slate-700 font-display text-xs font-extrabold rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer outline-none font-sans"
        >
          {/* Custom Google SVG */}
          <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-slate-800">Continue with Google via Clerk</span>
        </motion.button>

        <div className="text-center pt-1 border-t border-slate-100/60">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-xs text-slate-500 font-semibold hover:text-blue-500 focus:outline-none cursor-pointer"
          >
            {mode === 'login' 
              ? "Don't have an account? Start registering" 
              : "Already registered? Login to your session"}
          </button>
        </div>

        {/* Demo shortcuts - highly interactive and convenient for peer showcase */}
        <div className="border-t border-slate-100 pt-4 space-y-2">
          <p className="text-[10px] font-extrabold text-slate-400 text-center tracking-wider uppercase">
            💡 QUICK INSPECT DEMO ACCOUNT SCENARIOS
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('usr_alice')}
              className="p-3 text-left rounded-xl border border-slate-200/60 bg-white/50 hover:bg-white hover:border-blue-300 transition-all font-sans cursor-pointer flex flex-col items-start"
            >
              <span className="text-[11px] font-extrabold text-slate-800">1. Alice Jin</span>
              <span className="text-[9px] text-slate-400">Teaches Python ML</span>
            </button>

            <button
              onClick={() => handleQuickLogin('usr_brandon')}
              className="p-3 text-left rounded-xl border border-slate-200/60 bg-white/50 hover:bg-white hover:border-purple-300 transition-all font-sans cursor-pointer flex flex-col items-start"
            >
              <span className="text-[11px] font-extrabold text-slate-800">2. Brandon Lee</span>
              <span className="text-[9px] text-slate-400">Teaches Figma Systems</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Clerk Google SSO Simulated Modal Box Backdrop */}
      <AnimatePresence>
        {showClerkModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="w-full max-w-sm rounded-[32px] bg-white border border-slate-100 shadow-2xl p-6 overflow-hidden text-left relative"
            >
              {/* Clerk Brand Top Area */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-[11px] font-black tracking-tighter">
                    Clerk
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest block">SECURED BY CLERK</span>
                    <span className="text-xs font-bold text-slate-800">clerk.skillswap.edu</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowClerkModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Dynamic Authentication Stages */}
              <AnimatePresence mode="wait">
                {clerkStage === 'select' && (
                  <motion.div
                    key="select"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    className="space-y-5 pt-4"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-extrabold text-slate-800">Choose a Google Account</h4>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Select one of your registered Google identities to synchronize instantly with Clerk's credential database.
                      </p>
                    </div>

                    <div className="space-y-2">
                      {/* Alice Jin Profile row */}
                      <button
                        onClick={() => {
                          setSelectedProfilePic('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200');
                          startClerkOAuthProcess('Alice Jin', 'alice.jin@stanford.edu');
                        }}
                        className="w-full p-3 rounded-2xl border border-slate-200/80 bg-white hover:bg-slate-50 text-left flex items-center gap-3 cursor-pointer transition"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
                          alt="Alice"
                          className="w-9 h-9 rounded-full object-cover border border-slate-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-extrabold text-slate-800 leading-none">Alice Jin</p>
                          <p className="text-[10px] text-slate-400 font-sans truncate mt-0.5">alice.jin@stanford.edu</p>
                        </div>
                        <span className="text-[10px] text-blue-500 font-extrabold bg-blue-50 py-0.5 px-2 rounded-md shrink-0 uppercase tracking-wider">STANFORD</span>
                      </button>

                      {/* Brandon Lee Profile row */}
                      <button
                        onClick={() => {
                          setSelectedProfilePic('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200');
                          startClerkOAuthProcess('Brandon Lee', 'brandon.design@skillswap.edu');
                        }}
                        className="w-full p-3 rounded-2xl border border-slate-200/80 bg-white hover:bg-slate-50 text-left flex items-center gap-3 cursor-pointer transition"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
                          alt="Brandon"
                          className="w-9 h-9 rounded-full object-cover border border-slate-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-extrabold text-slate-800 leading-none">Brandon Lee</p>
                          <p className="text-[10px] text-slate-400 font-sans truncate mt-0.5">brandon.design@skillswap.edu</p>
                        </div>
                        <span className="text-[10px] text-purple-500 font-extrabold bg-purple-50 py-0.5 px-2 rounded-md shrink-0 uppercase tracking-wider">MIT NODE</span>
                      </button>

                      {/* Custom User account row alternative */}
                      <button
                        onClick={() => setClerkStage('custom')}
                        className="w-full p-3 rounded-2xl border border-dashed border-slate-200 hover:border-slate-400 bg-slate-50 text-left flex items-center justify-center gap-2 cursor-pointer transition text-xs font-bold text-slate-600"
                      >
                        <UserIcon className="h-4 w-4" />
                        <span>Use another Google Account</span>
                      </button>
                    </div>

                    <div className="text-[10px] text-slate-350 bg-slate-50 rounded-xl p-3 border border-slate-100 leading-relaxed text-center font-sans uppercase tracking-widest font-black flex items-center justify-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Clerk SSO Handshake Protocol Active</span>
                    </div>
                  </motion.div>
                )}

                {clerkStage === 'custom' && (
                  <motion.div
                    key="custom"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="space-y-4 pt-4"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-extrabold text-slate-800">Login with Custom Google Profile</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Simulating custom Clerk authentication schemas. Enter your customized scholar parameters below.
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Google Account Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Rheyshad Fikri"
                          value={customGoogleName}
                          onChange={(e) => setCustomGoogleName(e.target.value)}
                          className="w-full p-2.5 rounded-xl text-xs font-sans border border-slate-200 outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Google Email Address</label>
                        <input
                          type="email"
                          placeholder="e.g. rheyshad@google.com"
                          value={customGoogleEmail}
                          onChange={(e) => setCustomGoogleEmail(e.target.value)}
                          className="w-full p-2.5 rounded-xl text-xs font-sans border border-slate-200 outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-3">
                      <button
                        onClick={() => setClerkStage('select')}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => {
                          if (!customGoogleEmail.trim() || !customGoogleName.trim()) return;
                          setSelectedProfilePic('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200');
                          startClerkOAuthProcess(customGoogleName.trim(), customGoogleEmail.trim());
                        }}
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm cursor-pointer"
                      >
                        Authenticate
                      </button>
                    </div>
                  </motion.div>
                )}

                {clerkStage === 'authorizing' && (
                  <motion.div
                    key="authorizing"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-12 flex flex-col items-center justify-center space-y-6 text-center"
                  >
                    <RefreshCw className="h-10 w-10 text-indigo-600 animate-spin" />
                    
                    <div className="space-y-2">
                      <p className="text-xs font-extrabold text-slate-800 tracking-wide">Clerk OAuth Broker Active</p>
                      <motion.p 
                        key={clerkLogMsg}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[11px] text-slate-450 font-mono italic max-w-[250px]"
                      >
                        {clerkLogMsg}
                      </motion.p>
                    </div>
                  </motion.div>
                )}

                {clerkStage === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 flex flex-col items-center justify-center space-y-4 text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg animate-bounce">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-extrabold text-slate-800">Verification Successful</p>
                      <p className="text-[11px] text-slate-400">Syncing with SkillSwap learning ledger node.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Secure banner */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-1 text-[10px] text-slate-400 font-sans">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                <span>SSL Secured • Cryptographic Auth Logs</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
