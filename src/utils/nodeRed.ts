// src/utils/nodeRed.ts

const DEFAULT_NODE_RED_URL = 'http://192.168.0.140:1880';

export function getNodeRedUrl(): string {
  return localStorage.getItem('nodeRedUrl') || DEFAULT_NODE_RED_URL;
}

export function setNodeRedUrl(url: string): void {
  localStorage.setItem('nodeRedUrl', url);
}

export interface NodeRedError extends Error {
  status?: number;
  url?: string;
}

export async function fetchNodeRed<T>(path: string): Promise<T> {
  const base = getNodeRedUrl().replace(/\/$/, '');
  const safePath = path.startsWith('/') ? path : `/${path}`;
  const url = `${base}${safePath}`;
  
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(3500),
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error: NodeRedError = new Error(`Node-RED request failed: ${response.status}`);
      error.status = response.status;
      error.url = url;
      throw error;
    }
    
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      console.warn('[Node-RED] Response is not JSON:', contentType);
    }
    
    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
        const timeoutError: NodeRedError = new Error('Node-RED connection timeout (3.5s)');
        timeoutError.status = 408;
        timeoutError.url = url;
        throw timeoutError;
      }
      
      if (error.message.includes('Failed to fetch')) {
        const networkError: NodeRedError = new Error('Cannot connect to Node-RED. Check IP address and CORS settings.');
        networkError.status = 0;
        networkError.url = url;
        throw networkError;
      }
    }
    throw error;
  }
}

export async function postNodeRed<T>(path: string, body: unknown): Promise<T> {
  const base = getNodeRedUrl().replace(/\/$/, '');
  const safePath = path.startsWith('/') ? path : `/${path}`;
  const url = `${base}${safePath}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(3500),
    });
    
    if (!response.ok) {
      const error: NodeRedError = new Error(`Node-RED POST failed: ${response.status}`);
      error.status = response.status;
      error.url = url;
      throw error;
    }
    
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response.json() as Promise<T>;
    }
    
    const text = await response.text();
    if (!text) return {} as T;
    
    try {
      return JSON.parse(text) as T;
    } catch {
      return { raw: text } as unknown as T;
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
        const timeoutError: NodeRedError = new Error('Node-RED POST timeout (3.5s)');
        timeoutError.status = 408;
        timeoutError.url = url;
        throw timeoutError;
      }
      
      if (error.message.includes('Failed to fetch')) {
        const networkError: NodeRedError = new Error('Cannot connect to Node-RED. Check IP address and CORS settings.');
        networkError.status = 0;
        networkError.url = url;
        throw networkError;
      }
    }
    throw error;
  }
}