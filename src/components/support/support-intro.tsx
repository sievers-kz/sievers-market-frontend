import { SUPPORT_INTRO } from "./support-labels";

/** Блок 1 «Поддержки»: подпись, `h1` и вводный абзац (`docs/pages/support.md`). */
export function SupportIntro() {
  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-card p-6 lg:p-12">
      <p className="text-sm font-semibold tracking-wider text-primary uppercase">
        {SUPPORT_INTRO.eyebrow}
      </p>
      <h1 className="text-3xl font-bold lg:text-4xl">{SUPPORT_INTRO.title}</h1>
      <p className="max-w-3xl text-base text-muted-foreground lg:text-lg">{SUPPORT_INTRO.text}</p>
    </section>
  );
}
