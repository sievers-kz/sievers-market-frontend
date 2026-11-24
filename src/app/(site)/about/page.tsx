import type { Metadata } from "next";

import { AboutAudience } from "@/components/about/about-audience";
import { AboutFeedback } from "@/components/about/about-feedback";
import { AboutIntro } from "@/components/about/about-intro";
import { ABOUT_METADATA } from "@/components/about/about-labels";
import { AboutSteps } from "@/components/about/about-steps";
import { AboutVerification } from "@/components/about/about-verification";
import { HERO_CATALOG_RUBRIC, rubricHref } from "@/components/home/home-rubrics";
import { Container } from "@/components/layout/container";
import { getCategoryTree } from "@/lib/api";
import type { CategoryTree } from "@/lib/api/catalog";

export const metadata: Metadata = {
  title: ABOUT_METADATA.title,
  description: ABOUT_METADATA.description,
  alternates: { canonical: "/about" },
};

/**
 * Дерево нужно только для «Смотреть каталог» (та же ссылка, что на главной). Запрос тот же, что
 * у шапки (`revalidate` 1 ч, без cookie), поэтому Next отдаёт его из кэша, а страница остаётся
 * статической. Ошибка дерева страницу не роняет: ссылки просто нет.
 */
async function loadCategoryTree(): Promise<CategoryTree | null> {
  try {
    return await getCategoryTree();
  } catch (error) {
    console.error("О нас: не удалось загрузить дерево каталога", error);
    return null;
  }
}

/** «О нас» (`docs/pages/about.md`). Server Component, тексты в `about-labels.ts`. */
export default async function AboutPage() {
  const tree = await loadCategoryTree();

  return (
    <main className="flex-1 bg-muted py-8 lg:py-12">
      <Container className="flex flex-col gap-8">
        <AboutIntro />
        <AboutSteps />
        <AboutAudience catalogHref={rubricHref(tree, HERO_CATALOG_RUBRIC)} />
        <AboutVerification />
        <AboutFeedback />
      </Container>
    </main>
  );
}
