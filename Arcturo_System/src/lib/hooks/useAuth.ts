"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/lib/store/useUserStore";
import { loginAPI, registerAPI, getProfileAPI } from "@/lib/api/auth-service";
import { LoginDto, RegisterDto } from "@/lib/types/auth";

export const useAuth = () => {
  const { user, isAuthenticated, orgId, setAuth, logout, updateUser } = useUserStore();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginDto) => {
      const authData = await loginAPI(data);
      const profile = await getProfileAPI(authData.token);
      return { ...authData, user: profile };
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.setQueryData(["user-profile"], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterDto) => {
      const authData = await registerAPI(data);
      const profile = await getProfileAPI(authData.token);
      return { ...authData, user: profile };
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.setQueryData(["user-profile"], data.user);
    },
  });

  const useProfile = () => {
    return useQuery({
      queryKey: ["user-profile"],
      queryFn: () => getProfileAPI(),
      enabled: isAuthenticated,
    });
  };

  const handleLogout = () => {
    logout();
    queryClient.removeQueries({ queryKey: ["user-profile"] });
    queryClient.removeQueries({ queryKey: ["cart"] });
  };

  return {
    user,
    isAuthenticated,
    orgId,
    setUser: updateUser,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: handleLogout,
    useProfile,
  };
};
