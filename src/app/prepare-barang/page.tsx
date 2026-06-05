
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
  Search, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  Square,
  Loader2,
  Filter,
  Package,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

export default function PrepareBarangPage() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState<Record<string, { jumlah: string; satuan: string; checked: boolean }>>({});

  const fetchItems = async () => {
    setLoading(true);
    try {
      const formattedDate = format(date, 'dd MMMM yyyy', { locale: localeId });
      const res = await callBackend('getBarangHabis', { tanggal: formattedDate });
      setItems(res.data || []);
      
      const selections: any = {};
      (res.data || []).forEach((item: any) => {
        selections[item.id] = {
          jumlah: item.jumlah || '',
          satuan: item.satuan || '',
          checked: item.status === 'Sudah Tersedia'
        };
      });
      setSelectedItems(selections);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [date]);

  const toggleCheck = (id: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: { ...prev[id], checked: !prev[id].checked }
    }));
  };

  const updateDetail = (id: string, field: 'jumlah' | 'satuan', value: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleUpdateStatus = async (item: any) => {
    const selection = selectedItems[item.id];
    if (!selection.checked) return;

    try {
      await callBackend('updateStatus', {
        id: item.id,
        tanggal: item.tanggal,
        status: 'Sudah Tersedia',
        jumlah: selection.jumlah,
        satuan: selection.satuan
      });
      toast({ title: 'Diperbarui', description: `${item.namaBarang} ditandai sudah tersedia.` });
      fetchItems();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal memperbarui status.' });
    }
  };

  const filteredItems = items.filter(i => i.namaBarang.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Prepare Barang</h1>
          <p className="text-muted-foreground">Checklist barang yang sudah datang untuk restock.</p>
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
          <Button onClick={fetchItems} variant="ghost" size="icon" className="h-12 w-12 rounded-xl border">
            <Loader2 className={cn("h-5 w-5", loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      <Card className="border-none card-shadow rounded-2xl overflow-hidden bg-card">
        <div className="p-4 border-b bg-muted/30 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cari barang..." 
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
              <p className="text-muted-foreground">Sedang mengambil data laporan...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredItems.map((item) => {
                const selection = selectedItems[item.id] || { jumlah: '', satuan: '', checked: false };
                const isRestocked = item.status === 'Sudah Tersedia';
                
                return (
                  <div key={item.id} className={cn(
                    "flex flex-col sm:flex-row sm:items-center gap-4 p-4 lg:p-6 transition-colors",
                    selection.checked ? "bg-green-500/5" : "hover:bg-muted/30"
                  )}>
                    <div className="flex items-start gap-4 flex-1">
                      <div className="pt-1">
                        <Checkbox 
                          checked={selection.checked} 
                          onCheckedChange={() => toggleCheck(item.id)}
                          disabled={isRestocked}
                          className="h-6 w-6 rounded-md border-2"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={cn("font-bold text-lg", selection.checked && "text-muted-foreground line-through")}>
                            {item.namaBarang}
                          </h4>
                          <Badge variant={isRestocked ? "secondary" : "destructive"} className="text-[10px] h-5 px-1.5 uppercase tracking-wider">
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Dilaporkan oleh {item.inputOleh} pukul {item.timestamp}</p>
                        {item.catatan && (
                          <p className="text-xs text-primary mt-1 italic font-medium">Catatan: {item.catatan}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:w-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-20">
                          <Label className="text-[10px] uppercase text-muted-foreground mb-1 block">Jumlah Datang</Label>
                          <Input 
                            type="number"
                            className="h-9 text-center font-bold"
                            value={selection.jumlah}
                            onChange={(e) => updateDetail(item.id, 'jumlah', e.target.value)}
                            disabled={isRestocked}
                          />
                        </div>
                        <div className="w-24">
                          <Label className="text-[10px] uppercase text-muted-foreground mb-1 block">Satuan</Label>
                          <Input 
                            className="h-9"
                            placeholder="Cth: Pack"
                            value={selection.satuan}
                            onChange={(e) => updateDetail(item.id, 'satuan', e.target.value)}
                            disabled={isRestocked}
                          />
                        </div>
                      </div>
                      <div className="pt-5">
                         {!isRestocked ? (
                          <Button 
                            size="sm" 
                            className="h-9 px-4 rounded-lg primary-gradient"
                            disabled={!selection.checked}
                            onClick={() => handleUpdateStatus(item)}
                          >
                            Update
                          </Button>
                        ) : (
                          <div className="h-9 w-9 bg-green-500 rounded-full flex items-center justify-center text-white">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-20 text-center">
              <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-xl font-headline font-bold mb-2">Tidak Ada Data</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Belum ada laporan barang habis pada tanggal <strong>{format(date, 'dd MMMM yyyy', { locale: localeId })}</strong>. 
                Silakan pilih tanggal lain atau lapor melalui menu Barang Habis.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
