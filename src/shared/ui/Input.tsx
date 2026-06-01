import React from 'react';
import { cn } from '../utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-slate-600 ml-1">{label}</label>}
      <input
        className={cn(
          'w-full px-4 py-3 rounded-2xl bg-white/50 border border-slate-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition-all',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-400/20',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
    </div>
  );
};
