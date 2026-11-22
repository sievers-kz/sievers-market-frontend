import { cn } from "@/lib/utils";

/** Заголовок блока главной: 22/28 на телефоне, 28/36 с `md`. */
export function HomeSectionTitle({ children, className }: { children: string; className?: string }) {
  return <h2 className={cn("text-[22px]/7 font-bold md:text-[28px]/9", className)}>{children}</h2>;
}
