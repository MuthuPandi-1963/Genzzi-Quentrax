import { UserRole } from "@/@types/enums";

export const PUBLIC_PATHS = [
  "/login",
  "/categories",
  "/topics",
  "/quizzes",
  "/faq",
  "/",
  "/about",
  "/contact",
] as const;

export const ROLE_ROUTES: Record<UserRole, { path: string; label: string }[]> = {
  STUDENT: [
    { path: "/student", label: "Dashboard" },
    { path: "/student/quizzes", label: "Quizzes" },
    { path: "/student/quizzes/:id/take", label: "Quizzes" },
    { path: "/student/topics", label: "Topics" },
    { path: "/student/categories", label: "Categories" },
    { path: "/student/categories/:id", label: "Categories" },

    { path: "/profile", label: "Profile" },
    { path: "/leaderboard", label: "Leaderboard" },
  ],
  STAFF: [
    { path: "/staff", label: "Dashboard" },
    { path: "/quizzes", label: "Quizzes" },
    { path: "/topics", label: "Topics" },
    { path: "/categories", label: "Categories" },
    { path: "/profile", label: "Profile" },
    { path: "/instructor/courses", label: "My Courses" },
    { path: "/instructor/analytics", label: "Analytics" },
  ],
  ADMIN: [
    { path: "/admin", label: "Dashboard" },
    { path: "/admin/users", label: "Users" },
    { path: "/admin/quizzes", label: "Quizzes" },
    { path: "/admin/analytics", label: "Analytics" },
    { path: "/admin/settings", label: "Settings" },
    { path: "/profile", label: "Profile" },
  ],
};

// Route prefix to role mapping
export const ROUTE_ROLE_MAP: Record<string, UserRole[]> = {
  "/student": [UserRole.STUDENT],
  "/staff": [UserRole.STAFF ],
  "/admin": [UserRole.ADMIN, ],
};

export const isPublicPath = (pathname: string): boolean => {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
};

export const getRequiredRoles = (pathname: string): UserRole[] | null => {
  for (const [prefix, roles] of Object.entries(ROUTE_ROLE_MAP)) {
    if (pathname.startsWith(prefix)) return roles;
  }
  return null; // No role restriction
};

export const canAccess = (pathname: string, userRole: UserRole | null): boolean => {
  const required = getRequiredRoles(pathname);
  if (!required) return true; // Public or unrestricted route
  if (!userRole) return false;
  return required.includes(userRole);
};

export const getDefaultRoute = (role: UserRole | null): string => {
  if (!role) return "/login";
  return ROLE_ROUTES[role][0].path;
};