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
 * Universal Full-Screen Application Frame.
 *
 * Expands to 100% full viewport on all devices (Mobile, Tablet, Desktop)
 * ensuring a fluid, borderless, native experience without any restrictive phone frames.
 */
export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children, lang = 'fa' }) => {
  const rtl = isRTL(lang);

  return (
    <div
      id="notperfect-root-viewport"
      dir={rtl ? 'rtl' : 'ltr'}
      className="w-full h-full min-h-[100dvh] max-h-[100dvh] flex flex-col bg-[#0c0a13] text-[#ded8ea] overflow-hidden select-none relative"
    >
      {/* 
        Full-Screen Universal Viewport:
        Occupies 100% width & height on Mobile, Tablet, and Desktop with zero artificial frames.
      */}
      <main className="flex-1 min-h-0 w-full h-full relative flex flex-col overflow-hidden bg-[#0c0a13]">
        {children}
      </main>
    </div>
  );
};
