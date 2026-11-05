import type { Metadata } from "next";

import { StubPage } from "@/components/layout/stub-page";

export const metadata: Metadata = { title: "Подать объявление" };

/** Заглушка: страница создания будет позже и сама проверит доступ. */
export default function NewListingPage() {
  return <StubPage title="Подать объявление" />;
}
