/**
 * @file storage.ts
 * @description Client-side persistence and data service for NotPerfect.
 * Provides resilient, typed localStorage CRUD operations for:
 * - User authentication, multiple accounts, and profile editing
 * - Ethical age-verification records (+18 content gate)
 * - Posts, stories, mood notes, and private direct messages
 * - Empathetic reactions (hug, love, courage, peace, bloom)
 * - Trust & Safety community reports and moderation actions
 */

import {
  Post,
  User,
  Story,
  Note,
  Message,
  Comment,
  Report,
  ModerationActionType,
  ReportReason,
  ReportTargetType,
  ReactionType,
  VideoVerification,
  AppLanguage,
  AuthSession,
} from '../types';
import {
  TEST_USERS,
  INITIAL_POSTS,
  INITIAL_STORIES,
  INITIAL_NOTES,
  INITIAL_MESSAGES,
} from '../data/initialData';

/**
 * Versioned localStorage keys to isolate cache updates and avoid cross-version conflicts.
 */
const STORAGE_KEYS = {
  POSTS: 'notperfect_posts_v2',
  STORIES: 'notperfect_stories_v2',
  NOTES: 'notperfect_notes_v2',
  MESSAGES: 'notperfect_messages_v2',
  USERS: 'notperfect_users_v2',
  CURRENT_USER_ID: 'notperfect_current_user_id_v2',
  REPORTS: 'notperfect_reports_v2',
  VERIFICATIONS: 'notperfect_verifications_v2',
  LANGUAGE: 'notperfect_app_lang_v2',
  AUTH_SESSION: 'notperfect_auth_session_v2',
  IS_LOGGED_IN: 'notperfect_is_logged_in_v2',
  CREDENTIALS: 'notperfect_credentials_v2',
  ACTIVE_ACCOUNTS: 'notperfect_active_accounts_v2',
};

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep_1',
    reporterId: 'user_me',
    reporterName: 'دریا کاظمی',
    targetType: 'post',
    targetId: 'post_3_sensitive',
    targetPreview: 'عکس نزدیک از بافت طبیعی پوست، خطوط کشیدگی پهلو...',
    targetUserId: 'user_sara',
    targetUserName: 'سارا شمس',
    reason: 'missing_18_tag',
    description: 'این عکس بسیار محترم و زیباست اما نیاز به تایید سن دارد تا برای کاربران کم سن محفوظ بماند.',
    status: 'pending',
    createdAt: '۱ ساعت پیش',
  },
  {
    id: 'rep_2',
    reporterId: 'user_kian',
    reporterName: 'کیان راد',
    targetType: 'comment',
    targetId: 'c_test_mock',
    targetPreview: '«چرا روی پوستت کرم نمیزنی تا بپوشونیش؟»',
    targetUserId: 'user_anonymous',
    targetUserName: 'کاربر ناشناس',
    reason: 'body_shaming',
    description: 'کامنت سرزنش‌گرانه و خلاف خط‌مشی پذیرش بدون قضاوت NotPerfect.',
    status: 'pending',
    createdAt: '۳ ساعت پیش',
  },
];

export const INITIAL_VERIFICATIONS: VideoVerification[] = [
  {
    id: 'verif_1',
    userId: 'user_kian',
    userName: 'کیان راد',
    userAvatar: TEST_USERS.kian.avatar,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-smiling-looking-at-camera-33758-large.mp4',
    snapshotUrl: TEST_USERS.kian.avatar,
    randomPhrase: 'من کیان راد هستم و در فضای امن NotPerfect تایید سن ۱۸+ انجام می‌دهم.',
    verificationCode: '8492',
    submittedAt: 'دیروز، ساعت ۱۵:۳۰',
    status: 'approved',
    reviewedAt: 'دیروز، ساعت ۱۶:۱۰',
    reviewerNotes: 'چهره با کارت هویت و سن بالای ۱۸ سال تطبیق داده شد.',
  },
];

export const StorageService = {
  // --- LANGUAGE ---
  getLanguage(): AppLanguage {
    const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as AppLanguage;
    return lang || 'en';
  },

  setLanguage(lang: AppLanguage): void {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  },

  // --- USERS ---
  getUsers(): Record<string, User> {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(TEST_USERS));
      return TEST_USERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return TEST_USERS;
    }
  },

  getCurrentUser(): User {
    const users = this.getUsers();
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user_me';
    const found = (Object.values(users) as User[]).find(u => u.id === currentId);
    return found || users.me || Object.values(users)[0] || TEST_USERS.me;
  },

  setCurrentUser(userId: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  },

  updateUserProfile(updatedUser: Partial<User>): User {
    const users = this.getUsers();
    const current = this.getCurrentUser();
    const merged: User = { ...current, ...updatedUser };

    const key = Object.keys(users).find(k => users[k].id === current.id) || 'currentUser';
    users[key] = merged;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return merged;
  },

  updateUserAvatar(userId: string, newAvatarUrl: string, source: 'cloudflare_ai' | 'upload' = 'cloudflare_ai'): User | null {
    const users = this.getUsers();
    const key = Object.keys(users).find(k => users[k].id === userId);
    if (!key) return null;
    users[key].avatar = newAvatarUrl;
    users[key].avatarSource = source;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return users[key];
  },

  setAgeVerified(userId: string, isVerified: boolean, method: 'google' | 'video' = 'google'): User | null {
    const users = this.getUsers();
    const key = Object.keys(users).find(k => users[k].id === userId);
    if (!key) return null;
    users[key].isAgeVerified = isVerified;
    users[key].ageVerificationStatus = isVerified ? 'verified' : 'unverified';
    users[key].verificationMethod = method;
    users[key].verificationDate = new Date().toLocaleDateString('fa-IR');
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return users[key];
  },

  // --- AUTHENTICATION & SESSIONS & MULTI-ACCOUNT ---
  isLoggedIn(): boolean {
    const val = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    return val === 'true';
  },

  setLoggedIn(status: boolean): void {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, status ? 'true' : 'false');
  },

  getActiveAccountIds(): string[] {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_ACCOUNTS);
    let list: string[] = [];
    if (data) {
      try {
        list = JSON.parse(data);
      } catch {
        list = [];
      }
    }
    if (list.length === 0 && this.isLoggedIn()) {
      const current = this.getCurrentUser();
      if (current && current.id) {
        list = [current.id];
        localStorage.setItem(STORAGE_KEYS.ACTIVE_ACCOUNTS, JSON.stringify(list));
      }
    }
    return list;
  },

  getActiveUsers(): User[] {
    const ids = this.getActiveAccountIds();
    const users = this.getUsers();
    const all = Object.values(users) as User[];
    return ids
      .map(id => all.find(u => u.id === id))
      .filter((u): u is User => !!u);
  },

  addActiveAccount(userId: string): void {
    let ids = this.getActiveAccountIds().filter(id => id !== userId);
    ids.unshift(userId); // placed at index 0 (most recent active)
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ACCOUNTS, JSON.stringify(ids));
    this.setCurrentUser(userId);
    this.setLoggedIn(true);
  },

  switchAccount(userId: string): User | null {
    const users = this.getUsers();
    const target = (Object.values(users) as User[]).find(u => u.id === userId);
    if (!target) return null;

    let ids = this.getActiveAccountIds().filter(id => id !== userId);
    ids.unshift(userId);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ACCOUNTS, JSON.stringify(ids));

    this.setCurrentUser(userId);
    this.setLoggedIn(true);

    const session: AuthSession = {
      userId: target.id,
      provider: target.authProvider || 'email',
      loginAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));

    return target;
  },

  logoutAccount(userId?: string): { remainingCount: number; nextUser: User | null } {
    const current = this.getCurrentUser();
    const targetId = userId || current.id;
    let ids = this.getActiveAccountIds().filter(id => id !== targetId);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ACCOUNTS, JSON.stringify(ids));

    if (ids.length > 0) {
      // Switch automatically to the previous active account that was active before this one!
      const nextId = ids[0];
      this.setCurrentUser(nextId);
      this.setLoggedIn(true);
      const users = this.getUsers();
      const nextUser = (Object.values(users) as User[]).find(u => u.id === nextId) || null;
      if (nextUser) {
        const session: AuthSession = {
          userId: nextUser.id,
          provider: nextUser.authProvider || 'email',
          loginAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
      }
      return { remainingCount: ids.length, nextUser };
    } else {
      // No remaining accounts -> redirect to login/signup
      this.setLoggedIn(false);
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_ACCOUNTS);
      return { remainingCount: 0, nextUser: null };
    }
  },

  logoutAllAccounts(): void {
    this.setLoggedIn(false);
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_ACCOUNTS);
  },

  getAuthSession(): AuthSession | null {
    const data = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  login(identifier: string, _password?: string): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const cleanId = identifier.trim().toLowerCase().replace('@', '');

    const matched = (Object.values(users) as User[]).find(
      u =>
        u.username.toLowerCase() === cleanId ||
        (cleanId === 'darya' && u.username.toLowerCase().includes('darya')) ||
        (cleanId === 'kian' && u.username.toLowerCase().includes('kian')) ||
        (cleanId === 'niloofar' && u.username.toLowerCase().includes('niloofar')) ||
        (cleanId === 'sara' && u.username.toLowerCase().includes('sara')) ||
        (cleanId === 'armin' && u.username.toLowerCase().includes('armin')) ||
        (u.email && u.email.toLowerCase() === identifier.trim().toLowerCase()) ||
        u.name.toLowerCase() === identifier.trim().toLowerCase()
    );

    if (!matched) {
      return {
        success: false,
        error: 'حساب کاربری با این مشخصات یافت نشد. لطفاً ابتدا ثبت‌نام کنید.',
      };
    }

    this.setCurrentUser(matched.id);
    this.setLoggedIn(true);
    this.addActiveAccount(matched.id);

    const session: AuthSession = {
      userId: matched.id,
      provider: matched.authProvider || 'email',
      loginAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));

    return { success: true, user: matched };
  },

  loginWithGoogle(profile?: { email?: string; name?: string; avatar?: string }): { success: boolean; user: User } {
    const users = this.getUsers();
    const userEmail = (profile?.email || 'meitymohajeri@gmail.com').trim().toLowerCase();
    const userName = profile?.name || 'مهدی مهاجری';
    const userAvatar =
      profile?.avatar ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';

    let matched = (Object.values(users) as User[]).find(
      u =>
        (u.email && u.email.toLowerCase() === userEmail) ||
        u.username.toLowerCase() === userEmail.split('@')[0].toLowerCase()
    );

    if (!matched) {
      const newUserId = 'user_google_' + Date.now();
      const newUserKey = 'google_' + Date.now();
      matched = {
        id: newUserId,
        name: userName,
        username: userEmail.split('@')[0] || 'meity_google',
        email: userEmail,
        avatar: userAvatar,
        avatarSource: 'curated',
        bio: 'همسفر پذیرش زیبایی واقعی و رهایی از استانداردهای دروغین بدن 🌿🕊️',
        badge: 'عضو تایید شده با گوگل 🌟',
        followersCount: 1,
        followingCount: 3,
        postsCount: 0,
        isFollowing: false,
        gender: 'male',
        bodyStorySummary: 'سفر شخصی پذیرش و مهرورزی با تن',
        isAgeVerified: true,
        ageVerificationStatus: 'verified',
        verificationMethod: 'google',
        authProvider: 'google',
      };
      users[newUserKey] = matched;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } else {
      matched.isAgeVerified = true;
      matched.ageVerificationStatus = 'verified';
      matched.verificationMethod = 'google';
      matched.authProvider = 'google';
      if (!matched.email) matched.email = userEmail;
      const key = Object.keys(users).find(k => users[k].id === matched!.id) || 'currentUser';
      users[key] = matched;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    this.setCurrentUser(matched.id);
    this.setLoggedIn(true);
    this.addActiveAccount(matched.id);

    const session: AuthSession = {
      userId: matched.id,
      provider: 'google',
      loginAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));

    return { success: true, user: matched };
  },

  signup(params: {
    name: string;
    username: string;
    email: string;
    password?: string;
    bio?: string;
    bodyStorySummary?: string;
    avatar?: string;
  }): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const cleanUsername = params.username.trim().toLowerCase().replace('@', '');
    const cleanEmail = params.email.trim().toLowerCase();

    const usernameTaken = (Object.values(users) as User[]).some(
      u => u.username.toLowerCase() === cleanUsername
    );
    if (usernameTaken) {
      return { success: false, error: 'این نام کاربری قبلاً استفاده شده است.' };
    }

    const emailTaken = (Object.values(users) as User[]).some(
      u => u.email && u.email.toLowerCase() === cleanEmail
    );
    if (emailTaken) {
      return { success: false, error: 'این ایمیل قبلاً ثبت شده است. لطفاً وارد شوید.' };
    }

    const newUserId = 'user_' + Date.now();
    const newUserKey = 'registered_' + Date.now();

    const newUser: User = {
      id: newUserId,
      name: params.name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      avatar:
        params.avatar ||
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      avatarSource: 'curated',
      bio: params.bio?.trim() || 'عضو جدید خانواده NotPerfect، در جستجوی زیبایی اصیل و پذیرش تن 🌿',
      badge: 'همسفر جدید خانواده 🌱',
      followersCount: 0,
      followingCount: 4,
      postsCount: 0,
      gender: 'other',
      bodyStorySummary: params.bodyStorySummary?.trim() || 'روایت آغازین پذیرش تن',
      isAgeVerified: false,
      ageVerificationStatus: 'unverified',
      authProvider: 'email',
    };

    users[newUserKey] = newUser;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    this.setCurrentUser(newUserId);
    this.setLoggedIn(true);
    this.addActiveAccount(newUserId);

    const session: AuthSession = {
      userId: newUserId,
      provider: 'email',
      loginAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));

    return { success: true, user: newUser };
  },

  logout(): void {
    this.logoutAccount();
  },

  toggleFollow(targetUserId: string): boolean {
    const users = this.getUsers();
    const key = Object.keys(users).find(k => users[k].id === targetUserId);
    if (!key) return false;
    const isNowFollowing = !users[key].isFollowing;
    users[key].isFollowing = isNowFollowing;
    users[key].followersCount += isNowFollowing ? 1 : -1;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return isNowFollowing;
  },

  // --- POSTS ---
  getPosts(): Post[] {
    const data = localStorage.getItem(STORAGE_KEYS.POSTS);
    let postsList: Post[] = [];
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
      postsList = INITIAL_POSTS;
    } else {
      try {
        postsList = JSON.parse(data);
        if (!Array.isArray(postsList)) {
          postsList = INITIAL_POSTS;
        } else if (postsList.length < INITIAL_POSTS.length) {
          // Merge missing initial posts into existing list
          const existingIds = new Set(postsList.map(p => p.id));
          const missing = INITIAL_POSTS.filter(p => !existingIds.has(p.id));
          if (missing.length > 0) {
            postsList = [...postsList, ...missing];
            localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(postsList));
          }
        }
      } catch {
        postsList = INITIAL_POSTS;
      }
    }
    const users = this.getUsers();
    const defaultUser = users.currentUser || users.me || TEST_USERS.currentUser;

    // Ensure all posts have valid user object, avatar, and reactions structure
    return postsList.map(p => {
      let postUser = p.user;
      if (!postUser || !postUser.avatar) {
        const found = (Object.values(users) as User[]).find(u => u.id === p.userId);
        postUser = found || defaultUser;
      }
      return {
        ...p,
        originalLanguage: p.originalLanguage || 'fa',
        user: postUser,
        reactions: p.reactions || {
          hug: p.hugCount || 10,
          love: p.likesCount || 10,
          courage: 5,
          peace: 5,
          bloom: 5,
        },
        userReactions: p.userReactions || (p.isHugged ? ['hug'] : []),
        comments: (p.comments || []).map(c => ({
          ...c,
          userAvatar: c.userAvatar || defaultUser.avatar,
        })),
      };
    });
  },

  createPost(post: Omit<Post, 'id' | 'createdAt' | 'likesCount' | 'hugCount' | 'reactions' | 'userReactions' | 'comments'>): Post {
    const posts = this.getPosts();
    const currentLang = this.getLanguage();
    const newPost: Post = {
      ...post,
      originalLanguage: post.originalLanguage || currentLang || 'fa',
      id: 'post_' + Date.now(),
      likesCount: 0,
      hugCount: 1,
      isHugged: true,
      reactions: {
        hug: 1,
        love: 0,
        courage: 1,
        peace: 0,
        bloom: 0,
      },
      userReactions: ['hug'],
      comments: [],
      createdAt: 'همین الان',
    };
    posts.unshift(newPost);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));

    const users = this.getUsers();
    const userKey = Object.keys(users).find(k => users[k].id === post.userId);
    if (userKey) {
      users[userKey].postsCount = (users[userKey].postsCount || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    return newPost;
  },

  toggleLike(postId: string): Post | null {
    return this.toggleReaction(postId, 'love');
  },

  toggleHug(postId: string): Post | null {
    return this.toggleReaction(postId, 'hug');
  },

  toggleReaction(postId: string, reactionType: ReactionType): Post | null {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return null;

    if (!post.reactions) {
      post.reactions = { hug: 0, love: 0, courage: 0, peace: 0, bloom: 0 };
    }
    if (!post.userReactions) {
      post.userReactions = [];
    }

    const hasReaction = post.userReactions.includes(reactionType);
    if (hasReaction) {
      post.userReactions = post.userReactions.filter(r => r !== reactionType);
      post.reactions[reactionType] = Math.max(0, (post.reactions[reactionType] || 1) - 1);
    } else {
      post.userReactions.push(reactionType);
      post.reactions[reactionType] = (post.reactions[reactionType] || 0) + 1;
    }

    // sync legacy fields
    post.isHugged = post.userReactions.includes('hug');
    post.hugCount = post.reactions.hug;
    post.isLiked = post.userReactions.includes('love');
    post.likesCount = post.reactions.love;

    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    return post;
  },

  toggleSave(postId: string): Post | null {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return null;

    post.saved = !post.saved;
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    return post;
  },

  addComment(postId: string, text: string): Comment | null {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return null;

    const user = this.getCurrentUser();
    const newComment: Comment = {
      id: 'cmt_' + Date.now(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      text,
      createdAt: 'همین الان',
      isOwner: true,
    };

    post.comments.push(newComment);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    return newComment;
  },

  // --- STORIES ---
  getStories(): Story[] {
    const data = localStorage.getItem(STORAGE_KEYS.STORIES);
    let list: Story[] = [];
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(INITIAL_STORIES));
      list = INITIAL_STORIES;
    } else {
      try {
        list = JSON.parse(data);
      } catch {
        list = INITIAL_STORIES;
      }
    }
    const users = this.getUsers();
    const defaultUser = users.currentUser || users.me || TEST_USERS.currentUser;
    return list.map(s => ({
      ...s,
      user: s.user?.avatar ? s.user : (Object.values(users) as User[]).find(u => u.id === s.userId) || defaultUser,
    }));
  },

  addStory(mediaUrl: string, caption?: string): Story {
    const stories = this.getStories();
    const user = this.getCurrentUser();
    const newStory: Story = {
      id: 'story_' + Date.now(),
      userId: user.id,
      user,
      mediaUrl,
      caption,
      createdAt: 'لحظاتی پیش',
      viewed: false,
    };
    stories.unshift(newStory);
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
    return newStory;
  },

  markStoryViewed(storyId: string): void {
    const stories = this.getStories();
    const target = stories.find(s => s.id === storyId);
    if (target) {
      target.viewed = true;
      localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
    }
  },

  // --- NOTES (24h) ---
  getNotes(): Note[] {
    const data = localStorage.getItem(STORAGE_KEYS.NOTES);
    let list: Note[] = [];
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(INITIAL_NOTES));
      list = INITIAL_NOTES;
    } else {
      try {
        list = JSON.parse(data);
      } catch {
        list = INITIAL_NOTES;
      }
    }
    const users = this.getUsers();
    const defaultUser = users.currentUser || users.me || TEST_USERS.currentUser;
    return list.map(n => ({
      ...n,
      user: n.user?.avatar ? n.user : (Object.values(users) as User[]).find(u => u.id === n.userId) || defaultUser,
    }));
  },

  addNote(text: string, moodEmoji: string): Note {
    const notes = this.getNotes();
    const user = this.getCurrentUser();
    const filtered = notes.filter(n => n.userId !== user.id);

    const newNote: Note = {
      id: 'note_' + Date.now(),
      userId: user.id,
      user,
      text,
      moodEmoji,
      createdAt: 'هم‌اکنون',
    };

    filtered.unshift(newNote);
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(filtered));
    return newNote;
  },

  // --- MESSAGES ---
  getMessages(partnerId?: string): Message[] {
    const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    let all: Message[] = [];
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
      all = INITIAL_MESSAGES;
    } else {
      try {
        all = JSON.parse(data);
      } catch {
        all = INITIAL_MESSAGES;
      }
    }
    // Normalize legacy cached messages if they lack full ISO timestamps
    let hasLegacy = false;
    all = all.map(m => {
      if (!m.createdAt || !m.createdAt.includes('-')) {
        hasLegacy = true;
        if (m.id === 'm1') {
          return { ...m, createdAt: new Date(Date.now() - 86400000).toISOString() };
        }
        if (m.id === 'm2') {
          return { ...m, createdAt: new Date(Date.now() - 86400000).toISOString() };
        }
        return { ...m, createdAt: new Date().toISOString() };
      }
      return m;
    });

    if (hasLegacy) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(all));
    }

    if (partnerId) {
      const current = this.getCurrentUser();
      return all.filter(
        m =>
          (m.senderId === current.id && m.receiverId === partnerId) ||
          (m.senderId === partnerId && m.receiverId === current.id)
      );
    }
    return all;
  },

  sendMessage(params: {
    senderId: string;
    receiverId: string;
    text?: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'audio' | 'file';
    audioDuration?: number;
    fileName?: string;
    fileSize?: string;
  }): Message {
    const messages = this.getMessages();
    const newMsg: Message = {
      id: 'msg_' + Date.now(),
      ...params,
      createdAt: new Date().toISOString(),
      read: true,
    };
    messages.push(newMsg);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    return newMsg;
  },

  getSimulatedReply(receiverUser: User): string {
    const quotes = [
      'بدن ما کتاب خاطرات واقعی ماست 🌿 مرسی از پیامت.',
      'یادت باشه هر روزی که به خودت در آینه لبخند می‌زنی، یه قدم به آرامش نزدیک‌تری ✨',
      'خیلی خوشحالم که در این مسیر همراهم هستی! با هم قوی‌تریم.',
      'واقعی بودن شجاعانه‌ترین کاریه که در این دنیای پر از فیلتر می‌تونیم انجام بدیم 🤍',
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  },

  // --- MODERATION & REPORTS SYSTEM ---
  getReports(): Report[] {
    const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_REPORTS;
    }
  },

  submitReport(params: {
    targetType: ReportTargetType;
    targetId: string;
    targetPreview: string;
    targetUserId: string;
    targetUserName: string;
    reason: ReportReason;
    description?: string;
  }): Report {
    const reports = this.getReports();
    const currentUser = this.getCurrentUser();
    const newReport: Report = {
      id: 'rep_' + Date.now(),
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      targetType: params.targetType,
      targetId: params.targetId,
      targetPreview: params.targetPreview,
      targetUserId: params.targetUserId,
      targetUserName: params.targetUserName,
      reason: params.reason,
      description: params.description,
      status: 'pending',
      createdAt: 'هم‌اکنون',
    };
    reports.unshift(newReport);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    return newReport;
  },

  resolveReport(reportId: string, action: ModerationActionType, notes?: string): Report | null {
    const reports = this.getReports();
    const report = reports.find(r => r.id === reportId);
    if (!report) return null;

    report.status = 'resolved';
    report.resolvedAction = action;
    report.moderatorNotes = notes || 'توسط مدیر بررسی و رسیدگی شد.';

    // Execute action
    if (action === 'remove_content') {
      if (report.targetType === 'post') {
        const posts = this.getPosts();
        const p = posts.find(post => post.id === report.targetId);
        if (p) {
          p.isRemoved = true;
          localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
        }
      }
    } else if (action === 'enforce_18_tag') {
      if (report.targetType === 'post') {
        const posts = this.getPosts();
        const p = posts.find(post => post.id === report.targetId);
        if (p) {
          p.isSensitive = true;
          p.moderationEnforced18 = true;
          localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
        }
      }
    } else if (action === 'warn_user') {
      const users = this.getUsers();
      const userKey = Object.keys(users).find(k => users[k].id === report.targetUserId);
      if (userKey) {
        users[userKey].warnings = users[userKey].warnings || [];
        users[userKey].warnings!.push(
          `هشدار نظارتی: گزارش تخلف (${report.reason}) در تاریخ ${new Date().toLocaleDateString('fa-IR')}`
        );
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      }
    } else if (action === 'ban_user') {
      const users = this.getUsers();
      const userKey = Object.keys(users).find(k => users[k].id === report.targetUserId);
      if (userKey) {
        users[userKey].isBanned = true;
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      }
    } else if (action === 'dismiss') {
      report.status = 'dismissed';
    }

    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    return report;
  },

  // --- VIDEO VERIFICATION FOR 18+ ACCESS ---
  getVideoVerifications(): VideoVerification[] {
    const data = localStorage.getItem(STORAGE_KEYS.VERIFICATIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.VERIFICATIONS, JSON.stringify(INITIAL_VERIFICATIONS));
      return INITIAL_VERIFICATIONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_VERIFICATIONS;
    }
  },

  submitVideoVerification(params: {
    snapshotUrl?: string;
    videoUrl?: string;
    randomPhrase: string;
    verificationCode: string;
  }): VideoVerification {
    const list = this.getVideoVerifications();
    const currentUser = this.getCurrentUser();

    const newVerif: VideoVerification = {
      id: 'verif_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      videoUrl: params.videoUrl,
      snapshotUrl: params.snapshotUrl,
      randomPhrase: params.randomPhrase,
      verificationCode: params.verificationCode,
      submittedAt: 'همین الان',
      status: 'pending',
    };

    list.unshift(newVerif);
    localStorage.setItem(STORAGE_KEYS.VERIFICATIONS, JSON.stringify(list));

    // Mark current user as pending
    this.updateUserProfile({
      ageVerificationStatus: 'pending',
      verificationMethod: 'video',
      verificationVideoUrl: params.videoUrl || params.snapshotUrl,
    });

    return newVerif;
  },

  resolveVideoVerification(verifId: string, status: 'approved' | 'rejected', notes?: string): VideoVerification | null {
    const list = this.getVideoVerifications();
    const target = list.find(v => v.id === verifId);
    if (!target) return null;

    target.status = status;
    target.reviewedAt = new Date().toLocaleTimeString('fa-IR');
    target.reviewerNotes = notes || (status === 'approved' ? 'سن بالای ۱۸ سال تایید شد.' : 'تصویر ناخوانا یا عدم تطبیق چهره.');

    // Update target user's age verification
    const users = this.getUsers();
    const userKey = Object.keys(users).find(k => users[k].id === target.userId);
    if (userKey) {
      users[userKey].isAgeVerified = status === 'approved';
      users[userKey].ageVerificationStatus = status === 'approved' ? 'verified' : 'rejected';
      users[userKey].verificationDate = new Date().toLocaleDateString('fa-IR');
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    localStorage.setItem(STORAGE_KEYS.VERIFICATIONS, JSON.stringify(list));
    return target;
  },

  resetDemoData(): void {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(TEST_USERS));
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(INITIAL_STORIES));
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(INITIAL_NOTES));
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
    localStorage.setItem(STORAGE_KEYS.VERIFICATIONS, JSON.stringify(INITIAL_VERIFICATIONS));
  },
};
