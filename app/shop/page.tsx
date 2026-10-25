import React from 'react';
import { getLiveProducts, getLiveCategories } from '@/lib/woocommerce';
import { ShopClient } from '@/components/ShopClient';

export const revalidate = 60; // Revalidate live store data every 60s

export default async function ShopPage() {
  const [initialProducts, initialCategories] = await Promise.all([
    getLiveProducts(),
    getLiveCategories(),
  ]);

  return (
    <ShopClient
      initialProducts={initialProducts}
      initialCategories={initialCategories}
    />
  );
}
