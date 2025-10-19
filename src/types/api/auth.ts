import { User } from "../users";

export interface AuthStatusResponse {
  data:{
    isAuthenticated: boolean;
    user: User | null;
    
  }
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string; // Optional if using Redis cookies
  data: {
    user: User;
  };
}

export interface RegisterResponse {
  token?: string;
  user: User;
}

export interface ProfileResponse {
  user: User;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  password?: string;
}