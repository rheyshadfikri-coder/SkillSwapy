/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Review } from '../types';
import { Star, ShieldAlert, Check, Globe, Github, Linkedin, Twitter, Sparkles, MessageCircle, Calendar, Clock } from 'lucide-react';

interface ProfileViewProps {
  currentUser: User;
  reviews: Review[];
  onUpdateUser: (updates: Partial<User>) => void;
}

export default function ProfileView({ currentUser, reviews, onUpdateUser }: ProfileViewProps) {
  const [bio, setBio] = useState(currentUser.bio || '');
  const [title, setTitle] = useState(currentUser.title || '');
  const [location, setLocation] = useState(currentUser.location || '');
  const [website, setWebsite] = useState(currentUser.socialLinks?.website || '');
  const [github, setGithub] = useState(currentUser.socialLinks?.github || '');
  const [linkedin, setLinkedin] = useState(currentUser.socialLinks?.linkedin || '');

  const [calendarEnabled, setCalendarEnabled] = useState(currentUser.calendarEnabled ?? true);
  const [availabilities, setAvailabilities] = useState<string[]>(currentUser.availabilities || []);

  const [success, setSuccess] = useState(false);

  // Filter reviews written for this specific user node
  const userReviews = reviews.filter(r => r.reviewedUserId === currentUser.id);

  const averageRating = userReviews.length > 0 
    ? (userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(2)
    : '5.00';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      bio,
      title,
      location,
      calendarEnabled,
      availabilities,
      socialLinks: {
        website,
        github,
        linkedin
      }
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-8 text-left">
      {/* Visual Title */}
      <div className="space-y-1">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
          Profile Settings Nodes
        </h1>
        <p className="font-sans text-xs text-slate-400">
          Modify your biography credentials, highlight social link structures, and track your reputational scorecards.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 flex items-center gap-2 shadow-sm">
          <Check className="h-4.5 w-4.5 text-emerald-500" />
          <span>Profile configuration updated successfully in local database files!</span>
        </div>
      )}

      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Left column: Editing Forms */}
        <form onSubmit={handleSave} className="md:col-span-8 bg-white border border-slate-150/70 p-6 rounded-3xl shadow-sm space-y-5">
          
          <h3 className="font-display text-sm font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">
            Configure Personal Credentials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 bg-transparent">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Campus tag</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Stanford University, CA"
                className="w-full p-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none"
                id="profUrlField"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Headline title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Python scripter and ML Tinkerer"
                className="w-full p-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none"
                id="profTitleField"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Editable biography</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about your specialties, schedules, what subjects you wish to tutor, and general guidelines..."
              className="w-full h-28 p-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none"
              id="profBioField"
            />
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-50 pb-1">
              Social Network Indices
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Globe className="h-3 w-3" /> External Link
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://behance.net"
                  className="w-full p-2 rounded-lg text-[11px] border border-slate-200 text-slate-600 focus:outline-none"
                  id="profWebField"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Github className="h-3 w-3" /> GitHub Repo
                </label>
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/profile"
                  className="w-full p-2 rounded-lg text-[11px] border border-slate-200 text-slate-600 focus:outline-none"
                  id="profGitField"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Linkedin className="h-3 w-3" /> LinkedIn Profile
                </label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in"
                  className="w-full p-2 rounded-lg text-[11px] border border-slate-200 text-slate-600 focus:outline-none"
                  id="profLinField"
                />
              </div>
            </div>
          </div>

          {/* Calendar Toggle & Weekly Planner */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Calendar Swap Settings
                </h4>
                <p className="text-[11px] text-slate-500 font-sans">
                  Enable learners to book time slots directly from your calendar availability.
                </p>
              </div>
              
              {/* Custom CSS Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                <input 
                  type="checkbox" 
                  checked={calendarEnabled} 
                  onChange={(e) => setCalendarEnabled(e.target.checked)}
                  className="sr-only peer" 
                  id="calendarTogglerCheck"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-slate-750 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                <span className="ml-2 text-xs font-semibold text-slate-700 min-w-[45px]">
                  {calendarEnabled ? 'Active' : 'Offline'}
                </span>
              </label>
            </div>

            {calendarEnabled && (
              <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-150/65 transition-all">
                <div className="flex items-center gap-1.5 pb-1 select-none">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-extrabold text-slate-700 uppercase tracking-tight">Available Weekly Slots</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pb-1">
                  Mark the times you are available to guide others. Click on slots to toggle eligibility. Selected: <strong className="text-blue-600 font-semibold">{availabilities.length}</strong>.
                </p>

                <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <div key={day} className="space-y-1.5 p-2 bg-white rounded-xl border border-slate-150/70 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest sm:w-20 shrink-0">{day}</span>
                      <div className="flex flex-wrap gap-1 md:flex-1">
                        {['09:00 - 11:00', '11:00 - 13:00', '13:00 - 15:00', '15:00 - 17:00', '17:00 - 19:00', '19:00 - 21:00'].map((slot) => {
                          const slotString = `${day} ${slot}`;
                          const isSelected = availabilities.includes(slotString);
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setAvailabilities(availabilities.filter(s => s !== slotString));
                                } else {
                                  setAvailabilities([...availabilities, slotString]);
                                }
                              }}
                              className={`px-2 py-1 rounded text-[10px] font-bold transition-all border shrink-0 cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-500 border-blue-600 text-white'
                                  : 'bg-slate-50 border-slate-150 text-slate-600 hover:bg-slate-100/80 hover:border-slate-250'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-900 border border-slate-800 text-white font-display text-xs font-bold rounded-xl shadow cursor-pointer hover:bg-slate-800 transition"
            id="profSaveBtn"
          >
            Save Configuration Changes
          </button>
        </form>

        {/* Right column: Reviews / Star reputations */}
        <div className="md:col-span-4 space-y-6">
          
          {/* Reputation Badge Card */}
          <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border border-slate-100 rounded-3xl text-left space-y-4">
            <div className="flex gap-1.5 items-center">
              <Sparkles className="h-4.5 w-4.5 text-cyan-600 animate-pulse" />
              <h4 className="font-display text-sm font-bold text-slate-800">Swapper Credentials</h4>
            </div>
            <div className="space-y-2 text-xs font-sans text-slate-600">
              <p>📍 Status: <strong className="font-bold">{currentUser.reputationBadge || 'Expert Node'}</strong></p>
              <p>⭐ Average Rating: <strong className="font-bold">{averageRating} / 5.00</strong></p>
              <p>🔥 Account Strength: <strong className="font-bold">100% Secure</strong></p>
            </div>
          </div>

          {/* User Reviews lists */}
          <div className="p-6 bg-white border border-slate-150/70 rounded-3xl space-y-4 shadow-sm">
            <h4 className="font-display text-xs font-extrabold uppercase text-slate-400 tracking-wider">
              Student Star Reviews ({userReviews.length})
            </h4>

            {userReviews.length === 0 ? (
              <p className="text-xs text-slate-400 font-sans italic">
                No session reviews recorded yet. Complete swaps with onboards to grow feedbacks list.
              </p>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {userReviews.map((rev) => (
                  <div key={rev.id} className="text-xs space-y-1.5 border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-0.5 text-yellow-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 stroke-yellow-500" />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400">{rev.timestamp}</span>
                    </div>
                    <p className="font-sans text-slate-500 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
