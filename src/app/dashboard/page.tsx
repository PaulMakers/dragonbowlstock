
"use client"

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  AlertCircle, 
  ShoppingCart, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Package,
  Plus
} from 'lucide-react';
import { callBackend } from '@/lib/api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const statsRes = await callBackend('getStatistik', { hari: 7 });
        setStats(statsRes);
        
        const today = new Intl.DateTimeFormat('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }).format(new Date());

        const recentRes = await callBackend('getBarangHabis', { tanggal: today });
        setRecentItems(recentRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statCards = [
    { label: 'Barang Habis', value: stats?.stats?.Habis || 0, icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
    { label: 'Sedang Dibeli', value: stats?.stats?.['Sedang Dibeli'] || 0, icon: ShoppingCart, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Sudah Tersedia', value: stats?.stats?.['Sudah Tersedia'] || 0, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Belum Dicek', value: stats?.stats?.['Belum Dicek'] || 0, icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted/10' },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Ringkasan Hari Ini</h1>
          <p className="text-muted-foreground">Status ketersediaan barang di seluruh outlet.</p>
        </div>
        <Link href="/barang-habis">
          <Button className="h-12 px-6 rounded-xl primary-gradient font-semibold">
            <Plus className="mr-2 h-5 w-5" /> Lapor Barang Habis
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))
        ) : (
          statCards.map((card, index) => (
            <Card key={index} className="border-none bg-card card-shadow overflow-hidden rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{card.label}</p>
                    <h3 className="text-3xl font-bold tracking-tight">{card.value}</h3>
                  </div>
                  <div className={cn("p-3 rounded-xl", card.bg)}>
                    <card.icon className={cn("h-6 w-6", card.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none bg-card card-shadow rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Aktivitas Terbaru</CardTitle>
              <CardDescription>Laporan barang habis hari ini.</CardDescription>
            </div>
            <Link href="/riwayat">
              <Button variant="ghost" className="text-primary hover:bg-primary/10">Lihat Semua</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
              </div>
            ) : recentItems.length > 0 ? (
              <div className="space-y-4">
                {recentItems.slice(0, 6).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border bg-background/50">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{item.namaBarang}</p>
                        <p className="text-xs text-muted-foreground">{item.timestamp} • {item.inputOleh}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{item.jumlah} {item.satuan}</p>
                      <Badge variant={item.status === 'Habis' ? 'destructive' : item.status === 'Sudah Tersedia' ? 'secondary' : 'default'} className="mt-1 text-[10px] uppercase">
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Belum ada laporan hari ini.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none bg-primary text-primary-foreground card-shadow rounded-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <TrendingUp className="h-32 w-32 rotate-12" />
            </div>
            <CardHeader>
              <CardTitle className="text-white">Paling Sering Habis</CardTitle>
              <CardDescription className="text-white/80">Analisis 7 hari terakhir.</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              {loading ? (
                <div className="space-y-3">
                  {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-10 bg-white/20 rounded-lg" />)}
                </div>
              ) : stats?.topBarangHabis?.length > 0 ? (
                <div className="space-y-3">
                  {stats.topBarangHabis.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-white/10 p-3 rounded-xl border border-white/10">
                      <span className="font-medium text-sm">{item.namaBarang}</span>
                      <span className="font-bold">{item.jumlah}x</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm opacity-80">Data statistik belum tersedia.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-none bg-card card-shadow rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle>Alur Kerja</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-none h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">1</div>
                <div>
                  <p className="text-sm font-semibold">Closing Outlet</p>
                  <p className="text-xs text-muted-foreground">Pegawai input barang yang sudah habis/menipis.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-none h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">2</div>
                <div>
                  <p className="text-sm font-semibold">Prepare Barang</p>
                  <p className="text-xs text-muted-foreground">Supervisor cek daftar dan lakukan pembelian.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-none h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">3</div>
                <div>
                  <p className="text-sm font-semibold">Restock Selesai</p>
                  <p className="text-xs text-muted-foreground">Ubah status barang jadi "Sudah Tersedia" setelah barang datang.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
