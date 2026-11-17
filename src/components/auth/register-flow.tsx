"use client";

import { useState } from "react";

import { ConfirmCodeForm } from "./confirm-code-form";
import { RegisterForm } from "./register-form";

/** Почта живёт только здесь: после перезагрузки пользователь снова на шаге 1 (backend#202). */
export function RegisterFlow() {
  const [email, setEmail] = useState<string | null>(null);

  return email === null ? (
    <RegisterForm onRegistered={setEmail} />
  ) : (
    <ConfirmCodeForm email={email} />
  );
}
