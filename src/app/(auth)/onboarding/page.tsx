import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { getCurrentUser } from "@/lib/api";

export const metadata: Metadata = { title: "Заполнение профиля" };

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/onboarding");
  if (user.role !== null) redirect("/");

  return <OnboardingFlow />;
}
