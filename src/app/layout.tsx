import type {Metadata, Viewport} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Dragonbowl Stock Management',
  description: 'Smart stock management system for Dragon Bowl Cafe & Restaurant',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Dragonbowl Stock',
  },
};

export const viewport: Viewport = {
  themeColor: '#FF6B35',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="https://i.ibb.co.com/0R3MsqSp/Logo-Dragonbowl-removebg-preview.png" />
      </head>
      <body className="font-body antialiased selection:bg-primary selection:text-white">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
