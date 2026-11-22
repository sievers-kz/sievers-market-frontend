import { Container } from "@/components/layout/container";
import type { CategoryTree } from "@/lib/api/catalog";
import { cn } from "@/lib/utils";

import { findRubricByName, HOME_RUBRICS, rubricHref } from "./home-rubrics";
import { HomeSectionTitle } from "./home-section-title";
import { RubricTile } from "./rubric-tile";

/**
 * Рубрики главной: пять плиток из `HOME_RUBRICS`. Плитка активна, если в дереве есть рубрика
 * с тем же названием (ссылка, если в ней есть категории); иначе заглушка «Скоро». Ссылки «Весь каталог»
 * нет: общей страницы каталога без id нет.
 */
export function HomeRubricsSection({ tree }: { tree: CategoryTree | null }) {
  return (
    <section className="py-10 md:py-16">
      <Container>
        <HomeSectionTitle>Рубрики</HomeSectionTitle>
        <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 xl:grid-cols-5">
          {HOME_RUBRICS.map((rubric) => {
            const active = findRubricByName(tree, rubric.name) !== undefined;
            const href = rubricHref(tree, rubric.name);
            return (
              <li key={rubric.key} className={cn("flex", active && "max-sm:col-span-2")}>
                <RubricTile rubric={rubric} active={active} href={href} className="w-full" />
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
