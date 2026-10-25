'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, Zap, ShieldCheck, ArrowRight, ShoppingCart } from 'lucide-react';
import { useCart } from './CartContext';
import { CODForm } from './CODForm';

export function CartDrawer() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems,
    isCartOpen,
    setIsCartOpen,
    expressCheckoutItem,
    setExpressCheckoutItem,
  } = useCart();

  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  if (!isCartOpen && !expressCheckoutItem) return null;

  const formatPrice = (amount: number) => `৳ ${amount.toLocaleString('en-BD')}`;

  const isExpressSingle = !!expressCheckoutItem;

  const handleClose = () => {
    setIsCartOpen(false);
    setExpressCheckoutItem(null);
    setShowCheckoutForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-neutral-950 border-l border-neutral-900 shadow-2xl flex flex-col justify-between animate-slide-left">
          {/* Header */}
          <div className="p-6 border-b border-neutral-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="font-luxury-heading text-base font-bold uppercase tracking-widest text-white">
                {isExpressSingle ? '1-Click Express Order' : `আপনার শপিং ব্যাগ (${totalItems})`}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-neutral-400 hover:text-white transition-colors"
              aria-label="Close Bag"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* Direct Express Item Checkout View */}
            {isExpressSingle ? (
              <div className="space-y-6">
                <div className="flex gap-4 p-4 bg-neutral-900/60 border border-neutral-800 rounded-sm">
                  <div className="relative w-20 h-24 bg-neutral-900 flex-shrink-0 rounded-sm overflow-hidden">
                    <img
                      src={expressCheckoutItem.product.images[0]}
                      alt={expressCheckoutItem.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-white">
                        {expressCheckoutItem.product.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400 mt-1 font-mono">
                        সাইজ: <span className="text-amber-400 font-bold">{expressCheckoutItem.size}</span> | কালার:{' '}
                        <span className="text-white font-bold">{expressCheckoutItem.color}</span>
                      </p>
                    </div>
                    <div className="text-sm font-bold font-mono text-amber-400">
                      {formatPrice(expressCheckoutItem.product.price)}
                    </div>
                  </div>
                </div>

                <CODForm
                  product={expressCheckoutItem.product}
                  selectedSize={expressCheckoutItem.size}
                  selectedColor={expressCheckoutItem.color}
                  onSuccess={handleClose}
                />
              </div>
            ) : showCheckoutForm ? (
              /* Full Cart COD Form View */
              <div className="space-y-4">
                <button
                  onClick={() => setShowCheckoutForm(false)}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1 uppercase tracking-widest font-semibold mb-2"
                >
                  ← ব্যাগে ফিরে যান (Back to Bag)
                </button>
                <CODForm cartItems={cart} onSuccess={handleClose} />
              </div>
            ) : cart.length === 0 ? (
              /* Empty Cart State */
              <div className="text-center py-20 space-y-4">
                <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center mx-auto text-neutral-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-luxury-heading font-bold text-white uppercase tracking-wider">
                  আপনার ব্যাগ বর্তমানে খালি রয়েছে
                </h3>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto font-light">
                  আমাদের নতুন পাঞ্জাবি ও ছেলেদের পোশাকের কালেকশন ব্রাউজ করতে নিচের বাটনে ক্লিক করুন।
                </p>
                <button
                  onClick={handleClose}
                  className="inline-flex btn-luxury-primary text-xs mt-4 px-6 py-3"
                >
                  আরও শপিং করুন
                </button>
              </div>
            ) : (
              /* Cart Item List with Quantity Counter & Remove Icon */
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
                    className="flex gap-4 p-3.5 bg-neutral-900/40 border border-neutral-900 rounded-sm hover:border-neutral-800 transition-colors"
                  >
                    <div className="relative w-20 h-24 bg-neutral-900 flex-shrink-0 rounded-sm overflow-hidden border border-neutral-800">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-semibold text-white line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() =>
                              removeFromCart(
                                item.product.id,
                                item.selectedSize,
                                item.selectedColor
                              )
                            }
                            title="Remove item"
                            className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-1 font-mono space-x-2">
                          <span>
                            সাইজ: <strong className="text-amber-400 font-bold">{item.selectedSize}</strong>
                          </span>
                          <span>
                            একক মূল্য: <strong className="text-white">{formatPrice(item.product.price)}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-neutral-900/60">
                        {/* Interactive Quantity Counter [+] and [-] */}
                        <div className="flex items-center border border-neutral-800 bg-black rounded-sm overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedSize,
                                item.selectedColor,
                                item.quantity - 1
                              )
                            }
                            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-mono text-white font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedSize,
                                item.selectedColor,
                                item.quantity + 1
                              )
                            }
                            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Item Line Subtotal */}
                        <div className="text-right">
                          <span className="text-xs text-neutral-500 uppercase text-[9px] block">Subtotal</span>
                          <span className="text-xs font-extrabold font-mono text-white">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer Summary & Action Buttons */}
          {!isExpressSingle && !showCheckoutForm && cart.length > 0 && (
            <div className="p-6 border-t border-neutral-900 bg-neutral-950 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>পণ্যের মোট মূল্য (Subtotal):</span>
                  <span className="font-mono text-white font-bold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>ডেলিভারি চার্জ (Delivery Fee):</span>
                  <span className="text-amber-400 font-mono">৳ ৭০ (ঢাকা) / ৳ ১৩০ (ঢাকার বাইরে)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-900 flex justify-between font-bold text-sm text-white">
                <span className="uppercase">সর্বমোট বিল (Total):</span>
                <span className="font-mono text-amber-400 text-base font-extrabold">{formatPrice(subtotal)}</span>
              </div>

              {/* Action Buttons at Bottom of Bag */}
              <div className="space-y-2.5 pt-1">
                {/* Primary Button: "অর্ডার সম্পন্ন করুন" */}
                <button
                  onClick={() => setShowCheckoutForm(true)}
                  className="w-full btn-luxury-primary py-4 text-xs font-extrabold tracking-wider flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current text-black" />
                  <span>অর্ডার সম্পন্ন করুন (Proceed to Checkout)</span>
                </button>

                {/* Secondary Button: "আরও শপিং করুন" */}
                <button
                  onClick={handleClose}
                  className="w-full btn-luxury-outline py-3 text-xs font-bold tracking-wider flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4 text-amber-400" />
                  <span>আরও শপিং করুন (Continue Shopping)</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 uppercase tracking-widest pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                <span>ক্যাশ অন ডেলিভারি সাপোর্ট • দেখে পেমেন্ট করুন</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
