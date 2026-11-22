import { ListingCard } from "@/components/catalog/listing-card";
import { Container } from "@/components/layout/container";
import { searchListing } from "@/lib/api";
import { cn } from "@/lib/utils";

import { HomeBand } from "./home-band";
import { HomeSectionTitle } from "./home-section-title";

/** Сколько объявлений запрашиваем: 4×2 на десктопе, ниже `xl` показываем 6 (3×2 и 2×3). */
const FRESH_LISTINGS_LIMIT = 8;
const FRESH_LISTINGS_BELOW_XL = 6;
/** Кэш выдачи совпадает с `revalidate` главной. */
const FRESH_LISTINGS_REVALIDATE_SECONDS = 60;

/** Без `text` и `sort` поиск отдаёт сначала новые (контракт `searchListing`). */
async function loadFreshListings() {
  try {
    const result = await searchListing(
      { page: 1, limit: FRESH_LISTINGS_LIMIT, attributes: {}, attribute_ranges: {} },
      { revalidate: FRESH_LISTINGS_REVALIDATE_SECONDS },
    );
    return result.items;
  } catch (error) {
    console.error("Главная: не удалось загрузить свежие объявления", error);
    return [];
  }
}

/**
 * «Свежие объявления» на главной. Пусто или ошибка — блок не рендерится вовсе.
 * Ссылки «Смотреть все» нет: общего списка объявлений без категории пока нет.
 */
export async function FreshListings() {
  const listings = await loadFreshListings();
  if (listings.length === 0) return null;

  return (
    <HomeBand>
      <Container>
        <HomeSectionTitle>Свежие объявления</HomeSectionTitle>
        <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-6 xl:grid-cols-4">
          {listings.map((listing, index) => (
            <li
              key={listing.id}
              className={cn("flex min-w-0", index >= FRESH_LISTINGS_BELOW_XL && "max-xl:hidden")}
            >
              <ListingCard listing={listing} view="grid" />
            </li>
          ))}
        </ul>
      </Container>
    </HomeBand>
  );
}
