/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Session } from '../types';
import { X, Calendar, Clock, BookOpen, Check, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: User;
  currentUser: User;
  onBookSession: (session: Session) => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  mentor,
  currentUser,
  onBookSession
}: BookingModalProps) {
  // Filter mentor's teach skills
  const teachSkills = mentor.skills ? mentor.skills.filter(s => s.type === 'teach') : [];
  
  // States
  const [selectedSkill, setSelectedSkill] = useState(teachSkills[0]?.name || 'General Coordination');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [duration, setDuration] = useState<number>(60);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const hasSlots = mentor.calendarEnabled !== false && mentor.availabilities && mentor.availabilities.length > 0;
  
  // If calendar disabled or empty, provide general flexible schedules
  const fallbackHours = [
    'Tomorrow at 10:00 AM',
    'Tomorrow at 3:00 PM',
    'In 2 days at 11:00 AM',
    'In 2 days at 4:00 PM'
  ];

  const availableSlots = hasSlots ? mentor.availabilities! : fallbackHours;

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) {
      setErrorMsg('Please select one of the available calendar hours slots.');
      return;
    }

    const newSession: Session = {
      id: `sess_${Date.now()}`,
      mentorId: mentor.id,
      learnerId: currentUser.id,
      skillName: selectedSkill,
      scheduledTime: selectedTime,
      duration: duration,
      status: 'pending'
    };

    onBookSession(newSession);
    setSuccess(true);
    setErrorMsg('');
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-lg bg-white rounded-[32px] border border-slate-150 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-left"
      >
        {/* Header card with Close trigger */}
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={mentor.profileImage}
              alt={mentor.username}
              className="w-11 h-11 rounded-full object-cover border-2 border-white/20 shadow"
            />
            <div>
              <h3 className="font-display text-sm font-extrabold flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                <span>Book Swap with {mentor.username}</span>
              </h3>
              <p className="font-sans text-[10px] text-slate-300 uppercase tracking-wider">
                {mentor.title || 'Mentor Node'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-emerald-50 rounded-full text-emerald-600 border border-emerald-100 animate-bounce">
              <Check className="h-8 w-8" />
            </div>
            <h4 className="font-display text-base font-extrabold text-slate-900">Exchange Booked Successfully!</h4>
            <p className="font-sans text-xs text-slate-500 max-w-xs leading-relaxed">
              Your study slot has been recorded into the live database. Check the **Student Dashboard** to monitor the ongoing status.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBookSubmit} className="flex-1 p-6 space-y-5 overflow-y-auto">
            {/* Context Notice */}
            <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex gap-2.5 items-start text-xs text-blue-800 leading-normal">
              <BookOpen className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
              <span>
                To complete this peer-to-peer knowledge session, you will swap teachings. Select what you would like {mentor.username} to tutor you.
              </span>
            </div>

            {/* Error notifications */}
            {errorMsg && (
              <div className="p-3 bg-red-50 rounded-xl border border-red-150 text-[11px] text-red-650 flex items-center gap-1.5 font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Select Swap Topic */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Topic to Study</label>
              <div className="relative">
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs border border-slate-200 outline-none focus:border-blue-500 bg-white"
                >
                  {teachSkills.map((sk) => (
                    <option key={sk.id} value={sk.name}>
                      {sk.name} ({sk.level || 'expert'})
                    </option>
                  ))}
                  <option value="Custom General Discussion">Other specific question from their bio ...</option>
                </select>
              </div>
            </div>

            {/* Calendar slot selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Available Hour Slots</label>
                {!hasSlots && (
                  <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                    Auto Fallbacks Loaded
                  </span>
                )}
              </div>

              {!hasSlots && (
                <p className="text-[10px] text-slate-400 font-sans italic leading-relaxed">
                  This peer currently has their custom scheduling matrix off. We generated these standby hourly slots instead:
                </p>
              )}

              <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
                {availableSlots.map((slot) => {
                  const isChosen = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`p-3 rounded-xl border text-[11px] font-sans font-bold text-left transition-all ${
                        isChosen
                          ? 'bg-blue-500 border-blue-600 text-white shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex gap-1.5 items-center">
                        <Clock className={`h-3.5 w-3.5 ${isChosen ? 'text-white' : 'text-blue-500'}`} />
                        <span className="truncate">{slot}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Select Duration */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Meeting Length</label>
              <div className="flex gap-2">
                {[30, 60, 90].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDuration(mins)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-bold font-display transition-all ${
                      duration === mins
                        ? 'bg-slate-900 border-slate-950 text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Swap buttons */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-display text-xs font-bold rounded-xl shadow cursor-pointer transition flex items-center justify-center gap-2"
              >
                <Calendar className="h-4 w-4 text-cyan-400" />
                <span>Confirm Exchange Swap Booking</span>
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
