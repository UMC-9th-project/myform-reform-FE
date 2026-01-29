import { api } from './axios';
import type { LoginRequest, LoginResponse } from '../types/api/auth';


export const loginUser = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    '/api/v1/auth/login/local',  
    data
  );
  return response.data;
};
