
# Dragon Bowl Stock Management

Sistem manajemen stok cerdas untuk Dragon Bowl Cafe & Restaurant menggunakan Next.js dan Google Sheets sebagai database.

## Fitur Unggulan AI
Aplikasi ini dilengkapi dengan **Lapor Cepat via AI**. Anda bisa menyalin catatan stok dari WhatsApp dan menempelnya ke aplikasi, sistem akan otomatis mengenali nama barang dan jumlahnya.

### Cara Mendapatkan API Key AI (Gratis)
1. Buka [Google AI Studio](https://aistudio.google.com/).
2. Login dengan akun Google Anda.
3. Klik **"Get API key"** di menu samping.
4. Klik **"Create API key"**.
5. Salin kodenya dan masukkan ke file `.env` pada variabel `GOOGLE_GENAI_API_KEY`.

## Struktur Database (Google Sheets)
Aplikasi menggunakan struktur 10 kolom:
`id | stok_awal | prepare | terjual | stok_teoritis | stok_fisik | selisih | status | catatan | perlu_stock_manual`

## Pengaturan Google Apps Script (v3.4)
1. Buka Google Sheets Anda.
2. Klik **Extensions > Apps Script**.
3. Gunakan kode **v3.4 FULL VERSION** (mendukung kolom ke-10 untuk Toggle Perlu Stok).
4. Klik **Deploy > New Deployment**.
5. Pilih **Web App**, set akses ke **"Anyone"**.
6. Salin URL hasil deploy ke file `src/lib/constants.ts`.

## Autentikasi Git
Jika `git push` gagal (Authentication failed):
1. Buat **Personal Access Token (PAT)** di GitHub Settings.
2. Jalankan: `git remote set-url origin https://USERNAME:TOKEN@github.com/PaulMakers/dragonbowlstock.git`
