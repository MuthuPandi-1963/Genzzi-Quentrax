import { UserRole } from "@/@types/enums";
import { useAuthContext } from "@/context/auth.context";

export const useRole = () => {
  const { role, isRole, isAuthenticated } = useAuthContext();

  return {
    role,
    isAuthenticated,
    isStudent: isRole(UserRole.STUDENT),
    isStaff: isRole(UserRole.STAFF),
    isAdmin: isRole([UserRole.ADMIN]),
    hasRole: isRole,
  };
};
