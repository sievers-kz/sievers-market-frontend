import { apiFetch } from "./client";
import type { operations } from "./schema";

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
