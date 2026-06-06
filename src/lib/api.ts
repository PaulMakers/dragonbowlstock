import { APPS_SCRIPT_URL } from './constants';

export async function callBackend(action: string, payload: any = {}) {
  console.log(`Calling Backend: ${action}`, payload);
  try {
    const url = new URL(APPS_SCRIPT_URL);
    url.searchParams.append('action', action);

    // Menggunakan mode: 'cors' dan mengabaikan preflight jika memungkinkan dengan text/plain
    const response = await fetch(url.toString(), {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(payload),
    }).catch(err => {
      // Menangkap error network seperti Failed to fetch
      if (err.message === 'Failed to fetch') {
        throw new Error('Gagal terhubung ke Google Script. Pastikan Anda memiliki koneksi internet dan skrip sudah di-deploy sebagai "Anyone".');
      }
      throw err;
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error(`Server returned invalid JSON response: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`);
    }

    if (data.error) {
      // Penanganan khusus untuk error yang sering muncul dari Apps Script
      if (data.error.includes('tidak ditemukan') || data.error.includes("reading 'appendRow'") || data.error.includes('null')) {
        throw new Error(`Masalah database (Sheet). Pastikan Sheet sudah diinisialisasi melalui tombol Admin.`);
      }
      throw new Error(data.error);
    }
    
    return data;
  } catch (error: any) {
    const finalError = error instanceof Error ? error : new Error(String(error));
    console.error(`Backend API Error [${action}]:`, finalError.message);
    throw finalError;
  }
}
