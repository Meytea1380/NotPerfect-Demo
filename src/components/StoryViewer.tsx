import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Plus, X, Heart, Send, Sparkles, ChevronRight, ChevronLeft, Eye } from 'lucide-react';
import { Story, User, AppLanguage } from '../types';
import { TRANSLATIONS } from '../services/i18n';

interface StoryViewerProps {
  stories: Story[];
  currentUser: User;
  onAddStory: (mediaUrl: string, caption?: string) => void;
  onSendStoryReply: (targetUserId: string, message: string) => void;
  onStoryViewed: (storyId: string) => void;
  lang?: AppLanguage;
}

interface UserStoryGroup {
  user: User;
  stories: Story[];
  hasUnviewed: boolean;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  currentUser,
  onAddStory,
  onSendStoryReply,
  onStoryViewed,
  lang = 'fa',
}) => {
  const t = TRANSLATIONS[lang];

  // Group stories by User (Instagram style)
  const groupedStories = useMemo<UserStoryGroup[]>(() => {
    const map = new Map<string, UserStoryGroup>();

    stories.forEach(story => {
      if (story.isRemoved) return;
      const existing = map.get(story.userId);
      if (!existing) {
        map.set(story.userId, {
          user: story.user,
          stories: [story],
          hasUnviewed: !story.viewed,
        });
      } else {
        existing.stories.push(story);
        if (!story.viewed) existing.hasUnviewed = true;
      }
    });

    return Array.from(map.values());
  }, [stories]);

  // Active Story Viewer State: active user index and active story index within that user
  const [activeUserIdx, setActiveUserIdx] = useState<number | null>(null);
  const [activeStoryIdxInUser, setActiveStoryIdxInUser] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStoryImage, setNewStoryImage] = useState('');
  const [newStoryCaption, setNewStoryCaption] = useState('');

  const activeGroup = activeUserIdx !== null ? groupedStories[activeUserIdx] : null;
  const currentStory = activeGroup ? activeGroup.stories[activeStoryIdxInUser] : null;

  // Stable references for timer and navigation callbacks
  const activeUserIdxRef = useRef(activeUserIdx);
  const activeStoryIdxInUserRef = useRef(activeStoryIdxInUser);
  const groupedStoriesRef = useRef(groupedStories);

  activeUserIdxRef.current = activeUserIdx;
  activeStoryIdxInUserRef.current = activeStoryIdxInUser;
  groupedStoriesRef.current = groupedStories;

  const handleNext = useCallback(() => {
    const userIdx = activeUserIdxRef.current;
    if (userIdx === null) return;
    const group = groupedStoriesRef.current[userIdx];
    if (!group) return;

    const storyIdx = activeStoryIdxInUserRef.current;

    // Next story in same user
    if (storyIdx < group.stories.length - 1) {
      setActiveStoryIdxInUser(storyIdx + 1);
      setProgress(0);
      setIsLiked(false);
    } else {
      // Current user's stories exhausted -> advance to next user!
      if (userIdx < groupedStoriesRef.current.length - 1) {
        setActiveUserIdx(userIdx + 1);
        setActiveStoryIdxInUser(0);
        setProgress(0);
        setIsLiked(false);
      } else {
        // End of all users' stories -> close viewer
        setActiveUserIdx(null);
        setActiveStoryIdxInUser(0);
        setProgress(0);
        setIsLiked(false);
      }
    }
  }, []);

  const handlePrev = useCallback(() => {
    const userIdx = activeUserIdxRef.current;
    if (userIdx === null) return;
    const group = groupedStoriesRef.current[userIdx];
    if (!group) return;

    const storyIdx = activeStoryIdxInUserRef.current;

    // Previous story in same user
    if (storyIdx > 0) {
      setActiveStoryIdxInUser(storyIdx - 1);
      setProgress(0);
      setIsLiked(false);
    } else {
      // Previous user's last story
      if (userIdx > 0) {
        const prevGroup = groupedStoriesRef.current[userIdx - 1];
        setActiveUserIdx(userIdx - 1);
        setActiveStoryIdxInUser(prevGroup.stories.length - 1);
        setProgress(0);
        setIsLiked(false);
      } else {
        setProgress(0);
      }
    }
  }, []);

  const handleNextRef = useRef(handleNext);
  handleNextRef.current = handleNext;

  // Reset progress and mark viewed when story changes
  useEffect(() => {
    if (activeUserIdx === null || !currentStory) return;
    onStoryViewed(currentStory.id);
    setProgress(0);
  }, [activeUserIdx, activeStoryIdxInUser, currentStory?.id, onStoryViewed]);

  // 5-second automatic progression per story with smooth progress bar
  useEffect(() => {
    if (activeUserIdx === null || !currentStory || isPaused) return;

    const STORY_DURATION_MS = 5000;
    const TICK_INTERVAL_MS = 40;
    const startTime = Date.now() - (progress / 100) * STORY_DURATION_MS;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentPct = Math.min(100, (elapsed / STORY_DURATION_MS) * 100);
      setProgress(currentPct);

      if (elapsed >= STORY_DURATION_MS) {
        clearInterval(interval);
        handleNextRef.current();
      }
    }, TICK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [activeUserIdx, activeStoryIdxInUser, isPaused, currentStory?.id]);

  const handleSendReply = () => {
    if (!replyText.trim() || !currentStory) return;
    onSendStoryReply(
      currentStory.userId,
      `پاسخ به استوری: "${replyText.trim()}"`
    );
    setReplyText('');
    setActiveUserIdx(null);
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewStoryImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveNewStory = () => {
    const sampleImg =
      newStoryImage ||
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80';
    onAddStory(sampleImg, newStoryCaption);
    setShowAddModal(false);
    setNewStoryImage('');
    setNewStoryCaption('');
  };

  // Check if current user has active stories
  const myGroup = groupedStories.find(g => g.user.id === currentUser.id);

  return (
    <>
      {/* Instagram-Style Story Tray */}
      <div className="py-2.5 px-3 flex items-center gap-3.5 overflow-x-auto no-scrollbar border-b border-[#23202e]/60 bg-[#12111a]">
        {/* Current User Story / Add Button */}
        <div className="flex flex-col items-center flex-shrink-0 w-16 cursor-pointer group">
          <div
            onClick={() => {
              if (myGroup && myGroup.stories.length > 0) {
                const idx = groupedStories.findIndex(g => g.user.id === currentUser.id);
                setActiveUserIdx(idx);
                setActiveStoryIdxInUser(0);
                setProgress(0);
              } else {
                setShowAddModal(true);
              }
            }}
            className="relative w-14 h-14 rounded-full p-[2px] transition-all hover:scale-105"
          >
            <div
              className={`w-full h-full rounded-full p-[2px] ${
                myGroup && myGroup.stories.length > 0
                  ? 'bg-gradient-to-tr from-[#9bb39d] via-[#d6a592] to-[#b7a6cb]'
                  : 'border border-dashed border-[#d6a592]/50'
              }`}
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'}
                alt="پروفایل شما"
                className="w-full h-full rounded-full object-cover border border-[#12111a]"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Plus Icon to Add */}
            <button
              onClick={e => {
                e.stopPropagation();
                setShowAddModal(true);
              }}
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#e8a598] text-[#13111b] flex items-center justify-center border-2 border-[#12111a] shadow hover:scale-110 transition-transform cursor-pointer"
              title={t.addStory}
            >
              <Plus className="w-3 h-3 stroke-[3]" />
            </button>
          </div>
          <span className="text-[10px] text-[#b6aec7] mt-1 text-center truncate w-full font-medium">
            {t.myStory}
          </span>
        </div>

        {/* Grouped User Story Bubbles (Exactly one bubble per user) */}
        {groupedStories
          .filter(g => g.user.id !== currentUser.id)
          .map((group, idx) => {
            const actualIndex = groupedStories.findIndex(g => g.user.id === group.user.id);
            return (
              <div
                key={group.user.id}
                onClick={() => {
                  setActiveUserIdx(actualIndex);
                  setActiveStoryIdxInUser(0);
                  setProgress(0);
                }}
                className="flex flex-col items-center flex-shrink-0 w-16 cursor-pointer group"
              >
                <div className="relative w-14 h-14 transition-all group-hover:scale-105">
                  <div
                    className={`w-full h-full rounded-full p-[2.5px] ${
                      group.hasUnviewed
                        ? 'bg-gradient-to-tr from-[#9bb39d] via-[#d6a592] to-[#b7a6cb] animate-pulse-slow'
                        : 'border border-[#3c364e]'
                    }`}
                  >
                    <img
                      src={group.user?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'}
                      alt={group.user?.name || ''}
                      className="w-full h-full rounded-full object-cover border-2 border-[#12111a]"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Multi-story count badge if user has more than 1 story */}
                  {group.stories.length > 1 && (
                    <span className="absolute top-0 right-0 px-1 py-0.2 rounded-full bg-[#271d2b] border border-[#e8a598]/60 text-[8px] font-bold text-[#e8a598] shadow">
                      {group.stories.length}
                    </span>
                  )}
                </div>

                {/* Centered, clean name with single-line truncation */}
                <span className="text-[10px] text-[#ded9eb] mt-1 text-center truncate w-full font-medium">
                  {group.user.name.split(' ')[0]}
                </span>
              </div>
            );
          })}
      </div>

      {/* Full-Screen Instagram-Style Story Viewer Modal */}
      {activeGroup && currentStory && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in">
          <div
            className="relative w-full max-w-md h-full sm:h-[94vh] sm:max-h-[920px] sm:rounded-3xl sm:border sm:border-[#332b45] bg-[#0d0c13] flex flex-col justify-between overflow-hidden select-none"
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* Top Multi-Segmented Progress Bars (Segment count = this user's story count) */}
            <div className="absolute top-3 left-3 right-3 z-30 flex gap-1.5">
              {activeGroup.stories.map((s, idx) => (
                <div key={s.id} className="h-1 flex-1 bg-white/25 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#e8a598] transition-all duration-100"
                    style={{
                      width:
                        idx < activeStoryIdxInUser
                          ? '100%'
                          : idx === activeStoryIdxInUser
                          ? `${progress}%`
                          : '0%',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Story Header: User Info & Close */}
            <div className="absolute top-6 left-3 right-3 z-30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={activeGroup.user?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'}
                  alt={activeGroup.user?.name || ''}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-white/60"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white drop-shadow">
                      {activeGroup.user?.name || 'کاربر'}
                    </span>
                    {activeGroup.stories.length > 1 && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-black/60 text-[#e8a598] border border-[#e8a598]/30">
                        {activeStoryIdxInUser + 1} از {activeGroup.stories.length}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-white/70 block -mt-0.5">
                    {currentStory.createdAt}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveUserIdx(null);
                  setActiveStoryIdxInUser(0);
                }}
                className="p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Center Story Media */}
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={currentStory.mediaUrl}
                alt="Story Media"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />

              {/* Tap Left / Right touch zones */}
              <div
                onClick={handlePrev}
                className="absolute top-16 bottom-24 left-0 w-1/3 cursor-pointer z-20 flex items-center justify-start pl-2 opacity-0 hover:opacity-40 transition-opacity"
              >
                <ChevronLeft className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
              <div
                onClick={handleNext}
                className="absolute top-16 bottom-24 right-0 w-1/3 cursor-pointer z-20 flex items-center justify-end pr-2 opacity-0 hover:opacity-40 transition-opacity"
              >
                <ChevronRight className="w-8 h-8 text-white drop-shadow-lg" />
              </div>

              {/* Subtle painterly gradient vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50 pointer-events-none" />
            </div>

            {/* Bottom Section: Caption & Reply (Unified, clean, non-overlapping) */}
            <div className="absolute bottom-0 left-0 right-0 z-30 p-3 pb-5 bg-gradient-to-t from-black via-black/80 to-transparent">
              {/* Caption Box */}
              {currentStory.caption && (
                <div className="p-2.5 rounded-2xl bg-[#1d1827]/90 backdrop-blur-md border border-[#3b324d] mb-2.5 text-right shadow-lg">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#e8a598] font-bold mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>پیام استوری:</span>
                  </div>
                  <p className="text-xs text-[#f2ecf8] leading-relaxed">
                    {currentStory.caption}
                  </p>
                </div>
              )}

              {/* Reply and Reaction Row */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="پاسخ صمیمانه به این استوری..."
                  className="flex-1 bg-[#191724]/90 backdrop-blur-md text-xs text-[#ded8ea] px-3.5 py-2.5 rounded-2xl border border-[#372f48] focus:border-[#d6a592] outline-none placeholder:text-[#7d758d]"
                />

                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2.5 rounded-2xl border backdrop-blur-md transition-all cursor-pointer ${
                    isLiked
                      ? 'bg-[#3b1c28] border-[#f28e83] text-[#f28e83]'
                      : 'bg-[#191724]/90 border-[#372f48] text-[#9a91a9] hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className="p-2.5 rounded-2xl bg-gradient-to-r from-[#694254] to-[#c28377] text-white disabled:opacity-40 hover:brightness-110 transition-all cursor-pointer shadow"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Story Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in overflow-y-auto">
          <div className="w-full sm:max-w-md rounded-t-[28px] sm:rounded-3xl bg-[#171422] border-t sm:border border-[#3e344e] p-4 sm:p-5 text-right shadow-2xl max-h-[90dvh] overflow-y-auto no-scrollbar">
            {/* Mobile Drag Indicator */}
            <div className="sm:hidden w-10 h-1 bg-[#4b435e] rounded-full mx-auto mb-2.5" />
            <div className="flex items-center justify-between pb-3 border-b border-[#282236] mb-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-[#8f88a2] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xs font-bold text-[#f5edf9] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#e8a598]" />
                <span>اشتراک‌گذاری استوری جدید</span>
              </h3>
            </div>

            <div className="space-y-3">
              {newStoryImage ? (
                <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-[#3d344f]">
                  <img
                    src={newStoryImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setNewStoryImage('')}
                    className="absolute top-2 left-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-[#3e344e] hover:border-[#e8a598]/60 transition-colors cursor-pointer bg-[#14121d]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadImage}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-[#272134] flex items-center justify-center text-[#e8a598] mb-2">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-[#cfcadb] font-medium">
                    انتخاب عکس از گالری
                  </span>
                  <span className="text-[10px] text-[#7d758d] mt-0.5">
                    عکس واقعی، بدون ادیت یا فیلتر
                  </span>
                </label>
              )}

              <div>
                <label className="block text-[11px] text-[#b4accd] mb-1 font-medium">
                  متن همراه استوری:
                </label>
                <input
                  type="text"
                  value={newStoryCaption}
                  onChange={e => setNewStoryCaption(e.target.value)}
                  placeholder="حس و حال و حس پذیرش امروزت رو بنویس..."
                  className="w-full bg-[#121019] text-xs text-[#ded8ea] px-3 py-2.5 rounded-xl border border-[#2d263b] focus:border-[#d6a592] outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl bg-[#231f2f] text-xs text-[#a9a1bb] hover:bg-[#2c263c] cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleSaveNewStory}
                  className="flex-[2] py-2 rounded-xl bg-gradient-to-r from-[#694254] to-[#c28377] text-white text-xs font-bold hover:brightness-110 cursor-pointer shadow"
                >
                  ارسال استوری 🕊️
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
