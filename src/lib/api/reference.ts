import { apiFetch } from "./client";
import type { operations } from "./schema";

type Json<Op extends keyof operations> =
  operations[Op]["responses"] extends { 200: { content: { "application/json": infer T } } }
    ? T
    : never;

/** Справочники меняются редко: кэшируем на час. */
const REFERENCE_REVALIDATE_SECONDS = 3600;

const options = { next: { revalidate: REFERENCE_REVALIDATE_SECONDS } };

export function getAllCities(): Promise<Json<"getAllCities">> {
  return apiFetch<Json<"getAllCities">>("/api/v1/reference/city/", options);
}

export function getAllBrands(): Promise<Json<"getAllBrands">> {
  return apiFetch<Json<"getAllBrands">>("/api/v1/reference/brand/", options);
}

export function getAllColors(): Promise<Json<"getAllColors">> {
  return apiFetch<Json<"getAllColors">>("/api/v1/reference/color/", options);
}

export function getAllOriginCountries(): Promise<Json<"getAllOriginCountries">> {
  return apiFetch<Json<"getAllOriginCountries">>("/api/v1/reference/country/", options);
}
