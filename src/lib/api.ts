
import { APPS_SCRIPT_URL } from './constants';

export async function callBackend(action: string, payload: any = {}) {
  console.log(`Calling Backend: ${action}`, payload);
  try {
    const url = new URL(APPS_SCRIPT_URL);
    url.searchParams.append('action', action);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(payload),
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
      if (data.error.includes('tidak ditemukan') || data.error.includes("reading 'appendRow'")) {
        throw new Error(`${data.error}. Silakan klik tombol 'Inisialisasi Admin' di halaman login terlebih dahulu atau pastikan Sheet 'master_barang' sudah ada.`);
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
