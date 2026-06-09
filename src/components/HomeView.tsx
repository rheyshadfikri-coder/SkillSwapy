/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Code, Palette, Zap, Cpu, Users, GraduationCap, Star, ShieldCheck, Heart, Coffee } from 'lucide-react';
import { motion } from 'motion/react';
import { POPULAR_CATEGORIES } from '../data/initialData';
import { User } from '../types';

interface HomeViewProps {
  onNavigate: (page: string) => void;
  onExploreSkill: (skillQuery: string) => void;
  popularMentors: User[];
  onSelectMentor: (mentorId: string) => void;
}

export default function HomeView({ onNavigate, onExploreSkill, popularMentors, onSelectMentor }: HomeViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Active Learners', value: '42,000+', icon: Users, color: 'text-blue-500' },
    { label: 'Skills Exchanged', value: '185,000+', icon: Zap, color: 'text-cyan-500' },
    { label: 'Expert Mentors', value: '3,800+', icon: GraduationCap, color: 'text-purple-500' },
    { label: 'Cooperative Rating', value: '4.92/5', icon: Star, color: 'text-yellow-500' }
  ];

  const featuredSkills = [
    'React State Hydration',
    'Figma Design Systems',
    'Python Web Crawling',
    '3D Blender Modeling',
    'Growth Copywriting',
    'SQL Query Optimization',
    'Docker Containerization',
    'TypeScript Architecture'
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'UCLA Design Sophomore',
      quote: 'I spent years studying static design layouts online, but in just three sessions on SkillSwap with an experienced software engineer, I learned how to style responsive mobile-first grids perfectly!',
      color: 'border-blue-200'
    },
    {
      name: 'Liam Chen',
      role: 'Self-taught Back-end Dev',
      quote: 'I taught SQL database partitioning to a video editor, and she helped me edit a beautiful YouTube portfolio video that got me scouted by a top EdTech startup. Bartering works!',
      color: 'border-purple-200'
    }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onExploreSkill(searchQuery);
    } else {
      onNavigate('explore');
    }
  };

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-24 pb-20 overflow-hidden"
    >
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto pt-12 px-4 space-y-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-[#60A5FA]/10 border border-[#60A5FA]/20 px-4 py-1.5 rounded-full text-[#60A5FA] text-xs font-bold uppercase tracking-wider shadow-sm animate-float"
        >
          <span className="w-2 h-2 bg-[#60A5FA] rounded-full animate-pulse shrink-0"></span>
          <span>New: Collaborative Sessions Live</span>
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
          className="font-display text-5xl sm:text-[72px] font-extrabold tracking-tight text-[#0F172A] dark:text-white leading-[0.95]"
        >
          Trade Your Skills.<br className="hidden sm:inline" />
          <span className="text-gradient-liquid">Learn Together.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-sans text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          The futuristic collaborative platform where knowledge is currency. Connect with ambitious college peers and mentors around the globe to teach what you love, master what you need.
        </motion.p>

        {/* Search Bar */}
        <motion.form 
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSearchSubmit} 
          className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white dark:border-slate-800 shadow-xl"
        >
          <input
            type="text"
            placeholder="What skill do you want to master today? (e.g. Figma, Python...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 py-3 px-4 font-sans text-sm rounded-xl bg-transparent focus:outline-none placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-slate-100"
            id="searchInput"
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="px-8 py-3.5 font-display text-sm font-bold text-white bg-gradient-to-r from-[#60A5FA] via-[#C4B5FD] to-[#67E8F9] rounded-2xl shadow-xl shadow-blue-200/50 hover:shadow-cyan-200 transition-all outline-none flex items-center justify-center gap-1.5 cursor-pointer"
            id="searchBtn"
          >
            Explore Skills
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.form>

        {/* Speed tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto pt-2">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Trending:</span>
          {['Figma UI', 'Python Scraper', 'TypeScript', 'Blender 3D'].map((tag, idx) => (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + idx * 0.05 }}
              whileHover={{ scale: 1.08 }}
              key={tag}
              onClick={() => onExploreSkill(tag)}
              className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-500 transition-colors text-xs text-slate-500 dark:text-slate-400 font-medium cursor-pointer"
            >
              #{tag}
            </motion.button>
          ))}
        </div>

        {/* Floating illustrations */}
        <div className="absolute top-1/2 left-0 -translate-x-12 -z-10 hidden lg:block animate-float">
          <div className="glass-panel p-4 rounded-2xl border border-white dark:border-slate-800 dark:bg-slate-900/60 shadow-xl flex items-center gap-3">
            <div className="p-3 bg-cyan-100 dark:bg-cyan-950/40 rounded-xl text-cyan-500">
              <Cpu className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium font-sans">Learn Coding</p>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-display">React Hooks</h4>
            </div>
          </div>
        </div>

        <div className="absolute top-1/3 right-0 translate-x-12 -z-10 hidden lg:block animate-float-delayed">
          <div className="glass-panel p-4 rounded-2xl border border-white dark:border-slate-800 dark:bg-slate-900/60 shadow-xl flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-950/40 rounded-xl text-purple-500">
              <Palette className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium font-sans">Learn Design</p>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-display">Typography Grid</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Block */}
      <motion.section variants={itemVariants} className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-3xl glass-panel border border-white/80 dark:border-slate-800 shadow-md">
          {stats.map((stat, i) => {
            const IconComponent = stat.icon;
            return (
              <div key={i} className="text-center space-y-2 border-r last:border-0 border-slate-100 dark:border-slate-800">
                <div className="flex justify-center">
                  <IconComponent className={`h-6 w-6 ${stat.color} p-0.5`} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">{stat.value}</h3>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase font-sans">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Popular Categories Grid */}
      <section className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">Explore Interactive Specialties</h2>
          <p className="font-sans text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Browse our major domains of cooperative learning. Click a group block to instantly explore matched users!
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {POPULAR_CATEGORIES.map((cat) => (
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.025, y: -4 }}
              whileTap={{ scale: 0.985 }}
              key={cat.id}
              onClick={() => onExploreSkill(cat.name)}
              className="group relative overflow-hidden rounded-2xl glass-card p-6 cursor-pointer transition-all duration-300 hover:bg-white/80 hover:border-blue-300/60 shadow-sm hover:shadow-xl"
            >
              <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${cat.color}`} />
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <h3 className="font-display text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold font-sans uppercase tracking-wider">
                    {cat.count} swaps currently live
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Mentors Showcase */}
      <section className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="flex flex-col sm:flex-row justify-between items-end gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-2">
            <h2 className="font-display text-3xl font-extrabold text-[#0F172A] dark:text-white">Highly Recommended Swappers</h2>
            <p className="font-sans text-slate-500 dark:text-slate-400">
              These students and mentors have outstanding reviews and high compatibility matches.
            </p>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 font-sans transition-colors cursor-pointer"
          >
            Show All Mentors
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <motion.div 
          variants={containerVariants}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {popularMentors.slice(0, 3).map((mentor) => (
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.025, y: -4 }}
              key={mentor.id}
              className="flex flex-col rounded-[24px] glass-card hover:bg-white/70 hover:border-purple-300/60 p-6 space-y-5 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={mentor.profileImage}
                  alt={mentor.username}
                  className="w-14 h-14 rounded-full border border-slate-200 object-cover shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display text-base font-bold text-[#0F172A]">{mentor.username}</h3>
                    {mentor.reputationBadge && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-50 text-[10px] font-bold text-purple-600 border border-purple-100">
                        Level {mentor.level}
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-xs text-slate-400 font-medium">{mentor.title}</p>
                </div>
              </div>

              <p className="font-sans text-slate-605 text-xs line-clamp-3 leading-relaxed">
                {mentor.bio}
              </p>

              <div className="border-t border-dashed border-slate-150 pt-3 space-y-2 text-left">
                <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">TEACHES:</div>
                <div className="flex flex-wrap gap-1">
                  {mentor.skills.filter(s => s.type === 'teach').map((skill) => (
                    <span key={skill.id} className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between mt-auto">
                <div className="flex items-center text-yellow-500 font-display text-xs font-bold gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-500" />
                  <span>4.9</span>
                  <span className="text-slate-400 font-normal">({mentor.level * 3} talks)</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelectMentor(mentor.id)}
                  className="px-4 py-2 font-display text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-md hover:shadow-indigo-100 cursor-pointer"
                >
                  Send Message
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Barter Process / Immersive explanation */}
      <motion.section variants={itemVariants} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900/30 dark:to-slate-950/20 py-16 px-4 rounded-[42px] max-w-6xl mx-auto shadow-inner border border-white dark:border-slate-800/80">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase">
              <ShieldCheck className="h-4 w-4" />
              <span>How we bypass subscription fees</span>
            </div>
            <h2 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white leading-snug">
              An Intellectual Barter Ecosystem Designed for Students.
            </h2>
            <p className="font-sans text-slate-600 dark:text-slate-350 text-sm leading-relaxed">
              Think of it as structured learning buddies. It operates on mutual credit swapping. If you help Brandon code a React component, you earn 1 hour of visual design guidance in return. 
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/70 dark:bg-slate-900/60 backdrop-blur rounded-xl space-y-1 border border-white/40 dark:border-slate-800/50">
                <h4 className="text-base font-bold text-slate-800 dark:text-white font-display">1. Onboard Profiles</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">Publish your core Teach / Learn skill tags clearly.</p>
              </div>
              <div className="p-4 bg-white/70 dark:bg-slate-900/60 backdrop-blur rounded-xl space-y-1 border border-white/40 dark:border-slate-800/50">
                <h4 className="text-base font-bold text-slate-800 dark:text-white font-display">2. Match System</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">Our engine outputs compatibility matching ratings.</p>
              </div>
              <div className="p-4 bg-white/70 dark:bg-slate-900/60 backdrop-blur rounded-xl space-y-1 border border-white/40 dark:border-slate-800/50">
                <h4 className="text-base font-bold text-slate-800 dark:text-white font-display">3. Chat & Meet</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">Coordinate and carry out interactive video talks together.</p>
              </div>
              <div className="p-4 bg-white/70 dark:bg-slate-900/60 backdrop-blur rounded-xl space-y-1 border border-white/40 dark:border-slate-800/50">
                <h4 className="text-base font-bold text-slate-800 dark:text-white font-display">4. Reviews & XP</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">Gather star feedbacks and earn reputational badges.</p>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center">
            {/* Conceptual UI graphic */}
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="w-full max-w-sm rounded-[32px] glass-panel border border-white p-6 shadow-2xl relative"
            >
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md animate-float">
                <Coffee className="h-3.5 w-3.5" />
                <span>100% Free swaps</span>
              </div>

              <div className="space-y-4 font-sans">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</div>
                  <div className="text-left text-xs">
                    <p className="font-semibold text-slate-800">Chloe Smith teaches:</p>
                    <p className="text-slate-500">Copywriting, Cinema Editing</p>
                  </div>
                </div>

                <div className="flex justify-center my-1 text-slate-455">
                  <Zap className="h-6 w-6 text-teal-400 animate-pulse fill-teal-400" />
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">2</div>
                  <div className="text-left text-xs">
                    <p className="font-semibold text-slate-800">Brandon Lee teaches:</p>
                    <p className="text-slate-500">Figma UI, Grid Architecture</p>
                  </div>
                </div>

                <div className="bg-teal-50 text-teal-700 text-xs font-medium p-3 rounded-xl border border-teal-100 text-center">
                  🔄 Compatible Core Score: <strong className="font-bold">96% perfect matches!</strong>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">Created by Students for Students</h2>
          <p className="font-sans text-slate-500 dark:text-slate-400">Real swap results from our peer learning directories.</p>
        </div>

        <motion.div 
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-6"
        >
          {testimonials.map((test, index) => (
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.015 }}
              key={index} 
              className="bg-white/40 dark:bg-slate-900/40 backdrop-blur p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-left space-y-4 shadow-sm"
            >
              <div className="flex gap-1 text-yellow-400">
                {[1,2,3,4,5].map((s) => <Star key={s} className="h-4 w-4 fill-yellow-400" />)}
              </div>
              <p className="font-sans text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">
                "{test.quote}"
              </p>
              <div>
                <h4 className="font-display text-sm font-bold text-slate-800 dark:text-white">{test.name}</h4>
                <p className="font-sans text-xs text-slate-400 dark:text-slate-500">{test.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Final Call to Action */}
      <motion.section variants={itemVariants} className="max-w-5xl mx-auto px-4">
        <div className="rounded-[36px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-200/20 rounded-full blur-2xl -ml-12 -mb-12" />

          <h2 className="font-display text-3.5xl sm:text-4xl font-extrabold tracking-tight">
            Stop Subscribing. Start Bartering.
          </h2>
          <p className="font-sans text-sm text-cyan-50 max-w-lg mx-auto">
            Ready to find your learning counterpart? Create your onboarding profile in 2 minutes and start connecting with matching students in real-time.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onNavigate('register')}
              className="px-6 py-3 bg-white text-blue-600 shadow-md font-display font-bold text-sm rounded-xl cursor-pointer"
            >
              Start Learning Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onNavigate('about')}
              className="px-6 py-3 bg-blue-700/30 text-white font-display text-sm font-bold rounded-xl border border-white/20 hover:bg-blue-700/50 transition-all outline-none cursor-pointer"
            >
              How Swapping Works
            </motion.button>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

