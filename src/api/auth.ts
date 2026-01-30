import { api } from './axios';
import type { LoginRequest, LoginResponse, LogoutResponse } from '../types/api/auth';


export const loginUser = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    '/auth/login/local',  
    data
  );

  const loginData = response.data;
  if (loginData.resultType === 'SUCCESS' && loginData.success?.accessToken) {
    localStorage.setItem('accessToken', loginData.success.accessToken);
  }
  return response.data;
};

export const logoutUser = async (): Promise<LogoutResponse> => {
  const response = await api.post<LogoutResponse>('/auth/logout');
  return response.data;
};
