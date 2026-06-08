import React from "react";
import { CheckCircle2, XCircle, Clock, Calendar, AlertCircle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
}

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const normStatus = status.toUpperCase();
  
  let config = {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-700 dark:text-gray-300",
    border: "border-gray-200 dark:border-gray-700",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    label: status
  };

  switch (normStatus) {
    case "ACTIVE":
    case "COMPLETED":
      config = {
        bg: "bg-emerald-50 dark:bg-emerald-500/10",
        text: "text-emerald-700 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-500/20",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        label: normStatus
      };
      break;
    case "INACTIVE":
    case "EXPIRED":
    case "EXEMPTED":
      config = {
        bg: "bg-red-50 dark:bg-red-500/10",
        text: "text-red-700 dark:text-red-400",
        border: "border-red-200 dark:border-red-500/20",
        icon: <XCircle className="w-3.5 h-3.5" />,
        label: normStatus
      };
      break;
    case "IN_PROGRESS":
    case "ACTIVE_SESSION":
      config = {
        bg: "bg-blue-50 dark:bg-blue-500/10",
        text: "text-blue-700 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-500/20",
        icon: <Clock className="w-3.5 h-3.5" />,
        label: "IN PROGRESS"
      };
      break;
    case "PENDING":
    case "SCHEDULED":
      config = {
        bg: "bg-amber-50 dark:bg-amber-500/10",
        text: "text-amber-700 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-500/20",
        icon: <Calendar className="w-3.5 h-3.5" />,
        label: normStatus
      };
      break;
    case "DRAFT":
      config = {
        bg: "bg-gray-100 dark:bg-white/10",
        text: "text-gray-700 dark:text-gray-300",
        border: "border-gray-200 dark:border-white/10",
        icon: <AlertCircle className="w-3.5 h-3.5" />,
        label: "DRAFT"
      };
      break;
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-sm gap-1.5",
    lg: "px-3 py-1.5 text-base gap-2",
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}>
      {config.icon}
      {config.label}
    </span>
  );
}
