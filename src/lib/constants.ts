export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwCf2Z-TxLAAHV44zcYVE3uXWPIUB1BIuowmtDg-IhsnbHb67Fj-bXp52gp86ODcRPm/exec';
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
