/** Картинки публичные и cookie не требуют, поэтому идут на API напрямую, не через прокси. */
const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * URL картинки по uuid медиа-объекта. Все обращения к картинкам — только через эту функцию:
 * формат URL ещё уточняется на бэкенде.
 */
export function getMediaUrl(mediaId: string): string {
  return `${MEDIA_BASE_URL}/api/v1/media/${mediaId}`;
}
