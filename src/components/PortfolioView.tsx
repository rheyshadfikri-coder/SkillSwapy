/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project, User } from '../types';
import { Award, Plus, Layers, Image, Check, Star, ShieldCheck, Heart } from 'lucide-react';

interface PortfolioViewProps {
  currentUser: User;
  projects: Project[];
  onAddProject: (newProj: Project) => void;
}

export default function PortfolioView({ currentUser, projects, onAddProject }: PortfolioViewProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('UI/UX Design');
  const [tagsInput, setTagsInput] = useState('');
  const [certificate, setCertificate] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [success, setSuccess] = useState(false);

  // Filter projects belonging to this logged in node
  const myProjects = projects.filter(p => p.userId === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    // Parse tags split by comma
    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload: Project = {
      id: `proj_${Date.now()}`,
      userId: currentUser.id,
      title,
      description,
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400', // default high quality analytics mockup
      category,
      tags: parsedTags.length > 0 ? parsedTags : ['Custom Swapper Work'],
      likes: 0,
      certificate: certificate.trim() || undefined
    };

    onAddProject(payload);
    setSuccess(true);
    
    // reset form
    setTitle('');
    setDescription('');
    setTagsInput('');
    setCertificate('');
    setShowAddForm(false);

    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-8 text-left">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            Portfolio Showcase
          </h1>
          <p className="font-sans text-xs text-slate-400">
            Exhibit your completed college works, academic pipelines, and certificates to earn higher swap compatibilities on-the-fly.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-display text-xs font-bold rounded-xl flex items-center gap-1 shadow cursor-pointer transition"
          id="portAddToggleBtn"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Publish Project Node</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 flex items-center gap-2 shadow-sm">
          <Check className="h-4.5 w-4.5 text-emerald-500" />
          <span>New project logged and rendered publicly in your catalog!</span>
        </div>
      )}

      {/* Slide-out or Dropdown creation form */}
      {showAddForm && (
        <div className="p-6 bg-slate-50 border border-slate-150 rounded-3xl space-y-4">
          <h3 className="font-display text-sm font-extrabold text-slate-850 uppercase tracking-wider border-b border-slate-200/50 pb-2">
            Build New Case Study Item
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 bg-transparent">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Project Work Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stanford Housing scraper script"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs border border-slate-200 bg-white focus:outline-none"
                  id="portTitle"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Core Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs border border-slate-200 bg-white focus:outline-none cursor-pointer"
                  id="portCatSelector"
                >
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Software Development">Software Development</option>
                  <option value="Content & Writing">Content & Writing</option>
                  <option value="Digital Growth">Digital Growth</option>
                  <option value="Languages & Speech">Languages & Speech</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Detailed Explanation</label>
              <textarea
                required
                placeholder="Explain the technical setup, tools used, parameters solved, and what results occurred..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-24 p-2.5 rounded-xl text-xs border border-slate-200 bg-white focus:outline-none"
                id="portDesc"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Keywords split by commas
                </label>
                <input
                  type="text"
                  placeholder="e.g. Python, beautifulsoup, JSON files"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs border border-slate-200 bg-white focus:outline-none"
                  id="portTags"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Certificate Name or Academic reference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Stanford CS224 Web Certificate"
                  value={certificate}
                  onChange={(e) => setCertificate(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs border border-slate-200 bg-white focus:outline-none"
                  id="portCertName"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Discard
              </button>
              <button
                type="submit"
                className="px-5 py-2 glossy-gradient text-white text-xs font-bold rounded-xl shadow cursor-pointer hover:opacity-90 transition"
                id="portSubmitBtn"
              >
                Log Case Study
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects layout grids */}
      <div className="space-y-6">
        <h3 className="font-display text-sm font-extrabold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
          Your active case studies ({myProjects.length})
        </h3>

        {myProjects.length === 0 ? (
          <div className="text-center p-14 rounded-3xl bg-slate-50 border border-dashed border-slate-200">
            <p className="text-xs text-slate-400 font-sans leading-normal max-w-sm mx-auto">
              You haven't logged any project layouts yet. Add custom items above to showcase portfolio credibility immediately!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProjects.map((proj) => (
              <div
                key={proj.id}
                className="flex flex-col rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all text-left"
              >
                <div className="w-full h-40 overflow-hidden bg-slate-100 relative">
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold py-1 px-2.5 rounded-full">
                    {proj.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-display text-sm font-extrabold text-slate-900 leading-tight">
                      {proj.title}
                    </h4>
                    <p className="font-sans text-slate-500 text-xs line-clamp-3 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  {proj.certificate && (
                    <div className="flex gap-1.5 p-2 bg-purple-50/50 border border-purple-100 rounded-lg text-[10px] text-purple-700 font-sans font-semibold items-center">
                      <ShieldCheck className="h-4 w-4 text-purple-500 shrink-0" />
                      <span className="truncate">Cert: {proj.certificate}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                    {proj.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
