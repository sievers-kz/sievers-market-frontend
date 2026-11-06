import { cn } from "@/lib/utils"

/**
 * Полоска-заглушка вместо текста или картинки: приглушённый зелёный и блик.
 * Кладётся внутрь белой карточки того же размера, что и настоящая (см. SkeletonCard).
 * При `prefers-reduced-motion` блика нет.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn(
        "relative overflow-hidden rounded-md bg-primary/10",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-linear-to-r before:from-transparent before:via-card/60 before:to-transparent motion-reduce:before:hidden",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
