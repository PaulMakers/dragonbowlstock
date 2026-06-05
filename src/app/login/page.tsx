
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
import { Loader2, Lock, User as UserIcon, ShieldAlert, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(false);
  const [confirmInit, setConfirmInit] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setLoading(true);
    try {
      const response = await callBackend('login', { username, password });
      if (response.success) {
        login(response.user);
        toast({ title: "Login Berhasil", description: `Selamat datang, ${response.user.nama}` });
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Login Gagal", 
        description: err.message || "Gagal menghubungi server." 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBootstrapAdmin = async () => {
    setBootstrapping(true);
    try {
      const res = await callBackend('addPengguna', { 
        username: 'admin', 
        password: 'dragonbowl', 
        nama: 'Administrator', 
        role: 'admin' 
      });
      
      if (res.success) {
        toast({ 
          title: "Berhasil", 
          description: "Akun admin (admin/dragonbowl) telah dibuat. Silakan login sekarang." 
        });
        setConfirmInit(false);
      }
    } catch (err: any) {
      console.error('Bootstrap Error:', err);
      toast({ 
        variant: "destructive", 
        title: "Gagal Inisialisasi", 
        description: err.message || "Gagal membuat akun admin. Pastikan URL Apps Script benar dan sudah di-deploy sebagai 'Anyone'." 
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

        <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
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

            <div className="mt-8 pt-6 border-t border-border/50">
              {!confirmInit ? (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">Pengaturan Awal</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full h-10 rounded-xl border-primary/20 hover:bg-primary/5 text-primary gap-2"
                    onClick={() => setConfirmInit(true)}
                  >
                    <ShieldAlert className="h-4 w-4" />
                    Inisialisasi Admin (admin/dragonbowl)
                  </Button>
                </div>
              ) : (
                <Alert className="bg-primary/5 border-primary/20 animate-in fade-in zoom-in duration-200">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  <AlertTitle className="text-sm font-bold">Konfirmasi Inisialisasi</AlertTitle>
                  <AlertDescription className="text-xs mt-1">
                    Ini akan membuat sheet baru dan akun admin utama di Google Sheets Anda. Lanjutkan?
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        className="h-8 flex-1 primary-gradient" 
                        onClick={handleBootstrapAdmin}
                        disabled={bootstrapping}
                      >
                        {bootstrapping ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                        Ya, Buat
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 flex-1" 
                        onClick={() => setConfirmInit(false)}
                        disabled={bootstrapping}
                      >
                        Batal
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
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
