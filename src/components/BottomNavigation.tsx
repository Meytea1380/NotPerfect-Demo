import React from 'react';
import { motion } from 'motion/react';
import { Home, Compass, Plus, MessageSquare, User as UserIcon } from 'lucide-react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../services/i18n';

export type TabType = 'feed' | 'stories' | 'create' | 'messages' | 'profile';

interface BottomNavigationProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  unreadCount: number;
  lang?: AppLanguage;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onChangeTab,
  unreadCount,
  lang = 'fa',
}) => {
  const t = TRANSLATIONS[lang];

  const tabs: Array<{ id: TabType; label: string; icon: React.FC<{ className?: string }>; color: string }> = [
    { id: 'feed', label: t.navFeed, icon: Home, color: '#e8a598' },
    { id: 'stories', label: t.navExplore, icon: Compass, color: '#9bb39d' },
    { id: 'messages', label: t.navMessages, icon: MessageSquare, color: '#b7a6cb' },
    { id: 'profile', label: t.navProfile, icon: UserIcon, color: '#e6c17b' },
  ];

  return (
    <nav className="shrink-0 sticky bottom-0 z-30 bg-[#13111b]/95 backdrop-blur-md border-t border-[#262033]/80 px-2 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around shadow-[0_-8px_20px_rgba(0,0,0,0.35)]">
      {/* Home / Feed */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => onChangeTab('feed')}
        className="relative flex flex-col items-center py-1 px-3.5 rounded-2xl cursor-pointer"
        title={t.navFeed}
      >
        {activeTab === 'feed' && (
          <motion.div
            layoutId="bottomNavIndicator"
            className="absolute inset-0 bg-[#2b2131] rounded-2xl -z-10 shadow-inner"
            transition={{ type: 'spring', damping: 26, stiffness: 380 }}
          />
        )}
        <Home className={`w-4 h-4 transition-colors ${activeTab === 'feed' ? 'text-[#e8a598] stroke-[2.5]' : 'text-[#857e93]'}`} />
        <span className={`text-[10px] mt-0.5 tracking-tight transition-colors ${activeTab === 'feed' ? 'text-[#e8a598] font-bold' : 'text-[#857e93]'}`}>
          {t.navFeed}
        </span>
      </motion.button>

      {/* Explore */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => onChangeTab('stories')}
        className="relative flex flex-col items-center py-1 px-3.5 rounded-2xl cursor-pointer"
        title={t.navExplore}
      >
        {activeTab === 'stories' && (
          <motion.div
            layoutId="bottomNavIndicator"
            className="absolute inset-0 bg-[#1b261e] rounded-2xl -z-10 shadow-inner"
            transition={{ type: 'spring', damping: 26, stiffness: 380 }}
          />
        )}
        <Compass className={`w-4 h-4 transition-colors ${activeTab === 'stories' ? 'text-[#9bb39d] stroke-[2.5]' : 'text-[#857e93]'}`} />
        <span className={`text-[10px] mt-0.5 tracking-tight transition-colors ${activeTab === 'stories' ? 'text-[#9bb39d] font-bold' : 'text-[#857e93]'}`}>
          {t.navExplore}
        </span>
      </motion.button>

      {/* Create Button (Floating center action with spring bounce) */}
      <motion.button
        whileHover={{ scale: 1.12, y: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onChangeTab('create')}
        className="flex items-center justify-center -mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-[#694254] via-[#8a5563] to-[#d6a592] text-white shadow-[0_8px_22px_rgba(214,165,146,0.45)] border-2 border-[#15131f] cursor-pointer"
        title={t.navCreate}
      >
        <Plus className="w-5 h-5 stroke-[2.5]" />
      </motion.button>

      {/* Messages */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => onChangeTab('messages')}
        className="relative flex flex-col items-center py-1 px-3.5 rounded-2xl cursor-pointer"
        title={t.navMessages}
      >
        {activeTab === 'messages' && (
          <motion.div
            layoutId="bottomNavIndicator"
            className="absolute inset-0 bg-[#251f33] rounded-2xl -z-10 shadow-inner"
            transition={{ type: 'spring', damping: 26, stiffness: 380 }}
          />
        )}
        <div className="relative">
          <MessageSquare className={`w-4 h-4 transition-colors ${activeTab === 'messages' ? 'text-[#b7a6cb] stroke-[2.5]' : 'text-[#857e93]'}`} />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-[#e8a598] ring-2 ring-[#13111b]"
            />
          )}
        </div>
        <span className={`text-[10px] mt-0.5 tracking-tight transition-colors ${activeTab === 'messages' ? 'text-[#b7a6cb] font-bold' : 'text-[#857e93]'}`}>
          {t.navMessages}
        </span>
      </motion.button>

      {/* Profile */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => onChangeTab('profile')}
        className="relative flex flex-col items-center py-1 px-3.5 rounded-2xl cursor-pointer"
        title={t.navProfile}
      >
        {activeTab === 'profile' && (
          <motion.div
            layoutId="bottomNavIndicator"
            className="absolute inset-0 bg-[#29221b] rounded-2xl -z-10 shadow-inner"
            transition={{ type: 'spring', damping: 26, stiffness: 380 }}
          />
        )}
        <UserIcon className={`w-4 h-4 transition-colors ${activeTab === 'profile' ? 'text-[#e6c17b] stroke-[2.5]' : 'text-[#857e93]'}`} />
        <span className={`text-[10px] mt-0.5 tracking-tight transition-colors ${activeTab === 'profile' ? 'text-[#e6c17b] font-bold' : 'text-[#857e93]'}`}>
          {t.navProfile}
        </span>
      </motion.button>
    </nav>
  );
};
