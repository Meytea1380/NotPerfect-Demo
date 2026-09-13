import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { AppLanguage } from '../types';
import { CozyLogoMotion } from './CozyLogoMotion';

interface LogoMotionLoadingProps {
  lang?: AppLanguage;
  onComplete: () => void;
  message?: string;
}

const LOADING_MESSAGES: Record<string, string> = {
  en: 'Entering your safe, unjudged space...',
  fa: 'در حال ورود به فضای امن و پذیرایِ NotPerfect...',
  tr: 'Huzurlu ve güvenli alanınıza giriş yapılıyor...',
  es: 'Entrando en tu espacio sereno y seguro...',
  fr: 'Entrée dans votre espace bienveillant et apaisant...',
  ar: 'جاري الدخول إلى مساحتك الآمنة والمرحبة...',
};

export const LogoMotionLoading: React.FC<LogoMotionLoadingProps> = ({
  lang = 'en',
  onComplete,
  message,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const displayMessage = message || LOADING_MESSAGES[lang] || LOADING_MESSAGES.en;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-0 z-[998] bg-[#0c0a13]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 select-none"
    >
      {/* Radiant cozy ambient glow */}
      <div className="absolute w-72 h-72 rounded-full bg-[#7a4968]/25 blur-3xl pointer-events-none" />
      <div className="absolute w-64 h-64 rounded-full bg-[#e8a598]/15 blur-3xl pointer-events-none -bottom-8" />

      <div className="relative flex flex-col items-center">
        {/* Soft expanding concentric pulse ring */}
        <motion.div
          animate={{
            scale: [1, 1.45, 1.8],
            opacity: [0.45, 0.2, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          className="absolute w-24 h-24 rounded-full border border-[#e8a598]/40 pointer-events-none top-2"
        />

        {/* The New Custom Cozy Logo Motion */}
        <div className="mb-5">
          <CozyLogoMotion size={88} />
        </div>

        {/* Brand Wordmark with Wabi-Sabi gold accent */}
        <div className="flex items-center gap-1 mb-3">
          <span className="text-lg font-bold tracking-tight text-[#fbf7fc] font-display">
            Not<span className="text-[#e8a598]">Perfect</span>
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#2a1c2d] text-[#eac684] border border-[#eac684]/30 font-medium">
            Kintsugi Beauty
          </span>
        </div>

        {/* Organic Progress Line */}
        <div className="w-36 h-1 bg-[#231e2e] rounded-full overflow-hidden mb-4 border border-[#393046]">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              duration: 1.3,
              ease: 'easeInOut',
            }}
            className="w-1/2 h-full bg-gradient-to-r from-[#875b6e] via-[#eac684] to-[#e8a598] rounded-full"
          />
        </div>

        {/* Reassuring Message */}
        <p className="text-xs text-[#cfc5de] font-medium tracking-wide text-center max-w-xs leading-relaxed">
          {displayMessage}
        </p>
      </div>
    </motion.div>
  );
};

