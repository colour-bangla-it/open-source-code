export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || 'YOUR_PIXEL_ID';

export const META_CAPI_ACCESS_TOKEN =
  process.env.META_CAPI_ACCESS_TOKEN || '';

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

// Client-Side Pixel Helper Functions
export const pageview = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

export const event = (name: string, options: Record<string, any> = {}, extra: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    if (Object.keys(extra).length > 0) {
      window.fbq('track', name, options, extra);
    } else {
      window.fbq('track', name, options);
    }
  }
};

// SHA-256 Hashing helper for CAPI User Data Quality Score (Phone & Name)
export async function sha256(message: string): Promise<string> {
  const cleanMsg = message.trim().toLowerCase();
  if (!cleanMsg) return '';
  
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const msgUint8 = new TextEncoder().encode(cleanMsg);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Node.js environment fallback
  try {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(cleanMsg).digest('hex');
  } catch (e) {
    return cleanMsg;
  }
}

// Meta Conversions API (CAPI) Server-Side Event Dispatcher
export async function sendMetaCAPIEvent(payload: {
  eventName: string;
  eventId: string;
  sourceUrl?: string;
  userData: {
    fullName?: string;
    phone?: string;
  };
  customData: {
    value: number;
    currency: string;
    content_ids: string[];
    content_type: string;
    num_items?: number;
  };
}) {
  try {
    const pixelId = META_PIXEL_ID;
    const accessToken = META_CAPI_ACCESS_TOKEN;

    if (!accessToken || pixelId === 'YOUR_PIXEL_ID') {
      console.log('[Meta CAPI] Event logged (add META_CAPI_ACCESS_TOKEN in .env for live Meta CAPI):', {
        event_name: payload.eventName,
        event_id: payload.eventId,
        custom_data: payload.customData,
      });
      return { success: true, simulated: true };
    }

    const hashedPhone = payload.userData.phone ? await sha256(payload.userData.phone) : '';
    const hashedName = payload.userData.fullName ? await sha256(payload.userData.fullName) : '';

    const capiData = {
      data: [
        {
          event_name: payload.eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: payload.eventId,
          event_source_url: payload.sourceUrl || (typeof window !== 'undefined' ? window.location.href : 'https://riyadeen.com.bd'),
          action_source: 'website',
          user_data: {
            ph: hashedPhone ? [hashedPhone] : undefined,
            fn: hashedName ? [hashedName] : undefined,
            client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Mozilla/5.0',
          },
          custom_data: payload.customData,
        },
      ],
    };

    const capiUrl = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;
    const res = await fetch(capiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(capiData),
    });

    const result = await res.json();
    console.log('[Meta CAPI Result]:', result);
    return result;
  } catch (error) {
    console.warn('[Meta CAPI Error]:', error);
    return { success: false, error };
  }
}
