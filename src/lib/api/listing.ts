import { apiFetch } from "./client";
import type { RequestOptions } from "./client";
import type { components, operations } from "./schema";

type GetListingsCatalogQuery =
  operations["getListingsCatalog"]["parameters"]["query"];
type GetListingsCatalogResponse =
  operations["getListingsCatalog"]["responses"][200]["content"]["application/json"];

export function getListingsCatalog(
  query: GetListingsCatalogQuery,
  options?: Pick<RequestOptions, "next" | "forwardCookies">,
): Promise<GetListingsCatalogResponse> {
  return apiFetch<GetListingsCatalogResponse>("/api/v1/listing/catalog", {
    query,
    ...options,
  });
}

export type ListingSearchQuery = components["schemas"]["ListingSearchQuery"];
export type ListingSearchSort = components["schemas"]["ListingSearchSort"];
type SearchListingResponse =
  operations["searchListing"]["responses"][200]["content"]["application/json"];

/**
 * Поиск с фильтрами (Meilisearch). POST, по умолчанию без кэша. Публичный, cookie не нужны.
 * `cacheOptions.revalidate` включает кэш Next на заданное число секунд (главная: свежие объявления).
 * 422: недопустимый ключ атрибута, атрибуты без подкатегории, неверный uuid.
 */
export function searchListing(
  body: ListingSearchQuery,
  cacheOptions?: { revalidate: number },
): Promise<SearchListingResponse> {
  return apiFetch<SearchListingResponse>("/api/v1/listing/search", {
    method: "POST",
    body,
    ...(cacheOptions
      ? { next: { revalidate: cacheOptions.revalidate } }
      : { cache: "no-store" as const }),
    forwardCookies: false,
  });
}

type GetListingDetailsResponse =
  operations["getListingDetails"]["responses"][200]["content"]["application/json"];

export function getListingDetails(
  listingId: string,
): Promise<GetListingDetailsResponse> {
  return apiFetch<GetListingDetailsResponse>(
    `/api/v1/listing/${encodeURIComponent(listingId)}`,
  );
}

type GetListingContactsResponse =
  operations["getListingContacts"]["responses"][200]["content"]["application/json"];

/**
 * Полные телефон и email продавца (кнопка «Показать контакты»). Без входа; в деталке
 * контакты только маской, чтобы их не было в HTML. 404: объявление снято.
 */
export function getListingContacts(listingId: string): Promise<GetListingContactsResponse> {
  return apiFetch<GetListingContactsResponse>(
    `/api/v1/listing/${encodeURIComponent(listingId)}/contacts`,
    { cache: "no-store" },
  );
}

type CreateListingRequest =
  operations["createListing"]["requestBody"]["content"]["application/json"];
type CreateListingResponse =
  operations["createListing"]["responses"][200]["content"]["application/json"];

export function createListing(
  body: CreateListingRequest,
): Promise<CreateListingResponse> {
  return apiFetch<CreateListingResponse>("/api/v1/listing/", {
    method: "POST",
    body,
  });
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Схема ответа `createListing` в OpenAPI пустая (`unknown`), на деле приходит
 * `{ response: "<uuid>" }`. Разбираем узко: только строка-uuid в `response`.
 */
export function getCreatedListingId(response: unknown): string | null {
  if (typeof response !== "object" || response === null || !("response" in response)) {
    return null;
  }
  const id = response.response;
  return typeof id === "string" && UUID_RE.test(id) ? id : null;
}

type Schemas = components["schemas"];

export type ListingSeller = Schemas["ListingSeller"];
export type ListingContacts = Schemas["ListingContactsResponse"];
export type ListingSpecGroup = Schemas["ListingSpecGroup"];
export type ListingSpecItem = Schemas["ListingSpecItem"];
export type MyListingCard = Schemas["MyListingCardResponse"];
export type MyListingsStatus = Schemas["MyListingsStatus"];
export type MyListingsSort = Schemas["MyListingsSort"];
export type MyListingsQuery = NonNullable<operations["getMyListings"]["parameters"]["query"]>;
export type MyListingsPage =
  operations["getMyListings"]["responses"][200]["content"]["application/json"];

/** Объявления всех организаций текущего пользователя (кабинет), из базы, без кэша. */
export function getMyListings(
  query: MyListingsQuery,
  signal?: AbortSignal,
): Promise<MyListingsPage> {
  return apiFetch<MyListingsPage>("/api/v1/listing/my", {
    query,
    cache: "no-store",
    signal,
  });
}

/** Действие над своим объявлением: `PATCH /api/v1/listing/{id}/<action>`, тела нет. */
export type ListingStatusAction = "activate" | "deactivate" | "archive" | "delete";

/**
 * Ответ 200 в OpenAPI пустой (`unknown`, по спеке `{ message }`), тело не читаем: после
 * действия список перечитывается. 404 `listing_not_found_error`, 409 `listing_deleted_error`.
 */
async function changeListingStatus(listingId: string, action: ListingStatusAction): Promise<void> {
  await apiFetch<unknown>(`/api/v1/listing/${encodeURIComponent(listingId)}/${action}`, {
    method: "PATCH",
  });
}

export function activateListing(listingId: string): Promise<void> {
  return changeListingStatus(listingId, "activate");
}

export function deactivateListing(listingId: string): Promise<void> {
  return changeListingStatus(listingId, "deactivate");
}

export function archiveListing(listingId: string): Promise<void> {
  return changeListingStatus(listingId, "archive");
}

/** Мягкое удаление: статус `deleted`, из «Моих объявлений» объявление пропадает. */
export function deleteListing(listingId: string): Promise<void> {
  return changeListingStatus(listingId, "delete");
}
