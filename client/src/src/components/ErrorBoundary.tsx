import React, { Component } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';
interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  error?: Error;
}
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };
  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }
  private handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined
    });
    window.location.href = '/dashboard';
  };
  public render() {
    if (this.state.hasError) {
      return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We're sorry, but something unexpected happened. Please try
              refreshing the page or return to the dashboard.
            </p>
            {this.state.error && <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 mb-6 text-left border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>}
            <div className="flex gap-3 justify-center flex-col sm:flex-row">
              <Button variant="secondary" onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
              <Button onClick={this.handleReset}>Go to Dashboard</Button>
            </div>
          </div>
        </div>;
    }
    return this.props.children;
  }
}