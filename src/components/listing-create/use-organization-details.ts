"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ERROR_CODES, getOrganization, isApiError, type OrganizationDetails } from "@/lib/api";

export type OrganizationDetailsState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; organization: OrganizationDetails };

/** `id`: ответ, пришедший до отмены запроса, не попадёт к другой организации. */
type Loaded = { id: string } & (
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; organization: OrganizationDetails }
);

const IDLE: OrganizationDetailsState = { status: "idle" };
const LOADING: OrganizationDetailsState = { status: "loading" };

/** Правило «чего не хватает» только из `missing_fields`: значения на `null` не проверяем. */
export function missingFieldsOf(state: OrganizationDetailsState): readonly string[] {
  return state.status === "ready" ? (state.organization.missing_fields ?? []) : [];
}

const isNotFound = (error: unknown) =>
  isApiError(error) &&
  (error.status === 404 || error.errorCode === ERROR_CODES.organizationNotFound);

/**
 * Данные выбранной организации для блока в форме объявления
 * (docs/pages/listing-organization-block.md). Прошлый запрос отменяется, устаревший
 * ответ игнорируется, данные между выборами не кэшируются. Пока `missing_fields`
 * непустой, данные тихо перечитываются при возврате на вкладку.
 *
 * `onNotFound` вызывается на 404 (организацию удалили): список перечитывает Flow.
 */
export function useOrganizationDetails(
  organizationId: string,
  onNotFound: () => void,
): { state: OrganizationDetailsState; reload: () => void } {
  // Сброс при смене организации прямо в рендере: старые данные не мелькают ни кадра.
  const [trackedId, setTrackedId] = useState(organizationId);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  if (trackedId !== organizationId) {
    setTrackedId(organizationId);
    setLoaded(null);
  }

  const controllerRef = useRef<AbortController | null>(null);
  const onNotFoundRef = useRef(onNotFound);
  useEffect(() => {
    onNotFoundRef.current = onNotFound;
  }, [onNotFound]);

  /** `quiet`: данные на экране остаются до прихода новых, ошибка их не стирает. */
  const load = useCallback((id: string, quiet: boolean) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    getOrganization(id, { signal: controller.signal }).then(
      (organization) => {
        if (!controller.signal.aborted) setLoaded({ id, status: "ready", organization });
      },
      (error: unknown) => {
        if (controller.signal.aborted) return;
        if (isNotFound(error)) {
          // Отдельного сообщения нет: список перечитается и сбросит выбор.
          onNotFoundRef.current();
          return;
        }
        if (!quiet) setLoaded({ id, status: "error" });
      },
    );
  }, []);

  useEffect(() => {
    if (!organizationId) return;
    load(organizationId, false);
    return () => controllerRef.current?.abort();
  }, [organizationId, load]);

  let state: OrganizationDetailsState = LOADING;
  if (!organizationId) state = IDLE;
  else if (loaded?.id === organizationId) state = loaded;
  const hasMissing = missingFieldsOf(state).length > 0;

  // Пользователь мог заполнить данные в другой вкладке: перечитываем при возврате, без опроса.
  useEffect(() => {
    if (!organizationId || !hasMissing) return;
    const handleVisibility = () => {
      if (document.visibilityState === "visible") load(organizationId, true);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [organizationId, hasMissing, load]);

  const isReady = state.status === "ready";
  /** Из «готово» перечитывает тихо, иначе (после ошибки) со скелетоном. */
  const reload = useCallback(() => {
    if (!organizationId) return;
    if (!isReady) setLoaded({ id: organizationId, status: "loading" });
    load(organizationId, isReady);
  }, [organizationId, isReady, load]);

  return { state, reload };
}
