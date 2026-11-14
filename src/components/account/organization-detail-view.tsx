"use client";

import { ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { getOrganization, isApiError, type OrganizationDetails } from "@/lib/api";

import { DeleteOrganizationDialog } from "./delete-organization-dialog";
import { EditOrganizationFieldDialog } from "./edit-organization-field-dialog";
import { getLoginPath } from "./login-path";
import { OrganizationActionsMenu } from "./organization-actions-menu";
import { OrganizationDetailSkeleton } from "./organization-detail-skeleton";
import { OrganizationFieldRow } from "./organization-field-row";
import {
  formatTaxId,
  KIND_LABELS,
  ORGANIZATION_DETAIL_TEXT,
  ORGANIZATIONS_TEXT,
  SHOP_FIELD_LABELS,
  SHOP_FIELD_ORDER,
  type ShopField,
} from "./organization-labels";
import { OrganizationNotice } from "./organization-notice";
import { OrganizationStatusBadge } from "./organization-status-badge";
import { useRegistryStatusPolling } from "./use-registry-status-polling";

const T = ORGANIZATION_DETAIL_TEXT;
const LIST_PATH = "/account/organizations";

type PageState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "not_found" }
  | { status: "ready"; organization: OrganizationDetails };

/**
 * Страница организации. Данные читаются в браузере (здесь работает refresh токена):
 * 401 после refresh ведёт на вход, 404 и 422 (кривой id) дают «Организация не найдена».
 */
export function OrganizationDetailView({ organizationId }: { organizationId: string }) {
  const router = useRouter();
  const loginPath = getLoginPath(`${LIST_PATH}/${encodeURIComponent(organizationId)}`);
  const [state, setState] = useState<PageState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const editTriggerRef = useRef<HTMLElement | null>(null);
  const [edit, setEdit] = useState<{ field: ShopField; open: boolean; key: number }>({
    field: "shop_name",
    open: false,
    key: 0,
  });

  useEffect(() => {
    let active = true;
    getOrganization(organizationId).then(
      (organization) => {
        if (active) setState({ status: "ready", organization });
      },
      (error: unknown) => {
        if (!active) return;
        if (isApiError(error) && error.status === 401) router.replace(loginPath);
        else if (isApiError(error) && (error.status === 404 || error.status === 422)) {
          setState({ status: "not_found" });
        } else setState({ status: "error" });
      },
    );
    return () => {
      active = false;
    };
  }, [organizationId, attempt, router, loginPath]);

  const organization = state.status === "ready" ? state.organization : null;
  const status = organization?.registry_status;

  const showOrganization = (next: OrganizationDetails) =>
    setState({ status: "ready", organization: next });
  const showNotFound = () => setState({ status: "not_found" });

  const { stalled, restart } = useRegistryStatusPolling({
    organizationId,
    enabled: status === "pending",
    onUpdate: showOrganization,
    onGone: showNotFound,
    loginPath,
  });

  /** Тихое перечитывание после правки и после 400 на удаление. */
  async function reload() {
    try {
      showOrganization(await getOrganization(organizationId));
    } catch (error) {
      if (isApiError(error) && error.status === 401) router.replace(loginPath);
      else if (isApiError(error) && error.status === 404) showNotFound();
      // Сеть или 5xx: остаются прежние данные.
    }
  }

  function handleSaved(field: ShopField, value: string) {
    // Пока идёт перечитывание, показываем отправленное значение; телефон
    // бэкенд нормализует, а `missing_fields` пересчитает: это придёт с `getOrganization`.
    setState((current) =>
      current.status === "ready"
        ? { status: "ready", organization: { ...current.organization, [field]: value } }
        : current,
    );
    void reload();
  }

  if (state.status === "loading") return <OrganizationDetailSkeleton />;

  if (state.status === "not_found") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-card px-4 py-12 text-center sm:px-8">
        <span className="flex size-16 items-center justify-center rounded-full bg-accent text-primary">
          <Building2 aria-hidden className="size-8" />
        </span>
        <h1 className="text-xl font-semibold">{T.notFoundTitle}</h1>
        <Button asChild size="lg">
          <Link href={LIST_PATH}>{T.notFoundAction}</Link>
        </Button>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <>
        <BackLink />
        <div role="alert" className="flex flex-col items-center gap-4 rounded-2xl bg-card p-8 text-center">
          <p>{T.loadError}</p>
          <Button
            type="button"
            onClick={() => {
              setState({ status: "loading" });
              setAttempt((value) => value + 1);
            }}
          >
            {T.retry}
          </Button>
        </div>
      </>
    );
  }

  const org = state.organization;
  const canDelete = org.registry_status === "pending" || org.registry_status === "not_found";
  const title = org.shop_name || org.legal_name || ORGANIZATIONS_TEXT.fallbackTitle;
  // Юридических данных нет, пока организация не найдена в реестре.
  const legalEmpty = org.registry_status === "verified" ? T.empty : T.afterCheck;

  const openEdit = (field: ShopField, trigger: HTMLElement) => {
    editTriggerRef.current = trigger;
    setEdit((current) => ({ field, open: true, key: current.key + 1 }));
  };

  return (
    <>
      <BackLink />

      <section className="flex flex-col gap-4 rounded-2xl bg-card p-6">
        <div className="flex h-8 items-center justify-between gap-4">
          <OrganizationStatusBadge
            status={org.registry_status}
            checking={org.registry_status === "pending" && !stalled}
          />
          {/* У `verified` меню нет: бэкенд не удаляет найденные организации. */}
          {canDelete ? (
            <OrganizationActionsMenu
              triggerRef={menuTriggerRef}
              onDelete={() => setDeleteOpen(true)}
              onPollAgain={stalled ? restart : undefined}
            />
          ) : (
            <span aria-hidden className="size-8 shrink-0" />
          )}
        </div>
        <div className="flex min-w-0 items-center gap-4">
          <span
            aria-hidden
            className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground"
          >
            <Building2 className="size-6" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <h1 className="truncate text-lg font-semibold">{title}</h1>
            <p className="text-sm text-muted-foreground">{formatTaxId(org.kind, org.tax_id)}</p>
          </div>
        </div>
        {notice && (
          <p role="status" className="text-sm text-destructive">
            {notice}
          </p>
        )}
      </section>

      <OrganizationNotice organization={org} />

      <section aria-labelledby="organization-main" className="flex flex-col rounded-2xl bg-card px-6 pt-6 pb-2">
        <h2 id="organization-main" className="text-base font-semibold">
          {T.mainSection}
        </h2>
        <OrganizationFieldRow label={T.legalName} value={org.legal_name} emptyText={legalEmpty} />
        <OrganizationFieldRow label={KIND_LABELS[org.kind].taxId} value={org.tax_id} />
        <OrganizationFieldRow
          label={T.legalAddress}
          value={org.legal_address}
          emptyText={legalEmpty}
        />
      </section>

      <section aria-labelledby="organization-shop" className="flex flex-col rounded-2xl bg-card px-6 pt-6 pb-2">
        <h2 id="organization-shop" className="text-base font-semibold">
          {T.shopSection}
        </h2>
        {SHOP_FIELD_ORDER.map((field) => (
          <OrganizationFieldRow
            key={field}
            label={SHOP_FIELD_LABELS[field]}
            value={org[field]}
            required
            onEdit={(trigger) => openEdit(field, trigger)}
          />
        ))}
      </section>

      <EditOrganizationFieldDialog
        key={edit.key}
        organizationId={organizationId}
        field={edit.field}
        initialValue={org[edit.field]}
        open={edit.open}
        onOpenChange={(open) => setEdit((current) => ({ ...current, open }))}
        onSaved={handleSaved}
        onNotFound={showNotFound}
        loginPath={loginPath}
        returnFocusRef={editTriggerRef}
      />

      {canDelete && (
        <DeleteOrganizationDialog
          organizationId={organizationId}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onDeleted={() => router.replace(LIST_PATH)}
          onNotFound={showNotFound}
          onCannotDelete={() => {
            setNotice(ORGANIZATIONS_TEXT.deleteVerified);
            void reload();
          }}
          loginPath={loginPath}
          returnFocusRef={menuTriggerRef}
        />
      )}
    </>
  );
}

/** Всегда на список, а не `history.back()`: не зависит от того, откуда пришли. */
function BackLink() {
  return (
    <Link
      href={LIST_PATH}
      className="flex h-10 items-center gap-2 self-start rounded-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <ArrowLeft aria-hidden className="size-4" />
      {T.back}
    </Link>
  );
}
