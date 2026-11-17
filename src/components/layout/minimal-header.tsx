import { Container } from "./container";
import { SiteLogo } from "./site-logo";

/** Шапка страниц входа, регистрации и онбординга: только логотип. */
export function MinimalHeader() {
  return (
    <header className="border-b bg-background">
      <Container className="flex h-16 items-center">
        <SiteLogo />
      </Container>
    </header>
  );
}
