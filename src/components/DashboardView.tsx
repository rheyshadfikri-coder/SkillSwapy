/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, CheckCircle, Zap, Users, GraduationCap, Star, BookOpen, Clock, Sparkles, MessageSquare } from 'lucide-react';
import { User, Session, Achievement, Skill, Review } from '../types';
import { ALL_ACHIEVEMENTS } from '../data/initialData';
import ReviewModal from './ReviewModal';

interface DashboardViewProps {
  currentUser: User;
  users: User[];
  sessions: Session[];
  reviews: Review[];
  onAddReview: (review: Review) => void;
  onSelectMentor: (mentorId: string) => void;
  onUpdateSessions: (updated: Session[]) => void;
  onNavigate: (page: string) => void;
}

export default function DashboardView({ 
  currentUser, 
  users, 
  sessions, 
  reviews,
  onAddReview,
  onSelectMentor,
  onUpdateSessions,
  onNavigate
}: DashboardViewProps) {
  const [successBanner, setSuccessBanner] = useState('');
  const [reviewingSession, setReviewingSession] = useState<Session | null>(null);
  const [reviewingPartner, setReviewingPartner] = useState<User | null>(null);

  // Filter reviews written for this specific user node
  const userReviews = reviews.filter(r => r.reviewedUserId === currentUser.id);
  const averageRating = userReviews.length > 0 
    ? (userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(2)
    : '5.00';

  // 1. Filter sessions relating directly to current user log
  const userSessions = sessions.filter(s => s.learnerId === currentUser.id || s.mentorId === currentUser.id);

  const getPartnerName = (session: Session) => {
    const partnerId = session.learnerId === currentUser.id ? session.mentorId : session.learnerId;
    const partner = users.find(u => u.id === partnerId);
    return partner ? partner.username : 'Unknown node';
  };

  const handleSessionAction = (sessionId: string, newStatus: 'completed' | 'cancelled') => {
    const updated = sessions.map(s => {
      if (s.id === sessionId) {
        return { ...s, status: newStatus };
      }
      return s;
    });

    onUpdateSessions(updated);
    if (newStatus === 'completed') {
      setSuccessBanner('Session marked complete! +150 XP rewarded.');
      currentUser.xp += 150; // increment demo XP
      
      const targetSession = sessions.find(s => s.id === sessionId);
      if (targetSession) {
        const partnerId = targetSession.learnerId === currentUser.id ? targetSession.mentorId : targetSession.learnerId;
        const partner = users.find(u => u.id === partnerId);
        if (partner) {
          setReviewingSession({ ...targetSession, status: 'completed' });
          setReviewingPartner(partner);
        }
      }
    } else {
      setSuccessBanner('Session successfully cancelled.');
    }
    setTimeout(() => setSuccessBanner(''), 4500);
  };

  // 2. Skill Matcher - Match algorithm!
  // Compares currentUser skills against other users' teaching and learning lists
  const computeMatchScore = (otherUser: User): number => {
    let score = 50; // base score

    const myTeaches = currentUser.skills.filter(s => s.type === 'teach').map(s => s.name.toLowerCase());
    const myLearns = currentUser.skills.filter(s => s.type === 'learn').map(s => s.name.toLowerCase());

    const otherTeaches = otherUser.skills.filter(s => s.type === 'teach').map(s => s.name.toLowerCase());
    const otherLearns = otherUser.skills.filter(s => s.type === 'learn').map(s => s.name.toLowerCase());

    // Rule A: What I want to learn is what they teach
    myLearns.forEach(learnSkill => {
      otherTeaches.forEach(teachSkill => {
        if (teachSkill.includes(learnSkill) || learnSkill.includes(teachSkill)) {
          score += 25;
        }
      });
    });

    // Rule B: What they want to learn is what I teach
    otherLearns.forEach(learnSkill => {
      myTeaches.forEach(teachSkill => {
        if (teachSkill.includes(learnSkill) || learnSkill.includes(teachSkill)) {
          score += 20;
        }
      });
    });

    // Rule C: Category overlap
    const myInterestsSet = new Set(currentUser.interests.map(i => i.toLowerCase()));
    otherUser.interests.forEach(interest => {
      if (myInterestsSet.has(interest.toLowerCase())) {
        score += 5;
      }
    });

    return Math.min(score, 99); // max score is 99%
  };

  const matchRecommendations = users
    .filter(u => u.id !== currentUser.id)
    .map(u => ({
      user: u,
      score: computeMatchScore(u)
    }))
    .sort((a,b) => b.score - a.score);

  return (
    <div className="space-y-8 pb-20 text-left max-w-6xl mx-auto px-4">
      {/* Banner message */}
      {successBanner && (
        <div className="p-4 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 shadow-sm flex items-center gap-2">
          <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Grid: Header of user node */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-white dark:bg-slate-900 border border-slate-150/85 dark:border-slate-800 rounded-3xl shadow-sm gap-4">
        <div className="flex gap-4 items-center">
          <img
            src={currentUser.profileImage}
            alt={currentUser.username}
            className="w-16 h-16 rounded-full border-2 border-blue-200 object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="text-left space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">{currentUser.username}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[10px] font-bold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 uppercase tracking-wider">
                Level {currentUser.level} Node
              </span>
            </div>
            <p className="font-sans text-xs text-slate-400 dark:text-slate-500 font-medium">{currentUser.title || 'Collaborative member'}</p>
          </div>
        </div>

        {/* XP Progress meter */}
        <div className="w-full sm:w-60 space-y-1.5 self-stretch sm:self-center flex flex-col justify-end">
          <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <span>Experience Metrics</span>
            <span className="text-slate-700 dark:text-slate-300 font-bold">{currentUser.xp} XP</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all rounded-full" 
              style={{ width: `${Math.min((currentUser.xp % 1000) / 10, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 text-right">
            {(1000 - (currentUser.xp % 1000))} XP left to level {currentUser.level + 1}
          </p>
        </div>
      </div>

      {/* Grid: Key Stats summaries */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-800 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 dark:text-blue-400">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
              {currentUser.skills.filter(s => s.type === 'teach').length}
            </h3>
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Teaching Skills</p>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-800 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-500 dark:text-purple-400">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
              {currentUser.skills.filter(s => s.type === 'learn').length}
            </h3>
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Learning Targets</p>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-800 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-500 dark:text-cyan-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
              {userSessions.filter(s => s.status === 'completed').length}
            </h3>
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Swaps Completed</p>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-800 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-950/30 text-yellow-500 dark:text-yellow-400">
            <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-500" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">{averageRating}</h3>
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Reputation Grade</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Session schedule & matcher */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section A: Ongoing Cooperative Sessions */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-150/85 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-50 dark:border-slate-800">
              <h3 className="font-display text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="h-4.5 w-4.5 text-blue-500" />
                <span>Ongoing Cooperative Sessions</span>
              </h3>
              <span className="text-slate-400 dark:text-slate-500 text-xs font-sans tracking-tight">Active Agenda</span>
            </div>

            {userSessions.length === 0 ? (
              <div className="text-center p-8 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-400 dark:text-slate-450 font-sans leading-relaxed">
                  No active session dates scheduled. Explore other students' teach tags to schedule a talk now!
                </p>
                <button
                  onClick={() => onNavigate('explore')}
                  className="mt-3 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg text-[11px] shadow hover:bg-blue-600 transition cursor-pointer"
                >
                  Find a Partner
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {userSessions.map((session) => {
                  const partnerId = session.learnerId === currentUser.id ? session.mentorId : session.learnerId;
                  const partner = users.find(u => u.id === partnerId);
                  const hasSubmittedReview = reviews.some(r => r.reviewerId === currentUser.id && r.reviewedUserId === partnerId);

                  return (
                    <div
                      key={session.id}
                      className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div className="text-left space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                            session.learnerId === currentUser.id ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400' : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                          }`}>
                            {session.learnerId === currentUser.id ? 'STUDYING' : 'TEACHING'}
                          </span>
                          <h4 className="font-display text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">
                            {session.skillName}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-505 font-sans">
                          Partner node: <strong className="font-semibold text-slate-600 dark:text-slate-400">{getPartnerName(session)}</strong>
                        </p>
                        <p className="text-[11px] text-slate-405 dark:text-slate-500">
                          Scheduled: <strong className="font-semibold text-slate-750 dark:text-slate-350">{session.scheduledTime}</strong> ({session.duration} mins)
                        </p>
                      </div>

                      {/* Status badge or Action keys */}
                      <div className="flex gap-2 shrink-0 self-stretch sm:self-center justify-end items-center">
                        {session.status === 'ongoing' || session.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleSessionAction(session.id, 'completed')}
                              className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg text-[11px] font-bold border border-emerald-150 dark:border-emerald-900 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition cursor-pointer"
                            >
                              Mark Finished
                            </button>
                            <button
                              onClick={() => handleSessionAction(session.id, 'cancelled')}
                              className="px-3 py-1.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-lg text-[11px] font-bold border border-red-150 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-900/40 transition cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                              session.status === 'completed' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-550'
                            }`}>
                              {session.status}
                            </span>
                            {session.status === 'completed' && partner && (
                              hasSubmittedReview ? (
                                <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-950/30 px-2 py-1 rounded-lg border border-yellow-200 dark:border-yellow-900/35 text-yellow-600 dark:text-yellow-400">
                                  <Star className="h-3 w-3 fill-yellow-400 stroke-yellow-500 animate-pulse" />
                                  <span className="text-[10px] font-extrabold tracking-tight">Reviewed</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setReviewingSession(session);
                                    setReviewingPartner(partner);
                                  }}
                                  className="px-2.5 py-1 bg-yellow-500 hover:bg-yellow-600 text-white dark:text-slate-900 rounded-lg text-[10px] font-extrabold shadow-sm hover:shadow-yellow-500/25 transition-all duration-150 flex items-center gap-1 cursor-pointer select-none"
                                >
                                  <Star className="h-3 w-3 fill-white dark:fill-slate-900 stroke-none" />
                                  <span>Rate Partner</span>
                                </button>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section B: Dynamic Skill Matcher Algorithms */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-150/85 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-50 dark:border-slate-800">
              <h3 className="font-display text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-cyan-500 animate-pulse" />
                <span>AI Skill Matcher Compatibility Diagnostics</span>
              </h3>
              <span className="text-[10px] font-bold uppercase py-0.5 px-1.5 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-405 rounded">Live Calculations</span>
            </div>

            <p className="font-sans text-xs text-slate-400 dark:text-slate-450 leading-relaxed">
              Based on your teach and learn parameters, our engine has determined compatibility scores with these available peer nodes:
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {matchRecommendations.slice(0, 4).map(({ user, score }) => (
                <div
                  key={user.id}
                  className="rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/50 p-4 relative flex flex-col justify-between space-y-4"
                >
                  <div className="absolute top-3 right-3 rounded-full bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-155 dark:border-cyan-900 text-[10px] font-black font-display text-cyan-600 dark:text-cyan-400 py-1 px-2">
                    {score}% Match
                  </div>

                  <div className="text-left space-y-2">
                    <div className="flex gap-3 items-center">
                      <img
                        src={user.profileImage}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-100 dark:border-slate-800"
                        referrerPolicy="no-referrer"
                      />
                      <div className="text-left">
                        <h4 className="font-display text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">{user.username}</h4>
                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">Level {user.level} Node</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs font-sans text-slate-500">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Teaches:</p>
                      <div className="flex flex-wrap gap-1">
                        {user.skills.filter(s => s.type === 'teach').map(s => (
                          <span key={s.id} className="text-[9px] font-bold text-blue-600 dark:text-[#60A5FA] bg-blue-50/70 dark:bg-blue-950/40 px-1.5 py-0.5 rounded">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectMentor(user.id)}
                    className="w-full py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-display text-[11px] font-bold rounded-xl shadow transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Connect Chat Room</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column: Achievements & unlocked rewards */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-150/85 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-display text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 dark:border-slate-800 pb-2">
              <Award className="h-4.5 w-4.5 text-purple-600" />
              <span>Unlocked Milestones</span>
            </h3>

            <div className="space-y-3">
              {ALL_ACHIEVEMENTS.map((ach) => {
                // mock unlocks if XP values allow index checks
                const isUnlocked = currentUser.xp > (ach.id === 'ach_1' ? 100 : ach.id === 'ach_2' ? 500 : ach.id === 'ach_3' ? 2000 : 4000);
                return (
                  <div
                    key={ach.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left ${
                      isUnlocked 
                        ? 'bg-purple-50/40 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900 text-slate-850 dark:text-slate-200'
                        : 'bg-slate-50/55 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-60'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isUnlocked ? 'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-550'
                    }`}>
                      <Award className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-display text-xs font-bold leading-tight">{ach.title}</h4>
                      <p className="font-sans text-[10px] text-slate-400 dark:text-slate-500 leading-normal">{ach.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {reviewingSession && reviewingPartner && (
        <ReviewModal
          isOpen={!!reviewingSession}
          onClose={() => {
            setReviewingSession(null);
            setReviewingPartner(null);
          }}
          session={reviewingSession}
          partner={reviewingPartner}
          currentUser={currentUser}
          onAddReview={onAddReview}
        />
      )}
    </div>
  );
}
