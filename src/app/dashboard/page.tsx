"use client"

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  AlertCircle,
  RefreshCcw,
  Rocket,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { callBackend } from '@/lib/api';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const today = format(new Date(), 'dd MMMM yyyy', { locale: localeId });
      const res = await callBackend('getDashboardStats', { today });
      setStats(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total SKU', value: stats?.totalSku || 0, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Prepare Hari Ini', value: stats?.prepareToday || 0, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Barang Perlu Stok', value: stats?.needStock || 0, icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
    { label: 'Barang Selisih', value: stats?.selisihCount || 0, icon: Activity, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-10">
          <Alert variant="destructive" className="rounded-2xl border-2 shadow-xl bg-destructive/5">
            <AlertCircle className="h-6 w-6" />
            <AlertTitle className="text-xl font-bold mb-2">Backend Belum Siap</AlertTitle>
            <AlertDescription className="space-y-4">
              <p className="text-sm opacity-90 leading-relaxed">
                Terjadi kesalahan pada server Google Apps Script: <br/>
                <code className="bg-destructive/10 px-2 py-1 rounded font-mono text-xs block mt-2">{error}</code>
              </p>
              
              <div className="bg-background/50 p-4 rounded-xl border border-destructive/20 text-xs space-y-2">
                <p className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Langkah Perbaikan:</p>
                <ol className="list-decimal list-inside space-y-1 ml-1">
                  <li>Buka <b>Extensions {'>'} Apps Script</b> di Google Sheets Anda.</li>
                  <li>Hapus <b>SELURUH</b> kode yang ada di sana.</li>
                  <li>Tempelkan kode <b>v3.3 FULL VERSION</b> terbaru dari asisten AI.</li>
                  <li>Klik <b>Deploy {'>'} New Deployment</b>.</li>
                  <li>Pastikan akses diatur ke <b>"Anyone"</b>.</li>
                </ol>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full h-11 rounded-xl border-destructive/30 hover:bg-destructive/10" 
                onClick={fetchData}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Coba Hubungkan Kembali
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold">Ringkasan Operasional</h1>
          <p className="text-muted-foreground">{format(new Date(), 'EEEE, dd MMMM yyyy', { locale: localeId })}</p>
        </div>
        <Link href="/barang-habis">
          <Button className="h-12 px-6 rounded-xl bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-bold gap-2">
            <Sparkles className="h-5 w-5" />
            Lapor Pakai AI
          </Button>
        </Link>
      </div>

      {!loading && stats?.totalSku === 0 && (
        <Alert className="bg-primary/10 border-primary/20 p-6 rounded-2xl animate-in fade-in zoom-in duration-300">
          <Rocket className="h-8 w-8 text-primary mb-4" />
          <AlertTitle className="text-xl font-bold text-primary">Data Barang Masih Kosong</AlertTitle>
          <AlertDescription className="mt-2 space-y-4">
            <p className="text-muted-foreground">Sistem mendeteksi Anda belum memiliki data barang. Mulai dengan memasukkan 130+ template barang Dragon Bowl secara otomatis.</p>
            <Link href="/master-barang">
              <Button className="primary-gradient font-bold h-11 px-6 rounded-xl mt-4">
                Mulai Setup Barang <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}

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
                <p className="font-bold">Lapor Barang (Gunakan AI)</p>
                <p className="text-sm text-muted-foreground">Salin catatan sisa stok dari WhatsApp dan tempel di menu Lapor Barang menggunakan AI.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-none">2</div>
              <div>
                <p className="font-bold">Input Prepare</p>
                <p className="text-sm text-muted-foreground">Catat jumlah barang yang disiapkan atau dibeli hari ini di menu Prepare Barang.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-none">3</div>
              <div>
                <p className="font-bold">Closing & Cek Stok</p>
                <p className="text-sm text-muted-foreground">Di akhir shift, input jumlah terjual dan stok fisik untuk melihat selisih.</p>
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
            <CardDescription>30 hari terakhir (Histori Perlu Stock)</CardDescription>
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