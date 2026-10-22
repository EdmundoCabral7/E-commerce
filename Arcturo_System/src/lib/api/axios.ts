import axios from "axios";

export const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333") + "/api",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const userStorage = localStorage.getItem("user-storage");
    if (userStorage) {
      try {
        const { state } = JSON.parse(userStorage);
        if (state.token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch {}
    }
  }
  return config;
});

export const buildOrgUrl = (path: string) => {
  if (typeof window === "undefined") return path;
  try {
    const userStorage = localStorage.getItem("user-storage");
    if (!userStorage) return path;
    const { state } = JSON.parse(userStorage);
    if (!state.orgId) return path;
    return `/org/${state.orgId}${path}`;
  } catch {
    return path;
  }
};
