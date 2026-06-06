# Dragon Bowl Stock Management

Sistem manajemen stok cerdas untuk Dragon Bowl Cafe & Restaurant menggunakan Next.js dan Google Sheets sebagai database.

## Struktur Database (Google Sheets)

Aplikasi ini membutuhkan struktur kolom tertentu di Google Sheets:

### 1. Sheet `pengguna`
Kolom: `id | username | password | nama | role`

### 2. Sheet `master_barang`
Kolom: `id | namaBarang | kategori | createdAt`

### 3. Sheet Transaksi (Nama Sheet = Tanggal, misal: "05 Juni 2024")
Kolom (10 Kolom):
1. `id`
2. `timestamp`
3. `tanggal`
4. `namaBarang`
5. `jumlah`
6. `satuan`
7. `status`
8. `catatan`
9. `inputOleh`
10. `kategori`

## Pengaturan Google Apps Script

1. Buka Google Sheets Anda.
2. Klik **Extensions > Apps Script**.
3. Salin kode dari file `Code.gs` yang disediakan asisten.
4. Klik **Deploy > New Deployment**.
5. Pilih **Web App**, set akses ke **"Anyone"**.
6. Salin URL hasil deploy ke file `src/lib/constants.ts` di aplikasi ini.
