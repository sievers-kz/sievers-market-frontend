"use client";

import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { getMediaUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ListingGalleryProps {
  mediaIds: string[];
  title: string;
  className?: string;
}

function GalleryPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex size-full items-center justify-center bg-muted text-muted-foreground",
        className,
      )}
    >
      <ImageOff className="size-8" aria-hidden />
    </div>
  );
}

export function ListingGallery({ mediaIds, title, className }: ListingGalleryProps) {
  const [current, setCurrent] = useState(0);
  // Картинки пока не открываются (backend#208): на ошибке загрузки показываем заглушку.
  const [failed, setFailed] = useState<ReadonlySet<string>>(new Set());

  const count = mediaIds.length;
  const markFailed = (id: string) =>
    setFailed((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  const go = (delta: number) =>
    setCurrent((index) => (index + delta + count) % count);

  if (count === 0) {
    return (
      <div className={cn("aspect-[4/3] overflow-hidden rounded-2xl", className)}>
        <GalleryPlaceholder />
      </div>
    );
  }

  const currentId = mediaIds[current];

  return (
    <section
      aria-label="Фотографии"
      className={cn("flex flex-col gap-4", className)}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
        {failed.has(currentId) ? (
          <GalleryPlaceholder />
        ) : (
          <Image
            key={currentId}
            src={getMediaUrl(currentId)}
            alt={`${title}, фото ${current + 1}`}
            fill
            priority={current === 0}
            sizes="(min-width: 1280px) 816px, (min-width: 1024px) 60vw, 100vw"
            className="object-cover"
            onError={() => markFailed(currentId)}
          />
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Предыдущее фото"
              className="absolute top-1/2 left-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 text-foreground transition-colors hover:bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <ChevronLeft className="size-6" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Следующее фото"
              className="absolute top-1/2 right-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 text-foreground transition-colors hover:bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <ChevronRight className="size-6" aria-hidden />
            </button>
          </>
        )}

        <p
          className="absolute right-4 bottom-4 rounded-full bg-foreground/60 px-2 py-1 text-xs font-medium text-background"
          aria-live="polite"
        >
          {current + 1} / {count}
        </p>
      </div>

      {count > 1 && (
        <ul className="flex gap-2 overflow-x-auto pb-1">
          {mediaIds.map((id, index) => (
            <li key={id} className="shrink-0">
              <button
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Фото ${index + 1} из ${count}`}
                aria-current={index === current ? "true" : undefined}
                className={cn(
                  "relative block h-16 w-20 overflow-hidden rounded-lg bg-muted ring-2 ring-transparent transition-shadow focus-visible:ring-ring focus-visible:outline-none",
                  index === current ? "ring-primary" : "opacity-70 hover:opacity-100",
                )}
              >
                {failed.has(id) ? (
                  <GalleryPlaceholder className="[&_svg]:size-4" />
                ) : (
                  <Image
                    src={getMediaUrl(id)}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                    onError={() => markFailed(id)}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
