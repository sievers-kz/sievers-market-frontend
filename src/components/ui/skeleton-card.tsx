import { cn } from "@/lib/utils"

/** Белая карточка-заглушка с тем же фоном и скруглением, что у настоящих карточек. */
function SkeletonCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton-card"
      className={cn("flex flex-col gap-4 rounded-2xl bg-card p-6", className)}
      {...props}
    />
  )
}

export { SkeletonCard }
