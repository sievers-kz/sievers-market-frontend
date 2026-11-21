import { Store } from "lucide-react";

/**
 * Зона логотипа: горизонтальный блок на белом фоне, во всю ширину карточки, высота 128 px
 * (160 px с `lg`). Публичного URL по `logo_media_id` пока нет, поэтому всегда заглушка.
 * Когда URL появится, меняется только этот компонент: картинка `object-contain` внутри блока.
 */
export function OrganizationLogo() {
  return (
    <div className="flex h-32 w-full items-center justify-center bg-card lg:h-40">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Store className="size-8" aria-hidden />
      </div>
    </div>
  );
}
