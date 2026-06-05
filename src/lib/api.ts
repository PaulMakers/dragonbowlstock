import { APPS_SCRIPT_URL } from './constants';

export async function callBackend(action: string, payload: any = {}) {
  try {
    const params = new URLSearchParams();
    params.append('action', action);
    params.append('contents', JSON.stringify(payload));

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
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
      // We throw a descriptive error to help with debugging the backend response content.
      throw new Error(`Server returned invalid JSON response: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`);
    }

    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (error: any) {
    const finalError = error instanceof Error ? error : new Error(String(error));
    console.error('Backend API Error:', finalError.message);
    throw finalError;
  }
}
