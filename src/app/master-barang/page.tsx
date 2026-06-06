"use client"

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { callBackend } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Loader2,
  Package,
  Database,
  AlertCircle,
  Tag
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KATEGORI_BARANG } from '@/lib/constants';

const INITIAL_ITEMS = [
  { nama: 'mie kuning', kategori: 'Dapur/Kitchen' },
  { nama: 'mie warna warni', kategori: 'Dapur/Kitchen' },
  { nama: 'ayam kecap', kategori: 'Dapur/Kitchen' },
  { nama: 'bawang putih goreng', kategori: 'Dapur/Kitchen' },
  { nama: 'pangsit', kategori: 'Dapur/Kitchen' },
  { nama: 'bakso goreng', kategori: 'Dapur/Kitchen' },
  { nama: 'bumbu mie', kategori: 'Dapur/Kitchen' },
  { nama: 'mie misua', kategori: 'Dapur/Kitchen' },
  { nama: 'ayam misua', kategori: 'Dapur/Kitchen' },
  { nama: 'jamur', kategori: 'Dapur/Kitchen' },
  { nama: 'telur omega', kategori: 'Dapur/Kitchen' },
  { nama: 'ayam katsu prepare', kategori: 'Dapur/Kitchen' },
  { nama: 'Ayam sambal matah', kategori: 'Dapur/Kitchen' },
  { nama: 'sambal matah', kategori: 'Dapur/Kitchen' },
  { nama: 'daun jeruk', kategori: 'Dapur/Kitchen' },
  { nama: 'bawang merah', kategori: 'Dapur/Kitchen' },
  { nama: 'sereh', kategori: 'Dapur/Kitchen' },
  { nama: 'cabe', kategori: 'Dapur/Kitchen' },
  { nama: 'ayam karage', kategori: 'Dapur/Kitchen' },
  { nama: 'ayam woku', kategori: 'Dapur/Kitchen' },
  { nama: 'ayam rica', kategori: 'Dapur/Kitchen' },
  { nama: 'pempek', kategori: 'Dapur/Kitchen' },
  { nama: 'kuah cuko', kategori: 'Dapur/Kitchen' },
  { nama: 'cireng', kategori: 'Dapur/Kitchen' },
  { nama: 'Tahu pong', kategori: 'Dapur/Kitchen' },
  { nama: 'cekerr mercon prepare', kategori: 'Dapur/Kitchen' },
  { nama: 'platter', kategori: 'Dapur/Kitchen' },
  { nama: 'kentang', kategori: 'Dapur/Kitchen' },
  { nama: 'tomat', kategori: 'Sayuran' },
  { nama: 'wortel', kategori: 'Sayuran' },
  { nama: 'timun', kategori: 'Sayuran' },
  { nama: 'sawi hijau', kategori: 'Sayuran' },
  { nama: 'pakcoy', kategori: 'Sayuran' },
  { nama: 'selada', kategori: 'Sayuran' },
  { nama: 'daun bawang', kategori: 'Sayuran' },
  { nama: 'kuah kaldu', kategori: 'Bumbu/DLL' },
  { nama: 'totole', kategori: 'Bumbu/DLL' },
  { nama: 'garam', kategori: 'Bumbu/DLL' },
  { nama: 'micin', kategori: 'Bumbu/DLL' },
  { nama: 'lada', kategori: 'Bumbu/DLL' },
  { nama: 'beras', kategori: 'Bumbu/DLL' },
  { nama: 'minyak goreng', kategori: 'Bumbu/DLL' },
  { nama: 'sambal', kategori: 'Bumbu/DLL' },
  { nama: 'chili oil', kategori: 'Bumbu/DLL' },
  { nama: 'roti tawar', kategori: 'Bumbu/DLL' },
  { nama: 'selai roti', kategori: 'Bumbu/DLL' },
  { nama: 'margarin', kategori: 'Bumbu/DLL' },
  { nama: 'kecap', kategori: 'Bumbu/DLL' },
  { nama: 'saus tomat', kategori: 'Bumbu/DLL' },
  { nama: 'mayonaise', kategori: 'Bumbu/DLL' },
  { nama: 'telur biasa', kategori: 'Bumbu/DLL' },
  { nama: 'Kolang Kaling', kategori: 'Beverage' },
  { nama: 'Creamer', kategori: 'Beverage' },
  { nama: 'Sirsak', kategori: 'Beverage' },
  { nama: 'Kelapa Kopyor', kategori: 'Beverage' },
  { nama: 'Kuah Jahe', kategori: 'Beverage' },
  { nama: 'Jelly Hijau', kategori: 'Beverage' },
  { nama: 'Ketan Hitam', kategori: 'Beverage' },
  { nama: 'Anggur', kategori: 'Beverage' },
  { nama: 'Strawberry', kategori: 'Beverage' },
  { nama: 'Semangka', kategori: 'Beverage' },
  { nama: 'Semangka Kuning', kategori: 'Beverage' },
  { nama: 'Tapai', kategori: 'Beverage' },
  { nama: 'Melon', kategori: 'Beverage' },
  { nama: 'Nanas', kategori: 'Beverage' },
  { nama: 'Keju', kategori: 'Beverage' },
  { nama: 'Sirup Cocopandan', kategori: 'Beverage' },
  { nama: 'Mutiara', kategori: 'Beverage' },
  { nama: 'Teh', kategori: 'Beverage' },
  { nama: 'Cendol', kategori: 'Beverage' },
  { nama: 'Rumput laut', kategori: 'Beverage' },
  { nama: 'Kacang Hijau', kategori: 'Beverage' },
  { nama: 'Ronde Kecil', kategori: 'Beverage' },
  { nama: 'Ronde Besar', kategori: 'Beverage' },
  { nama: 'Roti Angsle', kategori: 'Beverage' },
  { nama: 'Alpukat', kategori: 'Beverage' },
  { nama: 'Susu Kental Manis', kategori: 'Beverage' },
  { nama: 'Nata de Coco', kategori: 'Beverage' },
  { nama: 'Simple Sirup ( Air Gula )', kategori: 'Beverage' },
  { nama: 'Mangga', kategori: 'Beverage' },
  { nama: 'Jeruk', kategori: 'Beverage' },
  { nama: 'Cincau', kategori: 'Beverage' },
  { nama: 'Boba', kategori: 'Beverage' },
  { nama: 'Nangka', kategori: 'Beverage' },
  { nama: 'Kelapa Biasa ( Frozen )', kategori: 'Beverage' },
  { nama: 'Es Batu', kategori: 'Beverage' },
  { nama: 'Jus Strawberry', kategori: 'Beverage' },
  { nama: 'Jus Alpukat', kategori: 'Beverage' },
  { nama: 'Jus Mangga', kategori: 'Beverage' },
  { nama: 'Ketan Putih', kategori: 'Beverage' },
  { nama: 'Kacang Tanah', kategori: 'Beverage' },
  { nama: 'Selasih', kategori: 'Beverage' },
  { nama: 'Jus Blackberry', kategori: 'Beverage' },
  { nama: 'Thai Tea', kategori: 'Beverage' },
  { nama: 'Sosis Kanzler', kategori: 'Kulkas/Bagian Depan' },
  { nama: 'Air Mineral Kecil', kategori: 'Kulkas/Bagian Depan' },
  { nama: 'Air Mineral Sedang', kategori: 'Kulkas/Bagian Depan' },
  { nama: 'Air Mineral Besar', kategori: 'Kulkas/Bagian Depan' },
  { nama: 'Air Kelapa', kategori: 'Kulkas/Bagian Depan' },
  { nama: 'Susu Cimory', kategori: 'Kulkas/Bagian Depan' },
  { nama: 'Cilok', kategori: 'Kulkas/Bagian Depan' },
  { nama: 'Bowl Besar', kategori: 'Packaging/Cup' },
  { nama: 'Bowl Sedang', kategori: 'Packaging/Cup' },
  { nama: 'Bowl Kecil', kategori: 'Packaging/Cup' },
  { nama: 'Tempat Es ( Dine In )', kategori: 'Packaging/Cup' },
  { nama: 'Tempat Es ( Take Away )', kategori: 'Packaging/Cup' },
  { nama: 'Tempat Cilok', kategori: 'Packaging/Cup' },
  { nama: 'Gelas Teh Es', kategori: 'Packaging/Cup' },
  { nama: 'Tempat Platter Combo Thai Tea', kategori: 'Packaging/Cup' },
  { nama: 'Sumpit', kategori: 'Lain-Lain' },
  { nama: 'Sendok Plastik', kategori: 'Lain-Lain' },
  { nama: 'Sedotan', kategori: 'Lain-Lain' },
  { nama: 'Plastik Kecil Untuk Stock Adonan Es', kategori: 'Lain-Lain' }
];

export default function MasterBarangPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ namaBarang: '', kategori: 'Dapur/Kitchen' });
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await callBackend('getMasterBarang');
      setItems(res.data || []);
    } catch (err: any) {
      console.error('Fetch Error:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ namaBarang: '', kategori: 'Dapur/Kitchen' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ namaBarang: item.namaBarang, kategori: item.kategori || 'Dapur/Kitchen' });
    setIsModalOpen(true);
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Hapus barang "${item.namaBarang}"?`)) return;
    try {
      await callBackend('deleteMasterBarang', { id: item.id });
      toast({ title: 'Dihapus', description: 'Barang telah dihapus dari master.' });
      fetchItems();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal menghapus barang.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaBarang) return;
    
    setSubmitting(true);
    try {
      if (editingItem) {
        await callBackend('updateMasterBarang', { id: editingItem.id, ...formData });
        toast({ title: 'Berhasil', description: 'Master barang diperbarui.' });
      } else {
        await callBackend('addMasterBarang', formData);
        toast({ title: 'Berhasil', description: 'Barang baru ditambahkan.' });
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (err: any) {
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: err.message || 'Gagal menyimpan data.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSeedData = async () => {
    if (!confirm('Apakah Anda ingin memasukkan seluruh daftar awal barang secara otomatis?')) return;
    
    setSeeding(true);
    let count = 0;
    try {
      const existingNames = new Set(items.map(i => i.namaBarang?.toLowerCase() || ''));
      const itemsToSeed = INITIAL_ITEMS.filter(item => !existingNames.has(item.nama.toLowerCase()));

      if (itemsToSeed.length === 0) {
        toast({ title: 'Info', description: 'Semua barang sudah ada di sistem.' });
        setSeeding(false);
        return;
      }

      for (const item of itemsToSeed) {
        try {
          await callBackend('addMasterBarang', { namaBarang: item.nama, kategori: item.kategori });
          count++;
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (e) {
          console.error(`Gagal memasukkan ${item.nama}:`, e);
        }
      }
      
      toast({ title: 'Selesai', description: `${count} barang baru berhasil ditambahkan.` });
      fetchItems();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Gagal', description: 'Gagal sinkronisasi data.' });
    } finally {
      setSeeding(false);
    }
  };

  const filteredItems = items.filter(i => 
    i.namaBarang?.toLowerCase().includes(search.toLowerCase()) ||
    i.kategori?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Master Barang</h1>
          <p className="text-muted-foreground">Kelola daftar referensi barang untuk seluruh outlet.</p>
        </div>
        <div className="flex gap-2">
          {!loading && (
             <Button onClick={handleSeedData} variant="outline" className="h-12 px-6 rounded-xl border-primary/40 text-primary hover:bg-primary/5" disabled={seeding}>
              {seeding ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Database className="mr-2 h-5 w-5" />}
              Sinkron Data Awal
            </Button>
          )}
          <Button onClick={handleOpenAdd} className="h-12 px-6 rounded-xl primary-gradient font-semibold">
            <Plus className="mr-2 h-5 w-5" /> Tambah Barang
          </Button>
        </div>
      </div>

      <Card className="border-none card-shadow rounded-2xl overflow-hidden bg-card">
        <div className="p-4 border-b bg-muted/30">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cari nama atau kategori..." 
              className="pl-10 h-11 rounded-xl bg-background/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Sedang mengambil data...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 px-6 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">{item.namaBarang}</p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Tag className="h-3 w-3" /> {item.kategori || 'Tanpa Kategori'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(item)} className="h-10 w-10 rounded-full">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item)} className="h-10 w-10 rounded-full text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center">
              <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-headline text-xl font-bold">Tidak ada barang</h3>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline">{editingItem ? 'Edit Barang' : 'Tambah Barang'}</DialogTitle>
              <DialogDescription>Masukkan detail barang untuk master data.</DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="namaBarang">Nama Barang</Label>
                <Input 
                  id="namaBarang" 
                  placeholder="Contoh: Telur Ayam" 
                  value={formData.namaBarang}
                  onChange={(e) => setFormData({ ...formData, namaBarang: e.target.value })}
                  required
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select 
                  value={formData.kategori} 
                  onValueChange={(v) => setFormData({ ...formData, kategori: v })}
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent side="bottom" position="popper">
                    {KATEGORI_BARANG.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="h-12 px-6 rounded-xl">Batal</Button>
              <Button type="submit" className="h-12 px-8 rounded-xl primary-gradient font-bold" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
