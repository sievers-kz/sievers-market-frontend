import type { ListingFormValues } from "./listing-schema";

/**
 * Данные превью объявления. Собирается в `ListingCreateFlow`: поля формы плюс фото.
 * Расширяется по мере надобности (описание, характеристики, подкатегория): на его основе
 * позже появится превью страницы объявления.
 */
export interface ListingPreviewData {
  title: string;
  /** `null`, пока цена пустая или невалидная: в превью заглушка. */
  price: number | null;
  currency: ListingFormValues["currency"];
  cityId: string;
  /** Локальный `blob:` первого загруженного фото (обложки). */
  imageUrl: string | null;
}

/** Часть превью, которую сообщает форма (`ListingPreviewWatcher`). */
export type ListingPreviewFields = Omit<ListingPreviewData, "imageUrl">;

export const EMPTY_PREVIEW_FIELDS: ListingPreviewFields = {
  title: "",
  price: null,
  currency: "KZT",
  cityId: "",
};

/** Цена в форме хранится строкой; для превью годится только целое больше 0. */
export function parsePreviewPrice(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const price = Number(trimmed);
  return Number.isSafeInteger(price) && price > 0 ? price : null;
}
