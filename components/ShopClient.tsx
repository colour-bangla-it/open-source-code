'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { SlidersHorizontal, Search, X, Sparkles, Filter } from 'lucide-react';
import { Product } from '@/lib/mock-data';
import { ProductCard } from '@/components/ProductCard';
import { FilterDrawer } from '@/components/FilterDrawer';
import { useCart } from '@/components/CartContext';
import { ProductSkeleton } from '@/components/ProductSkeleton';
import {
  fetchLiveWooCategoriesClient,
  fetchCategoryIdBySlug,
  fetchProductsByCategoryIdPaginated,
} from '@/lib/client-woocommerce';
import { WooCategory } from '@/lib/woocommerce';

interface ShopClientProps {
  initialProducts: Product[];
  initialCategories: string[];
  categorySlugParam?: string;
}

export function ShopClient({
  initialProducts,
  initialCategories,
  categorySlugParam,
}: ShopClientProps) {
  const { setIsFilterOpen } = useCart();

  // Dynamic Products & Categories State
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState<boolean>(initialProducts.length === 0);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  const [wooCategoryObjects, setWooCategoryObjects] = useState<WooCategory[]>([]);

  // Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState<string>(categorySlugParam || 'All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const observerTarget = useRef<HTMLDivElement | null>(null);

  const sizes = ['All', 'S', 'M', 'L', 'XL', 'XXL'];

  // Sync categorySlugParam changes when navigating between category pages
  useEffect(() => {
    if (categorySlugParam) {
      setSelectedCategory(categorySlugParam);
    }
  }, [categorySlugParam]);

  // Fetch live WooCommerce category objects on mount
  useEffect(() => {
    fetchLiveWooCategoriesClient().then((cats) => {
      setWooCategoryObjects(cats);
    });
  }, []);

  // Combine categories dynamically from WooCommerce API
  const categories = useMemo(() => {
    if (wooCategoryObjects.length > 0) {
      return ['All', ...wooCategoryObjects.map((c) => c.name)];
    }
    const filtered = initialCategories.filter((c) => c !== 'All');
    return ['All', ...filtered];
  }, [wooCategoryObjects, initialCategories]);

  // 2-Step Category-to-Product Fetching Logic (Numeric Category ID + Reset Page 1)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setPage(1);
    setProducts([]);
    setHasMore(true);

    async function loadCategoryProducts() {
      let catId: number | null = null;

      if (selectedCategory && selectedCategory !== 'All') {
        const matched = wooCategoryObjects.find(
          (c) =>
            c.name.toLowerCase() === selectedCategory.toLowerCase() ||
            c.slug.toLowerCase() === selectedCategory.toLowerCase()
        );

        if (matched) {
          catId = matched.id;
        } else {
          catId = await fetchCategoryIdBySlug(selectedCategory);
        }
      }

      if (!isMounted) return;
      setActiveCategoryId(catId);

      const result = await fetchProductsByCategoryIdPaginated({
        categoryId: catId,
        perPage: 12,
        page: 1,
      });

      if (isMounted) {
        setProducts(result.products);
        setHasMore(result.hasMore);
        setLoading(false);
      }
    }

    loadCategoryProducts();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, wooCategoryObjects]);

  // Fetch Next Page for Infinite Scroll
  const fetchNextPage = useCallback(async () => {
    if (loadingMore || !hasMore || loading) return;
    setLoadingMore(true);

    const nextPage = page + 1;
    const result = await fetchProductsByCategoryIdPaginated({
      categoryId: activeCategoryId,
      perPage: 12,
      page: nextPage,
    });

    setProducts((prev) => [...prev, ...result.products]);
    setPage(nextPage);
    setHasMore(result.hasMore);
    setLoadingMore(false);
  }, [loadingMore, hasMore, loading, page, activeCategoryId]);

  // TASK 1: Intersection Observer for Auto-Scroll Infinite Load
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loadingMore && !loading) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px',
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasMore, loadingMore, loading]);

  // Client-side Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (selectedSize !== 'All' && !product.sizes.includes(selectedSize)) {
          return false;
        }

        if (product.price > priceRange[1]) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = product.name.toLowerCase().includes(q);
          const matchesDesc = product.description.toLowerCase().includes(q);
          const matchesCat = product.category.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedSize, sortBy, priceRange, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedSize('All');
    setSortBy('featured');
    setPriceRange([0, 25000]);
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedSize !== 'All' ||
    priceRange[1] < 25000 ||
    searchQuery.trim() !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-[80vh]">
      {/* Header Banner */}
      <div className="border-b border-neutral-900 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1">
            RIYADEEN BOYSWEAR CATALOG
          </span>
          <h1 className="font-luxury-heading text-3xl sm:text-5xl font-bold text-white uppercase tracking-wider">
            {selectedCategory === 'All' ? 'ALL COLLECTIONS' : selectedCategory}
          </h1>
          <p className="text-xs text-neutral-400 mt-2 font-light max-w-xl">
            Exquisite craftsmanship in contemporary boys apparel and traditional wear. Powered 100% dynamically by WooCommerce numeric category IDs.
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="luxury-input text-xs pr-10"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <Search className="w-4 h-4 text-neutral-500 absolute right-3 top-2.5" />
          )}
        </div>
      </div>

      {/* Main Layout: Sticky Left Filter Bar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* STICKY LEFT FILTER SIDEBAR (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-28 space-y-8 bg-neutral-950 p-6 border border-neutral-900 rounded-sm">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-400" />
              <h3 className="font-luxury-heading text-sm font-bold uppercase tracking-wider text-white">
                Filter Catalog
              </h3>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[10px] text-amber-400 hover:underline uppercase tracking-widest"
              >
                Reset
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-300">
              Categories
            </h4>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 text-xs uppercase tracking-wider transition-all flex items-center justify-between ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-white text-black font-bold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory.toLowerCase() === cat.toLowerCase() && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter (S / M / L / XL / XXL) */}
          <div className="space-y-3 pt-4 border-t border-neutral-900">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-neutral-300">
              Size
            </h4>
            <div className="grid grid-cols-6 gap-1">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`py-2 text-[10px] font-mono font-bold transition-all border ${
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

          {/* Price Range Filter Slider */}
          <div className="space-y-3 pt-4 border-t border-neutral-900">
            <div className="flex justify-between items-center text-xs">
              <h4 className="uppercase tracking-widest font-semibold text-neutral-300">
                Max Price
              </h4>
              <span className="font-mono text-amber-400">
                ৳ {priceRange[1].toLocaleString('en-BD')}
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={25000}
              step={500}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full accent-amber-400 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </aside>

        {/* MAIN PRODUCT LISTING AREA */}
        <main className="lg:col-span-9 space-y-6">
          {/* Top Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-950 p-4 border border-neutral-900 rounded-sm">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden w-full sm:w-auto px-4 py-2 border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>Filter Bar</span>
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-amber-400" />}
            </button>

            <div className="text-xs text-neutral-400 font-mono">
              Showing <span className="text-white font-bold">{filteredProducts.length}</span> garments
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-neutral-500 uppercase tracking-widest hidden sm:inline-block">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-white text-xs font-semibold uppercase tracking-wider px-3 py-2 focus:outline-none focus:border-amber-400 rounded-none w-full sm:w-auto"
              >
                <option value="featured">Featured Drops</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-neutral-500 uppercase tracking-widest font-mono text-[10px]">
                Active Filters:
              </span>
              {selectedCategory !== 'All' && (
                <span className="bg-neutral-900 border border-neutral-800 text-white px-2.5 py-1 rounded-none flex items-center gap-1.5">
                  Category: {selectedCategory}
                  <X
                    className="w-3 h-3 text-neutral-400 hover:text-white cursor-pointer"
                    onClick={() => setSelectedCategory('All')}
                  />
                </span>
              )}
              {selectedSize !== 'All' && (
                <span className="bg-neutral-900 border border-neutral-800 text-white px-2.5 py-1 rounded-none flex items-center gap-1.5">
                  Size: {selectedSize}
                  <X
                    className="w-3 h-3 text-neutral-400 hover:text-white cursor-pointer"
                    onClick={() => setSelectedSize('All')}
                  />
                </span>
              )}
              {priceRange[1] < 25000 && (
                <span className="bg-neutral-900 border border-neutral-800 text-white px-2.5 py-1 rounded-none flex items-center gap-1.5">
                  Max ৳ {priceRange[1].toLocaleString('en-BD')}
                  <X
                    className="w-3 h-3 text-neutral-400 hover:text-white cursor-pointer"
                    onClick={() => setPriceRange([0, 25000])}
                  />
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-amber-400 hover:underline uppercase text-[10px] tracking-widest ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Products Listing: Skeleton when loading or Luxury Empty State */}
          {loading ? (
            <ProductSkeleton count={6} />
          ) : filteredProducts.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* TASK 1: Intersection Observer Sentinel Target Trigger */}
              <div
                ref={observerTarget}
                className="h-14 w-full flex items-center justify-center my-6 border-t border-neutral-900/60"
              >
                {loadingMore && (
                  <div className="flex items-center gap-2 text-neutral-400 text-sm font-mono animate-pulse">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>নতুন প্রোডাক্ট লোড হচ্ছে (Loading more products)...</span>
                  </div>
                )}
                {!hasMore && products.length > 0 && (
                  <span className="text-xs text-neutral-500 font-mono uppercase tracking-widest">
                    — All {selectedCategory} products loaded —
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 px-4 bg-neutral-950 border border-neutral-900 rounded-sm space-y-4 shadow-xl">
              <div className="w-16 h-16 bg-amber-400/10 border border-amber-400/30 rounded-full flex items-center justify-center mx-auto text-amber-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-luxury-heading text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
                ক্যাটাগরিতে কোনো প্রোডাক্ট পাওয়া যায়নি।
              </h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto font-light">
                এই ক্যাটাগরিতে বর্তমানে কোনো প্রোডাক্ট ইন-স্টক নেই। ফিল্টার পরিবর্তন করে অথবা সকল পোশাকের তালিকা ব্রাউজ করুন।
              </p>
              <button onClick={resetFilters} className="btn-luxury-primary text-xs mt-2">
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      <FilterDrawer
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        sortBy={sortBy}
        onSelectSortBy={setSortBy}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        onReset={resetFilters}
      />
    </div>
  );
}
