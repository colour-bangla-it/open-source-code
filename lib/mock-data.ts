export interface Color {
  name: string;
  hex: string;
}

export interface WooVariation {
  id: number;
  size: string;
  color?: string;
  price: number;
  regularPrice?: number;
  inStock: boolean;
  stockQuantity?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number; // In BDT
  regularPrice?: number; // Original price for sales
  description: string;
  details: string[];
  category: 'Panjabi' | 'T-Shirts' | 'Casual Shirts' | 'Formal Shirts' | 'Outerwear' | 'Bottoms' | string;
  sizes: string[];
  colors: Color[];
  images: string[];
  featured?: boolean;
  isNew?: boolean;
  inStock: boolean;
  wooCommerceId: number;
  variations?: WooVariation[];
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'RIYADEEN Royal Cotton Panjabi',
    slug: 'riyadeen-royal-cotton-panjabi',
    price: 3450,
    regularPrice: 4200,
    description: 'Luxury Eid & Festive boys Panjabi crafted from 100% fine Egyptian cotton. Minimalist royal cut featuring mandarin collar with subtle tonal embroidery.',
    details: [
      '100% Fine Long-Staple Egyptian Cotton',
      'Mandarin collar with minimalist tonal embroidery',
      'Concealed placket with obsidian mother-of-pearl buttons',
      'Relaxed festive tailored silhouette',
      'Crafted by RIYADEEN Atelier'
    ],
    category: 'Panjabi',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Deep Navy', hex: '#0B192C' }
    ],
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80'
    ],
    featured: true,
    isNew: true,
    inStock: true,
    wooCommerceId: 101,
    variations: [
      { id: 1011, size: 'S', price: 3450, inStock: true },
      { id: 1012, size: 'M', price: 3450, inStock: true },
      { id: 1013, size: 'L', price: 3450, inStock: true },
      { id: 1014, size: 'XL', price: 3450, inStock: true },
      { id: 1015, size: 'XXL', price: 3650, inStock: false }, // Out of stock example
    ]
  },
  {
    id: 'prod-02',
    name: 'RIYADEEN Heavyweight Drop-Shoulder Tee',
    slug: 'riyadeen-heavyweight-drop-shoulder-tee',
    price: 1850,
    regularPrice: 2300,
    description: 'Minimalist street-style boys t-shirt crafted from 300 GSM combed organic cotton. Features boxy drop shoulders and high-density collar.',
    details: [
      '100% Combed Organic Cotton (300 GSM)',
      'Boxy drop-shoulder modern street cut',
      'High 1.25" rib crewneck collar',
      'Preshrunk silicone wash finish'
    ],
    category: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Obsidian Black', hex: '#0A0A0A' },
      { name: 'Chalk White', hex: '#FFFFFF' }
    ],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80'
    ],
    featured: true,
    isNew: true,
    inStock: true,
    wooCommerceId: 102,
    variations: [
      { id: 1021, size: 'S', price: 1850, inStock: true },
      { id: 1022, size: 'M', price: 1850, inStock: true },
      { id: 1023, size: 'L', price: 1850, inStock: true },
      { id: 1024, size: 'XL', price: 1850, inStock: true },
      { id: 1025, size: 'XXL', price: 1950, inStock: true },
    ]
  },
  {
    id: 'prod-03',
    name: 'RIYADEEN Cuban Collar Textured Casual Shirt',
    slug: 'riyadeen-cuban-collar-textured-casual-shirt',
    price: 2650,
    regularPrice: 3200,
    description: 'Contemporary relaxed-fit boys casual shirt with open Cuban collar, textured linen-cotton weave, and matte buttons.',
    details: [
      '55% Linen, 45% Organic Cotton',
      'Structured Cuban open camp collar',
      'Breathable textured weave',
      'Tailored relaxed boxy cut'
    ],
    category: 'Casual Shirts',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Sand Beige', hex: '#D7C4B7' },
      { name: 'Pure Onyx', hex: '#000000' }
    ],
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=1000&q=80'
    ],
    featured: true,
    isNew: false,
    inStock: true,
    wooCommerceId: 103
  },
  {
    id: 'prod-04',
    name: 'RIYADEEN Crisp Cotton Oxford Formal Shirt',
    slug: 'riyadeen-crisp-cotton-oxford-formal-shirt',
    price: 2950,
    regularPrice: 3600,
    description: 'Crisp tailored formal Oxford shirt for boys. Button-down collar, single chest pocket, and smooth luxury cotton finish.',
    details: [
      '100% Premium Oxford Cotton',
      'Classic button-down collar',
      'Single chest pocket with subtle branding',
      'Pre-shrunk easy-iron finish'
    ],
    category: 'Formal Shirts',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Crisp White', hex: '#FFFFFF' },
      { name: 'Sky Blue', hex: '#A5C9CA' }
    ],
    images: [
      'https://images.unsplash.com/photo-1620012253295-c15c429fbb41?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80'
    ],
    featured: true,
    isNew: true,
    inStock: true,
    wooCommerceId: 104
  }
];

export function getAllProducts(): Product[] {
  return MOCK_PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.featured);
}

export function getProductsByCategory(category: string): Product[] {
  if (!category || category === 'All') return MOCK_PRODUCTS;
  return MOCK_PRODUCTS.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()));
}
