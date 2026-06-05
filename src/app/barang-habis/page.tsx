
"use client"

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { callBackend } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon, 
  CheckCircle2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

type ItemEntry = {
  namaBarang: string;
  jumlah: string;
  satuan: string;
  catatan: string;
};

export default function BarangHabisPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [masterItems, setMasterItems] = useState<any[]>([]);
  const [entries, setEntries] = useState<ItemEntry[]>([
    { namaBarang: '', jumlah: '', satuan: '', catatan: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadMaster() {
      setLoading(true);
      try {
        const res = await callBackend('getMasterBarang');
        setMasterItems(res.data || []);
      } catch (err) {
        toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat master barang' });
      } finally {
        setLoading(false);
      }
    }
    loadMaster();
  }, [toast]);

  const addEntry = () => {
    setEntries([...entries, { namaBarang: '', jumlah: '', satuan: '', catatan: '' }]);
  };

  const removeEntry = (index: number) => {
    if (entries.length > 1) {
      const newEntries = [...entries];
      newEntries.splice(index, 1);
      setEntries(newEntries);
    }
  };

  const updateEntry = (index: number, field: keyof ItemEntry, value: string) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const handleSave = async () => {
    const validEntries = entries.filter(e => e.namaBarang && e.jumlah && e.satuan);
    if (validEntries.length === 0) {
      toast({ variant: 'destructive', title: 'Peringatan', description: 'Silakan isi setidaknya satu barang dengan lengkap.' });
      return;
    }

    setSaving(true);
    try {
      const formattedDate = format(date, 'dd MMMM yyyy', { locale: localeId });
      
      for (const entry of validEntries) {
        await callBackend('addBarangHabis', {
          tanggal: formattedDate,
          namaBarang: entry.namaBarang,
          jumlah: entry.jumlah,
          satuan: entry.satuan,
          catatan: entry.catatan,
          inputOleh: user?.nama,
          status: 'Habis'
        });
      }

      toast({ title: 'Berhasil', description: 'Laporan barang habis telah disimpan.' });
      setEntries([{ namaBarang: '', jumlah: '', satuan: '', catatan: '' }]);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal menyimpan data.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Lapor Barang Habis</h1>
          <p className="text-muted-foreground">Catat kebutuhan barang yang harus segera direstock.</p>
        </div>
        
        <div className="flex items-center gap-2">
           <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full sm:w-[240px] justify-start text-left font-normal h-12 rounded-xl",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP', { locale: localeId }) : <span>Pilih Tanggal</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end" side="bottom">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {entries.map((entry, index) => (
            <Card key={index} className="border-none bg-card card-shadow rounded-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
              <div className="bg-muted/30 p-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-bold">Barang Ke-{index + 1}</h3>
                </div>
                {entries.length > 1 && (
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeEntry(index)}>
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Pilih Barang</Label>
                    <Select 
                      value={entry.namaBarang} 
                      onValueChange={(v) => updateEntry(index, 'namaBarang', v)}
                    >
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue placeholder="Pilih Barang" />
                      </SelectTrigger>
                      <SelectContent side="bottom">
                        {masterItems.map((item) => (
                          <SelectItem key={item.id} value={item.namaBarang}>{item.namaBarang}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-[10px] text-muted-foreground">Jika tidak ada di daftar, minta admin menambahkannya di Master Barang.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Jumlah</Label>
                      <Input 
                        type="number" 
                        placeholder="Cth: 30" 
                        className="h-11 rounded-xl text-center font-bold"
                        value={entry.jumlah}
                        onChange={(e) => updateEntry(index, 'jumlah', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Satuan</Label>
                      <Input 
                        placeholder="Cth: Butir" 
                        className="h-11 rounded-xl"
                        value={entry.satuan}
                        onChange={(e) => updateEntry(index, 'satuan', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Catatan Tambahan (Opsional)</Label>
                  <Textarea 
                    placeholder="Contoh: Sangat mendesak, sisa stok 0." 
                    className="rounded-xl resize-none"
                    value={entry.catatan}
                    onChange={(e) => updateEntry(index, 'catatan', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              variant="outline" 
              className="flex-1 h-12 border-dashed border-2 rounded-xl text-primary font-bold hover:bg-primary/5 border-primary/40"
              onClick={addEntry}
            >
              <Plus className="mr-2 h-5 w-5" /> Tambah Barang Lain
            </Button>
            <Button 
              className="flex-1 h-12 rounded-xl primary-gradient font-bold shadow-lg shadow-primary/20"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle2 className="mr-2 h-5 w-5" />}
              Kirim Laporan Closing
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-none bg-card card-shadow rounded-2xl overflow-hidden sticky top-24">
            <div className="bg-primary/5 p-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Informasi Penting
              </h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Mohon pastikan data yang diinput sudah sesuai dengan ketersediaan fisik di gudang/outlet. 
              </p>
              <Separator />
              <div className="space-y-3">
                <div className="flex gap-3 text-sm">
                  <div className="h-5 w-5 rounded bg-green-500/10 text-green-500 flex items-center justify-center">✓</div>
                  <span>Gunakan satuan yang standar.</span>
                </div>
                <div className="flex gap-3 text-sm">
                  <div className="h-5 w-5 rounded bg-green-500/10 text-green-500 flex items-center justify-center">✓</div>
                  <span>Isi catatan jika ada spesifikasi khusus.</span>
                </div>
                <div className="flex gap-3 text-sm">
                  <div className="h-5 w-5 rounded bg-green-500/10 text-green-500 flex items-center justify-center">✓</div>
                  <span>Klik tombol <strong>Kirim Laporan</strong> setelah semua diisi.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
