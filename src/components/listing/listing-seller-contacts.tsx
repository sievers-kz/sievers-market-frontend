"use client";

import { Check, Copy, LoaderCircle, Phone } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { getListingContacts, isApiError, type ListingContacts } from "@/lib/api";
import { cn } from "@/lib/utils";

import { ListingSellerField } from "./listing-seller-field";

interface ListingSellerContactsProps {
  listingId: string;
  phoneMasked: string | null;
  emailMasked: string | null;
  /** Открытые поля продавца (наименование, БИН/ИИН, адрес): идут перед телефоном и email. */
  children?: ReactNode;
}

type State =
  | { status: "masked" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "revealed"; contacts: ListingContacts };

const CTA_CLASS = "h-12 w-full bg-cta text-base text-cta-foreground hover:bg-cta/90";

/** Для `tel:` только цифры и ведущий `+`; показываем номер как прислал бэкенд. */
function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits.startsWith("+") ? "+" : ""}${digits.replace(/\+/g, "")}`;
}

function CopyButton({ value, label, hidden }: { value: string; label: string; hidden: boolean }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        // До раскрытия место под кнопку занято (invisible), чтобы строка не сдвигалась.
        className={cn("-my-2 shrink-0 text-muted-foreground", hidden && "invisible")}
        aria-hidden={hidden || undefined}
        tabIndex={hidden ? -1 : undefined}
        aria-label={copied ? `${label}: скопировано` : `Копировать: ${label}`}
        onClick={() => {
          navigator.clipboard?.writeText(value).then(
            () => setCopied(true),
            () => setCopied(false),
          );
        }}
      >
        {copied ? <Check className="size-4 text-primary" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      </Button>
      <span className="sr-only" aria-live="polite">
        {copied ? `${label} скопирован` : ""}
      </span>
    </>
  );
}

/** Значение контакта: маска серым, после раскрытия полное значение проявляется в обычный цвет. */
function ContactValue({ masked, value }: { masked: string; value: string | null | undefined }) {
  if (value) {
    return (
      <span
        key="value"
        className="text-foreground transition-[color,opacity] duration-200 ease-out starting:text-muted-foreground starting:opacity-60 motion-reduce:transition-none"
      >
        {value}
      </span>
    );
  }
  return (
    <span key="mask" className="text-muted-foreground">
      {masked}
    </span>
  );
}

/**
 * Поля продавца и кнопка: «Показать контакты» запрашивает `getListingContacts`, маски
 * сменяются полными значениями без модалки, кнопка становится «Позвонить» (`tel:`).
 */
export function ListingSellerContacts({
  listingId,
  phoneMasked,
  emailMasked,
  children,
}: ListingSellerContactsProps) {
  const [state, setState] = useState<State>({ status: "masked" });
  const contacts = state.status === "revealed" ? state.contacts : null;
  const phone = contacts?.phone?.trim() || null;
  const email = contacts?.email?.trim() || null;
  const hasMasks = Boolean(phoneMasked || emailMasked);
  const callRef = useRef<HTMLAnchorElement>(null);
  const revealed = state.status === "revealed";

  // Кнопка «Показать контакты» исчезает: фокус переходит на «Позвонить», а не на body.
  useEffect(() => {
    if (revealed) callRef.current?.focus();
  }, [revealed]);

  function reveal() {
    setState({ status: "loading" });
    getListingContacts(listingId).then(
      (data) => setState({ status: "revealed", contacts: data }),
      (error: unknown) =>
        setState({
          status: "error",
          message:
            isApiError(error) && error.status === 404
              ? "Объявление снято с публикации, контакты недоступны."
              : "Не удалось загрузить контакты. Попробуйте ещё раз.",
        }),
    );
  }

  // После раскрытия поле без значения (продавец его не указал) не рисуется.
  const showPhone = Boolean(phoneMasked) && (!contacts || phone);
  const showEmail = Boolean(emailMasked) && (!contacts || email);
  const hasFields = Boolean(children) || showPhone || showEmail;

  return (
    <>
      {hasFields && (
        <dl className="flex flex-col gap-4">
          {children}
          {showPhone && phoneMasked && (
            <ListingSellerField
              label="Телефон"
              action={<CopyButton value={phone ?? ""} label="Телефон" hidden={!phone} />}
            >
              <ContactValue masked={phoneMasked} value={phone} />
            </ListingSellerField>
          )}
          {showEmail && emailMasked && (
            <ListingSellerField
              label="Email"
              action={<CopyButton value={email ?? ""} label="Email" hidden={!email} />}
            >
              <ContactValue masked={emailMasked} value={email} />
            </ListingSellerField>
          )}
        </dl>
      )}

      {hasMasks && !contacts && (
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            size="lg"
            className={CTA_CLASS}
            disabled={state.status === "loading"}
            aria-busy={state.status === "loading" || undefined}
            onClick={reveal}
          >
            {state.status === "loading" ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
            ) : (
              <Phone className="size-4" aria-hidden />
            )}
            Показать контакты
          </Button>
          {state.status === "error" && (
            <p role="alert" className="text-sm text-destructive">
              {state.message}
            </p>
          )}
        </div>
      )}

      {phone && (
        <Button asChild size="lg" className={CTA_CLASS}>
          <a ref={callRef} href={telHref(phone)}>
            <Phone className="size-4" aria-hidden />
            Позвонить
          </a>
        </Button>
      )}
    </>
  );
}
