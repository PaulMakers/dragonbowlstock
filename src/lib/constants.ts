export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxRx0_SM_oG7kY921dS8SsBjWgCQ5F9baw51hjqrkt-ofc8QRU8L1znCCqgY0tzcvvV/exec';
export const LOGO_URL = 'https://i.ibb.co.com/0R3MsqSp/Logo-Dragonbowl-removebg-preview.png';

export const STATUS_OPTIONS = [
  'Belum Dicek',
  'Habis',
  'Sedang Dibeli',
  'Sudah Tersedia'
] as const;

export const KATEGORI_BARANG = [
  'Dapur/Kitchen',
  'Beverage',
  'Kulkas/Bagian Depan',
  'Packaging/Cup',
  'Bumbu/DLL',
  'Sayuran',
  'Lain-Lain'
] as const;

export type StatusType = (typeof STATUS_OPTIONS)[number];
export type KategoriType = (typeof KATEGORI_BARANG)[number];
