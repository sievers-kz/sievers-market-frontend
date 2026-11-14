import { PackageOpen } from "lucide-react";

export function CatalogEmpty() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border bg-card px-4 py-16 text-center">
      <PackageOpen className="size-12 text-muted-foreground" aria-hidden />
      <p className="text-lg font-medium">В этой категории пока нет объявлений</p>
    </div>
  );
}
