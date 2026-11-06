import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  value: string;
  title: string;
  hasError?: boolean;
  children: ReactNode;
}

/** Белая карточка-аккордеон; при ошибке внутри рамка и заголовок красные. */
export function FormSection({ value, title, hasError = false, children }: FormSectionProps) {
  return (
    <AccordionItem
      value={value}
      className={cn(
        "rounded-2xl border border-transparent bg-card px-6 last:border-b",
        hasError && "border-destructive last:border-destructive",
      )}
    >
      <AccordionTrigger
        className={cn(
          "h-16 items-center py-0 text-lg font-semibold hover:no-underline",
          hasError && "text-destructive",
        )}
      >
        <span className="flex items-center gap-2">
          {title}
          {hasError && (
            <>
              <CircleAlert className="size-4" aria-hidden />
              <span className="sr-only">(есть ошибки)</span>
            </>
          )}
        </span>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 pb-6">{children}</AccordionContent>
    </AccordionItem>
  );
}
