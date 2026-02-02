import { api } from '../axios';

export const getOrderById = async (orderId: string) => {
    const response = await api.get(`/profile/sales/${orderId}`);
    return response.data;
}