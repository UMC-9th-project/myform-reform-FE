import { useQuery } from '@tanstack/react-query';
import { getMarket } from '../../../api/market/market';

export const useMarket = () => {
    return useQuery({
        queryKey: ['market'],
        queryFn : () => getMarket(),
        select : (data) => data.success.categories,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    })
}