"use client"

import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { callBackend } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LOGO_URL } from '@/lib/constants';
import { Loader2, Lock, User as UserIcon, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await callBackend('login', { username, password });
      if (response.success) {
        login(response.user);
        toast({ title: "Login Berhasil", description: `Selamat datang, ${response.user.nama}` });
        router.push('/dashboard');
      } else {
        toast({ 
          variant: "destructive", 
          title: "Login Gagal", 
          description: response.error || "Username atau password salah." 
        });
      }
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Terjadi Kesalahan", 
        description: err.message || "Gagal menghubungi server." 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBootstrapAdmin = async () => {
    if (!confirm('Buat akun admin master (admin/dragonbowl) sekarang?')) return;
    
    setBootstrapping(true);
    try {
      await callBackend('addPengguna', { 
        username: 'admin', 
        password: 'dragonbowl', 
        nama: 'Administrator', 
        role: 'admin' 
      });
      toast({ 
        title: "Berhasil", 
        description: "Akun admin (admin/dragonbowl) telah dibuat. Silakan login." 
      });
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Gagal", 
        description: "Gagal membuat akun admin atau akun mungkin sudah ada." 
      });
    } finally {
      setBootstrapping(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -ml-48 -mb-48" />
      
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <img src={LOGO_URL} alt="Dragon Bowl" className="h-24 w-auto mx-auto mb-4 drop-shadow-xl" />
          <h1 className="font-headline text-2xl font-bold text-primary tracking-tight">Dragonbowl Stock Management</h1>
          <p className="text-muted-foreground mt-2 font-medium">Sistem Manajemen Stok Terpadu</p>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl rounded-2xl">
          <CardHeader className="space-y-1 pt-8">
            <CardTitle className="text-2xl font-bold">Masuk ke Akun</CardTitle>
            <CardDescription>
              Silakan masukkan username dan password Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="username" 
                    placeholder="admin" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="pl-10 h-12 bg-background/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-12 bg-background/50"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold primary-gradient shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-xl"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : "Masuk Sekarang"}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/50 text-center">
              <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">Pengaturan Awal</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full h-10 rounded-xl border-primary/20 hover:bg-primary/5 text-primary gap-2"
                onClick={handleBootstrapAdmin}
                disabled={bootstrapping}
              >
                {bootstrapping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldAlert className="h-4 w-4" />
                )}
                Inisialisasi Admin (admin/dragonbowl)
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground mt-8">
          &copy; {new Date().getFullYear()} Dragon Bowl. All rights reserved.
        </p>
      </div>
    </div>
  );
}
