import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}
export function ErrorMessage({
  message = 'Failed to load data. Please try again.',
  onRetry
}: ErrorMessageProps) {
  return <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-3">
        <AlertCircle className="w-6 h-6 text-red-600" />
      </div>
      <h3 className="text-sm font-medium text-red-900 mb-2">
        Error Loading Data
      </h3>
      <p className="text-sm text-red-700 mb-4">{message}</p>
      {onRetry && <Button variant="secondary" onClick={onRetry} className="inline-flex items-center">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>}
    </div>;
}