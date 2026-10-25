import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/components/CartContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { MetaPixelPage } from '@/components/MetaPixelTracker';

export const metadata: Metadata = {
  title: 'RIYADEEN | Contemporary Boyswear & Traditional Apparel',
  description: 'Exquisite craftsmanship in contemporary boys apparel and traditional wear. Nationwide 1-Click Cash on Delivery in Bangladesh.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-luxury-black text-neutral-100 min-h-screen flex flex-col selection:bg-amber-400 selection:text-black">
        <MetaPixelPage />
        <CartProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <CartDrawer />
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}
