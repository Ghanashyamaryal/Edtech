"use client";

import { cn } from "@/lib/utils";

type StatusType = "published" | "draft" | "active" | "inactive" | "success" | "warning" | "error";

interface StatusBadgeProps {
  status: StatusType | boolean;
  publishedLabel?: string;
  draftLabel?: string;
  className?: string;
}

export function StatusBadge({
  status,
  publishedLabel = "Published",
  draftLabel = "Draft",
  className
}: StatusBadgeProps) {
  const isPublished = status === true || status === "published" || status === "active" || status === "success";

  const label = typeof status === "boolean"
    ? (status ? publishedLabel : draftLabel)
    : status === "published" || status === "active" ? publishedLabel
    : status === "draft" || status === "inactive" ? draftLabel
    : status;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        isPublished
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        className
      )}
    >
      {label}
    </span>
  );
}
