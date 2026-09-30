import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'teal' | 'purple' | 'amber' | 'blue' | 'green' | 'red' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'teal',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 font-medium',
    md: 'text-xs px-3 py-1 font-semibold',
  };

  const variantStyles = {
    teal: 'bg-teal-500/10 text-teal-600 dark:text-teal-300 border border-teal-500/30',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30',
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/30',
    green: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30',
    red: 'bg-red-500/10 text-red-600 dark:text-red-300 border border-red-500/30',
    neutral: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20',
  };

  const dotColors = {
    teal: 'bg-teal-400',
    purple: 'bg-purple-400',
    amber: 'bg-amber-400',
    blue: 'bg-blue-400',
    green: 'bg-emerald-400',
    red: 'bg-red-400',
    neutral: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};
