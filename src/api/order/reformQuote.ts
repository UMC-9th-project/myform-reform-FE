import { api } from '@/api/axios';
import type {
  CreateReformQuoteRequest,
  CreateReformQuoteResponse,
} from '../../types/api/order/reformQuote';


export const createReformQuote = async (
  body: CreateReformQuoteRequest
): Promise<CreateReformQuoteResponse> => {
  const { data } = await api.post<CreateReformQuoteResponse>(
    '/reform/quote',
    body
  );
  return data;
};
