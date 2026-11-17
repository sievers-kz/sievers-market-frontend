/**
 * Загрузка файла напрямую в MinIO по presigned URL.
 * Без cookie и без `X-Client-Type`: запрос идёт не на наш backend.
 */
export async function uploadToPresignedUrl(
  uploadUrl: string,
  file: File,
): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!response.ok) {
    throw new Error(`Не удалось загрузить файл (${response.status})`);
  }
}
