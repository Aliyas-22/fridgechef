import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FridgeChef — AI Recipe Generator',
  description: 'Turn your fridge ingredients into delicious meals with AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(20, 20, 30, 0.9)',
                color: '#f0f0ff',
                border: '1px solid rgba(167, 139, 250, 0.3)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
