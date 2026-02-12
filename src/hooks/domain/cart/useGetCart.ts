import { useQuery } from '@tanstack/react-query';
import { getCart } from '../../../api/cart/cart';

export const useGetCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    staleTime: 0, 
    retry: false,
  });
};
