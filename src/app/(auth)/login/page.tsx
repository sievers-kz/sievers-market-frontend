import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { getLoginReasonMessage } from "@/components/auth/login-reason";
import { getCurrentUser } from "@/lib/api";

export const metadata: Metadata = { title: "Вход" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const user = await getCurrentUser();
  if (user) redirect("/");

  const { next, reason } = await searchParams;
  const reasonMessage = getLoginReasonMessage(reason);

  return (
    <AuthCard
      title="Вход в Sievers Market"
      description="Чтобы связываться с продавцами и размещать объявления"
    >
      {reasonMessage && (
        <p role="status" className="rounded-lg bg-muted px-4 py-2 text-sm text-foreground">
          {reasonMessage}
        </p>
      )}
      <LoginForm next={typeof next === "string" ? next : undefined} />
    </AuthCard>
  );
}
