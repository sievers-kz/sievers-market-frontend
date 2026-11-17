import { MapPin } from "lucide-react";

interface ListingTitleCardProps {
  subcategory: string;
  title: string;
  city: string;
}

export function ListingTitleCard({ subcategory, title, city }: ListingTitleCardProps) {
  return (
    <section className="flex flex-col gap-2 rounded-2xl bg-card p-6">
      <p className="text-sm text-muted-foreground">{subcategory}</p>
      <h1 className="text-2xl font-semibold break-words lg:text-3xl">{title}</h1>
      <p className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
        <MapPin className="size-4 shrink-0" aria-hidden />
        <span className="truncate">{city}</span>
      </p>
    </section>
  );
}
