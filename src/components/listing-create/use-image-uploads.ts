"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  confirmUpload,
  generateUploadUrl,
  isApiError,
  uploadToPresignedUrl,
  type MediaType,
} from "@/lib/api";

import { MAX_IMAGES, type ListingImage } from "./listing-schema";

export const ACCEPTED_TYPES: readonly MediaType[] = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export type UploadStatus = "uploading" | "done" | "error";

export interface UploadItem {
  id: string;
  file: File;
  mediaType: MediaType;
  previewUrl: string;
  status: UploadStatus;
  media?: ListingImage;
  error?: string;
}

function isAcceptedType(type: string): type is MediaType {
  return (ACCEPTED_TYPES as readonly string[]).includes(type);
}

function uploadErrorMessage(error: unknown): string {
  if (isApiError(error) && error.status < 500) return error.message;
  return "Не удалось загрузить файл";
}

/** generateUploadUrl → PUT в хранилище → confirmUpload. */
async function uploadFile(file: File, mediaType: MediaType): Promise<ListingImage> {
  const [target] = await generateUploadUrl({
    files: [{ client_filename: file.name, mime_type: mediaType }],
  });
  if (!target) throw new Error("Пустой ответ generateUploadUrl");
  await uploadToPresignedUrl(target.upload_url, file);
  const [media] = await confirmUpload({
    files: [{ file_path: target.file_path, media_type: mediaType, media_size: file.size }],
  });
  if (!media) throw new Error("Пустой ответ confirmUpload");
  return { media_id: media.media_id, media_type: media.media_type, media_size: media.media_size };
}

/**
 * Список фото объявления: загрузка начинается сразу при добавлении,
 * превью локальные (`blob:`), ссылки освобождаются при удалении и уходе со страницы.
 */
export function useImageUploads() {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [rejections, setRejections] = useState<string[]>([]);
  const itemsRef = useRef<UploadItem[]>([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(
    () => () => {
      for (const item of itemsRef.current) URL.revokeObjectURL(item.previewUrl);
    },
    [],
  );

  const patch = useCallback((id: string, changes: Partial<UploadItem>) => {
    // Если фото уже убрали, обновлять нечего.
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  }, []);

  const start = useCallback(
    (item: UploadItem) => {
      patch(item.id, { status: "uploading", error: undefined });
      uploadFile(item.file, item.mediaType).then(
        (media) => patch(item.id, { status: "done", media }),
        (error: unknown) => patch(item.id, { status: "error", error: uploadErrorMessage(error) }),
      );
    },
    [patch],
  );

  const addFiles = useCallback(
    (files: readonly File[]) => {
      const messages: string[] = [];
      const accepted: UploadItem[] = [];
      let skipped = 0;
      const free = MAX_IMAGES - itemsRef.current.length;

      for (const file of files) {
        if (!isAcceptedType(file.type)) {
          messages.push(`«${file.name}»: подходят только PNG, JPEG и WebP`);
        } else if (file.size > MAX_SIZE_BYTES) {
          messages.push(`«${file.name}»: файл больше ${MAX_SIZE_MB} МБ`);
        } else if (accepted.length >= free) {
          skipped += 1;
        } else {
          accepted.push({
            id: crypto.randomUUID(),
            file,
            mediaType: file.type,
            previewUrl: URL.createObjectURL(file),
            status: "uploading",
          });
        }
      }
      if (skipped > 0) {
        messages.push(`Можно добавить не больше ${MAX_IMAGES} фото, лишние файлы пропущены`);
      }

      setRejections(messages);
      if (accepted.length === 0) return;
      // Сразу обновляем ref: второй выбор подряд должен видеть занятые места.
      itemsRef.current = [...itemsRef.current, ...accepted];
      setItems((prev) => [...prev, ...accepted]);
      accepted.forEach(start);
    },
    [start],
  );

  const retry = useCallback(
    (id: string) => {
      const item = itemsRef.current.find((candidate) => candidate.id === id);
      if (item) start(item);
    },
    [start],
  );

  const remove = useCallback((id: string) => {
    const item = itemsRef.current.find((candidate) => candidate.id === id);
    if (item) URL.revokeObjectURL(item.previewUrl);
    itemsRef.current = itemsRef.current.filter((candidate) => candidate.id !== id);
    setItems((prev) => prev.filter((candidate) => candidate.id !== id));
    setRejections([]);
  }, []);

  const gallery = useMemo(
    () => items.flatMap((item) => (item.status === "done" && item.media ? [item.media] : [])),
    [items],
  );
  const isUploading = items.some((item) => item.status === "uploading");

  return { items, rejections, gallery, isUploading, addFiles, retry, remove };
}
