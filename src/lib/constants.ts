export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwJG3qFGW4EUT0DIPB-8gYv4pK_fTZH2a3hdsY5DdOfXWIGYYE9AIbcXWDc97BKC_pV/exec';
export const LOGO_URL = 'https://i.ibb.co.com/0R3MsqSp/Logo-Dragonbowl-removebg-preview.png';

export const STATUS_OPTIONS = [
  'Belum Dicek',
  'Habis',
  'Sedang Dibeli',
  'Sudah Tersedia'
] as const;

export type StatusType = (typeof STATUS_OPTIONS)[number];
