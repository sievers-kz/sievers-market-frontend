import { FileText, Images, type LucideIcon } from "lucide-react";

const HINTS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: FileText,
    title: "Объявление",
    text: "Полностью заполненное объявление улучшает вашу конверсию и привлекает больше клиентов.",
  },
  {
    icon: Images,
    title: "Изображения",
    text: "Вы можете добавить минимум одно и максимум 10 изображений. Старайтесь выбирать качественные изображения. Это привлекает больше покупателей. Первое изображение будет обложкой.",
  },
];

export function ListingHints() {
  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-8">
      {HINTS.map(({ icon: Icon, title, text }) => (
        <section key={title} className="flex gap-4 rounded-2xl bg-card p-6">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Icon className="size-6" aria-hidden />
          </span>
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{text}</p>
          </div>
        </section>
      ))}
    </aside>
  );
}
