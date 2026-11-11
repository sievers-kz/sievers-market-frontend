"use client";

import { ImagePlus, LoaderCircle, RotateCw, X } from "lucide-react";
import { useRef, useState, type Ref } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { MAX_IMAGES } from "./listing-schema";
import { ACCEPTED_TYPES, type UploadItem } from "./use-image-uploads";

interface ImageUploaderProps {
  items: UploadItem[];
  rejections: string[];
  error?: string;
  onAdd: (files: File[]) => void;
  onRetry: (id: string) => void;
  onRemove: (id: string) => void;
  /** id и ref области загрузки: на неё ставится фокус при ошибке галереи. */
  dropzoneId?: string;
  dropzoneRef?: Ref<HTMLButtonElement>;
}

export function ImageUploader({
  items,
  rejections,
  error,
  onAdd,
  onRetry,
  onRemove,
  dropzoneId,
  dropzoneRef,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const full = items.length >= MAX_IMAGES;
  const coverId = items.find((item) => item.status === "done")?.id;

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple
        hidden
        onChange={(event) => {
          onAdd(Array.from(event.target.files ?? []));
          // Иначе повторный выбор того же файла не вызовет onChange.
          event.target.value = "";
        }}
      />
      <button
        id={dropzoneId}
        ref={dropzoneRef}
        type="button"
        disabled={full}
        aria-describedby={error ? "gallery-hint gallery-error" : "gallery-hint"}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          if (!full) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!full) onAdd(Array.from(event.dataTransfer.files));
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-input bg-card px-4 py-8 text-center transition-colors outline-none",
          "hover:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-input",
          dragging && "border-primary bg-accent",
          error && "border-destructive",
        )}
      >
        <ImagePlus className="size-8 text-primary" aria-hidden />
        <span className="text-base font-medium">Добавить фото</span>
        <span id="gallery-hint" className="text-sm text-muted-foreground">
          {full
            ? `Добавлено максимум: ${MAX_IMAGES} фото`
            : "Загрузите или перетащите сюда · PNG, JPEG, WebP до 5 МБ"}
        </span>
      </button>

      <p className="text-sm text-muted-foreground">
        От 1 до {MAX_IMAGES} фото, первое станет обложкой
      </p>

      {error && (
        <p id="gallery-error" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {rejections.length > 0 && (
        <ul role="alert" className="flex flex-col gap-1 text-sm text-destructive">
          {rejections.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}

      {items.length > 0 && (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="relative aspect-square overflow-hidden rounded-lg bg-muted"
            >
              {/* Локальное превью из blob:, next/image тут не нужен. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.previewUrl}
                alt={item.file.name}
                className={cn(
                  "size-full object-cover",
                  item.status !== "done" && "opacity-50",
                )}
              />

              {item.id === coverId && (
                <span className="absolute bottom-2 left-2 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                  Обложка
                </span>
              )}

              {item.status === "uploading" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <LoaderCircle className="size-8 animate-spin text-primary" aria-hidden />
                  <span className="sr-only">Загрузка {item.file.name}</span>
                </div>
              )}

              {item.status === "error" && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-card/80 p-2 text-center"
                  title={item.error}
                >
                  <span className="text-sm font-medium text-destructive">Ошибка</span>
                  <Button type="button" size="sm" variant="outline" onClick={() => onRetry(item.id)}>
                    <RotateCw aria-hidden />
                    Повторить
                  </Button>
                </div>
              )}

              <button
                type="button"
                onClick={() => onRemove(item.id)}
                aria-label={`Убрать ${item.file.name}`}
                className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-card/90 text-foreground shadow-xs transition-colors outline-none hover:bg-card focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <X className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
