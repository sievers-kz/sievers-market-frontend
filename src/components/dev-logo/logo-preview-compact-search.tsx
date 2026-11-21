import { HeaderSearch } from "@/components/layout/header-search";
import { cn } from "@/lib/utils";

/**
 * Поиск шапки высотой h-10 (вместо h-12) для `/dev/logo`: `HeaderSearch` не меняется,
 * высоту поля и кнопки с лупой задаёт обёртка.
 */
export function LogoPreviewCompactSearch({ className }: { className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-1 [&_button]:size-8 [&_input]:h-10", className)}>
      <HeaderSearch />
    </div>
  );
}
