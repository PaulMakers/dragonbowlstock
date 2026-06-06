export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwmK3qN-zq0eBchf0dQV9nLSWtEP3TQ9lV0WZt1FfUgE3SRiilD7PVBZo48BsZQFPO-/exec';
export const LOGO_URL = 'https://i.ibb.co.com/0R3MsqSp/Logo-Dragonbowl-removebg-preview.png';

export const STATUS_OPTIONS = [
  'Habis',
  'Tersedia',
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
