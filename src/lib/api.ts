const DEFAULT_NODE_RED_URL = 'http://192.168.0.140:1880';

export function getNodeRedUrl() {
  return localStorage.getItem('nodeRedUrl') || DEFAULT_NODE_RED_URL;
}

export async function fetchNodeRed<T>(path: string): Promise<T> {
  const base = getNodeRedUrl().replace(/\/$/, '');
  const safePath = path.startsWith('/') ? path : `/${path}`;
  const response = await fetch(`${base}${safePath}`, { signal: AbortSignal.timeout(3500) });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function postNodeRed<T>(path: string, body: unknown): Promise<T> {
  const base = getNodeRedUrl().replace(/\/$/, '');
  const safePath = path.startsWith('/') ? path : `/${path}`;
  const response = await fetch(`${base}${safePath}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(3500),
  });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
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
    return ({ raw: text } as unknown) as T;
  }
}