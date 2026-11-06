"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/api";

import { ListingCreateFlow, type ListingCreateData } from "./listing-create-flow";
import { ListingCreateSkeleton } from "./listing-create-skeleton";

const LOGIN_PATH = `/login?next=${encodeURIComponent("/listings/new")}`;

type Access = "checking" | "vendor" | "customer" | "redirect" | "error";

/**
 * Доступ проверяется в браузере: здесь работает refresh токена, а сервер
 * с истёкшим access-токеном ошибочно отправил бы вошедшего на /login.
 */
export function ListingCreateGate(data: ListingCreateData) {
  const router = useRouter();
  const [access, setAccess] = useState<Access>("checking");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getCurrentUser().then(
      (user) => {
        if (!active) return;
        if (user === null) {
          setAccess("redirect");
          router.replace(LOGIN_PATH);
        } else if (user.role === null) {
          setAccess("redirect");
          router.replace("/onboarding");
        } else {
          setAccess(user.role === "vendor" ? "vendor" : "customer");
        }
      },
      () => {
        if (active) setAccess("error");
      },
    );
    return () => {
      active = false;
    };
  }, [router, attempt]);

  if (access === "checking" || access === "redirect") return <ListingCreateSkeleton />;

  if (access === "error") {
    return (
      <div role="alert" className="flex flex-col items-center gap-4 rounded-2xl bg-card p-8 text-center">
        <p>Не удалось проверить вход. Проверьте подключение и попробуйте ещё раз.</p>
        <Button
          type="button"
          onClick={() => {
            setAccess("checking");
            setAttempt((value) => value + 1);
          }}
        >
          Повторить
        </Button>
      </div>
    );
  }

  if (access === "customer") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-card p-8 text-center">
        <p className="text-lg font-medium">Чтобы подать объявление, станьте продавцом</p>
        <Button asChild>
          <Link href="/">Перейти в каталог</Link>
        </Button>
      </div>
    );
  }

  return <ListingCreateFlow {...data} />;
}
