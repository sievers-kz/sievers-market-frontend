import { apiFetch } from "./client";
import type { components, operations } from "./schema";

type GetListingsCatalogQuery =
  operations["getListingsCatalog"]["parameters"]["query"];
type GetListingsCatalogResponse =
  operations["getListingsCatalog"]["responses"][200]["content"]["application/json"];

export function getListingsCatalog(
  query: GetListingsCatalogQuery,
): Promise<GetListingsCatalogResponse> {
  return apiFetch<GetListingsCatalogResponse>("/api/v1/listing/catalog", {
    query,
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
