/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Session, Review } from '../types';
import { X, Star, Check, AlertCircle, Sparkles, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
  partner: User;
  currentUser: User;
  onAddReview: (review: Review) => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  session,
  partner,
  currentUser,
  onAddReview
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg('Please write a short comment about your swapping experience.');
      return;
    }
    if (comment.trim().length < 8) {
      setErrorMsg('Comments must be at least 8 characters long.');
      return;
    }

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      reviewerId: currentUser.id,
      reviewedUserId: partner.id,
      rating: rating,
      comment: comment,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    };

    onAddReview(newReview);
    setSuccess(true);
    setErrorMsg('');
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] border border-slate-150 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-left"
      >
        {/* Header Section */}
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={partner.profileImage}
              alt={partner.username}
              className="w-10 h-10 rounded-full object-cover border-2 border-white/20 shadow"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="font-display text-sm font-extrabold flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-yellow-400 animate-pulse" />
                <span>Rate Swapping Session</span>
              </h3>
              <p className="font-sans text-[10px] text-slate-300 uppercase tracking-wider">
                with {partner.username}
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
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-full text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 animate-bounce">
              <Check className="h-8 w-8" />
            </div>
            <h4 className="font-display text-base font-extrabold text-slate-900 dark:text-white">Review Submitted!</h4>
            <p className="font-sans text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Your feedback is live. It will boost {partner.username}'s Reputation Score and help others match efficiently.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
            {/* Description Text */}
            <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100/55 dark:border-blue-900/35 flex gap-2.5 items-start text-xs text-blue-800 dark:text-blue-300 leading-normal">
              <MessageSquare className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
              <span>
                You completed learning <strong className="font-semibold text-blue-700 dark:text-blue-200">"{session.skillName}"</strong>. Please write an honest feedback review to update our peer matching indexing!
              </span>
            </div>

            {/* Error notifications */}
            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/35 rounded-xl border border-red-150 dark:border-red-900 text-[11px] text-red-650 dark:text-red-400 flex items-center gap-1.5 font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Star Rating Selector */}
            <div className="space-y-2 text-center py-2 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                Session Star Rating
              </label>

              <div className="flex justify-center gap-1.5 mt-1.5">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isGold = (hoverRating !== null ? hoverRating : rating) >= starVal;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(starVal)}
                      className="p-1 cursor-pointer transition-transform duration-100 hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          isGold
                            ? 'fill-yellow-400 stroke-yellow-500'
                            : 'text-slate-300 dark:text-slate-700 fill-none'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <span className="text-xs font-bold text-slate-600 dark:text-slate-355 block mt-1">
                {rating === 5 ? '⭐⭐⭐⭐⭐ Spectacular (5/5)' :
                 rating === 4 ? '⭐⭐⭐⭐ Good Session (4/5)' :
                 rating === 3 ? '⭐⭐⭐ Average (3/5)' :
                 rating === 2 ? '⭐⭐ Disappointing (2/5)' :
                 '⭐ Poor Match (1/5)'}
              </span>
            </div>

            {/* Star comment Input text */}
            <div className="space-y-1.5 font-sans">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                Write Your Swap Experience
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did they explain well? How was their pacing, presentation, or tooling expertise?"
                rows={4}
                className="w-full text-xs p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-400 text-slate-800 dark:text-white leading-relaxed resize-none"
              />
            </div>

            {/* Submit Swap buttons */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-slate-900 dark:bg-white dark:text-slate-900 border border-transparent text-white font-display text-xs font-bold rounded-xl shadow cursor-pointer transition hover:opacity-90 flex items-center justify-center gap-2"
              >
                <Check className="h-4 w-4" />
                <span>Submit Performance Review</span>
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
