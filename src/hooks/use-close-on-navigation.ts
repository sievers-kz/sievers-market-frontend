"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Закрывает всплывающее меню при смене маршрута: новый `pathname` или «назад/вперёд»
 * в браузере (`popstate` ловит и смену одного `?subcategory=`). `useSearchParams` здесь
 * не подходит: в шапке он требует `Suspense` и выкидывает кнопку из статического HTML.
 */
export function useCloseOnNavigation(setOpen: (open: boolean) => void) {
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, [setOpen]);
}
