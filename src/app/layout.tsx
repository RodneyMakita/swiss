// app/layout.tsx
import Navbar from '@/components/component/Navbar';
import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'swisspants',
  description: '',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        
        {children}
      
      </body>
    </html>
  );
}
