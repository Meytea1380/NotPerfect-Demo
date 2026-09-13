import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Maximize2 } from 'lucide-react';
import { AppLanguage } from '../types';
import { isRTL } from '../services/i18n';
import { CozyBrandLogo } from './CozyBrandLogo';

interface AndroidFrameProps {
  children: React.ReactNode;
  lang?: AppLanguage;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children, lang = 'fa' }) => {
  const [time, setTime] = useState('۱۲:۳۰');
  const [isFramed, setIsFramed] = useState(true);
  const rtl = isRTL(lang);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const locale = lang === 'fa' ? 'fa-IR' : lang === 'ar' ? 'ar-SA' : 'en-US';
      setTime(now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [lang]);

  return (
    <div className="min-h-screen bg-[#09090d] flex flex-col items-center justify-center p-0 sm:p-4 text-[#e2dfeb] select-none">
      {/* Floating Mode Switcher on larger screens */}
      <div className="hidden sm:flex items-center gap-3 mb-3 bg-[#171622]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#443e57]/40 text-xs text-[#b8b3c9]">
        <span className="flex items-center gap-1.5">
          <CozyBrandLogo size={18} />
          <span className="font-medium text-[#ded8ea]">NotPerfect</span>
        </span>
        <div className="w-[1px] h-3 bg-[#3f3a4e]" />
        <button
          onClick={() => setIsFramed(!isFramed)}
          className="flex items-center gap-1 text-[#d8c39e] hover:text-white transition-colors cursor-pointer"
          title="تغییر اندازه نمایش"
        >
          <Maximize2 className="w-3 h-3" />
          {isFramed ? 'تمام‌صفحه' : 'قاب گوشی'}
        </button>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 relative flex flex-col overflow-hidden ${
          isFramed
            ? 'max-w-[440px] h-[92vh] max-h-[920px] rounded-[42px] border-[7px] border-[#252332] shadow-[0_25px_70px_rgba(0,0,0,0.85)] ring-1 ring-[#5c5270]/30'
            : 'max-w-md min-h-screen'
        } bg-[#111018]`}
      >
        {/* Android Status Bar */}
        <div className="h-9 px-6 flex items-center justify-between text-[11px] font-medium text-[#a29cb3] bg-[#111018]/95 z-40 border-b border-[#201d2a]/50">
          <span>{time}</span>

          {/* Android Punch Hole Camera */}
          <div className="w-3 h-3 rounded-full bg-[#07070a] border border-[#2d2938] flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#1b1924]" />
          </div>

          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3 text-[#b4adc4]" />
            <Wifi className="w-3 h-3 text-[#b4adc4]" />
            <BatteryMedium className="w-3.5 h-3.5 text-[#d4a89c]" />
          </div>
        </div>

        {/* Content Area */}
        <div
          dir={rtl ? 'rtl' : 'ltr'}
          className="flex-1 min-h-0 relative flex flex-col bg-[#111018] w-full max-w-full min-w-0 overflow-hidden"
        >
          {children}
        </div>

        {/* Android Gesture Navigation Bar */}
        <div className="h-5 bg-[#111018] flex items-center justify-center pointer-events-none pb-1">
          <div className="w-32 h-1 bg-[#4b445e] rounded-full opacity-60" />
        </div>
      </div>
    </div>
  );
};
