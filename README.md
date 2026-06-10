# Dragon Bowl Stock Management

Sistem manajemen stok cerdas untuk Dragon Bowl Cafe & Restaurant menggunakan Next.js dan Google Sheets sebagai database.

## Struktur Database (Google Sheets)

Aplikasi ini menggunakan struktur 10 kolom pada setiap sheet transaksi harian:
`id | timestamp | tanggal | namaBarang | jumlah | satuan | status | catatan | inputOleh | kategori`

### Rumus Bisnis
1. **Stok Teoritis** = Stok Awal + Prepare - Terjual
2. **Selisih** = Stok Fisik - Stok Teoritis
3. **Status** = "Balance" (jika selisih 0) atau "Selisih" (jika tidak 0)
4. **Perlu Stock** = Otomatis menyala jika `Stok Fisik <= Stok Minimum`

## Pengaturan Google Apps Script (v3.3)

1. Buka Google Sheets Anda.
2. Klik **Extensions > Apps Script**.
3. Pastikan menggunakan kode **v3.3 FULL VERSION** yang mendukung fitur *Bulk Save* dan *Dashboard Stats*.
4. Klik **Deploy > New Deployment**.
5. Pilih **Web App**, set akses ke **"Anyone"**.
6. Salin URL hasil deploy ke file `src/lib/constants.ts`.

## Masalah Autentikasi Git (Push)

Jika Anda menemui error `Authentication failed` saat `git push`, gunakan **Personal Access Token (PAT)**:
1. Generate PAT di GitHub (Settings > Developer Settings).
2. Jalankan perintah: 
   `git remote set-url origin https://USERNAME:TOKEN@github.com/PaulMakers/dragonbowlstock.git`
3. Lakukan `git push` kembali.
