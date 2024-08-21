'use client'; // Add this line

import { CartProvider } from '@/app/backend/CartContext';
import { Germania_One } from 'next/font/google';
import { ToastProvider } from "@/components/ui/use-toast"
import { AuthProvider } from '@/app/auth/AuthContext'

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
        <AuthProvider>
        <ToastProvider>
      <CartProvider>
        {children}
        </CartProvider>
        </ToastProvider>
        </AuthProvider></body>
        
    </html>
  );
}
