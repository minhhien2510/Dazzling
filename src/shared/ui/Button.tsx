import React from 'react';
import { cn } from '../utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-brand-pink to-brand-purple text-white shadow-lg shadow-brand-purple/20 hover:shadow-brand-purple/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 hover:-translate-y-0.5 active:translate-y-0',
    glass: 'glass hover:bg-white/90 hover:-translate-y-0.5 active:translate-y-0',
    outline: 'border-2 border-brand-purple text-brand-purple hover:bg-brand-purple/5 hover:-translate-y-0.5 active:translate-y-0',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg font-semibold',
  };

  return (
    <button
      className={cn(
        'rounded-full transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
