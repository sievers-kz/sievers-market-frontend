import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { SupportContacts } from "@/components/support/support-contacts";
import { SupportFaq } from "@/components/support/support-faq";
import { SupportIntro } from "@/components/support/support-intro";
import { SUPPORT_METADATA } from "@/components/support/support-labels";

export const metadata: Metadata = {
  title: SUPPORT_METADATA.title,
  description: SUPPORT_METADATA.description,
  alternates: { canonical: "/support" },
};

/** «Поддержка» (`docs/pages/support.md`). Статичный Server Component, тексты в `support-labels.ts`. */
export default function SupportPage() {
  return (
    <main className="flex-1 bg-muted py-8 lg:py-12">
      <Container className="flex flex-col gap-8">
        <SupportIntro />
        <SupportContacts />
        <SupportFaq />
      </Container>
    </main>
  );
}
