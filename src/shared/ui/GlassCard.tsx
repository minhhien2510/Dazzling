import React from 'react';
import { cn } from '../utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, hover = true, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass rounded-3xl p-6 transition-transform duration-300',
        hover && 'hover:-translate-y-1',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};
