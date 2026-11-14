import type { RefObject } from "react";

/**
 * Радикс-диалог без `Trigger` при закрытии фокусирует пустой `triggerRef`, и фокус
 * уходит на `body`. Наши диалоги открываются снаружи (кнопка строки, пункт меню),
 * поэтому фокус возвращаем сами: обработчик для `onCloseAutoFocus` у `*Content`.
 */
export function returnFocusTo(ref: RefObject<HTMLElement | null> | undefined) {
  return (event: Event) => {
    const target = ref?.current;
    if (!target?.isConnected) return;
    event.preventDefault();
    target.focus();
  };
}
