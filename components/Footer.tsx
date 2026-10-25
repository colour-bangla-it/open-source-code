'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, RefreshCw, MessageSquare, ArrowRight, MapPin, Mail, Phone, Globe } from 'lucide-react';

export function Footer() {
  const whatsappNumber = '8801761009740';
  const whatsappMessage = encodeURIComponent('হ্যালো! RIYADEEN থেকে সহায়তা প্রয়োজন।');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <footer className="bg-black text-neutral-400 border-t border-neutral-900 pt-16 pb-12">
      {/* Top Value Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-neutral-900">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-neutral-900 rounded-full border border-neutral-800 text-amber-400">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-1">
              Nationwide Express COD
            </h4>
            <p className="text-xs text-neutral-500">
              Deliveries within 24-48 hours in Dhaka and 3-5 days across all 64 districts in Bangladesh.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-neutral-900 rounded-full border border-neutral-800 text-amber-400">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-1">
              7-Day Doorstep Size Exchange
            </h4>
            <p className="text-xs text-neutral-500">
              Seamless doorstep fit exchanges. If the size isn't perfect, our rider swaps it immediately.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-neutral-900 rounded-full border border-neutral-800 text-amber-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-1">
              24/7 WhatsApp Support
            </h4>
            <p className="text-xs text-neutral-500">
              Direct concierge assistance for sizing advice, product details, and live order updates.
            </p>
          </div>
        </div>
      </div>

      {/* Minimalist 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Column 1: Logo & Brand Description */}
        <div className="space-y-4">
          {/* ULTRA-LUXURY TEXT-BASED BRAND LOGO */}
          <Link className="group flex flex-col items-start tracking-[0.28em] select-none mb-4" href="/">
            <span className="text-xl md:text-2xl font-serif font-bold text-white tracking-[0.25em] transition-opacity group-hover:opacity-90">
              RIYADEEN
            </span>
            <span className="text-[9px] tracking-[0.4em] text-neutral-400 font-light -mt-0.5 uppercase">
              Boys Wear
            </span>
          </Link>

          <p className="text-xs text-neutral-400 leading-relaxed font-light">
            Exquisite craftsmanship in contemporary boys apparel and traditional wear.
          </p>

          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 hover:bg-emerald-900 hover:text-emerald-200 text-xs font-semibold uppercase tracking-wider transition-all rounded-sm"
            >
              <MessageSquare className="w-4 h-4 fill-emerald-400/20" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h5 className="text-xs uppercase tracking-[0.25em] text-white font-bold mb-4 font-luxury-heading">
            Boyswear Collections
          </h5>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            <li>
              <Link href="/shop" className="hover:text-white transition-colors">
                All Collections
              </Link>
            </li>
            <li>
              <Link href="/category/panjabi" className="hover:text-white transition-colors">
                Panjabi Collection (পাঞ্জাবি)
              </Link>
            </li>
            <li>
              <Link href="/category/mens-shirt" className="hover:text-white transition-colors">
                Heavyweight Shirts (শার্ট)
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-white transition-colors">
                Casual & Formal Collections
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact & Official Address */}
        <div>
          <h5 className="text-xs uppercase tracking-[0.25em] text-white font-bold mb-4 font-luxury-heading">
            Atelier Contact & Info
          </h5>
          <ul className="space-y-3 text-xs text-neutral-400">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                House-5, Lane-12, Block-A, Section-10, Mirpur, Dhaka, Bangladesh, 1216
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <a href="tel:+8801761009740" className="hover:text-white font-mono">
                +880 1761-009740
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <a href="mailto:support@riyadeen.com.bd" className="hover:text-white">
                support@riyadeen.com.bd
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <a href="https://riyadeen.com.bd" target="_blank" rel="noopener noreferrer" className="hover:text-white font-mono">
                riyadeen.com.bd
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Customer Support & Legal Policy Pages */}
        <div>
          <h5 className="text-xs uppercase tracking-[0.25em] text-white font-bold mb-4 font-luxury-heading">
            Customer Care & Policies
          </h5>
          <ul className="space-y-2.5 text-xs text-neutral-400 mb-4">
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About RIYADEEN Atelier
              </Link>
            </li>
            <li>
              <Link href="/return-policy" className="hover:text-white transition-colors">
                7-Day Easy Return & Exchange
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy & Data Security
              </Link>
            </li>
            <li>
              <Link href="/terms-conditions" className="hover:text-white transition-colors">
                Terms & Conditions
              </Link>
            </li>
          </ul>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="luxury-input text-xs pr-10"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-white text-black text-xs hover:bg-amber-400 transition-colors flex items-center justify-center font-bold"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Copyright & Legal Links Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-600 gap-4">
        <p>© {new Date().getFullYear()} RIYADEEN (riyadeen.com.bd). All rights reserved.</p>
        <div className="flex space-x-6 text-neutral-500">
          <Link href="/terms-conditions" className="hover:text-white transition-colors">
            Terms & Conditions
          </Link>
          <Link href="/privacy-policy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/return-policy" className="hover:text-white transition-colors">
            Return Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
