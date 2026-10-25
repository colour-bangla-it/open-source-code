'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, MessageSquare, ShoppingBag, MapPin, Phone, User, Package, Sparkles } from 'lucide-react';

interface OrderSuccessModalProps {
  isOpen: boolean;
  orderId: string | number;
  productName: string;
  selectedSize: string;
  selectedColor?: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  onClose: () => void;
}

export function OrderSuccessModal({
  isOpen,
  orderId,
  productName,
  selectedSize,
  selectedColor = 'Standard',
  customerName,
  customerPhone,
  customerAddress,
  totalAmount,
  onClose,
}: OrderSuccessModalProps) {
  if (!isOpen) return null;

  const whatsappNumber = '8801761009740';
  const whatsappText = encodeURIComponent(
    `হ্যালো! আমি অর্ডার নম্বর #${orderId} সম্পর্কে জানতে চাই।`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="bg-neutral-950 border border-emerald-500/40 w-full max-w-xl rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl relative text-center">
        {/* Big Success Icon & Heading */}
        <div className="space-y-3">
          <div className="w-16 h-16 bg-emerald-500/10 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto text-emerald-400 animate-bounce shadow-2xl">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block font-bold">
            1-CLICK COD ORDER SUCCESSFUL
          </span>

          <h2 className="font-luxury-heading text-xl sm:text-3xl font-extrabold text-white uppercase tracking-wider">
            অভিনন্দন! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।
          </h2>

          <p className="text-xs text-neutral-400 font-light">
            আমাদের কাস্টমার রিপ্রেজেন্টেটিভ শীঘ্রই কল করে আপনার অর্ডারটি কনফার্ম করবেন।
          </p>
        </div>

        {/* Order ID Badge */}
        <div className="inline-block bg-neutral-900 border border-amber-400/40 px-5 py-2 rounded-sm shadow-inner">
          <span className="text-xs text-neutral-400 uppercase tracking-widest block font-mono">
            অর্ডার ট্র্যাকিং কোড
          </span>
          <span className="text-xl sm:text-2xl font-mono font-extrabold text-amber-400">
            অর্ডার আইডি: #{orderId}
          </span>
        </div>

        {/* Order Details Breakdown Table */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-sm p-4 text-left text-xs space-y-2.5">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
            <span className="text-neutral-400 flex items-center gap-1.5 font-bold">
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span>পণ্য ও সাইজ:</span>
            </span>
            <span className="text-white font-bold text-right">
              {productName} {selectedSize && <span className="text-amber-400 font-mono">({selectedSize})</span>}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>গ্রাহকের নাম:</span>
            </span>
            <span className="text-white font-semibold">{customerName}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>মোবাইল নম্বর:</span>
            </span>
            <span className="text-white font-mono">{customerPhone}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>ডেলিভারি ঠিকানা:</span>
            </span>
            <span className="text-white font-light text-right max-w-[240px] line-clamp-1">
              {customerAddress}
            </span>
          </div>

          <div className="flex justify-between items-center pt-1 font-bold text-sm">
            <span className="text-neutral-300 uppercase">ক্যাশ পেয়াবল বিল:</span>
            <span className="text-amber-400 font-mono font-extrabold text-base">
              ৳ {totalAmount.toLocaleString('en-BD')} (COD)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {/* Direct WhatsApp CTA Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm shadow-xl transition-all"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>WhatsApp-এ সরাসরি যোগাযোগ করুন</span>
          </a>

          {/* Close & Shopping CTA Button */}
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3.5 btn-luxury-outline text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>কার্ট খালি করা হয়েছে - আরও শপিং করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
}
