"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { getCurrentUser, loginUser, showFormError } from "@/lib/api";

import { FormField } from "./form-field";
import { FormMessage } from "./form-message";
import { PasswordInput } from "./password-input";
import { getPostAuthPath } from "./post-auth-path";
import { loginSchema, type LoginValues } from "./schemas";
import { SubmitButton } from "./submit-button";

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", raw_password: "" },
  });

  async function onSubmit(values: LoginValues) {
    try {
      await loginUser(values);
      const user = await getCurrentUser();
      if (!user) throw new Error("Сессия не появилась после входа");
      router.replace(getPostAuthPath(user, next));
      router.refresh();
    } catch (error) {
      showFormError(error, setError);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <FormField id="login-email" label="Email" error={errors.email?.message}>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          {...register("email")}
        />
      </FormField>
      <FormField id="login-password" label="Пароль" error={errors.raw_password?.message}>
        <PasswordInput
          id="login-password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.raw_password)}
          aria-describedby={errors.raw_password ? "login-password-error" : undefined}
          {...register("raw_password")}
        />
      </FormField>
      <Link href="/forgot-password" className="self-end text-sm text-primary hover:underline">
        Забыли пароль?
      </Link>
      <FormMessage message={errors.root?.message} />
      <SubmitButton pending={isSubmitting || isSubmitSuccessful}>Войти</SubmitButton>
      <p className="text-center text-sm text-muted-foreground">
        Нет аккаунта?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Зарегистрироваться
        </Link>
      </p>
    </form>
  );
}
