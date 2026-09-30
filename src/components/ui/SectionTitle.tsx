import React from 'react';

export interface SectionTitleProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  return (
    <div
      className={`mb-10 sm:mb-14 ${
        align === 'center' ? 'text-center mx-auto max-w-3xl' : 'text-left max-w-2xl'
      } ${className}`}
    >
      {badge && (
        <div className={`mb-3 inline-flex ${align === 'center' ? 'justify-center' : 'justify-start'}`}>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-300 border border-teal-500/20 tracking-wide uppercase">
            {badge}
          </span>
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
};
