'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, Zap } from 'lucide-react';
import { useCart } from './CartContext';
import { fetchLiveWooCategoriesClient } from '@/lib/client-woocommerce';
import { WooCategory } from '@/lib/woocommerce';

export function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [categories, setCategories] = useState<WooCategory[]>([]);

  useEffect(() => {
    fetchLiveWooCategoriesClient().then((cats) => {
      setCategories(cats);
    });
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full glass-header transition-all duration-300">
      {/* Top Announcement Banner */}
      <div className="bg-black py-2 px-4 border-b border-neutral-900 text-center text-xs text-neutral-300 flex items-center justify-center gap-2 font-medium tracking-wide">
        <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
        <span>সারাদেশে ক্যাশ অন ডেলিভারি (Cash on Delivery Available Nationwide)</span>
        <span className="hidden sm:inline-block text-neutral-600">•</span>
        <span className="hidden sm:inline-block text-amber-400 font-mono text-[11px]">ঢাকা ২০-২৪ ঘণ্টা / ঢাকার বাইরে ২-৩ দিন</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="lg:hidden p-2 text-neutral-300 hover:text-white transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* ULTRA-LUXURY TEXT-BASED BRAND LOGO */}
        <Link className="group flex flex-col items-center tracking-[0.28em] select-none" href="/">
          <span className="text-xl md:text-2xl font-serif font-bold text-white tracking-[0.25em] transition-opacity group-hover:opacity-90">
            RIYADEEN
          </span>
          <span className="text-[9px] tracking-[0.4em] text-neutral-400 font-light -mt-0.5 uppercase">
            Boys Wear
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-7 text-xs uppercase tracking-[0.2em] font-semibold text-neutral-300">
          <Link
            href="/"
            className="hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[1px] after:bg-amber-400 after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Home
          </Link>

          <Link
            href="/shop"
            className="hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[1px] after:bg-amber-400 after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            All Collections
          </Link>

          {/* Render dynamic categories fetched from WooCommerce API */}
          {categories.slice(0, 5).map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[1px] after:bg-amber-400 after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-4">
          <Link
            href="/shop"
            className="p-2 text-neutral-400 hover:text-white transition-colors hidden sm:block"
            title="Search Catalog"
          >
            <Search className="w-5 h-5" />
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 text-white hover:text-amber-400 transition-all flex items-center gap-2 group border border-neutral-800 rounded-full bg-neutral-950/80 hover:border-neutral-700"
            aria-label="Open Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs font-bold font-mono text-amber-400 group-hover:text-white transition-colors">
              ({totalItems})
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileDrawerOpen && (
        <div className="lg:hidden bg-neutral-950 border-b border-neutral-800 px-6 py-6 space-y-4 animate-fade-in shadow-2xl">
          <div className="flex justify-between items-center pb-4 border-b border-neutral-900">
            <Link className="group flex flex-col items-center tracking-[0.28em] select-none" href="/" onClick={() => setMobileDrawerOpen(false)}>
              <span className="text-lg font-serif font-bold text-white tracking-[0.25em]">
                RIYADEEN
              </span>
              <span className="text-[8px] tracking-[0.4em] text-neutral-400 font-light -mt-0.5 uppercase">
                Boys Wear
              </span>
            </Link>
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col space-y-3 text-xs font-bold uppercase tracking-[0.2em] text-neutral-300">
            <Link
              href="/"
              onClick={() => setMobileDrawerOpen(false)}
              className="py-2 border-b border-neutral-900 hover:text-amber-400 transition-colors"
            >
              Home Page
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileDrawerOpen(false)}
              className="py-2 border-b border-neutral-900 hover:text-amber-400 transition-colors"
            >
              All Luxury Collections
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                onClick={() => setMobileDrawerOpen(false)}
                className="py-2 border-b border-neutral-900 hover:text-amber-400 transition-colors"
              >
                {cat.name} ({cat.count})
              </Link>
            ))}
          </nav>

          <div className="pt-4 text-xs text-neutral-500 font-mono space-y-1">
            <p>1-Click Cash on Delivery Supported</p>
            <p className="text-amber-400">Dhaka & All 64 Districts</p>
          </div>
        </div>
      )}
    </header>
  );
}
