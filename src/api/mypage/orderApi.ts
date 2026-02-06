// api/orderApi.ts
import { api } from '@/api/axios';

export type OrderType = 'ITEM' | 'REFORM' | 'ALL';

export interface OrderItem {
  orderId: string;
  receiptNumber: string;
  title: string;
  targetId: string;
  status: 'PENDING' | 'COMPLETED' | 'SHIPPED' | string;
  price: number;
  deliveryFee: number;
  totalPrice: string;
  targetType: string;
  quantity: number;
  ownerNickname: string;
  createdAt: string;
  thumbnail: string;
  reviewAvailable: boolean;
  reviewId?: string;
}

export interface GetOrdersResponse {
  orders: OrderItem[];
  nextCursor: string | null;
  hasNext: boolean;
}

interface GetOrdersParams {
  type: OrderType;
  cursor?: string;
  limit?: number;
  order?: 'asc' | 'desc';
  onlyReviewAvailable?: boolean;
}

export const getUserOrders = async ({
  type,
  cursor,
  limit = 20,
  order = 'desc',
  onlyReviewAvailable = false,
}: GetOrdersParams): Promise<GetOrdersResponse> => {
  const params: GetOrdersParams = { type, limit, order, onlyReviewAvailable };
  if (cursor) params.cursor = cursor;

  const { data } = await api.get<{ success: GetOrdersResponse }>('/profile/orders', { params });
  return data.success;
};
