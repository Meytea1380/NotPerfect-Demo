import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Check,
  Plus,
  LogOut,
  ShieldCheck,
  Key,
  Users,
  UserCheck,
} from 'lucide-react';
import { User, AppLanguage } from '../types';

interface AccountSwitcherSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  activeUsers: User[];
  onSwitchAccount: (userId: string) => void;
  onAddNewAccount: () => void;
  onLogoutCurrent: () => void;
  onLogoutAll?: () => void;
  lang?: AppLanguage;
}

export const AccountSwitcherSheet: React.FC<AccountSwitcherSheetProps> = ({
  isOpen,
  onClose,
  currentUser,
  activeUsers,
  onSwitchAccount,
  onAddNewAccount,
  onLogoutCurrent,
  onLogoutAll,
  lang = 'fa',
}) => {
  if (!isOpen) return null;

  const isFa = lang === 'fa';
  const isAr = lang === 'ar';
  const isRtl = isFa || isAr;

  return (
    <AnimatePresence>
      <div
        className="absolute inset-0 z-50 flex flex-col justify-end bg-black/75 backdrop-blur-sm overflow-hidden select-none"
        dir={isRtl ? 'rtl' : 'ltr'}
        onClick={onClose}
      >
        {/* Animated Bottom Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-h-[85%] bg-[#151221] border-t border-[#342b47] rounded-t-[32px] p-5 shadow-2xl flex flex-col overflow-hidden text-[#ede8f5]"
        >
          {/* Grab Handle */}
          <div className="w-12 h-1.5 rounded-full bg-[#3e3454] mx-auto mb-3 self-center shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#292238] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl bg-[#292038] border border-[#483761] flex items-center justify-center text-[#e8a598]">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#fcf8ff] flex items-center gap-2">
                  <span>
                    {isFa
                      ? 'مدیریت و تغییر حساب‌ها'
                      : isAr
                      ? 'تبديل الحسابات'
                      : 'Switch & Manage Accounts'}
                  </span>
                  {activeUsers.length > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2a2139] border border-[#e8a598]/40 text-[#e8a598] font-mono">
                      {activeUsers.length}
                    </span>
                  )}
                </h3>
                <p className="text-[10.5px] text-[#9b91ad]">
                  {isFa
                    ? 'جابجایی سریع بین حساب‌های از قبل احراز هویت شده'
                    : isAr
                    ? 'التبديل الفوري بين الحسابات الموثقة'
                    : 'Instant switching between authenticated accounts'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-full bg-[#231d33] hover:bg-[#312946] text-[#baaecd] hover:text-white transition-colors cursor-pointer border border-[#3c3254]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List of Previously Authenticated / Active Accounts */}
          <div className="py-3 flex-1 overflow-y-auto space-y-2 no-scrollbar pr-0.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#a89dbb] px-1 mb-1">
              <span>{isFa ? 'حساب‌های متصل' : isAr ? 'الحسابات المتصلة' : 'Connected Profiles'}</span>
              <span className="text-[10px] text-[#7d7391]">
                {isFa ? 'برای سوییچ ضربه بزنید' : 'Tap to switch'}
              </span>
            </div>

            {activeUsers.map(acc => {
              const isCurrent = acc.id === currentUser.id;
              const isVerified =
                acc.isAgeVerified || acc.ageVerificationStatus === 'verified';

              return (
                <div
                  key={acc.id}
                  onClick={() => {
                    if (!isCurrent) {
                      onSwitchAccount(acc.id);
                      onClose();
                    }
                  }}
                  className={`w-full p-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer border ${
                    isCurrent
                      ? 'bg-[#292138] border-[#e8a598]/60 shadow-md ring-1 ring-[#e8a598]/30'
                      : 'bg-[#191526] hover:bg-[#231d35] border-[#2f2742]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        referrerPolicy="no-referrer"
                        className={`w-11 h-11 rounded-full object-cover ring-2 ${
                          isCurrent ? 'ring-[#e8a598]' : 'ring-[#3b3252]'
                        }`}
                      />
                      {isCurrent && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#9bb39d] text-[#121c14] flex items-center justify-center shadow-sm">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 text-start">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-[#f5edf9] truncate">
                          {acc.name}
                        </p>
                        {isVerified && (
                          <ShieldCheck
                            className="w-3.5 h-3.5 text-[#9bb39d] shrink-0"
                            title="18+ Verified"
                          />
                        )}
                        {acc.authProvider === 'google' && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-[#4285F4]/15 text-[#8ab4f8] font-semibold border border-[#4285F4]/30">
                            Google
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[10.5px] text-[#9b90ad]">
                        <span className="font-mono text-[#cfc7de]">@{acc.username}</span>
                        {acc.email && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[130px]">{acc.email}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status / Switch Action Badge */}
                  <div className="shrink-0 flex items-center gap-1">
                    {isCurrent ? (
                      <span className="text-[10px] font-bold text-[#9bb39d] bg-[#1a2b20] border border-[#9bb39d]/40 px-2.5 py-1 rounded-xl flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        <span>{isFa ? 'فعال' : isAr ? 'نشط' : 'Active'}</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="text-[10.5px] font-semibold text-[#e8a598] bg-[#271f35] hover:bg-[#342947] border border-[#e8a598]/30 hover:border-[#e8a598]/70 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                      >
                        <UserCheck className="w-3 h-3" />
                        <span>{isFa ? 'انتخاب' : isAr ? 'تبديل' : 'Switch'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons: Add another account / Log out current / Log out all */}
          <div className="pt-3 border-t border-[#292238] space-y-2 shrink-0">
            {/* Add / Connect another Account */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onAddNewAccount();
              }}
              className="w-full py-2.5 px-3 rounded-2xl bg-[#211b30] hover:bg-[#2c2440] border border-[#413559] text-xs font-bold text-[#f2ebf8] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:border-[#e8a598]/50"
            >
              <div className="w-5 h-5 rounded-lg bg-[#302544] flex items-center justify-center text-[#e8a598]">
                <Plus className="w-3.5 h-3.5" />
              </div>
              <span>
                {isFa
                  ? 'ورود به حساب کاربری دیگر'
                  : isAr
                  ? 'إضافة أو تسجيل الدخول لحساب آخر'
                  : 'Add or Login to Another Account'}
              </span>
            </button>

            {/* Logout actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogoutCurrent();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-[#29171e] hover:bg-[#371d26] border border-[#5a232f] text-[#fca5a5] text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title={
                  activeUsers.length > 1
                    ? isFa
                      ? 'خروج و بازگشت خودکار به حساب قبلی'
                      : 'Log out and return to previous account'
                    : undefined
                }
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>
                  {activeUsers.length > 1
                    ? isFa
                      ? `خروج از حساب فعلی (${currentUser.name.split(' ')[0]})`
                      : `Log out (${currentUser.name.split(' ')[0]})`
                    : isFa
                    ? 'خروج از حساب'
                    : 'Log Out'}
                </span>
              </button>

              {activeUsers.length > 1 && onLogoutAll && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLogoutAll();
                  }}
                  className="py-2 px-3 rounded-xl bg-[#1b1728] hover:bg-[#261f38] border border-[#392e4e] text-[#a99bbd] hover:text-[#fca5a5] text-[10.5px] font-semibold transition-colors cursor-pointer"
                >
                  {isFa ? 'خروج از همه' : 'Log out all'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
