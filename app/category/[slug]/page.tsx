import React from 'react';
import { getLiveWooCategoryObjects, WooCommerceClient, mapWooProductToProduct } from '@/lib/woocommerce';
import { ShopClient } from '@/components/ShopClient';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await getLiveWooCategoryObjects();
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const categories = await getLiveWooCategoryObjects();
  const matched = categories.find((c) => c.slug.toLowerCase() === params.slug.toLowerCase());
  const titleName = matched ? matched.name : params.slug.replace(/-/g, ' ').toUpperCase();

  return {
    title: `${titleName} | RIYADEEN Atelier`,
    description: `Explore luxury ${titleName} garments by RIYADEEN.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  let initialProducts: any[] = [];
  let categoryName = params.slug;

  try {
    // 2-Step Server Fetching Logic: Resolve slug to numeric Category ID
    const catResponse = await WooCommerceClient.get('products/categories', {
      slug: params.slug,
    });

    if (catResponse.data && Array.isArray(catResponse.data) && catResponse.data.length > 0) {
      const categoryId = catResponse.data[0].id;
      categoryName = catResponse.data[0].name;

      // Step 2: Fetch products using strictly numeric ID
      const prodResponse = await WooCommerceClient.get('products', {
        category: categoryId,
        status: 'publish',
        per_page: 12,
        page: 1,
      });

      if (prodResponse.data && Array.isArray(prodResponse.data)) {
        initialProducts = prodResponse.data.map(mapWooProductToProduct);
      }
    }
  } catch (error) {
    console.warn(`[CategoryPage Server Fetch] Failed for category slug "${params.slug}":`, error);
  }

  return (
    <ShopClient
      initialProducts={initialProducts}
      initialCategories={['All', categoryName]}
      categorySlugParam={categoryName}
    />
  );
}
