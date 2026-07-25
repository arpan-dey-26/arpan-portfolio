import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Generic, reusable error boundary (React requires a class component for
 * this). Architecture §18.5 specifically calls for the future Ask Arpan AI
 * section to be wrapped in its own narrow instance of this, so a chatbot
 * failure can never take down the rest of the page — written generically
 * here so any future section can use it the same way, not just chat.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex items-center justify-center py-20 text-body text-text-secondary">
            Something went wrong loading this section.
          </div>
        )
      );
    }
    return this.props.children;
  }
}
