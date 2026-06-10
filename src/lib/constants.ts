export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxmZe8USb9g7INkig6Xt4PV-BGt5eLe8gD-61V-RZ_pyzh7H28U4fg8-eA3swNpZoQ/exec';
export const LOGO_URL = 'https://i.ibb.co.com/0R3MsqSp/Logo-Dragonbowl-removebg-preview.png';

export const KATEGORI_BARANG = [
  'Dapur/Kitchen',
  'Beverage/Minuman',
  'Depan/Kulkas',
  'Dll/Perlengkapan'
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
  id: string;
  nama_barang: string;
  kategori: string;
  satuan: string;
  stok_minimum: number;
  stok_awal: number;
  prepare: number;
  terjual: number;
  stok_teoritis: number;
  stok_fisik: number;
  selisih: number;
  status: 'Balance' | 'Selisih';
  catatan: string;
  perlu_stock_manual: boolean;
}
