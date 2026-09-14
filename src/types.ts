/**
 * @file types.ts
 * @description Global TypeScript definitions and domain models for NotPerfect.
 * Defines models for Users, Posts, Stories, Moderation Reports, Age Verifications,
 * Empathetic Reactions, Direct Messages, and Localization types.
 */

/**
 * Standardized reasons for reporting content or users to maintain community psychological safety.
 */
export type ReportReason =
  | 'body_shaming'          // Shaming, critical comments about appearance, weight, scars, etc.
  | 'harassment'           // Unsolicited DMs, intimidation, or aggressive behavior
  | 'missing_18_tag'       // Exposed sensitive or intimate imagery posted without the required +18 tag
  | 'unsolicited_explicit' // Inappropriate sexual remarks or unsolicited explicit materials
  | 'hate_speech'          // Discriminatory slurs or prejudice based on race, gender, ability, etc.
  | 'other';               // General safety violations

/**
 * Target entity types that can be flagged by community members.
 */
export type ReportTargetType = 'post' | 'comment' | 'message' | 'user';

/**
 * Lifecycle status of a submitted community moderation report.
 */
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

/**
 * Moderation actions executable by community moderators or automated safety rules.
 */
export type ModerationActionType =
  | 'warn_user'       // Send an educational warning notification to the target user
  | 'remove_content'  // Soft-delete or unpublish the flagged entity
  | 'enforce_18_tag'  // Retroactively apply the +18 sensitive blur tag
  | 'ban_user'        // Suspend user access to the sanctuary
  | 'dismiss';        // Clear report if no violation was identified

/**
 * Represents an individual moderation report record.
 */
export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: ReportTargetType;
  targetId: string;
  targetPreview: string;
  targetUserId: string;
  targetUserName: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  createdAt: string;
  resolvedAction?: ModerationActionType;
  moderatorNotes?: string;
}

/**
 * Empathetic micro-reaction types replacing traditional superficial "likes".
 * - hug: Comforting presence and solidarity
 * - love: Heartfelt appreciation and acceptance
 * - courage: Honoring bravery in vulnerability
 * - peace: Calming reassurance and gentleness
 * - bloom: Celebrating personal healing and metamorphosis
 */
export type ReactionType = 'hug' | 'love' | 'courage' | 'peace' | 'bloom';

/**
 * Aggregated counters for each empathetic micro-reaction.
 */
export interface ReactionCounts {
  hug: number;
  love: number;
  courage: number;
  peace: number;
  bloom: number;
}

/**
 * Age verification status ensuring +18 sensitive content is ethically guarded.
 */
export type AgeVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

/**
 * Record for video/snapshot selfie verification with challenge phrase prompts.
 */
export interface VideoVerification {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  videoUrl?: string;
  snapshotUrl?: string;
  randomPhrase: string;       // Unique spoken/read challenge phrase to prevent spoofing
  verificationCode: string;   // 4-digit temporary verification security code
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: string;
  reviewerNotes?: string;
}

/**
 * Core User Profile model.
 */
export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  avatarSource?: 'curated' | 'upload' | 'default';
  bio: string;
  badge?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
  gender: 'female' | 'male' | 'other';
  bodyStorySummary?: string;   // Short personal body acceptance milestone
  isBanned?: boolean;
  warnings?: string[];
  role?: 'user' | 'moderator' | 'admin';

  // Age verification attributes for accessing +18 sensitive content
  isAgeVerified: boolean;
  ageVerificationStatus: AgeVerificationStatus;
  verificationMethod?: 'google' | 'video';
  verificationVideoUrl?: string;
  verificationDate?: string;
  email?: string;
  authProvider?: 'email' | 'google' | 'demo';
}

/**
 * Threaded comment on an authentic post.
 */
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
  isOwner?: boolean;
  isRemoved?: boolean;
}

/**
 * Main unretouched Post item in the feed.
 */
export interface Post {
  id: string;
  userId: string;
  user: User;
  imageUrl: string;
  caption: string;
  bodyJourney: string;               // The candid story behind the physical mark or milestone
  tags: string[];
  isSensitive: boolean;              // +18 flag for exposed, surgical, or intimate photos
  moderationEnforced18?: boolean;    // Marked by moderators if author forgot the tag
  isRemoved?: boolean;
  likesCount: number;
  isLiked?: boolean;
  hugCount: number;
  isHugged?: boolean;
  reactions: ReactionCounts;
  userReactions: ReactionType[];
  comments: Comment[];
  createdAt: string;
  saved?: boolean;
  originalLanguage?: AppLanguage;
}

/**
 * 24-hour visual Story item with automatic progression.
 */
export interface Story {
  id: string;
  userId: string;
  user: User;
  mediaUrl: string;
  caption?: string;
  createdAt: string;
  viewed?: boolean;
  isSensitive?: boolean;
  isRemoved?: boolean;
}

/**
 * 24-hour quick mood check-in status note displayed horizontally above the feed.
 */
export interface Note {
  id: string;
  userId: string;
  user: User;
  text: string;
  moodEmoji: string;
  createdAt: string;
}

/**
 * Direct message exchanged in private sanctuary chat.
 */
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'audio' | 'file';
  audioDuration?: number;   // Duration in seconds for recorded voice notes
  fileName?: string;
  fileSize?: string;
  createdAt: string;
  read?: boolean;
  isRemoved?: boolean;
  isReported?: boolean;
}

/**
 * Aggregated conversation thread summary.
 */
export interface Conversation {
  id: string;
  participant: User;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

/**
 * Sanctuary Voice/Video call simulation state.
 */
export interface CallState {
  isOpen: boolean;
  type: 'voice' | 'video';
  user: User | null;
  status: 'calling' | 'connected' | 'ended';
  duration: number;        // Active duration in seconds
  isMuted: boolean;
  isVideoOff: boolean;
}

/**
 * Supported internationalization locales:
 * - fa: Persian (Farsi) — RTL
 * - en: English — LTR
 * - es: Spanish (Español) — LTR
 * - ar: Arabic (العربية) — RTL
 * - fr: French (Français) — LTR
 */
export type AppLanguage = 'fa' | 'en' | 'es' | 'ar' | 'fr';

/**
 * Modes supported by the unified authentication modal.
 */
export type AuthMode = 'login' | 'signup' | 'forgot';

/**
 * Active user session representation.
 */
export interface AuthSession {
  userId: string;
  provider: 'email' | 'google' | 'demo';
  loginAt: string;
}
