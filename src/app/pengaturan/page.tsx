"use client"

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save, Globe, Store, Clock } from 'lucide-react';

export default function PengaturanPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    outletName: 'Dragon Bowl Cafe',
    timezone: 'Asia/Jakarta',
    dashboardRange: '30'
  });

  useEffect(() => {
    const saved = localStorage.getItem('db_settings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    localStorage.setItem('db_settings', JSON.stringify(settings));
    toast({ title: 'Berhasil', description: 'Pengaturan telah disimpan secara lokal.' });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-headline font-bold">Pengaturan</h1>
        <p className="text-muted-foreground">Konfigurasi sistem dan preferensi tampilan.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-none bg-card card-shadow rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              Informasi Outlet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Nama Outlet / Cabang</Label>
              <Input 
                value={settings.outletName}
                onChange={(e) => setSettings({ ...settings, outletName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Zona Waktu (Timezone)</Label>
              <Select value={settings.timezone} onValueChange={(v) => setSettings({ ...settings, timezone: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Jakarta">WIB (Asia/Jakarta)</SelectItem>
                  <SelectItem value="Asia/Makassar">WITA (Asia/Makassar)</SelectItem>
                  <SelectItem value="Asia/Jayapura">WIT (Asia/Jayapura)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full primary-gradient font-bold" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Simpan Perubahan
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none bg-card card-shadow rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Preferensi Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Rentang Analisis Sering Habis</Label>
              <Select value={settings.dashboardRange} onValueChange={(v) => setSettings({ ...settings, dashboardRange: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Hari Terakhir</SelectItem>
                  <SelectItem value="30">30 Hari Terakhir</SelectItem>
                  <SelectItem value="90">90 Hari Terakhir</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 border border-dashed text-xs text-muted-foreground">
              <p>Pengaturan ini hanya memengaruhi tampilan dashboard Anda. Data historis di Google Sheets tetap tersimpan selamanya.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
