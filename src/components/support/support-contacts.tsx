import Image from "next/image";

import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL, CONTACT_TELEGRAM_URL } from "@/lib/site";

import { SUPPORT_CONTACTS } from "./support-labels";

const QR_SIZE = 168;

/**
 * Блок 2 «Поддержки»: QR в рамке, `h2`, текст, кнопка Telegram и почта. Колонка на телефоне
 * (QR сверху), строка с `md`; кнопка и почта в одной строке с переносом.
 */
export function SupportContacts() {
  return (
    <section className="flex flex-col gap-8 rounded-2xl bg-card p-6 md:flex-row md:items-center md:gap-10 lg:p-8">
      <div className="self-start rounded-2xl border border-border p-4 md:self-auto">
        <Image
          src={SUPPORT_CONTACTS.qrSrc}
          alt={SUPPORT_CONTACTS.qrAlt}
          width={QR_SIZE}
          height={QR_SIZE}
          className="block size-42"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">{SUPPORT_CONTACTS.title}</h2>
          <p className="text-base text-muted-foreground">{SUPPORT_CONTACTS.text}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <Button asChild size="lg" className="bg-cta text-base text-cta-foreground hover:bg-cta/90">
            <a href={CONTACT_TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
              {SUPPORT_CONTACTS.telegramButton}
            </a>
          </Button>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex min-h-12 items-center rounded-sm text-base font-medium break-all text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </section>
  );
}
