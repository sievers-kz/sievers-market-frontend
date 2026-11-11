import { z } from "zod";

import type { components } from "@/lib/api/schema";

type Schemas = components["schemas"];
export type AttributeGroup = Schemas["AttributeGroupFieldsResponse"];
export type AttributeField = Schemas["AttributeFieldResponse"];
export type ListingImage = Schemas["ListingImage"];
export type PriceCurrency = Schemas["PriceCurrency"];

export const CURRENCIES = ["KZT", "RUB", "USD", "EUR"] as const satisfies readonly PriceCurrency[];

export const MAX_IMAGES = 10;

/** Значения формы. Числа хранятся строками (как в `<input>`) и превращаются в числа схемой. */
export interface ListingFormValues {
  organization_id: string;
  title: string;
  price: string;
  currency: PriceCurrency;
  city_id: string;
  description: string;
  gallery: ListingImage[];
  attributes: Record<string, string | boolean>;
}

export type AttributeValue = string | number | boolean;

export interface ListingFormOutput {
  organization_id: string;
  title: string;
  price: number;
  currency: PriceCurrency;
  city_id: string;
  description: string | null;
  gallery: ListingImage[];
  /** `undefined` у необязательных пустых полей: такие ключи не отправляем. */
  attributes: Record<string, AttributeValue | undefined>;
}

export interface Option {
  key: string;
  label: string;
}

/** `options` в OpenAPI это произвольные словари; на деле `{ key, label }`. */
export function parseOptions(raw: AttributeField["options"]): Option[] {
  return raw.flatMap((item) =>
    typeof item.key === "string" && typeof item.label === "string"
      ? [{ key: item.key, label: item.label }]
      : [],
  );
}

/** `unit` в OpenAPI это произвольный словарь; на деле `{ key, label }`. */
export function parseUnitLabel(raw: AttributeField["unit"]): string | null {
  return typeof raw?.label === "string" && raw.label ? raw.label : null;
}

export function sortGroups(groups: AttributeGroup[]): AttributeGroup[] {
  return [...groups].sort((a, b) => a.position - b.position);
}

/** Пустое начальное значение поля: чекбокс выключен, остальное пустая строка. */
export function emptyAttributeValues(groups: AttributeGroup[]): Record<string, string | boolean> {
  return Object.fromEntries(
    groups.flatMap((group) =>
      group.fields.map((field) => [field.key, field.type === "boolean" ? false : ""]),
    ),
  );
}

const REQUIRED = "Заполните поле";
const REQUIRED_CHOICE = "Выберите значение";

type AttributeSchema = z.ZodType<AttributeValue | undefined, string | boolean>;

function numberSchema(kind: "integer" | "float", required: boolean): AttributeSchema {
  return z.string().transform((raw, ctx) => {
    const value = raw.trim().replace(",", ".");
    if (value === "") {
      if (!required) return undefined;
      ctx.addIssue({ code: "custom", message: REQUIRED });
      return z.NEVER;
    }
    const pattern = kind === "integer" ? /^-?\d+$/ : /^-?\d+(\.\d+)?$/;
    const number = Number(value);
    if (!pattern.test(value) || !Number.isFinite(number)) {
      ctx.addIssue({
        code: "custom",
        message: kind === "integer" ? "Введите целое число" : "Введите число",
      });
      return z.NEVER;
    }
    if (kind === "integer" && !Number.isSafeInteger(number)) {
      ctx.addIssue({ code: "custom", message: "Слишком большое число" });
      return z.NEVER;
    }
    return number;
  }) as AttributeSchema;
}

function choiceSchema(allowed: readonly string[] | null, required: boolean): AttributeSchema {
  return z.string().transform((value, ctx) => {
    if (value === "") {
      if (!required) return undefined;
      ctx.addIssue({ code: "custom", message: REQUIRED_CHOICE });
      return z.NEVER;
    }
    if (allowed && !allowed.includes(value)) {
      ctx.addIssue({ code: "custom", message: REQUIRED_CHOICE });
      return z.NEVER;
    }
    return value;
  }) as AttributeSchema;
}

function stringSchema(required: boolean): AttributeSchema {
  return z.string().transform((raw, ctx) => {
    const value = raw.trim();
    if (value !== "") return value;
    if (!required) return undefined;
    ctx.addIssue({ code: "custom", message: REQUIRED });
    return z.NEVER;
  }) as AttributeSchema;
}

function attributeSchema(
  field: AttributeField,
  references: Record<string, readonly { id: string }[]>,
): AttributeSchema {
  switch (field.type) {
    case "integer":
    case "float":
      return numberSchema(field.type, field.required);
    case "boolean":
      // Чекбокс всегда даёт значение: отправляем и `false`.
      return z.boolean() as AttributeSchema;
    case "enumerate":
      return choiceSchema(
        parseOptions(field.options).map((option) => option.key),
        field.required,
      );
    case "reference": {
      const items = field.source ? references[field.source] : undefined;
      return choiceSchema(items?.map((item) => item.id) ?? null, field.required);
    }
    case "string":
    default:
      return stringSchema(field.required);
  }
}

const priceSchema = z.string().transform((raw, ctx) => {
  const value = raw.replace(/\s/g, "");
  if (value === "") {
    ctx.addIssue({ code: "custom", message: "Укажите цену" });
    return z.NEVER;
  }
  const number = Number(value);
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(number) || number <= 0) {
    ctx.addIssue({ code: "custom", message: "Цена — целое число больше нуля" });
    return z.NEVER;
  }
  return number;
});

/**
 * Схема по `CreateListingRequest` плюс поля подкатегории.
 * Ограничения цены (> 0) и галереи (1–10) взяты из спецификации экрана: в OpenAPI их нет.
 */
export function buildListingSchema(
  groups: AttributeGroup[],
  references: Record<string, readonly { id: string }[]>,
): z.ZodType<ListingFormOutput, ListingFormValues> {
  const attributes = Object.fromEntries(
    groups.flatMap((group) =>
      group.fields.map((field) => [field.key, attributeSchema(field, references)]),
    ),
  );

  return z.object({
    // Пустая строка (ничего не выбрано) тоже не uuid: одно сообщение на оба случая.
    organization_id: z.uuid("Выберите организацию"),
    title: z.string().trim().min(1, "Введите заголовок"),
    price: priceSchema,
    currency: z.enum(CURRENCIES),
    city_id: z.string().min(1, "Выберите город"),
    description: z
      .string()
      .trim()
      .transform((value) => value || null),
    gallery: z
      .array(
        z.object({
          media_id: z.string(),
          media_type: z.string(),
          media_size: z.number(),
        }),
      )
      .min(1, "Добавьте хотя бы одно фото")
      .max(MAX_IMAGES, `Не больше ${MAX_IMAGES} фото`),
    attributes: z.object(attributes),
  });
}
