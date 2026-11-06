import { apiFetch } from "./client";
import type { components, operations } from "./schema";

type Schemas = components["schemas"];
type GenerateUploadUrlResponse =
  operations["generateUploadUrl"]["responses"][200]["content"]["application/json"];
type ConfirmUploadResponse =
  operations["confirmUpload"]["responses"][200]["content"]["application/json"];

export type MediaType = Schemas["MediaType"];

/** Картинки публичные и cookie не требуют, поэтому идут на API напрямую, не через прокси. */
const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * URL картинки по uuid медиа-объекта. Все обращения к картинкам — только через эту функцию:
 * формат URL ещё уточняется на бэкенде.
 */
export function getMediaUrl(mediaId: string): string {
  return `${MEDIA_BASE_URL}/api/v1/media/${mediaId}`;
}

/** Presigned URL для прямой загрузки в хранилище; можно сразу на несколько файлов. */
export function generateUploadUrl(
  body: Schemas["GenerateUploadUrlRequest"],
): Promise<GenerateUploadUrlResponse> {
  return apiFetch<GenerateUploadUrlResponse>("/api/v1/media/url/upload", {
    method: "POST",
    body,
  });
}

/** Регистрирует загруженные файлы, возвращает `media_id`. */
export function confirmUpload(
  body: Schemas["ConfirmUploadRequest"],
): Promise<ConfirmUploadResponse> {
  return apiFetch<ConfirmUploadResponse>("/api/v1/media/upload/confirm", {
    method: "POST",
    body,
  });
}
