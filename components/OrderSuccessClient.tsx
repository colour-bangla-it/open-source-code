'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, MessageSquare, ShoppingBag, PhoneCall, Package, User, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { event } from '@/lib/meta-pixel';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const queryOrderId = searchParams.get('id') || '101';

  const [orderData, setOrderData] = useState<{
    id: string;
    customerName: string;
    phone: string;
    address: string;
    size: string;
    productName: string;
    total: number;
  }>({
    id: queryOrderId,
    customerName: 'Customer',
    phone: '01XXXXXXXXX',
    address: 'Dhaka, Bangladesh',
    size: 'Standard',
    productName: 'RIYADEEN Boyswear Garment',
    total: 2450,
  });

  const deliveryDateEstimate = new Date();
  deliveryDateEstimate.setDate(deliveryDateEstimate.getDate() + 2);
  const formattedDate = deliveryDateEstimate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Read stored order details from sessionStorage
    const stored = sessionStorage.getItem('last_riyadeen_order');
    let effectiveOrderId = queryOrderId;

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setOrderData({
          id: String(parsed.id || queryOrderId),
          customerName: parsed.customerName || 'Customer',
          phone: parsed.phone || '01XXXXXXXXX',
          address: parsed.address || 'Dhaka, Bangladesh',
          size: parsed.size || 'Standard',
          productName: parsed.productName || 'RIYADEEN Boyswear Garment',
          total: Number(parsed.total) || 2450,
        });
        effectiveOrderId = String(parsed.id || queryOrderId);
      } catch (e) {}
    }

    // Trigger deduplicated Meta Pixel Purchase tracking
    const storageKey = `fired_purchase_${effectiveOrderId}`;
    if (!sessionStorage.getItem(storageKey)) {
      event(
        'Purchase',
        {
          value: orderData.total,
          currency: 'BDT',
          content_type: 'product',
          num_items: 1,
        },
        { eventID: effectiveOrderId }
      );
      sessionStorage.setItem(storageKey, 'true');
    }
  }, [queryOrderId]);

  const whatsappNumber = '8801761009740';
  const whatsappText = encodeURIComponent(
    `হ্যালো! আমি RIYADEEN থেকে অর্ডার করেছি। আমার অর্ডার আইডি: #${orderData.id}`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 sm:py-28 space-y-10 text-center">
      {/* Animated Green Checkmark Icon & Heading */}
      <div className="space-y-4">
        <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto text-emerald-400 animate-bounce shadow-2xl">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block font-bold">
          1-CLICK COD ORDER CONFIRMED
        </span>

        <h1 className="font-luxury-heading text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-wider">
          অভিনন্দন! আপনার অর্ডারটি গ্রহণ করা হয়েছে।
        </h1>

        <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-lg mx-auto leading-relaxed">
          আমাদের কাস্টমার রিপ্রেজেন্টেটিভ শীঘ্রই কল করে আপনার অর্ডারটি কনফার্ম করবেন।
        </p>
      </div>

      {/* Order Tracking Badge */}
      <div className="inline-block bg-neutral-900 border border-amber-400/40 px-6 py-3 rounded-sm shadow-xl">
        <span className="text-[11px] text-neutral-400 uppercase tracking-widest block font-mono">
          ORDER REFERENCE ID
        </span>
        <span className="text-xl sm:text-2xl font-mono font-extrabold text-amber-400">
          অর্ডার ট্র্যাকিং নম্বর: #{orderData.id}
        </span>
      </div>

      {/* Order Summary Breakdown Card */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-sm p-6 sm:p-8 text-left text-xs space-y-4 shadow-2xl">
        <div className="flex justify-between items-center pb-3 border-b border-neutral-900">
          <span className="text-neutral-400 flex items-center gap-2 font-bold">
            <Package className="w-4 h-4 text-amber-400" />
            <span>পণ্য ও সাইজ:</span>
          </span>
          <span className="text-white font-bold text-right">
            {orderData.productName}{' '}
            {orderData.size && <span className="text-amber-400 font-mono font-extrabold">({orderData.size})</span>}
          </span>
        </div>

        <div className="flex justify-between items-center pb-3 border-b border-neutral-900">
          <span className="text-neutral-400 flex items-center gap-2">
            <User className="w-4 h-4 text-amber-400" />
            <span>গ্রাহকের নাম:</span>
          </span>
          <span className="text-white font-semibold">{orderData.customerName}</span>
        </div>

        <div className="flex justify-between items-center pb-3 border-b border-neutral-900">
          <span className="text-neutral-400 flex items-center gap-2">
            <Phone className="w-4 h-4 text-amber-400" />
            <span>মোবাইল নম্বর:</span>
          </span>
          <span className="text-white font-mono">{orderData.phone}</span>
        </div>

        <div className="flex justify-between items-center pb-3 border-b border-neutral-900">
          <span className="text-neutral-400 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>ডেলিভারি ঠিকানা:</span>
          </span>
          <span className="text-white font-light text-right max-w-[280px]">
            {orderData.address}
          </span>
        </div>

        <div className="flex justify-between items-center pt-2 font-bold text-sm">
          <span className="text-neutral-300 uppercase">সর্বমোট ক্যাশ বিল (Total COD):</span>
          <span className="text-amber-400 font-mono font-extrabold text-lg">
            ৳ {orderData.total.toLocaleString('en-BD')}
          </span>
        </div>
      </div>

      {/* Action CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        {/* Direct WhatsApp button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm shadow-xl transition-all"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          <span>WhatsApp-এ সরাসরি যোগাযোগ করুন</span>
        </a>

        {/* "আরও শপিং করুন" button linking back to / */}
        <Link
          href="/"
          className="w-full sm:w-auto px-8 py-4 btn-luxury-outline text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>আরও শপিং করুন</span>
        </Link>
      </div>

      <div className="flex items-center justify-center gap-2 text-neutral-500 text-xs pt-6 border-t border-neutral-900">
        <ShieldCheck className="w-4 h-4 text-amber-400" />
        <span>অর্ডার সংক্রান্ত সহায়তায় যোগাযোগ করুন: support@riyadeen.com.bd</span>
      </div>
    </div>
  );
}

export function OrderSuccessClient() {
  return (
    <Suspense fallback={
      <div className="py-32 text-center text-xs font-mono text-amber-400">
        Loading Order Confirmation...
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
