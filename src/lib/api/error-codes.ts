/** Коды бизнес-ошибок из OpenAPI. В `schema.d.ts` их нет: ответы ошибок там `unknown`. */
export const ERROR_CODES = {
  accountAlreadyExists: "account_already_exists_error",
  compromisedPassword: "compromised_password_error",
  emailRequired: "email_required_error",
  invalidEmailFormat: "invalid_email_format_error",
  passwordRequired: "password_required_error",
  invalidPassword: "invalid_password_error",
  invalidOtpCode: "invalid_otp_code_error",
  otpCooldown: "otp_cooldown_error",
  invalidLoginCredentials: "invalid_login_credentials_error",
} as const;
