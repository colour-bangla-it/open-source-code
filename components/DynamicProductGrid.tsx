'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Product } from '@/lib/mock-data';
import { ProductCard } from '@/components/ProductCard';
import { ProductSkeleton } from '@/components/ProductSkeleton';
import { fetchLiveWooProductsClient } from '@/lib/client-woocommerce';

interface DynamicProductGridProps {
  initialProducts?: Product[];
  categoryFilter?: string;
  limit?: number;
}

export function DynamicProductGrid({
  initialProducts = [],
  categoryFilter = 'All',
  limit,
}: DynamicProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState<boolean>(initialProducts.length === 0);
  const [error, setError] = useState<boolean>(false);

  const loadProducts = async () => {
    setLoading(true);
    setError(false);
    try {
      const fetched = await fetchLiveWooProductsClient(categoryFilter);
      if (fetched && fetched.length > 0) {
        setProducts(limit ? fetched.slice(0, limit) : fetched);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.warn('[DynamicProductGrid Error]:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [categoryFilter]);

  if (loading) {
    return <ProductSkeleton count={limit || 4} />;
  }

  if (!loading && products.length === 0) {
    return (
      <div className="text-center py-20 px-4 bg-neutral-950 border border-neutral-900 rounded-sm space-y-4 shadow-xl">
        <div className="w-16 h-16 bg-amber-400/10 border border-amber-400/30 rounded-full flex items-center justify-center mx-auto text-amber-400">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="font-luxury-heading text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
          নতুন কালেকশন শীঘ্রই আসছে।
        </h3>
        <p className="text-xs text-neutral-400 max-w-md mx-auto font-light">
          আমাদের অ্যাটেলিয়ার প্রডাকশন টিম নতুন ডিজাইন ও প্রিমিয়াম ফেব্রিকের পাঞ্জাবি ও ড্রেস প্রস্তুত করছে। রিলোড দিয়ে নতুন আপডেট চেক করুন।
        </p>
        <button
          onClick={loadProducts}
          className="btn-luxury-outline text-xs px-6 py-2.5 inline-flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>পুনরায় রিলোড করুন</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
