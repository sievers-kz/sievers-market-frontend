"use client";

import { Search } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { useCloseOnNavigation } from "@/hooks/use-close-on-navigation";

import { Container } from "./container";
import { HeaderSearch } from "./header-search";

/**
 * Поиск в шапке: иконка открывает поле под шапкой и затемняет страницу.
 * Поле — тот же `HeaderSearch` (Enter ведёт на `/search?q=`), в фокусе сразу.
 * Закрытие: Esc, клик по затемнению, отправка запроса, смена маршрута. Фокус возвращается на иконку.
 *
 * Панель позиционируется от `header` (он `relative` и выше затемнения по `z`), затемнение
 * рисуется порталом в `body`, иначе оно оказалось бы внутри слоя шапки и перекрыло бы её.
 */
export function HeaderSearchOverlay() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  useCloseOnNavigation(setOpen);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      root.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <>
      <Button
        ref={triggerRef}
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Поиск"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => (open ? close() : setOpen(true))}
        className="text-foreground hover:bg-muted"
      >
        <Search aria-hidden className="size-5" />
      </Button>
      {open && (
        <>
          <div id={panelId} className="absolute inset-x-0 top-full border-b bg-background">
            <Container className="py-4">
              <HeaderSearch autoFocus onSubmitted={() => setOpen(false)} />
            </Container>
          </div>
          {createPortal(
            <div aria-hidden className="fixed inset-0 z-40 bg-foreground/40" onClick={close} />,
            document.body,
          )}
        </>
      )}
    </>
  );
}
