"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { ListingCardSkeleton } from "@/components/catalog/listing-card-skeleton";
import { Pagination } from "@/components/common/pagination";
import { Button } from "@/components/ui/button";
import {
  activateListing,
  archiveListing,
  deactivateListing,
  deleteListing,
  ERROR_CODES,
  getMyListings,
  getOrganizations,
  isApiError,
  type ListingStatusAction,
  type MyListingCard as MyListingCardData,
  type MyListingsPage,
  type MyListingsStatus,
  type OrganizationListItem,
} from "@/lib/api";
import type { CategoryTree } from "@/lib/api/catalog";
import { cn } from "@/lib/utils";

import { AccountPageHeader } from "./account-page-header";
import { MY_LISTINGS_LOGIN_PATH } from "./login-path";
import { MyListingActionsMenu } from "./my-listing-actions-menu";
import { MyListingCard } from "./my-listing-card";
import { MyListingsFilters, type MyListingsFilterChange } from "./my-listings-filters";
import { MY_LISTING_ACTION_TEXT, MY_LISTINGS_TEXT } from "./my-listings-labels";
import { MyListingsNotice } from "./my-listings-notice";
import {
  buildMyListingsHref,
  hasMyListingsFilters,
  MY_LISTINGS_PATH,
  parseMyListingsParams,
  toMyListingsQuery,
} from "./my-listings-search-params";

const NEW_LISTING_PATH = "/listings/new";

/** Последний пришедший ответ и запрос, к которому он относится. */
type Loaded =
  | { key: string; status: "ready"; data: MyListingsPage; filtered: boolean }
  | { key: string; status: "error" };

type VisibleListing = MyListingCardData & { status: MyListingsStatus };

/** Сообщение над списком; видно только на том URL, где появилось (смена фильтра его прячет). */
type Notice = { text: string; error: boolean; href: string };

const LISTING_ACTIONS: Record<ListingStatusAction, (listingId: string) => Promise<void>> = {
  activate: activateListing,
  deactivate: deactivateListing,
  archive: archiveListing,
  delete: deleteListing,
};

/**
 * В OpenAPI статус карточки шире фильтра (`deleted` тоже есть), хотя бэкенд обещает удалённые
 * не отдавать. Если такие придут, не показываем.
 */
function isVisible(listing: MyListingCardData): listing is VisibleListing {
  return listing.status !== "deleted";
}

function postListingButton(className?: string) {
  return (
    <Button
      asChild
      size="lg"
      className={cn("w-full bg-cta text-cta-foreground hover:bg-cta/90 sm:w-auto", className)}
    >
      <Link href={NEW_LISTING_PATH}>{MY_LISTINGS_TEXT.postListing}</Link>
    </Button>
  );
}

/**
 * Список читается в браузере: здесь работает refresh токена, 401 (уже после refresh) ведёт
 * на вход. Фильтры и страница живут в URL; при смене фильтра старый список остаётся
 * приглушённым до нового ответа, устаревшие ответы отменяются (`AbortController`).
 */
export function MyListingsView({ tree }: { tree: CategoryTree }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useMemo(() => parseMyListingsParams(searchParams), [searchParams]);
  const [attempt, setAttempt] = useState(0);
  const requestKey = `${buildMyListingsHref(params)}#${attempt}`;
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [organizations, setOrganizations] = useState<OrganizationListItem[]>([]);
  /** Объявление, над которым идёт действие; одновременно только одно. */
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  // Организации нужны только для фильтра: при ошибке (кроме 401) в нём только «Все организации».
  useEffect(() => {
    let active = true;
    getOrganizations().then(
      (items) => {
        if (active) setOrganizations(items);
      },
      (error: unknown) => {
        if (active && isApiError(error) && error.status === 401) {
          router.replace(MY_LISTINGS_LOGIN_PATH);
        }
      },
    );
    return () => {
      active = false;
    };
  }, [router]);

  useEffect(() => {
    const controller = new AbortController();
    const href = buildMyListingsHref(params);
    const key = `${href}#${attempt}`;

    getMyListings(toMyListingsQuery(params), controller.signal).then(
      (data) => {
        if (controller.signal.aborted) return;
        setLoaded({ key, status: "ready", data, filtered: hasMyListingsFilters(params) });
      },
      (error: unknown) => {
        if (controller.signal.aborted) return;
        if (isApiError(error)) {
          if (error.status === 401) {
            router.replace(MY_LISTINGS_LOGIN_PATH);
            return;
          }
          // Чужая или удалённая организация в URL: молча убираем параметр.
          if (
            error.status === 404 &&
            error.errorCode === ERROR_CODES.organizationNotFound &&
            params.organizationId
          ) {
            router.replace(buildMyListingsHref({ ...params, organizationId: undefined }), {
              scroll: false,
            });
            return;
          }
          // Кривой параметр: сбрасываем всё (если сбрасывать нечего, это ошибка списка).
          if (error.status === 422 && href !== MY_LISTINGS_PATH) {
            router.replace(MY_LISTINGS_PATH, { scroll: false });
            return;
          }
        }
        setLoaded({ key, status: "error" });
      },
    );

    return () => controller.abort();
  }, [params, attempt, router]);

  const pending = loaded?.key !== requestKey;
  const currentHref = buildMyListingsHref(params);
  const visibleNotice = notice?.href === currentHref ? notice : null;

  const handleFilterChange = (change: MyListingsFilterChange) => {
    setNotice(null);
    router.replace(buildMyListingsHref({ ...params, ...change, page: 1 }), { scroll: false });
  };

  const resetFilters = () => {
    setNotice(null);
    router.replace(MY_LISTINGS_PATH, { scroll: false });
  };

  /**
   * Действие из меню «⋯»: без оптимистичного обновления, после ответа список перечитывается
   * с теми же фильтрами и страницей. Ошибки не бросает, итог показывает сообщением.
   */
  async function runAction(listingId: string, action: ListingStatusAction) {
    if (busyId !== null) return;
    setBusyId(listingId);
    setNotice(null);
    try {
      await LISTING_ACTIONS[action](listingId);
      const text = MY_LISTING_ACTION_TEXT[action].done;
      const lastOnPage =
        action === "delete" &&
        params.page > 1 &&
        loaded?.status === "ready" &&
        loaded.data.items.filter(isVisible).length === 1;
      if (lastOnPage) {
        // Иначе перечитали бы несуществующую страницу и показали «Ничего не найдено».
        const previousHref = buildMyListingsHref({ ...params, page: params.page - 1 });
        setNotice({ text, error: false, href: previousHref });
        router.replace(previousHref, { scroll: false });
      } else {
        setNotice({ text, error: false, href: currentHref });
        setAttempt((value) => value + 1);
      }
    } catch (error) {
      if (isApiError(error) && error.status === 401) {
        router.replace(MY_LISTINGS_LOGIN_PATH);
        return;
      }
      const gone =
        isApiError(error) &&
        ((error.status === 404 && error.errorCode === ERROR_CODES.listingNotFound) ||
          (error.status === 409 && error.errorCode === ERROR_CODES.listingDeleted));
      if (gone) {
        setNotice({ text: MY_LISTINGS_TEXT.listingGone, error: true, href: currentHref });
        setAttempt((value) => value + 1);
      } else {
        setNotice({ text: MY_LISTINGS_TEXT.actionFailed, error: true, href: currentHref });
      }
    } finally {
      setBusyId(null);
    }
  }

  const renderActions = (listing: VisibleListing) => (
    <MyListingActionsMenu
      status={listing.status}
      // Пока идёт действие или перечитывание, остальные меню не открываются.
      disabled={(busyId !== null && busyId !== listing.id) || pending}
      busy={busyId === listing.id}
      onAction={(action) => runAction(listing.id, action)}
    />
  );

  const isEmptyAll =
    loaded?.status === "ready" && loaded.data.total === 0 && !loaded.filtered;

  return (
    <>
      {/* Когда объявлений нет совсем, кнопка стоит в пустом состоянии и в заголовке не дублируется. */}
      <AccountPageHeader
        title={MY_LISTINGS_TEXT.pageTitle}
        action={isEmptyAll ? undefined : postListingButton()}
      />

      {!isEmptyAll && (
        <MyListingsFilters
          params={params}
          organizations={organizations}
          tree={tree}
          onChange={handleFilterChange}
        />
      )}

      {visibleNotice && (
        <MyListingsNotice
          text={visibleNotice.text}
          error={visibleNotice.error}
          onClose={() => setNotice(null)}
        />
      )}

      {(loaded === null || (loaded.status === "error" && pending)) && (
        <div role="status" aria-label={MY_LISTINGS_TEXT.loading} className="flex flex-col gap-4">
          {[0, 1, 2].map((index) => (
            <ListingCardSkeleton key={index} view="list" />
          ))}
        </div>
      )}

      {loaded?.status === "error" && !pending && (
        <div
          role="alert"
          className="flex flex-col items-center gap-4 rounded-2xl bg-card p-8 text-center"
        >
          <p>{MY_LISTINGS_TEXT.listError}</p>
          <Button type="button" onClick={() => setAttempt((value) => value + 1)}>
            {MY_LISTINGS_TEXT.retry}
          </Button>
        </div>
      )}

      {loaded?.status === "ready" && (
        <div
          aria-busy={pending || undefined}
          className={cn("flex flex-col gap-4 transition-opacity", pending && "opacity-60")}
        >
          <MyListingsResults
            data={loaded.data}
            filtered={loaded.filtered}
            onReset={resetFilters}
            hrefFor={(page) => buildMyListingsHref({ ...params, page })}
            current={params.page}
            renderActions={renderActions}
          />
        </div>
      )}
    </>
  );
}

function MyListingsResults({
  data,
  filtered,
  onReset,
  hrefFor,
  current,
  renderActions,
}: {
  data: MyListingsPage;
  filtered: boolean;
  onReset: () => void;
  hrefFor: (page: number) => string;
  current: number;
  renderActions: (listing: VisibleListing) => ReactNode;
}) {
  const items = data.items.filter(isVisible);

  if (data.total === 0 && !filtered) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-card px-4 py-12 text-center sm:px-8">
        <span className="flex size-16 items-center justify-center rounded-full bg-accent text-primary">
          <FileText aria-hidden className="size-8" />
        </span>
        <h2 className="text-xl font-semibold">{MY_LISTINGS_TEXT.emptyTitle}</h2>
        <p className="max-w-md text-muted-foreground">{MY_LISTINGS_TEXT.empty}</p>
        {postListingButton()}
      </div>
    );
  }

  return (
    <>
      {items.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {items.map((listing) => (
            <li key={listing.id} className="flex min-w-0 flex-col">
              <MyListingCard listing={listing} actions={renderActions(listing)} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-card px-4 py-12 text-center sm:px-8">
          <h2 className="text-xl font-semibold">{MY_LISTINGS_TEXT.notFoundTitle}</h2>
          <p className="max-w-md text-muted-foreground">{MY_LISTINGS_TEXT.notFound}</p>
          <Button type="button" variant="outline" onClick={onReset}>
            {MY_LISTINGS_TEXT.resetFilters}
          </Button>
        </div>
      )}
      <Pagination current={current} pages={data.pages} hrefFor={hrefFor} />
    </>
  );
}
