import { SupportFaqItem } from "./support-faq-item";
import { SUPPORT_FAQ } from "./support-labels";

/** Блок 3 «Поддержки»: `h2` и белая карточка с вопросами-`<details>`, первый раскрыт. */
export function SupportFaq() {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold lg:text-3xl">{SUPPORT_FAQ.title}</h2>
      <div className="rounded-2xl bg-card px-6 py-2 lg:px-8">
        {SUPPORT_FAQ.items.map((item, index) => (
          <SupportFaqItem
            key={item.question}
            question={item.question}
            answer={item.answer}
            defaultOpen={index === 0}
          />
        ))}
      </div>
    </section>
  );
}
