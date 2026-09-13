import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Camera,
  Upload,
  Check,
  ArrowRight,
  ShieldCheck,
  User,
  Heart,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { User as UserType, AppLanguage } from '../types';
import { isRTL } from '../services/i18n';
import { CozyBrandLogo } from './CozyBrandLogo';

interface OnboardingModalProps {
  isOpen: boolean;
  currentUser: UserType;
  lang?: AppLanguage;
  onComplete: (updatedData: Partial<UserType>) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  currentUser,
  lang = 'en',
  onComplete,
}) => {
  const isRtlLang = isRTL(lang);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Current onboarding step: 1 = Mandatory (Identity & Age), 2 = Optional (Avatar), 3 = Optional (Story/Bio)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [gender, setGender] = useState<'female' | 'male' | 'other'>('female');
  const [ageGroup, setAgeGroup] = useState<string>('22');
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(true);
  const [agreedToSafetyGuidelines, setAgreedToSafetyGuidelines] = useState(true);

  // Step 2: Avatar (Optional)
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentUser.avatar || PRESET_AVATARS[0]);
  const [customAvatarUploaded, setCustomAvatarUploaded] = useState(false);

  // Step 3: Story/Bio (Optional)
  const [bio, setBio] = useState('');
  const [bodyStory, setBodyStory] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedAvatar(reader.result);
          setCustomAvatarUploaded(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinish = () => {
    onComplete({
      gender,
      isAgeVerified: isAgeConfirmed,
      ageVerificationStatus: isAgeConfirmed ? 'verified' : 'unverified',
      avatar: selectedAvatar,
      bio: bio.trim() || undefined,
      bodyStorySummary: bodyStory.trim() || undefined,
    });
  };

  const texts = {
    en: {
      title: 'Complete Your Profile',
      subtitle: 'Tell us a little more before entering NotPerfect',
      step1Title: 'Basic Information',
      step1Badge: 'Mandatory',
      step2Title: 'Profile Picture',
      step2Badge: 'Optional',
      step3Title: 'Your Story & Bio',
      step3Badge: 'Optional',
      genderLabel: 'Identity / Gender (Required)',
      genderFemale: 'Female',
      genderMale: 'Male',
      genderOther: 'Non-binary / Other',
      ageLabel: 'Age / Birth Year (Required)',
      ageConfirm: 'I confirm that I am 18 years or older',
      safetyRule: 'I agree to uphold a safe space free of body shaming and harassment',
      avatarDesc: 'You can upload an authentic unretouched photo or choose a preset. This is completely optional.',
      uploadBtn: 'Upload Photo',
      skipBtn: 'Skip',
      nextBtn: 'Next Step',
      backBtn: 'Back',
      finishBtn: 'Enter NotPerfect',
      bioLabel: 'Brief Bio or Thought (Optional)',
      bioPlaceholder: 'Share a gentle sentence about yourself or what brought you here...',
      storyLabel: 'Your Body Journey Story (Optional)',
      storyPlaceholder: 'A short story about embracing your natural features, scars, or growth...',
    },
    fa: {
      title: 'تکمیل مشخصات حساب',
      subtitle: 'چند مرحله کوتاه قبل از ورود به فضای امن NotPerfect',
      step1Title: 'اطلاعات هویتی و سنی',
      step1Badge: 'اجباری',
      step2Title: 'تصویر پروفایل',
      step2Badge: 'اختیاری',
      step3Title: 'روایت یا استوری تن',
      step3Badge: 'اختیاری',
      genderLabel: 'جنسیت / هویت فردی (اجباری)',
      genderFemale: 'زن',
      genderMale: 'مرد',
      genderOther: 'غیرباینری / سایر',
      ageLabel: 'سن تقریبی (اجباری)',
      ageConfirm: 'تایید می‌کنم که بالای ۱۸ سال سن دارم',
      safetyRule: 'متعهد به احترام، پذیرش و عدم سرزنش و قضاوت تن دیگران هستم',
      avatarDesc: 'می‌توانید تصویر دلخواه خود را آپلود کنید یا بعداً انتخاب نمایید. این مرحله اختیاری است.',
      uploadBtn: 'آپلود تصویر از دستگاه',
      skipBtn: 'رد کردن و بعداً',
      nextBtn: 'مرحله بعد',
      backBtn: 'مرحله قبل',
      finishBtn: 'تکمیل و ورود به برنامه',
      bioLabel: 'بیو یا یک جمله درباره خودت (اختیاری)',
      bioPlaceholder: 'یک جمله پر از آرامش درباره خود واقعی‌ات بنویس...',
      storyLabel: 'روایت پذیرش تن (اختیاری)',
      storyPlaceholder: 'داستانی کوتاه از سفر رهایی از فیلترها، پذیرش نشانه‌ها یا رشد فردی...',
    },
  }[lang === 'fa' ? 'fa' : 'en'];

  return (
    <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-sm bg-[#161320] border border-[#3b324d] rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col max-h-[90%] overflow-y-auto no-scrollbar"
        dir={isRtlLang ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#282236] mb-4">
          <div className="flex items-center gap-2.5">
            <CozyBrandLogo size={32} animated />
            <div>
              <h2 className="text-sm font-bold text-[#f5eff9]">{texts.title}</h2>
              <p className="text-[11px] text-[#9b93ab]">{texts.subtitle}</p>
            </div>
          </div>
          {/* Step Badges */}
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(s => (
              <span
                key={s}
                className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${
                  step === s
                    ? 'bg-[#e8a598] text-[#14121d] scale-110 shadow-sm'
                    : step > s
                    ? 'bg-[#40334f] text-[#cfcadb]'
                    : 'bg-[#211c2c] text-[#6d667c]'
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Dynamic Content Per Step */}
        <AnimatePresence mode="wait">
          {/* STEP 1: MANDATORY (Identity & Age) */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: isRtlLang ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRtlLang ? 20 : -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#e6dfef]">{texts.step1Title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#873e5a]/30 text-[#e8a598] border border-[#e8a598]/40 font-semibold">
                  {texts.step1Badge}
                </span>
              </div>

              {/* Gender selection */}
              <div>
                <label className="block text-[11px] font-semibold text-[#b8afc8] mb-1.5">
                  {texts.genderLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'female', label: texts.genderFemale },
                    { id: 'male', label: texts.genderMale },
                    { id: 'other', label: texts.genderOther },
                  ].map(g => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGender(g.id as any)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        gender === g.id
                          ? 'bg-[#3b2b40] text-[#f7eefb] border-[#e8a598] shadow-sm'
                          : 'bg-[#1c1827] text-[#9a91ab] border-[#2f273e] hover:border-[#4f4265]'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age selection */}
              <div>
                <label className="block text-[11px] font-semibold text-[#b8afc8] mb-1.5">
                  {texts.ageLabel}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="18"
                    max="99"
                    value={ageGroup}
                    onChange={e => setAgeGroup(e.target.value)}
                    className="w-24 bg-[#121019] text-[#f3edf8] border border-[#372f47] rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[#e8a598]"
                  />
                  <span className="text-xs text-[#8f869f]">
                    {lang === 'fa' ? 'سال (حداقل ۱۸ سال)' : 'years (min 18)'}
                  </span>
                </div>
              </div>

              {/* Age 18+ Confirmation checkbox */}
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#1b1725] border border-[#342c43] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAgeConfirmed}
                  onChange={e => setIsAgeConfirmed(e.target.checked)}
                  className="w-4 h-4 rounded text-[#e8a598] accent-[#e8a598] cursor-pointer"
                />
                <span className="text-xs text-[#d6cfe2] font-medium">{texts.ageConfirm}</span>
              </label>

              {/* Safe space agreement */}
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#1b1725] border border-[#342c43] cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToSafetyGuidelines}
                  onChange={e => setAgreedToSafetyGuidelines(e.target.checked)}
                  className="w-4 h-4 rounded text-[#e8a598] accent-[#e8a598] cursor-pointer"
                />
                <span className="text-xs text-[#d6cfe2] font-medium leading-relaxed">
                  {texts.safetyRule}
                </span>
              </label>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={!isAgeConfirmed || !agreedToSafetyGuidelines || parseInt(ageGroup, 10) < 18}
                  onClick={() => setStep(2)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#875b6e] to-[#c78f82] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 disabled:opacity-40 cursor-pointer"
                >
                  <span>{texts.nextBtn}</span>
                  {isRtlLang ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: PROFILE PICTURE (OPTIONAL) */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: isRtlLang ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRtlLang ? 20 : -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#e6dfef]">{texts.step2Title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#392e47] text-[#cfc5de] border border-[#4d3e61] font-semibold">
                  {texts.step2Badge}
                </span>
              </div>

              <p className="text-xs text-[#9d94ac] leading-relaxed">{texts.avatarDesc}</p>

              {/* Main Avatar Preview */}
              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#6b4756] to-[#d6a592] shadow-xl">
                  <img
                    src={selectedAvatar}
                    alt="Preview"
                    className="w-full h-full rounded-full object-cover border-2 border-[#161320]"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#e8a598] text-[#14121d] flex items-center justify-center shadow-lg border border-[#161320] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                    title={texts.uploadBtn}
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#231e2e] text-[#cfcadb] text-xs font-medium border border-[#3b324c] hover:border-[#e8a598] cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#e8a598]" />
                  <span>{texts.uploadBtn}</span>
                </button>
              </div>

              {/* Presets Selection */}
              <div>
                <span className="block text-[11px] text-[#8e859f] font-medium mb-1.5">
                  {lang === 'fa' ? 'یا انتخاب از نمادهای آماده:' : 'Or pick an avatar preset:'}
                </span>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {PRESET_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedAvatar(av);
                        setCustomAvatarUploaded(false);
                      }}
                      className={`w-10 h-10 rounded-full p-0.5 border-2 transition-all cursor-pointer ${
                        selectedAvatar === av
                          ? 'border-[#e8a598] scale-110 shadow-md'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={av}
                        alt="preset"
                        className="w-full h-full rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation buttons for Step 2 */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3 py-2 rounded-xl bg-[#221c2d] text-[#a59cb4] text-xs hover:text-white cursor-pointer"
                >
                  {texts.backBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#875b6e] to-[#c78f82] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 cursor-pointer"
                >
                  <span>{texts.nextBtn}</span>
                  {isRtlLang ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-3 py-2 rounded-xl text-xs text-[#8f859e] hover:text-[#d6a592] cursor-pointer font-medium"
                >
                  {texts.skipBtn}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: BIO & STORY (OPTIONAL) */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: isRtlLang ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRtlLang ? 20 : -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#e6dfef]">{texts.step3Title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#392e47] text-[#cfc5de] border border-[#4d3e61] font-semibold">
                  {texts.step3Badge}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#b8afc8] mb-1">
                  {texts.bioLabel}
                </label>
                <input
                  type="text"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder={texts.bioPlaceholder}
                  maxLength={120}
                  className="w-full bg-[#121019] text-[#f2ecf8] border border-[#382f48] focus:border-[#e8a598] rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#b8afc8] mb-1">
                  {texts.storyLabel}
                </label>
                <textarea
                  value={bodyStory}
                  onChange={e => setBodyStory(e.target.value)}
                  placeholder={texts.storyPlaceholder}
                  maxLength={250}
                  rows={3}
                  className="w-full bg-[#121019] text-[#f2ecf8] border border-[#382f48] focus:border-[#e8a598] rounded-xl p-3 text-xs outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Navigation buttons for Step 3 */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-3 py-2 rounded-xl bg-[#221c2d] text-[#a59cb4] text-xs hover:text-white cursor-pointer"
                >
                  {texts.backBtn}
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#875b6e] to-[#c78f82] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg hover:brightness-110 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{texts.finishBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-3 py-2 rounded-xl text-xs text-[#8f859e] hover:text-[#d6a592] cursor-pointer font-medium"
                >
                  {texts.skipBtn}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
