'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, ShieldCheck, MapPin, Phone, User, CheckCircle, AlertCircle, Loader2, Package } from 'lucide-react';
import { Product } from '@/lib/mock-data';
import { useCart } from '@/components/CartContext';
import { event, sendMetaCAPIEvent } from '@/lib/meta-pixel';
import { getSafeImageUrl } from '@/lib/woocommerce';

interface CODFormProps {
  product?: Product;
  selectedSize?: string;
  selectedColor?: string;
  cartItems?: Array<{
    product: Product;
    selectedSize: string;
    selectedColor: string;
    quantity: number;
  }>;
  onRequireSizeSelection?: () => void;
  onSuccess?: () => void;
}

const WC_STORE_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://test.premiumcollectionbd.com';
const WC_KEY = process.env.WC_CONSUMER_KEY || 'ck_dd0b0242fa96c7c3116e7492016e497b65a031a7';
const WC_SECRET = process.env.WC_CONSUMER_SECRET || 'cs_3c4df217d5f840f325c7902a3dcd0ae74fb460e7';

export function CODForm({
  product,
  selectedSize = '',
  selectedColor = 'Standard',
  cartItems,
  onRequireSizeSelection,
  onSuccess,
}: CODFormProps) {
  const router = useRouter();
  const { clearCart } = useCart();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryOption, setDeliveryOption] = useState<'dhaka' | 'outside'>('dhaka');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasInitiatedCheckout, setHasInitiatedCheckout] = useState(false);

  const deliveryCharge = deliveryOption === 'dhaka' ? 70 : 130;

  let subtotal = 0;
  if (cartItems && cartItems.length > 0) {
    subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  } else if (product) {
    subtotal = product.price;
  }

  const grandTotal = subtotal + deliveryCharge;

  const handlePhoneFocusOrChange = () => {
    if (!hasInitiatedCheckout) {
      setHasInitiatedCheckout(true);
      const contentIds = cartItems && cartItems.length > 0
        ? cartItems.map((item) => String(item.product.wooCommerceId || item.product.id))
        : product
        ? [String(product.wooCommerceId || product.id)]
        : [];

      event('InitiateCheckout', {
        content_ids: contentIds,
        content_type: 'product',
        value: grandTotal,
        currency: 'BDT',
        num_items: cartItems ? cartItems.reduce((acc, i) => acc + i.quantity, 1) : 1,
      });
    }
  };

  const validatePhone = (num: string) => {
    const cleanNum = num.trim();
    const phoneRegex = /^01[3-9]\d{8}$/;
    return phoneRegex.test(cleanNum);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Single source of truth validation for Size selection
    if (!cartItems && product && (!selectedSize || selectedSize === '')) {
      if (onRequireSizeSelection) {
        onRequireSizeSelection();
      }
      setErrorMessage('অনুগ্রহ করে একটি সাইজ নির্বাচন করুন (Please select a size above).');
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('আপনার নাম লিখুন (Please enter your full name).');
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('আপনার মোবাইল নম্বর লিখুন (Please enter your phone number).');
      return;
    }

    if (!validatePhone(phone)) {
      setErrorMessage('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (e.g. 01712345678).');
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      setErrorMessage('আপনার সম্পূর্ণ ডেলিভারি ঠিকানা দিন (House, Road, Area).');
      return;
    }

    setIsLoading(true);

    try {
      // Build WooCommerce Order Items Payload
      let lineItemsPayload: any[] = [];
      if (cartItems && cartItems.length > 0) {
        lineItemsPayload = cartItems.map((item) => ({
          product_id: Number(item.product.wooCommerceId || item.product.id),
          quantity: item.quantity,
          meta_data: [
            { key: 'Size', value: item.selectedSize },
            { key: 'Color', value: item.selectedColor },
          ],
        }));
      } else if (product) {
        lineItemsPayload = [
          {
            product_id: Number(product.wooCommerceId || product.id),
            quantity: 1,
            meta_data: [
              { key: 'Size', value: selectedSize },
              { key: 'Color', value: selectedColor },
            ],
          },
        ];
      }

      const orderPayload = {
        payment_method: 'cod',
        payment_method_title: 'Cash on Delivery',
        set_paid: false,
        billing: {
          first_name: fullName.trim(),
          last_name: '',
          address_1: address.trim(),
          city: deliveryOption === 'dhaka' ? 'Dhaka' : 'Outside Dhaka',
          state: 'BD',
          postcode: '1216',
          country: 'BD',
          email: 'customer@riyadeen.com.bd',
          phone: phone.trim(),
        },
        shipping: {
          first_name: fullName.trim(),
          last_name: '',
          address_1: address.trim(),
          city: deliveryOption === 'dhaka' ? 'Dhaka' : 'Outside Dhaka',
          state: 'BD',
          postcode: '1216',
          country: 'BD',
        },
        line_items: lineItemsPayload,
        shipping_lines: [
          {
            method_id: deliveryOption === 'dhaka' ? 'flat_rate_dhaka' : 'flat_rate_outside',
            method_title: deliveryOption === 'dhaka' ? 'Inside Dhaka Delivery' : 'Outside Dhaka Delivery',
            total: String(deliveryCharge),
          },
        ],
      };

      // Direct POST call to WooCommerce REST API
      const authHeader = 'Basic ' + btoa(`${WC_KEY}:${WC_SECRET}`);
      const res = await fetch(`${WC_STORE_URL}/wp-json/wc/v3/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'অর্ডার প্রক্রিয়া করতে সমস্যা হয়েছে।');
      }

      const createdOrder = await res.json();
      const finalOrderId = createdOrder.id;

      // Meta Pixel Purchase Event
      const contentIds = cartItems && cartItems.length > 0
        ? cartItems.map((item) => String(item.product.wooCommerceId || item.product.id))
        : product
        ? [String(product.wooCommerceId || product.id)]
        : [];

      const totalQuantity = cartItems && cartItems.length > 0
        ? cartItems.reduce((acc, item) => acc + item.quantity, 0)
        : 1;

      event('Purchase', {
        content_ids: contentIds,
        content_type: 'product',
        value: grandTotal,
        currency: 'BDT',
        num_items: totalQuantity,
        order_id: String(finalOrderId),
      });

      // Trigger server-side Meta Conversions API (CAPI) concurrently
      sendMetaCAPIEvent({
        eventName: 'Purchase',
        eventId: String(finalOrderId),
        userData: {
          fullName: fullName.trim(),
          phone: phone.trim(),
        },
        customData: {
          value: grandTotal,
          currency: 'BDT',
          content_ids: contentIds,
          content_type: 'product',
          num_items: totalQuantity,
        },
      });

      // Clear Cart immediately from memory and localStorage upon successful order creation
      clearCart();

      // Reset form inputs
      setFullName('');
      setPhone('');
      setAddress('');

      if (onSuccess) onSuccess();

      // Redirect directly to static order-success page
      const successRoute = `/order-success/?id=${finalOrderId}`;
      if (typeof window !== 'undefined') {
        window.location.href = successRoute;
      } else {
        router.push(successRoute);
      }
    } catch (err: any) {
      console.error('COD Direct Submission Error:', err);
      setErrorMessage(err.message || 'অর্ডার করতে সমস্যা হয়েছে। দয়া করে আপনার কানেকশন চেক করুন।');
      setIsLoading(false);
    }
  };

  return (
    <div id="cod-form" className="bg-neutral-950 border border-amber-500/30 rounded-sm p-5 sm:p-6 shadow-2xl relative space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-400 text-black font-bold rounded-none">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider font-luxury-heading">
              ক্যাশ অন ডেলিভারি ফর্ম (Direct 1-Click COD)
            </h3>
            <p className="text-xs text-neutral-400 font-light">
              পণ্য হাতে পেয়ে ডেলিভারি ম্যানকে ক্যাশ টাকা দিন।
            </p>
          </div>
        </div>
      </div>

      {/* ORDER SUMMARY PREVIEW CARD (Rendered directly ABOVE customer info fields) */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-sm p-4 space-y-3 shadow-inner">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
          <span className="text-xs uppercase tracking-wider text-amber-400 font-mono font-bold flex items-center gap-1.5">
            <Package className="w-4 h-4" />
            <span>ORDER ITEM PREVIEW</span>
          </span>
          <span className="text-[10px] bg-neutral-800 text-neutral-300 font-mono px-2 py-0.5 border border-neutral-700">
            COD ITEM
          </span>
        </div>

        {cartItems && cartItems.length > 0 ? (
          <div className="space-y-2">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 py-1">
                <div className="relative w-12 h-14 bg-neutral-950 border border-neutral-800 rounded-sm overflow-hidden flex-shrink-0">
                  <img
                    src={getSafeImageUrl(item.product.images[0])}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                </div>
                <div className="flex-grow text-xs">
                  <span className="text-white font-bold block line-clamp-1">{item.product.name}</span>
                  <div className="text-[11px] text-neutral-400 space-x-2">
                    <span>সাইজ: <strong className="text-amber-400 font-extrabold font-mono text-xs">{item.selectedSize}</strong></span>
                    <span>Qty: <strong className="text-white font-mono">{item.quantity}</strong></span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-white">৳ {(item.product.price * item.quantity).toLocaleString('en-BD')}</span>
              </div>
            ))}
          </div>
        ) : product ? (
          <div className="flex items-center gap-3.5 py-1">
            <div className="relative w-14 h-16 bg-neutral-950 border border-neutral-800 rounded-sm overflow-hidden flex-shrink-0">
              <img
                src={getSafeImageUrl(product.images[0])}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800';
                }}
              />
            </div>

            <div className="flex-grow text-xs space-y-1">
              <span className="text-white font-bold block leading-snug">{product.name}</span>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-300">
                <span>
                  সাইজ: <strong className="text-amber-400 font-extrabold font-mono text-xs">{selectedSize || 'নির্ধারিত হয়নি'}</strong>
                </span>
                <span>
                  মূল্য: <strong className="text-white font-mono">৳ {product.price.toLocaleString('en-BD')}</strong>
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {errorMessage && (
        <div className="p-3.5 bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2.5 rounded-sm">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* CUSTOMER INFO INPUT FIELDS */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>আপনার নাম (Full Name) *</span>
          </label>
          <input
            type="text"
            required
            disabled={isLoading}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="উদাহরণ: আব্দুল্লাহ আল মামুন"
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 focus:border-amber-400 text-white rounded-sm text-sm focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>মোবাইল নম্বর (Phone Number) *</span>
          </label>
          <input
            type="tel"
            required
            disabled={isLoading}
            value={phone}
            onFocus={handlePhoneFocusOrChange}
            onChange={(e) => {
              setPhone(e.target.value);
              handlePhoneFocusOrChange();
            }}
            placeholder="01712345678"
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 focus:border-amber-400 text-white rounded-sm text-sm font-mono focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>ডেলিভারি ঠিকানা (Detailed Delivery Address) *</span>
          </label>
          <textarea
            required
            rows={2}
            disabled={isLoading}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="বাসা নং, রোড নং, এলাকা, থানা ও জেলার নাম লিখুন"
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 focus:border-amber-400 text-white rounded-sm text-sm focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* DELIVERY LOCATION SELECTOR */}
        <div className="space-y-2 pt-1">
          <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-1">
            ডেলিভারি এলাকা নির্বাচন করুন *
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDeliveryOption('dhaka')}
              className={`p-3 border text-left rounded-sm transition-all ${
                deliveryOption === 'dhaka'
                  ? 'border-amber-400 bg-amber-400/10 text-white font-bold'
                  : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <span className="block text-xs uppercase font-mono">ঢাকার ভেতরে</span>
              <span className="text-amber-400 font-mono text-sm font-bold">৳ ৭০ (২৪ ঘণ্টা)</span>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryOption('outside')}
              className={`p-3 border text-left rounded-sm transition-all ${
                deliveryOption === 'outside'
                  ? 'border-amber-400 bg-amber-400/10 text-white font-bold'
                  : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <span className="block text-xs uppercase font-mono">ঢাকার বাইরে</span>
              <span className="text-amber-400 font-mono text-sm font-bold">৳ ১৩০ (২-৩ দিন)</span>
            </button>
          </div>
        </div>

        {/* PRICE BREAKDOWN TOTAL */}
        <div className="pt-3 border-t border-neutral-800 space-y-1.5 font-mono text-xs">
          <div className="flex justify-between text-neutral-400">
            <span>পণ্য সাবটোটাল:</span>
            <span>৳ {subtotal.toLocaleString('en-BD')}</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>ডেলিভারি চার্জ:</span>
            <span>৳ {deliveryCharge}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-neutral-800">
            <span>সর্বমোট প্রদেয় (Grand Total):</span>
            <span className="text-amber-400 font-mono text-lg">৳ {grandTotal.toLocaleString('en-BD')}</span>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-luxury-primary py-4 text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 shadow-2xl disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-black" />
              <span>অর্ডার প্রসেস হচ্ছে...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 text-black" />
              <span>অর্ডার নিশ্চিত করুন (CONFIRM COD ORDER)</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-neutral-500 text-[11px] pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>১০০% ক্যাশ অন ডেলিভারি সেফটি গ্যারান্টি</span>
        </div>
      </form>
    </div>
  );
}
