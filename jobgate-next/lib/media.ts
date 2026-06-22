// lib/media.ts
// Construit l'URL absolue d'un fichier média servi par Django (QR codes, images...).
// On part de NEXT_PUBLIC_API_URL (qui pointe vers .../api/) et on retire ce suffixe,
// car les fichiers médias sont servis à la racine du domaine (ex: /media/...).
const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";

export const API_ORIGIN = RAW_API_URL.replace(/\/api\/?$/, "");

export function getMediaUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path}`;
}