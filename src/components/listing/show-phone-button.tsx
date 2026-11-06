"use client";

import { Phone } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { getListingDetails } from "@/lib/api";

interface ShowPhoneButtonProps {
  listingId: string;
}

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "shown"; phone: string }
  | { status: "error" };

/**
 * Номер не передаётся пропсом: иначе он попал бы в HTML (RSC payload) до клика.
 * Поэтому по клику запрашиваем объявление ещё раз из браузера.
 */
export function ShowPhoneButton({ listingId }: ShowPhoneButtonProps) {
  const [state, setState] = useState<State>({ status: "idle" });

  async function handleClick() {
    setState({ status: "loading" });
    try {
      const listing = await getListingDetails(listingId);
      const phone = listing?.contact_phone;
      setState(phone ? { status: "shown", phone } : { status: "error" });
    } catch {
      setState({ status: "error" });
    }
  }

  if (state.status === "shown") {
    return (
      <a
        href={`tel:${state.phone.replace(/[^\d+]/g, "")}`}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-cta text-lg font-semibold text-foreground transition-colors hover:bg-cta/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Phone className="size-4" aria-hidden />
        {state.phone}
      </a>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        size="lg"
        onClick={handleClick}
        disabled={state.status === "loading"}
        className="w-full bg-cta text-cta-foreground hover:bg-cta/90"
      >
        <Phone aria-hidden />
        {state.status === "loading" ? "Загружаем…" : "Контакты"}
      </Button>
      {state.status === "error" && (
        <p role="alert" className="text-sm text-destructive">
          Не удалось получить номер. Попробуйте ещё раз.
        </p>
      )}
    </div>
  );
}
