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

/**
 * В карточке только тег: пояснений текстом нет (docs/pages/organizations.md).
 * `verified` в интерфейсе «Найдена» (docs/pages/organization-detail.md), значение в API прежнее.
 */
export const STATUS_LABELS: Record<RegistryStatus, { badge: string }> = {
  pending: { badge: "Проверяем" },
  verified: { badge: "Найдена" },
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

/** Поля магазина, которые правятся на странице организации (по одному в диалоге). */
export type ShopField = "shop_name" | "contact_phone" | "contact_email";

/** Тексты страницы организации: docs/pages/organization-detail.md. */
export const ORGANIZATION_DETAIL_TEXT = {
  back: "Назад",
  pageTitle: "Организация",
  pageError: "Не удалось открыть организацию",
  loadError: "Не удалось загрузить организацию. Проверьте подключение и попробуйте ещё раз.",
  retry: "Повторить",
  notFoundTitle: "Организация не найдена",
  notFoundAction: "К моим организациям",
  loading: "Загружаем организацию",

  mainSection: "Основная информация",
  shopSection: "Данные магазина",
  legalName: "Полное наименование организации",
  legalAddress: "Юридический адрес",
  /** `legal_*` пока нет (`pending`, `not_found`). */
  afterCheck: "Появится после проверки",
  empty: "Не указано",
  edit: "Изменить",
  fill: "Заполнить",
  /** Добавляется в `aria-label` кнопки у обязательного поля. */
  required: "обязательное",

  notice: {
    pending: "Проверяем организацию в госреестре. Обычно это занимает несколько секунд.",
    not_found:
      "Не нашли организацию в госреестре. Проверьте тип и номер. Если ошиблись, удалите её и добавьте заново.",
    missingFields:
      "Организация найдена. Заполните данные магазина: они нужны, чтобы размещать объявления.",
  },

  save: "Сохранить",
  savePending: "Сохраняем…",
  shopNameInvalid: "От 2 до 50 символов, хотя бы одна буква",
  requiredField: "Заполните поле",
  emailInvalid: "Введите email, например name@company.kz",
  emailTooLong: "Не больше 255 символов",
} as const;

/** Подпись строки и заголовок диалога правки. */
export const SHOP_FIELD_LABELS: Record<ShopField, string> = {
  shop_name: "Название магазина",
  contact_phone: "Контактный телефон",
  contact_email: "Контактный email",
};

/** Порядок строк в карточке «Данные магазина». */
export const SHOP_FIELD_ORDER = [
  "shop_name",
  "contact_phone",
  "contact_email",
] as const satisfies readonly ShopField[];

/** «ИИН 123456789012» / «БИН 123456789012». */
export function formatTaxId(kind: OrganizationKind, taxId: string): string {
  return `${KIND_LABELS[kind].taxId} ${taxId}`;
}
