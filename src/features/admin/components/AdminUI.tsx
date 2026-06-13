import React from 'react';
import type { FeedbackStatus, FeedbackType } from '../../../types/admin';

export const AdminCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <section className={`rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl ${className}`}>{children}</section>
);

export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = 'h-32' }) => (
  <div className={`animate-pulse rounded-3xl bg-white/10 ${className}`} />
);

export const EmptyState: React.FC<{ title: string; description?: string }> = ({ title, description }) => (
  <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center">
    <p className="font-bold text-slate-200">{title}</p>
    {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
  </div>
);

export const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">{message}</div>
);

const statusClass: Record<FeedbackStatus, string> = {
  OPEN: 'bg-amber-400/15 text-amber-200 ring-amber-400/30',
  IN_PROGRESS: 'bg-sky-400/15 text-sky-200 ring-sky-400/30',
  RESOLVED: 'bg-emerald-400/15 text-emerald-200 ring-emerald-400/30',
};

const typeClass: Record<FeedbackType, string> = {
  BUG: 'bg-rose-400/15 text-rose-200 ring-rose-400/30',
  FEATURE: 'bg-violet-400/15 text-violet-200 ring-violet-400/30',
  IMPROVEMENT: 'bg-cyan-400/15 text-cyan-200 ring-cyan-400/30',
  OTHER: 'bg-slate-400/15 text-slate-200 ring-slate-400/30',
};

export const StatusBadge: React.FC<{ status: FeedbackStatus }> = ({ status }) => (
  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusClass[status]}`}>{status}</span>
);

export const TypeBadge: React.FC<{ type: FeedbackType }> = ({ type }) => (
  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${typeClass[type]}`}>{type}</span>
);
