'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Folder } from 'lucide-react';
import { WooCategory } from '@/lib/woocommerce';
import { fetchLiveWooCategoriesClient } from '@/lib/client-woocommerce';

interface DynamicCategoryGridProps {
  initialCategories?: WooCategory[];
}

export function DynamicCategoryGrid({ initialCategories = [] }: DynamicCategoryGridProps) {
  const [categories, setCategories] = useState<WooCategory[]>(initialCategories);
  const [loading, setLoading] = useState<boolean>(initialCategories.length === 0);

  useEffect(() => {
    let isMounted = true;
    fetchLiveWooCategoriesClient().then((data) => {
      if (isMounted) {
        setCategories(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="aspect-[4/3] w-full bg-neutral-950 border border-neutral-900 rounded-sm animate-pulse p-6 flex flex-col justify-end"
          >
            <div className="h-4 bg-neutral-900 rounded w-1/2 mb-2" />
            <div className="h-6 bg-neutral-900 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {categories.slice(0, 3).map((cat) => {
        const hasImage = Boolean(cat.image?.src);

        return (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="group relative aspect-[4/3] w-full overflow-hidden bg-neutral-950 border border-neutral-900 rounded-sm flex flex-col justify-end p-6 product-card-hover"
          >
            {/* If category image uploaded in WordPress, render official image */}
            {hasImage ? (
              <img
                src={cat.image!.src}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 filter contrast-105"
              />
            ) : (
              /* Clean dark minimalist gradient card if thumbnail is not uploaded */
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black flex items-center justify-center p-6 text-center">
                <Folder className="w-12 h-12 text-amber-400/40 group-hover:text-amber-400 transition-colors" />
              </div>
            )}

            {/* Dark Bottom Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent transition-opacity group-hover:opacity-90" />

            {/* Content */}
            <div className="relative z-10 space-y-2 text-left">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest bg-black/80 px-2.5 py-0.5 border border-neutral-800 inline-block font-bold">
                {cat.count} PRODUCTS AVAILABLE
              </span>

              <h3 className="font-luxury-heading text-xl sm:text-2xl font-bold text-white uppercase tracking-wider group-hover:text-amber-400 transition-colors">
                {cat.name}
              </h3>

              <div className="pt-1 flex items-center gap-1.5 text-xs text-white font-semibold uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                <span>সবগুলো দেখুন (View Collection)</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
