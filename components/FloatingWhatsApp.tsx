'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MessageSquare } from 'lucide-react';

interface FloatingWhatsAppProps {
  productTitle?: string;
}

export function FloatingWhatsApp({ productTitle }: FloatingWhatsAppProps) {
  const pathname = usePathname();
  const whatsappNumber = '8801761009740';

  // Dynamic message logic
  let message = 'হ্যালো! RIYADEEN থেকে সহায়তা প্রয়োজন।';
  if (productTitle) {
    message = `হ্যালো! আমি এই প্রোডাক্টটি অর্ডার করতে চাই: ${productTitle}`;
  } else if (pathname && pathname.startsWith('/product/')) {
    message = `হ্যালো! আমি প্রোডাক্ট সম্পর্কিত তথ্য ও অর্ডার সহায়তা চাচ্ছি।`;
  }

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact RIYADEEN WhatsApp Support"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 group border border-emerald-400/30"
    >
      {/* Pulse effect badge */}
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
      </span>

      <MessageSquare className="w-5 h-5 fill-current" />
      
      <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider font-mono">
        WhatsApp Support
      </span>
    </a>
  );
}
