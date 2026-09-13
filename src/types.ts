export type ReportReason =
  | 'body_shaming'
  | 'harassment'
  | 'missing_18_tag'
  | 'unsolicited_explicit'
  | 'hate_speech'
  | 'other';

export type ReportTargetType = 'post' | 'comment' | 'message' | 'user';

export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export type ModerationActionType =
  | 'warn_user'
  | 'remove_content'
  | 'enforce_18_tag'
  | 'ban_user'
  | 'dismiss';

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

export type ReactionType = 'hug' | 'love' | 'courage' | 'peace' | 'bloom';

export interface ReactionCounts {
  hug: number;
  love: number;
  courage: number;
  peace: number;
  bloom: number;
}

export type AgeVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface VideoVerification {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  videoUrl?: string;
  snapshotUrl?: string;
  randomPhrase: string;
  verificationCode: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: string;
  reviewerNotes?: string;
}

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
  bodyStorySummary?: string;
  isBanned?: boolean;
  warnings?: string[];
  role?: 'user' | 'moderator' | 'admin';
  // Age verification for +18 content
  isAgeVerified: boolean;
  ageVerificationStatus: AgeVerificationStatus;
  verificationMethod?: 'google' | 'video';
  verificationVideoUrl?: string;
  verificationDate?: string;
  email?: string;
  authProvider?: 'email' | 'google' | 'demo';
}

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

export interface Post {
  id: string;
  userId: string;
  user: User;
  imageUrl: string;
  caption: string;
  bodyJourney: string; // The honest personal story behind the body feature
  tags: string[];
  isSensitive: boolean; // +18 tag for sensitive / more exposed photos
  moderationEnforced18?: boolean;
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

export interface Note {
  id: string;
  userId: string;
  user: User;
  text: string;
  moodEmoji: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'audio' | 'file';
  audioDuration?: number;
  fileName?: string;
  fileSize?: string;
  createdAt: string;
  read?: boolean;
  isRemoved?: boolean;
  isReported?: boolean;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface CallState {
  isOpen: boolean;
  type: 'voice' | 'video';
  user: User | null;
  status: 'calling' | 'connected' | 'ended';
  duration: number;
  isMuted: boolean;
  isVideoOff: boolean;
}

export type AppLanguage = 'fa' | 'en' | 'es' | 'ar' | 'fr';

export type AuthMode = 'login' | 'signup' | 'forgot';

export interface AuthSession {
  userId: string;
  provider: 'email' | 'google' | 'demo';
  loginAt: string;
}
