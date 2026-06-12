import { UserRole } from "./enums";
import { UserProfile } from "./UserProfile";

export interface AuthUser {
  id: string;
  sub: string;
  email: string | null;
  phone: string | null;
  picture: string | null;
  username: string | null;
  userProfile: UserProfile
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
}

export type AuthState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "authenticated"; user: AuthUser }
  | { status: "unauthenticated" }
  | { status: "error"; error: Error };


export type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "error";

export interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  isLoading: boolean;
  isAuthenticated: boolean;
  isError: boolean;
  error: Error | null;
  role: UserRole | null;
  isRole: (role: UserRole | UserRole[]) => boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}