'use client'; // Add this line

import { CartProvider } from '@/app/backend/CartContext';
import { Germania_One } from 'next/font/google';

const germaniaOne = Germania_One({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={germaniaOne.className}>
      <body>
      <CartProvider>
        {children}
        </CartProvider></body>
    </html>
  );
}
