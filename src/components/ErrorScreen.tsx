'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorScreenProps {
  error: string;
  onRetry: () => void;
  onBack: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ error, onRetry, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-6 text-white">
      <div className="text-center max-w-sm mx-auto">
        <div className="mb-8">
          <AlertCircle className="w-16 h-16 text-white/80 mx-auto" />
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
        <p className="text-white/80 text-lg mb-8 leading-relaxed">
          {error}
        </p>

        <div className="space-y-4">
          <button
            onClick={onRetry}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          
          <button
            onClick={onBack}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-6 rounded-xl backdrop-blur-sm transition-all duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorScreen;