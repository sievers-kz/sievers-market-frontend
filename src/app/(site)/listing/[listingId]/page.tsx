import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { Container } from "@/components/layout/container";
import { ListingAttributes } from "@/components/listing/listing-attributes";
import { ListingBreadcrumbs } from "@/components/listing/listing-breadcrumbs";
import { ListingDescription } from "@/components/listing/listing-description";
import { ListingGallery } from "@/components/listing/listing-gallery";
import { ListingSummaryCard } from "@/components/listing/listing-summary-card";
import { ListingTitleCard } from "@/components/listing/listing-title-card";
import { SellerCard } from "@/components/listing/seller-card";
import { getListingDetails, isApiError } from "@/lib/api";

const DESCRIPTION_META_LENGTH = 160;

/**
 * Бэкенд отдаёт только активные объявления: любое другое приходит как 404,
 * невалидный uuid как 422. Оба случая и пустой ответ это «не найдено».
 * `cache` делит один запрос между `generateMetadata` и страницей.
 */
const loadListing = cache(async (listingId: string) => {
  try {
    const listing = await getListingDetails(listingId);
    if (!listing) notFound();
    return listing;
  } catch (error) {
    if (isApiError(error) && (error.status === 404 || error.status === 422)) {
      notFound();
    }
    throw error;
  }
});

export async function generateMetadata({
  params,
}: PageProps<"/listing/[listingId]">): Promise<Metadata> {
  const { listingId } = await params;
  const listing = await loadListing(listingId);
  const description = listing.description
    ?.replace(/\s+/g, " ")
    .trim()
    .slice(0, DESCRIPTION_META_LENGTH);

  return {
    // absolute: иначе шаблон корневого layout допишет « | Sievers Market» второй раз.
    title: { absolute: `${listing.title} · Sievers Market` },
    description: description || undefined,
  };
}

export default async function ListingPage({
  params,
}: PageProps<"/listing/[listingId]">) {
  const { listingId } = await params;
  const listing = await loadListing(listingId);

  return (
    <main className="flex-1 bg-muted py-8">
      <Container className="flex flex-col gap-6">
        <ListingBreadcrumbs subcategoryName={listing.subcategory} />
        <ListingTitleCard
          subcategory={listing.subcategory}
          title={listing.title}
          city={listing.city}
        />

        {/* Телефон: галерея → карточка → продавец → характеристики → описание (через order).
            С lg: слева галерея, характеристики, описание; справа липкая колонка. */}
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
          <div className="contents lg:flex lg:min-w-0 lg:flex-col lg:gap-6">
            <ListingGallery
              className="order-1"
              mediaIds={listing.gallery}
              title={listing.title}
            />
            <ListingAttributes
              className="order-3"
              attributes={listing.attributes}
            />
            {listing.description !== null && (
              <ListingDescription
                className="order-4"
                text={listing.description}
              />
            )}
          </div>

          <aside className="order-2 flex flex-col gap-4 lg:sticky lg:top-8">
            <ListingSummaryCard
              price={listing.price}
              currency={listing.currency}
            />
            <SellerCard
              listingId={listing.id}
              name={listing.display_owner_name}
              hasPhone={listing.contact_phone !== null}
            />
          </aside>
        </div>
      </Container>
    </main>
  );
}
