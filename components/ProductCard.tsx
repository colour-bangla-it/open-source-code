'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/lib/mock-data';
import { useCart } from './CartContext';
import { getProductPriceDetails } from '@/lib/priceHelper';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, setExpressCheckoutItem } = useCart();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const images = product.images && product.images.length > 0 ? product.images : ['/images/logo.avif'];

  // Numerical price parsing with WooCommerce variable product price helper
  const { activePrice, strikethroughPrice, isDiscounted, discountPercent } = getProductPriceDetails(product);

  const productUrl = `/product/${product.slug}`;

  const handleProductClick = () => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(`product_${product.slug}`, JSON.stringify(product));
        sessionStorage.setItem('current_view_product', JSON.stringify(product));
      } catch (err) {
        console.error('sessionStorage save error:', err);
      }
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize, product.colors[0]?.name);
  };

  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 1-Click Express Checkout Item trigger opens drawer in direct checkout mode
    setExpressCheckoutItem({
      product,
      size: selectedSize,
      color: product.colors[0]?.name || 'Obsidian',
    });
  };

  // Scroll to image index on dot click or arrow click with event propagation protection
  const scrollToImage = (index: number, e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveImageIndex(index);
    if (scrollRef.current) {
      const targetChild = scrollRef.current.children[index] as HTMLElement;
      if (targetChild) {
        scrollRef.current.scrollTo({
          left: targetChild.offsetLeft,
          behavior: 'smooth',
        });
      }
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextIdx = (activeImageIndex + 1) % images.length;
    scrollToImage(nextIdx);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const prevIdx = (activeImageIndex - 1 + images.length) % images.length;
    scrollToImage(prevIdx);
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPos = scrollRef.current.scrollLeft;
      const width = scrollRef.current.clientWidth;
      if (width > 0) {
        const newIdx = Math.round(scrollPos / width);
        if (newIdx !== activeImageIndex && newIdx >= 0 && newIdx < images.length) {
          setActiveImageIndex(newIdx);
        }
      }
    }
  };

  return (
    <div className="group relative bg-neutral-950 border border-neutral-900 rounded-sm overflow-hidden flex flex-col product-card-hover">
      {/* Product Image Container linked directly to /product/${product.slug} */}
      <Link
        href={productUrl}
        onClick={handleProductClick}
        className="block relative aspect-[3/4] w-full overflow-hidden bg-neutral-900"
      >
        {/* Horizontal Touch Scroll Snap Carousel */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
        >
          {images.map((imgUrl, idx) => (
            <div
              key={idx}
              className="w-full h-full flex-shrink-0 snap-start relative bg-neutral-900"
            >
              <img
                src={imgUrl}
                alt={`${product.name} - View ${idx + 1}`}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        {/* Mobile / Desktop Multi-image Navigation Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous Image"
              className="absolute left-1 top-1/2 -translate-y-1/2 p-1 bg-black/70 text-white rounded-full sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-20 hover:bg-amber-400 hover:text-black"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={nextImage}
              aria-label="Next Image"
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1 bg-black/70 text-white rounded-full sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-20 hover:bg-amber-400 hover:text-black"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-xs"
            >
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => scrollToImage(idx, e)}
                  aria-label={`View image ${idx + 1}`}
                  className={`h-1 rounded-full transition-all ${
                    activeImageIndex === idx ? 'w-3 bg-amber-400' : 'w-1 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Dynamic Rose Discount Badge floating at top-right corner */}
        {isDiscounted && (
          <span className="absolute top-2 right-2 z-10 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md tracking-wider">
            -{discountPercent}%
          </span>
        )}

        {/* New Drop Badge floating at top-left corner */}
        {product.isNew && !isDiscounted && (
          <span className="absolute top-2 left-2 z-10 bg-white text-black text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 shadow-md">
            NEW DROP
          </span>
        )}
      </Link>

      {/* Compact Content Details */}
      <div className="p-3 md:p-4 flex-1 flex flex-col justify-between space-y-2 bg-neutral-950">
        <div>
          <div className="flex items-center justify-between text-[10px] text-neutral-500 uppercase tracking-widest mb-0.5 font-medium">
            <span>{product.category}</span>
            <div className="flex items-center gap-1">
              {product.colors.map((color, idx) => (
                <span
                  key={idx}
                  className="w-2 h-2 rounded-full border border-neutral-700"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <Link href={productUrl} onClick={handleProductClick} className="block">
            <h3 className="text-xs md:text-sm font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Sizes Quick Selector & Luxury Pricing */}
        <div className="space-y-2 pt-1.5 border-t border-neutral-900">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`text-[9px] font-mono px-1 py-0.5 border ${
                    selectedSize === size
                      ? 'border-white bg-white text-black font-bold'
                      : 'border-neutral-800 text-neutral-400 hover:border-neutral-600'
                  } transition-colors`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Pricing with Strikethrough Regular Price */}
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-white font-bold text-xs md:text-base">
                ৳{activePrice.toLocaleString('en-BD')}
              </span>
              {isDiscounted && (
                <del className="text-neutral-400 line-through text-[10px] md:text-xs font-mono">
                  ৳{strikethroughPrice.toLocaleString('en-BD')}
                </del>
              )}
            </div>
          </div>

          {/* Side-by-Side Compact Dual CTA Buttons (Add to Cart + Order Now) */}
          <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-neutral-800">
            {/* Button 1: Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full py-1.5 px-1 text-[11px] md:text-xs font-medium border border-neutral-600 hover:border-white text-white rounded-sm bg-neutral-900 hover:bg-neutral-800 transition flex items-center justify-center gap-1"
            >
              <ShoppingBag className="w-3 h-3" />
              <span>কার্টে রাখুন</span>
            </button>

            {/* Button 2: Order Now / Instant Checkout */}
            <button
              onClick={handleOrderNow}
              className="w-full py-1.5 px-1 text-[11px] md:text-xs font-semibold bg-white hover:bg-neutral-200 text-black rounded-sm transition flex items-center justify-center gap-1 shadow-sm"
            >
              <Zap className="w-3 h-3 fill-current text-black" />
              <span>অর্ডার করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
