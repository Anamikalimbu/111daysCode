import { cn } from '../../utils/cn';

export default function Skeleton({ className }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-paper-dim dark:bg-void-raised',
        className
      )}
    />
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-void-line bg-white dark:bg-void-raised">
      <Skeleton className="aspect-[16/9] rounded-none" />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}
