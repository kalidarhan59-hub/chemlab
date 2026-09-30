/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { Layout } from './components/layout/Layout';
import { Loader } from './components/ui/Loader';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { detectInitialLanguage } from './utils/helpers';
import { SUPPORTED_LANGUAGES } from './utils/constants';
import { Language } from './types';
import './i18n';
import { lazyWithRetry } from './utils/lazyWithRetry';

// Lazy-loaded pages with automatic retry and reload resilience
const HomePage = lazyWithRetry(() => import('./pages/HomePage'));
const PeriodicTablePage = lazyWithRetry(() => import('./pages/PeriodicTablePage'));
const BalancerPage = lazyWithRetry(() => import('./pages/BalancerPage'));
const LabPage = lazyWithRetry(() => import('./pages/LabPage'));
const MoleculesPage = lazyWithRetry(() => import('./pages/MoleculesPage'));
const ArticlesPage = lazyWithRetry(() => import('./pages/ArticlesPage'));
const TrainerPage = lazyWithRetry(() => import('./pages/TrainerPage'));
const AboutPage = lazyWithRetry(() => import('./pages/AboutPage'));
const NotFoundPage = lazyWithRetry(() => import('./pages/NotFoundPage'));

/**
 * Validates language route parameter. If invalid, redirects to detected or default language.
 */
const LanguageRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang } = useParams<{ lang?: string }>();
  if (!lang || !SUPPORTED_LANGUAGES.includes(lang as Language)) {
    const fallbackLang = detectInitialLanguage();
    return <Navigate to={`/${fallbackLang}`} replace />;
  }
  return <>{children}</>;
};

export default function App() {
  const initialLang = detectInitialLanguage();

  // Register service worker for offline support
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('SW registration failed:', err);
        });
      });
    }
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <Suspense fallback={<Loader fullScreen />}>
            <Routes>
              {/* Root redirect to preferred language */}
              <Route path="/" element={<Navigate to={`/${initialLang}`} replace />} />

              {/* Multilingual Scope */}
              <Route
                path="/:lang"
                element={
                  <LanguageRouteGuard>
                    <Layout />
                  </LanguageRouteGuard>
                }
              >
                <Route index element={<HomePage />} />
                <Route path="periodic-table" element={<PeriodicTablePage />} />
                <Route path="balancer" element={<BalancerPage />} />
                <Route path="lab" element={<LabPage />} />
                <Route path="molecules" element={<MoleculesPage />} />
                <Route path="articles" element={<ArticlesPage />} />
                <Route path="articles/:slug" element={<ArticlesPage />} />
                <Route path="trainer" element={<TrainerPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="404" element={<NotFoundPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Catch-all global fallback */}
              <Route path="*" element={<Navigate to={`/${initialLang}/404`} replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
