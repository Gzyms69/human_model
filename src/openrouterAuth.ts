/**
 * OpenRouter OAuth PKCE Auth helper
 */

function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = new Uint8Array(length);
  crypto.getRandomValues(values);
  return Array.from(values)
    .map((x) => possible[x % possible.length])
    .join('');
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await crypto.subtle.digest('SHA-256', data);
}

function base64urlencode(a: ArrayBuffer): string {
  let str = '';
  const bytes = new Uint8Array(a);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function initiateOpenRouterLogin(): Promise<void> {
  const verifier = generateRandomString(64);
  const hashed = await sha256(verifier);
  const challenge = base64urlencode(hashed);

  sessionStorage.setItem('openrouter_pkce_verifier', verifier);

  const callbackUrl = window.location.origin + window.location.pathname;
  const authUrl = new URL('https://openrouter.ai/auth');
  authUrl.searchParams.set('callback_url', callbackUrl);
  authUrl.searchParams.set('code_challenge', challenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');

  window.location.href = authUrl.toString();
}

export async function checkForOpenRouterAuthCallback(): Promise<boolean> {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (!code) {
    return false;
  }

  const verifier = sessionStorage.getItem('openrouter_pkce_verifier');
  if (!verifier) {
    console.error('Brak verifiera PKCE w sessionStorage.');
    return false;
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/auth/keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code,
        code_challenge_method: 'S256',
        code_verifier: verifier
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Błąd wymiany kodu OpenRouter (${response.status}): ${errText}`);
    }

    const data = await response.json();
    if (data.key) {
      localStorage.setItem('human_model_openrouter_key', data.key);
      sessionStorage.removeItem('openrouter_pkce_verifier');

      // Clean code parameter from URL without page refresh
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('code');
      window.history.replaceState({}, document.title, cleanUrl.toString());

      return true;
    }
  } catch (error) {
    console.error('Wymiana kodu OpenRouter nie powiodła się:', error);
  }

  return false;
}
