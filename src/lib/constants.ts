export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxa9VzpWU36--sZv8ZUfVTZk2fDxL65zClbHgR5PHANDJulf-bmh2WS4ariZvHrddoF/exec';
export const LOGO_URL = 'https://i.ibb.co.com/0R3MsqSp/Logo-Dragonbowl-removebg-preview.png';

export const STATUS_OPTIONS = [
  'Belum Dicek',
  'Habis',
  'Sedang Dibeli',
  'Sudah Tersedia'
] as const;

export type StatusType = (typeof STATUS_OPTIONS)[number];