import { lazy, ComponentType, LazyExoticComponent } from 'react';

/**
 * Wraps dynamic component imports with retry capability and automatic cache recovery.
 * Resolves transient network hiccups or Vite dev server module restarts.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  retries = 2,
  interval = 400
): LazyExoticComponent<T> {
  return lazy(() =>
    new Promise<{ default: T }>((resolve, reject) => {
      function attempt(remaining: number) {
        factory()
          .then(resolve)
          .catch((error: any) => {
            const isModuleFetchError =
              error?.message?.includes('dynamically imported module') ||
              error?.message?.includes('Failed to fetch') ||
              error?.name === 'TypeError';

            if (remaining > 0 && isModuleFetchError) {
              setTimeout(() => {
                attempt(remaining - 1);
              }, interval);
            } else {
              // If repeated attempts fail due to stale chunk hashes, reload the page once
              const reloadKey = `chunk_reload_${window.location.pathname}`;
              const hasAttemptedReload = window.sessionStorage.getItem(reloadKey);

              if (isModuleFetchError && !hasAttemptedReload) {
                window.sessionStorage.setItem(reloadKey, 'true');
                window.location.reload();
                return;
              }

              reject(error);
            }
          });
      }

      attempt(retries);
    })
  );
}
