'use client';

import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md';
  glow?: boolean;
  className?: string;
}

export default function Badge({ children, variant = 'default', size = 'sm', glow = false, className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-white/[0.08] text-white/70 border-white/[0.1]',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    warning: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
    danger: 'bg-red-500/15 text-red-400 border-red-500/25',
    info: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1
        font-semibold uppercase tracking-wider
        rounded-full border
        ${variants[variant]}
        ${sizes[size]}
        ${glow ? 'shadow-[0_0_10px_rgba(159,122,234,0.2)]' : ''}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
