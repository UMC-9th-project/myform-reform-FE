import { api } from './axios';
import type { SignupRequest, SignupResponse, LoginRequest, LoginResponse, LogoutResponse } from '../types/api/auth';


export const signupUser = async (
  data: SignupRequest
): Promise<SignupResponse> => {
  const response = await api.post<SignupResponse>(
    '/auth/signup/local',
    data
  );
  return response.data;
};


export const loginUser = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    '/auth/login/local',  
    data
  );
  return response.data;
};

export const logoutUser = async (): Promise<LogoutResponse> => {
  const response = await api.post<LogoutResponse>('/auth/logout');
  return response.data;
};