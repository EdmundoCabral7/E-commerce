import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile } from "@/lib/types/auth";

interface UserStore {
  user: UserProfile | null;
  token: string | null;
  orgId: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserProfile, token: string) => void;
  updateUser: (user: UserProfile) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      orgId: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        const orgId = user.memberships?.[0]?.organization?.id ?? null;
        set({ user, token, orgId, isAuthenticated: true });
      },
      updateUser: (user) => {
        const orgId = user.memberships?.[0]?.organization?.id ?? null;
        set({ user, orgId });
      },
      logout: () => set({ user: null, token: null, orgId: null, isAuthenticated: false }),
    }),
    {
      name: "user-storage",
    }
  )
);
