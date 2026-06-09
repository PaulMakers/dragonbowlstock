export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwmK3qN-zq0eBchf0dQV9nLSWtEP3TQ9lV0WZt1FfUgE3SRiilD7PVBZo48BsZQFPO-/exec';
export const LOGO_URL = 'https://i.ibb.co.com/0R3MsqSp/Logo-Dragonbowl-removebg-preview.png';

export const KATEGORI_BARANG = [
  'Dapur/Kitchen',
  'Beverage/Minuman',
  'Depan/Kulkas',
  'Packaging/Cup',
  'Lain-Lain'
] as const;

export type KategoriType = (typeof KATEGORI_BARANG)[number];

export interface MasterBarang {
  id: string;
  nama_barang: string;
  kategori: string;
  satuan: string;
  stok_minimum: number;
  aktif: boolean;
}

export interface StokHarian {
  barang_id: string;
  nama_barang?: string;
  kategori?: string;
  satuan?: string;
  stok_awal: number;
  prepare: number;
  terjual: number;
  stok_teoritis: number;
  stok_fisik: number;
  selisih: number;
  status: 'Balance' | 'Selisih';
  catatan: string;
}
