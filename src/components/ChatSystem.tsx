/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { User, Message } from '../types';
import { INITIAL_MESSAGES } from '../data/initialData';
import { Send, Image, FilePlus, Sparkles, UserCheck, PhoneCall, AlertCircle, Laptop, GraduationCap } from 'lucide-react';

interface ChatSystemProps {
  currentUser: User;
  users: User[];
  onSendMessage: (msg: Message) => void;
  messages: Message[];
  activeChatPartnerId?: string | null;
}

export default function ChatSystem({ 
  currentUser, 
  users, 
  onSendMessage, 
  messages,
  activeChatPartnerId
}: ChatSystemProps) {
  // 1. Determine whom the current user can converse with (everyone except themselves)
  const chatPartners = users.filter(u => u.id !== currentUser.id);
  
  // Set selected partner
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(
    activeChatPartnerId || chatPartners[0]?.id || ''
  );

  // Sync if selected via other pages like Explore or Dashboard recommendations
  useEffect(() => {
    if (activeChatPartnerId) {
      setSelectedPartnerId(activeChatPartnerId);
    }
  }, [activeChatPartnerId]);

  const [messageText, setMessageText] = useState('');
  const [typing, setTyping] = useState(false);
  const [attachment, setAttachment] = useState<{ name: string; type: 'image' | 'file' } | null>(null);

  const activePartner = users.find(u => u.id === selectedPartnerId);

  // Filter messages between currentUser and the selected partner
  const conversation = messages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.receiverId === selectedPartnerId) ||
      (m.senderId === selectedPartnerId && m.receiverId === currentUser.id)
  );

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever conversations update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, typing]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() && !attachment) return;

    const payload: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: selectedPartnerId,
      message: messageText.trim() || `Sent an attachment: ${attachment?.name}`,
      timestamp: new Date().toISOString(),
      type: attachment ? attachment.type : 'text',
      attachmentName: attachment ? attachment.name : undefined,
      attachmentUrl: attachment ? 'mock' : undefined
    };

    onSendMessage(payload);
    setMessageText('');
    setAttachment(null);

    // Auto chatbot responders logic - simulates true multiplayer chat on sandbox!
    setTyping(true);
    setTimeout(() => {
      setTyping(false);

      // Create a sensible simulated reply based on this specific partner profile
      let autoReplyMsg = 'Hey! That sounds excellent. Let us schedule our video talk tomorrow. Cheers!';
      if (selectedPartnerId === 'usr_alice') {
        autoReplyMsg = 'Perfect! I can show you how I built the async Web crawler in Python tomorrow. Don’t forget to have Python 3.10 ready on your local shell terminal. Let’s do it!';
      } else if (selectedPartnerId === 'usr_brandon') {
        autoReplyMsg = 'Brilliant! I will prepare 4 wireframe grids in Figma so we can audit the spacing rules and typography scales together. Talk then!';
      } else if (selectedPartnerId === 'usr_david') {
        autoReplyMsg = 'That is awesome. I’ll make sure to outline our React hooks state array layout so you can master the custom reducer patterns. Cheers!';
      }

      const replyPayload: Message = {
        id: `msg_auto_${Date.now()}`,
        senderId: selectedPartnerId,
        receiverId: currentUser.id,
        message: autoReplyMsg,
        timestamp: new Date().toISOString()
      };

      onSendMessage(replyPayload);
    }, 2500);
  };

  // Simulated instant file/image attachments
  const handleAttachMock = (type: 'image' | 'file') => {
    if (type === 'image') {
      setAttachment({ name: 'wireframe_composition.png', type: 'image' });
    } else {
      setAttachment({ name: 'python_web_scraper.py', type: 'file' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4 px-4 text-left">
      <div className="grid grid-cols-1 md:grid-cols-12 rounded-3xl border border-slate-200/85 bg-white h-[600px] overflow-hidden shadow-md">
        
        {/* Left Side: Peers Channel menu */}
        <div className="md:col-span-4 border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
          <div className="p-4 border-b border-indigo-50/80 bg-white">
            <h3 className="font-display text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-cyan-500 animate-pulse" />
              <span>Direct Chat Channels</span>
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {chatPartners.map((partner) => {
              const isSelected = selectedPartnerId === partner.id;
              // get last message written to or from peer
              const peerMsgs = messages.filter(
                (m) =>
                  (m.senderId === currentUser.id && m.receiverId === partner.id) ||
                  (m.senderId === partner.id && m.receiverId === currentUser.id)
              );
              const lastText = peerMsgs[peerMsgs.length - 1]?.message || 'Start swapping talk!';

              return (
                <button
                  key={partner.id}
                  onClick={() => setSelectedPartnerId(partner.id)}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 transition-colors text-left relative cursor-pointer ${
                    isSelected ? 'bg-blue-500 text-white' : 'hover:bg-slate-100'
                  }`}
                >
                  <img
                    src={partner.profileImage}
                    alt={partner.username}
                    className="w-10 h-10 rounded-full object-cover border border-white shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Online dot */}
                  <span className="absolute bottom-3 left-10 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-display text-xs sm:text-sm font-extrabold truncate">
                        {partner.username}
                      </h4>
                      <span className={`text-[10px] ${isSelected ? 'text-blue-250' : 'text-slate-400'}`}>
                        Online
                      </span>
                    </div>
                    <p className={`text-[11px] truncate mt-0.5 leading-snug ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                      {lastText}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active messages box */}
        <div className="md:col-span-8 flex flex-col h-full bg-white">
          {activePartner ? (
            <>
              {/* Partner Active header */}
              <div className="p-4 border-b border-indigo-50/80 flex justify-between items-center bg-slate-50/30">
                <div className="flex gap-3 items-center">
                  <img
                    src={activePartner.profileImage}
                    alt={activePartner.username}
                    className="w-10 h-10 rounded-full object-cover border border-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-left">
                    <h3 className="font-display text-sm font-extrabold text-slate-850">
                      {activePartner.username}
                    </h3>
                    <p className="font-sans text-[10px] text-slate-400 capitalize">
                      {activePartner.title || 'Mentor Node'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-600 rounded-lg max-w-[130px] border border-blue-100">
                  <PhoneCall className="h-4 w-4" />
                  <span>Meet Scheduled</span>
                </div>
              </div>

              {/* Chat conversations trail */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversation.length === 0 ? (
                  <div className="text-center py-20 px-4 space-y-3">
                    <Laptop className="h-10 w-10 text-slate-350 mx-auto" />
                    <p className="font-sans text-xs text-slate-400 max-w-xs mx-auto">
                      Send a brief prompt to <strong className="font-semibold text-slate-700">{activePartner.username}</strong> to schedule your first 1:1 educational swap session.
                    </p>
                  </div>
                ) : (
                  conversation.map((msg) => {
                    const isSelf = msg.senderId === currentUser.id;
                    const dateObj = new Date(msg.timestamp);
                    const hours = String(dateObj.getHours()).padStart(2, '0');
                    const mins = String(dateObj.getMinutes()).padStart(2, '0');
                    const formattedTime = `${hours}:${mins}`;

                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 max-w-sm sm:max-w-md ${isSelf ? 'ml-auto flex-row-reverse' : ''}`}
                      >
                        {!isSelf && (
                          <img
                            src={activePartner.profileImage}
                            alt="partner image"
                            className="w-8 h-8 rounded-full object-cover shrink-0 align-bottom"
                          />
                        )}
                        <div className="space-y-1">
                          <div
                            className={`p-3 rounded-2xl text-xs sm:text-sm font-sans block leading-relaxed relative ${
                              isSelf
                                ? 'bg-slate-900 border border-slate-800 text-white rounded-tr-none text-left'
                                : 'bg-slate-100/90 text-slate-800 rounded-tl-none text-left'
                            }`}
                          >
                            {/* File layout attachment checks */}
                            {msg.type === 'file' && (
                              <div className="flex items-center gap-2 p-2 bg-slate-850/5 text-slate-500 rounded-lg mb-1 border select-none">
                                <FilePlus className="h-4 w-4 shrink-0" />
                                <span className="font-mono text-[10px] font-bold truncate">{msg.attachmentName}</span>
                              </div>
                            )}

                            {msg.type === 'image' && (
                              <div className="p-1 mb-2 bg-white rounded-lg border">
                                <p className="text-[10px] font-semibold text-slate-400 select-none pb-1 font-mono">
                                  🌅 {msg.attachmentName}
                                </p>
                                <div className="w-full h-24 bg-gradient-to-r from-blue-100 to-indigo-150 rounded" />
                              </div>
                            )}

                            <p className="whitespace-pre-wrap">{msg.message}</p>
                          </div>
                          <p className={`text-[10px] text-slate-400 font-sans ${isSelf ? 'text-right' : 'text-left'}`}>
                            {formattedTime}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Animated Typing indicators bubble */}
                {typing && (
                  <div className="flex gap-3 max-w-xs items-center">
                    <img
                      src={activePartner.profileImage}
                      alt="typing avatar"
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <div className="p-3 bg-slate-100 text-slate-400 text-xs rounded-2xl rounded-tl-none flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Active attachment displays */}
              {attachment && (
                <div className="px-4 py-2 bg-blue-50 border-t border-blue-100 flex justify-between items-center text-xs text-blue-800 font-sans">
                  <span className="truncate">Attached: <strong className="font-semibold">{attachment.name}</strong></span>
                  <button onClick={() => setAttachment(null)} className="text-blue-500 hover:text-blue-700 font-bold px-1 py-0.5 cursor-pointer">
                    Remove
                  </button>
                </div>
              )}

              {/* Footer write-sender form */}
              <form onSubmit={handleSend} className="p-3 border-t border-slate-200 flex gap-2 bg-slate-50/50">
                <button
                  type="button"
                  title="Simulate image attachment upload"
                  onClick={() => handleAttachMock('image')}
                  className="px-3 border border-slate-200 hover:border-slate-350 bg-white rounded-xl text-slate-400 hover:text-blue-500 cursor-pointer flex items-center justify-center shrink-0"
                >
                  <Image className="h-4.5 w-4.5" />
                </button>

                <button
                  type="button"
                  title="Simulate custom payload code upload"
                  onClick={() => handleAttachMock('file')}
                  className="px-3 border border-slate-200 hover:border-slate-350 bg-white rounded-xl text-slate-400 hover:text-purple-500 cursor-pointer flex items-center justify-center shrink-0"
                >
                  <FilePlus className="h-4.5 w-4.5" />
                </button>

                <input
                  type="text"
                  placeholder={`Write interactive swap request message to ${activePartner.username}...`}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none text-xs sm:text-sm font-sans"
                  id="chatWriterInput"
                />

                <button
                  type="submit"
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer shrink-0"
                  id="chatSendBtn"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 space-y-4">
              <Laptop className="h-12 w-12 text-slate-300" />
              <p className="font-sans text-xs">No active nodes connected yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
