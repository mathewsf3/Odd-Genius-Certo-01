/**
 * 🎯 ErrorMessage Component - Reusable Error Display
 * 
 * Provides consistent error handling across the application
 * Portuguese-BR interface with proper styling
 */

'use client';

import React from 'react';

interface ErrorMessageProps {
  message: string;
  title?: string;
  onRetry?: () => void;
  variant?: 'error' | 'warning' | 'info';
  className?: string;
}

export default function ErrorMessage({ 
  message, 
  title = 'Erro',
  onRetry,
  variant = 'error',
  className = '' 
}: ErrorMessageProps) {
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  const getIconForVariant = () => {
    switch (variant) {
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '❌';
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getVariantClasses()} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-xl">{getIconForVariant()}</span>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          <div className="mt-1 text-sm">
            <p>{message}</p>
          </div>
          {onRetry && (
            <div className="mt-3">
              <button
                onClick={onRetry}
                className={`text-sm font-medium underline hover:no-underline focus:outline-none ${
                  variant === 'warning' 
                    ? 'text-yellow-700 hover:text-yellow-600' 
                    : variant === 'info'
                    ? 'text-blue-700 hover:text-blue-600'
                    : 'text-red-700 hover:text-red-600'
                }`}
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
