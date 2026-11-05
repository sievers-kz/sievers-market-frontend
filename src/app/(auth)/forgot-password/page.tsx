import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";

export const metadata: Metadata = { title: "Восстановление пароля" };

export default function ForgotPasswordPage() {
  return (
    <AuthCard title="Восстановление пароля" description="Этот раздел скоро появится.">
      <Link href="/login" className="text-center text-sm text-primary hover:underline">
        Вернуться ко входу
      </Link>
    </AuthCard>
  );
}
