import { useQuery } from '@tanstack/react-query';
import { getHomeData } from '../../../api/home';
import type { HomeResponse } from '../../../types/api/home';

export const useHome = () => {
  return useQuery<HomeResponse>({
    queryKey: ['home'],
    queryFn: async () => {
      const data = await getHomeData();
      
      if (data.resultType !== 'SUCCESS' || !data.success) {
        throw new Error(data.error?.message || '홈 데이터 조회 실패');
      }
      
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    gcTime: 1000 * 60 * 10, // 10분간 가비지 컬렉션 방지
  });
};
