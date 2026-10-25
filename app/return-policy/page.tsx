import React from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Return & Exchange Policy | RIYADEEN Boyswear',
  description: '7-day doorstep size exchange & return policy for RIYADEEN clothing.',
};

export default function ReturnPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 space-y-10 text-neutral-300">
      <div className="border-b border-neutral-900 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest">
          <RefreshCw className="w-4 h-4" />
          <span>7-DAY EASY SIZE EXCHANGE</span>
        </div>
        <h1 className="font-luxury-heading text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-wider">
          RETURN & EXCHANGE POLICY
        </h1>
        <p className="text-xs text-neutral-500 font-mono">Guaranteed satisfaction • RIYADEEN Atelier</p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm font-light leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
            1. 7-Day Doorstep Fit Guarantee
          </h2>
          <p>
            We want your boy to have the perfect fit. If the Panjabi, t-shirt, or shirt size doesn't fit properly, you can request an exchange within 7 days of receiving the delivery.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
            2. Exchange Conditions
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
            <li>Garments must be unworn, unwashed, and undamaged with original tags attached.</li>
            <li>Original purchase order ID must be provided to concierge.</li>
            <li>Exchange is subject to stock availability of the requested size.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
            3. Doorstep Parcel Checking
          </h2>
          <p>
            You are encouraged to inspect the outer package and garment design upon courier delivery before completing cash payment.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
            4. How to Initiate Exchange
          </h2>
          <p>
            Send a WhatsApp message to{' '}
            <a href="https://wa.me/8801761009740" className="text-emerald-400 underline font-bold">
              +880 1761-009740
            </a>{' '}
            or email support@riyadeen.com.bd with your order ID and requested size. Our courier rider will handle the doorstep exchange.
          </p>
        </section>
      </div>
    </div>
  );
}
