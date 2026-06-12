"use client";

import { useAuthContext } from "@/context/auth.context";

const ROLE_STYLES: Record<string, string> = {
  STUDENT: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  STAFF: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  ADMIN: "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

export const RoleBadge = () => {
  const { role } = useAuthContext();
  if (!role) return null;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${ROLE_STYLES[role] || ROLE_STYLES.STUDENT}`}
    >
      {role.replace("_", " ")}
    </span>
  );
};
