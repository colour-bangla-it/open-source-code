import React from 'react';
import { ThankYouClient } from '@/components/ThankYouClient';

interface ThankYouPageProps {
  params: {
    orderId: string;
  };
}

export const dynamicParams = true;

export function generateStaticParams() {
  // Pre-generate static fallback routes for SSG export
  return [
    { orderId: 'confirmation' },
    { orderId: 'demo' },
  ];
}

export function generateMetadata({ params }: ThankYouPageProps) {
  return {
    title: `Order #${params.orderId} Confirmed | RIYADEEN`,
    description: 'Thank you for your Cash on Delivery order.',
  };
}

export default function ThankYouPage({ params }: ThankYouPageProps) {
  return <ThankYouClient orderId={params.orderId || 'confirmation'} />;
}
