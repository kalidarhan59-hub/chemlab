import React from 'react';
import { useTranslation } from 'react-i18next';

export const Loader: React.FC<{ message?: string; fullScreen?: boolean }> = ({
  message,
  fullScreen = false,
}) => {
  const { t } = useTranslation();
  const displayMsg = message || t('common.loading');

  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center select-none">
      <div className="relative w-16 h-16 mb-4">
        {/* Orbit ring 1 */}
        <div className="absolute inset-0 rounded-full border-2 border-teal-500/30 border-t-teal-400 animate-spin" />
        {/* Orbit ring 2 */}
        <div
          className="absolute inset-2 rounded-full border-2 border-purple-500/30 border-b-purple-400 animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        />
        {/* Core nucleus */}
        <div className="absolute inset-5 rounded-full bg-gradient-to-tr from-teal-400 to-purple-500 animate-pulse" />
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 tracking-wide">
        {displayMsg}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};
