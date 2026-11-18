import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import * as interfacesGlobal from '@/utils/interfaces/interfacesGlobal';

export const getAccessToken = () => Cookies.get('access_token');
export const getRefreshToken = () => Cookies.get('refresh_token');

export const setTokens = (access: string) => {
  Cookies.set('access_token', access);
};

export const clearTokens = () => {
  Cookies.remove('access_token');
};

export const decodeToken = (): interfacesGlobal.ResponseJwtType | null => {
  const token = getAccessToken();
  if (token) {
    return jwtDecode(token);
  }
  return null;
};

export async function getChallengeHeaders(): Promise<{
  challengeId: string;
  hash: string;
}> {
  const res = await fetch(`/api/v1/challange`);
  const data = await res.json();

  if (!window.crypto?.subtle) {
    throw new Error('Web Crypto API not available in this browser');
  }

  const encoder = new TextEncoder();

  const key = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(import.meta.env.VITE_SHARED_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await window.crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(data.data.challenge)
  );

  const hash = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return {
    challengeId: data.data.challenge,
    hash,
  };
}
