import { ShieldCheck } from "lucide-react";
import Image from "next/image";

import { getMediaUrl, type ListingSeller } from "@/lib/api";
import { cn } from "@/lib/utils";

import { ListingSellerContacts } from "./listing-seller-contacts";
import { ListingSellerField } from "./listing-seller-field";

interface ListingSellerCardProps {
  listingId: string;
  seller: ListingSeller;
  className?: string;
}

/** Подпись номера по `kind`: у компании БИН, у ИП ИИН. */
const TAX_ID_LABELS: Record<string, string> = { company: "БИН", individual: "ИИН" };

function taxIdLabel(kind: string): string {
  return Object.hasOwn(TAX_ID_LABELS, kind) ? TAX_ID_LABELS[kind] : "БИН/ИИН";
}

/** Первые буквы двух первых слов («Олжа Агро» → «ОА»), без кавычек и знаков. */
function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => word.match(/[\p{L}\p{N}]/u)?.[0] ?? "")
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function clean(value: string | null): string | null {
  return value?.trim() || null;
}

/**
 * Продавец: организация из `seller`. Юрданные открыто, телефон и email маской до
 * «Показать контакты» (`ListingSellerContacts`). Пустые поля не рисуются.
 */
export function ListingSellerCard({ listingId, seller, className }: ListingSellerCardProps) {
  const title = clean(seller.name) ?? clean(seller.legal_name);
  const legalName = clean(seller.legal_name);
  const taxId = clean(seller.tax_id);
  const address = clean(seller.legal_address);
  const initials = title ? getInitials(title) : "";
  const logo = seller.logo_media_id;

  return (
    <section
      aria-label="Продавец"
      className={cn("flex flex-col gap-6 rounded-2xl bg-card p-6", className)}
    >
      {(title || logo || seller.is_registry_verified) && (
        <div className="flex min-w-0 items-center gap-4">
          {(logo || initials) && (
            <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-cta/10 font-bold text-cta">
              {logo ? (
                <Image
                  src={getMediaUrl(logo)}
                  alt={title ? `Логотип ${title}` : "Логотип продавца"}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <span aria-hidden>{initials}</span>
              )}
            </div>
          )}
          <div className="flex min-w-0 flex-col items-start gap-1">
            {title && <p className="text-lg font-semibold break-words">{title}</p>}
            {seller.is_registry_verified && (
              <span className="inline-flex items-center gap-1 rounded-md bg-cta/10 px-2 py-1 text-xs font-medium text-cta">
                <ShieldCheck className="size-4 shrink-0" aria-hidden />
                Проверена по реестру
              </span>
            )}
          </div>
        </div>
      )}

      <ListingSellerContacts
        listingId={listingId}
        phoneMasked={clean(seller.phone_masked)}
        emailMasked={clean(seller.email_masked)}
      >
        {legalName && <ListingSellerField label="Полное наименование">{legalName}</ListingSellerField>}
        {taxId && <ListingSellerField label={taxIdLabel(seller.kind)}>{taxId}</ListingSellerField>}
        {address && <ListingSellerField label="Юридический адрес">{address}</ListingSellerField>}
      </ListingSellerContacts>
    </section>
  );
}
