import { cn } from "@/lib/utils"

/**
 * Поверхность-заглушка с теми же классами, что у настоящих поверхностей
 * (docs/pages/style-surfaces.md):
 * - `panel`: панель, `rounded-2xl border bg-card`;
 * - `card`: карточка-объект, `rounded-2xl bg-card shadow-card`.
 * Без `variant` остаётся прежняя белая карточка без рамки и тени: так её пока используют
 * страница объявления, подача объявления и кабинет. Их переводят на варианты PR 2 и 3
 * перехода на новый стиль, после этого `variant` станет обязательным.
 */
type SkeletonCardVariant = "panel" | "card"

const VARIANT_CLASSES: Record<SkeletonCardVariant, string> = {
  panel: "border",
  card: "shadow-card",
}

function SkeletonCard({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & { variant?: SkeletonCardVariant }) {
  return (
    <div
      data-slot="skeleton-card"
      data-variant={variant}
      className={cn(
        "flex flex-col gap-4 rounded-2xl bg-card p-6",
        variant && VARIANT_CLASSES[variant],
        className
      )}
      {...props}
    />
  )
}

export { SkeletonCard }
export type { SkeletonCardVariant }
