import { apiFetch } from "./client";
import type { components, operations } from "./schema";

type Schemas = components["schemas"];

export type OrganizationKind = Schemas["Kind"];
export type RegistryStatus = Schemas["RegistryStatus"];
export type OrganizationListItem = Schemas["OrganizationListResponse"];

type GetOrganizationsResponse =
  operations["getOrganizations"]["responses"][200]["content"]["application/json"];
type GetOrganizationResponse =
  operations["getOrganization"]["responses"][200]["content"]["application/json"];
type CreateOrganizationRequest =
  operations["createOrganization"]["requestBody"]["content"]["application/json"];
type CreateOrganizationResponse =
  operations["createOrganization"]["responses"][201]["content"]["application/json"];

const BASE = "/api/v1/customer";

/** Организации текущего пользователя в порядке добавления. */
export function getOrganizations(): Promise<GetOrganizationsResponse> {
  return apiFetch<GetOrganizationsResponse>(`${BASE}/organizations`, {
    cache: "no-store",
  });
}

/** Полные данные организации; используется для опроса `registry_status`. */
export function getOrganization(
  organizationId: string,
  options: { signal?: AbortSignal } = {},
): Promise<GetOrganizationResponse> {
  return apiFetch<GetOrganizationResponse>(
    `${BASE}/organization/${encodeURIComponent(organizationId)}`,
    { cache: "no-store", signal: options.signal },
  );
}

/** Ответ 201 сразу со статусом `pending`: результат проверки получаем опросом. */
export function createOrganization(
  body: CreateOrganizationRequest,
): Promise<CreateOrganizationResponse> {
  return apiFetch<CreateOrganizationResponse>(`${BASE}/organization`, {
    method: "POST",
    body,
  });
}

/** 204. Только для `pending` и `not_found`, иначе 400 `organization_cannot_be_deleted`. */
export async function deleteOrganization(organizationId: string): Promise<void> {
  await apiFetch<void>(`${BASE}/organization/${encodeURIComponent(organizationId)}`, {
    method: "DELETE",
  });
}
