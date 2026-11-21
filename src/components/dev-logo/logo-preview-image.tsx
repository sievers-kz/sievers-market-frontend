import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Логотип-картинка из `public/brand/` для страницы `/dev/logo`. Цвет задан в самом файле.
 * `width`/`height` — пропорции из `viewBox`, реальную высоту задаёт `className`.
 */
export function LogoPreviewImage({
  src,
  width,
  height,
  className,
}: {
  src: string;
  width: number;
  height: number;
  className: string;
}) {
  return (
    <Link href="/" aria-label="Sievers" className="shrink-0">
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        unoptimized
        priority
        className={cn("w-auto shrink-0", className)}
      />
    </Link>
  );
}
