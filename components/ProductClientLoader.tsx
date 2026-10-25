'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProductDetailClient } from '@/components/ProductDetailClient';
import { mapWooProductToProduct } from '@/lib/woocommerce';
import { Product, WooVariation } from '@/lib/mock-data';

interface ProductClientLoaderProps {
  slug?: string;
}

export function ProductClientLoader({ slug: initialSlug }: ProductClientLoaderProps) {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [variations, setVariations] = useState<WooVariation[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    // Extract slug directly from params, initialSlug prop, or window.location.pathname
    let currentSlug = initialSlug || '';
    if (!currentSlug && params?.slug) {
      currentSlug = Array.isArray(params.slug) ? params.slug[0] : String(params.slug);
    }

    if ((!currentSlug || currentSlug === 'item' || currentSlug === 'view') && typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/').filter(Boolean);
      const productIdx = parts.indexOf('product');
      if (productIdx !== -1 && parts[productIdx + 1]) {
        currentSlug = parts[productIdx + 1];
      } else {
        currentSlug = parts[parts.length - 1] || '';
      }
    }

    if (!currentSlug || currentSlug === 'product') {
      setLoading(false);
      setError(true);
      return;
    }

    const cleanSlug = decodeURIComponent(currentSlug);

    // Step 1: Instantaneous 0ms sessionStorage lookup
    let hasSessionProduct = false;
    if (typeof window !== 'undefined') {
      try {
        const cachedBySlug = sessionStorage.getItem(`product_${cleanSlug}`);
        const cachedView = sessionStorage.getItem('current_view_product');
        let cachedObj: Product | null = null;

        if (cachedBySlug) {
          cachedObj = JSON.parse(cachedBySlug);
        } else if (cachedView) {
          const parsedView = JSON.parse(cachedView);
          if (parsedView && (parsedView.slug === cleanSlug || parsedView.id === cleanSlug || parsedView.slug === currentSlug)) {
            cachedObj = parsedView;
          }
        }

        if (cachedObj && isMounted) {
          setProduct(cachedObj);
          setLoading(false);
          setError(false);
          hasSessionProduct = true;

          // Fetch variations and related products for cached product in background
          const wooId = Number(cachedObj.wooCommerceId || cachedObj.id);
          const categoryId = (cachedObj as any).categoryId;

          if (wooId) {
            fetch(
              `https://test.premiumcollectionbd.com/wp-json/wc/v3/products/${wooId}/variations?per_page=50`,
              { cache: 'no-store' }
            )
              .then((r) => (r.ok ? r.json() : []))
              .then((varsData) => {
                if (isMounted && Array.isArray(varsData)) {
                  const mappedVars: WooVariation[] = varsData.map((v: any) => {
                    const sizeAttr = v.attributes?.find((a: any) =>
                      a.name.toLowerCase().includes('size')
                    );
                    const colorAttr = v.attributes?.find((a: any) =>
                      a.name.toLowerCase().includes('color')
                    );
                    return {
                      id: v.id,
                      size: sizeAttr ? sizeAttr.option : '',
                      color: colorAttr ? colorAttr.option : '',
                      price: Number(v.price || v.regular_price || 0),
                      regularPrice: v.regular_price ? Number(v.regular_price) : undefined,
                      inStock:
                        v.stock_status === 'instock' &&
                        (v.stock_quantity === null || v.stock_quantity > 0),
                      stockQuantity: v.stock_quantity,
                    };
                  });
                  setVariations(mappedVars);
                }
              })
              .catch(() => {});
          }

          if (categoryId) {
            fetch(
              `https://test.premiumcollectionbd.com/wp-json/wc/v3/products?category=${categoryId}&exclude=${wooId}&per_page=4&status=publish`,
              { cache: 'no-store' }
            )
              .then((r) => (r.ok ? r.json() : []))
              .then((relData) => {
                if (isMounted && Array.isArray(relData)) {
                  setRelatedProducts(relData.map(mapWooProductToProduct));
                }
              })
              .catch(() => {});
          }
        }
      } catch (err) {
        console.error('sessionStorage lookup error:', err);
      }
    }

    // Step 2: Concurrently or as fallback if missing from sessionStorage, perform live API fetch
    async function fetchLiveProduct() {
      if (!hasSessionProduct) {
        setLoading(true);
        setError(false);
      }

      try {
        let rawProductData = null;

        // 1. Try exact slug query from WooCommerce
        const res = await fetch(
          `https://test.premiumcollectionbd.com/wp-json/wc/v3/products?slug=${encodeURIComponent(cleanSlug)}&status=publish`,
          { cache: 'no-store' }
        );

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            rawProductData = data[0];
          }
        }

        // 2. Fallback: Search by slug keyword
        if (!rawProductData) {
          const searchRes = await fetch(
            `https://test.premiumcollectionbd.com/wp-json/wc/v3/products?search=${encodeURIComponent(cleanSlug)}&per_page=10&status=publish`,
            { cache: 'no-store' }
          );

          if (searchRes.ok) {
            const searchData = await searchRes.json();
            if (Array.isArray(searchData) && searchData.length > 0) {
              rawProductData =
                searchData.find((p: any) => p.slug === cleanSlug) || searchData[0];
            }
          }
        }

        // 3. Fallback: If numeric ID was passed in slug
        if (!rawProductData && !isNaN(Number(cleanSlug))) {
          const idRes = await fetch(
            `https://test.premiumcollectionbd.com/wp-json/wc/v3/products/${cleanSlug}`,
            { cache: 'no-store' }
          );
          if (idRes.ok) {
            rawProductData = await idRes.json();
          }
        }

        if (rawProductData && isMounted) {
          const mappedProduct = mapWooProductToProduct(rawProductData);
          setProduct(mappedProduct);
          setError(false);

          const wooId = Number(mappedProduct.wooCommerceId || mappedProduct.id);
          const categoryId = (mappedProduct as any).categoryId;

          // Fetch variations in parallel
          fetch(
            `https://test.premiumcollectionbd.com/wp-json/wc/v3/products/${wooId}/variations?per_page=50`,
            { cache: 'no-store' }
          )
            .then((r) => (r.ok ? r.json() : []))
            .then((varsData) => {
              if (isMounted && Array.isArray(varsData)) {
                const mappedVars: WooVariation[] = varsData.map((v: any) => {
                  const sizeAttr = v.attributes?.find((a: any) =>
                    a.name.toLowerCase().includes('size')
                  );
                  const colorAttr = v.attributes?.find((a: any) =>
                    a.name.toLowerCase().includes('color')
                  );
                  return {
                    id: v.id,
                    size: sizeAttr ? sizeAttr.option : '',
                    color: colorAttr ? colorAttr.option : '',
                    price: Number(v.price || v.regular_price || 0),
                    regularPrice: v.regular_price ? Number(v.regular_price) : undefined,
                    inStock:
                      v.stock_status === 'instock' &&
                      (v.stock_quantity === null || v.stock_quantity > 0),
                    stockQuantity: v.stock_quantity,
                  };
                });
                setVariations(mappedVars);
              }
            })
            .catch(() => {});

          // Fetch same-category related products in parallel
          if (categoryId) {
            fetch(
              `https://test.premiumcollectionbd.com/wp-json/wc/v3/products?category=${categoryId}&exclude=${wooId}&per_page=4&status=publish`,
              { cache: 'no-store' }
            )
              .then((r) => (r.ok ? r.json() : []))
              .then((relData) => {
                if (isMounted && Array.isArray(relData)) {
                  setRelatedProducts(relData.map(mapWooProductToProduct));
                }
              })
              .catch(() => {});
          }
        } else if (isMounted && !hasSessionProduct) {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to fetch product live:', err);
        if (isMounted && !hasSessionProduct) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchLiveProduct();

    return () => {
      isMounted = false;
    };
  }, [params, initialSlug]);

  if (loading && !product) {
    return (
      <div className="min-h-[70vh] bg-black text-white flex flex-col items-center justify-center px-4">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-neutral-400 text-xs font-mono tracking-widest uppercase">
          প্রোডাক্ট লোড হচ্ছে...
        </p>
      </div>
    );
  }

  if ((error || !product) && !loading) {
    return (
      <div className="min-h-[70vh] bg-black text-white flex flex-col items-center justify-center px-4 text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold font-luxury-heading uppercase tracking-widest">
          প্রোডাক্টটি পাওয়া যায়নি
        </h2>
        <p className="text-neutral-400 text-xs sm:text-sm max-w-md font-light">
          লিংকটি হয়তো পরিবর্তিত হয়েছে অথবা ইন্টারনেট সংযোগে সমস্যা হচ্ছে।
        </p>
        <Link
          href="/"
          className="btn-luxury-primary text-xs px-8 py-3 tracking-widest uppercase font-bold"
        >
          হোমপেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <ProductDetailClient
      product={product!}
      relatedProducts={relatedProducts}
      variations={variations}
    />
  );
}
