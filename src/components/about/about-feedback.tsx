import Link from "next/link";

import { Button } from "@/components/ui/button";

import { ABOUT_FEEDBACK } from "./about-labels";

/** Блок 5 «Мы развиваемся»: текст и кнопка в поддержку; колонка на телефоне, строка с `md`. */
export function AboutFeedback() {
  return (
    <section className="flex flex-col gap-6 rounded-2xl bg-card p-6 md:flex-row md:items-center md:justify-between lg:p-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">{ABOUT_FEEDBACK.title}</h2>
        <p className="text-base text-muted-foreground">{ABOUT_FEEDBACK.text}</p>
      </div>
      <Button asChild size="lg" className="self-start bg-cta text-base text-cta-foreground hover:bg-cta/90 md:self-auto">
        <Link href={ABOUT_FEEDBACK.href}>{ABOUT_FEEDBACK.button}</Link>
      </Button>
    </section>
  );
}
