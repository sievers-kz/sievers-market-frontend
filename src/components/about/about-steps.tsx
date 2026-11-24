import { ABOUT_STEPS } from "./about-labels";

/**
 * Блок 2 «Как это работает»: три шага списком `<ol>` (порядок передаёт список, цифры декоративны).
 * Колонка на телефоне, две колонки с `md`, три с `lg`.
 */
export function AboutSteps() {
  return (
    <section aria-labelledby="about-steps-title" className="flex flex-col gap-6">
      <h2 id="about-steps-title" className="text-2xl font-bold">
        {ABOUT_STEPS.title}
      </h2>
      <ol className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ABOUT_STEPS.items.map((step, index) => (
          <li key={step.title} className="flex flex-col gap-4 rounded-2xl bg-card p-6 lg:p-8">
            <span
              aria-hidden="true"
              className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary"
            >
              {index + 1}
            </span>
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="text-base text-muted-foreground">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
