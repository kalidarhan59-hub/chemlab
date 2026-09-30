import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, FlaskConical, Sparkles } from 'lucide-react';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useLanguage } from '../../hooks/useLanguage';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { key: 'nav.home', path: `/${language}` },
    { key: 'nav.periodicTable', path: `/${language}/periodic-table` },
    { key: 'nav.balancer', path: `/${language}/balancer` },
    { key: 'nav.lab', path: `/${language}/lab` },
    { key: 'nav.molecules', path: `/${language}/molecules` },
    { key: 'nav.articles', path: `/${language}/articles` },
    { key: 'nav.trainer', path: `/${language}/trainer` },
    { key: 'nav.about', path: `/${language}/about` },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'glass-panel bg-white/80 dark:bg-[#0B1220]/85 border-b border-slate-200/80 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/20 py-2.5 backdrop-blur-md'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <Link
            to={`/${language}`}
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-xl p-1"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-purple-600 p-[2px] shadow-md shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-all duration-300">
              <div className="w-full h-full bg-white dark:bg-[#0B1220] rounded-[10px] flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-teal-500 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <Sparkles className="w-3 h-3 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                Chem<span className="text-teal-500 dark:text-teal-400">Lab</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-tight mt-0.5">
                Science Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="Main Navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                end={item.path === `/${language}`}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-all duration-150 select-none whitespace-nowrap ${
                    isActive
                      ? 'text-teal-600 dark:text-teal-400 bg-teal-500/10 border border-teal-500/20 shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5'
                  }`
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>

          {/* Action Tools: Lang Switcher & Theme Toggle & Mobile Burger */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <LanguageSwitcher />
            <ThemeToggle />

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2.5 rounded-xl border border-slate-300/60 dark:border-white/10 bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bottom-0 z-30 bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-white/10 p-6 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-2 max-w-md mx-auto" aria-label="Mobile Navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                end={item.path === `/${language}`}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-base font-semibold transition-all duration-150 flex items-center justify-between min-h-[48px] ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-teal-500 to-purple-600 shadow-md'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`
                }
              >
                <span>{t(item.key)}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
