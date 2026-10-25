import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | RIYADEEN Boyswear',
  description: 'Customer data protection & privacy commitments of RIYADEEN (riyadeen.com.bd).',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 space-y-10 text-neutral-300">
      <div className="border-b border-neutral-900 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" />
          <span>DATA PROTECTION & PRIVACY</span>
        </div>
        <h1 className="font-luxury-heading text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-wider">
          PRIVACY POLICY
        </h1>
        <p className="text-xs text-neutral-500 font-mono">Last updated: January 2026 • RIYADEEN Bangladesh</p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm font-light leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
            1. Information We Collect
          </h2>
          <p>
            At RIYADEEN (riyadeen.com.bd), we collect essential personal information required to process your 1-Click Cash on Delivery orders. This includes your full name, mobile number, delivery address, and order selections.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
            2. How We Use Your Data
          </h2>
          <p>
            Your information is strictly used for order dispatch, rider contact, order verification phone calls, and customer support. We do not sell, lease, or distribute customer details to any third-party marketing brokers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
            3. Data Security & Storage
          </h2>
          <p>
            We implement industry-standard encryption and security measures. Order details stored in our WooCommerce system are protected under strict administrative access control protocols.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
            4. Contact Concierge
          </h2>
          <p>
            For data inquiries or deletion requests, please contact our concierge team at{' '}
            <a href="mailto:support@riyadeen.com.bd" className="text-amber-400 underline">
              support@riyadeen.com.bd
            </a>{' '}
            or call +880 1761-009740.
          </p>
        </section>
      </div>
    </div>
  );
}
