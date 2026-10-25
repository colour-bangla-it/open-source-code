'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, PhoneCall, ArrowRight, PackageCheck, MessageSquare, ShoppingBag } from 'lucide-react';
import { event } from '@/lib/meta-pixel';

interface ThankYouClientProps {
  orderId: string;
}

export function ThankYouClient({ orderId }: ThankYouClientProps) {
  const [orderInfo, setOrderInfo] = useState<{
    value: number;
    phone?: string;
    fullName?: string;
  }>({ value: 2450 });

  const deliveryDateEstimate = new Date();
  deliveryDateEstimate.setDate(deliveryDateEstimate.getDate() + 2);
  const formattedDate = deliveryDateEstimate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  // Deduplicated Meta Pixel Purchase Tracking & Session Data Reading
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storageKey = `fired_purchase_${orderId}`;
    let parsed: any = null;

    const storedPixel = sessionStorage.getItem(`order_pixel_${orderId}`);
    if (storedPixel) {
      try {
        parsed = JSON.parse(storedPixel);
        setOrderInfo({
          value: parsed.value || 2450,
          phone: parsed.phone,
          fullName: parsed.fullName,
        });
      } catch (e) {}
    }

    if (sessionStorage.getItem(storageKey)) {
      console.log(`[Meta Pixel] Purchase event for order #${orderId} already fired. Skipping duplicate tracking.`);
      return;
    }

    const orderData = {
      value: parsed?.value || 2450,
      currency: parsed?.currency || 'BDT',
      content_ids: parsed?.content_ids || ['101'],
      num_items: parsed?.num_items || 1,
    };

    // Fire client-side deduplicated Purchase event
    event(
      'Purchase',
      {
        value: orderData.value,
        currency: orderData.currency,
        content_ids: orderData.content_ids,
        content_type: 'product',
        num_items: orderData.num_items,
      },
      { eventID: orderId.toString() }
    );

    // Mark as fired in sessionStorage to prevent duplicate events on page reload
    sessionStorage.setItem(storageKey, 'true');
  }, [orderId]);

  // Pre-filled WhatsApp direct contact link with Order ID
  const whatsappNumber = '8801761009740';
  const whatsappText = encodeURIComponent(
    `হ্যালো! আমার অর্ডার নম্বর #${orderId} সম্পর্কে জানতে চাই।`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 sm:py-28 space-y-12">
      {/* Confirmation Header Badge */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto text-emerald-400 animate-fade-in shadow-2xl">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block font-bold">
          1-CLICK COD ORDER CONFIRMED
        </span>

        <h1 className="font-luxury-heading text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-wider">
          ধন্যবাদ! আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে।
        </h1>

        <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-lg mx-auto leading-relaxed">
          আমাদের কাস্টমার রিপ্রেজেন্টেটিভ শীঘ্রই কল করে আপনার অর্ডারটি কনফার্ম করবেন।
        </p>
      </div>

      {/* Order Reference Card */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-900 pb-6 gap-4">
          <div>
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">
              অর্ডার ট্র্যাকিং নম্বর:
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-amber-400">
              #{orderId}
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-xs text-emerald-400 font-mono font-bold">
            <PackageCheck className="w-4 h-4 text-emerald-400" />
            <span>STATUS: PROCESSING (COD)</span>
          </div>
        </div>

        {/* Summary Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs border-b border-neutral-900 pb-6">
          <div className="space-y-1">
            <span className="text-neutral-500 uppercase tracking-widest text-[10px] block">
              PAYMENT METHOD
            </span>
            <span className="text-white font-bold block">Cash on Delivery (COD)</span>
            <span className="text-neutral-400 text-[11px]">পণ্য হাতে পেয়ে টাকা দিবেন</span>
          </div>

          <div className="space-y-1">
            <span className="text-neutral-500 uppercase tracking-widest text-[10px] block">
              ESTIMATED ARRIVAL
            </span>
            <span className="text-white font-bold block">{formattedDate}</span>
            <span className="text-neutral-400 text-[11px]">ঢাকা ২৪-৪৮ ঘণ্টা / বাইরে ৩-৫ দিন</span>
          </div>

          <div className="space-y-1">
            <span className="text-neutral-500 uppercase tracking-widest text-[10px] block">
              TOTAL PAYABLE CASH
            </span>
            <span className="text-amber-400 font-mono font-extrabold text-base block">
              ৳ {orderInfo.value.toLocaleString('en-BD')}
            </span>
          </div>
        </div>

        {/* Next Steps */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs uppercase tracking-widest font-bold text-white flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-amber-400" />
            <span>WHAT HAPPENS NEXT?</span>
          </h3>

          <div className="space-y-2 text-xs text-neutral-400">
            <p className="flex items-start gap-2">
              <span className="text-amber-400 font-bold font-mono">1.</span>
              <span>আমাদের কাস্টমার রিপ্রেজেন্টেটিভ শীঘ্রই কল করে আপনার অর্ডারটি কনফার্ম করবেন।</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-amber-400 font-bold font-mono">2.</span>
              <span>কুরিয়ার রাইডার আপনার ঠিকানায় পার্সেল পৌঁছে দেবে।</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-amber-400 font-bold font-mono">3.</span>
              <span>পণ্য দেখে ক্যাশ অন ডেলিভারিতে রাইডারকে মূল্য পরিশোধ করুন।</span>
            </p>
          </div>
        </div>
      </div>

      {/* Two Distinct Action CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        {/* Direct WhatsApp Action Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm shadow-xl transition-all"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          <span>WhatsApp-এ সরাসরি যোগাযোগ করুন</span>
        </a>

        {/* Continue Shopping CTA */}
        <Link
          href="/"
          className="w-full sm:w-auto px-8 py-4 btn-luxury-outline text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>আরো শপিং করুন</span>
        </Link>
      </div>

      <div className="flex items-center justify-center gap-2 text-neutral-500 text-xs pt-6 border-t border-neutral-900">
        <ShieldCheck className="w-4 h-4 text-amber-400" />
        <span>অর্ডার সংক্রান্ত যেকোনো সহায়তায় ইমেইল করুন: support@riyadeen.com.bd</span>
      </div>
    </div>
  );
}
