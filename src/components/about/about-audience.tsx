import { AboutAudienceCard } from "./about-audience-card";
import { ABOUT_AUDIENCE } from "./about-labels";

interface AboutAudienceProps {
  /** Та же ссылка, что у «Смотреть каталог» на главной; `null` — ссылки нет. */
  catalogHref: string | null;
}

/** Блок 3 «Для кого»: две карточки, колонка на телефоне и ряд с `md`. */
export function AboutAudience({ catalogHref }: AboutAudienceProps) {
  const { buyers, sellers } = ABOUT_AUDIENCE;

  return (
    <section aria-labelledby="about-audience-title" className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <h2 id="about-audience-title" className="sr-only">
        {ABOUT_AUDIENCE.title}
      </h2>
      <AboutAudienceCard
        title={buyers.title}
        text={buyers.text}
        link={catalogHref ? { label: buyers.linkLabel, href: catalogHref } : null}
      />
      <AboutAudienceCard
        title={sellers.title}
        text={sellers.text}
        link={{ label: sellers.linkLabel, href: sellers.href }}
      />
    </section>
  );
}
