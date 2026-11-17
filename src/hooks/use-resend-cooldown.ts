"use client";

import { useEffect, useState } from "react";

/** Бэкенд не отдаёт время ожидания (backend#203): повтор кода не раньше чем через 60 с. */
export const RESEND_COOLDOWN_SECONDS = 60;

/**
 * Отсчёт до повторной отправки кода. Идёт с монтирования (момент показа шага с кодом);
 * `restart` запускает его заново после успешной повторной отправки.
 */
export function useResendCooldown(seconds: number = RESEND_COOLDOWN_SECONDS) {
  const [secondsLeft, setSecondsLeft] = useState(seconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  return { secondsLeft, restart: () => setSecondsLeft(seconds) };
}
