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
  Users,
  ShieldCheck,
  UserCircle,
  Database,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const INITIAL_PEGAWAI = [
  { nama: 'Candra', username: 'candra', password: 'Candra#88', role: 'pegawai' },
  { nama: 'Novia', username: 'novia', password: 'Novia#92', role: 'pegawai' },
  { nama: 'Indri', username: 'indri', password: 'Indri#75', role: 'pegawai' },
  { nama: 'Nanda', username: 'nanda', password: 'Nanda#84', role: 'pegawai' },
  { nama: 'Lidia', username: 'lidia', password: 'Lidia#67', role: 'pegawai' },
  { nama: 'Arya', username: 'arya', password: 'Arya#95', role: 'pegawai' },
];

export default function PenggunaPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '', 
    nama: '', 
    role: 'pegawai' 
  });
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await callBackend('getPengguna');
      setUsers(res.data || []);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat data pengguna.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({ username: '', password: '', nama: '', role: 'pegawai' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setEditingUser(user);
    setFormData({ 
      username: user.username, 
      password: user.password, 
      nama: user.nama, 
      role: user.role 
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (user: any) => {
    if (user.username === 'admin') {
      toast({ variant: 'destructive', title: 'Akses Ditolak', description: 'Akun admin utama tidak bisa dihapus.' });
      return;
    }
    if (!confirm(`Hapus pengguna "${user.nama}"?`)) return;
    
    try {
      await callBackend('deletePengguna', { id: user.id });
      toast({ title: 'Berhasil', description: 'Pengguna telah dihapus.' });
      fetchUsers();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal menghapus pengguna.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingUser) {
        await callBackend('updatePengguna', { id: editingUser.id, ...formData });
        toast({ title: 'Berhasil', description: 'Data pengguna diperbarui.' });
      } else {
        await callBackend('addPengguna', formData);
        toast({ title: 'Berhasil', description: 'Pengguna baru ditambahkan.' });
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal menyimpan data.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSeedPegawai = async () => {
    if (!confirm('Masukkan ke-6 data pegawai otomatis?')) return;
    
    setSeeding(true);
    let count = 0;
    try {
      const existingUsernames = new Set(users.map(u => u.username.toLowerCase()));
      
      for (const p of INITIAL_PEGAWAI) {
        if (!existingUsernames.has(p.username.toLowerCase())) {
          await callBackend('addPengguna', p);
          count++;
        }
      }
      
      toast({ 
        title: 'Seed Berhasil', 
        description: `${count} pegawai baru telah ditambahkan ke sistem.` 
      });
      fetchUsers();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal melakukan seed data pegawai.' });
    } finally {
      setSeeding(false);
    }
  };

  const togglePassword = (id: string) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredUsers = users.filter(u => 
    u.nama.toLowerCase().includes(search.toLowerCase()) || 
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Manajemen Pengguna</h1>
          <p className="text-muted-foreground">Kelola akun admin dan pegawai untuk akses sistem.</p>
        </div>
        <div className="flex gap-2">
          {users.length <= 1 && !loading && (
            <Button onClick={handleSeedPegawai} variant="outline" className="h-12 px-6 rounded-xl border-primary/40 text-primary hover:bg-primary/5" disabled={seeding}>
              {seeding ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Database className="mr-2 h-5 w-5" />}
              Seed Data Pegawai
            </Button>
          )}
          <Button onClick={handleOpenAdd} className="h-12 px-6 rounded-xl primary-gradient font-semibold">
            <Plus className="mr-2 h-5 w-5" /> Tambah Pengguna
          </Button>
        </div>
      </div>

      <Card className="border-none card-shadow rounded-2xl overflow-hidden bg-card">
        <div className="p-4 border-b bg-muted/30">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cari nama atau username..." 
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
              <p className="text-muted-foreground">Memuat data pengguna...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 px-6 hover:bg-muted/30 transition-colors gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg",
                      user.role === 'admin' ? "bg-primary/10 text-primary" : "bg-blue-500/10 text-blue-500"
                    )}>
                      {user.role === 'admin' ? <ShieldCheck className="h-6 w-6" /> : <UserCircle className="h-6 w-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-lg">{user.nama}</p>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-[10px] h-5 px-1.5 uppercase">
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Username: <span className="font-mono">{user.username}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end flex-1">
                    <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-lg border">
                      <p className="text-sm font-mono">
                        {showPassword[user.id] ? user.password : '••••••••'}
                      </p>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => togglePassword(user.id)}>
                        {showPassword[user.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(user)} className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(user)} 
                        className="h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive"
                        disabled={user.username === 'admin'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center">
              <Users className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-headline text-xl font-bold">Tidak ditemukan</h3>
              <p className="text-muted-foreground mt-2">Data pengguna tidak ditemukan untuk pencarian ini.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline">{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna'}</DialogTitle>
              <DialogDescription>
                Lengkapi informasi akun di bawah ini.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input 
                  id="nama" 
                  placeholder="Cth: Candra" 
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  required
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    placeholder="candra" 
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                    required
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(v) => setFormData({ ...formData, role: v })}
                  >
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Pilih Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pegawai">Pegawai</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="text"
                  placeholder="Password#123" 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="h-11 rounded-xl font-mono"
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="h-11 px-6 rounded-xl">Batal</Button>
              <Button type="submit" className="h-11 px-8 rounded-xl primary-gradient font-bold" disabled={submitting}>
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
