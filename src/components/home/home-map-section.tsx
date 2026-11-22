import { Container } from "@/components/layout/container";

import { CountryMap } from "./country-map";
import { HomeSectionTitle } from "./home-section-title";

/**
 * «Объявления по всему Казахстану»: декоративная карта без цифр и кнопок.
 * С `lg` белая карточка в две колонки, на телефоне без карточки.
 */
export function HomeMapSection() {
  return (
    <section className="py-10 md:py-16">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12 lg:rounded-2xl lg:border lg:border-border lg:p-12 lg:shadow-sm">
          <div className="lg:w-[360px] lg:shrink-0">
            <HomeSectionTitle>Объявления по всему Казахстану</HomeSectionTitle>
            <p className="mt-2 text-base text-muted-foreground lg:mt-4">
              Покупайте и продавайте технику в любом регионе страны.
            </p>
          </div>
          <CountryMap className="min-w-0 flex-1" />
        </div>
      </Container>
    </section>
  );
}
