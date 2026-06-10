
"use client"

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';
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
  Database
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
import { Badge } from '@/components/ui/badge';

const INITIAL_DATA = [
  // BEVERAGE / MINUMAN (Sesuai List Terbaru)
  { nama_barang: 'Nangka', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Nanas', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Boba', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Mutiara', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Kolang-Kaling', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Rumput Laut', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Cendol', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Nata De Coco', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Tapai', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Cincau', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Sirsak', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Strawberry', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Melon', kategori: 'Beverage/Minuman', satuan: 'Buah' },
  { nama_barang: 'Semangka', kategori: 'Beverage/Minuman', satuan: 'Buah' },
  { nama_barang: 'Jeruk', kategori: 'Beverage/Minuman', satuan: 'Buah' },
  { nama_barang: 'Anggur', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Mangga', kategori: 'Beverage/Minuman', satuan: 'Buah' },
  { nama_barang: 'Nutrijell', kategori: 'Beverage/Minuman', satuan: 'Sachet' },
  { nama_barang: 'Alpukat', kategori: 'Beverage/Minuman', satuan: 'Buah' },
  { nama_barang: 'Kelapa Frozen', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Kacang Hijau', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Ketan Hitam', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Roti Angsle', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Kacang Tanah', kategori: 'Beverage/Minuman', satuan: 'Bungkus' },
  { nama_barang: 'Ketan Putih', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Ronde Besar', kategori: 'Beverage/Minuman', satuan: 'Pcs' },
  { nama_barang: 'Ronde Kecil', kategori: 'Beverage/Minuman', satuan: 'Pcs' },
  { nama_barang: 'Jus Alpukat', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Jus Mangga', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Jus Strawberry', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Jus BlackBerry', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Jus Naga', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Jus Jambu', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Selasih', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Susu Kental Manis', kategori: 'Beverage/Minuman', satuan: 'Kaleng' },
  { nama_barang: 'Sirup Cocopandan', kategori: 'Beverage/Minuman', satuan: 'Botol' },
  { nama_barang: 'Simple Sirup', kategori: 'Beverage/Minuman', satuan: 'Liter' },
  { nama_barang: 'Teh', kategori: 'Beverage/Minuman', satuan: 'Bungkus' },
  { nama_barang: 'Es Batu', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Keju', kategori: 'Beverage/Minuman', satuan: 'Balok' },
  { nama_barang: 'Susu UHT', kategori: 'Beverage/Minuman', satuan: 'Botol' },
  { nama_barang: 'Santan Kecil', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Creamer', kategori: 'Beverage/Minuman', satuan: 'Gram' },
  { nama_barang: 'Thai Tea', kategori: 'Beverage/Minuman', satuan: 'Pack' },
  { nama_barang: 'Rich Cream', kategori: 'Beverage/Minuman', satuan: 'Pack' },

  // DEPAN / KULKAS (Sesuai List Terbaru)
  { nama_barang: 'Air Mineral Kecil', kategori: 'Depan/Kulkas', satuan: 'Botol' },
  { nama_barang: 'Air Mineral Sedang', kategori: 'Depan/Kulkas', satuan: 'Botol' },
  { nama_barang: 'Air Mineral Besar', kategori: 'Depan/Kulkas', satuan: 'Botol' },
  { nama_barang: 'Cimory', kategori: 'Depan/Kulkas', satuan: 'Botol' },
  { nama_barang: 'Sari Kacang Ijo', kategori: 'Depan/Kulkas', satuan: 'Botol' },
  { nama_barang: 'Indomilk Botol', kategori: 'Depan/Kulkas', satuan: 'Botol' },
  { nama_barang: 'Indomilk Kotak', kategori: 'Depan/Kulkas', satuan: 'Kotak' },
  { nama_barang: 'Yogurt Cimory Kecil', kategori: 'Depan/Kulkas', satuan: 'Botol' },
  { nama_barang: 'Milo Kotak Kecil', kategori: 'Depan/Kulkas', satuan: 'Kotak' },
  { nama_barang: 'Teh Kotak Kecil', kategori: 'Depan/Kulkas', satuan: 'Kotak' },
  { nama_barang: 'Fanta', kategori: 'Depan/Kulkas', satuan: 'Botol' },
  { nama_barang: 'Coca Cola', kategori: 'Depan/Kulkas', satuan: 'Botol' },
  { nama_barang: 'Sprite', kategori: 'Depan/Kulkas', satuan: 'Botol' },
  { nama_barang: 'Rujak Gobet', kategori: 'Depan/Kulkas', satuan: 'Pack' },
  { nama_barang: 'Jeruk Peras', kategori: 'Depan/Kulkas', satuan: 'Buah' },
  { nama_barang: 'Kacang Polong (Bawang Putih)', kategori: 'Depan/Kulkas', satuan: 'Pack' },
  { nama_barang: 'Biji Kuaci (Telur Kepiting)', kategori: 'Depan/Kulkas', satuan: 'Pack' },
  { nama_barang: 'Kacang Koro (Telur Kepiting)', kategori: 'Depan/Kulkas', satuan: 'Pack' },
  { nama_barang: 'Kepang Goreng (Hitam)', kategori: 'Depan/Kulkas', satuan: 'Pack' },
  { nama_barang: 'Kepang Goreng (Hijau)', kategori: 'Depan/Kulkas', satuan: 'Pack' },
  { nama_barang: 'Kepang Goreng (Biru)', kategori: 'Depan/Kulkas', satuan: 'Pack' },
  { nama_barang: 'Tini Wini Biti', kategori: 'Depan/Kulkas', satuan: 'Pack' },

  // DLL / PERLENGKAPAN
  { nama_barang: 'Ricebowl Besar', kategori: 'Dll/Perlengkapan', satuan: 'Pack' },
  { nama_barang: 'Ricebowl Sedang', kategori: 'Dll/Perlengkapan', satuan: 'Pack' },
  { nama_barang: 'Ricebowl Kecil', kategori: 'Dll/Perlengkapan', satuan: 'Pack' },
  { nama_barang: 'Cup Es Dine In', kategori: 'Dll/Perlengkapan', satuan: 'Pack' },
  { nama_barang: 'Cup Es Take Away', kategori: 'Dll/Perlengkapan', satuan: 'Pack' },
  { nama_barang: 'Sarung Tangan Plastik', kategori: 'Dll/Perlengkapan', satuan: 'Pack' },
  { nama_barang: 'Tisu Gantung', kategori: 'Dll/Perlengkapan', satuan: 'Pack' },
  { nama_barang: 'Plastik Es Batu', kategori: 'Dll/Perlengkapan', satuan: 'Pack' },
  { nama_barang: 'Sabun Cuci Piring', kategori: 'Dll/Perlengkapan', satuan: 'Botol' },
  { nama_barang: 'Sedotan', kategori: 'Dll/Perlengkapan', satuan: 'Pack' },
  { nama_barang: 'Sumpit', kategori: 'Dll/Perlengkapan', satuan: 'Pack' },
  { nama_barang: 'Mie Karyawan', kategori: 'Dll/Perlengkapan', satuan: 'Pack' },
  { nama_barang: 'Telur Biasa', kategori: 'Dll/Perlengkapan', satuan: 'Butir' },

  // DAPUR / KITCHEN
  { nama_barang: 'Mie Kuning', kategori: 'Dapur/Kitchen', satuan: 'Porsi' },
  { nama_barang: 'Mie Warna Warni', kategori: 'Dapur/Kitchen', satuan: 'Porsi' },
  { nama_barang: 'Ayam Kecap', kategori: 'Dapur/Kitchen', satuan: 'Box/Porsi' },
  { nama_barang: 'Bawang Putih Goreng', kategori: 'Dapur/Kitchen', satuan: 'Pack' },
  { nama_barang: 'Pangsit', kategori: 'Dapur/Kitchen', satuan: 'Pack' },
  { nama_barang: 'Bumbu Mie', kategori: 'Dapur/Kitchen', satuan: 'Pack' },
  { nama_barang: 'Ayam Cincang Mentah', kategori: 'Dapur/Kitchen', satuan: 'Pack' },
  { nama_barang: 'Mie Misua', kategori: 'Dapur/Kitchen', satuan: 'Pack' },
  { nama_barang: 'Ayam Misua', kategori: 'Dapur/Kitchen', satuan: 'Pack' },
  { nama_barang: 'Jamur', kategori: 'Dapur/Kitchen', satuan: 'Pack' },
  { nama_barang: 'Telur Omega', kategori: 'Dapur/Kitchen', satuan: 'Butir' },
  { nama_barang: 'Ayam Boneless', kategori: 'Dapur/Kitchen', satuan: 'Pack' },
  { nama_barang: 'Ayam Katsu Prepare', kategori: 'Dapur/Kitchen', satuan: 'Porsi' },
  { nama_barang: 'Ayam Sambal Matah', kategori: 'Dapur/Kitchen', satuan: 'Box' },
  { nama_barang: 'Sambal Matah', kategori: 'Dapur/Kitchen', satuan: 'Pack' },
  { nama_barang: 'Ayam Karage', kategori: 'Dapur/Kitchen', satuan: 'Pack' },
  { nama_barang: 'Ayam Woku', kategori: 'Dapur/Kitchen', satuan: 'Pack' },
  { nama_barang: 'Ayam Rica', kategori: 'Dapur/Kitchen', satuan: 'Pack' },
  { nama_barang: 'Pempek', kategori: 'Dapur/Kitchen', satuan: 'Pack' },
  { nama_barang: 'Kuah Cuko', kategori: 'Dapur/Kitchen', satuan: 'Bungkus' },
  { nama_barang: 'Cireng', kategori: 'Dapur/Kitchen', satuan: 'Pack' },
  { nama_barang: 'Tahu Pong', kategori: 'Dapur/Kitchen', satuan: 'Bungkus' },
  { nama_barang: 'Ceker Mercon Prepare', kategori: 'Dapur/Kitchen', satuan: 'Porsi' },
  { nama_barang: 'Beras', kategori: 'Dapur/Kitchen', satuan: 'Kg' },
  { nama_barang: 'Minyak Goreng', kategori: 'Dapur/Kitchen', satuan: 'Liter' },
];

export default function MasterBarangPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ 
    nama_barang: '', 
    kategori: 'Dapur/Kitchen', 
    satuan: 'Pcs',
    stok_minimum: 0,
    aktif: true 
  });
  const [submitting, setSubmitting] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await callBackend('getMasterBarang');
      setItems(res.data || []);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat master data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSyncInitialData = async () => {
    if (!confirm('Sinkronkan seluruh data barang templat ke database?')) return;
    setSyncing(true);
    try {
      await callBackend('bulkSaveMasterBarang', { items: INITIAL_DATA });
      toast({ title: 'Sinkronisasi Berhasil', description: `Data template baru telah dimasukkan.` });
      fetchData();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal sinkronisasi data.' });
    } finally {
      setSyncing(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ nama_barang: '', kategori: 'Dapur/Kitchen', satuan: 'Pcs', stok_minimum: 0, aktif: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ 
      nama_barang: item.nama_barang, 
      kategori: item.kategori, 
      satuan: item.satuan,
      stok_minimum: item.stok_minimum,
      aktif: String(item.aktif) === "true" || item.aktif === true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await callBackend('saveMasterBarang', { 
        id: editingItem?.id || null, 
        ...formData 
      });
      toast({ title: 'Berhasil', description: 'Master barang telah disimpan.' });
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal menyimpan data.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Hapus barang "${item.nama_barang}"?`)) return;
    try {
      await callBackend('deleteMasterBarang', { id: item.id });
      toast({ title: 'Berhasil', description: 'Barang telah dihapus.' });
      fetchData();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal menghapus data.' });
    }
  };

  const filtered = items.filter(i => 
    i.nama_barang.toLowerCase().includes(search.toLowerCase()) || 
    i.kategori.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Master Barang</h1>
          <p className="text-muted-foreground">Kelola daftar SKU, kategori, dan satuan stok.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSyncInitialData} disabled={syncing} className="h-12 px-6 rounded-xl border-primary/30 text-primary">
            {syncing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Database className="mr-2 h-5 w-5" />}
            Sinkron Data Awal
          </Button>
          <Button onClick={handleOpenAdd} className="h-12 px-6 rounded-xl primary-gradient font-bold shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-5 w-5" /> Tambah Barang
          </Button>
        </div>
      </div>

      <Card className="border-none bg-card card-shadow rounded-2xl overflow-hidden">
        <div className="p-4 border-b bg-muted/30">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cari barang atau kategori..." 
              className="pl-10 h-11 rounded-xl bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Memuat master data...</p>
            </div>
          ) : (
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {filtered.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/30">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold">{item.nama_barang}</p>
                        {!(String(item.aktif) === "true" || item.aktif === true) && <Badge variant="destructive">Nonaktif</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{item.kategori} • {item.satuan} • Min: {item.stok_minimum}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(item)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="p-12 text-center text-muted-foreground italic">
                  Tidak ada barang ditemukan.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Barang' : 'Tambah Barang Baru'}</DialogTitle>
              <DialogDescription>Masukkan detail SKU untuk kontrol stok.</DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="space-y-2">
                <Label>Nama Barang</Label>
                <Input 
                  required
                  placeholder="Cth: Mie Ayam" 
                  value={formData.nama_barang}
                  onChange={(e) => setFormData({ ...formData, nama_barang: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select 
                    value={formData.kategori} 
                    onValueChange={(v) => setFormData({ ...formData, kategori: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {KATEGORI_BARANG.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Satuan</Label>
                  <Input 
                    required
                    placeholder="Cth: Porsi / Gelas" 
                    value={formData.satuan}
                    onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Stok Minimum (Opsional)</Label>
                <Input 
                  type="number"
                  placeholder="0" 
                  value={formData.stok_minimum}
                  onChange={(e) => setFormData({ ...formData, stok_minimum: Number(e.target.value) })}
                />
                <p className="text-[10px] text-muted-foreground">Status "Perlu Stok" akan muncul jika stok fisik kurang dari nilai ini.</p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
              <Button type="submit" className="primary-gradient font-bold" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Barang
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
