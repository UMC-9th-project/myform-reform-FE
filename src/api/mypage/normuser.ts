import { api } from '../axios';

export interface UpdateMyUserInfoRequest {
  nickname?: string;
  phone?: string;
  email?: string;
  profileImageUrl?: string;
}

export interface UpdateMyUserInfoResponse {
  resultType: 'SUCCESS' | 'FAIL';
  error: string | null;
  success?: {
    nickname: string;
    phone: string;
    email: string;
    profileImageUrl: string;
  };
}

export const updateMyUserInfo = async (payload: UpdateMyUserInfoRequest) => {
  const res = await api.patch<UpdateMyUserInfoResponse>('/users/user/me/profile', payload);
  return res.data;
};
