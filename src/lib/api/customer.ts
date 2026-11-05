import { apiFetch } from "./client";
import type { components } from "./schema";

type Schemas = components["schemas"];

export async function createCustomer(
  body: Schemas["CreateCustomerRequest"],
): Promise<void> {
  await apiFetch<unknown>("/api/v1/customer/", { method: "POST", body });
}
