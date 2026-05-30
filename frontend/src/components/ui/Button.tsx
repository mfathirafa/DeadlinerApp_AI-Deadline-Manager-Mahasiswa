'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  glow?: boolean;
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  glow = false,
  icon,
  className = '',
  disabled,
  type = 'button',
  onClick,
}: ButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-[#9f7aea] to-[#cfbcff] text-white hover:shadow-[0_0_30px_rgba(159,122,234,0.4)]',
    secondary: 'bg-white/[0.08] text-[#cfbcff] border border-white/[0.1] hover:bg-white/[0.12] hover:border-[#cfbcff]/30',
    ghost: 'bg-transparent text-white/70 hover:bg-white/[0.05] hover:text-white',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30',
  };

  const sizes = {
    sm: 'h-[36px] px-3.5 text-xs rounded-lg',
    md: 'h-[44px] px-5 text-sm rounded-xl',
    lg: 'h-[52px] px-7 text-base rounded-xl',
  };

  return (
    <motion.button
      type={type}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-[#cfbcff]/40 focus:ring-offset-2 focus:ring-offset-[#0f0d13]
        ${variants[variant]}
        ${sizes[size]}
        ${glow ? 'shadow-[0_0_20px_rgba(159,122,234,0.3)]' : ''}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
    </motion.button>
  );
}

