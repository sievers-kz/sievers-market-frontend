"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getOrganizations, isApiError, type OrganizationListItem } from "@/lib/api";

import { AddOrganizationDialog } from "./add-organization-dialog";
import { ORGANIZATIONS_LOGIN_PATH } from "./login-path";
import { OrganizationCard } from "./organization-card";
import { ORGANIZATIONS_TEXT } from "./organization-labels";
import { OrganizationsListSkeleton } from "./organizations-list-skeleton";

type ListState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; items: OrganizationListItem[] };

/**
 * Список читается в браузере: здесь работает refresh токена. Отдельной проверки
 * входа нет: 401 от `getOrganizations` (уже после refresh) отправляет на /login.
 */
export function OrganizationsView() {
  const router = useRouter();
  const [state, setState] = useState<ListState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    let active = true;
    getOrganizations().then(
      (items) => {
        if (active) setState({ status: "ready", items });
      },
      (error: unknown) => {
        if (!active) return;
        if (isApiError(error) && error.status === 401) {
          router.replace(ORGANIZATIONS_LOGIN_PATH);
        } else {
          setState({ status: "error" });
        }
      },
    );
    return () => {
      active = false;
    };
  }, [router, attempt]);

  const updateItems = (change: (items: OrganizationListItem[]) => OrganizationListItem[]) =>
    setState((current) =>
      current.status === "ready" ? { status: "ready", items: change(current.items) } : current,
    );

  const handleUpdate = (organization: OrganizationListItem) =>
    updateItems((items) =>
      items.map((item) => (item.id === organization.id ? organization : item)),
    );

  const handleRemove = (organizationId: string) =>
    updateItems((items) => items.filter((item) => item.id !== organizationId));

  const handleCreated = (organization: OrganizationListItem) =>
    updateItems((items) => [...items, organization]);

  const addButton = (
    <Button
      type="button"
      size="lg"
      disabled={state.status !== "ready"}
      onClick={() => setDialogOpen(true)}
      className="w-full bg-cta text-cta-foreground hover:bg-cta/90 sm:w-auto"
    >
      <Plus aria-hidden />
      {ORGANIZATIONS_TEXT.addButton}
    </Button>
  );

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold lg:text-3xl">{ORGANIZATIONS_TEXT.pageTitle}</h1>
        {addButton}
      </div>

      {state.status === "loading" && <OrganizationsListSkeleton />}

      {state.status === "error" && (
        <div role="alert" className="flex flex-col items-center gap-4 rounded-2xl bg-card p-8 text-center">
          <p>{ORGANIZATIONS_TEXT.listError}</p>
          <Button
            type="button"
            onClick={() => {
              setState({ status: "loading" });
              setAttempt((value) => value + 1);
            }}
          >
            {ORGANIZATIONS_TEXT.retry}
          </Button>
        </div>
      )}

      {state.status === "ready" && state.items.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-card p-8 text-center">
          <p className="max-w-md">{ORGANIZATIONS_TEXT.empty}</p>
          {addButton}
        </div>
      )}

      {state.status === "ready" && state.items.length > 0 && (
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {state.items.map((organization) => (
            <li key={organization.id} className="flex min-w-0 flex-col">
              <OrganizationCard
                organization={organization}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
              />
            </li>
          ))}
        </ul>
      )}

      <AddOrganizationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={handleCreated}
      />
    </>
  );
}
