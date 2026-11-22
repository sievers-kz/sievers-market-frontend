import { Container } from "@/components/layout/container";

import { HomeBand } from "./home-band";
import { HomeSectionTitle } from "./home-section-title";

/**
 * Шаги «Как это работает». Формулировки шагов 1 и 2 (проверка по БИН, бесплатность)
 * ждут подтверждения владельца до запуска в production.
 */
const STEPS = [
  {
    title: "Организация проходит проверку",
    text: "Продавцы подтверждаются по БИН и получают отметку «Организация найдена».",
  },
  {
    title: "Размещает объявление",
    text: "Бесплатно, с подробными характеристиками под каждую категорию техники.",
  },
  {
    title: "Покупатель связывается напрямую",
    text: "Контакты продавца без посредников. Ищите по каталогу или по региону.",
  },
] as const;

const CIRCLE_CLASS =
  "relative flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground shadow-[0_0_0_6px_var(--hero),0_0_0_7px_rgb(7_104_82/0.25)]";
const CARD_CLASS =
  "rounded-2xl bg-background shadow-[0_1px_2px_rgb(27_43_38/0.04),0_2px_8px_rgb(27_43_38/0.06)]";

/** «Как это работает» (`docs/pages/home.md`, раздел 5): три колонки с `md`, ниже лента шагов. */
export function HowItWorks() {
  return (
    <HomeBand>
      <Container>
        <HomeSectionTitle className="md:text-center">Как это работает</HomeSectionTitle>

        {/* С md: линия через центры кружков (от первой колонки до третьей) лежит под ними. */}
        <ol className="relative mt-8 hidden grid-cols-3 gap-6 md:grid">
          <span
            aria-hidden="true"
            className="absolute top-[19px] right-[calc((100%-48px)/6)] left-[calc((100%-48px)/6)] h-0.5 bg-primary"
          />
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex flex-col items-center">
              <span className={CIRCLE_CLASS}>{index + 1}</span>
              <span aria-hidden="true" className="h-6 w-0.5 bg-primary" />
              <div className={`${CARD_CLASS} flex w-full flex-1 flex-col gap-2 p-6 text-center`}>
                <h3 className="text-xl/7 font-semibold">{step.title}</h3>
                <p className="text-[15px]/6 text-muted-foreground">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Телефон: кружок слева, карточка справа; линия между центрами соседних кружков. */}
        <ol className="mt-6 flex flex-col gap-4 md:hidden">
          {STEPS.map((step, index) => (
            <li key={step.title} className="relative flex items-start gap-4">
              {index < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-5 -bottom-9 left-[19px] w-0.5 bg-primary"
                />
              )}
              <span className={CIRCLE_CLASS}>{index + 1}</span>
              <div className={`${CARD_CLASS} flex min-w-0 flex-1 flex-col gap-2 p-4`}>
                <h3 className="text-[17px]/6 font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </HomeBand>
  );
}
