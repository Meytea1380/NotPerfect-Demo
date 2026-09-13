import React from 'react';
import { motion } from 'motion/react';

export interface CozyBrandLogoProps {
  /** Size in pixels (default 36) */
  size?: number;
  className?: string;
  variant?: 'full' | 'mark' | 'monochrome' | 'gold-touch';
  animated?: boolean;
}

/**
 * NotPerfect Minimalist Cozy Brand Logo
 * 
 * Design Elements (Clean, distinct, and instantly readable):
 * 1. Two Embracing Figures (دو پیکر در آغوش هم):
 *    - Left Figure: Terracotta/Berry curve (#e8a598 / #945373) with distinct head & shoulder embrace.
 *    - Right Figure: Dusty Rose/Warm Clay curve (#f4cfc5 / #d69486) leaning into the embrace.
 * 2. Negative Space Heart (قلب حاصل از پیوند دو پیکر):
 *    - The gentle curve between the two figures naturally silhouettes a loving heart shape.
 * 3. Kintsugi Golden Thread (بند طلایی کینتسوگی):
 *    - A bold, distinct gold seam (#f0c66d) connecting the two forms, celebrating natural seams and beauty.
 * 4. Radiant Starlight (ستاره کوچک پذیرش):
 *    - A crisp 4-point gold star marking individuality and authenticity.
 */
export const CozyBrandLogo: React.FC<CozyBrandLogoProps> = ({
  size = 36,
  className = '',
  variant = 'full',
  animated = false,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
      aria-label="NotPerfect Brand Logo"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_8px_rgba(20,12,24,0.35)]"
      >
        <defs>
          {/* Outer Rounded Pebble Gradient */}
          <linearGradient id="np_pebble_grad" x1="12" y1="12" x2="88" y2="88" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2c1e2b" />
            <stop offset="100%" stopColor="#19111b" />
          </linearGradient>

          {/* Left Figure Gradient (Deep Warm Berry-Mauve) */}
          <linearGradient id="np_fig_left" x1="20" y1="20" x2="52" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#be758f" />
            <stop offset="100%" stopColor="#7a3f60" />
          </linearGradient>

          {/* Right Figure Gradient (Warm Terracotta-Rose) */}
          <linearGradient id="np_fig_right" x1="48" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f7d4ca" />
            <stop offset="60%" stopColor="#e8a598" />
            <stop offset="100%" stopColor="#c78072" />
          </linearGradient>

          {/* Kintsugi Gold Foil */}
          <linearGradient id="np_kintsugi_gold" x1="30" y1="35" x2="70" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff2c2" />
            <stop offset="40%" stopColor="#f3c86b" />
            <stop offset="100%" stopColor="#d49b38" />
          </linearGradient>
        </defs>

        {/* 1. Pebble Base (Subtle wabi-sabi background with soft border) */}
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="30"
          fill="url(#np_pebble_grad)"
          stroke="#47364b"
          strokeWidth="1.5"
        />

        {/* Soft Ambient Inner Radiance */}
        <circle cx="50" cy="50" r="34" fill="#a4587a" fillOpacity="0.12" />

        {/* 2. FIGURE 1 (Left Person) */}
        {/* Head of Left Person */}
        <circle
          cx="37"
          cy="28"
          r="8.5"
          fill="url(#np_fig_left)"
          stroke="#381d2f"
          strokeWidth="1.2"
        />
        {/* Embracing Body/Arm of Left Person (curving toward center) */}
        <path
          d="M 37,38
             C 27,42 22,54 23,67
             C 24,75 32,80 43,80
             C 47,80 49,76 49,72
             C 49,60 41,52 39,46
             C 38,43 38.5,40 40,38
             Z"
          fill="url(#np_fig_left)"
        />

        {/* 3. FIGURE 2 (Right Person) */}
        {/* Head of Right Person (Gently leaning in acceptance) */}
        <circle
          cx="63"
          cy="31"
          r="8"
          fill="url(#np_fig_right)"
          stroke="#381d2f"
          strokeWidth="1.2"
        />
        {/* Embracing Body/Arm of Right Person (wrapping to complete heart) */}
        <path
          d="M 62,40
             C 71,44 76,55 75,66
             C 74,75 66,80 56,80
             C 52,80 50,76 50,72
             C 50,59 58,51 60,46
             C 61,43 61,41 59,39
             Z"
          fill="url(#np_fig_right)"
        />

        {/* 4. The Shared Heart-Center Bridge (Where their arms meet at base) */}
        <path
          d="M 43,76
             C 47,80 53,80 57,76
             C 55,73 45,73 43,76 Z"
          fill="#e8a598"
        />

        {/* 5. The Kintsugi Golden Seam (Celebrates the crack/imperfection between the two) */}
        <motion.path
          d="M 47,38
             Q 52,48 48,56
             T 53,68
             Q 51,75 50,79"
          stroke="url(#np_kintsugi_gold)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animated ? { pathLength: 0.9 } : undefined}
          animate={
            animated
              ? {
                  pathLength: [0.9, 1, 0.9],
                  opacity: [0.85, 1, 0.85],
                }
              : undefined
          }
          transition={
            animated
              ? {
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              : undefined
          }
        />

        {/* Golden Seam Accent Dots */}
        <circle cx="48" cy="56" r="1.8" fill="#fff5cc" />
        <circle cx="53" cy="68" r="1.5" fill="#f5ce75" />

        {/* 6. Authentic Radiance Star (Top right acceptance spark) */}
        <path
          d="M 76,17 
             Q 76,21 80,21 
             Q 76,21 76,25 
             Q 76,21 72,21 
             Q 76,21 76,17 Z"
          fill="#fbe5a7"
        />
      </svg>
    </div>
  );
};
