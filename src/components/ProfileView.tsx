import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Grid,
  Bookmark,
  Sparkles,
  Edit3,
  Heart,
  MessageSquare,
  UserCheck,
  UserPlus,
  Share2,
  Check,
  X,
  Camera,
  Upload,
  Quote,
  AlertTriangle,
  FileText,
  Menu,
  Globe,
  ShieldCheck,
  RotateCcw,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Flag,
  LogOut,
  LogIn,
  Users,
  ChevronDown,
} from 'lucide-react';
import { User, Post, Note, AppLanguage } from '../types';
import { TRANSLATIONS, translateUserBadge, formatRelativeTime } from '../services/i18n';
import { AccountSwitcherSheet } from './AccountSwitcherSheet';

interface ProfileViewProps {
  user: User;
  currentUser: User;
  posts: Post[];
  savedPosts: Post[];
  notes?: Note[];
  lang?: AppLanguage;
  onChangeLanguage?: (lang: AppLanguage) => void;
  showSensitiveWarning?: boolean;
  onToggleSensitiveWarning?: () => void;
  onOpenAgeVerification?: () => void;
  onResetData?: () => void;
  onToggleFollow: (userId: string) => void;
  onUpdateProfile: (updated: Partial<User>) => void;
  onOpenChat: (targetUser: User) => void;
  onSelectPost: (post: Post) => void;
  onReportUser?: (targetUser: User) => void;
  isLoggedIn?: boolean;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  onLogout?: () => void;
  activeUsers?: User[];
  onSwitchAccount?: (userId: string) => void;
  onAddNewAccount?: () => void;
  onLogoutAll?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  currentUser,
  posts,
  savedPosts,
  notes = [],
  lang = 'fa',
  onChangeLanguage,
  showSensitiveWarning = true,
  onToggleSensitiveWarning,
  onOpenAgeVerification,
  onResetData,
  onToggleFollow,
  onUpdateProfile,
  onOpenChat,
  onSelectPost,
  onReportUser,
  isLoggedIn = true,
  onOpenAuth,
  onLogout,
  activeUsers = [],
  onSwitchAccount,
  onAddNewAccount,
  onLogoutAll,
}) => {
  const currentLang: AppLanguage = (lang as AppLanguage) || 'fa';
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'fa' || currentLang === 'ar';
  const [activeTab, setActiveTab] = useState<'posts' | 'notes' | 'saved' | 'journey'>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountSheetOpen, setIsAccountSheetOpen] = useState(false);

  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [badge, setBadge] = useState(user.badge || 'سفیر پذیرش بدن 🌿');
  const [bodyStory, setBodyStory] = useState(
    user.bodyStorySummary || 'روایتگر تغییرات طبیعی تن، پذیرش اسکارهای زندگی و پوست واقعی'
  );

  const [avatarNotice, setAvatarNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isMe = user.id === currentUser.id;
  const userPosts = posts.filter(p => p.userId === user.id && !p.isRemoved);
  const userNotes = notes.filter(n => n.userId === user.id);

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onUpdateProfile({ avatar: result, avatarSource: 'upload' });
      setAvatarNotice(t.success);
      setTimeout(() => setAvatarNotice(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      bio,
      badge,
      bodyStorySummary: bodyStory,
    });
    setIsEditing(false);
  };

  const isAgeVerified = currentUser.isAgeVerified || currentUser.ageVerificationStatus === 'verified';

  return (
    <div className="flex-1 overflow-y-auto pb-16 bg-[#111018]">
      {/* Hidden File Input for Avatar */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarFileUpload}
        className="hidden"
      />

      {/* Top Profile Bar with Username, Account Switcher Dropdown, and Hamburger Menu */}
      <div className="px-4 py-3 bg-[#151320] border-b border-[#242033] sticky top-0 z-20 w-full">
        <div className="w-full max-w-2xl lg:max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-bold text-[#f5f1fc] truncate max-w-[170px]">
            @{user.username}
          </span>

          {isMe && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#272033] text-[#e8a598] border border-[#e8a598]/30 shrink-0">
              {t.navProfile}
            </span>
          )}
        </div>

        {/* Right Action Icons (Account switcher quick icon + Hamburger Menu) */}
        {isMe && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsAccountSheetOpen(true)}
              className="p-2 rounded-xl bg-[#201d2c] hover:bg-[#2b223b] text-[#e8a598] border border-[#3b344e] transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 relative"
              title={currentLang === 'fa' ? 'انتخاب و سوییچ حساب‌ها' : 'Switch Account'}
            >
              <Users className="w-4 h-4" />
              {activeUsers.length > 1 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#9bb39d] ring-2 ring-[#151320]" />
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-xl bg-[#201d2c] hover:bg-[#2e283d] text-[#e8a598] border border-[#3b344e] transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
              title={t.settingsTitle}
            >
              <Menu className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>
        )}
        </div>
      </div>

      {/* Animated Profile Content Canvas (Subtle slide-in for cozy feel) */}
      <motion.div
        key={`profile-canvas-${user.id}`}
        initial={{
          opacity: 0,
          x: isMe ? (isRtl ? 20 : -20) : (isRtl ? -20 : 20),
        }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.28,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="flex flex-col min-w-0 w-full max-w-2xl lg:max-w-3xl mx-auto"
      >
        {/* Moderation Warnings Banner (Warm styling, no red) */}
      {user.warnings && user.warnings.length > 0 && (
        <div className="mx-3 mt-3 p-3 rounded-2xl bg-[#221c2c] border border-[#524168] text-[#ded8ea]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#e8a598] mb-1">
            <AlertTriangle className="w-4 h-4 text-[#e8a598]" />
            <span>
              {currentLang === 'fa'
                ? 'پیام حفظ احترام و آرامش در فضا:'
                : currentLang === 'ar'
                ? 'رسالة الحفاظ على الاحترام والأمان في المجتمع:'
                : currentLang === 'es'
                ? 'Aviso de respeto y seguridad comunitaria:'
                : currentLang === 'fr'
                ? 'Message de respect et de sécurité :'
                : 'Community Respect & Safety Notice:'}
            </span>
          </div>
          {user.warnings.map((w, idx) => (
            <p key={idx} className="text-[11px] text-[#cfcadb] leading-relaxed">
              • {w}
            </p>
          ))}
        </div>
      )}

      {/* Profile Header Canvas */}
      <div className="relative pt-4 pb-4 px-4 bg-gradient-to-b from-[#1b1827] via-[#14121d] to-[#111018] border-b border-[#2a2438]">
        <div className="flex items-start justify-between mb-3">
          {/* Avatar with Cozy Border & Action Buttons */}
          <div className="relative flex flex-col items-center">
            <div className="relative w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-[#7c566a] via-[#b87c72] to-[#e8a598] shadow-xl">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'}
                alt={user?.name || ''}
                className="w-full h-full rounded-full object-cover border-2 border-[#14121d]"
                referrerPolicy="no-referrer"
              />

              {isMe && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="تغییر عکس پروفایل"
                  className="absolute bottom-0 right-0 p-1.5 bg-[#251f33] hover:bg-[#3d3254] text-[#e8a598] border border-[#e8a598]/60 rounded-full shadow-md cursor-pointer transition-transform active:scale-95"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex-1 flex items-center justify-around mr-4 rtl:mr-4 ltr:ml-4 py-2.5 bg-[#171523]/80 rounded-2xl border border-[#2e283d] text-center shadow-inner">
            <div>
              <span className="block text-sm font-bold text-[#f2eef9]">
                {userPosts.length}
              </span>
              <span className="text-[10px] text-[#9a91ab]">{t.profilePhotos}</span>
            </div>
            <div className="w-[1px] h-6 bg-[#2d273a]" />
            <div>
              <span className="block text-sm font-bold text-[#f2eef9]">
                {userNotes.length}
              </span>
              <span className="text-[10px] text-[#9a91ab]">{t.profileNotes}</span>
            </div>
            <div className="w-[1px] h-6 bg-[#2d273a]" />
            <div>
              <span className="block text-sm font-bold text-[#f2eef9]">
                {user.followersCount}
              </span>
              <span className="text-[10px] text-[#9a91ab]">{t.profileFollowers}</span>
            </div>
          </div>
        </div>

        {/* Notice Message */}
        {avatarNotice && (
          <div className="mb-2 p-2 rounded-xl bg-[#231b2d] border border-[#d6a592]/50 text-xs text-[#f4ebf8] text-center animate-fade-in">
            {avatarNotice}
          </div>
        )}

        {/* User Details / Edit Form */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-2 mt-2">
            <div>
              <label className="text-[10px] text-[#9a91ab] block mb-0.5">{t.displayNameLabel}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-[#12101b] border border-[#3b344d] rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#d6a592]"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#9a91ab] block mb-0.5">{t.badgeLabel}</label>
              <input
                type="text"
                value={badge}
                onChange={e => setBadge(e.target.value)}
                className="w-full bg-[#12101b] border border-[#3b344d] rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#d6a592]"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#9a91ab] block mb-0.5">{t.bioLabel}</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={2}
                className="w-full bg-[#12101b] border border-[#3b344d] rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#d6a592] resize-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#9a91ab] block mb-0.5">{t.bodyJourneyTitle}:</label>
              <textarea
                value={bodyStory}
                onChange={e => setBodyStory(e.target.value)}
                rows={2}
                className="w-full bg-[#12101b] border border-[#3b344d] rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#d6a592] resize-none"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 py-1.5 bg-gradient-to-r from-[#6e4659] to-[#b3756b] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{t.saveChanges}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 bg-[#231f30] text-[#9a91ab] rounded-xl text-xs cursor-pointer"
              >
                {t.cancel}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[#f5f1fc]">{user.name}</h2>
              </div>
            </div>

            {/* User Title / Badge translated dynamically! */}
            {user.badge && (
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#252033] border border-[#443859] text-[10px] text-[#d6a592] font-semibold">
                {translateUserBadge(user.badge, currentLang)}
              </div>
            )}

            <p className="text-xs text-[#cfcadb] leading-relaxed pt-1 whitespace-pre-wrap">
              {user.bio}
            </p>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2 pt-3">
              {isMe ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-2 rounded-xl bg-[#221e2f] hover:bg-[#2f2a40] text-xs font-medium text-[#d6a592] border border-[#3e3550] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t.editProfile}</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onToggleFollow(user.id)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      user.isFollowing
                        ? 'bg-[#1b231d] text-[#9bb39d] border border-[#9bb39d]/40'
                        : 'bg-gradient-to-r from-[#6e4659] to-[#b3756b] text-white hover:brightness-110 shadow'
                    }`}
                  >
                    {user.isFollowing ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{t.following}</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>{t.follow}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onOpenChat(user)}
                    className="p-2 rounded-xl bg-[#231f31] hover:bg-[#312a44] text-[#cfcadb] border border-[#3b334d] cursor-pointer"
                    title={t.directMessagesTitle}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  {onReportUser && (
                    <button
                      onClick={() => onReportUser(user)}
                      className="p-2 rounded-xl bg-[#231f31] hover:bg-[#312a44] text-[#cfcadb] border border-[#3b334d] cursor-pointer"
                      title={t.report}
                    >
                      <Flag className="w-4 h-4 text-[#baaecd]" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#252033] bg-[#14121d] sticky top-12 z-10">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'posts'
              ? 'text-[#e8a598] border-b-2 border-[#e8a598] bg-[#1d1927]'
              : 'text-[#857d97] hover:text-[#bbb4cb]'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>{t.tabPhotos} ({userPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'notes'
              ? 'text-[#e8a598] border-b-2 border-[#e8a598] bg-[#1d1927]'
              : 'text-[#857d97] hover:text-[#bbb4cb]'
          }`}
        >
          <Quote className="w-3.5 h-3.5" />
          <span>{t.profileNotes} ({userNotes.length})</span>
        </button>

        {isMe && (
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'saved'
                ? 'text-[#e8a598] border-b-2 border-[#e8a598] bg-[#1d1927]'
                : 'text-[#857d97] hover:text-[#bbb4cb]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{t.tabSaved} ({savedPosts.length})</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('journey')}
          className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'journey'
              ? 'text-[#e8a598] border-b-2 border-[#e8a598] bg-[#1d1927]'
              : 'text-[#857d97] hover:text-[#bbb4cb]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.tabJourney}</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-3">
        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div>
            {userPosts.length === 0 ? (
              <div className="text-center py-12 text-xs text-[#7d758d] space-y-2">
                <p>{t.noPostsYet} 🕊️</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {userPosts.map(post => (
                  <div
                    key={post.id}
                    onClick={() => onSelectPost(post)}
                    className="group relative aspect-square rounded-2xl overflow-hidden bg-[#0c0b11] border border-[#2c263c] cursor-pointer hover:border-[#d6a592] transition-all"
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />

                    {post.isSensitive && (
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-[#3e1b23]/90 text-[#f28e83] border border-[#f28e83]/40 text-[8px] font-bold">
                        +18
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                      <span>🤗 {post.hugCount}</span>
                      <span>❤️ {post.likesCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 24h Notes Tab */}
        {activeTab === 'notes' && (
          <div className="space-y-2.5">
            {userNotes.length === 0 ? (
              <div className="text-center py-12 text-xs text-[#7d758d]">
                {t.noMessagesYet} ✨
              </div>
            ) : (
              userNotes.map(note => (
                <div
                  key={note.id}
                  className="p-3 rounded-2xl bg-[#181525] border border-[#2d263c] flex items-start gap-3"
                >
                  <span className="text-xl p-2 rounded-xl bg-[#231e33] border border-[#3e3455]">
                    {note.moodEmoji}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs text-[#ded8ea] leading-relaxed font-medium">
                      «{note.text}»
                    </p>
                    <span className="text-[10px] text-[#7d758d] mt-1 block">
                      {formatRelativeTime(note.createdAt, currentLang)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Saved Posts Tab */}
        {activeTab === 'saved' && (
          <div>
            {savedPosts.length === 0 ? (
              <div className="text-center py-12 text-xs text-[#7d758d]">
                {t.tabSaved} 🔖
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {savedPosts.map(post => (
                  <div
                    key={post.id}
                    onClick={() => onSelectPost(post)}
                    className="group relative aspect-square rounded-2xl overflow-hidden bg-[#0c0b11] border border-[#2c263c] cursor-pointer hover:border-[#d6a592] transition-all"
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.caption}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                      <span>🤗 {post.hugCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Body Journey Tab */}
        {activeTab === 'journey' && (
          <div className="p-4 rounded-3xl cozy-card-warm space-y-3">
            <div className="flex items-center gap-2 text-[#e8a598] text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>{t.bodyJourneyTitle}</span>
            </div>

            <p className="text-xs text-[#f1ecfa] leading-relaxed whitespace-pre-wrap">
              {user.bodyStorySummary ||
                'من پذیرفته‌ام که بدنم تغییر می‌کند، زخم برمی‌دارد و ردپای گذر عمر و تجربیات بر آن نقش می‌بندد. این خطوط، امضای منحصر‌به‌فرد بودن من در این جهانند.'}
            </p>

            <div className="pt-3 border-t border-[#3b324a] flex items-center justify-between text-[11px] text-[#bbb2cc]">
              <span>{t.communityGuidelines}</span>
              <span className="text-[#9bb39d] font-bold">✓ {t.safeSpaceActive}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>

      {/* Full-screen Animated Hamburger / Settings Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="profile-fullscreen-hamburger-menu"
            initial={{ opacity: 0, scale: 0.96, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 25 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[#12101b] flex flex-col overflow-y-auto overflow-x-hidden text-[#e2dfeb]"
          >
            {/* Full-screen Top Header */}
            <div className="sticky top-0 z-20 px-4 py-3.5 bg-[#161324]/95 backdrop-blur-md border-b border-[#292338] flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#211c2e] border border-[#3c344e] flex items-center justify-center text-[#e8a598] shadow-sm">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white leading-tight">{t.settingsTitle}</h2>
                  <p className="text-[10px] text-[#9b93ab] font-normal">{t.accountSection}</p>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#cfcadb] hover:text-white bg-[#221d30] border border-[#3b344d] cursor-pointer hover:scale-105 active:scale-95 transition-all shadow"
                title={t.cancel}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Settings Content (Centered & Responsive) */}
            <div className="flex-1 p-4 max-w-lg mx-auto w-full space-y-4 pb-16">
              {/* Account & Auth Status Card */}
              <div className="p-3.5 rounded-2xl bg-[#1a1728] border border-[#2d263d] space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={currentUser?.avatar}
                      alt={currentUser?.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-[#e8a598]/40"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#f5edf9]">{currentUser?.name}</p>
                      <p className="text-[10px] text-[#9a91ab]">
                        {currentUser?.email || `@${currentUser?.username}`}
                      </p>
                    </div>
                  </div>
                  {currentUser?.authProvider === 'google' && (
                    <span className="px-2 py-0.5 rounded-md bg-[#4285F4]/15 border border-[#4285F4]/30 text-[#8ab4f8] text-[10px] font-medium flex items-center gap-1">
                      <span className="font-bold">Google</span>
                    </span>
                  )}
                </div>

                <div className="pt-1.5 flex flex-col gap-2 border-t border-[#262135]">
                  {/* Quick Bottom Sheet Trigger from settings */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsAccountSheetOpen(true);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#251f33] hover:bg-[#322944] border border-[#44365c] text-[#e8a598] text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[#e8a598]" />
                      <span>
                        {currentLang === 'fa'
                          ? 'مدیریت و جابجایی بین حساب‌ها'
                          : 'Switch & Manage Accounts'}
                      </span>
                    </div>
                    {activeUsers.length > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1b1527] text-[#cfcadb] font-mono border border-[#3b3252]">
                        {activeUsers.length}
                      </span>
                    )}
                  </button>

                  {isLoggedIn ? (
                    onLogout && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full py-2 rounded-xl bg-[#2e1920] hover:bg-[#3d1f28] border border-[#5a2533] text-[#fca5a5] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t.logout}</span>
                      </button>
                    )
                  ) : (
                    onOpenAuth && (
                      <div className="w-full grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsMenuOpen(false);
                            onOpenAuth('login');
                          }}
                          className="py-2 rounded-xl bg-gradient-to-r from-[#6e4659] to-[#b3756b] text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shadow"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>{t.login}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsMenuOpen(false);
                            onOpenAuth('signup');
                          }}
                          className="py-2 rounded-xl bg-[#252033] hover:bg-[#322a42] text-[#f2eaf7] border border-[#3e3451] text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5 text-[#9bb39d]" />
                          <span>{t.signup}</span>
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Language Switcher */}
              <div className="p-3.5 rounded-2xl bg-[#1a1728] border border-[#2d263d] space-y-2.5 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#cfcadb]">
                  <Globe className="w-4 h-4 text-[#e8a598]" />
                  <span>{t.languageSection}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {(['fa', 'en', 'es', 'ar', 'fr'] as AppLanguage[]).map(l => (
                    <button
                      key={l}
                      onClick={() => onChangeLanguage && onChangeLanguage(l)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer text-center ${
                        currentLang === l
                          ? 'bg-gradient-to-r from-[#7a485a] to-[#be8273] text-white font-bold shadow-md'
                          : 'bg-[#231f31] text-[#9a91ab] hover:text-white hover:bg-[#2e2940]'
                      }`}
                    >
                      {l === 'fa' && 'فارسی'}
                      {l === 'en' && 'English'}
                      {l === 'es' && 'Español'}
                      {l === 'ar' && 'العربية'}
                      {l === 'fr' && 'Français'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Localized Age Status Card */}
              <div className="p-3.5 rounded-2xl bg-[#1a1728] border border-[#2d263d] space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#cfcadb]">
                    <ShieldCheck className="w-4 h-4 text-[#9bb39d]" />
                    <span>{t.ageStatus}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                      isAgeVerified
                        ? 'bg-[#1b2b20] text-[#9bb39d] border border-[#9bb39d]/40'
                        : 'bg-[#282035] text-[#e8a598] border border-[#e8a598]/40'
                    }`}
                  >
                    {isAgeVerified ? t.verifiedBadge : t.unverifiedBadge}
                  </span>
                </div>
                <p className="text-[11px] text-[#9a91ab] leading-relaxed">
                  {isAgeVerified ? t.ageStatusVerifiedDesc : t.ageStatusUnverifiedDesc}
                </p>
                {!isAgeVerified && onOpenAgeVerification && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenAgeVerification();
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#53395b] to-[#804f6e] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-110 shadow-md transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t.verifyAgeBtn}</span>
                  </button>
                )}
              </div>

              {/* Sensitive Content Blur Toggle */}
              {onToggleSensitiveWarning && (
                <div className="p-3.5 rounded-2xl bg-[#1a1728] border border-[#2d263d] flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-xs font-bold text-[#cfcadb] block">
                      {t.blurSensitiveToggleTitle}
                    </span>
                    <span className="text-[10px] text-[#8e869e] block mt-0.5">
                      {t.blurSensitiveToggleDesc}
                    </span>
                  </div>
                  <button
                    onClick={onToggleSensitiveWarning}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                      showSensitiveWarning ? 'bg-[#9bb39d] justify-end' : 'bg-[#3b344d] justify-start'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow-sm" />
                  </button>
                </div>
              )}

              {/* Manifesto & Safe Space */}
              <div className="p-3.5 rounded-2xl bg-[#151320] border border-[#2d273d] space-y-1.5 shadow-sm">
                <span className="text-xs font-bold text-[#e8a598] block">
                  {t.communityGuidelines}
                </span>
                <p className="text-[11px] text-[#9b93ab] leading-relaxed">
                  {t.manifestoText}
                </p>
              </div>

              {/* Bottom Action: Reset Data */}
              {onResetData && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      const confirmResetMsg =
                        currentLang === 'fa'
                          ? 'آیا مایل به بازنشانی داده‌های تستی هستید؟'
                          : currentLang === 'ar'
                          ? 'هل تريد إعادة ضبط البيانات التجريبية؟'
                          : currentLang === 'es'
                          ? '¿Deseas restablecer los datos de prueba?'
                          : currentLang === 'fr'
                          ? 'Voulez-vous réinitialiser les données de démonstration ?'
                          : 'Do you want to reset all test data?';
                      if (confirm(confirmResetMsg)) {
                        onResetData();
                        setIsMenuOpen(false);
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#201d2c] hover:bg-[#2c263d] text-[#8e879f] hover:text-[#d3cce0] text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-[#362e47]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t.resetDataBtn}</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Sheet for Fast Account Switching */}
      <AccountSwitcherSheet
        isOpen={isAccountSheetOpen}
        onClose={() => setIsAccountSheetOpen(false)}
        currentUser={currentUser}
        activeUsers={activeUsers}
        onSwitchAccount={userId => {
          if (onSwitchAccount) {
            onSwitchAccount(userId);
          }
        }}
        onAddNewAccount={() => {
          if (onAddNewAccount) {
            onAddNewAccount();
          } else if (onOpenAuth) {
            onOpenAuth('login');
          }
        }}
        onLogoutCurrent={() => {
          if (onLogout) {
            onLogout();
          }
        }}
        onLogoutAll={onLogoutAll}
        lang={currentLang}
      />
    </div>
  );
};
