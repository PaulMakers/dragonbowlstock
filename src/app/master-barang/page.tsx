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
  AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const INITIAL_ITEMS = [
  // Dapur/Kitchen
  'mie kuning', 'mie warna warni', 'ayam kecap', 'bawang putih goreng', 'pangsit', 'bakso goreng', 'bumbu mie',
  'mie misua', 'ayam misua', 'jamur', 'telur omega',
  'ayam katsu prepare', 'Ayam sambal matah', 'sambal matah', 'daun jeruk', 'bawang merah', 'sereh', 'cabe',
  'ayam karage', 'ayam woku', 'ayam rica', 'pempek', 'kuah cuko', 'cireng', 'Tahu pong', 'cekerr mercon prepare', 
  'bakso goreng', 'platter', 'kentang',
  'tomat', 'wortel', 'timun', 'sawi hijau', 'pakcoy', 'selada', 'daun bawang',
  'kuah cuko', 'kuah kaldu', 'totole', 'garam', 'micin', 'lada', 'beras', 'minyak goreng', 'sambal', 'chili oil',
  'bawang merah', 'roti tawar', 'selai roti', 'margarin', 'kecap', 'saus tomat', 'mayonaise', 'telur biasa',
  // Minuman/Beverage
  'Kolang Kaling', 'Creamer', 'Sirsak', 'Kelapa Kopyor', 'Kuah Jahe', 'Jelly Hijau', 'Ketan Hitam', 'Anggur', 
  'Strawberry', 'Semangka', 'Semangka Kuning', 'Tapai', 'Melon', 'Nanas', 'Keju', 'Sirup Cocopandan', 'Mutiara', 
  'Teh', 'Cendol', 'Rumput laut', 'Kacang Hijau', 'Ronde Kecil', 'Ronde Besar', 'Roti Angsle', 'Alpukat', 
  'Susu Kental Manis', 'Nata de Coco', 'Simple Sirup ( Air Gula )', 'Mangga', 'Jeruk', 'Cincau', 'Boba', 'Nangka', 
  'Kelapa Biasa ( Frozen )', 'Es Batu', 'Jus Strawberry', 'Jus Alpukat', 'Jus Mangga', 'Ketan Putih', 'Kacang Tanah', 
  'Selasih', 'Jus Blackberry', 'Thai Tea',
  // Bagian Depan/Kulkas
  'Sosis Kanzler', 'Air Mineral Kecil', 'Air Mineral Sedang', 'Air Mineral Besar', 'Air Kelapa', 'Susu Cimory', 'Cilok',
  // Cup/Tempat Makanan
  'Bowl Besar', 'Bowl Sedang', 'Bowl Kecil', 'Tempat Es ( Dine In )', 'Tempat Es ( Take Away )', 'Tempat Cilok', 
  'Gelas Teh Es', 'Tempat Platter Combo Thai Tea',
  // Lain-Lain
  'Sumpit', 'Sendok Plastik', 'Sedotan', 'Plastik Kecil Untuk Stock Adonan Es'
];

export default function MasterBarangPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ namaBarang: '' });
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await callBackend('getMasterBarang');
      setItems(res.data || []);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat master barang' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ namaBarang: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ namaBarang: item.namaBarang });
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
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal menyimpan data.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSeedData = async () => {
    if (!confirm('Apakah Anda ingin memasukkan daftar awal barang (Kitchen, Beverage, dll) secara otomatis?')) return;
    
    setSeeding(true);
    let count = 0;
    try {
      // Create a unique list to avoid duplicates if some exist
      const existingNames = new Set(items.map(i => i.namaBarang.toLowerCase()));
      const itemsToSeed = INITIAL_ITEMS.filter(name => !existingNames.has(name.toLowerCase()));

      for (const name of itemsToSeed) {
        await callBackend('addMasterBarang', { namaBarang: name });
        count++;
      }
      
      toast({ 
        title: 'Berhasil', 
        description: `${count} barang awal telah ditambahkan ke sistem.` 
      });
      fetchItems();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal melakukan seed data.' });
    } finally {
      setSeeding(false);
    }
  };

  const filteredItems = items.filter(i => i.namaBarang.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Master Barang</h1>
          <p className="text-muted-foreground">Kelola daftar referensi barang untuk seluruh outlet.</p>
        </div>
        <div className="flex gap-2">
          {items.length === 0 && !loading && (
             <Button onClick={handleSeedData} variant="outline" className="h-12 px-6 rounded-xl border-primary/40 text-primary hover:bg-primary/5" disabled={seeding}>
              {seeding ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Database className="mr-2 h-5 w-5" />}
              {seeding ? 'Memproses...' : 'Seed Data Awal'}
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
              placeholder="Cari barang..." 
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
                      <p className="text-xs text-muted-foreground">ID: {item.id.substring(0, 8)}...</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(item)} className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item)} className="h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive">
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
              <p className="text-muted-foreground mt-2">Daftar master barang masih kosong.</p>
              {items.length === 0 && (
                <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20 max-w-sm mx-auto">
                  <AlertCircle className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm text-primary font-medium">Klik "Seed Data Awal" untuk memasukkan daftar barang Kitchen, Beverage, dll secara otomatis.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline">{editingItem ? 'Edit Barang' : 'Tambah Barang'}</DialogTitle>
              <DialogDescription>
                Masukkan nama barang baru untuk ditambahkan ke master.
              </DialogDescription>
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
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="h-12 px-6 rounded-xl">Batal</Button>
              <Button type="submit" className="h-12 px-8 rounded-xl primary-gradient font-bold" disabled={submitting}>
                {submitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
