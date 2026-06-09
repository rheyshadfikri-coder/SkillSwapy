/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Menu, 
  X, 
  LogOut, 
  User as UserIcon, 
  ChevronRight, 
  Users, 
  Compass, 
  Info, 
  HelpCircle, 
  FileText, 
  LayoutDashboard, 
  MessageSquare,
  Award,
  Settings,
  Sun,
  Moon
} from 'lucide-react';
import { User, Session, Message, Project, DiscussionPost, Review } from './types';
import { INITIAL_USERS, INITIAL_MESSAGES, INITIAL_PROJECTS, INITIAL_DISCUSSIONS, INITIAL_POSTS } from './data/initialData';
import { getPersistedUsers, persistUserAccount, getPersistedSessions, persistSessions, getPersistedProjects, persistProjects, getPersistedReviews, persistReview } from './lib/db';

// Component view imports
import HomeView from './components/HomeView';
import ExploreView from './components/ExploreView';
import AboutView from './components/AboutView';
import CommunityView from './components/CommunityView';
import ContactView from './components/ContactView';
import LoginRegister from './components/LoginRegister';
import Onboarding from './components/Onboarding';
import DashboardView from './components/DashboardView';
import ProfileView from './components/ProfileView';
import PortfolioView from './components/PortfolioView';
import ChatSystem from './components/ChatSystem';

export default function App() {
  // Navigation states
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prefilledExploreSearch, setPrefilledExploreSearch] = useState('');

  // Mode/Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('skillswap_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });

  // Apply dark mode theme
  useEffect(() => {
    localStorage.setItem('skillswap_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Primary model states with local accounts database backing
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('skillswap_current_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  });

  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [projects, setProjects] = useState<Project[]>(() => {
    return getPersistedProjects();
  });
  const [forumPosts, setForumPosts] = useState<DiscussionPost[]>(INITIAL_POSTS);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Active chat partner pointer (facilitates instant boot parameters)
  const [activeChatPartnerId, setActiveChatPartnerId] = useState<string | null>(null);

  // Initialize simulated Swap sessions with database backing
  const [sessions, setSessions] = useState<Session[]>(() => {
    return getPersistedSessions([
      {
        id: 'sess_1',
        mentorId: 'usr_brandon',
        learnerId: 'usr_alice',
        skillName: 'Figma Design System Architecture',
        scheduledTime: 'Tomorrow at 3:00 PM',
        status: 'ongoing',
        duration: 60
      },
      {
        id: 'sess_2',
        mentorId: 'usr_alice',
        learnerId: 'usr_brandon',
        skillName: 'Python BeautifulSoup automation logs',
        scheduledTime: 'June 09, 10:00 AM',
        status: 'pending',
        duration: 90
      }
    ]);
  });

  // Hot reload custom users and reviews from database upon boot
  useEffect(() => {
    async function initDb() {
      const dbUsers = await getPersistedUsers();
      setUsers(dbUsers);
      const dbReviews = await getPersistedReviews();
      setReviews(dbReviews);
    }
    initDb();
  }, []);

  // Save logged in account state whenever changed
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('skillswap_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('skillswap_current_user');
    }
  }, [currentUser]);

  // Hook chat partner selectors (routes from Explore cards to active chat system)
  const handleSelectMentor = (mentorId: string) => {
    setActiveChatPartnerId(mentorId);
    if (!currentUser) {
      // Prompt logon first
      setCurrentPage('login');
    } else {
      setCurrentPage('chat');
    }
  };

  const handleExploreSkillShortcut = (searchVal: string) => {
    setPrefilledExploreSearch(searchVal);
    setCurrentPage('explore');
  };

  // State log callbacks
  const handleAuthSuccess = async (loggedUser: User) => {
    // Save account info to persistent database
    await persistUserAccount(loggedUser);
    setUsers(prev => {
      const exists = prev.some(u => u.id === loggedUser.id);
      if (exists) return prev.map(u => u.id === loggedUser.id ? loggedUser : u);
      return [loggedUser, ...prev];
    });
    setCurrentUser(loggedUser);
  };

  const handleCompleteOnboarding = async (updates: Partial<User>) => {
    if (currentUser) {
      const revisedUser = { ...currentUser, ...updates };
      await persistUserAccount(revisedUser);
      setCurrentUser(revisedUser);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? revisedUser : u));
    }
  };

  const handleSendMessage = (msg: Message) => {
    setMessages(prev => [...prev, msg]);
  };

  const handleAddProject = (proj: Project) => {
    setProjects(prev => {
      const next = [proj, ...prev];
      persistProjects(next);
      return next;
    });
  };

  const handleAddForumPost = (postPayload: Omit<DiscussionPost, 'id' | 'timestamp' | 'likes' | 'comments'>) => {
    const fresh: DiscussionPost = {
      id: `post_${Date.now()}`,
      groupId: postPayload.groupId,
      userId: postPayload.userId,
      username: postPayload.username,
      userImage: postPayload.userImage,
      content: postPayload.content,
      likes: 0,
      comments: 0,
      timestamp: 'Just now'
    };
    setForumPosts(prev => [fresh, ...prev]);
  };

  const handleUpdateSessions = (revisedSessions: Session[]) => {
    setSessions(revisedSessions);
    persistSessions(revisedSessions);
  };

  const handleAddReview = async (newRev: Review) => {
    await persistReview(newRev);
    setReviews(prev => [newRev, ...prev]);
  };

  const handleAddSession = (newSess: Session) => {
    setSessions(prev => {
      const next = [newSess, ...prev];
      persistSessions(next);
      return next;
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveChatPartnerId(null);
    setCurrentPage('home');
  };

  // Safe links triggers
  const handleLinkNavigate = (page: string) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  // Conditional Renderer for current pages
  const renderPageContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomeView
            onNavigate={handleLinkNavigate}
            onExploreSkill={handleExploreSkillShortcut}
            popularMentors={users}
            onSelectMentor={handleSelectMentor}
          />
        );
      case 'explore':
        return (
          <ExploreView
            users={users}
            currentUserId={currentUser?.id}
            onSelectMentor={handleSelectMentor}
            prefilledSearch={prefilledExploreSearch}
            onClearPrefilledSearch={() => setPrefilledExploreSearch('')}
            onNavigate={handleLinkNavigate}
            onAddSession={handleAddSession}
          />
        );
      case 'about':
        return <AboutView />;
      case 'community':
        return (
          <CommunityView
            groups={INITIAL_DISCUSSIONS}
            posts={forumPosts}
            currentUser={currentUser}
            onAddPost={handleAddForumPost}
            onNavigate={handleLinkNavigate}
          />
        );
      case 'contact':
        return <ContactView />;
      case 'login':
        return (
          <LoginRegister
            initialMode="login"
            onAuthSuccess={handleAuthSuccess}
            onNavigate={handleLinkNavigate}
            registeredUsers={users}
          />
        );
      case 'register':
        return (
          <LoginRegister
            initialMode="register"
            onAuthSuccess={handleAuthSuccess}
            onNavigate={handleLinkNavigate}
            registeredUsers={users}
          />
        );
      case 'onboarding':
        if (!currentUser) return <HomeView onNavigate={handleLinkNavigate} onExploreSkill={handleExploreSkillShortcut} popularMentors={users} onSelectMentor={handleSelectMentor} />;
        return (
          <Onboarding
            currentUser={currentUser}
            onCompleteOnboarding={handleCompleteOnboarding}
            onNavigate={handleLinkNavigate}
          />
        );
      case 'dashboard':
        if (!currentUser) return <HomeView onNavigate={handleLinkNavigate} onExploreSkill={handleExploreSkillShortcut} popularMentors={users} onSelectMentor={handleSelectMentor} />;
        return (
          <DashboardView
            currentUser={currentUser}
            users={users}
            sessions={sessions}
            reviews={reviews}
            onAddReview={handleAddReview}
            onSelectMentor={handleSelectMentor}
            onUpdateSessions={handleUpdateSessions}
            onNavigate={handleLinkNavigate}
          />
        );
      case 'profile':
        if (!currentUser) return <HomeView onNavigate={handleLinkNavigate} onExploreSkill={handleExploreSkillShortcut} popularMentors={users} onSelectMentor={handleSelectMentor} />;
        return (
          <ProfileView
            currentUser={currentUser}
            reviews={reviews}
            onUpdateUser={async (updates) => {
              const u = { ...currentUser, ...updates };
              await persistUserAccount(u);
              setCurrentUser(u);
              setUsers(prev => prev.map(usr => usr.id === currentUser.id ? u : usr));
            }}
          />
        );
      case 'portfolio':
        if (!currentUser) return <HomeView onNavigate={handleLinkNavigate} onExploreSkill={handleExploreSkillShortcut} popularMentors={users} onSelectMentor={handleSelectMentor} />;
        return (
          <PortfolioView
            currentUser={currentUser}
            projects={projects}
            onAddProject={handleAddProject}
            onExploreSkill={handleExploreSkillShortcut}
          />
        );
      case 'chat':
        if (!currentUser) return <HomeView onNavigate={handleLinkNavigate} onExploreSkill={handleExploreSkillShortcut} popularMentors={users} onSelectMentor={handleSelectMentor} />;
        return (
          <ChatSystem
            currentUser={currentUser}
            users={users}
            onSendMessage={handleSendMessage}
            messages={messages}
            activeChatPartnerId={activeChatPartnerId}
            onAddSession={handleAddSession}
          />
        );
      default:
        return <HomeView onNavigate={handleLinkNavigate} onExploreSkill={handleExploreSkillShortcut} popularMentors={users} onSelectMentor={handleSelectMentor} />;
    }
  };

  // Determine if active view lies in the nested authenticated parameters
  const isDashboardPage = ['dashboard', 'profile', 'portfolio', 'chat'].includes(currentPage);

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans mesh-bg text-slate-800 dark:text-slate-200 transition-colors duration-300">
      
      {/* 1. Global Interactive Navbar */}
      <nav className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 dark:border-slate-800 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4 md:gap-6">
            
            {/* Logo Area */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => handleLinkNavigate('home')}>
              <div className="w-10 h-10 rounded-xl glossy-gradient flex items-center justify-center shadow-md animate-float">
                <Sparkles className="h-5.5 w-5.5 text-white" />
              </div>
              <div className="text-left font-display">
                <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">SkillSwap</h1>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Learn Together</p>
              </div>
            </div>
 
            {/* Middle Nav Links (Public View Channels) */}
            <div className="hidden md:flex space-x-1 font-display bg-slate-100/80 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800 items-center h-10">
              {[
                { id: 'home', label: 'Home', icon: UserIcon },
                { id: 'explore', label: 'Explore Skills', icon: Compass },
                { id: 'community', label: 'Community Feed', icon: Users },
                { id: 'about', label: 'About', icon: Info },
                { id: 'contact', label: 'Support FAQs', icon: HelpCircle }
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkNavigate(link.id)}
                  className={`h-8 px-4 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer flex items-center justify-center ${
                    currentPage === link.id 
                      ? 'bg-white dark:bg-slate-800 text-blue-650 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-700/40 font-bold' 
                      : 'text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white hover:bg-white/45 dark:hover:bg-slate-800/30'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right Buttons Container */}
            <div className="hidden md:flex items-center gap-3 font-display h-10">
              {/* Theme/Mode Switcher Toggle */}
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100/60 dark:bg-slate-800/60 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer border border-slate-200/50 dark:border-slate-800 shadow-sm"
                title={theme === 'light' ? 'Nyalakan Mode Gelap' : 'Nyalakan Mode Terang'}
              >
                {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5 text-yellow-500 animate-pulse" />}
              </button>

              {currentUser ? (
                /* Authenticated State Quick Links */
                <div className="flex items-center gap-3 h-10">
                  <div 
                    onClick={() => handleLinkNavigate('dashboard')}
                    className="flex items-center gap-2 cursor-pointer group h-10 px-3.5 rounded-xl hover:bg-slate-100/60 dark:hover:bg-slate-800/20 border border-slate-200/45 dark:border-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <img
                      src={currentUser.profileImage}
                      alt="user thumb"
                      className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-750 shadow-xs group-hover:scale-105 transition-all duration-205"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {currentUser.username}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    title="Log Out of your Node"
                    className="h-10 px-4 text-xs font-bold text-slate-500 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/10 rounded-xl flex items-center gap-1.5 border border-transparent hover:border-red-100 dark:hover:border-red-900/20 transition-all duration-150 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Exit</span>
                  </button>
                </div>
              ) : (
                /* Non-Authenticated States buttons */
                <div className="flex items-center gap-3 h-10">
                  <button
                    onClick={() => handleLinkNavigate('login')}
                    className="h-10 px-[18px] flex items-center justify-center border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-bold rounded-xl text-slate-705 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition cursor-pointer active:scale-[0.98]"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleLinkNavigate('register')}
                    className="h-10 px-5 flex items-center justify-center glossy-gradient text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-cyan-200 transition cursor-pointer hover:brightness-105 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    Get Swap Started
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu trigger button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/40 dark:border-slate-800"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-slate-400" />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-9 h-9 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panels display */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2 text-left font-display shadow-lg">
            {[
              { id: 'home', label: 'Home Page' },
              { id: 'explore', label: 'Explore Skills catalog' },
              { id: 'community', label: 'Discussion communities' },
              { id: 'about', label: 'Platform Story' },
              { id: 'contact', label: 'Help & FAQs' }
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkNavigate(link.id)}
                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                {link.label}
              </button>
            ))}

            <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setTheme(theme === 'light' ? 'dark' : 'light');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-750 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="h-4 w-4" />
                    <span>Mode Gelap</span>
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4 text-yellow-400" />
                    <span>Mode Terang</span>
                  </>
                )}
              </button>

              {currentUser ? (
                <>
                  <button
                    onClick={() => handleLinkNavigate('dashboard')}
                    className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-850 dark:text-slate-200"
                  >
                    🖥️ Go to Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-extrabold rounded-xl"
                  >
                    Logout session
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleLinkNavigate('login')}
                    className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleLinkNavigate('register')}
                    className="w-full py-2.5 glossy-gradient text-white text-xs font-bold rounded-xl text-center"
                  >
                    Register account
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* 2. Secondary Student Bar (Renders exclusively on Authorized SaaS Dashboard Views) */}
      {isDashboardPage && currentUser && (
        <div className="bg-slate-900 text-slate-100 py-3 border-b border-indigo-950 sticky top-16 z-40 select-none">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-display">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold shrink-0">
              <Sparkles className="h-4 w-4 animate-pulse shrink-0" />
              <span className="hidden sm:inline">Active Session Node:</span>
              <span className="truncate max-w-[100px] sm:max-w-none font-black text-slate-100">{currentUser.username}</span>
            </span>

            <div className="flex gap-1 overflow-x-auto pr-1">
              {[
                { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
                { id: 'portfolio', label: 'Manage Portfolio', icon: Award },
                { id: 'chat', label: 'Swap Chat Room', icon: MessageSquare },
                { id: 'profile', label: 'Node Settings', icon: Settings }
              ].map((item) => {
                const IconComp = item.icon;
                const active = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLinkNavigate(item.id)}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold cursor-pointer shrink-0 transition-colors ${
                      active 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                    }`}
                  >
                    <IconComp className="h-3.5 w-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. Primary Variable Page viewport container */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-10 px-4 md:px-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {renderPageContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. Cinematic footer */}
      {currentPage !== 'chat' && (
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pt-12 pb-8 text-left text-slate-500 dark:text-slate-400 border-b-0 select-none transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl glossy-gradient flex items-center justify-center shadow">
                  <Sparkles className="h-4.5 w-4.5 text-white" />
                </div>
                <span className="font-display font-black text-slate-900 dark:text-white text-base">SkillSwap</span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed max-w-xs">
                A futuristic peer learning architecture building collaborative college networks of knowledge bartering.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-display text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Domains</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><button onClick={() => handleExploreSkillShortcut('Python')} className="hover:text-blue-500 dark:hover:text-blue-450 transition cursor-pointer">Software development</button></li>
                <li><button onClick={() => handleExploreSkillShortcut('Figma')} className="hover:text-blue-500 dark:hover:text-blue-450 transition cursor-pointer">UI/UX Design Systems</button></li>
                <li><button onClick={() => handleExploreSkillShortcut('Copywriting')} className="hover:text-blue-500 dark:hover:text-blue-450 transition cursor-pointer">Digital Copywriters</button></li>
                <li><button onClick={() => handleExploreSkillShortcut('Blender 3D')} className="hover:text-blue-500 dark:hover:text-blue-450 transition cursor-pointer">3D Modelling</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-display text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Platform</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><button onClick={() => handleLinkNavigate('about')} className="hover:text-blue-500 dark:hover:text-blue-450 transition cursor-pointer">Platform Story</button></li>
                <li><button onClick={() => handleLinkNavigate('community')} className="hover:text-blue-500 dark:hover:text-blue-450 transition cursor-pointer">Active Forums</button></li>
                <li><button onClick={() => handleLinkNavigate('contact')} className="hover:text-blue-500 dark:hover:text-blue-450 transition cursor-pointer">Help & FAQ logs</button></li>
                <li><button onClick={() => handleLinkNavigate('register')} className="hover:text-blue-500 dark:hover:text-blue-450 transition cursor-pointer">Onboard New Node</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-display text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">System Legal</h4>
              <ul className="space-y-1.5 text-[11px] text-slate-400/95 dark:text-slate-500 leading-relaxed">
                <li>Terms of Peer Service</li>
                <li>Barter Integrity code</li>
                <li>Non-Commercial usage</li>
                <li>© 2026 SkillSwap.edu</li>
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 dark:border-slate-800 mt-10 pt-6 flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500">
            <span>Building collaborative intellectual networks. Stanford dormitory cluster launch.</span>
            <span>Version 2.4.0 Alpha Node active</span>
          </div>
        </footer>
      )}
    </div>
  );
}
