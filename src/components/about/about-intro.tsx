import { ABOUT_INTRO } from "./about-labels";

/** Блок 1 «О нас»: подпись, `h1` и вводный абзац (`docs/pages/about.md`). */
export function AboutIntro() {
  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-card p-6 lg:p-12">
      <p className="text-sm font-semibold tracking-wider text-primary uppercase">
        {ABOUT_INTRO.eyebrow}
      </p>
      <h1 className="max-w-4xl text-3xl font-bold lg:text-4xl">{ABOUT_INTRO.title}</h1>
      <p className="max-w-3xl text-base text-muted-foreground lg:text-lg">{ABOUT_INTRO.text}</p>
    </section>
  );
}
