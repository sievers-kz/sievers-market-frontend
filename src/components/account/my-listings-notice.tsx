"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { MY_LISTINGS_TEXT } from "./my-listings-labels";

interface MyListingsNoticeProps {
  text: string;
  /** Ошибка (`role="alert"`) или итог действия (`role="status"`). */
  error?: boolean;
  onClose: () => void;
}

/** Итог действия над объявлением над списком (тостов в проекте нет). */
export function MyListingsNotice({ text, error = false, onClose }: MyListingsNoticeProps) {
  return (
    <div
      role={error ? "alert" : "status"}
      className="flex min-w-0 items-center gap-4 rounded-2xl bg-card py-2 pr-2 pl-4"
    >
      <p className={cn("min-w-0 flex-1 text-sm", error && "text-destructive")}>{text}</p>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={MY_LISTINGS_TEXT.closeNotice}
        onClick={onClose}
        className="text-muted-foreground"
      >
        <X aria-hidden />
      </Button>
    </div>
  );
}
