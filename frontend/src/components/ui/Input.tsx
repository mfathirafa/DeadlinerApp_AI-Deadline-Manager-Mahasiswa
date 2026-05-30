'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-white/70">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          ref={ref}
          className={`
            w-full h-[52px] rounded-xl
            bg-white/[0.05] backdrop-blur-sm
            border border-white/[0.08]
            text-white placeholder:text-white/30
            focus:outline-none focus:border-[#cfbcff]/50
            focus:ring-2 focus:ring-[#cfbcff]/20
            focus:shadow-[0_0_20px_rgba(207,188,255,0.1)]
            transition-all duration-300
            leading-normal
            px-4
            ${error ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-400 mt-2">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
