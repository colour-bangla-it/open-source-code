import { Product } from './mock-data';

export interface PriceDetails {
  activePrice: number;
  strikethroughPrice: number;
  isDiscounted: boolean;
  discountPercent: number;
  savedAmount: number;
}

export function getProductPriceDetails(product: any): PriceDetails {
  let regular = parseFloat(
    String(product.regularPrice || product.regular_price || '0').replace(/[^0-9.]/g, '')
  );
  let sale = parseFloat(
    String(product.salePrice || product.sale_price || '0').replace(/[^0-9.]/g, '')
  );
  const current = parseFloat(
    String(product.price || '0').replace(/[^0-9.]/g, '')
  );

  const isOnSale = Boolean(product.on_sale || product.onSale);

  // Fallback for WooCommerce Variable Products where parent regular_price is empty string ("")
  if (isOnSale && regular === 0 && current > 0) {
    if (product.variations_data && Array.isArray(product.variations_data) && product.variations_data.length > 0) {
      const maxReg = Math.max(
        ...product.variations_data.map((v: any) =>
          parseFloat(String(v.regular_price || v.regularPrice || '0').replace(/[^0-9.]/g, ''))
        )
      );
      const minSale = Math.min(
        ...product.variations_data.map((v: any) =>
          parseFloat(String(v.sale_price || v.price || '0').replace(/[^0-9.]/g, ''))
        )
      );
      if (maxReg > 0) regular = maxReg;
      if (minSale > 0) sale = minSale;
    } else {
      // Estimated markup estimate if regular_price is empty on parent variable product
      regular = Math.round(current * 1.25);
    }
  }

  const activePrice = sale > 0 ? sale : current > 0 ? current : regular;
  const strikethroughPrice = regular > activePrice ? regular : 0;
  const isDiscounted = strikethroughPrice > activePrice && activePrice > 0;
  const discountPercent = isDiscounted
    ? Math.round(((strikethroughPrice - activePrice) / strikethroughPrice) * 100)
    : 0;
  const savedAmount = isDiscounted ? Math.round(strikethroughPrice - activePrice) : 0;

  return {
    activePrice,
    strikethroughPrice,
    isDiscounted,
    discountPercent,
    savedAmount,
  };
}
