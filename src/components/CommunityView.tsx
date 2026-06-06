/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Users, Users2, MessageSquare, ThumbsUp, Sparkles, Plus, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DiscussionGroup, DiscussionPost, User } from '../types';

interface CommunityViewProps {
  groups: DiscussionGroup[];
  posts: DiscussionPost[];
  currentUser: User | null;
  onAddPost: (newPost: Omit<DiscussionPost, 'id' | 'timestamp' | 'likes' | 'comments'>) => void;
  onNavigate: (page: string) => void;
}

export default function CommunityView({ groups, posts, currentUser, onAddPost, onNavigate }: CommunityViewProps) {
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || 'g_1');
  const [newPostContent, setNewPostContent] = useState('');
  const [errorText, setErrorText] = useState('');
  const [localPosts, setLocalPosts] = useState<DiscussionPost[]>(posts);

  const activeGroup = groups.find(g => g.id === selectedGroupId);
  const activePosts = localPosts.filter(p => p.groupId === selectedGroupId);

  const handleLikePost = (postId: string) => {
    setLocalPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const liked = !post.likedByUser;
        return {
          ...post,
          likes: liked ? post.likes + 1 : post.likes - 1,
          likedByUser: liked
        };
      }
      return post;
    }));
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!currentUser) {
      setErrorText('You must be logged in to participate in discussion communities!');
      return;
    }

    if (!newPostContent.trim()) {
      setErrorText('Discussion message cannot be empty.');
      return;
    }

    const payload: DiscussionPost = {
      id: `post_${Date.now()}`,
      groupId: selectedGroupId,
      userId: currentUser.id,
      username: currentUser.username,
      userImage: currentUser.profileImage,
      content: newPostContent.trim(),
      likes: 0,
      comments: 0,
      timestamp: 'Just now'
    };

    // Add to local state copy immediately for real-time visual responsiveness
    setLocalPosts([payload, ...localPosts]);
    
    // Call top-level state builder
    onAddPost({
      groupId: selectedGroupId,
      userId: currentUser.id,
      username: currentUser.username,
      userImage: currentUser.profileImage,
      content: newPostContent.trim(),
    });

    setNewPostContent('');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 24, stiffness: 200 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-12 pb-20 text-left max-w-6xl mx-auto px-4"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/45 border border-blue-100 dark:border-blue-900 text-xs font-bold text-blue-600 dark:text-blue-400">
          <Users className="h-3.5 w-3.5 animate-pulse" />
          <span>Active Learning Circles</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Peer-to-Peer Discussion Forums
        </h1>
        <p className="font-sans text-slate-400 dark:text-slate-450 max-w-2xl text-xs sm:text-sm">
          Discuss code errors, share UI portfolios, look for study squads, and grow your startup network together.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Forums list & navigation */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-4 font-display">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Discussion Circles ({groups.length})
          </h3>
          <div className="space-y-2">
            {groups.map((g) => (
              <motion.button
                whileHover={{ scale: 1.018 }}
                whileTap={{ scale: 0.985 }}
                key={g.id}
                onClick={() => setSelectedGroupId(g.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all duration-150 relative cursor-pointer block ${
                  selectedGroupId === g.id
                    ? 'border-blue-300/70 dark:border-blue-900 bg-white/75 dark:bg-slate-900/80 backdrop-blur-md shadow-md'
                    : 'border-slate-150/50 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/20 hover:bg-white/60 dark:hover:bg-slate-800/45 hover:border-slate-300 dark:hover:border-slate-705 backdrop-blur-sm'
                }`}
              >
                {selectedGroupId === g.id && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#60A5FA] to-[#C4B5FD] rounded-l-2xl" 
                  />
                )}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-800 dark:text-white">
                      {g.name}
                    </span>
                  </div>
                  <p className="font-sans text-[11px] text-slate-400 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
                    {g.description}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-bold uppercase py-0.5 px-1.5 rounded bg-blue-105/10 dark:bg-blue-950/40 text-[#60A5FA] border border-[#60A5FA]/20">
                      #{g.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-sans font-medium text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-850/40 px-2 py-0.5 rounded border border-white/60 dark:border-slate-800/50">
                      <Users2 className="h-3 w-3 stroke-[2.5]" />
                      {g.membersCount} students
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Active circle chat/posts */}
        <div className="lg:col-span-8 space-y-6">
          {activeGroup && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              key={activeGroup.id}
              className="p-6 rounded-[28px] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-slate-800 space-y-2 shadow-lg"
            >
              <span className="text-[10px] font-bold uppercase text-[#60A5FA] tracking-wider block">Active Circle Room</span>
              <h2 className="font-display text-xl font-extrabold text-[#0F172A] dark:text-white">{activeGroup.name}</h2>
              <p className="font-sans text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{activeGroup.description}</p>
            </motion.div>
          )}

          {/* Create new post block */}
          <motion.div variants={itemVariants} className="p-6 rounded-[28px] glass-card space-y-4 shadow-lg bg-white/60 dark:bg-slate-900/60 border border-white dark:border-slate-800">
            <h4 className="font-display text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-cyan-500" />
              <span>Contribute a Public Post</span>
            </h4>

            <form onSubmit={handleSubmitPost} className="space-y-3">
              <textarea
                placeholder="Ask query, share design assets, or suggest study links (e.g. 'Can someone review my Figma layout?')..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full h-24 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-[#0A0F1D] text-xs font-sans text-slate-800 dark:text-white focus:outline-none focus:border-blue-400 dark:focus:border-blue-900"
                id="postInputBox"
              />

              {errorText && (
                <div className="flex gap-1.5 text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-950/30 p-2.5 rounded-lg border border-red-150 dark:border-red-900/30">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>{errorText}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-1 animate-fade-in font-display">
                {currentUser ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={currentUser.profileImage}
                      alt={currentUser.username}
                      className="w-7 h-7 rounded-full object-cover shadow-sm border border-slate-200 dark:border-slate-700"
                    />
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{currentUser.username}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    👉 Sign in to activate direct forums
                  </button>
                )}

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="px-5 py-2.5 bg-[#0F172A] dark:bg-slate-850 text-white font-semibold text-xs rounded-xl flex items-center gap-1 hover:bg-slate-800 transition shadow cursor-pointer text-center"
                >
                  <Plus className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>Post in Circle</span>
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Active posts list */}
          <div className="space-y-4">
            <h3 className="font-display text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Circle Timeline ({activePosts.length} posts)
            </h3>

            <AnimatePresence mode="popLayout">
              {activePosts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center p-10 bg-white/20 dark:bg-slate-900/20 backdrop-blur-sm rounded-2xl border border-dashed border-slate-200 dark:border-slate-800"
                >
                  <p className="font-sans text-xs text-slate-400 dark:text-slate-500">Be the first to post inside this circle!</p>
                </motion.div>
              ) : (
                activePosts.map((post) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 210 }}
                    key={post.id}
                    className="p-6 glass-card hover:bg-white/70 dark:hover:bg-slate-900/70 hover:border-blue-300/40 dark:hover:border-blue-900/40 rounded-[28px] space-y-4 text-left border border-white/60 dark:border-slate-800 shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <img
                          src={post.userImage}
                          alt={post.username}
                          className="w-10 h-10 rounded-full object-cover border border-slate-100 dark:border-slate-800 shadow-sm animate-float"
                          referrerPolicy="no-referrer"
                        />
                        <div className="text-left font-display">
                          <h4 className="text-sm font-bold text-slate-800 dark:text-white">{post.username}</h4>
                          <p className="font-sans text-[10px] text-slate-400 dark:text-slate-550">{post.timestamp}</p>
                        </div>
                      </div>
                    </div>

                    <p className="font-sans text-slate-600 dark:text-slate-300 text-xs leading-relaxed whitespace-pre-wrap text-left font-medium">
                      {post.content}
                    </p>

                    <div className="flex items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-sans">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleLikePost(post.id)}
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide transition cursor-pointer px-2 py-1 rounded-md ${
                          post.likedByUser ? 'text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40 font-bold border border-blue-105 dark:border-blue-900/50' : 'hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <ThumbsUp className={`h-3.5 w-3.5 ${post.likedByUser ? 'fill-blue-500 text-blue-600' : ''}`} />
                        <span>{post.likes} Likes</span>
                      </motion.button>

                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 select-none">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{post.comments} Comment threads</span>
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
