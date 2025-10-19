import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type {
  AuthStatusResponse,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
  ProfileResponse,
  UpdateProfileRequest,
} from '@/types/api/auth';
import { User } from '@/types/users';

export function useAuth() {
  const queryClient = useQueryClient();

  // Auth status
  const authStatus = useQuery<AuthStatusResponse>({
    queryKey: ['authStatus'],
    queryFn: async () => {
      const { data } = await api.get<AuthStatusResponse>('/auth');
      return data;
    },
  });

  // Reactive convenience
  const isAuthenticated = authStatus.data?.data?.isAuthenticated || false;
  const user = authStatus.data?.data?.user || null;

  // Login mutation
  const login = useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (credentials) => {
      const { data } = await api.post<LoginResponse>('/auth/login', credentials);
      if (data.token) localStorage.setItem('token', data.token);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey:['authStatus']}),
  });

  // Register mutation
  const register = useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: async (newUser) => {
      const { data } = await api.post<RegisterResponse>('/auth/register', newUser);
      if (data.token) localStorage.setItem('token', data.token);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['authStatus']}),
  });

  // Profile query
  const profile = useQuery<ProfileResponse>({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await api.get<ProfileResponse>('/auth/profile');
      return data;
    },
    enabled: isAuthenticated,
  });

  // Update profile
  const updateProfile = useMutation<User, Error, UpdateProfileRequest>({
    mutationFn: async (updates) => {
      const { data } = await api.put<User>('/auth/profile', updates);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['profile']}),
  });

  // Logout mutation
  const logout = useMutation<void, Error, void>({
    mutationFn: async () => {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['authStatus']
    }),
  });

  return {
    authStatus,
    isAuthenticated,
    user,
    login,
    register,
    profile,
    updateProfile,
    logout,
  };
}
