import { Button } from "@/components/ui/button";

interface BackButtonProps {
  disabled?: boolean;
  onClick: () => void;
}

export function BackButton({ disabled, onClick }: BackButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="lg"
      className="w-full"
      disabled={disabled}
      onClick={onClick}
    >
      Назад
    </Button>
  );
}
