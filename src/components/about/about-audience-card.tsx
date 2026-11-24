import Link from "next/link";

interface AboutAudienceCardProps {
  title: string;
  text: string;
  /** `null` — ссылки нет (например, каталог недоступен). */
  link: { label: string; href: string } | null;
}

/** Карточка блока «Для кого»: `h3`, абзац и ссылка. */
export function AboutAudienceCard({ title, text, link }: AboutAudienceCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-card p-6 lg:p-8">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-base text-muted-foreground">{text}</p>
      {link && (
        <Link
          href={link.href}
          className="self-start rounded-sm text-base font-medium text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {link.label}
        </Link>
      )}
    </div>
  );
}
