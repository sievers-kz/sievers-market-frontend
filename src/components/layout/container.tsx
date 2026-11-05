import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Единственная обёртка для контента страниц: максимум 1280px, по центру.
 * Любая секция страницы должна лежать внутри Container.
 */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1280px] px-4", className)}
      {...props}
    />
  );
}
