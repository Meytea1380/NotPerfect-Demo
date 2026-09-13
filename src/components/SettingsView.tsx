import React from 'react';
import {
  ShieldCheck,
  Globe,
  Lock,
  Sparkles,
  Sliders,
  Shield,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  AlertCircle,
  Heart,
  Eye,
  Bell,
  Fingerprint,
} from 'lucide-react';
import { User, AppLanguage } from '../types';
import { TRANSLATIONS } from '../services/i18n';

interface SettingsViewProps {
  currentUser: User;
  currentLang: AppLanguage;
  onChangeLanguage: (lang: AppLanguage) => void;
  onRequestAgeVerification: () => void;
  onOpenAdminPanel: () => void;
  onResetDemoData: () => void;
  blurSensitiveByDefault: boolean;
  onToggleBlurSensitive: (val: boolean) => void;
  onBack?: () => void;
}

const LANGUAGES: { id: AppLanguage; label: string; flag: string; nativeName: string }[] = [
  { id: 'fa', label: 'فارسی', flag: '🇮🇷', nativeName: 'پارسی' },
  { id: 'en', label: 'English', flag: '🇺🇸', nativeName: 'US English' },
  { id: 'es', label: 'Español', flag: '🇪🇸', nativeName: 'Castellano' },
  { id: 'ar', label: 'العربية', flag: '🇸🇦', nativeName: 'عربي' },
  { id: 'fr', label: 'Français', flag: '🇫🇷', nativeName: 'Langue française' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  currentLang,
  onChangeLanguage,
  onRequestAgeVerification,
  onOpenAdminPanel,
  onResetDemoData,
  blurSensitiveByDefault,
  onToggleBlurSensitive,
  onBack,
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <div className="p-4 space-y-4 pb-20 animate-fade-in text-right">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#282136]">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1.5 rounded-full bg-[#201c2c] text-[#a199b4] hover:text-white cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2 mr-auto">
          <div className="w-8 h-8 rounded-full bg-[#3b283d] flex items-center justify-center text-[#e8a598]">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#f5edf9]">
              {t.settingsTitle}
            </h2>
            <p className="text-[10px] text-[#938ba5]">
              شخصی‌سازی زبان، امنیت و دسترسی‌های +۱۸
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: Age Verification Status (+18) */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#1b1728] to-[#251f35] border border-[#3c334f] shadow-lg relative overflow-hidden">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'}
              alt={currentUser?.name || ''}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-[#e8a598]/40"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="text-xs font-bold text-[#f5eff9]">
                {currentUser?.name || ''}
              </h3>
              <p className="text-[10px] text-[#978fa8]">@{currentUser?.username || ''}</p>
            </div>
          </div>

          <span
            className={`text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
              currentUser.isAgeVerified
                ? 'bg-[#1c2e22] text-[#9bb39d] border border-[#9bb39d]/40'
                : 'bg-[#3b1c28] text-[#f28e83] border border-[#f28e83]/40'
            }`}
          >
            {currentUser.isAgeVerified ? (
              <>
                <ShieldCheck className="w-3 h-3" />
                <span>{t.verifiedBadge}</span>
              </>
            ) : (
              <>
                <Lock className="w-3 h-3" />
                <span>{t.unverifiedBadge}</span>
              </>
            )}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[#14121d]/80 border border-[#2b2438] text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#8e879f]">{t.ageStatus}:</span>
            <span className="font-semibold text-[#f0ecf7]">
              {currentUser.isAgeVerified
                ? `تایید شده از طریق ${
                    currentUser.verificationMethod === 'google'
                      ? 'حساب رسمی Google'
                      : 'ولیدیشن ویدیویی چهره'
                  }`
                : 'دسترسی محدود به محتوای غیرحساس'}
            </span>
          </div>

          {!currentUser.isAgeVerified ? (
            <button
              onClick={onRequestAgeVerification}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#694254] via-[#945564] to-[#c28377] text-white text-xs font-bold hover:brightness-110 active:scale-98 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-1.5 mt-2"
            >
              <Fingerprint className="w-4 h-4" />
              <span>احراز هویت سن (+۱۸) با Google یا ویدیو</span>
            </button>
          ) : (
            <div className="text-[10px] text-[#9bb39d] flex items-center gap-1 mt-1">
              <Check className="w-3 h-3" />
              <span>
                شما می‌توانید تمام عکس‌های طبیعی و بدون روتوش را آزادانه مشاهده نمایید.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: Multi-Language Switcher (Trendy Grid) */}
      <div className="p-4 rounded-3xl bg-[#161322] border border-[#2e263d] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#e8a598]" />
            <h3 className="text-xs font-bold text-[#f5edf9]">
              {t.languageSection}
            </h3>
          </div>
          <span className="text-[10px] text-[#8e879f]">
            {LANGUAGES.find(l => l.id === currentLang)?.nativeName}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LANGUAGES.map(langItem => (
            <button
              key={langItem.id}
              onClick={() => onChangeLanguage(langItem.id)}
              className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between text-right cursor-pointer ${
                currentLang === langItem.id
                  ? 'bg-[#291f31] border-[#e8a598] shadow-md ring-1 ring-[#e8a598]/40'
                  : 'bg-[#1a1726] border-[#2d263c] hover:bg-[#231e33]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{langItem.flag}</span>
                <div>
                  <h4 className="text-xs font-semibold text-[#f0ecf7]">
                    {langItem.label}
                  </h4>
                  <span className="text-[9px] text-[#8e869f]">
                    {langItem.nativeName}
                  </span>
                </div>
              </div>

              {currentLang === langItem.id && (
                <div className="w-5 h-5 rounded-full bg-[#e8a598] text-[#14121d] flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 3: Content Safety & Privacy Toggles */}
      <div className="p-4 rounded-3xl bg-[#161322] border border-[#2e263d] space-y-3">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#e8a598]" />
          <h3 className="text-xs font-bold text-[#f5edf9]">
            {t.privacySection}
          </h3>
        </div>

        <div className="space-y-2.5">
          {/* Toggle 1: Blur Sensitive */}
          <div className="p-3 rounded-2xl bg-[#1a1726] border border-[#292336] flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-[#ece6f5]">
                تار بودن پیش‌فرض عکس‌های حساس (+۱۸)
              </h4>
              <p className="text-[10px] text-[#8e879f] mt-0.5">
                تصاویر خصوصی یا بدون لباس با کلیک شما باز می‌شوند
              </p>
            </div>
            <button
              onClick={() => onToggleBlurSensitive(!blurSensitiveByDefault)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                blurSensitiveByDefault ? 'bg-[#9bb39d]' : 'bg-[#3b324d]'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                  blurSensitiveByDefault ? 'right-1' : 'right-6'
                }`}
              />
            </button>
          </div>

          {/* Guidelines item */}
          <div className="p-3 rounded-2xl bg-[#1a1726] border border-[#292336] flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-[#ece6f5]">
                فضای امن بدون قضاوت (Safe Space)
              </h4>
              <p className="text-[10px] text-[#8e879f] mt-0.5">
                فیلترهای هوشمند مسدودسازی تمسخر اندام فعال است
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1b2b20] text-[#9bb39d]">
              فعال
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 4: Dedicated Admin Panel Entry */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#211728] to-[#2e1d2e] border border-[#52334a] space-y-2">
        <div className="flex items-center gap-2 text-[#e8a598]">
          <Shield className="w-4 h-4" />
          <h3 className="text-xs font-bold">{t.adminPortalBtn}</h3>
        </div>
        <p className="text-[11px] text-[#baaecd] leading-relaxed">
          دسترسی ویژه به میز کار ناظران جهت بررسی گزارش‌ها، اعتبارسنجی ویدیوهای سن بالای ۱۸ سال و مدیریت کاربران.
        </p>
        <button
          onClick={onOpenAdminPanel}
          className="w-full py-2.5 rounded-2xl bg-[#392435] hover:bg-[#4d3047] border border-[#e8a598]/40 text-[#f5eff9] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow"
        >
          <Shield className="w-4 h-4 text-[#e8a598]" />
          <span>ورود به داشبورد مدیریت و نظارت (Admin Panel)</span>
        </button>
      </div>

      {/* SECTION 5: Manifesto & Community Rules */}
      <div className="p-4 rounded-3xl bg-[#161322] border border-[#2e263d] space-y-2">
        <div className="flex items-center gap-2 text-[#9bb39d]">
          <Heart className="w-4 h-4" />
          <h3 className="text-xs font-bold text-[#f5edf9]">
            {t.communityGuidelines}
          </h3>
        </div>
        <p className="text-[11px] text-[#baaecd] leading-relaxed">
          در NotPerfect، بدن شما اثر انگشت زیستن شماست. هر زخم، هر خط استرچ، هر تغییر رنگدانه و هر انحنا، داستانی ارزشمند است. ما اینجاییم تا با حذف استانداردهای دروغین تجاری، به آرامش پذیرش خود برسیم.
        </p>
      </div>

      {/* Reset Data Button */}
      <div className="pt-2 text-center">
        <button
          onClick={onResetDemoData}
          className="inline-flex items-center gap-1.5 text-xs text-[#8f889f] hover:text-[#f28e83] transition-colors cursor-pointer py-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.resetDataBtn}</span>
        </button>
      </div>
    </div>
  );
};
