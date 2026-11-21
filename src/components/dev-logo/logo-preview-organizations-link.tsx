import Link from "next/link";

import { cn } from "@/lib/utils";

/** Ссылка «Организации» в стиле текущей шапки для `/dev/logo`. */
export function LogoPreviewOrganizationsLink({ className }: { className?: string }) {
  return (
    <Link
      href="/organizations"
      className={cn("shrink-0 text-sm font-medium text-primary hover:underline", className)}
    >
      Организации
    </Link>
  );
}
