import { LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  pending: boolean;
  /** Неактивна и вне отправки (например, пока не заполнены обязательные поля). */
  disabled?: boolean;
  children: ReactNode;
}

export function SubmitButton({ pending, disabled = false, children }: SubmitButtonProps) {
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending || disabled} aria-busy={pending}>
      {pending && <LoaderCircle className="animate-spin" aria-hidden />}
      {children}
    </Button>
  );
}
