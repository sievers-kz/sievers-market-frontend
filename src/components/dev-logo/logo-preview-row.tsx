import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";

import { LogoPreviewHeader } from "./logo-preview-header";

/**
 * Одна строка сравнения на `/dev/logo`: подпись, шапка и кусок страницы под ней.
 * `header` заменяет двухрядную шапку (`LogoPreviewHeader`) целиком; тогда `logo` и `headerClassName` не нужны.
 */
export function LogoPreviewRow({
  index,
  title,
  note,
  logo,
  headerClassName,
  header,
}: {
  index: number;
  title: string;
  note?: string;
  logo?: ReactNode;
  headerClassName?: string;
  header?: ReactNode;
}) {
  return (
    <section className="border-b-8 border-muted" aria-labelledby={`variant-${index}`}>
      <Container className="py-4">
        <h2 id={`variant-${index}`} className="text-sm font-semibold">
          {index}. {title}
        </h2>
        {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
      </Container>
      {header ?? <LogoPreviewHeader logo={logo} className={headerClassName} />}
      <Container className="py-8">
        <p className="text-sm text-muted-foreground">Главная / Каталог / Тракторы</p>
        <h3 className="mt-2 text-2xl font-semibold">Тракторы</h3>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Колёсные и гусеничные тракторы от поставщиков Казахстана: новые и с пробегом, с доставкой
          по стране. Сравнивайте предложения и связывайтесь с продавцами напрямую.
        </p>
      </Container>
    </section>
  );
}
