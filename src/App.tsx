/**
 * @file App.tsx
 * @description Main Application Controller for NotPerfect.
 * Orchestrates:
 * - Reactive state management (Users, Posts, Stories, Notes, Reports)
 * - Navigation tab routing (Feed, Explore, Create, Messages, Profile, Settings)
 * - Modals lifecycle (Age Verification, Report, Call, Onboarding, Authentication)
 * - Splash screen and smooth loading transitions with ambient lighting
 * - Bidirectional layout direction handling (RTL / LTR)
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AndroidFrame } from './components/AndroidFrame';
import { Navbar } from './components/Navbar';
import { BottomNavigation, TabType } from './components/BottomNavigation';
import { StoryViewer } from './components/StoryViewer';
import { PostCard } from './components/PostCard';
import { CreatePostModal } from './components/CreatePostModal';
import { ChatView } from './components/ChatView';
import { CallModal } from './components/CallModal';
import { ProfileView } from './components/ProfileView';
import { ExploreView } from './components/ExploreView';
import { ReportModal } from './components/ReportModal';
import { AgeVerificationModal } from './components/AgeVerificationModal';
import { AuthModal } from './components/AuthModal';
import { SplashScreen } from './components/SplashScreen';
import { LogoMotionLoading } from './components/LogoMotionLoading';
import { LoginView } from './components/LoginView';
import { OnboardingModal } from './components/OnboardingModal';
import { StorageService } from './services/storage';
import { TRANSLATIONS, isRTL } from './services/i18n';
import { AdminApiClient } from './services/adminApi';
import {
  User,
  Post,
  Story,
  Note,
  CallState,
  Report,
  ReportTargetType,
  ReportReason,
  ModerationActionType,
  Comment,
  ReactionType,
  AppLanguage,
} from './types';
import { ArrowRight, Sparkles, Shield, Lock, ShieldCheck } from 'lucide-react';

/**
 * Root Application Component.
 */
export default function App() {
  // Application Data States
  const [users, setUsers] = useState<Record<string, User>>(() => StorageService.getUsers());
  const [currentUser, setCurrentUser] = useState<User>(() => StorageService.getCurrentUser());
  const [posts, setPosts] = useState<Post[]>(() => StorageService.getPosts());
  const [stories, setStories] = useState<Story[]>(() => StorageService.getStories());
  const [notes, setNotes] = useState<Note[]>(() => StorageService.getNotes());
  const [reports, setReports] = useState<Report[]>(() => StorageService.getReports());
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [language, setLanguage] = useState<AppLanguage>(() => StorageService.getLanguage());

  // Modals & State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAgeModalOpen, setIsAgeModalOpen] = useState(false);
  const [viewingProfileUser, setViewingProfileUser] = useState<User | null>(null);
  const [selectedPostDetail, setSelectedPostDetail] = useState<Post | null>(null);
  const [globalSensitiveAllowed, setGlobalSensitiveAllowed] = useState(true);
  const [globalNotification, setGlobalNotification] = useState<string | null>(null);

  // Authentication, Splash & Onboarding State
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [showPostAuthLoading, setShowPostAuthLoading] = useState(false);
  const [onboardingUser, setOnboardingUser] = useState<User | null>(null);
  const [pendingAuthUser, setPendingAuthUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => StorageService.isLoggedIn());

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // Called when login is successful
  const handleLoginSuccessFromView = (user: User) => {
    setPendingAuthUser(user);
    setShowPostAuthLoading(true);
    // Transmit login event to Admin Panel
    AdminApiClient.syncUserProfile(user, 'login');
  };

  // Called after basic sign up boxes to start asking mandatory/optional profile questions
  const handleStartOnboarding = (user: User) => {
    setOnboardingUser(user);
  };

  // Called when user finishes the onboarding modal steps
  const handleCompleteOnboarding = (updatedFields: Partial<User>) => {
    if (onboardingUser) {
      const updated = StorageService.updateUserProfile(updatedFields);
      setOnboardingUser(null);
      setPendingAuthUser(updated);
      setShowPostAuthLoading(true);
      // Sync complete profile to Admin Panel
      AdminApiClient.syncUserProfile(updated, 'registered');
    }
  };

  // When post-auth logo motion loading completes (1.5s)
  const handlePostAuthLoadingComplete = () => {
    setShowPostAuthLoading(false);
    setIsLoggedIn(true);
    loadAllData();
    if (pendingAuthUser) {
      setGlobalNotification(
        language === 'fa'
          ? `خوش آمدید، ${pendingAuthUser.name} عزیز 🕊️`
          : `Welcome, ${pendingAuthUser.name} 🕊️`
      );
      setTimeout(() => setGlobalNotification(null), 3500);
      setPendingAuthUser(null);
    }
  };

  const handleAuthSuccess = (user: User) => {
    handleLoginSuccessFromView(user);
    setIsAuthModalOpen(false);
  };

  const [activeAccounts, setActiveAccounts] = useState<User[]>([]);

  const handleLogout = () => {
    const prevName = currentUser?.name || '';
    const result = StorageService.logoutAccount(currentUser?.id || '');
    loadAllData();
    if (result.nextUser) {
      setGlobalNotification(
        language === 'fa'
          ? `از حساب ${prevName} خارج شدید. به حساب قبلی (${result.nextUser.name}) برگشتید 🔄`
          : `Logged out of ${prevName}. Switched to ${result.nextUser.name} 🔄`
      );
    } else {
      setIsLoggedIn(false);
      setGlobalNotification(
        language === 'fa'
          ? 'با موفقیت از حساب کاربری خارج شدید ✨'
          : 'Logged out successfully ✨'
      );
    }
    setTimeout(() => setGlobalNotification(null), 3500);
  };

  const handleLogoutAll = () => {
    StorageService.logoutAllAccounts();
    setIsLoggedIn(false);
    loadAllData();
    setGlobalNotification(
      language === 'fa'
        ? 'از تمام حساب‌های کاربری خارج شدید.'
        : 'Logged out of all accounts.'
    );
    setTimeout(() => setGlobalNotification(null), 3000);
  };

  const handleAddNewAccount = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  // Reporting State
  const [reportModalState, setReportModalState] = useState<{
    isOpen: boolean;
    targetType: ReportTargetType;
    targetId: string;
    targetPreview: string;
    targetUserId: string;
    targetUserName: string;
  }>({
    isOpen: false,
    targetType: 'post',
    targetId: '',
    targetPreview: '',
    targetUserId: '',
    targetUserName: '',
  });

  // Calls State
  const [callState, setCallState] = useState<CallState>({
    isOpen: false,
    type: 'voice',
    user: null,
    status: 'connected',
    isMuted: false,
    isVideoOff: false,
    durationSeconds: 0,
  });

  // Load initial data
  const loadAllData = () => {
    const loadedUsers = StorageService.getUsers();
    setUsers(loadedUsers);

    const activeUser = StorageService.getCurrentUser();
    setCurrentUser(activeUser);

    setActiveAccounts(StorageService.getActiveUsers());

    setPosts(StorageService.getPosts());
    setStories(StorageService.getStories());
    setNotes(StorageService.getNotes());
    setReports(StorageService.getReports());
  };

  useEffect(() => {
    loadAllData();
    // Flush any pending offline events to the Admin Panel upon initialization
    AdminApiClient.flushOfflineQueue().catch(err => {
      console.warn('[AdminAPI] Offline queue auto-flush encountered error:', err);
    });
  }, []);

  const handleLanguageChange = (newLang: AppLanguage) => {
    setLanguage(newLang);
    StorageService.setLanguage(newLang);
    document.documentElement.dir = isRTL(newLang) ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  useEffect(() => {
    document.documentElement.dir = isRTL(language) ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Handle Switch User (Persona switcher for male/female test users)
  const handleSwitchUser = (userId: string) => {
    const switched = StorageService.switchAccount(userId);
    loadAllData();
    if (switched) {
      setGlobalNotification(
        language === 'fa'
          ? `به حساب ${switched.name} تغییر یافت 🔄`
          : `Switched to ${switched.name} 🔄`
      );
      setTimeout(() => setGlobalNotification(null), 3000);
    }
  };

  // Reactions Handler
  const handleToggleReaction = (postId: string, reactionType: ReactionType) => {
    if (!currentUser) return;
    StorageService.toggleReaction(postId, reactionType);
    setPosts(StorageService.getPosts());
    if (selectedPostDetail && selectedPostDetail.id === postId) {
      const updated = StorageService.getPosts().find(p => p.id === postId);
      if (updated) setSelectedPostDetail(updated);
    }
  };

  // Save Post Handler
  const handleSavePost = (postId: string) => {
    StorageService.toggleSave(postId);
    setPosts(StorageService.getPosts());
  };

  // Add Comment Handler
  const handleAddComment = (postId: string, commentText: string) => {
    if (!currentUser) return;
    StorageService.addComment(postId, commentText);
    setPosts(StorageService.getPosts());
    if (selectedPostDetail && selectedPostDetail.id === postId) {
      const updated = StorageService.getPosts().find(p => p.id === postId);
      if (updated) setSelectedPostDetail(updated);
    }
  };

  // Toggle Follow
  const handleToggleFollow = (userId: string) => {
    StorageService.toggleFollow(userId);
    setUsers(StorageService.getUsers());
    const updatedMe = StorageService.getCurrentUser();
    setCurrentUser(updatedMe);
    if (viewingProfileUser && viewingProfileUser.id === userId) {
      const updatedTarget = StorageService.getUsers()[Object.keys(StorageService.getUsers()).find(k => StorageService.getUsers()[k].id === userId) || ''];
      if (updatedTarget) setViewingProfileUser(updatedTarget);
    }
  };

  /**
  * Update current user profile fields and synchronize to Admin Panel.
  */
  const handleUpdateProfile = (updatedFields: Partial<User>) => {
    if (!currentUser) return;
    const updated = StorageService.updateUserProfile(updatedFields);
    setCurrentUser(updated);
    setUsers(StorageService.getUsers());
    // Dispatch updated profile telemetry to Admin Panel
    AdminApiClient.syncUserProfile(updated, 'profile_updated');
  };

  /**
  * Create a new natural post and dispatch to Admin Panel content audit stream.
  */
  const handleCreatePost = (
    newPostData: Omit<Post, 'id' | 'createdAt' | 'likesCount' | 'hugCount' | 'reactions' | 'userReactions' | 'comments'>
  ) => {
    const created = StorageService.createPost(newPostData);
    setPosts(StorageService.getPosts());
    setIsCreateModalOpen(false);
    setActiveTab('feed');
    // Dispatch publication audit event to Admin Panel
    if (currentUser) {
      AdminApiClient.dispatchContentPublication('post', created, currentUser);
    }
  };

  /**
  * Add a 24-hour body journey story and dispatch to Admin Panel audit stream.
  */
  const handleAddStory = (imageUrl: string) => {
    if (!currentUser) return;
    const created = StorageService.addStory(imageUrl);
    setStories(StorageService.getStories());
    // Dispatch story publication to Admin Panel
    AdminApiClient.dispatchContentPublication('story', created, currentUser);
  };

  // Reply to Story
  const handleSendStoryReply = (story: Story, replyText: string) => {
    if (!currentUser) return;
    StorageService.sendMessage({
      senderId: currentUser.id,
      receiverId: story.userId,
      text: `[پاسخ به استوری 🕊️]: ${replyText}`,
    });
    setGlobalNotification(`پاسخ مهربانانه شما به @${story.user.username} ارسال شد ✨`);
    setTimeout(() => setGlobalNotification(null), 3500);
  };

  // Mark Story Viewed
  const handleStoryViewed = (storyId: string) => {
    setStories(prev =>
      prev.map(s => (s.id === storyId ? { ...s, viewed: true } : s))
    );
  };

  /**
  * Handle age verification completion and dispatch record to Admin Panel.
  */
  const handleAgeVerified = (
    method: 'google' | 'video' = 'google',
    details?: { snapshotUrl?: string; phrase?: string; code?: string }
  ) => {
    if (currentUser) {
      if (method === 'video' && details) {
        const verif = StorageService.submitVideoVerification({
          snapshotUrl: details.snapshotUrl,
          randomPhrase: details.phrase || '',
          verificationCode: details.code || '',
        });
        AdminApiClient.dispatchAgeVerificationSubmission(verif, currentUser);
      } else {
        StorageService.setAgeVerified(currentUser.id, true, 'google');
        const updated = StorageService.getCurrentUser();
        AdminApiClient.syncUserProfile(updated, 'profile_updated');
      }
    }
    loadAllData();
    setIsAgeModalOpen(false);
    setGlobalNotification('سن شما با موفقیت تایید شد! دسترسی کامل به تصاویر طبیعی فعال گردید ✨');
    setTimeout(() => setGlobalNotification(null), 4000);
  };

  // Calls Handlers
  const handleStartCall = (targetUser: User, type: 'voice' | 'video') => {
    setCallState({
      isOpen: true,
      type,
      user: targetUser,
      status: 'connected',
      isMuted: false,
      isVideoOff: false,
      durationSeconds: 0,
    });
  };

  const handleEndCall = () => {
    setCallState(prev => ({ ...prev, isOpen: false }));
  };

  // Reporting System
  const handleOpenReportModal = (params: {
    targetType: ReportTargetType;
    targetId: string;
    targetPreview: string;
    targetUserId?: string;
    targetUserName?: string;
  }) => {
    setReportModalState({
      isOpen: true,
      targetType: params.targetType,
      targetId: params.targetId,
      targetPreview: params.targetPreview,
      targetUserId: params.targetUserId || '',
      targetUserName: params.targetUserName || '',
    });
  };

  /**
   * Submit trust & safety violation report and dispatch to Admin Panel moderation queue.
   */
  const handleSubmitReport = (params: {
    targetType: ReportTargetType;
    targetId: string;
    targetPreview: string;
    targetUserId?: string;
    targetUserName?: string;
    reason: ReportReason;
    details: string;
  }) => {
    if (!currentUser) return;
    const createdReport = StorageService.submitReport({
      targetType: params.targetType,
      targetId: params.targetId,
      targetPreview: params.targetPreview,
      targetUserId: params.targetUserId || '',
      targetUserName: params.targetUserName || '',
      reason: params.reason,
      description: params.details,
    });
    setReports(StorageService.getReports());
    setReportModalState(prev => ({ ...prev, isOpen: false }));
    setGlobalNotification('گزارش شما برای هیئت نظارت و بررسی ارسال شد. از محافظت از فضای امن تن‌ها سپاسگزاریم 🕊️');
    setTimeout(() => setGlobalNotification(null), 4000);

    // Transmit report payload to centralized Admin Panel
    AdminApiClient.dispatchReport(createdReport, currentUser);
  };

  // Reset Demo Data
  const handleResetData = () => {
    StorageService.resetDemoData();
    loadAllData();
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0b0a10] text-[#cfcadb]">
        در حال آماده‌سازی فضای امن NotPerfect...
      </div>
    );
  }

  const savedPosts = posts.filter(p => p.saved && !p.isRemoved);
  const t = TRANSLATIONS[language];
  const isRtl = isRTL(language);

  return (
    <div className="w-full h-[100dvh] min-h-[100dvh] bg-[#07060a] flex items-center justify-center p-0 text-[#ded8ea] font-sans antialiased selection:bg-[#7c4f62] selection:text-white overflow-hidden">
      {/* Universal Mobile & Responsive Frame */}
      <AndroidFrame lang={language}>
        {!isLoggedIn ? (
          /* Dedicated Clean & Minimal Login View as First Screen */
          <LoginView
            currentLang={language}
            onChangeLanguage={handleLanguageChange}
            onLoginSuccess={handleLoginSuccessFromView}
            onStartOnboarding={handleStartOnboarding}
          />
        ) : (
          <>
            {/* Top App Navbar (Client Social App) */}
        <Navbar
          currentUser={currentUser}
          allUsers={users}
          onSwitchUser={handleSwitchUser}
          onOpenMessages={() => {
            setActiveTab('messages');
            setViewingProfileUser(null);
            setSelectedPostDetail(null);
          }}
          unreadMessagesCount={1}
          lang={language}
          onResetData={handleResetData}
          isLoggedIn={isLoggedIn}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          activeUsers={activeAccounts}
          onAddAccount={handleAddNewAccount}
          onLogoutAll={handleLogoutAll}
        />

        {/* Global Toast Notification */}
        {globalNotification && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-[#251b2e] border border-[#e8a598]/60 text-xs text-[#f7eefb] shadow-2xl flex items-center gap-2 animate-fade-in backdrop-blur-md max-w-[85%] text-center">
            <Sparkles className="w-3.5 h-3.5 text-[#e8a598] shrink-0" />
            <span>{globalNotification}</span>
          </div>
        )}

        {/* Main App Body */}
        <main className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden min-w-0 w-full max-w-full">
          <AnimatePresence mode="wait">
            {/* Post Detail View */}
            {selectedPostDetail ? (
              <motion.div
                key={`post-detail-${selectedPostDetail.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="p-3 pb-16 flex-1"
              >
                <button
                  onClick={() => setSelectedPostDetail(null)}
                  className="flex items-center gap-1 text-xs text-[#d6a592] mb-3 hover:underline cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                  <span>{t.back}</span>
                </button>
                <PostCard
                  post={selectedPostDetail}
                  currentUser={currentUser}
                  onToggleReaction={handleToggleReaction}
                  onSave={handleSavePost}
                  onAddComment={handleAddComment}
                  onToggleFollow={handleToggleFollow}
                  onOpenProfile={userId => {
                    const target = (Object.values(users) as User[]).find(u => u.id === userId);
                    if (target) {
                      setViewingProfileUser(target);
                      setSelectedPostDetail(null);
                    }
                  }}
                  globalSensitiveAllowed={globalSensitiveAllowed}
                  onRequestAgeVerification={() => setIsAgeModalOpen(true)}
                  onReportPost={post =>
                    handleOpenReportModal({
                      targetType: 'post',
                      targetId: post.id,
                      targetPreview: post.caption || 'تصویر ارسالی',
                      targetUserId: post.userId,
                      targetUserName: post.user.name,
                    })
                  }
                  onReportComment={(comment, post) =>
                    handleOpenReportModal({
                      targetType: 'comment',
                      targetId: comment.id,
                      targetPreview: comment.text,
                      targetUserId: comment.userId,
                      targetUserName: comment.userName,
                    })
                  }
                  lang={language}
                />
              </motion.div>
            ) : viewingProfileUser ? (
              /* User Profile View (Visiting Other User - Subtle Slide-in) */
              <motion.div
                key={`visiting-profile-${viewingProfileUser.id}`}
                initial={{ opacity: 0, x: isRtl ? -28 : 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRtl ? 28 : -28 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 flex flex-col min-h-0"
              >
                <div className="p-2 border-b border-[#252134] bg-[#14121d] flex items-center justify-between">
                  <button
                    onClick={() => setViewingProfileUser(null)}
                    className="flex items-center gap-1 text-xs text-[#d6a592] hover:text-[#f3cac0] cursor-pointer px-2 py-1 rounded-lg hover:bg-[#201c2a] transition-all group"
                  >
                    <ArrowRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5 transition-transform" />
                    <span>{t.back}</span>
                  </button>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#9b91ad] px-2 font-medium">
                    <span>@{viewingProfileUser.username}</span>
                  </div>
                </div>
                <ProfileView
                  user={viewingProfileUser}
                  currentUser={currentUser}
                  posts={posts}
                  savedPosts={savedPosts}
                  notes={notes}
                  lang={language}
                  onChangeLanguage={handleLanguageChange}
                  showSensitiveWarning={globalSensitiveAllowed}
                  onToggleSensitiveWarning={() =>
                    setGlobalSensitiveAllowed(!globalSensitiveAllowed)
                  }
                  onOpenAgeVerification={() => setIsAgeModalOpen(true)}
                  onResetData={handleResetData}
                  onToggleFollow={handleToggleFollow}
                  onUpdateProfile={handleUpdateProfile}
                  onOpenChat={() => {
                    setActiveTab('messages');
                    setViewingProfileUser(null);
                  }}
                  onSelectPost={post => setSelectedPostDetail(post)}
                  isLoggedIn={isLoggedIn}
                  onOpenAuth={handleOpenAuth}
                  onLogout={handleLogout}
                  activeUsers={activeAccounts}
                  onSwitchAccount={handleSwitchUser}
                  onAddNewAccount={handleAddNewAccount}
                  onLogoutAll={handleLogoutAll}
                  onReportUser={target =>
                    handleOpenReportModal({
                      targetType: 'user',
                      targetId: target.id,
                      targetPreview: `حساب کاربری @${target.username}`,
                      targetUserId: target.id,
                      targetUserName: target.name,
                    })
                  }
                />
              </motion.div>
            ) : (
              /* Animated Tab Views (Own Profile has subtle slide-in from opposite direction) */
              <motion.div
                key={activeTab === 'profile' ? `my-profile-${currentUser.id}` : activeTab}
                initial={{
                  opacity: 0,
                  x: activeTab === 'profile' ? (isRtl ? 28 : -28) : 0,
                  y: activeTab === 'profile' ? 0 : 8,
                }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{
                  opacity: 0,
                  x: activeTab === 'profile' ? (isRtl ? -28 : 28) : 0,
                  y: activeTab === 'profile' ? 0 : -8,
                }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 flex flex-col min-h-0"
              >
              {activeTab === 'feed' && (
                <div className="pb-16">
                  {/* Instagram-Style Grouped Stories */}
                  <StoryViewer
                    stories={stories}
                    currentUser={currentUser}
                    onAddStory={handleAddStory}
                    onSendStoryReply={handleSendStoryReply}
                    onStoryViewed={handleStoryViewed}
                    lang={language}
                  />

                  {/* Age Verification Banner if user is unverified (Cozy Warm Theme, No Red) */}
                  {!currentUser.isAgeVerified && (
                    <div className="mx-3 my-2 p-3 rounded-2xl bg-[#201c2c] border border-[#3b334d] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#2a2238] flex items-center justify-center text-[#e8a598]">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#f5eff9]">
                            {t.ageNoticeBannerTitle}
                          </p>
                          <p className="text-[10px] text-[#baaecd]">
                            {t.ageNoticeBannerDesc}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsAgeModalOpen(true)}
                        className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#53395b] to-[#804f6e] text-white text-[11px] font-bold shadow hover:brightness-110 cursor-pointer"
                      >
                        {t.verifyAgeBtn}
                      </button>
                    </div>
                  )}

                  {/* Feed Posts */}
                  <div className="px-3 py-1 space-y-2">
                    {posts
                      .filter(p => !p.isRemoved)
                      .map(post => (
                        <PostCard
                          key={post.id}
                          post={post}
                          currentUser={currentUser}
                          onToggleReaction={handleToggleReaction}
                          onSave={handleSavePost}
                          onAddComment={handleAddComment}
                          onToggleFollow={handleToggleFollow}
                          onOpenProfile={userId => {
                            const target = (Object.values(users) as User[]).find(u => u.id === userId);
                            if (target) setViewingProfileUser(target);
                          }}
                          globalSensitiveAllowed={globalSensitiveAllowed}
                          onRequestAgeVerification={() => setIsAgeModalOpen(true)}
                          onReportPost={postToReport =>
                            handleOpenReportModal({
                              targetType: 'post',
                              targetId: postToReport.id,
                              targetPreview: postToReport.caption || 'تصویر ارسالی',
                              targetUserId: postToReport.userId,
                              targetUserName: postToReport.user.name,
                            })
                          }
                          onReportComment={(comment, commentPost) =>
                            handleOpenReportModal({
                              targetType: 'comment',
                              targetId: comment.id,
                              targetPreview: comment.text,
                              targetUserId: comment.userId,
                              targetUserName: comment.userName,
                            })
                          }
                          lang={language}
                        />
                      ))}
                  </div>
                </div>
              )}

              {activeTab === 'stories' && (
                <ExploreView
                  posts={posts.filter(p => !p.isRemoved)}
                  notes={notes}
                  currentUser={currentUser}
                  onSelectPost={post => setSelectedPostDetail(post)}
                  onSelectTag={tag => console.log('Tag selected:', tag)}
                  lang={language}
                />
              )}

              {activeTab === 'create' && (
                <CreatePostModal
                  currentUser={currentUser}
                  onClose={() => setActiveTab('feed')}
                  onSubmit={handleCreatePost}
                  lang={language}
                />
              )}

              {activeTab === 'messages' && (
                <ChatView
                  currentUser={currentUser}
                  allUsers={users}
                  onStartCall={handleStartCall}
                  onBackToFeed={() => setActiveTab('feed')}
                  lang={language}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileView
                  user={currentUser}
                  currentUser={currentUser}
                  posts={posts}
                  savedPosts={savedPosts}
                  notes={notes}
                  lang={language}
                  onChangeLanguage={handleLanguageChange}
                  showSensitiveWarning={globalSensitiveAllowed}
                  onToggleSensitiveWarning={() =>
                    setGlobalSensitiveAllowed(!globalSensitiveAllowed)
                  }
                  onOpenAgeVerification={() => setIsAgeModalOpen(true)}
                  onResetData={handleResetData}
                  onToggleFollow={handleToggleFollow}
                  onUpdateProfile={handleUpdateProfile}
                  onOpenChat={() => setActiveTab('messages')}
                  onSelectPost={post => setSelectedPostDetail(post)}
                  isLoggedIn={isLoggedIn}
                  onOpenAuth={handleOpenAuth}
                  onLogout={handleLogout}
                  activeUsers={activeAccounts}
                  onSwitchAccount={handleSwitchUser}
                  onAddNewAccount={handleAddNewAccount}
                  onLogoutAll={handleLogoutAll}
                />
              )}
            </motion.div>
          )}
          </AnimatePresence>
        </main>

            {/* Persistent Bottom Navigation (Clean 5-tab layout) */}
            <BottomNavigation
              activeTab={activeTab}
              onChangeTab={tab => {
                if (tab === 'create') {
                  setIsCreateModalOpen(true);
                } else {
                  setActiveTab(tab);
                  setViewingProfileUser(null);
                  setSelectedPostDetail(null);
                }
              }}
              unreadCount={1}
              lang={language}
            />
          </>
        )}

        {/* Multi-step Registration Onboarding Modal */}
        {onboardingUser && (
          <OnboardingModal
            isOpen={!!onboardingUser}
            currentUser={onboardingUser}
            lang={language}
            onComplete={handleCompleteOnboarding}
          />
        )}

        {/* Post-Auth Logo Motion Loading Animation */}
        <AnimatePresence>
          {showPostAuthLoading && (
            <LogoMotionLoading
              lang={language}
              onComplete={handlePostAuthLoadingComplete}
            />
          )}
        </AnimatePresence>

        {/* Initial App Load Splash Screen Animation */}
        <AnimatePresence>
          {showSplashScreen && (
            <SplashScreen
              lang={language}
              onFinish={() => setShowSplashScreen(false)}
            />
          )}
        </AnimatePresence>

        {/* Auth Modal for Login, Sign Up & Google Auth */}
        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authModalMode}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
          lang={language}
        />

        {/* Create Post Modal */}
        {isCreateModalOpen && (
          <CreatePostModal
            currentUser={currentUser}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreatePost}
            lang={language}
          />
        )}

        {/* Content Reporting Modal */}
        <ReportModal
          isOpen={reportModalState.isOpen}
          onClose={() =>
            setReportModalState(prev => ({ ...prev, isOpen: false }))
          }
          targetType={reportModalState.targetType}
          targetId={reportModalState.targetId}
          targetPreview={reportModalState.targetPreview}
          targetUserId={reportModalState.targetUserId}
          targetUserName={reportModalState.targetUserName}
          onSubmitReport={handleSubmitReport}
          lang={language}
        />

        {/* Age Verification Modal (+18 Access) */}
        <AgeVerificationModal
          isOpen={isAgeModalOpen}
          onClose={() => setIsAgeModalOpen(false)}
          currentUser={currentUser}
          onVerified={handleAgeVerified}
          lang={language}
        />

        {/* Voice & Video Call Modal */}
        <CallModal
          callState={callState}
          onEndCall={handleEndCall}
          onToggleMute={() =>
            setCallState(prev => ({ ...prev, isMuted: !prev.isMuted }))
          }
          onToggleVideo={() =>
            setCallState(prev => ({ ...prev, isVideoOff: !prev.isVideoOff }))
          }
        />
      </AndroidFrame>
    </div>
  );
}
