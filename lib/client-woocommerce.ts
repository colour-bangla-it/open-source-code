import { Product } from './mock-data';
import { WooCategory } from './woocommerce';

const WC_STORE_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://test.premiumcollectionbd.com';
const WC_KEY = process.env.WC_CONSUMER_KEY || 'ck_dd0b0242fa96c7c3116e7492016e497b65a031a7';
const WC_SECRET = process.env.WC_CONSUMER_SECRET || 'cs_3c4df217d5f840f325c7902a3dcd0ae74fb460e7';

function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
}

export function mapClientWooProduct(item: any): Product {
  const price = Number(item.price || item.regular_price || 0);
  let regularPrice = item.regular_price ? Number(item.regular_price) : undefined;
  const onSale = Boolean(item.on_sale);

  // If variable product has on_sale = true but regular_price is empty, infer regularPrice
  if (onSale && (!regularPrice || regularPrice <= price)) {
    regularPrice = Math.round((price > 0 ? price : 2450) * 1.25);
  }

  const images =
    item.images && item.images.length > 0
      ? item.images.map((img: any) => img.src)
      : ['/images/logo.avif'];

  let categoryName = 'Collection';
  if (item.categories && item.categories.length > 0) {
    categoryName = item.categories[0].name;
  }

  let sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  let colors = [
    { name: 'Obsidian Black', hex: '#0A0A0A' },
    { name: 'Chalk White', hex: '#FFFFFF' },
  ];

  if (item.attributes && Array.isArray(item.attributes)) {
    const sizeAttr = item.attributes.find(
      (a: any) => a.name.toLowerCase() === 'size' || a.name.toLowerCase() === 'sizes'
    );
    if (sizeAttr && sizeAttr.options && sizeAttr.options.length > 0) {
      sizes = sizeAttr.options;
    }

    const colorAttr = item.attributes.find(
      (a: any) => a.name.toLowerCase() === 'color' || a.name.toLowerCase() === 'colors'
    );
    if (colorAttr && colorAttr.options && colorAttr.options.length > 0) {
      colors = colorAttr.options.map((name: string) => ({
        name,
        hex: name.toLowerCase().includes('white') ? '#FFFFFF' : '#0A0A0A',
      }));
    }
  }

  return {
    id: String(item.id),
    name: item.name,
    slug: item.slug,
    price: price > 0 ? price : 2450,
    regularPrice: regularPrice && regularPrice > price ? regularPrice : undefined,
    description: stripHtml(item.short_description || item.description) || 'Premium luxury garment crafted with modern minimalist silhouette.',
    details: [
      'Authentic WooCommerce Atelier Quality',
      'Heavyweight Premium Cotton Blend',
      'Double-stitched reinforced seam detailing',
      'Nationwide 1-Click Cash on Delivery',
    ],
    category: categoryName,
    sizes,
    colors,
    images,
    featured: item.featured || false,
    isNew: true,
    inStock: item.stock_status === 'instock' || item.in_stock || true,
    wooCommerceId: item.id,
    onSale: onSale,
  } as any;
}

export async function fetchCategoryIdBySlug(slug: string): Promise<number | null> {
  if (!slug || slug === 'All' || slug === 'all') return null;
  try {
    const authHeader = 'Basic ' + btoa(`${WC_KEY}:${WC_SECRET}`);
    const url = `${WC_STORE_URL.replace(/\/$/, '')}/wp-json/wc/v3/products/categories?slug=${encodeURIComponent(slug)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data[0].id;
      }
    }
  } catch (err) {
    console.warn('[fetchCategoryIdBySlug Error]:', err);
  }
  return null;
}

export interface PaginatedProductsResult {
  products: Product[];
  totalPages: number;
  hasMore: boolean;
}

export async function fetchProductsByCategoryIdPaginated({
  categoryId,
  perPage = 12,
  page = 1,
}: {
  categoryId?: number | null;
  perPage?: number;
  page?: number;
}): Promise<PaginatedProductsResult> {
  try {
    const authHeader = 'Basic ' + btoa(`${WC_KEY}:${WC_SECRET}`);
    let url = `${WC_STORE_URL.replace(/\/$/, '')}/wp-json/wc/v3/products?status=publish&per_page=${perPage}&page=${page}`;

    if (categoryId) {
      url += `&category=${categoryId}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    if (response.ok) {
      const totalPagesHeader = response.headers.get('x-wp-totalpages');
      const totalPages = totalPagesHeader ? parseInt(totalPagesHeader, 10) : 1;

      const data = await response.json();
      if (Array.isArray(data)) {
        const products = data.map(mapClientWooProduct);
        const hasMore = page < totalPages && products.length === perPage;
        return {
          products,
          totalPages,
          hasMore,
        };
      }
    }
  } catch (err) {
    console.warn('[fetchProductsByCategoryIdPaginated Error]:', err);
  }

  return {
    products: [],
    totalPages: 1,
    hasMore: false,
  };
}

export async function fetchLiveWooProductsClient(categoryFilter?: string): Promise<Product[]> {
  try {
    let catId: number | null = null;
    if (categoryFilter && categoryFilter !== 'All') {
      catId = await fetchCategoryIdBySlug(categoryFilter);
    }
    const result = await fetchProductsByCategoryIdPaginated({
      categoryId: catId,
      perPage: 20,
      page: 1,
    });
    return result.products;
  } catch (err) {
    console.warn('[Client WooCommerce Fetch] Could not fetch products live.', err);
  }
  return [];
}

export async function fetchLiveWooCategoriesClient(): Promise<WooCategory[]> {
  try {
    const authHeader = 'Basic ' + btoa(`${WC_KEY}:${WC_SECRET}`);
    const url = `${WC_STORE_URL.replace(/\/$/, '')}/wp-json/wc/v3/products/categories?per_page=50&hide_empty=true`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        return data
          .filter((cat: any) => cat.slug !== 'uncategorized')
          .map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            count: cat.count || 0,
            image: cat.image ? { id: cat.image.id, src: cat.image.src, alt: cat.image.alt } : null,
          }));
      }
    }
  } catch (err) {
    console.warn('[Client WooCommerce Fetch] Could not fetch categories.', err);
  }

  return [];
}
