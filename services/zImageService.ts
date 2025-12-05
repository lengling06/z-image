import { GenerateRequest, GenerateResponse } from '../types';

const API_URL = 'https://nxugwxervbsraegfxjsv.supabase.co/functions/v1/z-image-api';

export const generateImage = async (
  apiKey: string,
  request: GenerateRequest
): Promise<GenerateResponse> => {
  if (!apiKey) {
    throw new Error('API Key is missing. Please configure it in settings.');
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401) {
        throw new Error('Unauthorized: Invalid API Key.');
      }
      if (response.status === 422) {
        throw new Error('Validation Error: Please check your prompt or seed.');
      }
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    const data: GenerateResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Image Generation Failed:', error);
    throw error;
  }
};