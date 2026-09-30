import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hoverable?: boolean;
  glow?: 'none' | 'teal' | 'purple' | 'amber';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  glass = true,
  hoverable = false,
  glow = 'none',
  padding = 'md',
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const glowStyles = {
    none: '',
    teal: 'hover:shadow-[0_0_30px_-5px_rgba(20,184,166,0.3)] hover:border-teal-500/50',
    purple: 'hover:shadow-[0_0_30px_-5px_rgba(124,58,237,0.3)] hover:border-purple-500/50',
    amber: 'hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)] hover:border-amber-500/50',
  };

  return (
    <div
      className={`
        rounded-2xl transition-all duration-300 relative overflow-hidden
        ${glass ? 'glass-panel' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}
        ${hoverable ? 'glass-panel-hover' : ''}
        ${glowStyles[glow]}
        ${paddingStyles[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
