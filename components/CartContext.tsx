'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/mock-data';
import { event } from '@/lib/meta-pixel';

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size?: string, color?: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  expressCheckoutItem: { product: Product; size: string; color: string } | null;
  setExpressCheckoutItem: (item: { product: Product; size: string; color: string } | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expressCheckoutItem, setExpressCheckoutItem] = useState<{
    product: Product;
    size: string;
    color: string;
  } | null>(null);

  // Load cart from localStorage on client side mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('luxury_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    }
  }, []);

  // Sync cart changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('luxury_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cart]);

  const addToCart = (product: Product, size?: string, color?: string, quantity: number = 1) => {
    const finalSize = size || product.sizes[0] || 'M';
    const finalColor = color || product.colors[0]?.name || 'Obsidian';

    event('AddToCart', {
      content_ids: [String(product.wooCommerceId || product.id)],
      content_name: product.name,
      content_category: product.category,
      content_type: 'product',
      value: Number(product.price) * quantity,
      currency: 'BDT',
      contents: [{ id: String(product.wooCommerceId || product.id), quantity }],
    });

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === finalSize &&
          item.selectedColor === finalColor
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prevCart,
        {
          product,
          selectedSize: finalSize,
          selectedColor: finalColor,
          quantity,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
          )
      )
    );
  };

  const updateQuantity = (
    productId: string,
    size: string,
    color: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedSize === size &&
          item.selectedColor === color
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        isFilterOpen,
        setIsFilterOpen,
        expressCheckoutItem,
        setExpressCheckoutItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
