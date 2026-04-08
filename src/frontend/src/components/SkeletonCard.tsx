import React from "react";

export function SkeletonCard() {
  return (
    <div className="card-surface p-5 flex flex-col gap-3">
      <div className="h-5 w-24 rounded-full bg-muted animate-pulse" />
      <div className="h-5 w-full rounded bg-muted animate-pulse" />
      <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
      <div className="h-4 w-full rounded bg-muted animate-pulse" />
      <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
    </div>
  );
}

export function SkeletonCategory() {
  return (
    <div className="card-surface p-5 flex flex-col gap-3">
      <div className="w-12 h-12 rounded-xl bg-muted animate-pulse" />
      <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
      <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
    </div>
  );
}
