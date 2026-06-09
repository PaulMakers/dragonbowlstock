"use client"

import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  History, 
  Settings, 
  LogOut,
  Menu,
  FileEdit,
  ClipboardCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import Link from 'next/link';
import { LOGO_URL } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Prepare Barang', icon: FileEdit, href: '/prepare-barang' },
  { label: 'Cek Stok Barang', icon: ClipboardCheck, href: '/cek-stok' },
  { label: 'Master Barang', icon: Package, href: '/master-barang' },
  { label: 'Pengaturan', icon: Settings, href: '/pengaturan' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <img src={LOGO_URL} alt="Loading" className="h-20 w-auto mb-4" />
          <div className="h-1 w-32 bg-primary rounded-full" />
        </div>
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-4">
      <div className="px-6 mb-8 flex items-center gap-3">
        <img src={LOGO_URL} alt="Logo" className="h-10 w-auto" />
        <span className="font-headline font-bold text-xl tracking-tight text-primary">Dragonbowl</span>
      </div>
      
      <div className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className={cn(
                  "w-full justify-start gap-3 h-12 text-base rounded-xl transition-all",
                  isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-primary/10 hover:text-primary"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </div>

      <div className="px-4 pt-4">
        <Separator className="mb-4 bg-border/40" />
        <div className="px-4 py-3 mb-4 rounded-xl bg-card border flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user.nama.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="font-semibold truncate text-sm">{user.nama}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3 h-11 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          Keluar
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 hidden h-full w-72 border-r bg-card/50 backdrop-blur-xl lg:block z-40">
        <SidebarContent />
      </aside>

      <div className="lg:pl-72 flex flex-col h-screen">
        <header className="sticky top-0 h-16 border-b bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8 z-30">
          <div className="flex items-center gap-4 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 border-r bg-card">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menu Navigasi</SheetTitle>
                  <SheetDescription>Akses navigasi utama Dragonbowl Stock Management</SheetDescription>
                </SheetHeader>
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <img src={LOGO_URL} alt="Logo" className="h-8 w-auto" />
          </div>
          
          <div className="hidden lg:block">
            <h2 className="font-headline font-semibold text-lg">
              {navItems.find(n => n.href === pathname)?.label || 'Aplikasi'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-muted-foreground">Selamat Datang,</span>
              <span className="text-sm font-semibold">{user.nama}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-20 lg:pb-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}