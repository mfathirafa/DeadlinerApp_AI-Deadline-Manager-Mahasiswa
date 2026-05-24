'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, error, options, className = '', ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-white/70">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`
          w-full px-4 py-3 rounded-xl
          bg-white/[0.05] backdrop-blur-sm
          border border-white/[0.08]
          text-white
          focus:outline-none focus:border-[#cfbcff]/40
          focus:shadow-[0_0_20px_rgba(207,188,255,0.1)]
          transition-all duration-300
          appearance-none cursor-pointer
          ${error ? 'border-red-500/50' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#1a1625] text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
