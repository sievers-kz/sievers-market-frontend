import { Store } from "lucide-react";

/**
 * Зона логотипа: квадрат на белом фоне. Публичного URL по `logo_media_id` пока нет,
 * поэтому всегда заглушка. Когда URL появится, меняется только этот компонент
 * (картинка `object-contain` в том же квадрате).
 */
export function OrganizationLogo() {
  return (
    <div className="flex aspect-square w-full items-center justify-center bg-card">
      <div className="flex size-20 items-center justify-center rounded-full bg-muted text-muted-foreground lg:size-24">
        <Store className="size-8 lg:size-10" aria-hidden />
      </div>
    </div>
  );
}
