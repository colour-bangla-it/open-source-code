import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, ShieldCheck, Sparkles } from 'lucide-react';
import { getLiveWooCategoryObjects } from '@/lib/woocommerce';
import { DynamicCategoryGrid } from '@/components/DynamicCategoryGrid';
import { DynamicCategoryProductRows } from '@/components/DynamicCategoryProductRows';

export const revalidate = 60; // Revalidate live store data every 60s

export default async function HomePage() {
  const initialCategories = await getLiveWooCategoryObjects();

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Editorial Boyswear Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-neutral-950 border-b border-neutral-900 w-full">
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center space-y-8 animate-fade-in pt-12">
          {/* Subtitle Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-amber-400 text-xs font-mono tracking-widest uppercase shadow-2xl">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RIYADEEN LUXURY ATELIER</span>
          </div>

          {/* Overlay Title */}
          <h1 className="font-luxury-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-[0.15em] text-white uppercase leading-tight">
            CONTEMPORARY <br />
            <span className="text-amber-400 font-extrabold">BOYSWEAR</span> ATELIER
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
            Exquisite craftsmanship in contemporary boys apparel and traditional wear. Powered 100% dynamically by WooCommerce. Express 1-Click Cash on Delivery nationwide.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/shop" className="btn-luxury-primary w-full sm:w-auto px-8 py-4 text-xs font-bold tracking-[0.2em]">
              <span>EXPLORE ALL COLLECTIONS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Top Category Cover Tiles (Directly after Hero) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs text-amber-400 font-mono tracking-[0.3em] uppercase font-bold">
            WOOCOMMERCE CATEGORIES
          </span>
          <h2 className="font-luxury-heading text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-wider">
            CURATED SELECTIONS
          </h2>
        </div>

        {/* Dynamic Category Cover Grid rendering official WooCommerce Category Images */}
        <DynamicCategoryGrid initialCategories={initialCategories} />
      </section>

      {/* 3. Dedicated Rows for Each Category (4 Products per Category Row) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DynamicCategoryProductRows />
      </section>

      {/* 4. Express Cash on Delivery Trust Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-950 border border-neutral-800 rounded-sm p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest">
                <Zap className="w-4 h-4 fill-current" />
                <span>NATIONWIDE EXPRESS COD</span>
              </div>
              <h3 className="font-luxury-heading text-2xl sm:text-4xl font-bold text-white uppercase tracking-wider">
                1-CLICK CASH ON DELIVERY. <br />
                PAY WHEN RIDER DELIVERS.
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed font-light">
                Order directly with your mobile number and shipping address. Enjoy doorstep try-on, size swapping, and fast dispatch within 24 hours in Dhaka and 3-5 days across all 64 districts in Bangladesh.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              <Link
                href="/shop"
                className="btn-luxury-primary text-xs py-4 text-center justify-center font-bold tracking-widest"
              >
                ORDER WITH 1-CLICK COD
              </Link>
              <div className="flex items-center justify-center gap-2 text-neutral-500 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Verified Express Delivery Partner Network</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
