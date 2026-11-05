import { API_URL } from "./client";

/**
 * URL картинки по uuid медиа-объекта. Все обращения к картинкам — только через эту функцию:
 * формат URL ещё уточняется на бэкенде.
 */
export function getMediaUrl(mediaId: string): string {
  return `${API_URL}/api/v1/media/${mediaId}`;
}
