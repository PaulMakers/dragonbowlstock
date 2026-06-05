
"use client"

import React from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { 
  User, 
  Settings as SettingsIcon, 
  HelpCircle, 
  Info,
  Shield,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function PengaturanPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Pengaturan</h1>
          <p className="text-muted-foreground">Kelola preferensi dan informasi akun Anda.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none card-shadow rounded-2xl overflow-hidden bg-card">
            <CardHeader className="bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>Profil Saya</CardTitle>
                  <CardDescription>Informasi akun yang sedang aktif.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nama Lengkap</p>
                  <p className="text-lg font-semibold">{user?.nama}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Username</p>
                  <p className="text-lg font-semibold font-mono">{user?.username}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Hak Akses / Role</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'} className="uppercase">
                      {user?.role}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status Akun</p>
                  <div className="flex items-center gap-1.5 text-green-500 font-medium">
                    <CheckCircle2 className="h-4 w-4" /> Terverifikasi
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none card-shadow rounded-2xl overflow-hidden bg-card">
            <CardHeader className="bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>Bantuan & Panduan</CardTitle>
                  <CardDescription>Cara menggunakan aplikasi Dragonbowl Stock.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-none">1</div>
                  <div>
                    <p className="font-bold">Cara Lapor Barang Habis</p>
                    <p className="text-sm text-muted-foreground">Pilih menu "Barang Habis", isi jumlah dan satuan, lalu klik "Kirim Laporan". Lakukan ini setiap closing outlet.</p>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-none">2</div>
                  <div>
                    <p className="font-bold">Mengecek Status Barang</p>
                    <p className="text-sm text-muted-foreground">Halaman Dashboard menunjukkan ringkasan barang yang butuh segera dibeli atau sudah tersedia.</p>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-none">3</div>
                  <div>
                    <p className="font-bold">Update Status Restock</p>
                    <p className="text-sm text-muted-foreground">Admin/Supervisor dapat mengubah status barang menjadi "Sudah Tersedia" di menu "Prepare Barang" setelah stok datang.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none card-shadow rounded-2xl overflow-hidden bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Sistem
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Versi Aplikasi</span>
                <span className="font-bold">v1.2.0-stable</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Terhubung ke</span>
                <span className="font-bold text-primary">Google Apps Script</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Mode Tampilan</span>
                <Badge variant="outline">Dark Mode (Default)</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none card-shadow rounded-2xl overflow-hidden bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <Smartphone className="h-12 w-12 opacity-50" />
                <h4 className="font-bold">Akses Mobile</h4>
                <p className="text-sm opacity-80">Gunakan browser Chrome di smartphone Anda untuk akses cepat di outlet. Tambahkan ke "Home Screen" untuk pengalaman seperti aplikasi.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
