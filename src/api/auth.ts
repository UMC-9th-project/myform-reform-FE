import { api } from './axios';
import type { LoginRequest, LoginResponse, LogoutResponse } from '../types/api/auth';


export const loginUser = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    '/api/v1/auth/login/local',  
    data
  );
  return response.data;
};

export const logoutUser = async (): Promise<LogoutResponse> => {
  const response = await api.post<LogoutResponse>('/auth/logout');
  return response.data;
};
