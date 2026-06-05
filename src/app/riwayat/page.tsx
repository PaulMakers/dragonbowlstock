
"use client"

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { callBackend } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Calendar as CalendarIcon, 
  Loader2,
  Package,
  History,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export default function RiwayatPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState<Date>(new Date());

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const formattedDate = format(date, 'dd MMMM yyyy', { locale: localeId });
      const res = await callBackend('getBarangHabis', { tanggal: formattedDate });
      setItems(res.data || []);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat riwayat.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [date]);

  const filteredItems = items.filter(i => 
    i.namaBarang.toLowerCase().includes(search.toLowerCase()) ||
    i.inputOleh.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Riwayat Laporan</h1>
          <p className="text-muted-foreground">Telusuri laporan barang dari hari-hari sebelumnya.</p>
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
            <PopoverContent className="w-auto p-0" align="end">
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

      <Card className="border-none card-shadow rounded-2xl overflow-hidden bg-card">
        <div className="p-4 border-b bg-muted/30 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cari barang atau pelapor..." 
              className="pl-10 h-11 rounded-xl bg-background/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-11 rounded-xl gap-2 hidden sm:flex">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Mengambil riwayat data...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 px-6 hover:bg-muted/30 transition-colors gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">{item.namaBarang}</p>
                      <p className="text-xs text-muted-foreground">Dilaporkan oleh {item.inputOleh} • {item.timestamp}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 justify-between sm:justify-end flex-1">
                    <div className="text-right">
                      <p className="font-bold">{item.jumlah} {item.satuan}</p>
                      <Badge variant={item.status === 'Habis' ? 'destructive' : 'secondary'} className="text-[10px] h-5 uppercase">
                        {item.status}
                      </Badge>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center">
              <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <History className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-xl font-headline font-bold mb-2">Tidak Ada Riwayat</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Tidak ditemukan data laporan pada tanggal <strong>{format(date, 'dd MMMM yyyy', { locale: localeId })}</strong>.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
