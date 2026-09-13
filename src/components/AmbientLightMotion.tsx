import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface AmbientLightMotionProps {
  variant?: 'splash' | 'loading' | 'subtle';
  intensity?: 'soft' | 'normal' | 'vibrant';
  showSweep?: boolean;
  showParticles?: boolean;
  className?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

export const AmbientLightMotion: React.FC<AmbientLightMotionProps> = ({
  variant = 'splash',
  intensity = 'normal',
  showSweep = true,
  showParticles = true,
  className = '',
}) => {
  // Pre-generate deterministic floating light dust particles
  const particles: Particle[] = useMemo(() => {
    const colors = ['#e8a598', '#f3c86b', '#fae0d8', '#c78f82', '#d49b38'];
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: 10 + ((i * 29) % 80),
      y: 15 + ((i * 37) % 70),
      size: 2 + (i % 3) * 1.5,
      duration: 5 + (i % 5) * 1.5,
      delay: (i * 0.4) % 3,
      color: colors[i % colors.length],
    }));
  }, []);

  const opacityMultiplier = intensity === 'soft' ? 0.65 : intensity === 'vibrant' ? 1.35 : 1.0;

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* Base Canvas Ambient Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0a13] via-[#100c19] to-[#0a0811]" />

      {/* 1. Primary Flowing Light Orb - Warm Rose Gold (Top Left / Center) */}
      <motion.div
        animate={{
          x: [-40, 60, 20, -40],
          y: [-30, 40, 70, -30],
          scale: [1, 1.25, 0.9, 1],
          opacity: [0.35 * opacityMultiplier, 0.55 * opacityMultiplier, 0.4 * opacityMultiplier, 0.35 * opacityMultiplier],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-16 -left-16 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-br from-[#9e4f6c] via-[#e8a598] to-[#68334c] blur-[80px] sm:blur-[100px]"
      />

      {/* 2. Secondary Flowing Light Orb - Kintsugi Amber Gold (Bottom Right / Center) */}
      <motion.div
        animate={{
          x: [40, -50, 30, 40],
          y: [30, -60, -20, 30],
          scale: [0.95, 1.3, 1.05, 0.95],
          opacity: [0.28 * opacityMultiplier, 0.5 * opacityMultiplier, 0.32 * opacityMultiplier, 0.28 * opacityMultiplier],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
        className="absolute -bottom-20 -right-20 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tl from-[#d4883b] via-[#f3c86b] to-[#8c4d62] blur-[85px] sm:blur-[110px]"
      />

      {/* 3. Deep Cozy Twilight Orb - Plum / Velvet Mauve (Center Wanderer) */}
      <motion.div
        animate={{
          x: [0, 50, -40, 0],
          y: [0, -40, 40, 0],
          scale: [1.1, 0.9, 1.2, 1.1],
          opacity: [0.3 * opacityMultiplier, 0.52 * opacityMultiplier, 0.35 * opacityMultiplier, 0.3 * opacityMultiplier],
        }}
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.2,
        }}
        className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#6a3250] blur-[90px]"
      />

      {/* 4. Warm Peach Dawn Halo (Behind Central Content) */}
      <motion.div
        animate={{
          scale: [0.85, 1.18, 0.85],
          opacity: [0.2 * opacityMultiplier, 0.45 * opacityMultiplier, 0.2 * opacityMultiplier],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-[#e8a598]/40 via-[#fae0d8]/30 to-[#f3c86b]/40 blur-3xl"
      />

      {/* 5. Diagonal Volumetric Light Sweep (Angled Sunbeam / Radiant Glow Wave) */}
      {showSweep && (
        <motion.div
          animate={{
            x: ['-140%', '160%'],
            opacity: [0, 0.15 * opacityMultiplier, 0.35 * opacityMultiplier, 0.15 * opacityMultiplier, 0],
          }}
          transition={{
            duration: variant === 'splash' ? 4.8 : 5.8,
            repeat: Infinity,
            repeatDelay: 1.8,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="absolute inset-y-0 w-[140%] -rotate-25 bg-gradient-to-r from-transparent via-[#f5d08e]/20 via-[#e8a598]/25 to-transparent blur-2xl pointer-events-none"
        />
      )}

      {/* 6. Gentle Floating Stardust / Embers */}
      {showParticles && (
        <div className="absolute inset-0">
          {particles.map(p => (
            <motion.div
              key={p.id}
              animate={{
                y: [0, -28, -56],
                x: [0, (p.id % 2 === 0 ? 8 : -8), 0],
                opacity: [0, 0.75 * opacityMultiplier, 0],
                scale: [0.6, 1.2, 0.4],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: 'easeInOut',
              }}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              }}
              className="absolute rounded-full pointer-events-none"
            />
          ))}
        </div>
      )}

      {/* 7. Soft Vignette Overlay to maintain contrast and readable foreground */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(10,8,15,0.7)_100%)]" />
    </div>
  );
};
