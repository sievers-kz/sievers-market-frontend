import type { Metadata } from "next";

import { StubPage } from "@/components/layout/stub-page";

export const metadata: Metadata = { title: "Пользовательское соглашение" };

export default function TermsPage() {
  return <StubPage title="Пользовательское соглашение" />;
}
