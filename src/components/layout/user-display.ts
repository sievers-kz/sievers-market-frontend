import type { CurrentUser } from "@/lib/api";

/** Буква для аватара: первая буква имени, иначе почты (ФИО может быть `null`). */
export function getAvatarLetter(user: CurrentUser): string {
  const source = user.first_name?.trim() || user.email.trim();
  return source.charAt(0).toUpperCase();
}

/** Строка с именем в меню: «Фамилия Имя», если оба заданы, иначе `null` (показываем только почту). */
export function getDisplayName(user: CurrentUser): string | null {
  const lastName = user.last_name?.trim();
  const firstName = user.first_name?.trim();
  return lastName && firstName ? `${lastName} ${firstName}` : null;
}
