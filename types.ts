export interface GenerateRequest {
  prompt: string;
  seed?: number | null;
}

export interface GenerateResponse {
  status: string;
  base64: string;
  prompt: string;
}

export interface ApiError {
  detail?: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
  error?: {
    code: string;
    message: string;
  };
}

export interface HistoryItem {
  id: string;
  prompt: string;
  base64: string;
  timestamp: number;
  seed: number | null;
}