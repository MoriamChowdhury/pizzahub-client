import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
  );
}

export function OverviewError({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-20 text-center">
      <AlertTriangle className="h-10 w-10 text-primary" />
      <p className="font-semibold">Could not load dashboard data</p>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}