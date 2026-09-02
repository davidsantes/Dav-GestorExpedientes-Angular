import { TokenPayload } from '../../features/auth/models/auth.interface';

const PREFIJO_TOKEN = 'mock';

function base64UrlEncode(valor: string): string {
  return btoa(encodeURIComponent(valor)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(valor: string): string {
  const base64 = valor.replace(/-/g, '+').replace(/_/g, '/');
  const relleno = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
  return decodeURIComponent(atob(base64 + relleno));
}

/** Firma simulada: no es criptográficamente segura, solo evita tokens inventados a mano. */
function firmar(payloadCodificado: string): string {
  let hash = 0;
  for (const caracter of `${PREFIJO_TOKEN}.${payloadCodificado}`) {
    hash = (hash << 5) - hash + caracter.charCodeAt(0);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export function generarToken(payload: TokenPayload): string {
  const payloadCodificado = base64UrlEncode(JSON.stringify(payload));
  return `${PREFIJO_TOKEN}.${payloadCodificado}.${firmar(payloadCodificado)}`;
}

export function leerToken(token: string | null | undefined): TokenPayload | null {
  if (!token) {
    return null;
  }

  const [prefijo, payloadCodificado, firma] = token.split('.');
  if (prefijo !== PREFIJO_TOKEN || !payloadCodificado || firma !== firmar(payloadCodificado)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(payloadCodificado)) as TokenPayload;
    if (!payload?.user || !payload?.rol || payload.exp <= Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
