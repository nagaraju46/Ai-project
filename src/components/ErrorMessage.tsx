import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ErrorMessageProps {
  error: string;
  onDismiss: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onDismiss }) => {
  return (
    <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h3 className="font-medium text-red-800 mb-1">Error</h3>
        <p className="text-sm text-red-700">{error}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-red-400 hover:text-red-600 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};