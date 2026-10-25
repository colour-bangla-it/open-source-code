'use client';

import React from 'react';

interface ProductSkeletonProps {
  count?: number;
}

export function ProductSkeleton({ count = 4 }: ProductSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-neutral-950 border border-neutral-900 rounded-sm p-4 space-y-4 animate-pulse"
        >
          {/* Image placeholder shimmer */}
          <div className="aspect-[3/4] w-full bg-neutral-900 rounded-sm" />

          {/* Title placeholder */}
          <div className="space-y-2">
            <div className="h-4 bg-neutral-900 rounded w-3/4" />
            <div className="h-3 bg-neutral-900/60 rounded w-1/2" />
          </div>

          {/* Price placeholder */}
          <div className="pt-2 flex justify-between items-center">
            <div className="h-5 bg-neutral-900 rounded w-1/3" />
            <div className="h-8 bg-neutral-900 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
