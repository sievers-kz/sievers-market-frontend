// Только сервер: вызывается со страницы каталога, справочники кэшируются по `revalidate`.
import { parseOptions } from "@/components/listing-create/listing-schema";
import { parseHexColor } from "@/components/listing-create/parse-hex-color";
import {
  getAllBrands,
  getAllCities,
  getAllColors,
  getAllOriginCountries,
  getSubcategoryFilters,
} from "@/lib/api";
import type { components } from "@/lib/api/schema";

import type { CatalogFilterData, CityOption, FilterField, FilterOption } from "./catalog-filter-fields";

type AttributeField = components["schemas"]["AttributeFieldResponse"];
type ReferenceItem = { id: string; name: string; hex?: string };

/** Справочники для `reference` по `field.source`, как в форме объявления. */
const REFERENCE_LOADERS: Record<string, () => Promise<readonly ReferenceItem[]>> = {
  brand: getAllBrands,
  color: getAllColors,
  country: getAllOriginCountries,
};

/** Сбой справочника не роняет каталог: поле просто не показывается. */
async function loadReference(source: string): Promise<readonly ReferenceItem[] | null> {
  const load = Object.hasOwn(REFERENCE_LOADERS, source) ? REFERENCE_LOADERS[source] : undefined;
  if (!load) return null;
  try {
    return await load();
  } catch (error) {
    console.error(`Каталог: справочник «${source}» не загрузился`, error);
    return null;
  }
}

function toFilterField(
  field: AttributeField,
  references: ReadonlyMap<string, readonly ReferenceItem[] | null>,
): FilterField | null {
  if (!field.filterable) return null;

  if (field.type === "boolean") {
    return { kind: "boolean", key: field.key, label: field.label };
  }

  if (field.type === "enumerate") {
    const options = parseOptions(field.options).map((option) => ({
      value: option.key,
      label: option.label,
    }));
    return options.length > 0
      ? { kind: "select", key: field.key, label: field.label, anyLabel: "Любое", options }
      : null;
  }

  if (field.type === "reference" && field.source) {
    const items = references.get(field.source);
    if (!items?.length) return null;
    const options: FilterOption[] = items.map((item) => ({
      value: item.id,
      label: item.name,
      swatch: field.source === "color" ? parseHexColor(item.hex) : undefined,
    }));
    return { kind: "select", key: field.key, label: field.label, anyLabel: "Любой", options };
  }

  // integer, float, string: диапазоны придут в PR 2 (`docs/pages/catalog-filters.md`).
  return null;
}

async function loadFilterFields(subcategoryId: string): Promise<FilterField[] | null> {
  let filters: AttributeField[];
  try {
    filters = (await getSubcategoryFilters(subcategoryId)).filters;
  } catch (error) {
    console.error("Каталог: фильтры подкатегории не загрузились", error);
    return null;
  }

  const sources = [
    ...new Set(
      filters.flatMap((field) =>
        field.filterable && field.type === "reference" && field.source ? [field.source] : [],
      ),
    ),
  ];
  const references = new Map(
    await Promise.all(sources.map(async (source) => [source, await loadReference(source)] as const)),
  );

  return filters.flatMap((field) => toFilterField(field, references) ?? []);
}

async function loadCities(): Promise<CityOption[] | null> {
  try {
    return (await getAllCities()).map(({ id, name }) => ({ id, name }));
  } catch (error) {
    console.error("Каталог: справочник городов не загрузился", error);
    return null;
  }
}

/** Города и атрибуты выбранной подкатегории для панели фильтров, чипов и разбора URL. */
export async function loadCatalogFilters(subcategoryId: string | undefined): Promise<CatalogFilterData> {
  const [cities, fields] = await Promise.all([
    loadCities(),
    subcategoryId ? loadFilterFields(subcategoryId) : Promise.resolve(null),
  ]);
  return { cities, fields };
}
