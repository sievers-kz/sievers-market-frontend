const BASE = "https://internal.invalid";

/** Адрес из `?next=`, только если это путь на нашем сайте. */
export function safeNextPath(next: string | undefined): string | undefined {
  if (!next?.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return undefined;
  }
  try {
    const url = new URL(next, BASE);
    return url.origin === BASE ? `${url.pathname}${url.search}${url.hash}` : undefined;
  } catch {
    return undefined;
  }
}

/** Куда вести пользователя после входа и подтверждения почты. */
export function getPostAuthPath(next?: string): string {
  return safeNextPath(next) ?? "/";
}
