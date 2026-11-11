import type { OrganizationKind, RegistryStatus } from "@/lib/api";

/**
 * Все тексты экрана «Мои организации». Формулировки рабочие (макета нет),
 * их меняют правкой этого файла: docs/pages/organizations.md.
 */

export const KIND_LABELS: Record<
  OrganizationKind,
  { short: string; taxId: string; option: string }
> = {
  individual: { short: "ИП", taxId: "ИИН", option: "ИП (ИИН)" },
  company: { short: "Юридическое лицо", taxId: "БИН", option: "Юридическое лицо (БИН)" },
};

/** Порядок плиток в форме добавления. */
export const KIND_ORDER = ["individual", "company"] as const satisfies readonly OrganizationKind[];

/** В карточке только тег: пояснений текстом нет (docs/pages/organizations.md). */
export const STATUS_LABELS: Record<RegistryStatus, { badge: string }> = {
  pending: { badge: "Проверяем" },
  verified: { badge: "Подтверждена" },
  not_found: { badge: "Не найдена в реестре" },
};

export const ORGANIZATIONS_TEXT = {
  pageTitle: "Мои организации",
  addButton: "Добавить организацию",
  emptyTitle: "У вас пока нет организаций",
  empty: "Добавьте организацию, чтобы подавать объявления.",
  listError: "Не удалось загрузить организации. Проверьте подключение и попробуйте ещё раз.",
  retry: "Повторить",
  pageError: "Не удалось открыть организации",

  /** Заголовок карточки, пока нет `shop_name` и `legal_name`. */
  fallbackTitle: "Организация",
  actions: "Действия",
  pollAgain: "Проверить снова",

  delete: "Удалить",
  deleteTitle: "Удалить организацию?",
  deleteDescription: "После удаления номер можно добавить заново.",
  deleteCancel: "Отмена",
  deletePending: "Удаляем…",
  deleteVerified: "Подтверждённую организацию удалить нельзя",
  deleteFailed: "Не удалось удалить организацию, попробуйте позже",

  addTitle: "Добавить организацию",
  addDescription: "Укажите тип и номер: проверим организацию в госреестре.",
  kindLegend: "Тип организации",
  kindRequired: "Выберите тип организации",
  taxIdAnyLabel: "ИИН / БИН",
  taxIdInvalid: "Введите 12 цифр",
  alreadyExists: "Организация с таким номером уже добавлена",
  submit: "Добавить",
  submitPending: "Добавляем…",
} as const;

/** «ИИН 123456789012» / «БИН 123456789012». */
export function formatTaxId(kind: OrganizationKind, taxId: string): string {
  return `${KIND_LABELS[kind].taxId} ${taxId}`;
}
