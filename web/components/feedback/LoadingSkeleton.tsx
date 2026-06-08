import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  type: "cards" | "table" | "details";
  count?: number;
  columns?: number;
}

export default function LoadingSkeleton({ type, count = 3, columns = 3 }: LoadingSkeletonProps) {
  if (type === "cards") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 h-64 flex flex-col">
            <div className="flex justify-between mb-4">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-8 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-6" />
            <div className="mt-auto flex justify-between">
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="w-full bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl overflow-hidden">
        <div className="h-14 border-b border-black/5 dark:border-white/10 px-6 flex items-center gap-4 bg-gray-50/50 dark:bg-black/20">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16 ml-auto" />
        </div>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-16 border-b border-black/5 dark:border-white/10 px-6 flex items-center gap-4">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <div className="w-1/4 flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-8 rounded-full ml-auto" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-8">
      <Skeleton className="h-10 w-1/3 mb-6" />
      <div className="flex gap-4 mb-8">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-32 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full mb-3" />
      <Skeleton className="h-4 w-full mb-3" />
      <Skeleton className="h-4 w-5/6 mb-8" />
      <div className="grid grid-cols-2 gap-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    </div>
  );
}
