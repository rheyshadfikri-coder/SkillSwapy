/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Target, Heart, Eye, Users, Layers, Award, Milestone } from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutView() {
  const coreValues = [
    { title: 'Peer Collaboration', desc: 'Learning is most efficient when practiced together in symmetrical environments.', icon: Users, color: 'text-blue-500 bg-blue-50' },
    { title: 'Talent Bartering', desc: 'Everyone dominates at least one skill value and wants to master another. Skills are the currency.', icon: Layers, color: 'text-cyan-500 bg-cyan-50' },
    { title: 'Zero Financial Burden', desc: 'Universal high-quality education should not be locked behind massive commercial bills.', icon: ShieldCheck, color: 'text-purple-500 bg-purple-50' },
    { title: 'Social Integration', desc: 'Networking with brilliant peers builds lifelong collegiate bonds and cross-university systems.', icon: Heart, color: 'text-pink-500 bg-pink-50' }
  ];

  const milestones = [
    { year: '2025', title: 'Concept Inception', desc: 'Four CS Stanford sophomore students launch structured skill-swapping logs in dorm spaces.' },
    { year: '2026', title: 'SkillSwap Platform launch', desc: 'Transition into a beautiful, immersive, glassmorphism web platform serving active learners globally.' },
    { year: '2027', title: 'Campus nodes activation', desc: 'Unlocking customized student exchange nodes in over 180 universities across the world.' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 180 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-16 pb-20 text-left max-w-5xl mx-auto px-4"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-xs font-bold text-blue-600 dark:text-blue-400">
          <Award className="h-3.5 w-3.5 animate-pulse" />
          <span>About SkillSwap</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Our Mission: Break Down learning barriers
        </h1>
        <p className="font-sans text-slate-500 dark:text-slate-400 max-w-2xl text-sm leading-relaxed">
          SkillSwap is a futuristic collaborative platform where students, self-taught coders, and young visual architects trade their direct competencies without paying a cent.
        </p>
      </motion.div>

      {/* Grid section of Mission & Vision */}
      <motion.div 
        variants={itemVariants} 
        className="grid md:grid-cols-2 gap-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-[32px] border border-white/60 dark:border-slate-800/60 shadow-xl"
      >
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="glass-card p-8 rounded-[24px] space-y-4 bg-white/50 dark:bg-slate-950/20 border border-white dark:border-slate-850"
        >
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-500 w-11 h-11 flex items-center justify-center">
            <Target className="h-6 w-6" />
          </div>
          <h3 className="font-display text-xl font-extrabold text-slate-900 dark:text-white">Our Sincere Mission</h3>
          <p className="font-sans text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
            To build a robust, accessible peer-to-peer knowledge database that replaces traditional high-cost certificate programs. We believe in high-concept learning through practical discussion, interactive code-reviews, and collaborative live sessions.
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="glass-card p-8 rounded-[24px] space-y-4 bg-white/50 dark:bg-slate-950/20 border border-white dark:border-slate-850"
        >
          <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl text-purple-500 w-11 h-11 flex items-center justify-center">
            <Eye className="h-6 w-6" />
          </div>
          <h3 className="font-display text-xl font-extrabold text-slate-900 dark:text-white">Our Future Vision</h3>
          <p className="font-sans text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
            A future where education is completely decentralized and democratic. SkillSwap aims to be the universal digital credit log where anyone’s verified teaching hours can be spent to buy lessons in return. No barriers, absolute equality.
          </p>
        </motion.div>
      </motion.div>

      {/* Core Values Section */}
      <div className="space-y-10">
        <motion.div variants={itemVariants} className="space-y-2">
          <h2 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">Platform Core Pillars</h2>
          <p className="font-sans text-slate-500 dark:text-slate-400 text-xs">These direct values guide the design mechanics and feature logic of our platform.</p>
        </motion.div>

        <motion.div 
          variants={containerVariants} 
          className="grid sm:grid-cols-2 gap-6"
        >
          {coreValues.map((val, idx) => {
            const Icon = val.icon;
            return (
              <motion.div 
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                key={idx} 
                className="flex gap-4 p-5 rounded-2xl glass-card hover:bg-white/75 dark:hover:bg-slate-800/70 transition-all bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm border border-white dark:border-slate-800"
              >
                <div className={`p-3 rounded-xl ${val.color} dark:bg-slate-800/60 shrink-0 w-11 h-11 flex items-center justify-center`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-sm font-bold text-slate-800 dark:text-slate-200">{val.title}</h4>
                  <p className="font-sans text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">{val.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Barter Flow Diagram Graphic */}
      <motion.div 
        variants={itemVariants}
        className="p-8 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white dark:border-slate-850 space-y-8 shadow-lg"
      >
        <h3 className="font-display text-lg font-bold text-center text-slate-800 dark:text-white animate-pulse">
          Interactive Swap Loop Architecture
        </h3>

        <div className="grid sm:grid-cols-3 gap-6 relative">
          {/* Step 1 */}
          <motion.div whileHover={{ scale: 1.025 }} className="glass-card p-6 rounded-2xl text-center space-y-3 bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center mx-auto shadow">1</div>
            <h4 className="text-sm font-bold font-display text-slate-800 dark:text-white">Define & Tag</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
              List the skills you have mastered to teach, and tags you are curious to learn.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div whileHover={{ scale: 1.025 }} className="glass-card p-6 rounded-2xl text-center space-y-3 bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-cyan-500 text-white font-extrabold text-xs flex items-center justify-center mx-auto shadow">2</div>
            <h4 className="text-sm font-bold font-display text-slate-800 dark:text-white">Synchronous Exchange</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
              Open chat rooms. Run a session via external links and barter knowledge at 1:1.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div whileHover={{ scale: 1.025 }} className="glass-card p-6 rounded-2xl text-center space-y-3 bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white font-extrabold text-xs flex items-center justify-center mx-auto shadow">3</div>
            <h4 className="text-sm font-bold font-display text-slate-800 dark:text-white">Unlock Achievements</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
              Receive star reviews from learners to boost your Reputation Level rank automatically.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Milestones / Roadmaps */}
      <div className="space-y-8">
        <motion.div variants={itemVariants} className="flex gap-2 items-center">
          <Milestone className="h-5 w-5 text-indigo-500 animate-bounce" />
          <h2 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">Platform Milestones</h2>
        </motion.div>

        <motion.div 
          variants={containerVariants} 
          className="space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-6"
        >
          {milestones.map((m, index) => (
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              key={index} 
              className="p-6 glass-card rounded-2xl relative space-y-2 shadow-sm text-left bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm border border-white dark:border-slate-800"
            >
              <span className="text-2xl font-black text-blue-500 dark:text-blue-400 font-display block">{m.year}</span>
              <h4 className="font-display text-sm font-bold text-slate-800 dark:text-slate-200">{m.title}</h4>
              <p className="font-sans text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">{m.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

