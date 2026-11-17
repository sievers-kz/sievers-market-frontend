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

type GetListingDetailsResponse =
  operations["getListingDetails"]["responses"][200]["content"]["application/json"];

export function getListingDetails(
  listingId: string,
): Promise<GetListingDetailsResponse> {
  return apiFetch<GetListingDetailsResponse>(
    `/api/v1/listing/${encodeURIComponent(listingId)}`,
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
