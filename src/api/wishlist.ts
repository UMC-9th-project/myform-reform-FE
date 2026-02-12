import { api } from './axios';
import type {
  GetWishListResponse,
  WishType,
  CreateWishRequest,
  CreateWishResponse,
  DeleteWishRequest,
  DeleteWishResponse,
} from '../types/api/wishlist/wish';

export const getWishList = async (
  type: WishType
): Promise<GetWishListResponse> => {
  const response = await api.get<GetWishListResponse>('/wish', {
    params: { type },
  });

  return response.data;
};

export const createWish = async (
  data: CreateWishRequest
): Promise<CreateWishResponse> => {
  const response = await api.post<CreateWishResponse>('/wish', data);
  return response.data;
};

export const deleteWish = async (
  data: DeleteWishRequest
): Promise<DeleteWishResponse> => {
  const response = await api.delete<DeleteWishResponse>('/wish', {
    data,
  });
  return response.data;
};
