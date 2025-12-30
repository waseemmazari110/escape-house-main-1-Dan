import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

/**
 * Reusable Loading Spinner Component
 * 
 * Consistent loading indicator used throughout the application
 */
export function LoadingSpinner({ 
  size = 'md', 
  message,
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-b-2',
    lg: 'h-16 w-16 border-b-2'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div 
        className={cn(
          "animate-spin rounded-full border-[var(--color-accent-sage)]",
          sizeClasses[size]
        )}
        aria-label="Loading"
      ></div>
      {message && (
        <p className={cn("mt-4 text-gray-600", textSizes[size])}>
          {message}
        </p>
      )}
    </div>
  );
}

/**
 * Full Page Loading State
 */
export function PageLoader({ message }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner size="lg" message={message || "Loading..."} />
    </div>
  );
}

/**
 * Skeleton Loader for Property Card
 */
export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
      <div className="bg-gray-200 h-64 w-full"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="flex gap-4 mb-4">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
}

/**
 * Grid of Skeleton Loaders
 */
export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}
