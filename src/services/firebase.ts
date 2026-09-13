import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { User, Post, Story, Note, Message, Report, Comment } from '../types';

// Initialize Firebase SDK
export const app = initializeApp(firebaseConfig);

// CRITICAL: Must pass firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Error Handling Infrastructure (Skill Mandated)
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const currentUser = auth.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo: currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection Healthcheck (Skill Mandated)
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase connection test succeeded');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration (client is offline).');
    } else {
      console.log('Firebase healthcheck passed or initialized');
    }
    return false;
  }
}

// Execute connection test on startup
testConnection();

// Authentication helpers
export async function signInWithGoogle(): Promise<FirebaseUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In failed:', error);
    throw error;
  }
}

export async function logOutFirebase(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

// Firestore Database Sync Services
export const FirebaseService = {
  // Sync User Profile
  async syncUserProfile(user: User): Promise<void> {
    const path = `users/${user.id}`;
    try {
      await setDoc(
        doc(db, 'users', user.id),
        {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          bio: user.bio || '',
          badge: user.badge || '',
          gender: user.gender || 'other',
          bodyStorySummary: user.bodyStorySummary || '',
          role: user.role || 'user',
          isAgeVerified: !!user.isAgeVerified,
          ageVerificationStatus: user.ageVerificationStatus || 'unverified',
          followersCount: user.followersCount || 0,
          followingCount: user.followingCount || 0,
          postsCount: user.postsCount || 0,
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );

      if (user.email) {
        await setDoc(
          doc(db, `users/${user.id}/private`, 'info'),
          {
            email: user.email,
            authProvider: user.authProvider || 'google',
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Add / Sync Post
  async savePost(post: Post): Promise<void> {
    const path = `posts/${post.id}`;
    try {
      await setDoc(
        doc(db, 'posts', post.id),
        {
          id: post.id,
          userId: post.userId,
          userName: post.user.name,
          userAvatar: post.user.avatar,
          imageUrl: post.imageUrl,
          caption: post.caption || '',
          bodyJourney: post.bodyJourney || '',
          tags: post.tags?.join(',') || '',
          isSensitive: !!post.isSensitive,
          moderationEnforced18: !!post.moderationEnforced18,
          isRemoved: !!post.isRemoved,
          likesCount: post.likesCount || 0,
          hugCount: post.hugCount || 0,
          createdAt: post.createdAt || new Date().toISOString(),
          originalLanguage: post.originalLanguage || 'fa',
        },
        { merge: true }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Save Story
  async saveStory(story: Story): Promise<void> {
    const path = `stories/${story.id}`;
    try {
      await setDoc(
        doc(db, 'stories', story.id),
        {
          id: story.id,
          userId: story.userId,
          userName: story.user.name,
          userAvatar: story.user.avatar,
          mediaUrl: story.mediaUrl,
          caption: story.caption || '',
          isSensitive: !!story.isSensitive,
          isRemoved: !!story.isRemoved,
          createdAt: story.createdAt || new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Save Note
  async saveNote(note: Note): Promise<void> {
    const path = `notes/${note.id}`;
    try {
      await setDoc(
        doc(db, 'notes', note.id),
        {
          id: note.id,
          userId: note.userId,
          userName: note.user.name,
          userAvatar: note.user.avatar,
          text: note.text,
          moodEmoji: note.moodEmoji || '🌿',
          createdAt: note.createdAt || new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Save Message
  async saveMessage(msg: Message): Promise<void> {
    const path = `messages/${msg.id}`;
    try {
      await setDoc(
        doc(db, 'messages', msg.id),
        {
          id: msg.id,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          text: msg.text || '',
          mediaUrl: msg.mediaUrl || '',
          mediaType: msg.mediaType || 'image',
          read: !!msg.read,
          isRemoved: !!msg.isRemoved,
          createdAt: msg.createdAt || new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Submit Report
  async submitReport(report: Report): Promise<void> {
    const path = `reports/${report.id}`;
    try {
      await setDoc(
        doc(db, 'reports', report.id),
        {
          id: report.id,
          reporterId: report.reporterId,
          reporterName: report.reporterName,
          targetType: report.targetType,
          targetId: report.targetId,
          targetPreview: report.targetPreview || '',
          targetUserId: report.targetUserId,
          targetUserName: report.targetUserName,
          reason: report.reason,
          description: report.description || '',
          status: report.status || 'pending',
          createdAt: report.createdAt || new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
};
