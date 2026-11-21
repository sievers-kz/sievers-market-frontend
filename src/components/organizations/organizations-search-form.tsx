"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  buildOrganizationsHref,
  ORGANIZATIONS_QUERY_MAX_LENGTH,
  parseOrganizationsQuery,
} from "./search-params";

interface OrganizationsSearchFormProps {
  /** Текущий `q` из URL. Страница передаёт его и как `key`, чтобы поле обновлялось при «назад». */
  initialQuery: string;
}

/**
 * Поиск по названию. Обычная `<form method="get">` (работает и без JS), с JS отправка идёт
 * через `router.push`: пробелы по краям обрезаются, страница сбрасывается на 1.
 * Пустой запрос возвращает полный список, отдельной кнопки сброса нет.
 */
export function OrganizationsSearchForm({ initialQuery }: OrganizationsSearchFormProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = parseOrganizationsQuery(value);
    setValue(q ?? "");
    startTransition(() => {
      router.push(buildOrganizationsHref({ q, page: 1 }));
    });
  }

  return (
    <form
      role="search"
      method="get"
      action="/organizations"
      onSubmit={handleSubmit}
      className="flex gap-2"
    >
      <Input
        type="search"
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        maxLength={ORGANIZATIONS_QUERY_MAX_LENGTH}
        enterKeyHint="search"
        autoComplete="off"
        aria-label="Название организации"
        placeholder="Название организации"
        className="h-12 flex-1"
      />
      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="bg-cta text-cta-foreground hover:bg-cta/90"
      >
        Найти
      </Button>
    </form>
  );
}
