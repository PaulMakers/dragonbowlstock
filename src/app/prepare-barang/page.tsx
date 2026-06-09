"use client"

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { callBackend } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Calendar as CalendarIcon, 
  Loader2,
  Save,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { KATEGORI_BARANG } from '@/lib/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function PrepareBarangPage() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('Semua');

  const fetchData = async () => {
    setLoading(true);
    try {
      const tgl = format(date, 'dd MMMM yyyy', { locale: localeId });
      const res = await callBackend('getStokHarian', { tanggal: tgl });
      setItems(res.data || []);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [date]);

  const handleInputChange = (id: string, value: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, prepare: Number(value) || 0 } : item
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const tgl = format(date, 'dd MMMM yyyy', { locale: localeId });
      await callBackend('saveStokHarian', { 
        tanggal: tgl,
        items: items.map(i => ({
          id: i.id,
          stok_awal: i.stok_awal || 0,
          prepare: i.prepare || 0,
          terjual: i.terjual || 0,
          stok_teoritis: (i.stok_awal || 0) + (i.prepare || 0) - (i.terjual || 0),
          stok_fisik: i.stok_fisik || 0,
          selisih: (i.stok_fisik || 0) - ((i.stok_awal || 0) + (i.prepare || 0) - (i.terjual || 0)),
          status: (i.stok_fisik || 0) - ((i.stok_awal || 0) + (i.prepare || 0) - (i.terjual || 0)) === 0 ? 'Balance' : 'Selisih',
          catatan: i.catatan || ''
        }))
      });
      toast({ title: 'Berhasil', description: 'Data prepare telah disimpan.' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal menyimpan data.' });
    } finally {
      setSaving(false);
    }
  };

  const filtered = items.filter(i => {
    const matchSearch = i.nama_barang.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'Semua' || i.kategori === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Prepare Barang</h1>
          <p className="text-muted-foreground">Input stok yang disiapkan untuk operasional hari ini.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-12 px-4 rounded-xl border-border bg-card">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, 'dd MMM yyyy', { locale: localeId })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} />
            </PopoverContent>
          </Popover>
          <Button 
            className="h-12 px-6 rounded-xl primary-gradient font-bold shadow-lg shadow-primary/20"
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
            Simpan Prepare
          </Button>
        </div>
      </div>

      <Card className="border-none bg-card card-shadow rounded-2xl overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 bg-muted/30">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cari barang..." 
              className="pl-10 h-11 rounded-xl bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filterCat} onValueChange={setFilterCat}>
            <SelectTrigger className="w-full sm:w-60 h-11 rounded-xl bg-background">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua">Semua Kategori</SelectItem>
              {KATEGORI_BARANG.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Memuat daftar barang...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-1/3">Nama Barang</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="text-center">Satuan</TableHead>
                    <TableHead className="w-32 text-center">Prepare Hari Ini</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length > 0 ? (
                    filtered.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        <TableCell className="font-bold">{item.nama_barang}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{item.kategori}</TableCell>
                        <TableCell className="text-center text-sm font-medium">{item.satuan}</TableCell>
                        <TableCell>
                          <Input 
                            type="number"
                            className="h-10 text-center font-bold rounded-lg border-primary/20 focus:border-primary"
                            value={item.prepare || ''}
                            onChange={(e) => handleInputChange(item.id, e.target.value)}
                            onFocus={(e) => e.target.select()}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">
                        Tidak ada barang ditemukan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
