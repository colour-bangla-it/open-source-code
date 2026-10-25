'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, ShieldCheck } from 'lucide-react';
import { useCart } from './CartContext';

export function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-header transition-all duration-300">
      {/* Top Banner Notice */}
      <div className="bg-black py-1.5 px-4 border-b border-neutral-900 text-center text-xs text-neutral-400 flex items-center justify-center gap-2 tracking-widest uppercase">
        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
        <span>1-Click Cash on Delivery Available Across Bangladesh</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-neutral-300 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <Link href="/" className="flex flex-col items-start group">
          <span className="font-luxury-heading text-xl sm:text-2xl font-bold tracking-[0.25em] text-white group-hover:text-amber-400 transition-colors">
            MONOCHROME
          </span>
          <span className="text-[10px] uppercase tracking-[0.4em] text-neutral-500 font-medium">
            Atelier Dhaka
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-10 text-xs uppercase tracking-[0.2em] font-semibold text-neutral-300">
          <Link href="/" className="hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[1px] after:bg-white after:absolute after:bottom-0 after:left-0 after:transition-all">
            Home
          </Link>
          <Link href="/shop" className="hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[1px] after:bg-white after:absolute after:bottom-0 after:left-0 after:transition-all">
            Collection
          </Link>
          <Link href="/shop?category=Outerwear" className="hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[1px] after:bg-white after:absolute after:bottom-0 after:left-0 after:transition-all">
            Outerwear
          </Link>
          <Link href="/shop?category=Tops" className="hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[1px] after:bg-white after:absolute after:bottom-0 after:left-0 after:transition-all">
            Tops
          </Link>
          <Link href="/shop?category=Bottoms" className="hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[1px] after:bg-white after:absolute after:bottom-0 after:left-0 after:transition-all">
            Bottoms
          </Link>
        </nav>

        {/* Header Actions */}
        <div className="flex items-center space-x-5">
          <Link href="/shop" className="p-2 text-neutral-300 hover:text-white transition-colors hidden sm:block">
            <Search className="w-5 h-5" />
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 text-white hover:text-amber-400 transition-colors flex items-center gap-2 group border border-neutral-800 rounded-full hover:border-neutral-700 bg-neutral-900/60"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs font-bold font-mono text-amber-400 group-hover:text-white transition-colors">
              ({totalItems})
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950 border-b border-neutral-800 px-6 py-6 space-y-4 animate-fade-in">
          <nav className="flex flex-col space-y-4 text-sm font-semibold uppercase tracking-widest text-neutral-300">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-neutral-900 hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-neutral-900 hover:text-white"
            >
              Catalog & Shop
            </Link>
            <Link
              href="/shop?category=Outerwear"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-neutral-900 hover:text-white"
            >
              Outerwear
            </Link>
            <Link
              href="/shop?category=Tops"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-neutral-900 hover:text-white"
            >
              Tops
            </Link>
            <Link
              href="/shop?category=Bottoms"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-neutral-900 hover:text-white"
            >
              Bottoms
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
