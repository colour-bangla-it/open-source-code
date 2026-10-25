'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingBag,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Ruler,
  AlertCircle,
  Zap,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Product, WooVariation } from '@/lib/mock-data';
import { CODForm } from '@/components/CODForm';
import { useCart } from '@/components/CartContext';
import { ProductCard } from '@/components/ProductCard';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { SizeChartModal } from '@/components/SizeChartModal';
import { event } from '@/lib/meta-pixel';
import { getProductPriceDetails } from '@/lib/priceHelper';
import { getSafeImageUrl } from '@/lib/woocommerce';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
  variations?: WooVariation[];
}

export function ProductDetailClient({ product, relatedProducts, variations = [] }: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const sizeSelectorRef = useRef<HTMLDivElement>(null);
  const mobileGalleryRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef<number>(0);

  // Zoom & Pan State (1.75x inspection level with touch drag panning)
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [selectedImage, setSelectedImage] = useState<string>(getSafeImageUrl(product.images[0]));
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || 'Standard');
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'sizing'>('details');

  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [activeMobileImgIndex, setActiveMobileImgIndex] = useState(0);
  const [showZoomHint, setShowZoomHint] = useState<boolean>(true);

  const allSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL', 'XXL'];

  // Hide zoom hint badge after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowZoomHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Meta Pixel ViewContent event tracking
  useEffect(() => {
    event('ViewContent', {
      content_name: product.name,
      content_category: product.category,
      content_ids: [product.id.toString()],
      content_type: 'product',
      value: Number(product.price),
      currency: 'BDT',
    });
  }, [product.id, product.name, product.category, product.price]);

  const handleMobileScroll = () => {
    if (isZoomed) return; // Disable horizontal slide switching while zoomed
    if (mobileGalleryRef.current) {
      const scrollPos = mobileGalleryRef.current.scrollLeft;
      const width = mobileGalleryRef.current.clientWidth;
      if (width > 0) {
        const newIdx = Math.round(scrollPos / width);
        if (newIdx !== activeMobileImgIndex && newIdx >= 0 && newIdx < product.images.length) {
          setActiveMobileImgIndex(newIdx);
          setSelectedImage(getSafeImageUrl(product.images[newIdx]));
          // Reset zoom & pan when slide changes
          setIsZoomed(false);
          setPanPosition({ x: 0, y: 0 });
        }
      }
    }
  };

  // Double-tap or Double-click handler for 1.75x Zoom
  const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      e.preventDefault();
      setIsZoomed((prev) => {
        const next = !prev;
        if (!next) setPanPosition({ x: 0, y: 0 });
        return next;
      });
      setShowZoomHint(false);
    } else if (isZoomed && !isDragging) {
      // Single tap while zoomed resets back to 1x
      setIsZoomed(false);
      setPanPosition({ x: 0, y: 0 });
    }
    lastTapRef.current = now;
  };

  // Touch / Pointer Pan Handlers (Pan to inspect fabric when zoomed in)
  const handlePointerDown = (clientX: number, clientY: number) => {
    if (!isZoomed) return;
    setIsDragging(true);
    dragStartRef.current = { x: clientX, y: clientY };
    panStartRef.current = { ...panPosition };
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isZoomed || !isDragging) return;
    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;

    // Clamp pan boundaries to prevent panning off-screen
    const maxPanX = 100;
    const maxPanY = 120;

    const newX = Math.max(-maxPanX, Math.min(maxPanX, panStartRef.current.x + deltaX));
    const newY = Math.max(-maxPanY, Math.min(maxPanY, panStartRef.current.y + deltaY));

    setPanPosition({ x: newX, y: newY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Check if a size is in stock based on variations or product stock
  const isSizeInStock = (sizeOption: string) => {
    if (variations && variations.length > 0) {
      const match = variations.find((v) => v.size.toLowerCase() === sizeOption.toLowerCase());
      if (match) return match.inStock;
    }
    if (sizeOption === 'XXL' && product.wooCommerceId === 101) return false;
    return product.inStock;
  };

  // Get dynamic variation prices for selected size with fallback price helper
  const getDynamicPricing = () => {
    const baseDetails = getProductPriceDetails(product);
    let activePrice = baseDetails.activePrice;
    let strikethroughPrice = baseDetails.strikethroughPrice;

    if (selectedSize && variations && variations.length > 0) {
      const match = variations.find((v) => v.size.toLowerCase() === selectedSize.toLowerCase());
      if (match && match.price > 0) {
        activePrice = match.price;
        if (match.regularPrice && match.regularPrice > match.price) {
          strikethroughPrice = match.regularPrice;
        } else {
          strikethroughPrice = Math.round(match.price * 1.25);
        }
      }
    }

    const isDiscounted = strikethroughPrice > activePrice && activePrice > 0;
    const discountPercent = isDiscounted
      ? Math.round(((strikethroughPrice - activePrice) / strikethroughPrice) * 100)
      : 0;
    const savedAmount = isDiscounted ? Math.round(strikethroughPrice - activePrice) : 0;

    return {
      activePrice,
      strikethroughPrice,
      isDiscounted,
      discountPercent,
      savedAmount,
    };
  };

  const { activePrice, strikethroughPrice, isDiscounted, discountPercent, savedAmount } = getDynamicPricing();
  const formatPrice = (amount: number) => `৳ ${amount.toLocaleString('en-BD')}`;

  const handleSelectSize = (sizeOption: string) => {
    if (!isSizeInStock(sizeOption)) return;
    setSelectedSize(sizeOption);
    setSizeError(false);
  };

  const handleRequireSizeSelection = () => {
    setSizeError(true);
    if (sizeSelectorRef.current) {
      sizeSelectorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToCodForm = () => {
    const el = document.getElementById('cod-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-12 pb-24">
      {/* Floating WhatsApp button with product title */}
      <FloatingWhatsApp productTitle={product.name} />

      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        category={product.category}
      />

      {/* Breadcrumb Bar */}
      <nav className="flex items-center space-x-2 text-[11px] md:text-xs font-mono text-neutral-500 uppercase tracking-widest">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-white transition-colors">
          Catalog
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-amber-400 font-bold line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Product Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* MOBILE NATIVE HORIZONTAL SWIPE SNAP CAROUSEL (PORTRAIT 3:4 ASPECT RATIO + 1.75X TOUCH PANNING) */}
          <div className="lg:hidden relative w-full aspect-[3/4] bg-neutral-950 border border-neutral-900 overflow-hidden rounded-sm mx-auto select-none touch-none">
            <div
              ref={mobileGalleryRef}
              onScroll={handleMobileScroll}
              onTouchStart={(e) => {
                handleDoubleTap(e);
                if (e.touches.length === 1) {
                  handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
              onTouchMove={(e) => {
                if (e.touches.length === 1) {
                  handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
              onTouchEnd={handlePointerUp}
              className={`w-full h-full flex ${
                isZoomed ? 'overflow-hidden' : 'overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth'
              }`}
            >
              {product.images.map((img, idx) => (
                <div key={idx} className="w-full h-full flex-shrink-0 snap-start relative bg-neutral-950">
                  <img
                    src={getSafeImageUrl(img)}
                    alt={`${product.name} ${idx + 1}`}
                    loading="eager"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (product.images?.[1] && target.src !== getSafeImageUrl(product.images[1])) {
                        target.src = getSafeImageUrl(product.images[1]);
                      } else {
                        target.src = 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800';
                      }
                    }}
                    style={{
                      transform: isZoomed
                        ? `scale(1.75) translate(${panPosition.x / 1.75}px, ${panPosition.y / 1.75}px)`
                        : 'scale(1) translate(0px, 0px)',
                    }}
                    className="w-full h-full object-cover object-center transition-transform duration-200 ease-out origin-center"
                  />
                </div>
              ))}
            </div>

            {/* Floating Visual Zoom Hint Badge */}
            {showZoomHint && !isZoomed && (
              <div className="absolute top-3 right-3 bg-black/80 text-amber-400 text-[10px] font-mono px-2.5 py-1 rounded-full border border-amber-400/40 z-20 flex items-center gap-1 animate-pulse shadow-lg">
                <ZoomIn className="w-3 h-3" />
                <span>ডাবল ট্যাপ করে জুম করুন</span>
              </div>
            )}

            {/* Mobile Pagination Counter Badge ("1 / 4") */}
            {product.images.length > 1 && !isZoomed && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-neutral-800 z-10 backdrop-blur-xs font-bold tracking-wider">
                {activeMobileImgIndex + 1} / {product.images.length}
              </div>
            )}

            {isDiscounted && !isZoomed && (
              <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 shadow-2xl rounded-full z-10">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* DESKTOP GALLERY (PORTRAIT 3:4 ASPECT RATIO + 1.75X DRAG PANNING) */}
          <div
            onClick={handleDoubleTap}
            onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
            onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            className="hidden lg:block relative aspect-[3/4] w-full bg-neutral-950 border border-neutral-900 overflow-hidden group rounded-sm select-none cursor-zoom-in"
          >
            <img
              src={selectedImage}
              alt={product.name}
              loading="eager"
              onError={(e) => {
                const target = e.currentTarget;
                if (product.images?.[1] && target.src !== getSafeImageUrl(product.images[1])) {
                  target.src = getSafeImageUrl(product.images[1]);
                } else {
                  target.src = 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800';
                }
              }}
              style={{
                transform: isZoomed
                  ? `scale(1.75) translate(${panPosition.x / 1.75}px, ${panPosition.y / 1.75}px)`
                  : undefined,
              }}
              className={`w-full h-full object-cover object-center transition-transform duration-200 ease-out origin-center ${
                !isZoomed ? 'group-hover:scale-105' : 'cursor-grab active:cursor-grabbing'
              }`}
            />

            {/* Desktop Visual Zoom Badge */}
            <div className="absolute bottom-3 right-3 bg-black/80 text-amber-400 text-xs font-mono px-3 py-1 rounded-full border border-amber-400/40 z-20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
              <span>{isZoomed ? 'ক্লিক করে জুম আউট করুন' : 'ডাবল ক্লিক করে জুম করুন'}</span>
            </div>

            {isDiscounted && !isZoomed && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-extrabold uppercase tracking-widest px-3 py-1 shadow-2xl rounded-full">
                -{discountPercent}% OFF
              </span>
            )}
            {product.isNew && !isDiscounted && !isZoomed && (
              <span className="absolute top-4 left-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 shadow-2xl">
                NEW DROP
              </span>
            )}
          </div>

          {/* Desktop Gallery Thumbnail Switcher */}
          {product.images.length > 1 && (
            <div className="hidden lg:grid grid-cols-4 gap-3 pt-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImage(getSafeImageUrl(img));
                    setIsZoomed(false);
                    setPanPosition({ x: 0, y: 0 });
                  }}
                  className={`relative aspect-[3/4] border transition-all rounded-sm overflow-hidden ${
                    selectedImage === getSafeImageUrl(img)
                      ? 'border-amber-400 opacity-100 ring-1 ring-amber-400'
                      : 'border-neutral-900 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={getSafeImageUrl(img)}
                    alt={`${product.name} preview ${idx}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Garment Details & Care Tabs */}
          <div className="pt-6 border-t border-neutral-900 space-y-4">
            <div className="flex border-b border-neutral-900 gap-6 text-xs uppercase tracking-widest font-bold">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2.5 transition-colors ${
                  activeTab === 'details'
                    ? 'border-b-2 border-amber-400 text-white'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                Garment Specs
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-2.5 transition-colors ${
                  activeTab === 'shipping'
                    ? 'border-b-2 border-amber-400 text-white'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                COD Delivery Info
              </button>
              <button
                onClick={() => setActiveTab('sizing')}
                className={`pb-2.5 transition-colors ${
                  activeTab === 'sizing'
                    ? 'border-b-2 border-amber-400 text-white'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                Fit Guide
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'details' && (
              <ul className="space-y-2 text-xs text-neutral-400">
                {product.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-2 text-xs text-neutral-400">
                <p>
                  • <strong className="text-white">ঢাকার ভেতরে (Dhaka City):</strong> ২০-২৪ ঘণ্টার মধ্যে ডেলিভারি (চার্জ ৳৭০)।
                </p>
                <p>
                  • <strong className="text-white">ঢাকার বাইরে (Outside Dhaka):</strong> ২-৩ দিনের মধ্যে ডেলিভারি (চার্জ ৳১৩০)।
                </p>
                <p>
                  • <strong className="text-white">পেমেন্ট মেথড:</strong> ১০০% ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে টাকা পরিশোধ করবেন)।
                </p>
              </div>
            )}

            {activeTab === 'sizing' && (
              <div className="text-xs text-neutral-400 space-y-2">
                <p>
                  All RIYADEEN garments feature a tailored boyswear cut. Order standard size for a relaxed fit.
                </p>
                <button
                  onClick={() => setIsSizeChartOpen(true)}
                  className="text-amber-400 hover:underline font-bold text-xs flex items-center gap-1.5 pt-1"
                >
                  <Ruler className="w-4 h-4" />
                  <span>Open Full Measurement Chart (সাইজ গাইড)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Product Specs + Single Source Size Selection + Direct COD Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6 sticky top-28">
          {/* Product Header & Stock Status */}
          <div className="space-y-2.5 border-b border-neutral-900 pb-4">
            <div className="flex items-center justify-between text-xs text-neutral-500 uppercase tracking-widest font-mono">
              <span>{product.category}</span>
              {/* Stock Status Badge */}
              <span className="text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 text-[10px] flex items-center gap-1 font-bold rounded-sm">
                <Sparkles className="w-3 h-3" />
                ইন স্টক (তাৎক্ষণিক ডেলিভারি)
              </span>
            </div>

            <h1 className="font-luxury-heading text-xl sm:text-2xl lg:text-3xl font-bold text-white uppercase tracking-wider">
              {product.name}
            </h1>

            {/* Pricing Layout with Savings Pill */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white font-mono">
                {formatPrice(activePrice)}
              </span>
              {isDiscounted && (
                <>
                  <del className="text-sm text-neutral-500 line-through font-mono">
                    {formatPrice(strikethroughPrice)}
                  </del>
                  <span className="bg-rose-950/90 text-rose-300 border border-rose-800/80 text-[11px] font-semibold px-2 py-0.5 rounded-full font-mono">
                    ৳{savedAmount.toLocaleString('en-BD')} সাশ্রয় ({discountPercent}% OFF)
                  </span>
                </>
              )}
            </div>

            <p className="text-xs text-neutral-400 font-light leading-relaxed pt-1">
              {product.description}
            </p>
          </div>

          {/* SINGLE SOURCE OF TRUTH: Size Selector Pills with WooCommerce Stock Sync */}
          <div id="size-selector" ref={sizeSelectorRef} className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <label className="uppercase tracking-widest text-neutral-300 font-semibold flex items-center gap-2">
                <span>সাইজ নির্বাচন করুন *</span>
                {selectedSize && <span className="text-amber-400 font-mono font-bold">({selectedSize})</span>}
              </label>

              {/* Sleek Size Chart Modal Link */}
              <button
                onClick={() => setIsSizeChartOpen(true)}
                className="text-amber-400 hover:text-amber-300 transition-colors text-[11px] font-bold uppercase tracking-wider flex items-center gap-1"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>সাইজ গাইড</span>
              </button>
            </div>

            {/* Size Error Alert */}
            {sizeError && (
              <div className="p-2.5 bg-red-950/90 border border-red-800 text-red-200 text-xs flex items-center gap-2 rounded-sm animate-bounce">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>অনুগ্রহ করে একটি সাইজ নির্বাচন করুন (Please select a size).</span>
              </div>
            )}

            {/* Size Buttons Grid with WooCommerce Stock Sync */}
            <div className="grid grid-cols-5 gap-1.5">
              {allSizes.map((s) => {
                const inStock = isSizeInStock(s);
                const isSelected = selectedSize === s;

                return (
                  <button
                    key={s}
                    disabled={!inStock}
                    onClick={() => handleSelectSize(s)}
                    className={`py-2.5 text-xs font-mono font-bold transition-all border relative rounded-sm ${
                      !inStock
                        ? 'opacity-40 cursor-not-allowed border-neutral-900 bg-neutral-950 text-neutral-600 line-through'
                        : isSelected
                        ? 'border-amber-400 bg-white text-black ring-2 ring-amber-400'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-700 hover:text-white'
                    }`}
                  >
                    <span>{s}</span>
                    {!inStock && (
                      <span className="block text-[8px] no-underline uppercase tracking-tighter text-red-500 font-sans">
                        Out
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add to Shopping Bag Action */}
          <div className="pt-1">
            <button
              onClick={() => {
                if (!selectedSize) {
                  handleRequireSizeSelection();
                } else {
                  addToCart(product, selectedSize, selectedColor);
                }
              }}
              className="w-full btn-luxury-outline py-3 text-xs font-bold tracking-[0.2em] flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>কার্টে যোগ করুন (Add to Bag)</span>
            </button>
          </div>

          {/* DIRECT EMBEDDED CASH ON DELIVERY FORM */}
          <div className="pt-2">
            <CODForm
              product={product}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              onRequireSizeSelection={handleRequireSizeSelection}
            />
          </div>
        </div>
      </div>

      {/* MOBILE-ONLY STICKY BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 p-3 px-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-12 bg-neutral-900 border border-neutral-800 rounded-sm overflow-hidden flex-shrink-0">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800';
              }}
            />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-white line-clamp-1">
              {product.name}
            </span>
            <span className="text-xs font-mono font-extrabold text-amber-400">
              {formatPrice(activePrice)}
            </span>
          </div>
        </div>

        <button
          onClick={scrollToCodForm}
          className="btn-luxury-primary px-5 py-2.5 text-xs font-extrabold tracking-wider flex items-center gap-1.5 shadow-xl"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>অর্ডার করুন</span>
        </button>
      </div>

      {/* Dynamic Strict Same-Category Recommended Products (2 Columns on Mobile) */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-neutral-900 space-y-6">
          <div className="flex justify-between items-end border-b border-neutral-900 pb-3">
            <div>
              <span className="text-[11px] text-amber-400 font-mono tracking-widest uppercase font-bold">
                RECOMMENDED DROPS
              </span>
              <h2 className="font-luxury-heading text-lg sm:text-2xl font-bold text-white uppercase tracking-wider mt-0.5">
                একই ক্যাটাগরির আরও কালেকশন ({product.category})
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs text-neutral-400 hover:text-white uppercase tracking-widest font-semibold"
            >
              সবগুলো দেখুন →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
