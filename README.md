
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

## Google Apps Script v3.4 (Full Version)
Tempel kode berikut di Google Apps Script Anda:

```javascript
const SPREADSHEET_ID = 'GANTI_DENGAN_ID_SPREADSHEET_ANDA';

function doPost(e) {
  const action = e.parameter.action;
  const data = JSON.parse(e.postData.contents);
  let result = { success: false };

  try {
    if (action === 'addPengguna') result = addPengguna(data);
    else if (action === 'login') result = login(data);
    else if (action === 'getMasterBarang') result = getMasterBarang();
    else if (action === 'saveMasterBarang') result = saveMasterBarang(data);
    else if (action === 'bulkSaveMasterBarang') result = bulkSaveMasterBarang(data);
    else if (action === 'getStokHarian') result = getStokHarian(data);
    else if (action === 'saveStokHarian') result = saveStokHarian(data);
    else if (action === 'addBarangHabis') result = addBarangHabis(data);
    else if (action === 'getBarangHabis') result = getBarangHabis(data);
    else if (action === 'getDashboardStats') result = getDashboardStats(data);
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getMasterBarang() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('MasterBarang') || ss.insertSheet('MasterBarang');
  if(sheet.getLastRow() === 0) sheet.appendRow(['id', 'nama_barang', 'kategori', 'satuan', 'stok_minimum', 'aktif']);
  const rows = sheet.getDataRange().getValues().slice(1);
  return { data: rows.map(r => ({ id: r[0], nama_barang: r[1], kategori: r[2], satuan: r[3], stok_minimum: r[4], aktif: r[5] })) };
}

function getStokHarian(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(data.tanggal) || ss.insertSheet(data.tanggal);
  if(sheet.getLastRow() === 0) {
    sheet.appendRow(['id', 'stok_awal', 'prepare', 'terjual', 'stok_teoritis', 'stok_fisik', 'selisih', 'status', 'catatan', 'perlu_stock_manual']);
  }
  const rows = sheet.getDataRange().getValues().slice(1);
  const dailyMap = {};
  rows.forEach(r => { 
    dailyMap[r[0]] = { 
      stok_awal: r[1], prepare: r[2], terjual: r[3], stok_teoritis: r[4], 
      stok_fisik: r[5], selisih: r[6], status: r[7], catatan: r[8],
      perlu_stock_manual: r[9] 
    }; 
  });

  const master = getMasterBarang().data.filter(m => String(m.aktif) === "true" || m.aktif === true || m.aktif === "");
  return { data: master.map(m => {
    const daily = dailyMap[m.id] || {};
    return {
      id: m.id, nama_barang: m.nama_barang, kategori: m.kategori, satuan: m.satuan, stok_minimum: m.stok_minimum,
      stok_awal: daily.stok_awal || 0, prepare: daily.prepare || 0, terjual: daily.terjual || 0,
      stok_teoritis: daily.stok_teoritis || 0, stok_fisik: daily.stok_fisik || 0,
      selisih: daily.selisih || 0, status: daily.status || 'Balance', catatan: daily.catatan || '',
      perlu_stock_manual: daily.perlu_stock_manual === true || daily.perlu_stock_manual === "true"
    };
  })};
}

function saveStokHarian(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(data.tanggal) || ss.insertSheet(data.tanggal);
  if(sheet.getLastRow() === 0) sheet.appendRow(['id', 'stok_awal', 'prepare', 'terjual', 'stok_teoritis', 'stok_fisik', 'selisih', 'status', 'catatan', 'perlu_stock_manual']);
  const rows = sheet.getDataRange().getValues();
  const rowIndexMap = {};
  for(let i=1; i<rows.length; i++) rowIndexMap[rows[i][0]] = i + 1;
  data.items.forEach(item => {
    const rowData = [item.id, item.stok_awal, item.prepare, item.terjual, item.stok_teoritis, item.stok_fisik, item.selisih, item.status, item.catatan, item.perlu_stock_manual];
    if(rowIndexMap[item.id]) { sheet.getRange(rowIndexMap[item.id], 1, 1, 10).setValues([rowData]); } else { sheet.appendRow(rowData); }
  });
  return { success: true };
}

// ... Tambahkan fungsi addBarangHabis, getBarangHabis, getDashboardStats, login sesuai kebutuhan
```
