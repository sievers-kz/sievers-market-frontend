"use client";

import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useState } from "react";

import { getOrganization, isApiError, type OrganizationListItem } from "@/lib/api";

import { ORGANIZATIONS_LOGIN_PATH } from "./login-path";

const POLL_INTERVAL_MS = 3000;
/** Около двух минут; дальше пользователь перезапускает опрос сам. */
const MAX_ATTEMPTS = 40;

interface Options {
  organizationId: string;
  /** Опрашивать, пока статус `pending`. */
  enabled: boolean;
  onUpdate: (organization: OrganizationListItem) => void;
  /** 404: организацию удалили (например, в другой вкладке). */
  onGone: () => void;
}

/**
 * Опрос `getOrganization` раз в 3 секунды, не больше 40 попыток.
 * Пока вкладка скрыта, запросы не идут и попытки не считаются.
 */
export function useRegistryStatusPolling({ organizationId, enabled, onUpdate, onGone }: Options) {
  const router = useRouter();
  const [stalled, setStalled] = useState(false);
  const [run, setRun] = useState(0);

  const handleUpdate = useEffectEvent(onUpdate);
  const handleGone = useEffectEvent(onGone);

  useEffect(() => {
    if (!enabled || stalled) return;

    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;

    const schedule = () => {
      timer = setTimeout(tick, POLL_INTERVAL_MS);
    };

    async function tick() {
      if (document.hidden) {
        schedule();
        return;
      }
      attempts += 1;
      try {
        const organization = await getOrganization(organizationId, {
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        handleUpdate(organization);
        if (organization.registry_status !== "pending") return;
      } catch (error) {
        if (controller.signal.aborted) return;
        if (isApiError(error) && error.status === 404) {
          handleGone();
          return;
        }
        if (isApiError(error) && error.status === 401) {
          router.replace(ORGANIZATIONS_LOGIN_PATH);
          return;
        }
        // Сбой сети или 5xx: попытка засчитана, пробуем дальше.
      }
      if (attempts >= MAX_ATTEMPTS) {
        setStalled(true);
        return;
      }
      schedule();
    }

    // «Проверить снова» спрашивает сразу, обычный запуск ждёт интервал.
    if (run > 0) void tick();
    else schedule();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [organizationId, enabled, stalled, run, router]);

  const restart = () => {
    setStalled(false);
    setRun((value) => value + 1);
  };

  return { stalled: enabled && stalled, restart };
}
