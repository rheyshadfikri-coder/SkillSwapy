/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Skill {
  id: string;
  userId: string;
  name: string;
  type: 'teach' | 'learn';
  level?: 'beginner' | 'intermediate' | 'expert';
}

export interface User {
  id: string;
  username: string;
  email: string;
  bio: string;
  profileImage: string;
  title?: string;
  location?: string;
  reputationBadge?: string; // e.g. "Top Mentor", "Super Learner", "Community Helper"
  xp: number;
  level: number;
  interests: string[];
  skills: Skill[];
  socialLinks?: {
    website?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  type?: 'text' | 'image' | 'file';
  attachmentUrl?: string;
  attachmentName?: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewedUserId: string;
  rating: number; // 1 to 5
  comment: string;
  timestamp: string;
}

export interface DiscussionGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  membersCount: number;
  icon: string;
}

export interface DiscussionPost {
  id: string;
  groupId: string;
  userId: string;
  username: string;
  userImage: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  likedByUser?: boolean;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  certificate?: string; // custom upload
  likes: number;
}

export interface Session {
  id: string;
  mentorId: string;
  learnerId: string;
  skillName: string;
  scheduledTime: string;
  status: 'pending' | 'ongoing' | 'completed' | 'cancelled';
  duration: number; // minutes
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}
