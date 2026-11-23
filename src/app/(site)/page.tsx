import type { Metadata } from "next";

import { FreshListings } from "@/components/home/fresh-listings";
import { heroChips, HERO_CATALOG_RUBRIC, rubricHref } from "@/components/home/home-rubrics";
import { HomeHero } from "@/components/home/home-hero";
import { HomeMapSection } from "@/components/home/home-map-section";
import { HomeRubricsSection } from "@/components/home/home-rubrics-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { getCategoryTree } from "@/lib/api";
import type { CategoryTree } from "@/lib/api/catalog";
import { OG_IMAGE, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const revalidate = 60;

const HOME_TITLE = "Sievers: маркетплейс для агробизнеса в Казахстане";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "ru_RU",
    title: HOME_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

/** Ошибка дерева не роняет главную: рубрики становятся заглушками, кнопка каталога и чипы скрываются. */
async function loadCategoryTree(): Promise<CategoryTree | null> {
  try {
    return await getCategoryTree();
  } catch (error) {
    console.error("Главная: не удалось загрузить дерево каталога", error);
    return null;
  }
}

/** Главная (`docs/pages/home.md`). Server Component, ISR 60 с. */
export default async function HomePage() {
  const tree = await loadCategoryTree();

  return (
    <main className="flex-1">
      <HomeHero catalogHref={rubricHref(tree, HERO_CATALOG_RUBRIC)} chips={heroChips(tree)} />
      <HomeRubricsSection tree={tree} />
      <FreshListings />
      <HomeMapSection />
      <HowItWorks />
    </main>
  );
}
