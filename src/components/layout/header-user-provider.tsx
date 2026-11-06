"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { getCurrentUser, type CurrentUser } from "@/lib/api";

export type HeaderUserState =
  | { status: "loading" }
  | { status: "ready"; user: CurrentUser | null };

interface HeaderUserContextValue {
  state: HeaderUserState;
  /** После выхода: шапка показывает гостя (layout не перемонтируется). */
  showGuest: () => void;
}

const HeaderUserContext = createContext<HeaderUserContextValue | null>(null);

/**
 * Один запрос пользователя на всю шапку: его читают блок пользователя и кнопка
 * «Подать объявление». Сессия читается в браузере, а не на сервере: `cookies()` в layout
 * без Cache Components делает весь маршрут динамическим. Заодно в браузере работает
 * refresh токена, и после истечения access-cookie шапка не показывает гостя.
 */
export function HeaderUserProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HeaderUserState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    getCurrentUser()
      // 401 даёт null; прочие ошибки тоже считаем гостем, чтобы не ломать шапку.
      .catch(() => null)
      .then((user) => {
        if (active) setState({ status: "ready", user });
      });
    return () => {
      active = false;
    };
  }, []);

  const showGuest = () => setState({ status: "ready", user: null });

  return (
    <HeaderUserContext.Provider value={{ state, showGuest }}>
      {children}
    </HeaderUserContext.Provider>
  );
}

export function useHeaderUser(): HeaderUserContextValue {
  const value = useContext(HeaderUserContext);
  if (!value) throw new Error("useHeaderUser вызван вне HeaderUserProvider");
  return value;
}
