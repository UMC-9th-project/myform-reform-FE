import { api } from './axios';
import type { HomeResponse } from '../types/api/home';

export const getHomeData = async (): Promise<HomeResponse> => {
  const response = await api.get<HomeResponse>('/home');
  return response.data;
};
