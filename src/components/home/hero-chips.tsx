import Link from "next/link";

import { cn } from "@/lib/utils";

/** Чипы категорий под поиском hero. Пустой список ничего не рисует. */
export function HeroChips({
  chips,
  className,
}: {
  chips: readonly { label: string; href: string }[];
  className?: string;
}) {
  if (chips.length === 0) return null;

  return (
    <ul className={cn("flex gap-2", className)}>
      {chips.map((chip) => (
        <li key={chip.href} className="shrink-0">
          <Link
            href={chip.href}
            className="inline-flex h-8 items-center rounded-full border border-border bg-background px-4 text-sm whitespace-nowrap transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {chip.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
