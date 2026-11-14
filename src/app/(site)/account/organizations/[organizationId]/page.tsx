import type { Metadata } from "next";

import { OrganizationDetailView } from "@/components/account/organization-detail-view";

export const metadata: Metadata = {
  title: "Организация",
  robots: { index: false },
};

/**
 * Организацию читает клиент (`OrganizationDetailView`): на сервере токен не обновляется,
 * поэтому «не найдена» это состояние страницы, а не `notFound()`.
 */
export default async function OrganizationPage({
  params,
}: PageProps<"/account/organizations/[organizationId]">) {
  const { organizationId } = await params;
  return <OrganizationDetailView organizationId={organizationId} />;
}
