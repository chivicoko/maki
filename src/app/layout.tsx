import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers';
import { Toaster } from '@/components/ui/sonner';
import { DndProviderWrapper } from '@/components/providers/dnd-provider-wrapper';
import Sidebar from '@/components/layout/sidebar';
import Topbar from '@/components/layout/topbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Maki App',
  description: 'This is my Maki App - Skill-up project.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#eceff1]`}>
        <Providers>
          <DndProviderWrapper>
            <div className="flex">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="p-6 overflow-auto">
                  {children}
                </main>
              </div>
            </div>
          </DndProviderWrapper>
        </Providers>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
