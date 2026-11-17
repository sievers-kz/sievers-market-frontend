"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  getCurrentUser,
  getOrganizations,
  isApiError,
  type OrganizationListItem,
} from "@/lib/api";

import { ListingCreateFlow, type ListingCreateData } from "./listing-create-flow";
import { ListingCreateSkeleton } from "./listing-create-skeleton";
import { OrganizationRequired } from "./organization-required";

const LOGIN_PATH = `/login?next=${encodeURIComponent("/listings/new")}`;

type Access =
  | { status: "checking" }
  | { status: "redirect" }
  | { status: "error" }
  | {
      status: "ready";
      organizations: OrganizationListItem[];
      /** Решается при загрузке страницы: перечитывание списка не убирает начатую форму. */
      showForm: boolean;
    };

const isUnauthorized = (error: unknown) => isApiError(error) && error.status === 401;

/**
 * Вход и организации проверяются в браузере: здесь работает refresh токена, а сервер
 * с истёкшим access-токеном ошибочно отправил бы вошедшего на /login.
 * Форма показывается, только если есть хотя бы одна `verified` организация.
 */
export function ListingCreateGate(data: ListingCreateData) {
  const router = useRouter();
  const [access, setAccess] = useState<Access>({ status: "checking" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      const user = await getCurrentUser();
      if (!active) return;
      if (user === null) {
        setAccess({ status: "redirect" });
        router.replace(LOGIN_PATH);
        return;
      }
      const organizations = await getOrganizations();
      if (!active) return;
      setAccess({
        status: "ready",
        organizations,
        showForm: organizations.some((item) => item.registry_status === "verified"),
      });
    })().catch((error: unknown) => {
      if (!active) return;
      if (isUnauthorized(error)) {
        setAccess({ status: "redirect" });
        router.replace(LOGIN_PATH);
      } else {
        setAccess({ status: "error" });
      }
    });
    return () => {
      active = false;
    };
  }, [router, attempt]);

  /** Тихое перечитывание после 404/403 при публикации: форма остаётся на месте. */
  const refreshOrganizations = useCallback(() => {
    getOrganizations().then(
      (organizations) =>
        setAccess((prev) => (prev.status === "ready" ? { ...prev, organizations } : prev)),
      (error: unknown) => {
        if (isUnauthorized(error)) {
          setAccess({ status: "redirect" });
          router.replace(LOGIN_PATH);
        }
        // Остальное не мешает: сообщение об ошибке уже в форме, список останется прежним.
      },
    );
  }, [router]);

  if (access.status === "checking" || access.status === "redirect") {
    return <ListingCreateSkeleton />;
  }

  if (access.status === "error") {
    return (
      <div role="alert" className="flex flex-col items-center gap-4 rounded-2xl bg-card p-8 text-center">
        <p>Не удалось загрузить данные. Проверьте подключение и попробуйте ещё раз.</p>
        <Button
          type="button"
          onClick={() => {
            setAccess({ status: "checking" });
            setAttempt((value) => value + 1);
          }}
        >
          Повторить
        </Button>
      </div>
    );
  }

  if (!access.showForm) return <OrganizationRequired organizations={access.organizations} />;

  return (
    <ListingCreateFlow
      {...data}
      organizations={access.organizations}
      onOrganizationsStale={refreshOrganizations}
    />
  );
}
