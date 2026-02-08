import { api } from '../axios';
import type { MarketResponse } from '../../types/api/market/market';

export const getMarket = async (): Promise<MarketResponse> => {
    const response = await api.get<MarketResponse>('/market/categories');
    return response.data;
}