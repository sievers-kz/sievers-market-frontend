interface SellerCardProps {
  name: string;
}

/** Логотипа в ответе нет: аватар это первая буква имени. */
export function SellerCard({ name }: SellerCardProps) {
  const letter = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <section
      aria-label="Продавец"
      className="flex items-center gap-4 rounded-2xl bg-card p-6"
    >
      <div
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-semibold text-muted-foreground"
        aria-hidden
      >
        {letter}
      </div>
      <div className="flex min-w-0 flex-col">
        <p className="text-sm text-muted-foreground">Продавец</p>
        <p className="truncate font-medium" title={name}>
          {name}
        </p>
      </div>
    </section>
  );
}
