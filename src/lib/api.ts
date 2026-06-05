import { APPS_SCRIPT_URL } from './constants';

export async function callBackend(action: string, payload: any = {}) {
  try {
    // GAS doPost(e) reads action from e.parameter.action (URL query params or form fields)
    // and payload from e.postData.contents (raw body).
    const url = new URL(APPS_SCRIPT_URL);
    url.searchParams.append('action', action);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        // Use text/plain to avoid CORS preflight (simple request).
        'Content-Type': 'text/plain',
      },
      // Send the payload as a raw JSON string to satisfy JSON.parse(e.postData.contents)
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
      // If the response is not valid JSON, it might be an error page or an echo of the request.
      throw new Error(`Server returned invalid JSON response: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`);
    }

    if (data.error) {
      // Special handling for common initial setup errors
      if (data.error.includes('tidak ditemukan')) {
        throw new Error(`${data.error}. Silakan klik tombol 'Inisialisasi Admin' di halaman login terlebih dahulu.`);
      }
      throw new Error(data.error);
    }
    
    return data;
  } catch (error: any) {
    const finalError = error instanceof Error ? error : new Error(String(error));
    console.error('Backend API Error:', finalError.message);
    throw finalError;
  }
}
