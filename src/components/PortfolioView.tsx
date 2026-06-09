/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project, User } from '../types';
import { Award, Plus, Layers, Image, Check, Star, ShieldCheck, Heart, Sparkles, AlertCircle, ArrowRight, Search } from 'lucide-react';

interface PortfolioViewProps {
  currentUser: User;
  projects: Project[];
  onAddProject: (newProj: Project) => void;
  onExploreSkill?: (searchVal: string) => void;
}

export default function PortfolioView({ currentUser, projects, onAddProject, onExploreSkill }: PortfolioViewProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('UI/UX Design');
  const [tagsInput, setTagsInput] = useState('');
  const [certificate, setCertificate] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [success, setSuccess] = useState(false);

  // AI Portfolio Analyzer States
  const storageKey = `skillswap_portfolio_analysis_${currentUser.id}`;
  const [analysisResult, setAnalysisResult] = useState<{
    overview: string;
    suggestions: Array<{
      name: string;
      reason: string;
      projectIdea: string;
      difficulty: string;
    }>;
  } | null>(() => {
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState("");

  const handleAnalyzePortfolio = async () => {
    setLoadingAnalysis(true);
    setAnalysisError(null);
    setLoadingMsg("Parsing current case studies...");

    const messages = [
      "Parsing current case studies...",
      "Analyzing skill nodes against 2026 demands...",
      "Simulating peer-to-peer workspace vectors...",
      "Formulating custom learning paths...",
      "Drafting specific educational project ideas..."
    ];

    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setLoadingMsg(messages[msgIdx]);
    }, 2800);

    try {
      const myProjects = projects.filter(p => p.userId === currentUser.id);
      
      const response = await fetch("/api/analyze-portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projects: myProjects,
          userSkills: currentUser.skills,
          userInterests: currentUser.interests
        })
      });

      if (!response.ok) {
        let errText = "Failed to run analysis";
        try {
          const errData = await response.json();
          errText = errData.error || errText;
        } catch (_) {}
        throw new Error(errText);
      }

      const result = await response.json();
      setAnalysisResult(result);
      localStorage.setItem(storageKey, JSON.stringify(result));
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err?.message || "Something went wrong during Gemini API feedback. Please try again.");
    } finally {
      clearInterval(interval);
      setLoadingAnalysis(false);
    }
  };

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

      {/* AI Portfolio Trend Suggestions Section */}
      <div className="p-6 bg-slate-900 text-white rounded-[24px] border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
        {/* Abstract background decorative blobs / accent gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div className="flex gap-3 items-center">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-display text-sm sm:text-base font-extrabold tracking-tight flex items-center gap-2">
                AI Portfolio Analyzer
                <span className="text-[9px] font-bold tracking-wider uppercase bg-cyan-400/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/30">
                  Gemini API
                </span>
              </h3>
              <p className="font-sans text-[11px] text-slate-300">
                Cross-references your published works against 2026 industry growth trends to map optimum study tracks.
              </p>
            </div>
          </div>

          {!loadingAnalysis && (
            <button
              onClick={handleAnalyzePortfolio}
              disabled={loadingAnalysis}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 rounded-xl text-xs font-bold font-display shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 shrink-0 select-none cursor-pointer border border-transparent disabled:opacity-50"
              id="analyzePortfolioBtn"
            >
              {analysisResult ? 'Re-analyze' : 'Analyze My Portfolio'}
            </button>
          )}
        </div>

        {/* Loading Spinner Block */}
        {loadingAnalysis && (
          <div className="py-10 flex flex-col items-center justify-center text-center space-y-4 relative z-10 transition-all">
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-cyan-400 rounded-full animate-spin" />
              <Sparkles className="h-5 w-5 text-cyan-400 absolute animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="font-sans text-xs font-bold text-slate-200">{loadingMsg}</p>
              <p className="font-sans text-[10px] text-slate-400">This connects live through Google AI Studio backend.</p>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {analysisError && !loadingAnalysis && (
          <div className="p-4 bg-red-950/40 border border-red-500/35 rounded-xl text-xs flex gap-2.5 items-start text-red-200 relative z-10">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-semibold">{analysisError}</p>
              <button
                onClick={handleAnalyzePortfolio}
                className="px-3 py-1.5 bg-red-850 hover:bg-red-800 rounded-lg text-[10px] font-bold border border-red-500/30 transition cursor-pointer"
              >
                Retry Analysis
              </button>
            </div>
          </div>
        )}

        {/* Unanalyzed default helper layout */}
        {!analysisResult && !loadingAnalysis && !analysisError && (
          <div className="py-4 border-t border-slate-800/80 grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-left relative z-10">
            <div className="p-4 bg-slate-850/40 rounded-xl border border-slate-800/40 space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">01 / Skill Gaps</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                We'll examine any gaps between what tags are present on your logged case studies and active high-growth positions.
              </p>
            </div>

            <div className="p-4 bg-slate-850/40 rounded-xl border border-slate-800/40 space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">02 / Market Demand</div>
              <p className="text-[11px] text-slate-350 leading-relaxed">
                Evaluates emerging requirements including neural architectures, vector databases, and advanced design systems.
              </p>
            </div>

            <div className="p-4 bg-slate-850/40 rounded-xl border border-slate-800/40 space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">03 / Peer Prompts</div>
              <p className="text-[11px] text-slate-350 leading-relaxed">
                Generates a concrete matching project with specifications to list inside SkillSwap to partner with specific instructors.
              </p>
            </div>
          </div>
        )}

        {/* Results Block */}
        {analysisResult && !loadingAnalysis && (
          <div className="space-y-5 pt-4 border-t border-slate-800/80 text-left relative z-10 transition-all duration-300">
            {/* Overview / Strategy section */}
            <div className="p-4 bg-indigo-950/30 border border-indigo-500/20 rounded-2xl space-y-1.5">
              <span className="text-[9px] font-extrabold text-cyan-400 uppercase tracking-widest block">Strategic Assessment</span>
              <p className="font-sans text-xs text-slate-200 leading-relaxed">
                {analysisResult.overview}
              </p>
            </div>

            {/* Individual Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {analysisResult.suggestions.map((s, idx) => {
                const diffLevel = s.difficulty.toLowerCase();
                const badgeColor = diffLevel.includes("advanced")
                  ? "bg-purple-900/45 text-purple-300 border-purple-500/30"
                  : diffLevel.includes("moderate") || diffLevel.includes("intermediate")
                  ? "bg-amber-900/45 text-amber-300 border-amber-500/30"
                  : "bg-emerald-900/45 text-emerald-300 border-emerald-500/30";

                return (
                  <div
                    key={idx}
                    className="flex flex-col justify-between p-4 bg-slate-850/65 border border-slate-800/70 rounded-2xl hover:border-slate-700/80 transition-all shadow-sm space-y-4 text-left"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-display text-xs font-black text-white leading-tight">
                          {s.name}
                        </h4>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border ${badgeColor} uppercase shrink-0`}>
                          {s.difficulty}
                        </span>
                      </div>

                      <p className="font-sans text-slate-300 text-[11px] leading-relaxed">
                        {s.reason}
                      </p>

                      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-850/50 space-y-1">
                        <span className="text-[8px] font-extrabold text-cyan-400 uppercase tracking-widest block">
                          Suggested Swap Project:
                        </span>
                        <p className="font-sans text-[11px] text-slate-200 leading-normal italic">
                          "{s.projectIdea}"
                        </p>
                      </div>
                    </div>

                    {onExploreSkill && (
                      <button
                        onClick={() => onExploreSkill(s.name)}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-650 rounded-xl text-[10px] font-bold font-display text-cyan-400 flex items-center justify-center gap-1.5 cursor-pointer transition"
                      >
                        <Search className="h-3 w-3" />
                        <span>Find Mentor to Trade</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

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
