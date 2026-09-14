import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Heart,
  Loader2,
} from 'lucide-react';
import { User, AppLanguage, AuthMode } from '../types';
import { TRANSLATIONS } from '../services/i18n';
import { StorageService } from '../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User, method: 'google' | 'email' | 'demo') => void;
  initialMode?: AuthMode;
  lang?: AppLanguage;
}

const AVATAR_PRESETS = [
  {
    label: 'طبیعی و شاداب',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'آرام و دلنشین',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'قوی و پذیرفته',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'صمیمی و صلح‌آمیز',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'تابنده و رها',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  },
];

const BODY_JOURNEY_TAGS = [
  'پذیرش بافت پوست',
  'ویتیلیگو',
  'استرچ‌مارک‌های طبیعی',
  'اسکار جراحی و زخم',
  'تغییرات وزن',
  'سلولیت و خطوط نرم',
  'آکنه و کک‌ومک',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
  lang = 'fa',
}) => {
  const currentLang = (lang as AppLanguage) || 'fa';
  const t = TRANSLATIONS[currentLang];

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [selectedTag, setSelectedTag] = useState(BODY_JOURNEY_TAGS[0]);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0].url);

  // Status & loading
  const [isLoading, setIsLoading] = useState(false);
  const [googleConnecting, setGoogleConnecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ user: User; message: string } | null>(null);

  // Reset states on open/mode change
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMsg(null);
      setSuccessInfo(null);
      setIsLoading(false);
      setGoogleConnecting(false);
    }
  }, [isOpen, initialMode]);

  // Demo accounts for instant test
  const demoUsers = [
    { name: 'دریا کاظمی', id: 'darya_natural', email: 'darya@notperfect.app', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80' },
    { name: 'کیان راد', id: 'kian_journey', email: 'kian@notperfect.app', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
    { name: 'نیلوفر پروانه', id: 'niloofar_raw', email: 'niloofar@notperfect.app', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' },
  ];

  // Google Sign In (Local & Storage authenticated)
  const handleGoogleSignIn = async (customEmail?: string, customName?: string) => {
    setErrorMsg(null);
    setGoogleConnecting(true);

    try {
      const targetEmail = customEmail || 'meitymohajeri@gmail.com';
      const targetName = customName || (lang === 'fa' ? 'مهدی مهاجری' : 'Meity Mohajeri');
      const targetAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';

      const res = StorageService.loginWithGoogle({
        email: targetEmail,
        name: targetName,
        avatar: targetAvatar,
      });

      setGoogleConnecting(false);
      if (res.success && res.user) {
        setSuccessInfo({
          user: res.user,
          message: t.googleAuthSuccess,
        });

        setTimeout(() => {
          onSuccess(res.user, 'google');
          onClose();
        }, 850);
      }
    } catch {
      setGoogleConnecting(false);
      setErrorMsg(
        lang === 'fa'
          ? 'خطا در اتصال به سرویس ورود. لطفاً مجدداً امتحان کنید.'
          : 'Failed to connect. Please try again.'
      );
    }
  };

  // Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg('لطفاً ایمیل یا نام کاربری خود را وارد کنید.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    await new Promise(r => setTimeout(r, 450));

    const res = StorageService.login(identifier, password);
    setIsLoading(false);

    if (res.success && res.user) {
      setSuccessInfo({
        user: res.user,
        message: t.loginSuccess,
      });
      setTimeout(() => {
        onSuccess(res.user!, 'email');
        onClose();
      }, 850);
    } else {
      setErrorMsg(res.error || 'اطلاعات ورود صحیح نمی‌باشد.');
    }
  };

  // Submit Signup
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim() || !email.trim()) {
      setErrorMsg('لطفاً نام، نام کاربری و ایمیل خود را به طور کامل وارد کنید.');
      return;
    }

    if (!email.includes('@')) {
      setErrorMsg('فرمت ایمیل نامعتبر است.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    await new Promise(r => setTimeout(r, 550));

    const res = StorageService.signup({
      name: fullName.trim(),
      username: username.trim(),
      email: email.trim(),
      password,
      bio: bio.trim(),
      bodyStorySummary: selectedTag,
      avatar: selectedAvatar,
    });

    setIsLoading(false);

    if (res.success && res.user) {
      setSuccessInfo({
        user: res.user,
        message: t.signupSuccess,
      });
      setTimeout(() => {
        onSuccess(res.user!, 'email');
        onClose();
      }, 900);
    } else {
      setErrorMsg(res.error || 'خطا در ثبت‌نام. لطفاً اطلاعات را بررسی کنید.');
    }
  };

  // One-click demo login
  const handleDemoLogin = (userId: string) => {
    setErrorMsg(null);
    const res = StorageService.login(userId);
    if (res.success && res.user) {
      setSuccessInfo({
        user: res.user,
        message: `${res.user.name} خوش آمدید!`,
      });
      setTimeout(() => {
        onSuccess(res.user!, 'demo');
        onClose();
      }, 700);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="auth-modal-overlay"
        className="absolute inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          id="auth-modal-dialog"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-sm my-auto bg-[#171422] border border-[#3e344e] rounded-3xl shadow-2xl p-4 sm:p-5 text-start max-h-[92%] overflow-y-auto no-scrollbar"
        >
          {/* Ambient organic aura */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#e8a598]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#9bb39d]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 rounded-full bg-[#231f31] text-[#938ba5] hover:text-white transition-colors cursor-pointer z-10"
            title={t.cancel}
          >
            <X className="w-4 h-4" />
          </motion.button>

          {/* Success Animated View */}
          {successInfo ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 text-center flex flex-col items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.45 }}
                className="w-16 h-16 rounded-full bg-[#1b2b20] border-2 border-[#9bb39d] flex items-center justify-center text-[#9bb39d] mb-4 shadow-lg shadow-[#9bb39d]/20"
              >
                <CheckCircle2 className="w-9 h-9" />
              </motion.div>
              <h3 className="text-base font-bold text-[#f5edf9] mb-1.5">
                {successInfo.user.name}
              </h3>
              <p className="text-xs text-[#9bb39d] font-medium max-w-xs leading-relaxed">
                {successInfo.message}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-[11px] text-[#baaecd]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#e8a598]" />
                <span>حساب شما فعال و تایید شده است</span>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Header Title & Slogan */}
              <div className="text-center pt-1 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#282136] border border-[#483a5e] text-[#e8a598] text-[11px] font-medium mb-2.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>NotPerfect • پناهگاه امن پذیرش تن</span>
                </div>
                <h2 className="text-lg font-extrabold text-[#f5edf9] tracking-tight">
                  {mode === 'login' ? t.loginTitle : t.signupTitle}
                </h2>
                <p className="text-xs text-[#b8afcb] mt-1 max-w-xs mx-auto leading-relaxed">
                  {mode === 'login' ? t.loginSubtitle : t.signupSubtitle}
                </p>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex bg-[#12101b] p-1 rounded-2xl border border-[#2e263d] mb-4 relative">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all relative z-10 cursor-pointer ${
                    mode === 'login' ? 'text-white' : 'text-[#877e9b] hover:text-[#c4bcd3]'
                  }`}
                >
                  {mode === 'login' && (
                    <motion.div
                      layoutId="authActiveTab"
                      className="absolute inset-0 bg-gradient-to-r from-[#5a3648] to-[#91564f] rounded-xl shadow-md -z-10"
                      transition={{ type: 'spring', damping: 24, stiffness: 350 }}
                    />
                  )}
                  {t.login}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all relative z-10 cursor-pointer ${
                    mode === 'signup' ? 'text-white' : 'text-[#877e9b] hover:text-[#c4bcd3]'
                  }`}
                >
                  {mode === 'signup' && (
                    <motion.div
                      layoutId="authActiveTab"
                      className="absolute inset-0 bg-gradient-to-r from-[#5a3648] to-[#91564f] rounded-xl shadow-md -z-10"
                      transition={{ type: 'spring', damping: 24, stiffness: 350 }}
                    />
                  )}
                  {t.signup}
                </button>
              </div>

              {/* Google Fast Login Button */}
              <div className="space-y-2 mb-4">
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  type="button"
                  disabled={googleConnecting || isLoading}
                  onClick={() => handleGoogleSignIn()}
                  className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#f8f9fa] text-[#202124] border border-[#dadce0] font-medium text-xs flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer relative overflow-hidden"
                >
                  {googleConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 text-[#4285F4] animate-spin" />
                      <span className="text-[#3c4043] font-semibold">
                        در حال اتصال امن به Google...
                      </span>
                    </>
                  ) : (
                    <>
                      {/* Authentic Google 'G' SVG */}
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span className="font-semibold text-[#3c4043]">
                        {t.continueWithGoogle}
                      </span>
                      <span className="text-[10px] text-[#70757a] bg-[#f1f3f4] px-1.5 py-0.5 rounded-md font-normal">
                        تایید سن خودکار ۱۸+
                      </span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 h-px bg-[#2d253d]" />
                <span className="text-[11px] text-[#7d7391]">{t.orDivider}</span>
                <div className="flex-1 h-px bg-[#2d253d]" />
              </div>

              {/* Error Notice */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="p-2.5 mb-3 rounded-xl bg-[#2e171b] border border-[#6b252f] flex items-center gap-2 text-xs text-[#fca5a5]"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#f87171]" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Views */}
              <AnimatePresence mode="wait">
                {mode === 'login' ? (
                  /* ================= LOGIN VIEW ================= */
                  <motion.form
                    key="login-form"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.18 }}
                    onSubmit={handleLoginSubmit}
                    className="space-y-3"
                  >
                    <div>
                      <label className="text-[11px] font-medium text-[#baaecd] block mb-1">
                        {t.emailOrUsername}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={identifier}
                          onChange={e => setIdentifier(e.target.value)}
                          placeholder="مثال: darya@notperfect.app یا darya_natural"
                          className="w-full bg-[#12101b] border border-[#393148] rounded-2xl px-3.5 py-2.5 text-xs text-[#f5edf9] placeholder-[#5f5670] outline-none focus:border-[#e8a598] transition-all"
                        />
                        <Mail className="w-4 h-4 absolute left-3 top-3 text-[#6c627f]" />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-[#baaecd] block mb-1">
                        {t.password}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#12101b] border border-[#393148] rounded-2xl px-3.5 py-2.5 text-xs text-[#f5edf9] placeholder-[#5f5670] outline-none focus:border-[#e8a598] transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-2.5 text-[#6c627f] hover:text-[#baaecd] cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#9a91ab] pt-0.5">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={e => setRememberMe(e.target.checked)}
                          className="rounded border-[#393148] text-[#e8a598] focus:ring-0"
                        />
                        <span>{t.rememberMe}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIdentifier('darya@notperfect.app');
                          setPassword('demo1234');
                        }}
                        className="text-[#e8a598] hover:underline cursor-pointer"
                      >
                        ورود سریع با اکانت پیش‌فرض
                      </button>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 mt-1 rounded-2xl bg-gradient-to-r from-[#6e4659] to-[#b3756b] text-white text-xs font-bold shadow-md hover:brightness-110 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>{t.login}</span>
                        </>
                      )}
                    </motion.button>

                    {/* Demo Quick Accounts Chips */}
                    <div className="pt-2 border-t border-[#262033]">
                      <p className="text-[10px] text-[#7a728b] mb-1.5">
                        حساب‌های نمونه برای تست سریع (با یک کلیک وارد شوید):
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {demoUsers.map(user => (
                          <motion.button
                            key={user.id}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => handleDemoLogin(user.id)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#231e2f] hover:bg-[#322a42] border border-[#3b324d] text-[11px] text-[#ded8ea] cursor-pointer transition-colors"
                          >
                            <img
                              src={user.avatar}
                              alt={user.name}
                              referrerPolicy="no-referrer"
                              className="w-4 h-4 rounded-full object-cover"
                            />
                            <span>{user.name}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.form>
                ) : (
                  /* ================= SIGNUP VIEW ================= */
                  <motion.form
                    key="signup-form"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.18 }}
                    onSubmit={handleSignupSubmit}
                    className="space-y-3 max-h-[60vh] overflow-y-auto pr-1"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-medium text-[#baaecd] block mb-1">
                          {t.fullName} *
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          placeholder="مانند: پریا مهرآذر"
                          className="w-full bg-[#12101b] border border-[#393148] rounded-2xl px-3 py-2 text-xs text-[#f5edf9] placeholder-[#5f5670] outline-none focus:border-[#e8a598]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-[#baaecd] block mb-1">
                          {t.username} *
                        </label>
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={e => setUsername(e.target.value)}
                          placeholder="paria_raw"
                          className="w-full bg-[#12101b] border border-[#393148] rounded-2xl px-3 py-2 text-xs text-[#f5edf9] placeholder-[#5f5670] outline-none focus:border-[#e8a598]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-[#baaecd] block mb-1">
                        {t.email} *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="paria@example.com"
                        className="w-full bg-[#12101b] border border-[#393148] rounded-2xl px-3 py-2 text-xs text-[#f5edf9] placeholder-[#5f5670] outline-none focus:border-[#e8a598]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-[#baaecd] block mb-1">
                        {t.password}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="حداقل ۶ کاراکتر"
                          className="w-full bg-[#12101b] border border-[#393148] rounded-2xl px-3 py-2 text-xs text-[#f5edf9] placeholder-[#5f5670] outline-none focus:border-[#e8a598]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-2 text-[#6c627f] hover:text-[#baaecd] cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Avatar Preset Picker */}
                    <div>
                      <label className="text-[11px] font-medium text-[#baaecd] block mb-1">
                        انتخاب تصویر پروفایل صمیمی:
                      </label>
                      <div className="flex gap-2 overflow-x-auto py-1">
                        {AVATAR_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedAvatar(preset.url)}
                            className={`p-0.5 rounded-full transition-all cursor-pointer shrink-0 ${
                              selectedAvatar === preset.url
                                ? 'ring-2 ring-[#e8a598] scale-105'
                                : 'opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.label}
                              referrerPolicy="no-referrer"
                              className="w-9 h-9 rounded-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Body Journey Tags */}
                    <div>
                      <label className="text-[11px] font-medium text-[#baaecd] block mb-1">
                        داستان یا ویژگی بدن شما برای همراهی با دوستان هم‌مسیر:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {BODY_JOURNEY_TAGS.map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setSelectedTag(tag)}
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
                              selectedTag === tag
                                ? 'bg-[#48333e] text-[#f2c5bd] border border-[#e8a598]/60'
                                : 'bg-[#1b1725] text-[#938ba5] border border-[#2f273d] hover:text-white'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-[#baaecd] block mb-1">
                        {t.bioPlaceholder}
                      </label>
                      <textarea
                        rows={2}
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        placeholder="داستان خود را کوتاه بنویسید..."
                        className="w-full bg-[#12101b] border border-[#393148] rounded-2xl px-3 py-2 text-xs text-[#f5edf9] placeholder-[#5f5670] outline-none focus:border-[#e8a598] resize-none"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 mt-2 rounded-2xl bg-gradient-to-r from-[#6e4659] to-[#b3756b] text-white text-xs font-bold shadow-md hover:brightness-110 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Heart className="w-3.5 h-3.5 text-[#ffc5be]" />
                          <span>{t.createAccount}</span>
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Guest / Explore footer */}
              <div className="pt-3 mt-3 border-t border-[#262033] text-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[11px] text-[#867d97] hover:text-[#e8a598] transition-colors cursor-pointer"
                >
                  {t.guestMode} • مرور بدون ایجاد حساب
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
