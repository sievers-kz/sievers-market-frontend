import { Container } from "@/components/layout/container";

export default function HomePage() {
  return (
    <main className="flex-1 py-16">
      <Container>
        <h1 className="text-3xl font-semibold text-primary">Sievers Market</h1>
        <p className="mt-2 text-muted-foreground">Скоро здесь будет каталог.</p>
      </Container>
    </main>
  );
}
