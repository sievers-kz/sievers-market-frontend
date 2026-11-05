import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { getPostAuthPath } from "@/components/auth/post-auth-path";
import { getCurrentUser } from "@/lib/api";

export const metadata: Metadata = { title: "Вход" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const user = await getCurrentUser();
  if (user) redirect(getPostAuthPath(user));

  const { next } = await searchParams;

  return (
    <AuthCard
      title="Вход в Sievers Market"
      description="Чтобы связываться с продавцами и размещать объявления"
    >
      <LoginForm next={typeof next === "string" ? next : undefined} />
    </AuthCard>
  );
}
