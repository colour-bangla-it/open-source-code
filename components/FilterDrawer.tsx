'use client';

import React from 'react';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useCart } from './CartContext';

interface FilterDrawerProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedSize: string;
  onSelectSize: (size: string) => void;
  sortBy: string;
  onSelectSortBy: (sort: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  onReset: () => void;
}

export function FilterDrawer({
  selectedCategory,
  onSelectCategory,
  selectedSize,
  onSelectSize,
  sortBy,
  onSelectSortBy,
  priceRange,
  onPriceChange,
  onReset,
}: FilterDrawerProps) {
  const { isFilterOpen, setIsFilterOpen } = useCart();

  if (!isFilterOpen) return null;

  const categories = ['All', 'Outerwear', 'Tops', 'Bottoms', 'Knitwear', 'Accessories'];
  const sizes = ['All', 'S', 'M', 'L', 'XL'];
  const sortOptions = [
    { label: 'Featured Drops', value: 'featured' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Newest Arrivals', value: 'newest' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsFilterOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-950 border-l border-neutral-900 shadow-2xl flex flex-col justify-between animate-slide-left">
          {/* Header */}
          <div className="p-6 border-b border-neutral-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-amber-400" />
              <h2 className="font-luxury-heading text-lg font-bold uppercase tracking-widest text-white">
                Filter Catalog
              </h2>
            </div>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="p-2 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Filter Body Content */}
          <div className="p-6 overflow-y-auto space-y-8 flex-1">
            {/* Category Filter */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-white mb-4">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                      selectedCategory.toLowerCase() === cat.toLowerCase()
                        ? 'bg-white text-black font-bold'
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-white mb-4">
                Sort By
              </h3>
              <div className="space-y-2">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onSelectSortBy(opt.value)}
                    className={`w-full text-left p-3 text-xs font-medium uppercase tracking-wider border transition-all flex items-center justify-between ${
                      sortBy === opt.value
                        ? 'border-amber-400 bg-amber-400/10 text-white font-bold'
                        : 'border-neutral-900 bg-neutral-900/50 text-neutral-400 hover:border-neutral-800'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.value && (
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector Filter */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-white mb-4">
                Size
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => onSelectSize(s)}
                    className={`py-2 text-xs font-mono font-bold transition-all border ${
                      selectedSize === s
                        ? 'border-white bg-white text-black'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-white">
                  Max Price Range
                </h3>
                <span className="text-xs font-mono text-amber-400">
                  Up to ৳ {priceRange[1].toLocaleString('en-BD')}
                </span>
              </div>
              <input
                type="range"
                min={2000}
                max={25000}
                step={500}
                value={priceRange[1]}
                onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-amber-400 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-6 border-t border-neutral-900 bg-neutral-950 flex gap-3">
            <button
              onClick={onReset}
              className="px-4 py-3 border border-neutral-800 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white hover:border-neutral-700 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={() => setIsFilterOpen(false)}
              className="flex-1 btn-luxury-primary py-3 text-xs"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
