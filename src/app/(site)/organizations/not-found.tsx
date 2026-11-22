import Link from "next/link";

import { Container } from "@/components/layout/container";

/** Номер страницы за пределами каталога (`page > pages`). */
export default function OrganizationsNotFound() {
  return (
    <main className="flex-1 bg-muted py-16">
      <Container className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-semibold">Страница не найдена</h1>
        <p className="text-muted-foreground">
          В каталоге организаций нет страницы с таким номером.
        </p>
        <Link href="/organizations" className="font-medium text-primary hover:underline">
          К каталогу организаций
        </Link>
      </Container>
    </main>
  );
}
