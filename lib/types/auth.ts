export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  points: number;
  tier: string;
}

export interface LoginRequest {
  phone: string;
  name?: string;
}

export interface LoginResponse {
  user: AuthUser;
  token?: string;
  success: boolean;
  message: string;
}
