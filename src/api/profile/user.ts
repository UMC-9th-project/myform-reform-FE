// api/user.ts
import { api } from '../axios';
import type { GetMyReformerInfoResponse, UpdateUserProfileRequest, UpdateUserProfileResponse } from '../../types/domain/mypage/reformerUser';
import type { CheckNicknameResponse } from '../../types/domain/mypage/nickname';
import type { GetMyUserInfoResponse } from '../../types/domain/mypage/reformerUser';
import type { GetProfileResponse } from '../../types/domain/profile/profile';

export const updaterReformerProfile = async (
  data: UpdateUserProfileRequest
): Promise<UpdateUserProfileResponse> => {
  const res = await api.patch<UpdateUserProfileResponse>(
    '/users/reformer/me/profile',
    {
      nickname: data.nickname,
      bio: data.bio,
      keywords: data.keywords,
      profileImageUrl: data.profileImageUrl, // 업로드 후 받은 URL
    },
    {
      headers: {
        'Content-Type': 'application/json', // JSON으로 보내기
      },
    }
  );

  return res.data;
};


export const checkNicknameDuplicate = async (
  nickname: string
): Promise<CheckNicknameResponse> => {
  const res = await api.post<CheckNicknameResponse>(
    '/users/nickname-check',
    null,
    {
      params: { nickname },
    }
  );

  return res.data;
};

export const getMyUserInfo = async (): Promise<GetMyUserInfoResponse> => {
  const res = await api.get<GetMyUserInfoResponse>(
    '/users/me'
  );
  return res.data;
};

export const getMyReformerInfo = async (): Promise<GetMyReformerInfoResponse> => {
  const res = await api.get<GetMyReformerInfoResponse>(
    '/users/me'
  );
  return res.data;
}

export const getProfile = async (
  ownerId: string
): Promise<GetProfileResponse> => {
  const res = await api.get(`/profile/${ownerId}`);
  return res.data;
};