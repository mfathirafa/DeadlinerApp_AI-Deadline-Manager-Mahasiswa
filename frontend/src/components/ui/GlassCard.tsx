'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
}

export default function GlassCard({ children, className = '', hover = true, glow = false, gradient = false, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-[20px]
        bg-white/[0.05] backdrop-blur-xl
        border border-white/[0.08]
        ${glow ? 'shadow-[0_0_30px_rgba(159,122,234,0.15)]' : ''}
        ${gradient ? 'before:absolute before:inset-0 before:rounded-[20px] before:p-[1px] before:bg-gradient-to-br before:from-purple-500/20 before:via-transparent before:to-violet-500/20 before:-z-10' : ''}
        ${className}
      `}
      whileHover={hover ? { 
        y: -2, 
        boxShadow: '0 8px 40px rgba(159, 122, 234, 0.15)',
        borderColor: 'rgba(207, 188, 255, 0.15)'
      } : undefined}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      {...props}
    >
      {gradient && (
        <div className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-purple-500/[0.08] via-transparent to-violet-500/[0.05] pointer-events-none" />
      )}
      {children}
    </motion.div>
  );
}
