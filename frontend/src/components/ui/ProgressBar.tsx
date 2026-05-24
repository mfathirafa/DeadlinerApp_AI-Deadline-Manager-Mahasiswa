'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  className?: string;
  color?: 'purple' | 'blue' | 'green' | 'orange' | 'red';
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export default function ProgressBar({ value, className = '', color = 'purple', size = 'sm', showLabel = false }: ProgressBarProps) {
  const colors = {
    purple: 'from-[#9f7aea] to-[#cfbcff]',
    blue: 'from-blue-500 to-cyan-400',
    green: 'from-emerald-500 to-green-400',
    orange: 'from-orange-500 to-yellow-400',
    red: 'from-red-500 to-pink-400',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-white/50">Progress</span>
          <span className="text-xs text-white/70 font-medium">{value}%</span>
        </div>
      )}
      <div className={`w-full ${heights[size]} bg-white/[0.06] rounded-full overflow-hidden`}>
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${colors[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            boxShadow: '0 0 10px rgba(159, 122, 234, 0.3)',
          }}
        />
      </div>
    </div>
  );
}
