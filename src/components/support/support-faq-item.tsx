import { ChevronDown } from "lucide-react";

type SupportFaqItemProps = {
  question: string;
  answer: string;
  defaultOpen?: boolean;
};

/** Один вопрос FAQ на нативном `<details>/<summary>`: без JS, раскрывается с клавиатуры. */
export function SupportFaqItem({ question, answer, defaultOpen = false }: SupportFaqItemProps) {
  return (
    <details open={defaultOpen} className="group border-b border-border py-6 last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm text-lg font-semibold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [&::-webkit-details-marker]:hidden">
        {question}
        <ChevronDown
          aria-hidden
          className="size-6 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
        />
      </summary>
      <p className="mt-4 max-w-4xl text-base text-muted-foreground">{answer}</p>
    </details>
  );
}
