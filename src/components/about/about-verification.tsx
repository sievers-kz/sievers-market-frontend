import { ShieldCheck } from "lucide-react";

import { ABOUT_VERIFICATION } from "./about-labels";

/** Блок 4 «Почему мы проверяем организации»: зелёный блок со щитом, колонка на телефоне, строка с `md`. */
export function AboutVerification() {
  return (
    <section className="flex flex-col gap-6 rounded-2xl bg-primary p-6 text-primary-foreground md:flex-row md:items-center md:gap-8 lg:p-12">
      <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
        <ShieldCheck aria-hidden className="size-8" />
      </span>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">{ABOUT_VERIFICATION.title}</h2>
        <p className="max-w-3xl text-base lg:text-lg">{ABOUT_VERIFICATION.text}</p>
      </div>
    </section>
  );
}
