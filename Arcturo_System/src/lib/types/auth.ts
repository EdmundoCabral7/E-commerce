export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
}

export interface Membership {
  id: string;
  role: "OWNER" | "ADMIN" | "STAFF";
  organization: Organization;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  bio: string | null;
  isActive: boolean;
  role: "USER" | "ADMIN";
  avatar?: string;
  createdAt: string;
  memberships?: Membership[];
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  name: string;
  password: string;
}
