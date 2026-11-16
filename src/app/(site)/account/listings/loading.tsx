import { MyListingsSkeleton } from "@/components/account/my-listings-skeleton";

/** Рендерится в колонке контента каркаса: сайдбар остаётся на месте. */
export default function MyListingsLoading() {
  return <MyListingsSkeleton />;
}
