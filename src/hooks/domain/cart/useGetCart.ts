import { useQuery } from '@tanstack/react-query';
import { getCart } from '../../../api/cart/cart';
import useAuthStore from '../../../stores/useAuthStore';

export const useGetCart = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  
  return useQuery({
    queryKey: ['cart', accessToken],
    queryFn: getCart,
    enabled: !!accessToken, // 토큰이 있으면 호출 (user는 persist되지 않을 수 있음)
    staleTime: 0, 
    retry: false,
  });
};
