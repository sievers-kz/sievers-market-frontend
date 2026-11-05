/** Ошибка валидации одного поля из стандартного ответа 422 (FastAPI `detail[]`). */
export interface FieldError {
  /** Имя поля (последний элемент `loc`). */
  field: string;
  message: string;
}

interface ValidationDetailItem {
  loc?: Array<string | number>;
  msg?: string;
}

interface ErrorBody {
  error_code?: string;
  message?: string;
  detail?: unknown;
}

/**
 * Единая ошибка API. Бэкенд возвращает три формата:
 *  - бизнес-ошибки: `{ error_code, message }`;
 *  - ошибки без кода: `{ detail: "строка" }`;
 *  - стандартная валидация 422: `{ detail: [{ loc, msg, type }] }`.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly errorCode?: string;
  readonly fieldErrors: FieldError[];

  constructor(
    status: number,
    message: string,
    errorCode?: string,
    fieldErrors: FieldError[] = [],
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorCode = errorCode;
    this.fieldErrors = fieldErrors;
  }

  static async fromResponse(response: Response): Promise<ApiError> {
    const body = ((await response.json().catch(() => null)) ?? {}) as ErrorBody;

    const fieldErrors = Array.isArray(body.detail)
      ? (body.detail as ValidationDetailItem[]).flatMap((item) => {
          const field = item.loc?.at(-1);
          return field === undefined
            ? []
            : [{ field: String(field), message: item.msg || "Проверьте поле" }];
        })
      : [];

    return new ApiError(
      response.status,
      body.message ??
        (typeof body.detail === "string" ? body.detail : "Неизвестная ошибка"),
      body.error_code,
      fieldErrors,
    );
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
