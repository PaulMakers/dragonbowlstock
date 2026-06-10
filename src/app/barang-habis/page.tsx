
"use client"

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { callBackend } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { 
  Trash2, 
  Calendar as CalendarIcon, 
  CheckCircle2,
  Loader2,
  AlertCircle,
  Plus,
  Tag,
  Package,
  Sparkles,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { KATEGORI_BARANG } from '@/lib/constants';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { parseStockReport } from '@/ai/flows/parse-stock-report-flow';

type ItemEntry = {
  kategori: string;
  namaBarang: string;
  jumlah: string;
  satuan: string;
  status: string;
  catatan: string;
};

export default function BarangHabisPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [masterItems, setMasterItems] = useState<any[]>([]);
  const [entries, setEntries] = useState<ItemEntry[]>([
    { kategori: '', namaBarang: '', jumlah: '', satuan: '', status: 'Habis', catatan: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [parsing, setParsing] = useState(false);

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
    setEntries([...entries, { kategori: '', namaBarang: '', jumlah: '', satuan: '', status: 'Habis', catatan: '' }]);
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
    (newEntries[index] as any)[field] = value;
    if (field === 'kategori') {
      newEntries[index].namaBarang = '';
    }
    setEntries(newEntries);
  };

  const handleAISubmit = async () => {
    if (!aiInput.trim()) return;
    setParsing(true);
    try {
      const res = await parseStockReport({ text: aiInput });
      if (res.entries && res.entries.length > 0) {
        const isFirstEmpty = entries.length === 1 && !entries[0].namaBarang;
        const newEntries = isFirstEmpty ? [...res.entries] : [...entries, ...res.entries];
        setEntries(newEntries as any);
        toast({ title: 'AI Berhasil', description: `${res.entries.length} barang berhasil dikenali.` });
        setIsAIDialogOpen(false);
        setAiInput('');
      }
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal memproses teks dengan AI.' });
    } finally {
      setParsing(false);
    }
  };

  const handleSave = async () => {
    const validEntries = entries.filter(e => e.namaBarang && e.kategori);
    if (validEntries.length === 0) {
      toast({ variant: 'destructive', title: 'Peringatan', description: 'Silakan pilih kategori dan nama barang.' });
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
          status: entry.status,
          kategori: entry.kategori
        });
      }
      toast({ title: 'Berhasil', description: 'Laporan barang telah disimpan.' });
      setEntries([{ kategori: '', namaBarang: '', jumlah: '', satuan: '', status: 'Habis', catatan: '' }]);
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
          <h1 className="text-3xl font-headline font-bold">Lapor Barang</h1>
          <p className="text-muted-foreground">Catat ketersediaan barang di outlet hari ini.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="h-12 px-6 rounded-xl border-primary/40 text-primary font-bold bg-primary/5 hover:bg-primary/10 transition-all"
            onClick={() => setIsAIDialogOpen(true)}
          >
            <Sparkles className="mr-2 h-5 w-5 text-primary" />
            Lapor Pakai AI
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start h-12 rounded-xl">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP', { locale: localeId }) : <span>Pilih Tanggal</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end" side="bottom">
              <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {entries.map((entry, index) => {
            const filteredMaster = masterItems.filter(m => m.kategori === entry.kategori);
            
            return (
              <Card key={index} className="border-none bg-card card-shadow rounded-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
                <div className="bg-muted/30 p-4 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-bold">Barang {index + 1}</h3>
                  </div>
                  {entries.length > 1 && (
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeEntry(index)}>
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  )}
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Tag className="h-3 w-3" /> Pilih Kategori</Label>
                      <Select value={entry.kategori} onValueChange={(v) => updateEntry(index, 'kategori', v)}>
                        <SelectTrigger className="h-11 rounded-xl" side="bottom">
                          <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                        <SelectContent side="bottom" position="popper">
                          {KATEGORI_BARANG.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Package className="h-3 w-3" /> Pilih Barang</Label>
                      <Select 
                        value={entry.namaBarang} 
                        onValueChange={(v) => updateEntry(index, 'namaBarang', v)}
                        disabled={!entry.kategori}
                      >
                        <SelectTrigger className="h-11 rounded-xl" side="bottom">
                          <SelectValue placeholder={entry.kategori ? "Pilih Nama Barang" : "Pilih Kategori Dulu"} />
                        </SelectTrigger>
                        <SelectContent side="bottom" position="popper">
                          {filteredMaster.map((item: any) => (
                            <SelectItem key={item.id} value={item.nama_barang}>{item.nama_barang}</SelectItem>
                          ))}
                          {entry.namaBarang && !filteredMaster.some(m => m.nama_barang === entry.namaBarang) && (
                            <SelectItem value={entry.namaBarang}>{entry.namaBarang} (Custom)</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={entry.status} onValueChange={(v) => updateEntry(index, 'status', v)}>
                        <SelectTrigger className="h-11 rounded-xl" side="bottom">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent side="bottom" position="popper">
                          <SelectItem value="Habis">Stok Sudah Habis</SelectItem>
                          <SelectItem value="Tersedia">Stok Masih Ada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Jumlah {entry.status === 'Tersedia' ? 'Sisa' : 'Kurang'}</Label>
                      <Input 
                        placeholder="Cth: 10" 
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

                  <div className="space-y-2">
                    <Label>Catatan (Opsional)</Label>
                    <Textarea 
                      placeholder="Contoh: Perlu dikirim segera" 
                      className="rounded-xl resize-none"
                      value={entry.catatan}
                      onChange={(e) => updateEntry(index, 'catatan', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button variant="outline" className="flex-1 h-12 border-dashed border-2 rounded-xl text-primary font-bold" onClick={addEntry}>
              <Plus className="mr-2 h-5 w-5" /> Tambah Baris
            </Button>
            <Button className="flex-1 h-12 rounded-xl primary-gradient font-bold" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle2 className="mr-2 h-5 w-5" />}
              Simpan Laporan
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-none bg-card card-shadow rounded-2xl overflow-hidden sticky top-24">
            <div className="bg-primary/5 p-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Tips Lapor Cepat
              </h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Punya catatan sisa stok di WhatsApp? Klik <b>"Lapor Pakai AI"</b> lalu tempel teks Anda. Sistem akan otomatis mengisi form untuk Anda.
              </p>
              <div className="space-y-3">
                <div className="flex gap-3 text-sm">
                  <div className="h-5 w-5 rounded bg-green-500/10 text-green-500 flex items-center justify-center font-bold">1</div>
                  <span>Klik Tombol <b>Lapor Pakai AI</b>.</span>
                </div>
                <div className="flex gap-3 text-sm">
                  <div className="h-5 w-5 rounded bg-green-500/10 text-green-500 flex items-center justify-center font-bold">2</div>
                  <span>Tempel teks catatan stok Anda.</span>
                </div>
                <div className="flex gap-3 text-sm">
                  <div className="h-5 w-5 rounded bg-green-500/10 text-green-500 flex items-center justify-center font-bold">3</div>
                  <span>Periksa & Klik Simpan.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Lapor Cepat via AI
            </DialogTitle>
            <DialogDescription>
              Tempel catatan stok Anda di sini (Cth: Nangka - 1 Pack, Mutiara - Habis).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="Tempel catatan di sini..."
              className="min-h-[200px] rounded-xl font-mono text-sm"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsAIDialogOpen(false)}>Batal</Button>
            <Button 
              className="primary-gradient font-bold px-8 rounded-xl" 
              onClick={handleAISubmit}
              disabled={parsing || !aiInput}
            >
              {parsing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Bedah Teks Sekarang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
