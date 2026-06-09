/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Search, Filter, Compass, Star, MapPin, Sparkles, MessageSquare, Briefcase, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../types';

interface ExploreViewProps {
  users: User[];
  currentUserId?: string | null;
  onSelectMentor: (mentorId: string) => void;
  prefilledSearch?: string;
  onClearPrefilledSearch?: () => void;
  onNavigate?: (page: string) => void;
}

export default function ExploreView({ 
  users, 
  currentUserId, 
  onSelectMentor, 
  prefilledSearch = '',
  onClearPrefilledSearch,
  onNavigate
}: ExploreViewProps) {
  const [search, setSearch] = useState(prefilledSearch);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'coding', name: 'Software Development' },
    { id: 'design', name: 'UI/UX Design' },
    { id: 'marketing', name: 'Digital Growth' },
    { id: 'writing', name: 'Content & Writing' },
    { id: 'languages', name: 'Languages & Speech' }
  ];

  // Sync with initial prefilled searches from the main home view
  useEffect(() => {
    if (prefilledSearch) {
      setSearch(prefilledSearch);
    }
  }, [prefilledSearch]);

  const handleClear = () => {
    setSearch('');
    if (onClearPrefilledSearch) {
      onClearPrefilledSearch();
    }
  };

  const filteredUsers = users.filter((u) => {
    // Keep current user in the searchable pool so they can verify their live database status

    // Search query matches username, bio, title, or any skill names
    const searchMatch = 
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.bio.toLowerCase().includes(search.toLowerCase()) ||
      (u.title && u.title.toLowerCase().includes(search.toLowerCase())) ||
      u.skills.some(s => s.name.toLowerCase().includes(search.toLowerCase()));

    // Filter by specific Category tags inside skills
    const categoryMatch = selectedCategory === 'all' || (() => {
      if (selectedCategory === 'coding') {
        return u.skills.some(s => 
          s.name.toLowerCase().includes('python') || 
          s.name.toLowerCase().includes('react') || 
          s.name.toLowerCase().includes('node') || 
          s.name.toLowerCase().includes('typescript') || 
          s.name.toLowerCase().includes('sql') || 
          s.name.toLowerCase().includes('development') || 
          s.name.toLowerCase().includes('scraper') || 
          s.name.toLowerCase().includes('autom')
        );
      }
      if (selectedCategory === 'design') {
        return u.skills.some(s => 
          s.name.toLowerCase().includes('figma') || 
          s.name.toLowerCase().includes('design') || 
          s.name.toLowerCase().includes('typography') || 
          s.name.toLowerCase().includes('3d') || 
          s.name.toLowerCase().includes('blender')
        );
      }
      if (selectedCategory === 'marketing') {
        return u.skills.some(s => 
          s.name.toLowerCase().includes('brand') || 
          s.name.toLowerCase().includes('marketing') || 
          s.name.toLowerCase().includes('growth')
        );
      }
      if (selectedCategory === 'writing') {
        return u.skills.some(s => 
          s.name.toLowerCase().includes('copywriter') || 
          s.name.toLowerCase().includes('copywriting') || 
          s.name.toLowerCase().includes('writing') || 
          s.name.toLowerCase().includes('novel')
        );
      }
      if (selectedCategory === 'languages') {
        return u.skills.some(s => 
          s.name.toLowerCase().includes('speak') || 
          s.name.toLowerCase().includes('language') || 
          s.name.toLowerCase().includes('presentation')
        );
      }
      return true;
    })();

    // Filter by expertise level of teachings
    const levelMatch = selectedLevel === 'all' || u.skills.some(s => s.type === 'teach' && s.level === selectedLevel);

    return searchMatch && categoryMatch && levelMatch;
  });

  const trendingSkills = ['Figma UI', 'Python Scraper', 'TypeScript', 'Blender 3D Modeling', 'AI Automation'];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 180 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-12 pb-20 text-left max-w-6xl mx-auto px-4"
    >
      {/* Page Header */}
      <motion.div variants={cardVariants} className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 text-xs font-bold text-blue-600 dark:text-blue-400">
          <Compass className="h-3.5 w-3.5" />
          <span>Universal Swapper Catalogue</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Find Your Perfect Learning Partner
        </h1>
        <p className="font-sans text-slate-500 dark:text-slate-400 max-w-2xl">
          Search skills to learn, find active mentors, and see who is willing to exchange knowledge in real-time. Contact them instantly.
        </p>
      </motion.div>

      {/* Filter and Search Bar Section */}
      <motion.div 
        variants={cardVariants}
        className="p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-slate-800 rounded-3xl space-y-4 shadow-xl"
      >
        <div className="flex flex-col md:flex-row gap-3">
          {/* Main search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search skill keywords, user bios, or locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-xl font-sans text-sm glass-input text-slate-800"
              id="exploreSearchInput"
            />
            {search && (
              <button 
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 px-1 py-0.5"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter 1: Categories */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-56 pl-10 pr-6 py-3 rounded-xl font-sans text-sm glass-input text-slate-700 dark:text-slate-300 appearance-none outline-none cursor-pointer border-none bg-white dark:bg-slate-800"
              id="categorySelector"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300">{c.name}</option>
              ))}
            </select>
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Filter 2: Level */}
          <div className="relative">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full md:w-48 pl-10 pr-6 py-3 rounded-xl font-sans text-sm glass-input text-slate-700 dark:text-slate-300 appearance-none outline-none cursor-pointer border-none bg-white dark:bg-slate-800"
              id="levelSelector"
            >
              <option value="all" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300">Any Tutor Level</option>
              <option value="expert" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300">Expert Only</option>
              <option value="intermediate" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300">Intermediate & up</option>
              <option value="beginner" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300">Beginner OK</option>
            </select>
            <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Popular Tags shortcuts */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100/50 dark:border-slate-800/50">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mr-2">Top Tags:</span>
          {trendingSkills.map((t) => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              key={t}
              onClick={() => setSearch(t)}
              className="px-3 py-1 rounded-full text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-150/70 dark:bg-slate-800/70 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-900 transition-all border border-transparent cursor-pointer"
            >
              {t}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Results Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-lg font-bold text-slate-800 dark:text-slate-200">
            Available Skill Swappers ({filteredUsers.length} matches)
          </h2>
          {search && (
            <button 
              onClick={handleClear}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Reset active filter
            </button>
          )}
        </div>

        {filteredUsers.length === 0 ? (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-16 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-slate-800 space-y-4"
          >
            <div className="inline-flex p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 mx-auto">
              <Compass className="h-8 w-8 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="font-display text-lg font-extrabold text-slate-800 dark:text-slate-200">No matched swappers found</h3>
            <p className="font-sans text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              We couldn't find anyone matching your exact combination. Try clearing your search keyword, selecting "All Categories", or broaden your scope.
            </p>
            <button
              onClick={handleClear}
              className="px-5 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-white font-semibold text-xs transition cursor-pointer"
            >
              Show All Users
            </button>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-6"
          >
            {filteredUsers.map((user) => (
              <motion.div
                variants={cardVariants}
                whileHover={{ scale: 1.018, y: -3 }}
                key={user.id}
                className="rounded-[28px] glass-card hover:bg-white/70 hover:border-blue-300/60 transition-all duration-300 p-6 flex flex-col space-y-6"
              >
                {/* User Info Header */}
                <div className="flex justify-between items-start gap-3">
                  <div className="flex gap-4">
                    <img
                      src={user.profileImage}
                      alt={user.username}
                      className="w-14 h-14 rounded-full border border-slate-100 object-cover shadow-sm animate-float"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1 text-left">
                      <div className="flex items-center flex-wrap gap-1.5">
                        <h3 className="font-display text-base font-extrabold text-[#0F172A] dark:text-white">{user.username}</h3>
                        <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-900 font-display">
                          Level {user.level}
                        </span>
                        {user.id === currentUserId && (
                          <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-250 dark:border-emerald-900 font-display">
                            Profil Anda
                          </span>
                        )}
                        {user.reputationBadge && (
                          <span className="px-2 py-0.5 text-[9px] font-extrabold bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-full border border-purple-100 dark:border-purple-900 uppercase tracking-wider font-sans">
                            {user.reputationBadge}
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-xs text-slate-400 dark:text-slate-500 font-semibold">{user.title}</p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 font-sans">
                        <MapPin className="h-3 w-3 inline text-slate-300 dark:text-slate-600" />
                        <span>{user.location || 'Distributed Global Node'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-950/30 px-2 py-1 rounded text-yellow-600 dark:text-yellow-400 font-display text-xs font-bold border border-yellow-101 dark:border-yellow-900/30">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 stroke-yellow-500" />
                    <span>4.9</span>
                  </div>
                </div>

                {/* Bio text */}
                <p className="font-sans text-slate-600 dark:text-slate-300 text-xs leading-relaxed text-left">
                  {user.bio}
                </p>

                {/* Divided skills grid (Teaches vs Learns) */}
                <div className="grid grid-cols-2 gap-4 border-t border-dashed border-slate-100 dark:border-slate-800 pt-4 text-left">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                      <GraduationCap className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
                      <span>TEACHES:</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {user.skills.filter(s => s.type === 'teach').map((skill) => (
                        <div key={skill.id} className="text-left">
                          <span className="inline-block text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-100/50 dark:border-blue-900/50">
                            {skill.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 border-l border-slate-100 dark:border-slate-800 pl-4">
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                      <Compass className="h-3.5 w-3.5 text-purple-400" />
                      <span>WANTS TO LEARN:</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {user.skills.filter(s => s.type === 'learn').map((skill) => (
                        <div key={skill.id} className="text-left">
                          <span className="inline-block text-xs font-bold text-purple-700 dark:text-purple-400 bg-purple-50/70 dark:bg-purple-950/40 px-2 py-0.5 rounded border border-purple-100/50 dark:border-purple-900/50">
                            {skill.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom connect bar */}
                <div className="pt-4 mt-auto border-t border-slate-100 dark:border-slate-805 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {user.interests.slice(0, 2).map((interest) => (
                      <span key={interest} className="text-[10px] font-medium text-slate-405 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        #{interest}
                      </span>
                    ))}
                  </div>

                  {user.id === currentUserId ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onNavigate && onNavigate('portfolio')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-display text-xs font-bold rounded-xl shadow cursor-pointer text-center border border-emerald-500/10"
                    >
                      <Briefcase className="h-3.5 w-3.5 text-emerald-250 shrink-0" />
                      <span>Bikin & Kelola Portofolio</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onSelectMentor(user.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-slate-900 to-indigo-950 text-white font-display text-xs font-semibold rounded-xl shadow cursor-pointer text-center"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      <span>Connect Now</span>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Suggested matchmaking banner for public catalog */}
      <motion.div 
        variants={cardVariants}
        className="p-8 rounded-3xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-900/60 dark:to-cyan-950/30 border border-cyan-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6"
      >
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-405 uppercase tracking-widest">
            <Sparkles className="h-4 w-4" />
            <span>Interactive Auto-Matching</span>
          </div>
          <h3 className="font-display text-xl font-extrabold text-slate-900 dark:text-white">
            Let our engine compute your compatibility stats
          </h3>
          <p className="font-sans text-xs text-slate-500 dark:text-slate-450 max-w-xl">
            Skip browsing altogether. By completing your onboarding, our algorithm matching code scores other users base on mutual alignment on skills and overlaps.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onSelectMentor('usr_alice')} // default demo trigger
          className="px-6 py-3 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-display font-bold text-sm shadow rounded-xl border border-blue-105 dark:border-slate-805 hover:shadow-md cursor-pointer shrink-0"
        >
          Check Compatibilities
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

