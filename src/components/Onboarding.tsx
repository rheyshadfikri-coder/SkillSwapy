/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sparkles, ArrowRight, Check, HelpCircle, User, Award, Plus, X } from 'lucide-react';
import { User as UserType, Skill } from '../types';

interface OnboardingProps {
  currentUser: UserType;
  onCompleteOnboarding: (updates: Partial<UserType>) => void;
  onNavigate: (page: string) => void;
}

export default function Onboarding({ currentUser, onCompleteOnboarding, onNavigate }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [title, setTitle] = useState(currentUser.title || '');
  const [location, setLocation] = useState(currentUser.location || 'Stanford, California');
  
  // Choose Avatar setup
  const avatars = [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  ];
  const [profileImage, setProfileImage] = useState(currentUser.profileImage || avatars[0]);

  // Skills states
  const [teachInput, setTeachInput] = useState('');
  const [learnInput, setLearnInput] = useState('');
  const [teachSkills, setTeachSkills] = useState<string[]>(['Figma wireframes', 'General HTML/CSS']);
  const [learnSkills, setLearnSkills] = useState<string[]>(['Node Express API', 'Python scrapers']);

  const handleAddTeach = () => {
    if (teachInput.trim() && !teachSkills.includes(teachInput.trim())) {
      setTeachSkills([...teachSkills, teachInput.trim()]);
      setTeachInput('');
    }
  };

  const handleAddLearn = () => {
    if (learnInput.trim() && !learnSkills.includes(learnInput.trim())) {
      setLearnSkills([...learnSkills, learnInput.trim()]);
      setLearnInput('');
    }
  };

  const handleRemoveTeach = (val: string) => {
    setTeachSkills(teachSkills.filter(v => v !== val));
  };

  const handleRemoveLearn = (val: string) => {
    setLearnSkills(learnSkills.filter(v => v !== val));
  };

  const handleFinish = () => {
    // Generate skill objects formatted for our system
    const mappedSkills: Skill[] = [
      ...teachSkills.map((name, i) => ({
        id: `sk_onb_t_${i}_${Date.now()}`,
        userId: currentUser.id,
        name,
        type: 'teach' as const,
        level: 'intermediate' as const
      })),
      ...learnSkills.map((name, i) => ({
        id: `sk_onb_l_${i}_${Date.now()}`,
        userId: currentUser.id,
        name,
        type: 'learn' as const,
        level: 'beginner' as const
      }))
    ];

    onCompleteOnboarding({
      bio,
      title,
      location,
      profileImage,
      skills: mappedSkills,
      interests: [...teachSkills.slice(0, 2), ...learnSkills.slice(0, 1)]
    });

    onNavigate('dashboard');
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4 text-left">
      {/* Onboarding steps indicator */}
      <div className="flex border-b border-slate-100 pb-5 justify-between items-center mb-8">
        <div>
          <h2 className="font-display text-xl font-extrabold text-slate-800">
            Node Configuration Onboarding
          </h2>
          <p className="text-xs text-slate-400">Step {step} of 2</p>
        </div>
        <div className="flex gap-1">
          <div className={`w-12 h-1 rounded ${step >= 1 ? 'bg-blue-500' : 'bg-slate-200'}`} />
          <div className={`w-12 h-1 rounded ${step >= 2 ? 'bg-blue-500' : 'bg-slate-200'}`} />
        </div>
      </div>

      <div className="p-8 rounded-3xl glass-panel border border-slate-150/85 bg-white shadow-lg space-y-6">
        {step === 1 ? (
          /* Step 1: Personal Profile Info */
          <div className="space-y-6">
            <h3 className="font-display text-base font-extrabold text-slate-800 flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <User className="h-4.5 w-4.5 text-blue-500" />
              <span>Personalize Your Swapper Node</span>
            </h3>

            {/* Choose Profile Image */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Choose Avatar Photo</span>
              <div className="flex flex-wrap gap-3 items-center">
                <img
                  src={profileImage}
                  alt="avatar preview"
                  className="w-16 h-16 rounded-full border-2 border-blue-400 object-cover"
                />
                <div className="flex gap-2">
                  {avatars.map((av, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setProfileImage(av)}
                      className={`w-10 h-10 rounded-full border-2 overflow-hidden transition-all ${
                        profileImage === av ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'
                      }`}
                    >
                      <img src={av} alt="avatar option" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Title and Campus */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Core Title</label>
                <input
                  type="text"
                  placeholder="e.g. Design Enthusiast, React Fan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-400"
                  id="onbTitle"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">University campus</label>
                <input
                  type="text"
                  placeholder="e.g. Stanford University"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-400"
                  id="onbLocation"
                />
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Short Bio</label>
              <textarea
                placeholder="Say hello, share your major, explain your learning targets..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full h-24 p-3 rounded-xl border border-slate-200 text-xs focus:outline-none"
                id="onbBio"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-display text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
            >
              <span>Map Learning Skills</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </div>
        ) : (
          /* Step 2: Skills Selection tags */
          <div className="space-y-6">
            <h3 className="font-display text-base font-extrabold text-slate-800 flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <Award className="h-4.5 w-4.5 text-purple-500" />
              <span>Define Teach & Learn Specialties</span>
            </h3>

            {/* Teach Skills */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Skills You Can Teach (Press Add)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Figma prototyping, Python"
                  value={teachInput}
                  onChange={(e) => setTeachInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTeach())}
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  id="onbTeach"
                />
                <button
                  type="button"
                  onClick={handleAddTeach}
                  className="px-4 py-2.5 bg-blue-500 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Tag box */}
              <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100 min-h-[50px] align-middle">
                {teachSkills.length === 0 ? (
                  <span className="text-[11px] text-slate-400 font-sans self-center">No teach tags added...</span>
                ) : (
                  teachSkills.map((val) => (
                    <span
                      key={val}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100"
                    >
                      {val}
                      <button onClick={() => handleRemoveTeach(val)} className="hover:text-blue-900 cursor-pointer text-slate-400">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Learn Skills */}
            <div className="space-y-3 pt-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Skills You Want to Learn (Press Add)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Node API, Music production"
                  value={learnInput}
                  onChange={(e) => setLearnInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLearn())}
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  id="onbLearn"
                />
                <button
                  type="button"
                  onClick={handleAddLearn}
                  className="px-4 py-2.5 bg-purple-500 text-white rounded-xl text-xs font-bold hover:bg-purple-600 transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Tag box */}
              <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100 min-h-[50px] align-middle">
                {learnSkills.length === 0 ? (
                  <span className="text-[11px] text-slate-400 font-sans self-center">No learn tags added...</span>
                ) : (
                  learnSkills.map((val) => (
                    <span
                      key={val}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-100"
                    >
                      {val}
                      <button onClick={() => handleRemoveLearn(val)} className="hover:text-purple-900 cursor-pointer text-slate-400">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Navigation controls */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 border border-slate-200 hover:border-slate-350 rounded-xl text-xs font-bold text-slate-500 cursor-pointer text-center"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="flex-1 py-3 glossy-gradient hover:opacity-90 text-white font-display text-xs font-bold rounded-xl flex items-center justify-center gap-1 shadow-md transition cursor-pointer"
              >
                <Check className="h-4.5 w-4.5" />
                <span>Publish Onboarding Node</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
