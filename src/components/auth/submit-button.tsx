import { LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  pending: boolean;
  children: ReactNode;
}

export function SubmitButton({ pending, children }: SubmitButtonProps) {
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending} aria-busy={pending}>
      {pending && <LoaderCircle className="animate-spin" aria-hidden />}
      {children}
    </Button>
  );
}
