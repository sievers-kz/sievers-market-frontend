import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getPostAuthPath } from "@/components/auth/post-auth-path";
import { RegisterFlow } from "@/components/auth/register-flow";
import { getCurrentUser } from "@/lib/api";

export const metadata: Metadata = { title: "Регистрация" };

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect(getPostAuthPath(user));

  return <RegisterFlow />;
}
