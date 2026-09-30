import React, { useEffect, useState } from 'react';

export const ReadingProgress: React.FC = () => {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setCompletion(Math.min(100, Math.max(0, (currentScroll / scrollHeight) * 100)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-teal-500 via-purple-500 to-indigo-500 transition-all duration-150"
        style={{ width: `${completion}%` }}
      />
    </div>
  );
};
