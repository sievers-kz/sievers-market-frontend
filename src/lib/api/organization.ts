import { apiFetch } from "./client";
import type { components, operations } from "./schema";

type Schemas = components["schemas"];

export type OrganizationKind = Schemas["Kind"];
export type RegistryStatus = Schemas["RegistryStatus"];
export type OrganizationListItem = Schemas["OrganizationListResponse"];
export type OrganizationDetails = Schemas["OrganizationResponse"];

type GetOrganizationsResponse =
  operations["getOrganizations"]["responses"][200]["content"]["application/json"];
type GetOrganizationResponse =
  operations["getOrganization"]["responses"][200]["content"]["application/json"];
type CreateOrganizationRequest =
  operations["createOrganization"]["requestBody"]["content"]["application/json"];
type CreateOrganizationResponse =
  operations["createOrganization"]["responses"][201]["content"]["application/json"];
type ChangeShopNameRequest =
  operations["changeOrganizationShopName"]["requestBody"]["content"]["application/json"];
type ChangeContactPhoneRequest =
  operations["changeOrganizationContactPhone"]["requestBody"]["content"]["application/json"];
type ChangeContactEmailRequest =
  operations["changeOrganizationContactEmail"]["requestBody"]["content"]["application/json"];

const BASE = "/api/v1/customer";

/** Организации текущего пользователя в порядке добавления. */
export function getOrganizations(): Promise<GetOrganizationsResponse> {
  return apiFetch<GetOrganizationsResponse>(`${BASE}/organizations`, {
    cache: "no-store",
  });
}

/** Полные данные организации: страница организации и опрос `registry_status`. */
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

function organizationPath(organizationId: string, field: string): string {
  return `${BASE}/organization/${encodeURIComponent(organizationId)}/${field}`;
}

/*
 * Правки полей магазина. Ответ 200 без описанной схемы (в OpenAPI `unknown`):
 * тело не используем, после успеха организацию перечитывают `getOrganization`.
 * Менять можно при любом статусе; чужая организация приходит как 404.
 */

/** 422 `invalid_shop_name_error`: 2–50 символов и хотя бы одна буква (только в описании операции). */
export async function changeOrganizationShopName(
  organizationId: string,
  body: ChangeShopNameRequest,
): Promise<void> {
  await apiFetch<unknown>(organizationPath(organizationId, "shop-name"), {
    method: "PATCH",
    body,
  });
}

/** 422 `invalid_phone_format_error`; бэкенд приводит номер к E.164. */
export async function changeOrganizationContactPhone(
  organizationId: string,
  body: ChangeContactPhoneRequest,
): Promise<void> {
  await apiFetch<unknown>(organizationPath(organizationId, "contact-phone"), {
    method: "PATCH",
    body,
  });
}

/** 422 в формате Pydantic `{ detail: [...] }`. */
export async function changeOrganizationContactEmail(
  organizationId: string,
  body: ChangeContactEmailRequest,
): Promise<void> {
  await apiFetch<unknown>(organizationPath(organizationId, "contact-email"), {
    method: "PATCH",
    body,
  });
}
