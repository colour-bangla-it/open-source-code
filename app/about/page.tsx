import React from 'react';
import { Sparkles, MapPin, Phone, Mail, Globe } from 'lucide-react';

export const metadata = {
  title: 'About Us | RIYADEEN Boyswear Atelier',
  description: 'Learn about RIYADEEN brand story, office address, and craftsmanship in boys apparel.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 space-y-10 text-neutral-300">
      <div className="border-b border-neutral-900 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest">
          <Sparkles className="w-4 h-4" />
          <span>BOYSWEAR CRAFTSMANSHIP</span>
        </div>
        <h1 className="font-luxury-heading text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-wider">
          ABOUT RIYADEEN
        </h1>
        <p className="text-xs text-neutral-500 font-mono">riyadeen.com.bd • Contemporary Boyswear Atelier</p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm font-light leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
            Our Brand Story
          </h2>
          <p>
            RIYADEEN was founded with a singular vision: to bring exquisite craftsmanship, modern tailored cuts, and premium fabrics to boys apparel and traditional wear in Bangladesh.
          </p>
          <p>
            From festive royal Panjabis to 300 GSM heavyweight drop-shoulder t-shirts and crisp Oxford shirts, every garment is crafted with meticulous attention to detail, comfort, and longevity.
          </p>
        </section>

        <section className="space-y-4 pt-4 border-t border-neutral-900">
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
            Official Atelier & Support Contact
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="bg-neutral-950 p-4 border border-neutral-800 space-y-1">
              <span className="text-neutral-500 uppercase text-[10px] block">Physical Address</span>
              <p className="text-white font-sans leading-relaxed">
                House-5, Lane-12, Block-A, Section-10, Mirpur, Dhaka, Bangladesh, 1216
              </p>
            </div>

            <div className="bg-neutral-950 p-4 border border-neutral-800 space-y-1">
              <span className="text-neutral-500 uppercase text-[10px] block">Hotline & WhatsApp</span>
              <p className="text-amber-400 font-bold">+880 1761-009740</p>
              <p className="text-neutral-400 font-sans text-[11px]">Daily 10:00 AM - 10:00 PM</p>
            </div>

            <div className="bg-neutral-950 p-4 border border-neutral-800 space-y-1">
              <span className="text-neutral-500 uppercase text-[10px] block">Official Email</span>
              <p className="text-white">support@riyadeen.com.bd</p>
            </div>

            <div className="bg-neutral-950 p-4 border border-neutral-800 space-y-1">
              <span className="text-neutral-500 uppercase text-[10px] block">Official Store Website</span>
              <p className="text-white">riyadeen.com.bd</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
