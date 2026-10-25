'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '@/lib/mock-data';
import { WooCategory } from '@/lib/woocommerce';
import { ProductCard } from '@/components/ProductCard';
import { ProductSkeleton } from '@/components/ProductSkeleton';
import {
  fetchLiveWooCategoriesClient,
  fetchProductsByCategoryIdPaginated,
} from '@/lib/client-woocommerce';

interface CategoryRowData {
  category: WooCategory;
  products: Product[];
  loading: boolean;
}

export function DynamicCategoryProductRows() {
  const [rows, setRows] = useState<CategoryRowData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCategoryRows() {
      const categories = await fetchLiveWooCategoriesClient();
      const topCategories = categories.slice(0, 3); // Top categories

      const initialRows: CategoryRowData[] = topCategories.map((cat) => ({
        category: cat,
        products: [],
        loading: true,
      }));

      if (isMounted) {
        setRows(initialRows);
        setLoading(false);
      }

      // Parallel fetch 4 products per category ID
      topCategories.forEach(async (cat, idx) => {
        const result = await fetchProductsByCategoryIdPaginated({
          categoryId: cat.id,
          perPage: 4,
          page: 1,
        });

        if (isMounted) {
          setRows((prev) => {
            const updated = [...prev];
            if (updated[idx]) {
              updated[idx] = {
                ...updated[idx],
                products: result.products,
                loading: false,
              };
            }
            return updated;
          });
        }
      });
    }

    loadCategoryRows();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-16">
        <ProductSkeleton count={4} />
      </div>
    );
  }

  return (
    <div className="space-y-20">
      {rows.map(({ category, products, loading: rowLoading }) => {
        if (!rowLoading && products.length === 0) return null;

        return (
          <section key={category.id} className="space-y-8">
            {/* Category Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-neutral-900 pb-4 gap-4">
              <div>
                <span className="text-xs text-amber-400 font-mono tracking-widest uppercase font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  RIYADEEN BOYSWEAR
                </span>
                <h2 className="font-luxury-heading text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-wider mt-1">
                  {category.name}
                </h2>
              </div>

              <Link
                href={`/category/${category.slug}`}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 hover:text-amber-400 transition-colors flex items-center gap-1.5"
              >
                <span>সবগুলো দেখুন (View All)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Product Grid (4 items per category) */}
            {rowLoading ? (
              <ProductSkeleton count={4} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Bottom Centered CTA Button */}
            <div className="flex justify-center pt-4">
              <Link
                href={`/category/${category.slug}`}
                className="px-8 py-3 bg-neutral-950 border border-neutral-800 hover:border-white text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 hover:bg-neutral-900 shadow-xl"
              >
                <span>এই ক্যাটাগরির আরও প্রোডাক্ট দেখুন ({category.name})</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </Link>
            </div>
          </section>
        );
      })}
    </div>
  );
}
