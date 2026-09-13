import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageCircle,
  Bookmark,
  Share2,
  Eye,
  EyeOff,
  Sparkles,
  Send,
  UserPlus,
  UserCheck,
  Flag,
  Lock,
  Heart,
  Languages,
} from 'lucide-react';
import { Post, User, Comment, ReactionType, AppLanguage } from '../types';
import {
  TRANSLATIONS,
  translateUserBadge,
  translateTag,
  formatRelativeTime,
  getReactionLabel,
  getLocalizedPost,
  getLocalizedComment,
  getTranslationNotice,
} from '../services/i18n';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onToggleReaction: (postId: string, reactionType: ReactionType) => void;
  onSave: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onToggleFollow: (userId: string) => void;
  onOpenProfile: (userId: string) => void;
  globalSensitiveAllowed: boolean;
  onRequestAgeVerification: () => void;
  onReportPost?: (post: Post) => void;
  onReportComment?: (comment: Comment, post: Post) => void;
  lang?: AppLanguage;
}

const REACTION_CONFIG: { type: ReactionType; emoji: string }[] = [
  { type: 'hug', emoji: '🤗' },
  { type: 'love', emoji: '🤍' },
  { type: 'courage', emoji: '✨' },
  { type: 'peace', emoji: '🌿' },
  { type: 'bloom', emoji: '🌸' },
];

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onToggleReaction,
  onSave,
  onAddComment,
  onToggleFollow,
  onOpenProfile,
  globalSensitiveAllowed,
  onRequestAgeVerification,
  onReportPost,
  onReportComment,
  lang = 'fa',
}) => {
  const currentLang: AppLanguage = (lang as AppLanguage) || 'fa';
  const t = TRANSLATIONS[currentLang];
  const localized = getLocalizedPost(post, currentLang);
  const postOriginalLang: AppLanguage = post.originalLanguage || 'fa';
  const isTranslated = postOriginalLang !== currentLang;
  const [showOriginal, setShowOriginal] = useState(false);

  // When language changes, reset showOriginal to show translated by default
  React.useEffect(() => {
    setShowOriginal(false);
  }, [currentLang]);

  const displayedCaption = showOriginal ? post.caption : (localized.caption || post.caption);
  const displayedBodyJourney = showOriginal ? post.bodyJourney : (localized.bodyJourney || post.bodyJourney);

  // Reveal state: sensitive photos can only be revealed if age-verified!
  const [isRevealed, setIsRevealed] = useState(
    post.isSensitive ? currentUser.isAgeVerified && globalSensitiveAllowed : true
  );
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [shareNotice, setShareNotice] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const lastTapRef = useRef<number>(0);

  const handleImageTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 350) {
      // Double-tap trigger heart reaction with animation!
      onToggleReaction(post.id, 'love');
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 900);
    }
    lastTapRef.current = now;
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput.trim());
    setCommentInput('');
  };

  const handleShare = () => {
    setShareNotice(true);
    setTimeout(() => setShareNotice(false), 2000);
  };

  const handleRevealClick = () => {
    if (!currentUser.isAgeVerified) {
      onRequestAgeVerification();
    } else {
      setIsRevealed(true);
    }
  };

  const isMyPost = post.userId === currentUser.id;

  if (post.isRemoved) {
    return (
      <div className="p-4 rounded-3xl bg-[#1b1522] border border-[#3e3451] text-center my-3 text-xs text-[#b8afcb]">
        {t.moderationNotice}
      </div>
    );
  }

  // Calculate reactions summary
  const reactions = post.reactions || {
    hug: post.hugCount || 0,
    love: post.likesCount || 0,
    courage: 0,
    peace: 0,
    bloom: 0,
  };
  const userReactions = post.userReactions || [];

  return (
    <article className="cozy-card rounded-3xl overflow-hidden mb-4 transition-all hover:border-[#4a425f]/50 bg-[#15131f] border border-[#262133]">
      {/* Gentle notice if sensitive filter applies */}
      {post.moderationEnforced18 && (
        <div className="px-3 py-1.5 bg-[#211b2d] border-b border-[#443859] text-[10px] text-[#d6a592] flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#e8a598]" />
            <span>{t.sensitiveFrameTitle}</span>
          </div>
        </div>
      )}

      {/* Post Header */}
      <div className="p-3.5 flex items-center justify-between border-b border-[#242032]/60">
        <div
          onClick={() => onOpenProfile(post.userId)}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="relative shrink-0">
            <img
              src={post.user?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'}
              alt={post.user?.name || ''}
              className="w-10 h-10 rounded-full aspect-square object-cover shrink-0 ring-2 ring-[#3c344e] group-hover:ring-[#d6a592] transition-all"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-[#f0ecf7] group-hover:text-[#e8a598] transition-colors">
                {post.user?.name || 'کاربر'}
              </span>
              {post.user?.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#272235] text-[#b8afcb] border border-[#3b344e]">
                  {translateUserBadge(post.user.badge, currentLang)}
                </span>
              )}
            </div>
            <p className="text-[10px] text-[#8e879f]">{formatRelativeTime(post.createdAt, currentLang)}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Follow Button */}
          {!isMyPost && (
            <button
              onClick={() => onToggleFollow(post.userId)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                post.user.isFollowing
                  ? 'bg-[#211e2b] text-[#9bb39d] border border-[#9bb39d]/30'
                  : 'bg-gradient-to-r from-[#4d3a5a] to-[#764f69] text-[#f7eef9] hover:brightness-110'
              }`}
            >
              {post.user.isFollowing ? (
                <>
                  <UserCheck className="w-3 h-3" />
                  <span>{t.following}</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3 h-3" />
                  <span>{t.follow}</span>
                </>
              )}
            </button>
          )}

          {/* Report Button */}
          {onReportPost && (
            <button
              onClick={() => onReportPost(post)}
              className="p-1.5 rounded-full text-[#7d758d] hover:text-[#d6a592] transition-colors cursor-pointer"
              title={t.report}
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Image Area with Sensitive Content Blur & Warm Encouraging Overlay (NO RED) */}
      <div 
        className="relative w-full aspect-square bg-[#0b0a10] overflow-hidden cursor-pointer select-none"
        onClick={handleImageTap}
      >
        <img
          src={post.imageUrl}
          alt="Authentic body portrait"
          className={`w-full h-full object-cover transition-all duration-700 ${
            post.isSensitive && !isRevealed
              ? 'blur-2xl scale-110 opacity-30'
              : 'blur-0 scale-100 opacity-100'
          }`}
          referrerPolicy="no-referrer"
        />

        {/* Soft Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14121d]/80 via-transparent to-transparent pointer-events-none" />

        {/* Animated Double-tap Heart Burst Overlay */}
        <AnimatePresence>
          {showHeartBurst && (
            <motion.div
              initial={{ scale: 0.2, opacity: 0, y: 10 }}
              animate={{ scale: [0.2, 1.3, 1], opacity: [0, 1, 0.9], y: 0 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            >
              <div className="relative">
                <Heart className="w-24 h-24 text-[#e8a598] fill-[#e8a598] drop-shadow-[0_10px_25px_rgba(232,165,152,0.6)]" />
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  className="absolute -top-3 -right-2 text-2xl"
                >
                  ✨
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Warm, Encouraging Sensitive Blur Overlay (Cool & Positive, No Red) */}
        {post.isSensitive && !isRevealed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-[#120f1b]/85 backdrop-blur-md border border-[#372b49]/50">
            <div className="w-14 h-14 rounded-full bg-[#272036] border border-[#e8a598]/40 flex items-center justify-center mb-3 shadow-xl">
              <Sparkles className="w-7 h-7 text-[#e8a598]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2a2238] text-[#e8a598] border border-[#e8a598]/30 text-xs font-semibold mb-2.5 shadow-sm">
              <span>🌿</span>
              <span>{t.sensitiveFrameTitle}</span>
            </div>

            <p className="text-xs text-[#cfc7dc] mb-4 max-w-[270px] leading-relaxed font-normal">
              {t.sensitiveFrameDesc}
            </p>

            <button
              onClick={handleRevealClick}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#53395b] to-[#804f6e] hover:from-[#604269] hover:to-[#8f587b] text-white text-xs font-semibold shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#fed7c7]" />
              <span>{t.sensitiveFrameButton}</span>
            </button>
          </div>
        )}

        {/* Gentle Toggle Button when already revealed */}
        {post.isSensitive && isRevealed && (
          <button
            onClick={() => setIsRevealed(false)}
            className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181423]/80 backdrop-blur-md border border-[#3b324d] text-[11px] text-[#cfcadb] hover:text-white cursor-pointer shadow-lg transition-colors"
          >
            <EyeOff className="w-3.5 h-3.5 text-[#e8a598]" />
            <span>{t.reBlurSensitive}</span>
          </button>
        )}
      </div>

      {/* Action Bar & Reactions */}
      <div className="p-3">
        {/* Reactions Picker Bar (Opens on reaction trigger with smooth spring animation) */}
        <AnimatePresence>
          {showReactionPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -6 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="flex items-center justify-around p-2 mb-2.5 rounded-2xl bg-[#1e1a2b] border border-[#483d63] shadow-2xl"
            >
              {REACTION_CONFIG.map(r => (
                <motion.button
                  key={r.type}
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => {
                    onToggleReaction(post.id, r.type);
                    setShowReactionPicker(false);
                  }}
                  className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-colors cursor-pointer ${
                    userReactions.includes(r.type)
                      ? 'bg-[#372b43] ring-1 ring-[#e8a598]'
                      : ''
                  }`}
                >
                  <span className="text-xl">{r.emoji}</span>
                  <span className="text-[9px] text-[#cfcadb] font-medium">
                    {getReactionLabel(r.type, currentLang)}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Row */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Primary Reaction Trigger Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowReactionPicker(!showReactionPicker)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs bg-[#201c2e] hover:bg-[#2c263e] border border-[#3b334d] text-[#e8a598] transition-all cursor-pointer"
              title={t.reactionsHeading}
            >
              <span className="text-sm">✨</span>
              <span className="text-[11px] font-bold">{t.reactionsHeading}</span>
            </motion.button>

            {/* Quick Reaction Pills with active counts */}
            {REACTION_CONFIG.map(r => {
              const count = reactions[r.type] || 0;
              const isActive = userReactions.includes(r.type);
              if (count === 0 && !isActive) return null;

              return (
                <motion.button
                  key={r.type}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onToggleReaction(post.id, r.type)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#3b273b] text-[#f7eefb] border border-[#e8a598]/60 shadow'
                      : 'bg-[#1b1827] text-[#aaa2bc] hover:bg-[#262136] border border-[#2f273e]'
                  }`}
                  title={getReactionLabel(r.type, currentLang)}
                >
                  <span>{r.emoji}</span>
                  <span>{count}</span>
                </motion.button>
              );
            })}

            {/* Comments Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs text-[#9e96ae] hover:text-[#f0ecf6] bg-[#1a1725] transition-colors cursor-pointer ml-1"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-[11px]">{post.comments.length}</span>
            </motion.button>
          </div>

          <div className="flex items-center gap-1">
            {/* Share Button */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={handleShare}
              className="p-1.5 text-[#9e96ae] hover:text-white transition-colors cursor-pointer"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </motion.button>

            {/* Bookmark Button */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => onSave(post.id)}
              className={`p-1.5 transition-colors cursor-pointer ${
                post.saved ? 'text-[#d6a592]' : 'text-[#9e96ae] hover:text-white'
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${post.saved ? 'fill-current' : ''}`}
              />
            </motion.button>
          </div>
        </div>

        {shareNotice && (
          <div className="text-[10px] text-[#9bb39d] mb-2 bg-[#1b251e] p-1.5 rounded-xl text-center border border-[#9bb39d]/30">
            لینک محتوا در حافظه موقت کپی شد ✨
          </div>
        )}

        {/* Body Feature Journey Quote */}
        {displayedBodyJourney && (
          <div className="p-2.5 rounded-2xl bg-[#1a1725] border border-[#2f283e] mb-2.5">
            <div className="flex items-center gap-1.5 text-[10px] text-[#d6a592] font-semibold mb-1">
              <Sparkles className="w-3 h-3" />
              <span>{t.bodyStory}</span>
            </div>
            <p className="text-xs text-[#cfc8de] leading-relaxed">
              {displayedBodyJourney}
            </p>
          </div>
        )}

        {/* Caption */}
        <p className="text-xs text-[#e4e0ee] leading-relaxed mb-2">
          <span className="font-bold text-[#f2eef8] ml-1.5">
            {post.user?.name || 'کاربر'}:
          </span>
          {displayedCaption}
        </p>

        {/* Translation Attribution Notice (Tells what language it was translated from) */}
        {isTranslated && (
          <div className="flex items-center justify-between text-[11px] text-[#a69eb8] py-1.5 px-2.5 mb-2 bg-[#1b1828]/80 rounded-xl border border-[#2d263e]">
            <div className="flex items-center gap-1.5 min-w-0">
              <Languages className="w-3.5 h-3.5 text-[#d6a592] shrink-0" />
              <span className="font-normal truncate">
                {getTranslationNotice(postOriginalLang, currentLang)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowOriginal(prev => !prev)}
              className="text-[#e8a598] hover:text-white transition-colors font-medium cursor-pointer shrink-0 ml-2 rtl:mr-2 rtl:ml-0 text-[11px]"
            >
              {showOriginal ? t.seeTranslation : t.seeOriginal}
            </button>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-lg bg-[#211e2d] text-[#b6acc8] border border-[#363045] hover:border-[#d6a592] transition-colors cursor-pointer"
            >
              #{translateTag(tag, currentLang)}
            </span>
          ))}
        </div>

        {/* Comments Section */}
        {post.comments.length > 0 && !showComments && (
          <button
            onClick={() => setShowComments(true)}
            className="text-[11px] text-[#938ba5] hover:text-[#d4cce4] transition-colors cursor-pointer mb-1 block"
          >
            {currentLang === 'fa' 
              ? `مشاهده همه ${post.comments.length} نظر همراه و صمیمانه...`
              : `View all ${post.comments.length} kind comments...`}
          </button>
        )}

        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-3 pt-3 border-t border-[#252233] overflow-hidden"
            >
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {post.comments.map(c => (
                  <div key={c.id} className="flex items-start gap-2 text-xs">
                    <img
                      src={c.userAvatar}
                      alt={c.userName}
                      className="w-6 h-6 rounded-full object-cover mt-0.5"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 bg-[#191724] p-2 rounded-xl border border-[#2d283c]">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-[11px] text-[#e8e4f2]">
                          {c.userName}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] text-[#7d768e]">
                            {formatRelativeTime(c.createdAt, currentLang)}
                          </span>
                          {onReportComment && (
                            <button
                              onClick={() => onReportComment(c, post)}
                              className="text-[#686278] hover:text-[#d6a592] cursor-pointer"
                              title={t.report}
                            >
                              <Flag className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-[#cfcadb] leading-relaxed">
                        {getLocalizedComment(c.id, c.text, currentLang)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handlePostComment} className="mt-2.5 flex items-center gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={e => setCommentInput(e.target.value)}
                  placeholder={t.leaveCommentPlaceholder}
                  className="flex-1 bg-[#161421] text-xs text-[#ded8ea] px-3 py-2 rounded-xl border border-[#2c263c] focus:border-[#d6a592] outline-none placeholder:text-[#6a637a]"
                />
                <button
                  type="submit"
                  disabled={!commentInput.trim()}
                  className="p-2 rounded-xl bg-[#392b3d] text-[#e8a598] hover:bg-[#48374d] disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
};
