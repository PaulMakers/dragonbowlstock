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
  CheckCircle2,
  XCircle
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

export default function MasterBarangPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ 
    nama_barang: '', 
    kategori: 'Lain-Lain', 
    satuan: 'Pcs',
    stok_minimum: 0,
    aktif: true 
  });
  const [submitting, setSubmitting] = useState(false);

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

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ nama_barang: '', kategori: 'Lain-Lain', satuan: 'Pcs', stok_minimum: 0, aktif: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ 
      nama_barang: item.nama_barang, 
      kategori: item.kategori, 
      satuan: item.satuan,
      stok_minimum: item.stok_minimum,
      aktif: item.aktif 
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
    if (!confirm(`Hapus atau nonaktifkan barang "${item.nama_barang}"?`)) return;
    try {
      await callBackend('saveMasterBarang', { ...item, aktif: false });
      toast({ title: 'Berhasil', description: 'Barang telah dinonaktifkan.' });
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
        <Button onClick={handleOpenAdd} className="h-12 px-6 rounded-xl primary-gradient font-bold shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-5 w-5" /> Tambah Barang
        </Button>
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
            <div className="divide-y">
              {filtered.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/30">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold">{item.nama_barang}</p>
                        {!item.aktif && <Badge variant="destructive">Nonaktif</Badge>}
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
