import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import { Product, WooVariation } from './mock-data';

export interface WooCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  image?: {
    id: number;
    src: string;
    alt?: string;
  } | null;
}

const storeUrl =
  process.env.WC_STORE_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  'https://test.premiumcollectionbd.com';

const consumerKey =
  process.env.WC_CONSUMER_KEY ||
  'ck_dd0b0242fa96c7c3116e7492016e497b65a031a7';

const consumerSecret =
  process.env.WC_CONSUMER_SECRET ||
  'cs_3c4df217d5f840f325c7902a3dcd0ae74fb460e7';

// Initialize WooCommerce REST API Client
export const WooCommerceClient = new WooCommerceRestApi({
  url: storeUrl,
  consumerKey: consumerKey,
  consumerSecret: consumerSecret,
  version: 'wc/v3',
});

// Helper function to strip HTML tags from WooCommerce text fields
function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
}

// Helper function to safely format and secure HTTPS image URLs
export function getSafeImageUrl(src?: string): string {
  if (!src) return 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800';
  let clean = src.trim();
  if (clean.startsWith('http://')) {
    clean = clean.replace('http://', 'https://');
  }
  return clean;
}

// Convert WooCommerce REST API Product object to Frontend Product interface
export function mapWooProductToProduct(item: any): Product {
  const price = Number(item.price || item.regular_price || 0);
  let regularPrice = item.regular_price ? Number(item.regular_price) : undefined;
  const onSale = Boolean(item.on_sale);

  // If variable product has on_sale = true but regular_price is empty, infer regularPrice
  if (onSale && (!regularPrice || regularPrice <= price)) {
    regularPrice = Math.round((price > 0 ? price : 2450) * 1.25);
  }
  
  // Extract & sanitize images
  const images =
    item.images && item.images.length > 0
      ? item.images.map((img: any) => getSafeImageUrl(img.src))
      : [getSafeImageUrl(item.image?.src)];

  // Extract Category
  let categoryName: any = 'Collection';
  let categoryId: number | undefined = undefined;

  if (item.categories && Array.isArray(item.categories) && item.categories.length > 0) {
    categoryName = item.categories[0].name;
    categoryId = item.categories[0].id;
  }

  // Extract Sizes and Colors from attributes if available
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
    categoryId: categoryId,
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

// Fetch all products from live WooCommerce REST API
export async function getLiveProducts(params: Record<string, any> = {}): Promise<Product[]> {
  try {
    const response = await WooCommerceClient.get('products', {
      per_page: 20,
      status: 'publish',
      ...params,
    });

    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      return response.data.map(mapWooProductToProduct);
    }
  } catch (error) {
    console.warn('[WooCommerce API] Failed to fetch live products.', error);
  }
  return [];
}

// Fetch strict same-category related products
export async function getLiveRelatedProducts(categoryId: number, excludeId: number | string): Promise<Product[]> {
  try {
    const response = await WooCommerceClient.get('products', {
      category: categoryId,
      exclude: [Number(excludeId)],
      per_page: 4,
      status: 'publish',
    });

    if (response.data && Array.isArray(response.data)) {
      return response.data.map(mapWooProductToProduct);
    }
  } catch (error) {
    console.warn('[WooCommerce API] Failed to fetch related products by category ID.', error);
  }
  return [];
}

// Fetch single product by slug from live WooCommerce REST API
export async function getLiveProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const response = await WooCommerceClient.get('products', {
      slug: slug,
    });

    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      return mapWooProductToProduct(response.data[0]);
    }
  } catch (error) {
    console.warn(`[WooCommerce API] Failed to fetch product for slug "${slug}".`, error);
  }
  return undefined;
}

// Fetch live variations for a variable product
export async function getLiveProductVariations(productId: number): Promise<WooVariation[]> {
  try {
    const response = await WooCommerceClient.get(`products/${productId}/variations`, {
      per_page: 50,
    });

    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      return response.data.map((v: any) => {
        const sizeAttr = v.attributes?.find((a: any) =>
          a.name.toLowerCase().includes('size')
        );
        const colorAttr = v.attributes?.find((a: any) =>
          a.name.toLowerCase().includes('color')
        );
        return {
          id: v.id,
          size: sizeAttr ? sizeAttr.option : '',
          color: colorAttr ? colorAttr.option : '',
          price: Number(v.price || v.regular_price || 0),
          regularPrice: v.regular_price ? Number(v.regular_price) : undefined,
          inStock: v.stock_status === 'instock' && (v.stock_quantity === null || v.stock_quantity > 0),
          stockQuantity: v.stock_quantity,
        };
      });
    }
  } catch (error) {
    console.warn(`[WooCommerce API] Could not fetch variations for product ID ${productId}.`, error);
  }
  return [];
}

// Fetch full WooCommerce Category objects
export async function getLiveWooCategoryObjects(): Promise<WooCategory[]> {
  try {
    const response = await WooCommerceClient.get('products/categories', {
      hide_empty: true,
      per_page: 50,
    });

    if (response.data && Array.isArray(response.data)) {
      return response.data
        .filter((cat: any) => cat.slug !== 'uncategorized')
        .map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          count: cat.count || 0,
          image: cat.image ? { id: cat.image.id, src: getSafeImageUrl(cat.image.src), alt: cat.image.alt } : null,
        }));
    }
  } catch (error) {
    console.warn('[WooCommerce API] Failed to fetch category objects.', error);
  }
  return [];
}

// Fetch product category names from live WooCommerce REST API
export async function getLiveCategories(): Promise<string[]> {
  const cats = await getLiveWooCategoryObjects();
  return ['All', ...cats.map((c) => c.name)];
}

// Create Order in WooCommerce REST API
export async function createWooCommerceOrder(payload: any) {
  try {
    const response = await WooCommerceClient.post('orders', payload);
    const data = response.data;
    return {
      success: true,
      orderId: data.id,
      orderNumber: data.number,
      total: data.total,
      status: data.status,
      raw: data,
    };
  } catch (error: any) {
    console.error('[WooCommerce API] Order creation error:', error?.response?.data || error.message);
    throw error;
  }
}
