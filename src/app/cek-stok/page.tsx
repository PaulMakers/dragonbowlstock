"use client"

import React, { useState, useEffect, useMemo } from 'react';
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
  Filter,
  CheckCircle2,
  AlertCircle,
  Database,
  ShoppingCart
} from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { KATEGORI_BARANG, StokHarian } from '@/lib/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from '@/lib/utils';

export default function CekStokPage() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [items, setItems] = useState<StokHarian[]>([]);
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

  const handleInputChange = (id: string, field: keyof StokHarian, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value };
        
        // Hanya hitung ulang jika yang diubah adalah angka stok
        if (['stok_awal', 'terjual', 'stok_fisik'].includes(field as string)) {
          const sAwal = Number(field === 'stok_awal' ? value : item.stok_awal) || 0;
          const sTerjual = Number(field === 'terjual' ? value : item.terjual) || 0;
          const sFisik = Number(field === 'stok_fisik' ? value : item.stok_fisik) || 0;
          const prepare = Number(item.prepare) || 0;

          const stokTeoritis = sAwal + prepare - sTerjual;
          const selisih = sFisik - stokTeoritis;
          
          return { 
            ...newItem, 
            stok_awal: sAwal,
            terjual: sTerjual,
            stok_fisik: sFisik,
            stok_teoritis: stokTeoritis, 
            selisih: selisih,
            status: selisih === 0 ? 'Balance' : 'Selisih'
          };
        }
        
        return newItem;
      }
      return item;
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const tgl = format(date, 'dd MMMM yyyy', { locale: localeId });
      await callBackend('saveStokHarian', { 
        tanggal: tgl,
        items: items
      });
      toast({ title: 'Berhasil', description: 'Data cek stok telah disimpan.' });
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

  const summary = useMemo(() => {
    const pos = filtered.reduce((acc, curr) => acc + (curr.selisih > 0 ? curr.selisih : 0), 0);
    const neg = filtered.reduce((acc, curr) => acc + (curr.selisih < 0 ? curr.selisih : 0), 0);
    const selisihCount = filtered.filter(i => i.selisih !== 0).length;
    const balanceCount = filtered.filter(i => i.selisih === 0).length;
    return { pos, neg, selisihCount, balanceCount };
  }, [filtered]);

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Cek Stok Barang</h1>
          <p className="text-muted-foreground">Input stok awal, terjual, dan fisik untuk hitung selisih.</p>
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
            Simpan Cek Stok
          </Button>
        </div>
      </div>

      <Alert className="bg-blue-500/10 border-blue-500/20 rounded-2xl mb-6">
        <Database className="h-5 w-5 text-blue-500" />
        <AlertTitle className="font-bold">Informasi Stok</AlertTitle>
        <AlertDescription className="text-sm">
          Kolom <b>Manual?</b> digunakan jika Anda ingin menandai barang perlu dipesan meskipun stok fisik masih mencukupi secara sistem.
        </AlertDescription>
      </Alert>

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

        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Menganalisis data stok...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="min-w-[150px]">Barang</TableHead>
                  <TableHead className="w-20 text-center">Stok Awal</TableHead>
                  <TableHead className="text-center">Prep</TableHead>
                  <TableHead className="w-20 text-center">Jual</TableHead>
                  <TableHead className="text-center">Teori</TableHead>
                  <TableHead className="w-20 text-center">Fisik</TableHead>
                  <TableHead className="text-center">Slisih</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Manual?</TableHead>
                  <TableHead className="text-center">Order?</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => {
                  const isAutoPerluStock = Number(item.stok_fisik) <= (Number(item.stok_minimum) || 0);
                  const showPerluStock = isAutoPerluStock || item.perlu_stock_manual;
                  
                  return (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell>
                        <p className="font-bold text-sm leading-tight">{item.nama_barang}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{item.kategori}</p>
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          className="h-9 text-center rounded-lg bg-blue-500/5 border-blue-500/30 font-bold" 
                          value={item.stok_awal === 0 ? '' : item.stok_awal}
                          onChange={(e) => handleInputChange(item.id, 'stok_awal', e.target.value)}
                        />
                      </TableCell>
                      <TableCell className="text-center font-medium text-xs">{item.prepare || 0}</TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          className="h-9 text-center rounded-lg" 
                          value={item.terjual === 0 ? '' : item.terjual}
                          onChange={(e) => handleInputChange(item.id, 'terjual', e.target.value)}
                        />
                      </TableCell>
                      <TableCell className="text-center font-bold text-blue-600 text-xs">{item.stok_teoritis || 0}</TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          className="h-9 text-center rounded-lg border-primary/40 font-bold" 
                          value={item.stok_fisik === 0 ? '' : item.stok_fisik}
                          onChange={(e) => handleInputChange(item.id, 'stok_fisik', e.target.value)}
                        />
                      </TableCell>
                      <TableCell className={cn(
                        "text-center font-bold text-xs",
                        item.selisih > 0 ? "text-green-600" : item.selisih < 0 ? "text-destructive" : ""
                      )}>
                        {item.selisih || 0}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={item.status === 'Balance' ? 'secondary' : 'destructive'} className="text-[9px] px-1 h-5">
                          {item.status || 'Balance'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Checkbox 
                            checked={item.perlu_stock_manual}
                            onCheckedChange={(checked) => handleInputChange(item.id, 'perlu_stock_manual', checked === true)}
                            className="h-5 w-5"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {showPerluStock ? (
                          <Badge variant="outline" className={cn(
                            "text-[9px] px-1 h-5 animate-pulse",
                            item.perlu_stock_manual ? "text-orange-500 border-orange-500" : "text-destructive border-destructive"
                          )}>
                            Pesan
                          </Badge>
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {[
          { label: 'Selisih Positif', value: summary.pos, color: 'text-green-600' },
          { label: 'Selisih Negatif', value: summary.neg, color: 'text-destructive' },
          { label: 'Barang Selisih', value: summary.selisihCount, color: 'text-orange-500' },
          { label: 'Barang Balance', value: summary.balanceCount, color: 'text-blue-600' },
        ].map((s, i) => (
          <Card key={i} className="border-none bg-card card-shadow rounded-xl">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">{s.label}</p>
              <h4 className={cn("text-xl font-bold", s.color)}>{s.value}</h4>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
