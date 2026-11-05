import type { CurrentUser } from "@/lib/api";

export type UserWithRole = Exclude<CurrentUser, { role: null }>;

/** Буква для аватара. `legal_name` не берём: «Товарищество…» даёт бесполезную букву. */
export function getAvatarLetter(user: UserWithRole): string {
  const source =
    user.role === "customer"
      ? user.profile.first_name
      : user.profile.shop_name?.trim() || user.profile.contact_first_name;
  return source.trim().charAt(0).toUpperCase();
}

/** Строка с именем в меню: покупатель «Фамилия Имя», продавец магазин или контактное лицо. */
export function getDisplayName(user: UserWithRole): string {
  if (user.role === "customer") {
    return `${user.profile.last_name} ${user.profile.first_name}`;
  }
  return (
    user.profile.shop_name?.trim() ||
    `${user.profile.contact_last_name} ${user.profile.contact_first_name}`
  );
}
