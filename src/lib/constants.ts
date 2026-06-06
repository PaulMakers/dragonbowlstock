export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwQeZ7nJqp98mi08feyEnPPF1se9awhErYAKo1X9LAVnsMPPeudrl5K14oRC5vPYF2j/exec';
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
  'Lain-Lain'
] as const;

export type StatusType = (typeof STATUS_OPTIONS)[number];
export type KategoriType = (typeof KATEGORI_BARANG)[number];
