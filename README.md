
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
Salin dan tempel kode berikut di Extensions > Apps Script pada Google Sheets Anda:

```javascript
/**
 * Dragon Bowl Stock Management - Backend Script (v3.4)
 * Menambahkan dukungan kolom ke-10: perlu_stock_manual
 */

const SPREADSHEET_ID = 'GANTI_DENGAN_ID_SPREADSHEET_ANDA';

function doPost(e) {
  const action = e.parameter.action;
  const data = JSON.parse(e.postData.contents);
  let result = { success: false };

  try {
    if (action === 'addPengguna') result = addPengguna(data);
    else if (action === 'login') result = login(data);
    else if (action === 'getPengguna') result = getPengguna();
    else if (action === 'updatePengguna') result = updatePengguna(data);
    else if (action === 'deletePengguna') result = deletePengguna(data);
    else if (action === 'getMasterBarang') result = getMasterBarang();
    else if (action === 'saveMasterBarang') result = saveMasterBarang(data);
    else if (action === 'bulkSaveMasterBarang') result = bulkSaveMasterBarang(data);
    else if (action === 'deleteMasterBarang') result = deleteMasterBarang(data);
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

function saveMasterBarang(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('MasterBarang');
  const rows = sheet.getDataRange().getValues();
  const id = data.id || Utilities.getUuid();
  const rowData = [id, data.nama_barang, data.kategori, data.satuan, data.stok_minimum, data.aktif];
  
  let rowIndex = -1;
  for(let i=1; i<rows.length; i++) if(rows[i][0] === id) rowIndex = i + 1;
  
  if(rowIndex > 0) sheet.getRange(rowIndex, 1, 1, 6).setValues([rowData]);
  else sheet.appendRow(rowData);
  return { success: true };
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

function addPengguna(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Pengguna') || ss.insertSheet('Pengguna');
  if(sheet.getLastRow() === 0) sheet.appendRow(['id', 'username', 'password', 'nama', 'role']);
  const id = Utilities.getUuid();
  sheet.appendRow([id, data.username, data.password, data.nama, data.role]);
  return { success: true };
}

function login(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Pengguna');
  if(!sheet) return { success: false, error: 'Belum ada pengguna' };
  const rows = sheet.getDataRange().getValues().slice(1);
  const user = rows.find(r => r[1] === data.username && String(r[2]) === String(data.password));
  if(user) return { success: true, user: { id: user[0], username: user[1], nama: user[3], role: user[4] } };
  return { success: false, error: 'Username atau password salah' };
}

function addBarangHabis(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('LogHabis') || ss.insertSheet('LogHabis');
  if(sheet.getLastRow() === 0) sheet.appendRow(['id', 'tanggal', 'timestamp', 'namaBarang', 'jumlah', 'satuan', 'status', 'catatan', 'inputOleh', 'kategori']);
  const id = Utilities.getUuid();
  const now = new Date();
  const timestamp = Utilities.formatDate(now, "GMT+7", "HH:mm");
  sheet.appendRow([id, data.tanggal, timestamp, data.namaBarang, data.jumlah, data.satuan, data.status, data.catatan, data.inputOleh, data.kategori]);
  return { success: true };
}

function getBarangHabis(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('LogHabis');
  if(!sheet) return { data: [] };
  const rows = sheet.getDataRange().getValues().slice(1);
  let filtered = rows;
  if(data.tanggal) filtered = rows.filter(r => r[1] === data.tanggal);
  const result = filtered.reverse().map(r => ({
    id: r[0], tanggal: r[1], timestamp: r[2], namaBarang: r[3], jumlah: r[4], satuan: r[5], status: r[6], catatan: r[7], inputOleh: r[8], kategori: r[9]
  }));
  return { data: data.limit ? result.slice(0, data.limit) : result };
}

function getDashboardStats(data) {
  const master = getMasterBarang().data;
  const stokRes = getStokHarian({ tanggal: data.today });
  const items = stokRes.data;
  
  const needStock = items.filter(i => {
    const isAuto = Number(i.stok_fisik) > 0 && Number(i.stok_fisik) <= Number(i.stok_minimum);
    return isAuto || i.perlu_stock_manual === true || i.perlu_stock_manual === "true";
  }).length;
  
  const prepareToday = items.reduce((acc, curr) => acc + (Number(curr.prepare) || 0), 0);
  const selisihCount = items.filter(i => i.status === 'Selisih').length;

  return {
    totalSku: master.length,
    prepareToday: prepareToday,
    needStock: needStock,
    selisihCount: selisihCount
  };
}
```
