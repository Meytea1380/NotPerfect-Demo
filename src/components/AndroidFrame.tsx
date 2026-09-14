import React from 'react';
import { AppLanguage } from '../types';
import { isRTL } from '../services/i18n';

/**
 * Props for Universal App Frame container.
 */
interface AndroidFrameProps {
  children: React.ReactNode;
  lang?: AppLanguage;
}

/**
 * Universal Mobile-First Application Frame.
 *
 * Provides a seamless native Android / PWA experience on mobile devices
 * (100% full viewport, zero artificial frames or fake demo buttons),
 * and a centered, high-contrast smartphone canvas on tablets and desktop browsers.
 */
export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children, lang = 'fa' }) => {
  const rtl = isRTL(lang);

  return (
    <div
      id="notperfect-root-viewport"
      className="w-full h-full min-h-[100dvh] max-h-[100dvh] flex items-center justify-center bg-[#07060a] overflow-hidden select-none"
    >
      {/* 
        Native Mobile & Responsive Desktop Container:
        - Mobile (<640px / Phone / PWA): 100% width & 100dvh height, no bezels, native app feel.
        - Tablet & Desktop (>=640px): Centered app container with subtle border and luxury shadow.
      */}
      <div
        id="notperfect-app-stage"
        dir={rtl ? 'rtl' : 'ltr'}
        className="w-full h-[100dvh] sm:h-[94vh] sm:max-h-[920px] sm:max-w-[460px] mx-auto sm:rounded-[32px] sm:border sm:border-[#2d273a] sm:shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col bg-[#0d0c15] overflow-hidden relative"
      >
        {/* Child Views (Navbar, Feeds, BottomNavigation) */}
        <main className="flex-1 min-h-0 w-full h-full relative flex flex-col overflow-hidden bg-[#0d0c15]">
          {children}
        </main>
      </div>
    </div>
  );
};
