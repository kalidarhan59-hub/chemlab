import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ChemLab Uncaught Error:', error, errorInfo);
  }

  private handleReset = () => {
    // Clear any temporary reload flags before reloading
    try {
      Object.keys(window.sessionStorage).forEach((key) => {
        if (key.startsWith('chunk_reload_') || key === 'chunk_reload_attempt') {
          window.sessionStorage.removeItem(key);
        }
      });
    } catch {
      // ignore
    }
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isModuleError =
        this.state.error?.message?.includes('dynamically imported module') ||
        this.state.error?.message?.includes('Failed to fetch');

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-red-500/30 bg-red-500/5">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {isModuleError
                ? 'Жаңарту қолжетімді / Update Available'
                : 'Химиялық реакция тоқтатылды / An error occurred'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              {isModuleError
                ? 'Қолданба жаңартылды немесе желі үзілді. Бетті қайта жүктеңіз / The application was updated or network connection was interrupted. Please reload.'
                : (this.state.error?.message || 'Unexpected application error.')}
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm transition-colors cursor-pointer shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Қайта жүктеу / Reload</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
