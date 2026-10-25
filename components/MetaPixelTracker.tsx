'use client';

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { META_PIXEL_ID } from '@/lib/meta-pixel';

type ReactPixelClient = {
  init: (
    pixelId: string,
    advancedMatching?: unknown,
    options?: { autoConfig: boolean; debug: boolean }
  ) => void;
  pageView: () => void;
};

function MetaPixelTrackerPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialized = useRef(false);
  const lastTrackedRoute = useRef<string | null>(null);
  const pixel = useRef<ReactPixelClient | null>(null);
  const route = searchParams.size > 0 ? `${pathname}?${searchParams.toString()}` : pathname;
  const currentRoute = useRef(route);
  currentRoute.current = route;

  useEffect(() => {
    if (!META_PIXEL_ID || META_PIXEL_ID === 'YOUR_PIXEL_ID') return;

    let cancelled = false;

    void import('react-facebook-pixel').then((module) => {
      if (cancelled) return;

      // The package provides CommonJS runtime exports but incomplete TypeScript declarations.
      const ReactPixel = (module as unknown as { default: ReactPixelClient }).default;

      ReactPixel.init(META_PIXEL_ID, undefined, {
        autoConfig: true,
        debug: process.env.NODE_ENV === 'development',
      });
      pixel.current = ReactPixel;
      initialized.current = true;
      ReactPixel.pageView();
      lastTrackedRoute.current = currentRoute.current;
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!initialized.current || !pixel.current || lastTrackedRoute.current === route) return;

    pixel.current.pageView();
    lastTrackedRoute.current = route;
  }, [route]);

  return null;
}

export function MetaPixelPage() {
  if (!META_PIXEL_ID || META_PIXEL_ID === 'YOUR_PIXEL_ID') return null;

  return (
    <Suspense fallback={null}>
      <MetaPixelTrackerPage />
    </Suspense>
  );
}
