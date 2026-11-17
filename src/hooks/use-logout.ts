"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { logoutUser } from "@/lib/api";

/**
 * Выход: при любом исходе запроса ведём на `/` гостем.
 * `onLoggedOut` сбрасывает клиентское состояние (layout с шапкой не перемонтируется).
 */
export function useLogout(onLoggedOut: () => void) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      await logoutUser();
    } catch {
      // Сеть или 401: пользователь всё равно уходит гостем, ошибку не показываем.
    }
    onLoggedOut();
    setPending(false);
    router.replace("/");
    router.refresh();
  }

  return { logout, pending };
}
