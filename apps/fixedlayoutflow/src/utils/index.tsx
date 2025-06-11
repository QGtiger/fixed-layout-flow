import { strFromU8, strToU8, unzlibSync, zlibSync } from "fflate";

/**
 * 是否用 fllate 进行字符串压缩
 * @param data
 * @returns
 */
export function compress(data: string) {
  const buffer = strToU8(data);
  const zipped = zlibSync(buffer, { level: 9 });
  const binary = strFromU8(zipped, true);
  return btoa(binary);
}

/**
 * 是否用 fllate 进行字符串解压缩
 * @param base64
 * @returns
 */
export function uncompress(base64: string) {
  const binary = atob(base64);

  const buffer = strToU8(binary, true);
  const unzipped = unzlibSync(buffer);
  return strFromU8(unzipped);
}

export function copyText(text: string) {
  const el = document.createElement("textarea");
  el.value = text;
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}
