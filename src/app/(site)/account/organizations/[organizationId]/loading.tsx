import { OrganizationDetailSkeleton } from "@/components/account/organization-detail-skeleton";

/** Рендерится в колонке контента каркаса: сайдбар остаётся на месте. */
export default function OrganizationLoading() {
  return <OrganizationDetailSkeleton />;
}
