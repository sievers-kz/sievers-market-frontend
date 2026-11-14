import { ApiError } from "./error";

/** Только для сервера. В браузере переменной нет: запросы идут через rewrite из next.config. */
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

const REFRESH_PATH = "/api/v1/iam/refresh";

/** Эти запросы не должны запускать автоматический refresh при 401. */
const NO_REFRESH_PATHS = new Set([
  REFRESH_PATH,
  "/api/v1/iam/login",
  "/api/v1/iam/logout",
]);

type Primitive = string | number | boolean;

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, Primitive | null | undefined>;
  /** Параметры кэша Next.js (только для серверных запросов). */
  next?: { revalidate?: number | false; tags?: string[] };
  cache?: RequestCache;
  signal?: AbortSignal;
  /**
   * Пробрасывать cookie входящего запроса (только сервер, по умолчанию `true`).
   * Для публичных справочников ставь `false`: `cookies()` делает динамической
   * каждую страницу, где вызван запрос, в том числе через общий layout.
   */
  forwardCookies?: boolean;
}

const isServer = typeof window === "undefined";

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  // В браузере тот же origin: cookie сессии живут на домене фронтенда.
  const base = isServer ? BACKEND_URL : window.location.origin;
  const url = new URL(`${base}${path}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

/**
 * На сервере браузерных cookie нет: пробрасываем их из входящего запроса.
 * Импорт динамический, чтобы клиентский бандл не тянул `next/headers`.
 */
async function serverCookieHeader(): Promise<string | undefined> {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  const all = store.getAll();
  return all.length ? all.map((c) => `${c.name}=${c.value}`).join("; ") : undefined;
}

let refreshPromise: Promise<boolean> | null = null;

/** Single-flight: параллельные 401 ждут один и тот же refresh. */
function refreshSession(): Promise<boolean> {
  refreshPromise ??= fetch(buildUrl(REFRESH_PATH), {
    method: "POST",
    headers: { "X-Client-Type": "web" },
    credentials: "include",
  })
    .then((response) => response.ok)
    .catch(() => false)
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
  isRetry = false,
): Promise<T> {
  const headers: Record<string, string> = { "X-Client-Type": "web" };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";

  if (isServer && options.forwardCookies !== false) {
    const cookie = await serverCookieHeader();
    if (cookie) headers.Cookie = cookie;
  }

  const response = await fetch(buildUrl(path, options.query), {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    credentials: "include",
    cache: options.cache,
    next: options.next,
    signal: options.signal,
  });

  // Refresh возможен только в браузере: на сервере нельзя выставить cookie ответа.
  if (
    response.status === 401 &&
    !isServer &&
    !isRetry &&
    !NO_REFRESH_PATHS.has(path) &&
    (await refreshSession())
  ) {
    return apiFetch<T>(path, options, true);
  }

  if (!response.ok) throw await ApiError.fromResponse(response);

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
