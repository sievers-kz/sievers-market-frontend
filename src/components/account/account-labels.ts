import type { CurrentUser } from "@/lib/api";

/** Все тексты страницы «Аккаунт»: docs/pages/account.md. */
export const ACCOUNT_TEXT = {
  pageTitle: "Настройки аккаунта",
  pageError: "Не удалось открыть настройки аккаунта",
  loadError: "Не удалось загрузить данные аккаунта. Проверьте подключение и попробуйте ещё раз.",
  retry: "Повторить",
  loading: "Загружаем данные аккаунта",

  personalSection: "Личные данные",
  securitySection: "Вход и безопасность",
  fullname: "ФИО",
  email: "Email",
  password: "Пароль",
  empty: "Не указано",
  edit: "Изменить",
  fill: "Заполнить",

  save: "Сохранить",
  savePending: "Сохраняем…",
  sendCode: "Отправить код",
  sendCodePending: "Отправляем…",
  confirm: "Подтвердить",
  codeLabel: "Код из письма",
  resend: "Отправить код ещё раз",
  resendIn: (seconds: number) => `Отправить код ещё раз через ${seconds} с`,
  resent: "Новый код отправлен",
} as const;

export const FULLNAME_TEXT = {
  lastName: "Фамилия",
  firstName: "Имя",
  patronymic: "Отчество",
  lastNameRequired: "Введите фамилию",
  firstNameRequired: "Введите имя",
  invalid: "Только буквы, пробел и дефис",
} as const;

export const EMAIL_CHANGE_TEXT = {
  newEmail: "Новый email",
  hint: "Отправим код на новый адрес. Почта изменится после ввода кода.",
  required: "Введите email",
  invalid: "Введите корректный email",
  same: "Это ваш текущий адрес",
  taken: "Этот адрес уже используется",
  codeSent: (email: string) => `Мы отправили код на ${email}. Он действует 5 минут.`,
  changeAddress: "Изменить адрес",
  expired: "Код устарел. Запросите новый.",
} as const;

export const PASSWORD_CHANGE_TEXT = {
  current: "Текущий пароль",
  next: "Новый пароль",
  repeat: "Повторите новый пароль",
  hint: "От 8 до 64 символов",
  currentRequired: "Введите текущий пароль",
  mismatch: "Пароли не совпадают",
  /** Свой текст вместо серверного «Введенные вами пароли не совпадают». */
  wrongCurrent: "Неверный текущий пароль",
  codeSent: (email: string) =>
    `Мы отправили код на ${email}. Пароль изменится после ввода кода.`,
  expired: "Код устарел. Начните заново.",
} as const;

/** «Фамилия Имя Отчество» из заданных частей; `null`, если нет ни фамилии, ни имени. */
export function formatFullname(user: CurrentUser): string | null {
  const lastName = user.last_name?.trim();
  const firstName = user.first_name?.trim();
  if (!lastName && !firstName) return null;
  return [lastName, firstName, user.patronymic?.trim()].filter(Boolean).join(" ");
}

/** «Пароль изменён 10 октября», с годом, если он не текущий. Часовой пояс браузера. */
export function formatPasswordChangedAt(value: string, now: Date = new Date()): string {
  const date = new Date(value);
  const withYear = date.getFullYear() !== now.getFullYear();
  const formatted = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    ...(withYear && { year: "numeric" }),
  }).format(date);
  // `ru-RU` с годом добавляет « г.»: в спеке «10 октября 2025».
  return `Пароль изменён ${formatted.replace(/\s?г\.$/, "")}`;
}
