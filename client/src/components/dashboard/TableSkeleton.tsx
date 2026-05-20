import Card from "../common/Card";
import Skeleton from "../common/Skeleton";

function TableSkeleton() {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <div className="flex gap-8">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
      
      <div className="space-y-3 pt-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
            <div className="flex flex-col gap-2 w-1/4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="w-1/6">
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
            <div className="w-1/6">
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="w-1/6">
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="flex gap-2 w-1/6 justify-end">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default TableSkeleton;
