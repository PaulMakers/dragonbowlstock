import { APPS_SCRIPT_URL } from './constants';

export async function callBackend(action: string, payload: any = {}) {
  try {
    const url = new URL(APPS_SCRIPT_URL);
    url.searchParams.append('action', action);

    const response = await fetch(url.toString(), {
      method: 'POST',
      mode: 'cors',
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
      throw new Error(`Invalid JSON: ${text.substring(0, 100)}`);
    }

    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (error: any) {
    console.error(`Backend API Error [${action}]:`, error.message);
    throw error;
  }
}
