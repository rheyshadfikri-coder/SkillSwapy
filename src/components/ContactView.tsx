/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Check, MessageCircle, MapPin, Send, HelpCircle, ArrowRight } from 'lucide-react';
import { FAQS } from '../data/initialData';

export default function ContactView() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('match');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <div className="space-y-16 pb-20 text-left max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-xs font-bold text-blue-600 dark:text-blue-405">
          <MessageCircle className="h-3.5 w-3.5" />
          <span>Support Center</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          We’re Here to Help You Swap Skills
        </h1>
        <p className="font-sans text-slate-500 dark:text-slate-400 max-w-xl text-sm leading-relaxed">
          Have questions about matchmaking, bartering guidelines, or experiencing bug logs? Drop us a prompt or scroll our detailed interactive FAQs.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Left Side: Contact Form */}
        <div className="md:col-span-6 glass-card rounded-[28px] p-6 shadow-xl bg-white/40 dark:bg-slate-900/40 border border-white dark:border-slate-800">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-display text-base font-extrabold text-slate-800 dark:text-white pb-2">
                Send a Message to Support
              </h3>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alice Jin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-950 text-xs font-sans text-slate-800 dark:text-white focus:outline-none focus:border-blue-400"
                  id="contactName"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">E-mail Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alice@stanford.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-950 text-xs font-sans text-slate-800 dark:text-white focus:outline-none focus:border-blue-400"
                  id="contactEmail"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Topic Category</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 text-xs font-sans focus:outline-none focus:border-blue-400 bg-white/50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 cursor-pointer"
                  id="contactSubject"
                >
                  <option value="match" className="dark:bg-slate-950">Matchmaking and compatibility metrics</option>
                  <option value="abuse" className="dark:bg-slate-950">Report a user or unsafe discussion</option>
                  <option value="bugs" className="dark:bg-slate-950">Found a technical platform bug</option>
                  <option value="partner" className="dark:bg-slate-950">University partnerships program</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Your Message</label>
                <textarea
                  required
                  placeholder="Explain your problem and our team node will answer in 24 hours..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-28 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-950 text-xs font-sans text-slate-800 dark:text-white focus:outline-none focus:border-blue-400"
                  id="contactMessage"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#60A5FA] via-[#C4B5FD] to-[#67E8F9] text-white font-display text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:opacity-90 shadow-lg cursor-pointer"
              >
                <Send className="h-4.5 w-4.5" />
                <span>Submit Query</span>
              </button>
            </form>
          ) : (
            <div className="p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 border border-emerald-100 dark:border-emerald-900 flex items-center justify-center mx-auto shadow-sm">
                <Check className="h-6 w-6 stroke-[3]" />
              </div>
              <h3 className="font-display text-lg font-extrabold text-slate-800 dark:text-white">Support Message Sent</h3>
              <p className="font-sans text-xs text-slate-505 dark:text-slate-350 leading-relaxed">
                Thank you <strong className="font-bold text-slate-700 dark:text-white">{name}</strong>, your query regarding <strong className="font-bold text-slate-700 dark:text-white">{subject}</strong> has been logged. Our student coordinators will email you at <strong className="font-bold text-slate-700 dark:text-white">{email}</strong> within 12-24 hours.
              </p>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-850 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-800 cursor-pointer border border-[#ffffff]/10"
              >
                Send Another Prompt
              </button>
            </div>
          )}
        </div>

        {/* Right Side: FAQs */}
        <div className="md:col-span-6 space-y-6">
          <div className="space-y-2">
            <h3 className="font-display text-sm font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Interactive FAQ Accordion
            </h3>
            <p className="font-sans text-slate-500 dark:text-slate-400 text-xs">Click on any question to view its detailed barter guide answer.</p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-white/60 dark:border-slate-800/60 bg-white/30 dark:bg-slate-900/20 backdrop-blur-sm overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full p-4 flex items-center justify-between text-left font-display text-xs sm:text-sm font-bold text-slate-850 dark:text-slate-205 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                    {faq.q}
                  </span>
                  <ArrowRight className={`h-4 w-4 text-slate-400 transition-transform shrink-0 ${activeFaq === index ? 'rotate-90' : ''}`} />
                </button>

                {activeFaq === index && (
                  <div className="p-4 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-105 dark:border-slate-800 text-left">
                    <p className="font-sans text-xs text-slate-655 dark:text-slate-300 leading-relaxed font-medium">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Social links simulation */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-4 min-w-[200px] text-slate-400 dark:text-slate-500 text-xs font-sans">
            <div className="flex items-center gap-1.5">
              <Mail className="h-4.5 w-4.5 text-blue-450 dark:text-blue-400" />
              <span>team@skillswap.edu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4.5 w-4.5 text-purple-450 dark:text-purple-400" />
              <span>Stanford Dorm hub, California</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
