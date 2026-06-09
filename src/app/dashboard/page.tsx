"use client"

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  ClipboardCheck, 
  History,
  Activity
} from 'lucide-react';
import { callBackend } from '@/lib/api';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const today = format(new Date(), 'dd MMMM yyyy', { locale: localeId });
        const res = await callBackend('getDashboardStats', { today });
        setStats(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total SKU', value: stats?.totalSku || 0, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Prepare Hari Ini', value: stats?.prepareToday || 0, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Barang Perlu Stok', value: stats?.needStock || 0, icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
    { label: 'Barang Selisih', value: stats?.selisihCount || 0, icon: Activity, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-headline font-bold">Ringkasan Operasional</h1>
        <p className="text-muted-foreground">{format(new Date(), 'EEEE, dd MMMM yyyy', { locale: localeId })}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
        ) : (
          statCards.map((card, index) => (
            <Card key={index} className="border-none bg-card card-shadow rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{card.label}</p>
                    <h3 className="text-3xl font-bold">{card.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl ${card.bg}`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none bg-card card-shadow rounded-2xl">
          <CardHeader>
            <CardTitle>Alur Kerja Harian</CardTitle>
            <CardDescription>Panduan langkah-langkah kontrol stok.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-none">1</div>
              <div>
                <p className="font-bold">Input Prepare</p>
                <p className="text-sm text-muted-foreground">Catat jumlah barang yang disiapkan atau dibeli hari ini di menu Prepare Barang.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-none">2</div>
              <div>
                <p className="font-bold">Closing & Cek Stok</p>
                <p className="text-sm text-muted-foreground">Di akhir shift, input jumlah terjual dan stok fisik yang ada di outlet.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-none">3</div>
              <div>
                <p className="font-bold">Analisis Selisih</p>
                <p className="text-sm text-muted-foreground">Sistem akan otomatis menghitung jika ada selisih antara stok teoritis dan fisik.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-card card-shadow rounded-2xl overflow-hidden">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Sering Habis
            </CardTitle>
            <CardDescription>30 hari terakhir (Status: Perlu Stock)</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
              </div>
            ) : stats?.topHabis?.length > 0 ? (
              <div className="divide-y">
                {stats.topHabis.map((item: any, i: number) => (
                  <div key={i} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm">{item.nama_barang}</p>
                      <p className="text-xs text-muted-foreground">{item.kategori}</p>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                      {item.frekuensi}x
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                Belum ada data histori.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
