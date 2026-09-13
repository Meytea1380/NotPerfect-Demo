import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { AppLanguage } from '../types';
import { CozyLogoMotion } from './CozyLogoMotion';

interface SplashScreenProps {
  lang?: AppLanguage;
  onFinish: () => void;
}

const SPLASH_TAGLINES: Record<string, string> = {
  en: 'A quiet space to be your genuine self without filters.',
  fa: 'فضایی آرام برای خودِ واقعی، بدون فیلتر و قضاوت.',
  tr: 'Filtresiz, kendiniz olabileceğiniz huzurlu bir alan.',
  es: 'Un espacio sereno para ser tú mismo sin filtros ni juicios.',
  fr: 'Un espace serein pour être soi-même, sans filtres.',
  ar: 'مساحة هادئة لتكون على طبيعتك، دون مرشحات أو أحكام.',
};

export const SplashScreen: React.FC<SplashScreenProps> = ({ lang = 'en', onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  const tagline = SPLASH_TAGLINES[lang] || SPLASH_TAGLINES.en;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      className="absolute inset-0 z-[999] bg-[#0c0a13] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
    >
      {/* Soft Ambient Background Glows */}
      <div className="absolute w-80 h-80 rounded-full bg-[#7a4968]/20 blur-3xl pointer-events-none -top-10" />
      <div className="absolute w-80 h-80 rounded-full bg-[#c78f82]/15 blur-3xl pointer-events-none -bottom-10" />

      {/* Center Logo Motion */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Pulsing Concentric Ripple Rings */}
        <motion.div
          animate={{
            scale: [1, 1.45, 1.7],
            opacity: [0.35, 0.15, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          className="absolute w-28 h-28 rounded-full border border-[#e8a598]/40 pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1, 1.25, 1.5],
            opacity: [0.4, 0.2, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeOut',
            delay: 0.4,
          }}
          className="absolute w-24 h-24 rounded-full border border-[#9b6f84]/30 pointer-events-none"
        />

        {/* Central Logo Motion using the new authentic brand mark */}
        <div className="mb-6">
          <CozyLogoMotion size={96} />
        </div>

        {/* Brand Name Typography */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold tracking-tight text-[#f7f2fb] font-display">
            Not<span className="text-[#e8a598]">Perfect</span>
          </h1>
        </motion.div>

        {/* Tagline text - Language Adaptive, default English */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="mt-3 text-xs sm:text-sm text-[#b8aeca] text-center max-w-xs leading-relaxed font-normal px-2"
        >
          {tagline}
        </motion.p>
      </div>

      {/* Gentle Loading Dots Bar at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-10 flex items-center gap-1.5"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#e8a598] animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#c78f82] animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#9b6f84] animate-bounce" />
      </motion.div>
    </motion.div>
  );
};

