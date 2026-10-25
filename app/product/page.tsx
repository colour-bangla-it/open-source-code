import { redirect } from 'next/navigation';

export default function ProductQueryPage({ searchParams }: { searchParams?: { id?: string } }) {
  // Backwards compatibility redirect from /product?id=... to /shop
  redirect('/shop');
}
