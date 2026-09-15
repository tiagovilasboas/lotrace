export const LAYOUT_CODE = 'LAYOUT';
export const LAYOUT_MATCH_ID = 'layout';
export const LAYOUT_GUEST_NAME = 'Mesa';

const NICKNAME_KEY = 'lotrace-layout-nickname';

export function isLayoutCode(code: string): boolean {
  return code.trim().toUpperCase() === LAYOUT_CODE;
}

export function rememberLayoutNickname(nickname: string): void {
  const trimmed = nickname.trim();
  if (trimmed.length >= 2) {
    sessionStorage.setItem(NICKNAME_KEY, trimmed);
    return;
  }
  sessionStorage.removeItem(NICKNAME_KEY);
}

export function readLayoutNickname(): string {
  return sessionStorage.getItem(NICKNAME_KEY) ?? '';
}

export function layoutNicknames(nickname: string): [string, string] {
  const trimmed = nickname.trim();
  const you = trimmed.length >= 2 ? trimmed : 'Você';
  return [you, LAYOUT_GUEST_NAME];
}
