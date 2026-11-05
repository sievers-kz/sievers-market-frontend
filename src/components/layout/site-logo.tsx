import Link from "next/link";

/** Текстовый логотип; картинку добавим позже. */
export function SiteLogo() {
  return (
    <Link
      href="/"
      className="shrink-0 text-xl font-bold text-primary md:text-2xl"
    >
      Sievers Market
    </Link>
  );
}
