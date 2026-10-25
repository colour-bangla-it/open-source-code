import React from 'react';
import { ProductClientLoader } from '@/components/ProductClientLoader';

export async function generateStaticParams() {
  return [{ slug: 'item' }];
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  return <ProductClientLoader slug={params.slug} />;
}
