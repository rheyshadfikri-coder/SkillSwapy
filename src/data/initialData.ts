/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Skill, DiscussionGroup, DiscussionPost, Project, Review, Message, Achievement } from '../types';

export const POPULAR_CATEGORIES = [
  { id: 'design', name: 'UI/UX Design', color: 'from-blue-400 to-cyan-400', count: 124 },
  { id: 'coding', name: 'Software Development', color: 'from-cyan-400 to-indigo-400', count: 210 },
  { id: 'marketing', name: 'Digital Growth', color: 'from-purple-400 to-pink-400', count: 85 },
  { id: 'writing', name: 'Content & Writing', color: 'from-pink-400 to-orange-400', count: 42 },
  { id: 'languages', name: 'Languages & Speech', color: 'from-teal-400 to-emerald-400', count: 68 },
  { id: 'music', name: 'Audio & Music Production', color: 'from-orange-400 to-red-400', count: 37 }
];

export const INITIAL_SKILLS: Skill[] = [
  // User 1: Alice (Python, PyTorch -> Design)
  { id: 'sk_1', userId: 'usr_alice', name: 'Python Automation & Web Scraping', type: 'teach', level: 'expert' },
  { id: 'sk_2', userId: 'usr_alice', name: 'PyTorch Deep Learning', type: 'teach', level: 'intermediate' },
  { id: 'sk_3', userId: 'usr_alice', name: 'Figma Prototyping', type: 'learn', level: 'beginner' },
  { id: 'sk_4', userId: 'usr_alice', name: 'NextJS Development', type: 'learn', level: 'beginner' },

  // User 2: Brandon (Figma UI, Tailwind CSS -> Web Dev)
  { id: 'sk_5', userId: 'usr_brandon', name: 'Figma UI/UX & Design Systems', type: 'teach', level: 'expert' },
  { id: 'sk_6', userId: 'usr_brandon', name: 'Typography & Layout Composition', type: 'teach', level: 'expert' },
  { id: 'sk_7', userId: 'usr_brandon', name: 'React State Management', type: 'learn', level: 'intermediate' },
  { id: 'sk_8', userId: 'usr_brandon', name: 'Node.js Express Backend', type: 'learn', level: 'beginner' },

  // User 3: Chloe (Copywriting, Video Editing -> 3D Rendering)
  { id: 'sk_9', userId: 'usr_chloe', name: 'Creative Copywriting & Branding', type: 'teach', level: 'expert' },
  { id: 'sk_10', userId: 'usr_chloe', name: 'Cinematic Video Editing (Premiere)', type: 'teach', level: 'intermediate' },
  { id: 'sk_11', userId: 'usr_chloe', name: '3D Modeling in Blender', type: 'learn', level: 'beginner' },

  // User 4: David (Web & Mobile, React -> Public Speaking)
  { id: 'sk_12', userId: 'usr_david', name: 'React Native Cross-Platform App Dev', type: 'teach', level: 'expert' },
  { id: 'sk_13', userId: 'usr_david', name: 'TypeScript & Architectural Coding', type: 'teach', level: 'expert' },
  { id: 'sk_14', userId: 'usr_david', name: 'Public Speaking & Presentation', type: 'learn', level: 'intermediate' },

  // User 5: Emily (Data Science -> Creative Writing)
  { id: 'sk_15', userId: 'usr_emily', name: 'SQL Query Tuning & Architecture', type: 'teach', level: 'expert' },
  { id: 'sk_16', userId: 'usr_emily', name: 'Data Visualization & D3.js', type: 'teach', level: 'intermediate' },
  { id: 'sk_17', userId: 'usr_emily', name: 'Creative Writing & Novel Drafting', type: 'learn', level: 'beginner' }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_alice',
    username: 'Alice Jin',
    email: 'alice.jin@skillswap.edu',
    bio: 'Computer Science sophomore at Stanford. Love hacking custom scrapers and creating miniature ML models. Looking to transition from terminal scripts to stunning frontend mockups.',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    title: 'Python scripter and ML Tinkerer',
    location: 'Stanford, California',
    reputationBadge: 'Python Prodigy',
    xp: 2450,
    level: 5,
    interests: ['AI Research', 'Algorithmic Art', 'Indie Hacking'],
    skills: [], // will merge below
    availabilities: ['Tuesday 13:00 - 15:00', 'Thursday 15:00 - 17:00'],
    calendarEnabled: true,
    socialLinks: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 'usr_brandon',
    username: 'Brandon Lee',
    email: 'brandon.design@skillswap.edu',
    bio: 'Visual Arts senior at Rhode Island School of Design. Designing modern SaaS wireframes and design systems. Want to bring my interfaces to life with interactive React code.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    title: 'Visual UI Designer & System Architect',
    location: 'Providence, Rhode Island',
    reputationBadge: 'Creative Mentor',
    xp: 3820,
    level: 7,
    interests: ['Framer UI', 'Cinema 4D', 'Minimalist Architecture'],
    skills: [],
    availabilities: ['Monday 09:00 - 11:00', 'Wednesday 13:00 - 15:00', 'Friday 15:00 - 17:00'],
    calendarEnabled: true,
    socialLinks: {
      website: 'https://behance.net',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    }
  },
  {
    id: 'usr_chloe',
    username: 'Chloe Smith',
    email: 'chloe.content@skillswap.edu',
    bio: 'Freelance copywriting manager & video editor. Helping tech squads articulate their product-market-fit message. Currently highly interested in adding spatial Blender 3D concepts to my skillset.',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    title: 'Creative Copywriter & Cinematic Editor',
    location: 'Austin, Texas',
    reputationBadge: 'Storytelling Wiz',
    xp: 1840,
    level: 4,
    interests: ['Content Strategy', 'Indie Filmmaking', 'Crypto Architecture'],
    skills: [],
    availabilities: ['Monday 15:00 - 17:00', 'Wednesday 15:00 - 17:00'],
    calendarEnabled: true,
    socialLinks: {
      twitter: 'https://twitter.com',
      website: 'https://medium.com'
    }
  },
  {
    id: 'usr_david',
    username: 'David Miller',
    email: 'david.dev@skillswap.edu',
    bio: 'Engineering Lead in an EdTech start-up. Coder of scalable React frameworks. Happy to share system design skills in exchange for confidence in speech training & deck presenting.',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    title: 'EdTech Lead & Fullstack Specialist',
    location: 'Seattle, Washington',
    reputationBadge: 'Super Mentor',
    xp: 5120,
    level: 10,
    interests: ['Scalable Web', 'IoT Platforms', 'Coffee Brewing'],
    skills: [],
    availabilities: ['Tuesday 09:00 - 11:00', 'Thursday 09:00 - 11:00'],
    calendarEnabled: true,
    socialLinks: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: 'usr_emily',
    username: 'Emily Watson',
    email: 'emily.watson@skillswap.edu',
    bio: 'Analytics director and query optimize engineer. I analyze database speeds and create sleek D3 charts. Searching for creative novelists to help refine my draft-level fiction writing skills!',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    title: 'Database Architect & D3 Chart Guru',
    location: 'Boston, Massachusetts',
    reputationBadge: 'Database Wizard',
    xp: 2900,
    level: 6,
    interests: ['D3 Diagrams', 'PostgreSQL Internals', 'Sci-fi Novels'],
    skills: [],
    availabilities: ['Friday 09:00 - 11:00', 'Saturday 13:00 - 15:00'],
    calendarEnabled: true,
    socialLinks: {
      github: 'https://github.com',
      website: 'https://observablehq.com'
    }
  }
];

// Populate skills inside corresponding user references
INITIAL_USERS.forEach(u => {
  u.skills = INITIAL_SKILLS.filter(s => s.userId === u.id);
});

export const INITIAL_DISCUSSIONS: DiscussionGroup[] = [
  { id: 'g_1', name: 'Software Development & Algorithms', description: 'Exchange React bugs, Python tricks, server-side design ideas, and review code blocks.', category: 'coding', membersCount: 1420, icon: 'code' },
  { id: 'g_2', name: 'Visual Interface & Layout Architecture', description: 'Post your glassmorphism grids, landing screen mockups, and typography combinations.', category: 'design', membersCount: 980, icon: 'palette' },
  { id: 'g_3', name: 'Startup Networking & Growth Hacking', description: 'Learn how to secure your first 1,000 platform signups on a shoestring budget.', category: 'marketing', membersCount: 740, icon: 'rocket' }
];

export const INITIAL_POSTS: DiscussionPost[] = [
  {
    id: 'post_1',
    groupId: 'g_1',
    userId: 'usr_alice',
    username: 'Alice Jin',
    userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    content: '🚀 Quick trick for anyone doing web scraping: When using requests, always supply a realistic User-Agent header or sites will block you at step 1. Better yet, check out playwright-stealth if you want to bypass anti-bot captures seamlessly!',
    likes: 24,
    comments: 5,
    timestamp: '2 hours ago'
  },
  {
    id: 'post_2',
    groupId: 'g_2',
    userId: 'usr_brandon',
    username: 'Brandon Lee',
    userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    content: '🎨 Just updated my portfolio with a glassmorphism dashboard system. The secret to smooth glass effects is adding a tiny white outline border with 10% opacity and setting simple backdrop-blur-md inside CSS. Let me know what you think!',
    likes: 42,
    comments: 11,
    timestamp: '1 day ago'
  },
  {
    id: 'post_3',
    groupId: 'g_3',
    userId: 'usr_chloe',
    username: 'Chloe Smith',
    userImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    content: '💡 Don’t overcomplicate your landing text! The best taglines are super simple: "Problem statement. How we solve it." E.g. "Trade Skills. Learn Together." Speak directly to what your user gets in 2 seconds of scroll time.',
    likes: 31,
    comments: 4,
    timestamp: '3 days ago'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_1',
    userId: 'usr_brandon',
    title: 'VividFin SaaS Dashboard Layout',
    description: 'An interactive portfolio featuring glassmorphism elements, custom analytics charts, dark/light grid transitions, and premium widgets.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400',
    category: 'UI/UX Design',
    tags: ['Figma', 'Glassmorphism', 'SaaS Layout'],
    likes: 85,
    certificate: 'Figma Systems master certification'
  },
  {
    id: 'proj_2',
    userId: 'usr_alice',
    title: 'Async Scraper Pipeline for Real Estate',
    description: 'A robust python background process built on asyncio and Beautiful Soup, extracting real estate values and saving structured data as JSON files.',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400',
    category: 'Software Development',
    tags: ['Python', 'BeautifulSoup', 'Data Extraction'],
    likes: 64,
    certificate: 'Stanford CS224 Web Pipelines Certificate'
  },
  {
    id: 'proj_3',
    userId: 'usr_chloe',
    title: 'Product Storybook for Fintech App',
    description: 'Drafted 5 key email landing structures, product-to-brand transitions, and micro-copy that expanded subscriber metrics by 44%.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400',
    category: 'Content & Writing',
    tags: ['Branding', 'Copywriting', 'E-commerce'],
    likes: 47
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    reviewerId: 'usr_alice',
    reviewedUserId: 'usr_brandon',
    rating: 5,
    comment: 'Brandon is a spectacular designer! He walked me through typography selection rules and explained bounding grids. I feel so much more structured when sketching website containers now.',
    timestamp: 'May 28, 2026'
  },
  {
    id: 'rev_2',
    reviewerId: 'usr_brandon',
    reviewedUserId: 'usr_alice',
    rating: 5,
    comment: 'Alice explained Python selectors so well! I finally understand the difference between beautifulsoup parsing and actual browser simulations like selenium. Highly efficient sessions!',
    timestamp: 'June 01, 2026'
  },
  {
    id: 'rev_3',
    reviewerId: 'usr_chloe',
    reviewedUserId: 'usr_david',
    rating: 5,
    comment: 'David was super patience. He guided me on how to initialize state arrays in React Native and why key values must be unique. Absolute expert coder!',
    timestamp: 'June 03, 2026'
  }
];

export const INITIAL_MESSAGES: Message[] = [
  // Conversation Brandon <-> Alice
  { id: 'm_1', senderId: 'usr_brandon', receiverId: 'usr_alice', message: 'Hey Alice! I checked your code repository for that movie web scraper. It works perfectly! Can you help me hook it up to a node runner next?', timestamp: '2026-06-05T14:30:00Z' },
  { id: 'm_2', senderId: 'usr_alice', receiverId: 'usr_brandon', message: 'Hey Brandon! Absolutely. We can use a Node shell script to schedule the Python runtime, or run it through child_process in Express! In our session tomorrow I can show you both methods.', timestamp: '2026-06-05T14:35:00Z' },
  { id: 'm_3', senderId: 'usr_brandon', receiverId: 'usr_alice', message: 'That sounds beautiful. In exchange, I can show you how to structure the layout with fluid Tailwind flex containers. Look forward to it!', timestamp: '2026-06-05T14:40:00Z' },

  // Conversation David <-> Chloe
  { id: 'm_4', senderId: 'usr_david', receiverId: 'usr_chloe', message: 'Hello Chloe! I would love to get your thoughts on our dashboard landing layout. Feel free to send over some copies.', timestamp: '2026-06-05T12:00:00Z' },
  { id: 'm_5', senderId: 'usr_chloe', receiverId: 'usr_david', message: 'Hi David! Definitely, I will draft 3 different emotional hooks for the header section. Let me show you how we can highlight the interactive matching engine.', timestamp: '2026-06-05T12:05:00Z' }
];

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach_1', title: 'First Swap Completed', description: 'Schedule and complete your first cooperative skill exchange session.', icon: 'Award' },
  { id: 'ach_2', title: 'Knowledge Pioneer', description: 'Add detailed skill credentials and certificates to your portfolio layout.', icon: 'Zap' },
  { id: 'ach_3', title: 'Ultimate Guide', description: 'Obtain five 5-star session ratings from different platform learners.', icon: 'ShieldAlert' },
  { id: 'ach_4', title: 'Community Spark', description: 'Contribute a valuable reference article/post to discussion forums.', icon: 'Heart' }
];

export const FAQS = [
  {
    q: 'How does SkillSwap work without transaction fees?',
    a: 'SkillSwap operates on the traditional "Time & Talent" barter economy. You teach a skill you are good at (e.g., Python automation), and in exchange, someone teaches you a skill they master (e.g., UI design). No money changes hands; knowledge is the ultimate currency!'
  },
  {
    q: 'Is it suitable for complete starters or beginners?',
    a: 'Absolutely! Our onboarding enables you to choose your current expertise level: Beginner, Intermediate, or Expert. Many mentors love helping absolute beginners because it helps reinforce their own advanced understanding.'
  },
  {
    q: 'How do learning sessions take place?',
    a: 'Once a mutual match is found, you can open private chat rooms, share links, and schedule video interactions on Google Meet, Jitsi, or Zoom directly from the collaborative dash.'
  },
  {
    q: 'What is the Reputation Badge & XP?',
    a: 'To encourage rich mentorship, users earn Experience Points (XP) whenever they answer a query, upload helpful portfolios, or receive post-session star ratings. Gaining XP unlocks badges like "Creative Mentor", "Python Prodigy", and level boosts.'
  }
];
