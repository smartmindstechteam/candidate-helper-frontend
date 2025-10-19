import { Supporter } from "../supporter";
import { User } from "../users";

export interface SupporterResponse {
    supporter: Supporter[];
}

export interface SupporterByIdRequest {
 id:string;
}

export interface RegisterSupporterRequest {
  
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