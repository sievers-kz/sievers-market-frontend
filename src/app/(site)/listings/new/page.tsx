import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { ListingCreateGate } from "@/components/listing-create/listing-create-gate";
import {
  getAllBrands,
  getAllCities,
  getAllColors,
  getAllOriginCountries,
  getCategoryTree,
} from "@/lib/api";

export const metadata: Metadata = { title: "Новое объявление" };

/** Справочники читаются на сервере (с кэшем); вход и организации проверяет клиент. */
export default async function NewListingPage() {
  const [tree, cities, brands, colors, countries] = await Promise.all([
    getCategoryTree(),
    getAllCities(),
    getAllBrands(),
    getAllColors(),
    getAllOriginCountries(),
  ]);

  return (
    <main className="flex-1 bg-muted py-8">
      <Container className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold lg:text-3xl">Новое объявление</h1>
        <ListingCreateGate
          tree={tree}
          cities={cities}
          // Ключи совпадают с `field.source` у полей `type: "reference"`.
          references={{ brand: brands, color: colors, country: countries }}
        />
      </Container>
    </main>
  );
}
