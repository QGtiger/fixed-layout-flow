import { v4 as uuidv4 } from 'uuid';

export function generateUuid() {
  return uuidv4().replace(/-/g, '');
  const uuidBuffer = Buffer.from(uuidv4().replace(/-/g, ''), 'hex');
  const base64Id = uuidBuffer.toString('base64').replace(/=/g, '');
  // .substring(0, 22);
  return base64Id;
}

const basename = process.env.NODE_ENV === 'development' ? '' : '';

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function getShareUrl(flowId: string): string {
  return `${window.location.origin}${basename}/share/${flowId}`;
}

export function copy(text: string) {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}
