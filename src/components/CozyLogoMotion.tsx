import React from 'react';
import { motion } from 'motion/react';

interface CozyLogoMotionProps {
  size?: number;
  className?: string;
  onAnimationComplete?: () => void;
}

/**
 * CozyLogoMotion:
 * A mindful, breathing logo animation featuring:
 * 1. Two distinct human figures leaning in an authentic embrace (دو پیکر انسانی در حال در آغوش کشیدن)
 * 2. Natural heart contour forming between them (فرم قلبی ملایم میان دو تن)
 * 3. Kintsugi golden line drawn dynamically with pathLength animation (خط طلایی کینتسوگی با درخشش)
 * 4. Micro starlight twinkle of acceptance (ستاره تابناک پذیرش خویشتن)
 */
export const CozyLogoMotion: React.FC<CozyLogoMotionProps> = ({
  size = 88,
  className = '',
  onAnimationComplete,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Radiant breathing aura behind logo */}
      <motion.div
        animate={{
          scale: [0.92, 1.22, 0.92],
          opacity: [0.35, 0.7, 0.35],
        }}
        transition={{
          duration: 3.4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#944e6f]/30 via-[#d69486]/35 to-[#f3cf98]/25 blur-xl pointer-events-none"
      />

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative drop-shadow-[0_12px_28px_rgba(20,12,24,0.6)]"
      >
        <defs>
          <linearGradient id="cmlm_pebble_grad" x1="12" y1="12" x2="88" y2="88" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2c1e2b" />
            <stop offset="100%" stopColor="#19111b" />
          </linearGradient>

          <linearGradient id="cmlm_fig_left" x1="20" y1="20" x2="52" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c77b96" />
            <stop offset="100%" stopColor="#7a3f60" />
          </linearGradient>

          <linearGradient id="cmlm_fig_right" x1="48" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fae0d8" />
            <stop offset="50%" stopColor="#e8a598" />
            <stop offset="100%" stopColor="#be7b6d" />
          </linearGradient>

          <linearGradient id="cmlm_kintsugi_gold" x1="30" y1="35" x2="70" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff4c8" />
            <stop offset="40%" stopColor="#f3c86b" />
            <stop offset="100%" stopColor="#d49b38" />
          </linearGradient>

          <filter id="cmlm_gold_glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Base Pebble Squircle with Spring Entry */}
        <motion.rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="30"
          fill="url(#cmlm_pebble_grad)"
          stroke="#47364b"
          strokeWidth="1.5"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 240,
            damping: 18,
            duration: 0.6,
          }}
        />

        {/* Inner Soft Heart Glow */}
        <circle cx="50" cy="50" r="34" fill="#a4587a" fillOpacity="0.14" />

        {/* 2. FIGURE 1 (Left Person) with Soft Sway Animation */}
        <motion.g
          initial={{ x: -8, opacity: 0 }}
          animate={{
            x: [0, 1.2, 0],
            opacity: 1,
          }}
          transition={{
            x: {
              duration: 3.6,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            opacity: { duration: 0.5, delay: 0.1 },
          }}
        >
          {/* Head of Left Person */}
          <circle
            cx="37"
            cy="28"
            r="8.5"
            fill="url(#cmlm_fig_left)"
            stroke="#381d2f"
            strokeWidth="1.2"
          />
          {/* Body of Left Person */}
          <path
            d="M 37,38
               C 27,42 22,54 23,67
               C 24,75 32,80 43,80
               C 47,80 49,76 49,72
               C 49,60 41,52 39,46
               C 38,43 38.5,40 40,38
               Z"
            fill="url(#cmlm_fig_left)"
          />
        </motion.g>

        {/* 3. FIGURE 2 (Right Person) with Reciprocal Gentle Sway */}
        <motion.g
          initial={{ x: 8, opacity: 0 }}
          animate={{
            x: [0, -1.2, 0],
            opacity: 1,
          }}
          transition={{
            x: {
              duration: 3.6,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            opacity: { duration: 0.5, delay: 0.2 },
          }}
        >
          {/* Head of Right Person */}
          <circle
            cx="63"
            cy="31"
            r="8"
            fill="url(#cmlm_fig_right)"
            stroke="#381d2f"
            strokeWidth="1.2"
          />
          {/* Body of Right Person */}
          <path
            d="M 62,40
               C 71,44 76,55 75,66
               C 74,75 66,80 56,80
               C 52,80 50,76 50,72
               C 50,59 58,51 60,46
               C 61,43 61,41 59,39
               Z"
            fill="url(#cmlm_fig_right)"
          />
        </motion.g>

        {/* 4. The Shared Heart-Center Bridge */}
        <path
          d="M 43,76
             C 47,80 53,80 57,76
             C 55,73 45,73 43,76 Z"
          fill="#e8a598"
        />

        {/* 5. The Kintsugi Golden Seam with Draw-In Animation */}
        <motion.path
          d="M 47,38
             Q 52,48 48,56
             T 53,68
             Q 51,75 50,79"
          stroke="url(#cmlm_kintsugi_gold)"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#cmlm_gold_glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: [0.85, 1, 0.85],
          }}
          transition={{
            pathLength: { duration: 1.1, delay: 0.35, ease: 'easeOut' },
            opacity: { duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 1.4 },
          }}
        />

        {/* Golden Seam Nodes */}
        <motion.circle
          cx="48"
          cy="56"
          r="1.8"
          fill="#fff5cc"
          initial={{ scale: 0 }}
          animate={{ scale: [0.9, 1.4, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
        />
        <motion.circle
          cx="53"
          cy="68"
          r="1.5"
          fill="#f5ce75"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: 1.1 }}
        />

        {/* 6. Authentic Radiance Star with Twinkle */}
        <motion.path
          d="M 76,17 
             Q 76,21 80,21 
             Q 76,21 76,25 
             Q 76,21 72,21 
             Q 76,21 76,17 Z"
          fill="#fbe5a7"
          initial={{ scale: 0, rotate: -30 }}
          animate={{
            scale: [0.85, 1.3, 0.85],
            rotate: [0, 90, 180],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 3.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
          style={{ transformOrigin: '76px 21px' }}
        />
      </svg>
    </div>
  );
};
