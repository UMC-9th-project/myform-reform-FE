import type { CreateAddressRequest, GetAddressesResponse } from '../../types/domain/mypage/address';
import { api } from '../axios';

export const getAddresses = async (
  page = 1,
  limit = 15,
  createdAtOrder: 'asc' | 'desc' = 'asc'
): Promise<GetAddressesResponse> => {
  const { data } = await api.get<GetAddressesResponse>('/addresses', {
    params: { page, limit, createdAtOrder }
  });
  return data;
};

export const createAddress = async (payload: CreateAddressRequest): Promise<GetAddressesResponse> => {
  const { data } = await api.post<GetAddressesResponse>('/addresses', payload);
  return data;
};