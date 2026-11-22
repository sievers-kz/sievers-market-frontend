import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Серая полоса главной (`bg-band`) с тихой сеткой: сетка отдельным слоем под контентом,
 * гаснет маской сверху и снизу (`.bg-grid` в `globals.css`).
 */
export function HomeBand({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn("relative bg-band py-10 md:py-16", className)}>
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
      <div className="relative">{children}</div>
    </section>
  );
}
