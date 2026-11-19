/**
 * Форматы карточки продавца: инициалы, показ телефона, ссылка `tel:`.
 */

/** Ведущая форма собственности, которую не берём в инициалы. */
const LEGAL_FORMS = new Set(["ТОО", "ИП", "АО", "ООО", "КХ"]);

/** Слово без кавычек и знаков по краям: `«Олжа` → `Олжа`. */
function bareWord(word: string): string {
  return word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
}

/**
 * Первые буквы двух первых слов, без ведущей формы собственности:
 * «ТОО Олжа Агро» → «ОА», «ИП Иванов» → «И». Если кроме формы ничего нет, берём её.
 */
export function getInitials(name: string): string {
  const words = name.split(/\s+/).map(bareWord).filter(Boolean);
  const rest = words.length > 1 && LEGAL_FORMS.has(words[0].toUpperCase()) ? words.slice(1) : words;
  return rest
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/**
 * Казахстанский номер из 11 цифр (`+77474125224`, `7 747 412-52-24`) → `+7 747 412 52 24`.
 * Остальное (другая длина, другой код, буквы, добавочный) — как пришло.
 */
export function formatPhoneForDisplay(phone: string): string {
  if (/[^\d\s+()-]/.test(phone)) return phone;
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 11 || !digits.startsWith("7")) return phone;
  const match = /^7(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(digits);
  return match ? `+7 ${match[1]} ${match[2]} ${match[3]} ${match[4]}` : phone;
}

/** Исходный номер без пробелов: для «Копировать». */
export function phoneForCopy(phone: string): string {
  return phone.replace(/\s+/g, "");
}

/** Для `tel:` только цифры и ведущий `+`. */
export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits.startsWith("+") ? "+" : ""}${digits.replace(/\+/g, "")}`;
}
