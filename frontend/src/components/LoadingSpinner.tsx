/**
 * 🎯 LoadingSpinner Component - Reusable Loading Indicator
 * 
 * Provides consistent loading states across the application
 * Portuguese-BR interface with green theme
 */

'use client';

import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ 
  message = 'Carregando...', 
  size = 'md',
  className = '' 
}: LoadingSpinnerProps) {
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-12 h-12';
      default:
        return 'w-8 h-8';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-green-600 ${getSizeClasses()}`}></div>
      {message && (
        <p className="mt-4 text-gray-600 text-center">{message}</p>
      )}
    </div>
  );
}
