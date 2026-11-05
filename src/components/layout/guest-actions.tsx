import Link from "next/link";

import { Button } from "@/components/ui/button";

export function GuestActions() {
  return (
    <div className="flex items-center gap-4">
      <Button
        asChild
        variant="outline"
        className="border-primary bg-transparent px-4 md:px-6 text-primary shadow-none hover:bg-accent hover:text-primary"
      >
        <Link href="/login">Войти</Link>
      </Button>
      {/* На телефоне не помещается; регистрация есть на странице входа. */}
      <Button asChild className="hidden px-6 md:inline-flex">
        <Link href="/register">Регистрация</Link>
      </Button>
    </div>
  );
}
