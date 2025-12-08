import type { JwtPayload } from '../models/auth.model';

export function decodeJWT<T = JwtPayload>(token: string): T | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    const json = atob(payload!); // เขียน if 
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export function isTokenExpired(payload: JwtPayload | null): boolean {
  if (!payload?.exp) return false;
  const now = Date.now() / 1000;
  return payload.exp < now;
}
