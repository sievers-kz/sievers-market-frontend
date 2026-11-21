"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { NavigationMenu } from "radix-ui";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

const CATALOG_STUB = [
  { title: "Тракторы", items: ["Колёсные", "Гусеничные", "Мини-тракторы", "Навесное оборудование"] },
  { title: "Комбайны", items: ["Зерноуборочные", "Кормоуборочные", "Жатки", "Подборщики"] },
  { title: "Сеялки", items: ["Зерновые", "Пропашные", "Посевные комплексы", "Сажалки"] },
  { title: "Запчасти", items: ["Двигатель", "Трансмиссия", "Гидравлика", "Шины и диски"] },
] as const;

const SECTION_LINKS = [
  { label: "Организации", href: "/organizations" },
  { label: "О нас", href: "#" },
  { label: "Поддержка", href: "#" },
] as const;

const ITEM_CLASS =
  "inline-flex h-10 items-center whitespace-nowrap gap-1 rounded-md px-2 text-sm font-medium text-foreground outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 data-[state=open]:text-primary";

/**
 * Разделы шапки для `/dev/logo` на Radix NavigationMenu (из уже установленного `radix-ui`).
 * «Каталог» открывает панель на всю ширину шапки: по наведению, по клику и с клавиатуры;
 * закрывается при уходе курсора и по Esc. Категории — заглушки.
 * Родитель (`header`) должен быть `relative`: панель позиционируется относительно него.
 * `viewportClassName` и `panelClassName` меняют вид панели (например, карточка под плавающей шапкой).
 */
export function LogoPreviewNavMenu({
  className,
  viewportWrapperClassName,
  viewportClassName,
  panelClassName,
}: {
  className?: string;
  viewportWrapperClassName?: string;
  viewportClassName?: string;
  panelClassName?: string;
}) {
  return (
    <NavigationMenu.Root aria-label="Разделы" className={cn("justify-center", className)}>
      <NavigationMenu.List className="flex items-center gap-4">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={ITEM_CLASS}>
            Каталог
            <ChevronDown
              aria-hidden
              className="size-4 transition-transform duration-200 in-data-[state=open]:rotate-180"
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <Container className={cn("grid grid-cols-4 gap-8 py-8", panelClassName)}>
              {CATALOG_STUB.map((column) => (
                <div key={column.title}>
                  <NavigationMenu.Link asChild>
                    <Link href="#" className="text-sm font-semibold text-foreground hover:text-primary">
                      {column.title}
                    </Link>
                  </NavigationMenu.Link>
                  <ul className="mt-4 flex flex-col gap-2">
                    {column.items.map((item) => (
                      <li key={item}>
                        <NavigationMenu.Link asChild>
                          <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                            {item}
                          </Link>
                        </NavigationMenu.Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </Container>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        {SECTION_LINKS.map((link) => (
          <NavigationMenu.Item key={link.label}>
            <NavigationMenu.Link asChild>
              <Link href={link.href} className={ITEM_CLASS}>
                {link.label}
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>

      <div className={cn("absolute inset-x-0 top-full z-50", viewportWrapperClassName)}>
        <NavigationMenu.Viewport
          className={cn("w-full border-b bg-background shadow-md", viewportClassName)}
        />
      </div>
    </NavigationMenu.Root>
  );
}
