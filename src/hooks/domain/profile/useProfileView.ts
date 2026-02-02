import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../../../api/profile/user';

export interface ProfileViewData {
  nickname: string;
  profileImageUrl?: string;
  averageRating: number;
  keywords: string[];
  bio: string;
}

const useProfileView = (ownerId: string) => {
  return useQuery<ProfileViewData>({
    queryKey: ['reformerProfileView', ownerId],
    queryFn: async () => {
      const res = await getProfile(ownerId);

      if (res.resultType !== 'SUCCESS' || !res.success) {
        throw new Error(res.error?.reason || '프로필 조회 실패');
      }

      return {
        nickname: res.success.nickname,
        profileImageUrl: res.success.profilePhoto ?? '',
        averageRating: res.success.avgStar,
        keywords: res.success.keywords,
        bio: res.success.bio,
      };
    },
    enabled: !!ownerId,
  });
};

export default useProfileView;