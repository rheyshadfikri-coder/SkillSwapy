/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Review } from '../types';
import { INITIAL_REVIEWS } from '../data/initialData';
import { Star, ShieldAlert, Check, Globe, Github, Linkedin, Twitter, Sparkles, MessageCircle } from 'lucide-react';

interface ProfileViewProps {
  currentUser: User;
  onUpdateUser: (updates: Partial<User>) => void;
}

export default function ProfileView({ currentUser, onUpdateUser }: ProfileViewProps) {
  const [bio, setBio] = useState(currentUser.bio || '');
  const [title, setTitle] = useState(currentUser.title || '');
  const [location, setLocation] = useState(currentUser.location || '');
  const [website, setWebsite] = useState(currentUser.socialLinks?.website || '');
  const [github, setGithub] = useState(currentUser.socialLinks?.github || '');
  const [linkedin, setLinkedin] = useState(currentUser.socialLinks?.linkedin || '');

  const [success, setSuccess] = useState(false);

  // Filter reviews written for this specific user node
  const userReviews = INITIAL_REVIEWS.filter(r => r.reviewedUserId === currentUser.id);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      bio,
      title,
      location,
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
              <p>⭐ Average Rating: <strong className="font-bold">4.92 / 5.0</strong></p>
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
