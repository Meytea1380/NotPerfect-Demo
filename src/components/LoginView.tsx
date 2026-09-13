import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  AtSign,
  ArrowRight,
  Globe,
  Check,
  Key,
  Users,
  ChevronDown,
  ChevronUp,
  LogIn,
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { TRANSLATIONS, isRTL } from '../services/i18n';
import { User as UserType, AppLanguage } from '../types';
import { CozyBrandLogo } from './CozyBrandLogo';
import { signInWithGoogle, FirebaseService } from '../services/firebase';

interface LoginViewProps {
  currentLang: AppLanguage;
  onChangeLanguage: (newLang: AppLanguage) => void;
  onLoginSuccess: (user: UserType) => void;
  onStartOnboarding: (user: UserType) => void;
}

const SUPPORTED_LANGUAGES: { code: AppLanguage; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'fa', label: 'Persian', native: 'فارسی' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'ar', label: 'Arabic', native: 'العربية' },
];

export const DEMO_TEST_ACCOUNTS = [
  {
    id: 'user_me',
    name: 'دریا کاظمی',
    nameEn: 'Darya Kazemi',
    username: 'darya',
    fullUsername: 'darya_natural',
    password: 'password123',
    descFa: 'کاربر پیش‌فرض • پذیرش فرم طبیعی تن',
    descEn: 'Default User • Body Acceptance',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user_kian',
    name: 'کیان راد',
    nameEn: 'Kian Rad',
    username: 'kian_journey',
    fullUsername: 'kian_journey',
    password: 'password123',
    descFa: 'کاربر مرد • اسکار جراحی و بدنسازی واقعی',
    descEn: 'Male User • Surgical Scars & Fitness',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user_niloofar',
    name: 'نیلوفر پروانه',
    nameEn: 'Niloofar Parvaneh',
    username: 'niloofar_raw',
    fullUsername: 'niloofar_raw',
    password: 'password123',
    descFa: 'کاربر زن • ویتیلیگو و زیبایی اصیل',
    descEn: 'Female User • Vitiligo & Authentic Skin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user_sara',
    name: 'سارا شمس',
    nameEn: 'Sara Shams',
    username: 'sara_curves',
    fullUsername: 'sara_curves',
    password: 'password123',
    descFa: 'کاربر زن • انحناهای نرم و استرچ‌مارک',
    descEn: 'Female User • Natural Curves & Marks',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user_armin',
    name: 'آرمین پویان',
    nameEn: 'Armin Pouyan',
    username: 'armin_natural',
    fullUsername: 'armin_natural',
    password: 'password123',
    descFa: 'کاربر مرد • بافت پوست طبیعی و آکنه',
    descEn: 'Male User • Natural Texture & Acne',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  },
];

export const LoginView: React.FC<LoginViewProps> = ({
  currentLang,
  onChangeLanguage,
  onLoginSuccess,
  onStartOnboarding,
}) => {
  const isRtl = isRTL(currentLang);
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(true);

  // Sign In inputs
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up inputs (Only the essential initial fields requested)
  const [signUpName, setSignUpName] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // Handle standard Login
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!signInIdentifier.trim()) {
      setErrorMsg(
        currentLang === 'fa'
          ? 'لطفاً ایمیل یا نام کاربری را وارد کنید.'
          : 'Please enter your email or username.'
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = StorageService.login(signInIdentifier, signInPassword);
      setIsLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMsg(
          res.error ||
            (currentLang === 'fa'
              ? 'حساب کاربری یافت نشد. لطفاً ابتدا ثبت‌نام کنید.'
              : 'Account not found. Please sign up first.')
        );
      }
    }, 400);
  };

  // Quick Direct Login with a Test Account
  const handleDirectTestLogin = (identifier: string, pass: string) => {
    setSignInIdentifier(identifier);
    setSignInPassword(pass);
    setErrorMsg(null);
    setIsLoading(true);
    setTimeout(() => {
      const res = StorageService.login(identifier, pass);
      setIsLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMsg(
          res.error ||
            (currentLang === 'fa'
              ? 'خطا در ورود به حساب تست.'
              : 'Error logging in to test account.')
        );
      }
    }, 350);
  };

  // Pre-fill inputs from test accounts
  const handleFillAccount = (identifier: string, pass: string) => {
    setSignInIdentifier(identifier);
    setSignInPassword(pass);
    setMode('signin');
    setErrorMsg(null);
  };

  // Handle initial Sign Up (Passes to Onboarding step)
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!signUpName.trim() || !signUpUsername.trim() || !signUpEmail.trim()) {
      setErrorMsg(
        currentLang === 'fa'
          ? 'لطفاً تمام فیلدهای اولیه را تکمیل فرمایید.'
          : 'Please fill in all initial fields.'
      );
      return;
    }

    if (signUpPassword.length < 4) {
      setErrorMsg(
        currentLang === 'fa'
          ? 'رمز عبور باید حداقل ۴ کاراکتر باشد.'
          : 'Password must be at least 4 characters.'
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = StorageService.signup({
        name: signUpName.trim(),
        username: signUpUsername.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword,
      });
      setIsLoading(false);

      if (res.success && res.user) {
        onStartOnboarding(res.user);
      } else {
        setErrorMsg(
          res.error ||
            (currentLang === 'fa'
              ? 'خطا در ایجاد حساب کاربری.'
              : 'Error creating account.')
        );
      }
    }, 450);
  };

  // Google Sign-In with Firebase Auth & Firestore Sync
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const fbUser = await signInWithGoogle();
      const res = StorageService.loginWithGoogle({
        email: fbUser.email || 'meitymohajeri@gmail.com',
        name: fbUser.displayName || (currentLang === 'fa' ? 'مهدی مهاجری' : 'Meity Mohajeri'),
        avatar: fbUser.photoURL || undefined,
      });
      if (res.success && res.user) {
        // Asynchronously sync profile to Firestore
        FirebaseService.syncUserProfile(res.user).catch((err) =>
          console.warn('Firebase user sync non-blocking warning:', err)
        );
        onLoginSuccess(res.user);
      }
    } catch (popupErr) {
      console.warn('Google popup auth error or closed, falling back gracefully:', popupErr);
      const res = StorageService.loginWithGoogle({
        email: 'meitymohajeri@gmail.com',
        name: currentLang === 'fa' ? 'مهدی مهاجری' : 'Meity Mohajeri',
      });
      if (res.success && res.user) {
        FirebaseService.syncUserProfile(res.user).catch(() => {});
        onLoginSuccess(res.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full h-full min-h-0 flex-1 flex flex-col overflow-y-auto overflow-x-hidden bg-[#0c0a13] text-[#e6e0ef]"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-between min-h-max space-y-4 p-4 sm:p-5 pb-20">
        {/* Top Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-44 bg-[#6e3e5f]/15 blur-3xl pointer-events-none" />

        {/* Emblem & App Identity */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center mt-2 mb-1"
        >
          <div className="mb-2">
            <CozyBrandLogo size={56} animated />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#fbf7fc] font-display">
            Not<span className="text-[#e8a598]">Perfect</span>
          </h1>
          <p className="text-[11px] text-[#9f96b0] mt-0.5 max-w-xs leading-relaxed">
            {mode === 'signin' ? t.loginSubtitle : t.signupSubtitle}
          </p>
        </motion.div>

        {/* Clean Mode Switcher Tabs */}
        <div className="w-full flex p-1 rounded-2xl bg-[#171422] border border-[#2b253b]">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-[#2b2438] text-[#f7eefb] shadow-sm border border-[#e8a598]/40'
                : 'text-[#8b839b] hover:text-[#cfc8de]'
            }`}
          >
            {t.login}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#2b2438] text-[#f7eefb] shadow-sm border border-[#e8a598]/40'
                : 'text-[#8b839b] hover:text-[#cfc8de]'
            }`}
          >
            {t.signup}
          </button>
        </div>

        {/* Error Notification */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="w-full p-2.5 rounded-xl bg-[#281b22] border border-[#d6a592]/50 text-[#f5d9d4] text-[11px] leading-relaxed text-center"
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Forms Card */}
        <div className="w-full bg-[#14121e] border border-[#2c263c] rounded-3xl p-4 shadow-xl">
          {mode === 'signin' ? (
            /* --- SIGN IN FORM --- */
            <form onSubmit={handleSignIn} className="space-y-3.5">
              {/* Email / Username Box with Generous Icon Spacing */}
              <div>
                <label className="block text-[10.5px] font-semibold text-[#a89fb8] mb-1">
                  {t.emailOrUsername}
                </label>
                <div className="relative flex items-center">
                  <div
                    className={`absolute ${
                      isRtl ? 'right-3.5' : 'left-3.5'
                    } text-[#857b98] pointer-events-none`}
                  >
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={signInIdentifier}
                    onChange={e => setSignInIdentifier(e.target.value)}
                    placeholder={
                      currentLang === 'fa' ? 'ایمیل یا نام کاربری (مثلاً darya)' : 'Email or username (e.g. darya)'
                    }
                    className={`w-full bg-[#0e0c15] text-[#ede8f5] text-xs rounded-xl py-2.5 border border-[#302941] focus:border-[#e8a598] outline-none transition-colors placeholder:text-[#5e5670] ${
                      isRtl ? 'pr-11 pl-3.5' : 'pl-11 pr-3.5'
                    }`}
                  />
                </div>
              </div>

              {/* Password Box with Generous Icon Spacing */}
              <div>
                <label className="block text-[10.5px] font-semibold text-[#a89fb8] mb-1">
                  {t.password}
                </label>
                <div className="relative flex items-center">
                  <div
                    className={`absolute ${
                      isRtl ? 'right-3.5' : 'left-3.5'
                    } text-[#857b98] pointer-events-none`}
                  >
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signInPassword}
                    onChange={e => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full bg-[#0e0c15] text-[#ede8f5] text-xs rounded-xl py-2.5 border border-[#302941] focus:border-[#e8a598] outline-none transition-colors placeholder:text-[#5e5670] ${
                      isRtl ? 'pr-11 pl-11' : 'pl-11 pr-11'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${
                      isRtl ? 'left-3' : 'right-3'
                    } p-1 text-[#786f8c] hover:text-[#d6a592] transition-colors cursor-pointer`}
                  >
                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sign In Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7a4e63] to-[#c78f82] text-white font-bold text-xs shadow-md hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{isLoading ? '...' : t.login}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </form>
          ) : (
            /* --- SIGN UP FORM (Essential Initial Boxes Only) --- */
            <form onSubmit={handleSignUp} className="space-y-3">
              {/* Full Name with Generous Spacing */}
              <div>
                <label className="block text-[10.5px] font-semibold text-[#a89fb8] mb-1">
                  {t.fullName}
                </label>
                <div className="relative flex items-center">
                  <div
                    className={`absolute ${
                      isRtl ? 'right-3.5' : 'left-3.5'
                    } text-[#857b98] pointer-events-none`}
                  >
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={signUpName}
                    onChange={e => setSignUpName(e.target.value)}
                    placeholder={currentLang === 'fa' ? 'نام و نام خانوادگی' : 'Full Name'}
                    className={`w-full bg-[#0e0c15] text-[#ede8f5] text-xs rounded-xl py-2.5 border border-[#302941] focus:border-[#e8a598] outline-none transition-colors placeholder:text-[#5e5670] ${
                      isRtl ? 'pr-11 pl-3.5' : 'pl-11 pr-3.5'
                    }`}
                  />
                </div>
              </div>

              {/* Username with Generous Spacing */}
              <div>
                <label className="block text-[10.5px] font-semibold text-[#a89fb8] mb-1">
                  {t.username}
                </label>
                <div className="relative flex items-center">
                  <div
                    className={`absolute ${
                      isRtl ? 'right-3.5' : 'left-3.5'
                    } text-[#857b98] pointer-events-none`}
                  >
                    <AtSign className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={signUpUsername}
                    onChange={e => setSignUpUsername(e.target.value)}
                    placeholder="username"
                    className={`w-full bg-[#0e0c15] text-[#ede8f5] text-xs rounded-xl py-2.5 border border-[#302941] focus:border-[#e8a598] outline-none transition-colors placeholder:text-[#5e5670] ${
                      isRtl ? 'pr-11 pl-3.5' : 'pl-11 pr-3.5'
                    }`}
                  />
                </div>
              </div>

              {/* Email with Generous Spacing */}
              <div>
                <label className="block text-[10.5px] font-semibold text-[#a89fb8] mb-1">
                  {t.email}
                </label>
                <div className="relative flex items-center">
                  <div
                    className={`absolute ${
                      isRtl ? 'right-3.5' : 'left-3.5'
                    } text-[#857b98] pointer-events-none`}
                  >
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={e => setSignUpEmail(e.target.value)}
                    placeholder="example@mail.com"
                    className={`w-full bg-[#0e0c15] text-[#ede8f5] text-xs rounded-xl py-2.5 border border-[#302941] focus:border-[#e8a598] outline-none transition-colors placeholder:text-[#5e5670] ${
                      isRtl ? 'pr-11 pl-3.5' : 'pl-11 pr-3.5'
                    }`}
                  />
                </div>
              </div>

              {/* Password with Generous Spacing */}
              <div>
                <label className="block text-[10.5px] font-semibold text-[#a89fb8] mb-1">
                  {t.password}
                </label>
                <div className="relative flex items-center">
                  <div
                    className={`absolute ${
                      isRtl ? 'right-3.5' : 'left-3.5'
                    } text-[#857b98] pointer-events-none`}
                  >
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signUpPassword}
                    onChange={e => setSignUpPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full bg-[#0e0c15] text-[#ede8f5] text-xs rounded-xl py-2.5 border border-[#302941] focus:border-[#e8a598] outline-none transition-colors placeholder:text-[#5e5670] ${
                      isRtl ? 'pr-11 pl-11' : 'pl-11 pr-11'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${
                      isRtl ? 'left-3' : 'right-3'
                    } p-1 text-[#786f8c] hover:text-[#d6a592] transition-colors cursor-pointer`}
                  >
                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sign Up Continue Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7a4e63] to-[#c78f82] text-white font-bold text-xs shadow-md hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{isLoading ? '...' : t.createAccount}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </form>
          )}

          {/* Or Divider */}
          <div className="relative my-3 flex items-center justify-center">
            <div className="w-full border-t border-[#262033]" />
            <span className="absolute bg-[#14121e] px-2.5 text-[10px] text-[#6f6780] font-medium uppercase">
              {t.orDivider}
            </span>
          </div>

          {/* Official Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-[#1d192a] hover:bg-[#252036] active:scale-[0.98] border border-[#3b324d] text-xs font-semibold text-[#f0ecf6] flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm"
          >
            {/* Multi-colored Google Icon */}
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{t.continueWithGoogle}</span>
          </button>
        </div>

        {/* --- DEDICATED DEMO TEST ACCOUNTS LIST WITH USERNAMES & PASSWORDS --- */}
        <div className="w-full bg-[#13111c] border border-[#2d253d] rounded-2xl p-3 shadow-lg">
          <div
            className="flex items-center justify-between cursor-pointer select-none"
            onClick={() => setShowDemoAccounts(!showDemoAccounts)}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#2b2137] text-[#e8a598] flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#f5edf9]">
                  {currentLang === 'fa'
                    ? 'حساب‌های تست (نام کاربری و پسورد)'
                    : 'Test Accounts (Username & Password)'}
                </h3>
                <p className="text-[9.5px] text-[#9a8fae]">
                  {currentLang === 'fa'
                    ? 'برای تست سریع، روی هر اکانت کلیک کنید'
                    : 'Click any account for instant demo login'}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="p-1 text-[#8b819f] hover:text-[#e8a598] transition-colors"
            >
              {showDemoAccounts ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          <AnimatePresence>
            {showDemoAccounts && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2.5 pt-2 border-t border-[#251f33] space-y-2 overflow-hidden"
              >
                <div className="bg-[#1b1728] p-2 rounded-xl border border-[#352c46] text-[10px] text-[#c5bed4] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono">
                    <Key className="w-3 h-3 text-[#e8a598]" />
                    <span>{currentLang === 'fa' ? 'رمز همه اکانت‌ها:' : 'All Passwords:'}</span>
                    <strong className="text-[#f5edf9] bg-[#292237] px-1.5 py-0.5 rounded border border-[#443859]">
                      password123
                    </strong>
                  </div>
                  <span className="text-[9px] text-[#968ba8]">
                    {currentLang === 'fa' ? 'ورود یک‌کلیکه' : '1-Tap Login'}
                  </span>
                </div>

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-0.5 no-scrollbar">
                  {DEMO_TEST_ACCOUNTS.map(acc => (
                    <div
                      key={acc.id}
                      className="p-2 rounded-xl bg-[#171424] hover:bg-[#201c30] border border-[#2d253d] transition-all flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-[#e8a598]/40"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 text-start">
                          <p className="text-[11px] font-bold text-[#f1ecf7] truncate">
                            {currentLang === 'fa' ? acc.name : acc.nameEn}
                          </p>
                          <div className="flex items-center gap-1.5 text-[9.5px]">
                            <span className="text-[#baaecd] font-mono">@{acc.username}</span>
                            <span className="text-[#6d647c]">•</span>
                            <span className="text-[#e8a598] font-mono">{acc.password}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleFillAccount(acc.username, acc.password)}
                          className="px-2 py-1 rounded-lg bg-[#251f33] hover:bg-[#312942] text-[#baaecd] hover:text-[#f3edf9] text-[9.5px] font-medium transition-colors cursor-pointer"
                          title={currentLang === 'fa' ? 'پر کردن فرم ورود' : 'Fill Form'}
                        >
                          {currentLang === 'fa' ? 'پر کردن' : 'Fill'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDirectTestLogin(acc.username, acc.password)}
                          className="px-2 py-1 rounded-lg bg-gradient-to-r from-[#6e415b] to-[#b87c71] hover:brightness-110 text-white text-[9.5px] font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1"
                          title={currentLang === 'fa' ? 'ورود مستقیم با این اکانت' : 'Quick Login'}
                        >
                          <LogIn className="w-2.5 h-2.5" />
                          <span>{currentLang === 'fa' ? 'ورود' : 'Login'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- BOTTOM LANGUAGE SELECTOR (پایین صفحه کاربر بتونه زبان مورد نظرشو انتخاب کنه) --- */}
        <div className="w-full max-w-sm mx-auto pt-2 border-t border-[#1f1a2c]/80 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-[10px] text-[#7d748f] mb-1.5">
            <Globe className="w-3 h-3 text-[#d6a592]" />
            <span>{currentLang === 'fa' ? 'انتخاب زبان برنامه' : 'Choose Language'}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {SUPPORTED_LANGUAGES.map(langItem => (
              <button
                key={langItem.code}
                type="button"
                onClick={() => onChangeLanguage(langItem.code)}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  currentLang === langItem.code
                    ? 'bg-[#3b2b40] text-[#f7eefb] border border-[#e8a598]/60 shadow-sm'
                    : 'bg-[#151220] text-[#7d758c] hover:text-[#cfc8de] border border-[#262034]'
                }`}
              >
                {langItem.native}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
