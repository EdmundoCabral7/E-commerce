import { api } from "./axios";
import { LoginDto, RegisterDto, AuthResponse, UserProfile } from "@/lib/types/auth";

export const loginAPI = async (data: LoginDto): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data.data;
};

export const registerAPI = async (data: RegisterDto): Promise<AuthResponse> => {
  await api.post("/auth/register", data);
  return loginAPI({ email: data.email, password: data.password });
};

export const getProfileAPI = async (token?: string): Promise<UserProfile> => {
  const response = await api.get("/users/profile", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return response.data.data;
};

export interface UpdateProfileDto {
  name?: string;
  phone?: string | null;
  bio?: string | null;
}

export const updateProfileAPI = async (data: UpdateProfileDto): Promise<UserProfile> => {
  const response = await api.patch("/users/profile", data);
  return response.data.data.user ?? response.data.data;
};
