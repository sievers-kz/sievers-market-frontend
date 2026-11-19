import { Mail, Phone } from "lucide-react";
import Image from "next/image";

import { getMediaUrl, type ListingSeller } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ListingSellerCardProps {
  seller: ListingSeller;
  className?: string;
}

/** Для `tel:` только цифры и ведущий `+`; показываем номер как прислал бэкенд. */
function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits.startsWith("+") ? "+" : ""}${digits.replace(/\+/g, "")}`;
}

/**
 * Продавец: организация из `seller`. Контакты публичные, телефон виден сразу.
 * Пустые поля не рисуются; если пусто всё, блока нет.
 */
export function ListingSellerCard({ seller, className }: ListingSellerCardProps) {
  const name = seller.name?.trim() || null;
  const phone = seller.phone?.trim() || null;
  const email = seller.email?.trim() || null;
  const logo = seller.logo_media_id;

  if (!name && !phone && !email && !logo) return null;

  return (
    <section
      aria-labelledby="listing-seller-title"
      className={cn("flex flex-col gap-4 rounded-2xl bg-card p-6", className)}
    >
      <h2 id="listing-seller-title" className="text-sm text-muted-foreground">
        Продавец
      </h2>
      {(name || logo) && (
        <div className="flex min-w-0 items-center gap-4">
          {logo && (
            <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image
                src={getMediaUrl(logo)}
                alt={name ? `Логотип ${name}` : "Логотип продавца"}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
          )}
          {name && <p className="min-w-0 text-lg font-semibold break-words">{name}</p>}
        </div>
      )}
      {(phone || email) && (
        <ul className="flex flex-col gap-2">
          {phone && (
            <li>
              <a
                href={telHref(phone)}
                className="inline-flex min-w-0 items-center gap-2 font-medium text-primary hover:underline"
              >
                <Phone className="size-4 shrink-0" aria-hidden />
                <span className="break-all">{phone}</span>
              </a>
            </li>
          )}
          {email && (
            <li>
              <a
                href={`mailto:${email}`}
                className="inline-flex min-w-0 items-center gap-2 font-medium text-primary hover:underline"
              >
                <Mail className="size-4 shrink-0" aria-hidden />
                <span className="break-all">{email}</span>
              </a>
            </li>
          )}
        </ul>
      )}
    </section>
  );
}
