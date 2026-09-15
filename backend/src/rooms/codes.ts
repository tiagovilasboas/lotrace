const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function randomInviteCode(length: number = 6): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let code = '';
  for (const byte of bytes) {
    code += ALPHABET[byte % ALPHABET.length];
  }
  return code;
}

export function randomToken(): string {
  return crypto.randomUUID().replaceAll('-', '');
}
