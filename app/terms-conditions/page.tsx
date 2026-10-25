import React from 'react';
import { FileText, Truck } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | RIYADEEN Boyswear',
  description: 'Terms of service & delivery commitments of RIYADEEN (riyadeen.com.bd).',
};

export default function TermsConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 space-y-10 text-neutral-300">
      <div className="border-b border-neutral-900 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest">
          <FileText className="w-4 h-4" />
          <span>TERMS OF SERVICE</span>
        </div>
        <h1 className="font-luxury-heading text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-wider">
          TERMS & CONDITIONS
        </h1>
        <p className="text-xs text-neutral-500 font-mono">Effective: January 2026 • RIYADEEN Bangladesh</p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm font-light leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
            1. Overview
          </h2>
          <p>
            By accessing or ordering from RIYADEEN (riyadeen.com.bd), you agree to these Terms & Conditions. Our service specializes in premium boys apparel and traditional Eid/festive Panjabis delivered across Bangladesh.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
            2. Cash on Delivery (COD) & Pricing
          </h2>
          <p>
            All prices are listed in Bangladeshi Taka (BDT). Payment is collected via 100% Cash on Delivery (COD). Shipping fees are flat ৳70 within Dhaka City and ৳130 across outside Dhaka districts.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
            3. Delivery Timelines
          </h2>
          <p>
            Deliveries within Dhaka City are completed within 24 to 48 hours. Nationwide deliveries outside Dhaka require 3 to 5 business days depending on courier route accessibility.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
            4. Customer Contact
          </h2>
          <p>
            For order adjustments or questions, contact concierge support at +880 1761-009740 or email support@riyadeen.com.bd.
          </p>
        </section>
      </div>
    </div>
  );
}
