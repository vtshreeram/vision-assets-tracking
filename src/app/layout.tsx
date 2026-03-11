import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'VIZFLEET | Asset Tracking',
  description: 'Track physical assets, devices, and drivers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden">
        <AppProvider>
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 pt-20 md:pt-6 md:p-8 bg-background relative z-0">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
