import { Skeleton } from "@/components/ui/skeleton";

export default function OnboardingLoading() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl bg-card p-6 md:p-8">
      <Skeleton className="mx-auto h-8 w-40" />
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
      <Skeleton className="h-12" />
    </div>
  );
}
