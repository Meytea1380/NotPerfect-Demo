import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Users,
  RefreshCw,
  LogOut,
  LogIn,
  UserPlus,
  ShieldCheck,
  Check,
  Plus,
} from 'lucide-react';
import { User, AppLanguage } from '../types';
import { TRANSLATIONS, isRTL } from '../services/i18n';
import { CozyBrandLogo } from './CozyBrandLogo';

interface NavbarProps {
  currentUser: User;
  allUsers: Record<string, User>;
  onSwitchUser: (userId: string) => void;
  onOpenMessages: () => void;
  unreadMessagesCount: number;
  lang?: AppLanguage;
  onResetData?: () => void;
  isLoggedIn?: boolean;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  onLogout?: () => void;
  activeUsers?: User[];
  onAddAccount?: () => void;
  onLogoutAll?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  onSwitchUser,
  onOpenMessages,
  unreadMessagesCount,
  lang = 'fa',
  onResetData,
  isLoggedIn = true,
  onOpenAuth,
  onLogout,
  activeUsers = [],
  onAddAccount,
  onLogoutAll,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const t = TRANSLATIONS[lang];
  const rtl = isRTL(lang);

  const switchUserTitle =
    lang === 'fa'
      ? 'تغییر حساب کاربری تستی:'
      : lang === 'ar'
      ? 'تبديل المستخدم التجريبي:'
      : lang === 'es'
      ? 'Cambiar usuario de prueba:'
      : lang === 'fr'
      ? 'Changer d’utilisateur de test :'
      : 'Switch Active User:';

  return (
    <header className="shrink-0 px-3.5 sm:px-6 pt-[calc(0.625rem+env(safe-area-inset-top,0px))] pb-2.5 bg-[#14121d]/95 backdrop-blur-md border-b border-[#252033] sticky top-0 z-30 w-full">
      <div className="w-full max-w-4xl lg:max-w-5xl mx-auto flex items-center justify-between">
      {/* Brand Title with localized slogan */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2"
      >
        <motion.div
          whileHover={{ rotate: 6, scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer"
          title="NotPerfect"
        >
          <CozyBrandLogo size={34} animated />
        </motion.div>
        <div>
          <h1 className="flex items-center gap-1">
            <span className="text-lg font-bold tracking-tight text-[#fcf8fd] font-display">
              Not<span className="text-[#e8a598]">Perfect</span>
            </span>
          </h1>
          <p className="text-[10px] text-[#a49db7] -mt-0.5 font-medium">{t.appSlogan}</p>
        </div>
      </motion.div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Auth CTA if not logged in */}
        {!isLoggedIn && onOpenAuth && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onOpenAuth('login')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#6e4659] to-[#b3756b] text-white text-xs font-semibold shadow-md cursor-pointer hover:brightness-110"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{t.login}</span>
          </motion.button>
        )}

        {/* User Switcher / Profile Dropdown */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-1.5 p-1 pr-2.5 rtl:pr-2.5 rtl:pl-1.5 ltr:pl-2.5 ltr:pr-1.5 rounded-full bg-[#201d2c] border border-[#3b354e] hover:border-[#6a5e87] transition-all cursor-pointer"
            title="User & Account Settings"
          >
            <div className="relative">
              <img
                src={
                  currentUser?.avatar ||
                  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'
                }
                alt={currentUser?.name || ''}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-[#d4a89c]/40"
                referrerPolicy="no-referrer"
              />
              {currentUser?.authProvider === 'google' && (
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#4285F4] border border-[#14121d] flex items-center justify-center text-[7px] text-white font-bold">
                  G
                </span>
              )}
            </div>
            <span className="text-[11px] text-[#cfcadb] max-w-[65px] truncate font-medium">
              {(currentUser?.name || 'کاربر').split(' ')[0]}
            </span>
          </motion.button>

          <AnimatePresence>
            {showUserMenu && (
              <>
                {/* Backdrop to close on click outside */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 8 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  className={`absolute ${
                    rtl ? 'left-0' : 'right-0'
                  } mt-2 w-72 max-w-[calc(100vw-32px)] rounded-2xl bg-[#1b1926]/95 border border-[#403953] shadow-2xl p-2.5 z-50 text-start backdrop-blur-xl`}
                >
                  {/* Active User Header */}
                  <div className="p-2.5 mb-2 rounded-xl bg-[#252033] border border-[#3b324d] flex items-center gap-2.5">
                    <img
                      src={currentUser?.avatar}
                      alt={currentUser?.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#e8a598]/50"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#f5edf9] truncate">
                        {currentUser?.name}
                      </p>
                      <p className="text-[10.5px] text-[#baaecd] truncate">
                        @{currentUser?.username}
                        {currentUser?.authProvider === 'google' && (
                          <span className="mr-1 text-[#4285F4] font-semibold"> • Google</span>
                        )}
                      </p>
                    </div>
                    {currentUser?.isAgeVerified && (
                      <ShieldCheck className="w-4 h-4 text-[#9bb39d] shrink-0" title="18+ تایید شده" />
                    )}
                  </div>

                  {/* When inside the account */}
                  {isLoggedIn ? (
                    <div className="pt-1 space-y-2">
                      {/* Active Accounts List */}
                      <div className="border-t border-[#312a42] pt-2">
                        <div className="flex items-center justify-between px-1 mb-1.5">
                          <span className="text-[10px] font-semibold text-[#a69bb8]">
                            {lang === 'fa' ? 'حساب‌های متصل فعال' : 'Connected Accounts'}
                          </span>
                          {activeUsers.length > 1 && (
                            <span className="text-[9.5px] px-1.5 py-0.5 rounded-full bg-[#372d47] text-[#e8a598] font-mono">
                              {activeUsers.length}
                            </span>
                          )}
                        </div>

                        <div className="space-y-1 max-h-36 overflow-y-auto no-scrollbar">
                          {activeUsers.map(acc => {
                            const isCurrent = acc.id === currentUser.id;
                            return (
                              <button
                                key={acc.id}
                                type="button"
                                onClick={() => {
                                  if (!isCurrent) {
                                    onSwitchUser(acc.id);
                                    setShowUserMenu(false);
                                  }
                                }}
                                className={`w-full flex items-center justify-between p-1.5 rounded-xl text-start transition-all cursor-pointer ${
                                  isCurrent
                                    ? 'bg-[#2f273d] border border-[#e8a598]/30 shadow-sm'
                                    : 'hover:bg-[#252033] border border-transparent'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <img
                                    src={acc.avatar}
                                    alt={acc.name}
                                    referrerPolicy="no-referrer"
                                    className="w-7 h-7 rounded-full object-cover shrink-0"
                                  />
                                  <div className="min-w-0 text-start">
                                    <p className="text-[11px] font-bold text-[#f1ecf7] truncate">
                                      {acc.name}
                                    </p>
                                    <p className="text-[9px] text-[#9b90ad] truncate">
                                      @{acc.username}
                                    </p>
                                  </div>
                                </div>
                                {isCurrent ? (
                                  <span className="flex items-center gap-1 text-[9px] font-medium text-[#9bb39d] bg-[#1e2a22] px-1.5 py-0.5 rounded-full shrink-0">
                                    <Check className="w-2.5 h-2.5" />
                                    <span>{lang === 'fa' ? 'فعال' : 'Active'}</span>
                                  </span>
                                ) : (
                                  <span className="text-[9px] text-[#baaecd] bg-[#1d1829] hover:text-white px-1.5 py-0.5 rounded-lg shrink-0">
                                    {lang === 'fa' ? 'سوییچ' : 'Switch'}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Add / Login to another account */}
                        {onAddAccount && (
                          <button
                            type="button"
                            onClick={() => {
                              setShowUserMenu(false);
                              onAddAccount();
                            }}
                            className="w-full mt-1.5 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[10.5px] font-medium text-[#baaecd] hover:text-[#f3edf9] bg-[#191624] hover:bg-[#252036] border border-[#372f48] transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#e8a598]" />
                            <span>
                              {lang === 'fa' ? 'ورود به حساب دیگر' : 'Add another account'}
                            </span>
                          </button>
                        )}
                      </div>

                      {/* Log out actions */}
                      <div className="border-t border-[#312a42] pt-2 space-y-1.5">
                        {onLogout && (
                          <button
                            type="button"
                            onClick={() => {
                              setShowUserMenu(false);
                              onLogout();
                            }}
                            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-[#f87171] bg-[#2a171c] hover:bg-[#381921] border border-[#5c242e] transition-colors cursor-pointer"
                            title={
                              activeUsers.length > 1
                                ? lang === 'fa'
                                  ? 'خروج و بازگشت به حساب قبلی'
                                  : 'Log out and return to previous account'
                                : undefined
                            }
                          >
                            <LogOut className="w-4 h-4" />
                            <span>
                              {activeUsers.length > 1
                                ? lang === 'fa'
                                  ? `خروج از این حساب (${currentUser.name.split(' ')[0]})`
                                  : `Log out (${currentUser.name.split(' ')[0]})`
                                : t.logout}
                            </span>
                          </button>
                        )}

                        {activeUsers.length > 1 && onLogoutAll && (
                          <button
                            type="button"
                            onClick={() => {
                              setShowUserMenu(false);
                              onLogoutAll();
                            }}
                            className="w-full py-1 text-center text-[10px] text-[#a99bb8] hover:text-[#f87171] transition-colors cursor-pointer"
                          >
                            {lang === 'fa' ? 'خروج از تمام حساب‌ها' : 'Log out of all accounts'}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* If not logged in, offer Log in & Sign up */
                    onOpenAuth && (
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setShowUserMenu(false);
                            onOpenAuth('login');
                          }}
                          className="py-2 px-2 rounded-xl bg-gradient-to-r from-[#7a4e63] to-[#c78f82] text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shadow"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>{t.login}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowUserMenu(false);
                            onOpenAuth('signup');
                          }}
                          className="py-2 px-2 rounded-xl bg-[#252033] hover:bg-[#322a42] text-[#f2eaf7] border border-[#3e3451] text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5 text-[#9bb39d]" />
                          <span>{t.signup}</span>
                        </button>
                      </div>
                    )
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
      </div>
    </header>
  );
};
